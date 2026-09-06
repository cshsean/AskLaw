import problems from "@/data/problems.json";
import type { Problem } from "@/data/types";
import { DISCLAIMER, type ChatMatch, type ChatResponse } from "@/lib/chat/types";

const problemList = problems as Problem[];

const problemBySlug = new Map(problemList.map((p) => [p.slug, p] as const));
const knownSlugs = new Set(problemBySlug.keys());

const MAX_MATCHES = 3;

type RawMatch = {
  slug?: unknown;
  title?: unknown;
  reason?: unknown;
};

/**
 * Coerce raw parsed JSON (from an LLM) into a valid ChatResponse.
 * - `answer` must be a non-empty string.
 * - `matches` is filtered to slugs that exist in problems.json (unknown slugs
 *   are dropped) and clamped to 3; titles are taken from the canonical data.
 * - The fixed disclaimer is always (re)set.
 * Returns `null` when the input cannot be coerced to a valid response.
 */
export function validateResponse(raw: unknown): ChatResponse | null {
  if (typeof raw !== "object" || raw === null) return null;

  const obj = raw as Record<string, unknown>;

  if (typeof obj.answer !== "string" || obj.answer.trim() === "") {
    return null;
  }

  const answer = obj.answer.trim();

  const category =
    typeof obj.category === "string" && obj.category.trim() !== ""
      ? obj.category.trim()
      : undefined;

  const matches: ChatMatch[] = [];

  if (Array.isArray(obj.matches)) {
    for (const item of obj.matches as RawMatch[]) {
      if (matches.length >= MAX_MATCHES) break;
      if (typeof item !== "object" || item === null) continue;

      const slug = item.slug;
      if (typeof slug !== "string" || !knownSlugs.has(slug)) continue;

      const problem = problemBySlug.get(slug);
      if (!problem) continue;

      matches.push({
        slug: problem.slug,
        title: problem.title,
        reason:
          typeof item.reason === "string" && item.reason.trim() !== ""
            ? item.reason.trim()
            : `Matches your request.`,
      });
    }
  }

  return {
    answer,
    category,
    matches,
    disclaimer: DISCLAIMER,
  };
}
