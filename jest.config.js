module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transform: {
        '^.+\\.js$': ['babel-jest', {
            presets: ['@babel/preset-env']
        }]
    },
    testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    verbose: true
};