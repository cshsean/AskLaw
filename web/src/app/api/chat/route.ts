import { NextResponse } from "next/server";

import { sanitizeInput } from "@/lib/safety/sanitize";
import { check } from "@/lib/safety/rateLimit";
import { retrieve } from "@/lib/search/retrieve";
import { matchByKeyword } from "@/lib/search/matchByKeyword";
import { buildSystemPrompt, wrapUserQuery } from "@/lib/llm/systemPrompt";
import { complete } from "@/lib/llm/provider";
import { validateResponse } from "@/lib/safety/validate";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message = sanitizeInput(
    (body as { message?: unknown } | null)?.message,
  );
  if (!message) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const ip = getClientIp(request);
  if (!check(ip)) {
    return NextResponse.json(
      { error: "Too many requests, please try again later" },
      { status: 429 },
    );
  }

  const candidates = retrieve(message);

  try {
    const system = buildSystemPrompt(candidates);
    const user = wrapUserQuery(message);
    const raw = await complete({ system, user });
    const validated = validateResponse(raw);
    if (validated) {
      return NextResponse.json(validated);
    }
  } catch {
    // Any failure (missing key, provider error, schema failure) falls back
    // to the deterministic keyword matcher.
  }

  return NextResponse.json(matchByKeyword(message));
}
