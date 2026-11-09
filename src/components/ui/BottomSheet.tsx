import { createContext, useContext, useState, ReactNode } from 'react'
import { AlertTriangle, Lightbulb, X } from 'lucide-react'
import { PosicaoJogador } from './FiltroPosicao'
import type { Rodizio } from '../../domain/rodizio'
import { getInstrucao, obterLeituraRodizio, type InstrucaoPosicao } from '../../domain/rodizio'

interface BottomSheetContextValue {
  isOpen: boolean
  posicaoSelecionada: PosicaoJogador | null
  rodizioAtual: Rodizio
  openSheet: (posicao: PosicaoJogador, rodizio: Rodizio) => void
  closeSheet: () => void
}

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null)

export function BottomSheetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [posicaoSelecionada, setPosicaoSelecionada] = useState<PosicaoJogador | null>(null)
  const [rodizioAtual, setRodizioAtual] = useState<Rodizio>(1)

  const openSheet = (posicao: PosicaoJogador, rodizio: Rodizio) => {
    setPosicaoSelecionada(posicao)
    setRodizioAtual(rodizio)
    setIsOpen(true)
  }

  const closeSheet = () => {
    setIsOpen(false)
    setPosicaoSelecionada(null)
  }

  return (
    <BottomSheetContext.Provider value={{ isOpen, posicaoSelecionada, rodizioAtual, openSheet, closeSheet }}>
      {children}
      <BottomSheet />
    </BottomSheetContext.Provider>
  )
}

export function useBottomSheet() {
  const ctx = useContext(BottomSheetContext)
  if (!ctx) throw new Error('useBottomSheet deve ser usado dentro de BottomSheetProvider')
  return ctx
}

/** Bottom sheet com instrução textual dinâmica por rodízio e posição */
function BottomSheet() {
  const { isOpen, posicaoSelecionada, rodizioAtual, closeSheet } = useBottomSheet()

  if (!isOpen || !posicaoSelecionada) return null

  // Busca a instrução real do domínio usando o rodízio interno e a posição escolhida.
  const info: InstrucaoPosicao = getInstrucao(rodizioAtual, posicaoSelecionada)
  const posicaoLevantador = obterLeituraRodizio(rodizioAtual).posicaoLevantador
  const tituloFuncao = info.titulo
    .replace('Ponteiro 1 (P1)', 'Ponteiro 1 (PT1)')
    .replace('Ponteiro 2 (P2)', 'Ponteiro 2 (PT2)')

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bottom-sheet-title"
    >
      {/* Camada visual que separa o painel do conteúdo sem fechá-lo por acidente. */}
      <div
        className="fixed inset-0 bg-fundo/70 transition-opacity"
        aria-hidden="true"
      />

      {/* O painel sobe da base e mantém o conteúdo dentro de uma altura confortável. */}
      <div className="relative z-10 flex max-h-[min(78vh,620px)] w-full max-w-[720px] flex-col rounded-t-painel bg-superficie shadow-elevado animate-slide-up">
        {/* Cabeçalho com ação explícita para fechar o painel. */}
        <div className="flex items-center justify-between border-b border-borda p-4">
          <div className="flex items-center gap-3">
            <div
              className="w-1.5 h-10 bg-acento rounded-full"
              aria-hidden="true"
            />
            <h2 id="bottom-sheet-title" className="font-titulo text-base font-semibold text-texto">
              {tituloFuncao}
            </h2>
          </div>
          <button
            onClick={closeSheet}
            className="cursor-pointer rounded-controle bg-borda p-1.5 text-texto-suave transition-colors hover:bg-acento hover:text-fundo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento"
            aria-label="Fechar painel"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Conteúdo scrollável sem expandir o painel até ocupar a tela inteira. */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 text-texto">
          <section>
            <h3 className="font-titulo text-xs font-semibold text-texto-suave uppercase tracking-wider mb-2">
              Onde ficar na recepção
            </h3>
            <p className="text-sm leading-relaxed">{info.ondeFicar}</p>
          </section>

          <section>
            <h3 className="font-titulo text-xs font-semibold text-texto-suave uppercase tracking-wider mb-2">
              Para onde correr após o saque
            </h3>
            <p className="text-sm leading-relaxed">{info.paraOndeCorrer}</p>
          </section>

          {info.dica && (
            <section className="bg-acento/10 border border-acento/30 rounded-controle p-3">
              <h3 className="font-titulo text-xs font-semibold text-acento uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lightbulb size={14} strokeWidth={1.75} aria-hidden="true" />
                Dica
              </h3>
              <p className="text-sm leading-relaxed text-acento/90">{info.dica}</p>
            </section>
          )}

          <section className="bg-erro/10 border border-erro/30 rounded-controle p-3">
            <h3 className="font-titulo text-xs font-semibold text-erro uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlertTriangle size={14} strokeWidth={1.75} aria-hidden="true" />
              Erro comum
            </h3>
            <p className="text-sm leading-relaxed text-erro/90">{info.erroComum}</p>
          </section>

          <p className="border-t border-borda pt-2 text-center font-mono text-[11px] text-texto-suave/60">
            Levantador em {posicaoLevantador} • {tituloFuncao}
          </p>
        </div>

        {/* Identifica visualmente a área arrastável sem adicionar comportamento falso. */}
        <div className="flex justify-center pb-3">
          <div className="w-10 h-1 bg-borda rounded-full" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
