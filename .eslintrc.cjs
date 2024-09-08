module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin', '@typescript-eslint', 'jsdoc'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'error',
    'no-debugger': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_', 
      varsIgnorePattern: '^_'
    }],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],

    // JSDoc-specific rules
    'jsdoc/check-alignment': 'warn',
    'jsdoc/check-param-names': 'error',
    'jsdoc/check-tag-names': 'error',
    'jsdoc/check-types': 'error',
    'jsdoc/require-param': 'error',
    'jsdoc/require-returns': 'error',
    "jsdoc/tag-lines": ["error", "any",{"startLines":1}],
    "jsdoc/require-returns-type": ["off", {"contexts":["never"]}],
    "jsdoc/require-param-type": ["off", {"contexts":["never"]}]
  },
  ignorePatterns: [
    'node_modules',
    '.eslintrc.cjs',
    '**/*.js',
    '**/.cache',
    '**/dist'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    jsdoc: {
      mode: 'typescript',
    },
  },
}
