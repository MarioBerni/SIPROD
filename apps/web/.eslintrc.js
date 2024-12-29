/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "next",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  settings: {
    next: {
      rootDir: "."
    },
    react: {
      version: "detect"
    }
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "@typescript-eslint/no-explicit-any": "warn",
    "react/prop-types": "off",
    "@typescript-eslint/no-var-requires": "off" // Permitir require en archivos de configuración
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  }
};
