export type FriendlyError = {
  title: string;
  message: string;
  detail?: string;
};

const UNAVAILABLE: FriendlyError = {
  title: "Ledger can't run checks right now",
  message:
    "Something on our side isn't responding, so the check couldn't go through. Sorry for the trouble. Please try again a little later.",
};

const RULES: Array<{
  match: RegExp;
  title?: string;
  message?: string;
  internal?: boolean;
}> = [
  { match: /(API_KEY|api key) is not set|Missing .*key/i, internal: true },
  { match: /Couldn't run "(yt-dlp|ffmpeg)"/i, internal: true },
  { match: /No supported JavaScript runtime|js-runtimes|EJS/i, internal: true },
  {
    match: /Sign in to confirm|not a bot|confirm your age|cookies/i,
    title: "The video host blocked the download",
    message:
      "The site asked for a sign-in or an age check before handing over the audio, which Ledger can't do. A clip that plays without signing in will go through.",
  },
  {
    match: /Private video|Video unavailable|removed by the uploader|no longer available|This video is not available/i,
    title: "That video isn't available",
    message:
      "The link points at something private, deleted, or blocked in this region, so there was nothing to download.",
  },
  {
    match: /HTTP Error 403|Forbidden/i,
    title: "The video host refused the download",
    message:
      "The site turned the request away before any audio came across. This often clears on its own. Try again shortly, or use a different link.",
  },
  {
    match: /is live|live stream|premiere/i,
    title: "That one is still live",
    message:
      "Live streams and premieres have no finished audio track to pull. Once the recording is posted, the same link usually works.",
  },
  {
    match: /too large|max-?filesize|under ~?20 minutes/i,
    title: "That clip is too long",
    message:
      "Audio past roughly 20–30 minutes goes over the transcription limit. Try a shorter clip, or trim it and paste the short version.",
  },
  {
    match:
      /no audio came out|Couldn't download that link|Unsupported URL|Unable to (extract|download)|HTTP Error 4\d\d/i,
    title: "That link wouldn't open",
    message:
      "Ledger couldn't pull an audio track from it. Private, deleted, age-restricted, region-locked, and live videos usually fail here. A different link normally works.",
  },
  {
    match: /empty transcript|no speech/i,
    title: "No speech in that one",
    message:
      "The audio came through, but there were no spoken words to transcribe. Music-only or silent clips end up here.",
  },
  {
    match: /every free model|free model .*unavailable/i,
    title: "The free models are all busy",
    message:
      "Ledger tried every free model it can reach and each one was rate-limited. That's the shared free pool, not your link. Wait a few minutes and run it again, or add your own provider key at openrouter.ai/settings/integrations for steadier limits.",
  },
  {
    match:
      /Transcription failed \((429|5\d\d)\)|rate.?limit|quota|too many requests/i,
    title: "The service is busy",
    message:
      "The transcription or model service is rate-limited right now. Give it a minute and run the same link again.",
  },
  {
    match: /Transcription failed/i,
    title: "The audio couldn't be transcribed",
    message:
      "The clip downloaded fine, but the transcription step rejected it. A different clip, or the same one a minute later, usually goes through.",
  },
  {
    match:
      /Model request failed|empty response|parse the model's response|model not found/i,
    title: "The checker couldn't finish",
    message:
      "The transcript came back, but the model that pulls out and checks claims returned something Ledger couldn't read. Running it again normally works.",
  },
  {
    match:
      /fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|network|socket hang up/i,
    title: "Couldn't reach an outside service",
    message:
      "The server lost its connection partway through the check. This is almost always temporary. Try again in a moment.",
  },
  {
    match: /timed? ?out|aborted/i,
    title: "That took too long",
    message:
      "The check ran past the time limit before it finished. Shorter clips get through more reliably.",
  },
];

export function friendlyError(raw: unknown): FriendlyError {
  const detail =
    raw instanceof Error
      ? raw.message
      : typeof raw === "string"
        ? raw
        : undefined;

  if (detail) {
    for (const rule of RULES) {
      if (rule.match.test(detail)) {
        if (rule.internal) return { ...UNAVAILABLE };
        return { title: rule.title!, message: rule.message!, detail };
      }
    }
  }

  return {
    title: "Something went wrong on our side",
    message:
      "The check stopped partway through for a reason Ledger couldn't identify. Try the same link again. If it keeps failing, the clip is probably the problem.",
    detail,
  };
}
