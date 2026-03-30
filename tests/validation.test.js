/**
 * Frontend validation logic tests.
 *
 * These tests verify the validation rules that exist in both
 * public/app.js (client) and server.js (server) stay in sync.
 * The rules are duplicated here to test independently of the DOM.
 */

const VALID_PRIORITIES = ['P1', 'P2', 'P3'];
const VALID_TYPES = ['feature', 'bug', 'idea'];
const VALID_STATUSES = ['backlog', 'todo', 'dev', 'done', 'publish'];
const LIMITS = { title: 200, desc: 2000, tags: 20, tagItem: 50, dependency: 200 };

// Mirror of validateTaskData from app.js (without i18n dependency)
function validateTaskData(data) {
  const errors = [];
  if (!data.title || !data.title.trim()) errors.push({ field: 'title', msg: 'Title required' });
  else if (data.title.length > LIMITS.title) errors.push({ field: 'title', msg: 'Title too long' });
  if (data.desc && data.desc.length > LIMITS.desc) errors.push({ field: 'desc', msg: 'Desc too long' });
  if (!VALID_PRIORITIES.includes(data.priority)) errors.push({ field: 'priority', msg: 'Invalid priority' });
  if (!VALID_TYPES.includes(data.type)) errors.push({ field: 'type', msg: 'Invalid type' });
  if (!VALID_STATUSES.includes(data.status)) errors.push({ field: 'status', msg: 'Invalid status' });
  if (data.tags && data.tags.length > LIMITS.tags) errors.push({ field: 'tags', msg: 'Too many tags' });
  if (data.dependency && data.dependency.length > LIMITS.dependency) errors.push({ field: 'dependency', msg: 'Dependency too long' });
  return errors;
}

const validTask = { title: 'Test', priority: 'P1', type: 'feature', status: 'todo' };

describe('validateTaskData', () => {
  test('accepts valid task data', () => {
    expect(validateTaskData(validTask)).toEqual([]);
  });

  test('rejects empty title', () => {
    const errors = validateTaskData({ ...validTask, title: '' });
    expect(errors.length).toBe(1);
    expect(errors[0].field).toBe('title');
  });

  test('rejects whitespace-only title', () => {
    const errors = validateTaskData({ ...validTask, title: '   ' });
    expect(errors.length).toBe(1);
    expect(errors[0].field).toBe('title');
  });

  test('rejects title over 200 chars', () => {
    const errors = validateTaskData({ ...validTask, title: 'A'.repeat(201) });
    expect(errors.length).toBe(1);
    expect(errors[0].field).toBe('title');
  });

  test('accepts title at exactly 200 chars', () => {
    const errors = validateTaskData({ ...validTask, title: 'A'.repeat(200) });
    expect(errors).toEqual([]);
  });

  test('rejects desc over 2000 chars', () => {
    const errors = validateTaskData({ ...validTask, desc: 'B'.repeat(2001) });
    expect(errors.length).toBe(1);
    expect(errors[0].field).toBe('desc');
  });

  test('accepts desc at exactly 2000 chars', () => {
    const errors = validateTaskData({ ...validTask, desc: 'B'.repeat(2000) });
    expect(errors).toEqual([]);
  });

  test('rejects invalid priority', () => {
    const errors = validateTaskData({ ...validTask, priority: 'P9' });
    expect(errors.some(e => e.field === 'priority')).toBe(true);
  });

  test('accepts all valid priorities', () => {
    for (const p of VALID_PRIORITIES) {
      expect(validateTaskData({ ...validTask, priority: p })).toEqual([]);
    }
  });

  test('rejects invalid type', () => {
    const errors = validateTaskData({ ...validTask, type: 'epic' });
    expect(errors.some(e => e.field === 'type')).toBe(true);
  });

  test('accepts all valid types', () => {
    for (const t of VALID_TYPES) {
      expect(validateTaskData({ ...validTask, type: t })).toEqual([]);
    }
  });

  test('rejects invalid status', () => {
    const errors = validateTaskData({ ...validTask, status: 'archived' });
    expect(errors.some(e => e.field === 'status')).toBe(true);
  });

  test('accepts all valid statuses', () => {
    for (const s of VALID_STATUSES) {
      expect(validateTaskData({ ...validTask, status: s })).toEqual([]);
    }
  });

  test('rejects too many tags', () => {
    const tags = Array.from({ length: 21 }, (_, i) => `tag${i}`);
    const errors = validateTaskData({ ...validTask, tags });
    expect(errors.some(e => e.field === 'tags')).toBe(true);
  });

  test('accepts 20 tags', () => {
    const tags = Array.from({ length: 20 }, (_, i) => `tag${i}`);
    expect(validateTaskData({ ...validTask, tags })).toEqual([]);
  });

  test('rejects dependency over 200 chars', () => {
    const errors = validateTaskData({ ...validTask, dependency: 'D'.repeat(201) });
    expect(errors.some(e => e.field === 'dependency')).toBe(true);
  });

  test('collects multiple errors at once', () => {
    const errors = validateTaskData({ title: '', priority: 'P9', type: 'epic', status: 'x' });
    expect(errors.length).toBeGreaterThanOrEqual(4);
  });
});

/* ---------- Constant sync check ---------- */
describe('Frontend/Backend constant sync', () => {
  // Read server.js constants to ensure they match
  const serverCode = require('fs').readFileSync(
    require('path').join(__dirname, '..', 'server.js'), 'utf8'
  );

  test('VALID_PRIORITIES match server.js', () => {
    const match = serverCode.match(/VALID_PRIORITIES\s*=\s*\[([^\]]+)\]/);
    expect(match).not.toBeNull();
    const serverPriorities = match[1].match(/'([^']+)'/g).map(s => s.replace(/'/g, ''));
    expect(serverPriorities).toEqual(VALID_PRIORITIES);
  });

  test('VALID_TYPES match server.js', () => {
    const match = serverCode.match(/VALID_TYPES\s*=\s*\[([^\]]+)\]/);
    expect(match).not.toBeNull();
    const serverTypes = match[1].match(/'([^']+)'/g).map(s => s.replace(/'/g, ''));
    expect(serverTypes).toEqual(VALID_TYPES);
  });

  test('VALID_STATUSES match server.js', () => {
    const match = serverCode.match(/VALID_STATUSES\s*=\s*\[([^\]]+)\]/);
    expect(match).not.toBeNull();
    const serverStatuses = match[1].match(/'([^']+)'/g).map(s => s.replace(/'/g, ''));
    expect(serverStatuses).toEqual(VALID_STATUSES);
  });

  test('LIMITS.title matches server.js', () => {
    const match = serverCode.match(/title:\s*(\d+)/);
    expect(match).not.toBeNull();
    expect(parseInt(match[1])).toBe(LIMITS.title);
  });

  test('LIMITS.desc matches server.js', () => {
    const match = serverCode.match(/desc:\s*(\d+)/);
    expect(match).not.toBeNull();
    expect(parseInt(match[1])).toBe(LIMITS.desc);
  });
});
