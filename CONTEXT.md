# Rodízio Pro - Contexto do Produto

## 1. Problema
No vôlei amador/semiprofissional, o sistema tático 5x1 exige que todos os jogadores conheçam sua posição inicial em cada rotação, tanto no saque próprio quanto na recepção. Jogadores iniciantes/intermediários frequentemente se perdem sobre onde se posicionar sem cometer falta de posição (overlap).

## 2. Solução
Aplicação Web PWA interativa e offline-first chamada Rodízio Pro. Ela visualiza graficamente a quadra de vôlei nas 6 posições de referência do levantador (P1 a P6), permite filtrar por função e mostra a formação inicial exata do time no saque próprio e no saque adversário.

## 3. Escopo e funcionalidades principais
- Quadra 2D interativa: desenho em escala proporcional de uma quadra de vôlei com posições P1 a P6.
- Seleção de referência: chaveador simples entre P1, P2, P3, P4, P5 e P6 do levantador.
- Modo passe: recepção de saque com 3 passadores.
  - Levantador e oposto ficam fora da recepção quando aplicável.
  - Formação padrão com ponteiro 1, ponteiro 2 e líbero/central na recepção.
- Filtro "Ver como": permite escolher a posição destacada.
  - Levantador (L)
  - Oposto (O)
- Ponteiros (PT1, PT2)
  - Centrais/Líbero (C1, C2, Lib)
- Movimentação pós-saque: quando necessária, uma trajetória discreta pode ser exibida apenas no cenário de saque próprio.
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
