import type { FuncaoJogador, Rodizio } from './tipos'

export type CoordenadasFormacao = [number, number]
export interface FormacaoTreinador {
  posicoes: Partial<Record<FuncaoJogador, CoordenadasFormacao>>
  fora: FuncaoJogador[]
}
export type BancoFormacoesTreinador = Record<string, FormacaoTreinador>

export const CHAVE_FORMACOES_TREINADOR = 'rodizio-pro.formacoes-treinador.v1'
export const CHAVE_NOTAS_TREINADOR = `${CHAVE_FORMACOES_TREINADOR}.notas`

export function chaveFormacaoTreinador(rodizio: Rodizio) {
  return `nosso-saque-${rodizio}`
}

export function carregarBancoFormacoes(): BancoFormacoesTreinador {
  try {
    const banco = JSON.parse(localStorage.getItem(CHAVE_FORMACOES_TREINADOR) ?? '{}') as Record<string, unknown>
    return Object.fromEntries(Object.entries(banco).map(([chave, valor]) => [chave, normalizarFormacao(valor)]))
  } catch {
    return {}
  }
}

function normalizarFormacao(valor: unknown): FormacaoTreinador {
  if (valor && typeof valor === 'object' && 'posicoes' in valor) {
    const estruturada = valor as FormacaoTreinador
    return { posicoes: estruturada.posicoes ?? {}, fora: estruturada.fora ?? [] }
  }

  // Mantém compatibilidade com as formações salvas antes da indicação “fora”.
  return { posicoes: (valor ?? {}) as Partial<Record<FuncaoJogador, CoordenadasFormacao>>, fora: [] }
}

export function carregarFormacaoTreinador(rodizio: Rodizio): FormacaoTreinador | null {
  return carregarBancoFormacoes()[chaveFormacaoTreinador(rodizio)] ?? null
}

export function salvarBancoFormacoes(banco: BancoFormacoesTreinador) {
  localStorage.setItem(CHAVE_FORMACOES_TREINADOR, JSON.stringify(banco))
}
