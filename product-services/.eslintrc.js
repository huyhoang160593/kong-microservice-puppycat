/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["xo", "xo-typescript"],
  // Overrides: [
  //   {
  //     extends: ["xo-typescript"],
  //     files: ["*.ts", "*.tsx"],
  //   },
  // ],
  parserOptions: {
    project: "./tsconfig.json",
    // ecmaVersion: 'latest',
    // sourceType: 'module',
  },
  rules: {
    "@typescript-eslint/naming-convention": [
      "warn",
      {
        selector: "default",
        format: ["camelCase"],
        leadingUnderscore: "allow",
        trailingUnderscore: "allow",
      },
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
        leadingUnderscore: "allow",
        trailingUnderscore: "allow",
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      {
        selector: "objectLiteralProperty",
        format: null
      },
    ],
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/restrict-template-expressions": "warn",
    "new-cap": "warn",
    "capitalized-comments": "warn",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-throw-literal": "off"
  },
  ignorePatterns: [".eslintrc.js"],
};
