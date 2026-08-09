"use client";

import { useEffect, useState, type FormEvent } from "react";
import Waveform from "./components/Waveform";
import ClaimCard from "./components/ClaimCard";
import Logo from "./components/Logo";
import Modal from "./components/Modal";
import type { Verdict } from "@/lib/types";

type Status = "idle" | "working" | "done" | "error";

type AnalyzeResult = {
  transcript: string;
  claims: Verdict[];
};

const STATUS_MESSAGES = [
  "Pulling the audio…",
  "Reading the transcript…",
  "Pulling out the claims…",
  "Checking the record…",
];

const STEPS = [
  {
    n: "01",
    accent: "var(--color-ribbon)",
    title: "Paste the link",
    body: "Drop in a talk, a clip, an interview — anything with a spoken track.",
  },
  {
    n: "02",
    accent: "var(--color-ribbon-2)",
    title: "Ledger listens",
    body: "Audio is pulled down and transcribed word for word, no shortcuts.",
  },
  {
    n: "03",
    accent: "var(--color-ribbon)",
    title: "Claims get checked",
    body: "Each checkable statement is weighed against search evidence and stamped.",
  },
];

const FAQ = [
  {
    q: "What kind of links work?",
    a: "Anything with a spoken track — talks, interviews, clips. Very long videos may hit a size limit around 20 minutes of audio.",
  },
  {
    q: "What happens to the audio afterward?",
    a: "It's deleted from the server the moment the check finishes. Nothing is kept.",
  },
  {
    q: "Why do some claims come back \"unverified\"?",
    a: "When the evidence is thin or mixed, Ledger says so instead of guessing. Unverified is a real verdict, not a cop-out.",
  },
  {
    q: "Does it check opinions or predictions?",
    a: "No — only statements that are checkable in principle: facts, numbers, events, history. Opinions and predictions get skipped.",
  },
];

