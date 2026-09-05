"use client";

import { useState } from "react";

export function VideoFigure({
  badge,
  playLabel,
}: {
  badge: string;
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className={`video${playing ? " is-playing" : ""}`}>
      <span className="video__badge">{badge}</span>
      <button
        className="video__play"
        type="button"
        aria-label={playing ? "Pause: demo video" : playLabel}
        onClick={() => setPlaying((p) => !p)}
      >
        <span className="play-circle">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
      <span className="video__status" aria-hidden="true">
        This is a demo — the video would play here.
      </span>
    </figure>
  );
}
