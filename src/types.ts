export type IntensityLevel = 'Alta' | 'Média' | 'Baixa' | 'Nenhuma';

export interface TrackingSession {
  id: string;
  date: string;
  // 1. O quanto essa lembrança ainda te incomoda? (Força da cena)
  incomodo: IntensityLevel | '';
  // 2. Raiva
  raiva: IntensityLevel | '';
  // 3. Mágoa
  magoa: IntensityLevel | '';
  // 4. Coração
  coracao: string[]; // 'Raiva', 'Mágoa', 'Injustiça', 'Rejeição', 'Tristeza', 'Nada disso'
  coracaoOutro?: string;
  // 5. Pensamento
  pensamentoFirst: string;
  // 6. Corpo
  corpoReage: string[]; // 'Garganta aperta', 'Coração acelera', 'Dá vontade de chorar', 'Fico nervoso', 'Mãos tremem', 'Não sinto nada'
  // 7. Nota da cena (0 - 10)
  notaCena: number | null;
  // 8. Comparação
  comparacao: 'Melhor do que antes' | 'Igual a antes' | 'Pior do que antes' | '';
  // 9. Avaliação final
  trabalharCena: string;
  // 10. Pergunta mais importante
  mensagemPai: string;
}

export interface PresetEmotion {
  label: string;
  category: 'negative' | 'positive' | 'neutral';
  color: string;
}

