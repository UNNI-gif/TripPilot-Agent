import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Plane, User, CheckCircle2 } from 'lucide-react';

export function MessageItem({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} my-2 sm:my-3`}>
      <div className={`flex max-w-[90%] sm:max-w-[82%] items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
          isUser 
            ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white ring-2 ring-indigo-400/30' 
            : 'bg-gradient-to-tr from-sky-500 to-blue-600 text-white ring-2 ring-sky-400/30'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <Plane className="w-4 h-4 transform -rotate-45" />}
        </div>

        {/* Message bubble */}
        <div className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-lg ${
          isUser 
            ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-tr-none' 
            : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none backdrop-blur-sm'
        }`}>
          <div className="prose prose-invert prose-sm max-w-none space-y-2">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {message.trip_data && !isUser && (
            <div className="mt-2.5 pt-2 border-t border-slate-700/70 flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full itinerary synced to your dashboard</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
