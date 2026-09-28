import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, MapPin } from 'lucide-react';

export function SavedTripsModal({ isOpen, onClose, savedTrips, onLoadTrip, onDeleteTrip }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl theme-card border shadow-warm-lg overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--theme-border)' }}>
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5" style={{ color: 'var(--theme-gold)' }} />
            <h3 className="text-base font-bold font-serif theme-text">Your Saved Itineraries</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg theme-text-muted hover:theme-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {savedTrips.length === 0 ? (
            <div className="py-12 text-center theme-text-muted">
              <p className="text-sm font-serif">No saved journeys found yet.</p>
              <p className="text-xs opacity-75 mt-1">Generate a trip plan and it will automatically appear in your collection.</p>
            </div>
          ) : (
            savedTrips.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-xl theme-card-subtle border flex items-center justify-between gap-3 group transition-all shadow-warm-sm"
                style={{ borderColor: 'var(--theme-border)' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold font-serif theme-text truncate">{t.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded theme-badge font-sans">
                      {t.duration_days} Days
                    </span>
                  </div>
                  <div className="flex items-center text-[11px] theme-text-muted space-x-3">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" style={{ color: 'var(--theme-primary)' }} />
                      <span>{t.destination}</span>
                    </span>
                    <span>•</span>
                    <span className="font-bold font-serif" style={{ color: 'var(--theme-primary)' }}>
                      ${t.budget_total?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      onLoadTrip(t.id);
                      onClose();
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold theme-primary-btn transition-colors shadow-sm"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteTrip(t.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete Journey"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
