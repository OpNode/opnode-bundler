import { Command, OptionValues } from 'commander'
import { BigNumber, Wallet, ethers, providers } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import packageJson from '../../../package.json'
import { ENTRY_POINT_ABI, isValidAddress } from '../utils'
import dotenv from 'dotenv'
dotenv.config()

class Config {
  private static instance: Config | undefined = undefined
  private DEFAULT_NETWORK = 'http://localhost:8545'
  private DEFAULT_ENTRY_POINT = '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789'
  private SUPPORTED_MODES = ['private', 'private-conditional', 'public-conditional', 'private-searcher', 'public-searcher']
  private SUPPORTED_NAMESPACES = ['web3', 'eth', 'debug']

  public readonly provider: providers.JsonRpcProvider
  public readonly connectedWallet: Wallet
  public readonly entryPointAddr: string
  public readonly beneficiaryAddr: string
  public readonly entryPointContract: ethers.Contract

  public readonly autoBundleInterval: number
  public readonly bundleSize: number
  public readonly isAutoBundle: boolean
  public readonly maxMempoolSize: number = 100

  public readonly minStake: BigNumber
  public readonly minUnstakeDelay: number

  public readonly gasFactor: number
  public readonly minSignerBalance: BigNumber
  public readonly maxBundleGas: number

  public readonly port: number
  public readonly txMode: string
  public readonly clientVersion: string
  public readonly isUnsafeMode: boolean

  public readonly whitelist: string[]
  public readonly blacklist: string[]

  public readonly httpApi: string[]

  private constructor() {
    const program = new Command()
    program
    .version(`${packageJson.version}`)
    .option('--httpApi <string>', 'rpc method name spaces', 'web3,eth')
    .option('--network <string>', 'eth client url', `${this.DEFAULT_NETWORK}`)
    .option('--entryPoint <string>', 'supported entry point address', this.DEFAULT_ENTRY_POINT)
    .option('--gasFactor <number>', '1')
    .option('--minBalance <string>', 'below this signer balance, keep fee for itself, ignoring "beneficiary" address', '1')
    .option('--maxBundleGas <number>', 'max gas the bundler will use in transactions', '5e6')
    .option('--auto', 'automatic bundling', false)
    .option('--autoBundleInterval <number>', 'auto bundler interval in (ms)', '120000')
    .option('--bundleSize <number>', 'mempool bundle size', '5')
    .option('--port <number>', 'server listening port', '3000')
    .option('--minStake <string>', 'minunm stake a entity has to have to pass reputation system(When staked, an entity is also allowed to use its own associated storage, in addition to senders associated storage as ETH)', '1') // The stake value is not enforced on-chain, but specifically by each node while simulating a transaction
    .option('--minUnstakeDelay <number>', 'mempool bundle size', '84600') // One day
    .option('--txMode <string>', 'bundler transaction mode (private, private-conditional, public-conditional, private-searcher, public-searcher)', 'private')
    .option('--unsafe', 'UNSAFE mode: no storage or opcode checks (safe mode requires debug_traceCall support on eth node)', false)

    const programOpts: OptionValues = program.parse(process.argv).opts()
    console.log('programOpts', programOpts)
        
    if (this.SUPPORTED_MODES.indexOf(programOpts.txMode as string) === -1) {      
      throw new Error('Invalid bundler mode')
    }

    if (!isValidAddress(programOpts.entryPoint as string)) {
      throw new Error('Entry point not a valid address')
    }

    if (programOpts.txMode as string === 'private-searcher' || programOpts.txMode as string === 'public-searcher') {
      if (!process.env.ALCHEMY_API_KEY) {
        throw new Error('ALCHEMY_API_KEY env var not set')
      }
      this.provider = this.getNetworkProvider(programOpts.network as string, process.env.ALCHEMY_API_KEY as string)
    } else {
      this.provider = this.getNetworkProvider(programOpts.network as string)
    } 

    if (!process.env.MNEMONIC) {
      throw new Error('MNEMONIC env var not set')
    }

    if (!process.env.BENEFICIARY) {
      throw new Error('BENEFICIARY env var not set')
    }

    if (!isValidAddress(process.env.BENEFICIARY as string)) {
      throw new Error('Beneficiary not a valid address')
    }

    if(!process.env.WHITELIST) {
      this.whitelist = []
    } else {
      this.whitelist = process.env.WHITELIST.split(',')
    }

    if(!process.env.BLACKLIST) {
      this.blacklist = []
    } else {
      this.blacklist = process.env.BLACKLIST.split(',')
    }

    this.connectedWallet = Wallet.fromMnemonic(process.env.MNEMONIC as string).connect(this.provider)
    this.entryPointAddr = programOpts.entryPoint as string
    this.beneficiaryAddr = process.env.BENEFICIARY as string
    this.entryPointContract = new ethers.Contract(this.entryPointAddr, ENTRY_POINT_ABI, this.connectedWallet)

    this.autoBundleInterval = parseInt(programOpts.autoBundleInterval as string)
    this.bundleSize = parseInt(programOpts.bundleSize as string)
    this.isAutoBundle = programOpts.auto as boolean

    this.minStake = parseEther(programOpts.minStake as string)
    this.minUnstakeDelay = parseInt(programOpts.minUnstakeDelay as string)

    this.gasFactor = parseInt(programOpts.gasFactor as string)
    this.minSignerBalance = parseEther(programOpts.minBalance as string)
    this.maxBundleGas = parseInt(programOpts.maxBundleGas as string)

    this.port = parseInt(programOpts.port as string)
    this.txMode = programOpts.txMode as string
    this.clientVersion = packageJson.version as string
    this.isUnsafeMode = programOpts.unsafe as boolean

    this.httpApi = (programOpts.httpApi as string).split(',')
    for (let i = 0; i < this.httpApi.length; i++) {
      if (this.SUPPORTED_NAMESPACES.indexOf(this.httpApi[i]) === -1) {
        throw new Error('Invalid http api')
      }
    }

    console.log('Done init Config global')
  }

  public static getInstance(): Config {
    if (!this.instance) {
      this.instance = new Config()
    }
    return this.instance
  }

  private getNetworkProvider(url: string, apiKey?: string): providers.JsonRpcProvider {
    const isValid = this.isValidUrl(url)
    if (!isValid) {
      throw new Error('Invalid network url')
    }
    return apiKey ? new providers.JsonRpcProvider(`${url.replace(/\/+$/, '')}/${apiKey}`) : new providers.JsonRpcProvider(url)
  }

  private isValidUrl(url: string): boolean {
    const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/
    return pattern.test(url)
  }

  public isbaseTxMode(): boolean {
    return this.txMode === 'private'
  }

  public isConditionalTxMode(): boolean {
    return this.txMode === 'public-conditional' || this.txMode === 'private-conditional'
  }

  public isSearcherTxMode(): boolean {
    return this.txMode === 'public-searcher' || this.txMode === 'private-searcher'
  }
}

const configInstance = Config.getInstance()
export { configInstance as Config }