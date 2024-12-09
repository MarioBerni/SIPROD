module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['frontend', 'backend', 'shared', 'ui', 'config', 'types', 'docs']],
  },
};
