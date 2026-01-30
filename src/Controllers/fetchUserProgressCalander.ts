import type { Response } from 'express';
import config from '../config';

const fetchUserProgressCalendar = async (
  options: {
    queryType: string;
    year: number;
    month: number;
    groupByWeek: boolean;
  },
  res: Response,
  query: string,
) => {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com/',
        'x-csrftoken': config.LEETCODE_CSRF,
        Cookie: 'skibidi toilet',
      },
      body: JSON.stringify({
        query,
        variables: {
          queryType: options.queryType,
          year: options.year,
          month: options.month,
          groupByWeek: options.groupByWeek,
        },
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('HTTP error:', response.status, result);
      return res.status(response.status).send(result);
    }

    if (result.errors) {
      return res.status(400).send(result);
    }

    return res.json(result.data);
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).send(err);
  }
};

export default fetchUserProgressCalendar;
