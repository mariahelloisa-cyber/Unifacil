
const MESES_POR_UNIDADE: [RegExp, number][] = [
  [/^anos?$/, 12],
  [/^semestres?$/, 6],
  [/^trimestres?$/, 3],
  [/^bimestres?$/, 2],
  [/^m[eê]s(es)?$/, 1],
  [/^semanas?$/, 12 / 52],
  [/^horas?$|^h$/, 0], 
];

export function duracaoEmMeses(texto: string): number | null {
  const partes = [...texto.toLowerCase().matchAll(/(\d+(?:[.,]\d+)?)\s*([a-zêç]+)?/g)];
  let total = 0;
  let achou = false;

  for (const [, numero, unidade] of partes) {
    const valor = Number(numero.replace(",", "."));
    const regra = unidade ? MESES_POR_UNIDADE.find(([re]) => re.test(unidade)) : undefined;
    if (regra && regra[1] === 0) continue;
    
    total += valor * (regra ? regra[1] : 1);
    achou = true;
  }

  return achou && total > 0 ? Math.round(total) : null;
}
