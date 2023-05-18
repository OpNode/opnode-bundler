import { BundleManager } from '../../bundle'
import { MempoolManager } from '../../mempool'

export class DebugAPI {
  constructor () {
    // 
  }

  dumpMempool() {
    return MempoolManager.dump()
  }

  setBundlingMode(mode: string): boolean {
    if (mode !== 'auto' && mode !== 'manual') {
      throw new Error('Invalid bundling mode')
    }
    BundleManager.setBundlingMode(mode)
    return true
  }

  async sendBundleNow(): Promise<string> {
    return await BundleManager.forceSendBundle()
  }
    

  async clearState(): Promise<void> {
    return await MempoolManager.clearState()
  }
}