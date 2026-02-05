
import React from 'react';
import { Service, FrequencyOption } from '../types';
import { FREQUENCY_OPTIONS } from '../constants';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  selectedFrequencyId: string;
  params: { area: number; floors: number; isIntense: boolean };
  onToggle: (id: string) => void;
  onUpdateFrequency: (id: string, freqId: string) => void;
  onUpdateParams: (id: string, key: string, value: any) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  isSelected, 
  selectedFrequencyId,
  params,
  onToggle, 
  onUpdateFrequency,
  onUpdateParams
}) => {
  const activeFreqId = isSelected ? selectedFrequencyId : 'mensal';
  const currentFreq = FREQUENCY_OPTIONS.find(f => f.id === activeFreqId) || FREQUENCY_OPTIONS[1];

  const calculateVisitPrice = () => {
    let price = service.basePrice;
    
    if (service.id === 'zeladoria-premium') {
      if (params.area > 100) price += 100;
      if (params.floors > 1) price += 80;
    } 
    
    if (service.id === 'corte-grama') {
      if (params.area > 200) {
        const extraArea = params.area - 200;
        price += Math.ceil(extraArea / 100) * 50;
      }
      if (params.isIntense) price += 100;
    }

    return price;
  };

  const visitPrice = calculateVisitPrice();
  const totalPrice = visitPrice * currentFreq.multiplier;

  const getFreqLabel = (id: string) => {
    switch(id) {
      case 'avulso': return 'AVULSO';
      case 'mensal': return '1X/MÊS';
      case 'quinzenal': return 'A CADA 15 DIAS';
      case 'semanal-1': return '1X/SEMANA';
      case 'semanal-2': return '2X/SEMANA';
      default: return '';
    }
  };

  return (
    <div 
      className={`relative p-6 rounded-[32px] border-2 transition-all duration-300 flex flex-col gap-6 ${
        isSelected 
        ? 'border-[#0049FF] bg-white shadow-xl' 
        : 'border-slate-100 bg-slate-50/50'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className={`text-3xl w-14 h-14 flex items-center justify-center rounded-2xl transition-all ${isSelected ? 'bg-blue-50 text-[#0049FF]' : 'bg-white text-slate-400'}`}>
          {service.icon}
        </div>
        <button 
          onClick={() => onToggle(service.id)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isSelected ? 'bg-[#0049FF] text-white' : 'bg-white text-slate-300 border border-slate-100'
          }`}
        >
          {isSelected ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      <div>
        <h3 className="font-bold text-lg text-[#040136] tracking-tight">{service.name}</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed font-medium">{service.description}</p>
      </div>

      {isSelected && (
        <div className="space-y-4 p-5 bg-slate-50 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Metrificação de Valor</p>
          
          {(service.id === 'zeladoria-premium' || service.id === 'corte-grama') && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-bold text-slate-500 uppercase ml-1">Área Total (m²)</label>
                <input 
                  type="number" 
                  inputMode="numeric"
                  value={params.area} 
                  onChange={(e) => onUpdateParams(service.id, 'area', Number(e.target.value))}
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-[#040136] outline-none focus:border-blue-400 transition-all"
                />
              </div>
              
              {service.id === 'zeladoria-premium' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] font-bold text-slate-500 uppercase ml-1">Pavimentos</label>
                  <input 
                    type="number" 
                    inputMode="numeric"
                    value={params.floors} 
                    onChange={(e) => onUpdateParams(service.id, 'floors', Number(e.target.value))}
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-[#040136] outline-none focus:border-blue-400 transition-all"
                  />
                </div>
              )}

              {service.id === 'corte-grama' && (
                <button 
                  onClick={() => onUpdateParams(service.id, 'isIntense', !params.isIntense)}
                  className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border transition-all ${params.isIntense ? 'bg-orange-50 border-[#FFB800] text-[#FFB800]' : 'bg-white border-slate-200 text-slate-400'}`}
                >
                  <span className="text-[8px] font-black uppercase leading-none">Mato Alto</span>
                  <span className="text-[10px] font-bold">{params.isIntense ? 'ATIVADO' : 'DESATIVADO'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Frequência Estratégica</p>
        <div className="grid grid-cols-2 gap-3">
          {FREQUENCY_OPTIONS.map((freq) => {
            const active = isSelected && selectedFrequencyId === freq.id;
            const optionPrice = visitPrice * freq.multiplier;
            const label = getFreqLabel(freq.id);
            
            return (
              <button
                key={freq.id}
                onClick={() => onUpdateFrequency(service.id, freq.id)}
                className={`py-6 px-4 rounded-[28px] text-left transition-all border flex flex-col justify-center gap-1 ${
                  active 
                  ? 'bg-white border-[#0049FF] ring-2 ring-[#0049FF]/10' 
                  : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-tight ${active ? 'text-[#0049FF]/60' : 'text-slate-400'}`}>
                  {label}
                </span>
                <span className={`text-lg font-black text-[#040136] tracking-tighter`}>
                  R$ {optionPrice.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={`mt-2 p-6 rounded-3xl flex justify-between items-center transition-all ${
        isSelected ? 'bg-blue-50/40 border border-blue-100/50' : 'bg-slate-100/30'
      }`}>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{activeFreqId === 'avulso' ? 'Total Único' : 'Plano Mensal Selecionado'}</span>
          <span className="text-2xl font-black text-[#040136] tracking-tighter">
            R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};
