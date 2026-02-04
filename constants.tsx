
import { Service, ServiceCategory, FrequencyOption } from './types';

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { id: 'avulso', label: 'Avulso', multiplier: 1.25 },
  { id: 'mensal', label: 'Mensal (1x)', multiplier: 1.0 },
  { id: 'semanal-1', label: '1x/Semana', multiplier: 3.6 },
  { id: 'semanal-2', label: '2x/Semana', multiplier: 6.4 },
];

export const SERVICES_DATA: Service[] = [
  {
    id: 'limpeza-1',
    category: ServiceCategory.LIMPEZA,
    name: 'Limpeza Residencial',
    description: 'Higienização completa com foco em detalhes e produtos premium biodegradáveis.',
    basePrice: 180.00,
    icon: '✨'
  },
  {
    id: 'manutencao-1',
    category: ServiceCategory.MANUTENCAO,
    name: 'Reparos e Manutenção',
    description: 'Check-up preventivo de infraestrutura para evitar imprevistos e danos por maresia.',
    basePrice: 250.00,
    icon: '🛠️'
  },
  {
    id: 'jardinagem-1',
    category: ServiceCategory.JARDINAGEM,
    name: 'Cuidado Paisagístico',
    description: 'Manutenção de jardins e áreas externas com adubação técnica e podas estéticas.',
    basePrice: 220.00,
    icon: '🌿'
  }
];

export const CO_HOST_SERVICE = {
  id: 'co-host-premium',
  name: 'Co-anfitriã de Imóveis',
  description: 'Gestão completa em Airbnb e Booking. Do posicionamento estratégico ao check-out final. Atendimento 24/7 e gestão de hospitalidade.',
  commissionRate: 0.20, // 20%
  icon: '📱'
};

export const APP_THEME = {
  primary: 'bg-blue-900',
  secondary: 'bg-sky-500',
  accent: 'text-amber-500',
  bgGradient: 'from-blue-950 via-blue-900 to-sky-900'
};
