module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  testPathIgnorePatterns: ['/node_modules/', '/build/', '.*.factory.(ts|js)'],
  collectCoverageFrom: ['src/**/*.{ts,js}'],
  testMatch: ['**/*.spec.ts'],
}
