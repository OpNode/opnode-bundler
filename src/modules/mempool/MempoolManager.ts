import { Mutex } from 'async-mutex'
import { MempoolEntry, UserOperation } from '../types'
import { Config } from '../config'

/* In-memory mempool with used to manage UserOperations.
  The MempoolManager Singleton class is a Hash Table data structure that provides efficient insertion, removal, and retrieval of items based on a hash string key. 
  It utilizes the async-mutex package to prevent race conditions when modifying or accessing the hash table state.

  Key methods and their functionality:
    - findByHash(): Retrieves the MempoolEntry associated with the given hash string key. It acquires the mutex to ensure thread-safety during access.
    - addUserOp(): Sets the value associated with the given userOpHash string key. It acquires the mutex to ensure thread-safety during modification.
    - removeUserOp(): Removes the MempoolEntry with the given userOpHash string key from the mempool. It acquires the mutex to ensure thread-safety during modification. Returns true if the item is successfully removed, and false if the item doesn't exist.
    - createNextUserOpBundle(): Removes items from the MempoolEntry in bundles of the specified bundleSize. It acquires the mutex to ensure thread-safety during modification. Returns an array of key-value pairs ([string, MempoolEntry]) representing the removed MempoolEntrys.
    - size: return current size of mempool for debugging
    - dump: print all items in mempool for debugging
    - clearState: clear all items in mempool for debugging
    - resetInstance: reset the singleton instance for testing
    */
class MempoolManager {
  private static instance: MempoolManager | undefined = undefined

  private readonly mempool: Map<string, MempoolEntry>
  private readonly mutex: Mutex
  private readonly MAX_MEMPOOL_USEROPS_PER_SENDER = 4

  // count entities in mempool.
  private entryCount: { [addr: string]: number | undefined } = {}

  private constructor() {
    this.mempool = new Map<string, MempoolEntry>()
    this.mutex = new Mutex()
    console.log('MempoolManager initialized')
  }

  public static getInstance(): MempoolManager  {
    if (!this.instance) {
      this.instance = new MempoolManager()
    }
    return this.instance
  }

  public async findByHash(userOpHash: string): Promise<MempoolEntry | undefined> {
    const release = await this.mutex.acquire()
    try {
      return this.mempool.get(userOpHash)
    } finally {
      release()
    }
  }

  public async addUserOp(userOpHash: string, userOp:UserOperation): Promise<void> {
    const release = await this.mutex.acquire()
    try {
      const entry: MempoolEntry = {
        userOp,
        userOpHash,
        status: 'idle',
      }
      this.entryCount[entry.userOp.sender] = (this.entryCount[entry.userOp.sender] ?? 0) + 1
      this.mempool.set(userOpHash, entry)
    } finally {
      release()
    }
  }

  public async removeUserOp(userOpHash: string): Promise<boolean> {
    const release = await this.mutex.acquire()
    try {
      const entry = this.mempool.get(userOpHash)
      const result = this.mempool.delete(userOpHash)
      if (result && entry) {
        const count = (this.entryCount[entry.userOp.sender] ?? 0) - 1
        count <= 0 ? delete this.entryCount[entry.userOp.sender] : this.entryCount[entry.userOp.sender] = count
      }

      return result
    } finally {
      release()
    }
  }

  public async getNextEntriesToBundle(): Promise< MempoolEntry[]> {
    const release = await this.mutex.acquire()
    try {
      const entries: MempoolEntry[] = []
      let count = 0
      for (const [key, value] of this.mempool.entries()) {
        if (count >= Config.bundleSize) {
          break
        }

        if (value.status === 'bundling') {
          continue
        }

        value.status = 'bundling'
        entries.push(value)
        count++
      }
      return entries
    } finally {
      release()
    }
  }

  public size(): number {
    return this.mempool.size
  }

  public async clearState(): Promise<void> {
    const release = await this.mutex.acquire()
    try {
      this.mempool.clear()
      this.entryCount = {}
    } finally {
      release()
    }
  }

  public dump(): Array<UserOperation> {
    console.log(`Mempool size: ${this.mempool.size}`)
    console.log('Mempool entryCount:', this.entryCount)
    for (const [key, value] of this.mempool.entries()) {
      console.log(`Key: ${key}, Value: ${value}`)
    }
    return Array.from(this.mempool.values()).map((mempoolEntry) => mempoolEntry.userOp)
  }
}

export default MempoolManager.getInstance()

const mempoolManagerInstance = MempoolManager.getInstance()
export { mempoolManagerInstance as MempoolManager }