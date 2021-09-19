/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
require('dotenv/config');
const { resolve } = require('path');
const root = resolve(__dirname);

module.exports = {
  rootDir: root,
  displayName: 'unit-tests',
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
};
