import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Compass, User, CheckCircle2 } from 'lucide-react';

export function MessageItem({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} my-2 sm:my-3`}>
      <div className={`flex max-w-[90%] sm:max-w-[85%] items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
          isUser 
            ? 'bg-gradient-to-tr from-amber-700 to-terracotta-700 text-white' 
            : 'theme-primary-btn text-white'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
        </div>

        {/* Message bubble */}
        <div className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-warm-sm border ${
          isUser 
            ? 'theme-primary-btn rounded-tr-none border-transparent text-white' 
            : 'theme-card rounded-tl-none theme-text'
        }`}>
          <div className="prose prose-sm max-w-none space-y-2 dark:prose-invert">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {message.trip_data && !isUser && (
            <div className="mt-2.5 pt-2 border-t border-dashed flex items-center space-x-1.5 text-xs font-semibold" style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-accent)' }}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full itinerary synced to your dashboard</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
