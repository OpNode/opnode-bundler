import { BigNumberish, ethers, Interface, keccak256 } from 'ethers'

import {
  IENTRY_POINT_ABI,
  IPAYMASTER_ABI,
  SENDER_CREATOR_ABI,
  IACCOUNT_ABI,
} from '../abis/index.js'
import {
  StorageMap,
  UserOperation,
  BundlerCollectorReturn,
  TopLevelCallInfo,
} from '../types/index.js'
import {
  ValidationErrors,
  ValidationResult,
  StakeInfo,
} from '../validation/index.js'
import { requireCond, toBytes32, toJsonString } from '../utils/index.js'
import { Logger } from '../logger/index.js'

interface CallEntry {
  to: string
  from: string
  type: string // call opcode
  method: string // parsed method, or signash if unparsed
  revert?: any // parsed output from REVERT
  return?: any // parsed method output.
  value?: BigNumberish
}

const abi = Object.values(
  [...SENDER_CREATOR_ABI, ...IENTRY_POINT_ABI, ...IPAYMASTER_ABI].reduce(
    (set, entry) => {
      const key = `${entry.name}(${entry.inputs?.map((i) => i.type).join(',')})`
      return {
        ...set,
        [key]: entry,
      }
    },
    {},
  ),
) as any

/**
 * parse all call operation in the trace.
 * notes:
 * - entries are ordered by the return (so nested call appears before its outer call
 * - last entry is top-level return from "simulateValidation". it as ret and rettype, but no type or address
 *
 * @param tracerResults the tracer return value.
 * @returns list of call entries
 */
const parseCallStack = (tracerResults: BundlerCollectorReturn): CallEntry[] => {
  const xfaces = new Interface(abi)

  /**
   * Call a function and catch any exception.
   *
   * @param x function to call
   * @param def default value
   * @returns x() or def
   */
  function callCatch<T, T1>(x: () => T, def: T1): T | T1 {
    try {
      return x()
    } catch {
      return def
    }
  }

  const out: CallEntry[] = []
  const stack: any[] = []
  tracerResults.calls
    .filter((x) => !x.type.startsWith('depth'))
    .forEach((c) => {
      if (c.type.match(/REVERT|RETURN/) != null) {
        const top = stack.splice(-1)[0] ?? {
          type: 'top',
          method: 'validateUserOp',
        }
        const returnData: string = (c as any).data
        if (top.type.match(/CREATE/) != null) {
          out.push({
            to: top.to,
            from: top.from,
            type: top.type,
            method: '',
            return: `len=${returnData.length}`,
          })
        } else {
          const method = xfaces.getFunction(top.method) ?? top.method
          if (c.type === 'REVERT') {
            const parsedError = callCatch(
              () => xfaces.parseError(returnData),
              returnData,
            )
            out.push({
              to: top.to,
              from: top.from,
              type: top.type,
              method: method.name ?? method,
              value: top.value,
              revert: parsedError,
            })
          } else {
            const ret = callCatch(
              () => xfaces.decodeFunctionResult(method, returnData),
              returnData,
            )
            out.push({
              to: top.to,
              from: top.from,
              type: top.type,
              value: top.value,
              method: method.name ?? method,
              return: ret,
            })
          }
        }
      } else {
        stack.push(c)
      }
    })

  return out
}

/**
 * Slots associated with each entity.
 * keccak( A || ...) is associated with "A"
 * removed rule: keccak( ... || ASSOC ) (for a previously associated hash) is also associated with "A"
 *
 * @param stakeInfoEntities stake info for (factory, account, paymaster). factory and paymaster can be null.
 * @param keccak array of buffers that were given to keccak in the transaction
 * @returns mapping of entity address to set of slot addresses.
 */
const parseEntitySlots = (
  stakeInfoEntities: { [addr: string]: StakeInfo | undefined },
  keccak: string[],
): { [addr: string]: Set<string> } => {
  // for each entity (sender, factory, paymaster), hold the valid slot addresses
  // valid: the slot was generated by keccak(entity || ...)
  const entitySlots: { [addr: string]: Set<string> } = {}

  keccak.forEach((k) => {
    Object.values(stakeInfoEntities).forEach((info) => {
      const addr = info?.addr?.toLowerCase()
      if (addr == null) return
      const addrPadded = toBytes32(addr)
      if (entitySlots[addr] == null) {
        entitySlots[addr] = new Set<string>()
      }

      const currentEntitySlots = entitySlots[addr]

      if (k.startsWith(addrPadded)) {
        currentEntitySlots.add(keccak256(k))
      }
    })
  })

  return entitySlots
}

