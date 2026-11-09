import type { FuncaoJogador, PosicaoQuadra, Rodizio, TipoSaida } from '../../domain/rodizio'
import { obterLeituraRodizio, obterPosicaoJogador, obterRodizioPorPosicaoJogador } from '../../domain/rodizio'

interface HeaderRodizioProps {
  rodizioAtivo: Rodizio
  /** Jogador usado para navegar pelas posições P1-P6. */
  funcaoReferencia: FuncaoJogador | null
  /** Callback quando o rodízio muda. */
  onRodizioChange: (rodizio: Rodizio) => void
  /** Situação atual do rally. */
  tipoSaida: TipoSaida
  /** Callback quando a situação muda. */
  onTipoSaidaChange: (tipo: TipoSaida) => void
}

const posicoesLevantador: PosicaoQuadra[] = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']

const nomesFuncoes: Record<FuncaoJogador, string> = {
  L: 'Levantador',
  O: 'Oposto',
  P1: 'PT1',
  P2: 'PT2',
  C1: 'Central 1',
  C2: 'Central 2',
  LIB: 'Líbero',
}

/** Cabeçalho que permite navegar pelo rodízio a partir de qualquer função. */
export function HeaderRodizio({
  rodizioAtivo,
  funcaoReferencia,
  onRodizioChange,
  tipoSaida,
  onTipoSaidaChange,
}: HeaderRodizioProps) {
  const { posicaoLevantador, posicaoOposto } = obterLeituraRodizio(rodizioAtivo)
  // Sem filtro, a navegação continua pelo levantador, mas sem apresentá-lo como seleção do usuário.
  const funcaoNavegacao = funcaoReferencia ?? 'L'
  const posicaoReferencia = obterPosicaoJogador(rodizioAtivo, funcaoNavegacao)
  const nomeReferencia = funcaoReferencia ? nomesFuncoes[funcaoReferencia] : null

  return (
    <header className="sticky top-0 z-10 border-b border-borda bg-fundo/98">
      <div className="mx-auto max-w-[1440px] px-4 py-3 lg:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4 lg:min-w-[220px]">
            <div>
              <h1 className="font-titulo text-lg font-bold tracking-[-0.02em] text-texto">
                Rodízio Pro
              </h1>
              <p className="mt-0.5 text-xs text-texto-suave">Mapa tático 5x1</p>
            </div>

            <div className="flex items-center gap-1 rounded-controle bg-superficie p-1 lg:hidden" role="radiogroup" aria-label="Situação do rally">
              <BotaoModo tipo="nosso-saque" ativo={tipoSaida === 'nosso-saque'} onClick={onTipoSaidaChange} compacto />
              <BotaoModo tipo="saque-adversario" ativo={tipoSaida === 'saque-adversario'} onClick={onTipoSaidaChange} compacto />
            </div>
          </div>

          <div className="hidden items-center gap-2 lg:flex" role="radiogroup" aria-label="Situação do rally">
            <span className="text-xs text-texto-suave">Situação</span>
            <div className="flex items-center gap-1 rounded-controle bg-superficie p-1">
              <BotaoModo tipo="nosso-saque" ativo={tipoSaida === 'nosso-saque'} onClick={onTipoSaidaChange} />
              <BotaoModo tipo="saque-adversario" ativo={tipoSaida === 'saque-adversario'} onClick={onTipoSaidaChange} />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:min-w-[260px] lg:justify-end" aria-live="polite">
            <a href="/editor" className="rounded-controle bg-superficie px-3 py-2 text-xs text-texto-suave whitespace-nowrap transition-colors hover:bg-borda hover:text-texto">Modo editor</a>
            <span className="font-mono text-xs text-texto-suave">Referência atual</span>
            <div className="text-right">
              <p className="font-titulo text-sm font-semibold text-acento">
                {nomeReferencia ? `${nomeReferencia} em ${posicaoReferencia}` : 'Nenhum jogador selecionado'}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-texto-suave">
                {nomeReferencia
                  ? funcaoReferencia === 'L' ? `Oposto em ${posicaoOposto}` : `Levantador em ${posicaoLevantador}`
                  : 'Use “Ver como” para mudar a referência'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 border-t border-borda/70 pt-3 sm:flex-row sm:items-center sm:gap-4">
          <span className="shrink-0 text-xs font-medium text-texto-suave">
            {nomeReferencia ? `Posição de ${nomeReferencia}` : 'Navegar pelo rodízio'}
          </span>
          <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide" role="radiogroup" aria-label={nomeReferencia ? `Posição de ${nomeReferencia}` : 'Navegar pelo rodízio'}>
            {posicoesLevantador.map((posicao) => {
              const ativo = posicaoReferencia === posicao

              return (
                <button
                  key={posicao}
                  type="button"
                  role="radio"
                  aria-checked={ativo}
                  aria-label={`${nomeReferencia ?? 'Rodízio'} na posição ${posicao}`}
                  onClick={() => onRodizioChange(obterRodizioPorPosicaoJogador(funcaoNavegacao, posicao))}
                  className={`min-h-9 min-w-12 cursor-pointer rounded-controle px-3 py-1.5 font-mono text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento ${
                    ativo
                      ? 'bg-acento text-fundo'
                      : 'bg-superficie text-texto-suave hover:bg-borda hover:text-texto'
                  }`}
                >
                  {posicao}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}

function BotaoModo({
  tipo,
  ativo,
  onClick,
  compacto = false,
}: {
  tipo: TipoSaida
  ativo: boolean
  onClick: (tipo: TipoSaida) => void
  compacto?: boolean
}) {
  const label = tipo === 'nosso-saque' ? 'Nosso saque' : 'Saque adversário'

  return (
    <button
      type="button"
      role="radio"
      aria-checked={ativo}
      onClick={() => onClick(tipo)}
      className={`cursor-pointer rounded-controle px-3 py-1.5 font-mono text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento ${compacto ? 'max-w-[150px] truncate' : ''} ${
        ativo
          ? tipo === 'nosso-saque'
            ? 'bg-acento text-fundo'
            : 'bg-rota text-fundo'
          : 'text-texto-suave hover:bg-borda hover:text-texto'
      }`}
    >
      {label}
    </button>
  )
}
