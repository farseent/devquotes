const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('GET /api/quotes', () => {
  it('should return an empty array initially', async () => {
    const res = await request(app).get('/api/quotes');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /api/quotes', () => {
  it('should create a new quote', async () => {
    const res = await request(app)
      .post('/api/quotes')
      .send({ text: 'Code is poetry', author: 'Farseen' });

    expect(res.status).toBe(201);
    expect(res.body.text).toBe('Code is poetry');
    expect(res.body.author).toBe('Farseen');
  });

  it('should return 400 if text is missing', async () => {
    const res = await request(app)
      .post('/api/quotes')
      .send({ author: 'Farseen' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should return 400 if author is missing', async () => {
    const res = await request(app)
      .post('/api/quotes')
      .send({ text: 'Code is poetry' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});