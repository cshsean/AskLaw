"use client";

import { useState } from "react";

export function VideoFigure({
  badge,
  playLabel,
  src,
}: {
  badge: string;
  playLabel: string;
  src?: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (src) {
    return (
      <figure className="video video--real">
        <span className="video__badge">{badge}</span>
        <video
          controls
          preload="metadata"
          playsInline
          aria-label={playLabel}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </figure>
    );
  }

  return (
    <figure className={`video video--pending${playing ? " is-playing" : ""}`}>
      <span className="video__badge">{badge}</span>
      <button
        className="video__play"
        type="button"
        aria-label={playing ? "Hide details" : playLabel}
        onClick={() => setPlaying((p) => !p)}
      >
        <span className="play-circle">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
      <span className="video__status" aria-hidden="true">
        This walkthrough is in production — the steps are written out below in
        the meantime.
      </span>
    </figure>
  );
}
