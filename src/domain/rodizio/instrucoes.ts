/** Instruções táticas por rodízio e posição — conteúdo do Bottom Sheet
 * 
 * Baseado no sistema 5x1 com recepção de 3 passadores (2 ponteiros + líbero)
 * Foco: onde ficar na recepção, para onde correr após o saque, erros comuns de overlap
 */

import type { FuncaoJogador, Rodizio } from './tipos'

export interface InstrucaoPosicao {
  /** Título exibido no header do bottom sheet */
  titulo: string
  /** Onde se posicionar na recepção de saque */
  ondeFicar: string
  /** Para onde correr/mover após o saque (transição) */
  paraOndeCorrer: string
  /** Erro comum específico desta posição neste rodízio */
  erroComum: string
  /** Dica extra contextual */
  dica?: string
}

/** Mapa de instruções: [rodízio][funcao] = instrução */
export const INSTRUCOES_POR_RODIZIO: Record<Rodizio, Record<FuncaoJogador, InstrucaoPosicao>> = {
  1: {
    L: {
      titulo: 'Levantador (L)',
      ondeFicar: 'Posição 1 (fundo direito). Alinhe-se entre o ponteiro 1 (P2) e o líbero (P5), sem invadir a zona do ponteiro.',
      paraOndeCorrer: 'Após o saque, infiltre rapidamente pela diagonal curta para a zona de levantamento (entre P2 e P3). Passe por trás do ponteiro 1.',
      erroComum: 'Entrar na quadra antes do toque do saque (falta de posição) ou infiltrar tarde, forçando levantamento de costas.',
      dica: 'O oposto está na frente (P4) e NÃO passa. Você é o único que infiltra do fundo.',
    },
    O: {
      titulo: 'Oposto (O)',
      ondeFicar: 'Posição 4 (frente esquerda). Fica fora da recepção — posicione-se na rede para bloqueio/ataque.',
      paraOndeCorrer: 'Prepare para bloqueio na entrada de rede ou transição para ataque pela esquerda (pipe se necessário).',
      erroComum: 'Invadir a zona de recepção do líbero/ponteiros ou chegar atrasado no fechamento de bloqueio.',
      dica: 'Você não passa neste rodízio. Foque no bloqueio e ataque.',
    },
    P1: {
      titulo: 'Ponteiro 1 (P1)',
      ondeFicar: 'Posição 2 (frente direita). Recepção principal na saída de rede. Pés abertos, peso à frente.',
      paraOndeCorrer: 'Após o passe, transição imediata para ataque na saída de rede (P2) ou approach para pipe.',
      erroComum: 'Overlap com o líbero (P5) — seu pé não pode estar mais à esquerda que o pé do líbero.',
      dica: 'Você é o passe prioritário #1. Passe alto e na antena para o levantador infiltrar tranquilo.',
    },
    P2: {
      titulo: 'Ponteiro 2 (P2)',
      ondeFicar: 'Posição 6 (fundo centro). Segunda opção de passe, cubra o meio da quadra.',
      paraOndeCorrer: 'Transição para ataque pelo meio (pipe) ou saída de rede se o passe for seu.',
      erroComum: 'Overlap com o levantador (P1) — você não pode estar mais à direita que o L na recepção.',
      dica: 'Comunique "meu" ou "seu" cedo. O líbero cobre a esquerda, você o meio.',
    },
    C1: {
      titulo: 'Central 1 (C1)',
      ondeFicar: 'Posição 3 (frente centro). Na rede para bloqueio. Não participa da recepção.',
      paraOndeCorrer: 'Bloqueio central + fechamento nas pontas. Ataque de primeira tempo (rápido) se a bola vier.',
      erroComum: 'Toque na rede no bloqueio ou atraso no fechamento lateral.',
      dica: 'Leia o levantador adversário. Feche com as mãos, não com o corpo.',
    },
    C2: {
      titulo: 'Central 2 (C2)',
      ondeFicar: 'Posição 5 (fundo esquerdo). SUBSTITUÍDO PELO LÍBERO na recepção. Sai de quadra.',
      paraOndeCorrer: 'Aguarde na zona de substituição. Entra no lugar do líbero na rotação seguinte.',
      erroComum: 'Esquecer de sair para o líbero entrar (troca irregular).',
      dica: 'Troca livre: você sai, líbero entra. Sem pedido de tempo.',
    },
    LIB: {
      titulo: 'Líbero (LIB)',
      ondeFicar: 'Posição 5 (fundo esquerdo). Substitui o C2. Recepção de terceira opção, cobertura de fundo.',
      paraOndeCorrer: 'Passe perfeito para o levantador. Segunda bola se o L não chegar. Cobertura de defesa.',
      erroComum: 'Passe muito alto/baixo, ou atacar bola acima da rede (proibido para líbero).',
      dica: 'Você é a segurança. Passe na "mão" do levantador (zona 3).',
    },
  },
  2: {
    L: {
      titulo: 'Levantador (L)',
      ondeFicar: 'Posição 6 (fundo centro). Entre o ponteiro 1 (P1) e o ponteiro 2 (P5).',
      paraOndeCorrer: 'Infiltre em linha reta curta para a zona de levantamento (P3). Caminho mais direto que no R1.',
      erroComum: 'Overlap com P1 (à sua direita) ou P2 (à sua esquerda) na recepção. Mantenha espaço.',
      dica: 'Rota mais curta. Saia no tempo do saque, não antes.',
    },
    O: {
      titulo: 'Oposto (O)',
      ondeFicar: 'Posição 3 (frente centro). Na rede, fora da recepção.',
      paraOndeCorrer: 'Bloqueio central + ataque de primeira tempo ou saída de rede.',
      erroComum: 'Invadir zona do central no bloqueio ou tocar na rede.',
      dica: 'Você está no meio da rede. Leia o jogo dos dois lados.',
    },
    P1: {
      titulo: 'Ponteiro 1 (P1)',
      ondeFicar: 'Posição 1 (fundo direita). Passe principal na diagonal longa.',
      paraOndeCorrer: 'Transição para saída de rede (P2) ou pipe.',
      erroComum: 'Overlap com o líbero (P4) — seu pé esquerdo não passa do pé direito do líbero.',
      dica: 'Passe cruzado para zona 3. O levantador vem do centro.',
    },
    P2: {
      titulo: 'Ponteiro 2 (P2)',
      ondeFicar: 'Posição 5 (fundo esquerda). Terceira opção de passe, cobre linha.',
      paraOndeCorrer: 'Ataque pipe (meio) ou entrada de rede.',
      erroComum: 'Overlap com o líbero (P4) à sua direita.',
      dica: 'Fundo esquerda é zona de linha. Passe reto para zona 3.',
    },
    C1: {
      titulo: 'Central 1 (C1)',
      ondeFicar: 'Posição 2 (frente direita). Bloqueio na saída de rede.',
      paraOndeCorrer: 'Fechamento no meio + ataque rápido.',
      erroComum: 'Atraso no fechamento de bloqueio na ponta.',
      dica: 'Olhe o levantador adversário: se joga na saída, feche rápido.',
    },
    C2: {
      titulo: 'Central 2 (C2)',
      ondeFicar: 'Posição 4 (frente esquerda). SUBSTITUÍDO PELO LÍBERO na recepção.',
      paraOndeCorrer: 'Aguarde substituição. Entra no lugar do líbero na próxima rotação.',
      erroComum: 'Troca irregular com líbero.',
      dica: 'Troca livre na zona de substituição.',
    },
    LIB: {
      titulo: 'Líbero (LIB)',
      ondeFicar: 'Posição 4 (frente esquerda). Substitui C2. Recepção de segunda opção.',
      paraOndeCorrer: 'Passe para zona 3. Cobertura de defesa e segunda bola.',
      erroComum: 'Passe curto demais (rede) ou invasão de zona de ataque.',
      dica: 'Frente esquerda recebe saques cruzados. Ajuste ângulo da plataforma.',
    },
  },
  3: {
    L: {
      titulo: 'Levantador (L)',
      ondeFicar: 'Posição 5 (fundo esquerda). Entre o líbero (P3) e o ponteiro 2 (P4).',
      paraOndeCorrer: 'Infiltre pela diagonal longa até zona de levantamento. Caminho mais longo — saia cedo.',
      erroComum: 'Overlap com líbero (P3) à direita. Infiltrar tarde = levantamento de costas.',
      dica: 'R3 tem a infiltração mais longa. Antecipe o saque.',
    },
    O: {
      titulo: 'Oposto (O)',
      ondeFicar: 'Posição 2 (frente direita). Na rede, saída de rede. Não passa.',
      paraOndeCorrer: 'Bloqueio na saída + ataque forte. Transição rápida.',
      erroComum: 'Chegar atrasado no bloqueio ou tocar na rede.',
      dica: 'Você é a opção de ataque principal na frente.',
    },
    P1: {
      titulo: 'Ponteiro 1 (P1)',
      ondeFicar: 'Posição 6 (fundo centro). Passe principal no meio.',
      paraOndeCorrer: 'Pipe (ataque pelo meio) ou saída de rede.',
      erroComum: 'Overlap com levantador (P5) à sua esquerda.',
      dica: 'Centro da quadra. Passe alto para dar tempo ao L infiltrar.',
    },
    P2: {
      titulo: 'Ponteiro 2 (P2)',
      ondeFicar: 'Posição 4 (frente esquerda). Segunda opção de passe na entrada de rede.',
      paraOndeCorrer: 'Ataque pela entrada de rede ou pipe.',
      erroComum: 'Overlap com líbero (P3) à sua direita (no fundo).',
      dica: 'Frente esquerda passa pouco. Foque no ataque.',
    },
    C1: {
      titulo: 'Central 1 (C1)',
      ondeFicar: 'Posição 1 (fundo direita). SUBSTITUÍDO PELO LÍBERO na recepção.',
      paraOndeCorrer: 'Aguarde substituição pelo líbero.',
      erroComum: 'Não sair para o líbero entrar.',
      dica: 'Troca livre. Você roda para frente na próxima.',
    },
    C2: {
      titulo: 'Central 2 (C2)',
      ondeFicar: 'Posição 3 (frente centro). Bloqueio central.',
      paraOndeCorrer: 'Bloqueio + ataque de primeira tempo. Fechamento nas pontas.',
      erroComum: 'Toque na rede ou atraso no fechamento.',
      dica: 'Centro da rede. Leia ambos os lados.',
    },
    LIB: {
      titulo: 'Líbero (LIB)',
      ondeFicar: 'Posição 3 (frente centro). Substitui C1. Recepção de primeira opção no meio.',
      paraOndeCorrer: 'Passe perfeito para zona 3. Cobertura total de fundo.',
      erroComum: 'Passe na rede ou atacar bola acima da rede.',
      dica: 'Você passa no meio. Plataforma estável, direção zona 3.',
    },
  },
  4: {
    L: {
      titulo: 'Levantador (L)',
      ondeFicar: 'Posição 4 (frente esquerda). JÁ ESTÁ NA ZONA DE LEVANTAMENTO. Não infiltra.',
      paraOndeCorrer: 'Posicione-se entre P2 e P3 para receber o passe. Comande a recepção.',
      erroComum: 'Sair da zona de levantamento antes do passe (falta de posição).',
      dica: 'R4, R5, R6: você NÃO infiltra. O oposto passa no seu lugar.',
    },
    O: {
      titulo: 'Oposto (O)',
      ondeFicar: 'Posição 1 (fundo direita). PASSA NO LUGAR DO LEVANTADOR. Recepção de terceira opção.',
      paraOndeCorrer: 'Após o passe, transição para ataque na saída de rede (P2) ou fundo.',
      erroComum: 'Overlap com ponteiro 1 (P2) à sua esquerda na recepção.',
      dica: 'Você vira passador neste rodízio. Passe alto para zona 3.',
    },
    P1: {
      titulo: 'Ponteiro 1 (P1)',
      ondeFicar: 'Posição 5 (fundo esquerda). Passe principal na diagonal.',
      paraOndeCorrer: 'Transição para ataque pipe ou entrada de rede.',
      erroComum: 'Overlap com líbero (P2) à sua direita.',
      dica: 'Fundo esquerda. Passe cruzado para zona 3.',
    },
    P2: {
      titulo: 'Ponteiro 2 (P2)',
      ondeFicar: 'Posição 2 (frente direita). PASSA (substitui C2). Recepção na saída de rede.',
      paraOndeCorrer: 'Após passe, ataque na saída de rede (sua posição natural).',
      erroComum: 'Overlap com oposto (P1) no fundo ou com central no bloqueio.',
      dica: 'Você passa na frente. Plataforma baixa, passe na antena.',
    },
    C1: {
      titulo: 'Central 1 (C1)',
      ondeFicar: 'Posição 6 (fundo centro). SUBSTITUÍDO PELO LÍBERO.',
      paraOndeCorrer: 'Aguarde substituição.',
      erroComum: 'Troca irregular com líbero.',
      dica: 'Troca livre.',
    },
    C2: {
      titulo: 'Central 2 (C2)',
      ondeFicar: 'Posição 2 (frente direita). SUBSTITUÍDO PELO LÍBERO (P2 passa no lugar).',
      paraOndeCorrer: 'Aguarde. Entra no lugar do líbero na rotação seguinte.',
      erroComum: 'Confusão na troca: P2 passa, você sai, líbero entra.',
      dica: 'R4: P2 passa, C2 sai, LIB entra. Três movimentos.',
    },
    LIB: {
      titulo: 'Líbero (LIB)',
      ondeFicar: 'Posição 2 (frente direita). Substitui C2. Recepção na saída de rede.',
      paraOndeCorrer: 'Passe para zona 3. Segunda bola se necessário.',
      erroComum: 'Passe curto ou invasão de ataque (não pode atacar acima da rede).',
      dica: 'Frente direita recebe saques fortes. Amorteça com a plataforma.',
    },
  },
  5: {
    L: {
      titulo: 'Levantador (L)',
      ondeFicar: 'Posição 3 (frente centro — ZONA DE LEVANTAMENTO). Não infiltra.',
      paraOndeCorrer: 'Já na posição ideal. Ajuste fino para receber passe perfeito.',
      erroComum: 'Mover-se antes do passe (falta de posição). Fique parado até o toque.',
      dica: 'R5: você está no "trono". Comande a recepção de braços cruzados.',
    },
    O: {
      titulo: 'Oposto (O)',
      ondeFicar: 'Posição 6 (fundo centro). PASSA NO LUGAR DO LEVANTADOR. Segunda opção de passe.',
      paraOndeCorrer: 'Após passe, transição para ataque no fundo ou pipe.',
      erroComum: 'Overlap com ponteiro 1 (P4) à esquerda ou líbero (P1) à direita.',
      dica: 'Centro do fundo. Passe alto para zona 3 (onde você já está).',
    },
    P1: {
      titulo: 'Ponteiro 1 (P1)',
      ondeFicar: 'Posição 4 (frente esquerda). Passe principal na entrada de rede.',
      paraOndeCorrer: 'Ataque pela entrada de rede ou pipe.',
      erroComum: 'Overlap com líbero (P1) no fundo à sua direita.',
      dica: 'Frente esquerda. Passe reto para zona 3.',
    },
    P2: {
      titulo: 'Ponteiro 2 (P2)',
      ondeFicar: 'Posição 2 (frente direita). Bloqueio/ataque na saída. Não passa.',
      paraOndeCorrer: 'Bloqueio na saída + ataque forte.',
      erroComum: 'Atraso no bloqueio ou toque na rede.',
      dica: 'Você está na frente. Foque no terminal.',
    },
    C1: {
      titulo: 'Central 1 (C1)',
      ondeFicar: 'Posição 5 (fundo esquerda). SUBSTITUÍDO PELO LÍBERO.',
      paraOndeCorrer: 'Aguarde substituição.',
      erroComum: 'Troca irregular.',
      dica: 'Troca livre.',
    },
    C2: {
      titulo: 'Central 2 (C2)',
      ondeFicar: 'Posição 1 (fundo direita). SUBSTITUÍDO PELO LÍBERO.',
      paraOndeCorrer: 'Aguarde. Entra no lugar do líbero na próxima.',
      erroComum: 'Troca irregular.',
      dica: 'Troca livre.',
    },
    LIB: {
      titulo: 'Líbero (LIB)',
      ondeFicar: 'Posição 1 (fundo direita). Substitui C2. Recepção de primeira opção na diagonal.',
      paraOndeCorrer: 'Passe perfeito para zona 3. Cobertura de fundo.',
      erroComum: 'Passe na rede ou atacar acima da rede.',
      dica: 'Diagonal longa. Plataforma aberta, direção zona 3.',
    },
  },
  6: {
    L: {
      titulo: 'Levantador (L)',
      ondeFicar: 'Posição 2 (frente direita — saída de rede). Não infiltra. Já na frente.',
      paraOndeCorrer: 'Posicione-se para levantamento (entre P2-P3). Comande do meio.',
      erroComum: 'Sair da zona antes do passe ou invadir zona do ponteiro.',
      dica: 'R6: você está na saída de rede. Vira opção de ataque também.',
    },
    O: {
      titulo: 'Oposto (O)',
      ondeFicar: 'Posição 5 (fundo esquerda). PASSA NO LUGAR DO LEVANTADOR. Terceira opção.',
      paraOndeCorrer: 'Após passe, transição para ataque no fundo ou entrada de rede.',
      erroComum: 'Overlap com ponteiro 1 (P3) à direita ou líbero (P6) ao centro.',
      dica: 'Fundo esquerda. Passe cruzado alto para zona 3.',
    },
    P1: {
      titulo: 'Ponteiro 1 (P1)',
      ondeFicar: 'Posição 3 (frente centro). Passe principal NO MEIO. Prioridade #1.',
      paraOndeCorrer: 'Pipe (ataque pelo meio) após o passe.',
      erroComum: 'Overlap com oposto (P5) no fundo à sua esquerda.',
      dica: 'Você passa no centro. Passe na "mão" do levantador.',
    },
    P2: {
      titulo: 'Ponteiro 2 (P2)',
      ondeFicar: 'Posição 1 (fundo direita). Segunda opção de passe na diagonal.',
      paraOndeCorrer: 'Transição para saída de rede ou pipe.',
      erroComum: 'Overlap com líbero (P6) ao centro.',
      dica: 'Diagonal. Passe alto para dar tempo.',
    },
    C1: {
      titulo: 'Central 1 (C1)',
      ondeFicar: 'Posição 4 (frente esquerda). Bloqueio na entrada.',
      paraOndeCorrer: 'Fechamento no meio + ataque rápido.',
      erroComum: 'Atraso no fechamento ou toque na rede.',
      dica: 'Entrada de rede. Leia o levantador adversário.',
    },
    C2: {
      titulo: 'Central 2 (C2)',
      ondeFicar: 'Posição 6 (fundo centro). SUBSTITUÍDO PELO LÍBERO.',
      paraOndeCorrer: 'Aguarde substituição.',
      erroComum: 'Troca irregular com líbero.',
      dica: 'Troca livre.',
    },
    LIB: {
      titulo: 'Líbero (LIB)',
      ondeFicar: 'Posição 6 (fundo centro). Substitui C2. Recepção no meio do fundo.',
      paraOndeCorrer: 'Passe para zona 3. Segunda bola e cobertura total.',
      erroComum: 'Passe curto ou invasão de ataque.',
      dica: 'Centro do fundo. Visão total da quadra. Comunique "meu/seu".',
    },
  },
}

/** Busca instrução para um rodízio e posição específica */
export function getInstrucao(rodizio: Rodizio, funcao: FuncaoJogador): InstrucaoPosicao {
  return INSTRUCOES_POR_RODIZIO[rodizio]?.[funcao] || {
    titulo: `${funcao} — R${rodizio}`,
    ondeFicar: 'Posição base conforme rodízio.',
    paraOndeCorrer: 'Transição padrão da função.',
    erroComum: 'Overlap ou falta de posição.',
    dica: 'Consulte o técnico para detalhes.',
  }
}