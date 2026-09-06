import {
  CHAT_RESPONSE_SCHEMA,
  type ChatResponse,
  type CompleteContext,
} from "@/lib/chat/types";

const ENDPOINT = "https://api.anthropic.com/v1/messages";

type ToolUseBlock = {
  type: "tool_use";
  name: string;
  input: unknown;
};

/**
 * Call the Anthropic Messages API with raw fetch, using tool-use to force
 * structured JSON output. Throws on missing key or non-2xx responses.
 */
export async function complete(ctx: CompleteContext): Promise<ChatResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const model = process.env.LLM_MODEL || "claude-3-5-haiku-latest";

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 512,
      system: ctx.system,
      messages: [{ role: "user", content: ctx.user }],
      tools: [
        {
          name: "respond",
          description: "Return the chat response conforming to the schema.",
          input_schema: CHAT_RESPONSE_SCHEMA,
        },
      ],
      tool_choice: { type: "tool", name: "respond" },
    }),
  });

  if (!res.ok) {
    throw new Error(`Anthropic request failed with status ${res.status}`);
  }

  const data = (await res.json()) as { content?: unknown[] };

  const block = data.content?.[0] as ToolUseBlock | undefined;
  if (!block || block.type !== "tool_use" || block.name !== "respond") {
    throw new Error("Anthropic response missing tool_use block");
  }

  return block.input as ChatResponse;
}
