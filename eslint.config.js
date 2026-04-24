import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
  js.configs.recommended, // Configurações recomendadas do JS
  prettier, // Integração com Prettier (deve ser o último)
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node, // Reconhece 'process', 'module', etc.
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prettier/prettier': 'error', // Erros de formatação travam o lint
    },
  },
  {
    // Ignorar pastas (substitui o .eslintignore no modo Flat)
    ignores: ['node_modules/', 'logs/', 'uploads/', '.env'],
  },
];
