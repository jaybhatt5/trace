/**
 * TRACE - Live News Wire Feed Component
 * 
 * Features:
 * - Integrates with backend `/api/news` and `/api/news/search` (GNews API v4).
 * - Multi-category filtration: General, India (Nation), World, Business, Technology, Science, Health, Sports, Entertainment.
 * - Dedicated keyword search with instant query execution and reset.
 * - Non-overlapping automatic 5-minute background refresh with tab visibility detection (`visibilitychange`).
 * - Manual refresh button with animated spinner and "Last updated" dateline.
 * - Direct AI Fact-Checking connection: "Verify This Claim" button dispatches the article
 *   headline and summary directly to TRACE's Gemini-grounded fact-checking engine,
 *   generating an official audit certificate in the FactCheckModal.
 * - Responsive broadsheet typography and layout matching TRACE aesthetic.
 * - Truthful syndication disclosure regarding standard wire index delays (~15-45 minutes).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Globe,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldAlert,
  Clock,
  Sparkles,
  AlertCircle,
  X,
  Radio,
  Cpu,
  Layers,
  Building2,
  Atom,
  HeartPulse,
  Trophy,
  Film,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { NewsArticle, NewsApiResponse } from '../types';

interface LiveNewsFeedProps {
  /** Callback to trigger TRACE AI fact-checking for a claim or article */
  onVerifyClaim: (claim: string, url?: string, category?: string) => void;

  /** Indicates whether a fact-check is currently being processed by the AI engine */
  isAnalyzing?: boolean;
}

interface CategoryOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  countryFilter?: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'general', label: 'All Wire', icon: Layers },
  { id: 'nation', label: 'India Desk', icon: MapPin, countryFilter: 'in' },
  { id: 'world', label: 'World News', icon: Globe },
  { id: 'business', label: 'Business & Markets', icon: Building2 },
  { id: 'technology', label: 'Technology & AI', icon: Cpu },
  { id: 'science', label: 'Science & Space', icon: Atom },
  { id: 'health', label: 'Health & Medicine', icon: HeartPulse },
  { id: 'sports', label: 'Sports', icon: Trophy },
  { id: 'entertainment', label: 'Culture & Cinema', icon: Film },
];

