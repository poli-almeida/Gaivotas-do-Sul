
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SelectedService } from "../types";

export const getAIInsight = async (selectedServices: SelectedService[]): Promise<string> => {
  if (selectedServices.length === 0) return "Selecione pelo menos um serviço para receber uma análise personalizada.";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const serviceDetails = selectedServices.map(s => 
      `- ${s.name}: R$ ${s.basePrice.toFixed(2)} (${s.frequency?.label || 'Mensal'})`
    ).join('\n');

    const total = selectedServices.reduce((acc, curr) => acc + (curr.basePrice * (curr.frequency?.multiplier || 1)), 0);

    const prompt = `
      Cenário de Gestão Patrimonial Gaivotas do Sul:
      ${serviceDetails}
      
      Total Estimado: R$ ${total.toFixed(2)}.

      Instruções para o Consultor Estratégico:
      1. O serviço de "Co-anfitriã" agora opera em 20% de comissão sobre faturamento. Destaque como essa parceria de risco compartilhado motiva a Gaivotas do Sul a maximizar a ocupação e o ticket médio das diárias.
      2. Reforce que a gestão profissional no Airbnb/Booking paga os custos operacionais (limpeza/manutenção) e ainda gera lucro líquido ao proprietário.
      3. Use um tom de consultoria de alto nível: "Eficiência Operacional", "Maximização de Yield" e "Experiência do Hóspede".
      4. Máximo de 130 palavras.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: 'Você é o Diretor de Relacionamento da Gaivotas do Sul. Seu objetivo é encantar o cliente mostrando que o imóvel dele agora é um ativo gerador de renda passiva sob sua custódia técnica.',
      }
    });

    return response.text || "Nossa análise estratégica está sendo processada por nossos curadores.";
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    return "Nossa inteligência está em manutenção preventiva. Tente novamente em instantes.";
  }
};
