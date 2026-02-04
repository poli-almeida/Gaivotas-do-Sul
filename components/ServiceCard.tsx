
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
  const currentFreq = FREQUENCY_OPTIONS.find(f => f.id === selectedFrequencyId);
  const calculatedPrice = service.basePrice * (currentFreq?.multiplier || 1);

  const getFreqBadge = (freqId: string) => {
    switch(freqId) {
      case 'avulso': return null;
      case 'mensal': return <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1 font-black">SAVE 15%</span>;
      case 'semanal-1': return <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-1 font-black">BEST SELLER</span>;
      case 'semanal-2': return <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-1 font-black">MAX VALUE</span>;
      default: return null;
    }
  };

  return (
    <div 
      className={`relative p-6 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col gap-4 ${
        isSelected 
        ? 'border-blue-600 bg-white shadow-2xl scale-[1.02]' 
        : 'border-gray-100 bg-white hover:border-blue-200'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className={`text-4xl p-4 rounded-2xl ${isSelected ? 'bg-blue-50' : 'bg-gray-50'}`}>
          {service.icon}
        </div>
        <button 
          onClick={() => onToggle(service.id)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-90 ${
            isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
          }`}
        >
          {isSelected ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>

      <div>
        <h3 className="font-bold text-xl text-gray-900 leading-tight">{service.name}</h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">{service.description}</p>
      </div>

      {isSelected && (
        <div className="flex flex-col gap-4 py-3 border-t border-gray-50 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-black text-blue-900/40 uppercase tracking-[0.15em]">Frequência Estratégica</span>
            <div className="grid grid-cols-2 gap-2">
              {FREQUENCY_OPTIONS.map((freq) => (
                <button
                  key={freq.id}
                  onClick={() => onUpdateFrequency(service.id, freq.id)}
                  className={`px-4 py-3 rounded-2xl text-[10px] font-black transition-all border-2 flex flex-col items-center gap-1 ${
                    selectedFrequencyId === freq.id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                    : 'bg-white border-gray-100 text-gray-500 hover:border-blue-100 hover:bg-blue-50/30'
                  }`}
                >
                  <span>{freq.label.toUpperCase()}</span>
                  {getFreqBadge(freq.id)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50/50 p-4 rounded-2xl flex justify-between items-center border border-blue-100/50">
             <div className="flex flex-col">
               <span className="text-[10px] font-bold text-blue-800 uppercase">Investimento Selecionado</span>
               <span className="text-sm font-black text-blue-900">
                 R$ {calculatedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
               </span>
             </div>
             {selectedFrequencyId !== 'avulso' && (
               <div className="bg-green-500 text-white text-[9px] px-2 py-1 rounded-lg font-bold">PLANO ATIVO</div>
             )}
          </div>
        </div>
      )}

      {!isSelected && (
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase">A partir de</span>
            <div className="text-blue-900 font-black text-lg leading-none">
              R$ {service.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-bold">PREMIUM SERVICE</span>
        </div>
      )}
    </div>
  );
};
