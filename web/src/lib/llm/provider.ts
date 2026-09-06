import { complete as completeOpenAI } from "./openai";
import { complete as completeAnthropic } from "./anthropic";
import type { ChatResponse, CompleteContext } from "@/lib/chat/types";

/**
 * Dispatch to the configured provider. Throws when the provider is unset,
 * unsupported, or missing its API key — the route falls back to the
 * deterministic keyword matcher on any throw.
 */
export async function complete(ctx: CompleteContext): Promise<ChatResponse> {
  const provider = process.env.LLM_PROVIDER;

  if (provider === "openai") {
    return completeOpenAI(ctx);
  }

  if (provider === "anthropic") {
    return completeAnthropic(ctx);
  }

  throw new Error(
    `LLM_PROVIDER is unset or unsupported: ${provider ?? "(unset)"}`,
  );
}
