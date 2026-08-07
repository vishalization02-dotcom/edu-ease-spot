export type AiIntent =
  | "pending_fees"
  | "absent_today"
  | "revenue_month"
  | "total_students"
  | "best_class"
  | "attendance_today"
  | "pending_amount"
  | "unsupported";

export interface AiListItem {
  label: string;
  value?: string;
}

export interface AiStat {
  label: string;
  value: string;
  tone?: "default" | "positive" | "negative";
}

export interface AiAnswer {
  intent: AiIntent;
  title: string;
  items?: AiListItem[];
  stats?: AiStat[];
  footnote?: string;
  empty?: string;
}

/** Any engine (local rules today, OpenAI / Supabase AI later) implements this. */
export interface AiEngine {
  answer(question: string): Promise<AiAnswer>;
}

export interface AiSuggestion {
  emoji: string;
  text: string;
}
