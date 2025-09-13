// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import n from 'eslint-plugin-n';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // Configuration for eslint.config.mjs itself to enable type-aware linting
  {
    files: ['eslint.config.mjs'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'], // Specify the tsconfig for type information
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },

  // App & library source
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: { project: ['./tsconfig.json'] },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { react, 'react-hooks': reactHooks, import: importPlugin, n },
    settings: {
      react: { version: 'detect' },
      'import/resolver': { typescript: true },
    },
    rules: {
      // General hygiene
      'no-debugger': 'error',
      'no-console': 'warn',
      eqeqeq: ['error', 'smart'],
      'no-undef': 'off', // TS handles this

      // TS best practices
      '@typescript-eslint/no-unused-vars': ['error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/ban-ts-comment': ['warn', { 'ts-ignore': 'allow-with-description' }],

      // React / Hooks
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-useless-fragment': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Imports
      'import/order': ['warn', {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
      }],
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: [
          '**/*.test.*', '**/*.spec.*',
          '**/webpack.*', '**/*.config.*',
        ],
      }],

      // Node runtime checks (covered by TS/bundler)
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
    },
  },

  // Webpack/config files (Node env; allow devDeps)
  {
    files: ['webpack.config.{js,cjs,mjs}', 'webpack.*.{js,cjs,mjs}', '**/*.config.{js,cjs,mjs}'],
    languageOptions: {
    // webpack.config.js is CommonJS; give it Node globals
      sourceType: 'commonjs',
      globals: globals.node,
    },
    // enable the import & node plugins for this block so rule toggles are recognized
    plugins: { import: importPlugin, n },
    rules: {
      // config files can import devDeps, and import resolution can be noisy here
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',
      // avoid false-positives from eslint-plugin-n on ESM/CJS mix
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/es-syntax': 'off'
    },
  },

  // Jasmine tests
  {
    files: ['**/*.test.*', '**/*.spec.*', 'src/test.ts'],
    languageOptions: { globals: { ...globals.jasmine, ...globals.node } },
  },
];
