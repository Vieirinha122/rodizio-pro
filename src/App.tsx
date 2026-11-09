import { useState } from 'react'
import { HeaderRodizio } from './components/ui/HeaderRodizio'
import { QuadraSVG } from './components/quadra/QuadraSVG'
import { FiltroPosicao, FiltroPosicaoProvider, useFiltroPosicao } from './components/ui/FiltroPosicao'
import { BottomSheetProvider, useBottomSheet } from './components/ui/BottomSheet'
import { gerarEstadoRodizio, type FuncaoJogador, type Rodizio, type TipoSaida } from './domain/rodizio'

function AppContent() {
  const [rodizioAtivo, setRodizioAtivo] = useState<Rodizio>(1)
  const [tipoSaida, setTipoSaida] = useState<TipoSaida>('saque-adversario')
  const { posicaoSelecionada } = useFiltroPosicao()
  const { openSheet } = useBottomSheet()

  // Gera estado completo do rodízio baseado na seleção
  const estadoAtual = gerarEstadoRodizio(rodizioAtivo, tipoSaida, posicaoSelecionada)

  const handleJogadorClick = (funcao: FuncaoJogador) => {
    openSheet(funcao, rodizioAtivo)
  }

  return (
    <div className="min-h-screen bg-fundo text-texto font-corpo flex flex-col">
      {/* Cabeçalho com situação do rally e seleção da posição do levantador. */}
      <HeaderRodizio
        rodizioAtivo={rodizioAtivo}
        onRodizioChange={setRodizioAtivo}
        tipoSaida={tipoSaida}
        onTipoSaidaChange={setTipoSaida}
      />

      {/* Área principal centralizada para preservar a leitura da quadra no desktop e no celular. */}
      <main className="flex flex-1 justify-center px-4 py-6 lg:px-8 lg:py-8">
        <div className="flex w-full max-w-[920px] flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-titulo text-xl font-semibold tracking-[-0.02em] text-texto">
                {tipoSaida === 'nosso-saque' ? 'Saque do nosso time' : 'Saque do time adversário'}
              </h2>
              <p className="mt-1 text-sm text-texto-suave">
                {tipoSaida === 'nosso-saque'
                  ? 'Veja como o time se organiza para sacar e já defender a próxima bola.'
                  : 'Veja o ajuste visual da recepção com base na posição atual do levantador.'}
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="font-mono text-xs text-texto-suave">Levantador em {estadoAtual.jogadores.find((jogador) => jogador.funcao === 'L')?.posicao}</p>
              <p className="mt-1 text-sm text-texto-suave">{tipoSaida === 'nosso-saque' ? 'Posição para saque e defesa' : 'Ajuste visual da recepção'}</p>
            </div>
          </div>

          <QuadraSVG
            key={`quadra-${rodizioAtivo}-${posicaoSelecionada}`}
            estado={estadoAtual}
            onJogadorClick={handleJogadorClick}
          />
        </div>
      </main>

      {/* Filtro "Ver como" */}
      <FiltroPosicao />
    </div>
  )
}

export default function App() {
  return (
    <FiltroPosicaoProvider>
      <BottomSheetProvider>
        <AppContent />
      </BottomSheetProvider>
    </FiltroPosicaoProvider>
  )
}
