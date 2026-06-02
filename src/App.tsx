import { useState, useEffect } from 'react';
import { TrackingSession, IntensityLevel } from './types';
import {
  PRESET_EMOTIONS,
  DEFAULT_WHATSAPP_NUMBER
} from './data';
import IntensitySelector from './components/IntensitySelector';
import SensationSelector from './components/SensationSelector';
import SessionCharts from './components/SessionCharts';
import SessionHistory from './components/SessionHistory';
import {
  Send,
  Clipboard,
  Save,
  Trash2,
  BrainCircuit,
  Settings,
  X,
  FileText,
  Sparkles,
  Smile,
  AlertCircle,
  Clock,
  Printer,
  Undo2,
  TrendingDown,
  Heart
} from 'lucide-react';

export default function App() {
  // Main form state
  const [incomodo, setIncomodo] = useState<IntensityLevel>('Baixa');
  const [raiva, setRaiva] = useState<IntensityLevel>('Nenhuma');
  const [magoa, setMagoa] = useState<IntensityLevel>('Nenhuma');
  const [coracao, setCoracao] = useState<string[]>([]);
  const [coracaoOutro, setCoracaoOutro] = useState('');
  const [pensamentoFirst, setPensamentoFirst] = useState('');
  const [corpoReage, setCorpoReage] = useState<string[]>([]);
  const [notaCena, setNotaCena] = useState<number>(5);
  const [comparacao, setComparacao] = useState<'Melhor do que antes' | 'Igual a antes' | 'Pior do que antes' | ''>('');
  const [trabalharCena, setTrabalharCena] = useState('');
  const [mensagemPai, setMensagemPai] = useState('');

  // Application configurations & history
  const [history, setHistory] = useState<TrackingSession[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP_NUMBER);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

  // Modal views
  const [selectedHistorySession, setSelectedHistorySession] = useState<TrackingSession | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cena_oculos_sessions');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading localStorage history', e);
    }
  }, []);

  // Format message for WhatsApp
  const generateMessageText = (session: Partial<TrackingSession>) => {
    const formattedDate = session.date
      ? new Date(session.date).toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : new Date().toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });

    const coracaoStr = session.coracao ? session.coracao.join(', ') : '';
    const coracaoOutput = session.coracaoOutro ? `${coracaoStr} (Outro: ${session.coracaoOutro})` : coracaoStr;
    const bodyPartsReadable = session.corpoReage
      ? session.corpoReage
          .map((id) => {
            if (id === 'garganta') return 'Garganta aperta';
            if (id === 'coracao_acelera') return 'Coração acelera';
            if (id === 'choro') return 'Dá vontade de chorar';
            if (id === 'nervoso') return 'Fico nervoso';
            if (id === 'maos_tremem') return 'Mãos tremem';
            if (id === 'nada') return 'Não sinto nada';
            return id;
          })
          .join(', ')
      : 'Não sinto nada';

    return `🧠 AVALIAÇÃO DA CENA DOS ÓCULOS (THIAGO)

📅 Data de envio: ${formattedDate}

📌 Por que essa avaliação é importante?
Thiago, às vezes uma lembrança parece resolvida porque a gente consegue falar dela, mas ainda pode existir alguma dor escondida no coração ou alguma reação no corpo. Essa avaliação nos ajuda a descobrir se a cena do óculos realmente perdeu a força emocional ou se ainda ficaram sentimentos acumulados.

1. O quanto essa lembrança ainda te incomoda? (Força da cena)
👉 ${session.incomodo || 'Nenhuma'}

2. 😡 Raiva: Quando lembra da cena, como está sua raiva hoje?
👉 ${session.raiva || 'Nenhuma'}

3. 😢 Mágoa: Quando lembra da cena, como está sua mágoa hoje?
👉 ${session.magoa || 'Nenhuma'}

4. ❤️ Coração: O que você sente no coração quando lembra da cena?
👉 ${coracaoOutput || 'Nada disso'}

5. 🧠 Pensamento: Quando lembra da cena, qual pensamento vem primeiro?
👉 ${session.pensamentoFirst || 'Não respondido'}

6. 🫁 Corpo: Seu corpo reage quando você lembra?
👉 ${bodyPartsReadable}

7. 📊 Nota da Cena: Se 0 significa "não dói nada" e 10 significa "dói muito", qual nota você daria hoje para a cena do óculos?
👉 Nota: ${session.notaCena !== undefined ? session.notaCena : '5'} / 10

8. 🔄 Comparação: Você sente que essa cena está:
👉 ${session.comparacao || 'Não respondida'}

9. 🎯 Avaliação Final: Você acha que ainda precisamos trabalhar essa cena ou ela já está resolvida?
👉 ${session.trabalharCena || 'Não respondida'}

10. 💬 Pergunta mais importante: Se seu pai estivesse na sua frente agora, sobre essa situação do óculos, o que você gostaria de dizer para ele?
👉 ${session.mensagemPai || 'Não respondido'}

----------------------------------------
Medidas estruturadas de acompanhamento terapêutico.`;
  };

  // WhatsApp sender
  const handleSendWhatsApp = (session: Partial<TrackingSession>) => {
    const text = generateMessageText(session);
    const cleanedPhone = whatsappNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanedPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Copy to clipboard
  const handleCopyToClipboard = (session: Partial<TrackingSession>) => {
    const text = generateMessageText(session);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset form layout
  const handleResetForm = () => {
    if (window.confirm('Tem certeza de que deseja limpar todo o formulário atual?')) {
      setIncomodo('Baixa');
      setRaiva('Nenhuma');
      setMagoa('Nenhuma');
      setCoracao([]);
      setCoracaoOutro('');
      setPensamentoFirst('');
      setCorpoReage([]);
      setNotaCena(5);
      setComparacao('');
      setTrabalharCena('');
      setMensagemPai('');
    }
  };

  // Save tracking session locally
  const handleSaveSession = () => {
    const newSession: TrackingSession = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      date: new Date().toISOString(),
      incomodo,
      raiva,
      magoa,
      coracao,
      coracaoOutro,
      pensamentoFirst,
      corpoReage,
      notaCena,
      comparacao,
      trabalharCena,
      mensagemPai,
    };

    setSaving(true);
    const updated = [newSession, ...history];
    setHistory(updated);
    localStorage.setItem('cena_oculos_sessions', JSON.stringify(updated));

    setTimeout(() => {
      setSaving(false);
      alert('Sessão armazenada com sucesso no seu histórico local!');
    }, 450);
  };

  // Delete a specific session
  const handleDeleteSession = (id: string) => {
    if (window.confirm('Tem certeza de que deseja apagar permanentemente este registro do histórico?')) {
      const updated = history.filter((s) => s.id !== id);
      setHistory(updated);
      localStorage.setItem('cena_oculos_sessions', JSON.stringify(updated));
      if (selectedHistorySession?.id === id) {
        setSelectedHistorySession(null);
      }
    }
  };

  // Load a demonstration history pack to see immediate improvements
  const handleLoadDemo = () => {
    const demoSessions: TrackingSession[] = [
      {
        id: 'demo-1',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        incomodo: 'Alta',
        raiva: 'Alta',
        magoa: 'Alta',
        coracao: ['Raiva', 'Mágoa', 'Injustiça', 'Tristeza'],
        coracaoOutro: 'Desamparo profundo',
        pensamentoFirst: 'Eu era apenas uma criança, não foi por mal que quebrei os óculos...',
        corpoReage: ['garganta', 'coracao_acelera'],
        notaCena: 9,
        comparacao: 'Igual a antes',
        trabalharCena: 'Ainda dói muito lembrar, sinto indignação.',
        mensagemPai: 'Por que você me bateu tão forte por causa de um objeto? Eu só queria seu carinho.',
      },
      {
        id: 'demo-2',
        date: new Date().toISOString(), // Today
        incomodo: 'Baixa',
        raiva: 'Nenhuma',
        magoa: 'Baixa',
        coracao: ['Tristeza'],
        coracaoOutro: '',
        pensamentoFirst: 'Foi um acidente trágico do passado, mas agora estou seguro.',
        corpoReage: ['nada'],
        notaCena: 2,
        comparacao: 'Melhor do que antes',
        trabalharCena: 'Está quase totalmente resolvida, mas falar sobre a figura paterna ainda me toca levemente.',
        mensagemPai: 'Eu perdoo você pelas suas limitações da época. Eu me liberei desse peso.',
      }
    ];
    setHistory(demoSessions);
    localStorage.setItem('cena_oculos_sessions', JSON.stringify(demoSessions));
    alert('Demonstração carregada com sucesso! Você pode ver a redução da carga emocional no mapa clínico e no histórico.');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 pb-16">
      {/* Upper Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50/50 flex items-center justify-center text-indigo-500 border border-indigo-200/50 shadow-xs shrink-0">
              {/* Brain overlapping an open book - custom styled SVG mirroring Miss. Daiane's logo perfectly */}
              <svg viewBox="0 0 100 100" className="w-8 h-8 opacity-90" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {/* Book Base lines */}
                <path d="M50 82C42 82 23 79 15 79V33C23 33 42 36 50 39C58 36 77 33 85 33V79C77 79 58 82 50 82Z" strokeWidth="1.8" />
                <path d="M50 39V82" strokeWidth="1.8" />
                {/* Elegant Brain Outline superimposing */}
                <path d="M42 56 C36 56, 34 48, 38 42 C35 36, 42 30, 50 34 C58 30, 65 36, 62 42 C66 48, 64 56, 58 56 C58 59, 42 59, 42 56 Z" fill="none" strokeWidth="1.8" />
                {/* Central organic split line */}
                <path d="M50 34 C49 39, 49 46, 50 51" strokeWidth="1.8" />
                {/* Hand-drawn aesthetic loops inside the brain */}
                <path d="M45 42 C47 43, 49 41, 50 41" strokeWidth="1.5" />
                <path d="M55 42 C53 43, 51 41, 50 41" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-serif font-semibold text-lg sm:text-xl text-slate-800 tracking-wide leading-none">
                  Miss. Daiane
                </span>
                <span className="font-sans text-[9px] uppercase tracking-wider text-indigo-500 font-bold">
                  Terapeuta Emocional
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-none">
                Cena dos Óculos • Thiago
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              id="btn-settings"
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
              title="Configurar Telefone de Destino"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="bg-slate-100 p-1.5 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setActiveTab('form')}
                id="tab-btn-form"
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'form'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Acompanhamento
              </button>
              <button
                onClick={() => setActiveTab('history')}
                id="tab-btn-history"
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Histórico ({history.length})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Configuration Widget Drawer (Top dropdown) */}
      {showConfig && (
        <div className="bg-slate-100/90 backdrop-blur-md border-b border-slate-200/50 py-4 shadow-inner" id="config-panel">
          <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contato Clínico Cadastrado
              </span>
              <p className="text-sm text-slate-600 font-medium">
                Celular que rebece as respostas em formato estruturado pronto para arquivamento.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-xs">
                  Tel:
                </span>
                <input
                  type="text"
                  id="whatsapp-input"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="5564992726558"
                  className="w-full pl-11 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:outline-hidden font-bold"
                />
              </div>
              <button
                onClick={() => setShowConfig(false)}
                id="btn-close-config"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2.5 rounded-xl text-sm transition-all cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container Workspace */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        {/* Welcome Guideline Banner */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden mb-8">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none select-none">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <circle cx="80" cy="50" r="40" />
            </svg>
          </div>
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Acompanhamento Clínico Individual
            </div>
            <h2 className="font-display font-bold text-xl md:text-3xl leading-snug">
              📌 Por que essa avaliação é importante?
            </h2>
            <div className="space-y-3 text-indigo-50 text-sm md:text-base leading-relaxed max-w-4xl">
              <p>
                Thiago, às vezes uma lembrança parece resolvida porque a gente consegue falar dela, mas ainda pode existir alguma dor escondida no coração ou alguma reação no corpo.
              </p>
              <p>
                Essa avaliação vai nos ajudar a descobrir se a cena do óculos realmente perdeu a força emocional ou se ainda ficaram sentimentos como raiva, mágoa, injustiça, tristeza ou rejeição.
              </p>
              <p className="font-medium bg-white/10 px-4 py-2.5 rounded-2xl border border-white/5 inline-block text-white">
                Não existe resposta certa ou errada. O importante é responder exatamente como você se sente hoje, para entendermos o que já melhorou e o que ainda precisa de atenção. O objetivo não é reviver a dor, mas medir o quanto ela ainda influencia você atualmente. 💙
              </p>
            </div>
          </div>
        </div>

        {/* Two columns - Workspace Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Complete structured form */}
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-display font-bold text-slate-900 text-lg md:text-xl">
                {activeTab === 'form' ? 'Formulário de Integração' : 'Histórico de Registros'}
              </h2>
              {activeTab === 'form' && (
                <button
                  onClick={handleResetForm}
                  id="btn-reset-form"
                  className="text-xs font-semibold text-slate-500 hover:text-red-500 flex items-center gap-1 py-1 px-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  Limpar Campos
                </button>
              )}
            </div>

            {activeTab === 'form' ? (
              <div className="space-y-8" id="form-container">
                {/* Connection assessment & core intensities */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-extrabold flex items-center justify-center">
                      A
                    </span>
                    <h3 className="font-display font-bold text-slate-800 text-base md:text-lg">
                      Avaliação Emocional e Intensidades
                    </h3>
                  </div>

                  {/* Question 1: incomodo */}
                  <IntensitySelector
                    label="1. O quanto essa lembrança ainda te incomoda? (Força ou impacto da cena)"
                    value={incomodo}
                    onChange={setIncomodo}
                    options={['Alta', 'Média', 'Baixa', 'Nenhuma']}
                    iconType="cena"
                  />

                  {/* Question 2: raiva */}
                  <IntensitySelector
                    label="2. Quando lembra da cena, como está sua raiva hoje?"
                    value={raiva}
                    onChange={setRaiva}
                    options={['Alta', 'Média', 'Baixa', 'Nenhuma']}
                    iconType="raiva"
                  />

                  {/* Question 3: magoa */}
                  <IntensitySelector
                    label="3. Quando lembra da cena, como está sua mágoa hoje?"
                    value={magoa}
                    onChange={setMagoa}
                    options={['Alta', 'Média', 'Baixa', 'Nenhuma']}
                    iconType="magoa"
                  />
                </div>

                {/* Sensation indicators & Heart connection */}
                <div className="space-y-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-extrabold flex items-center justify-center">
                      B
                    </span>
                    <h3 className="font-display font-bold text-slate-800 text-base md:text-lg">
                      Sentimentos & Reação Somática
                    </h3>
                  </div>

                  {/* Question 4: coracao */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-indigo-500 animate-pulse" />
                      <span className="font-semibold text-slate-700 text-sm md:text-base leading-relaxed">
                        4. ❤️ Coração: O que você sente no coração quando lembra da cena?
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" id="coracao-checkbox-options">
                      {['Raiva', 'Mágoa', 'Injustiça', 'Rejeição', 'Tristeza', 'Nada disso'].map((feeling) => {
                        const isChecked = feeling === 'Nada disso' 
                          ? coracao.length === 0 
                          : coracao.includes(feeling);
                        return (
                          <button
                            key={feeling}
                            type="button"
                            id={`opt-coracao-${feeling.toLowerCase().replace(' ', '-')}`}
                            onClick={() => {
                              if (feeling === 'Nada disso') {
                                setCoracao([]);
                              } else {
                                if (coracao.includes(feeling)) {
                                  const updated = coracao.filter((f) => f !== feeling);
                                  setCoracao(updated);
                                } else {
                                  const updated = [...coracao.filter((f) => f !== 'Nada disso'), feeling];
                                  setCoracao(updated);
                                }
                              }
                            }}
                            className={`px-4 py-3 border rounded-xl text-xs sm:text-sm font-semibold cursor-pointer text-left transition-all ${
                              isChecked
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span className="mr-2">{isChecked ? '✓' : '○'}</span>
                            {feeling}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Optional Outro Input */}
                    <div className="space-y-2 mt-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Outro sentimento adicional no coração (Opcional):
                      </label>
                      <input
                        type="text"
                        id="coracao-outro-input"
                        value={coracaoOutro}
                        onChange={(e) => setCoracaoOutro(e.target.value)}
                        placeholder="Ex: Sentimento de solidão precoce, incompreensão profunda..."
                        className="w-full rounded-2xl border border-slate-200 p-3 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-300 text-sm"
                      />
                    </div>
                  </div>

                  {/* Question 5: pensamentoFirst */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-sm font-semibold text-slate-700 leading-relaxed">
                      5. 🧠 Pensamento: Quando lembra da cena, qual pensamento vem primeiro?
                    </label>
                    <textarea
                      id="pensamento-first-textarea"
                      rows={3}
                      value={pensamentoFirst}
                      onChange={(e) => setPensamentoFirst(e.target.value)}
                      placeholder="Aquilo que diz na sua mente. Ex: 'Isso é uma injustiça', 'Não fui protegido', etc..."
                      className="w-full rounded-2xl border border-slate-200/80 p-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-sm leading-relaxed"
                    />
                  </div>

                  {/* Question 6: corpoReage (Somatic Selector Wrapper) */}
                  <div className="pt-2">
                    <SensationSelector
                      selectedParts={corpoReage}
                      onChange={setCorpoReage}
                    />
                  </div>
                </div>

                {/* Pain index & final evaluation */}
                <div className="space-y-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-extrabold flex items-center justify-center">
                      C
                    </span>
                    <h3 className="font-display font-bold text-slate-800 text-base md:text-lg">
                      Ressignificação e Fechamento
                    </h3>
                  </div>

                  {/* Question 7: notaCena */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 leading-relaxed">
                      7. 📊 Nota da Cena: Se 0 significa "não dói nada" e 10 significa "dói muito", qual nota você daria hoje para a cena do óculos?
                    </label>
                    <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-2xl border border-slate-150 gap-1 overflow-x-auto">
                      {Array.from({ length: 11 }).map((_, score) => {
                        const isSelected = notaCena === score;
                        return (
                          <button
                            key={score}
                            type="button"
                            id={`score-btn-${score}`}
                            onClick={() => setNotaCena(score)}
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 flex items-center justify-center cursor-pointer shrink-0 ${
                              isSelected
                                ? score >= 8
                                  ? 'bg-red-500 text-white shadow-sm ring-2 ring-red-200'
                                  : score >= 5
                                  ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-200'
                                  : score >= 2
                                  ? 'bg-blue-500 text-white shadow-sm ring-2 ring-blue-200'
                                  : 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-200'
                                : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            {score}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-400 px-1">
                      <span>0 - NÃO DÓI NADA</span>
                      <span>5 - SUPORTÁVEL</span>
                      <span>10 - DÓI DEMAIS</span>
                    </div>
                  </div>

                  {/* Question 8: comparacao */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-sm font-semibold text-slate-700 leading-relaxed">
                      8. 🔄 Comparação: Você sente que essa cena está:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { value: 'Melhor do que antes', label: '🟢 Melhor do que antes', color: 'hover:border-emerald-300 hover:bg-emerald-50 text-emerald-800 animate-pulse' },
                        { value: 'Igual a antes', label: '🟡 Igual a antes', color: 'hover:border-amber-300 hover:bg-amber-50 text-amber-800' },
                        { value: 'Pior do que antes', label: '🔴 Pior do que antes', color: 'hover:border-red-300 hover:bg-red-50 text-red-800' }
                      ].map((card) => {
                        const isSelected = comparacao === card.value;
                        return (
                          <button
                            key={card.value}
                            type="button"
                            id={`opt-comparacao-${card.value.toLowerCase().replace(/ /g, '-')}`}
                            onClick={() => setComparacao(card.value as any)}
                            className={`px-4 py-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-700 ring-2 ring-indigo-200'
                                : 'bg-white border-slate-200 text-slate-600'
                            } ${card.color}`}
                          >
                            {card.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Question 9: trabalharCena */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-sm font-semibold text-slate-700 leading-relaxed">
                      9. 🎯 Avaliação Final: Você acha que ainda precisamos trabalhar essa cena ou ela já está resolvida?
                    </label>
                    <textarea
                      id="trabalhar-cena-textarea"
                      rows={3}
                      value={trabalharCena}
                      onChange={(e) => setTrabalharCena(e.target.value)}
                      placeholder="Compartilhe como você julga a evolução total dessa memória em psicoterapia..."
                      className="w-full rounded-2xl border border-slate-200/80 p-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-sm leading-relaxed"
                    />
                  </div>

                  {/* Question 10: mensagemPai */}
                  <div className="space-y-3 pt-4 border-t border-indigo-100 bg-indigo-50/10 p-5 rounded-3xl border border-dashed">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                      <span className="font-bold text-slate-800 text-sm sm:text-md">
                        10. 💬 Pergunta mais importante: Se seu pai estivesse na sua frente agora, sobre essa situação do óculos, o que você gostaria de dizer para ele?
                      </span>
                    </div>
                    <textarea
                      id="mensagem-pai-textarea"
                      rows={4}
                      value={mensagemPai}
                      onChange={(e) => setMensagemPai(e.target.value)}
                      placeholder="Solte tudo aquilo que ficou reprimido ou que você gostaria de externalizar: desabafos, reconciliação, questionamentos sinceros..."
                      className="w-full rounded-2xl border border-indigo-200 bg-white p-4 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-sm leading-relaxed shadow-2xs"
                    />
                  </div>
                </div>

                {/* Submit Controls Form */}
                <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveSession}
                      id="btn-save-session"
                      disabled={saving}
                      className="px-5 py-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-all font-bold text-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Guardando...' : 'Salvar no Histórico'}
                    </button>
                    <button
                      onClick={handleLoadDemo}
                      id="btn-load-demo"
                      className="px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Carregar simulação de histórico com duas sessões para ver gráficos"
                    >
                      Ver Demonstração
                    </button>
                  </div>

                  <button
                    onClick={() => handleSendWhatsApp({
                      incomodo, raiva, magoa, coracao, coracaoOutro, pensamentoFirst, corpoReage, notaCena, comparacao, trabalharCena, mensagemPai
                    })}
                    id="btn-whatsapp-send"
                    className="flex-1 max-w-sm px-6 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-md shadow-emerald-500/15 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Send className="w-5 h-5" />
                    Enviar via WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              /* HISTORY VIEW */
              <div className="space-y-6">
                <SessionHistory
                  sessions={history}
                  onDeleteSession={handleDeleteSession}
                  onSelectSession={setSelectedHistorySession}
                  onSendWhatsApp={handleSendWhatsApp}
                />
              </div>
            )}
          </div>

          {/* RIGHT: Live Clinical telemetry & Action tools */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Chart Telemetry Card */}
            <SessionCharts
              currentSession={{
                incomodo,
                raiva,
                magoa,
                notaCena,
              }}
              history={history}
            />

            {/* Quick Actions Panel */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-semibold text-slate-800 text-sm md:text-base">
                Ações Rápidas
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  id="action-btn-copy"
                  onClick={() => handleCopyToClipboard({
                    incomodo, raiva, magoa, coracao, coracaoOutro, pensamentoFirst, corpoReage, notaCena, comparacao, trabalharCena, mensagemPai
                  })}
                  className="w-full flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer text-left transition-colors"
                >
                  <Clipboard className="w-4 h-4 text-slate-500" />
                  <div>
                    <span className="block text-slate-800">
                      {copied ? '✅ Copiado com Sucesso!' : 'Copiar Texto Estruturado'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Copia em formato Markdown para colar em e-mail ou prontuário.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  id="action-btn-print"
                  onClick={() => window.print()}
                  className="w-full flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer text-left transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <div>
                    <span className="block text-slate-800">Imprimir / Salvar PDF</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Abre a guia de impressão otimizada do navegador.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Guidance clinical card */}
            <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="w-4 h-4" />
                <span className="font-semibold text-xs uppercase tracking-wider">
                  Nota do Psicoterapeuta
                </span>
              </div>
              <p className="text-xs text-amber-700/90 leading-relaxed font-medium">
                "Trabalhar traumas ou cenas sensíveis requer autocompaixão continuada. Ao notar reações profundas no corpo durante o acompanhamento, pare, inspire profundamente, expire de forma alongada e note o ambiente ao seu redor. Você está no presente e seguro."
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* DETAIL MODAL FOR PAST SESSIONS */}
      {selectedHistorySession && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
          id="detail-modal"
          onClick={() => setSelectedHistorySession(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  Histórico Arquivado
                </div>
                <h3 className="font-display font-bold text-slate-900 text-lg md:text-xl">
                  Sessão: {new Date(selectedHistorySession.date).toLocaleString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </h3>
              </div>
              <button
                type="button"
                id="btn-close-modal"
                onClick={() => setSelectedHistorySession(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content list answers */}
            <div className="space-y-4 text-sm leading-relaxed" id="modal-answers-content">
              {/* Box intensities */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-800">
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">Incômodo (Cena)</span>
                  <span>{selectedHistorySession.incomodo || 'Nenhum'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">Raiva</span>
                  <span>{selectedHistorySession.raiva || 'Nenhuma'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">Mágoa</span>
                  <span>{selectedHistorySession.magoa || 'Nenhuma'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[9px]">Nota da Dor</span>
                  <span className="text-indigo-600 font-extrabold">{selectedHistorySession.notaCena !== undefined ? selectedHistorySession.notaCena : '5'}/10</span>
                </div>
              </div>

              {selectedHistorySession.corpoReage && selectedHistorySession.corpoReage.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-100/50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-red-500">
                    Sintomatologia Corporal Registrada
                  </span>
                  <p className="font-semibold text-xs text-red-800">
                    {selectedHistorySession.corpoReage
                      .map((id) => {
                        if (id === 'garganta') return 'Garganta aperta';
                        if (id === 'coracao_acelera') return 'Coração acelera';
                        if (id === 'choro') return 'Dá vontade de chorar';
                        if (id === 'nervoso') return 'Fico nervoso';
                        if (id === 'maos_tremem') return 'Mãos tremem';
                        if (id === 'nada') return 'Não sinto nada';
                        return id;
                      })
                      .join(', ')}
                  </p>
                </div>
              )}

              {/* Text Area Questions */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <b className="text-xs text-slate-400 uppercase tracking-wider block">4. O que sente no Coração</b>
                  <p className="bg-slate-50/50 border border-slate-100/50 p-3 rounded-xl text-slate-800 text-sm font-medium">
                    {selectedHistorySession.coracao && selectedHistorySession.coracao.length > 0
                      ? selectedHistorySession.coracao.join(', ')
                      : 'Nada disso'} 
                    {selectedHistorySession.coracaoOutro && ` (Adicional: ${selectedHistorySession.coracaoOutro})`}
                  </p>
                </div>

                <div className="space-y-1">
                  <b className="text-xs text-slate-400 uppercase tracking-wider block">5. Pensamento inicial que surge</b>
                  <p className="bg-slate-50/50 border border-slate-100/50 p-3 rounded-xl text-slate-800 text-sm">
                    {selectedHistorySession.pensamentoFirst || <em className="text-slate-400">Sem preenchimento</em>}
                  </p>
                </div>

                <div className="space-y-1">
                  <b className="text-xs text-slate-400 uppercase tracking-wider block">8. Comparação com o passado</b>
                  <p className="bg-slate-50/50 border border-slate-100/50 p-3 rounded-xl text-slate-800 font-semibold text-sm text-indigo-700">
                    {selectedHistorySession.comparacao || <em className="text-slate-400">Sem preenchimento</em>}
                  </p>
                </div>

                <div className="space-y-1">
                  <b className="text-xs text-slate-400 uppercase tracking-wider block">9. Avaliação de resolução</b>
                  <p className="bg-slate-50/50 border border-slate-100/50 p-3 rounded-xl text-slate-800 text-sm">
                    {selectedHistorySession.trabalharCena || <em className="text-slate-400">Sem preenchimento</em>}
                  </p>
                </div>

                <div className="space-y-1">
                  <b className="text-xs text-indigo-500 uppercase tracking-wider block">10. Mensagem reprimida para o pai</b>
                  <p className="bg-indigo-50/30 border border-indigo-100/45 p-3.5 rounded-xl text-indigo-950 font-medium text-sm leading-relaxed italic shadow-2xs">
                    "{selectedHistorySession.mensagemPai || <em className="text-slate-400">Sem preenchimento</em>}"
                  </p>
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                id="modal-btn-copy"
                onClick={() => handleCopyToClipboard(selectedHistorySession)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer transition-colors"
              >
                {copied ? 'Copiado!' : 'Copiar Texto'}
              </button>
              <button
                type="button"
                id="modal-btn-whatsapp"
                onClick={() => handleSendWhatsApp(selectedHistorySession)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Enviar WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
