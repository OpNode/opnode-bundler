/**
 * return type of our BundlerCollectorTracer.
 * collect access and opcodes, split into "levels" based on NUMBER opcode
 * keccak, calls and logs are collected globally, since the levels are unimportant for them.
 */
export interface BundlerCollectorReturn {
  /**
 * storage and opcode info, collected on top-level calls from EntryPoint
 */
  callsFromEntryPoint: TopLevelCallInfo[]

  /**
   * values passed into KECCAK opcode
   */
  keccak: string[]
  calls: Array<ExitInfo | MethodInfo>
  logs: LogInfo[]
  debug: any[]
}

export interface MethodInfo {
  type: string
  from: string
  to: string
  method: string
  value: any
  gas: number
}

export interface ExitInfo {
  type: 'REVERT' | 'RETURN'
  gasUsed: number
  data: string
}

export interface TopLevelCallInfo {
  topLevelMethodSig: string
  topLevelTargetAddress: string
  opcodes: { [opcode: string]: number }
  access: { [address: string]: AccessInfo }
  contractSize: { [addr: string]: ContractSizeInfo }
  oog?: boolean
}

/**
 * It is illegal to access contracts with no code in validation even if it gets deployed later.
 * This means we need to store the {@link contractSize} of accessed addresses at the time of access.
 */
export interface ContractSizeInfo {
  opcode: string
  contractSize: number
}

export interface AccessInfo {
  // slot value, just prior this operation
  reads: { [slot: string]: string }
  // count of writes.
  writes: { [slot: string]: number }
}

export interface LogInfo {
  topics: string[]
  data: string
}
