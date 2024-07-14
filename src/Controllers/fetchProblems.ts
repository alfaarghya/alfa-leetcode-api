import { Response } from 'express';
import { ProblemSetQuestionListData } from '../types';

const fetchProblems = async (
  options: { limit: number; skip: number; tags: string },
  res: Response,
  formatData: (data: ProblemSetQuestionListData) => {},
  query: string
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
          categorySlug: '',
          skip: options.skip || 0,
          limit: options.limit || 20, //by default get 20 question
          filters: { tags: options.tags ? options.tags.split(' ') : ' ' }, //filter by tags
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      return res.send(result);
    }
    return res.json(formatData(result.data));
  } catch (err) {
    console.error('Error: ', err);
    return res.send(err);
  }
};

export default fetchProblems;
