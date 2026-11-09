/** Domínio: dados táticos estáticos do rodízio 5x1
 * 
 * Convenção: vista do NOSSO TIME (lado esquerdo da quadra no SVG)
 * P1 = fundo direito | P2 = frente direita | P3 = frente centro
 * P4 = frente esquerda | P5 = fundo esquerdo | P6 = fundo centro
 * 
 * No 5x1: 1 levantador + 5 atacantes. O levantador infiltra de onde estiver para P3.
 * Recepção com 3 passadores: 2 ponteiros + líbero (substitui um central no fundo).
 * 
 * DUAS SITUAÇÕES:
 * 1. SAQUE ADVERSÁRIO (recepção): 3 passadores, L infiltra do fundo, O fora quando no fundo
 * 2. NOSSO SAQUE: formação inicial nas posições base P1-P6
 */

import type { Rodizio, PosicaoQuadra, FuncaoJogador, FormacaoRecepcao, JogadorNaQuadra, RotaInfiltracao, TipoSaida } from './tipos'

/** Posições base de cada função em cada rodízio (R1-R6)
 *  A linha indica onde o jogador COMEÇA a rotação (antes do saque)
 */
export const POSICOES_BASE_POR_RODIZIO: Record<Rodizio, Record<FuncaoJogador, PosicaoQuadra>> = {
  1: { L: 'P1', O: 'P4', P1: 'P2', P2: 'P6', C1: 'P3', C2: 'P5', LIB: 'P5' },
  2: { L: 'P6', O: 'P3', P1: 'P1', P2: 'P5', C1: 'P2', C2: 'P4', LIB: 'P4' },
  3: { L: 'P5', O: 'P2', P1: 'P6', P2: 'P4', C1: 'P1', C2: 'P3', LIB: 'P3' },
  4: { L: 'P4', O: 'P1', P1: 'P5', P2: 'P3', C1: 'P6', C2: 'P2', LIB: 'P2' },
  5: { L: 'P3', O: 'P6', P1: 'P4', P2: 'P2', C1: 'P5', C2: 'P1', LIB: 'P1' },
  6: { L: 'P2', O: 'P5', P1: 'P3', P2: 'P1', C1: 'P4', C2: 'P6', LIB: 'P6' },
}

/** Permite escolher o rodízio a partir da posição ocupada pelo levantador. */
export const RODIZIO_POR_POSICAO_LEVANTADOR: Record<PosicaoQuadra, Rodizio> = {
  P1: 1,
  P2: 6,
  P3: 5,
  P4: 4,
  P5: 3,
  P6: 2,
}

/** Retorna a leitura tática principal da rotação selecionada. */
export function obterLeituraRodizio(rodizio: Rodizio): { posicaoLevantador: PosicaoQuadra; posicaoOposto: PosicaoQuadra } {
  const jogadores = POSICOES_BASE_POR_RODIZIO[rodizio]
  return {
    posicaoLevantador: jogadores.L,
    posicaoOposto: jogadores.O,
  }
}

/** Formação de RECEPÇÃO (saque adversário) com 3 passadores por rodízio
 *  No 5x1: levantador e oposto NÃO passam (exceto quando L está na frente, aí oposto passa no lugar)
 *  Passadores: 2 ponteiros + líbero (que substitui um central no fundo)
 */
