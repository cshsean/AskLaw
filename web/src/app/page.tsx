import problems from "@/data/problems.json";
import type { Problem } from "@/data/types";
import { FilterableGrid } from "./FilterableGrid";

export default function HomePage() {
  return (
    <>
      <section className="hero container">
        <span className="hero__eyebrow">AI, explained plainly</span>
        <h1>Find an AI tool for the job.</h1>
        <p className="hero__lede">
          Every guide here starts from a problem you recognise — a task that
          eats your afternoon, not a product name. Browse by the work itself,
          and we&apos;ll show you tools that fit.
        </p>
      </section>

      <FilterableGrid problems={problems as Problem[]} />
    </>
  );
}
