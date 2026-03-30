const request = require('supertest');
const { app, initDB } = require('../server');

let createdId;

beforeAll(async () => {
  await initDB();
});

/* ---------- Health / Static ---------- */
describe('Static & health', () => {
  test('GET / serves index.html', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });

  test('GET /api/tasks returns array', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

/* ---------- CRUD ---------- */
describe('Task CRUD', () => {
  test('POST /api/tasks creates a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', priority: 'P1', type: 'feature', status: 'todo' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Task');
    expect(res.body.id).toBeDefined();
    createdId = res.body.id;
  });

  test('GET /api/tasks/:id returns the task', async () => {
    const res = await request(app).get(`/api/tasks/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Test Task');
  });

  test('PUT /api/tasks/:id updates the task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdId}`)
      .send({ title: 'Updated Task', priority: 'P2' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Task');
    expect(res.body.priority).toBe('P2');
  });

  test('GET /api/tasks/:id/history returns change history', async () => {
    const res = await request(app).get(`/api/tasks/${createdId}/history`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Should have history from create + update
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test('POST /api/tasks/:id/clone clones the task', async () => {
    const res = await request(app).post(`/api/tasks/${createdId}/clone`);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Updated Task');
    expect(res.body.id).not.toBe(createdId);
    expect(res.body.status).toBe('todo');
  });

  test('DELETE /api/tasks/:id removes the task', async () => {
    const res = await request(app).delete(`/api/tasks/${createdId}`);
    expect(res.status).toBe(200);
  });

  test('GET /api/tasks/:id returns 404 after deletion', async () => {
    const res = await request(app).get(`/api/tasks/${createdId}`);
    expect(res.status).toBe(404);
  });
});

/* ---------- Validation ---------- */
describe('Validation', () => {
  test('POST with empty title returns 400', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: '', priority: 'P1', type: 'feature', status: 'todo' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Title/i);
  });

  test('POST with missing title returns 400', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ priority: 'P1', type: 'feature', status: 'todo' });
    expect(res.status).toBe(400);
  });

  test('POST with invalid priority returns 400', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'X', priority: 'P9', type: 'feature', status: 'todo' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/priority/i);
  });

  test('POST with invalid type returns 400', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'X', priority: 'P1', type: 'epic', status: 'todo' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/type/i);
  });

  test('POST with invalid status returns 400', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'X', priority: 'P1', type: 'feature', status: 'archived' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/status/i);
  });

  test('POST with title exceeding max length returns 400', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'A'.repeat(201), priority: 'P1', type: 'feature', status: 'todo' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  test('PUT with invalid fields returns 400', async () => {
    // Create a task first
    const create = await request(app)
      .post('/api/tasks')
      .send({ title: 'Valid', priority: 'P1', type: 'feature', status: 'todo' });
    const id = create.body.id;

    const res = await request(app)
      .put(`/api/tasks/${id}`)
      .send({ priority: 'P99' });
    expect(res.status).toBe(400);

    // Cleanup
    await request(app).delete(`/api/tasks/${id}`);
  });

  test('PUT non-existent task returns 404', async () => {
    const res = await request(app)
      .put('/api/tasks/non-existent-id')
      .send({ title: 'X' });
    expect(res.status).toBe(404);
  });

  test('DELETE non-existent task returns 404', async () => {
    const res = await request(app).delete('/api/tasks/non-existent-id');
    expect(res.status).toBe(404);
  });
});

/* ---------- Analytics ---------- */
describe('Analytics', () => {
  test('GET /api/analytics returns expected shape', async () => {
    const res = await request(app).get('/api/analytics');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('statusDist');
    expect(res.body).toHaveProperty('priorityDist');
    expect(res.body).toHaveProperty('weeklyVelocity');
    expect(res.body).toHaveProperty('burndown');
    expect(res.body).toHaveProperty('typeDist');
    expect(res.body).toHaveProperty('totalTasks');
  });
});

/* ---------- Export / Import ---------- */
describe('Export & Import', () => {
  test('GET /api/export returns JSON array', async () => {
    const res = await request(app).get('/api/export');
    expect(res.status).toBe(200);
    expect(res.headers['content-disposition']).toMatch(/attachment/);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/import imports tasks', async () => {
    const tasks = [
      { title: 'Imported 1', priority: 'P1', type: 'feature', status: 'todo' },
      { title: 'Imported 2', priority: 'P2', type: 'bug', status: 'dev' },
    ];
    const res = await request(app)
      .post('/api/import')
      .send(tasks);
    expect(res.status).toBe(200);
    expect(res.body.imported).toBe(2);
  });

  test('POST /api/import skips invalid tasks', async () => {
    const tasks = [
      { title: 'Good', priority: 'P1', type: 'feature', status: 'todo' },
      { title: '', priority: 'P1', type: 'feature', status: 'todo' }, // invalid
    ];
    const res = await request(app)
      .post('/api/import')
      .send(tasks);
    expect(res.status).toBe(200);
    expect(res.body.imported).toBe(1);
    expect(res.body.total).toBe(2);
  });

  test('POST /api/import rejects non-array', async () => {
    const res = await request(app)
      .post('/api/import')
      .send({ title: 'Not an array' });
    expect(res.status).toBe(400);
  });
});

/* ---------- Global History ---------- */
describe('Global History', () => {
  test('GET /api/history returns array', async () => {
    const res = await request(app).get('/api/history');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/history respects limit param', async () => {
    const res = await request(app).get('/api/history?limit=2');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(2);
  });
});
