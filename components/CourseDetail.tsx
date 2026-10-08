"use client";

import { useState } from "react";
import MatriculaButton from "./MatriculaButton";
import BeneficiosCurso from "./BeneficiosCurso";
import { SITE } from "@/lib/constants";
import type { Course } from "@/lib/data/courses";

/* Página "Saiba mais" do curso — réplica do layout da página de produto do
   site antigo (universidadefacil.com.br/produto/...): faixa em degradê com o
   nome e a duração, caixas de Duração/Carga horária, "Sobre o curso" e, à
   direita, o card branco de matrícula (topo roxo, benefícios em ícones) que
   sobe por cima da faixa. Sem preço no site. A grade curricular saiu, como pedido.
   Cores medidas do CSS original (#5ABA0C no Matricule-se e o degradê azul do
   consultor); roxo e laranja são os oficiais da marca. */

const FORMAS_DE_PAGAMENTO = ["Pix", "Cartão de crédito", "Boleto"];

/* O EJA não é reconhecido pelo MEC: quem certifica são escolas credenciadas
   pela Secretaria Estadual de Educação (Resolução CNE/CEB nº 1, de 28/05/2021).
   Os demais níveis seguem com o reconhecimento do MEC. */
const ehEja = (course: Course) => /\beja\b/i.test(`${course.nivelNome} ${course.nome}`);

/* Itens do quadro laranja: os destaques do curso no admin; sem eles, os
   itens-padrão do programa. */
