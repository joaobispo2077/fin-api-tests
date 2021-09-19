/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const { resolve } = require('path');
const root = resolve(__dirname);

module.exports = {
  rootDir: root,
  displayName: 'unit-test',
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  testMatch: ['<rootDir>/src/**/*.(spec|test).ts'],
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
};
