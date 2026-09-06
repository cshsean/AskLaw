import type { ChatResponse, CompleteContext } from "@/lib/chat/types";

const ENDPOINT = "https://api.openai.com/v1/chat/completions";

/**
 * Call the OpenAI chat completions API with raw fetch, forcing JSON output.
 * Throws on missing key or non-2xx responses.
 */
export async function complete(ctx: CompleteContext): Promise<ChatResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const model = process.env.LLM_MODEL || "gpt-4o-mini";

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: ctx.system },
        { role: "user", content: ctx.user },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI request failed with status ${res.status}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: unknown } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("OpenAI response missing message content");
  }

  return JSON.parse(content) as ChatResponse;
}
