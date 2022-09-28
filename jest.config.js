module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime).+(js|jsx)$',
  ],
};
