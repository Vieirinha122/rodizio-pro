import { useMemo } from 'react'
import type { KeyboardEvent } from 'react'
import type { EstadoRodizio, PosicaoQuadra, FuncaoJogador } from '../../domain/rodizio'
import { posicaoParaCoordenadas } from '../../domain/rodizio'

interface QuadraSVGProps {
  estado: EstadoRodizio
  onJogadorClick?: (funcao: FuncaoJogador) => void
}

/** Converte uma posição percentual para o viewBox vertical de 240x360. */
function pctParaSVG([x, y]: [number, number]): [number, number] {
  return [x * 2.4, y * 3.6]
}

/** Converte uma rota horizontal antiga diretamente para o viewBox vertical. */
function rotaParaQuadraVertical([x, y]: [number, number]): [number, number] {
  const lateralPercentual = x >= 48 ? 50 : 91.8 - x * 1.675
  const profundidadePercentual = 42 + y * 0.487

  return [lateralPercentual * 2.4, profundidadePercentual * 3.6]
}

/** Gera um caminho SVG simples entre os pontos da rota. */
function gerarCurva(pontos: [number, number][]): string {
  if (pontos.length < 2) return ''
  const [x0, y0] = pontos[0]
  let path = `M ${x0} ${y0}`
  for (let i = 1; i < pontos.length; i++) {
    const [x, y] = pontos[i]
    path += ` L ${x} ${y}`
  }
  return path
}

/** Define as setas usadas pela infiltração e pela transição. */
const ArrowMarkers = () => (
  <defs>
    {/* Seta teal para a infiltração contra o saque adversário. */}
    <marker
      id="arrowhead-infiltracao"
      markerWidth="10"
      markerHeight="7"
      refX="9"
      refY="3.5"
      orient="auto"
      markerUnits="strokeWidth"
    >
      <path d="M0,0 L10,3.5 L0,7 Z" fill="var(--color-rota)" />
    </marker>
    {/* Seta lima para a movimentação da formação inicial. */}
    <marker
      id="arrowhead-transicao"
      markerWidth="10"
      markerHeight="7"
      refX="9"
      refY="3.5"
      orient="auto"
      markerUnits="strokeWidth"
    >
      <path d="M0,0 L10,3.5 L0,7 Z" fill="var(--color-acento)" />
    </marker>
  </defs>
)

/** Desenha uma rota tracejada com seus pontos de direção. */
function RotaGenerica({
  pontos,
  cor,
  markerId,
}: {
  pontos: [number, number][]
  cor: string
  markerId: string
}) {
  const pontosSVG = useMemo(() => pontos.map(rotaParaQuadraVertical), [pontos])
  const path = useMemo(() => gerarCurva(pontosSVG), [pontosSVG])

  return (
    <g filter={`drop-shadow(0 0 6px color-mix(in srgb, ${cor} 50%, transparent))`}>
      <path
        d={path}
        fill="none"
        stroke={cor}
        strokeWidth="2.5"
        strokeDasharray="8,5"
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={`url(#${markerId})`}
        opacity="0.9"
      />
      {/* Mostra os pontos intermediários para explicar o caminho. */}
      {pontosSVG.slice(1, -1).map(([x, y], indice) => (
        <circle key={indice} cx={x} cy={y} r="3" fill={cor} opacity="0.6" />
      ))}
    </g>
  )
}

/** Desenha um jogador e permite abrir sua instrução pelo mouse ou teclado. */
function JogadorPin({
  funcao,
  posicao,
  destaque,
  naRecepcao,
  onClick,
}: {
  funcao: FuncaoJogador
  posicao: PosicaoQuadra
  destaque: boolean
  naRecepcao: boolean
  onClick?: () => void
}) {
  // Permite abrir a instrução do jogador também com Enter ou Espaço.
  const handleKeyDown = (evento: KeyboardEvent<SVGGElement>) => {
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault()
      onClick?.()
    }
  }

  const [x, y] = useMemo(() => pctParaSVG(posicaoParaCoordenadas(posicao)), [posicao])
  const coresFuncao: Record<FuncaoJogador, { bg: string; texto: string }> = {
    L: { bg: 'var(--color-acento)', texto: 'var(--color-fundo)' },
    O: { bg: 'var(--color-adversario)', texto: 'var(--color-fundo)' },
    P1: { bg: 'var(--color-rota)', texto: 'var(--color-fundo)' },
    P2: { bg: 'var(--color-rota)', texto: 'var(--color-fundo)' },
    C1: { bg: 'var(--color-texto-suave)', texto: 'var(--color-texto)' },
    C2: { bg: 'var(--color-texto-suave)', texto: 'var(--color-texto)' },
    LIB: { bg: 'var(--color-quadra)', texto: 'var(--color-fundo)' },
  }
  const cor = coresFuncao[funcao]
  const opacidade = destaque ? 1 : 0.72
  const escala = destaque ? 1.1 : 1

  return (
    <g
      transform={`translate(${x}, ${y}) scale(${escala})`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `${funcao} na posição ${posicao}` : undefined}
      className={onClick ? 'cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento' : undefined}
      style={{ opacity: opacidade, transition: 'opacity 0.15s, transform 0.15s, filter 0.15s' }}
      filter={destaque ? 'drop-shadow(0 0 8px var(--color-acento))' : 'none'}
    >
      {/* Círculo principal do jogador. */}
      <circle
        r="14"
        fill={cor.bg}
        stroke="var(--color-linha-quadra)"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />
      {/* Anel teal que identifica quem participa da recepção. */}
      {naRecepcao && (
        <circle
          r="16"
          fill="none"
          stroke="var(--color-rota)"
          strokeWidth="1.5"
          strokeDasharray="4,3"
          opacity="0.7"
        />
      )}
      {/* Código curto da função dentro do pin. */}
      <text
        x="0"
        y="4"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-family-mono)"
        fontSize="10"
        fontWeight="500"
        fill={cor.texto}
        pointerEvents="none"
      >
        {funcao}
      </text>
    </g>
  )
}

