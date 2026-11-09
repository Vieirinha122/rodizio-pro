import { useMemo, useState } from 'react'
import type { FuncaoJogador, Rodizio } from '../domain/rodizio'
import { CHAVE_NOTAS_TREINADOR, carregarBancoFormacoes, chaveFormacaoTreinador, salvarBancoFormacoes, type BancoFormacoesTreinador, type FormacaoTreinador } from '../domain/rodizio'

const funcoes: FuncaoJogador[] = ['L', 'O', 'P1', 'P2', 'C1', 'C2', 'LIB']
const rotulos: Record<FuncaoJogador, string> = { L: 'L', O: 'O', P1: 'PT1', P2: 'PT2', C1: 'C1', C2: 'C2', LIB: 'LIB' }
const cores: Record<FuncaoJogador, string> = { L: 'bg-acento text-fundo', O: 'bg-adversario text-fundo', P1: 'bg-rota text-fundo', P2: 'bg-rota text-fundo', C1: 'bg-texto-suave text-texto', C2: 'bg-texto-suave text-texto', LIB: 'bg-quadra text-fundo' }

function criarFormacao(): FormacaoTreinador {
  return { posicoes: Object.fromEntries(funcoes.map((funcao, indice) => [funcao, [8, 18 + indice * 11]])), fora: [] }
}

