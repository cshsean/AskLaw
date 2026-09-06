export const DISCLAIMER =
  "AskLaw doesn't endorse any specific tool, and this isn't legal advice.";

export type ChatMatch = {
  slug: string;
  title: string;
  reason: string;
};

export type ChatResponse = {
  answer: string;
  category?: string;
  matches: ChatMatch[];
  disclaimer: string;
};

/** Input shape for a provider's `complete` call. */
export type CompleteContext = {
  system: string;
  user: string;
};

/** A problem enriched with searchable text fields. */
export type IndexedProblem = {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  description: string;
  toolText: string;
  textBlob: string;
};

/** A scored retrieval candidate. */
export type Candidate = {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  description: string;
  score: number;
  reason: string;
};

/**
 * JSON Schema describing the ChatResponse shape. Used both to instruct the
 * OpenAI model and as the Anthropic tool-use `input_schema`.
 */
export const CHAT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    answer: {
      type: "string",
      description: "1-3 plain-English sentences, text only",
    },
    category: {
      type: "string",
      enum: ["clients", "administrative", "procedural", "substantive"],
      description:
        "the single best-matching category key, or omitted if no clear match",
    },
    matches: {
      type: "array",
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description: "a slug that exists in the directory data",
          },
          title: {
            type: "string",
            description: "the problem title from the directory data",
          },
          reason: {
            type: "string",
            description: "one line explaining why it fits",
          },
        },
        required: ["slug", "title", "reason"],
      },
    },
    disclaimer: {
      type: "string",
      description: "the fixed disclaimer text",
    },
  },
  required: ["answer", "matches"],
} as const;
