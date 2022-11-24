module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'import/extensions': 'off',
    'no-restricted-syntax': 'off',
    'no-plusplus': 'off',
    'func-names': 'off',
    'no-await-in-loop': 'off',
    'no-unused-expressions': 'off',
    '@babel/no-unused-expressions': 'off',
    'import/prefer-default-export': 'off',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  globals: {
    BigInt: 'true',
  },
  env: {
    mocha: true,
    browser: true,
    node: true,
    jest: true,
  },
  plugins: ['import'],
};
