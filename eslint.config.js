const tseslint = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const reactPlugin = require('eslint-plugin-react')
const reactHooksPlugin = require('eslint-plugin-react-hooks')
const reactNativePlugin = require('eslint-plugin-react-native')
const prettierConfig = require('eslint-config-prettier')

module.exports = [
  {
    ignores: ['node_modules/**', '.expo/**', 'dist/**', 'backend/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-native': reactNativePlugin,
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      ...reactPlugin.configs['recommended'].rules,
      ...reactHooksPlugin.configs['recommended'].rules,
      // Too aggressive: flags valid async data-fetching patterns (HealthKit, etc.)
      'react-hooks/set-state-in-effect': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react-native/no-unused-styles': 'error',
      'react-native/no-inline-styles': 'warn',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  prettierConfig,
]
