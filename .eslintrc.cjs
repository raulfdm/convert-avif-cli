module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['standard', 'prettier'],
  plugins: ['simple-import-sort'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
};
