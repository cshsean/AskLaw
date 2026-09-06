"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import categories from "@/data/categories.json";
import type { Problem } from "@/data/types";

const PRACTICE_AREAS = [
  { key: "family-law", label: "family law" },
  { key: "criminal-law", label: "criminal law" },
];

export function FilterableGrid({ problems }: { problems: Problem[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("all");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const categoryLabel = (key: string) =>
    categories.find((c) => c.key === key)?.label ?? key;

  const practiceAreaLabel = (key: string) =>
    PRACTICE_AREAS.find((pa) => pa.key === key)?.label ?? key;

  function toggleTag(key: string) {
    setActiveTags((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return problems.filter((p) => {
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchCat = active === "all" || p.category === active;
      const matchTag =
        activeTags.length === 0 ||
        (p.practiceAreas ?? []).some((pa) => activeTags.includes(pa));
      return matchQ && matchCat && matchTag;
    });
  }, [problems, query, active, activeTags]);

  return (
    <>
      <section className="container" aria-label="Search and filter">
        <div className="filters">
          <div className="search">
            <svg
              className="search__icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <label className="visually-hidden" htmlFor="search">
              Search problems
            </label>
            <input
              id="search"
              type="search"
              placeholder="Search a problem, e.g. “billings” or “contract”"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="pills" role="group" aria-label="Filter by category">
            <button
              className="pill"
              aria-pressed={active === "all"}
              onClick={() => setActive("all")}
            >
              all
            </button>
            {categories.map((c) => (
              <button
                key={c.key}
                className="pill"
                aria-pressed={active === c.key}
                onClick={() => setActive(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <span className="result-count" aria-live="polite">
            {visible.length} {visible.length === 1 ? "problem" : "problems"}
          </span>
        </div>

        <div className="tag-filters">
          <span className="tag-filters__label">Practice area</span>
          <div
            className="pills pills--tags"
            role="group"
            aria-label="Filter by practice area"
          >
            {PRACTICE_AREAS.map((pa) => (
              <button
                key={pa.key}
                className="pill pill--tag"
                aria-pressed={activeTags.includes(pa.key)}
                onClick={() => toggleTag(pa.key)}
              >
                {pa.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container" id="how-it-works" aria-label="All problems">
        <div className="grid">
          {visible.map((p) => (
            <Link
              key={p.slug}
              className="card"
              href={`/problems/${p.slug}`}
              data-category={p.category}
            >
              <span className="card__icon" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dangerouslySetInnerHTML={{ __html: p.icon }}
                />
              </span>
              <h3 className="card__title">{p.title}</h3>
              <span className="card__tags">
                <span className="card__cat">{categoryLabel(p.category)}</span>
                {p.practiceAreas?.map((pa) => (
                  <span key={pa} className="card__tag">
                    {practiceAreaLabel(pa)}
                  </span>
                ))}
              </span>
              <p className="card__desc">{p.description}</p>
              <span className="card__meta">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
                {p.toolsCount} {p.toolsCount === 1 ? "tool" : "tools"}
              </span>
            </Link>
          ))}
        </div>

        <div className={`no-results${visible.length === 0 ? " is-visible" : ""}`}>
          <strong>No problems match.</strong>
          <br />
          Try a different word, or clear the filters.
        </div>
      </section>
    </>
  );
}
