import { useState, useEffect } from 'react';
import { TrackingSession, IntensityLevel } from './types';
import {
  PRESET_EMOTIONS,
  DEFAULT_WHATSAPP_NUMBER,
  MAIS_DOEU_OPTIONS
} from './data';
import IntensitySelector from './components/IntensitySelector';
import SensationSelector from './components/SensationSelector';
import SessionHistory from './components/SessionHistory';
import {
  Send,
  Clipboard,
  Save,
  Trash2,
  Settings,
  X,
  FileText,
  Sparkles,
  AlertCircle,
  Clock,
  Printer,
  Undo2,
  Heart,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Smile,
  ShieldCheck,
  User,
  Activity
} from 'lucide-react';

interface TrialModel {
  id: string;
  name: string;
  patientName: string;
  therapistName: string;
  sceneTitle: string;
  welcomeText: string;
  q4Label: string;
  q5Label: string;
  q5Placeholder: string;
  q16Label: string;
  q16Placeholder: string;
  q20Label: string;
  q20Placeholder: string;
  q27Label: string;
  q27Placeholder: string;
  heartExerciseContext: string;
  maisDoeuOptions: string[];
  suggestedAges: string[];
}

const CLINICAL_PRESETS: TrialModel[] = [
  {
    id: 'cena-enforcamento-thiago',
    name: 'Cena do Enforcamento • Thiago',
    patientName: 'Thiago',
    therapistName: 'Daiane',
    sceneTitle: 'Investigação da Cena do Enforcamento',
    welcomeText: 'Thiago, este é um mapeamento terapêutico estritamente confidencial que guiará nosso processo de ressignificação da ferida paterna e asfixia emocional sofrida no passado. Siga à sua medida. Toda recordação é salva de forma totalmente privada e formatada ao final.',
    q4Label: '4. Quantos anos você tinha na cena do enforcamento?',
    q5Label: '5. O que aconteceu antes do enforcamento? (Contexto)',
    q5Placeholder: 'Relate o que disparou o castigo ou o confronto: brincadeiras, discussões, quebra de objetos...',
    q16Label: '16. O que você gostaria que seu pai tivesse feito em lugar de te enforcar?',
    q16Placeholder: 'Ex: Que ele me ensinasse sem agressão, que mostrasse paciência, que apenas ficasse em silêncio...',
    q20Label: '20. O que você aprendeu sobre seu pai naquele dia do enforcamento?',
    q20Placeholder: "Ex: 'Ele é instável', 'Não posso confiar na proteção dele', 'O amor dói'...",
    q27Label: 'Imagine que aquele Thiago adolescente daquele terrível dia do enforcamento está exatamente agora sentado bem na sua frente. Ele está te escutando com olhos curiosos e atentos...',
    q27Placeholder: "Abra seu coração por inteiro. Ofereça proteção, valide que não foi culpa dele, liberte-o daquela asfixia...",
    heartExerciseContext: 'deite o foco na ferida do enforcamento na adolescência de Thiago, e complete com sua primeira intuição sem pensar:',
    maisDoeuOptions: ['O enforcamento?', 'Não ser ouvido?', 'Ser acusado?', 'O medo?', 'Outra coisa?'],
    suggestedAges: ['12 anos', '13 anos', '14 anos', '15 anos', '16 anos', '17 anos']
  },
  {
    id: 'cena-abandono-julia',
    name: 'Cena de Abandono • Julia',
    patientName: 'Julia',
    therapistName: 'Daiane',
    sceneTitle: 'Investigação do Abandono Paterno',
    welcomeText: 'Julia, este mapeamento clínico investigativo guiará nosso acolhimento da ferida da rejeição paterna e abandono afetivo na infância. Vamos olhar para a solidão e restaurar o amor-próprio.',
    q4Label: '4. Quantos anos você tinha quando ocorreu o abandono ou afastamento?',
    q5Label: '5. O que aconteceu nos dias anteriores ao afastamento? (Contexto)',
    q5Placeholder: 'Relate o clima em casa: brigas entre os pais, malas prontas, avisos prévios ou distância inexplicável...',
    q16Label: '16. O que você gostaria que seu pai tivesse feito em lugar de ter ido embora?',
    q16Placeholder: 'Ex: Que ele explicasse com amor, me prometesse ligar todos os dias, me desse um último abraço carinhoso...',
    q20Label: '20. O que você aprendeu sobre seu pai naquele dia da partida dele?',
    q20Placeholder: "Ex: 'Eu não sou digna de permanência', 'O amor é frágil e vai embora', 'Ele não se importa'...",
    q27Label: 'Imagine que aquela pequena Julia rejeitada e cabisbaixa daquele fatídico dia está diante de você. Ela te olha tímida...',
    q27Placeholder: "Ofereça o colo materno/paterno que lhe faltou, assegure que você está com ela e nunca a abandonará...",
    heartExerciseContext: 'respire fundo, traga a imagem da pequena Julia do dia do abandono no peito e preencha por intuição pura:',
    maisDoeuOptions: ['A partida repentina?', 'A falta de explicação?', 'O silêncio do pai?', 'A solidão no quarto?', 'Outra coisa?'],
    suggestedAges: ['4 anos', '6 anos', '8 anos', '10 anos', '12 anos']
  },
  {
    id: 'humilhacao-escolar-matheus',
    name: 'Humilhação Escolar • Matheus',
    patientName: 'Matheus',
    therapistName: 'Daiane',
    sceneTitle: 'Investigação de Humilhação Escolar',
    welcomeText: 'Matheus, este mapeamento investigará as feridas da vergonha pública, do silenciamento compulsório e da rejeição social sofrida perante o ambiente acadêmico ou colegas.',
    q4Label: '4. Quantos anos você tinha na cena daquela humilhação perante o grupo?',
    q5Label: '5. O que desencadeou a ridicularização ou a crise na escola? (Contexto)',
    q5Placeholder: 'Ex: Errar uma questão no quadro, julgamentos das roupas, boatos, exclusão de grupos ou bronca do professor...',
    q16Label: '16. O que você gostaria que os professores ou amigos tivessem feito em lugar de humilhar/se omitir?',
    q16Placeholder: 'Ex: Que a professora me acolhesse, que amigos chamassem os inspetores, que me dessem abrigo contra o bullying...',
    q20Label: '20. O que você aprendeu sobre o professor ou os colegas naquele dia de pavor?',
    q20Placeholder: "Ex: 'O grupo é perigoso', 'Falar em público é sofrer castigo', 'Ninguém me apoia no erro'...",
    q27Label: 'Imagine que aquele Matheus assustado e acuado daquele dia do bullying está bem na sua frente agora. Ele clama por socorro...',
    q27Placeholder: "Assegure que ele é inteligente, que você vai defendê-lo de qualquer acusação e que a hostilidade alheia não mede o valor dele...",
    heartExerciseContext: 'focalize a memória daquela sala de aula hostil e complete os espaços vazios:',
    maisDoeuOptions: ['As risadas dos colegas?', 'A omissão dos adultos?', 'A vergonha do erro?', 'O sentimento de inferioridade?', 'Outra coisa?'],
    suggestedAges: ['8 anos', '10 anos', '12 anos', '14 anos', '16 anos']
  },
  {
    id: 'modelo-clinico-personalizado',
    name: '⚙️ Modelo Livre Personalizável (Livre)',
    patientName: 'Anônimo',
    therapistName: 'Daiane',
    sceneTitle: 'Investigação Clínica Emocional',
    welcomeText: 'Prezado paciente, este é um gabarito clínico confidencial desenhado para guiar nossa investigação e integração de memórias difíceis do passado, promovendo a reconstrução da sua voz.',
    q4Label: '4. Quantos anos você tinha na cena que quer investigar ou integrar?',
    q5Label: '5. O que aconteceu antes de culminar no pior momento? (Contexto)',
    q5Placeholder: 'Descreva os fatos que geraram a crise, discussões anteriores ou o contexto do trauma...',
    q16Label: '16. O que você gostaria que as figuras centrais tivessem feito para te proteger em vez do ato doloroso?',
    q16Placeholder: 'Ex: Que agissem com paciência, oferecessem apoio, conversassem com respeito, me dessem colo...',
    q20Label: '20. O que você aprendeu sobre essa pessoa ou sobre a agressão naquele momento?',
    q20Placeholder: 'Verdades inconscientes que você gerou sobre as intenções de quem te feriu...',
    q27Label: 'Imagine que a sua versão infantil daquele terrível acontecimento está sentada bem na sua frente agora, esperando por você...',
    q27Placeholder: 'Fale com ela, ofereça a segurança de um adulto maduro, retire o medo do seu peito e diga que agora acabou...',
    heartExerciseContext: 'respire lenta e profundamente, coloque o foco naquela cena do passado e complete sem pensar:',
    maisDoeuOptions: ['A agressão física/verbal?', 'A injustiça da acusação?', 'A solidão total?', 'A falta de socorro?', 'Outra coisa?'],
    suggestedAges: ['6 anos', '10 anos', '14 anos', '18 anos']
  }
];

