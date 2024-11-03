import { BigNumber, BigNumberish, BytesLike, ethers } from 'ethers'
import {
  hexConcat,
  hexDataLength,
  hexDataSlice,
  hexZeroPad,
  defaultAbiCoder,
  keccak256,
} from 'ethers/lib/utils.js'

import {
  SlotMap,
  StorageMap,
  UserOperation,
  PackedUserOperation,
} from '../types/index.js'

/**
 * Merge all validationStorageMap objects into merged map
 * - entry with "root" (string) is always preferred over entry with slot-map
 * - merge slot entries
 * NOTE: slot values are supposed to be the value before the transaction started.
 * so same address/slot in different validations should carry the same value
 *
 * @param mergedStorageMap - merged storage map.
 * @param validationStorageMap - validation storage map.
 * @returns mergedStorageMap
 */
export function mergeStorageMap(
  mergedStorageMap: StorageMap,
  validationStorageMap: StorageMap,
): StorageMap {
  Object.entries(validationStorageMap).forEach(([addr, validationEntry]) => {
    if (typeof validationEntry === 'string') {
      // it's a root. override specific slots, if any
      mergedStorageMap[addr] = validationEntry
    } else if (typeof mergedStorageMap[addr] === 'string') {
      // merged address already contains a root. ignore specific slot values
    } else {
      let slots: SlotMap
      if (mergedStorageMap[addr] == null) {
        slots = mergedStorageMap[addr] = {}
      } else {
        slots = mergedStorageMap[addr] as SlotMap
      }

      Object.entries(validationEntry).forEach(([slot, val]) => {
        slots[slot] = val
      })
    }
  })
  return mergedStorageMap
}

/**
 * Pack a uint256 into 2 uint128.
 *
 * @param high128 - high 128 bits
 * @param low128 - low 128 bits
 * @returns packed uint256.
 */
export function packUint(high128: BigNumberish, low128: BigNumberish): string {
  return hexZeroPad(
    BigNumber.from(high128).shl(128).add(low128).toHexString(),
    32,
  )
}

/**
 * Unpack a packed uint.
 *
 * @param packed - packed uint
 * @returns high128, low128
 */
export function unpackUint(
  packed: BytesLike,
): [high128: BigNumber, low128: BigNumber] {
  const packedNumber: BigNumber = BigNumber.from(packed)
  return [
    packedNumber.shr(128),
    packedNumber.and(BigNumber.from(1).shl(128).sub(1)),
  ]
}

/**
 * Pack a paymaster data.
 *
 * @param paymaster - address of the paymaster contract.
 * @param paymasterVerificationGasLimit - gas limit for the paymaster verification.
 * @param postOpGasLimit  - gas limit for the post-operation.
 * @param paymasterData - optional data to be passed to the paymaster contract.
 * @returns packed paymaster data.
 */
export function packPaymasterData(
  paymaster: string,
  paymasterVerificationGasLimit: BigNumberish,
  postOpGasLimit: BigNumberish,
  paymasterData?: BytesLike,
): BytesLike {
  return ethers.utils.hexConcat([
    paymaster,
    packUint(paymasterVerificationGasLimit, postOpGasLimit),
    paymasterData ?? '0x',
  ])
}

/**
 * Unpack a packed paymaster data.
 *
 * @param paymasterAndData - packed paymaster data.
 * @returns paymaster, paymasterVerificationGas, postOpGasLimit, paymasterData
 */
export function unpackPaymasterAndData(paymasterAndData: BytesLike): {
  paymaster: string
  paymasterVerificationGas: BigNumber
  postOpGasLimit: BigNumber
  paymasterData: BytesLike
} | null {
  if (paymasterAndData.length <= 2) return null
  if (hexDataLength(paymasterAndData) < 52) {
    // if length is non-zero, then must at least host paymaster address and gas-limits
    throw new Error(`invalid PaymasterAndData: ${paymasterAndData as string}`)
  }
  const [paymasterVerificationGas, postOpGasLimit] = unpackUint(
    hexDataSlice(paymasterAndData, 20, 52),
  )
  return {
    paymaster: hexDataSlice(paymasterAndData, 0, 20),
    paymasterVerificationGas,
    postOpGasLimit,
    paymasterData: hexDataSlice(paymasterAndData, 52),
  }
}

/**
 * Pack a UserOperation to a PackedUserOperation.
 *
 * @param userOp a UserOperation.
 * @returns a PackedUserOperation.
 */
