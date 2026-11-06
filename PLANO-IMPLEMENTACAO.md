# Rodízio Pro — Plano de implementação

Atualizado: 2026-11-07
Diretório do código: C:\PROJETOS_PESSOAIS\rodizio-pro
Documentação do projeto: CONTEXT.md, DESIGN_SYSTEM.md, PLANO-IMPLEMENTACAO.md, HISTORICO.md

## Objetivo

Construir um PWA web para ajudar levantadores e jogadores de outras posições a entender o rodízio 5x1, com foco em:

- posição de recepção de saque;
- infiltração do levantador;
- visão por jogador;
- funcionamento offline na quadra.

## Decisões travadas

- Stack: React + Vite + TypeScript.
- Distribuição: PWA com vite-plugin-pwa.
- Estilo: Tailwind CSS v4 com tokens do DESIGN_SYSTEM.md.
- Tema: dark-first.
- Iconografia: Lucide React.
- Componentes prontos: shadcn/ui apenas quando fizer sentido, sem criar interface genérica.
- Backend: não nesta fase. Os dados táticos serão conteúdo estático versionado no frontend.
- Testes automatizados: não criar sem pedido explícito.
- Validação manual: feita por você.
- Git: nunca commitar nem enviar para remoto sem você pedir.

## Estrutura prevista

```txt
src/
  components/
    quadra/      # SVG da quadra, jogadores, rotas
    ui/          # controles genéricos do projeto
  domain/
    rodizio/     # tipos, tabelas de posição e dados táticos 5x1
  hooks/
  styles/
  App.tsx
  main.tsx
```

## Etapas

| # | Etapa | O que entra | O que NÃO entra ainda | Pronto quando |
|---|---|---|---|---|
| 1 | ✅ Casca do projeto | Criar app Vite React TS, instalar Tailwind v4, PWA plugin, Lucide, configurar fontes, tokens CSS, pastas base e tela mínima escura | Quadra, dados táticos, shadcn, testes | Rodar localmente e mostrar a identidade visual base |
| 2 | Layout base mobile-first | Header compacto, área principal da quadra, espaço para controles e painel inferior placeholder | Movimento real dos jogadores | Tela caber no celular sem overflow e sem ruído visual |
| 3 | Modelo de domínio 5x1 | Tipos de rodízio, posição, função do jogador, formação de passe e rota de infiltração | UI bonita ou animação | Dados consistentes e revisáveis separados da interface |
| 4 | Quadra SVG | Desenho proporcional da quadra, rede, linhas de fundo, linha de ataque e zonas P1-P6 | Jogadores dinâmicos | Quadra renderizar corretamente em diferentes tamanhos |
| 5 | Jogadores por rodízio | Pins com código L, O, P1, P2, C1, C2/Líbero e troca entre R1-R6 | Recepção tática completa | Selecionar rodízio mover os jogadores para as posições base |
| 6 | Filtro "Ver como" | Segmented control para escolher posição destacada, reduzir opacidade dos demais | Bottom sheet detalhado | Escolher "Levantador" destacar claramente o L |
| 7 | Recepção com 3 passadores | Coordenadas táticas de passe, escondendo/sinalizando levantador e oposto fora da recepção quando aplicável | Animação de infiltração | Cada rodízio mostrar formação de recepção correta |
| 8 | Rota de infiltração | Caminho do levantador até a zona de levantamento, seta tracejada em teal, fallback sem animação | Validação de overlap | Rota aparecer de forma legível para o levantador |
| 9 | Painel de instrução | Bottom sheet com texto curto: onde ficar, para onde correr, erro comum | Múltiplos modos avançados | Tocar no jogador abrir explicação sem poluir a quadra |
| 10 | MVP fechado | Junção dos passos 1-9, ajuste fino de espaçamento, contraste e estados | PWA completo | Você consegue usar para entender R1-R6 como levantador |
| 11 | PWA robusto | Ícones, manifest completo, cache offline, aviso de instalação, atualização de versão | Novas features táticas | Instalar no celular e abrir sem internet |
| 12 | Polimento UX e acessibilidade | Foco visível, navegação por teclado, prefers-reduced-motion, desktop com sidebar, revisão pelas heurísticas | Refatorações grandes | Etapa passar por /code-review sem pendências graves |

## MVP realista

O MVP útil termina na etapa 10. Depois disso, o app já serve como ferramenta de estudo para você e para o time.

As etapas 11 e 12 são endurecimento: instalação offline e qualidade de uso.

## Próxima ação

Implementar apenas a etapa 2: layout base mobile-first.
Header com chips R1–R6, área da quadra (placeholder), segmented control "Ver como", bottom sheet placeholder.

## Registro de alterações

Toda etapa concluída, correção ou decisão relevante deve ser adicionada em HISTORICO.md.