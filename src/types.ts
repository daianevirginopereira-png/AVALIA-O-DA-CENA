export type IntensityLevel = 'Alta' | 'Média' | 'Baixa' | 'Nenhuma';

export interface TrackingSession {
  id: string;
  date: string;
  
  // Clinical Model reference info
  modelId?: string;
  modelPatientName?: string;
  modelSceneTitle?: string;
  modelTherapistName?: string;
  
  // SECTION 1: Antes de entrar na cena
  notaCena: number | null; // 1. Quando você lembra dessa cena hoje, qual nota ela tem de 0 a 10?
  sentePrimeiro: string; // 2. O que você sente primeiro quando lembra dela?
  senteCorpo: string; // 3. Onde você sente isso no corpo?
  corpoReage: string[]; // List of body parts matching somatic visual map selectors

  // SECTION 2: Entrando na cena
  idadeCena: string; // 4. Quantos anos você tinha?
  antesEnforcamento: string; // 5. O que aconteceu antes do enforcamento?
  pensamentoMomento: string; // 6. O que você estava pensando naquele momento?
  piorParteCena: string; // 7. Qual foi a pior parte da cena?
  maisDoeu: string[]; // 8. O que mais doeu (Enforcamento, Não ser ouvido, Ser acusado, Medo, Outro)
  maisDoeuOutro: string;

  // SECTION 3: Emoções
  sentiuMomento: string; // 9. O que você sente naquele momento?
  sentiuMedo: IntensityLevel | ''; // 10. Você sentiu medo?
  sentiuRaiva: IntensityLevel | ''; // 11. Você sentiu raiva?
  sentiuTristeza: IntensityLevel | ''; // 12. Você sentiu tristeza?
  sentiuInjustica: IntensityLevel | ''; // 13. Você sentiu injustiça?
  emocaoMaisForte: string; // 14. Qual dessas emoções era a mais forte?

  // SECTION 4: O que ficou guardado
  queriaDizer: string; // 15. O que você queria dizer e não conseguiu?
  paiTivesseFeito: string; // 16. O que você gostaria que seu pai tivesse feito?
  precisavaOuvir: string; // 17. O que você precisava ouvir naquele momento?
  presoCoracao: string; // 18. O que ficou preso dentro do seu coração?

  // SECTION 5: A crença
  aprendeuSobreVoce: string; // 19. O que você aprendeu sobre você naquele dia?
  aprendeuSobrePai: string; // 20. O que você aprendeu sobre seu pai naquele dia?
  aprendeuSobrePessoas: string; // 21. O que você aprendeu sobre as pessoas naquele dia?
  mudouDentro: string; // 22. Depois dessa situação, algo mudou dentro de você?

  // SECTION 6: A voz que foi calada
  tentouExplicar: string; // 23. Você tentou se explicar?
  ninguemQuisOuvir: string; // 24. Você sentiu que ninguém quis ouvir sua versão?
  quandoMandamCalar: string; // 25. Como é para você quando mandam você ficar calado?
  primeiraVezNaoAcreditava: string; // 26. Qual foi a primeira vez que você sentiu que ninguém acreditava em você?

  // SECTION 7: Exercício do coração
  exercicioPrecisava: string; // "Naquele dia eu precisava de..."
  exercicioQueriaDizer: string; // "Naquele dia eu queria dizer..."
  exercicioMaisMachuca: string; // "Até hoje o que mais me machuca é..."

  // SECTION 8: Pergunta final
  mensagemThiagoPassado: string; // Se aquele Thiago daquele dia estivesse sentado na sua frente agora, o que você diria para ele?
}

export interface PresetEmotion {
  label: string;
  category: 'negative' | 'positive' | 'neutral';
  color: string;
}
