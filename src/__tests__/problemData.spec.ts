import request from 'supertest';
import assert from 'assert';
import app from '../app';

describe('Problem Data Tests', () => {
  it('Should fetch the daily problem', async () => {
    const response = await request(app).get('/daily');
    [
      'questionLink',
      'date',
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
    ].forEach((key) => {
      assert(key in response.body);
    });
  });

  it('Should fetch a list of problems', async () => {
    const response = await request(app).get('/problems');
    ['totalQuestions', 'count', 'problemsetQuestionList'].forEach((key) => {
      assert(key in response.body);
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
    ].forEach((key) => assert(key in response.body));
  });
});