export const FORMACOES_RECEPCAO: FormacaoRecepcao[] = [
  // R1: L em P1 (fundo) → L infiltra, O em P4 (frente) não passa
  {
    rodizio: 1,
    passadores: [
      { funcao: 'P1', posicao: 'P2', prioridade: 1 }, // Ponteiro 1 na frente direita
      { funcao: 'LIB', posicao: 'P5', prioridade: 2 }, // Líbero substitui C2 no fundo esquerdo
      { funcao: 'P2', posicao: 'P6', prioridade: 3 }, // Ponteiro 2 no fundo centro
    ],
    foraRecepcao: [
      { funcao: 'L', posicao: 'P1', motivo: 'infiltra' },
      { funcao: 'O', posicao: 'P4', motivo: 'nao-passador' },
      { funcao: 'C1', posicao: 'P3', motivo: 'nao-passador' },
    ],
  },
  // R2: L em P6 (fundo) → L infiltra, O em P3 (frente) não passa
  {
    rodizio: 2,
    passadores: [
      { funcao: 'P1', posicao: 'P1', prioridade: 1 }, // Ponteiro 1 no fundo direito
      { funcao: 'LIB', posicao: 'P4', prioridade: 2 }, // Líbero substitui C2 na frente esquerda
      { funcao: 'P2', posicao: 'P5', prioridade: 3 }, // Ponteiro 2 no fundo esquerdo
    ],
    foraRecepcao: [
      { funcao: 'L', posicao: 'P6', motivo: 'infiltra' },
      { funcao: 'O', posicao: 'P3', motivo: 'nao-passador' },
      { funcao: 'C1', posicao: 'P2', motivo: 'nao-passador' },
    ],
  },
  // R3: L em P5 (fundo) → L infiltra, O em P2 (frente) não passa
  {
    rodizio: 3,
    passadores: [
      { funcao: 'P1', posicao: 'P6', prioridade: 1 }, // Ponteiro 1 no fundo centro
      { funcao: 'LIB', posicao: 'P3', prioridade: 2 }, // Líbero substitui C2 na frente centro
      { funcao: 'P2', posicao: 'P4', prioridade: 3 }, // Ponteiro 2 na frente esquerda
    ],
    foraRecepcao: [
      { funcao: 'L', posicao: 'P5', motivo: 'infiltra' },
      { funcao: 'O', posicao: 'P2', motivo: 'nao-passador' },
      { funcao: 'C1', posicao: 'P1', motivo: 'nao-passador' },
    ],
  },
  // R4: L em P4 (frente) → L NÃO infiltra (já está na frente), O em P1 (fundo) passa no lugar do L
  {
    rodizio: 4,
    passadores: [
      { funcao: 'P1', posicao: 'P5', prioridade: 1 }, // Ponteiro 1 no fundo esquerdo
      { funcao: 'LIB', posicao: 'P2', prioridade: 2 }, // Líbero substitui C2 na frente direita
      { funcao: 'O', posicao: 'P1', prioridade: 3 }, // Oposto passa no lugar do L (fundo direito)
    ],
    foraRecepcao: [
      { funcao: 'L', posicao: 'P4', motivo: 'nao-passador' }, // L já está na zona de levantamento
      { funcao: 'C1', posicao: 'P6', motivo: 'nao-passador' },
      { funcao: 'C2', posicao: 'P2', motivo: 'nao-passador' }, // C2 sai, entra LIB
    ],
  },
  // R5: L em P3 (frente centro - zona de levantamento) → L NÃO infiltra, O em P6 (fundo) passa
  {
    rodizio: 5,
    passadores: [
      { funcao: 'P1', posicao: 'P4', prioridade: 1 }, // Ponteiro 1 na frente esquerda
      { funcao: 'LIB', posicao: 'P1', prioridade: 2 }, // Líbero substitui C2 no fundo direito
      { funcao: 'O', posicao: 'P6', prioridade: 3 }, // Oposto passa no fundo centro
    ],
    foraRecepcao: [
      { funcao: 'L', posicao: 'P3', motivo: 'nao-passador' }, // L já na zona de levantamento
      { funcao: 'C1', posicao: 'P5', motivo: 'nao-passador' },
      { funcao: 'C2', posicao: 'P1', motivo: 'nao-passador' }, // C2 sai, entra LIB
    ],
  },
  // R6: L em P2 (frente direita) → L NÃO infiltra, O em P5 (fundo) passa
  {
    rodizio: 6,
    passadores: [
      { funcao: 'P1', posicao: 'P3', prioridade: 1 }, // Ponteiro 1 na frente centro
      { funcao: 'LIB', posicao: 'P6', prioridade: 2 }, // Líbero substitui C2 no fundo centro
      { funcao: 'O', posicao: 'P5', prioridade: 3 }, // Oposto passa no fundo esquerdo
    ],
    foraRecepcao: [
      { funcao: 'L', posicao: 'P2', motivo: 'nao-passador' }, // L já na frente
      { funcao: 'C1', posicao: 'P4', motivo: 'nao-passador' },
      { funcao: 'C2', posicao: 'P6', motivo: 'nao-passador' }, // C2 sai, entra LIB
    ],
  },
]

