import problems from "@/data/problems.json";
import categoriesData from "@/data/categories.json";
import type { Category, Problem } from "@/data/types";
import type { IndexedProblem } from "@/lib/chat/types";

const problemList = problems as Problem[];
const categoryList = categoriesData as Category[];

const categoryLabelMap = new Map(
  categoryList.map((c) => [c.key, c.label] as const),
);

export function categoryLabel(key: string): string {
  return categoryLabelMap.get(key) ?? key;
}

/**
 * Concatenate every searchable field of a problem into one text blob:
 * slug + title + category label + description + detail (overview paragraphs,
 * whatItCanDo, tool names, tool pointers).
 */
function buildTextBlob(p: Problem): string {
  const parts: string[] = [
    p.slug,
    p.title,
    categoryLabel(p.category),
    p.description,
  ];

  if (p.detail) {
    parts.push(...p.detail.overview.paragraphs);
    parts.push(...p.detail.overview.whatItCanDo);
    for (const tool of p.detail.tools) {
      parts.push(tool.name);
      parts.push(...tool.pointers);
    }
  }

  return parts.join("\n");
}

/** Tool names + pointers concatenated, for lower-weighted scoring. */
function buildToolText(p: Problem): string {
  if (!p.detail) return "";
  const parts: string[] = [];
  for (const tool of p.detail.tools) {
    parts.push(tool.name);
    parts.push(...tool.pointers);
  }
  return parts.join("\n");
}

export const index: IndexedProblem[] = problemList.map((p) => ({
  slug: p.slug,
  title: p.title,
  category: p.category,
  categoryLabel: categoryLabel(p.category),
  description: p.description,
  toolText: buildToolText(p),
  textBlob: buildTextBlob(p),
}));

export const categories: Category[] = categoryList;
