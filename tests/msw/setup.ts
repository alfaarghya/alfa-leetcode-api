import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './server';

// Start MSW server before all tests
beforeAll(() => {
  server.listen({
    onUnhandledRequest: (req) => {
      // Allow requests to localhost/127.0.0.1 (your Express app) to pass through
      // Only error on unhandled external requests
      const url = new URL(req.url);
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return; // bypass - don't intercept local requests
      }
      console.error(`Found an unhandled ${req.method} request to ${req.url}`);
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
