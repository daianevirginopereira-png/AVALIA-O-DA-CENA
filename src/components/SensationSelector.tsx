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
    <div className="space-y-4 font-sans" id="somatic-selector">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5 text-rose-500" />
        <span className="font-semibold text-slate-800 text-sm md:text-base">
          3. 🫁 Onde você sente isso no corpo? (Mapeamento de Reações Somáticas)
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
                className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer min-h-[52px] ${
                  active
                    ? 'bg-rose-50 border-rose-500 shadow-sm ring-4 ring-rose-500/10'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    active ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {active && (
                    <svg className="w-3.5 h-3.5 text-white stroke-[3] fill-none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>

                <div className="space-y-0.5">
                  <span className={`font-bold block text-xs sm:text-sm ${active ? 'text-rose-950' : 'text-slate-800'}`}>
                    {opt.label}
                  </span>
                  <span className="text-xs text-slate-400 leading-normal block font-normal">
                    {opt.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Interactive schematic SVG body map */}
        <div className="md:col-span-12 lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/65 min-h-[300px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">
            Esquema Somático Interativo
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
              <path d="M25 48 C 35 48, 40 45, 50 45 C 60 45, 65 48, 75 48 C 73 90, 71 130, 68 140 L 32 140 C 29 130, 27 90, 25 48 Z" stroke={selectedParts.includes('frio_corpo') ? 'var(--color-rose-400)' : 'var(--color-slate-300)'} className="transition-all duration-300" />
              {/* Arms */}
              <path d="M25 48 C 20 65, 17 85, 14 110" />
              <path d="M75 48 C 80 65, 83 85, 86 110" />
              {/* Legs */}
              <path d="M34 140 L 34 210" />
              <path d="M66 140 L 66 210" />

              {/* Garganta aperta (Garganta cy=38) */}
              {isHighlighted('garganta') && (
                <g className="animate-pulse">
                  <circle cx="50" cy="38" r="9" className="fill-rose-500/20 stroke-rose-500 stroke-[1.5]" />
                  <circle cx="50" cy="38" r="3" className="fill-rose-600" />
                </g>
              )}

              {/* Coração acelera (Chest cy=65) */}
              {isHighlighted('coracao_acelera') && (
                <g className="animate-pulse">
                  <circle cx="50" cy="65" r="14" className="fill-rose-500/20 stroke-rose-500 stroke-[1.5]" />
                  <circle cx="50" cy="65" r="4.5" className="fill-rose-600" />
                </g>
              )}

              {/* Dá vontade de chorar (Vias cy=47 or face eyes cy=24) */}
              {isHighlighted('choro') && (
                <g className="animate-pulse">
                  <path d="M45 22 Q50 26 55 22" className="stroke-rose-450 stroke-[1.5] fill-none" />
                  <circle cx="45" cy="24" r="1.5" className="fill-rose-500" />
                  <circle cx="55" cy="24" r="1.5" className="fill-rose-500" />
                </g>
              )}

              {/* Fico nervoso (Tension cy=48 shoulders) */}
              {isHighlighted('nervoso') && (
                <g className="animate-pulse">
                  <circle cx="30" cy="48" r="8" className="fill-amber-500/20 stroke-amber-500 stroke-[1.2]" />
                  <circle cx="70" cy="48" r="8" className="fill-amber-500/20 stroke-amber-500 stroke-[1.2]" />
                  <circle cx="30" cy="48" r="2.5" className="fill-amber-600" />
                  <circle cx="70" cy="48" r="2.5" className="fill-amber-600" />
                </g>
              )}

              {/* Estômago embrulha (Stomach cy=95) */}
              {isHighlighted('estomago') && (
                <g className="animate-pulse">
                  <circle cx="50" cy="95" r="11" className="fill-amber-500/25 stroke-amber-500 stroke-[1.5]" />
                  <circle cx="50" cy="95" r="3.5" className="fill-amber-600" />
                </g>
              )}

              {/* Frio repentino / Arrepio (Frio cy=75 and cy=110 outlines) */}
              {isHighlighted('frio_corpo') && (
                <g className="animate-pulse text-rose-400">
                  <path d="M 22 70 L 15 70 M 78 70 L 85 70" className="stroke-rose-400 stroke-[1.5]" />
                  <path d="M 23 90 L 16 90 M 77 90 L 84 90" className="stroke-rose-400 stroke-[1.5]" />
                  <circle cx="50" cy="120" r="16" className="stroke-rose-400/35 stroke-[1] stroke-dasharray-[2,2]" />
                </g>
              )}
            </svg>

            {/* Glowing floating status label */}
            {selectedParts.filter((p) => p !== 'nada').length > 0 && (
              <div className="absolute bottom-1 bg-rose-100 text-rose-800 text-[10px] font-bold py-0.5 px-2.5 rounded-full border border-rose-200">
                {selectedParts.filter((p) => p !== 'nada').length} {selectedParts.filter((p) => p !== 'nada').length === 1 ? 'sinal' : 'sinais'} somáticos
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
