/**
 * TRACE - Authentication Gateway & Entry Portal
 * 
 * Features:
 * - Gated entry for all incoming site visitors
 * - Dual Sign-In Sections:
 *     1. Public Reader Wire -> Enters the authentic public broadsheet site
 *     2. Newsroom Bureau & Admin Desk -> Enters restricted Editorial CMS & monitoring portal
 * - 100% Production-Ready Firebase Authentication (Google OAuth + Email/Password + Verified Reader)
 * - Cloudflare Turnstile anti-bot human challenge on Admin Desk
 * - Zero demo mode bypasses
 * - Broadsheet aesthetic (Newsprint light mode & Editorial charcoal dark mode)
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  Globe,
  BookOpen,
  Sun,
  Moon,
  X,
  Sparkles
} from 'lucide-react';
import { TraceLogo } from './TraceLogo';
import { HumanVerificationChallenge } from './HumanVerificationChallenge';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signInAsPublicReader,
  formatAuthErrorMessage,
  type TraceAuthUser,
  type UserRole
} from '../utils/firebase';

interface AuthGatewayProps {
  onLoginSuccess: (user: TraceAuthUser, targetView: 'reader' | 'admin') => void;
  theme: 'light' | 'dark';
  onToggleTheme?: () => void;
  isModal?: boolean;
  initialPortal?: UserRole;
  onClose?: () => void;
  modalNotice?: string;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  onLoginSuccess,
  theme,
  onToggleTheme,
  isModal = false,
  initialPortal = 'reader',
  onClose,
  modalNotice,
}) => {
  // Selected portal mode: 'reader' | 'admin'
  const [selectedPortal, setSelectedPortal] = useState<UserRole>(initialPortal);

  useEffect(() => {
    if (initialPortal) {
      setSelectedPortal(initialPortal);
    }
  }, [initialPortal]);

  // Form mode: 'signin' | 'register'
  const [formMode, setFormMode] = useState<'signin' | 'register'>('signin');

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & error handling
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Turnstile verification state for Admin portal
  const [isHumanVerified, setIsHumanVerified] = useState(false);

  // Dynamic formatted dateline
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  // ---------------------------------------------------------------------------
  // AUTHENTICATION HANDLERS
  // ---------------------------------------------------------------------------

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    if (selectedPortal === 'admin' && !isHumanVerified) {
      setErrorMessage('Please complete the "Verify you are human" security shield challenge first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const user = await signInWithGoogle(selectedPortal);
      onLoginSuccess(user, selectedPortal);
    } catch (err: any) {
      console.warn('[TRACE Gateway] Google sign-in failed:', err);
      setErrorMessage(formatAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email / Password Form Submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPortal === 'admin' && !isHumanVerified) {
      setErrorMessage('Please complete the "Verify you are human" security shield challenge first.');
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    if (formMode === 'register' && password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      let user: TraceAuthUser;
      if (formMode === 'register') {
        user = await signUpWithEmail(email, password, displayName, selectedPortal);
      } else {
        user = await signInWithEmail(email, password, selectedPortal);
      }
      onLoginSuccess(user, selectedPortal);
    } catch (err: any) {
      console.warn('[TRACE Gateway] Email auth failed:', err);
      setErrorMessage(formatAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Instant Public Reader Access
  const handleFastReaderAccess = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await signInAsPublicReader();
      onLoginSuccess(user, 'reader');
    } catch (err: any) {
      console.warn('[TRACE Gateway] Reader access notice:', err);
      setErrorMessage('Could not initialize public reader session. Please use Google or Email.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER CARD CONTENT (SHARED BY FULLSCREEN AND MODAL)
  // ---------------------------------------------------------------------------
  const renderAuthContent = (inModal: boolean = false) => (
    <>
      {/* TWO PORTALS SELECTION TOGGLE */}
      <div className="bg-stone-200/70 dark:bg-stone-850 p-1 rounded-lg grid grid-cols-2 gap-1 border border-stone-300 dark:border-stone-700">
        {/* Tab 1: Public Reader */}
        <button
          type="button"
          onClick={() => {
            setSelectedPortal('reader');
            setErrorMessage(null);
          }}
          className={`py-2 px-3 rounded-md text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            selectedPortal === 'reader'
              ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm border border-stone-300 dark:border-stone-700'
              : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Reader Sign-In</span>
        </button>

        {/* Tab 2: Admin Desk */}
        <button
          type="button"
          onClick={() => {
            setSelectedPortal('admin');
            setErrorMessage(null);
          }}
          className={`py-2 px-3 rounded-md text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            selectedPortal === 'admin'
              ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-sm border border-stone-900 dark:border-stone-100'
              : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
          }`}
        >
          <Lock className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Admin &amp; Editorial Desk</span>
        </button>
      </div>

      {/* AUTHENTICATION CARD */}
      <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg p-5 sm:p-7 shadow-sm space-y-4">
        
        {/* Card Header & Description */}
        <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-serif font-black text-base sm:text-lg text-stone-900 dark:text-stone-100">
              {selectedPortal === 'reader' ? 'Sign In as Reader' : 'Editorial Bureau Access'}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
              selectedPortal === 'reader'
                ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                : 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
            }`}>
              {selectedPortal === 'reader' ? 'Reader Portal' : 'Admin Protected'}
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            {selectedPortal === 'reader'
              ? 'Unlock AI photo forensics, deepfake detector, NLP writing audit, and submit claims for real-time investigation.'
              : 'Restricted administrative desk to monitor live wire traffic, draft and publish investigations, edit stories, and manage security.'}
          </p>
        </div>

        {/* Error Message Alert */}
        {errorMessage && (
          <div className="p-3 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <span className="min-w-0 leading-normal">{errorMessage}</span>
          </div>
        )}

        {/* Turnstile Anti-Bot Challenge (Enforced on Admin Portal) */}
        {selectedPortal === 'admin' && (
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Security Shield: Verify You Are Human <span className="text-rose-500">*</span>
            </label>
            <HumanVerificationChallenge
              isVerified={isHumanVerified}
              onVerify={() => {
                setIsHumanVerified(true);
                setErrorMessage(null);
              }}
              onReset={() => setIsHumanVerified(false)}
            />
          </div>
        )}

        {/* PRIMARY ACTION 1: CONTINUE WITH GOOGLE (FIREBASE AUTH) */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading || (selectedPortal === 'admin' && !isHumanVerified)}
            className="w-full py-2.5 px-4 rounded bg-white hover:bg-stone-50 dark:bg-stone-850 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 shadow-2xs transition-all disabled:opacity-60 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* DIVIDER */}
        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200 dark:border-stone-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-stone-900 px-3 text-stone-500 font-mono text-[10px] tracking-wider">
              Or Email &amp; Password
            </span>
          </div>
        </div>

        {/* EMAIL / PASSWORD FORM */}
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          {formMode === 'register' && (
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Full Name / Pseudonym
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={selectedPortal === 'admin' ? 'Editor Dhaval Thakar' : 'Jane Citizen'}
                className="w-full px-3 py-2 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={selectedPortal === 'admin' ? 'editor@trace.ai' : 'reader@example.com'}
              required
              className="w-full px-3 py-2 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3 py-2 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100 pr-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || (selectedPortal === 'admin' && !isHumanVerified)}
            className="w-full py-2.5 px-4 rounded bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-white dark:text-stone-900 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-60 cursor-pointer mt-1"
          >
            <span>
              {isLoading
                ? 'Authenticating...'
                : formMode === 'register'
                ? selectedPortal === 'admin' ? 'Register Editorial Account' : 'Create Reader Account'
                : selectedPortal === 'admin' ? 'Sign In to Admin Desk' : 'Sign In as Reader'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Form Mode Toggle */}
          <div className="text-center pt-1 text-xs text-stone-500">
            {formMode === 'signin' ? (
              <span>
                New to TRACE?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setFormMode('register');
                    setErrorMessage(null);
                  }}
                  className="text-stone-900 dark:text-stone-100 font-bold underline hover:opacity-80 cursor-pointer"
                >
                  Create an account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setFormMode('signin');
                    setErrorMessage(null);
                  }}
                  className="text-stone-900 dark:text-stone-100 font-bold underline hover:opacity-80 cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </form>

        {/* OPTION FOR PUBLIC READERS: QUICK VERIFIED READER ACCESS */}
        {selectedPortal === 'reader' && (
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={handleFastReaderAccess}
              disabled={isLoading}
              className="w-full py-2 px-3 rounded bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-500" />
              <span>Continue as Anonymous Reader</span>
            </button>
          </div>
        )}

        {/* Footer Security Badge */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-850">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>TRACE Sentinel Protected</span>
          </span>

          <span className="font-mono text-[10px] text-stone-400">
            SSL 256-BIT ENCRYPTED
          </span>
        </div>
      </div>
    </>
  );

  // ---------------------------------------------------------------------------
  // MODAL DIALOG MODE
  // ---------------------------------------------------------------------------
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in font-sans">
        <div className="bg-[#fbfaf8] dark:bg-[#111317] border border-stone-300 dark:border-stone-800 rounded-lg max-w-lg w-full text-stone-900 dark:text-stone-100 shadow-2xl max-h-[94vh] flex flex-col overflow-hidden my-auto relative">
          
          {/* Modal Header */}
          <div className="p-3.5 sm:p-4 bg-stone-100/90 dark:bg-stone-900/90 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <TraceLogo className="w-7 h-7 rounded-lg shrink-0" />
              <div className="min-w-0">
                <h3 className="font-serif font-black text-sm sm:text-base text-stone-900 dark:text-stone-100 truncate">
                  {selectedPortal === 'admin' ? 'TRACE Editorial CMS Portal' : 'TRACE Reader Sign-In'}
                </h3>
                <p className="text-[10px] text-stone-500 font-mono truncate">Truth Review &amp; Authenticity Checking Engine</p>
              </div>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Feature Notice Alert */}
            {modalNotice && (
              <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="font-bold block mb-0.5 text-xs">AI Forensic Analysis Feature</span>
                  <span className="text-[11px] leading-relaxed block text-amber-800 dark:text-amber-300">
                    {modalNotice}
                  </span>
                </div>
              </div>
            )}

            {renderAuthContent(true)}

            {/* Continue Reading as Guest dismiss link */}
            {onClose && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 underline font-medium cursor-pointer"
                >
                  Continue Reading Stories as Guest (No Login Required)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // FULLSCREEN GATEWAY MODE
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#fbfaf8] dark:bg-[#111317] text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Newspaper Header Ribbon */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60 py-2 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-semibold text-stone-800 dark:text-stone-200">{todayFormatted}</span>
            <span className="hidden sm:inline text-stone-300 dark:text-stone-700">|</span>
            <span className="hidden sm:inline uppercase tracking-widest text-[10px]">Secure Authentication Gateway</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
              <span>Project: trace-34d57</span>
            </div>

            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-1 rounded bg-stone-200/80 hover:bg-stone-300/80 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-stone-700" />
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Gateway Body */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl mx-auto space-y-6">

          {/* Masthead Banner */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-3">
              <TraceLogo className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-sm" />
            </div>

            <div className="inline-block border-y border-stone-300 dark:border-stone-800 py-1 px-4 mb-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400">
                Independent Digital Forensic Wire • Vol. V
              </span>
            </div>

            <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-50 tracking-tight">
              TRACE
            </h1>
            <p className="text-xs sm:text-sm font-serif italic text-stone-600 dark:text-stone-400 max-w-md mx-auto">
              Truth Review &amp; Authenticity Checking Engine
            </p>
          </div>

          {renderAuthContent(false)}

          {/* Academic Attribution */}
          <div className="text-center text-[11px] text-stone-500 dark:text-stone-400 font-mono">
            <span>TRACE Forensic News Engine • BCA Dept. of Computer Science • SSCCS</span>
          </div>
        </div>
      </main>
    </div>
  );
};
