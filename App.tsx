
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { SERVICES_DATA, APP_THEME, FREQUENCY_OPTIONS, CO_HOST_SERVICE } from './constants';
import { SelectedService, CustomerData, AsaasPaymentResponse } from './types';
import { ServiceCard } from './components/ServiceCard';
import { createAsaasCheckout } from './services/asaasService';
import { generateProposalPDF } from './services/pdfService';

interface ServiceState {
  frequencyId: string;
}

const App: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<Map<string, ServiceState>>(new Map());
  const [isCoHostSelected, setIsCoHostSelected] = useState(false);
  const [estimatedRevenue, setEstimatedRevenue] = useState<number>(5000);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Checkout Asaas
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<AsaasPaymentResponse | null>(null);
  const [customerForm, setCustomerForm] = useState<CustomerData>({ name: '', cpfCnpj: '', email: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 150);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleService = useCallback((id: string) => {
    setSelectedServices((prev: Map<string, ServiceState>) => {
      const next = new Map(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.set(id, { frequencyId: 'mensal' });
      }
      return next;
    });
  }, []);

  const updateFrequency = useCallback((serviceId: string, freqId: string) => {
    setSelectedServices((prev: Map<string, ServiceState>) => {
      const next = new Map(prev);
      const current = next.get(serviceId);
      if (current) {
        next.set(serviceId, { ...current, frequencyId: freqId });
      }
      return next;
    });
  }, []);

  const currentSelectedItems = useMemo(() => {
    return Array.from(selectedServices.entries()).map(([id, state]) => {
      const service = SERVICES_DATA.find(s => s.id === id)!;
      const frequency = FREQUENCY_OPTIONS.find(f => f.id === state.frequencyId)!;
      return {
        ...service,
        quantity: 1,
        frequency
      } as SelectedService;
    });
  }, [selectedServices]);

  const coHostFee = useMemo(() => {
    return isCoHostSelected ? estimatedRevenue * CO_HOST_SERVICE.commissionRate : 0;
  }, [isCoHostSelected, estimatedRevenue]);

  const totalValue = useMemo(() => {
    const servicesTotal = currentSelectedItems.reduce((acc, item) => {
      return acc + (item.basePrice * item.frequency.multiplier);
    }, 0);
    return servicesTotal + coHostFee;
  }, [currentSelectedItems, coHostFee]);

  const handleGeneratePDF = () => {
    if (totalValue === 0) return;
    generateProposalPDF(
      currentSelectedItems,
      isCoHostSelected,
      estimatedRevenue,
      coHostFee,
      totalValue,
      customerForm.name ? customerForm : undefined
    );
  };

  const processAsaasPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutLoading(true);
    setError(null);
    try {
      let desc = currentSelectedItems.map(i => i.name).join(', ');
      if (isCoHostSelected) desc += `, ${CO_HOST_SERVICE.name} (Est. ${coHostFee})`;
      
      const result = await createAsaasCheckout(customerForm, totalValue, desc);
      setCheckoutResult(result);
      setShowCustomerForm(false);
    } catch (err: any) {
      setError(err.message || "Erro ao conectar com Asaas.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] pb-48">
      {/* Customer Modal */}
      {showCustomerForm && (
        <div className="fixed inset-0 z-[210] bg-blue-950/70 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-t-[3.5rem] md:rounded-[4rem] p-8 md:p-14 w-full max-w-lg shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowCustomerForm(false)} className="absolute top-10 right-10 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="font-black text-blue-900 text-3xl uppercase tracking-tighter mb-1">Elite Checkout</h3>
            <p className="text-gray-400 text-xs mb-10 font-bold uppercase tracking-[0.2em]">Gaivotas do Sul & Asaas</p>
            
            <form onSubmit={processAsaasPayment} className="space-y-6">
              <input 
                required
                className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] focus:border-blue-500 outline-none transition-all font-semibold text-blue-900"
                placeholder="NOME COMPLETO"
                value={customerForm.name}
                onChange={e => setCustomerForm({...customerForm, name: e.target.value})}
              />
              <input 
                required
                className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] focus:border-blue-500 outline-none transition-all font-semibold text-blue-900"
                placeholder="CPF OU CNPJ"
                value={customerForm.cpfCnpj}
                onChange={e => setCustomerForm({...customerForm, cpfCnpj: e.target.value})}
              />
              <input 
                required
                type="email"
                className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] focus:border-blue-500 outline-none transition-all font-semibold text-blue-900"
                placeholder="E-MAIL"
                value={customerForm.email}
                onChange={e => setCustomerForm({...customerForm, email: e.target.value})}
              />
              {error && <div className="text-red-600 text-[10px] font-black uppercase text-center bg-red-50 p-4 rounded-2xl border border-red-100">{error}</div>}
              <button 
                type="submit"
                disabled={isCheckoutLoading}
                className="w-full py-7 bg-blue-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
              >
                {isCheckoutLoading ? 'CONECTANDO...' : 'GERAR COBRANÇA PIX'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pix Modal */}
      {checkoutResult && (
        <div className="fixed inset-0 z-[220] bg-blue-950/98 backdrop-blur-3xl flex items-center justify-center p-6 animate-in zoom-in duration-300">
          <div className="bg-white rounded-[5rem] p-12 max-w-md w-full shadow-2xl relative border-t-[16px] border-blue-600">
            <button onClick={() => setCheckoutResult(null)} className="absolute top-10 right-10 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center mb-8">
              <div className="bg-blue-600 text-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-4xl shadow-2xl shadow-blue-200">💎</div>
              <h3 className="font-black text-blue-900 text-3xl uppercase tracking-tighter mb-2">Pague Agora</h3>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Escaneie o QR Code no Local</p>
            </div>
            <div className="bg-blue-50 rounded-[3rem] p-8 mb-10 border border-blue-100 text-center">
              <div className="text-5xl font-black text-blue-900 tracking-tighter">R$ {checkoutResult.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="flex flex-col items-center gap-8">
               <div className="bg-white p-6 rounded-[3rem] shadow-xl border-2 border-blue-50">
                  <img src={`data:image/png;base64,${checkoutResult.pixQrCodeBase64}`} alt="Pix" className="w-60 h-60 object-contain" />
               </div>
               <button 
                className="w-full py-6 bg-blue-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                onClick={() => { navigator.clipboard.writeText(checkoutResult.pixCode); alert("Copiado!"); }}
               >
                 COPIAR PIX COPIA E COLA
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`pt-20 pb-40 px-6 text-white bg-gradient-to-br ${APP_THEME.bgGradient} rounded-b-[6rem] shadow-2xl relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
          <div className="flex items-center gap-4 mb-10 bg-white/10 px-10 py-4 rounded-full backdrop-blur-3xl border border-white/20 shadow-2xl">
            <span className="text-5xl">🕊️</span>
            <h1 className="text-3xl font-black tracking-widest uppercase text-blue-50">Gaivotas do Sul</h1>
          </div>
          <div className="bg-white rounded-[4rem] p-10 border border-white/30 shadow-[0_50px_100px_rgba(0,0,0,0.2)] mb-8 w-full">
             <span className="text-[11px] font-black text-blue-900/40 uppercase tracking-[0.5em] block mb-3">Investimento Estratégico Mensal</span>
             <div className="text-6xl font-black text-blue-900 tracking-tighter">
               R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
             </div>
             <div className="mt-5 flex justify-center gap-3">
                <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl uppercase border border-blue-100">PROPOSTA COMERCIAL</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 -mt-24 relative z-20 max-w-5xl mx-auto">
        {/* Operacionais */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6 ml-4 text-blue-900 font-black text-xs uppercase tracking-[0.3em]">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            <h2>Serviços de Zeladoria Técnica</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES_DATA.map((service) => (
              <ServiceCard 
                key={service.id}
                service={service}
                isSelected={selectedServices.has(service.id)}
                selectedFrequencyId={selectedServices.get(service.id)?.frequencyId || ''}
                onToggle={toggleService}
                onUpdateFrequency={updateFrequency}
              />
            ))}
          </div>
        </section>

        {/* Co-anfitriã Premium */}
        <section className="mb-12 pb-12">
          <div className="flex items-center gap-3 mb-6 ml-4 text-amber-600 font-black text-xs uppercase tracking-[0.3em]">
            <div className="w-2 h-8 bg-amber-500 rounded-full"></div>
            <h2>Gestão Digital & Rentabilidade</h2>
          </div>
          <div className={`relative p-10 rounded-[4rem] border-4 transition-all duration-700 bg-white flex flex-col gap-10 ${isCoHostSelected ? 'border-amber-400 shadow-2xl scale-[1.01]' : 'border-gray-100'}`}>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className={`text-6xl p-8 rounded-[3rem] transition-all duration-700 ${isCoHostSelected ? 'bg-amber-50 rotate-3' : 'bg-gray-50'}`}>
                {CO_HOST_SERVICE.icon}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-black text-3xl text-gray-900 leading-none mb-4">{CO_HOST_SERVICE.name}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-md">{CO_HOST_SERVICE.description}</p>
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                   <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-3 py-1 rounded-full uppercase tracking-widest">COMISSÃO 20% SOBRE ALUGUÉIS</span>
                </div>
              </div>
              <button 
                onClick={() => setIsCoHostSelected(!isCoHostSelected)}
                className={`px-12 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl ${isCoHostSelected ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-gray-900 text-white'}`}
              >
                {isCoHostSelected ? 'GESTÃO ATIVA' : 'ATIVAR CO-ANFITRIÃ'}
              </button>
            </div>

            {isCoHostSelected && (
              <div className="pt-8 border-t-2 border-dashed border-gray-100 animate-in slide-in-from-top-4 duration-500">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1 w-full">
                    <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3 block ml-6">Previsão de Faturamento Mensal (Aluguéis)</label>
                    <div className="relative">
                      <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-gray-400 text-xl">R$</span>
                      <input 
                        type="number"
                        className="w-full pl-20 pr-8 py-6 bg-amber-50/50 border-2 border-amber-100 rounded-[2.5rem] text-3xl font-black text-blue-900 outline-none focus:border-amber-400 transition-all"
                        value={estimatedRevenue}
                        onChange={(e) => setEstimatedRevenue(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="text-center md:text-right bg-blue-900 text-white p-10 rounded-[3rem] min-w-[280px] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">📊</div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-1">Comissão Gaivotas (20%)</span>
                    <div className="text-4xl font-black tracking-tighter">R$ {coHostFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <span className="text-[9px] font-bold uppercase mt-2 block opacity-40">Valor variável por performance</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Persistent Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-white/95 backdrop-blur-3xl border-t border-gray-100 z-50 shadow-[0_-30px_80px_rgba(0,0,0,0.1)]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="flex flex-col text-center md:text-left">
            <span className="text-[11px] text-blue-600 font-black uppercase tracking-[0.4em] mb-2">Total Consolidado Gaivotas</span>
            <div className="text-5xl font-black text-blue-900 tracking-tighter">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            {/* Botão de PDF sem o cérebro */}
            <button 
              onClick={handleGeneratePDF}
              disabled={totalValue === 0}
              title="Gerar Proposta PDF"
              className={`flex-none p-6 rounded-full transition-all shadow-xl active:scale-90 flex items-center justify-center ${
                totalValue === 0 ? 'bg-gray-100 text-gray-300' : 'bg-gray-50 text-blue-900 hover:bg-blue-50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            {/* Botão Principal alterado para "ATIVAR MEU PLANO" */}
            <button 
              className={`flex-1 md:flex-none px-12 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] transition-all transform active:scale-95 shadow-2xl ${
                totalValue === 0 ? 'bg-gray-200 text-gray-400' : 'bg-blue-900 text-white hover:bg-black'
              }`}
              onClick={() => setShowCustomerForm(true)}
              disabled={totalValue === 0}
            >
              ATIVAR MEU PLANO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
