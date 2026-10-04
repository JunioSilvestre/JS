import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";

// DELETE /api/categories/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const db = getDb();
    const { id } = await params;

    const existing = db
      .prepare("SELECT id FROM categories WHERE id = ?")
      .get(Number(id));
    if (!existing)
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );

    db.prepare("DELETE FROM categories WHERE id = ?").run(Number(id));
    return NextResponse.json({ message: "Category deleted" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