// method-signature for calls from entryPoint
const callsFromEntryPointMethodSigs: { [key: string]: string } = {
  factory: new Interface(SENDER_CREATOR_ABI).getFunction('createSender')
    .selector,
  account: new Interface(IACCOUNT_ABI).getFunction('validateUserOp').selector,
  paymaster: new Interface(IPAYMASTER_ABI).getFunction(
    'validatePaymasterUserOp',
  ).selector,
}

// Helper function to find call info for the entry point
const findCallInfoEntryPoint = (
  callStack: CallEntry[],
  entryPointAddress: string,
): CallEntry | undefined => {
  return callStack.find(
    (call) =>
      call.to === entryPointAddress &&
      call.from !== entryPointAddress &&
      call.method !== '0x' &&
      call.method !== 'depositTo',
  )
}

// Helper function to find an illegal non-zero value call
const findIllegalNonZeroValueCall = (
  callStack: CallEntry[],
  entryPointAddress: string,
): CallEntry | undefined => {
  return callStack.find(
    (call) =>
      call.to !== entryPointAddress && !(BigInt(call.value ?? 0) === BigInt(0)),
  )
}

// Helper function to extract addresses from the call stack
const extractAddresses = (
  callsFromEntryPoint: TopLevelCallInfo[],
): string[] => {
  return callsFromEntryPoint.flatMap((level) => Object.keys(level.contractSize))
}

// Helper function to extract storage map from the call stack
const extractStorageMap = (
  callsFromEntryPoint: TopLevelCallInfo[],
): StorageMap => {
  const storageMap: StorageMap = {}

  callsFromEntryPoint.forEach((level) => {
    Object.keys(level.access).forEach((addr) => {
      storageMap[addr] = storageMap[addr] ?? level.access[addr].reads
    })
  })

  return storageMap
}

/**
 * Check if the given entity is staked.
 *
 * @param entStake - the stake info for the entity.
 * @returns true if the entity is staked.
 */
const isStaked = (entStake?: StakeInfo): boolean => {
  return (
    entStake != null &&
    BigInt(1) <= BigInt(entStake.stake) &&
    BigInt(1) <= BigInt(entStake.unstakeDelaySec)
  )
}

/**
 * parse collected simulation traces and revert if they break our rules
 *
 * @param userOp the userOperation that was used in this simulation
 * @param tracerResults the tracer return value
 * @param validationResult output from simulateValidation
 * @param epAddress the entryPoint address that hosted the "simulatedValidation" traced call.
 * @returns list of contract addresses referenced by this UserOp
 */
