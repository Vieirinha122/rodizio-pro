import { createContext, useContext, useState, ReactNode } from 'react'

/** Posições disponíveis para o filtro "Ver como" */
export type PosicaoJogador =
  | 'L'   // Levantador
  | 'O'   // Oposto
  | 'P1'  // Ponteiro 1
  | 'P2'  // Ponteiro 2
  | 'C1'  // Central 1
  | 'C2'  // Central 2
  | 'LIB' // Líbero

interface PosicaoInfo {
  codigo: PosicaoJogador
  label: string
  descricao: string
}

export const POSICOES: PosicaoInfo[] = [
  { codigo: 'L', label: 'Levantador', descricao: 'Infiltra da posição de defesa para a zona de levantamento (entre P2 e P3)' },
  { codigo: 'O', label: 'Oposto', descricao: 'Ataca pela saída de rede (P2) e defende no fundo (P1)' },
  { codigo: 'P1', label: 'PT1', descricao: 'Recepção principal, ataca pela saída de rede' },
  { codigo: 'P2', label: 'PT2', descricao: 'Recepção, ataca pelo meio / pipe' },
  { codigo: 'C1', label: 'Central 1', descricao: 'Bloqueio central, ataque de primeira tempo' },
  { codigo: 'C2', label: 'Central 2', descricao: 'Bloqueio central, rotação com líbero' },
  { codigo: 'LIB', label: 'Líbero', descricao: 'Especialista em defesa/recepção, substitui central no fundo' },
]

interface FiltroPosicaoContextValue {
  posicaoSelecionada: PosicaoJogador
  setPosicaoSelecionada: (pos: PosicaoJogador) => void
}

const FiltroPosicaoContext = createContext<FiltroPosicaoContextValue | null>(null)

export function FiltroPosicaoProvider({ children }: { children: ReactNode }) {
  const [posicaoSelecionada, setPosicaoSelecionada] = useState<PosicaoJogador>('L')

  return (
    <FiltroPosicaoContext.Provider value={{ posicaoSelecionada, setPosicaoSelecionada }}>
      {children}
    </FiltroPosicaoContext.Provider>
  )
}

export function useFiltroPosicao() {
  const ctx = useContext(FiltroPosicaoContext)
  if (!ctx) throw new Error('useFiltroPosicao deve ser usado dentro de FiltroPosicaoProvider')
  return ctx
}

/** Segmented control "Ver como" — escolhe qual posição destacar */
export function FiltroPosicao() {
  const { posicaoSelecionada, setPosicaoSelecionada } = useFiltroPosicao()

  return (
    <div className="border-t border-borda bg-fundo px-4 py-3 lg:px-8" role="group" aria-label="Filtrar por posição do jogador">
      <div className="mx-auto flex w-full max-w-[1120px] items-center gap-3">
        <span className="shrink-0 font-mono text-[11px] text-texto-suave">Ver como</span>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
        {POSICOES.map(({ codigo, label }) => (
          <button
            key={codigo}
            type="button"
            onClick={() => setPosicaoSelecionada(codigo)}
            aria-pressed={posicaoSelecionada === codigo}
            className={`
              flex-shrink-0 cursor-pointer rounded-controle px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento
              ${posicaoSelecionada === codigo
                ? 'bg-acento text-fundo font-titulo shadow-[0_0_10px_color-mix(in_srgb,var(--color-acento)_38%,transparent)]'
                : 'bg-superficie text-texto-suave hover:text-texto hover:bg-borda'
              }
            `}
          >
            {label}
          </button>
        ))}
        </div>
      </div>
    </div>
  )
}
