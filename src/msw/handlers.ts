import * as msw from 'msw';
import singleUser from './mockData/singleUser.json';
export const handlers = [
  // Intercept the "GET /resource" request.
  msw.http.post('https://leetcode.com/graphql', async (ctx) => {
    const test = await ctx.request.json();
    const typed = test as { query: string };
    if (typed.query.indexOf('getUserProfile') !== -1) {
      return msw.HttpResponse.json(singleUser);
    }

    return msw.HttpResponse.json({});
  }),
];
