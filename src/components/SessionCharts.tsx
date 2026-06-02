import { TrackingSession, IntensityLevel } from '../types';
import { INTENSITY_MAP } from '../data';
import { Brain, Heart, TrendingDown, Clipboard, Sparkles } from 'lucide-react';

interface SessionChartsProps {
  currentSession: Partial<TrackingSession>;
  history: TrackingSession[];
}

export default function SessionCharts({ currentSession, history }: SessionChartsProps) {
  // We measure four key metrics
  const metrics = [
    { key: 'incomodo', label: 'Incomodo', value: currentSession.incomodo || 'Não selecionado' },
    { key: 'raiva', label: 'Raiva', value: currentSession.raiva || 'Não selecionado' },
    { key: 'magoa', label: 'Mágoa', value: currentSession.magoa || 'Não selecionado' },
    { key: 'notaCena', label: 'Nota da Cena', value: currentSession.notaCena !== undefined && currentSession.notaCena !== null ? `${currentSession.notaCena}/10` : 'Não selecionado' },
  ];

  const getIntensityValue = (m: typeof metrics[0]) => {
    if (m.key === 'notaCena') {
      return (currentSession.notaCena ?? 0) * 10;
    }
    return INTENSITY_MAP[m.value as IntensityLevel] ?? 0;
  };

  // Map values to 0-100 range
  const dataPoints = metrics.map((m) => getIntensityValue(m));

  // Radar chart mathematical layout
  const cx = 100;
  const cy = 100;
  const rMax = 70;
  const vertexCount = 4;

  // Center points for 4 vertices (Diamond shape layout)
  const getCoordinates = (index: number, value: number) => {
    const angle = (index * 2 * Math.PI) / vertexCount - Math.PI / 2; // -90 deg starting from top
    const normalizedValue = value / 100;
    const r = normalizedValue * rMax;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y };
  };

  // Construct points string for current polygon data
  const currentPoints = dataPoints
    .map((val, idx) => {
      const { x, y } = getCoordinates(idx, val);
      return `${x},${y}`;
    })
    .join(' ');

  // Get labels coordinate layout
  const getLabelCoords = (index: number) => {
    const angle = (index * 2 * Math.PI) / vertexCount - Math.PI / 2;
    const r = rMax + 20;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y };
  };

  // Calculate historical improvements if multiple sessions exist
  const getImprovement = () => {
    if (history.length < 2) return null;
    const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const getSessionAverage = (s: TrackingSession) => {
      const incVal = s.incomodo ? (INTENSITY_MAP[s.incomodo as IntensityLevel] ?? 0) : 0;
      const raivaVal = s.raiva ? (INTENSITY_MAP[s.raiva as IntensityLevel] ?? 0) : 0;
      const magoaVal = s.magoa ? (INTENSITY_MAP[s.magoa as IntensityLevel] ?? 0) : 0;
      const notaVal = (s.notaCena ?? 0) * 10;
      return (incVal + raivaVal + magoaVal + notaVal) / 4;
    };

    const averageFirst = getSessionAverage(first);
    const averageLast = getSessionAverage(last);

    const diff = averageFirst - averageLast;
    return diff > 0 ? Math.round(diff) : 0;
  };

  const improvement = getImprovement();

  return (
    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-6" id="summary-charts">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm md:text-base">
          <Brain className="w-5 h-5 text-indigo-500" />
          Mapa Clínico da Cena
        </h3>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Síntese Atual
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Radar Graphic */}
        <div className="flex justify-center items-center py-4 bg-white rounded-xl border border-slate-100/80 shadow-xs relative">
          {currentSession.notaCena !== undefined && currentSession.notaCena !== null && (
            <div className="absolute top-2 left-2 bg-indigo-50 rounded-lg py-1 px-2 border border-indigo-100 text-[10px] font-bold text-indigo-700">
              Nota: {currentSession.notaCena}/10
            </div>
          )}
          <svg viewBox="0 0 200 200" className="w-full max-w-[220px] h-auto overflow-visible select-none">
            {/* Pentagon Grid Rings (100%, 75%, 50%, 25%) */}
            {[100, 75, 50, 25].map((ringLevel) => {
              const pentagonPoints = Array.from({ length: vertexCount })
                .map((_, idx) => {
                  const r = (ringLevel / 100) * rMax;
                  const angle = (idx * 2 * Math.PI) / vertexCount - Math.PI / 2;
                  return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
                })
                .join(' ');
              return (
                <polygon
                  key={ringLevel}
                  points={pentagonPoints}
                  fill="none"
                  className="stroke-slate-200 stroke-[0.8]"
                  strokeDasharray={ringLevel === 25 ? '2 2' : 'none'}
                />
              );
            })}

            {/* Axes from Center to Vertices */}
            {Array.from({ length: vertexCount }).map((_, idx) => {
              const { x, y } = getCoordinates(idx, 100);
              return (
                <line
                  key={idx}
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  className="stroke-slate-200 stroke-[0.8]"
                />
              );
            })}

            {/* Current Session Shape */}
            {dataPoints.some((v) => v > 0) && (
              <g>
                <polygon
                  points={currentPoints}
                  className="fill-indigo-500/20 stroke-indigo-500 stroke-[2] transition-all duration-500 ease-out"
                />
                {metrics.map((m, idx) => {
                  const val = getIntensityValue(m);
                  const { x, y } = getCoordinates(idx, val);
                  return (
                    <circle
                      key={m.key}
                      cx={x}
                      cy={y}
                      r="4"
                      className="fill-white stroke-indigo-600 stroke-[2] shadow-sm cursor-help"
                    />
                  );
                })}
              </g>
            )}

            {/* Labels on vertices */}
            {metrics.map((m, idx) => {
              const { x, y } = getLabelCoords(idx);
              const textAnchor = x < cx - 10 ? 'end' : x > cx + 10 ? 'start' : 'middle';
              const alignmentBaseline = y < cy - 10 ? 'baseline' : y > cy + 10 ? 'hanging' : 'middle';

              return (
                <text
                  key={m.key}
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  dominantBaseline={alignmentBaseline}
                  fontSize="7.5"
                  className="fill-slate-600 font-medium"
                >
                  {m.label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Dynamic insights list */}
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Indicadores Principais
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {metrics.map((m) => (
                <div key={m.key} className="p-2 bg-white rounded-lg border border-slate-100 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-600 font-medium">{m.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    (m.value as string).includes('Alta') || (m.value as string).includes('8') || (m.value as string).includes('9') || (m.value as string).includes('10')
                      ? 'bg-red-50 text-red-700'
                      : (m.value as string).includes('Média') || (m.value as string).includes('5') || (m.value as string).includes('6') || (m.value as string).includes('7')
                      ? 'bg-amber-50 text-amber-700'
                      : (m.value as string).includes('Baixa') || (m.value as string).includes('2') || (m.value as string).includes('3') || (m.value as string).includes('4')
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Historical insights card */}
          {improvement !== null ? (
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-start gap-2.5">
              <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="font-semibold text-emerald-900 text-sm block">
                  Evolução Significativa!
                </span>
                <p className="text-xs text-emerald-700 leading-normal font-normal">
                  Seus indicadores emocionais médios reduziram em <strong className="font-bold">{improvement}%</strong> desde a primeira sessão documentada. A carga emocional está se diluindo.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-50/50 border border-indigo-100/50 p-3 rounded-xl flex items-start gap-2.5">
              <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="font-semibold text-indigo-900 text-sm block">
                  Caminhada de Cura
                </span>
                <p className="text-xs text-indigo-700/90 leading-normal font-normal">
                  Responda com sinceridade. Suas informações serão organizadas e formatadas com segurança para envio clínico ao final.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
