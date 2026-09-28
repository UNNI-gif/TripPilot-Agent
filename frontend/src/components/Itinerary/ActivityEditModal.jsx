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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl theme-card border shadow-warm-lg overflow-hidden p-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--theme-border)' }}>
          <div className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
            <h3 className="text-base font-bold font-serif theme-text">
              {activityIndex === -1 ? 'Add New Activity' : 'Edit Activity'} (Day {dayNumber})
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg theme-text-muted hover:theme-text">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block theme-text-muted mb-1 font-semibold">Activity Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full theme-card-subtle border rounded-lg px-3 py-2 theme-text focus:outline-none"
              style={{ borderColor: 'var(--theme-border)' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block theme-text-muted mb-1 font-semibold">Time Slot</label>
              <select
                value={formData.time_slot}
                onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                className="w-full theme-card-subtle border rounded-lg px-3 py-2 theme-text focus:outline-none"
                style={{ borderColor: 'var(--theme-border)' }}
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
            <div>
              <label className="block theme-text-muted mb-1 font-semibold">Time Range</label>
              <input
                type="text"
                value={formData.time}
                placeholder="e.g. 09:30 AM - 12:00 PM"
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full theme-card-subtle border rounded-lg px-3 py-2 theme-text focus:outline-none"
                style={{ borderColor: 'var(--theme-border)' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block theme-text-muted mb-1 font-semibold">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full theme-card-subtle border rounded-lg px-3 py-2 theme-text focus:outline-none"
                style={{ borderColor: 'var(--theme-border)' }}
              />
            </div>
            <div>
              <label className="block theme-text-muted mb-1 font-semibold">Estimated Cost</label>
              <input
                type="text"
                value={formData.estimated_cost}
                placeholder="e.g. $20 or Free"
                onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                className="w-full theme-card-subtle border rounded-lg px-3 py-2 theme-text focus:outline-none"
                style={{ borderColor: 'var(--theme-border)' }}
              />
            </div>
          </div>

          <div>
            <label className="block theme-text-muted mb-1 font-semibold">Location / District</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full theme-card-subtle border rounded-lg px-3 py-2 theme-text focus:outline-none"
              style={{ borderColor: 'var(--theme-border)' }}
            />
          </div>

          <div>
            <label className="block theme-text-muted mb-1 font-semibold">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full theme-card-subtle border rounded-lg px-3 py-2 theme-text focus:outline-none resize-none"
              style={{ borderColor: 'var(--theme-border)' }}
            />
          </div>

          <div>
            <label className="block theme-text-muted mb-1 font-semibold">Local Tip (Optional)</label>
            <input
              type="text"
              value={formData.tips}
              placeholder="e.g. Arrive early for sunrise photos"
              onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
              className="w-full theme-card-subtle border rounded-lg px-3 py-2 theme-text focus:outline-none"
              style={{ borderColor: 'var(--theme-border)' }}
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--theme-border)' }}>
            {activityIndex !== -1 ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-lg text-xs font-medium theme-text-muted hover:theme-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white theme-primary-btn shadow-warm-sm transition-all"
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
