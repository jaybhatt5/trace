/**
 * TruthLens AI - Live Wire Fact-Check Dispatch Feed
 * 
 * Displays a chronological list of investigated claims and wire stories
 * with real-time multi-dimensional filtering by search keywords, category desk, and verdict.
 */

import React, { useState } from 'react';
import { FactCheckItem, VerdictType } from '../types';
import { Sparkles, Filter, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';

interface RecentlyCheckedProps {
  /** All available fact-check items in the feed */
  items: FactCheckItem[];

  /** Callback when user clicks a claim row to open detailed audit modal */
  onSelectItem: (item: FactCheckItem) => void;

  /** Active global search query passed down from App state */
  searchQuery: string;
}

export const RecentlyCheckedSection: React.FC<RecentlyCheckedProps> = ({
  items,
  onSelectItem,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('ALL');

  const filteredItems = items.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchClaim = item.claim.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      if (!matchTitle && !matchClaim && !matchSummary) return false;
    }

    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
      return false;
    }

    if (selectedVerdict !== 'ALL' && item.verdict !== selectedVerdict) {
      return false;
    }

    return true;
  });

  const getVerdictBadge = (verdict: VerdictType, score: number) => {
    switch (verdict) {
      case 'VERIFIED_TRUE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-sans font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 uppercase tracking-wider shrink-0">
            <CheckCircle2 className="w-3 h-3 shrink-0" /> VERIFIED TRUE ({score}%)
          </span>
        );
      case 'DEBUNKED_FAKE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-sans font-bold bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800 uppercase tracking-wider shrink-0">
            <AlertTriangle className="w-3 h-3 shrink-0" /> DEBUNKED FAKE ({score}%)
          </span>
        );
      case 'MISLEADING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-sans font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 uppercase tracking-wider shrink-0">
            <AlertTriangle className="w-3 h-3 shrink-0" /> MISLEADING ({score}%)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-sans font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 uppercase tracking-wider shrink-0">
            <HelpCircle className="w-3 h-3 shrink-0" /> UNVERIFIED
          </span>
        );
    }
  };

  return (
    <section className="bg-[#fbfaf8] dark:bg-[#111317] text-stone-900 dark:text-stone-100 py-8 sm:py-12 border-t border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 pb-4 mb-6 border-b-2 border-stone-900 dark:border-stone-100">
          <div>
            <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 text-xs font-semibold uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-stone-700 dark:text-stone-300 shrink-0" />
              <span>Live Wire Dispatch • Chronological Feed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-stone-900 dark:text-stone-50 tracking-tight">
              Recently Checked Claims
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1 font-sans">
              Latest news claims, viral media submissions, and official wire statements processed by TRACE (Truth Review & Authenticity Checking Engine).
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0">
            <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 mr-1 font-sans">
              <Filter className="w-3.5 h-3.5 shrink-0" />
              <span>Filter Feed:</span>
            </div>
            
            {/* Verdict Filter */}
            <select
              value={selectedVerdict}
              onChange={(e) => setSelectedVerdict(e.target.value)}
              className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:border-stone-900 dark:focus:border-stone-300 uppercase tracking-wider text-[11px]"
            >
              <option value="ALL">All Verdicts</option>
              <option value="VERIFIED_TRUE">Verified True</option>
              <option value="DEBUNKED_FAKE">Debunked Fake</option>
              <option value="MISLEADING">Misleading</option>
            </select>

            {/* Desk Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:border-stone-900 dark:focus:border-stone-300 uppercase tracking-wider text-[11px]"
            >
              <option value="ALL">All Desks</option>
              <option value="Politics">Politics</option>
              <option value="Health & Science">Health & Science</option>
              <option value="Technology">Technology</option>
              <option value="World News">World News</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>

        {/* List of Claims */}
        {filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded p-8 sm:p-12 text-center text-stone-500 dark:text-stone-400">
            <p className="text-sm font-serif">
              {items.length === 0
                ? 'No claims logged on the wire yet. Verify your first headline above to start the record.'
                : 'No claims match your filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-3.5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 hover:border-stone-500 dark:hover:border-stone-600 rounded p-3.5 sm:p-4 md:p-5 transition-all shadow-2xs hover:shadow-xs cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4"
              >
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = item.verdict === 'DEBUNKED_FAKE'
                          ? 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'
                          : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-16 h-12 sm:w-20 sm:h-14 md:w-24 md:h-16 rounded object-cover border border-stone-200 dark:border-stone-800 shrink-0 hidden xs:block"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                      {getVerdictBadge(item.verdict, item.truthScore)}
                      <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 rounded shrink-0">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-stone-400 dark:text-stone-500 font-sans">• {item.timestamp}</span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm mt-1 line-clamp-2 leading-relaxed font-sans">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-stone-200 dark:border-stone-800">
                  <div className="text-left md:text-right text-xs text-stone-500 dark:text-stone-400 min-w-0 font-sans">
                    <p className="font-semibold text-stone-700 dark:text-stone-300 text-[11px] sm:text-xs">{item.sources.length} Wire Sources Cross-Checked</p>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate max-w-[160px]">{item.verifiedBy}</p>
                  </div>

                  <div className="w-8 h-8 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 group-hover:bg-stone-900 dark:group-hover:bg-stone-100 group-hover:text-stone-50 dark:group-hover:text-stone-900 flex items-center justify-center transition-colors shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
