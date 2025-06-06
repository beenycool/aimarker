const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  displayName: 'Games Page Tests',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js'
  ],
  moduleNameMapping: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/'
  }),
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx'
      }
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: [
    '<rootDir>/app/games/**/*.test.{ts,tsx}'
  ],
  collectCoverageFrom: [
    'app/games/**/*.{ts,tsx}',
    '!app/games/**/*.test.{ts,tsx}',
    '!app/games/**/test-utils.{ts,tsx}',
    '!app/games/**/test-coverage-config.{ts,tsx}',
    '!app/games/**/run-ls3-tests.{js,ts}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    'app/games/page.tsx': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFiles: [
    '<rootDir>/jest.polyfills.js'
  ]
};