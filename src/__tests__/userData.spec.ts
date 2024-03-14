import request from 'supertest';
import app from '../app';

describe('User Data Tests', () => {
  it('should fetch a single user', async () => {
    const response = await request(app).get('/jambobjones');
    expect(response.body.username).toBe('jambobjones');
  });
});
