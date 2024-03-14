import type { Config } from '@jest/types';

const customJestConfig: Config.InitialOptions = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testMatch: ['<rootDir>/src/__tests__/**/*.spec.ts'],
  testPathIgnorePatterns: ['<rootDir>/iac'],
};

module.exports = async function () {
  return customJestConfig;
};
