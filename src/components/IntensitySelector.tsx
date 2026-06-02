import { IntensityLevel } from '../types';
import { COLOR_MAP } from '../data';
import { AlertCircle, Flame, Heart, Scale, ShieldAlert, Sparkles } from 'lucide-react';

interface IntensitySelectorProps {
  label: string;
  value: IntensityLevel;
  onChange: (val: IntensityLevel) => void;
  options: IntensityLevel[];
  iconType: 'cena' | 'corpo' | 'injustica' | 'raiva' | 'magoa';
}

const getExplanation = (type: string, option: IntensityLevel): string => {
  if (type === 'cena') {
    switch (option) {
      case 'Alta': return 'Mexer muito, como se fosse ontem';
      case 'Média': return 'Ainda incomoda, mas menos';
      case 'Baixa': return 'Quase não afeta mais';
      case 'Nenhuma': return 'Consigo lembrar sem sofrimento';
    }
  }
  if (type === 'raiva') {
    switch (option) {
      case 'Alta': return 'Sentimento de indignação ativo';
      case 'Média': return 'Irritação moderada se focar';
      case 'Baixa': return 'Leve descontentamento';
      case 'Nenhuma': return 'Totalmente dissolvida';
    }
  }
  if (type === 'magoa') {
    switch (option) {
      case 'Alta': return 'Tristeza profunda no peito';
      case 'Média': return 'Fica chateado se focar';
      case 'Baixa': return 'Leve sensibilidade apenas';
      case 'Nenhuma': return 'Coração leve e em paz';
    }
  }
  return '';
};

export default function IntensitySelector({
  label,
  value,
  onChange,
  options,
  iconType,
}: IntensitySelectorProps) {
  const getIcon = () => {
    switch (iconType) {
      case 'cena':
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
      case 'corpo':
        return <Flame className="w-5 h-5 text-red-500" />;
      case 'injustica':
        return <Scale className="w-5 h-5 text-violet-500" />;
      case 'raiva':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'magoa':
        return <Heart className="w-5 h-5 text-orange-500" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-3" id={`selector-${iconType}`}>
      <div className="flex items-center gap-2">
        {getIcon()}
        <span className="font-medium text-slate-800 text-sm md:text-base leading-relaxed">
          {label}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {options.map((opt) => {
          const isSelected = value === opt;
          const colors = COLOR_MAP[opt];
          const explanation = getExplanation(iconType, opt);
          return (
            <button
              key={opt}
              type="button"
              id={`opt-${iconType}-${opt.toLowerCase().replace(' ', '-')}`}
              onClick={() => onChange(opt)}
              className={`
                px-2.5 py-4 rounded-xl border text-center transition-all duration-200 cursor-pointer text-sm
                flex flex-col items-center justify-between gap-2 min-h-[95px] relative
                ${isSelected 
                  ? `${colors.bg} ${colors.text} border-current ring-2 ring-offset-1 ring-indigo-300 shadow-sm transform scale-[1.02]` 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }
              `}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-xs sm:text-sm">{opt}</span>
                {explanation && (
                  <span className={`text-[10px] leading-tight font-normal max-w-[125px] ${isSelected ? 'text-current opacity-90' : 'text-slate-400'}`}>
                    {explanation}
                  </span>
                )}
              </div>
              <div className="w-10 h-1.5 rounded-full overflow-hidden bg-slate-100 flex items-center shrink-0 mt-auto">
                <div 
                  className="h-full rounded-full transition-all duration-300" 
                  style={{ 
                    width: opt === 'Alta' ? '100%' : opt === 'Média' ? '60%' : opt === 'Baixa' ? '30%' : '0%',
                    backgroundColor: colors.fill
                  }} 
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