/** Formação inicial do nosso saque nas posições base P1-P6.
 *  As rotas continuam disponíveis como referência visual auxiliar da movimentação.
 */
export const FORMACOES_NOSSO_SAQUE: Record<Rodizio, {
  transicoes: Array<{
    funcao: FuncaoJogador
    posicaoInicial: PosicaoQuadra
    posicaoFinal: PosicaoQuadra
    descricao: string
  }>
  passadores: FuncaoJogador[] // quem faz a recepção se o saque voltar (raro, mas acontece)
}> = {
  1: {
    transicoes: [
      { funcao: 'L', posicaoInicial: 'P1', posicaoFinal: 'P3', descricao: 'Infiltra do fundo direito para zona de levantamento' },
      { funcao: 'O', posicaoInicial: 'P4', posicaoFinal: 'P2', descricao: 'Move da frente esquerda para saída de rede (ataque)' },
      { funcao: 'P1', posicaoInicial: 'P2', posicaoFinal: 'P2', descricao: 'Fica na frente direita para bloqueio/ataque saída' },
      { funcao: 'P2', posicaoInicial: 'P6', posicaoFinal: 'P6', descricao: 'Recua para fundo centro - defesa/pipe' },
      { funcao: 'C1', posicaoInicial: 'P3', posicaoFinal: 'P3', descricao: 'Fica no centro da rede - bloqueio/1º tempo' },
      { funcao: 'C2', posicaoInicial: 'P5', posicaoFinal: 'P4', descricao: 'Move para entrada de rede - bloqueio/ataque' },
      { funcao: 'LIB', posicaoInicial: 'P5', posicaoFinal: 'P5', descricao: 'Entra no fundo esquerdo (substitui C2) - defesa' },
    ],
    passadores: ['LIB', 'P2', 'P1'],
  },
  2: {
    transicoes: [
      { funcao: 'L', posicaoInicial: 'P6', posicaoFinal: 'P3', descricao: 'Infiltra do fundo centro para zona de levantamento' },
      { funcao: 'O', posicaoInicial: 'P3', posicaoFinal: 'P2', descricao: 'Move do centro da rede para saída de rede' },
      { funcao: 'P1', posicaoInicial: 'P1', posicaoFinal: 'P1', descricao: 'Fica no fundo direita - defesa/recepção' },
      { funcao: 'P2', posicaoInicial: 'P5', posicaoFinal: 'P5', descricao: 'Fica no fundo esquerda - defesa/pipe' },
      { funcao: 'C1', posicaoInicial: 'P2', posicaoFinal: 'P2', descricao: 'Fica na saída de rede - bloqueio/ataque' },
      { funcao: 'C2', posicaoInicial: 'P4', posicaoFinal: 'P3', descricao: 'Move para centro da rede - bloqueio/1º tempo' },
      { funcao: 'LIB', posicaoInicial: 'P4', posicaoFinal: 'P4', descricao: 'Entra na frente esquerda (substitui C2) - defesa' },
    ],
    passadores: ['P1', 'LIB', 'P2'],
  },
  3: {
    transicoes: [
      { funcao: 'L', posicaoInicial: 'P5', posicaoFinal: 'P3', descricao: 'Infiltra do fundo esquerda para zona de levantamento' },
      { funcao: 'O', posicaoInicial: 'P2', posicaoFinal: 'P2', descricao: 'Já na saída de rede - ataque/bloqueio' },
      { funcao: 'P1', posicaoInicial: 'P6', posicaoFinal: 'P6', descricao: 'Fica no fundo centro - defesa/pipe' },
      { funcao: 'P2', posicaoInicial: 'P4', posicaoFinal: 'P4', descricao: 'Fica na entrada de rede - bloqueio/ataque' },
      { funcao: 'C1', posicaoInicial: 'P1', posicaoFinal: 'P1', descricao: 'Fica no fundo direita - defesa' },
      { funcao: 'C2', posicaoInicial: 'P3', posicaoFinal: 'P2', descricao: 'Move para saída de rede - bloqueio/ataque' },
      { funcao: 'LIB', posicaoInicial: 'P3', posicaoFinal: 'P6', descricao: 'Entra no fundo centro (substitui C1) - defesa' },
    ],
    passadores: ['LIB', 'P1', 'P2'],
  },
  4: {
    transicoes: [
      { funcao: 'L', posicaoInicial: 'P4', posicaoFinal: 'P3', descricao: 'Move da frente esquerda para zona de levantamento (curto)' },
      { funcao: 'O', posicaoInicial: 'P1', posicaoFinal: 'P2', descricao: 'Move do fundo direita para saída de rede - ataque' },
      { funcao: 'P1', posicaoInicial: 'P5', posicaoFinal: 'P5', descricao: 'Fica no fundo esquerda - defesa/pipe' },
      { funcao: 'P2', posicaoInicial: 'P3', posicaoFinal: 'P3', descricao: 'Fica no centro da rede - bloqueio/1º tempo' },
      { funcao: 'C1', posicaoInicial: 'P6', posicaoFinal: 'P6', descricao: 'Fica no fundo centro - defesa' },
      { funcao: 'C2', posicaoInicial: 'P2', posicaoFinal: 'P4', descricao: 'Move para entrada de rede - bloqueio/ataque' },
      { funcao: 'LIB', posicaoInicial: 'P2', posicaoFinal: 'P1', descricao: 'Entra no fundo direita (substitui C1) - defesa' },
    ],
    passadores: ['O', 'LIB', 'P1'],
  },
  5: {
    transicoes: [
      { funcao: 'L', posicaoInicial: 'P3', posicaoFinal: 'P3', descricao: 'Já na zona de levantamento - comanda o jogo' },
      { funcao: 'O', posicaoInicial: 'P6', posicaoFinal: 'P2', descricao: 'Move do fundo centro para saída de rede - ataque' },
      { funcao: 'P1', posicaoInicial: 'P4', posicaoFinal: 'P4', descricao: 'Fica na entrada de rede - bloqueio/ataque' },
      { funcao: 'P2', posicaoInicial: 'P2', posicaoFinal: 'P2', descricao: 'Fica na saída de rede - ataque/bloqueio' },
      { funcao: 'C1', posicaoInicial: 'P5', posicaoFinal: 'P5', descricao: 'Fica no fundo esquerda - defesa' },
      { funcao: 'C2', posicaoInicial: 'P1', posicaoFinal: 'P1', descricao: 'Fica no fundo direita - defesa' },
      { funcao: 'LIB', posicaoInicial: 'P1', posicaoFinal: 'P6', descricao: 'Entra no fundo centro (substitui C1/C2) - defesa' },
    ],
    passadores: ['O', 'LIB', 'P1'],
  },
  6: {
    transicoes: [
      { funcao: 'L', posicaoInicial: 'P2', posicaoFinal: 'P3', descricao: 'Move da saída de rede para zona de levantamento (curto)' },
      { funcao: 'O', posicaoInicial: 'P5', posicaoFinal: 'P2', descricao: 'Move do fundo esquerda para saída de rede - ataque' },
      { funcao: 'P1', posicaoInicial: 'P3', posicaoFinal: 'P3', descricao: 'Fica no centro da rede - bloqueio/1º tempo' },
      { funcao: 'P2', posicaoInicial: 'P1', posicaoFinal: 'P1', descricao: 'Fica no fundo direita - defesa' },
      { funcao: 'C1', posicaoInicial: 'P4', posicaoFinal: 'P4', descricao: 'Fica na entrada de rede - bloqueio/ataque' },
      { funcao: 'C2', posicaoInicial: 'P6', posicaoFinal: 'P6', descricao: 'Fica no fundo centro - defesa' },
      { funcao: 'LIB', posicaoInicial: 'P6', posicaoFinal: 'P5', descricao: 'Entra no fundo esquerda (substitui C2) - defesa' },
    ],
    passadores: ['P1', 'P2', 'LIB'],
  },
}

