/** @type {import('jest').Config} */
const config = {
  transform: {
    '\\.[jt]sx?$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
}

module.exports = config
