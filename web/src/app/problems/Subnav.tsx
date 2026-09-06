"use client";

import { useEffect, useRef } from "react";

const LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#how-to-use", label: "How to use" },
  { href: "#tools", label: "Tools for this job" },
];

export function Subnav() {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window) || !navRef.current) return;
    const links = Array.from(navRef.current.querySelectorAll<HTMLAnchorElement>("a"));
    const sections: { link: HTMLAnchorElement; sec: Element }[] = [];
    links.forEach((link) => {
      const sec = document.querySelector(link.getAttribute("href") || "");
      if (sec) sections.push({ link, sec });
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((l) => l.classList.remove("is-active"));
            sections.forEach((s) => {
              if (s.sec === entry.target) s.link.classList.add("is-active");
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((s) => io.observe(s.sec));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="subnav" aria-label="On this page">
      <div className="container subnav__inner" ref={navRef}>
        {LINKS.map((l, i) => (
          <a key={l.href} href={l.href} className={i === 0 ? "is-active" : undefined}>
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
