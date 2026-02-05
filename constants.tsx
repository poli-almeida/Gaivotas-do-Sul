
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
  { id: 'avulso', label: 'Avulso', multiplier: 1.0 },
  { id: 'mensal', label: '1x por Mês', multiplier: 1.0 },
  { id: 'quinzenal', label: 'A cada 15 dias', multiplier: 2.0 },
  { id: 'semanal-1', label: '1x por Semana', multiplier: 4.0 },
  { id: 'semanal-2', label: '2x por Semana', multiplier: 8.0 },
];

export const SERVICES_DATA: Service[] = [
  {
    id: 'zeladoria-premium',
    category: ServiceCategory.LIMPEZA,
    name: 'Zeladoria Premium',
    description: 'Limpeza técnica profunda com foco em hospitalidade e padrão hotelaria.',
    basePrice: 275.00, // Base para até 90m2
    icon: '✨'
  },
  {
    id: 'corte-grama',
    category: ServiceCategory.JARDINAGEM,
    name: 'Corte de Grama',
    description: 'Manutenção de áreas verdes com foco em estética e controle de pragas.',
    basePrice: 150.00, // Base para até 200m2
    icon: '🌿'
  },
  {
    id: 'manutencao-preventiva',
    category: ServiceCategory.MANUTENCAO,
    name: 'Manutenção Proativa',
    description: 'Check-up preventivo de infraestrutura e reparos rápidos.',
    basePrice: 250.00,
    icon: '🛠️'
  }
];

export const CO_HOST_CHECKLIST = [
  "Criação e Otimização de Anúncios",
  "Precificação Dinâmica Diária",
  "Atendimento 24/7 aos Hóspedes",
  "Check-in e Vistoria Técnica",
  "Gestão de Enxoval e Lavanderia",
  "Relatórios de Lucratividade"
];

export const CO_HOST_SERVICE = {
  id: 'co-host-premium',
  name: 'Co-anfitriã de Imóveis',
  description: 'Gestão completa do posicionamento estratégico ao atendimento final. Nossa equipe assume toda a operação.',
  commissionRate: 0.20,
  icon: '📱'
};
