import js from "@eslint/js";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  { ignores: ["dist/", "*.config.js"] },
  {
    languageOptions: {
      ecmaVersion: 6,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ENV: true,
      },
    },
    rules: {
      "no-var": "error",
      "no-unused-vars": [
        "error",
        {
          caughtErrors: "none",
        },
      ],
      semi: ["error", "always"],
      "prefer-const": "error",
      "space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],
    },
  },
];
