
export enum ServiceCategory {
  LIMPEZA = 'Limpeza',
  MANUTENCAO = 'Manutenção',
  JARDINAGEM = 'Jardinagem',
  GESTAO_DIGITAL = 'Gestão Digital'
}

export interface FrequencyOption {
  id: string;
  label: string;
  multiplier: number;
}

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  basePrice: number;
  icon: string;
}

export interface SelectedService extends Service {
  quantity: number;
  frequency: FrequencyOption;
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
