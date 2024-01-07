module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'standard-with-typescript'
  ],
  rules: {
    'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }]
  },
  parserOptions: {
    project: './tsconfig.json'
  }
}
