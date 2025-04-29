const { jest, expect, beforeEach, afterEach, describe, it, test } = require('@jest/globals');
require('@testing-library/jest-dom');

global.jest = jest;
global.expect = expect;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.describe = describe;
global.it = it;
global.test = test;

// Mock fetch globally
global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
}));

// Reset mocks between tests
beforeEach(() => {
    jest.clearAllMocks();
});