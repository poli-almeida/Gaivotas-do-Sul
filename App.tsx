
import React, { useState, useMemo, useCallback } from 'react';
import { SERVICES_DATA, FREQUENCY_OPTIONS, CO_HOST_SERVICE, CO_HOST_CHECKLIST } from './constants';
import { SelectedService, CustomerData } from './types';
import { ServiceCard } from './components/ServiceCard';
import { generateProposalPDF } from './services/pdfService';

const App: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<Map<string, { frequencyId: string; area: number; floors: number; isIntense: boolean }>>(new Map());
  const [isCoHostSelected, setIsCoHostSelected] = useState(false);
  const [estimatedRevenue, setEstimatedRevenue] = useState<number>(35000);
  
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerForm, setCustomerForm] = useState<CustomerData>({ name: '', cpfCnpj: '', email: '' });

  const toggleService = useCallback((id: string) => {
    setSelectedServices(prev => {
      const next = new Map(prev);
      if (next.has(id)) next.delete(id);
      else {
        next.set(id, { 
          frequencyId: 'mensal', 
          area: id === 'zeladoria-premium' ? 90 : (id === 'corte-grama' ? 200 : 0),
          floors: 1,
          isIntense: false
        });
      }
      return next;
    });
  }, []);

  // Fix: Using a guard clause to ensure 'current' is narrowed to an object type before spreading, 
  // resolving the "Spread types may only be created from object types" error on line 37.
  const updateFrequency = useCallback((serviceId: string, freqId: string) => {
    setSelectedServices(prev => {
      const current = prev.get(serviceId);
      if (!current) return prev;
      const next = new Map(prev);
      next.set(serviceId, { ...current, frequencyId: freqId });
      return next;
    });
  }, []);

  // Fix: Using a guard clause to ensure 'current' is narrowed to an object type before spreading,
  // resolving the "Spread types may only be created from object types" error on line 48.
  const updateParams = useCallback((serviceId: string, key: string, value: any) => {
    setSelectedServices(prev => {
      const current = prev.get(serviceId);
      if (!current) return prev;
      const next = new Map(prev);
      next.set(serviceId, { ...current, [key]: value });
      return next;
    });
  }, []);

  const currentSelectedItems = useMemo(() => {
    return Array.from(selectedServices.entries()).map(([id, state]) => {
      const service = SERVICES_DATA.find(s => s.id === id)!;
      const frequency = FREQUENCY_OPTIONS.find(f => f.id === state.frequencyId)!;
      return { ...service, frequency, area: state.area, floors: state.floors, isIntense: state.isIntense, quantity: 1 } as SelectedService;
    });
  }, [selectedServices]);

  const totalValue = useMemo(() => {
    const servicesTotal = currentSelectedItems.reduce((acc, item) => {
      let visitPrice = item.basePrice;
      if (item.id === 'zeladoria-premium') {
        if ((item.area || 0) > 100) visitPrice += 100;
        if ((item.floors || 0) > 1) visitPrice += 80;
      } else if (item.id === 'corte-grama') {
        if ((item.area || 0) > 200) {
          visitPrice += Math.ceil(((item.area || 0) - 200) / 100) * 50;
        }
        if (item.isIntense) visitPrice += 100;
      }
      return acc + (visitPrice * item.frequency.multiplier);
    }, 0);

    const coHostFee = isCoHostSelected ? estimatedRevenue * CO_HOST_SERVICE.commissionRate : 0;
    return servicesTotal + coHostFee;
  }, [currentSelectedItems, isCoHostSelected, estimatedRevenue]);

  const handleGeneratePDF = () => {
    if (totalValue === 0) return;
    const coHostFee = isCoHostSelected ? estimatedRevenue * CO_HOST_SERVICE.commissionRate : 0;
    generateProposalPDF(currentSelectedItems, isCoHostSelected, estimatedRevenue, coHostFee, totalValue, customerForm.name ? customerForm : undefined);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-60">
      
      {/* Header Mobile Optimized */}
      <header className="bg-[#040136] px-6 pt-12 pb-20 rounded-b-[40px] relative overflow-hidden">
        <div className="max-w-md mx-auto">
          <p className="text-white/40 font-black text-[9px] uppercase tracking-[0.4em] mb-3">Gaivotas do Sul</p>
          <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
            Patrimônio Rentável,<br/>Gestão Impecável.
          </h1>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      </header>

      {/* Main Content */}
      <main className="px-5 -mt-10 max-w-md mx-auto space-y-10">
        
        {/* Operacional */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Operação & Zeladoria</h2>
            <div className="h-1 w-4 bg-[#0049FF] rounded-full"></div>
          </div>
          <div className="flex flex-col gap-5">
            {SERVICES_DATA.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                isSelected={selectedServices.has(service.id)} 
                selectedFrequencyId={selectedServices.get(service.id)?.frequencyId || ''} 
                params={selectedServices.get(service.id) || { area: 0, floors: 0, isIntense: false }}
                onToggle={toggleService} 
                onUpdateFrequency={updateFrequency} 
                onUpdateParams={updateParams}
              />
            ))}
          </div>
        </section>

        {/* Co-Host */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Gestão de Aluguel</h2>
            <div className="h-1 w-4 bg-[#FFB800] rounded-full"></div>
          </div>

          <div className={`p-6 rounded-[32px] border-2 transition-all duration-300 bg-white ${isCoHostSelected ? 'border-[#FFB800] shadow-xl' : 'border-slate-100 shadow-sm'}`}>
            <div className="flex justify-between items-center mb-5">
              <span className="text-3xl">📱</span>
              <button 
                onClick={() => setIsCoHostSelected(!isCoHostSelected)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCoHostSelected ? 'bg-[#FFB800] text-white shadow-lg' : 'bg-slate-50 text-slate-300'}`}
              >
                {isCoHostSelected ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>
                )}
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-[#040136] tracking-tight mb-1">{CO_HOST_SERVICE.name}</h3>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-6">{CO_HOST_SERVICE.description}</p>

            {isCoHostSelected && (
              <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-2 gap-2">
                  {CO_HOST_CHECKLIST.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-[#FFB800]"></div>
                      <span className="text-[8px] font-bold text-slate-500 truncate uppercase tracking-tighter">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-5 border-t border-slate-50">
                  <label className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-2">Faturamento Mensal Estimado</label>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-slate-200">R$</span>
                    <input 
                      type="number" 
                      inputMode="numeric"
                      className="w-full text-3xl font-black text-[#040136] outline-none bg-transparent"
                      value={estimatedRevenue}
                      onChange={e => setEstimatedRevenue(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer Minimalista Estilo App - OTIMIZADO */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-[60]">
        <div className="bg-white rounded-[40px] shadow-[0_24px_48px_-8px_rgba(4,1,54,0.2)] p-6 border border-slate-50 flex flex-col items-center gap-5 animate-in slide-in-from-bottom-8 duration-500">
          
          <div className="text-center">
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] block mb-1">Investimento Estratégico Total</span>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-lg font-black text-slate-200">R$</span>
              <span className="text-3xl font-black text-[#040136] tracking-tighter">
                {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full">
            <button 
              onClick={handleGeneratePDF}
              disabled={totalValue === 0}
              className="w-14 h-16 flex items-center justify-center rounded-[24px] bg-slate-50 text-[#040136] transition-all active:scale-90 border border-slate-100 disabled:opacity-20 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            </button>
            <button 
              onClick={() => setShowCustomerForm(true)}
              disabled={totalValue === 0}
              className="flex-1 h-16 bg-[#0049FF] text-white rounded-[24px] font-black text-[10px] tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-20 uppercase px-4 flex items-center justify-center text-center"
            >
              Ativar Meu Plano
            </button>
          </div>
        </div>
      </footer>

      {/* Drawer Form Mobile */}
      {showCustomerForm && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-[#040136]/50 backdrop-blur-sm" onClick={() => setShowCustomerForm(false)}></div>
          <div className="relative bg-white rounded-t-[40px] p-8 pb-12 animate-in slide-in-from-bottom duration-400 w-full max-w-md mx-auto">
            <div className="w-10 h-1 bg-slate-100 rounded-full mx-auto mb-8"></div>
            <h3 className="text-2xl font-black text-[#040136] mb-1">Cadastro de Plano</h3>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-8">Reserva Técnica Gaivotas</p>
            
            <form onSubmit={(e) => { e.preventDefault(); setShowCustomerForm(false); }} className="space-y-3">
              <input required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[20px] outline-none font-bold text-sm" placeholder="Nome do Proprietário" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} />
              <input required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[20px] outline-none font-bold text-sm" placeholder="CPF / CNPJ" value={customerForm.cpfCnpj} onChange={e => setCustomerForm({...customerForm, cpfCnpj: e.target.value})} />
              <input required type="email" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[20px] outline-none font-bold text-sm" placeholder="E-mail" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} />
              <button className="w-full py-5 bg-[#0049FF] text-white rounded-[20px] font-black text-[10px] tracking-widest mt-4 uppercase">
                Confirmar Atendimento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
