export const I_ENTRY_POINT_SIMULATIONS = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    name: '_validateSenderAndPaymaster',
    inputs: [
      { name: 'initCode', type: 'bytes', internalType: 'bytes' },
      { name: 'sender', type: 'address', internalType: 'address' },
      { name: 'paymasterAndData', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'addStake',
    inputs: [
      {
        name: 'unstakeDelaySec',
        type: 'uint32',
        internalType: 'uint32',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'delegateAndRevert',
    inputs: [
      { name: 'target', type: 'address', internalType: 'address' },
      { name: 'data', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'depositTo',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'deposits',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [
      { name: 'deposit', type: 'uint256', internalType: 'uint256' },
      { name: 'staked', type: 'bool', internalType: 'bool' },
      { name: 'stake', type: 'uint112', internalType: 'uint112' },
      {
        name: 'unstakeDelaySec',
        type: 'uint32',
        internalType: 'uint32',
      },
      { name: 'withdrawTime', type: 'uint48', internalType: 'uint48' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getDepositInfo',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: 'info',
        type: 'tuple',
        internalType: 'struct IStakeManager.DepositInfo',
        components: [
          { name: 'deposit', type: 'uint256', internalType: 'uint256' },
          { name: 'staked', type: 'bool', internalType: 'bool' },
          { name: 'stake', type: 'uint112', internalType: 'uint112' },
          {
            name: 'unstakeDelaySec',
            type: 'uint32',
            internalType: 'uint32',
          },
          {
            name: 'withdrawTime',
            type: 'uint48',
            internalType: 'uint48',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getNonce',
    inputs: [
      { name: 'sender', type: 'address', internalType: 'address' },
      { name: 'key', type: 'uint192', internalType: 'uint192' },
    ],
    outputs: [{ name: 'nonce', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getSenderAddress',
    inputs: [{ name: 'initCode', type: 'bytes', internalType: 'bytes' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getUserOpHash',
    inputs: [
      {
        name: 'userOp',
        type: 'tuple',
        internalType: 'struct PackedUserOperation',
        components: [
          { name: 'sender', type: 'address', internalType: 'address' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
          { name: 'initCode', type: 'bytes', internalType: 'bytes' },
          { name: 'callData', type: 'bytes', internalType: 'bytes' },
          {
            name: 'accountGasLimits',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'preVerificationGas',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'gasFees', type: 'bytes32', internalType: 'bytes32' },
          {
            name: 'paymasterAndData',
            type: 'bytes',
            internalType: 'bytes',
          },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'handleAggregatedOps',
    inputs: [
      {
        name: 'opsPerAggregator',
        type: 'tuple[]',
        internalType: 'struct IEntryPoint.UserOpsPerAggregator[]',
        components: [
          {
            name: 'userOps',
            type: 'tuple[]',
            internalType: 'struct PackedUserOperation[]',
            components: [
              {
                name: 'sender',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'nonce',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'initCode',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'callData',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'accountGasLimits',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'preVerificationGas',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'gasFees',
                type: 'bytes32',
                internalType: 'bytes32',
              },
              {
                name: 'paymasterAndData',
                type: 'bytes',
                internalType: 'bytes',
              },
              {
                name: 'signature',
                type: 'bytes',
                internalType: 'bytes',
              },
            ],
          },
          {
            name: 'aggregator',
            type: 'address',
            internalType: 'contract IAggregator',
          },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: 'beneficiary',
        type: 'address',
        internalType: 'address payable',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'handleOps',
    inputs: [
      {
        name: 'ops',
        type: 'tuple[]',
        internalType: 'struct PackedUserOperation[]',
        components: [
          { name: 'sender', type: 'address', internalType: 'address' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
          { name: 'initCode', type: 'bytes', internalType: 'bytes' },
          { name: 'callData', type: 'bytes', internalType: 'bytes' },
          {
            name: 'accountGasLimits',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'preVerificationGas',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'gasFees', type: 'bytes32', internalType: 'bytes32' },
          {
            name: 'paymasterAndData',
            type: 'bytes',
            internalType: 'bytes',
          },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: 'beneficiary',
        type: 'address',
        internalType: 'address payable',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'incrementNonce',
    inputs: [{ name: 'key', type: 'uint192', internalType: 'uint192' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'innerHandleOp',
    inputs: [
      { name: 'callData', type: 'bytes', internalType: 'bytes' },
      {
        name: 'opInfo',
        type: 'tuple',
        internalType: 'struct EntryPoint.UserOpInfo',
        components: [
          {
            name: 'mUserOp',
            type: 'tuple',
            internalType: 'struct EntryPoint.MemoryUserOp',
            components: [
              {
                name: 'sender',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'nonce',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'verificationGasLimit',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'callGasLimit',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'paymasterVerificationGasLimit',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'paymasterPostOpGasLimit',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'preVerificationGas',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'paymaster',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'maxFeePerGas',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'maxPriorityFeePerGas',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'userOpHash',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          { name: 'prefund', type: 'uint256', internalType: 'uint256' },
          {
            name: 'contextOffset',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'preOpGas', type: 'uint256', internalType: 'uint256' },
        ],
      },
      { name: 'context', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [
      {
        name: 'actualGasCost',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'nonceSequenceNumber',
    inputs: [
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'uint192', internalType: 'uint192' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'simulateHandleOp',
    inputs: [
      {
        name: 'op',
        type: 'tuple',
        internalType: 'struct PackedUserOperation',
        components: [
          { name: 'sender', type: 'address', internalType: 'address' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
          { name: 'initCode', type: 'bytes', internalType: 'bytes' },
          { name: 'callData', type: 'bytes', internalType: 'bytes' },
          {
            name: 'accountGasLimits',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'preVerificationGas',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'gasFees', type: 'bytes32', internalType: 'bytes32' },
          {
            name: 'paymasterAndData',
            type: 'bytes',
            internalType: 'bytes',
          },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
      { name: 'target', type: 'address', internalType: 'address' },
      { name: 'targetCallData', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IEntryPointSimulations.ExecutionResult',
        components: [
          {
            name: 'preOpGas',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'paid', type: 'uint256', internalType: 'uint256' },
          {
            name: 'accountValidationData',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'paymasterValidationData',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'targetSuccess', type: 'bool', internalType: 'bool' },
          { name: 'targetResult', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'simulateValidation',
    inputs: [
      {
        name: 'userOp',
        type: 'tuple',
        internalType: 'struct PackedUserOperation',
        components: [
          { name: 'sender', type: 'address', internalType: 'address' },
          { name: 'nonce', type: 'uint256', internalType: 'uint256' },
          { name: 'initCode', type: 'bytes', internalType: 'bytes' },
          { name: 'callData', type: 'bytes', internalType: 'bytes' },
          {
            name: 'accountGasLimits',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'preVerificationGas',
            type: 'uint256',
            internalType: 'uint256',
          },
          { name: 'gasFees', type: 'bytes32', internalType: 'bytes32' },
          {
            name: 'paymasterAndData',
            type: 'bytes',
            internalType: 'bytes',
          },
          { name: 'signature', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IEntryPointSimulations.ValidationResult',
        components: [
          {
            name: 'returnInfo',
            type: 'tuple',
            internalType: 'struct IEntryPoint.ReturnInfo',
            components: [
              {
                name: 'preOpGas',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'prefund',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'accountValidationData',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'paymasterValidationData',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'paymasterContext',
                type: 'bytes',
                internalType: 'bytes',
              },
            ],
          },
          {
            name: 'senderInfo',
            type: 'tuple',
            internalType: 'struct IStakeManager.StakeInfo',
            components: [
              {
                name: 'stake',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'unstakeDelaySec',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'factoryInfo',
            type: 'tuple',
            internalType: 'struct IStakeManager.StakeInfo',
            components: [
              {
                name: 'stake',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'unstakeDelaySec',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'paymasterInfo',
            type: 'tuple',
            internalType: 'struct IStakeManager.StakeInfo',
            components: [
              {
                name: 'stake',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'unstakeDelaySec',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'aggregatorInfo',
            type: 'tuple',
            internalType: 'struct IEntryPoint.AggregatorStakeInfo',
            components: [
              {
                name: 'aggregator',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'stakeInfo',
                type: 'tuple',
                internalType: 'struct IStakeManager.StakeInfo',
                components: [
                  {
                    name: 'stake',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                  {
                    name: 'unstakeDelaySec',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'supportsInterface',
    inputs: [{ name: 'interfaceId', type: 'bytes4', internalType: 'bytes4' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'unlockStake',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawStake',
    inputs: [
      {
        name: 'withdrawAddress',
        type: 'address',
        internalType: 'address payable',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawTo',
    inputs: [
      {
        name: 'withdrawAddress',
        type: 'address',
        internalType: 'address payable',
      },
      {
        name: 'withdrawAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'AccountDeployed',
    inputs: [
      {
        name: 'userOpHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'factory',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'paymaster',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'BeforeExecution',
    inputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Deposited',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'totalDeposit',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PostOpRevertReason',
    inputs: [
      {
        name: 'userOpHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'nonce',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'revertReason',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SignatureAggregatorChanged',
    inputs: [
      {
        name: 'aggregator',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'StakeLocked',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'totalStaked',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'unstakeDelaySec',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'StakeUnlocked',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'withdrawTime',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'StakeWithdrawn',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'withdrawAddress',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UserOperationEvent',
    inputs: [
      {
        name: 'userOpHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'paymaster',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'nonce',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'success',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
      {
        name: 'actualGasCost',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'actualGasUsed',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UserOperationPrefundTooLow',
    inputs: [
      {
        name: 'userOpHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'nonce',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UserOperationRevertReason',
    inputs: [
      {
        name: 'userOpHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'nonce',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'revertReason',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Withdrawn',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'withdrawAddress',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'DelegateAndRevert',
    inputs: [
      { name: 'success', type: 'bool', internalType: 'bool' },
      { name: 'ret', type: 'bytes', internalType: 'bytes' },
    ],
  },
  {
    type: 'error',
    name: 'FailedOp',
    inputs: [
      { name: 'opIndex', type: 'uint256', internalType: 'uint256' },
      { name: 'reason', type: 'string', internalType: 'string' },
    ],
  },
  {
    type: 'error',
    name: 'FailedOpWithRevert',
    inputs: [
      { name: 'opIndex', type: 'uint256', internalType: 'uint256' },
      { name: 'reason', type: 'string', internalType: 'string' },
      { name: 'inner', type: 'bytes', internalType: 'bytes' },
    ],
  },
  {
    type: 'error',
    name: 'PostOpReverted',
    inputs: [{ name: 'returnData', type: 'bytes', internalType: 'bytes' }],
  },
  { type: 'error', name: 'ReentrancyGuardReentrantCall', inputs: [] },
  {
    type: 'error',
    name: 'SenderAddressResult',
    inputs: [{ name: 'sender', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'SignatureValidationFailed',
    inputs: [{ name: 'aggregator', type: 'address', internalType: 'address' }],
  },
]

export const EntryPointSimulationsDeployedBytecode =
  '0x60806040526004361061012d5760003560e01c8063765e827f116100ab578063b760faf91161006f578063b760faf9146104ab578063bb9fe6bf146104be578063c23a5cea146104d3578063c3bce009146104f3578063dbed18e014610520578063fc7e286d1461054057600080fd5b8063765e827f146103fe578063850aaf621461041e578063957122ab1461043e57806397b2dcb91461045e5780639b249f691461048b57600080fd5b8063205c2878116100f2578063205c28781461021057806322cdde4c1461023057806335567e1a146102505780635287ce12146102b057806370a08231146103c857600080fd5b806242dc531461014257806301ffc9a7146101755780630396cb60146101a55780630bd28e3b146101b85780631b2e01b8146101d857600080fd5b3661013d5761013b336105e8565b005b600080fd5b34801561014e57600080fd5b5061016261015d366004613417565b610609565b6040519081526020015b60405180910390f35b34801561018157600080fd5b506101956101903660046134dc565b610794565b604051901515815260200161016c565b61013b6101b3366004613506565b61081c565b3480156101c457600080fd5b5061013b6101d3366004613543565b610aab565b3480156101e457600080fd5b506101626101f336600461355e565b600160209081526000928352604080842090915290825290205481565b34801561021c57600080fd5b5061013b61022b366004613593565b610ae2565b34801561023c57600080fd5b5061016261024b3660046135d8565b610c33565b34801561025c57600080fd5b5061016261026b36600461355e565b6001600160a01b03821660009081526001602090815260408083206001600160c01b038516845290915290819020549082901b67ffffffffffffffff19161792915050565b3480156102bc57600080fd5b5061036d6102cb36600461360c565b6040805160a081018252600080825260208201819052918101829052606081018290526080810191909152506001600160a01b031660009081526020818152604091829020825160a0810184528154815260019091015460ff811615159282019290925261010082046001600160701b031692810192909252600160781b810463ffffffff166060830152600160981b900465ffffffffffff16608082015290565b60405161016c9190600060a082019050825182526020830151151560208301526001600160701b03604084015116604083015263ffffffff606084015116606083015265ffffffffffff608084015116608083015292915050565b3480156103d457600080fd5b506101626103e336600461360c565b6001600160a01b031660009081526020819052604090205490565b34801561040a57600080fd5b5061013b61041936600461366d565b610c75565b34801561042a57600080fd5b5061013b6104393660046136c3565b610df1565b34801561044a57600080fd5b5061013b610459366004613717565b610e70565b34801561046a57600080fd5b5061047e61047936600461379b565b610f6d565b60405161016c919061384c565b34801561049757600080fd5b5061013b6104a636600461389b565b61109f565b61013b6104b936600461360c565b6105e8565b3480156104ca57600080fd5b5061013b61114a565b3480156104df57600080fd5b5061013b6104ee36600461360c565b61127e565b3480156104ff57600080fd5b5061051361050e3660046135d8565b6114a2565b60405161016c91906138dc565b34801561052c57600080fd5b5061013b61053b36600461366d565b611658565b34801561054c57600080fd5b506105a561055b36600461360c565b6000602081905290815260409020805460019091015460ff81169061010081046001600160701b031690600160781b810463ffffffff1690600160981b900465ffffffffffff1685565b6040805195865293151560208601526001600160701b039092169284019290925263ffffffff909116606083015265ffffffffffff16608082015260a00161016c565b60015b60058110156105fc576001016105eb565b61060582611a71565b5050565b6000805a90503330146106635760405162461bcd60e51b815260206004820152601760248201527f4141393220696e7465726e616c2063616c6c206f6e6c7900000000000000000060448201526064015b60405180910390fd5b8451606081015160a082015181016127100160405a603f0281610688576106886139af565b0410156106a05763deaddead60e01b60005260206000fd5b8751600090156107345760006106bd846000015160008c86611aba565b9050806107325760006106d1610800611ad2565b80519091501561072c5784600001516001600160a01b03168a602001517f1c4fada7374c0a9ee8841fc38afe82932dc0f8e69012e927f061a8bae611a2018760200151846040516107239291906139c5565b60405180910390a35b60019250505b505b600088608001515a8603019050610784828a8a8a8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250879250611afe915050565b955050505050505b949350505050565b60006001600160e01b0319821663307e35b760e11b14806107c557506001600160e01b0319821663122a0e9b60e31b145b806107e057506001600160e01b0319821663cf28ef9760e01b145b806107fb57506001600160e01b03198216633e84f02160e01b145b8061081657506301ffc9a760e01b6001600160e01b03198316145b92915050565b33600090815260208190526040902063ffffffff821661087e5760405162461bcd60e51b815260206004820152601a60248201527f6d757374207370656369667920756e7374616b652064656c6179000000000000604482015260640161065a565b600181015463ffffffff600160781b909104811690831610156108e35760405162461bcd60e51b815260206004820152601c60248201527f63616e6e6f7420646563726561736520756e7374616b652074696d6500000000604482015260640161065a565b600181015460009061090490349061010090046001600160701b03166139f4565b90506000811161094b5760405162461bcd60e51b81526020600482015260126024820152711b9bc81cdd185ad9481cdc1958da599a595960721b604482015260640161065a565b6001600160701b038111156109935760405162461bcd60e51b815260206004820152600e60248201526d7374616b65206f766572666c6f7760901b604482015260640161065a565b6040805160a08101825283548152600160208083018281526001600160701b0386811685870190815263ffffffff8a811660608801818152600060808a0181815233808352828a52918c90209a518b55965199909801805494519151965165ffffffffffff16600160981b0265ffffffffffff60981b1997909416600160781b029690961669ffffffffffffffffffff60781b1991909516610100026effffffffffffffffffffffffffff0019991515999099166effffffffffffffffffffffffffffff1990941693909317979097179190911691909117179055835185815290810192909252917fa5ae833d0bb1dcd632d98a8b70973e8516812898e19bf27b70071ebc8dc52c01910160405180910390a2505050565b3360009081526001602090815260408083206001600160c01b03851684529091528120805491610ada83613a07565b919050555050565b3360009081526020819052604090208054821115610b425760405162461bcd60e51b815260206004820152601960248201527f576974686472617720616d6f756e7420746f6f206c6172676500000000000000604482015260640161065a565b8054610b4f908390613a20565b8155604080516001600160a01b03851681526020810184905233917fd1c19fbcd4551a5edfb66d43d2e337c04837afda3482b42bdf569a8fccdae5fb910160405180910390a26000836001600160a01b03168360405160006040518083038185875af1925050503d8060008114610be2576040519150601f19603f3d011682016040523d82523d6000602084013e610be7565b606091505b5050905080610c2d5760405162461bcd60e51b81526020600482015260126024820152716661696c656420746f20776974686472617760701b604482015260640161065a565b50505050565b6000610c3e82611cc1565b6040805160208101929092523090820152466060820152608001604051602081830303815290604052805190602001209050919050565b610c7d611cda565b816000816001600160401b03811115610c9857610c98613211565b604051908082528060200260200182016040528015610cd157816020015b610cbe61308c565b815260200190600190039081610cb65790505b50905060005b82811015610d4a576000828281518110610cf357610cf3613a33565b60200260200101519050600080610d2e848a8a87818110610d1657610d16613a33565b9050602002810190610d289190613a49565b85611d02565b91509150610d3f8483836000611f08565b505050600101610cd7565b506040516000907fbb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f972908290a160005b83811015610dd457610dc881888884818110610d9757610d97613a33565b9050602002810190610da99190613a49565b858481518110610dbb57610dbb613a33565b60200260200101516120a4565b90910190600101610d79565b50610ddf8482612360565b505050610dec6001600255565b505050565b600080846001600160a01b03168484604051610e0e929190613a6a565b600060405180830381855af49150503d8060008114610e49576040519150601f19603f3d011682016040523d82523d6000602084013e610e4e565b606091505b50915091508181604051632650415560e21b815260040161065a929190613a7a565b83158015610e8657506001600160a01b0383163b155b15610ed35760405162461bcd60e51b815260206004820152601960248201527f41413230206163636f756e74206e6f74206465706c6f79656400000000000000604482015260640161065a565b60148110610f4b576000610eea6014828486613a95565b610ef391613abf565b60601c9050803b600003610f495760405162461bcd60e51b815260206004820152601b60248201527f41413330207061796d6173746572206e6f74206465706c6f7965640000000000604482015260640161065a565b505b60405162461bcd60e51b8152602060048201526000602482015260440161065a565b610fa86040518060c0016040528060008152602001600081526020016000815260200160008152602001600015158152602001606081525090565b610fb0611cda565b610fb861308c565b610fc186612459565b600080610fd060008985611d02565b915091506000610fe260008a866120a4565b9050600060606001600160a01b038a161561105a57896001600160a01b03168989604051611011929190613a6a565b6000604051808303816000865af19150503d806000811461104e576040519150601f19603f3d011682016040523d82523d6000602084013e611053565b606091505b5090925090505b6040518060c0016040528087608001518152602001848152602001868152602001858152602001831515815260200182815250965050505050505061078c6001600255565b60006110b36006546001600160a01b031690565b6001600160a01b031663570e1a3684846040518363ffffffff1660e01b81526004016110e0929190613b1d565b6020604051808303816000875af11580156110ff573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111239190613b31565b604051633653dc0360e11b81526001600160a01b038216600482015290915060240161065a565b33600090815260208190526040812060018101549091600160781b90910463ffffffff1690036111a95760405162461bcd60e51b815260206004820152600a6024820152691b9bdd081cdd185ad95960b21b604482015260640161065a565b600181015460ff166111f15760405162461bcd60e51b8152602060048201526011602482015270616c726561647920756e7374616b696e6760781b604482015260640161065a565b600181015460009061121090600160781b900463ffffffff1642613b4e565b60018301805460ff65ffffffffffff60981b011916600160981b65ffffffffffff841690810260ff19169190911790915560405190815290915033907ffa9b3c14cc825c412c9ed81b3ba365a5b459439403f18829e572ed53a4180f0a906020015b60405180910390a25050565b336000908152602081905260409020600181015461010090046001600160701b0316806112e45760405162461bcd60e51b81526020600482015260146024820152734e6f207374616b6520746f20776974686472617760601b604482015260640161065a565b6001820154600160981b900465ffffffffffff166113445760405162461bcd60e51b815260206004820152601d60248201527f6d7573742063616c6c20756e6c6f636b5374616b652829206669727374000000604482015260640161065a565b600182015442600160981b90910465ffffffffffff1611156113a85760405162461bcd60e51b815260206004820152601b60248201527f5374616b65207769746864726177616c206973206e6f74206475650000000000604482015260640161065a565b600182018054610100600160c81b0319169055604080516001600160a01b03851681526020810183905233917fb7c918e0e249f999e965cafeb6c664271b3f4317d296461500e71da39f0cbda3910160405180910390a26000836001600160a01b03168260405160006040518083038185875af1925050503d806000811461144c576040519150601f19603f3d011682016040523d82523d6000602084013e611451565b606091505b5050905080610c2d5760405162461bcd60e51b815260206004820152601860248201527f6661696c656420746f207769746864726177207374616b650000000000000000604482015260640161065a565b6114aa613124565b6114b261308c565b6114bb83612459565b6000806114ca60008685611d02565b9150915060006114e1846000015160e001516125a1565b8451519091506000906114f3906125a1565b9050611512604051806040016040528060008152602001600081525090565b36600061152260408b018b613b74565b909250905060006014821015611539576000611554565b611547601460008486613a95565b61155091613abf565b60601c5b905061155f816125a1565b9350505050600085905060006040518060a0016040528089608001518152602001896040015181526020018881526020018781526020016115a18a6060015190565b90526040805180820182526003546001600160a01b039081168252825180840190935260045483526005546020848101919091528201929092529192508316158015906115f857506001836001600160a01b031614155b15611625576040518060400160405280846001600160a01b03168152602001611620856125a1565b905290505b6040805160a081018252928352602083019590955293810192909252506060810192909252608082015295945050505050565b611660611cda565b816000805b828110156117cd573686868381811061168057611680613a33565b90506020028101906116929190613bba565b90503660006116a18380613bd0565b909250905060006116b8604085016020860161360c565b90506000196001600160a01b038216016117145760405162461bcd60e51b815260206004820152601760248201527f4141393620696e76616c69642061676772656761746f72000000000000000000604482015260640161065a565b6001600160a01b038116156117b1576001600160a01b038116632dd8113384846117416040890189613b74565b6040518563ffffffff1660e01b81526004016117609493929190613d3d565b60006040518083038186803b15801561177857600080fd5b505afa925050508015611789575060015b6117b15760405163086a9f7560e41b81526001600160a01b038216600482015260240161065a565b6117bb82876139f4565b95505060019093019250611665915050565b506000816001600160401b038111156117e8576117e8613211565b60405190808252806020026020018201604052801561182157816020015b61180e61308c565b8152602001906001900390816118065790505b5090506000805b848110156118fe573688888381811061184357611843613a33565b90506020028101906118559190613bba565b90503660006118648380613bd0565b9092509050600061187b604085016020860161360c565b90508160005b818110156118ec57600089898151811061189d5761189d613a33565b602002602001015190506000806118c08b898987818110610d1657610d16613a33565b915091506118d084838389611f08565b8a6118da81613a07565b9b505060019093019250611881915050565b50506001909401935061182892505050565b506040517fbb47ee3e183a558b1a2ff0874b079f3fc5478b7454eacf2bfc5af2ff5878f97290600090a150600080805b85811015611a2c573689898381811061194957611949613a33565b905060200281019061195b9190613bba565b905061196d604082016020830161360c565b6001600160a01b03167f575ff3acadd5ab348fe1855e217e0f3678f8d767d7494c9f9fefbee2e17cca4d60405160405180910390a23660006119af8380613bd0565b90925090508060005b81811015611a1b576119fa888585848181106119d6576119d6613a33565b90506020028101906119e89190613a49565b8b8b81518110610dbb57610dbb613a33565b611a0490886139f4565b965087611a1081613a07565b9850506001016119b8565b50506001909301925061192e915050565b506040516000907f575ff3acadd5ab348fe1855e217e0f3678f8d767d7494c9f9fefbee2e17cca4d908290a2611a628682612360565b5050505050610dec6001600255565b6000611a7d82346125f3565b9050816001600160a01b03167f2da466a7b24304f47e87fa2e1e5a81b9831ce54fec19055ce277ca2f39ba42c48260405161127291815260200190565b6000806000845160208601878987f195945050505050565b60603d82811115611ae05750815b604051602082018101604052818152816000602083013e9392505050565b6000805a855190915060009081611b1482612626565b60e08301519091506001600160a01b038116611b335782519350611bef565b809350600088511115611bef57868202955060028a6002811115611b5957611b59613dba565b14611bef5760a0830151604051637c627b2160e01b81526001600160a01b03831691637c627b2191611b95908e908d908c908990600401613dd0565b600060405180830381600088803b158015611baf57600080fd5b5087f193505050508015611bc1575060015b611bef576000611bd2610800611ad2565b905080604051632b5e552f60e21b815260040161065a9190613e1a565b5a60a0840151606085015160808c015192880399909901980190880380821115611c22576064600a828403020498909801975b50506040890151878302965086811015611c7e5760028b6002811115611c4a57611c4a613dba565b03611c6d57809650611c5b8a612650565b611c688a6000898b61269f565b611cb3565b63deadaa5160e01b60005260206000fd5b868103611c8b86826125f3565b506000808d6002811115611ca157611ca1613dba565b149050611cb08c828b8d61269f565b50505b505050505050949350505050565b6000611ccc8261271a565b805190602001209050919050565b6002805403611cfc57604051633ee5aeb560e01b815260040160405180910390fd5b60028055565b60008060005a8451909150611d1786826127d2565b611d2086610c33565b6020860152604081015161012082015161010083015160a08401516080850151606086015160c0870151861717171717176effffffffffffffffffffffffffffff811115611db05760405162461bcd60e51b815260206004820152601860248201527f41413934206761732076616c756573206f766572666c6f770000000000000000604482015260640161065a565b6000611ddf8460c081015160a08201516080830151606084015160408501516101009095015194010101010290565b9050611dee8a8a8a84876128e0565b9650611e0284600001518560200151612a77565b611e585789604051631101335b60e11b815260040161065a918152604060208201819052601a908201527f4141323520696e76616c6964206163636f756e74206e6f6e6365000000000000606082015260800190565b825a86031115611eb45789604051631101335b60e11b815260040161065a918152604060208201819052601e908201527f41413236206f76657220766572696669636174696f6e4761734c696d69740000606082015260800190565b60e08401516060906001600160a01b031615611edb57611ed68b8b8b85612ac4565b975090505b604089018290528060608a015260a08a01355a870301896080018181525050505050505050935093915050565b600080611f1485612c82565b91509150816001600160a01b0316836001600160a01b031614611f7a5785604051631101335b60e11b815260040161065a9181526040602082018190526014908201527320a0991a1039b4b3b730ba3ab9329032b93937b960611b606082015260800190565b8015611fd25785604051631101335b60e11b815260040161065a9181526040602082018190526017908201527f414132322065787069726564206f72206e6f7420647565000000000000000000606082015260800190565b6000611fdd85612c82565b925090506001600160a01b038116156120395786604051631101335b60e11b815260040161065a9181526040602082018190526014908201527320a0999a1039b4b3b730ba3ab9329032b93937b960611b606082015260800190565b811561209b5786604051631101335b60e11b815260040161065a9181526040602082018190526021908201527f41413332207061796d61737465722065787069726564206f72206e6f742064756060820152606560f81b608082015260a00190565b50505050505050565b6000805a905060006120b7846060015190565b60405190915060009036826120cf60608a018a613b74565b91509150606060008260038111156120e657843591505b506372288ed160e01b6001600160e01b03198216016121945760008b8b60200151604051602401612118929190613e2d565b60408051601f198184030181529181526020820180516001600160e01b0316638dd7712f60e01b1790525190915030906242dc539061215f9084908f908d90602401613ef9565b604051602081830303815290604052915060e01b6020820180516001600160e01b0383818316178352505050509250506121e9565b306001600160a01b03166242dc5385858d8b6040516024016121b99493929190613f39565b604051602081830303815290604052915060e01b6020820180516001600160e01b03838183161783525050505091505b602060008351602085016000305af195506000519850846040525050505050806123565760003d806020036122245760206000803e60005191505b5063deaddead60e01b81036122775787604051631101335b60e11b815260040161065a918152604060208201819052600f908201526e41413935206f7574206f662067617360881b606082015260800190565b63deadaa5160e01b81036122c857600086608001515a6122979087613a20565b6122a191906139f4565b60408801519091506122b288612650565b6122bf886000838561269f565b95506123549050565b855180516020808901519201516001600160a01b0390911691907ff62676f440ff169a3a9afdbf812e89e7f95975ee8e5c31214ffdef631c5f47929061230f610800611ad2565b60405161231d9291906139c5565b60405180910390a3600086608001515a6123379087613a20565b61234191906139f4565b90506123506002888684611afe565b9550505b505b5050509392505050565b6001600160a01b0382166123b65760405162461bcd60e51b815260206004820152601860248201527f4141393020696e76616c69642062656e65666963696172790000000000000000604482015260640161065a565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114612403576040519150601f19603f3d011682016040523d82523d6000602084013e612408565b606091505b5050905080610dec5760405162461bcd60e51b815260206004820152601f60248201527f41413931206661696c65642073656e6420746f2062656e656669636961727900604482015260640161065a565b6124cc6040516135a560f21b60208201526bffffffffffffffffffffffff193060601b166022820152600160f81b603682015260009060370160408051808303601f190181529190528051602090910120600680546001600160a01b0319166001600160a01b0390921691909117905550565b3063957122ab6124df6040840184613b74565b6124ec602086018661360c565b6124f960e0870187613b74565b6040518663ffffffff1660e01b8152600401612519959493929190613f70565b60006040518083038186803b15801561253157600080fd5b505afa925050508015612542575060015b61259e5761254e613fb2565b806308c379a0036125925750612562613fce565b8061256d5750612594565b80511561060557600081604051631101335b60e11b815260040161065a9291906139c5565b505b3d6000803e3d6000fd5b50565b604080518082018252600080825260208083018281526001600160a01b03959095168252819052919091206001015461010081046001600160701b03168252600160781b900463ffffffff1690915290565b6001600160a01b03821660009081526020819052604081208054829061261a9085906139f4565b91829055509392505050565b61010081015161012082015160009190808203612644575092915050565b61078c82488301612cd5565b80518051602080840151928101516040519081526001600160a01b0390921692917f67b4fa9642f42120bf031f3051d1824b0fe25627945b27b8a6a65d5761d5482e910160405180910390a350565b835160e081015181516020808801519301516040516001600160a01b039384169492909316927f49628fd1471006c1482da88028e9ce4dbb080b815c9b0344d39e5a8e6ec1419f9161270c9189908990899093845291151560208401526040830152606082015260800190565b60405180910390a450505050565b606081356020830135600061273a6127356040870187613b74565b612ced565b9050600061274e6127356060880188613b74565b9050608086013560a087013560c0880135600061277161273560e08c018c613b74565b604080516001600160a01b039a909a1660208b015289810198909852606089019690965250608087019390935260a086019190915260c085015260e08401526101008084019190915281518084039091018152610120909201905292915050565b6127df602083018361360c565b6001600160a01b03168152602082810135908201526001600160801b036080808401358281166060850152811c604084015260a084013560c0808501919091528401359182166101008401521c61012082015236600061284260e0850185613b74565b909250905080156128c557603481101561289e5760405162461bcd60e51b815260206004820152601d60248201527f4141393320696e76616c6964207061796d6173746572416e6444617461000000604482015260640161065a565b6128a88282612d00565b60a086015260808501526001600160a01b031660e0840152610c2d565b600060e084018190526080840181905260a084015250505050565b82518051600091906128ff88876128fa60408b018b613b74565b612d68565b60e082015160006001600160a01b038216612943576001600160a01b03831660009081526020819052604090205487811161293c5780880361293f565b60005b9150505b60208801516040516306608bdf60e21b81526001600160a01b038516916319822f7c918991612979918e91908790600401614057565b60206040518083038160008887f1935050505080156129b5575060408051601f3d908101601f191682019092526129b29181019061407c565b60015b6129e057896129c5610800611ad2565b6040516365c8fd4d60e01b815260040161065a929190614095565b94506001600160a01b038216612a6a576001600160a01b0383166000908152602081905260409020805480891115612a64578b604051631101335b60e11b815260040161065a9181526040602082018190526017908201527f41413231206469646e2774207061792070726566756e64000000000000000000606082015260800190565b88900390555b5050505095945050505050565b6001600160a01b038216600090815260016020908152604080832084821c80855292528220805484916001600160401b038316919085612ab683613a07565b909155501495945050505050565b60606000805a855160e08101516001600160a01b03811660009081526020819052604090208054939450919290919087811015612b4d578a604051631101335b60e11b815260040161065a918152604060208201819052601e908201527f41413331207061796d6173746572206465706f73697420746f6f206c6f770000606082015260800190565b8781038260000181905550600084608001519050836001600160a01b03166352b7512c828d8d602001518d6040518563ffffffff1660e01b8152600401612b9693929190614057565b60006040518083038160008887f193505050508015612bd757506040513d6000823e601f3d908101601f19168201604052612bd491908101906140d2565b60015b612c02578b612be7610800611ad2565b6040516365c8fd4d60e01b815260040161065a92919061415d565b9098509650805a87031115612c73578b604051631101335b60e11b815260040161065a9181526040602082018190526027908201527f41413336206f766572207061796d6173746572566572696669636174696f6e47606082015266185cd31a5b5a5d60ca1b608082015260a00190565b50505050505094509492505050565b60008082600003612c9857506000928392509050565b6000612ca38461301b565b9050806040015165ffffffffffff16421180612cca5750806020015165ffffffffffff1642105b905194909350915050565b6000818310612ce45781612ce6565b825b9392505050565b6000604051828085833790209392505050565b60008080612d116014828688613a95565b612d1a91613abf565b60601c612d2b602460148789613a95565b612d349161419a565b60801c612d4560346024888a613a95565b612d4e9161419a565b9194506001600160801b0316925060801c90509250925092565b8015610c2d578251516001600160a01b0381163b15612dd35784604051631101335b60e11b815260040161065a918152604060208201819052601f908201527f414131302073656e64657220616c726561647920636f6e737472756374656400606082015260800190565b6000612de76006546001600160a01b031690565b6001600160a01b031663570e1a3686600001516040015186866040518463ffffffff1660e01b8152600401612e1d929190613b1d565b60206040518083038160008887f1158015612e3c573d6000803e3d6000fd5b50505050506040513d601f19601f82011682018060405250810190612e619190613b31565b90506001600160a01b038116612ec35785604051631101335b60e11b815260040161065a918152604060208201819052601b908201527f4141313320696e6974436f6465206661696c6564206f72204f4f470000000000606082015260800190565b816001600160a01b0316816001600160a01b031614612f2d5785604051631101335b60e11b815260040161065a91815260406020808301829052908201527f4141313420696e6974436f6465206d7573742072657475726e2073656e646572606082015260800190565b806001600160a01b03163b600003612f905785604051631101335b60e11b815260040161065a91815260406020808301829052908201527f4141313520696e6974436f6465206d757374206372656174652073656e646572606082015260800190565b6000612f9f6014828688613a95565b612fa891613abf565b60601c9050826001600160a01b031686602001517fd51a9c61267aa6196961883ecf5ff2da6619c37dac0fa92122513fb32c032d2d83896000015160e0015160405161300a9291906001600160a01b0392831681529116602082015260400190565b60405180910390a350505050505050565b60408051606081018252600080825260208201819052918101919091528160a081901c65ffffffffffff8116600003613057575065ffffffffffff5b604080516060810182526001600160a01b03909316835260d09490941c602083015265ffffffffffff16928101929092525090565b6040518060a001604052806130ff60405180610140016040528060006001600160a01b0316815260200160008152602001600081526020016000815260200160008152602001600081526020016000815260200160006001600160a01b0316815260200160008152602001600081525090565b8152602001600080191681526020016000815260200160008152602001600081525090565b6040518060a001604052806131616040518060a0016040528060008152602001600081526020016000815260200160008152602001606081525090565b8152602001613183604051806040016040528060008152602001600081525090565b81526020016131a5604051806040016040528060008152602001600081525090565b81526020016131c7604051806040016040528060008152602001600081525090565b81526020016131d46131d9565b905290565b604051806040016040528060006001600160a01b031681526020016131d4604051806040016040528060008152602001600081525090565b634e487b7160e01b600052604160045260246000fd5b60a081018181106001600160401b038211171561324657613246613211565b60405250565b601f8201601f191681016001600160401b038111828210171561327157613271613211565b6040525050565b60405161014081016001600160401b038111828210171561329b5761329b613211565b60405290565b60006001600160401b038211156132ba576132ba613211565b50601f01601f191660200190565b6001600160a01b038116811461259e57600080fd5b80356132e8816132c8565b919050565b60008183036101c081121561330157600080fd5b60405161330d81613227565b8092506101408083121561332057600080fd5b613328613278565b9250613333856132dd565b83526020850135602084015260408501356040840152606085013560608401526080850135608084015260a085013560a084015260c085013560c084015261337d60e086016132dd565b60e084015261010085810135908401526101208086013590840152918152908301356020820152610160830135604082015261018083013560608201526101a090920135608090920191909152919050565b60008083601f8401126133e157600080fd5b5081356001600160401b038111156133f857600080fd5b60208301915083602082850101111561341057600080fd5b9250929050565b600080600080610200858703121561342e57600080fd5b84356001600160401b038082111561344557600080fd5b818701915087601f83011261345957600080fd5b8135613464816132a1565b604051613471828261324c565b8281528a602084870101111561348657600080fd5b826020860160208301376000602084830101528098505050506134ac88602089016132ed565b94506101e08701359150808211156134c357600080fd5b506134d0878288016133cf565b95989497509550505050565b6000602082840312156134ee57600080fd5b81356001600160e01b031981168114612ce657600080fd5b60006020828403121561351857600080fd5b813563ffffffff81168114612ce657600080fd5b80356001600160c01b03811681146132e857600080fd5b60006020828403121561355557600080fd5b612ce68261352c565b6000806040838503121561357157600080fd5b823561357c816132c8565b915061358a6020840161352c565b90509250929050565b600080604083850312156135a657600080fd5b82356135b1816132c8565b946020939093013593505050565b600061012082840312156135d257600080fd5b50919050565b6000602082840312156135ea57600080fd5b81356001600160401b0381111561360057600080fd5b61078c848285016135bf565b60006020828403121561361e57600080fd5b8135612ce6816132c8565b60008083601f84011261363b57600080fd5b5081356001600160401b0381111561365257600080fd5b6020830191508360208260051b850101111561341057600080fd5b60008060006040848603121561368257600080fd5b83356001600160401b0381111561369857600080fd5b6136a486828701613629565b90945092505060208401356136b8816132c8565b809150509250925092565b6000806000604084860312156136d857600080fd5b83356136e3816132c8565b925060208401356001600160401b038111156136fe57600080fd5b61370a868287016133cf565b9497909650939450505050565b60008060008060006060868803121561372f57600080fd5b85356001600160401b038082111561374657600080fd5b61375289838a016133cf565b909750955060208801359150613767826132c8565b9093506040870135908082111561377d57600080fd5b5061378a888289016133cf565b969995985093965092949392505050565b600080600080606085870312156137b157600080fd5b84356001600160401b03808211156137c857600080fd5b6137d4888389016135bf565b9550602087013591506137e6826132c8565b909350604086013590808211156134c357600080fd5b60005b838110156138175781810151838201526020016137ff565b50506000910152565b600081518084526138388160208601602086016137fc565b601f01601f19169290920160200192915050565b60208152815160208201526020820151604082015260408201516060820152606082015160808201526080820151151560a0820152600060a083015160c08084015261078c60e0840182613820565b600080602083850312156138ae57600080fd5b82356001600160401b038111156138c457600080fd5b6138d0858286016133cf565b90969095509350505050565b602080825282516101408383015280516101608401529081015161018083015260408101516101a083015260608101516101c08301526080015160a06101e083015260009061392f610200840182613820565b9050602084015161394d604085018280518252602090810151910152565b506040840151805160808581019190915260209182015160a08601526060860151805160c087015282015160e086015285015180516001600160a01b031661010086015280820151805161012087015290910151610140850152509392505050565b634e487b7160e01b600052601260045260246000fd5b82815260406020820152600061078c6040830184613820565b634e487b7160e01b600052601160045260246000fd5b80820180821115610816576108166139de565b600060018201613a1957613a196139de565b5060010190565b81810381811115610816576108166139de565b634e487b7160e01b600052603260045260246000fd5b6000823561011e19833603018112613a6057600080fd5b9190910192915050565b8183823760009101908152919050565b821515815260406020820152600061078c6040830184613820565b60008085851115613aa557600080fd5b83861115613ab257600080fd5b5050820193919092039150565b6bffffffffffffffffffffffff198135818116916014851015613aec5780818660140360031b1b83161692505b505092915050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60208152600061078c602083018486613af4565b600060208284031215613b4357600080fd5b8151612ce6816132c8565b65ffffffffffff818116838216019080821115613b6d57613b6d6139de565b5092915050565b6000808335601e19843603018112613b8b57600080fd5b8301803591506001600160401b03821115613ba557600080fd5b60200191503681900382131561341057600080fd5b60008235605e19833603018112613a6057600080fd5b6000808335601e19843603018112613be757600080fd5b8301803591506001600160401b03821115613c0157600080fd5b6020019150600581901b360382131561341057600080fd5b6000808335601e19843603018112613c3057600080fd5b83016020810192503590506001600160401b03811115613c4f57600080fd5b80360382131561341057600080fd5b6000610120613c7d84613c70856132dd565b6001600160a01b03169052565b60208301356020850152613c946040840184613c19565b826040870152613ca78387018284613af4565b92505050613cb86060840184613c19565b8583036060870152613ccb838284613af4565b925050506080830135608085015260a083013560a085015260c083013560c0850152613cfa60e0840184613c19565b85830360e0870152613d0d838284613af4565b92505050610100613d2081850185613c19565b86840383880152613d32848284613af4565b979650505050505050565b6040808252810184905260006060600586901b830181019083018783805b89811015613da357868503605f190184528235368c900361011e19018112613d81578283fd5b613d8d868d8301613c5e565b9550506020938401939290920191600101613d5b565b505050508281036020840152613d32818587613af4565b634e487b7160e01b600052602160045260246000fd5b600060038610613df057634e487b7160e01b600052602160045260246000fd5b85825260806020830152613e076080830186613820565b6040830194909452506060015292915050565b602081526000612ce66020830184613820565b604081526000613e406040830185613c5e565b90508260208301529392505050565b805180516001600160a01b031683526020810151602084015260408101516040840152606081015160608401526080810151608084015260a081015160a084015260c081015160c084015260e0810151613eb460e08501826001600160a01b03169052565b5061010081810151908401526101209081015190830152602081015161014083015260408101516101608301526060810151610180830152608001516101a090910152565b6000610200808352613f0d81840187613820565b9050613f1c6020840186613e4f565b8281036101e0840152613f2f8185613820565b9695505050505050565b6000610200808352613f4e8184018789613af4565b9050613f5d6020840186613e4f565b8281036101e0840152613d328185613820565b606081526000613f84606083018789613af4565b6001600160a01b03861660208401528281036040840152613fa6818587613af4565b98975050505050505050565b600060033d1115613fcb5760046000803e5060005160e01c5b90565b600060443d1015613fdc5790565b6040516003193d81016004833e81513d6001600160401b03816024840111818411171561400b57505050505090565b82850191508151818111156140235750505050505090565b843d870101602082850101111561403d5750505050505090565b61404c6020828601018761324c565b509095945050505050565b60608152600061406a6060830186613c5e565b60208301949094525060400152919050565b60006020828403121561408e57600080fd5b5051919050565b82815260606020820152600d60608201526c10504c8cc81c995d995c9d1959609a1b608082015260a06040820152600061078c60a0830184613820565b600080604083850312156140e557600080fd5b82516001600160401b038111156140fb57600080fd5b8301601f8101851361410c57600080fd5b8051614117816132a1565b604051614124828261324c565b82815287602084860101111561413957600080fd5b61414a8360208301602087016137fc565b6020969096015195979596505050505050565b82815260606020820152600d60608201526c10504cccc81c995d995c9d1959609a1b608082015260a06040820152600061078c60a0830184613820565b6fffffffffffffffffffffffffffffffff198135818116916010851015613aec5760109490940360031b84901b169092169291505056fea26469706673582212203c265b40422c3e3aac31956ef36bc8e751ef7617245dfab190fb9b6c31b3708364736f6c63430008170033'
