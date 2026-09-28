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
      color: 'bg-terracotta-500',
      icon: Plane,
    },
    {
      name: 'Accommodations',
      amount: conv(budget.accommodation),
      percent: Math.round((budget.accommodation / baseTotal) * 100),
      color: 'bg-ochre-500',
      icon: Hotel,
    },
    {
      name: 'Dining & Gastronomy',
      amount: conv(budget.food_dining),
      percent: Math.round((budget.food_dining / baseTotal) * 100),
      color: 'bg-sage-600',
      icon: Utensils,
    },
    {
      name: 'Activities & Passes',
      amount: conv(budget.activities_tickets),
      percent: Math.round((budget.activities_tickets / baseTotal) * 100),
      color: 'bg-amber-600',
      icon: ShoppingBag,
    },
    {
      name: 'Emergency & Buffer',
      amount: conv(budget.misc_buffer),
      percent: Math.round((budget.misc_buffer / baseTotal) * 100),
      color: 'bg-stone-500',
      icon: ShieldCheck,
    },
  ];

  const perDayCost = durationDays ? Math.round(convertedTotal / durationDays) : 0;

  return (
    <div className="theme-card rounded-2xl p-5 sm:p-7 shadow-warm border">
      
      {/* Header with grand total & currency switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b gap-4" style={{ borderColor: 'var(--theme-border)' }}>
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--theme-primary)' }}>
            <PieChart className="w-4 h-4" />
            <span>Smart Expense Forecast</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif theme-text tracking-tight">
            Comprehensive Trip Budget
          </h3>
          <p className="text-xs theme-text-muted mt-0.5">
            Calculated for balanced pacing, central stays, and authentic experiences.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <CurrencySelector
            currentCurrency={selectedCurrency}
            onSelectCurrency={setSelectedCurrency}
          />

          <div className="flex items-center space-x-4 theme-card-subtle p-3.5 rounded-xl border shadow-warm-sm" style={{ borderColor: 'var(--theme-border)' }}>
            <div>
              <div className="text-[10px] theme-text-muted uppercase font-bold tracking-wider">Total Estimated</div>
              <div className="text-xl sm:text-2xl font-black font-serif" style={{ color: 'var(--theme-primary)' }}>
                {symbol}{convertedTotal.toLocaleString()}{' '}
                <span className="text-xs font-normal theme-text-muted">{selectedCurrency}</span>
              </div>
            </div>
            {durationDays && (
              <div className="pl-4 border-l" style={{ borderColor: 'var(--theme-border)' }}>
                <div className="text-[10px] theme-text-muted uppercase font-bold tracking-wider">Per Day</div>
                <div className="text-lg font-bold font-serif theme-text">
                  {symbol}{perDayCost} <span className="text-xs font-normal theme-text-muted">/day</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Breakdown Bar */}
      <div className="mb-6">
        <div className="h-3 w-full theme-card-subtle rounded-full overflow-hidden flex shadow-inner border" style={{ borderColor: 'var(--theme-border)' }}>
          {categories.map((cat, idx) => (
            <div
              key={idx}
              style={{ width: `${cat.percent}%` }}
              className={`${cat.color} h-full transition-all duration-500`}
              title={`${cat.name}: ${cat.percent}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5 text-[11px] theme-text-muted">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center space-x-1.5 font-medium">
              <div className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
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
            <div key={idx} className="p-3.5 rounded-xl theme-card-subtle border flex items-center justify-between shadow-warm-sm" style={{ borderColor: 'var(--theme-border)' }}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg theme-card flex items-center justify-center border shadow-warm-sm" style={{ borderColor: 'var(--theme-border)' }}>
                  <IconComp className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
                </div>
                <div>
                  <div className="text-xs font-bold theme-text">{cat.name}</div>
                  <div className="text-[10px] theme-text-muted">{cat.percent}% of total</div>
                </div>
              </div>
              <div className="text-sm font-bold font-serif" style={{ color: 'var(--theme-primary)' }}>
                {symbol}{cat.amount?.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
