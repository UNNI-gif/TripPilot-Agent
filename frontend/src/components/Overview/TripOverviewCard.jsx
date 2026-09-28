import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  ShieldAlert, 
  MapPin, 
  Calendar, 
  Briefcase, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Luggage
} from 'lucide-react';

const CATEGORY_META = {
  documents: { label: 'Travel Documents & Money', icon: '🛂' },
  apparel: { label: 'Weather-Adaptive Apparel', icon: '🌦️' },
  tech: { label: 'Tech & Connectivity', icon: '⚡' },
  wellness: { label: 'Health & Comfort Carry', icon: '🌿' },
  custom: { label: 'My Custom Items', icon: '🎒' },
};

function categorizeItem(item) {
  const lower = item.toLowerCase();
  if (/(passport|visa|id |ticket|booking|reservation|currency|cash|insurance|wallet|license|card)/i.test(lower)) {
    return 'documents';
  }
  if (/(jacket|coat|umbrella|shoe|boot|sneaker|rain|sunglass|hat|clothes|outfit|layer|linen|wool|scarf|sweater|swim|gloves|wind)/i.test(lower)) {
    return 'apparel';
  }
  if (/(adapter|charger|power|battery|cable|phone|camera|sim|electronics|laptop|headphone|plug)/i.test(lower)) {
    return 'tech';
  }
  return 'wellness';
}

