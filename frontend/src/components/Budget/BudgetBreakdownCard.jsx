import React, { useState } from 'react';
import { DollarSign, PieChart, ShieldCheck, ShoppingBag, Utensils, Plane, Hotel } from 'lucide-react';
import { CurrencySelector, CURRENCY_RATES } from './CurrencySelector';

export function BudgetBreakdownCard({ budget, durationDays }) {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  if (!budget) return null;

  const baseTotal = budget.total_estimated || 1;
  const currentRateInfo = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.USD;
  const conv = (amount) => Math.round((amount || 0) * currentRateInfo.rate);

  const convertedTotal = conv(baseTotal);
  const symbol = currentRateInfo.symbol;

  const categories = [
    {
      name: 'Flights & Transit',
      amount: conv(budget.flights_transit),
      percent: Math.round((budget.flights_transit / baseTotal) * 100),
      color: 'bg-sky-500',
      textColor: 'text-sky-400',
      icon: Plane,
    },
    {
      name: 'Accommodations',
      amount: conv(budget.accommodation),
      percent: Math.round((budget.accommodation / baseTotal) * 100),
      color: 'bg-indigo-500',
      textColor: 'text-indigo-400',
      icon: Hotel,
    },
    {
      name: 'Dining & Culinary',
      amount: conv(budget.food_dining),
      percent: Math.round((budget.food_dining / baseTotal) * 100),
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      icon: Utensils,
    },
    {
      name: 'Activities & Passes',
      amount: conv(budget.activities_tickets),
      percent: Math.round((budget.activities_tickets / baseTotal) * 100),
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      icon: ShoppingBag,
    },
    {
      name: 'Emergency & Buffer',
      amount: conv(budget.misc_buffer),
      percent: Math.round((budget.misc_buffer / baseTotal) * 100),
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
      icon: ShieldCheck,
    },
  ];

  const perDayCost = durationDays ? Math.round(convertedTotal / durationDays) : 0;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800">
      
      {/* Header with grand total & currency switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <PieChart className="w-4 h-4" />
            <span>Smart Expense Forecast</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Comprehensive Trip Budget
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Calculated for balanced pacing, central stays, and verified experiences.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <CurrencySelector
            currentCurrency={selectedCurrency}
            onSelectCurrency={setSelectedCurrency}
          />

          <div className="flex items-center space-x-4 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Estimated</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {symbol}{convertedTotal.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400">{selectedCurrency}</span>
              </div>
            </div>
            {durationDays && (
              <div className="pl-4 border-l border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Per Day</div>
                <div className="text-lg font-bold text-slate-200">
                  {symbol}{perDayCost} <span className="text-xs font-normal text-slate-400">/day</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Breakdown Bar */}
      <div className="mb-6">
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              style={{ width: `${cat.percent}%` }}
              className={`${cat.color} h-full transition-all duration-500`}
              title={`${cat.name}: ${cat.percent}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-[11px] text-slate-400">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center space-x-1.5">
              <div className={`w-2 h-2 rounded-full ${cat.color}`} />
              <span>{cat.name} ({cat.percent}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of Itemized Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat, idx) => {
          const IconComp = cat.icon;
          return (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center ${cat.textColor}`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-300">{cat.name}</div>
                  <div className="text-[10px] text-slate-500">{cat.percent}% of budget</div>
                </div>
              </div>
              <div className={`text-sm font-bold ${cat.textColor}`}>
                {symbol}{cat.amount?.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
