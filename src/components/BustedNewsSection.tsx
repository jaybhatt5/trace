/**
 * TruthLens AI - Debunked Claims & Hoaxes Section
 * 
 * Displays intercepted disinformation, medical hoaxes, fabricated quotes,
 * and manipulated media flagged as DEBUNKED_FAKE or MISLEADING (Truth Score < 40%).
 */

import React from 'react';
import { FactCheckItem } from '../types';
import { AlertTriangle, ShieldAlert, XCircle, ExternalLink, Flame, Info } from 'lucide-react';

interface BustedNewsProps {
  /** Array of all fact check items in feed */
  items: FactCheckItem[];

  /** Callback when user clicks a busted rumor card to inspect audit logs */
  onSelectItem: (item: FactCheckItem) => void;
}

export const BustedNewsSection: React.FC<BustedNewsProps> = ({ items, onSelectItem }) => {
  const bustedNews = items.filter(
    item => item.verdict === 'DEBUNKED_FAKE' || item.verdict === 'MISLEADING' || item.truthScore < 40
  );

  return (
    <section className="bg-stone-100/70 dark:bg-stone-900/60 border-t border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pb-4 mb-6 sm:mb-8 border-b-2 border-red-800 dark:border-red-600">
          <div>
            <div className="flex items-center gap-1.5 text-red-800 dark:text-red-400 text-xs font-bold uppercase tracking-widest mb-1">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Investigative Exposé • Disinformation Registry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-stone-900 dark:text-stone-50 tracking-tight">
              Debunked Claims & Viral Hoaxes
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1 max-w-2xl font-sans">
              Fabricated quotes, health scams, doctored images, and viral disinformation intercepted and exposed by TRACE (Truth Review & Authenticity Checking Engine).
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 px-3 py-1.5 rounded self-start sm:self-auto shrink-0 font-sans uppercase tracking-wider font-semibold">
            <Flame className="w-3.5 h-3.5 shrink-0" />
            <span>{bustedNews.length} Hoaxes Disproven on Record</span>
          </div>
        </div>

        {/* Busted Items Grid */}
        {bustedNews.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded p-8 sm:p-12 text-center text-stone-500 dark:text-stone-400">
            <XCircle className="w-10 h-10 mx-auto mb-3 text-stone-400 dark:text-stone-600" />
            <p className="text-sm font-serif">No debunked hoaxes currently logged.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
            {bustedNews.map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 hover:border-red-500 dark:hover:border-red-600 rounded overflow-hidden shadow-2xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Photo Header */}
                  {item.imageUrl && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1000&q=80';
                        }}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Truth Score Badge */}
                      <div className="absolute top-2.5 right-2.5 bg-red-700 text-white font-sans font-bold text-[10px] sm:text-[11px] px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>Truth Score: {item.truthScore}%</span>
                      </div>

                      {/* Verdict Stamp */}
                      <div className="absolute top-2.5 left-2.5 bg-white/95 dark:bg-stone-950/95 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800 text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                        {item.verdict === 'DEBUNKED_FAKE' ? 'DEBUNKED HOAX' : 'MISLEADING'}
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-2 font-sans uppercase tracking-wider">
                      <span>{item.timestamp}</span>
                      <span>{item.sharesCount.toLocaleString()} Viral Shares</span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Ground Truth Box */}
                    <div className="mt-3 p-3 rounded-sm bg-red-50/70 dark:bg-red-950/30 border-l-3 border-red-700 dark:border-red-500 text-xs text-stone-800 dark:text-stone-200">
                      <div className="font-bold text-red-800 dark:text-red-300 flex items-center gap-1 mb-1 text-[11px] uppercase tracking-wider">
                        <Info className="w-3.5 h-3.5 shrink-0" />
                        <span>The Facts:</span>
                      </div>
                      <p className="line-clamp-3 leading-relaxed font-sans">{item.summary}</p>
                    </div>

                    {/* Key Debunk Findings */}
                    <div className="mt-3.5 pt-3 border-t border-stone-200 dark:border-stone-800">
                      <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                        Disproven Evidence:
                      </p>
                      <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300">
                        {item.keyFindings.slice(0, 2).map((finding, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-red-700 dark:text-red-400 font-bold shrink-0">✕</span>
                            <span className="line-clamp-1">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer details */}
                <div className="px-4 sm:px-5 py-2.5 bg-stone-50 dark:bg-stone-950/70 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-sans">
                  <span className="truncate max-w-[150px]">
                    Desk: <strong className="text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[11px]">{item.category}</strong>
                  </span>
                  <span className="text-red-700 dark:text-red-400 font-semibold group-hover:underline flex items-center gap-1 shrink-0 text-[11px]">
                    Read Expose <ExternalLink className="w-3 h-3" />
                  </span>
                </div>

              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
