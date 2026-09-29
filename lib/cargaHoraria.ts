/* Lê as horas de textos como "880 horas", "3200h" ou "3.200 horas".
   Sem número (campo vazio), o curso fica fora do filtro por carga horária. */
export function cargaHorariaEmHoras(texto: string): number | null {
  const numero = texto.match(/\d[\d.]*/)?.[0];
  if (!numero) return null;
  const horas = Number(numero.replace(/\./g, ""));
  return horas > 0 ? horas : null;
}

export const formatarHoras = (horas: number) => horas.toLocaleString("pt-BR");
