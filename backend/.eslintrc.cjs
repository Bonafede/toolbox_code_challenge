// Using .eslintrc.js instead of eslint.config.js for better compatibility
// and to avoid global config dependencies, as required by the challenge.

module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["standard", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    semi: ["off"],
    "space-before-function-paren": ["off"],
  },
};
