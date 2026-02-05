
import { Service, ServiceCategory, FrequencyOption } from './types';

export const TOKENS = {
  colors: {
    brandBlue: '#0049FF',
    midnightNavy: '#040136',
    deepIndigo: '#2201B2',
    accentOrange: '#FFB800',
    lightGrey: '#D7D7D7',
    white: '#FFFFFF',
    bg: '#F8FAFC'
  }
};

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { id: 'avulso', label: 'Avulso', multiplier: 1.25 },
  { id: 'mensal', label: '1x/Mês', multiplier: 1.0 },
  { id: 'quinzenal', label: 'A cada 15 dias', multiplier: 2.0 },
  { id: 'semanal-1', label: '1x/Semana', multiplier: 3.6 },
  { id: 'semanal-2', label: '2x/Semana', multiplier: 6.4 },
];

export const SERVICES_DATA: Service[] = [
  {
    id: 'limpeza-1',
    category: ServiceCategory.LIMPEZA,
    name: 'Zeladoria Premium',
    description: 'Limpeza técnica profunda com foco em hospitalidade e padrão hotelaria.',
    basePrice: 220.00,
    icon: '✨'
  },
  {
    id: 'manutencao-1',
    category: ServiceCategory.MANUTENCAO,
    name: 'Manutenção Proativa',
    description: 'Check-up preventivo de infraestrutura para evitar interrupções na agenda.',
    basePrice: 250.00,
    icon: '🛠️'
  },
  {
    id: 'jardinagem-1',
    category: ServiceCategory.JARDINAGEM,
    name: 'Cuidado Paisagístico',
    description: 'Manutenção estética de jardins e áreas externas para alto impacto visual.',
    basePrice: 190.00,
    icon: '🌿'
  }
];

export const CO_HOST_CHECKLIST = [
  "Criação e Otimização de Anúncios (Airbnb/Booking)",
  "Precificação Dinâmica (Ajuste diário por demanda)",
  "Atendimento e Triagem de Hóspedes 24/7",
  "Check-in e Check-out com Vistoria Técnica",
  "Gestão de Enxoval e Lavanderia Externa",
  "Relatório Mensal de Transparência e Lucratividade"
];

export const CO_HOST_SERVICE = {
  id: 'co-host-premium',
  name: 'Co-anfitriã de Imóveis',
  description: 'Gestão completa do posicionamento estratégico ao atendimento final. Nossa equipe assume toda a operação para você apenas colher os lucros.',
  commissionRate: 0.20,
  icon: '📱'
};
