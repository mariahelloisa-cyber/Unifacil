"use server";

import { supabasePublic } from "@/lib/supabase/publicClient";
import {
  FAIXAS_RENDA,
  ORIGEM_MATRICULA,
  cpfValido,
  emailValido,
  soDigitos,
  telefoneValido,
} from "@/lib/matricula";

export type MatriculaFormState =
  | { ok: true }
  | { ok?: false; error?: string; campos?: Partial<Record<CampoMatricula, string>> }
  | undefined;

type CampoMatricula = "nome" | "cpf" | "email" | "telefone" | "curso" | "renda" | "observacao";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/* O formulário "Matricule-se": grava o pedido em public.matriculas, que o
   admin lê em /admin/matriculas. Usa a chave pública — a RLS só deixa o
   visitante inserir, nunca ler. */
export async function enviarMatricula(
  _prev: MatriculaFormState,
  formData: FormData
): Promise<MatriculaFormState> {
  const texto = (campo: string) => String(formData.get(campo) ?? "").trim();

  /* Campo escondido: gente não vê, robô de spam preenche. Finge que deu certo. */
  if (texto("site")) return { ok: true };

  const nome = texto("nome").replace(/\s+/g, " ");
  const cpf = soDigitos(texto("cpf"));
  const email = texto("email").toLowerCase();
  const telefone = soDigitos(texto("telefone"));
  const cursoId = texto("curso_id");
  const observacao = texto("observacao");
  const origemParam = texto("origem");
  const origem = Object.hasOwn(ORIGEM_MATRICULA, origemParam) ? origemParam : "matricula";
  const renda = texto("renda");

  const campos: Partial<Record<CampoMatricula, string>> = {};
  if (nome.length < 3 || !nome.includes(" ")) campos.nome = "Informe o nome completo.";
  else if (nome.length > 150) campos.nome = "Nome muito longo.";
  if (!cpfValido(cpf)) campos.cpf = "CPF inválido.";
  if (!emailValido(email) || email.length > 200) campos.email = "E-mail inválido.";
  if (!telefoneValido(telefone)) campos.telefone = "Telefone inválido — use DDD + número.";
  if (!UUID.test(cursoId)) campos.curso = "Escolha o curso desejado.";
  /* A vaga gratuita precisa da renda (é o critério de elegibilidade); nos
     outros formulários ela não aparece. */
  if (origem === "vaga_gratuita" && !Object.hasOwn(FAIXAS_RENDA, renda)) campos.renda = "Escolha a faixa de renda.";
  if (observacao.length > 1000) campos.observacao = "Use no máximo 1000 caracteres.";
  if (Object.keys(campos).length > 0) return { campos };

  /* O nome do curso vem do banco, não do formulário. */
  const { data: curso } = await supabasePublic
    .from("courses")
    .select("id, nome, course_niveis!nivel_id(nome)")
    .eq("id", cursoId)
    .maybeSingle<{ id: string; nome: string; course_niveis: { nome: string } | null }>();
  if (!curso) return { campos: { curso: "Escolha o curso desejado." } };

  const nivel = curso.course_niveis?.nome;
  const { error } = await supabasePublic.from("matriculas").insert({
    nome,
    cpf,
    email,
    telefone,
    curso_id: curso.id,
    curso_nome: nivel ? `${curso.nome} (${nivel})` : curso.nome,
    observacao,
    origem,
    renda: origem === "vaga_gratuita" ? renda : null,
  });

  if (error) {
    console.error("Erro ao salvar matrícula:", error.message);
    return { error: "Não conseguimos enviar agora. Tente de novo em instantes." };
  }

  return { ok: true };
}