function itensDoCurso(course: Course) {
  if (course.destaques.length > 0) return course.destaques;
  const credenciamento = ehEja(course) ? "Credenciado pela SEED" : "Autorizado pelo MEC";
  return ["Sem taxa de matrícula", "Certificado de conclusão", credenciamento, course.modalidade].filter(Boolean);
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
      <section className="bg-white px-5 pb-0 pt-5 sm:px-[50px] sm:pt-[50px] lg:px-0 lg:pt-5">
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
                {/* A descrição vem do admin (coluna descricao); sem ela, fica só a modalidade ("EAD"). */}
                {course.descricao ? (
                  <p className="whitespace-pre-line">
                    <strong>Sobre o curso</strong>: {course.descricao}
                  </p>
                ) : (
                  <p>
                    <strong>Modalidade</strong>: {course.modalidade}
                  </p>
                )}
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

          {/* Card de matrícula — sobe 180px por cima da faixa no desktop e acompanha a rolagem. */}
          <aside className="mt-[18px] w-full lg:sticky lg:top-[130px] lg:-mt-[180px] lg:w-[440px] lg:shrink-0">
            <div className="flex flex-col gap-3 rounded-[22px] border border-navy-950/5 bg-white p-3 shadow-[0_18px_45px_rgba(31,15,43,0.16)]">
              {/* Topo roxo: categoria, nome e formas de pagamento. */}
              <div className="relative overflow-hidden rounded-[16px] bg-navy-800 px-5 pb-5 pt-5">
                <IconeFormatura className="pointer-events-none absolute right-4 top-1/2 h-[92px] w-[92px] -translate-y-1/2 text-white/15" />
                <p className="relative text-[14px] font-extrabold uppercase tracking-wide text-gold">{course.nivelNome}</p>
                <h1 className="relative mt-1 pr-20 text-[30px] font-extrabold leading-[1.1] text-white">
                  {tituloDoCard(course)}
                </h1>
                <AbasPagamento />
              </div>

              <div className="rounded-[14px] bg-tint px-5 py-4">
                <h2 className="text-[20px] font-extrabold leading-tight text-navy-800">
                  Dê o próximo passo
                  <br />
                  no seu futuro!
                </h2>
                <p className="mt-1.5 text-[14px] leading-snug text-muted">{chamadaDoCurso(course)}</p>
              </div>

              <MatriculaButton
                curso={cursoMatricula}
                className="flex w-full items-center justify-center gap-2.5 rounded-[14px] bg-[#4BB33A] px-6 py-4 text-[16px] font-extrabold uppercase text-white transition-[filter] hover:brightness-95"
              >
                <IconeCapelo />
                Matricule-se agora
                <span aria-hidden>→</span>
              </MatriculaButton>

              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 rounded-[14px] border-2 border-navy-800 bg-white px-6 py-3.5 text-[15px] font-bold text-navy-800 transition-colors hover:bg-tint"
              >
                <IconeWhatsapp />
                Falar com um consultor
              </a>

              {/* Benefícios: os destaques do curso no admin; sem eles, os itens-padrão. */}
              <ul
                className="grid gap-2 rounded-[14px] bg-[#FDF3E1] px-2 py-4"
                style={{ gridTemplateColumns: `repeat(${Math.min(itensDoCurso(course).length, 4)}, minmax(0, 1fr))` }}
              >
                {itensDoCurso(course).map((item) => (
                  <li key={item} className="flex flex-col items-center gap-1.5 text-center">
                    <IconeBeneficio item={item} />
                    <span className="text-[12px] font-bold leading-tight text-navy-950">{rotuloBeneficio(item)}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-3 rounded-[14px] bg-tint px-4 py-4">
                <span className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-navy-800 text-[13px] font-extrabold text-white">
                  i
                </span>
                <div>
                  <p className="text-[14px] font-extrabold text-navy-800">Importante</p>
                  <p className="mt-1 text-[13px] leading-snug text-muted">
                    A bolsa é mantida enquanto você acompanha o curso. Ela pode ser cancelada em caso de ausência por
                    mais de 30 dias consecutivos, reprovação em 3 disciplinas ou informações falsas no cadastro.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <BeneficiosCurso />
    </>
  );
}

/* Título do card sem o prefixo da categoria: "EJA – Ensino Fundamental" vira
   "Ensino Fundamental", já que "EJA" aparece em dourado logo acima. */
function tituloDoCard(course: Course) {
  const prefixo = new RegExp(`^${course.nivelNome.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[–—-]\\s*`, "i");
  return course.nome.replace(prefixo, "");
}

/* Texto da caixa "Dê o próximo passo": no EJA fala em concluir a etapa. */
function chamadaDoCurso(course: Course) {
  if (ehEja(course)) {
    return `Garanta sua vaga agora e conclua o ${tituloDoCard(course).toLowerCase()} com uma instituição reconhecida e de confiança.`;
  }
  return "Garanta sua vaga agora e comece seu curso com uma instituição reconhecida e de confiança.";
}

/* Pix / Cartão / Boleto em pílulas. Sem preço no site, servem só de
   indicação das formas de pagamento aceitas. */
function AbasPagamento() {
  const [ativa, setAtiva] = useState(0);
  return (
    <div role="tablist" aria-label="Formas de pagamento" className="relative mt-4 flex flex-wrap gap-2">
      {FORMAS_DE_PAGAMENTO.map((forma, i) => (
        <button
          key={forma}
          type="button"
          role="tab"
          aria-selected={ativa === i}
          onClick={() => setAtiva(i)}
          className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
            ativa === i ? "border-gold bg-gold text-navy-950" : "border-white/80 bg-transparent text-white hover:bg-white/10"
          }`}
        >
          {forma}
        </button>
      ))}
    </div>
  );
}

/* Rótulo do benefício: o item "EAD" ganha a segunda linha "100% online". */
function rotuloBeneficio(item: string) {
  if (/^ead$/i.test(item.trim())) {
    return (
      <>
        EAD
        <br />
        100% online
      </>
    );
  }
  return item;
}

/* Ícone de cada benefício, escolhido pelo texto do item. */
function IconeBeneficio({ item }: { item: string }) {
  const t = item.toLowerCase();
  const props = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "text-navy-800",
  };

  if (/taxa|desconto|%/.test(t)) {
    return (
      <svg {...props}>
        <path d="M19 5 5 19" />
        <circle cx="6.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    );
  }
  if (/certificad|diploma/.test(t)) {
    return (
      <svg {...props}>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
      </svg>
    );
  }
  if (/credenciad|autorizad|reconhecid|mec|seed/.test(t)) {
    return (
      <svg {...props}>
        <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z" />
        <path d="m8.8 12 2.2 2.2 4.2-4.4" />
      </svg>
    );
  }
  if (/ead|online|distância/.test(t)) {
    return (
      <svg {...props}>
        <rect x="4" y="5" width="16" height="11" rx="1.5" />
        <path d="M2 19h20" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function IconeCapelo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3 1 8.5 12 14l9-4.5V16h2V8.5z" />
      <path d="M5.5 12.2V16c0 1.9 2.9 3.5 6.5 3.5s6.5-1.6 6.5-3.5v-3.8L12 15.5z" />
    </svg>
  );
}

/* Capelo sobre um livro aberto, decorativo no topo roxo do card. */
function IconeFormatura({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M32 6 10 16l22 10 22-10z" />
      <path d="M19 20.5V28c0 3.3 5.8 6 13 6s13-2.7 13-6v-7.5" />
      <path d="M54 16v11" />
      <path d="M8 40c8-3 16-3 24 2 8-5 16-5 24-2v18c-8-3-16-3-24 2-8-5-16-5-24-2z" />
      <path d="M32 42v18" />
    </svg>
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
