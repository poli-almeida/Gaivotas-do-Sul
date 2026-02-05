
import React, { useState, useMemo, useCallback } from 'react';
import { SERVICES_DATA, FREQUENCY_OPTIONS, CO_HOST_SERVICE, CO_HOST_CHECKLIST, TOKENS } from './constants';
import { SelectedService, CustomerData, AsaasPaymentResponse } from './types';
import { ServiceCard } from './components/ServiceCard';
import { createAsaasCheckout } from './services/asaasService';
import { generateProposalPDF } from './services/pdfService';

const App: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<Map<string, { frequencyId: string }>>(new Map());
  const [isCoHostSelected, setIsCoHostSelected] = useState(false);
  const [estimatedRevenue, setEstimatedRevenue] = useState<number>(35000);
  
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<AsaasPaymentResponse | null>(null);
  const [customerForm, setCustomerForm] = useState<CustomerData>({ name: '', cpfCnpj: '', email: '' });
  const [error, setError] = useState<string | null>(null);

  const toggleService = useCallback((id: string) => {
    setSelectedServices(prev => {
      const next = new Map(prev);
      if (next.has(id)) next.delete(id);
      else next.set(id, { frequencyId: 'mensal' });
      return next;
    });
  }, []);

  const updateFrequency = useCallback((serviceId: string, freqId: string) => {
    setSelectedServices(prev => {
      const next = new Map(prev);
      next.set(serviceId, { frequencyId: freqId });
      return next;
    });
  }, []);

  const currentSelectedItems = useMemo(() => {
    return Array.from(selectedServices.entries()).map(([id, state]) => {
      const service = SERVICES_DATA.find(s => s.id === id)!;
      const frequency = FREQUENCY_OPTIONS.find(f => f.id === state.frequencyId)!;
      return { ...service, quantity: 1, frequency } as SelectedService;
    });
  }, [selectedServices]);

  const coHostFee = useMemo(() => isCoHostSelected ? estimatedRevenue * CO_HOST_SERVICE.commissionRate : 0, [isCoHostSelected, estimatedRevenue]);
  
  const totalValue = useMemo(() => {
    const servicesTotal = currentSelectedItems.reduce((acc, item) => acc + (item.basePrice * item.frequency.multiplier), 0);
    return servicesTotal + coHostFee;
  }, [currentSelectedItems, coHostFee]);

  const handleGeneratePDF = () => {
    if (totalValue === 0) return;
    generateProposalPDF(currentSelectedItems, isCoHostSelected, estimatedRevenue, coHostFee, totalValue, customerForm.name ? customerForm : undefined);
  };

  const processAsaasPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckoutLoading(true);
    setError(null);
    try {
      const desc = [...currentSelectedItems.map(i => i.name), isCoHostSelected ? 'Gestão Digital' : ''].filter(Boolean).join(', ');
      const result = await createAsaasCheckout(customerForm, totalValue, desc);
      setCheckoutResult(result);
      setShowCustomerForm(false);
    } catch (err: any) {
      setError(err.message || "Houve um problema com a conexão.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-64">
      
      {/* Checkout Modals */}
      {showCustomerForm && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black text-[#040136] mb-1">Finalizar Plano</h3>
            <p className="text-slate-400 text-xs mb-8 font-bold uppercase tracking-widest">Confirmação de Ativação</p>
            <form onSubmit={processAsaasPayment} className="space-y-4">
              <input required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0049FF] font-semibold text-[#040136]" placeholder="NOME COMPLETO" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} />
              <input required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0049FF] font-semibold text-[#040136]" placeholder="CPF OU CNPJ" value={customerForm.cpfCnpj} onChange={e => setCustomerForm({...customerForm, cpfCnpj: e.target.value})} />
              <input required type="email" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0049FF] font-semibold text-[#040136]" placeholder="E-MAIL" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} />
              <button disabled={isCheckoutLoading} className="w-full py-5 bg-[#0049FF] text-white rounded-2xl font-black text-xs tracking-widest hover:bg-[#040136] transition-all">
                {isCheckoutLoading ? 'CONFIGURANDO...' : 'ATIVAR AGORA'}
              </button>
              <button type="button" onClick={() => setShowCustomerForm(false)} className="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest py-2">Voltar</button>
            </form>
          </div>
        </div>
      )}

      {/* Header - Apenas a Big Idea e Identidade */}
      <header className="bg-[#040136] pt-24 pb-48 px-8 rounded-b-[80px] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-white font-black tracking-[0.8em] text-[10px] uppercase mb-12 opacity-40">
            Gaivotas do Sul
          </h2>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tighter leading-[1.05] text-balance">
            Rentabilidade Máxima e Segurança Total para seu Patrimônio.
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 -mt-24 relative z-20">
        {/* Zeladoria Section */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10 ml-4">
            <div className="h-6 w-1 bg-[#0049FF] rounded-full"></div>
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Zeladoria & Operação</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

        {/* Co-Anfitriã Section com Checklist de Valor */}
        <section className="pb-32">
          <div className="flex items-center gap-4 mb-10 ml-4">
            <div className="h-6 w-1 bg-[#FFB800] rounded-full"></div>
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Gestão Digital & Rendimento</h2>
          </div>
          
          <div className={`rounded-[56px] bg-white border-2 transition-all duration-700 relative overflow-hidden ${isCoHostSelected ? 'border-[#FFB800] shadow-2xl' : 'border-slate-100 shadow-sm'}`}>
            <div className="p-10 md:p-16">
              <div className="flex flex-col md:flex-row items-start gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">📱</span>
                    <h3 className="text-3xl font-black text-[#040136] tracking-tight">{CO_HOST_SERVICE.name}</h3>
                  </div>
                  <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium">
                    {CO_HOST_SERVICE.description}
                  </p>
                  
                  {/* Checklist de Entrega de Valor */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CO_HOST_CHECKLIST.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex-none w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center">
                          <svg className="w-3 h-3 text-[#FFB800]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                        </div>
                        <span className="text-sm font-bold text-slate-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-none w-full md:w-auto flex flex-col items-center gap-4">
                   <div className="bg-orange-50 text-[#FFB800] px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase mb-4">
                     Taxa de Sucesso: 20%
                   </div>
                   <button 
                    onClick={() => setIsCoHostSelected(!isCoHostSelected)} 
                    className={`w-full md:w-64 py-7 rounded-[28px] font-black text-xs tracking-widest transition-all transform active:scale-95 shadow-xl ${isCoHostSelected ? 'bg-[#FFB800] text-white' : 'bg-[#040136] text-white'}`}
                  >
                    {isCoHostSelected ? 'GESTÃO ATIVA' : 'ATIVAR GESTÃO'}
                  </button>
                </div>
              </div>

              {isCoHostSelected && (
                <div className="mt-16 pt-16 border-t border-slate-100 animate-in slide-in-from-bottom duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6">Previsão de Faturamento Mensal</label>
                      <div className="relative">
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 font-black text-[#040136] text-2xl">R$</span>
                        <input 
                          type="number" 
                          className="w-full pl-24 pr-10 py-8 bg-slate-50 border-2 border-transparent focus:border-orange-200 rounded-[32px] text-4xl font-black text-[#040136] outline-none transition-all" 
                          value={estimatedRevenue} 
                          onChange={e => setEstimatedRevenue(Number(e.target.value))} 
                        />
                      </div>
                    </div>
                    <div className="bg-[#040136] text-white p-12 rounded-[40px] relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>
                      </div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] block mb-3">Comissão Gaivotas (20%)</span>
                      <div className="text-4xl font-black tracking-tight">R$ {coHostFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      <p className="text-[9px] font-bold text-white/20 mt-4 uppercase tracking-widest">Valor variável por performance</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer Minimalista - Calculadora no Final */}
      <footer className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-5xl glass-morphism border-2 border-white shadow-[0_50px_100px_rgba(4,1,54,0.12)] rounded-[50px] p-8 z-50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-6">
          <div className="flex flex-col text-center md:text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Resumo do Investimento</span>
            <div className="text-3xl font-black text-[#040136] tracking-tighter">
              <span className="text-lg opacity-40 font-bold mr-2">R$</span>
              {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={handleGeneratePDF} 
              disabled={totalValue === 0}
              className="w-16 h-16 rounded-full border-2 border-slate-100 flex items-center justify-center text-[#040136] hover:bg-slate-50 transition-all active:scale-90 disabled:opacity-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
            <button 
              onClick={() => setShowCustomerForm(true)} 
              disabled={totalValue === 0}
              className="flex-1 md:flex-none px-12 py-5 bg-[#0049FF] text-white rounded-[24px] font-black text-xs tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all disabled:opacity-20"
            >
              CONTRATAR PLANO
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
