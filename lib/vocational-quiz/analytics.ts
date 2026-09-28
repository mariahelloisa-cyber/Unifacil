export type VocationalEvent =
  | "vocational_quiz_started"
  | "vocational_question_answered"
  | "vocational_quiz_completed"
  | "vocational_course_clicked"
  | "vocational_quiz_restarted";

type Params = Record<string, string | number>;

type AnalyticsWindow = Window & {
  gtag?: (command: "event", name: string, params?: Params) => void;
  dataLayer?: Array<Record<string, unknown>>;
};

export function trackVocationalEvent(name: VocationalEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  try {
    if (typeof w.gtag === "function") w.gtag("event", name, params);
    else if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: name, ...params });
  } catch {
    
  }
}
