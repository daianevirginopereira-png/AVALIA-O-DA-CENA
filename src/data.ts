import { PresetEmotion, IntensityLevel } from './types';

export const DEFAULT_WHATSAPP_NUMBER = '5564992726558';

export const PRESET_EMOTIONS: PresetEmotion[] = [
  { label: 'Medo', category: 'negative', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  { label: 'Raiva', category: 'negative', color: 'bg-rose-200 text-rose-900 border-rose-300' },
  { label: 'Tristeza', category: 'negative', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { label: 'Injustiça', category: 'negative', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { label: 'Mágoa', category: 'negative', color: 'bg-rose-50 text-rose-700 border-rose-150' },
  { label: 'Impotência', category: 'negative', color: 'bg-slate-200 text-slate-800 border-slate-300' },
  { label: 'Desamparo', category: 'negative', color: 'bg-slate-50 text-slate-600 border-slate-200' },
  { label: 'Humilhação', category: 'negative', color: 'bg-rose-100/60 text-rose-850 border-rose-200' },
];

export const CORPO_REAGE_OPTIONS = [
  { id: 'garganta', label: 'Garganta aperta', description: 'Sensação física de asfixia ou palavras travadas' },
  { id: 'coracao_acelera', label: 'Coração acelera', description: 'Taquicardia ou disparada repentina de pavor' },
  { id: 'choro', label: 'Dá vontade de chorar', description: 'Choro reprimido que sobe sob pressão' },
  { id: 'nervoso', label: 'Fico nervoso / Tenso', description: 'Rigidez nos ombros ou tremores musculares' },
  { id: 'estomago', label: 'Estômago embrulha', description: 'Sensação de estômago fechado, nó ou vazio' },
  { id: 'frio_corpo', label: 'Frio repentino / Arrepio', description: 'Pele se arrepiando ao recordar o perigo físico' },
  { id: 'nada', label: 'Não sinto nada no corpo', description: 'Reações fisiológicas ausentes ou neutras hoje' }
];

export const MAIS_DOEU_OPTIONS = [
  'O enforcamento?',
  'Não ser ouvido?',
  'Ser acusado?',
  'O medo?',
  'Outra coisa?'
];

export const INTENSITY_MAP: Record<IntensityLevel, number> = {
  'Alta': 100,
  'Média': 60,
  'Baixa': 30,
  'Nenhuma': 0,
};

export const COLOR_MAP: Record<IntensityLevel, { bg: string; text: string; fill: string; border: string }> = {
  'Alta': {
    bg: 'bg-rose-100 hover:bg-rose-200',
    text: 'text-rose-800 font-semibold',
    fill: '#C29080', // Premium dusty rose gold
    border: 'border-rose-300'
  },
  'Média': {
    bg: 'bg-amber-100 hover:bg-amber-200',
    text: 'text-amber-800 font-semibold',
    fill: '#DDC896', // Warm sandy gold
    border: 'border-amber-300'
  },
  'Baixa': {
    bg: 'bg-slate-100 hover:bg-slate-200',
    text: 'text-slate-800 font-semibold',
    fill: '#AE9484', // Earthy warm slate
    border: 'border-slate-300'
  },
  'Nenhuma': {
    bg: 'bg-slate-50 hover:bg-slate-100',
    text: 'text-slate-600 font-semibold',
    fill: '#CAB3A4', // Very light cocoa
    border: 'border-slate-200'
  },
};
