import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../../src/app';

describe('Problem Data Tests', () => {
  it('Should fetch a list of problems', async () => {
    const response = await request(app).get('/problems');
    ['totalQuestions', 'count', 'problemsetQuestionList'].forEach((key) => {
      expect(response.body).toHaveProperty(key);
    });
  });

  it('Should Select a Problem', async () => {
    const response = await request(app).get('/select?titleSlug=two-sum');
    [
      'link',
      'questionId',
      'questionFrontendId',
      'questionTitle',
      'titleSlug',
      'difficulty',
      'isPaidOnly',
      'question',
      'exampleTestcases',
      'topicTags',
      'hints',
      'solution',
      'companyTagStats',
      'likes',
      'dislikes',
      'similarQuestions',
    ].forEach((key) => expect(response.body).toHaveProperty(key));
  });
});
