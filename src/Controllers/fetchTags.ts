import type { Response } from 'express';
import type { TagsData } from '../types';

const fetchTags = async (
  res: Response,
  query: string,
  formatData: (data: TagsData) => object,
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
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    }
    if (result.errors) {
      return res.send(result);
    }

    return res.json(formatData(result.data));
  } catch (err) {
    console.error('Error: ', err);
    return res.send(err);
  }
};

export default fetchTags;
