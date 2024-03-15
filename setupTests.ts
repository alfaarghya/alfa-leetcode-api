/**
 * @jest-environment node
 */

import { server } from './src/__tests__/msw';

beforeAll(() => {
  server.listen();
});

afterAll(() => server.close());
