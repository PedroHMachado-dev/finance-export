import React, { useState } from 'react';
import {
  Sparkles,
  Wrench,
  ShieldCheck,
  History,
  ChevronDown,
  Layers,
  Database,
  Clock,
  Target,
} from 'lucide-react';

export default function ReleaseNotes() {
  const [expandedVersions, setExpandedVersions] = useState({
    'v0.3.0': false,
    'v0.2.0': false,
    'v0.1.0': false,
  });

  const toggleVersion = (ver) => {
    setExpandedVersions((prev) => ({
      ...prev,
      [ver]: !prev[ver],
    }));
  };

  const toggleAll = () => {
    const allExpanded = Object.values(expandedVersions).every(Boolean);
    setExpandedVersions({
      'v0.3.0': !allExpanded,
      'v0.2.0': !allExpanded,
      'v0.1.0': !allExpanded,
    });
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Release v0.4.0 - Destaque Versão Atual */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200/80 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-6 py-8 dark:border-slate-800 dark:from-emerald-950/40 dark:via-slate-900 dark:to-cyan-950/30 sm:px-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-4 w-4" /> Versão Atual
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  FinanceExport v0.4.0
                </h1>
                <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Metas & Estatísticas
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Metas financeiras, estatísticas reorganizadas e uma Visão Geral mais direta da sua situação financeira.
              </p>
            </div>
            <time className="shrink-0 text-sm font-semibold text-slate-500 dark:text-slate-400">
              18 de setembro de 2026
            </time>
          </div>
        </div>

        <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[180px_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Target className="h-4 w-4" /> Novidades
            </span>
          </div>
          <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-slate-600 marker:text-emerald-500 dark:text-slate-300">
            <li>Nova aba <strong>Metas</strong>: crie metas como "Viagem" ou "Carro novo" e acompanhe o progresso com base em tudo que você já guardou nas caixinhas até hoje. Edite ou exclua suas metas quando quiser.</li>
            <li>As abas "Cartão & Conta" e "Caixinhas" foram unidas em uma única aba <strong>Estatísticas</strong>, facilitando comparar tudo em um só lugar.</li>
            <li>O gráfico de Caixinhas agora usa barras: verde claro mostra quanto você guardou no mês, verde escuro mostra o total que já tem guardado.</li>
            <li>O Controle Semanal agora permite escolher entre ver os últimos 1 ou 3 meses, e clicar em um dia da semana mostra todas as movimentações feitas naquele dia (por exemplo, todas as terças-feiras) no período escolhido.</li>
          </ul>

          <div>
            <span className="inline-flex items-center gap-2 rounded-xl bg-cyan-50 px-3 py-2 text-sm font-bold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
              <Wrench className="h-4 w-4" /> Melhorias
            </span>
          </div>
          <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-slate-600 marker:text-cyan-500 dark:text-slate-300">
            <li>Novo card na Visão Geral mostrando quanto você já tem guardado nas caixinhas, bem ao lado do Saldo Líquido.</li>
            <li>Os gráficos "Receitas vs Despesas" e "Despesas por Categoria" agora aparecem juntos, um do lado do outro no mesmo card.</li>
            <li>O filtro de período ficou menor e agora vive dentro do card dos gráficos — mudar o período ali não afeta mais os cards de resumo no topo da tela.</li>
          </ul>
        </div>
      </div>

      {/* Cabeçalho da Seção de Histórico */}
      <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Linha do Tempo & Versões Anteriores</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Histórico detalhado da evolução e marcos do projeto
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleAll}
          className="self-start text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors sm:self-auto"
        >
          {Object.values(expandedVersions).every(Boolean) ? 'Recolher todas' : 'Expandir todas'}
        </button>
      </div>

      {/* Versões Anteriores */}
      <div className="space-y-4">
        {/* Release v0.3.0 */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/90">
          <button
            type="button"
            onClick={() => toggleVersion('v0.3.0')}
            className="w-full text-left border-b border-transparent data-[expanded=true]:border-slate-100 dark:data-[expanded=true]:border-slate-800/80 bg-slate-50/40 hover:bg-slate-50 dark:bg-slate-900/30 dark:hover:bg-slate-800/40 px-6 py-5 sm:px-8 transition-colors"
            data-expanded={expandedVersions['v0.3.0']}
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3.5">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">FinanceExport v0.3.0</h3>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                      Docker Release
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Instalação simplificada com Docker, sem precisar configurar MySQL, Java ou Node na sua máquina.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-6 sm:pl-0">
                <time className="text-xs font-medium text-slate-400">5 de setembro de 2026</time>
                <span className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 shadow-sm">
                  {expandedVersions['v0.3.0'] ? 'Ocultar' : 'Ver detalhes'}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      expandedVersions['v0.3.0'] ? 'rotate-180' : ''
                    }`}
                  />
                </span>
              </div>
            </div>
          </button>

          {expandedVersions['v0.3.0'] && (
            <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[160px_1fr] bg-slate-50/20 dark:bg-slate-950/20 animate-in fade-in duration-200">
              <div>
                <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Sparkles className="h-3.5 w-3.5" /> Adicionado
                </span>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-xs sm:text-sm leading-relaxed text-slate-600 marker:text-emerald-500 dark:text-slate-300">
                <li>Instalação com um único comando via Docker Compose, já com banco de dados, backend e frontend prontos.</li>
                <li>Script de 1 clique para Windows (<code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs dark:bg-slate-800">iniciar-docker.bat</code>) que verifica e liga o Docker automaticamente.</li>
                <li>Seus dados agora ficam salvos com segurança em um volume persistente, mesmo reiniciando os containers.</li>
              </ul>

              <div>
                <span className="inline-flex items-center gap-2 rounded-xl bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
                  <Wrench className="h-3.5 w-3.5" /> Melhorias
                </span>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-xs sm:text-sm leading-relaxed text-slate-600 marker:text-cyan-500 dark:text-slate-300">
                <li>Fim dos erros de conexão entre as telas e o servidor ao usar o Docker.</li>
                <li>Filtros de período atualizados com os meses mais recentes disponíveis.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Release v0.2.0 */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/90">
          <button
            type="button"
            onClick={() => toggleVersion('v0.2.0')}
            className="w-full text-left border-b border-transparent data-[expanded=true]:border-slate-100 dark:data-[expanded=true]:border-slate-800/80 bg-slate-50/40 hover:bg-slate-50 dark:bg-slate-900/30 dark:hover:bg-slate-800/40 px-6 py-5 sm:px-8 transition-colors"
            data-expanded={expandedVersions['v0.2.0']}
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3.5">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-500 shrink-0" />
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">FinanceExport v0.2.0</h3>
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-xs font-semibold text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300">
                      UI & Análise Interativa
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Sidebar responsiva, filtros de categoria no Donut, detalhamento diário de movimentações e alternância de temas.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-6 sm:pl-0">
                <time className="text-xs font-medium text-slate-400">2 de setembro de 2026</time>
                <span className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 shadow-sm">
                  {expandedVersions['v0.2.0'] ? 'Ocultar' : 'Ver detalhes'}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      expandedVersions['v0.2.0'] ? 'rotate-180' : ''
                    }`}
                  />
                </span>
              </div>
            </div>
          </button>

          {expandedVersions['v0.2.0'] && (
            <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[160px_1fr] bg-slate-50/20 dark:bg-slate-950/20 animate-in fade-in duration-200">
              <div>
                <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Sparkles className="h-3.5 w-3.5" /> Adicionado
                </span>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-xs sm:text-sm leading-relaxed text-slate-600 marker:text-emerald-500 dark:text-slate-300">
                <li>Sidebar responsiva, minimizável (72px a 288px) com gaveta de navegação para dispositivos móveis.</li>
                <li>Filtro interativo por categoria integrado diretamente aos gráficos e indicadores ao clicar no Donut.</li>
                <li>Modal de detalhamento diário (<code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs dark:bg-slate-800">DayMovementsDialog</code>) acionado ao clicar nas datas do gráfico.</li>
                <li>Alternância contínua entre temas Claro e Escuro com detecção de sistema e persistência em <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs dark:bg-slate-800">localStorage</code>.</li>
                <li>Página dedicada de Changelog para transparência de notas de versão.</li>
              </ul>

              <div>
                <span className="inline-flex items-center gap-2 rounded-xl bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
                  <Wrench className="h-3.5 w-3.5" /> Melhorias
                </span>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-xs sm:text-sm leading-relaxed text-slate-600 marker:text-cyan-500 dark:text-slate-300">
                <li>Layout responsivo ajustado para aproveitar monitores ultrawide e telas de maior resolução.</li>
                <li>Comparativo principal simplificado entre Receitas e Despesas no gráfico de área diário.</li>
                <li>Gráfico de despesas por categoria reposicionado lado a lado com o fluxo financeiro.</li>
              </ul>

              <div>
                <span className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                  <ShieldCheck className="h-3.5 w-3.5" /> Regras
                </span>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-xs sm:text-sm leading-relaxed text-slate-600 marker:text-violet-500 dark:text-slate-300">
                <li>Investimentos, RDB e Caixinhas excluídos do cálculo de despesas operacionais correntes.</li>
                <li>Desacoplamento de parâmetros locais de banco em <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs dark:bg-slate-800">application.properties</code> e remoção de dados locais sensíveis.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Release v0.1.0 */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/90">
          <button
            type="button"
            onClick={() => toggleVersion('v0.1.0')}
            className="w-full text-left border-b border-transparent data-[expanded=true]:border-slate-100 dark:data-[expanded=true]:border-slate-800/80 bg-slate-50/40 hover:bg-slate-50 dark:bg-slate-900/30 dark:hover:bg-slate-800/40 px-6 py-5 sm:px-8 transition-colors"
            data-expanded={expandedVersions['v0.1.0']}
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3.5">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">FinanceExport v0.1.0</h3>
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      Lançamento Inicial
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Fundação da plataforma com importação e desduplicação de extratos Nubank, API REST Spring Boot e painel inicial.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-6 sm:pl-0">
                <time className="text-xs font-medium text-slate-400">22 de agosto de 2026</time>
                <span className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 shadow-sm">
                  {expandedVersions['v0.1.0'] ? 'Ocultar' : 'Ver detalhes'}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      expandedVersions['v0.1.0'] ? 'rotate-180' : ''
                    }`}
                  />
                </span>
              </div>
            </div>
          </button>

          {expandedVersions['v0.1.0'] && (
            <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[160px_1fr] bg-slate-50/20 dark:bg-slate-950/20 animate-in fade-in duration-200">
              <div>
                <span className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                  <Database className="h-3.5 w-3.5" /> Importação
                </span>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-xs sm:text-sm leading-relaxed text-slate-600 marker:text-blue-500 dark:text-slate-300">
                <li>Parser inteligente para Extratos de Conta Corrente Nubank (<code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs dark:bg-slate-800">Data,Valor,Identificador,Descrição</code>).</li>
                <li>Parser inteligente para Faturas de Cartão de Crédito Nubank (<code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs dark:bg-slate-800">date,title,amount</code>).</li>
                <li>Motor de desduplicação determinística para prevenir registros duplicados ao importar períodos sobrepostos.</li>
                <li>Classificação automática inicial por palavras-chave em categorias financeiras essenciais.</li>
              </ul>

              <div>
                <span className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                  <Layers className="h-3.5 w-3.5" /> Arquitetura
                </span>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-xs sm:text-sm leading-relaxed text-slate-600 marker:text-indigo-500 dark:text-slate-300">
                <li>Arquitetura full-stack desacoplada: API RESTful com Spring Boot 3, Spring Data JPA, Hibernate e MySQL 8.</li>
                <li>Single Page Application com React 18, Vite e estilização utilitária moderna com Tailwind CSS.</li>
                <li>Endpoints agregadores com métricas de desempenho e resumos financeiros.</li>
              </ul>

              <div>
                <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Clock className="h-3.5 w-3.5" /> Recursos
                </span>
              </div>
              <ul className="list-disc space-y-2 pl-5 text-xs sm:text-sm leading-relaxed text-slate-600 marker:text-slate-500 dark:text-slate-300">
                <li>Tabela de movimentações paginada com busca em tempo real e alteração rápida de categorias.</li>
                <li>Cards de resumo financeiro com total de receitas, despesas e saldo líquido consolidado.</li>
                <li>Gráficos interativos com biblioteca Recharts para fluxo diário e distribuição de gastos.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
