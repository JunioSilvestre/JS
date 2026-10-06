import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST } from '../../app/api/questions/route';
import { NextRequest } from 'next/server';
import getDb from '../../lib/db';

describe('Questions API Integration', () => {
  const db = getDb();

  beforeEach(() => {
    db.prepare('INSERT INTO modules (id, title) VALUES (?, ?)').run('test-mod', 'Test Mod');
  });

  describe('POST /api/questions', () => {
    it('creates a new question successfully', async () => {
      const payload = {
        module_id: 'test-mod',
        category: 'Networking',
        question_text: 'What is loopback IP?',
        correct_answer: '127.0.0.1',
      };
      
      const req = new NextRequest('http://localhost/api/questions', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.data.question_text).toBe('What is loopback IP?');
      expect(json.data.category).toBe('Networking');

      // Verify in DB
      const row = db.prepare('SELECT * FROM questions WHERE id = ?').get(json.data.id) as any;
      expect(row).toBeDefined();
      expect(row.correct_answer).toBe('127.0.0.1');
    });

    it('returns 400 when missing required fields', async () => {
      const payload = {
        module_id: 'test-mod',
        category: 'Networking',
      };
      
      const req = new NextRequest('http://localhost/api/questions', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toMatch(/are required/);
    });

    it('returns 404 when module does not exist', async () => {
      const payload = {
        module_id: 'non-existent',
        category: 'Networking',
        question_text: 'Q?',
        correct_answer: 'A',
      };
      
      const req = new NextRequest('http://localhost/api/questions', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/questions', () => {
    it('returns a list of questions for a module', async () => {
      db.prepare(`
        INSERT INTO questions (module_id, category, question_text, correct_answer) 
        VALUES (?, ?, ?, ?)
      `).run('test-mod', 'Networking', 'Q1', 'A1');

      const req = new NextRequest('http://localhost/api/questions?module_id=test-mod');
      const res = await GET(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.length).toBeGreaterThanOrEqual(1);
      expect(json.data[0].question_text).toBe('Q1');
    });

    it('returns 400 if module_id is missing', async () => {
      const req = new NextRequest('http://localhost/api/questions');
      const res = await GET(req);
      
      expect(res.status).toBe(400);
    });
  });
});
