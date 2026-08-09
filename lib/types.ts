export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type Source = {
  title?: string;
  url: string;
};

export type Verdict = {
  text: string;
  verdict: "true" | "false" | "unverified";
  confidence: number | null;
  explanation: string;
  sources: Source[];
};
