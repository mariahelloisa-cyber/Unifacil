"use client";

import { useState } from "react";
import MatriculaButton from "./MatriculaButton";
import BeneficiosCurso from "./BeneficiosCurso";
import { SITE } from "@/lib/constants";
import type { Course } from "@/lib/data/courses";

/* Página "Saiba mais" do curso — réplica do layout da página de produto do
   site antigo (universidadefacil.com.br/produto/...): faixa em degradê com o
   nome e a duração, caixas de Duração/Carga horária, "Sobre o curso" e, à
   direita, o card roxo que sobe por cima da faixa. Sem preço: onde havia
   valor fica "Consulte". A grade curricular saiu, como pedido.
   Cores medidas do CSS original (#5ABA0C no Matricule-se e o degradê azul do
   consultor); roxo e laranja são os oficiais da marca. */

const FORMAS_DE_PAGAMENTO = ["Pix", "Cartão de crédito", "Boleto"];

/* Itens do quadro laranja: os destaques do curso no admin; sem eles, os
   itens-padrão do programa. */
function itensDoCurso(course: Course) {
  if (course.destaques.length > 0) return course.destaques;
  return ["Sem taxa de matrícula", "Certificado de conclusão", "Autorizado pelo MEC", course.modalidade].filter(
    Boolean
  );
}

/* Carga horária da caixa roxa: o campo do admin (só o "1440 horas" do começo,
   se houver texto depois); sem ele, a soma das horas da grade. */
function cargaHoraria(course: Course) {
  if (course.cargaHoraria) {
    const horas = course.cargaHoraria.match(/^\s*(\d[\d.]*)\s*h(oras?)?\b/i);
    return horas ? `${horas[1]} Horas` : course.cargaHoraria;
  }
  const total = course.grade
    .flatMap((m) => m.disciplinas)
    .reduce((soma, d) => soma + (Number((d.horas ?? "").replace(/[^\d]/g, "")) || 0), 0);
  return total > 0 ? `${total} Horas` : null;
}

