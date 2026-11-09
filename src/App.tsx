import { useEffect, useMemo, useState } from 'react'
import { HeaderRodizio } from './components/ui/HeaderRodizio'
import { QuadraSVG } from './components/quadra/QuadraSVG'
import { FiltroPosicao, FiltroPosicaoProvider, POSICOES, useFiltroPosicao } from './components/ui/FiltroPosicao'
import { BottomSheetProvider, useBottomSheet } from './components/ui/BottomSheet'
import { gerarEstadoRodizio, obterPosicaoJogador, type FaseNossoSaque, type FuncaoJogador, type Rodizio, type TipoSaida } from './domain/rodizio'
import { carregarFormacaoTreinador } from './domain/rodizio'

function AppContent() {
  const [rodizioAtivo, setRodizioAtivo] = useState<Rodizio>(1)
  const [tipoSaida, setTipoSaida] = useState<TipoSaida>('saque-adversario')
  const [faseNossoSaque, setFaseNossoSaque] = useState<FaseNossoSaque>('antes-saque')
  const { posicaoSelecionada } = useFiltroPosicao()
  const { openSheet } = useBottomSheet()
  const funcaoReferencia = posicaoSelecionada
  const nomeReferencia = funcaoReferencia
    ? POSICOES.find(({ codigo }) => codigo === funcaoReferencia)?.label ?? funcaoReferencia
    : null
  const posicaoReferencia = funcaoReferencia
    ? obterPosicaoJogador(rodizioAtivo, funcaoReferencia)
    : null

  const formacaoTreinador = useMemo(
    () => tipoSaida === 'nosso-saque' ? carregarFormacaoTreinador(rodizioAtivo) : null,
    [rodizioAtivo, tipoSaida],
  )

  // Sem formação salva, preserva integralmente o mapa didático atual.
  const estadoBase = gerarEstadoRodizio(rodizioAtivo, tipoSaida, posicaoSelecionada ?? undefined, faseNossoSaque)
  const estadoAtual = formacaoTreinador
    ? {
        ...estadoBase,
        faseNossoSaque: undefined,
        jogadores: (Object.entries(formacaoTreinador.posicoes) as [FuncaoJogador, [number, number]][])
          .filter(([funcao]) => !formacaoTreinador.fora.includes(funcao))
          .map(([funcao, coordenadas]) => ({
          funcao,
          posicao: obterPosicaoJogador(rodizioAtivo, funcao),
          coordenadas,
          naRecepcao: false,
          })),
      }
    : estadoBase

  const obterFaseInicialNossoSaque = (rodizio: Rodizio, tipo: TipoSaida): FaseNossoSaque =>
    tipo === 'nosso-saque' && rodizio === 5 ? 'troca-pre-saque' : 'antes-saque'

  useEffect(() => {
    if (formacaoTreinador || tipoSaida !== 'nosso-saque' || (rodizioAtivo !== 1 && rodizioAtivo !== 5)) return

    const proximaFase = rodizioAtivo === 5 && faseNossoSaque === 'troca-pre-saque'
      ? 'antes-saque'
      : faseNossoSaque === 'antes-saque'
        ? 'apos-saque'
        : null

    if (!proximaFase) return

    const timer = window.setTimeout(() => setFaseNossoSaque(proximaFase), 1400)
    return () => window.clearTimeout(timer)
  }, [faseNossoSaque, formacaoTreinador, rodizioAtivo, tipoSaida])

  const handleRodizioChange = (rodizio: Rodizio) => {
    setRodizioAtivo(rodizio)
    setFaseNossoSaque(obterFaseInicialNossoSaque(rodizio, tipoSaida))
  }

  const handleTipoSaidaChange = (tipo: TipoSaida) => {
    setTipoSaida(tipo)
    setFaseNossoSaque(obterFaseInicialNossoSaque(rodizioAtivo, tipo))
  }

  const handleJogadorClick = (funcao: FuncaoJogador) => {
    openSheet(funcao, rodizioAtivo)
  }

  const reproduzirSequenciaSaque = () => {
    setFaseNossoSaque(rodizioAtivo === 5 ? 'troca-pre-saque' : 'antes-saque')
  }

  return (
    <div className="min-h-screen bg-fundo text-texto font-corpo flex flex-col">
      {/* Cabeçalho com situação do rally e seleção da posição do levantador. */}
      <HeaderRodizio
        rodizioAtivo={rodizioAtivo}
        funcaoReferencia={funcaoReferencia}
        onRodizioChange={handleRodizioChange}
        tipoSaida={tipoSaida}
        onTipoSaidaChange={handleTipoSaidaChange}
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
                  ? formacaoTreinador
                    ? 'Formação definida no editor do treinador.'
                    : faseNossoSaque === 'troca-pre-saque'
                    ? 'O líbero deixa a rede e o C1 entra antes do apito.'
                    : faseNossoSaque === 'antes-saque'
                    ? 'Trocas entre líbero e central já foram concluídas antes do apito.'
                    : 'O sacador já entrou na posição de defesa após colocar a bola em jogo.'
                  : 'Veja o ajuste visual da recepção com base na posição atual do levantador.'}
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="font-mono text-xs text-texto-suave">
                {nomeReferencia && posicaoReferencia ? `${nomeReferencia} em ${posicaoReferencia}` : 'Selecione um jogador em “Ver como”'}
              </p>
              <p className="mt-1 text-sm text-texto-suave">
                {tipoSaida === 'nosso-saque'
                  ? formacaoTreinador
                    ? 'Formação do treinador'
                    : faseNossoSaque === 'troca-pre-saque'
                    ? 'Troca pré-saque em andamento'
                    : faseNossoSaque === 'antes-saque' ? 'Antes do saque' : 'Após o saque · defesa'
                  : 'Ajuste visual da recepção'}
              </p>
            </div>
          </div>

          {tipoSaida === 'nosso-saque' && !formacaoTreinador && rodizioAtivo !== 1 && rodizioAtivo !== 5 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-borda/70 pt-3" role="radiogroup" aria-label="Etapa do saque">
              <span className="mr-1 font-mono text-[11px] text-texto-suave">Etapa</span>
              <button
                type="button"
                role="radio"
                aria-checked={faseNossoSaque === 'antes-saque'}
                onClick={() => setFaseNossoSaque('antes-saque')}
                className={`cursor-pointer rounded-controle px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento ${faseNossoSaque === 'antes-saque' ? 'bg-acento text-fundo' : 'bg-superficie text-texto-suave hover:bg-borda hover:text-texto'}`}
              >
                Antes do saque
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={faseNossoSaque === 'apos-saque'}
                onClick={() => setFaseNossoSaque('apos-saque')}
                className={`cursor-pointer rounded-controle px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento ${faseNossoSaque === 'apos-saque' ? 'bg-rota text-fundo' : 'bg-superficie text-texto-suave hover:bg-borda hover:text-texto'}`}
              >
                Após o saque · defesa
              </button>
              <span className="basis-full text-xs text-texto-suave sm:basis-auto">A troca com o líbero acontece antes do apito.</span>
            </div>
          )}

          {tipoSaida === 'nosso-saque' && !formacaoTreinador && (rodizioAtivo === 1 || rodizioAtivo === 5) && (
            <div className="flex flex-wrap items-center gap-2 border-t border-borda/70 pt-3" aria-live="polite">
              <span className="font-mono text-[11px] text-texto-suave" role="status">
                {rodizioAtivo === 1
                  ? faseNossoSaque === 'antes-saque'
                    ? 'Levantador saca; time preparado para defender.'
                    : 'Levantador sacou e entrou na defesa em P1.'
                  : faseNossoSaque === 'troca-pre-saque'
                    ? 'Líbero na P3; C1 aguarda fora.'
                    : faseNossoSaque === 'antes-saque'
                      ? 'Troca concluída: líbero fora e C1 na rede.'
                      : 'C2 sacou e fechou a defesa na P5.'}
              </span>
              <button
                type="button"
                onClick={reproduzirSequenciaSaque}
                className="cursor-pointer rounded-controle bg-superficie px-3 py-1.5 text-xs font-medium text-texto-suave transition-colors hover:bg-borda hover:text-texto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento"
              >
                Rever animação
              </button>
            </div>
          )}

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
