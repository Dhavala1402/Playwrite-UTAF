import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        console: 'readonly',
        require: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        performance: 'readonly',
        FormData: 'readonly',
        Blob: 'readonly',
        // Test globals
        test: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript specific rules - Suppress annoying warnings
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // Suppress 'any' type warnings
      '@typescript-eslint/no-non-null-assertion': 'off', // Suppress non-null assertion warnings
      '@typescript-eslint/no-var-requires': 'error',
      
      // General JavaScript/TypeScript rules
      'no-console': 'off', // Allow console statements in test framework
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      
      // Code style
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      
      // Playwright specific rules
      'no-empty-pattern': 'off', // Allow destructuring in test parameters
    },
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      'no-console': 'off', // Allow console in tests for debugging
      '@typescript-eslint/no-explicit-any': 'off', // More flexible in tests
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'playwright-report/**',
      'test-results/**',
      'allure-results/**',
      'allure-report/**',
      '*.config.js',
    ],
  },
];
