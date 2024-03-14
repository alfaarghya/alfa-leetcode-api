/**
 * @jest-environment node
 */

import { server } from './src/msw';

beforeAll(() => {
  server.listen();
});

afterAll(() => server.close());