/** Rotas de infiltração do levantador (saque adversário - quando está no fundo: R1, R2, R3)
 *  Coordenadas em % da quadra SVG (viewBox 0-360 x 0-180)
 *  Origem: posição base do L | Destino: zona de levantamento (entre P2 e P3 ≈ x:180-200, y:40-60)
 */
export const ROTAS_INFILTRACAO: Record<Rodizio, RotaInfiltracao | null> = {
  1: {
    pontos: [
      [8.3, 86.1],   // P1 (início)
      [15, 75],
      [28, 55],
      [42, 45],
      [52.8, 27.8],  // zona levantamento (entre P2-P3)
    ],
    cor: 'var(--color-rota)',
  },
  2: {
    pontos: [
      [25, 86.1],    // P6
      [32, 68],
      [42, 52],
      [52.8, 27.8],
    ],
    cor: 'var(--color-rota)',
  },
  3: {
    pontos: [
      [41.7, 86.1],  // P5
      [45, 65],
      [49, 48],
      [52.8, 27.8],
    ],
    cor: 'var(--color-rota)',
  },
  4: null, // L em P4 (frente) - não infiltra
  5: null, // L em P3 (frente centro) - já está na zona
  6: null, // L em P2 (frente direita) - não infiltra
}

/** Rotas de TRANSIÇÃO pós-saque (nosso saque) - para todas as funções que se movem
 *  Cor diferente da infiltração: lima (#CDFF00) para diferenciar
 */
