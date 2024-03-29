module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/infra/repos/postgres/migrations/*.ts',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  moduleNameMapper: {
    '@/tests/(.+)': '<rootDir>/tests/$1',
    '@/(.+)': '<rootDir>/src/$1',
  },
  testMatch: ['**/*.spec.ts'],
  setupFilesAfterEnv: ['jest-extended/all'],
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  transform: {
    '\\.ts': 'ts-jest',
  },
  clearMocks: true,
}
