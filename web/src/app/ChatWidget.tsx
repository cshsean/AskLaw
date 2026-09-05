"use client";

import { useRef, useState } from "react";

type Message = { from: "bot" | "user"; text: string };

const SUGGESTIONS = [
  "I lose track of billable hours",
  "I can't find old client emails",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  function openPanel() {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function closePanel() {
    setOpen(false);
    toggleRef.current?.focus();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = input.trim();
    if (!val) return;
    setMessages((prev) => [
      ...prev,
      { from: "user", text: val },
      {
        from: "bot",
        text: "Thanks — in the full build I would match this to a relevant problem and point you to the right guide.",
      },
    ]);
    setInput("");
    requestAnimationFrame(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    });
  }

  return (
    <div className="chat">
      <button
        ref={toggleRef}
        className="chat-fab"
        aria-expanded={open}
        aria-controls="chatPanel"
        aria-label="Open the assistant to describe a problem"
        onClick={() => (open ? closePanel() : openPanel())}
      >
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
        >
          <path d="M12 3v2" />
          <path d="M12 19v2" />
          <path d="M5.64 5.64l1.42 1.42" />
          <path d="M16.94 16.94l1.42 1.42" />
          <path d="M3 12h2" />
          <path d="M19 12h2" />
          <path d="M5.64 18.36l1.42-1.42" />
          <path d="M16.94 7.06l1.42-1.42" />
        </svg>
        <span>Describe a problem</span>
      </button>

      <div
        className="chat-panel"
        id="chatPanel"
        role="dialog"
        aria-label="AI assistant"
        aria-hidden={!open}
        hidden={!open}
        onKeyDown={(e) => {
          if (e.key === "Escape") closePanel();
        }}
      >
        <div className="chat-panel__head">
          <span className="dot" aria-hidden="true"></span>
          <div>
            <div className="chat-panel__title">Assistant</div>
            <div className="chat-panel__sub">Describes problems, suggests tools</div>
          </div>
          <button className="chat-panel__close" aria-label="Close assistant" onClick={closePanel}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="chat-panel__body" ref={bodyRef}>
          <div className="bubble bubble--bot">
            Tell me what you&apos;re trying to do — in plain words — and I&apos;ll
            suggest a tool that helps.
          </div>
          <div className="chat-suggest">Try one of these:</div>
          <div className="chat-chips">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setInput(s);
                  inputRef.current?.focus();
                }}
              >
                “{s}”
              </button>
            ))}
          </div>
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.from === "bot" ? "bubble bubble--bot" : "bubble"}
              style={
                m.from === "user"
                  ? { alignSelf: "flex-end", background: "var(--accent)", color: "#fff" }
                  : undefined
              }
            >
              {m.text}
            </div>
          ))}
        </div>
        <form className="chat-panel__input" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="chatInput">
            Describe your problem
          </label>
          <input
            id="chatInput"
            ref={inputRef}
            type="text"
            placeholder="Describe your problem…"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="chat-panel__send" type="submit" aria-label="Send">
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
              <path d="m22 2-7 20-4-9-9-4z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
