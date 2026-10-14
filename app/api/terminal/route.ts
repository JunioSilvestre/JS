import { NextResponse } from 'next/server';
import getDb from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const db = getDb();
    let stmt;
    let data;
    
    if (category && category !== 'All') {
      stmt = db.prepare('SELECT * FROM terminal_commands WHERE category = ? ORDER BY id DESC');
      data = stmt.all(category);
    } else {
      stmt = db.prepare('SELECT * FROM terminal_commands ORDER BY id DESC');
      data = stmt.all();
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching terminal commands:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, title, category, description, examples, options, script_content } = body;
    
    if (!type || !title || !category || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO terminal_commands (type, title, category, description, examples, options, script_content)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(type, title, category, description, examples || '', options || '', script_content || '');
    
    return NextResponse.json({ id: info.lastInsertRowid, success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating terminal command:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
