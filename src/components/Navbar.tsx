/**
 * TRACE - Broadsheet Newspaper Masthead & Navigation Bar
 * 
 * TRACE stands for: Truth Review & Authenticity Checking Engine
 * 
 * Features:
 * - Official TRACE vector monogram logo adapted from brand crest.
 * - Broadsheet newspaper masthead with dynamic dateline and live sentinel indicator.
 * - Full project subtitle: "Truth Review & Authenticity Checking Engine".
 * - Archive & Claim Search console with desktop input and mobile drawer.
 * - Section navigation bar styled with classic editorial hairline rules.
 * - Light / Dark mode switcher with human-authentic typography and high-contrast palettes.
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, CheckCircle, AlertTriangle, Cpu, BarChart3, Search, Camera, Menu, X, ArrowRight, Key, Sun, Moon, Shield, Lock, LogOut, User as UserIcon, Newspaper, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TraceLogo } from './TraceLogo';
import { type TraceAuthUser } from '../utils/firebase';

interface NavbarProps {
  /** The currently selected tab ID */
  activeTab: string;

  /** Callback to change the active tab */
  setActiveTab: (tab: string) => void;

  /** Current value of the search query */
  searchQuery: string;

  /** State updater for the search query */
  setSearchQuery: (q: string) => void;

  /** Callback to open the verification modal */
  onOpenVerifyModal: () => void;

  /** Optional callback to verify a claim query directly on form submit */
  onVerifyClaim?: (query: string) => void;

  /** Current configured Gemini API Key */
  apiKey?: string;

  /** Callback to open the API Key settings modal */
  onOpenApiKeyModal?: () => void;

  /** Current active theme */
  theme?: 'light' | 'dark';

  /** Callback to toggle between light and dark mode */
  onToggleTheme?: () => void;

  /** Authenticated user session */
  currentUser?: TraceAuthUser | null;

  /** Callback to sign out of current session */
  onLogout?: () => void;

  /** Callback to open login modal (reader or admin) */
  onOpenLoginModal?: (targetRole?: 'reader' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenVerifyModal,
  onVerifyClaim,
  apiKey,
  onOpenApiKeyModal,
  theme = 'light',
  onToggleTheme,
  currentUser,
  onLogout,
  onOpenLoginModal,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Broadsheet sections with journalism-grade titles
  const navItems = [
    { id: 'top-news', label: 'Front Page', icon: CheckCircle },
    { id: 'live-news', label: 'Live News Wire', icon: Newspaper },
    { id: 'news-media', label: 'Photo & Broadcast Desk', icon: Camera },
    { id: 'busted', label: 'Debunked Hoaxes', icon: AlertTriangle },
    { id: 'recent', label: 'Live Wire Dispatch', icon: Sparkles },
    { id: 'deepfake', label: 'Deepfake Lab', icon: Shield },
    { id: 'ai-analyzer', label: 'Writing & NLP Audit', icon: Cpu },
    { id: 'stats', label: 'Fact-Check Desk & Stats', icon: BarChart3 },
  ];

  // Dynamic formatted publication dateline
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onVerifyClaim) {
      onVerifyClaim(searchQuery.trim());
      setIsMobileSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fbfaf8]/98 dark:bg-[#111317]/98 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 shadow-2xs pt-safe transition-colors duration-200 font-sans">
      
      {/* Top Broadsheet Dateline & Utility Ribbon */}
      <div className="border-b border-stone-200 dark:border-stone-800/80 bg-stone-100/60 dark:bg-stone-900/50 py-1 px-3 sm:px-6 lg:px-8 text-[11px] text-stone-600 dark:text-stone-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Dateline & Edition */}
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <span className="font-semibold text-stone-800 dark:text-stone-200">{todayFormatted}</span>
            <span className="hidden md:inline text-stone-300 dark:text-stone-700">|</span>
            <span className="hidden md:inline uppercase tracking-widest text-[10px]">Global Digital Edition</span>
            <span className="hidden sm:inline text-stone-300 dark:text-stone-700">|</span>
            <span className="hidden sm:inline font-mono text-[10px] text-stone-500">TRACE DESK • VOL. V</span>
          </div>

          {/* Right Status Indicator */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-300/80 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0"></span>
              <span className="hidden xs:inline">TRACE Sentinel Active</span>
              <span className="xs:hidden">Live</span>
            </div>

            {currentUser && (
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                currentUser.role === 'admin'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
              }`}>
                {currentUser.role === 'admin' ? 'Editorial Clearance' : 'Reader'}
              </span>
            )}
          </div>

        </div>
      </div>

      {/* Main Newspaper Masthead Area */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* TRACE Logo & Brand */}
          <div 
            onClick={() => handleTabSelect('top-news')}
            className="flex items-center gap-3 cursor-pointer group shrink-0 min-w-0"
          >
            {/* TRACE Official Crest Badge */}
            <TraceLogo 
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl shrink-0 shadow-2xs transition-transform group-hover:scale-105"
            />
            
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-black text-2xl sm:text-3xl tracking-tight text-stone-900 dark:text-stone-50 uppercase">
                  TRACE
                </span>
                <span className="hidden lg:inline-block font-serif italic text-stone-500 dark:text-stone-400 text-xs">
                  • The Independent Dispatch
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-sans font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest hidden sm:block truncate">
                Truth Review & Authenticity Checking Engine
              </p>
            </div>
          </div>

          {/* Editorial Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md relative mx-2">
            <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search news headline, claim, or URL to investigate with TRACE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-900/90 border border-stone-300 dark:border-stone-700 rounded pl-9 pr-20 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-stone-900 dark:focus:border-stone-300 transition-all font-sans"
            />
            {searchQuery.trim() && (
              <button
                type="submit"
                className="absolute right-1 px-3 py-1 rounded bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-stone-50 dark:text-stone-900 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Verify
              </button>
            )}
          </form>

          {/* Right Header CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 rounded bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 md:hidden transition-colors"
              aria-label="Toggle mobile search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Submit Claim / Lead Button */}
            <button
              onClick={onOpenVerifyModal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-950 font-medium text-xs sm:text-sm shadow-2xs transition-all active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-300 dark:text-stone-700" />
              <span className="hidden xs:inline">Submit Claim to Verify</span>
              <span className="xs:hidden">Verify</span>
            </button>

            {/* 3-LINE BAR (CONTROLS & SETTINGS DRAWER TOGGLE) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center gap-1.5 p-2 px-2.5 sm:px-3 rounded bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 transition-colors shadow-2xs active:scale-95 cursor-pointer"
              aria-label="Open settings and access menu"
              title="Open Settings & Access Menu"
            >
              <Menu className="w-5 h-5" />
              <span className="text-xs font-bold hidden md:inline">Settings</span>
            </button>
          </div>

        </div>

        {/* Collapsible Mobile Search */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              onSubmit={handleSearchSubmit}
              className="md:hidden pt-2 pb-1 overflow-hidden"
            >
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter news claim to investigate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded pl-9 pr-16 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-stone-900 dark:focus:border-stone-300 font-sans"
                />
                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className="absolute right-1 px-3 py-1 rounded bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-semibold disabled:opacity-40"
                >
                  Verify
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Broadsheet Section Navigation Bar */}
        <nav className="mt-2.5 pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-sm whitespace-nowrap transition-colors uppercase tracking-wider text-[11px] sm:text-xs shrink-0 font-medium ${
                  isActive
                    ? 'text-stone-950 dark:text-stone-50 font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTabBorder"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-stone-900 dark:bg-stone-100"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400 dark:text-stone-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* 3-LINE BAR (TOP-RIGHT CONTROLS & SETTINGS SLIDE-OVER DRAWER VIA PORTAL) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-[100] flex justify-end font-sans">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs cursor-pointer"
              />

              {/* Slide-over Drawer Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="relative w-full max-w-sm sm:max-w-md bg-[#fbfaf8] dark:bg-[#111317] border-l border-stone-300 dark:border-stone-800 shadow-2xl flex flex-col h-screen z-10 overflow-hidden"
              >
              {/* Drawer Masthead Header */}
              <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-100/80 dark:bg-stone-900/80 shrink-0">
                <div className="flex items-center gap-2.5">
                  <TraceLogo className="w-8 h-8 rounded-lg shadow-2xs" />
                  <div>
                    <h3 className="font-serif font-black text-sm text-stone-900 dark:text-stone-100 uppercase tracking-tight">
                      TRACE Settings &amp; Access
                    </h3>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                      Truth Review &amp; Authenticity Checking Engine
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/80 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* SECTION 1: AUTHENTICATION & EDITORIAL PORTALS */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500 font-bold block">
                    Identity &amp; Access Clearance
                  </span>

                  {currentUser ? (
                    <div className="p-3.5 rounded-lg border border-stone-300 dark:border-stone-750 bg-white dark:bg-stone-900 space-y-3">
                      <div className="flex items-center gap-3">
                        {currentUser.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt={currentUser.displayName || 'User'}
                            className="w-10 h-10 rounded-full object-cover border border-stone-300 dark:border-stone-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold flex items-center justify-center text-sm border border-stone-300 dark:border-stone-700">
                            {currentUser.displayName?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                            {currentUser.displayName || 'Authenticated User'}
                          </p>
                          <p className="text-[10px] text-stone-500 font-mono truncate">{currentUser.email}</p>
                          <span className={`inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                            currentUser.role === 'admin'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}>
                            {currentUser.role === 'admin' ? 'Editorial Administrator' : 'Verified Reader'}
                          </span>
                        </div>
                      </div>

                      {/* Admin Portal Shortcut if Admin */}
                      {currentUser.role === 'admin' && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('admin');
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full py-2 px-3 rounded bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Enter Editorial Desk &amp; CMS Dashboard</span>
                        </button>
                      )}

                      {/* Sign Out Button */}
                      {onLogout && (
                        <button
                          type="button"
                          onClick={() => {
                            onLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full py-2 px-3 rounded border border-rose-300 dark:border-rose-900/60 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out Session</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/60 text-[11px] text-stone-600 dark:text-stone-400">
                        <span className="font-semibold text-stone-800 dark:text-stone-200 block mb-0.5">
                          Currently Reading in Guest Mode
                        </span>
                        Reading published investigative reports is 100% free. Sign in below if you wish to run AI photo detections, deepfake audits, or submit claims.
                      </div>

                      {/* Reader Sign-In Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onOpenLoginModal?.('reader');
                        }}
                        className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white hover:bg-stone-50 dark:bg-stone-900 dark:hover:bg-stone-850 text-left transition-colors flex items-center justify-between cursor-pointer group shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                            <UserIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block">
                              Reader Sign-In
                            </span>
                            <span className="text-[10px] text-stone-500 dark:text-stone-400 block truncate">
                              Unlock AI photo forensics, deepfake detector &amp; claim submissions
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 shrink-0" />
                      </button>

                      {/* Admin Login Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onOpenLoginModal?.('admin');
                        }}
                        className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-950 text-left transition-colors flex items-center justify-between cursor-pointer group shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-2 rounded bg-stone-800 text-amber-300 dark:bg-stone-200 dark:text-amber-700 shrink-0">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-xs block">
                              Admin Login &amp; CMS Dashboard
                            </span>
                            <span className="text-[10px] text-stone-300 dark:text-stone-700 block truncate">
                              Restricted newsroom desk with Turnstile security challenge
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  )}
                </div>

                {/* SECTION 2: THEME SWITCHER (LIGHT / DARK) */}
                <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500 font-bold block">
                    Broadsheet Appearance
                  </span>

                  <button
                    type="button"
                    onClick={onToggleTheme}
                    className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white hover:bg-stone-50 dark:bg-stone-900 dark:hover:bg-stone-850 transition-colors flex items-center justify-between cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 shrink-0">
                        {theme === 'dark' ? (
                          <Moon className="w-4 h-4 text-amber-300" />
                        ) : (
                          <Sun className="w-4 h-4 text-amber-600" />
                        )}
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block">
                          {theme === 'dark' ? 'Dark Theme Active' : 'Light Theme Active'}
                        </span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-mono">
                          {theme === 'dark' ? 'Charcoal Midnight (#111317)' : 'Newsprint Broadsheet (#fbfaf8)'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                    </span>
                  </button>
                </div>

                {/* SECTION 3: OWN API KEY SETTINGS */}
                <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500 font-bold block">
                    Grounding Engine &amp; API Key
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenApiKeyModal?.();
                    }}
                    className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white hover:bg-stone-50 dark:bg-stone-900 dark:hover:bg-stone-850 transition-colors flex items-center justify-between cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 shrink-0">
                        <Key className="w-4 h-4" />
                      </div>
                      <div className="text-left min-w-0">
                        <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block">
                          Configure Own Gemini API Key
                        </span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 block truncate font-mono">
                          {apiKey ? 'Custom Gemini 3.7 Key Configured' : 'Using TRACE Default Verification Engine'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 shrink-0">
                      Settings
                    </span>
                  </button>
                </div>

                {/* SECTION 4: INVESTIGATIVE DESKS & READING ROOMS */}
                <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500 font-bold">
                      Desks &amp; Investigative Rooms
                    </span>
                    <span className="text-[9px] text-stone-400">Click to Navigate</span>
                  </div>

                  <div className="space-y-1.5">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      const isAiTool = item.id === 'news-media' || item.id === 'deepfake' || item.id === 'ai-analyzer';

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleTabSelect(item.id)}
                          className={`w-full flex items-center justify-between p-2 rounded text-left text-xs transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-stone-200 dark:bg-stone-800 text-stone-950 dark:text-stone-50 font-bold'
                              : 'hover:bg-stone-100 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className="w-3.5 h-3.5 shrink-0 text-stone-500" />
                            <span className="text-xs truncate">{item.label}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isAiTool && !currentUser ? (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                <span>Sign In</span>
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">
                                Open
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 5: ACADEMIC CREDITS */}
                <div className="p-3 rounded-lg bg-stone-100/60 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 text-[10px] text-stone-500 dark:text-stone-400 font-mono space-y-1">
                  <p className="font-bold text-stone-800 dark:text-stone-200">TRACE Forensic News Engine</p>
                  <p>BCA Semester 3 • Dept. of Computer Science</p>
                  <p>Developers: Thakar Dhaval &amp; Bhatt Jay</p>
                  <p>Shree Swaminarayan College of Computer Science</p>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}

    </header>
  );
};
