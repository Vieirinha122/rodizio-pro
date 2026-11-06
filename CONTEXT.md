# Rodízio Pro - Contexto do Produto

## 1. Problema
No vôlei amador/semiprofissional, o sistema tático 5x1 exige que o levantador infiltre a partir de posições diferentes a cada rotação (R1 a R6) e que os outros jogadores se posicionem na recepção sem cometer falta de posição (overlap). Jogadores, especialmente levantadores iniciantes/intermediários, frequentemente se perdem sobre onde se posicionar na recepção de saque e qual caminho percorrer para infiltrar.

## 2. Solução
Aplicação Web PWA interativa e offline-first chamada Rodízio Pro. Ela visualiza graficamente a quadra de vôlei nos 6 rodízios (R1 a R6), permite filtrar por posição do jogador, com foco principal no levantador, e mostra a posição exata no passe e a rota de infiltração/troca após o saque.

## 3. Escopo e funcionalidades principais
- Quadra 2D interativa: desenho em escala proporcional de uma quadra de vôlei com posições P1 a P6.
- Seleção de rodízio: chaveador simples entre R1, R2, R3, R4, R5 e R6.
- Modo passe: recepção de saque com 3 passadores.
  - Levantador e oposto ficam fora da recepção quando aplicável.
  - Formação padrão com ponteiro 1, ponteiro 2 e líbero/central na recepção.
- Filtro "Ver como": permite escolher a posição destacada.
  - Levantador (L)
  - Oposto (O)
  - Ponteiros (P1, P2)
  - Centrais/Líbero (C1, C2, Lib)
- Rota de infiltração: setas indicativas mostrando a trajetória do levantador até a zona de levantamento, entre P2 e P3.
- Painel de instrução: texto curto explicando onde ficar, para onde correr e erros comuns.
- PWA: instalação no celular e funcionamento offline dentro de quadra.

## 4. Stack técnica
- Frontend: React + Vite + TypeScript.
- Estilo: Tailwind CSS v4 com tokens do DESIGN_SYSTEM.md.
- Ícones: Lucide React.
- PWA: vite-plugin-pwa.
- Componentes prontos: shadcn/ui apenas quando fizer sentido, sem criar interface genérica.
- Backend: não nesta fase. Os dados táticos serão conteúdo estático versionado no frontend.
- Gerenciamento de estado: React State / Context.
- Arquitetura: SPA/PWA com código modular por componentes, hooks e domínio.
- Local do código: C:\PROJETOS_PESSOAIS\rodizio-pro