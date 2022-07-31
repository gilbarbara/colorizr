module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  globals: {
    'ts-jest': {
      tsconfig: 'test/tsconfig.json',
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  preset: 'ts-jest',
  testMatch: null,
  testRegex: '/test/.*?\\.(test|spec)\\.ts$',
  verbose: false,
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