/** Quadra vertical com a rede horizontal e o nosso time abaixo dela. */
export function QuadraSVG({ estado, onJogadorClick }: QuadraSVGProps) {
  const { rodizio, tipoSaida, jogadores, posicaoDestacada } = estado
  const levantador = jogadores.find((jogador) => jogador.funcao === 'L')
  const demaisJogadores = jogadores.filter((jogador) => jogador.funcao !== 'L')
  const isNossoSaque = tipoSaida === 'nosso-saque'
  const corRota = isNossoSaque ? 'var(--color-acento)' : 'var(--color-rota)'
  const markerId = isNossoSaque ? 'arrowhead-transicao' : 'arrowhead-infiltracao'

  return (
    <div
      className="mx-auto w-full max-w-[680px] aspect-[2/3] max-h-[72vh] relative bg-quadra rounded-none overflow-hidden"
      role="group"
      aria-label={`Quadra de vôlei - Rodízio R${rodizio} - ${isNossoSaque ? 'Formação inicial' : 'Recepção'}`}
    >
      <svg viewBox="0 0 240 360" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
        <defs>
          <linearGradient id="pisoGradiente" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-quadra-clara)" />
            <stop offset="100%" stopColor="var(--color-quadra)" />
          </linearGradient>
          <linearGradient id="redeGradiente" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-adversario)" />
            <stop offset="100%" stopColor="var(--color-adversario-claro)" />
          </linearGradient>
          <ArrowMarkers />
        </defs>

        {/* Piso completo para mostrar nosso lado e uma faixa do adversário. */}
        <rect width="240" height="360" fill="url(#pisoGradiente)" />
        <rect x="12" y="12" width="216" height="336" fill="none" stroke="var(--color-linha-quadra)" strokeWidth="2.5" />

        {/* Linhas que distinguem o lado adversário, a rede e o nosso lado. */}
        <g stroke="var(--color-linha-quadra)" fill="none">
          <line x1="12" y1="150" x2="228" y2="150" stroke="url(#redeGradiente)" strokeWidth="5" />
          <line x1="12" y1="210" x2="228" y2="210" strokeDasharray="8,6" strokeWidth="1.5" opacity="0.65" />
        </g>
        <g stroke="url(#redeGradiente)" strokeWidth="5" opacity="0.95">
          <line x1="12" y1="150" x2="228" y2="150" />
        </g>

        {/* Identifica as duas áreas sem competir com os jogadores. */}
        <text x="120" y="35" textAnchor="middle" fontFamily="var(--font-family-titulo)" fontSize="8" fontWeight="500" fill="var(--color-texto-na-quadra)" letterSpacing="0.04em">
          ADVERSÁRIO
        </text>
        <text x="120" y="338" textAnchor="middle" fontFamily="var(--font-family-titulo)" fontSize="8" fontWeight="500" fill="var(--color-texto-na-quadra)" letterSpacing="0.04em">
          NOSSO TIME
        </text>
        <text x="120" y="143" textAnchor="middle" fontFamily="var(--font-family-mono)" fontSize="8" fontWeight="500" fill="var(--color-adversario)">
          REDE
        </text>

        {/* Rótulos das zonas acompanham cada ponto para ligar espaço e jogador. */}
        <g fontFamily="var(--font-family-mono)" fontSize="8" fontWeight="500" fill="var(--color-texto-na-quadra)">
          <text x="20" y="215" textAnchor="start">P4</text>
          <text x="120" y="207" textAnchor="middle">P3</text>
          <text x="220" y="215" textAnchor="end">P2</text>
          <text x="20" y="305" textAnchor="start">P5</text>
          <text x="120" y="317" textAnchor="middle">P6</text>
          <text x="220" y="305" textAnchor="end">P1</text>
        </g>

        {/* Desenha as rotas apenas como camada auxiliar da formação. */}
        {jogadores
          .filter((jogador) => !isNossoSaque && jogador.rotaInfiltracao)
          .filter((jogador) => jogador.funcao === posicaoDestacada)
          .map((jogador) => (
            <RotaGenerica
              key={jogador.funcao}
              pontos={jogador.rotaInfiltracao!.pontos}
              cor={corRota}
              markerId={markerId}
            />
          ))}

        {/* Desenha os jogadores não levantadores. */}
        {demaisJogadores.map((jogador) => (
          <JogadorPin
            key={jogador.funcao}
            funcao={jogador.funcao}
            posicao={jogador.posicao}
            destaque={posicaoDestacada === jogador.funcao}
            naRecepcao={jogador.naRecepcao}
            onClick={() => onJogadorClick?.(jogador.funcao)}
          />
        ))}

        {/* Desenha o levantador por último para manter sua leitura prioritária. */}
        {levantador && (
          <JogadorPin
            key="L"
            funcao="L"
            posicao={levantador.posicao}
            destaque={posicaoDestacada === 'L'}
            naRecepcao={levantador.naRecepcao}
            onClick={() => onJogadorClick?.('L')}
          />
        )}
      </svg>
    </div>
  )
}
