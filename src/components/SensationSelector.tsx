import { CORPO_REAGE_OPTIONS } from '../data';
import { Activity } from 'lucide-react';

interface SensationSelectorProps {
  selectedParts: string[];
  onChange: (parts: string[]) => void;
}

export default function SensationSelector({ selectedParts, onChange }: SensationSelectorProps) {
  const togglePart = (id: string) => {
    if (id === 'nada') {
      onChange(['nada']);
    } else {
      const active = selectedParts.filter((p) => p !== 'nada');
      if (active.includes(id)) {
        onChange(active.filter((p) => p !== id));
      } else {
        onChange([...active, id]);
      }
    }
  };

  const isHighlighted = (id: string) => selectedParts.includes(id);

  return (
    <div className="space-y-4" id="somatic-selector">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-500" />
        <span className="font-semibold text-slate-800 text-sm md:text-base">
          6.🫁 Corpo: Seu corpo reage quando você lembra? (Selecione todas que aplicar)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Side: interactive checklist */}
        <div className="md:col-span-7 space-y-2.5">
          {CORPO_REAGE_OPTIONS.map((opt) => {
            const active = isHighlighted(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                id={`somatic-btn-${opt.id}`}
                onClick={() => togglePart(opt.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer min-h-[52px] ${
                  active
                    ? 'bg-red-50 border-red-200 shadow-sm ring-1 ring-red-300'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    active ? 'bg-red-500 border-red-500 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {active && (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                    </svg>
                  )}
                </div>

                <div className="space-y-0.5 animate-fade-in">
                  <span className={`font-medium block text-sm ${active ? 'text-red-900' : 'text-slate-800'}`}>
                    {opt.label}
                  </span>
                  <span className="text-xs text-slate-500 leading-normal block font-normal">
                    {opt.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Interactive schematic SVG body map */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 min-h-[300px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">
            Mapeamento Somático Ativo
          </span>

          <div className="relative w-44 h-80 flex justify-center">
            {/* Ambient Body Outline SVG */}
            <svg
              viewBox="0 0 100 220"
              className="w-full h-full fill-none stroke-slate-300 stroke-[1.5]"
            >
              {/* Head */}
              <circle cx="50" cy="25" r="15" />
              {/* Neck */}
              <path d="M47 40 L47 45 M53 40 L53 45" />
              {/* Torso/Shoulders */}
              <path d="M25 48 C 35 48, 40 45, 50 45 C 60 45, 65 48, 75 48 C 73 90, 71 130, 68 140 L 32 140 C 29 130, 27 90, 25 48 Z" />
              {/* Arms */}
              <path d="M25 48 C 20 65, 17 85, 14 110" />
              <path d="M75 48 C 80 65, 83 85, 86 110" />
              {/* Legs */}
              <path d="M34 140 L 34 210" />
              <path d="M66 140 L 66 210" />

              {/* Garganta aperta (Garganta cy=38) */}
              {isHighlighted('garganta') && (
                <g className="animate-pulse">
                  <circle cx="50" cy="38" r="9" className="fill-red-500/20 stroke-red-500 stroke-[1.5]" />
                  <circle cx="50" cy="38" r="3" className="fill-red-600" />
                </g>
              )}

              {/* Coração acelera (Chest cy=65) */}
              {isHighlighted('coracao_acelera') && (
                <g className="animate-pulse">
                  <circle cx="50" cy="65" r="14" className="fill-red-500/20 stroke-red-500 stroke-[1.5]" />
                  <circle cx="50" cy="65" r="4.5" className="fill-red-600" />
                </g>
              )}

              {/* Dá vontade de chorar (Vias cy=47 or face eyes cy=24) */}
              {isHighlighted('choro') && (
                <g className="animate-pulse">
                  <path d="M45 22 Q50 26 55 22" className="stroke-blue-500 stroke-[1.5] fill-none" />
                  <circle cx="45" cy="24" r="1.5" className="fill-blue-500" />
                  <circle cx="55" cy="24" r="1.5" className="fill-blue-500" />
                </g>
              )}

              {/* Fico nervoso (Tension cy=48 shoulders) */}
              {isHighlighted('nervoso') && (
                <g className="animate-pulse">
                  <circle cx="30" cy="48" r="8" className="fill-orange-500/20 stroke-orange-500 stroke-[1.2]" />
                  <circle cx="70" cy="48" r="8" className="fill-orange-500/20 stroke-orange-500 stroke-[1.2]" />
                  <circle cx="30" cy="48" r="2.5" className="fill-orange-600" />
                  <circle cx="70" cy="48" r="2.5" className="fill-orange-600" />
                </g>
              )}

              {/* Mãos tremem (Hands cy=110) */}
              {isHighlighted('maos_tremem') && (
                <g className="animate-pulse">
                  <circle cx="14" cy="110" r="7" className="fill-blue-400/25 stroke-blue-400 stroke-[1]" />
                  <circle cx="86" cy="110" r="7" className="fill-blue-400/25 stroke-blue-400 stroke-[1]" />
                  <circle cx="14" cy="110" r="2" className="fill-blue-600" />
                  <circle cx="86" cy="110" r="2" className="fill-blue-600" />
                </g>
              )}
            </svg>

            {/* Glowing floating status label */}
            {selectedParts.filter((p) => p !== 'nada').length > 0 && (
              <div className="absolute bottom-1 bg-red-100 text-red-800 text-[10px] font-bold py-0.5 px-2 rounded-full border border-red-200">
                {selectedParts.filter((p) => p !== 'nada').length} {selectedParts.filter((p) => p !== 'nada').length === 1 ? 'sinal somático' : 'sinais somáticos'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

