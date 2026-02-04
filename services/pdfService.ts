
import { jsPDF } from "jspdf";
import { SelectedService, CustomerData } from "../types";

export const generateProposalPDF = (
  selectedServices: SelectedService[],
  isCoHost: boolean,
  estimatedRevenue: number,
  coHostFee: number,
  totalValue: number,
  customer?: CustomerData
) => {
  const doc = new jsPDF();
  const today = new Date().toLocaleDateString('pt-BR');

  // Header
  doc.setFillColor(15, 23, 42); // Blue 900
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("GAIVOTAS DO SUL", 20, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("GESTÃO PATRIMONIAL & CO-ANFITRIA", 20, 32);
  doc.text(today, 170, 25);

  // Customer Info
  let y = 55;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("RESUMO DA PROPOSTA", 20, y);
  y += 10;

  if (customer && customer.name) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Cliente: ${customer.name}`, 20, y);
    doc.text(`Doc: ${customer.cpfCnpj}`, 20, y + 5);
    y += 15;
  } else {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Proposta gerada para atendimento presencial.", 20, y);
    y += 10;
  }

  // Services Table
  doc.setFont("helvetica", "bold");
  doc.setFillColor(241, 245, 249);
  doc.rect(20, y, 170, 8, 'F');
  doc.text("Serviço", 25, y + 6);
  doc.text("Frequência", 100, y + 6);
  doc.text("Valor Mensal", 160, y + 6);
  y += 12;

  doc.setFont("helvetica", "normal");
  selectedServices.forEach(s => {
    const price = s.basePrice * s.frequency.multiplier;
    doc.text(s.name, 25, y);
    doc.text(s.frequency.label, 100, y);
    doc.text(`R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 160, y);
    y += 8;
  });

  // Co-Host Section
  if (isCoHost) {
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Gestão Digital (Co-anfitriã)", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`Faturamento Estimado: R$ ${estimatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 25, y);
    y += 6;
    doc.text(`Taxa de Sucesso (20%): R$ ${coHostFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 25, y);
    y += 10;
  }

  // Total
  y += 10;
  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  y += 12;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("INVESTIMENTO TOTAL:", 20, y);
  doc.text(`R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 130, y);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Esta proposta tem validade de 7 dias. Valores sujeitos a alteração conforme vistoria local.", 105, 285, { align: "center" });

  doc.save(`Proposta_Gaivotas_${Date.now()}.pdf`);
};
