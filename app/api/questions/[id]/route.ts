import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";

// GET /api/questions/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const db = getDb();
    const { id } = await params;
    const question = db
      .prepare("SELECT * FROM questions WHERE id = ?")
      .get(Number(id));
    if (!question)
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    return NextResponse.json({ data: question });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/questions/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const db = getDb();
    const { id } = await params;
    const body = await req.json();
    const {
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

    if (!category || !question_text || !correct_answer) {
      return NextResponse.json(
        { error: "category, question_text and correct_answer are required" },
        { status: 400 },
      );
    }

    const existing = db
      .prepare("SELECT id FROM questions WHERE id = ?")
      .get(Number(id));
    if (!existing)
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );

    db.prepare(
      `
      UPDATE questions 
      SET category = @category, question_text = @question_text, correct_answer = @correct_answer,
          explanation = @explanation, command_name = @command_name, command_description = @command_description,
          command_flags = @command_flags, command_examples = @command_examples, command_reference = @command_reference,
          command_syntax = @command_syntax, command_options = @command_options, command_arguments = @command_arguments,
          command_how_it_works = @command_how_it_works, command_system_impact = @command_system_impact,
          command_troubleshooting = @command_troubleshooting, command_security = @command_security, command_related = @command_related,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `,
    ).run({
      id: Number(id),
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
      .get(Number(id));
    return NextResponse.json({ data: question });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/questions/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const db = getDb();
    const { id } = await params;

    const existing = db
      .prepare("SELECT id FROM questions WHERE id = ?")
      .get(Number(id));
    if (!existing)
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );

    db.prepare("DELETE FROM questions WHERE id = ?").run(Number(id));
    return NextResponse.json({ message: "Question deleted" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
