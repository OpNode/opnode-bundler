import { ethers, resolveProperties } from 'ethers'
import {
  EstimateUserOpGasResult,
  PackedUserOperation,
  RelayUserOpParam,
  UserOperation,
  UserOperationByHashResponse,
  UserOperationReceipt,
} from '../../types/index.js'
import { ValidationErrors } from '../../validatation/index.js'
import {
  deepHexlify,
  requireCond,
  packUserOp,
  unpackUserOp,
  requireAddressAndFields,
  calcPreVerificationGas,
} from '../../utils/index.js'

import { ProviderService } from '../../provider/index.js'
import { Simulator, StateOverride } from '../../sim/index.js'
import { Logger } from '../../logger/index.js'
import { ValidationService } from '../../validatation/index.js'
import { EventManagerWithListener } from '../../event/index.js'
import { MempoolManageSender } from '../../mempool/index.js'

const HEX_REGEX = /^0x[a-fA-F\d]*$/i

const validateParameters = async (
  userOp1: UserOperation,
  entryPointInput: string,
  entryPointContract: ethers.Contract,
  requireSignature = true,
  requireGasParams = true,
): Promise<void> => {
  requireCond(
    entryPointInput != null,
    'No entryPoint param',
    ValidationErrors.InvalidFields,
  )

  const epAddress = await entryPointContract.getAddress()
  if (entryPointInput?.toString().toLowerCase() !== epAddress.toLowerCase()) {
    throw new Error(
      `The EntryPoint at "${entryPointInput}" is not supported. This bundler uses ${epAddress}`,
    )
  }
  // minimal sanity check: userOp exists, and all members are hex
  requireCond(
    userOp1 != null,
    'No UserOperation param',
    ValidationErrors.InvalidFields,
  )
  const userOp = (await resolveProperties(userOp1)) as any

  const fields = ['sender', 'nonce', 'callData']
  if (requireSignature) {
    fields.push('signature')
  }
  if (requireGasParams) {
    fields.push(
      'preVerificationGas',
      'verificationGasLimit',
      'callGasLimit',
      'maxFeePerGas',
      'maxPriorityFeePerGas',
    )
  }
  fields.forEach((key) => {
    requireCond(
      userOp[key] != null,
      'Missing userOp field: ' + key,
      ValidationErrors.InvalidFields,
      userOp,
    )
    const value: string = userOp[key].toString()
    requireCond(
      value.match(HEX_REGEX) != null,
      `Invalid hex value for property ${key} in UserOp`,
      ValidationErrors.InvalidFields,
      userOp[key],
    )
  })

  requireAddressAndFields(
    userOp,
    'paymaster',
    ['paymasterPostOpGasLimit', 'paymasterVerificationGasLimit'],
    ['paymasterData'],
  )
  requireAddressAndFields(userOp, 'factory', ['factoryData'])
}

export type EthAPI = {
  estimateUserOperationGas(
    userOpInput: Partial<UserOperation>,
    entryPointInput: string,
    stateOverride?: StateOverride,
  ): Promise<EstimateUserOpGasResult>
  sendUserOperation(
    userOp: UserOperation,
    entryPointInput: string,
  ): Promise<string>
  getSupportedEntryPoints(): Promise<string[]>
  getUserOperationReceipt(
    userOpHash: string,
  ): Promise<UserOperationReceipt | null>
  getUserOperationByHash(
    userOpHash: string,
  ): Promise<UserOperationByHashResponse | null>
}