export function EditorFormacoes() {
  const [rodizio, setRodizio] = useState<Rodizio>(1)
  const [banco, setBanco] = useState<BancoFormacoesTreinador>(carregarBancoFormacoes)
  const [notas, setNotas] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem(CHAVE_NOTAS_TREINADOR) ?? '{}') as Record<string, string> } catch { return {} }
  })
  const [mensagem, setMensagem] = useState('Ainda não salvo neste navegador.')
  const [toast, setToast] = useState(false)
  const id = chaveFormacaoTreinador(rodizio)
  const formacao = banco[id] ?? criarFormacao()

  const instrucoes = useMemo(() => 'Todos os pins começam na fila à esquerda. Arraste um por um para a posição definida pelo treinador no instante do nosso saque.', [])

  const atualizarPonto = (funcao: FuncaoJogador, evento: React.PointerEvent<HTMLElement>) => {
    const quadra = evento.currentTarget.closest('[data-arrastando]') ?? evento.currentTarget
    const limite = quadra.getBoundingClientRect()
    const x = Math.min(96, Math.max(4, ((evento.clientX - limite.left) / limite.width) * 100))
    const y = Math.min(96, Math.max(4, ((evento.clientY - limite.top) / limite.height) * 100))
    setBanco((atual) => ({ ...atual, [id]: { ...formacao, posicoes: { ...formacao.posicoes, [funcao]: [x, y] } } }))
  }

  const alternarFora = (funcao: FuncaoJogador) => {
    const fora = formacao.fora.includes(funcao)
      ? formacao.fora.filter((item) => item !== funcao)
      : [...formacao.fora, funcao]
    setBanco((atual) => ({ ...atual, [id]: { ...formacao, fora } }))
  }

  const salvar = () => {
    const bancoAtualizado = { ...banco, [id]: formacao }
    setBanco(bancoAtualizado)
    salvarBancoFormacoes(bancoAtualizado)
    localStorage.setItem(CHAVE_NOTAS_TREINADOR, JSON.stringify(notas))
    setMensagem('Formação e anotações salvas neste navegador.')
    setToast(true)
    window.setTimeout(() => setToast(false), 3200)
  }

  const restaurarBase = () => {
    setBanco((atual) => ({ ...atual, [id]: criarFormacao() }))
    setMensagem('Pins devolvidos para a fila. Salve se quiser manter.')
  }

  return (
    <main className="min-h-screen bg-fundo text-texto">
      <header className="border-b border-borda bg-fundo/98">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <div>
            <p className="font-titulo text-xl font-bold tracking-[-0.02em]">Editor do treinador</p>
            <p className="mt-1 text-sm text-texto-suave">Monte a formação real antes de aplicar no mapa didático.</p>
          </div>
          <a href="/" className="rounded-controle bg-superficie px-3 py-2 text-sm text-texto-suave transition-colors hover:bg-borda hover:text-texto">Voltar ao mapa</a>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1240px] gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <section className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-borda pb-4">
            <div>
              <h1 className="font-titulo text-2xl font-bold tracking-[-0.02em]">Nosso saque · levantador em P{rodizio}</h1>
              <p className="mt-1 max-w-[65ch] text-sm text-texto-suave">{instrucoes}</p>
            </div>
            <button type="button" onClick={salvar} className="cursor-pointer rounded-controle bg-acento px-4 py-2 text-sm font-semibold text-fundo">Salvar formação</button>
          </div>

          <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1" role="radiogroup" aria-label="Posição do levantador">
            {([1, 2, 3, 4, 5, 6] as Rodizio[]).map((item) => <button key={item} type="button" role="radio" aria-checked={rodizio === item} onClick={() => setRodizio(item)} className={`min-w-11 rounded-controle px-3 py-2 font-mono text-sm ${rodizio === item ? 'bg-acento text-fundo' : 'bg-superficie text-texto-suave hover:bg-borda'}`}>P{item}</button>)}
          </div>

          <div
            className="relative mx-auto mt-6 aspect-[2/3] w-full max-w-[560px] touch-none overflow-hidden bg-quadra"
            onPointerMove={(evento) => {
              const funcao = evento.currentTarget.dataset.arrastando as FuncaoJogador | undefined
              if (funcao) atualizarPonto(funcao, evento)
            }}
            onPointerUp={(evento) => { delete evento.currentTarget.dataset.arrastando }}
            onPointerCancel={(evento) => { delete evento.currentTarget.dataset.arrastando }}
          >
            <div className="absolute inset-[6%] border-2 border-white/90" />
            <div className="absolute left-[6%] right-[6%] top-[41.7%] h-2 border-y border-white/90 bg-quadra/50" />
            <div className="absolute left-[6%] right-[6%] top-[60%] border-t-2 border-white/80" />
            <span className="absolute left-1/2 top-[8%] -translate-x-1/2 font-mono text-xs text-texto-na-quadra">ADVERSÁRIO</span>
            <span className="absolute left-1/2 top-[38%] -translate-x-1/2 font-mono text-xs text-texto-na-quadra">REDE</span>
            <span className="absolute bottom-[7%] left-1/2 -translate-x-1/2 font-mono text-xs text-texto-na-quadra">NOSSO TIME</span>
            <span className="absolute left-[2%] top-[8%] font-mono text-[10px] text-texto-na-quadra">FILA</span>
            {funcoes.map((funcao) => {
              const [x, y] = formacao.posicoes[funcao] ?? [8, 18 + funcoes.indexOf(funcao) * 11]
              const estaFora = formacao.fora.includes(funcao)
              return <button key={funcao} type="button" aria-label={`Arrastar ${rotulos[funcao]}`} onPointerDown={(evento) => {
                evento.currentTarget.setPointerCapture(evento.pointerId)
                const quadra = evento.currentTarget.parentElement!
                quadra.dataset.arrastando = funcao
                atualizarPonto(funcao, evento)
              }} style={{ left: `${x}%`, top: `${y}%` }} className={`absolute z-10 grid size-12 -translate-x-1/2 -translate-y-1/2 cursor-grab place-items-center rounded-full border-2 border-white/30 font-mono text-sm shadow-elevado active:cursor-grabbing ${estaFora ? 'opacity-40 grayscale' : ''} ${cores[funcao]}`}>{rotulos[funcao]}{estaFora && <span className="absolute -bottom-4 font-mono text-[9px] text-texto-na-quadra">FORA</span>}</button>
            })}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-texto-suave"><span>Arraste cada pin da fila para a posição indicada.</span><button type="button" onClick={restaurarBase} className="shrink-0 text-texto-suave underline underline-offset-4 hover:text-texto">Voltar para a fila</button></div>
          <div className="mt-4 rounded-painel border border-borda p-3">
            <p className="text-xs font-medium text-texto">Fora da formação</p>
            <p className="mt-1 text-xs text-texto-suave">Marque quem não ficará em quadra nem entrará nesta formação.</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {funcoes.map((funcao) => <button key={funcao} type="button" aria-pressed={formacao.fora.includes(funcao)} onClick={() => alternarFora(funcao)} className={`cursor-pointer rounded-controle px-2.5 py-1.5 text-xs font-medium ${formacao.fora.includes(funcao) ? 'bg-adversario text-fundo' : 'bg-superficie text-texto-suave hover:bg-borda hover:text-texto'}`}>{rotulos[funcao]}</button>)}
            </div>
          </div>
        </section>

        <aside className="space-y-4 lg:pt-[112px]">
          <div className="rounded-painel bg-superficie p-4 shadow-elevado">
            <h2 className="font-titulo text-base font-semibold">Anotações do treinador</h2>
            <p className="mt-1 text-sm text-texto-suave">Esta nota fica vinculada somente a esta formação.</p>
            <textarea value={notas[id] ?? ''} onChange={(evento) => setNotas((atual) => ({ ...atual, [id]: evento.target.value }))} placeholder="Ex.: 3 atacantes na rede; levantador pode atacar de segunda quando o passe vier na rede..." className="mt-3 min-h-44 w-full resize-y rounded-controle border border-borda bg-fundo p-3 text-sm text-texto placeholder:text-texto-suave focus:outline-none" />
          </div>
          <div className="rounded-painel border border-borda p-4">
            <h2 className="font-titulo text-base font-semibold">Checklist do levantador</h2>
            <ul className="mt-3 space-y-2 text-sm text-texto-suave"><li>• Quantos atacantes ficam disponíveis na rede?</li><li>• Quem compõe a linha de passe?</li><li>• Há infiltração antes ou depois do saque?</li><li>• Em qual leitura a segunda bola é opção?</li></ul>
          </div>
          <div className="rounded-painel border border-borda p-4 text-sm text-texto-suave">
            A recepção do saque adversário permanece no mapa didático atual e não precisa ser preenchida aqui.
          </div>
          <p className="text-xs text-texto-suave" role="status">{mensagem}</p>
        </aside>
      </div>
      {toast && (
        <div role="status" className="fixed bottom-5 right-5 z-20 rounded-controle bg-acento px-4 py-3 text-sm font-semibold text-fundo shadow-elevado">
          Formação salva neste navegador
        </div>
      )}
    </main>
  )
}
