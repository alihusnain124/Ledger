# Ledger

Paste a video link. Ledger downloads the audio, transcribes it, pulls out the
checkable factual claims, and checks each one — with sources when a search
key is configured.

**Stack:** Next.js only (App Router). The frontend is a client component;
everything server-side (download, transcription, claim extraction,
verification) runs in a single Next.js API route (`app/api/analyze/route.js`)
using the Node.js runtime. No separate backend needed.

## 1. System dependencies

These do the actual audio work and aren't npm packages — install them once,
system-wide.

**macOS**

```bash
brew install yt-dlp ffmpeg
```

**Ubuntu / Debian**

```bash
sudo apt update
sudo apt install ffmpeg
python3 -m pip install -U yt-dlp
```

**Windows**

```powershell
winget install yt-dlp.yt-dlp
winget install Gyan.FFmpeg
```

Verify both are on your PATH:

```bash
yt-dlp --version
ffmpeg -version
```

## 2. Project setup

```bash
cd ledger
npm install
cp .env.example .env.local
```

## 3. API keys (all have free tiers)

Open `.env.local` and fill in:

| Key | Required? | Get it at | What it's for |
|---|---|---|---|
| `GROQ_API_KEY` | Yes | console.groq.com | Fast, free Whisper transcription |
| `OPENROUTER_API_KEY` | Yes | openrouter.ai | Free open models (Llama/Mistral/Gemma) for claim extraction + verdicts |
| `TAVILY_API_KEY` | Optional, recommended | tavily.com | Grounds verdicts in real search results instead of the model's memory alone |

Without `TAVILY_API_KEY`, Ledger still works — it just relies on the model's
own knowledge, and is instructed to say "unverified" rather than guess when
it isn't sure. With it, each verdict can cite real sources.

## 4. Run it

```bash
npm run dev
```

Open http://localhost:3000, paste a link, click **Open the file**.

## Notes on scope

- **File size guardrail:** audio over ~24MB is rejected before transcription
  (roughly a 20–30 minute clip at the compressed bitrate used here) to stay
  under typical hosted Whisper upload limits. Raise `MAX_BYTES` in
  `lib/download.js` if you need longer clips and your transcription plan
  supports it.
- **One synchronous request:** analysis runs as a single request/response —
  simple to reason about, but the tab has to stay open for the duration
  (a minute or two for a typical clip). A background job queue with
  progress polling would be the natural next step for longer clips.
- **Model IDs drift:** free model names on Groq and OpenRouter change
  periodically. If a request starts failing with a "model not found"-style
  error, check the current free model list at
  https://openrouter.ai/models?max_price=0 and https://console.groq.com/docs/models,
  then override via `GROQ_WHISPER_MODEL` / `OPENROUTER_MODEL` in `.env.local`.
- **Platform terms of service:** downloading video/audio from some
  platforms may run against their terms of service depending on how you use
  it. Fine for personal use and prototyping — worth reviewing before
  shipping this as a public product.
- **Fact-checking is hard, even grounded.** Treat verdicts as a strong
  starting point, not a court ruling — especially on "unverified" claims,
  which the model is deliberately biased toward when it isn't confident.
