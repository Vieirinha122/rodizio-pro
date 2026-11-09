import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const chaveAnonima = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigurado = Boolean(url && chaveAnonima)

export const supabase = supabaseConfigurado
  ? createClient(url!, chaveAnonima!)
  : null
