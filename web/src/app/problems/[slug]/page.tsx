import { notFound } from "next/navigation";
import Link from "next/link";
import problems from "@/data/problems.json";
import categories from "@/data/categories.json";
import type { Problem } from "@/data/types";
import { VideoFigure } from "../VideoFigure";
import { Subnav } from "../Subnav";

export function generateStaticParams() {
  return (problems as Problem[]).map((p) => ({ slug: p.slug }));
}

const categoryLabel = (key: string) =>
  categories.find((c) => c.key === key)?.label ?? key;

const PRACTICE_AREA_LABELS: Record<string, string> = {
  "family-law": "family law",
  "criminal-law": "criminal law",
};

const practiceAreaLabel = (key: string) => PRACTICE_AREA_LABELS[key] ?? key;

export async function generateMetadata(props: PageProps<"/problems/[slug]">) {
  const { slug } = await props.params;
  const problem = (problems as Problem[]).find((p) => p.slug === slug);
  if (!problem) return {};
  return {
    title: `${problem.title} — AskLaw`,
    description: problem.description,
  };
}

export default async function ProblemDetailPage(
  props: PageProps<"/problems/[slug]">
) {
  const { slug } = await props.params;
  const problem = (problems as Problem[]).find((p) => p.slug === slug);
  if (!problem) notFound();

  const detail = problem.detail;

  return (
    <>
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">All problems</Link>
          <span className="sep" aria-hidden="true">
            /
          </span>
          <span aria-current="page">{problem.title}</span>
        </nav>
      </div>

      <section className="container detail-hero" aria-labelledby="detailTitle">
        <div>
          <span
            className="detail-hero__icon"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: wrapIcon(problem.icon, 26) }}
          />
          <div className="detail-hero__tags">
            <span className="card__cat">{categoryLabel(problem.category)}</span>
            {problem.practiceAreas?.map((pa) => (
              <span key={pa} className="card__tag">
                {practiceAreaLabel(pa)}
              </span>
            ))}
          </div>
          <h1 id="detailTitle">{problem.title}</h1>
          <p className="detail-hero__desc">
            {detail ? detail.heroDesc : problem.description}
          </p>
        </div>
        {detail && (
          <a className="btn btn--primary" href="#tools">
            <svg
              width="16"
              height="16"
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
            See the tools
          </a>
        )}
      </section>

      {detail ? (
        <>
          <Subnav />

          <div className="container detail-layout">
            <div className="detail-main">
              <section id="overview" aria-labelledby="overviewTitle">
                <span className="section-kicker">Overview</span>
                <h2 id="overviewTitle">How AI helps with this</h2>
                <div className="prose">
                  {detail.overview.paragraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                <div className="callout">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ flex: "none", marginTop: 2, color: "var(--accent)" }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  <span dangerouslySetInnerHTML={{ __html: detail.overview.callout }} />
                </div>

                <h3>What it can do</h3>
                <div className="prose">
                  <ul>
                    {detail.overview.whatItCanDo.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <section id="how-to-use" aria-labelledby="howToUseTitle">
                <span className="section-kicker">How to use</span>
                <h2 id="howToUseTitle">See it in action</h2>
                <div className="prose">
                  <p>{detail.howToUse.copy}</p>
                </div>

                <VideoFigure
                  badge={detail.howToUse.videoBadge}
                  playLabel="Play: how it works"
                  src={detail.howToUse.videoSrc}
                />
                <span className="video__caption">{detail.howToUse.videoCaption}</span>
              </section>

              <section id="tools" aria-labelledby="toolsTitle">
                <span className="section-kicker">Tools for this job</span>
                <h2 id="toolsTitle">
                  {detail.tools.length} tools, {detail.tools.length} ways to cover it
                </h2>
                <div className="prose">
                  <p>{detail.toolsIntro}</p>
                </div>

                <div className="neutrality-note">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  <span>
                    AskLaw does not endorse any specific tool. Each is listed
                    because it can do the job described — compare them and
                    choose what fits your practice.
                  </span>
                </div>

                {detail.tools.map((tool) => (
                  <a className="tool" href="#" key={tool.name}>
                    <div className="tool__top">
                      <span
                        className="card__icon"
                        aria-hidden="true"
                        dangerouslySetInnerHTML={{ __html: wrapIcon(tool.icon, 20) }}
                      />
                      <span className="tool__name">{tool.name}</span>
                      <span className="tool__go">
                        View{" "}
                        <svg
                          width="14"
                          height="14"
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
                      </span>
                    </div>
                    <ul>
                      {tool.pointers.map((pointer, i) => (
                        <li key={i}>{pointer}</li>
                      ))}
                    </ul>
                  </a>
                ))}
              </section>
            </div>

            <aside className="sidebar">
              <div className="sidebar__card">
                <h3>Quick facts</h3>
                {detail.quickFacts.map((fact) => (
                  <div className="fact" key={fact.label}>
                    <span className="fact__label">{fact.label}</span>
                    <span className="fact__value">{fact.value}</span>
                  </div>
                ))}
              </div>

              <Link className="sidebar__back" href="/">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
                Back to all problems
              </Link>
            </aside>
          </div>
        </>
      ) : (
        <div className="container detail-layout">
          <div className="detail-main">
            <section aria-labelledby="soonTitle">
              <span className="section-kicker">Coming soon</span>
              <h2 id="soonTitle">This guide is still being written</h2>
              <div className="prose">
                <p>{problem.description}</p>
                <p>
                  We haven&apos;t published the full walkthrough for this
                  problem yet — check back soon, or browse the guides that are
                  already live.
                </p>
              </div>
            </section>
          </div>
          <aside className="sidebar">
            <Link className="sidebar__back" href="/">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              Back to all problems
            </Link>
          </aside>
        </div>
      )}
    </>
  );
}

function wrapIcon(inner: string, size: number) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}