export const createEthAPI = (
  ps: ProviderService,
  sim: Simulator,
  vs: ValidationService,
  eventsManager: EventManagerWithListener,
  mempoolManageSender: MempoolManageSender,
  entryPointContract: ethers.Contract,
): EthAPI => {
  return {
    /*
      Estimate the gas values for a UserOperation. Given UserOperation optionally without gas limits and gas prices, return the needed gas limits. The signature field is ignored by the wallet, so that the operation will not require user’s approval. 
      Still, it might require putting a “semi-valid” signature (e.g. a signature in the right length)
        * gas limits (and prices) parameters are optional, but are used if specified. maxFeePerGas and maxPriorityFeePerGas default to zero, so no payment is required by neither account nor paymaster.
        * Optionally accepts the State Override Set to allow users to modify the state during the gas estimation. This field as well as its behavior is equivalent to the ones defined for eth_call RPC method.
    */
    estimateUserOperationGas: async (
      userOpInput: Partial<UserOperation>,
      entryPointInput: string,
      stateOverride?: StateOverride,
    ): Promise<EstimateUserOpGasResult> => {
      const userOp = {
        // Override gas params to estimate gas defaults
        maxFeePerGas: 0,
        maxPriorityFeePerGas: 0,
        preVerificationGas: 21000,
        callGasLimit: 10e6,
        verificationGasLimit: 10e6,
        ...userOpInput,
      }
      await validateParameters(
        deepHexlify(userOp),
        entryPointInput,
        entryPointContract,
      )
      const epAddress = await entryPointContract.getAddress()

      // Simulate the operation to get the gas limits
      const { preOpGas, validAfter, validUntil } = await sim.simulateHandleOp(
        userOp as UserOperation,
        stateOverride,
      )

      // TODO: Use simulateHandleOp with proxy contract to estimate callGasLimit too
      const callGasLimit = await ps.estimateGas(
        epAddress,
        userOp.sender,
        userOp.callData,
      )

      // Estimate the pre-verification gas
      const chainId = await ps.getChainId()
      userOp.signature = undefined // ignore signature for gas estimation to allow calcPreVerificationGas to use dummy signature
      const preVerificationGas = calcPreVerificationGas(userOp, chainId)
      const verificationGasLimit = preOpGas

      return {
        validAfter,
        validUntil,
        preVerificationGas,
        verificationGasLimit,
        callGasLimit,
      }
    },

    sendUserOperation: async (
      userOp: UserOperation,
      entryPointInput: string,
    ): Promise<string> => {
      Logger.debug('Running checks on userOp')
      await validateParameters(userOp, entryPointInput, entryPointContract)
      const userOpReady = await resolveProperties(userOp)
      const chainId = await ps.getChainId()
      vs.validateInputParameters(userOp, entryPointInput, chainId, true, true)
      const validationResult = await vs.validateUserOp(userOp, true, undefined)

      const userOpHash = await entryPointContract.getUserOpHash(
        packUserOp(userOpReady),
      )
      const relayedOp: RelayUserOpParam = {
        userOp,
        userOpHash,
        prefund: validationResult.returnInfo.prefund,
        referencedContracts: validationResult.referencedContracts,
        senderInfo: validationResult.senderInfo,
        paymasterInfo: validationResult.paymasterInfo,
        factoryInfo: validationResult.factoryInfo,
        aggregatorInfo: validationResult.aggregatorInfo,
      }

      await mempoolManageSender.addUserOp(relayedOp)

      Logger.debug(
        { sender: relayedOp.userOp.sender, userOpHash: userOpHash },
        'UserOp included in mempool...',
      )

      return userOpHash
    },

    getSupportedEntryPoints: async (): Promise<string[]> => {
      const epAddress = await entryPointContract.getAddress()
      return [epAddress]
    },

    getUserOperationReceipt: async (
      userOpHash: string,
    ): Promise<UserOperationReceipt | null> => {
      requireCond(
        userOpHash?.toString()?.match(HEX_REGEX) != null,
        'Missing/invalid userOpHash',
        ValidationErrors.InvalidFields,
      )
      const event = await eventsManager.getUserOperationEvent(userOpHash)
      if (event == null) {
        return null
      }
      const receipt = await event.getTransactionReceipt()
      const logs = eventsManager.filterLogs(event, receipt.logs)
      return {
        userOpHash,
        sender: event.args.sender,
        nonce: event.args.nonce,
        actualGasCost: event.args.actualGasCost,
        actualGasUsed: event.args.actualGasUsed,
        success: event.args.success,
        logs,
        receipt: {
          to: receipt.to,
          from: receipt.from,
          contractAddress: receipt.contractAddress,
          transactionIndex: receipt.index,
          root: receipt.root,
          gasUsed: receipt.gasUsed,
          logsBloom: receipt.logsBloom,
          blockHash: receipt.blockHash,
          transactionHash: receipt.hash,
          logs: receipt.logs,
          blockNumber: receipt.blockNumber,
          confirmations: await receipt.confirmations(),
          cumulativeGasUsed: receipt.cumulativeGasUsed,
          effectiveGasPrice: receipt.gasPrice,
          type: receipt.type,
          status: receipt.status,
        },
      }
    },

    getUserOperationByHash: async (
      userOpHash: string,
    ): Promise<UserOperationByHashResponse | null> => {
      requireCond(
        userOpHash?.toString()?.match(HEX_REGEX) != null,
        'Missing/invalid userOpHash',
        ValidationErrors.InvalidFields,
      )

      // TODO: First check if the userOp is pending in the mempool
      // if so the UserOperation is pending in the bundler’s mempool:
      // MAY return null, or: a full UserOperation, with the addition of the entryPoint field and a null value for blockNumber, blockHash and transactionHash.
      const event = await eventsManager.getUserOperationEvent(userOpHash)
      if (event == null) {
        return null
      }
      const tx = await event.getTransaction()
      const entryPointAddress = await entryPointContract.getAddress()
      if (tx.to !== entryPointAddress) {
        throw new Error('unable to parse transaction')
      }

      const parsed = entryPointContract.interface.parseTransaction(tx)
      const ops: PackedUserOperation[] = parsed?.args.ops
      if (ops == null) {
        throw new Error('failed to parse transaction')
      }

      const op = ops.find(
        (op) =>
          op.sender === event.args?.sender &&
          BigInt(op.nonce) === BigInt(event.args?.nonce),
      )
      if (op == null) {
        throw new Error('unable to find userOp in transaction')
      }

      return deepHexlify({
        userOperation: unpackUserOp(op),
        entryPoint: entryPointContract.address,
        transactionHash: tx.hash,
        blockHash: tx.blockHash ?? '',
        blockNumber: tx.blockNumber ?? 0,
      })
    },
  }
}