export const ROTAS_TRANSICAO: Record<Rodizio, Record<FuncaoJogador, RotaInfiltracao | null>> = {
  1: {
    L: { pontos: [[8.3, 86.1], [15, 75], [28, 55], [42, 45], [52.8, 27.8]], cor: 'var(--color-acento)' },
    O: { pontos: [[41.7, 30.6], [35, 25], [25, 20], [15, 18], [8.3, 30.6]], cor: 'var(--color-acento)' },
    P1: null, // fica no P2
    P2: null, // fica no P6
    C1: null, // fica no P3
    C2: { pontos: [[41.7, 86.1], [38, 70], [32, 50], [28, 35], [25, 30.6]], cor: 'var(--color-acento)' },
    LIB: null, // fica no P5
  },
  2: {
    L: { pontos: [[25, 86.1], [32, 68], [42, 52], [52.8, 27.8]], cor: 'var(--color-acento)' },
    O: { pontos: [[25, 16.7], [20, 20], [15, 25], [10, 30], [8.3, 30.6]], cor: 'var(--color-acento)' },
    P1: null, // fica no P1
    P2: null, // fica no P5
    C1: null, // fica no P2
    C2: { pontos: [[41.7, 30.6], [35, 25], [28, 22], [25, 16.7]], cor: 'var(--color-acento)' },
    LIB: null, // fica no P4
  },
  3: {
    L: { pontos: [[41.7, 86.1], [45, 65], [49, 48], [52.8, 27.8]], cor: 'var(--color-acento)' },
    O: null, // fica no P2
    P1: null, // fica no P6
    P2: null, // fica no P4
    C1: null, // fica no P1
    C2: { pontos: [[25, 16.7], [20, 22], [15, 28], [10, 32], [8.3, 30.6]], cor: 'var(--color-acento)' },
    LIB: { pontos: [[25, 16.7], [25, 40], [25, 65], [25, 86.1]], cor: 'var(--color-acento)' },
  },
  4: {
    L: { pontos: [[41.7, 30.6], [38, 28], [32, 25], [28, 22], [25, 16.7]], cor: 'var(--color-acento)' },
    O: { pontos: [[8.3, 86.1], [15, 75], [22, 60], [28, 45], [35, 35], [8.3, 30.6]], cor: 'var(--color-acento)' },
    P1: null, // fica no P5
    P2: null, // fica no P3
    C1: null, // fica no P6
    C2: { pontos: [[8.3, 30.6], [12, 35], [18, 45], [25, 55], [35, 60], [41.7, 30.6]], cor: 'var(--color-acento)' },
    LIB: { pontos: [[8.3, 30.6], [10, 50], [10, 70], [8.3, 86.1]], cor: 'var(--color-acento)' },
  },
  5: {
    L: null, // fica no P3
    O: { pontos: [[25, 86.1], [28, 65], [35, 50], [42, 40], [8.3, 30.6]], cor: 'var(--color-acento)' },
    P1: null, // fica no P4
    P2: null, // fica no P2
    C1: null, // fica no P5
    C2: null, // fica no P1
    LIB: { pontos: [[8.3, 86.1], [15, 75], [25, 65], [25, 86.1]], cor: 'var(--color-acento)' },
  },
  6: {
    L: { pontos: [[8.3, 30.6], [12, 28], [18, 25], [25, 16.7]], cor: 'var(--color-acento)' },
    O: { pontos: [[41.7, 86.1], [38, 70], [32, 55], [28, 42], [22, 32], [8.3, 30.6]], cor: 'var(--color-acento)' },
    P1: null, // fica no P3
    P2: null, // fica no P1
    C1: null, // fica no P4
    C2: null, // fica no P6
    LIB: { pontos: [[25, 86.1], [30, 75], [38, 65], [41.7, 86.1]], cor: 'var(--color-acento)' },
  },
}

