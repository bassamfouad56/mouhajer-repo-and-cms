module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'plugin:@next/next/recommended'],
  plugins: ['unused-imports', 'jsx-a11y'],
  rules: {
    'unused-imports/no-unused-imports': 'error',
    'react/no-danger': 'off',
  },
};

