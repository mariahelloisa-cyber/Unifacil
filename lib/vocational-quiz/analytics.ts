/* O site ainda não carrega Google Analytics, GTM nem outro analytics. Este
   helper não instala nada: só repassa o evento se um deles existir na página
   (gtag tem preferência — ele mesmo já escreve no dataLayer, então enviar
   pelos dois duplicaria o evento). Nunca envia o texto das respostas. */

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
    /* analytics nunca pode quebrar o teste */
  }
}