/** Gera o estado completo do rodízio para um R1-R6 e tipo de saque */
export function gerarEstadoRodizio(rodizio: Rodizio, tipoSaida: TipoSaida, posicaoDestacada?: FuncaoJogador) {
  const posicoesBase = POSICOES_BASE_POR_RODIZIO[rodizio]
  
  if (tipoSaida === 'saque-adversario') {
    // RECEPÇÃO (saque adversário) - usa lógica existente
    const formacao = FORMACOES_RECEPCAO.find(f => f.rodizio === rodizio)!
    const rota = ROTAS_INFILTRACAO[rodizio]

    // Monta os seis jogadores da rotação antes de inserir o líbero no lugar do central.
    const jogadores: JogadorNaQuadra[] = Object.entries(posicoesBase)
      .filter(([funcao]) => funcao !== 'C2' && funcao !== 'LIB')
      .map(([funcao, posicao]) => {
        const funcaoJogador = funcao as FuncaoJogador
        const naRecepcao = formacao.passadores.some((passador) => passador.funcao === funcaoJogador)

        return {
          funcao: funcaoJogador,
          posicao,
          naRecepcao,
          rotaInfiltracao: funcaoJogador === 'L' && rota ? rota : undefined,
        }
      })

    // O líbero ocupa a posição do central substituído sem criar um sétimo pin.
    const posicaoDoCentralSubstituido = posicoesBase.C2
    jogadores.push({
      funcao: 'LIB',
      posicao: posicaoDoCentralSubstituido,
      naRecepcao: true,
    })

    return {
      rodizio,
      tipoSaida,
      jogadores,
      formacaoRecepcao: formacao,
      posicaoDestacada,
    }
  } else {
    // Mantém os seis jogadores da formação-base sem introduzir uma troca tática não confirmada.
    const jogadores: JogadorNaQuadra[] = Object.entries(posicoesBase)
      .filter(([funcao]) => funcao !== 'LIB')
      .map(([funcao, posicao]) => ({
        funcao: funcao as FuncaoJogador,
        posicao,
        naRecepcao: false,
      }))

    // Formação de recepção vazia para nosso saque (não usada, mas mantém tipo)
    const formacaoVazia: FormacaoRecepcao = {
      rodizio,
      passadores: [],
      foraRecepcao: [],
    }

    return {
      rodizio,
      tipoSaida,
      jogadores,
      formacaoRecepcao: formacaoVazia,
      posicaoDestacada,
    }
  }
}

/** Converte posição P1-P6 para coordenadas percentuais da quadra vertical. */
export function posicaoParaCoordenadas(pos: PosicaoQuadra): [number, number] {
  const mapa: Record<PosicaoQuadra, [number, number]> = {
    P4: [22, 57], // frente esquerda
    P3: [50, 53], // frente central
    P2: [78, 57], // frente direita
    P5: [22, 84], // fundo esquerdo
    P6: [50, 88], // fundo central
    P1: [78, 84], // fundo direito
  }
  return mapa[pos]
}