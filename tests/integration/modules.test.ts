import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST } from '../../app/api/modules/route';
import { NextRequest } from 'next/server';
import getDb from '../../lib/db';

describe('Modules API Integration', () => {
  const db = getDb();

  beforeEach(() => {
    // Tests are cleaned up by setup.ts, but we can also ensure specific state here.
  });

  describe('POST /api/modules', () => {
    it('creates a new module successfully', async () => {
      const payload = {
        id: 'test-module-1',
        title: 'Test Module',
        description: 'A test module',
      };
      
      const req = new NextRequest('http://localhost/api/modules', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.data.id).toBe('test-module-1');
      expect(json.data.title).toBe('Test Module');

      // Verify in DB
      const row = db.prepare('SELECT * FROM modules WHERE id = ?').get('test-module-1') as any;
      expect(row).toBeDefined();
      expect(row.title).toBe('Test Module');
    });

    it('returns 400 for invalid ID format', async () => {
      const payload = {
        id: 'Invalid ID!',
        title: 'Test Module',
      };
      
      const req = new NextRequest('http://localhost/api/modules', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toMatch(/lowercase alphanumeric/);
    });

    it('returns 409 for duplicate ID', async () => {
      db.prepare('INSERT INTO modules (id, title) VALUES (?, ?)').run('test-dup', 'Existing');
      
      const payload = {
        id: 'test-dup',
        title: 'Another Title',
      };
      
      const req = new NextRequest('http://localhost/api/modules', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const res = await POST(req);
      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/modules', () => {
    it('returns a list of modules', async () => {
      db.prepare('INSERT INTO modules (id, title) VALUES (?, ?)').run('m1', 'Module 1');
      db.prepare('INSERT INTO modules (id, title) VALUES (?, ?)').run('m2', 'Module 2');

      const req = new NextRequest('http://localhost/api/modules');
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.length).toBeGreaterThanOrEqual(2);
      expect(json.data.map((m: any) => m.id)).toContain('m1');
      expect(json.data.map((m: any) => m.id)).toContain('m2');
    });
  });
});
