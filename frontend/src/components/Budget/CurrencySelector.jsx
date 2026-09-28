import React from 'react';
import { Coins } from 'lucide-react';

export const CURRENCY_RATES = {
  INR: { rate: 84.2, symbol: '₹', name: 'INR (₹ - India)' },
  USD: { rate: 1.0, symbol: '$', name: 'USD ($ - USA)' },
  EUR: { rate: 0.92, symbol: '€', name: 'EUR (€ - Europe)' },
  GBP: { rate: 0.78, symbol: '£', name: 'GBP (£ - UK)' },
  JPY: { rate: 154.5, symbol: '¥', name: 'JPY (¥ - Japan)' },
  AED: { rate: 3.67, symbol: 'AED', name: 'AED (Dirham - UAE)' },
  CAD: { rate: 1.36, symbol: 'CA$', name: 'CAD (CA$ - Canada)' },
  AUD: { rate: 1.52, symbol: 'A$', name: 'AUD (A$ - Australia)' },
  CHF: { rate: 0.88, symbol: 'CHF', name: 'CHF (Franc - Swiss)' },
  THB: { rate: 35.5, symbol: '฿', name: 'THB (฿ - Thailand)' },
  SGD: { rate: 1.35, symbol: 'S$', name: 'SGD (S$ - Singapore)' },
};

export function CurrencySelector({ currentCurrency, onSelectCurrency }) {
  return (
    <div className="flex items-center space-x-1.5 theme-card-subtle border rounded-lg px-2.5 py-1.5 shadow-warm-sm" style={{ borderColor: 'var(--theme-border)' }}>
      <Coins className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
      <span className="text-[11px] font-bold uppercase tracking-wider theme-text-muted">Currency:</span>
      <select
        value={currentCurrency}
        onChange={(e) => onSelectCurrency(e.target.value)}
        className="bg-transparent text-xs font-bold theme-text focus:outline-none cursor-pointer"
      >
        {Object.entries(CURRENCY_RATES).map(([code, info]) => (
          <option key={code} value={code} className="bg-white text-slate-800 dark:bg-stone-900 dark:text-white">
            {info.name}
          </option>
        ))}
      </select>
    </div>
  );
}
