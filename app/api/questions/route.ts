import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";

// GET /api/questions?module_id=xxx&category=xxx&page=1&limit=10
export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const module_id = searchParams.get("module_id");
    const category = searchParams.get("category");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limitParam = searchParams.get("limit");
    const limit = limitParam === "all" ? null : parseInt(limitParam || "10");

    if (!module_id) {
      return NextResponse.json(
        { error: "module_id is required" },
        { status: 400 },
      );
    }

    let countQuery =
      "SELECT COUNT(*) as count FROM questions WHERE module_id = ?";
    let query = "SELECT * FROM questions WHERE module_id = ?";
    const params: (string | number)[] = [module_id];

    if (category) {
      query += " AND category = ?";
      countQuery += " AND category = ?";
      params.push(category);
    }
    if (search) {
      query +=
        " AND (question_text LIKE ? OR correct_answer LIKE ? OR command_name LIKE ?)";
      countQuery +=
        " AND (question_text LIKE ? OR correct_answer LIKE ? OR command_name LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const total = (db.prepare(countQuery).get(...params) as { count: number })
      .count;

    query += " ORDER BY id ASC";

    if (limit !== null) {
      query += " LIMIT ? OFFSET ?";
      params.push(limit, (page - 1) * limit);
    }

    const questions = db.prepare(query).all(...params);

    return NextResponse.json({
      data: questions,
      total,
      page,
      limit: limitParam === "all" ? "all" : limit,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/questions
export async function POST(req: NextRequest) {
  try {
    const db = getDb();
    const body = await req.json();
    const {
      module_id,
      category,
      question_text,
      correct_answer,
      explanation,
      command_name,
      command_description,
      command_flags,
      command_examples,
      command_reference,
      command_syntax,
      command_options,
      command_arguments,
      command_how_it_works,
      command_system_impact,
      command_troubleshooting,
      command_security,
      command_related,
    } = body;

    if (!module_id || !category || !question_text || !correct_answer) {
      return NextResponse.json(
        {
          error:
            "module_id, category, question_text and correct_answer are required",
        },
        { status: 400 },
      );
    }

    const moduleExists = db
      .prepare("SELECT id FROM modules WHERE id = ?")
      .get(module_id);
    if (!moduleExists)
      return NextResponse.json({ error: "Module not found" }, { status: 404 });

    const result = db
      .prepare(
        `
      INSERT INTO questions (module_id, category, question_text, correct_answer, explanation, command_name, command_description, command_flags, command_examples, command_reference, command_syntax, command_options, command_arguments, command_how_it_works, command_system_impact, command_troubleshooting, command_security, command_related)
      VALUES (@module_id, @category, @question_text, @correct_answer, @explanation, @command_name, @command_description, @command_flags, @command_examples, @command_reference, @command_syntax, @command_options, @command_arguments, @command_how_it_works, @command_system_impact, @command_troubleshooting, @command_security, @command_related)
    `,
      )
      .run({
        module_id,
        category,
        question_text,
        correct_answer,
        explanation: explanation || "",
        command_name: command_name || "",
        command_description: command_description || "",
        command_flags: command_flags ? JSON.stringify(command_flags) : "[]",
        command_examples: command_examples
          ? JSON.stringify(command_examples)
          : "[]",
        command_reference: command_reference || "",
        command_syntax: command_syntax || "",
        command_options: command_options || "",
        command_arguments: command_arguments || "",
        command_how_it_works: command_how_it_works || "",
        command_system_impact: command_system_impact || "",
        command_troubleshooting: command_troubleshooting || "",
        command_security: command_security || "",
        command_related: command_related || "",
      });

    const question = db
      .prepare("SELECT * FROM questions WHERE id = ?")
      .get(result.lastInsertRowid);
    return NextResponse.json({ data: question }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