export default function CourseDetail({ course }: { course: Course }) {
  const cursoMatricula = { id: course.id, nome: course.nome, nivel: course.nivelNome };
  const carga = cargaHoraria(course);

  return (
    <>
      {/* ---------- Faixa em degradê ---------- */}
      <section
        className="px-5 pb-5 pt-[50px] sm:px-[50px] sm:py-[50px] lg:px-0 lg:py-[100px]"
        style={{ backgroundImage: "linear-gradient(119deg, var(--color-navy-800) 0%, var(--color-gold) 100%)" }}
      >
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="lg:w-[60%]">
            <Estrelas />
            <h2 className="mt-2 text-[29px] font-extrabold uppercase leading-[1.1] text-white sm:text-[47px]">
              {course.nome}
            </h2>
            {course.duracao && <p className="mt-2 text-[20px] text-white">{course.duracao}</p>}
          </div>
        </div>
      </section>

      {/* ---------- Conteúdo + card ---------- */}
      <section className="bg-white px-5 py-5 sm:px-[50px] sm:py-[50px] lg:px-0 lg:pb-[100px] lg:pt-5">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col lg:flex-row lg:items-start">
          {/* Coluna da esquerda */}
          <div className="flex flex-col gap-5 lg:w-[70%] lg:pr-[25px]">
            <div className="flex flex-col gap-[5px] sm:gap-5 lg:flex-row">
              <CaixaInfo icone={<IconeCalendario />} titulo="Duração" valor={course.duracao || "Consulte"} />
              {carga ? (
                <CaixaInfo icone={<IconeRelogio />} titulo="Carga horária" valor={carga} />
              ) : (
                <CaixaInfo icone={<IconeRelogio />} titulo="Modalidade" valor={course.modalidade} />
              )}
            </div>

            <div className="rounded-[10px] border border-navy-800 bg-white p-5">
              <h2 className="text-[30px] font-extrabold uppercase leading-tight text-navy-800">Sobre o curso</h2>
              <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-black">
                {/* O texto de Modalidade vem do admin (coluna descricao); sem ele, só "EAD". */}
                <p className="whitespace-pre-line">
                  <strong>Modalidade</strong>: {course.descricao || course.modalidade}
                </p>
                {course.inicio && (
                  <p>
                    <strong>Início do Curso</strong>: {course.inicio}
                  </p>
                )}
                {course.cargaHoraria && (
                  <p>
                    <strong>Carga Horária</strong>: {course.cargaHoraria}
                  </p>
                )}
                {course.avaliacao && (
                  <p>
                    <strong>Avaliação e Certificação:</strong> {course.avaliacao}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Card roxo — sobe 180px por cima da faixa no desktop e acompanha a rolagem. */}
          <aside className="mt-[18px] w-full lg:sticky lg:top-[130px] lg:-mt-[180px] lg:w-[500px] lg:shrink-0">
            <div className="flex flex-col gap-2.5 rounded-[10px] border-b-[10px] border-gold bg-navy-800 p-5 lg:p-[30px]">
              <h1 className="text-center text-[30px] font-extrabold uppercase leading-tight text-white">
                {course.nome}
              </h1>

              <AbasPagamento cursoMatricula={cursoMatricula} />

              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2.5 flex w-full items-center justify-center gap-2.5 rounded-full px-[30px] py-[15px] text-[16px] font-bold text-white transition-[filter] hover:brightness-110"
                style={{ backgroundImage: "linear-gradient(244deg, #00EEFF 0%, #1B75E8 100%)" }}
              >
                <IconeWhatsapp />
                Falar com consultor
              </a>

              <ul className="self-center rounded-[20px] bg-gold p-[30px]">
                {itensDoCurso(course).map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[18px] font-bold text-navy-800">
                    <svg width="21" height="21" viewBox="0 0 512 512" fill="currentColor" aria-hidden className="shrink-0">
                      <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="rounded-[20px] border-b-[10px] border-gold bg-[#290736] p-5 text-center text-[18px] text-white">
                O valor do curso é fixo e se mantém assim, desde que o aluno não fique inadimplente ou não tranque a
                matrícula.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <BeneficiosCurso />
    </>
  );
}

/* Pix / Cartão / Boleto: abas em pílula como no original. Sem preço no site,
   todas mostram "Consulte" e o Matricule-se. */
function AbasPagamento({ cursoMatricula }: { cursoMatricula: { id: string; nome: string; nivel?: string } }) {
  const [ativa, setAtiva] = useState(0);
  return (
    <div className="flex w-full flex-col gap-[13px]">
      <div role="tablist" aria-label="Formas de pagamento" className="flex flex-wrap justify-center gap-y-2 sm:gap-x-[15px]">
        {FORMAS_DE_PAGAMENTO.map((forma, i) => (
          <button
            key={forma}
            type="button"
            role="tab"
            aria-selected={ativa === i}
            onClick={() => setAtiva(i)}
            className={`rounded-full border-2 border-white px-2.5 py-[5px] text-[14px] font-medium text-white transition-colors ${
              ativa === i ? "bg-gold" : "bg-transparent hover:bg-[#2E1238]"
            }`}
          >
            {forma}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="flex flex-col gap-[13px]">
        <p className="text-center text-[41px] font-extrabold leading-tight text-white">Consulte</p>
        <MatriculaButton
          curso={cursoMatricula}
          className="flex w-full items-center justify-center rounded-full bg-[#5ABA0C] px-10 py-3.5 text-[15px] font-extrabold uppercase text-white transition-[filter] hover:brightness-95 lg:text-[21px]"
        >
          Matricule-se
        </MatriculaButton>
      </div>
    </div>
  );
}

/* Caixa roxa com borda inferior laranja grossa, ícone num círculo branco. */
function CaixaInfo({ icone, titulo, valor }: { icone: React.ReactNode; titulo: string; valor: string }) {
  return (
    <div className="flex flex-1 items-center gap-[15px] rounded-[10px] border border-b-[10px] border-gold bg-navy-800 p-[15px] sm:gap-[18px]">
      <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-2 border-white bg-white p-2.5 text-black">
        {icone}
      </span>
      <div>
        <h3 className="mb-[3px] text-[20px] font-extrabold uppercase leading-tight text-white sm:mb-0 sm:text-[16px]">
          {titulo}
        </h3>
        <p className="text-[12px] leading-none text-white sm:text-[20px] sm:leading-snug">{valor}</p>
      </div>
    </div>
  );
}

function Estrelas() {
  return (
    <div className="flex" role="img" aria-label="Classificado como 5 de 5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 1000 1000" fill="#f0ad4e" aria-hidden>
          <path d="M450 75L338 312 88 350C46 354 25 417 58 450L238 633 196 896C188 942 238 975 275 954L500 837 725 954C767 975 813 942 804 896L763 633 942 450C975 417 954 358 913 350L663 312 550 75C529 33 471 33 450 75Z" />
        </svg>
      ))}
    </div>
  );
}

function IconeCalendario() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M8 3v3M16 3v3M7 13h2.5M11 13h2.5M15 13h2.5M7 16.5h2.5M11 16.5h2.5" />
    </svg>
  );
}

function IconeRelogio() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function IconeWhatsapp() {
  return (
    <svg width="18" height="18" viewBox="0 0 448 512" fill="currentColor" aria-hidden>
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  );
}
