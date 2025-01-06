module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: ['./tsconfig.json', './prisma/tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
    es6: true
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-console': ['off', { allow: ['warn', 'error', 'info', 'log'] }],
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    '.eslintrc.js',
    'jest.config.ts',
    '*.js',
    '!scripts/**/*',
    '!prisma/**/*'
  ]
};
