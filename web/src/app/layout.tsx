import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ChatWidget } from "./ChatWidget";

export const metadata: Metadata = {
  title: "AskLaw — AI tools for lawyers",
  description:
    "Plain-language guides to AI for everyday legal work, sorted by the problem — not the product.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%231f4e8c'/%3E%3Ctext x='16' y='22' font-family='Georgia,serif' font-size='17' font-weight='700' fill='white' text-anchor='middle'%3EAL%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <div className="rule" aria-hidden="true"></div>

        <header className="site-header">
          <div className="container site-header__inner">
            <Link className="brand" href="/" aria-label="AskLaw — home">
              <span className="brand__mark" aria-hidden="true">
                AL
              </span>
              <span className="brand__name">AskLaw</span>
              <span className="brand__tag">AI for lawyers</span>
            </Link>
            <nav className="site-nav" aria-label="Primary">
              <Link href="/">All problems</Link>
              <Link href="/#how-it-works">How it works</Link>
              <Link href="/#footer">About</Link>
              <Link className="nav-cta" href="/#footer">
                Suggest a tool
              </Link>
              <a
                className="nav-admin"
                href="http://localhost:4174/admin"
                target="_blank"
                rel="noopener"
              >
                Admin
              </a>
            </nav>
          </div>
        </header>

        <main id="main">{children}</main>

        <footer className="site-footer" id="footer">
          <div className="container">
            <div className="site-footer__inner">
              <div>
                <Link className="brand" href="/">
                  <span className="brand__mark" aria-hidden="true">
                    AL
                  </span>
                  <span className="brand__name">AskLaw</span>
                </Link>
                <p className="site-footer__note">
                  Plain-language guides to AI for practicing lawyers and firm
                  staff. No jargon, no hype — just the tool for the job.
                </p>
              </div>
              <div className="site-footer__links">
                <Link href="/">All problems</Link>
                <Link href="/#how-it-works">How it works</Link>
                <a href="#">About</a>
                <a href="#">Privacy</a>
                <a href="#">Contact</a>
              </div>
            </div>
            <div className="site-footer__base">
              <span>© 2026 AskLaw. Built for lawyers, in plain English.</span>
              <span>Demo mockup — tool names and videos are placeholders.</span>
            </div>
          </div>
        </footer>

        <ChatWidget />
      </body>
    </html>
  );
}
