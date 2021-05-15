module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["standard", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ["graphql", "@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
  },
};
