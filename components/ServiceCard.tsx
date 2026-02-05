
import React from 'react';
import { Service, FrequencyOption } from '../types';
import { FREQUENCY_OPTIONS } from '../constants';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  selectedFrequencyId: string;
  onToggle: (id: string) => void;
  onUpdateFrequency: (id: string, freqId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  isSelected, 
  selectedFrequencyId,
  onToggle, 
  onUpdateFrequency
}) => {
  const activeFreqId = isSelected ? selectedFrequencyId : 'mensal';
  const currentFreq = FREQUENCY_OPTIONS.find(f => f.id === activeFreqId);
  const calculatedPrice = service.basePrice * (currentFreq?.multiplier || 1);

  return (
    <div 
      className={`group relative p-8 rounded-[40px] border-2 transition-all duration-500 flex flex-col gap-6 bg-white ${
        isSelected 
        ? 'border-[#0049FF] shadow-[0_30px_60px_rgba(0,73,255,0.1)] scale-[1.01]' 
        : 'border-slate-100 hover:border-blue-100 shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className={`text-4xl w-16 h-16 flex items-center justify-center rounded-[20px] transition-all duration-500 ${isSelected ? 'bg-blue-50' : 'bg-slate-50'}`}>
          {service.icon}
        </div>
        <button 
          onClick={() => onToggle(service.id)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 ${
            isSelected ? 'bg-[#0049FF] text-white' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
          }`}
        >
          {isSelected ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>

      <div>
        <h3 className="font-bold text-xl text-[#040136] tracking-tight">{service.name}</h3>
        <p className="text-[13px] text-slate-400 mt-2 leading-relaxed font-medium line-clamp-2">{service.description}</p>
      </div>

      <div className="space-y-3">
        <p className="text-[9px] font-black text-[#040136]/30 uppercase tracking-[0.3em]">Frequência Estratégica</p>
        <div className="grid grid-cols-2 gap-2">
          {FREQUENCY_OPTIONS.map((freq) => {
            const price = service.basePrice * freq.multiplier;
            const active = isSelected && selectedFrequencyId === freq.id;
            
            return (
              <button
                key={freq.id}
                onClick={() => onUpdateFrequency(service.id, freq.id)}
                className={`p-3 rounded-[16px] text-left transition-all border flex flex-col gap-0.5 ${
                  active 
                  ? 'bg-[#0049FF] border-[#0049FF] text-white shadow-sm' 
                  : 'bg-slate-50/50 border-transparent text-slate-500 hover:bg-white hover:border-blue-50'
                }`}
              >
                <span className={`text-[8px] font-bold uppercase tracking-wider ${active ? 'text-white/80' : 'text-slate-400'}`}>
                  {freq.label}
                </span>
                <span className={`text-[13px] font-bold ${active ? 'text-white' : 'text-[#040136]'}`}>
                  R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={`mt-auto p-4 rounded-[20px] flex justify-between items-center transition-all ${
        isSelected ? 'bg-blue-50/60' : 'bg-slate-50/30'
      }`}>
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Custo Mensal</span>
          <span className="text-lg font-black text-[#040136]">
            R$ {calculatedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};
