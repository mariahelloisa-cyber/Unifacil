/* A duração do curso é texto livre no admin ("8 semestres", "4 anos",
   "18 meses", "1 ano e 6 meses"). Para o filtro por duração, converte em
   meses. Texto sem número reconhecível devolve null — esse curso não é
   escondido pelo filtro. */

const MESES_POR_UNIDADE: [RegExp, number][] = [
  [/^anos?$/, 12],
  [/^semestres?$/, 6],
  [/^trimestres?$/, 3],
  [/^bimestres?$/, 2],
  [/^m[eê]s(es)?$/, 1],
  [/^semanas?$/, 12 / 52],
  [/^horas?$|^h$/, 0], // carga horária não diz a duração
];

export function duracaoEmMeses(texto: string): number | null {
  const partes = [...texto.toLowerCase().matchAll(/(\d+(?:[.,]\d+)?)\s*([a-zêç]+)?/g)];
  let total = 0;
  let achou = false;

  for (const [, numero, unidade] of partes) {
    const valor = Number(numero.replace(",", "."));
    const regra = unidade ? MESES_POR_UNIDADE.find(([re]) => re.test(unidade)) : undefined;
    if (regra && regra[1] === 0) continue;
    // Número sem unidade conhecida: trata como meses.
    total += valor * (regra ? regra[1] : 1);
    achou = true;
  }

  return achou && total > 0 ? Math.round(total) : null;
}
