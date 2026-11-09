import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { EstadoRodizio, JogadorNaQuadra, PosicaoQuadra, FuncaoJogador } from '../../domain/rodizio'
import { posicaoParaCoordenadas } from '../../domain/rodizio'

interface QuadraSVGProps {
  estado: EstadoRodizio
  onJogadorClick?: (funcao: FuncaoJogador) => void
}

/** Converte uma posição percentual para o viewBox vertical de 240x360. */
function pctParaSVG([x, y]: [number, number]): [number, number] {
  return [x * 2.4, y * 3.6]
}

function rotuloFuncao(funcao: FuncaoJogador) {
  if (funcao === 'P1') return 'PT1'
  if (funcao === 'P2') return 'PT2'
  return funcao
}

type CoordenadasQuadra = [number, number]
type MapaCoordenadas = Partial<Record<FuncaoJogador, CoordenadasQuadra>>

const DURACAO_TRANSICAO_MS = 720

function coordenadasDoJogador(jogador: JogadorNaQuadra): CoordenadasQuadra {
  return jogador.coordenadas ?? posicaoParaCoordenadas(jogador.posicao)
}

function interpolarCoordenadas(
  origem: CoordenadasQuadra,
  destino: CoordenadasQuadra,
  progresso: number,
): CoordenadasQuadra {
  return [
    origem[0] + (destino[0] - origem[0]) * progresso,
    origem[1] + (destino[1] - origem[1]) * progresso,
  ]
}

/** Mantém a origem da formação anterior para animar a troca entre os dois saques. */
function useTransicaoFormacao(jogadores: JogadorNaQuadra[], tipoSaida: EstadoRodizio['tipoSaida']) {
  const destinos = useMemo<MapaCoordenadas>(
    () => Object.fromEntries(jogadores.map((jogador) => [jogador.funcao, coordenadasDoJogador(jogador)])),
    [jogadores],
  )
  const destinosAnteriores = useRef(destinos)
  const tipoSaidaAnterior = useRef(tipoSaida)
  const [origens, setOrigens] = useState<MapaCoordenadas | null>(null)
  const [progresso, setProgresso] = useState(1)

  useLayoutEffect(() => {
    if (tipoSaidaAnterior.current === tipoSaida) {
      destinosAnteriores.current = destinos
      return
    }

    const origem = destinosAnteriores.current
    tipoSaidaAnterior.current = tipoSaida
    destinosAnteriores.current = destinos
    setOrigens(origem)
    setProgresso(0)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOrigens(null)
      setProgresso(1)
      return
    }

    const inicio = performance.now()
    let frameId = 0
    const animar = (agora: number) => {
      const progressoBruto = Math.min((agora - inicio) / DURACAO_TRANSICAO_MS, 1)
      const progressoSuave = 1 - (1 - progressoBruto) ** 4
      setProgresso(progressoSuave)

      if (progressoBruto < 1) {
        frameId = requestAnimationFrame(animar)
      } else {
        setOrigens(null)
      }
    }

    frameId = requestAnimationFrame(animar)
    return () => cancelAnimationFrame(frameId)
  }, [destinos, tipoSaida])

  return { destinos, origens, progresso }
}

/** Desenha um jogador e permite abrir sua instrução pelo mouse ou teclado. */
function JogadorPin({
  funcao,
  posicao,
  coordenadas,
  foraDaQuadra = false,
  sacando = false,
  onClick,
}: {
  funcao: FuncaoJogador
  posicao: PosicaoQuadra
  coordenadas?: [number, number]
  foraDaQuadra?: boolean
  sacando?: boolean
  onClick?: () => void
}) {
  // Permite abrir a instrução do jogador também com Enter ou Espaço.
  const handleKeyDown = (evento: KeyboardEvent<SVGGElement>) => {
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault()
      onClick?.()
    }
  }

  const [x, y] = useMemo(
    () => pctParaSVG(coordenadas ?? posicaoParaCoordenadas(posicao)),
    [coordenadas, posicao],
  )
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
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `${funcao}${sacando ? ' sacando' : foraDaQuadra ? ' fora da quadra' : ` na posição ${posicao}`}` : undefined}
      className={onClick ? 'cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento' : undefined}
      filter="none"
    >
      {/* Círculo principal do jogador. */}
      <circle
        r="14"
        fill={cor.bg}
        stroke="var(--color-linha-quadra)"
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />
      {/* Código curto da função dentro do pin. */}
      <text
        x="0"
        y="4"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-family-mono)"
        fontSize={funcao === 'P1' || funcao === 'P2' ? '8' : '10'}
        fontWeight="500"
        fill={cor.texto}
        pointerEvents="none"
      >
        {rotuloFuncao(funcao)}
      </text>
      {(foraDaQuadra || sacando) && (
        <text
          x="0"
          y="24"
          textAnchor="middle"
          fontFamily="var(--font-family-mono)"
          fontSize="6"
          fontWeight="500"
          fill="var(--color-texto-na-quadra)"
          pointerEvents="none"
        >
          {sacando ? 'SACANDO' : 'FORA'}
        </text>
      )}
    </g>
  )
}

