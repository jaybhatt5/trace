/**
 * TRACE - Newsroom Fact-Checking & Investigation Desk
 * 
 * TRACE: Truth Review & Authenticity Checking Engine
 * 
 * Features:
 * - Editorial broadsheet headline typography in stately serif.
 * - Multi-mode investigation switcher (News Claim, Article URL, News Photo/Video, Deepfake Media, AI Text).
 * - High-contrast search console with news topic categorization.
 * - Curated benchmark claims styled as authentic investigative wire inquiries.
 * - High accessibility in both Light and Dark mode without artificial neon glow effects.
 */

import React, { useState } from 'react';
import { Search, Link as LinkIcon, FileText, Image as ImageIcon, Bot, ArrowRight, CheckCircle2, ShieldAlert, Camera } from 'lucide-react';

interface HeroBannerProps {
  /** Callback to trigger claim or URL verification */
  onVerify: (claim: string, url?: string, category?: string) => void;

  /** Callback when user selects one of the pre-configured sample queries */
  onSelectSample: (sample: string) => void;

  /** Boolean indicating whether an active AI verification is processing */
  isAnalyzing: boolean;

  /** Callback to switch navigation tabs */
  setActiveTab: (tab: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onVerify,
  onSelectSample,
  isAnalyzing,
  setActiveTab,
}) => {
  const [claimInput, setClaimInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [mode, setMode] = useState<'claim' | 'url' | 'deepfake' | 'aitext' | 'newsmedia'>('claim');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'claim' && claimInput.trim()) {
      onVerify(claimInput.trim(), undefined, selectedCategory);
    } else if (mode === 'url' && urlInput.trim()) {
      onVerify(claimInput.trim() || 'Link content verification', urlInput.trim(), selectedCategory);
    }
  };

  const sampleClaims = [
    { label: 'WHO announces global mandatory digital health passports in 2026', type: 'Debunked' },
    { label: 'NASA Webb telescope discovers alien megastructure around Tabby Star', type: 'Science' },
    { label: 'Viral video shows President declaring national cryptocurrency reserve', type: 'Deepfake' },
    { label: 'Global renewable energy output hit record 30% milestone', type: 'Verified' },
  ];

  const modeButtons = [
    { id: 'claim' as const, label: 'News Claim', icon: FileText, tab: 'top-news' },
    { id: 'url' as const, label: 'Article / Link', icon: LinkIcon, tab: 'top-news' },
    { id: 'newsmedia' as const, label: 'Photo & Video OCR', icon: Camera, tab: 'news-media' },
    { id: 'deepfake' as const, label: 'Deepfake Media', icon: ImageIcon, tab: 'deepfake' },
    { id: 'aitext' as const, label: 'AI Writing Forensics', icon: Bot, tab: 'ai-analyzer' },
  ];

  return (
    <section className="bg-[#fbfaf8] dark:bg-[#111317] text-stone-900 dark:text-stone-100 py-10 sm:py-14 md:py-16 border-b border-stone-200 dark:border-stone-800 transition-colors duration-200 font-sans">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
        
        {/* Editorial Desk Kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-900 dark:bg-stone-100 shrink-0"></span>
          <span>TRACE • Truth Review & Authenticity Checking Engine</span>
        </div>

        {/* Broadsheet Headline in Serif */}
        <h1 className="text-3xl xs:text-4xl sm:text-5xl font-serif font-black tracking-tight text-stone-900 dark:text-stone-50 max-w-4xl mx-auto leading-[1.15]">
          Investigate breaking news claims, viral media & deepfakes with primary evidence.
        </h1>

        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base font-sans max-w-2xl mx-auto mt-3 sm:mt-4 leading-relaxed">
          TRACE cross-references breaking headlines, articles, viral screenshots, and synthetic media against international news wire registries, academic archives, and computer vision forensics.
        </p>

        {/* Segmented Mode Selector */}
        <div className="inline-flex flex-wrap items-center justify-center p-1 bg-stone-200/70 dark:bg-stone-900 rounded-md gap-1 mt-6 sm:mt-8 mb-4 border border-stone-300/80 dark:border-stone-800 max-w-full">
          {modeButtons.map((btn) => {
            const Icon = btn.icon;
            const isSelected = mode === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => {
                  setMode(btn.id);
                  if (btn.tab !== 'top-news' || btn.id === 'claim') {
                    setActiveTab(btn.tab);
                  }
                }}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded text-xs sm:text-sm font-medium transition-all uppercase tracking-wider text-[11px] sm:text-xs ${
                  isSelected
                    ? 'bg-white dark:bg-stone-800 text-stone-950 dark:text-stone-50 shadow-2xs font-bold border border-stone-300/80 dark:border-stone-700'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-stone-950 dark:text-stone-100' : 'text-stone-500'}`} />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Editorial Search Form */}
        <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto bg-white dark:bg-stone-900 p-2.5 sm:p-3 rounded-lg border border-stone-300 dark:border-stone-700 shadow-xs transition-all">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
            
            {mode === 'url' ? (
              <div className="relative flex-1 min-w-0">
                <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="Paste article or publication URL (e.g. https://news.example.com/story)..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full bg-[#fbfaf8] dark:bg-[#111317] border border-stone-300 dark:border-stone-700 rounded pl-9 pr-3 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-stone-900 dark:focus:border-stone-300 font-sans"
                />
              </div>
            ) : (
              <div className="relative flex-1 min-w-0">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Type news headline, quote, or claim to verify with TRACE..."
                  value={claimInput}
                  onChange={(e) => setClaimInput(e.target.value)}
                  className="w-full bg-[#fbfaf8] dark:bg-[#111317] border border-stone-300 dark:border-stone-700 rounded pl-9 pr-3 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-stone-900 dark:focus:border-stone-300 font-sans"
                />
              </div>
            )}

            {/* Topic Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto bg-[#fbfaf8] dark:bg-[#111317] text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-stone-900 dark:focus:border-stone-300 shrink-0 font-sans uppercase tracking-wider text-[11px]"
            >
              <option value="General">All Desks</option>
              <option value="Politics">Politics</option>
              <option value="Health & Science">Health & Science</option>
              <option value="Technology">Technology</option>
              <option value="World News">World News</option>
              <option value="Finance">Finance</option>
            </select>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-5 py-2.5 rounded bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-stone-50 dark:text-stone-900 font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-2xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shrink-0 whitespace-nowrap"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-stone-400 border-t-white rounded-full animate-spin shrink-0" />
                  <span>Checking Wires...</span>
                </>
              ) : (
                <>
                  <span>Investigate</span>
                  <ArrowRight className="w-4 h-4 shrink-0 hidden sm:inline" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Curated Benchmark Wire Leads */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-stone-600 dark:text-stone-400">
          <span className="font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-widest text-[10px]">Recent Leads:</span>
          {sampleClaims.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setClaimInput(sample.label);
                onSelectSample(sample.label);
              }}
              className="px-2.5 py-1 rounded bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:border-stone-500 dark:hover:border-stone-500 transition-colors flex items-center gap-1.5 active:scale-95 shadow-2xs text-[11px]"
            >
              {sample.type === 'Verified' && <CheckCircle2 className="w-3 h-3 text-emerald-700 dark:text-emerald-400 shrink-0" />}
              {sample.type === 'Debunked' && <ShieldAlert className="w-3 h-3 text-red-700 dark:text-red-400 shrink-0" />}
              {sample.type === 'Deepfake' && <ImageIcon className="w-3 h-3 text-stone-600 dark:text-stone-400 shrink-0" />}
              <span className="truncate max-w-[170px] sm:max-w-none">{sample.label}</span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
