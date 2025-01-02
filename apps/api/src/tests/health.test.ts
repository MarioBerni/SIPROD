import request from 'supertest';
import { _app } from '../app';

describe('Health Check Endpoint', () => {
  it('should return 200 OK', async () => {
    const response = await request(_app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});
