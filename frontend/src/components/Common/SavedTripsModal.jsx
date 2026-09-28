import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, Calendar, MapPin } from 'lucide-react';

export function SavedTripsModal({ isOpen, onClose, savedTrips, onLoadTrip, onDeleteTrip }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Your Saved Itineraries</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {savedTrips.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">No saved trips found yet.</p>
              <p className="text-xs text-slate-500 mt-1">Generate a trip plan and it will automatically be stored here.</p>
            </div>
          ) : (
            savedTrips.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 flex items-center justify-between gap-3 group transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold text-white truncate">{t.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                      {t.duration_days} Days
                    </span>
                  </div>
                  <div className="flex items-center text-[11px] text-slate-400 space-x-3">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>{t.destination}</span>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">${t.budget_total?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      onLoadTrip(t.id);
                      onClose();
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 transition-colors"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteTrip(t.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Trip"
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
