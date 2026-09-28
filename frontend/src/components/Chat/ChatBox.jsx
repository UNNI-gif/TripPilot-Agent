import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, SlidersHorizontal, MapPin, Calendar, Compass } from 'lucide-react';
import { MessageItem } from './MessageItem';
import { PromptSuggestions } from './PromptSuggestions';

export function ChatBox({ messages, isLoading, onSendMessage }) {
  const [input, setInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [destination, setDestination] = useState('');
  const [durationDays, setDurationDays] = useState(4);
  const [travelStyle, setTravelStyle] = useState('moderate');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input, {
      destination: destination || undefined,
      durationDays: durationDays || undefined,
      travelStyle: travelStyle || undefined
    });
    setInput('');
  };

  const handlePromptSelect = (promptText, opts) => {
    if (opts?.destination) setDestination(opts.destination);
    if (opts?.durationDays) setDurationDays(opts.durationDays);
    if (opts?.travelStyle) setTravelStyle(opts.travelStyle);
    onSendMessage(promptText, opts);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-md overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold text-slate-200">TripPilot Copilot</span>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            showFilters 
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Trip Parameters"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Optional Filters Drawer */}
      {showFilters && (
        <div className="p-3 bg-slate-950/70 border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-sky-400" />
              <span>Target Destination</span>
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Kyoto, Tokyo, Paris"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-sky-400" />
              <span>Duration (Days)</span>
            </label>
            <input
              type="number"
              min="1"
              max="14"
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 flex items-center space-x-1">
              <Compass className="w-3 h-3 text-sky-400" />
              <span>Travel Style</span>
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="budget">Backpacker / Budget</option>
              <option value="moderate">Balanced / Moderate</option>
              <option value="boutique">Boutique & Cultural</option>
              <option value="luxury">Luxury & Fine Dining</option>
            </select>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-200 mb-1">
              Where will your journey take you?
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Ask TripPilot to build a complete day-by-day itinerary, find flights & boutique stays, or calculate estimated costs.
            </p>
            <PromptSuggestions onSelectPrompt={handlePromptSelect} />
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageItem key={msg.id || index} message={msg} />
          ))
        )}

        {isLoading && (
          <div className="flex items-center space-x-2 p-3 text-slate-400 text-xs rounded-xl bg-slate-800/40 w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            <span>TripPilot is curating your personalized travel plan...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-950/80 border-t border-slate-800">
        <div className="relative flex items-center">
          <textarea
            rows="2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type your trip vision... (e.g. 'Plan 5 days in Kyoto under $2000')"
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-3.5 pr-12 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-none shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-2.5 p-2 rounded-lg transition-all ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30 hover:scale-105'
                : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-500 px-1">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Powered by Gemini 2.5 & Autonomous Travel Tools</span>
        </div>
      </form>
    </div>
  );
}
