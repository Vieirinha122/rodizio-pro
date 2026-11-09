/** Domínio: tipos do rodízio 5x1 */

export type Rodizio = 1 | 2 | 3 | 4 | 5 | 6

/** Tipo de situação: saque do nosso time ou saque adversário */
export type TipoSaida = 'nosso-saque' | 'saque-adversario'

export type PosicaoQuadra =
  | 'P1'  // Fundo direito (saque/recepção)
  | 'P2'  // Frente direita (saída de rede)
  | 'P3'  // Frente central (levantamento/bloqueio central)
  | 'P4'  // Frente esquerda (entrada de rede)
  | 'P5'  // Fundo esquerdo
  | 'P6'  // Fundo central

export type FuncaoJogador =
  | 'L'   // Levantador
  | 'O'   // Oposto
  | 'P1'  // Ponteiro 1
  | 'P2'  // Ponteiro 2
  | 'C1'  // Central 1
  | 'C2'  // Central 2
  | 'LIB' // Líbero

export interface JogadorNaQuadra {
  funcao: FuncaoJogador
  posicao: PosicaoQuadra
  /** Se está na recepção de saque (3 passadores) - só para saque adversário */
  naRecepcao: boolean
  /** Para o levantador: coordenadas da rota de infiltração */
  rotaInfiltracao?: RotaInfiltracao
  /** Reservado para uma etapa futura de movimentação após a formação inicial. */
  rotaTransicao?: RotaInfiltracao
}

export interface RotaInfiltracao {
  /** Pontos da curva: [x, y] em % da quadra (0-100) */
  pontos: [number, number][]
  /** Cor da rota */
  cor: string
}

export interface FormacaoRecepcao {
  /** Rodízio (R1-R6) */
  rodizio: Rodizio
  /** 3 passadores: suas funções e posições na quadra */
  passadores: Array<{
    funcao: FuncaoJogador
    posicao: PosicaoQuadra
    /** Ordem de prioridade no passe (1 = principal) */
    prioridade: 1 | 2 | 3
  }>
  /** Jogadores fora da recepção (levantador/oposto quando aplicável) */
  foraRecepcao: Array<{
    funcao: FuncaoJogador
    posicao: PosicaoQuadra
    motivo: 'infiltra' | 'nao-passador'
  }>
}

export interface EstadoRodizio {
  rodizio: Rodizio
  tipoSaida: TipoSaida
  jogadores: JogadorNaQuadra[]
  formacaoRecepcao: FormacaoRecepcao
  posicaoDestacada?: FuncaoJogador
}