export function TripOverviewCard({ overview, title, durationDays, origin, totalDistanceKm, estimatedTravelTime }) {
  if (!overview) return null;

  const storageKey = `trippilot_bag_${overview.destination || 'default'}`;

  // Checked state persisted in localStorage
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // User-added custom items persisted in localStorage
  const [customItems, setCustomItems] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_custom`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newItemText, setNewItemText] = useState('');
  const [isBagOpen, setIsBagOpen] = useState(true);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedItems));
    } catch (e) {
      console.warn('Could not save packing items', e);
    }
  }, [checkedItems, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`${storageKey}_custom`, JSON.stringify(customItems));
    } catch (e) {
      console.warn('Could not save custom packing items', e);
    }
  }, [customItems, storageKey]);

  // Aggregate all items
  const baseItems = overview.packing_list || [
    'Valid Passport & travel documents',
    'Universal power adapter',
    'Comfortable walking shoes',
    'Weather-appropriate layered outerwear',
    'Personal travel pharmacy'
  ];

  // Group items by category
  const categorized = {
    documents: [],
    apparel: [],
    tech: [],
    wellness: [],
    custom: [...customItems],
  };

  baseItems.forEach((item) => {
    const cat = categorizeItem(item);
    categorized[cat].push(item);
  });

  const allItems = [...baseItems, ...customItems];
  const totalCount = allItems.length;
  const packedCount = allItems.filter((item) => checkedItems[item]).length;
  const progressPct = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;
  const isAllPacked = totalCount > 0 && packedCount === totalCount;

  const toggleItem = (item) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    const trimmed = newItemText.trim();
    if (!trimmed) return;
    if (!customItems.includes(trimmed) && !baseItems.includes(trimmed)) {
      setCustomItems((prev) => [...prev, trimmed]);
      setCheckedItems((prev) => ({ ...prev, [trimmed]: false }));
    }
    setNewItemText('');
  };

  const handleDeleteCustomItem = (itemToDelete) => {
    setCustomItems((prev) => prev.filter((i) => i !== itemToDelete));
    setCheckedItems((prev) => {
      const copy = { ...prev };
      delete copy[itemToDelete];
      return copy;
    });
  };

  const handleResetBag = () => {
    setCheckedItems({});
  };

  const handlePackAll = () => {
    const allPackedMap = {};
    allItems.forEach((i) => {
      allPackedMap[i] = true;
    });
    setCheckedItems(allPackedMap);
  };

  return (
    <div className="theme-card rounded-2xl p-5 sm:p-7 mb-6 shadow-warm border relative overflow-hidden">
      {/* Decorative ambient warm gradient */}
      <div 
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, var(--theme-primary) 0%, transparent 70%)' }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--theme-primary)' }}>
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{origin || overview.origin ? `${origin || overview.origin} ➔ ${overview.destination}` : overview.destination}</span>
            </div>
            {(totalDistanceKm || overview.total_distance_km) && (
              <>
                <span>•</span>
                <span className="font-mono bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  🚗 {totalDistanceKm || overview.total_distance_km} km ({estimatedTravelTime || overview.estimated_travel_time || 'Road Route'})
                </span>
              </>
            )}
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{durationDays || overview.duration_days} Days Journey</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif theme-text tracking-tight">
            {title || overview.tagline}
          </h2>
          {overview.tagline && (
            <p className="text-xs sm:text-sm theme-text-muted mt-1 italic font-serif">
              "{overview.tagline}"
            </p>
          )}
        </div>
      </div>

      {/* Quick context cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 relative z-10">
        {/* Climate & Live Weather */}
        <div className="p-4 rounded-xl theme-card-subtle border shadow-warm-sm">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--theme-gold)' }}>
            <Sun className="w-4 h-4" />
            <span>Live Weather & Optimal Season</span>
          </div>
          <p className="text-xs theme-text leading-relaxed">
            <strong className="block font-semibold mb-1" style={{ color: 'var(--theme-text)' }}>
              {overview.best_season}
            </strong>
            <span className="theme-text-muted">{overview.weather_summary}</span>
          </p>
        </div>

        {/* Local Customs & Tips */}
        <div className="p-4 rounded-xl theme-card-subtle border shadow-warm-sm">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--theme-accent)' }}>
            <ShieldAlert className="w-4 h-4" />
            <span>Culture, Customs & Etiquette</span>
          </div>
          <ul className="text-xs theme-text-muted space-y-1 list-disc list-inside">
            {(overview.local_customs_and_safety || []).slice(0, 3).map((tip, idx) => (
              <li key={idx} className="line-clamp-1">{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* INTERACTIVE WEATHER-SYNCED PACKING BAG */}
      <div className="mt-6 pt-5 border-t relative z-10" style={{ borderColor: 'var(--theme-border)' }}>
        {/* Packing Bag Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg theme-primary-btn flex items-center justify-center text-white shadow-warm-sm">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm font-bold font-serif theme-text">
                  Smart Packing Bag & Readiness
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full theme-badge font-bold">
                  {packedCount} / {totalCount} Packed ({progressPct}%)
                </span>
              </div>
              <p className="text-[11px] theme-text-muted">
                Synced with {overview.destination}'s climate forecast and activities.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePackAll}
              className="text-[11px] font-medium px-2 py-1 rounded theme-card-subtle border hover:theme-text transition-colors"
              title="Mark all items packed"
            >
              Pack All
            </button>
            <button
              onClick={handleResetBag}
              className="text-[11px] font-medium px-2 py-1 rounded theme-card-subtle border hover:theme-text transition-colors flex items-center space-x-1"
              title="Reset checklist"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => setIsBagOpen(!isBagOpen)}
              className="p-1 rounded theme-card-subtle border theme-text-muted hover:theme-text transition-colors"
              title={isBagOpen ? 'Collapse Bag' : 'Expand Bag'}
            >
              {isBagOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Packing Progress Bar */}
        <div className="w-full bg-stone-200 dark:bg-stone-700/50 h-2 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full transition-all duration-500 rounded-full"
            style={{ 
              width: `${progressPct}%`,
              backgroundColor: isAllPacked ? '#16a34a' : 'var(--theme-primary)' 
            }}
          />
        </div>

        {/* Celebratory Banner on 100% Packed */}
        {isAllPacked && (
          <div className="p-2.5 mb-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-2 text-xs font-semibold animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>🎉 Your bag is 100% packed and ready for departure to {overview.destination}!</span>
          </div>
        )}

        {/* Collapsible Categorized Packing Grid */}
        {isBagOpen && (
          <div className="space-y-3.5 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(CATEGORY_META).map(([catKey, meta]) => {
                const items = categorized[catKey] || [];
                if (items.length === 0 && catKey !== 'custom') return null;

                return (
                  <div key={catKey} className="p-3 rounded-xl theme-card-subtle border flex flex-col justify-between" style={{ borderColor: 'var(--theme-border)' }}>
                    <div>
                      <div className="flex items-center space-x-1.5 text-xs font-bold font-serif theme-text mb-2 pb-1.5 border-b" style={{ borderColor: 'var(--theme-border)' }}>
                        <span>{meta.icon}</span>
                        <span className="truncate">{meta.label}</span>
                      </div>

                      <div className="space-y-1.5">
                        {items.length === 0 && catKey === 'custom' && (
                          <div className="text-[11px] theme-text-muted italic py-1">
                            No custom items added yet.
                          </div>
                        )}
                        {items.map((item, idx) => {
                          const isChecked = Boolean(checkedItems[item]);
                          return (
                            <div
                              key={idx}
                              onClick={() => toggleItem(item)}
                              className={`group flex items-start justify-between p-1.5 rounded-lg cursor-pointer transition-all text-xs select-none ${
                                isChecked
                                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300'
                                  : 'hover:bg-black/5 dark:hover:bg-white/5 theme-text'
                              }`}
                            >
                              <div className="flex items-start space-x-2 min-w-0 pr-1">
                                {isChecked ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5 theme-text-muted shrink-0 mt-0.5 opacity-60 group-hover:opacity-100" />
                                )}
                                <span className={`leading-snug break-words ${isChecked ? 'line-through opacity-70' : ''}`}>
                                  {item}
                                </span>
                              </div>

                              {catKey === 'custom' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCustomItem(item);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 transition-opacity p-0.5 shrink-0"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Item Adder Inline Form */}
            <form onSubmit={handleAddCustomItem} className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add custom packing essential (e.g. Polaroid camera, running shoes, medicine)..."
                className="flex-1 px-3 py-1.5 rounded-xl theme-card-subtle border text-xs theme-text focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-stone-400"
                style={{ borderColor: 'var(--theme-border)' }}
              />
              <button
                type="submit"
                disabled={!newItemText.trim()}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold theme-primary-btn disabled:opacity-40 transition-all shadow-warm-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
