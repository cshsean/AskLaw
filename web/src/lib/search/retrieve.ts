import { index } from "./index";
import type { Candidate } from "@/lib/chat/types";

// Title matches rank highest, then description, then tool pointers.
const WEIGHT_TITLE = 6;
const WEIGHT_DESCRIPTION = 3;
const WEIGHT_TOOL = 1;

const STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "for",
  "to",
  "of",
  "in",
  "on",
  "at",
  "with",
  "from",
  "by",
  "about",
  "into",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "do",
  "does",
  "did",
  "i",
  "me",
  "my",
  "we",
  "our",
  "you",
  "your",
  "it",
  "its",
  "this",
  "that",
  "these",
  "those",
  "what",
  "which",
  "who",
  "how",
  "when",
  "where",
  "why",
  "help",
  "need",
  "find",
  "get",
  "want",
  "please",
  "can",
  "could",
  "would",
  "should",
  "there",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

type FieldScore = { score: number; matched: string[] };

/**
 * Score a field (title / description / tool text) against the query tokens.
 * Exact token matches count full weight; substring hits (>= 4 chars) count
 * half weight to tolerate simple stemming / pluralisation.
 */
function matchField(queryTokens: string[], fieldText: string): FieldScore {
  if (!fieldText) return { score: 0, matched: [] };

  const field = fieldText.toLowerCase();
  const fieldTokens = new Set(tokenize(fieldText));
  const matched: string[] = [];
  let score = 0;

  for (const token of queryTokens) {
    let hit = 0;
    if (fieldTokens.has(token)) {
      hit = 1;
    } else if (token.length >= 4 && field.includes(token)) {
      hit = 0.5;
    }
    if (hit > 0) {
      score += hit;
      matched.push(token);
    }
  }

  return { score, matched };
}

function buildReason(
  titleMatched: string[],
  descMatched: string[],
  toolMatched: string[],
): string {
  if (titleMatched.length > 0) {
    return `Matches "${titleMatched.join(", ")}" in the title.`;
  }
  if (descMatched.length > 0) {
    return `Matches "${descMatched.join(", ")}" in the description.`;
  }
  if (toolMatched.length > 0) {
    return `Its tools cover "${toolMatched.join(", ")}".`;
  }
  return "Loosely related to your query.";
}

/**
 * Lexically retrieve the top 3 matching problems for a query. Returns scored
 * candidates (highest score first) regardless of match strength; callers
 * decide what counts as a "strong" match.
 */
export function retrieve(query: string): Candidate[] {
  const queryTokens = tokenize(query).filter((t) => !STOPWORDS.has(t));

  const scored = index.map((p) => {
    const title = matchField(queryTokens, p.title);
    const description = matchField(queryTokens, p.description);
    const tool = matchField(queryTokens, p.toolText);

    const score =
      title.score * WEIGHT_TITLE +
      description.score * WEIGHT_DESCRIPTION +
      tool.score * WEIGHT_TOOL;

    return {
      slug: p.slug,
      title: p.title,
      category: p.category,
      categoryLabel: p.categoryLabel,
      description: p.description,
      score,
      reason: buildReason(title.matched, description.matched, tool.matched),
    };
  });

  return scored
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 3);
}
