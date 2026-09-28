import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, SlidersHorizontal, MapPin, Calendar, Compass, Plane, Building2, Sun, DollarSign, Brain } from 'lucide-react';
import { MessageItem } from './MessageItem';
import { PromptSuggestions } from './PromptSuggestions';

export function ChatBox({ messages, isLoading, agentStatus, onSendMessage }) {
  const [input, setInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [destination, setDestination] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, agentStatus]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    // Only pass explicit filters if user entered them in the drawer
    const options = {};
    if (destination.trim()) options.destination = destination.trim();
    if (durationDays && parseInt(durationDays, 10) > 0) options.durationDays = parseInt(durationDays, 10);
    if (travelStyle.trim()) options.travelStyle = travelStyle.trim();

    onSendMessage(input, options);
    setInput('');
  };

  const handlePromptSelect = (promptText, opts) => {
    if (opts?.destination) setDestination(opts.destination);
    if (opts?.durationDays) setDurationDays(opts.durationDays);
    if (opts?.travelStyle) setTravelStyle(opts.travelStyle);
    onSendMessage(promptText, opts);
  };

  const renderToolIcon = (tool) => {
    switch (tool) {
      case 'search_flights':
        return <Plane className="w-3.5 h-3.5 animate-pulse" style={{ color: 'var(--theme-primary)' }} />;
      case 'search_hotels':
        return <Building2 className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />;
      case 'weather_forecast':
        return <Sun className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--theme-gold)' }} />;
      case 'budget_optimizer':
        return <DollarSign className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />;
      default:
        return <Brain className="w-3.5 h-3.5 animate-pulse" style={{ color: 'var(--theme-primary)' }} />;
    }
  };

  return (
    <div className="flex flex-col h-full theme-card rounded-2xl border overflow-hidden shadow-warm-lg">
      {/* Header bar */}
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-primary)' }} />
          <span className="text-xs sm:text-sm font-bold font-serif theme-text">TripPilot Copilot</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider theme-badge">
            Live Stream
          </span>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            showFilters 
              ? 'theme-active-item' 
              : 'theme-btn'
          }`}
          title="Trip Parameters"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Trip Prefs</span>
        </button>
      </div>

      {/* Optional Filters Drawer */}
      {showFilters && (
        <div className="p-3 border-b grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs" style={{ backgroundColor: 'var(--theme-card-subtle)', borderColor: 'var(--theme-border)' }}>
          <div>
            <label className="block theme-text-muted mb-1 font-medium flex items-center space-x-1">
              <MapPin className="w-3 h-3" style={{ color: 'var(--theme-primary)' }} />
              <span>Target Destination</span>
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Kyoto, Tuscany, Paris"
              className="w-full theme-card border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
              style={{ borderColor: 'var(--theme-border)' }}
            />
          </div>
          <div>
            <label className="block theme-text-muted mb-1 font-medium flex items-center space-x-1">
              <Calendar className="w-3 h-3" style={{ color: 'var(--theme-primary)' }} />
              <span>Duration (Days)</span>
            </label>
            <input
              type="number"
              min="1"
              max="14"
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              className="w-full theme-card border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
              style={{ borderColor: 'var(--theme-border)' }}
            />
          </div>
          <div>
            <label className="block theme-text-muted mb-1 font-medium flex items-center space-x-1">
              <Compass className="w-3 h-3" style={{ color: 'var(--theme-primary)' }} />
              <span>Travel Style</span>
            </label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full theme-card border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
              style={{ borderColor: 'var(--theme-border)' }}
            >
              <option value="">Auto-detect from message</option>
              <option value="moderate">Balanced / Curated</option>
              <option value="boutique">Boutique & Cultural</option>
              <option value="luxury">Luxury & Gastronomy</option>
              <option value="budget">Backpacker / Budget</option>
            </select>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-4">
            <div className="w-14 h-14 rounded-2xl theme-badge flex items-center justify-center mb-3 shadow-warm-sm">
              <Compass className="w-7 h-7" style={{ color: 'var(--theme-primary)' }} />
            </div>
            <h3 className="text-lg font-bold font-serif theme-text mb-1">
              Where shall we journey next?
            </h3>
            <p className="text-xs theme-text-muted max-w-sm mb-5 leading-relaxed">
              Curate a bespoke day-by-day travel narrative, discover boutique accommodations & flights, or optimize your trip budget.
            </p>
            <PromptSuggestions onSelectPrompt={handlePromptSelect} />
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageItem key={msg.id || index} message={msg} />
          ))
        )}

        {/* Live Agent Execution & Tool Progress Badge */}
        {isLoading && (
          <div className="p-3 rounded-xl theme-card-subtle border text-xs shadow-warm-sm space-y-1.5 w-fit max-w-[90%]">
            <div className="flex items-center space-x-2 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" style={{ color: 'var(--theme-primary)' }} />
              <span className="theme-text">{agentStatus?.text || 'TripPilot curator is crafting your itinerary...'}</span>
            </div>
            {agentStatus?.tool && (
              <div className="flex items-center space-x-1.5 text-[11px] pl-5">
                {renderToolIcon(agentStatus.tool)}
                <span className="font-mono uppercase text-[10px] theme-card px-1.5 py-0.5 rounded border">
                  {agentStatus.tool}
                </span>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="p-3 border-t" style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}>
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
            placeholder="Describe your travel vision... (e.g. 'Plan 5 days in Kyoto under $2000')"
            className="w-full theme-card-subtle border rounded-xl pl-3.5 pr-12 py-2.5 text-xs sm:text-sm theme-text placeholder-stone-400 focus:outline-none focus:ring-1 resize-none shadow-inner"
            style={{ borderColor: 'var(--theme-border)' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-2.5 p-2 rounded-lg transition-all ${
              input.trim() && !isLoading
                ? 'theme-primary-btn shadow-md hover:scale-105'
                : 'opacity-40 cursor-not-allowed theme-btn'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-1.5 text-[11px] theme-text-muted px-1">
          <span>Press Enter to send, Shift+Enter for newline</span>
          <span>Google Gemini 2.5 • Autonomous Travel Engine</span>
        </div>
      </form>
    </div>
  );
}
