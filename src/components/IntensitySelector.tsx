import { IntensityLevel } from '../types';
import { COLOR_MAP } from '../data';
import { AlertCircle, Flame, Heart, Scale, ShieldAlert, Sparkles } from 'lucide-react';

interface IntensitySelectorProps {
  label: string;
  value: IntensityLevel | '';
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
          
          // Clearly demarcated styling when selected
          const selectClasses = isSelected
            ? opt === 'Alta'
              ? 'border-red-500 text-red-800 bg-red-50/70 ring-4 ring-red-500/15 shadow-sm scale-[1.02]'
              : opt === 'Média'
              ? 'border-amber-500 text-amber-800 bg-amber-50/70 ring-4 ring-amber-500/15 shadow-sm scale-[1.02]'
              : opt === 'Baixa'
              ? 'border-blue-600 text-blue-800 bg-blue-50/70 ring-4 ring-blue-600/15 shadow-sm scale-[1.02]'
              : 'border-slate-500 text-slate-800 bg-slate-100/70 ring-4 ring-slate-500/15 shadow-sm scale-[1.02]'
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300';

          return (
            <button
              key={opt}
              type="button"
              id={`opt-${iconType}-${opt.toLowerCase().replace(' ', '-')}`}
              onClick={() => onChange(opt)}
              className={`
                px-3.5 py-4 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer text-sm
                flex flex-col items-center justify-between gap-3 min-h-[105px] relative
                ${selectClasses}
              `}
            >
              {/* Distinct visual selection badge indicator */}
              <div className="absolute top-2 right-2">
                <div className={`w-4 h-4 rounded-full border-1.5 flex items-center justify-center transition-all duration-150 ${
                  isSelected 
                    ? opt === 'Alta' ? 'bg-red-500 border-red-500 text-white'
                      : opt === 'Média' ? 'bg-amber-500 border-amber-500 text-white'
                      : opt === 'Baixa' ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-600 border-slate-600 text-white'
                    : 'border-slate-300 bg-slate-50/50'
                }`}>
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-white stroke-2 fill-none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-1 w-full pt-1.5">
                <span className="font-bold text-xs sm:text-sm tracking-wide">{opt}</span>
                {explanation && (
                  <span className={`text-[10px] leading-snug font-normal max-w-[125px] ${isSelected ? 'text-slate-700' : 'text-slate-400'}`}>
                    {explanation}
                  </span>
                )}
              </div>
              <div className="w-12 h-1.5 rounded-full overflow-hidden bg-slate-100 flex items-center shrink-0 mt-auto">
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
