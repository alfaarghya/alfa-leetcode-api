import { Response } from 'express';

const fetchUserDetails = async <T, U>(
  options: { username: string; limit: number; year: number },
  res: Response,
  query: string,
  formatData?: (data: T) => U
) => {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
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

    const result = await response.json();

    if (result.errors) {
      return res.send(result);
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
