/** @type {import('jest').Config} */
const config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text-summary'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@features/(.*)$': '<rootDir>/src/app/features/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
  },
};

module.exports = config;
