import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST } from '../../app/api/projetos/route';
import { PUT, DELETE } from '../../app/api/projetos/[id]/route';
import { NextRequest } from 'next/server';
import getDb from '../../lib/db';

describe('Projetos Senior API Integration (CRUD)', () => {
  const db = getDb();
  let testProjectId: number;

  beforeEach(() => {
    // Tests are cleaned up by setup.ts if it clears tables,
    // but for safety, we can delete the specific ones we create
    db.prepare("DELETE FROM senior_projects WHERE title LIKE 'Test Project%'").run();
  });

  describe('POST /api/projetos (Create)', () => {
    it('creates a new senior project successfully with all fields', async () => {
      const payload = {
        title: 'Test Project Create',
        scenario: 'A scenario to test',
        requirements: 'Some requirements',
        duration: '1 week',
        dependencies: 'None',
        detailed_description: 'This is a long description',
        technologies: 'Node, React',
        code_examples: 'console.log("hello");',
        references_links: 'http://link.com',
        mock_test_logs: '[INFO] Starting test...'
      };
      
      const req = new NextRequest('http://localhost/api/projetos', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.id).toBeGreaterThan(0);
      expect(json.title).toBe('Test Project Create');
      testProjectId = json.id; // save for next tests

      // Verify in DB
      const row = db.prepare('SELECT * FROM senior_projects WHERE id = ?').get(json.id) as any;
      expect(row).toBeDefined();
      expect(row.title).toBe('Test Project Create');
      expect(row.scenario).toBe('A scenario to test');
      expect(row.requirements).toBe('Some requirements');
      expect(row.duration).toBe('1 week');
      expect(row.dependencies).toBe('None');
      expect(row.detailed_description).toBe('This is a long description');
      expect(row.technologies).toBe('Node, React');
      expect(row.code_examples).toBe('console.log("hello");');
      expect(row.references_links).toBe('http://link.com');
      expect(row.mock_test_logs).toBe('[INFO] Starting test...');
    });
  });

  describe('GET /api/projetos (Read)', () => {
    it('returns a list of senior projects including the one created', async () => {
      // Create one directly in DB
      const info = db.prepare(`
        INSERT INTO senior_projects (
          title, scenario, requirements, duration, dependencies,
          detailed_description, technologies, code_examples, references_links, mock_test_logs
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'Test Project Read', 'Scenario R', 'Req R', 'Dur R', 'Dep R',
        'Desc R', 'Tech R', 'Code R', 'Ref R', 'Log R'
      );

      const res = await GET();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(1);
      
      const project = data.find((p: any) => p.id === info.lastInsertRowid);
      expect(project).toBeDefined();
      expect(project.title).toBe('Test Project Read');
    });
  });

  describe('PUT /api/projetos/[id] (Update)', () => {
    it('updates an existing senior project with new data', async () => {
      // Create first
      const info = db.prepare(`
        INSERT INTO senior_projects (title, scenario, requirements, duration) VALUES (?, ?, ?, ?)
      `).run('Test Project To Update', 'Old Scenario', 'Old Req', 'Old Dur');

      const updateId = info.lastInsertRowid;

      const payload = {
        title: 'Test Project Updated',
        scenario: 'New Scenario',
        requirements: 'New Req',
        duration: '2 weeks',
        dependencies: 'New Dep',
        detailed_description: 'New Desc',
        technologies: 'New Tech',
        code_examples: 'New Code',
        references_links: 'New Ref',
        mock_test_logs: 'New Logs'
      };

      const req = new NextRequest(`http://localhost/api/projetos/${updateId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      const res = await PUT(req, { params: Promise.resolve({ id: updateId.toString() }) });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.title).toBe('Test Project Updated');

      // Verify in DB
      const row = db.prepare('SELECT * FROM senior_projects WHERE id = ?').get(updateId) as any;
      expect(row.title).toBe('Test Project Updated');
      expect(row.scenario).toBe('New Scenario');
      expect(row.requirements).toBe('New Req');
      expect(row.duration).toBe('2 weeks');
      expect(row.dependencies).toBe('New Dep');
      expect(row.detailed_description).toBe('New Desc');
      expect(row.technologies).toBe('New Tech');
      expect(row.code_examples).toBe('New Code');
      expect(row.references_links).toBe('New Ref');
      expect(row.mock_test_logs).toBe('New Logs');
    });
  });

  describe('DELETE /api/projetos/[id] (Delete)', () => {
    it('deletes an existing senior project', async () => {
      // Create first
      const info = db.prepare(`
        INSERT INTO senior_projects (title, scenario, requirements, duration) VALUES (?, ?, ?, ?)
      `).run('Test Project To Delete', 'Scenario D', 'Req D', 'Dur D');

      const deleteId = info.lastInsertRowid;

      const req = new NextRequest(`http://localhost/api/projetos/${deleteId}`, {
        method: 'DELETE',
      });

      const res = await DELETE(req, { params: Promise.resolve({ id: deleteId.toString() }) });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.message).toBe('Project deleted successfully');

      // Verify in DB
      const row = db.prepare('SELECT * FROM senior_projects WHERE id = ?').get(deleteId);
      expect(row).toBeUndefined();
    });
  });
});
