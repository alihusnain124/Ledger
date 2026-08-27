"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Waveform from "./components/Waveform";
import ClaimCard, { VERDICTS } from "./components/ClaimCard";
import Logo from "./components/Logo";
import Modal from "./components/Modal";
import HowItWorks from "./components/marketing/HowItWorks";
import Anatomy from "./components/marketing/Anatomy";
import Verdicts from "./components/marketing/Verdicts";
import WhyLedger from "./components/marketing/WhyLedger";
import UseCases from "./components/marketing/UseCases";
import Limits from "./components/marketing/Limits";
import Faq from "./components/marketing/Faq";
import CtaBand from "./components/marketing/CtaBand";
import SiteFooter from "./components/marketing/SiteFooter";
import type { Verdict } from "@/lib/types";
import { friendlyError } from "@/lib/errors";

type Status = "idle" | "working" | "done" | "error";

type UiError = {
  title: string;
  message: string;
  detail?: string;
};

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

const NAV = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Verdicts", href: "#verdicts" },
  { label: "Why Ledger", href: "#why-ledger" },
  { label: "FAQ", href: "#faq" },
];

const PROMISES = [
  "No account",
  "Audio deleted after the check",
  "Sources on every verdict",
];

const RETURNS = [
  {
    k: "Transcript",
    v: "Every word that was said, in order — before any verdict is applied to it.",
  },
  {
    k: "Claim list",
    v: "Checkable statements separated from opinion, quoted exactly as spoken.",
  },
  {
    k: "Verdict + confidence",
    v: "True, False, or Unverified, with a number attached instead of a tone.",
  },
  {
    k: "Sources",
    v: "The evidence each verdict leaned on, linked so you can check it yourself.",
  },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [statusIndex, setStatusIndex] = useState(0);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<UiError | null>(null);
  const [emptyDismissed, setEmptyDismissed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (status !== "working") return undefined;
    const id = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 3400);
    return () => clearInterval(id);
  }, [status]);

  const tally = useMemo(() => {
    const counts = { true: 0, false: 0, unverified: 0 };
    for (const c of result?.claims ?? []) {
      if (c.verdict in counts) counts[c.verdict] += 1;
    }
    return counts;
  }, [result]);

  const analyze = useCallback(async () => {
    const target = url.trim();
    if (!target) return;

    setStatusIndex(0);
    setStatus("working");
    setError(null);
    setResult(null);
    setEmptyDismissed(false);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: target }),
      });

      // A gateway timeout or crash can answer with HTML, so never assume JSON.
      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        // A server that answers with a bare message still gets translated here,
        // so raw pipeline output can never become the headline.
        setError(
          data?.title && data?.message
            ? { title: data.title, message: data.message, detail: data.detail }
            : friendlyError(data?.detail || data?.error || data?.message),
        );
        setStatus("error");
        return;
      }

      setResult(data);
      setStatus("done");
    } catch {
      setError({
        title: "Couldn't reach Ledger",
        message:
          "The request never made it to the server. Check your connection and try again — nothing was lost.",
      });
      setStatus("error");
    }
  }, [url]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "working") return;
    void analyze();
  }

  return (
    <main className="min-h-screen flex flex-col relative z-0">
      <header
        className={`sticky top-0 z-30 border-b transition-colors duration-300 ${
          scrolled
            ? "bg-paper/80 backdrop-blur-md border-line"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-2.5 shrink-0">
            <Logo className="w-7 h-7 shrink-0" />
            <span className="font-display italic text-xl tracking-tight">
              Ledger
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em]">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="px-3.5 py-2 rounded-full text-dim hover:text-body hover:bg-paper-2 transition-colors"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <a
            href="#check"
            className="btn shrink-0 bg-btn text-btn-fg font-mono text-[11px] uppercase tracking-[0.14em] font-semibold px-5 py-2.5 rounded-full"
          >
            Check a link <span className="btn-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        id="top"
        className="relative overflow-hidden hero-glow scroll-mt-16 -mt-16 pt-16"
      >
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 relative z-10">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-20 items-start">
            <div className="rise">
              <p className="eyebrow mb-7">Paste a link. Get the receipts.</p>

              <h1 className="font-display font-bold text-[2.9rem] sm:text-6xl lg:text-[4.25rem] leading-[1.02] tracking-tight mb-7">
                Find out what they{" "}
                <span className="gradient-text">actually</span> said — and
                whether it holds up.
              </h1>

              <p className="text-dim text-lg max-w-xl mb-10 leading-relaxed">
                Ledger pulls the audio from a video, transcribes it word for
                word, separates the checkable claims from the opinions, and
                holds each one up against the record — with sources attached, so
                you never have to take its word for it either.
              </p>

              <form
                id="check"
                onSubmit={handleSubmit}
                className="scroll-mt-24 flex flex-col sm:flex-row gap-3 mb-5"
              >
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://… a talk, a clip, an interview"
                  className="flex-1 bg-card border border-line rounded-full px-5 py-4 text-sm placeholder:text-dim/60 focus:border-accent outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "working"}
                  className={`btn shrink-0 bg-btn text-btn-fg font-mono text-xs uppercase cursor-pointer tracking-[0.14em] font-semibold px-8 py-4 rounded-full disabled:opacity-60 disabled:cursor-not-allowed ${
                    status === "working" ? "is-working" : ""
                  }`}
                >
                  {status === "working" ? (
                    "Working…"
                  ) : (
                    <>
                      Open the file{" "}
                      <span className="btn-arrow" aria-hidden="true">
                        →
                      </span>
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-4 h-9">
                <Waveform active={status === "working"} />
                <span className="font-mono text-xs text-dim">
                  {status === "working"
                    ? STATUS_MESSAGES[statusIndex]
                    : "Idle — waiting on a link."}
                </span>
              </div>

              <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
                {PROMISES.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="text-accent" aria-hidden="true">
                      ✓
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* What comes back */}
            <aside className="rise rounded-2xl border border-line bg-card p-8 lg:mt-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim mb-6">
                What comes back
              </p>
              <dl className="flex flex-col divide-y divide-line-soft">
                {RETURNS.map((r, i) => (
                  <div
                    key={r.k}
                    className={i === 0 ? "pb-5" : "py-5 last:pb-0"}
                  >
                    <dt className="font-bold text-[0.95rem] mb-1.5 flex items-center gap-2.5">
                      <span
                        className="font-mono text-[11px] text-accent"
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {r.k}
                    </dt>
                    <dd className="text-sm text-dim leading-relaxed pl-[2.1rem]">
                      {r.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <div className="w-full flex-1">
        {status === "error" && (
          <Modal onClose={() => setStatus("idle")}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-false">
                Couldn&apos;t finish the check
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                aria-label="Close"
                className="shrink-0 -m-1 p-1 cursor-pointer text-dim hover:text-body transition-colors"
              >
                ✕
              </button>
            </div>

            <h2 className="font-display font-semibold text-2xl leading-snug mb-3">
              {error?.title}
            </h2>
            <p className="text-sm text-dim leading-relaxed">{error?.message}</p>

            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <button
                type="button"
                onClick={() => void analyze()}
                className="btn cursor-pointer flex-1 bg-btn text-btn-fg font-mono text-xs uppercase tracking-[0.14em] font-semibold px-6 py-3 rounded-full"
              >
                Try again{" "}
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="cursor-pointer sm:flex-none border border-line text-dim hover:text-body hover:border-body font-mono text-xs uppercase tracking-[0.14em] font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Close
              </button>
            </div>
          </Modal>
        )}

        {/* ── Results ───────────────────────────────────────────────── */}
        {status === "done" && result && (
          <section className="border-t border-line bg-paper-2 scroll-mt-16">
            <div className="max-w-6xl mx-auto px-6 py-20">
              <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
                <div>
                  <p className="eyebrow mb-4">The file</p>
                  <h2 className="font-display font-semibold text-3xl md:text-4xl tracking-tight">
                    {result.claims.length > 0
                      ? `${result.claims.length} claim${result.claims.length === 1 ? "" : "s"} checked.`
                      : "Transcript ready."}
                  </h2>
                </div>

                {result.claims.length > 0 && (
                  <div className="flex flex-wrap gap-2.5">
                    {(
                      Object.keys(VERDICTS) as Array<keyof typeof VERDICTS>
                    ).map((k) =>
                      tally[k] > 0 ? (
                        <span
                          key={k}
                          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em]"
                          style={{
                            color: VERDICTS[k].color,
                            borderColor: VERDICTS[k].color,
                            background: `color-mix(in srgb, ${VERDICTS[k].color} 8%, transparent)`,
                          }}
                        >
                          {VERDICTS[k].label}
                          <span className="font-semibold">{tally[k]}</span>
                        </span>
                      ) : null,
                    )}
                  </div>
                )}
              </div>

              <div className="mb-14">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim mb-3">
                  Transcript — every word, in order
                </p>
                <div className="thin-scroll rounded-2xl bg-card border border-line p-7 max-h-80 overflow-y-auto leading-relaxed text-sm whitespace-pre-wrap">
                  {result.transcript}
                </div>
              </div>

              {result.claims.length > 0 && (
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim mb-4">
                    Verdicts
                  </p>
                  <div className="grid md:grid-cols-2 gap-5">
                    {result.claims.map((claim, i) => (
                      <ClaimCard key={i} index={i} {...claim} />
                    ))}
                  </div>
                  <p className="mt-8 text-xs text-dim leading-relaxed max-w-xl">
                    Verdicts are automated. Read the transcript and open the
                    sources before you repeat anything — especially where
                    confidence is low or the stamp is unverified.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {status === "done" &&
          result &&
          result.claims.length === 0 &&
          !emptyDismissed && (
            <Modal onClose={() => setEmptyDismissed(true)}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <p className="font-mono text-xs uppercase tracking-widest text-unverified">
                  No checkable claims found
                </p>
                <button
                  type="button"
                  onClick={() => setEmptyDismissed(true)}
                  aria-label="Close"
                  className="shrink-0 -m-1 p-1 text-dim hover:text-body transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-dim leading-relaxed mb-6">
                No clearly checkable factual claims turned up in this one — it
                may be mostly opinion or narrative. The transcript is still
                below if you want to read it.
              </p>
              <button
                type="button"
                onClick={() => setEmptyDismissed(true)}
                className="btn cursor-pointer w-full bg-btn text-btn-fg font-mono text-xs uppercase tracking-[0.14em] font-semibold px-6 py-3 rounded-full"
              >
                Close
              </button>
            </Modal>
          )}

        <HowItWorks />
        <Anatomy />
        <Verdicts />
        <WhyLedger />
        <UseCases />
        <Limits />
        <Faq />
        <CtaBand />
      </div>

      <SiteFooter />
    </main>
  );
}
