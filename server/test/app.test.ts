import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/index';

describe('API', () => {
  it('creates a new room', async () => {
    const res = await request(app).post('/api/rooms');
    expect(res.status).toBe(200);
    expect(typeof res.body.code).toBe('string');
    expect(res.body.code).toHaveLength(6);
  });

  it('publishing unknown question returns 404', async () => {
    const res = await request(app).post('/api/questions/nonexistent/publish');
    expect(res.status).toBe(404);
  });
});