/** Quadra vertical com a rede horizontal e o nosso time abaixo dela. */
export function QuadraSVG({ estado, onJogadorClick }: QuadraSVGProps) {
  const { tipoSaida, jogadores } = estado
  const { destinos, origens, progresso } = useTransicaoFormacao(jogadores, tipoSaida)
  const jogadoresAnimados = jogadores.map((jogador) => ({
    ...jogador,
    coordenadas: origens?.[jogador.funcao]
      ? interpolarCoordenadas(origens[jogador.funcao]!, destinos[jogador.funcao]!, progresso)
      : destinos[jogador.funcao],
  }))
  const trilhas = origens
    ? jogadoresAnimados
      .filter((jogador) => origens[jogador.funcao])
      .map((jogador) => ({
        funcao: jogador.funcao,
        origem: origens[jogador.funcao]!,
        destinoAtual: jogador.coordenadas!,
      }))
    : []
  const levantador = jogadoresAnimados.find((jogador) => jogador.funcao === 'L')
  const demaisJogadores = jogadoresAnimados.filter((jogador) => jogador.funcao !== 'L')
  const isNossoSaque = tipoSaida === 'nosso-saque'
  return (
    <div
      className="mx-auto w-full max-w-[680px] aspect-[2/3] max-h-[72vh] relative bg-quadra rounded-none overflow-hidden"
      role="group"
      aria-label={`Quadra de vôlei - Levantador em ${jogadores.find((jogador) => jogador.funcao === 'L')?.posicao} - ${isNossoSaque ? 'Nosso saque' : 'Saque adversário'}`}
    >
      <svg viewBox="0 0 240 360" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
        <defs>
          <linearGradient id="pisoGradiente" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-quadra-clara)" />
            <stop offset="100%" stopColor="var(--color-quadra)" />
          </linearGradient>
        </defs>

        {/* Piso completo para mostrar nosso lado e uma faixa do adversário. */}
        <rect width="240" height="360" fill="url(#pisoGradiente)" />
        <rect x="12" y="12" width="216" height="336" fill="none" stroke="var(--color-linha-quadra)" strokeWidth="2.5" />

        {/* Linha de ataque a 3 m da rede no nosso lado. */}
        <g stroke="var(--color-linha-quadra)" fill="none">
          <line x1="12" y1="216" x2="228" y2="216" strokeWidth="1.6" opacity="0.8" />
        </g>
        {/* Rede simples com malha. */}
        <g stroke="var(--color-texto-na-quadra)" fill="none" opacity="0.92">
          <rect x="12" y="145" width="216" height="10" strokeWidth="1" />
          {[30, 48, 66, 84, 102, 120, 138, 156, 174, 192, 210].map((x) => (
            <line key={x} x1={x} y1="145" x2={x} y2="155" strokeWidth="0.7" />
          ))}
          <line x1="12" y1="150" x2="228" y2="150" stroke="var(--color-linha-quadra)" strokeWidth="1.4" />
        </g>

        {/* Identifica as duas áreas sem competir com os jogadores. */}
        <text x="120" y="35" textAnchor="middle" fontFamily="var(--font-family-titulo)" fontSize="8" fontWeight="500" fill="var(--color-texto-na-quadra)" letterSpacing="0.04em">
          ADVERSÁRIO
        </text>
        <text x="120" y="338" textAnchor="middle" fontFamily="var(--font-family-titulo)" fontSize="8" fontWeight="500" fill="var(--color-texto-na-quadra)" letterSpacing="0.04em">
          NOSSO TIME
        </text>
        <text x="120" y="139" textAnchor="middle" fontFamily="var(--font-family-mono)" fontSize="7" fontWeight="500" fill="var(--color-texto-na-quadra)">
          REDE
        </text>

        {/* Trilhas aparecem apenas durante a troca de formação. */}
        {trilhas.map(({ funcao, origem, destinoAtual }) => {
          const [x1, y1] = pctParaSVG(origem)
          const [x2, y2] = pctParaSVG(destinoAtual)

          return (
            <line
              key={funcao}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--color-rota)"
              strokeWidth="1.5"
              strokeDasharray="5,4"
              strokeLinecap="round"
              opacity="0.72"
            />
          )
        })}

        {/* Desenha os jogadores não levantadores. */}
        {demaisJogadores.map((jogador) => (
          <JogadorPin
            key={jogador.funcao}
            funcao={jogador.funcao}
            posicao={jogador.posicao}
            coordenadas={jogador.coordenadas}
            foraDaQuadra={jogador.foraDaQuadra}
            sacando={jogador.sacando}
            onClick={() => onJogadorClick?.(jogador.funcao)}
          />
        ))}

        {/* Desenha o levantador por último para manter sua leitura prioritária. */}
        {levantador && (
          <JogadorPin
            key="L"
            funcao="L"
            posicao={levantador.posicao}
            coordenadas={levantador.coordenadas}
            foraDaQuadra={levantador.foraDaQuadra}
            sacando={levantador.sacando}
            onClick={() => onJogadorClick?.('L')}
          />
        )}
      </svg>
    </div>
  )
}
