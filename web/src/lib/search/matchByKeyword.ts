import { retrieve } from "./retrieve";
import { categories } from "./index";
import { DISCLAIMER, type Candidate, type ChatResponse } from "@/lib/chat/types";

// A single exact title match (6) or description match (3) is a strong match.
const STRONG_THRESHOLD = 3;

function isCategoryQuestion(query: string): boolean {
  return /categor/i.test(query);
}

function answerForCategory(): ChatResponse {
  const labels = categories.map((c) => c.label);
  const list =
    labels.length > 1
      ? `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`
      : (labels[0] ?? "");
  return {
    answer: `AskLaw covers these categories: ${list}. Pick one and I'll suggest tools for it.`,
    matches: [],
    disclaimer: DISCLAIMER,
  };
}

function answerForMatch(top: Candidate, query: string): ChatResponse {
  const others = retrieve(query)
    .filter((c) => c.score > 0 && c.slug !== top.slug)
    .slice(0, 2);

  return {
    answer: `That sounds like "${top.title}" (${top.categoryLabel}). ${top.description}`,
    category: top.category,
    matches: [
      { slug: top.slug, title: top.title, reason: top.reason },
      ...others.map((c) => ({
        slug: c.slug,
        title: c.title,
        reason: c.reason,
      })),
    ],
    disclaimer: DISCLAIMER,
  };
}

function answerGeneric(): ChatResponse {
  return {
    answer:
      "I couldn't find a matching tool for that. Try describing a task, like drafting emails, tracking billing, or organising documents.",
    matches: [],
    disclaimer: DISCLAIMER,
  };
}

/**
 * Deterministic no-LLM fallback. Maps the top retrieved candidate to a full
 * ChatResponse; if nothing matches strongly, answers generically with no
 * matches. Always appends the fixed disclaimer.
 */
export function matchByKeyword(query: string): ChatResponse {
  if (isCategoryQuestion(query)) {
    return answerForCategory();
  }

  const candidates = retrieve(query);
  const top = candidates[0];

  if (!top || top.score < STRONG_THRESHOLD) {
    return answerGeneric();
  }

  return answerForMatch(top, query);
}
