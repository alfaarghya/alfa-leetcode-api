import type { Response } from 'express';
import type { DailyProblemData, SelectProblemData } from '../types';

const fetchSingleProblem = async (
  res: Response,
  query: string,
  titleSlug: string | null,
  formatData?: (data: DailyProblemData & SelectProblemData) => void,
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
          titleSlug, //search question using titleSlug
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
    return res.send(err);
  }
};

export default fetchSingleProblem;
