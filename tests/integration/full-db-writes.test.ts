import { describe, it, expect, beforeEach } from 'vitest';
import { POST as POST_MODULE } from '../../app/api/modules/route';
import { POST as POST_INFRA_CAT } from '../../app/api/infra-categories/route';
import { POST as POST_INFRA_PROJ } from '../../app/api/infra-projects/route';
import { NextRequest } from 'next/server';
import getDb from '../../lib/db';

describe('Full DB Writes Integration (All Fields)', () => {
  const db = getDb();

  beforeEach(() => {
    db.prepare('DELETE FROM infra_projects').run();
    db.prepare('DELETE FROM infra_categories').run();
    db.prepare('DELETE FROM modules').run();
  });

  it('should insert a complete module with all fields', async () => {
    const payload = {
      id: 'full-test-module-1',
      title: 'Complete Module Title',
      description: 'A complete description for the module test.',
      provider: 'TestProvider',
      certification: 'TestCert 101',
      difficulty: 'Intermediate',
      color: '#ff0000',
    };
    
    const req = new NextRequest('http://localhost/api/modules', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const res = await POST_MODULE(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.data.id).toBe('full-test-module-1');

    // Verify in DB
    const row = db.prepare('SELECT * FROM modules WHERE id = ?').get('full-test-module-1') as any;
    expect(row).toBeDefined();
    expect(row.title).toBe(payload.title);
    expect(row.description).toBe(payload.description);
    expect(row.provider).toBe(payload.provider);
    expect(row.certification).toBe(payload.certification);
    expect(row.difficulty).toBe(payload.difficulty);
    expect(row.color).toBe(payload.color);
  });

  it('should insert a complete infra project with all fields', async () => {
    // First create a category
    const catPayload = {
      id: 'infra-cat-test',
      label: 'Infra Category Test',
      type: 'projects'
    };
    const catReq = new NextRequest('http://localhost/api/infra-categories', {
      method: 'POST',
      body: JSON.stringify(catPayload),
    });
    await POST_INFRA_CAT(catReq);

    // Now create the infra project
    const projPayload = {
      category_id: 'infra-cat-test',
      name: 'Full Infra Project',
      reqs: ['Req 1', 'Req 2'],
      ext: 'ext-link',
      level: 'expert',
      time: '2h',
      priority: 'alta',
      objective: 'Main Objective',
      scenario: '# Bash Scenario\necho "Hello"',
      prereqs: ['Pre 1', 'Pre 2'],
      certs: ['Cert 1', 'Cert 2'],
      interview: 'Interview question details here.',
      certTip: 'This is a tip.',
      status: 'done',
      concepts: { concept1: 'value1' },
      checklist: { item1: true, item2: false },
    };
    
    const req = new NextRequest('http://localhost/api/infra-projects', {
      method: 'POST',
      body: JSON.stringify(projPayload),
    });

    const res = await POST_INFRA_PROJ(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.data.name).toBe(projPayload.name);

    // Verify in DB
    const row = db.prepare('SELECT * FROM infra_projects WHERE id = ?').get(json.data.id) as any;
    expect(row).toBeDefined();
    expect(row.category_id).toBe(projPayload.category_id);
    expect(row.name).toBe(projPayload.name);
    
    // SQLite stores objects/arrays as JSON strings, check parsing
    expect(JSON.parse(row.reqs)).toEqual(projPayload.reqs);
    expect(JSON.parse(row.prereqs)).toEqual(projPayload.prereqs);
    expect(JSON.parse(row.certs)).toEqual(projPayload.certs);
    expect(JSON.parse(row.concepts)).toEqual(projPayload.concepts);
    expect(JSON.parse(row.checklist)).toEqual(projPayload.checklist);
    
    // Check strings
    expect(row.ext).toBe(projPayload.ext);
    expect(row.level).toBe(projPayload.level);
    expect(row.time).toBe(projPayload.time);
    expect(row.priority).toBe(projPayload.priority);
    expect(row.objective).toBe(projPayload.objective);
    expect(row.scenario).toBe(projPayload.scenario);
    expect(row.interview).toBe(projPayload.interview);
    expect(row.certTip).toBe(projPayload.certTip);
    expect(row.status).toBe(projPayload.status);
  });
});
