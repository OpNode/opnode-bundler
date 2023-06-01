import { ethers } from 'ethers'
import { EthAPI, Web3API, DebugAPI} from './services'
import { ProviderService } from '../provider'
import { JsonRpcErrorResponse, JsonRpcRequest, JsonRpcResponse, JsonRpcSuccessResponse } from '../types'
import { Logger } from '../logger'
import { RpcError } from '../utils'

export class RpcMethodHandler {
  private readonly eth: EthAPI
  private readonly debug: DebugAPI
  private readonly web3: Web3API
  private readonly providerService: ProviderService
  private readonly httpApi: string[]

  constructor(
    eth: EthAPI,
    debug: DebugAPI,
    web3: Web3API,
    providerService: ProviderService,
    httpApi: string[]
  ) {
    this.eth = eth
    this.debug = debug
    this.web3 = web3
    this.providerService = providerService
    this.httpApi = httpApi
  }

  public async doHandleRequest(request: JsonRpcRequest): Promise<JsonRpcResponse> {
    try {
      const isValidRpc: boolean | JsonRpcErrorResponse = this.jsonRpcRequestValidator(request)
      if (typeof isValidRpc !== 'boolean') {
        return isValidRpc
      }
    
      const method = request.method
      const params = request.params
      let result: any

      Logger.debug({method: method, param: params}, '>> Handling request')
      switch (method) {
        case 'eth_chainId':
          result = await this.providerService.getChainId()
          break
        case 'eth_supportedEntryPoints':
          result = this.eth.getSupportedEntryPoints()
          break
        case 'eth_sendUserOperation':
          result = await this.eth.sendUserOperation(params[0], params[1])
          break
        case 'eth_estimateUserOperationGas':
          result = true
          break
        case 'eth_getUserOperationReceipt':
          result = await this.eth.getUserOperationReceipt(params[0])
          break
        case 'eth_getUserOperationByHash':
          result = await this.eth.getUserOperationByHash(params[0])
          break
        case 'web3_clientVersion':
          result = this.web3.clientVersion()
          break
        case 'debug_bundler_clearState':
          await this.debug.clearState()
          result = 'ok'
          break
        case 'debug_bundler_dumpMempool':
          result = this.debug.dumpMempool()
          break
        case 'debug_bundler_sendBundleNow':
          result = await this.debug.sendBundleNow()
          break
        case 'debug_bundler_setBundlingMode':
          this.debug.setBundlingMode(params[0])
          result = 'ok'
          break
        case 'debug_bundler_setReputation':
          await this.debug.setReputation(params[0])
          result = 'ok'
          break
        case 'debug_bundler_dumpReputation':
          result = this.debug.dumpReputation()
          break
        default:
          throw new RpcError( `Method ${method} is not supported`, -32601)
      }

      return this.createSuccessResponse(request.id, result)
    } catch (error: any) {
      Logger.error({error: error.message}, `Error calling method ${request.method}`)
      return this.createErrorResponse(request.id, error.code ? error.code : -32000, error.message)
    }
  }

  private jsonRpcRequestValidator(request: JsonRpcRequest): boolean | JsonRpcErrorResponse {
    if (!request.jsonrpc || request.jsonrpc !== '2.0') {
      return this.createErrorResponse(request.id, -32600, 'Invalid Request')
    }

    if (!request.method || typeof request.method !== 'string') {
      return this.createErrorResponse(request.id, -32600, 'Invalid Request')
    }

    if (
      !request.id ||
      (typeof request.id !== 'number' && typeof request.id !== 'string')
    ) {
      return this.createErrorResponse(request.id, -32600, 'Invalid Request')
    }

    if (!request.params || !Array.isArray(request.params)) {
      return this.createErrorResponse(request.id, -32600, 'Invalid Request')
    }

    if (this.httpApi.indexOf(request.method.split('_')[0]) === -1) {
      return this.createErrorResponse(
        request.id,
        -32601,
        `Method ${request.method} is not supported`
      )
    }
    return true
  }

  /*
    * Construct JSON RPC success response
  */
  private createSuccessResponse(
    id: number | string,
    result: any
  ): JsonRpcSuccessResponse {
    const hexlifyResult = this.deepHexlify(result)
    Logger.debug({
      jsonrpc: '2.0',
      id,
      result: hexlifyResult,
    }, '<< Sending sucess response')

    return {
      jsonrpc: '2.0',
      id,
      result: hexlifyResult,
    }
  }

  /*
    * Construct JSON RPC error response
  */
  private createErrorResponse(
    id: number | string,
    code: number,
    message: string,
    data?: any
  ): JsonRpcErrorResponse {
    const errorResponse: JsonRpcErrorResponse = {
      jsonrpc: '2.0',
      id,
      error: {
        code,
        message,
      },
    }

    if (data) {
      errorResponse.error.data = data
    }

    Logger.debug(errorResponse, '<< Sending error response')

    return errorResponse
  }

  /*
    * hexlify all members of object, recursively
  */
  private deepHexlify(obj: any): any {
    if (typeof obj === 'function') {
      return undefined
    }
    if (obj == null || typeof obj === 'string' || typeof obj === 'boolean') {
      return obj
    }
    else if (obj._isBigNumber != null || typeof obj !== 'object') {
      return ethers.utils.hexlify(obj).replace(/^0x0/, '0x')
    }
    if (Array.isArray(obj)) {
      return obj.map(member => this.deepHexlify(member))
    }
    return Object.keys(obj)
      .reduce((set, key) => (Object.assign(Object.assign({}, set), { [key]: this.deepHexlify(obj[key]) })), {})
 }
}