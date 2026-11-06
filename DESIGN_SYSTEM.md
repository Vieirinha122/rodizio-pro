# Design System — Rodízio Pro

Identidade visual travada em 2026-11-07. Nenhuma tela sai do lugar sem respeitar isto.

## Tema
Dark como primário. Motivo: uso real em ginásio com iluminação baixa e reflexo no piso. A quadra âmbar precisa "acender" como holofote no centro da tela. Light mode fica para depois, mas o design é dark-first.

## Paleta
| Token | Valor | Uso |
|---|---|---|
| --fundo | #0E1116 | Fundo base da aplicação, carvão azulado, não preto puro |
| --superficie | #181C24 | Cards, painéis, bottom sheet |
| --borda | #2A2F3A | Divisores sutis, contorno de controles |
| --texto | #EDEBE6 | Texto principal, off-white quente |
| --texto-suave | #7A7F8A | Labels, dicas, códigos de posição |
| --quadra | #C8873A | Piso da quadra, âmbar madeira |
| --quadra-clara | #D9A05B | Faixa de fundo da quadra / gradiente do piso |
| --linha-quadra | rgba(255,255,255,0.9) | Marcação da quadra |
| --acento | #CDFF00 | Jogador selecionado, CTA, rodízio ativo, lima elétrico |
| --rota | #00E5B0 | Setas e trajetórias de infiltração, teal neon |
| --adversario | #FF6B6B | Referência de bloqueador/adversário, coral |
| --erro | #FF4D4D | Falta de posição, validação |

Proibido: gradiente roxo-azul, glassmorphism, sombra colorida genérica, ícone em bolinha acima de heading.

## Tipografia
| Uso | Fonte | Pesos |
|---|---|---|
| Títulos, rodízios, números | Space Grotesk | 500, 700 |
| Corpo, labels, descrições | DM Sans | 400, 500 |
| Códigos de posição, tipo P1 e R3 | JetBrains Mono | 500 |

Escala: 12px labels, 14px corpo, 20px subtítulo, 28px heading. Densidade alta: é ferramenta, não blog.

## Formato
- Botões e controles: raio 8px.
- Cards e painéis: raio 12px.
- Quadra: cantos retos, linhas duras. Tensão intencional com o UI arredondado.
- Divisores: 1px solid var(--borda), nunca `<hr>` grosso.

## Iconografia
Lucide React, traço 1.75px. Só ícone funcional. Se não ajuda a entender, não entra.

## Hierarquia e densidade
- Quadra ocupa 60–70% do viewport no mobile.
- Topo: chips horizontais R1–R6. Ativo brilha em --acento.
- Centro: SVG da quadra. Jogadores em círculo com código. Rota em seta tracejada --rota.
- Bottom sheet: abre ao tocar no jogador, com instrução textual do movimento.
- Filtro "Ver como": segmented control discreto abaixo dos rodízios. Selecionado em --acento, demais a 40% de opacidade.
- Mobile-first. Desktop = quadra central + sidebar esquerda de controles.

## shadcn/ui
Cirúrgico: só Button, Sheet, ToggleGroup, Tooltip. A quadra não vive dentro de card. Nada de card genérico do shadcn sobre a quadra.

## Tokens no código
As cores acima viram CSS variables em `src/styles/globals.css` via `@theme` do Tailwind v4. Nenhum componente hardcoded cor solta.