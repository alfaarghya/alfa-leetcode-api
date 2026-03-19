import type { Response } from 'express';

const fetchUserDetails = async <T, U>(
  options: { username: string; limit: number; year: number },
  res: Response,
  query: string,
  formatData?: (data: T) => U,
  endpoint = 'https://leetcode.com/graphql',
) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: query,
        variables: {
          username: options.username, //username required
          limit: options.limit, //only for submission
          year: options.year,
        },
      }),
    });

    const responseText = await response.text();
    let result: { data?: T; errors?: unknown };

    try {
      result = JSON.parse(responseText) as { data?: T; errors?: unknown };
    } catch {
      return res.status(502).json({
        error: 'Upstream service returned non-JSON response',
        upstreamStatus: response.status,
        endpoint,
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Upstream service request failed',
        upstreamStatus: response.status,
        endpoint,
        details: result.errors ?? null,
      });
    }

    if (result.errors) {
      return res.send(result);
    }

    if (result.data == null) {
      return res.status(502).json({
        error: 'Upstream service returned empty payload',
        endpoint,
      });
    }

    if (formatData == null) {
      return res.json(result.data);
    }

    return res.json(formatData(result.data));
  } catch (err) {
    console.error('Error: ', err);
    return res.send(err.message);
  }
};

export default fetchUserDetails;
