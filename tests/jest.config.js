
const { resolve } = require('path');
const root = resolve(__dirname, '..');

const rootConfig = require(`${root}/jest.config.js`);

module.exports = {
  ...rootConfig,
  rootDir: root,
  displayName: 'end2end-tests',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
}
