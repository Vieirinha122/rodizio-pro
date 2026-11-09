/** Domínio: tipos do rodízio 5x1 */

export type Rodizio = 1 | 2 | 3 | 4 | 5 | 6

/** Tipo de situação: saque do nosso time ou saque adversário */
export type TipoSaida = 'nosso-saque' | 'saque-adversario'

/** Momento didático mostrado quando o nosso time está sacando. */
export type FaseNossoSaque = 'troca-pre-saque' | 'antes-saque' | 'apos-saque'

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
  /** Coordenadas ajustadas quando a formação de recepção muda a posição visual. */
  coordenadas?: [number, number]
  /** Indica uma função mostrada fora das linhas da quadra, como o líbero aguardando a troca. */
  foraDaQuadra?: boolean
  /** Indica que o jogador está fora da quadra porque executa o saque. */
  sacando?: boolean
  /** Se está na recepção de saque (3 passadores) - só para saque adversário */
  naRecepcao: boolean
  /** Para o levantador: coordenadas da rota de infiltração */
  rotaInfiltracao?: RotaInfiltracao
  /** Reservado para uma etapa futura de movimentação após a formação inicial. */
  rotaTransicao?: RotaInfiltracao
}

export interface AreaCasinha {
  /** Coordenada horizontal da área em percentual da quadra. */
  x: number
  /** Coordenada vertical da área em percentual da quadra. */
  y: number
  /** Largura da área em percentual da quadra. */
  largura: number
  /** Altura da área em percentual da quadra. */
  altura: number
  /** Texto curto que identifica a formação visual. */
  rotulo: string
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
  faseNossoSaque?: FaseNossoSaque
  jogadores: JogadorNaQuadra[]
  formacaoRecepcao: FormacaoRecepcao
  posicaoDestacada?: FuncaoJogador
  /** Área especial exibida somente na formação de recepção com levantador em P6. */
  areaCasinha?: AreaCasinha
}