export default function App() {
  // --- STATE DECLARATIONS ---
  
  // Model selector and Custom Configuration states
  const [selectedModelId, setSelectedModelId] = useState<string>('cena-enforcamento-thiago');
  const [customPatientName, setCustomPatientName] = useState<string>('Thiago');
  const [customTherapistName, setCustomTherapistName] = useState<string>('Daiane');
  const [customSceneTitle, setCustomSceneTitle] = useState<string>('Investigação da Cena do Enforcamento');
  const [customWelcomeText, setCustomWelcomeText] = useState<string>('');
  
  const [customQ5Label, setCustomQ5Label] = useState<string>('');
  const [customQ5Placeholder, setCustomQ5Placeholder] = useState<string>('');
  const [customQ16Label, setCustomQ16Label] = useState<string>('');
  const [customQ16Placeholder, setCustomQ16Placeholder] = useState<string>('');
  const [customQ20Label, setCustomQ20Label] = useState<string>('');
  const [customQ20Placeholder, setCustomQ20Placeholder] = useState<string>('');
  const [customQ27Label, setCustomQ27Label] = useState<string>('');
  const [customQ27Placeholder, setCustomQ27Placeholder] = useState<string>('');
  const [customHeartExerciseContext, setCustomHeartExerciseContext] = useState<string>('');
  const [currentMaisDoeuOptions, setCurrentMaisDoeuOptions] = useState<string[]>(['O enforcamento?', 'Não ser ouvido?', 'Ser acusado?', 'O medo?', 'Outra coisa?']);

  // Section 1: Antes de entrar na cena
  const [notaCena, setNotaCena] = useState<number | null>(null);
  const [sentePrimeiro, setSentePrimeiro] = useState('');
  const [senteCorpo, setSenteCorpo] = useState('');
  const [corpoReage, setCorpoReage] = useState<string[]>([]);

  // Section 2: Entrando na cena
  const [idadeCena, setIdadeCena] = useState('');
  const [antesEnforcamento, setAntesEnforcamento] = useState('');
  const [pensamentoMomento, setPensamentoMomento] = useState('');
  const [piorParteCena, setPiorParteCena] = useState('');
  const [maisDoeu, setMaisDoeu] = useState<string[]>([]);
  const [maisDoeuOutro, setMaisDoeuOutro] = useState('');

  // Section 3: Emoções
  const [sentiuMomento, setSentiuMomento] = useState('');
  const [sentiuMedo, setSentiuMedo] = useState<IntensityLevel | ''>('');
  const [sentiuRaiva, setSentiuRaiva] = useState<IntensityLevel | ''>('');
  const [sentiuTristeza, setSentiuTristeza] = useState<IntensityLevel | ''>('');
  const [sentiuInjustica, setSentiuInjustica] = useState<IntensityLevel | ''>('');
  const [emocaoMaisForte, setEmocaoMaisForte] = useState('');

  // Section 4: O que ficou guardado
  const [queriaDizer, setQueriaDizer] = useState('');
  const [paiTivesseFeito, setPaiTivesseFeito] = useState('');
  const [precisavaOuvir, setPrecisavaOuvir] = useState('');
  const [presoCoracao, setPresoCoracao] = useState('');

  // Section 5: A crença
  const [aprendeuSobreVoce, setAprendeuSobreVoce] = useState('');
  const [aprendeuSobrePai, setAprendeuSobrePai] = useState('');
  const [aprendeuSobrePessoas, setAprendeuSobrePessoas] = useState('');
  const [mudouDentro, setMudouDentro] = useState('');

  // Section 6: A voz que foi calada
  const [tentouExplicar, setTentouExplicar] = useState('');
  const [ninguemQuisOuvir, setNinguemQuisOuvir] = useState('');
  const [quandoMandamCalar, setQuandoMandamCalar] = useState('');
  const [primeiraVezNaoAcreditava, setPrimeiraVezNaoAcreditava] = useState('');

  // Section 7: Exercício do coração
  const [exercicioPrecisava, setExercicioPrecisava] = useState('');
  const [exercicioQueriaDizer, setExercicioQueriaDizer] = useState('');
  const [exercicioMaisMachuca, setExercicioMaisMachuca] = useState('');

  // Section 8: Pergunta final
  const [mensagemThiagoPassado, setMensagemThiagoPassado] = useState('');

  // Application settings, active tab and current visual step
  const [history, setHistory] = useState<TrackingSession[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP_NUMBER);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfig, setShowConfig] = useState(false);
  const [showModelCustomize, setShowModelCustomize] = useState(false);
  const [selectedHistorySession, setSelectedHistorySession] = useState<TrackingSession | null>(null);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cena_enforcamento_sessions');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading localStorage history', e);
    }
  }, []);

  // Synchronize model properties when changing dropdown selection
  useEffect(() => {
    const activePreset = CLINICAL_PRESETS.find(p => p.id === selectedModelId);
    if (activePreset) {
      setCustomPatientName(activePreset.patientName);
      setCustomTherapistName(activePreset.therapistName);
      setCustomSceneTitle(activePreset.sceneTitle);
      setCustomWelcomeText(activePreset.welcomeText);
      setCustomQ5Label(activePreset.q5Label);
      setCustomQ5Placeholder(activePreset.q5Placeholder);
      setCustomQ16Label(activePreset.q16Label);
      setCustomQ16Placeholder(activePreset.q16Placeholder);
      setCustomQ20Label(activePreset.q20Label);
      setCustomQ20Placeholder(activePreset.q20Placeholder);
      setCustomQ27Label(activePreset.q27Label);
      setCustomQ27Placeholder(activePreset.q27Placeholder);
      setCustomHeartExerciseContext(activePreset.heartExerciseContext);
      setCurrentMaisDoeuOptions(activePreset.maisDoeuOptions);
    }
  }, [selectedModelId]);

  // Format message text for sharing or clipboard
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

    const maisDoeuStr = session.maisDoeu ? session.maisDoeu.join(', ') : '';
    const maisDoeuOutput = session.maisDoeuOutro ? `${maisDoeuStr} (Outro: ${session.maisDoeuOutro})` : maisDoeuStr;

    const bodyPartsReadable = session.corpoReage && session.corpoReage.length > 0
      ? session.corpoReage
          .map((id) => {
            if (id === 'garganta') return 'Garganta aperta';
            if (id === 'coracao_acelera') return 'Coração acelera';
            if (id === 'choro') return 'Dá vontade de chorar';
            if (id === 'nervoso') return 'Fico nervoso / Tenso';
            if (id === 'estomago') return 'Estômago embrulha';
            if (id === 'frio_corpo') return 'Frio repentino / Arrepio';
            if (id === 'nada') return 'Não sinto nada no corpo';
            return id;
          })
          .join(', ')
      : 'Nenhuma selecionada';

    const pName = session.modelPatientName || customPatientName || 'Thiago';
    const sTitle = session.modelSceneTitle || customSceneTitle || 'Investigação da Cena';
    const tName = session.modelTherapistName || customTherapistName || 'Daiane';

    return `🧠 ${sTitle.toUpperCase()} – ${pName.toUpperCase()}
📋 Prontuário de Integração Emocional e Ressignificação

📅 Emissão: ${formattedDate}
--------------------------------------------------

🔴 ANTES DE ENTRAR NA CENA
1. Quando você lembra dessa cena hoje, qual nota ela tem de 0 a 10?
👉 Nota: ${session.notaCena !== undefined && session.notaCena !== null ? session.notaCena : 'Não avaliado'} / 10

2. O que você sente primeiro quando lembra dela?
👉 ${session.sentePrimeiro || 'Não respondido'}

3. Onde você sente isso no corpo?
👉 ${session.senteCorpo || 'Não respondido'}
👉 [Reações Somatossensoriais: ${bodyPartsReadable}]

--------------------------------------------------

🟠 ENTRANDO NA CENA
4. Quantos anos você tinha?
👉 ${session.idadeCena || 'Não respondido'}

5. O que aconteceu antes? (Contexto)
👉 ${session.antesEnforcamento || 'Não respondido'}

6. O que você estava pensando naquele momento?
👉 ${session.pensamentoMomento || 'Não respondido'}

7. Qual foi a pior parte da cena?
👉 ${session.piorParteCena || 'Não respondido'}

8. O que mais doeu:
👉 ${maisDoeuOutput || 'Não selecionado'}

--------------------------------------------------

🟡 EMOÇÕES
9. O que você sentiu naquele momento?
👉 ${session.sentiuMomento || 'Não respondido'}

10. Você sentiu medo?
👉 ${session.sentiuMedo || 'Não selecionado'}

11. Você sentiu raiva?
👉 ${session.sentiuRaiva || 'Não selecionado'}

12. Você sentiu tristeza?
👉 ${session.sentiuTristeza || 'Não selecionado'}

13. Você sentiu injustiça?
👉 ${session.sentiuInjustica || 'Não selecionado'}

14. Qual dessas emoções era a mais forte?
👉 ${session.emocaoMaisForte || 'Não selecionado'}

--------------------------------------------------

🟢 O QUE FICOU GUARDADO
15. O que você queria dizer e não conseguiu?
👉 ${session.queriaDizer || 'Não respondido'}

16. O que você gostaria que tivessem feito em seu lugar?
👉 ${session.paiTivesseFeito || 'Não respondido'}

17. O que você precisava ouvir naquele momento?
👉 ${session.precisavaOuvir || 'Não respondido'}

18. O que ficou preso dentro do seu coração?
👉 ${session.presoCoracao || 'Não respondido'}

--------------------------------------------------

🔵 A CRENÇA
19. O que você aprendeu sobre você naquele dia?
👉 ${session.aprendeuSobreVoce || 'Não respondido'}

20. O que você aprendeu sobre quem te feriu?
👉 ${session.aprendeuSobrePai || 'Não respondido'}

21. O que você aprendeu sobre as pessoas naquele dia?
👉 ${session.aprendeuSobrePessoas || 'Não respondido'}

22. Depois dessa situação, algo mudou dentro de você?
👉 ${session.mudouDentro || 'Não respondido'}

--------------------------------------------------

🟣 A VOZ QUE FOI CALADA
23. Você tentou se explicar?
👉 ${session.tentouExplicar || 'Não respondido'}

24. Você sentiu que ninguém quis ouvir sua versão?
👉 ${session.ninguemQuisOuvir || 'Não respondido'}

25. Como é para você quando mandam você ficar calado?
👉 ${session.quandoMandamCalar || 'Não respondido'}

26. Qual foi a primeira vez que você sentiu que ninguém acreditava em você?
👉 ${session.primeiraVezNaoAcreditava || 'Não respondido'}

--------------------------------------------------

❤️ EXERCÍCIO DO CORAÇÃO
✨ "Naquele dia eu precisava de..."
👉 ${session.exercicioPrecisava || 'Não respondido'}

✨ "Naquele dia eu queria dizer..."
👉 ${session.exercicioQueriaDizer || 'Não respondido'}

✨ "Até hoje o que mais me machuca é..."
👉 ${session.exercicioMaisMachuca || 'Não respondido'}

--------------------------------------------------

🎯 PERGUNTA FINAL
💬 Se aquele ${pName} daquele dia estivesse deitado ou sentado na sua frente agora, o que você diria para ele?
👉 "${session.mensagemThiagoPassado || 'Não respondido'}"

--------------------------------------------------
Relatório Clínico Gerado para Arquivamento Terapêutico.
Miss. ${tName} • Terapeuta Emocional`;
  };

  // Dispatch message to WhatsApp
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

  // Clear all fields
  const handleResetForm = () => {
    if (window.confirm('Deseja realmente limpar todas as respostas do formulário e recomeçar do zero?')) {
      setNotaCena(null);
      setSentePrimeiro('');
      setSenteCorpo('');
      setCorpoReage([]);
      setIdadeCena('');
      setAntesEnforcamento('');
      setPensamentoMomento('');
      setPiorParteCena('');
      setMaisDoeu([]);
      setMaisDoeuOutro('');
      setSentiuMomento('');
      setSentiuMedo('');
      setSentiuRaiva('');
      setSentiuTristeza('');
      setSentiuInjustica('');
      setEmocaoMaisForte('');
      setQueriaDizer('');
      setPaiTivesseFeito('');
      setPrecisavaOuvir('');
      setPresoCoracao('');
      setAprendeuSobreVoce('');
      setAprendeuSobrePai('');
      setAprendeuSobrePessoas('');
      setMudouDentro('');
      setTentouExplicar('');
      setNinguemQuisOuvir('');
      setQuandoMandamCalar('');
      setPrimeiraVezNaoAcreditava('');
      setExercicioPrecisava('');
      setExercicioQueriaDizer('');
      setExercicioMaisMachuca('');
      setMensagemThiagoPassado('');
      setCurrentStep(1);
    }
  };

  // Save tracking session locally
  const handleSaveSession = () => {
    const newSession: TrackingSession = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      date: new Date().toISOString(),
      notaCena,
      sentePrimeiro,
      senteCorpo,
      corpoReage,
      idadeCena,
      antesEnforcamento,
      pensamentoMomento,
      piorParteCena,
      maisDoeu,
      maisDoeuOutro,
      sentiuMomento,
      sentiuMedo,
      sentiuRaiva,
      sentiuTristeza,
      sentiuInjustica,
      emocaoMaisForte,
      queriaDizer,
      paiTivesseFeito,
      precisavaOuvir,
      presoCoracao,
      aprendeuSobreVoce,
      aprendeuSobrePai,
      aprendeuSobrePessoas,
      mudouDentro,
      tentouExplicar,
      ninguemQuisOuvir,
      quandoMandamCalar,
      primeiraVezNaoAcreditava,
      exercicioPrecisava,
      exercicioQueriaDizer,
      exercicioMaisMachuca,
      mensagemThiagoPassado,
      modelId: selectedModelId,
      modelPatientName: customPatientName,
      modelSceneTitle: customSceneTitle,
      modelTherapistName: customTherapistName,
    };

    setSaving(true);
    const updated = [newSession, ...history];
    setHistory(updated);
    localStorage.setItem('cena_enforcamento_sessions', JSON.stringify(updated));

    setTimeout(() => {
      setSaving(false);
      alert('Sessão armazenada com sucesso no histórico deste aparelho!');
    }, 450);
  };

  // Delete a specific session
  const handleDeleteSession = (id: string) => {
    if (window.confirm('Tem certeza de que deseja apagar permanentemente este registro do histórico?')) {
      const updated = history.filter((s) => s.id !== id);
      setHistory(updated);
      localStorage.setItem('cena_enforcamento_sessions', JSON.stringify(updated));
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
        notaCena: 10,
        sentePrimeiro: 'Pânico imediato, aperto real garganta acima.',
        senteCorpo: 'Garganta seca, palpitação peitoral angustiante.',
        idadeCena: '8 anos',
        antesEnforcamento: 'Havia quebrado involuntariamente um instrumento de trabalho e fui repreendido corporalmente pelo pai de modo excessivo.',
        pensamentoMomento: 'Eu vou morrer asfixiado e ninguém vai me defender. Eu mereço de algum jeito.',
        piorParteCena: 'Sentir o ar faltar nos meus pulmões enquanto meu pai mantinha as mãos no meu pescoço com cólera.',
        maisDoeu: ['O enforcamento?', 'Não ser ouvido?', 'O medo?'],
        maisDoeuOutro: '',
        sentiuMomento: 'Apavoramento absoluto e desamparo materno/fraternal.',
        sentiuMedo: 'Alta',
        sentiuRaiva: 'Média',
        sentiuTristeza: 'Alta',
        sentiuInjustica: 'Alta',
        emocaoMaisForte: 'Medo',
        queriaDizer: 'Pai, eu sou só uma criança, pare por favor!',
        paiTivesseFeito: 'Me acolhido, explicado o erro sem me infligir asfixia física.',
        precisavaOuvir: 'Vai ficar tudo bem, meu filho, você errou mas eu te amo.',
        presoCoracao: 'A dor silenciada de achar que minha vida dependia da fúria irreprimível do meu pai.',
        aprendeuSobreVoce: 'Que eu era fraco, indefeso e totalmente culpável por qualquer erro.',
        aprendeuSobrePai: 'Ele representa um predador perigoso de quem preciso me ocultar.',
        aprendeuSobrePessoas: 'Quem mais amamos pode subitamente tentar apagar nossa existência.',
        mudouDentro: 'Sim, tornei-me vigilante, extremamente calado e com extrema fobia de desapontar autoridades.',
        tentouExplicar: 'Tentei mas me calaram',
        ninguemQuisOuvir: 'Totalmente',
        quandoMandamCalar: 'Sinto asfixia automática na laringe, calafrios e tremores somáticos.',
        primeiraVezNaoAcreditava: 'Nesse dia traumático, onde nenhum irmão contestou o castigo abusivo.',
        exercicioPrecisava: 'Alguém que segurasse minha mão e me retirasse dali.',
        exercicioQueriaDizer: 'Eu sou inocente do tamanho da dor que você me deu.',
        exercicioMaisMachuca: 'A frieza dos olhares calados.',
        mensagemThiagoPassado: 'Jovem Thiago, olhe para mim hoje. Eu sou forte, sou o seu futuro. Você sobreviveu. Eu respiro por nós dois agora. Aquele perigo acabou para sempre, você está a salvo.',
        corpoReage: ['garganta', 'coracao_acelera']
      },
      {
        id: 'demo-2',
        date: new Date().toISOString(), // Today
        notaCena: 2,
        sentePrimeiro: 'Uma melancolia leve, porém sem reações físicas de asfixia.',
        senteCorpo: 'Sinto o pescoço leve e relaxado.',
        idadeCena: '8 anos',
        antesEnforcamento: 'Encontro traumático da infância.',
        pensamentoMomento: 'Isso é passado, hoje eu governo minha vida e estou fora de perigo.',
        piorParteCena: 'A raiva dele',
        maisDoeu: ['Não ser ouvido?'],
        maisDoeuOutro: '',
        sentiuMomento: 'Tristeza resignada pelo trauma pessoal que meu pai também carregava.',
        sentiuMedo: 'Nenhuma',
        sentiuRaiva: 'Baixa',
        sentiuTristeza: 'Média',
        sentiuInjustica: 'Baixa',
        emocaoMaisForte: 'Tristeza',
        queriaDizer: 'Sua dor era sua, pai, eu hoje me devolvo a paz.',
        paiTivesseFeito: 'Lidado com suas frustrações sem violência.',
        precisavaOuvir: 'Você merece ser feliz.',
        presoCoracao: 'Espaço aberto para a regeneração emocional.',
        aprendeuSobreVoce: 'Que sou resiliente e herdei uma profunda sensibilidade para me curar.',
        aprendeuSobrePai: 'Que ele era um homem ferido, que transmitiu o trauma que não soube integrar.',
        aprendeuSobrePessoas: 'Que as pessoas erram a partir do próprio sofrimento acumulado.',
        mudouDentro: 'Estou sentindo um resgate profundo da minha verdade e espontaneidade.',
        tentouExplicar: 'Sim',
        ninguemQuisOuvir: 'Um pouco',
        quandoMandamCalar: 'Eu me afasto, respiro fundo e sei que minha voz tem peso.',
        primeiraVezNaoAcreditava: 'Na infância distante.',
        exercicioPrecisava: 'Liberdade para sentir',
        exercicioQueriaDizer: 'Eu perdoo nossa história',
        exercicioMaisMachuca: 'Apenas a lembrança nostálgica',
        mensagemThiagoPassado: 'Thiago, você não está mais desamparado. Nós vencemos aquele dia e agora nossa voz ecoa com dignidade.',
        corpoReage: ['nada']
      }
    ];
    setHistory(demoSessions);
    localStorage.setItem('cena_enforcamento_sessions', JSON.stringify(demoSessions));
    alert('Simulação clínica de progresso carregada de forma excelente. Explore os gráficos de controle e o histórico!');
  };

  // Step names translation
  const stepsList = [
    { num: 1, title: 'Antes de Entrar', desc: 'Sua relação atual com a memória' },
    { num: 2, title: 'Entrando na Cena', desc: 'Detalhamento do acontecimento' },
    { num: 3, title: 'Suas Emoções', desc: 'Intensidades das feridas' },
    { num: 4, title: 'O que ficou Guardado', desc: 'Palavras reprimidas no coração' },
    { num: 5, title: 'Crenças Formadas', desc: 'Aprendizados tirados do trauma' },
    { num: 6, title: 'A Voz Calada', desc: 'Sentimentos de escuta e verdade' },
    { num: 7, title: 'Exercício do Coração', desc: 'Completar lacunas em transe' },
    { num: 8, title: 'Frase de Acolhimento', desc: 'Mensagem de cura para si de outrora' },
  ];

  const currentStepData = stepsList[currentStep - 1];

  const scrollToSection = (secNum: number) => {
    if (secNum >= 1 && secNum <= 8) {
      setCurrentStep(secNum);
      const container = document.getElementById('continuous-questions-scroll-container');
      const element = document.getElementById(`secao-${secNum}`);
      if (container && element) {
        const topPos = element.offsetTop - container.offsetTop;
        container.scrollTo({
          top: topPos - 12,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleScroll = (e: any) => {
    const container = e.currentTarget;
    const scrollPos = container.scrollTop + 140; // anchor scroll trigger offset
    
    for (let i = 1; i <= 8; i++) {
      const element = document.getElementById(`secao-${i}`);
      if (element) {
        const topPos = element.offsetTop - container.offsetTop;
        const bottomPos = topPos + element.offsetHeight;
        if (scrollPos >= topPos && scrollPos < bottomPos) {
          setCurrentStep(i);
          break;
        }
      }
    }
  };

  // Merge selected somatic spots with typed inputs for live charts representation
  const mergedSomaticText = () => {
    const list = corpoReage.map(p => {
      const opt = corpoReage.includes(p);
      if (p === 'garganta') return 'Garganta aperta';
      if (p === 'coracao_acelera') return 'Coração acelera';
      if (p === 'choro') return 'Dá vontade de chorar';
      if (p === 'nervoso') return 'Fico nervoso / Tenso';
      if (p === 'estomago') return 'Estômago embrulha';
      if (p === 'frio_corpo') return 'Frio repentino / Arrepio';
      if (p === 'nada') return 'Não sinto nada no corpo';
      return p;
    }).join(', ');
    return senteCorpo ? `${senteCorpo} [Sinais somáticos: ${list}]` : list;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-rose-100 selection:text-rose-950 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-3xs shrink-0">
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M50 82C42 82 23 79 15 79V33C23 33 42 36 50 39C58 36 77 33 85 33V79C77 79 58 82 50 82Z" />
                <path d="M50 39V82" />
                <path d="M42 56 C36 56, 34 48, 38 42 C35 36, 42 30, 50 34 C58 30, 65 36, 62 42 C66 48, 64 56, 58 56 C58 59, 42 59, 42 56 Z" fill="none" />
                <path d="M50 34 C49 39, 49 46, 50 51" />
                <path d="M45 42 C47 43, 49 41, 50 41" />
                <path d="M55 42 C53 43, 51 41, 50 41" />
              </svg>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-serif font-extrabold text-lg sm:text-lg text-slate-800 tracking-tight leading-none">
                  Miss. Daiane
                </span>
                <span className="font-sans text-[9px] uppercase tracking-wider text-rose-500 font-extrabold bg-rose-50 px-1.5 py-0.5 rounded-md">
                  Terapeuta Emocional
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-bold mt-1 leading-none">
                {customSceneTitle || 'Investigação Clínica'} • {customPatientName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              id="btn-settings"
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
              title="Configurar Telefone de Destino"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="bg-slate-100 p-1.5 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setActiveTab('form')}
                id="tab-btn-form"
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'form'
                    ? 'bg-white text-slate-800 shadow-3xs'
                    : 'text-slate-500 hover:text-slate-850'
                }`}
              >
                Gabarito Clínico
              </button>
              <button
                onClick={() => setActiveTab('history')}
                id="tab-btn-history"
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-white text-slate-800 shadow-3xs'
                    : 'text-slate-500 hover:text-slate-850'
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
        <div className="bg-slate-100 border-b border-slate-200 py-4 shadow-inner" id="config-panel">
          <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contato da Terapeuta Daiane
              </span>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Insira o celular com DDI + DDD para o envio de prontuários em tempo real.
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
                  className="w-full pl-11 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:outline-hidden font-bold"
                />
              </div>
              <button
                onClick={() => setShowConfig(false)}
                id="btn-close-config"
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 mt-6">
        {/* Therapist Welcome Widget with Integrated Dynamic Model Switcher */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden mb-6">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none select-none">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <circle cx="80" cy="50" r="40" />
            </svg>
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/15 border border-rose-500/10 rounded-full text-xs font-bold tracking-wide text-rose-400 uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Mapeamento Clínico • Paciente: {customPatientName}
              </div>
              <span className="font-sans text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-slate-350">
                Modelo Ativo: {CLINICAL_PRESETS.find(p => p.id === selectedModelId)?.name.split(' • ')[0]}
              </span>
            </div>

            <h2 className="font-serif font-extrabold text-lg sm:text-2xl leading-tight">
              {customSceneTitle || 'Investigação Clínica Emocional'}
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed max-w-4xl">
              {customWelcomeText || 'Gabarito confidencial guiando nosso processo de mapeamento emocional, trazendo à luz feridas de infância e permitindo integrá-las de modo seguro e definitivo.'}
            </p>

            <div className="bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 text-[11px] sm:text-xs text-rose-350/90 leading-relaxed max-w-4xl">
              💡 <b>Garantia de Neutralidade de Tela:</b> Como preconizado pela terapeuta {customTherapistName}, todos os indicadores de trauma e reações físicas iniciam <b>completamente limpos e desmarcados</b>. A tomada de escolha é estritamente neutra e realizada pelo paciente.
            </div>


          </div>
        </div>

        {/* Workspace core layouts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel Questionnaire */}
          <div className="lg:col-span-12 bg-white p-5 md:p-7 rounded-3xl border border-slate-200/80 shadow-3xs space-y-6">
            
            {/* Header controls inside form */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-150">
              <div>
                <h3 className="font-bold text-slate-800 text-sm md:text-base">
                  {activeTab === 'form' ? 'Questionário Clínico Integrado' : 'Histórico de Registros Locais'}
                </h3>
                {activeTab === 'form' && (
                  <p className="text-[11px] text-slate-400 font-medium">
                    Preenchimento contínuo de todas as seções clínicas
                  </p>
                )}
              </div>
              {activeTab === 'form' && (
                <button
                  onClick={handleResetForm}
                  id="btn-reset-form"
                  className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 py-1 px-2.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  Zerar Respostas
                </button>
              )}
            </div>

            {activeTab === 'form' ? (
              <div className="space-y-6" id="form-container">
                
                {/* Horizontal steps tabs list - acts as direct anchor selectors */}
                <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
                  {stepsList.map((st) => (
                    <button
                      key={st.num}
                      type="button"
                      onClick={() => scrollToSection(st.num)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        currentStep === st.num
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      {st.num}. {st.title}
                    </button>
                  ))}
                </div>

                {/* --- CONTINUOUS SCROLL CONTAINER WITH SCROLLBAR --- */}
                <div
                  id="continuous-questions-scroll-container"
                  onScroll={handleScroll}
                  className="max-h-[640px] overflow-y-auto pr-3.5 space-y-10 scroll-smooth custom-scrollbar pb-6"
                >

                  {/* STEP 1: ANTES DE ENTRAR NA CENA */}
                  <div className="space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs scroll-mt-2" id="secao-1">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-rose-100">
                      <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 font-extrabold text-[12px] flex items-center justify-center font-sans shrink-0">1</span>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider font-sans leading-none mt-0.5">Antes de Entrar na Cena</h4>
                    </div>

                    <div className="bg-rose-50/50 border border-rose-100/40 p-4 rounded-2xl flex gap-3 text-xs leading-relaxed text-rose-800">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <b>Antes de re-observarmos a memória física:</b> Avaliaremos o impacto somatossensorial e a intensidade residual que a lembrança retém em você atualmente antes de descascarmos as camadas adjacentes.
                      </div>
                    </div>

                    {/* Question 1: notaCena */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-slate-700 leading-relaxed">
                        1. Quando você lembra dessa cena hoje, qual nota ela tem de 0 a 10?
                      </label>
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-2xl border border-slate-200 gap-1 overflow-x-auto">
                        {Array.from({ length: 11 }).map((_, score) => {
                          const isSelected = notaCena === score;
                          return (
                            <button
                              key={score}
                              type="button"
                              id={`score-btn-${score}`}
                              onClick={() => setNotaCena(score)}
                              className={`w-9 h-9 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 flex items-center justify-center cursor-pointer shrink-0 ${
                                isSelected
                                  ? score >= 8
                                    ? 'bg-rose-600 text-white shadow-3xs ring-2 ring-rose-200'
                                    : score >= 5
                                    ? 'bg-amber-500 text-white shadow-3xs ring-2 ring-amber-200'
                                    : score >= 2
                                    ? 'bg-blue-600 text-white shadow-3xs ring-2 ring-blue-250'
                                    : 'bg-emerald-600 text-white shadow-3xs ring-2 ring-emerald-200'
                                  : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 font-semibold'
                              }`}
                            >
                              {score}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
                        <span>0 - SEM INCÔMODO</span>
                        <span>5 - MODERADO</span>
                        <span>10 - INTENSIDADE MÁXIMA</span>
                      </div>
                    </div>

                    {/* Question 2: sentePrimeiro */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-705">
                        2. O que você sente primeiro quando lembra dela?
                      </label>
                      <input
                        type="text"
                        id="sente-primeiro-input"
                        value={sentePrimeiro}
                        onChange={(e) => setSentePrimeiro(e.target.value)}
                        placeholder="Ex: Nó na garganta, angústia extrema, falta de ar, injustiça..."
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-300 bg-white"
                      />
                    </div>

                    {/* Question 3: senteCorpo & SensationSelector mapper */}
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      <SensationSelector
                        selectedParts={corpoReage}
                        onChange={setCorpoReage}
                      />

                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Informações adicionais do local do corpo onde sente (Opcional):
                        </label>
                        <input
                          type="text"
                          id="sente-corpo-input"
                          value={senteCorpo}
                          onChange={(e) => setSenteCorpo(e.target.value)}
                          placeholder="Ex: Aperto em cima do peito ao lado direito; asfixia real profunda..."
                          className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-200 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* STEP 2: ENTRANDO NA CENA */}
                  <div className="space-y-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs scroll-mt-2" id="secao-2">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-rose-100">
                      <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 font-extrabold text-[12px] flex items-center justify-center font-sans shrink-0">2</span>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider font-sans leading-none mt-0.5">Entrando na Cena</h4>
                    </div>

                    {/* Question 4: idadeCena */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-705">
                        4. Quantos anos você tinha na época desse acontecimento?
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(CLINICAL_PRESETS.find(p => p.id === selectedModelId)?.suggestedAges || ['6 anos', '8 anos', '10 anos', '12 anos', '15 anos']).map((age) => (
                          <button
                            key={age}
                            type="button"
                            onClick={() => setIdadeCena(age)}
                            className={`px-3 py-1.5 text-xs rounded-xl border font-bold cursor-pointer transition-all ${
                              idadeCena === age
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {age}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        id="idade-cena-input"
                        value={idadeCena}
                        onChange={(e) => setIdadeCena(e.target.value)}
                        placeholder="Insira a idade ou outra informação de período..."
                        className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden bg-white"
                      />
                    </div>

                    {/* Question 5: antesEnforcamento */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">
                        {customQ5Label || '5. O que aconteceu antes? (Contexto)'}
                      </label>
                      <textarea
                        id="antes-enforcamento-textarea"
                        rows={3}
                        value={antesEnforcamento}
                        onChange={(e) => setAntesEnforcamento(e.target.value)}
                        placeholder={customQ5Placeholder || "Relate o que disparou o castigo ou o confronto: brincadeiras, discussões, quebra de objetos..."}
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden leading-relaxed bg-white"
                      />
                    </div>

                    {/* Question 6: pensamentoMomento */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">
                        6. O que você estava pensando naquele momento exato?
                      </label>
                      <textarea
                        id="pensamento-momento-textarea"
                        rows={3}
                        value={pensamentoMomento}
                        onChange={(e) => setPensamentoMomento(e.target.value)}
                        placeholder="Pensamento no momento exato. Ex: 'Por que ele está fazendo isso?', 'Não vou aguentar respirar', 'Estou sozinho e vulnerável'..."
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden leading-relaxed bg-white"
                      />
                    </div>

                    {/* Question 7: piorParteCena */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">
                        7. Qual foi a pior parte da cena?
                      </label>
                      <textarea
                        id="pior-parte-cena-textarea"
                        rows={3}
                        value={piorParteCena}
                        onChange={(e) => setPiorParteCena(e.target.value)}
                        placeholder="O ápice do pavor ou da vergonha..."
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden leading-relaxed bg-white"
                      />
                    </div>

                    {/* Question 8: maisDoeu */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <label className="block text-sm font-bold text-slate-705">
                        8. O que mais doeu em você naquele momento? (Marque todos que aplicar)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentMaisDoeuOptions.map((opt) => {
                          const isSelected = maisDoeu.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                if (maisDoeu.includes(opt)) {
                                  setMaisDoeu(maisDoeu.filter(o => o !== opt));
                                } else {
                                  setMaisDoeu([...maisDoeu, opt]);
                                }
                              }}
                              className={`p-3.5 rounded-xl border text-[13px] font-bold text-left transition-all relative flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-rose-50 border-rose-450 text-rose-900 border-2'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <span>{opt}</span>
                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                                isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isSelected && (
                                  <svg className="w-2.5 h-2.5 text-white stroke-[3] fill-none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Outra coisa text input */}
                      {maisDoeu.includes('Outra coisa?') && (
                        <div className="mt-2 animate-fade-in space-y-2">
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Especifique o que mais machucou naquele momento:
                          </label>
                          <input
                            type="text"
                            id="mais-doeu-outro"
                            value={maisDoeuOutro}
                            onChange={(e) => setMaisDoeuOutro(e.target.value)}
                            placeholder="Ex: O silêncio da minha família assistindo sem intervir..."
                            className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-rose-200 focus:outline-hidden bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* STEP 3: EMOÇÕES */}
                  <div className="space-y-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs scroll-mt-2" id="secao-3">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-rose-100">
                      <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 font-extrabold text-[12px] flex items-center justify-center font-sans shrink-0">3</span>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider font-sans leading-none mt-0.5">Suas Emoções</h4>
                    </div>

                    {/* Question 9: sentiuMomento */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">
                        9. O que você sentiu naquele momento no seu íntimo? (Sentimentos)
                      </label>
                      <div className="flex flex-wrap gap-2 py-1">
                        {PRESET_EMOTIONS.map((emotion) => (
                          <button
                            key={emotion.label}
                            type="button"
                            onClick={() => {
                              const currentVal = sentiuMomento;
                              if (!currentVal.includes(emotion.label)) {
                                setSentiuMomento(currentVal ? `${currentVal}, ${emotion.label}` : emotion.label);
                              }
                            }}
                            className={`px-3 py-1 text-xs rounded-xl border focus:outline-hidden hover:scale-105 active:scale-95 transition-all text-[11px] font-bold ${emotion.color} cursor-pointer`}
                          >
                            + {emotion.label}
                          </button>
                        ))}
                      </div>
                      <textarea
                        id="sentiu-momento-textarea"
                        rows={3}
                        value={sentiuMomento}
                        onChange={(e) => setSentiuMomento(e.target.value)}
                        placeholder="Assinale os sentimentos acima para somar ou relate com suas próprias palavras..."
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden leading-relaxed bg-white"
                      />
                    </div>

                    <div className="pt-2 space-y-5">
                      {/* Question 10: sentiuMedo */}
                      <IntensitySelector
                        label="10. Você sentiu medo?"
                        value={sentiuMedo}
                        onChange={setSentiuMedo}
                        options={['Alta', 'Média', 'Baixa', 'Nenhuma']}
                        iconType="medo"
                      />

                      {/* Question 11: sentiuRaiva */}
                      <IntensitySelector
                        label="11. Você sentiu raiva?"
                        value={sentiuRaiva}
                        onChange={setSentiuRaiva}
                        options={['Alta', 'Média', 'Baixa', 'Nenhuma']}
                        iconType="raiva"
                      />

                      {/* Question 12: sentiuTristeza */}
                      <IntensitySelector
                        label="12. Você sentiu tristeza?"
                        value={sentiuTristeza}
                        onChange={setSentiuTristeza}
                        options={['Alta', 'Média', 'Baixa', 'Nenhuma']}
                        iconType="tristeza"
                      />

                      {/* Question 13: sentiuInjustica */}
                      <IntensitySelector
                        label="13. Você sentiu injustiça?"
                        value={sentiuInjustica}
                        onChange={setSentiuInjustica}
                        options={['Alta', 'Média', 'Baixa', 'Nenhuma']}
                        iconType="injustica"
                      />

                      {/* Question 14: emocaoMaisForte */}
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700">
                          14. Qual dessas emoções era a mais forte naquele exato momento do trauma?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {['Medo', 'Raiva', 'Tristeza', 'Injustiça', 'Nenhuma'].map((emo) => {
                            const isChosen = emocaoMaisForte === emo;
                            return (
                              <button
                                key={emo}
                                type="button"
                                onClick={() => setEmocaoMaisForte(emo)}
                                className={`px-3 py-3 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                                  isChosen
                                    ? 'bg-rose-500 border-rose-500 text-white shadow-3xs'
                                    : 'bg-white border-slate-250 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {emo === 'Medo' ? '😨 Medo' : emo === 'Raiva' ? '😡 Raiva' : emo === 'Tristeza' ? '😢 Tristeza' : emo === 'Injustiça' ? '⚖️ Injustiça' : '🕊️ Nenhuma'}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STEP 4: O QUE FICOU GUARDADO */}
                  <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs scroll-mt-2" id="secao-4">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-rose-100">
                      <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 font-extrabold text-[12px] flex items-center justify-center font-sans shrink-0">4</span>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider font-sans leading-none mt-0.5">O que ficou Guardado</h4>
                    </div>

                    {/* Question 15: queriaDizer */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-705">
                        15. O que você queria dizer e não conseguiu / não teve forças naquele momento?
                      </label>
                      <textarea
                        id="queria-dizer-textarea"
                        rows={3}
                        value={queriaDizer}
                        onChange={(e) => setQueriaDizer(e.target.value)}
                        placeholder="As palavras sufocadas: 'Eu sou apenas uma criança', 'Me perdoa', 'Por que você está agindo assim?'..."
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden leading-relaxed bg-white"
                      />
                    </div>

                    {/* Question 16: paiTivesseFeito */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">
                        {customQ16Label || '16. O que você gostaria que tivessem feito em seu lugar?'}
                      </label>
                      <textarea
                        id="pai-tivesse-feito-textarea"
                        rows={3}
                        value={paiTivesseFeito}
                        onChange={(e) => setPaiTivesseFeito(e.target.value)}
                        placeholder={customQ16Placeholder || "Ex: Que me apoiassem, ensinassem com paciência, mostrassem carinho..."}
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden leading-relaxed bg-white"
                      />
                    </div>

                    {/* Question 17: precisavaOuvir */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">
                        17. O que você mais precisava ouvir naquele doloroso momento?
                      </label>
                      <textarea
                        id="precisava-ouvir-textarea"
                        rows={3}
                        value={precisavaOuvir}
                        onChange={(e) => setPrecisavaOuvir(e.target.value)}
                        placeholder="Mensagem restauradora: 'Calma, você está seguro', 'Isso vai passar', 'Não foi culpa sua'..."
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden leading-relaxed bg-white"
                      />
                    </div>

                    {/* Question 18: presoCoracao */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">
                        18. O que ficou de fato preso dentro do seu coração desde aquele dia?
                      </label>
                      <textarea
                        id="preso-coracao-textarea"
                        rows={3}
                        value={presoCoracao}
                        onChange={(e) => setPresoCoracao(e.target.value)}
                        placeholder="Aquela ferida crônica que ficou trancada por anos no fundo do peito..."
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden leading-relaxed bg-white"
                      />
                    </div>
                  </div>

                  {/* STEP 5: A CRENÇA */}
                  <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs scroll-mt-2" id="secao-5">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-rose-100">
                      <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 font-extrabold text-[12px] flex items-center justify-center font-sans shrink-0">5</span>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider font-sans leading-none mt-0.5">Crenças Formadas</h4>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-500 leading-relaxed gap-2.5 flex items-start">
                      <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>
                        <b>A crença inconsciente:</b> No momento de um sofrimento agudo, a mente de uma criança cria "verdades absolutas" para sobreviver. Elas moldam os comportamentos de toda a vida adulta.
                      </span>
                    </div>

                    {/* Question 19: aprendeuSobreVoce */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">
                        19. O que você aprendeu sobre você após aquele dia? (Ex: 'Eu sou culpado por tudo')
                      </label>
                      <input
                        type="text"
                        id="aprendeu-sobre-voce"
                        value={aprendeuSobreVoce}
                        onChange={(e) => setAprendeuSobreVoce(e.target.value)}
                        placeholder="Crenças geradas. Ex: 'Eu não sou digno de ser ouvido', 'Se eu errar, sou descartado'..."
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden bg-white"
                      />
                    </div>

                    {/* Question 20: aprendeuSobrePai */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-705">
                        {customQ20Label || '20. O que você aprendeu sobre o seu pai naquele dia do enforcamento?'}
                      </label>
                      <input
                        type="text"
                        id="aprendeu-sobre-pai"
                        value={aprendeuSobrePai}
                        onChange={(e) => setAprendeuSobrePai(e.target.value)}
                        placeholder={customQ20Placeholder || "Ex: 'Ele é instável', 'Não posso confiar', 'O amor dói'..."}
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden bg-white"
                      />
                    </div>

                    {/* Question 21: aprendeuSobrePessoas */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">
                        21. O que você aprendeu sobre as pessoas de modo geral ?
                      </label>
                      <input
                        type="text"
                        id="aprendeu-sobre-pessoas"
                        value={aprendeuSobrePessoas}
                        onChange={(e) => setAprendeuSobrePessoas(e.target.value)}
                        placeholder="Ex: 'As pessoas vão me julgar e calar', 'Ninguém vai me socorrer no perigo'..."
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden bg-white"
                      />
                    </div>

                    {/* Question 22: mudouDentro */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">
                        22. Depois dessa traumática situação, algo mudou na sua essência / dentro de você?
                      </label>
                      <textarea
                        id="mudou-dentro-textarea"
                        rows={3}
                        value={mudouDentro}
                        onChange={(e) => setMudouDentro(e.target.value)}
                        placeholder="Descreva mudanças de personalidade em silêncio, retração, desconfiança ou ansiedade..."
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden leading-relaxed bg-white"
                      />
                    </div>
                  </div>

                  {/* STEP 6: A VOZ QUE FOI CALADA */}
                  <div className="space-y-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs scroll-mt-2" id="secao-6">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-rose-100">
                      <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 font-extrabold text-[12px] flex items-center justify-center font-sans shrink-0">6</span>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider font-sans leading-none mt-0.5">A Voz Calada</h4>
                    </div>

                    {/* Question 23: tentouExplicar */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">
                        23. Você tentou se explicar ou justificar o ocorrido no momento?
                      </label>
                      <div className="flex gap-2">
                        {['Sim', 'Não', 'Tentei mas me calaram com violência'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setTentouExplicar(opt)}
                            className={`flex-1 px-3 py-3 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer transition-all ${
                              tentouExplicar === opt
                                ? 'bg-rose-50 border-rose-500 text-rose-800 border-2'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        id="tentou-explicar"
                        value={tentouExplicar}
                        onChange={(e) => setTentouExplicar(e.target.value)}
                        placeholder="Ou escreva com seus termos..."
                        className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-rose-250 focus:outline-hidden bg-white"
                      />
                    </div>

                    {/* Question 24: ninguemQuisOuvir */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">
                        24. Você sentiu que ninguém quis de fato ouvir a sua versão do que houve?
                      </label>
                      <div className="flex gap-2">
                        {['Totalmente', 'Um pouco', 'Não, me ouviram'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setNinguemQuisOuvir(opt)}
                            className={`flex-1 px-3 py-3 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer transition-all ${
                              ninguemQuisOuvir === opt
                                ? 'bg-rose-50 border-rose-500 text-rose-800 border-2'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        id="ninguem-quis-ouvir"
                        value={ninguemQuisOuvir}
                        onChange={(e) => setNinguemQuisOuvir(e.target.value)}
                        placeholder="Como foi a reação do entorno familiar..."
                        className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-rose-250 focus:outline-hidden bg-white"
                      />
                    </div>

                    {/* Question 25: quandoMandamCalar */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700">
                        25. Como é para você hoje no presente quando mandam você ficar calado?
                      </label>
                      <textarea
                        id="quando-mandam-calar-textarea"
                        rows={3}
                        value={quandoMandamCalar}
                        onChange={(e) => setQuandoMandamCalar(e.target.value)}
                        placeholder="Ex: Dispara pânico físico, me sinto humilhado, sinto vontade de chorar imediatamente, dá uma raiva incontrolável..."
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden leading-relaxed bg-white"
                      />
                    </div>

                    {/* Question 26: primeiraVezNaoAcreditava */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-705">
                        26. Qual foi a primeira vez que você sentiu que de fato ninguém acreditava em você?
                      </label>
                      <textarea
                        id="primeira-vez-nao-acreditava-textarea"
                        rows={3}
                        value={primeiraVezNaoAcreditava}
                        onChange={(e) => setPrimeiraVezNaoAcreditava(e.target.value)}
                        placeholder="Se foi nesse dia ou se remonta a algum acontecimento anterior da juventude ou infância..."
                        className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden leading-relaxed bg-white"
                      />
                    </div>
                  </div>

                  {/* STEP 7: EXERCÍCIO DO CORAÇÃO */}
                  <div className="space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs scroll-mt-2" id="secao-7">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-rose-100">
                      <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 font-extrabold text-[12px] flex items-center justify-center font-sans shrink-0">7</span>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider font-sans leading-none mt-0.5">Exercício do Coração</h4>
                    </div>

                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex gap-3 text-slate-705 text-xs sm:text-sm italic font-sans leading-relaxed">
                      <Heart className="w-5 h-5 text-rose-500 animate-pulse shrink-0 mt-0.5" />
                      <span>
                        <b>Exercício Clínico de Integração:</b> Feche os olhos por alguns instantes, respire profundamente de forma lenta... {customHeartExerciseContext || 'deite o foco na ferida do enforcamento na adolescência de Thiago'}, e complete com sua primeira intuição sem pensar:
                      </span>
                    </div>

                    {/* Exercicio 1: exercicioPrecisava */}
                    <div className="space-y-2 bg-rose-50/20 p-4 border rounded-3xl border-dashed">
                      <label className="block font-sans text-sm font-bold text-slate-700 mb-1">
                        ✨ "Naquele dia eu precisava de..."
                      </label>
                      <input
                        type="text"
                        id="exercicio-precisava"
                        value={exercicioPrecisava}
                        onChange={(e) => setExercicioPrecisava(e.target.value)}
                        placeholder="Complete a frase intimamente..."
                        className="w-full rounded-xl border border-slate-250 bg-white p-3 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden italic"
                      />
                    </div>

                    {/* Exercicio 2: exercicioQueriaDizer */}
                    <div className="space-y-2 bg-rose-50/20 p-4 border rounded-3xl border-dashed">
                      <label className="block font-sans text-sm font-bold text-slate-700 mb-1">
                        ✨ "Naquele dia eu queria dizer..."
                      </label>
                      <input
                        type="text"
                        id="exercicio-queria-dizer"
                        value={exercicioQueriaDizer}
                        onChange={(e) => setExercicioQueriaDizer(e.target.value)}
                        placeholder="Complete a frase intimamente..."
                        className="w-full rounded-xl border border-slate-250 bg-white p-3 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden italic animate-none"
                      />
                    </div>

                    {/* Exercicio 3: exercicioMaisMachuca */}
                    <div className="space-y-2 bg-rose-50/20 p-4 border rounded-3xl border-dashed">
                      <label className="block font-sans text-sm font-bold text-slate-700 mb-1">
                        ✨ "Até hoje o que mais me machuca é..."
                      </label>
                      <input
                        type="text"
                        id="exercicio-mais-machuca"
                        value={exercicioMaisMachuca}
                        onChange={(e) => setExercicioMaisMachuca(e.target.value)}
                        placeholder="Complete a frase intimamente..."
                        className="w-full rounded-xl border border-slate-250 bg-white p-3 text-sm focus:ring-2 focus:ring-rose-300 focus:outline-hidden italic animate-none"
                      />
                    </div>
                  </div>

                  {/* STEP 8: PERGUNTA FINAL */}
                  <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs scroll-mt-2" id="secao-8">
                    <div className="flex items-center gap-2 pb-2.5 border-b border-rose-100">
                      <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 font-extrabold text-[12px] flex items-center justify-center font-sans shrink-0">8</span>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm uppercase tracking-wider font-sans leading-none mt-0.5">Frase de Acolhimento</h4>
                    </div>

                    {/* Question 27: mensagemThiagoPassado */}
                    <div className="space-y-4 border-2 border-rose-300 border-dashed bg-rose-50/15 p-5 sm:p-6 rounded-3xl">
                      <div className="flex items-center gap-2 text-slate-800">
                        <Smile className="w-6 h-6 text-rose-500 animate-pulse" />
                        <span className="font-serif font-extrabold text-sm sm:text-base leading-relaxed text-slate-900 block">
                          Pergunta final de Acolhimento Restaurador
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                        {customQ27Label || `Imagine que aquele Thiago adolescente daquele terrível dia do enforcamento está exatamente agora sentado bem na sua frente. Ele está te escutando com olhos curiosos e atentos... O que você diria para confortá-lo hoje, com a sabedoria e voz que você conquistou?`}
                      </p>
                      <textarea
                        id="mensagem-thiago-passado-textarea"
                        rows={5}
                        value={mensagemThiagoPassado}
                        onChange={(e) => setMensagemThiagoPassado(e.target.value)}
                        placeholder={customQ27Placeholder || "Abra seu coração por inteiro. Ofereça proteção, valide que não foi culpa dele, liberte-o daquela asfixia..."}
                        className="w-full rounded-2xl border border-rose-300 bg-white p-4 text-sm focus:outline-hidden focus:ring-4 focus:ring-rose-500/10 focus:border-rose-450 italic leading-relaxed"
                      />
                    </div>
                  </div>

                </div>

                {/* Clinical Actions Bar - Both Guardar and Direct Dispatch */}
                <div className="pt-6 border-t border-slate-150 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Revisou tudo? Role para cima se desejar alterar alguma resposta antes de salvar.
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleSaveSession}
                      disabled={saving}
                      className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 border border-slate-200 hover:border-slate-350 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
                    >
                      <Save className="w-4 h-4 text-white" />
                      {saving ? 'Arquivando...' : 'Guardar no Histórico'}
                    </button>

                    <button
                      onClick={() => handleSendWhatsApp({
                        notaCena, sentePrimeiro, senteCorpo, corpoReage, idadeCena, antesEnforcamento, pensamentoMomento, piorParteCena, maisDoeu, maisDoeuOutro, sentiuMomento, sentiuMedo, sentiuRaiva, sentiuTristeza, sentiuInjustica, emocaoMaisForte, queriaDizer, paiTivesseFeito, precisavaOuvir, presoCoracao, aprendeuSobreVoce, aprendeuSobrePai, aprendeuSobrePessoas, mudouDentro, tentouExplicar, ninguemQuisOuvir, quandoMandamCalar, primeiraVezNaoAcreditava, exercicioPrecisava, exercicioQueriaDizer, exercicioMaisMachuca, mensagemThiagoPassado
                      })}
                      id="btn-whatsapp-send"
                      className="px-6 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-emerald-500/15 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Send className="w-5 h-5 fill-white text-emerald-500 animate-pulse" />
                      Enviar à Terapeuta
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* HISTORY VIEW PANEL */
              <div className="space-y-4">
                <SessionHistory
                  sessions={history}
                  onDeleteSession={handleDeleteSession}
                  onSelectSession={setSelectedHistorySession}
                  onSendWhatsApp={handleSendWhatsApp}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Global Page Footer with Patient Support */}
      <footer className="max-w-6xl mx-auto px-4 mt-8 pb-12">
        <div className="bg-amber-50/60 border border-amber-100 p-5 rounded-2xl text-amber-900 leading-relaxed shadow-3xs">
          <div className="flex items-center gap-1.5 text-amber-800 mb-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider font-sans">
              Suporte ao Paciente
            </span>
          </div>
          <p className="text-[11px] font-medium text-amber-700/90 leading-relaxed">
            "{customPatientName}, olhar para recordações dolorosas do passado pode despertar fortes sensações de angústia. Se sentir reações somáticas ativas agora, tire as mãos do teclado, note seus pés tocando o solo firme do presente e respire lentamente. Você está totalmente seguro hoje."
          </p>
        </div>
      </footer>

      {/* DETAILED DIALOG MODAL FOR ARCHIVED PAST SESSIONS */}
      {selectedHistorySession && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
          id="detail-modal"
          onClick={() => setSelectedHistorySession(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  Sessão Arquivada
                </div>
                <h3 className="font-serif font-extrabold text-slate-900 text-base sm:text-lg">
                  Avaliação do Dia: {new Date(selectedHistorySession.date).toLocaleString('pt-BR', {
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
                className="p-1.5 hover:bg-slate-150 rounded-xl text-slate-400 hover:text-slate-650 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scroll Box */}
            <div className="space-y-5 text-xs sm:text-sm leading-relaxed" id="modal-answers-content">
              
              {/* Quick indicators bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center text-[11px] font-bold text-slate-600">
                <div>
                  <span className="text-[9px] text-slate-350 block uppercase tracking-wide">Força / Nota</span>
                  <span className="text-rose-600 font-extrabold text-xs sm:text-sm">{selectedHistorySession.notaCena !== null ? `${selectedHistorySession.notaCena}/10` : '-'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-350 block uppercase tracking-wide">Medo</span>
                  <span className="text-slate-800 text-xs sm:text-sm">{selectedHistorySession.sentiuMedo || '🚫'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-350 block uppercase tracking-wide">Raiva</span>
                  <span className="text-slate-800 text-xs sm:text-sm">{selectedHistorySession.sentiuRaiva || '🚫'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-350 block uppercase tracking-wide">Tristeza</span>
                  <span className="text-slate-800 text-xs sm:text-sm">{selectedHistorySession.sentiuTristeza || '🚫'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-350 block uppercase tracking-wide">Injustiça</span>
                  <span className="text-slate-800 text-xs sm:text-sm">{selectedHistorySession.sentiuInjustica || '🚫'}</span>
                </div>
              </div>

              {/* Trauma Detail Boxes */}
              <div className="space-y-4">
                
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
                  <span className="text-[10px] font-bold text-red-500 uppercase block mb-1">🔴 Antes de Entrar na Cena</span>
                  <p className="text-xs text-slate-700"><b>O que sente primeiro:</b> {selectedHistorySession.sentePrimeiro || <em className="text-slate-350">Sem resposta</em>}</p>
                  <p className="text-xs text-slate-700 mt-1"><b>Localização no corpo:</b> {selectedHistorySession.senteCorpo || <em className="text-slate-350">Sem resposta</em>}</p>
                  {selectedHistorySession.corpoReage && selectedHistorySession.corpoReage.length > 0 && (
                    <p className="text-[10px] font-bold text-red-700 mt-1 uppercase">Somatossensório: {selectedHistorySession.corpoReage.join(', ')}</p>
                  )}
                </div>

                <div className="p-3 bg-rose-50/30 rounded-xl border border-rose-100">
                  <span className="text-[10px] font-bold text-rose-500 uppercase block mb-1">🟠 Entrando na Cena (Idade: {selectedHistorySession.idadeCena || '?'})</span>
                  <p className="text-xs text-slate-700"><b>O que houve antes:</b> {selectedHistorySession.antesEnforcamento || <em className="text-slate-350">Sem resposta</em>}</p>
                  <p className="text-xs text-slate-700 mt-1.5"><b>Pensamento no momento:</b> {selectedHistorySession.pensamentoMomento || <em className="text-slate-350">Sem resposta</em>}</p>
                  <p className="text-xs text-slate-700 mt-1.5"><b>Pior parte dela:</b> {selectedHistorySession.piorParteCena || <em className="text-slate-350">Sem resposta</em>}</p>
                  <p className="text-xs text-slate-700 mt-1.5"><b>O que mais doeu:</b> {selectedHistorySession.maisDoeu?.join(', ')} {selectedHistorySession.maisDoeuOutro && `(Outro: ${selectedHistorySession.maisDoeuOutro})`}</p>
                </div>

                <div className="p-3 bg-indigo-50/25 rounded-xl border border-indigo-100/50">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase block mb-1">🟡 Emoções & Sentimentos</span>
                  <p className="text-xs text-slate-700"><b>Sentimento íntimo geral:</b> {selectedHistorySession.sentiuMomento || <em className="text-slate-350">Sem resposta</em>}</p>
                  <p className="text-xs text-slate-750 font-bold mt-1.5">🚀 Emoção mais marcante calculada: {selectedHistorySession.emocaoMaisForte || 'Nenhuma registrada'}</p>
                </div>

                <div className="p-3 bg-amber-50/20 rounded-xl border border-amber-100/50">
                  <span className="text-[10px] font-bold text-amber-600 uppercase block mb-1">💚 Recônditos do Coração</span>
                  <p className="text-xs text-slate-700"><b>O que queria e não conseguiu dizer:</b> {selectedHistorySession.queriaDizer || <em className="text-slate-350">Sem resposta</em>}</p>
                  <p className="text-xs text-slate-700 mt-1.5"><b>O que gostaria que o pai fizesse:</b> {selectedHistorySession.paiTivesseFeito || <em className="text-slate-350">Sem resposta</em>}</p>
                  <p className="text-xs text-slate-700 mt-1.5"><b>Mensagem reparadora que faltou ouvir:</b> {selectedHistorySession.precisavaOuvir || <em className="text-slate-350">Sem resposta</em>}</p>
                  <p className="text-xs text-slate-700 mt-1.5"><b>O que ficou preso no coração:</b> {selectedHistorySession.presoCoracao || <em className="text-slate-350">Sem resposta</em>}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">⚙️ Crenças Geradas do Abuso</span>
                  <p className="text-xs text-slate-700"><b>Sobre si mesmo:</b> {selectedHistorySession.aprendeuSobreVoce || <em className="text-slate-350">Sem resposta</em>}</p>
                  <p className="text-xs text-slate-700 mt-1.5"><b>Sobre o pai:</b> {selectedHistorySession.aprendeuSobrePai || <em className="text-slate-350">Sem resposta</em>}</p>
                  <p className="text-xs text-slate-700 mt-1.5"><b>Sobre as pessoas em geral:</b> {selectedHistorySession.aprendeuSobrePessoas || <em className="text-slate-350">Sem resposta</em>}</p>
                  <p className="text-xs text-slate-700 mt-1.5"><b>Mudança estrutural íntima:</b> {selectedHistorySession.mudouDentro || <em className="text-slate-350">Sem resposta</em>}</p>
                </div>

                <div className="p-3 bg-purple-50/35 rounded-xl border border-purple-100/50">
                  <span className="text-[10px] font-bold text-purple-600 uppercase block mb-1">🟣 Expressão e a Voz Calada</span>
                  <p className="text-xs text-slate-700"><b>Se tentou se explicar:</b> {selectedHistorySession.tentouExplicar || <em className="text-slate-350">Sem resposta</em>}</p>
                  <p className="text-xs text-slate-700 mt-1.5"><b>Se sentiu desamparado de escuta:</b> {selectedHistorySession.ninguemQuisOuvir || <em className="text-slate-350">Sem resposta</em>}</p>
                  <p className="text-xs text-slate-700 mt-1.5"><b>Atitudes hoje quando te mandam calar:</b> {selectedHistorySession.quandoMandamCalar || <em className="text-slate-350">Sem resposta</em>}</p>
                  <p className="text-xs text-slate-700 mt-1.5"><b>Origem primordial de não acreditarem:</b> {selectedHistorySession.primeiraVezNaoAcreditava || <em className="text-slate-350">Sem resposta</em>}</p>
                </div>

                <div className="p-4 bg-rose-50 rounded-2xl border-2 border-rose-100/60 font-serif italic text-slate-900">
                  <span className="text-[10px] font-bold text-rose-500 uppercase block mb-1.5 font-sans not-italic">💖 Exercícios de Regeneração</span>
                  <p className="text-[13px] leading-relaxed"><b>"Naquele dia eu precisava de..."</b> <br />👉 {selectedHistorySession.exercicioPrecisava || <em className="text-slate-350 font-sans not-italic">Sem resposta</em>}</p>
                  <p className="text-[13px] leading-relaxed mt-2"><b>"Naquele dia eu queria dizer..."</b> <br />👉 {selectedHistorySession.exercicioQueriaDizer || <em className="text-slate-350 font-sans not-italic">Sem resposta</em>}</p>
                  <p className="text-[13px] leading-relaxed mt-2"><b>"Até hoje o que mais me machuca é..."</b> <br />👉 {selectedHistorySession.exercicioMaisMachuca || <em className="text-slate-350 font-sans not-italic">Sem resposta</em>}</p>
                </div>

                <div className="p-5 bg-gradient-to-r from-slate-800 to-slate-950 rounded-3xl border text-white font-serif italic leading-relaxed">
                  <span className="text-[10px] font-bold text-rose-400 uppercase block mb-1.5 font-sans not-italic">💬 Palavra Final de Acolhimento a {selectedHistorySession.modelPatientName || 'Thiago'}</span>
                  <p className="text-[13.5px] font-medium font-serif leading-relaxed text-rose-50">
                    "{selectedHistorySession.mensagemThiagoPassado || <em className="text-slate-500 font-sans not-italic">Sem resposta</em>}"
                  </p>
                </div>

              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                id="modal-btn-copy"
                onClick={() => handleCopyToClipboard(selectedHistorySession)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition-colors"
              >
                {copied ? 'Prontuário Copiado!' : 'Copiar Prontuário'}
              </button>
              <button
                type="button"
                id="modal-btn-whatsapp"
                onClick={() => handleSendWhatsApp(selectedHistorySession)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-extrabold text-[12px] rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Reenviar Prontuário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
