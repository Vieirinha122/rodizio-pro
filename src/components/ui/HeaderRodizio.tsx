import type { Rodizio, TipoSaida } from '../../domain/rodizio'
import { obterLeituraRodizio } from '../../domain/rodizio'

interface HeaderRodizioProps {
  /** Rodízio atualmente ativo (R1-R6). */
  rodizioAtivo: Rodizio
  /** Callback quando o rodízio muda. */
  onRodizioChange: (rodizio: Rodizio) => void
  /** Situação atual do rally. */
  tipoSaida: TipoSaida
  /** Callback quando a situação muda. */
  onTipoSaidaChange: (tipo: TipoSaida) => void
}

const rodizios: Rodizio[] = [1, 2, 3, 4, 5, 6]

/** Cabeçalho que separa o rodízio, a situação do rally e a leitura atual. */
export function HeaderRodizio({
  rodizioAtivo,
  onRodizioChange,
  tipoSaida,
  onTipoSaidaChange,
}: HeaderRodizioProps) {
  const { posicaoLevantador, posicaoOposto } = obterLeituraRodizio(rodizioAtivo)

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
            <span className="font-mono text-xs text-texto-suave">Leitura atual</span>
            <div className="text-right">
              <p className="font-titulo text-sm font-semibold text-acento">Rodízio R{rodizioAtivo}</p>
              <p className="mt-0.5 font-mono text-[11px] text-texto-suave">L na {posicaoLevantador} · O na {posicaoOposto}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 border-t border-borda/70 pt-3 sm:flex-row sm:items-center sm:gap-4">
          <span className="shrink-0 text-xs font-medium text-texto-suave">Rodízio</span>
          <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide" role="radiogroup" aria-label="Rodízio do time">
            {rodizios.map((rodizio) => {
              const ativo = rodizioAtivo === rodizio

              return (
                <button
                  key={rodizio}
                  type="button"
                  role="radio"
                  aria-checked={ativo}
                  aria-label={`Rodízio R${rodizio}`}
                  onClick={() => onRodizioChange(rodizio)}
                  className={`min-h-9 min-w-12 cursor-pointer rounded-controle px-3 py-1.5 font-mono text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento ${
                    ativo
                      ? 'bg-acento text-fundo'
                      : 'bg-superficie text-texto-suave hover:bg-borda hover:text-texto'
                  }`}
                >
                  R{rodizio}
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
  const label = tipo === 'nosso-saque' ? 'Formação inicial' : 'Recepção'

  return (
    <button
      type="button"
      role="radio"
      aria-checked={ativo}
      onClick={() => onClick(tipo)}
      className={`cursor-pointer rounded-controle px-3 py-1.5 font-mono text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento ${compacto ? 'max-w-[132px] truncate' : ''} ${
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
