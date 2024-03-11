export const simpleAccountFactoryABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_entryPoint',
        type: 'address',
        internalType: 'contract IEntryPoint',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'accountImplementation',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract SimpleAccount',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'createAccount',
    inputs: [
      { name: 'owner', type: 'address', internalType: 'address' },
      { name: 'salt', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [
      {
        name: 'ret',
        type: 'address',
        internalType: 'contract SimpleAccount',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getAddress',
    inputs: [
      { name: 'owner', type: 'address', internalType: 'address' },
      { name: 'salt', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
]

export const simpleAccountABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'anEntryPoint',
        type: 'address',
        internalType: 'contract IEntryPoint',
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    name: 'UPGRADE_INTERFACE_VERSION',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'addDeposit',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'entryPoint',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IEntryPoint',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'execute',
    inputs: [
      { name: 'dest', type: 'address', internalType: 'address' },
      { name: 'value', type: 'uint256', internalType: 'uint256' },
      { name: 'func', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'executeBatch',
    inputs: [
      { name: 'dest', type: 'address[]', internalType: 'address[]' },
      { name: 'value', type: 'uint256[]', internalType: 'uint256[]' },
      { name: 'func', type: 'bytes[]', internalType: 'bytes[]' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getDeposit',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getNonce',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [{ name: 'anOwner', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'onERC1155BatchReceived',
    inputs: [
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'uint256[]', internalType: 'uint256[]' },
      { name: '', type: 'uint256[]', internalType: 'uint256[]' },
      { name: '', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [{ name: '', type: 'bytes4', internalType: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'onERC1155Received',
    inputs: [
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [{ name: '', type: 'bytes4', internalType: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'onERC721Received',
    inputs: [
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [{ name: '', type: 'bytes4', internalType: 'bytes4' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'proxiableUUID',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
    stateMutability: 'view',
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
    name: 'upgradeToAndCall',
    inputs: [
      {
        name: 'newImplementation',
        type: 'address',
        internalType: 'address',
      },
      { name: 'data', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'validateUserOp',
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
      { name: 'userOpHash', type: 'bytes32', internalType: 'bytes32' },
      {
        name: 'missingAccountFunds',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'validationData',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawDepositTo',
    inputs: [
      {
        name: 'withdrawAddress',
        type: 'address',
        internalType: 'address payable',
      },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'Initialized',
    inputs: [
      {
        name: 'version',
        type: 'uint64',
        indexed: false,
        internalType: 'uint64',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SimpleAccountInitialized',
    inputs: [
      {
        name: 'entryPoint',
        type: 'address',
        indexed: true,
        internalType: 'contract IEntryPoint',
      },
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Upgraded',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [{ name: 'target', type: 'address', internalType: 'address' }],
  },
  { type: 'error', name: 'ECDSAInvalidSignature', inputs: [] },
  {
    type: 'error',
    name: 'ECDSAInvalidSignatureLength',
    inputs: [{ name: 'length', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'ECDSAInvalidSignatureS',
    inputs: [{ name: 's', type: 'bytes32', internalType: 'bytes32' }],
  },
  {
    type: 'error',
    name: 'ERC1967InvalidImplementation',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  { type: 'error', name: 'ERC1967NonPayable', inputs: [] },
  { type: 'error', name: 'FailedInnerCall', inputs: [] },
  { type: 'error', name: 'InvalidInitialization', inputs: [] },
  { type: 'error', name: 'NotInitializing', inputs: [] },
  { type: 'error', name: 'UUPSUnauthorizedCallContext', inputs: [] },
  {
    type: 'error',
    name: 'UUPSUnsupportedProxiableUUID',
    inputs: [{ name: 'slot', type: 'bytes32', internalType: 'bytes32' }],
  },
]

export const globalCounterABI = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    name: 'currentCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'increment',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
]
