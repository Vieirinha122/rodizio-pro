# Histórico — Rodízio Pro

Registro curto do que foi feito, corrigido ou decidido neste projeto.
Entradas novas devem entrar no topo.

| Data | Tipo | O que mudou | Arquivos envolvidos | Status |
|---|---|---|---|---|
| 2026-11-07 | implementação | Etapa 9 concluída: Bottom sheet dinâmico por rodízio/posição (instruções táticas reais R1-R6 × 7 posições: onde ficar, para onde correr, dica, erro comum de overlap) | src/domain/rodizio/instrucoes.ts, src/domain/rodizio/index.ts, src/components/ui/BottomSheet.tsx, src/App.tsx | pronto |
| 2026-11-07 | implementação | Etapas 5-8 concluídas (juntas na QuadraSVG + domínio): jogadores por rodízio com pins coloridos, filtro "Ver como" destacando posição, recepção 3 passadores com L/O fora quando aplicável, rota de infiltração tracejada teal R1-R3 | src/components/quadra/QuadraSVG.tsx, src/domain/rodizio/dados.ts, src/components/ui/FiltroPosicao.tsx | pronto |
| 2026-11-07 | implementação | Etapa 4 concluída: Quadra SVG real (proporção 18x9m, gradiente âmbar, rede coral, linhas de ataque, zona de levantamento, pins dos jogadores com códigos, rota de infiltração tracejada teal, filtro "Ver como" destacando posição, clique abre bottom sheet) | src/components/quadra/QuadraSVG.tsx, src/components/quadra/QuadraPlaceholder.tsx (removido), src/App.tsx, src/components/ui/HeaderRodizio.tsx (controlado) | pronto |
| 2026-11-07 | implementação | Etapa 3 concluída: modelo de domínio 5x1 (tipos TypeScript, posições base por rodízio, formações de recepção 3 passadores, rotas de infiltração do levantador, função geradora de estado) | src/domain/rodizio/tipos.ts, src/domain/rodizio/dados.ts, src/domain/rodizio/index.ts | pronto |
| 2026-11-07 | implementação | Etapa 2 concluída: layout mobile-first (Header com chips R1–R6, QuadraPlaceholder SVG, FiltroPosicao segmented control, BottomSheet provider) | src/components/ui/HeaderRodizio.tsx, src/components/quadra/QuadraPlaceholder.tsx, src/components/ui/FiltroPosicao.tsx, src/components/ui/BottomSheet.tsx, src/App.tsx, src/styles/globals.css | pronto |
| 2026-11-07 | config | Preparação para GitHub + Vercel: .gitignore, vercel.json, README.md | .gitignore, vercel.json, README.md | pronto |
| 2026-11-07 | implementação | Etapa 1 concluída: casca do projeto (Vite+React+TS, Tailwind v4, PWA, fontes, tokens CSS, build limpo, dev server rodando) | package.json, tsconfig*, vite.config.ts, index.html, src/main.tsx, src/App.tsx, src/styles/globals.css, src/vite-env.d.ts | pronto |
| 2026-11-07 | processo | Este histórico passa a registrar cada etapa, correção e decisão relevante | HISTORICO.md | pronto |
| 2026-11-07 | planejamento | Plano de implementação em 12 etapas pequenas, com MVP fechando na etapa 10 | PLANO-IMPLEMENTACAO.md | pronto |
| 2026-11-07 | design | Design system travado: dark-first, piso âmbar, acento lima elétrico, rotas em teal, tipografia Space Grotesk + DM Sans + JetBrains Mono | DESIGN_SYSTEM.md | pronto |
| 2026-11-07 | escopo | Produto definido como Web PWA, foco em rodízio 5x1, recepção com 3 passadores e visão prioritária do levantador | CONTEXT.md | pronto |
| 2026-11-07 | estrutura | Projeto instalado em C:\PROJETOS_PESSOAIS\rodizio-pro, sem código ainda | pasta do projeto | pronto |