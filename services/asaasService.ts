
import { CustomerData, AsaasPaymentResponse } from "../types";

const ASAAS_API_URL = 'https://www.asaas.com/api/v3';
const ASAAS_TOKEN = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjhkOTA4MzExLWYzM2EtNGZiYy05YzAzLWU1ZjhhNjcxNjAwNzo6JGFhY2hfMjhiOWZlYWYtM2QyNS00MGYyLTg1NzAtZmFhOGViYjBjMTE4';

export const createAsaasCheckout = async (customer: CustomerData, value: number, description: string): Promise<AsaasPaymentResponse> => {
  try {
    // 1. Criar Cliente
    const customerResponse = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_TOKEN
      },
      body: JSON.stringify({
        name: customer.name,
        cpfCnpj: customer.cpfCnpj,
        email: customer.email,
        notificationDisabled: false
      })
    });

    const customerData = await customerResponse.json();
    if (customerData.errors) throw new Error(customerData.errors[0].description);

    const customerId = customerData.id;

    // 2. Criar Cobrança (PIX)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const paymentResponse = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_TOKEN
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: 'PIX',
        value: value,
        dueDate: tomorrow.toISOString().split('T')[0],
        description: `Gaivotas do Sul - ${description}`
      })
    });

    const paymentData = await paymentResponse.json();
    if (paymentData.errors) throw new Error(paymentData.errors[0].description);

    // 3. Obter dados do PIX
    const pixResponse = await fetch(`${ASAAS_API_URL}/payments/${paymentData.id}/pixQrCode`, {
      method: 'GET',
      headers: {
        'access_token': ASAAS_TOKEN
      }
    });

    const pixData = await pixResponse.json();

    return {
      id: paymentData.id,
      invoiceUrl: paymentData.invoiceUrl,
      pixCode: pixData.payload,
      pixQrCodeBase64: pixData.encodedImage,
      value: paymentData.value
    };
  } catch (error: any) {
    console.error("Erro Asaas:", error);
    throw error;
  }
};
