/* eslint.config.mjs */
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  // Base JS recommendations
  js.configs.recommended,

  // TypeScript support
  ...tseslint.configs.recommended,

  // Ignore generated and build output
  {
    ignores: ['.astro/**', 'dist/**', 'node_modules/**'],
  },

  // TypeScript files rules
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.d.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Relax rules for generated declaration files
      '@typescript-eslint/no-explicit-any': ['off'],
      '@typescript-eslint/no-empty-object-type': ['off'],
      '@typescript-eslint/triple-slash-reference': ['off'],
    },
  },

  // JS files config
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'eqeqeq': ['error', 'always'],
    },
  },
];
