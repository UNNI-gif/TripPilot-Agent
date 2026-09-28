import React, { useState } from 'react';
import { X, Download, Copy, Printer, Check } from 'lucide-react';

export function ExportModal({ isOpen, onClose, tripPlan }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !tripPlan) return null;

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tripPlan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${tripPlan.destination || 'trip'}-itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const generateMarkdown = () => {
    let md = `# ${tripPlan.title}\n\n`;
    md += `**Destination:** ${tripPlan.destination} | **Duration:** ${tripPlan.duration_days} Days\n`;
    if (tripPlan.overview?.tagline) md += `*${tripPlan.overview.tagline}*\n\n`;
    md += `## Overview\n`;
    md += `- **Best Season:** ${tripPlan.overview?.best_season}\n`;
    md += `- **Weather:** ${tripPlan.overview?.weather_summary}\n\n`;
    
    md += `## Day-by-Day Itinerary\n`;
    (tripPlan.itinerary || []).forEach(day => {
      md += `\n### Day ${day.day_number}: ${day.theme}\n`;
      (day.activities || []).forEach(act => {
        md += `- **${act.time_slot} (${act.time}) - ${act.title}:** ${act.description} *(Est. Cost: ${act.estimated_cost})*\n`;
        if (act.tips) md += `  - *Tip:* ${act.tips}\n`;
      });
      if (day.meals?.length > 0) {
        md += `\n**Dining Recommendations:**\n`;
        day.meals.forEach(m => {
          md += `- ${m.meal_type}: ${m.name} (${m.cuisine}) - Try: ${m.recommended_dish}\n`;
        });
      }
    });

    if (tripPlan.budget) {
      md += `\n## Estimated Budget (${tripPlan.budget.currency})\n`;
      md += `- Flights & Transit: $${tripPlan.budget.flights_transit}\n`;
      md += `- Accommodation: $${tripPlan.budget.accommodation}\n`;
      md += `- Food & Dining: $${tripPlan.budget.food_dining}\n`;
      md += `- Activities: $${tripPlan.budget.activities_tickets}\n`;
      md += `- Buffer: $${tripPlan.budget.misc_buffer}\n`;
      md += `**Total Estimated:** $${tripPlan.budget.total_estimated}\n`;
    }

    return md;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 overflow-hidden">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Download className="w-5 h-5 text-sky-400" />
            <span>Export Travel Plan</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-5">
          Save your itinerary to bring offline, paste into Notion/Obsidian, or print a physical copy.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleDownloadJSON}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition-all group"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Download className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div>Download Raw JSON</div>
                <div className="text-[10px] text-slate-400 font-normal">Full structured dataset</div>
              </div>
            </div>
            <span className="text-[10px] text-sky-400">.json</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition-all group"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </div>
              <div className="text-left">
                <div>{copied ? 'Copied to Clipboard!' : 'Copy as Markdown'}</div>
                <div className="text-[10px] text-slate-400 font-normal">Ready for Notion or Notes apps</div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400">.md</span>
          </button>

          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition-all group"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Printer className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div>Print / Save to PDF</div>
                <div className="text-[10px] text-slate-400 font-normal">Use browser print dialog</div>
              </div>
            </div>
            <span className="text-[10px] text-purple-400">PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}
