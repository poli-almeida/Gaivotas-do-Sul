
export enum ServiceCategory {
  LIMPEZA = 'Limpeza',
  MANUTENCAO = 'Manutenção',
  JARDINAGEM = 'Jardinagem',
  GESTAO_DIGITAL = 'Gestão Digital'
}

export interface FrequencyOption {
  id: string;
  label: string;
  multiplier: number; // Representa a quantidade de visitas no mês para o cálculo total
}

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  basePrice: number; // Preço base avulso
  icon: string;
}

export interface SelectedService extends Service {
  frequency: FrequencyOption;
  // Parâmetros dinâmicos
  area?: number;
  floors?: number;
  isIntense?: boolean;
}

export interface CustomerData {
  name: string;
  cpfCnpj: string;
  email: string;
}

export interface AsaasPaymentResponse {
  id: string;
  invoiceUrl: string;
  pixCode: string;
  pixQrCodeBase64: string;
  value: number;
}
