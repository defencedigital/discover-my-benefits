const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    allowImportExportEverywhere: false,
    codeFrame: false,
    ecmaFeatures: {
      globalReturn: true,
      impliedStrict: true,
      jsx: true,
      arrowFunction: true,
    },
  },
  extends: ['airbnb',   "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
  "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
  "plugin:prettier/recommended"],
  settings: {
    react: {
      version: 'detect',
    },
    'import/core-modules' : ['@reach/router'],
  },
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'jest'],

  rules: {
    '@typescript-eslint/interface-name-prefix': ['error', 'always'],
    '@typescript-eslint/explicit-function-return-type': [OFF],
    '@typescript-eslint/no-var-requires': [OFF],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [WARN],
    'no-underscore-dangle': [OFF],
    'import/extensions': [OFF],
    'max-len': [
      WARN,
      {
        code: 140,
      },
    ],
    'react/prop-types': [OFF],
    'react/require-default-props': [OFF],
    'react/jsx-filename-extension': [
      OFF,
      {
        extensions: ['.ts', '.tsx'],
      },
    ],
    'react/jsx-indent': [OFF],
    'react/jsx-closing-tag-location': [OFF],
    'react/button-has-type': [WARN],
    'import/prefer-default-export': [WARN],
    'import/no-unresolved': [OFF],
    '@typescript-eslint/indent': [OFF],
    'consistent-return': [WARN],
    'jsx-a11y/label-has-for': [
      2,
      {
        components: ['Label'],
        required: {
          some: ['nesting', 'id'],
        },
        allowChildren: false,
      },
    ],
    'jsx-a11y/aria-props': [ERROR],
    'jsx-a11y/mouse-events-have-key-events': [ERROR],
    'jsx-a11y/role-has-required-aria-props': [ERROR],
    'jsx-a11y/role-supports-aria-props': [ERROR],
    'jsx-a11y/heading-has-content': [OFF],
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        labelComponents: ['label'],
        labelAttributes: ['htmlFor'],
        controlComponents: ['Text'],
      },
    ],
    'react/jsx-no-target-blank': [OFF],
    'no-console': 1,
    'no-confusing-arrow': [
      'error',
      {
        allowParens: true,
      },
    ],
    '@typescript-eslint/camelcase': [OFF],
    eqeqeq: [WARN],
  },
}