const AUTO_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export const LiveNewsFeed: React.FC<LiveNewsFeedProps> = ({
  onVerifyClaim,
  isAnalyzing = false,
}) => {
  // Feed state
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [metadata, setMetadata] = useState<NewsApiResponse['metadata']>();
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  // Search state
  const [searchInput, setSearchInput] = useState<string>('');
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');

  // Per-article verifying indicator
  const [verifyingTitle, setVerifyingTitle] = useState<string | null>(null);

  // In-flight request controller and visibility tracking refs
  const abortControllerRef = useRef<AbortController | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const lastFetchTimeRef = useRef<number>(0);

  /**
   * Format relative time string from ISO publication date
   */
  const formatTimeAgo = (isoDate: string): string => {
    try {
      const date = new Date(isoDate);
      const diffMs = Date.now() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  /**
   * Fetch articles from backend API
   */
  const fetchNews = useCallback(async (isManualRefresh = false) => {
    // Prevent overlapping requests
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    // Cancel any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      let endpoint = '';
      if (activeSearchQuery.trim()) {
        const params = new URLSearchParams({
          q: activeSearchQuery.trim(),
          country: 'in',
          lang: 'en',
          max: '12',
        });
        endpoint = `/api/news/search?${params.toString()}`;
      } else {
        const catConfig = CATEGORIES.find(c => c.id === selectedCategory);
        const country = catConfig?.countryFilter || (selectedCategory === 'nation' ? 'in' : 'all');
        const params = new URLSearchParams({
          category: selectedCategory,
          country,
          lang: 'en',
          max: '12',
        });
        endpoint = `/api/news?${params.toString()}`;
      }

      const res = await fetch(endpoint, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to fetch wire dispatch.`);
      }

      const data: NewsApiResponse = await res.json();
      setArticles(Array.isArray(data.articles) ? data.articles : []);
      setMetadata(data.metadata);
      setLastRefreshedAt(new Date());
      lastFetchTimeRef.current = Date.now();
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('[TRACE Frontend] Failed to load news:', err);
      setErrorMessage(err.message || 'Unable to connect to live wire service. Please retry.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      isFetchingRef.current = false;
    }
  }, [selectedCategory, activeSearchQuery]);

  // Trigger fetch when category or search changes
  useEffect(() => {
    fetchNews(false);
  }, [fetchNews]);

  /**
   * Automatic background refresh every 5 minutes:
   * - Pauses when browser tab is inactive / hidden (`document.visibilityState === 'hidden'`).
   * - Resumes and checks if stale when tab becomes active again.
   */
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const startTimer = () => {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        if (!document.hidden && !isFetchingRef.current) {
          fetchNews(true);
        }
      }, AUTO_REFRESH_INTERVAL_MS);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timer) clearInterval(timer);
        timer = null;
      } else {
        // Tab became visible again: if more than 5 minutes have passed since last fetch, refresh now
        const elapsed = Date.now() - lastFetchTimeRef.current;
        if (elapsed >= AUTO_REFRESH_INTERVAL_MS && !isFetchingRef.current) {
          fetchNews(true);
        }
        startTimer();
      }
    };

    startTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchNews]);

  /**
   * Handle search form submit
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;
    setActiveSearchQuery(query);
  };

  /**
   * Clear search and return to category view
   */
  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearchQuery('');
  };

  /**
   * Handle "Verify This Claim" button click:
   * Dispatches the article headline and description directly to TRACE AI fact-checking engine.
   */
  const handleVerifyArticle = async (article: NewsArticle) => {
    setVerifyingTitle(article.title);
    try {
      const claimText = `${article.title}. ${article.description}`.trim();
      await onVerifyClaim(claimText, article.url, article.category || selectedCategory);
    } finally {
      setVerifyingTitle(null);
    }
  };

  return (
    <section className="bg-[#fbfaf8] dark:bg-[#111317] text-stone-900 dark:text-stone-100 py-8 sm:py-12 border-t border-stone-200 dark:border-stone-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Masthead Header Banner */}
        <div className="pb-5 mb-6 sm:mb-8 border-b-2 border-stone-900 dark:border-stone-100 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400 text-xs font-semibold uppercase tracking-widest mb-1.5">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-rose-300/80 dark:border-rose-800/80 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold text-[10px]">
                <Radio className="w-3 h-3 text-rose-600 dark:text-rose-400 animate-pulse shrink-0" />
                <span>LIVE WIRE DISPATCH</span>
              </span>
              <span className="text-stone-400 dark:text-stone-600">•</span>
              <span className="font-mono text-[11px] text-stone-500">GNEWS V4 SYNDICATION</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-stone-900 dark:text-stone-50 tracking-tight">
              LATEST NEWS
            </h1>
            
            <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1 max-w-2xl font-sans">
              Continuous syndicated reports from accredited international and national wire registries. Every dispatch can be submitted directly for forensic AI claim verification.
            </p>
          </div>

          {/* Refresh controls & last-updated timestamp */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-start md:self-auto shrink-0 font-sans text-xs">
            <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-2.5 py-1.5 rounded text-[11px]">
              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>
                {lastRefreshedAt
                  ? `Updated ${lastRefreshedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
                  : 'Syncing...'}
              </span>
            </div>

            <button
              onClick={() => fetchNews(true)}
              disabled={isLoading || isRefreshing}
              title="Refresh Wire Feed"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900 font-medium text-xs transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Feed'}</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Syndication Timing Disclosure */}
        <div className="mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search live wire dispatches (e.g., semiconductor, ISRO, climate, budget)..."
                maxLength={100}
                className="w-full pl-9 pr-20 py-2 text-xs sm:text-sm bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100 transition-colors shadow-2xs"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-16 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded text-[11px] font-semibold transition-colors"
              >
                Search
              </button>
            </form>

            {/* Provider Timing Notice (Honest Disclosure) */}
            <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800/80 px-2.5 py-1.5 rounded flex items-center gap-1.5 self-start sm:self-auto shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>GNews Index: standard syndication delay (~15-45m)</span>
            </div>
          </div>

          {/* Active Search Filter Badge */}
          {activeSearchQuery && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-sans">Showing search results for:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-mono font-bold text-[11px]">
                "{activeSearchQuery}"
                <button
                  onClick={handleClearSearch}
                  className="hover:opacity-75 p-0.5 rounded-full"
                  title="Clear search query"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Category Navigation Ribbon (Disabled when search query active) */}
        {!activeSearchQuery && (
          <div className="mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
                        : 'bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400 dark:hover:border-stone-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Wire Service Notice</p>
                <p className="mt-0.5 text-stone-600 dark:text-stone-400">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => fetchNews(true)}
              className="px-2.5 py-1 rounded bg-rose-700 hover:bg-rose-800 text-white font-medium text-xs shrink-0 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded overflow-hidden shadow-2xs animate-pulse flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] w-full bg-stone-200 dark:bg-stone-800" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/3" />
                    <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-full" />
                    <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-4/5" />
                    <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-full" />
                    <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-2/3" />
                  </div>
                </div>
                <div className="p-4 pt-0 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between gap-2 mt-2">
                  <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/4" />
                  <div className="h-7 bg-stone-200 dark:bg-stone-800 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && articles.length === 0 && !errorMessage && (
          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded p-8 sm:p-12 text-center text-stone-500 dark:text-stone-400">
            <Radio className="w-10 h-10 mx-auto mb-3 text-stone-400 dark:text-stone-600" />
            <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">No Wire Dispatches Found</h3>
            <p className="text-xs sm:text-sm mt-1 max-w-md mx-auto font-sans">
              {activeSearchQuery
                ? `No articles matched "${activeSearchQuery}". Try adjusting your keywords or clearing the search.`
                : 'No stories available for this category right now. Click Refresh Feed to sync with the wire index.'}
            </p>
            {activeSearchQuery && (
              <button
                onClick={handleClearSearch}
                className="mt-4 px-3 py-1.5 rounded bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-semibold"
              >
                Clear Search Query
              </button>
            )}
          </div>
        )}

        {/* Live News Grid */}
        {!isLoading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
            {articles.map((article, idx) => {
              const isCurrentlyVerifying = verifyingTitle === article.title || isAnalyzing;
              return (
                <article
                  key={article.id || `${article.url}-${idx}`}
                  className="group bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 hover:border-stone-500 dark:hover:border-stone-600 rounded overflow-hidden shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Article Image Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.title}
                          loading="lazy"
                          onError={(e) => {
                            // Fallback image if remote url fails
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80';
                          }}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-stone-400 dark:text-stone-600 bg-stone-100 dark:bg-stone-950">
                          <Radio className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-[10px] font-mono uppercase tracking-wider">TRACE Wire Report</span>
                        </div>
                      )}

                      {/* Publisher Pill Overlay */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-white text-[10px] font-sans font-bold uppercase tracking-wider">
                          {article.source?.name || 'Accredited Wire'}
                        </span>
                      </div>

                      {/* Publication Dateline Overlay */}
                      <div className="absolute bottom-2.5 right-2.5">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-stone-950/80 backdrop-blur-xs text-stone-200 text-[10px] font-mono">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(article.publishedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Article Text Content */}
                    <div className="p-4 sm:p-5">
                      <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-50 leading-snug group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors line-clamp-2 mb-2">
                        {article.title}
                      </h3>

                      <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm font-sans line-clamp-3 leading-relaxed">
                        {article.description || 'Full dispatch available at original publisher.'}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-4 pt-2 border-t border-stone-200 dark:border-stone-800/80 flex flex-col gap-2.5">
                    
                    {/* Read Original Article Link */}
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                      <span className="text-[11px] font-mono truncate max-w-[160px]">
                        {article.source?.name || 'Original Source'}
                      </span>
                      {article.url && article.url !== '#' && (
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-50 hover:underline"
                        >
                          <span>Read Original</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Verify This Claim Button (Direct AI Fact-Check Pipeline Integration) */}
                    <button
                      type="button"
                      onClick={() => handleVerifyArticle(article)}
                      disabled={isCurrentlyVerifying}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900 font-sans font-semibold text-xs transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                    >
                      {isCurrentlyVerifying && verifyingTitle === article.title ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying with TRACE AI...</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600 shrink-0" />
                          <span>Verify This Claim with AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Footer Metadata & Index Provenance */}
        {metadata && (
          <div className="mt-8 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Source: {metadata.source || 'GNews v4 Syndication'}</span>
              {metadata.cached && (
                <span className="text-stone-400">• Cached {metadata.cachedAt ? formatTimeAgo(metadata.cachedAt) : ''}</span>
              )}
            </div>
            <div>
              <span>{metadata.delayNotice || 'Provider syndication delay applies.'}</span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
