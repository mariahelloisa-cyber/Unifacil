import { TRAIT_COPY } from "./traitCopy.ts";
import type { Trait } from "./types.ts";

/** "a", "a e b", "a, b e c". */
export function joinPt(itens: string[]): string {
  if (itens.length <= 1) return itens[0] ?? "";
  return `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;
}

/** Explicação do curso em destaque, montada a partir das dimensões que mais
 *  explicaram o match. Determinística: mesmas dimensões, mesmo texto. */
export function buildMainExplanation(traits: Trait[]): string {
  if (traits.length === 0) {
    return "Esse curso aparece no topo porque o conjunto das suas respostas se aproxima do perfil dele.";
  }
  const labels = joinPt(traits.map((t) => TRAIT_COPY[t].label));
  return `Esse curso combina com você porque suas respostas demonstraram forte interesse por ${labels}. Na prática, ${TRAIT_COPY[traits[0]].phrase}.`;
}

/** Versão curta para os cards secundários (#2 e #3). */
export function buildShortExplanation(traits: Trait[]): string {
  if (traits.length === 0) return "Esse curso também se aproxima do seu perfil.";
  const [primeiro, ...resto] = traits;
  const base = `Seu perfil também indica que ${TRAIT_COPY[primeiro].phrase}`;
  const outros = resto.slice(0, 2).map((t) => TRAIT_COPY[t].label);
  return outros.length > 0 ? `${base}, com afinidade para ${joinPt(outros)}.` : `${base}.`;
}
