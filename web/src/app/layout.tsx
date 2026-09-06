import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ChatWidget } from "./ChatWidget";

export const metadata: Metadata = {
  title: "AskLaw — tools for lawyers",
  description:
    "Plain-language guides to tools for everyday legal work, sorted by the problem — not the product.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%231a4a8a'/%3E%3Ctext x='16' y='22' font-family='Georgia,serif' font-size='17' font-weight='700' fill='white' text-anchor='middle'%3EAL%3C/text%3E%3C/svg%3E",
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

        <div className="gov-banner">
          <div className="container gov-banner__inner">
            <svg
              className="gov-banner__crest"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 6l1.6 3.4L17 11l-3.4 1.6L12 16l-1.6-3.4L7 11l3.4-1.6z" />
            </svg>
            <span>
              A collaboration between the Singapore Academy of Law and the
              Ministry of Law.
            </span>
          </div>
        </div>

        <header className="site-header">
          <div className="container site-header__inner">
            <Link className="brand" href="/" aria-label="AskLaw — home">
              <span className="brand__mark" aria-hidden="true">
                AL
              </span>
              <span className="brand__name">AskLaw</span>
              <span className="brand__tag">tools for lawyers</span>
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
                  Plain-language guides to tools for practicing lawyers and firm
                  staff. No jargon, no hype — just the tool for the job.
                </p>
                <p className="site-footer__collab">
                  A collaboration between the Singapore Academy of Law and the
                  Ministry of Law.
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