export const tracerResultParser = (
  userOp: UserOperation,
  tracerResults: BundlerCollectorReturn,
  validationResult: ValidationResult,
  epAddress: string,
): [string[], StorageMap] => {
  Logger.debug('Running tracerResultParser on full validation results')
  const entryPointAddress = epAddress.toLowerCase()

  // banned opcodes from [OP-011]
  const bannedOpCodes = new Set([
    'GASPRICE',
    'GASLIMIT',
    'DIFFICULTY',
    'TIMESTAMP',
    'BASEFEE',
    'BLOCKHASH',
    'NUMBER',
    'ORIGIN',
    'GAS',
    'CREATE',
    'COINBASE',
    'SELFDESTRUCT',
    'RANDOM',
    'PREVRANDAO',
    'INVALID',
  ])

  // opcodes allowed in staked entities [OP-080]
  const opcodesOnlyInStakedEntities = new Set(['BALANCE', 'SELFBALANCE'])

  if (Object.values(tracerResults.callsFromEntryPoint).length < 1) {
    throw new Error('Unexpected traceCall result: no calls from entrypoint.')
  }

  const callStack = parseCallStack(tracerResults)

  // [OP-052], [OP-053]
  const callInfoEntryPoint = findCallInfoEntryPoint(
    callStack,
    entryPointAddress,
  )
  requireCond(
    callInfoEntryPoint == null,
    `illegal call into EntryPoint during validation ${callInfoEntryPoint?.method}`,
    ValidationErrors.OpcodeValidation,
  )

  // [OP-061]
  const illegalNonZeroValueCall = findIllegalNonZeroValueCall(
    callStack,
    entryPointAddress,
  )
  requireCond(
    illegalNonZeroValueCall == null,
    'May not make CALL with value',
    ValidationErrors.OpcodeValidation,
  )

  /*
    Stake info per "number" level (factory, sender, paymaster)
    We only use stake info if we notice a memory reference that require stake
  */
  const sender = userOp.sender.toLowerCase()
  const stakeInfoEntities = {
    factory: validationResult.factoryInfo,
    account: validationResult.senderInfo,
    paymaster: validationResult.paymasterInfo,
  }

  const entitySlots: { [addr: string]: Set<string> } = parseEntitySlots(
    stakeInfoEntities,
    tracerResults.keccak,
  )

  Object.entries(stakeInfoEntities).forEach(([entityTitle, entStakes]) => {
    const entityAddr = (entStakes?.addr ?? '').toLowerCase()
    const currentNumLevel = tracerResults.callsFromEntryPoint.find(
      (info) =>
        info.topLevelMethodSig === callsFromEntryPointMethodSigs[entityTitle],
    )
    if (currentNumLevel == null) {
      if (entityTitle === 'account') {
        throw new Error('missing trace into validateUserOp')
      }
      return
    }

    const { opcodes, access } = currentNumLevel

    // [OP-020]
    requireCond(
      !(currentNumLevel.oog ?? false),
      `${entityTitle} internally reverts on oog`,
      ValidationErrors.OpcodeValidation,
    )

    // opcodes from [OP-011]
    Object.keys(opcodes).forEach((opcode) => {
      requireCond(
        !bannedOpCodes.has(opcode),
        `${entityTitle} uses banned opcode: ${opcode}`,
        ValidationErrors.OpcodeValidation,
      )

      // [OP-080]
      requireCond(
        !opcodesOnlyInStakedEntities.has(opcode) || isStaked(entStakes),
        `unstaked ${entityTitle} uses banned opcode: ${opcode}`,
        ValidationErrors.OpcodeValidation,
      )
    })

    // [OP-031] - Check CREATE2 opcode for factories
    if (entityTitle === 'factory') {
      requireCond(
        (opcodes.CREATE2 ?? 0) <= 1,
        `${entityTitle} with too many CREATE2`,
        ValidationErrors.OpcodeValidation,
      )
    } else {
      requireCond(
        opcodes.CREATE2 == null,
        `${entityTitle} uses banned opcode: CREATE2`,
        ValidationErrors.OpcodeValidation,
      )
    }

    // testing read/write access on contract "addr"
    Object.entries(access).forEach(
      ([addr, { reads, writes, transientReads, transientWrites }]) => {
        if (addr.toLowerCase() === sender.toLowerCase()) {
          // allowed to access sender's storage
          // [STO-010]
          return
        }
        if (addr.toLowerCase() === entryPointAddress.toLowerCase()) {
          // ignore storage access on entryPoint (balance/deposit of entities. we block them on method calls: only allowed to deposit, never to read
          return
        }

        /**
         * Return true if the given slot is associated with the given address, given the known keccak operations.
         *
         * @param slot - the SLOAD/SSTORE slot address we're testing
         * @param addr - the address we try to check for association with
         * @param entitySlots - a mapping we built for keccak values that contained the address
         * @returns true if the slot is associated with the address.
         */
        function associatedWith(
          slot: string,
          addr: string,
          entitySlots: { [addr: string]: Set<string> },
        ): boolean {
          const addrPadded = ethers.zeroPadValue(addr, 32).toLowerCase()
          if (slot === addrPadded) {
            return true
          }
          const k = entitySlots[addr]
          if (k == null) {
            return false
          }
          const slotN = BigInt(slot)
          /*
          scan all slot entries to check of the given slot is within a structure, starting at that offset.
          assume a maximum size on a (static) structure size.
        */
          for (const k1 of k.keys()) {
            const kn = BigInt(k1)
            if (slotN >= kn && slotN < kn + BigInt(128)) {
              return true
            }
          }
          return false
        }

        /*
        [OP-070]: Transient Storage slots defined in EIP-1153 and accessed using `TLOAD` (`0x5c`) and `TSTORE` (`0x5d`) opcodes
        are treated exactly like persistent storage (SLOAD/SSTORE).
        
        scan all slots. find a referenced slot
        at the end of the scan, we will check if the entity has stake, and report that slot if not.
       */
        let requireStakeSlot: string | undefined
        ;[
          ...Object.keys(writes),
          ...Object.keys(reads),
          ...Object.keys(transientWrites ?? {}),
          ...Object.keys(transientReads ?? {}),
        ].forEach((slot) => {
          /*
          slot associated with sender is allowed (e.g. token.balanceOf(sender)
          but during initial UserOp (where there is an initCode), it is allowed only for staked entity
        */
          if (associatedWith(slot, sender, entitySlots)) {
            if (
              userOp.factory != null &&
              userOp.factory !== ethers.ZeroAddress
            ) {
              // special case: account.validateUserOp is allowed to use assoc storage if factory is staked.
              // [STO-022], [STO-021]
              if (
                !(entityAddr === sender && isStaked(stakeInfoEntities.factory))
              ) {
                requireStakeSlot = slot
              }
            }
          } else if (associatedWith(slot, entityAddr, entitySlots)) {
            // [STO-032]
            // accessing a slot associated with entityAddr (e.g. token.balanceOf(paymaster)
            requireStakeSlot = slot
          } else if (addr.toLowerCase() === entityAddr.toLowerCase()) {
            // [STO-031]
            // accessing storage member of entity itself requires stake.
            requireStakeSlot = slot
          } else if (writes[slot] == null && transientWrites[slot] == null) {
            // [STO-033]: staked entity have read-only access to any storage in non-entity contract.
            requireStakeSlot = slot
          } else {
            // accessing arbitrary storage of another contract is not allowed
            const isWrite =
              Object.keys(writes).includes(slot) ||
              Object.keys(transientWrites ?? {}).includes(slot)
            const isTransient =
              Object.keys(transientReads ?? {}).includes(slot) ||
              Object.keys(transientWrites ?? {}).includes(slot)
            const readWrite = isWrite ? 'write to' : 'read from'
            const transientStr = isTransient ? 'transient ' : ''
            requireCond(
              false,
              `${entityTitle} has forbidden ${readWrite} ${transientStr}${nameAddr(
                addr,
                entityTitle,
              )} slot ${slot}`,
              ValidationErrors.OpcodeValidation,
              { [entityTitle]: entStakes?.addr },
            )
          }
        })

        /*
        if addr is current account/paymaster/factory, then return that title
        otherwise, return addr as-is
      */
        /**
         * Return the name of the entity associated with the given address.
         *
         * @param addr - the address we're checking.
         * @param _ - the current entity we're checking.
         * @returns the name of the entity associated with the address.
         */
        function nameAddr(addr: string, _: string): string {
          const [title] =
            Object.entries(stakeInfoEntities).find(
              ([_, info]) => info?.addr.toLowerCase() === addr.toLowerCase(),
            ) ?? []

          return title ?? addr
        }

        requireCondAndStake(
          requireStakeSlot != null,
          entStakes,
          `unstaked ${entityTitle} accessed ${nameAddr(
            addr,
            entityTitle,
          )} slot ${requireStakeSlot}`,
        )
      },
    )

    // helper method: if condition is true, then entity must be staked.
    /**
     *
     * @param cond
     * @param entStake
     * @param failureMessage
     */
    function requireCondAndStake(
      cond: boolean,
      entStake: StakeInfo | undefined,
      failureMessage: string,
    ): void {
      if (!cond) {
        return
      }
      if (entStake == null) {
        throw new Error(
          `internal: ${entityTitle} not in userOp, but has storage accesses in ${toJsonString(access)}`,
        )
      }
      requireCond(
        isStaked(entStake),
        failureMessage,
        ValidationErrors.OpcodeValidation,
        { [entityTitle]: entStakes?.addr },
      )

      // TODO: Check the minimum stake value passed in config rather than defaulting to 1
    }

    // the only contract we allow to access before its deployment is the "sender" itself, which gets created.
    let illegalZeroCodeAccess: any
    for (const addr of Object.keys(currentNumLevel.contractSize)) {
      // [OP-042]
      if (
        addr !== sender &&
        currentNumLevel.contractSize[addr].contractSize <= 2
      ) {
        illegalZeroCodeAccess = currentNumLevel.contractSize[addr]
        illegalZeroCodeAccess.address = addr
        break
      }
    }

    // [OP-041]
    requireCond(
      illegalZeroCodeAccess == null,
      `${entityTitle} accesses un-deployed contract address ${illegalZeroCodeAccess?.address as string} with opcode ${illegalZeroCodeAccess?.opcode as string}`,
      ValidationErrors.OpcodeValidation,
    )

    let illegalEntryPointCodeAccess
    for (const addr of Object.keys(currentNumLevel.extCodeAccessInfo)) {
      if (addr === entryPointAddress) {
        illegalEntryPointCodeAccess = currentNumLevel.extCodeAccessInfo[addr]
        break
      }
    }
    requireCond(
      illegalEntryPointCodeAccess == null,
      `${entityTitle} accesses EntryPoint contract address ${entryPointAddress} with opcode ${illegalEntryPointCodeAccess}`,
      ValidationErrors.OpcodeValidation,
    )
  })

  // get the list of contract addresses and storage map for the user operation
  const addresses = extractAddresses(tracerResults.callsFromEntryPoint)
  const storageMap: StorageMap = extractStorageMap(
    tracerResults.callsFromEntryPoint,
  )

  return [addresses, storageMap]
}
