import { NextResponse } from "next/server";
import { z } from "zod";

const spellRequestSchema = z.object({
  text: z.string().max(5000, "Text must be at most 5000 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = spellRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues?.[0]?.message || result.error.message },
        { status: 400 }
      );
    }

    const ltUrl = process.env.LANGUAGETOOL_URL || "http://localhost:8010";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${ltUrl}/v2/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        language: "en-US",
        text: result.data.text,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: "LanguageTool server error" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "LanguageTool server unavailable or timeout" },
      { status: 503 }
    );
  }
}