export function packUserOp(userOp: UserOperation): PackedUserOperation {
  let paymasterAndData: BytesLike
  if (userOp.paymaster == null) {
    paymasterAndData = '0x'
  } else {
    if (
      userOp.paymasterVerificationGasLimit == null ||
      userOp.paymasterPostOpGasLimit == null
    ) {
      throw new Error('paymaster with no gas limits')
    }
    paymasterAndData = packPaymasterData(
      userOp.paymaster,
      userOp.paymasterVerificationGasLimit,
      userOp.paymasterPostOpGasLimit,
      userOp.paymasterData,
    )
  }

  return {
    sender: userOp.sender,
    nonce: userOp.nonce,
    initCode:
      userOp.factory == null
        ? '0x'
        : hexConcat([userOp.factory, userOp.factoryData ?? '']),
    callData: userOp.callData,
    accountGasLimits: packUint(
      userOp.verificationGasLimit,
      userOp.callGasLimit,
    ),
    preVerificationGas: userOp.preVerificationGas,
    gasFees: packUint(userOp.maxPriorityFeePerGas, userOp.maxFeePerGas),
    paymasterAndData,
    signature: userOp.signature,
  }
}

/**
 * Unpack a PackedUserOperation to a UserOperation.
 *
 * @param packedUserOp a PackedUserOperation.
 * @returns a UserOperation.
 */
export function unpackUserOp(packedUserOp: PackedUserOperation): UserOperation {
  const [verificationGasLimit, callGasLimit] = unpackUint(
    packedUserOp.accountGasLimits,
  )
  const [maxPriorityFeePerGas, maxFeePerGas] = unpackUint(packedUserOp.gasFees)

  let ret: UserOperation = {
    sender: packedUserOp.sender,
    nonce: packedUserOp.nonce,
    callData: packedUserOp.callData,
    preVerificationGas: packedUserOp.preVerificationGas,
    verificationGasLimit,
    callGasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
    signature: packedUserOp.signature,
  }
  if (packedUserOp.initCode != null && packedUserOp.initCode.length > 2) {
    const factory = hexDataSlice(packedUserOp.initCode, 0, 20)
    const factoryData = hexDataSlice(packedUserOp.initCode, 20)
    ret = {
      ...ret,
      factory,
      factoryData,
    }
  }
  const pmData = unpackPaymasterAndData(packedUserOp.paymasterAndData)
  if (pmData != null) {
    ret = {
      ...ret,
      paymaster: pmData.paymaster,
      paymasterVerificationGasLimit: pmData.paymasterVerificationGas,
      paymasterPostOpGasLimit: pmData.postOpGasLimit,
      paymasterData: pmData.paymasterData,
    }
  }
  return ret
}

/**
 * Convert an array of UserOperation to an array of PackedUserOperation.
 *
 * @param userOps an array of UserOperation.
 * @returns an array of PackedUserOperation.
 */
export function packUserOps(userOps: UserOperation[]): PackedUserOperation[] {
  return userOps.map(packUserOp)
}

/**
 * abi-encode the userOperation.
 *
 * @param op1 a PackedUserOp or UserOp.
 * @param forSignature "true" if the hash is needed to calculate the getUserOpHash()
 *  "false" to pack entire UserOp, for calculating the calldata cost of putting it on-chain.
 * @returns the abi-encoded userOperation
 */
export function encodeUserOp(
  op1: PackedUserOperation | UserOperation,
  forSignature = true,
): string {
  // if "op" is unpacked UserOperation, then pack it first, before we ABI-encode it.
  let op: PackedUserOperation
  if ('callGasLimit' in op1) {
    op = packUserOp(op1)
  } else {
    op = op1
  }
  if (forSignature) {
    return defaultAbiCoder.encode(
      [
        'address',
        'uint256',
        'bytes32',
        'bytes32',
        'bytes32',
        'uint256',
        'bytes32',
        'bytes32',
      ],
      [
        op.sender,
        op.nonce,
        keccak256(op.initCode),
        keccak256(op.callData),
        op.accountGasLimits,
        op.preVerificationGas,
        op.gasFees,
        keccak256(op.paymasterAndData),
      ],
    )
  } else {
    // for the purpose of calculating gas cost encode also signature (and no keccak of bytes)
    return defaultAbiCoder.encode(
      [
        'address',
        'uint256',
        'bytes',
        'bytes',
        'bytes32',
        'uint256',
        'bytes32',
        'bytes',
        'bytes',
      ],
      [
        op.sender,
        op.nonce,
        op.initCode,
        op.callData,
        op.accountGasLimits,
        op.preVerificationGas,
        op.gasFees,
        op.paymasterAndData,
        op.signature,
      ],
    )
  }
}
