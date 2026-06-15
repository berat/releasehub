import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',       // CLI tool — console.log is the output mechanism
      'no-control-regex': 'off', // intentional: stripping control chars from AI responses
    },
  },
  {
    ignores: ['dist/**'],
  },
)
