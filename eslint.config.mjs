import pluginJs from "@eslint/js";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: {
        ...globals.browser, // For browser globals
        process: "readonly", // Define process as a readonly global variable
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: {
        ...globals.browser,
        process: "readonly", // Define process as a readonly global variable
      },
    },
  },
  {
    ignores: ["node_modules/", "dist/", "build/", "coverage/", "*.min.js", "*.bundle.js", ".env", "package-lock.json", "pnpm-lock.yaml", "yarn.lock", ".prettierignore", ".prettierrc", "tsconfig.json", "eslint.config.mjs", "nodemon.json"]
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    plugins: {
      prettier: prettierPlugin
    },
    // extends: [
    //   "plugin:prettier/recommended", // This makes sure Prettier’s rules are enforced.
    // ],
    rules: {
      "prettier/prettier": "warn", // Show Prettier errors as warnings
      "no-unused-vars": "off", // Disable the base ESLint rule
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];
