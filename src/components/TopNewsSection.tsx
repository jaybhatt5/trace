/**
 * TruthLens AI - Front Page: Top Verified News Section
 * 
 * Displays authenticated news claims that have been verified by primary records,
 * official wire registries, and peer-reviewed journals with Truth Scores >= 70%.
 */

import React from 'react';
import { FactCheckItem } from '../types';
import { CheckCircle2, ShieldCheck, ExternalLink, Sparkles, TrendingUp } from 'lucide-react';

interface TopNewsProps {
  /** Array of all fact check items in feed */
  items: FactCheckItem[];

  /** Callback when user clicks on a news card to open detailed verification certificate */
  onSelectItem: (item: FactCheckItem) => void;
}

export const TopNewsSection: React.FC<TopNewsProps> = ({ items, onSelectItem }) => {
  const verifiedNews = items.filter(item => item.verdict === 'VERIFIED_TRUE' || item.truthScore >= 70);

  return (
    <section className="bg-[#fbfaf8] dark:bg-[#111317] text-stone-900 dark:text-stone-100 py-8 sm:py-12 border-t border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Masthead Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pb-4 mb-6 sm:mb-8 border-b-2 border-stone-900 dark:border-stone-100">
          <div>
            <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 text-xs font-semibold uppercase tracking-widest mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>Front Page • Primary Evidence Authenticated</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-stone-900 dark:text-stone-50 tracking-tight">
              Top Verified News
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1 max-w-2xl font-sans">
              Claims confirmed by international wire registries, government archives, and peer-reviewed journals with high Truth Scores.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 px-3 py-1.5 rounded self-start sm:self-auto shrink-0 font-sans uppercase tracking-wider font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{verifiedNews.length} Verified Stories on Record</span>
          </div>
        </div>

        {/* Grid of Verified Items */}
        {verifiedNews.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded p-8 sm:p-12 text-center text-stone-500 dark:text-stone-400">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-stone-400 dark:text-stone-600" />
            <p className="text-sm font-serif">No verified stories currently listed. Submit a headline above to run an investigation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
            {verifiedNews.map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 hover:border-stone-500 dark:hover:border-stone-600 rounded overflow-hidden shadow-2xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Article Photo */}
                  {item.imageUrl && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Truth Score Stamp */}
                      <div className="absolute top-2.5 right-2.5 bg-stone-900/90 dark:bg-stone-100/95 text-stone-100 dark:text-stone-900 font-sans font-bold text-[10px] sm:text-[11px] px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 dark:text-emerald-600 shrink-0" />
                        <span>Truth Score: {item.truthScore}%</span>
                      </div>

                      {/* Desk Kicker */}
                      <div className="absolute top-2.5 left-2.5 bg-[#fbfaf8]/95 dark:bg-[#111317]/95 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                        {item.category}
                      </div>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 mb-2 font-sans uppercase tracking-wider">
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">VERIFIED TRUE</span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed font-sans">
                      {item.summary}
                    </p>

                    {/* Key Findings */}
                    <div className="mt-3.5 pt-3 border-t border-stone-200 dark:border-stone-800">
                      <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                        Verified Facts:
                      </p>
                      <ul className="space-y-1 text-xs text-stone-700 dark:text-stone-300">
                        {item.keyFindings.slice(0, 2).map((finding, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">•</span>
                            <span className="line-clamp-1">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Article Footer */}
                <div className="px-4 sm:px-5 py-2.5 bg-stone-50 dark:bg-stone-950/70 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-sans">
                  <div className="flex items-center gap-1 min-w-0 pr-2">
                    <span className="truncate text-[11px] text-stone-600 dark:text-stone-400">{item.verifiedBy}</span>
                  </div>
                  <span className="text-stone-900 dark:text-stone-100 font-semibold group-hover:underline flex items-center gap-1 shrink-0 text-[11px]">
                    Read Audit <ExternalLink className="w-3 h-3" />
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
