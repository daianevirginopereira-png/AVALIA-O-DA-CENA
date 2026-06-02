import { PresetEmotion, IntensityLevel } from './types';

export const DEFAULT_WHATSAPP_NUMBER = '5564992726558';

export const PRESET_EMOTIONS: PresetEmotion[] = [
  { label: 'Tristeza', category: 'negative', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { label: 'Raiva', category: 'negative', color: 'bg-red-100 text-red-800 border-red-200' },
  { label: 'Mágoa', category: 'negative', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { label: 'Impotência', category: 'negative', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { label: 'Frustração', category: 'negative', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { label: 'Medo', category: 'negative', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  { label: 'Alívio', category: 'positive', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { label: 'Aceitação', category: 'positive', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  { label: 'Paz / Calma', category: 'positive', color: 'bg-green-100 text-green-800 border-green-200' },
  { label: 'Compreensão', category: 'positive', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { label: 'Indiferença', category: 'neutral', color: 'bg-slate-100 text-slate-800 border-slate-200' },
  { label: 'Nostalgia', category: 'neutral', color: 'bg-zinc-100 text-zinc-800 border-zinc-200' },
];

export const CORACAO_OPTIONS = [
  { id: 'Raiva', label: '😡 Raiva' },
  { id: 'Mágoa', label: '😢 Mágoa' },
  { id: 'Injustiça', label: '⚖️ Injustiça' },
  { id: 'Rejeição', label: '💔 Rejeição' },
  { id: 'Tristeza', label: '💧 Tristeza' },
  { id: 'Nada disso', label: '🕊️ Nada disso' }
];

export const CORPO_REAGE_OPTIONS = [
  { id: 'garganta', label: 'Garganta aperta', description: 'Sensação de nó ou sufocamento de palavras', key: 'garganta' },
  { id: 'coracao_acelera', label: 'Coração acelera', description: 'Palpitação física de ansiedade ou fuga', key: 'peito' },
  { id: 'choro', label: 'Dá vontade de chorar', description: 'Emoção subindo e pedindo liberação', key: 'respiracao' },
  { id: 'nervoso', label: 'Fico nervoso', description: 'Tensão muscular geral ou irritação ativa', key: 'ombros' },
  { id: 'maos_tremem', label: 'Mãos tremem', description: 'Sinal somático de vulnerabilidade desperta', key: 'frio' },
  { id: 'nada', label: 'Não sinto nada', description: 'Sintomas somáticos neutros ou sob controle', key: 'nada' }
];

export const INTENSITY_MAP: Record<IntensityLevel, number> = {
  'Alta': 100,
  'Média': 60,
  'Baixa': 30,
  'Nenhuma': 0,
};

export const COLOR_MAP: Record<IntensityLevel, { bg: string; text: string; fill: string; border: string }> = {
  'Alta': {
    bg: 'bg-red-50 hover:bg-red-100',
    text: 'text-red-700 font-semibold',
    fill: '#ef4444',
    border: 'border-red-300'
  },
  'Média': {
    bg: 'bg-amber-50 hover:bg-amber-100',
    text: 'text-amber-700 font-semibold',
    fill: '#f59e0b',
    border: 'border-amber-300'
  },
  'Baixa': {
    bg: 'bg-blue-50 hover:bg-blue-100',
    text: 'text-blue-700 font-semibold',
    fill: '#3b82f6',
    border: 'border-blue-300'
  },
  'Nenhuma': {
    bg: 'bg-slate-50 hover:bg-slate-100',
    text: 'text-slate-600 font-semibold',
    fill: '#64748b',
    border: 'border-slate-200'
  },
};

