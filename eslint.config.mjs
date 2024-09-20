import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  {
    rules: {
      semi: 'error',
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      // 'no-unused-vars': 'error',
      'no-console': 'warn',
      'no-irregular-whitespace': 'error',
      'no-duplicate-imports': 'error',
      'no-unexpected-multiline': 'error',
      'no-empty': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-multiple-empty-lines': ['warn', { max: 1 }],
      indent: ['warn', 2],
    },
  },
];