const FEATURES = [
  {
    accent: "var(--color-ribbon)",
    title: "Any link, not just uploads",
    body: "Works from a plain URL — no file wrangling before you get an answer.",
  },
  {
    accent: "var(--color-ribbon-2)",
    title: "Real transcript, not a summary",
    body: "See exactly what was said, in order, before any verdict is applied.",
  },
  {
    accent: "var(--color-ribbon)",
    title: "Evidence, not vibes",
    body: "Verdicts cite sources where search evidence is available, so you can check the checker.",
  },
  {
    accent: "var(--color-ribbon-2)",
    title: "Unverified is a valid answer",
    body: "Thin or mixed evidence gets marked unverified instead of a confident guess.",
  },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [statusIndex, setStatusIndex] = useState(0);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emptyDismissed, setEmptyDismissed] = useState(false);

  useEffect(() => {
    if (status !== "working") return undefined;
    const id = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 3400);
    return () => clearInterval(id);
  }, [status]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!url.trim() || status === "working") return;

    setStatusIndex(0);
    setStatus("working");
    setError(null);
    setResult(null);
    setEmptyDismissed(false);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong opening that link.");
      }
      setResult(data);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong opening that link.");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-paper/85 backdrop-blur border-b border-paper-line">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <Logo className="w-7 h-7 shrink-0" />
            <span className="font-display italic text-xl tracking-tight">Ledger</span>
          </a>
          <nav className="hidden sm:flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
            <a
              href="#how-it-works"
              className="px-4 py-2 rounded-full text-text-paper-dim hover:text-text-paper transition-colors"
            >
              How it works
            </a>
            <a
              href="#why-ledger"
              className="px-4 py-2 rounded-full text-text-paper-dim hover:text-text-paper transition-colors"
            >
              Why Ledger
            </a>
            <a
              href="#faq"
              className="px-4 py-2 rounded-full border border-paper-line hover:border-text-paper transition-colors"
            >
              FAQ
            </a>
          </nav>
        </div>
      </header>

      <div className="relative overflow-hidden hero-glow">
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-20 relative z-10">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ribbon-2 mb-6">
              Paste a link. Get the receipts.
            </p>
            <h1 className="font-black text-5xl md:text-7xl leading-[1.02] tracking-tight mb-7">
              Find out what they{" "}
              <span className="gradient-text">actually</span> said — and
              whether it holds up.
            </h1>
            <p className="text-text-paper-dim text-lg max-w-lg mb-10 leading-relaxed">
              Ledger downloads the audio from a video, transcribes it, and holds
              each checkable claim up against the record — so you don&apos;t
              have to take anyone&apos;s word for it.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://… a talk, a clip, an interview"
                className="flex-1 bg-card border border-paper-line rounded-full px-5 py-3.5 text-sm placeholder:text-text-paper-dim/60 focus:border-ribbon-2 outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={status === "working"}
                className="shrink-0 bg-ink text-text-dark font-mono text-xs uppercase tracking-[0.14em] font-semibold px-7 py-3.5 rounded-full transition-all hover:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-ribbon-2)_35%,transparent)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "working" ? "Working…" : "Open the file →"}
              </button>
            </form>

            <div className="flex items-center gap-4 h-8">
              <Waveform active={status === "working"} />
              {status === "working" && (
                <span className="font-mono text-xs text-text-paper-dim">
                  {STATUS_MESSAGES[statusIndex]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex-1">
        {status === "error" && (
          <Modal onClose={() => setStatus("idle")}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <p className="font-mono text-xs uppercase tracking-widest text-false">
                Couldn&apos;t open that file
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                aria-label="Close"
                className="shrink-0 -m-1 p-1 text-text-paper-dim hover:text-text-paper transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-text-paper-dim leading-relaxed mb-6">{error}</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="w-full bg-ink text-text-dark font-mono text-xs uppercase tracking-[0.14em] font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </Modal>
        )}

        {status === "done" && result && (
          <section className="max-w-6xl mx-auto px-6 pb-8">
            <div className="mb-10">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ribbon-2 mb-3">
                Transcript
              </p>
              <div className="rounded-2xl bg-card border border-paper-line text-text-paper p-6 max-h-72 overflow-y-auto leading-relaxed text-sm whitespace-pre-wrap">
                {result.transcript}
              </div>
            </div>

            {result.claims.length > 0 && (
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ribbon-2 mb-3">
                  {result.claims.length} claim{result.claims.length === 1 ? "" : "s"} checked
                </p>
                <div className="grid md:grid-cols-2 gap-5">
                  {result.claims.map((claim, i) => (
                    <ClaimCard key={i} {...claim} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {status === "done" && result && result.claims.length === 0 && !emptyDismissed && (
          <Modal onClose={() => setEmptyDismissed(true)}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <p className="font-mono text-xs uppercase tracking-widest text-unverified">
                No checkable claims found
              </p>
              <button
                type="button"
                onClick={() => setEmptyDismissed(true)}
                aria-label="Close"
                className="shrink-0 -m-1 p-1 text-text-paper-dim hover:text-text-paper transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-text-paper-dim leading-relaxed mb-6">
              No clearly checkable factual claims turned up in this one — it may be mostly
              opinion or narrative. The transcript is still below if you want to read it.
            </p>
            <button
              type="button"
              onClick={() => setEmptyDismissed(true)}
              className="w-full bg-ink text-text-dark font-mono text-xs uppercase tracking-[0.14em] font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </Modal>
        )}

        <section id="how-it-works" className="bg-card border-y border-paper-line scroll-mt-16">
          <div className="max-w-6xl mx-auto px-6 py-28">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ribbon-2 mb-3">
              How it works
            </p>
            <h2 className="font-black text-3xl md:text-4xl tracking-tight mb-14 max-w-md">
              Three steps, no manual fact-checking required.
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {STEPS.map((step) => (
                <div
                  key={step.n}
                  className="rounded-2xl border border-paper-line bg-paper p-6 border-l-4"
                  style={{ borderLeftColor: step.accent }}
                >
                  <span className="font-mono text-xs" style={{ color: step.accent }}>
                    {step.n}
                  </span>
                  <h3 className="font-bold text-lg mt-3 mb-2">{step.title}</h3>
                  <p className="text-sm text-text-paper-dim leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="why-ledger" className="scroll-mt-16">
          <div className="max-w-6xl mx-auto px-6 py-28">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ribbon-2 mb-3">
              Why Ledger
            </p>
            <h2 className="font-black text-3xl md:text-4xl tracking-tight mb-14 max-w-md">
              Built to show its work, not just its opinion.
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {FEATURES.map((f) => (
                <div key={f.title}>
                  <span
                    className="stamp shrink-0 text-[10px]! px-2! py-1!"
                    style={{ color: f.accent }}
                  >
                    ✓
                  </span>
                  <h3 className="font-bold text-lg mt-3 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-text-paper-dim leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-card border-y border-paper-line scroll-mt-16">
          <div className="max-w-4xl mx-auto px-6 py-28">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ribbon-2 mb-3">FAQ</p>
            <h2 className="font-black text-3xl md:text-4xl tracking-tight mb-12 max-w-md">
              Questions worth answering up front.
            </h2>
            <div className="flex flex-col divide-y divide-paper-line border-t border-paper-line">
              {FAQ.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-lg">
                    {item.q}
                    <span className="font-mono text-ribbon-2 text-lg shrink-0 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-text-paper-dim leading-relaxed max-w-xl">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-auto border-t border-paper-line">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <Logo className="w-5 h-5 shrink-0" />
            <span className="font-display italic text-lg tracking-tight">Ledger</span>
          </span>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-paper-dim">
            Built for people tired of taking someone&apos;s word for it.
          </p>
        </div>
      </footer>
    </main>
  );
}
