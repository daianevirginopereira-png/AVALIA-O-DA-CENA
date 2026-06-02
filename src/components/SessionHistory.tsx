import { TrackingSession } from '../types';
import { Calendar, Trash2, Send, History } from 'lucide-react';

interface SessionHistoryProps {
  sessions: TrackingSession[];
  onDeleteSession: (id: string) => void;
  onSelectSession: (session: TrackingSession) => void;
  onSendWhatsApp: (session: TrackingSession) => void;
}

export default function SessionHistory({
  sessions,
  onDeleteSession,
  onSelectSession,
  onSendWhatsApp,
}: SessionHistoryProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4" id="sessions-history">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <History className="w-5 h-5 text-indigo-500" />
        <h3 className="font-semibold text-slate-800 text-sm md:text-base">
          Histórico de Acompanhamento ({sessions.length})
        </h3>
      </div>

      {sortedSessions.length === 0 ? (
        <div id="no-history-state" className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-500">Nenhum histórico salvo ainda.</p>
          <p className="text-xs text-slate-400 mt-1">Preencha o formulário e salve para iniciar seu histórico.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {sortedSessions.map((session) => (
            <div
              key={session.id}
              id={`history-item-${session.id}`}
              className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-200 transition-all group"
            >
              <div
                className="space-y-1 cursor-pointer flex-1"
                onClick={() => onSelectSession(session)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-indigo-600 block">
                    {formatDate(session.date)}
                  </span>
                  {session.comparacao && (
                    <span className={`text-[10px] border px-2 py-0.5 rounded-full font-semibold ${
                      session.comparacao === 'Melhor do que antes' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : session.comparacao === 'Pior do que antes'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {session.comparacao}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-slate-500 text-xs">
                  <span>Incômodo: <b className="text-slate-700">{session.incomodo}</b></span>
                  <span>Raiva: <b className="text-slate-700">{session.raiva}</b></span>
                  <span>Mágoa: <b className="text-slate-700">{session.magoa}</b></span>
                  <span>Nota: <b className="text-indigo-600 font-bold">{session.notaCena}/10</b></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  id={`btn-view-${session.id}`}
                  onClick={() => onSelectSession(session)}
                  className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Ver Detalhes
                </button>
                <button
                  type="button"
                  id={`btn-whatsapp-${session.id}`}
                  onClick={() => onSendWhatsApp(session)}
                  title="Enviar novamente via WhatsApp"
                  className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer border border-emerald-100"
                >
                  <Send className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  id={`btn-delete-${session.id}`}
                  onClick={() => onDeleteSession(session.id)}
                  title="Excluir do Histórico"
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
