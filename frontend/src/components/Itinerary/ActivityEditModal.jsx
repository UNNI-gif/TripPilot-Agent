import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Edit3 } from 'lucide-react';

export function ActivityEditModal({ isOpen, onClose, activity, dayNumber, activityIndex, onSaveActivity, onDeleteActivity }) {
  const [formData, setFormData] = useState({
    title: '',
    time_slot: 'Morning',
    time: '',
    description: '',
    location: '',
    category: 'Sightseeing',
    estimated_cost: '$0',
    tips: ''
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title || '',
        time_slot: activity.time_slot || 'Morning',
        time: activity.time || '',
        description: activity.description || '',
        location: activity.location || '',
        category: activity.category || 'Sightseeing',
        estimated_cost: activity.estimated_cost || '$0',
        tips: activity.tips || ''
      });
    }
  }, [activity]);

  if (!isOpen || !activity) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveActivity(dayNumber, activityIndex, formData);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to remove this activity from your itinerary?")) {
      onDeleteActivity(dayNumber, activityIndex);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">
              Edit Activity (Day {dayNumber})
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Activity Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Time Slot</label>
              <select
                value={formData.time_slot}
                onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Time Range</label>
              <input
                type="text"
                value={formData.time}
                placeholder="e.g. 09:30 AM - 12:00 PM"
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Estimated Cost</label>
              <input
                type="text"
                value={formData.estimated_cost}
                placeholder="e.g. $20 or Free"
                onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Location / District</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Local Tip (Optional)</label>
            <input
              type="text"
              value={formData.tips}
              placeholder="e.g. Arrive early for sunrise photos"
              onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-all border border-rose-500/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-500/20 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
