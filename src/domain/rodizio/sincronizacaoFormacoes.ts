import { supabase } from '../../lib/supabase'
import {
  CHAVE_NOTAS_TREINADOR,
  carregarBancoFormacoes,
  salvarBancoFormacoes,
  type BancoFormacoesTreinador,
} from './formacoesTreinador'

export interface DadosTreinador {
  banco: BancoFormacoesTreinador
  notas: Record<string, string>
}

function carregarNotasLocais(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_NOTAS_TREINADOR) ?? '{}') as Record<string, string>
  } catch {
    return {}
  }
}

export function carregarDadosLocais(): DadosTreinador {
  return { banco: carregarBancoFormacoes(), notas: carregarNotasLocais() }
}

export function salvarDadosLocais(dados: DadosTreinador) {
  salvarBancoFormacoes(dados.banco)
  localStorage.setItem(CHAVE_NOTAS_TREINADOR, JSON.stringify(dados.notas))
}

export async function baixarDadosTreinador(userId: string): Promise<DadosTreinador | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('formacoes_treinador')
    .select('dados')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const dados = data.dados as Partial<DadosTreinador>
  return { banco: dados.banco ?? {}, notas: dados.notas ?? {} }
}

export async function enviarDadosTreinador(userId: string, dados: DadosTreinador) {
  if (!supabase) return

  const { error } = await supabase
    .from('formacoes_treinador')
    .upsert({ user_id: userId, dados, updated_at: new Date().toISOString() })

  if (error) throw error
}
