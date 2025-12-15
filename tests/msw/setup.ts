import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './server';

// Start MSW server before all tests
beforeAll(() => {
  server.listen({
    onUnhandledRequest: (req) => {
      // Allow requests to localhost/127.0.0.1 (your Express app) to pass through
      // Only warn on unhandled external requests (not errors to avoid test failures)
      const url = new URL(req.url);
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return; // bypass - don't intercept local requests
      }
      // Warn instead of error to help debugging
      console.warn(`[MSW] Unhandled ${req.method} request to ${req.url}`);
    },
  });
});

// Reset handlers after each test to ensure test isolation
afterEach(() => {
  server.resetHandlers();
});

// Clean up and close server after all tests
afterAll(() => {
  server.close();
});
