import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // 1. Global Ignores (Pengganti globalIgnores)
  { ignores: ['dist'] },

  // 2. Base Configuration (Pengganti 'extends' js.configs.recommended)
  js.configs.recommended,

  // 3. React Configuration
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    // Di Flat Config, plugin harus didefinisikan di sini dengan nama kuncinya
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    // Gabungkan semua rules di sini
    rules: {
      // Spread rule bawaan plugin react-hooks
      ...reactHooks.configs.recommended.rules,
      
      // Rule wajib untuk Vite React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Custom Rules Anda
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]