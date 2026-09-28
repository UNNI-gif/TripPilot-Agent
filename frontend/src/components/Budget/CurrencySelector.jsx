import React from 'react';
import { DollarSign } from 'lucide-react';

export const CURRENCY_RATES = {
  USD: { rate: 1.0, symbol: '$', name: 'USD ($)' },
  EUR: { rate: 0.92, symbol: '€', name: 'EUR (€)' },
  GBP: { rate: 0.78, symbol: '£', name: 'GBP (£)' },
  JPY: { rate: 154.5, symbol: '¥', name: 'JPY (¥)' },
  INR: { rate: 84.2, symbol: '₹', name: 'INR (₹)' },
  CAD: { rate: 1.36, symbol: 'CA$', name: 'CAD ($)' },
  AUD: { rate: 1.52, symbol: 'A$', name: 'AUD ($)' },
};

export function CurrencySelector({ currentCurrency, onSelectCurrency }) {
  return (
    <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1">
      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
      <span className="text-[11px] font-semibold text-slate-300">Currency:</span>
      <select
        value={currentCurrency}
        onChange={(e) => onSelectCurrency(e.target.value)}
        className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
      >
        {Object.entries(CURRENCY_RATES).map(([code, info]) => (
          <option key={code} value={code} className="bg-slate-900 text-white">
            {info.name}
          </option>
        ))}
      </select>
    </div>
  );
}
