import type { Grade, FollowUp } from '../types';

export const GRADES: Grade[] = ['A', 'B', 'C', 'D', 'E'];

export const GRADE_COLORS: Record<Grade, string> = {
  A: '#22c55e',
  B: '#84cc16',
  C: '#eab308',
  D: '#f97316',
  E: '#ef4444',
};

export const GRADE_LABELS: Record<Grade, string> = {
  A: 'Excelente',
  B: 'Bom',
  C: 'Razoável',
  D: 'Abaixo da média',
  E: 'Fraco',
};

export const FOLLOW_UP_OPTIONS: FollowUp[] = [
  'Avançar para observação detalhada',
  'Acompanhar mais tarde',
  'Observação insuficiente',
  'Descartar',
];

export const DESCRIPTION_SECTIONS = [
  {
    name: 'physicality' as const,
    label: 'Fisicalidade',
    placeholder: 'Descreva as características físicas do jogador: altura, força, velocidade, agilidade, resistência...',
  },
  {
    name: 'offensively' as const,
    label: 'Ofensivamente',
    placeholder: 'Descreva as capacidades ofensivas: controlo de bola, passe, drible, remate, criação de jogo...',
  },
  {
    name: 'defensively' as const,
    label: 'Defensivamente',
    placeholder: 'Descreva as capacidades defensivas: posicionamento, desarme, interceção, duelos, jogo aéreo...',
  },
  {
    name: 'conclusion' as const,
    label: 'Conclusão',
    placeholder: 'Resumo geral do jogador, pontos fortes, pontos a melhorar, recomendação final...',
  },
];
