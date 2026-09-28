import React, { useState } from 'react';
import { Navbar } from './components/Common/Navbar';
import { ChatBox } from './components/Chat/ChatBox';
import { ItineraryBoard } from './components/Itinerary/ItineraryBoard';
import { SavedTripsModal } from './components/Common/SavedTripsModal';
import { ExportModal } from './components/Common/ExportModal';
import { useTripSession } from './hooks/useTripSession';
import { MessageSquare, MapPin } from 'lucide-react';

export default function App() {
  const {
    sessionId,
    messages,
    currentTrip,
    savedTrips,
    isLoading,
    sendMessage,
    startNewTrip,
    loadSavedTrip,
    deleteSavedTrip
  } = useTripSession();

  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('chat'); // 'chat' | 'itinerary'

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar
        onNewTrip={startNewTrip}
        savedCount={savedTrips.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        hasActiveTrip={Boolean(currentTrip)}
      />

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex border-b border-slate-800 bg-slate-950 px-4 py-2 justify-center space-x-2">
        <button
          onClick={() => setMobileTab('chat')}
          className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-semibold ${
            mobileTab === 'chat'
              ? 'bg-sky-500 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>TripPilot Chat</span>
        </button>
        <button
          onClick={() => setMobileTab('itinerary')}
          className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-semibold ${
            mobileTab === 'itinerary'
              ? 'bg-sky-500 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Itinerary Board {currentTrip ? '✨' : ''}</span>
        </button>
      </div>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* Left Column: Chat Copilot (Visible on Desktop, or when mobileTab === 'chat') */}
        <div className={`lg:col-span-5 h-[calc(100vh-6.5rem)] ${mobileTab === 'chat' ? 'block' : 'hidden lg:block'}`}>
          <ChatBox
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
          />
        </div>

        {/* Right Column: Itinerary Board (Visible on Desktop, or when mobileTab === 'itinerary') */}
        <div className={`lg:col-span-7 h-[calc(100vh-6.5rem)] overflow-y-auto pr-1 ${mobileTab === 'itinerary' ? 'block' : 'hidden lg:block'}`}>
          <ItineraryBoard tripPlan={currentTrip} />
        </div>

      </main>

      {/* Saved Trips Drawer / Modal */}
      <SavedTripsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedTrips={savedTrips}
        onLoadTrip={loadSavedTrip}
        onDeleteTrip={deleteSavedTrip}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        tripPlan={currentTrip}
      />
    </div>
  );
}
