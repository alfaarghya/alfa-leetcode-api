import type { Response } from 'express';
import type {
  LeetCodeCredentials,
  SolvedQuestion,
  SolvedQuestionsData,
} from '../types';

const PAGE_SIZE = 100;
const MAX_PAGES = 100; //bound the upstream calls made per request

const buildHeaders = (
  credentials: LeetCodeCredentials,
): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Referer: 'https://leetcode.com',
    Cookie: credentials.csrfToken
      ? `LEETCODE_SESSION=${credentials.session}; csrftoken=${credentials.csrfToken}`
      : `LEETCODE_SESSION=${credentials.session}`,
  };

  if (credentials.csrfToken) {
    headers['x-csrftoken'] = credentials.csrfToken;
  }

  return headers;
};

const fetchPage = async (
  query: string,
  headers: Record<string, string>,
  skip: number,
) => {
  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: query,
      variables: {
        filters: {
          questionStatus: 'SOLVED',
          skip,
          limit: PAGE_SIZE,
        },
      },
    }),
  });

  if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const fetchSolvedQuestions = async (
  res: Response,
  query: string,
  credentials: LeetCodeCredentials,
  formatData: (questions: SolvedQuestion[], totalNum: number) => object,
) => {
  if (!credentials.session) {
    return res.status(503).json({
      error: 'This route is not configured on the server',
      solution:
        'Set LEETCODE_SESSION (and optionally LEETCODE_CSRF_TOKEN) in the server environment, then restart',
    });
  }

  const headers = buildHeaders(credentials);

  try {
    const questions: SolvedQuestion[] = [];
    let totalNum = 0;

    for (let page = 0; page < MAX_PAGES; page++) {
      const result = await fetchPage(query, headers, questions.length);

      if (result.errors) {
        return res.status(502).json({
          error: 'LeetCode GraphQL responded with errors',
          details: result.errors,
        });
      }

      const list = (result.data as SolvedQuestionsData | undefined)
        ?.userProgressQuestionList;

      // LeetCode answers a missing, invalid or expired session with a silent
      // null payload and HTTP 200, so null has to be read as an auth failure.
      if (!list) {
        return res.status(401).json({
          error: 'LeetCode rejected the session cookie',
          solution:
            'LEETCODE_SESSION is invalid or expired (they last about 14 days). Sign in to leetcode.com, copy a fresh value and restart the server',
        });
      }

      totalNum = list.totalNum ?? 0;
      const pageQuestions = list.questions ?? [];

      //an empty page is the only unambiguous end of the list
      if (pageQuestions.length === 0) {
        break;
      }

      // skip advances by what LeetCode actually returned rather than by
      // PAGE_SIZE, because it caps page sizes on some fields without saying so
      questions.push(...pageQuestions);

      if (totalNum > 0) {
        if (questions.length >= totalNum) {
          break;
        }
      } else if (pageQuestions.length < PAGE_SIZE) {
        //no totalNum to page against, so fall back to a short page
        break;
      }
    }

    return res.json(formatData(questions, totalNum));
  } catch (err) {
    console.error('Error: ', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default fetchSolvedQuestions;
