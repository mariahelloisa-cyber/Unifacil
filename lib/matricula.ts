/* Regras do formulário de matrícula — usadas no navegador (máscaras) e na
   server action (validação de verdade). CPF e telefone são guardados só com
   os dígitos. */

export const STATUS_MATRICULA = {
  novo: "Novo",
  em_contato: "Em contato",
  matriculado: "Matriculado",
  descartado: "Descartado",
} as const;

export type StatusMatricula = keyof typeof STATUS_MATRICULA;

/* De qual botão veio o pedido — o mesmo formulário muda o texto conforme a
   origem, e a simulação de desconto pede também a renda. */
export const ORIGEM_MATRICULA = {
  matricula: "Matrícula",
  vaga_gratuita: "Vaga gratuita",
  simulacao: "Simulação de desconto",
} as const;

export type OrigemMatricula = keyof typeof ORIGEM_MATRICULA;

/* Renda familiar mensal em faixas de salário mínimo. */
export const FAIXAS_RENDA = {
  ate_1: "Até 1 salário mínimo",
  "1_2": "De 1 a 2 salários mínimos",
  "2_3": "De 2 a 3 salários mínimos",
  "3_5": "De 3 a 5 salários mínimos",
  acima_5: "Acima de 5 salários mínimos",
} as const;

export type FaixaRenda = keyof typeof FAIXAS_RENDA;

export const soDigitos = (valor: string) => valor.replace(/\D/g, "");

/** Confere os dois dígitos verificadores do CPF. */
export function cpfValido(valor: string) {
  const cpf = soDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const digito = (ate: number) => {
    let soma = 0;
    for (let i = 0; i < ate; i++) soma += Number(cpf[i]) * (ate + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}

/** DDD + 8 ou 9 dígitos. */
export const telefoneValido = (valor: string) => /^[1-9]{2}\d{8,9}$/.test(soDigitos(valor));

export const emailValido = (valor: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());

export function formatarCpf(valor: string) {
  const d = soDigitos(valor).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

export function formatarTelefone(valor: string) {
  const d = soDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  const ddd = d.slice(0, 2);
  const resto = d.slice(2);
  const corte = d.length === 11 ? 5 : 4;
  return resto.length > corte
    ? `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`
    : `(${ddd}) ${resto}`;
}
