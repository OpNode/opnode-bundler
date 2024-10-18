import type { HandlerRegistry } from '../../../shared/rpc/index.js'

import { DebugAPI } from './apis/index.js'
import { MempoolManageSender } from '../mempool/index.js'

export const createRelayerHandlerRegistry = (
  debug: DebugAPI,
  mempoolManageSender: MempoolManageSender,
): HandlerRegistry => ({
  builder_addUserOp: async (params) => {
    await mempoolManageSender.addUserOp(params[0])
    return 'ok'
  },

  debug_bundler_clearState: async () => {
    await debug.clearState()
    return 'ok'
  },
  debug_bundler_dumpMempool: async () => await debug.dumpMempool(),
  debug_bundler_clearMempool: async () => {
    await debug.clearMempool()
    return 'ok'
  },
  debug_bundler_sendBundleNow: async () => {
    const result = await debug.sendBundleNow()
    if (result.transactionHash === '' && result.userOpHashes.length === 0) {
      return 'ok'
    }
    return result
  },
  debug_bundler_setBundlingMode: (params) => {
    debug.setBundlingMode(params[0])
    return 'ok'
  },
  debug_bundler_setBundleInterval: async () => 'ok', // TODO:  Placeholder for implementation, need to implement
  debug_bundler_setReputation: async (params) => {
    await debug.setReputation(params[0])
    return 'ok'
  },
  debug_bundler_dumpReputation: async () => await debug.dumpReputation(),
  debug_bundler_clearReputation: async () => {
    await debug.clearReputation()
    return 'ok'
  },
  debug_bundler_addUserOps: async (params) => {
    await debug.addUserOps(params[0])
    return 'ok'
  },
  debug_bundler_getStakeStatus: async (params) => {
    return await debug.getStakeStatus(params[0], params[1])
  },
})
