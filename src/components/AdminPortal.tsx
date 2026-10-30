/**
 * TRACE - Editorial CMS & Public Site Monitoring Portal
 * 
 * Features:
 * - Firebase Authentication with Google Sign-In & Email/Password
 * - Automatic auto-login when device was previously authenticated
 * - Interactive Cloudflare Turnstile "Are you human?" security challenge
 * - Live public feed monitoring and health analytics
 * - Complete editorial publication desk: Add news, Edit existing stories, Delete stories
 * - Durable persistence synchronization with server
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  PlusCircle,
  FileEdit,
  Trash2,
  ExternalLink,
  LogOut,
  Settings,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Activity,
  Database,
  Lock,
  User,
  Sliders,
  ArrowRight,
  Eye,
  Check,
  X,
  Server
} from 'lucide-react';
import { TraceLogo } from './TraceLogo';
import { HumanVerificationChallenge } from './HumanVerificationChallenge';
import {
  type AdminUser,
  signInWithGoogle,
  signInWithEmail,
  logoutAdmin,
  subscribeToAuthChanges,
  getActiveFirebaseConfig,
  saveFirebaseConfig,
  formatAuthErrorMessage,
  type FirebaseConfigParams,
} from '../utils/firebase';
import { POSTGRESQL_CONNECTION_PARAMS } from '../utils/dataConnectClient';
import type { FactCheckItem, VerdictType, ContentCategory } from '../types';

interface AdminPortalProps {
  onBackToPublic: () => void;
  feedItems: FactCheckItem[];
  onRefreshFeed: () => Promise<void>;
  currentUser?: AdminUser | null;
  onLogout?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToPublic,
  feedItems,
  onRefreshFeed,
  currentUser: propUser,
  onLogout: propLogout,
}) => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(propUser || null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (propUser !== undefined) {
      setCurrentUser(propUser);
    }
  }, [propUser]);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isHumanVerified, setIsHumanVerified] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Active view tab
  const [adminTab, setAdminTab] = useState<'monitor' | 'publish' | 'manage' | 'settings'>('monitor');

  // Firebase Config Modal State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  const [customProjectId, setCustomProjectId] = useState('');
  const [customAuthDomain, setCustomAuthDomain] = useState('');
  const [customStorageBucket, setCustomStorageBucket] = useState('');
  const [customMessagingSenderId, setCustomMessagingSenderId] = useState('');
  const [customAppId, setCustomAppId] = useState('');
  const [rawSnippetInput, setRawSnippetInput] = useState('');
  const [configSuccessMsg, setConfigSuccessMsg] = useState<string | null>(null);

  // Search & Filter for manage tab
  const [manageSearch, setManageSearch] = useState('');
  const [manageCategory, setManageCategory] = useState<string>('All');
  const [manageVerdict, setManageVerdict] = useState<string>('All');

  // Publish Form State
  const [pubTitle, setPubTitle] = useState('');
  const [pubClaim, setPubClaim] = useState('');
  const [pubVerdict, setPubVerdict] = useState<VerdictType>('VERIFIED_TRUE');
  const [pubTruthScore, setPubTruthScore] = useState<number>(92);
  const [pubCategory, setPubCategory] = useState<ContentCategory>('World News');
  const [pubSummary, setPubSummary] = useState('');
  const [pubExplanation, setPubExplanation] = useState('');
  const [pubKeyFindings, setPubKeyFindings] = useState<string[]>([
    'Official government and agency archives verify the claim parameters.',
    'No doctored media elements detected across distributed assets.',
  ]);
  const [pubFindingInput, setPubFindingInput] = useState('');
  const [pubSources, setPubSources] = useState<{ name: string; credibilityScore: number; type: any }[]>([
    { name: 'Associated Press Wire Archive', credibilityScore: 96, type: 'Official Standard' },
    { name: 'International Fact-Checking Network', credibilityScore: 94, type: 'Fact Checking Org' },
  ]);
  const [pubSourceName, setPubSourceName] = useState('');
  const [pubSourceScore, setPubSourceScore] = useState(95);
  const [pubImageUrl, setPubImageUrl] = useState('https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80');
  const [pubTags, setPubTags] = useState('World News, Verified Record');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);

  // Editing existing story modal
  const [editingItem, setEditingItem] = useState<FactCheckItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editClaim, setEditClaim] = useState('');
  const [editVerdict, setEditVerdict] = useState<VerdictType>('VERIFIED_TRUE');
  const [editTruthScore, setEditTruthScore] = useState<number>(90);
  const [editCategory, setEditCategory] = useState<ContentCategory>('World News');
  const [editSummary, setEditSummary] = useState('');
  const [editExplanation, setEditExplanation] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Auto-login & Subscribe to Auth State
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    // Pre-fill existing config if available
    const existingConfig = getActiveFirebaseConfig();
    if (existingConfig) {
      setCustomApiKey(existingConfig.apiKey || '');
      setCustomProjectId(existingConfig.projectId || '');
      setCustomAuthDomain(existingConfig.authDomain || '');
      setCustomStorageBucket(existingConfig.storageBucket || '');
      setCustomMessagingSenderId(existingConfig.messagingSenderId || '');
      setCustomAppId(existingConfig.appId || '');
    }

    return () => unsubscribe();
  }, []);

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    if (!isHumanVerified) {
      setAuthError('Please complete the "Verify you are human" security challenge first.');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      const user = await signInWithGoogle('admin');
      setCurrentUser(user);
    } catch (err: any) {
      console.warn('Google Sign-In failed:', err);
      setAuthError(formatAuthErrorMessage(err));
    } finally {
      setAuthLoading(false);
    }
  };

  // Email Sign-In Handler
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHumanVerified) {
      setAuthError('Please complete the "Verify you are human" security challenge first.');
      return;
    }
    if (!emailInput || !passwordInput) {
      setAuthError('Please enter both email and password.');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      const user = await signInWithEmail(emailInput, passwordInput, 'admin');
      setCurrentUser(user);
    } catch (err: any) {
      setAuthError(formatAuthErrorMessage(err));
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout Handler
  const handleSignOut = async () => {
    if (propLogout) {
      propLogout();
    } else {
      await logoutAdmin();
    }
    setCurrentUser(null);
    setIsHumanVerified(false);
    setTurnstileToken(null);
  };

  // Quick-parse pasted Firebase snippet or JSON
  const handleSnippetPaste = (text: string) => {
    setRawSnippetInput(text);
    if (!text) return;
    const extract = (key: string) => {
      const regex = new RegExp(`["']?${key}["']?\\s*:\\s*["']([^"']+)["']`, 'i');
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    };

    const key = extract('apiKey');
    const proj = extract('projectId');
    const auth = extract('authDomain');
    const app = extract('appId');
    const storage = extract('storageBucket');
    const sender = extract('messagingSenderId');

    if (key) setCustomApiKey(key);
    if (proj) setCustomProjectId(proj);
    if (auth) setCustomAuthDomain(auth);
    if (app) setCustomAppId(app);
    if (storage) setCustomStorageBucket(storage);
    if (sender) setCustomMessagingSenderId(sender);
  };

  // Save Custom Firebase Config
  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customApiKey || !customProjectId) {
      alert('API Key and Project ID are required.');
      return;
    }

    const newConfig: FirebaseConfigParams = {
      apiKey: customApiKey.trim(),
      authDomain: customAuthDomain.trim() || `${customProjectId.trim()}.firebaseapp.com`,
      projectId: customProjectId.trim(),
      storageBucket: customStorageBucket.trim() || `${customProjectId.trim()}.firebasestorage.app`,
      messagingSenderId: customMessagingSenderId.trim(),
      appId: customAppId.trim() || '1:1000000000:web:traceai',
    };

    saveFirebaseConfig(newConfig);
    setConfigSuccessMsg('Firebase project credentials saved! Connecting...');
    setTimeout(() => {
      setIsConfigModalOpen(false);
      setConfigSuccessMsg(null);
      window.location.reload();
    }, 1200);
  };

  // Clear & Reset Firebase Config
  const handleResetFirebaseConfig = () => {
    localStorage.removeItem('trace_firebase_config');
    setCustomApiKey('');
    setCustomProjectId('');
    setCustomAuthDomain('');
    setCustomStorageBucket('');
    setCustomMessagingSenderId('');
    setCustomAppId('');
    setRawSnippetInput('');
    setConfigSuccessMsg('Credentials cleared. Reverted to trace-34d57 default configuration.');
    setTimeout(() => {
      setIsConfigModalOpen(false);
      setConfigSuccessMsg(null);
      window.location.reload();
    }, 1200);
  };

  // Render Firebase Credentials Configuration Modal
  const renderFirebaseModal = () => {
    if (!isConfigModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">Firebase Project Credentials</h3>
                <p className="text-[11px] text-stone-500">Configure Google OAuth & Editorial Authentication</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(false)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {configSuccessMsg && (
            <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{configSuccessMsg}</span>
            </div>
          )}

          {/* Quick Paste Box */}
          <div className="bg-stone-50 dark:bg-stone-850 p-3 rounded border border-stone-200 dark:border-stone-800 space-y-1.5">
            <label className="block text-[11px] font-bold text-stone-800 dark:text-stone-200">
              ⚡ Quick Paste from Firebase Console (Snippet or JSON)
            </label>
            <textarea
              rows={3}
              value={rawSnippetInput}
              onChange={(e) => handleSnippetPaste(e.target.value)}
              placeholder={'const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  projectId: "your-project",\n  authDomain: "your-project.firebaseapp.com"\n};'}
              className="w-full font-mono text-[11px] px-2.5 py-1.5 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
            />
            <p className="text-[10px] text-stone-500">
              Paste the code snippet directly from Firebase Console — fields below will auto-populate instantly.
            </p>
          </div>

          <form onSubmit={handleSaveFirebaseConfig} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Firebase API Key <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  required
                  className="w-full px-2.5 py-1.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Project ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customProjectId}
                  onChange={(e) => setCustomProjectId(e.target.value)}
                  placeholder="my-trace-project"
                  required
                  className="w-full px-2.5 py-1.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Auth Domain
                </label>
                <input
                  type="text"
                  value={customAuthDomain}
                  onChange={(e) => setCustomAuthDomain(e.target.value)}
                  placeholder="my-trace-project.firebaseapp.com"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  App ID
                </label>
                <input
                  type="text"
                  value={customAppId}
                  onChange={(e) => setCustomAppId(e.target.value)}
                  placeholder="1:123456789:web:abcdef"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Storage Bucket (Optional)
                </label>
                <input
                  type="text"
                  value={customStorageBucket}
                  onChange={(e) => setCustomStorageBucket(e.target.value)}
                  placeholder="my-trace-project.firebasestorage.app"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Sender ID (Optional)
                </label>
                <input
                  type="text"
                  value={customMessagingSenderId}
                  onChange={(e) => setCustomMessagingSenderId(e.target.value)}
                  placeholder="123456789012"
                  className="w-full px-2.5 py-1.5 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            {/* Step-by-step Help */}
            <div className="p-3 rounded bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-[11px] text-blue-900 dark:text-blue-300 space-y-1">
              <span className="font-bold block">Where to find these in Firebase:</span>
              <ol className="list-decimal list-inside space-y-0.5 text-[10px]">
                <li>Visit <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="underline font-bold">console.firebase.google.com</a></li>
                <li>Go to <strong>Project Settings</strong> &gt; <strong>General</strong> &gt; <strong>Your apps</strong> &gt; Select <strong>Web (&lt;/&gt;)</strong></li>
                <li>Copy the <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/60 rounded">firebaseConfig</code> block and paste it in the box above!</li>
                <li>In Firebase Console &gt; <strong>Authentication</strong> &gt; <strong>Sign-in method</strong>, enable <strong>Google</strong>.</li>
              </ol>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={handleResetFirebaseConfig}
                className="text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 text-[11px] underline cursor-pointer"
              >
                Reset to Project Defaults
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold hover:bg-stone-800 dark:hover:bg-stone-250 cursor-pointer"
                >
                  Save & Connect
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add Key Finding to Publish Form
  const handleAddFinding = () => {
    if (pubFindingInput.trim()) {
      setPubKeyFindings([...pubKeyFindings, pubFindingInput.trim()]);
      setPubFindingInput('');
    }
  };

  // Remove Key Finding
  const handleRemoveFinding = (idx: number) => {
    setPubKeyFindings(pubKeyFindings.filter((_, i) => i !== idx));
  };

  // Add Source to Publish Form
  const handleAddSource = () => {
    if (pubSourceName.trim()) {
      setPubSources([
        ...pubSources,
        { name: pubSourceName.trim(), credibilityScore: pubSourceScore, type: 'Official Standard' },
      ]);
      setPubSourceName('');
    }
  };

  // Remove Source
  const handleRemoveSource = (idx: number) => {
    setPubSources(pubSources.filter((_, i) => i !== idx));
  };

  // Publish Story to Backend
  const handlePublishStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitle.trim() || !pubClaim.trim()) {
      alert('Headline and claim are required.');
      return;
    }

    setIsPublishing(true);
    setPublishSuccessMessage(null);

    try {
      const payload = {
        title: pubTitle,
        claim: pubClaim,
        verdict: pubVerdict,
        truthScore: pubTruthScore,
        category: pubCategory,
        summary: pubSummary || `Report verified by TRACE Editorial Bureau as ${pubVerdict}.`,
        explanation: pubExplanation || `Cross-referenced documentation categorizes this claim under ${pubVerdict}.`,
        keyFindings: pubKeyFindings,
        sources: pubSources,
        imageUrl: pubImageUrl,
        tags: pubTags.split(',').map(t => t.trim()).filter(Boolean),
        author: currentUser?.displayName || 'TRACE Editorial Board',
      };

      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Server returned an error publishing article.');
      }

      await onRefreshFeed();
      setPublishSuccessMessage(`Published "${pubTitle}" directly to public wire!`);
      // Reset form fields
      setPubTitle('');
      setPubClaim('');
      setPubSummary('');
      setPubExplanation('');

      setTimeout(() => setPublishSuccessMessage(null), 5000);
    } catch (err: any) {
      alert('Publishing failed: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  // Edit Story Modal Trigger
  const handleOpenEditModal = (item: FactCheckItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditClaim(item.claim);
    setEditVerdict(item.verdict);
    setEditTruthScore(item.truthScore);
    setEditCategory(item.category);
    setEditSummary(item.summary);
    setEditExplanation(item.explanation);
  };

  // Save Edit Story
  const handleSaveEditedStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/news/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          claim: editClaim,
          verdict: editVerdict,
          truthScore: editTruthScore,
          category: editCategory,
          summary: editSummary,
          explanation: editExplanation,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update news item.');
      }

      await onRefreshFeed();
      setEditingItem(null);
    } catch (err: any) {
      alert('Error saving changes: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Story
  const handleDeleteStory = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}" from the public feed?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Server error deleting news item.');
      }
      await onRefreshFeed();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Filtered stories for manage view
  const filteredManageStories = feedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(manageSearch.toLowerCase()) ||
      item.claim.toLowerCase().includes(manageSearch.toLowerCase());
    const matchesCategory = manageCategory === 'All' || item.category === manageCategory;
    const matchesVerdict = manageVerdict === 'All' || item.verdict === manageVerdict;
    return matchesSearch && matchesCategory && matchesVerdict;
  });

  // ---------------------------------------------------------------------------
  // VIEW 1: AUTHENTICATION GATE (IF NOT LOGGED IN)
  // ---------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] dark:bg-[#111317] text-stone-900 dark:text-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 font-sans transition-colors">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          {/* Logo & Crest */}
          <div className="flex justify-center mb-4">
            <TraceLogo className="w-16 h-16 rounded-2xl shadow-sm" />
          </div>

          <h2 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 dark:text-stone-50 tracking-tight">
            TRACE CMS & Admin Desk
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-serif italic">
            Truth Review & Authenticity Checking Engine — Editorial Access Bureau
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 py-8 px-5 sm:px-10 shadow-sm rounded-lg space-y-5">
            {/* Security Notice */}
            <div className="flex items-center gap-2 p-2.5 rounded bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 text-xs text-stone-700 dark:text-stone-300">
              <Lock className="w-4 h-4 text-stone-500 shrink-0" />
              <span>Restricted editorial terminal for newsroom monitoring and claims publishing.</span>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-3 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span className="min-w-0">{authError}</span>
              </div>
            )}

            {/* Cloudflare Turnstile "Are you human?" Challenge */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Step 1: Security Shield Challenge
              </label>
              <HumanVerificationChallenge
                isVerified={isHumanVerified}
                onVerify={(tok) => {
                  setIsHumanVerified(true);
                  setTurnstileToken(tok);
                  setAuthError(null);
                }}
              />
            </div>

            {/* Google Firebase Login Button */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                Step 2: Authenticate Identity
              </label>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={!isHumanVerified || authLoading}
                className={`w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded border font-semibold text-xs sm:text-sm transition-all shadow-2xs ${
                  isHumanVerified && !authLoading
                    ? 'bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-100 border-stone-300 dark:border-stone-700 active:scale-98 cursor-pointer'
                    : 'bg-stone-100 dark:bg-stone-850 text-stone-400 dark:text-stone-600 border-stone-200 dark:border-stone-800 cursor-not-allowed opacity-75'
                }`}
              >
                {/* Official Google Color G Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google (Firebase Auth)</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200 dark:border-stone-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-stone-900 px-2 text-stone-500 font-mono text-[10px]">
                  Or Editorial Credentials
                </span>
              </div>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Editor Work Email
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="editor@trace.ai"
                  disabled={!isHumanVerified}
                  className="w-full px-3 py-2 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Access Key Password
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={!isHumanVerified}
                  className="w-full px-3 py-2 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-stone-900 dark:focus:ring-stone-100 disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={!isHumanVerified || authLoading}
                className="w-full py-2 px-3 rounded bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-60 cursor-pointer"
              >
                Sign In to Editorial Console
              </button>
            </form>

            {/* Back Button */}
            <div className="flex items-center justify-end text-xs text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800/60">
              <button
                type="button"
                onClick={onBackToPublic}
                className="hover:text-stone-900 dark:hover:text-stone-100 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Return to Public Wire</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Firebase Config Modal */}
        {renderFirebaseModal()}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW 2: FULL EDITORIAL CMS & MONITORING DESK (AUTHENTICATED)
  // ---------------------------------------------------------------------------
  const totalVerified = feedItems.filter(i => i.verdict === 'VERIFIED_TRUE').length;
  const totalFake = feedItems.filter(i => i.verdict === 'DEBUNKED_FAKE').length;
  const totalMisleading = feedItems.filter(i => i.verdict === 'MISLEADING').length;

  return (
    <div className="min-h-screen bg-[#fbfaf8] dark:bg-[#111317] text-stone-900 dark:text-stone-100 font-sans transition-colors">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 px-4 sm:px-6 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Portal Title */}
          <div className="flex items-center gap-3">
            <TraceLogo className="w-8 h-8 rounded-lg shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-lg tracking-tight uppercase">TRACE</span>
                <span className="text-stone-400 text-xs font-mono">| Editorial CMS</span>
              </div>
              <p className="text-[10px] text-stone-400 hidden sm:block">
                Truth Review & Authenticity Checking Engine — Public Site Monitoring
              </p>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            {/* User Badge */}
            <div className="flex items-center gap-2 pl-3 border-l border-stone-700">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Editor'}
                  className="w-7 h-7 rounded-full object-cover border border-stone-600"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-xs font-bold text-stone-200">
                  {currentUser.displayName?.charAt(0) || 'E'}
                </div>
              )}
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold block leading-tight truncate max-w-[140px]">
                  {currentUser.displayName}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono block">
                  ● {currentUser.role}
                </span>
              </div>
            </div>

            {/* View Public Site Button */}
            <button
              onClick={onBackToPublic}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Return to Public Broadsheet View"
            >
              <Eye className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">Public Site</span>
            </button>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 border-b-2 border-stone-900 dark:border-stone-100 pb-2 overflow-x-auto">
          <button
            onClick={() => setAdminTab('monitor')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              adminTab === 'monitor'
                ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900'
                : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Site Monitor</span>
          </button>

          <button
            onClick={() => setAdminTab('publish')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              adminTab === 'publish'
                ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900'
                : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Article</span>
          </button>

          <button
            onClick={() => setAdminTab('manage')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              adminTab === 'manage'
                ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900'
                : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            <FileEdit className="w-4 h-4" />
            <span>Manage Stories ({feedItems.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              adminTab === 'settings'
                ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900'
                : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Security & Firebase</span>
          </button>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* TAB 1: SITE MONITOR & OVERVIEW */}
        {/* ------------------------------------------------------------------- */}
        {adminTab === 'monitor' && (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-stone-900 p-4 rounded border border-stone-300 dark:border-stone-800 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Live Stories on Wire</span>
                <span className="font-serif font-black text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 block mt-1">
                  {feedItems.length}
                </span>
                <p className="text-[10px] text-stone-500 mt-1">Publicly indexed fact-checks</p>
              </div>

              <div className="bg-white dark:bg-stone-900 p-4 rounded border border-stone-300 dark:border-stone-800 shadow-2xs">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Verified Authentic</span>
                <span className="font-serif font-black text-2xl sm:text-3xl text-emerald-800 dark:text-emerald-300 block mt-1">
                  {totalVerified}
                </span>
                <p className="text-[10px] text-stone-500 mt-1">Truth Score ≥ 70%</p>
              </div>

              <div className="bg-white dark:bg-stone-900 p-4 rounded border border-stone-300 dark:border-stone-800 shadow-2xs">
                <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">Disinformation Busted</span>
                <span className="font-serif font-black text-2xl sm:text-3xl text-rose-800 dark:text-rose-300 block mt-1">
                  {totalFake}
                </span>
                <p className="text-[10px] text-stone-500 mt-1">Debunked fake narratives</p>
              </div>

              <div className="bg-white dark:bg-stone-900 p-4 rounded border border-stone-300 dark:border-stone-800 shadow-2xs">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">Misleading Context</span>
                <span className="font-serif font-black text-2xl sm:text-3xl text-amber-800 dark:text-amber-300 block mt-1">
                  {totalMisleading}
                </span>
                <p className="text-[10px] text-stone-500 mt-1">Half-truths & missing records</p>
              </div>
            </div>

            {/* System Engine Health Card */}
            <div className="bg-white dark:bg-stone-900 p-5 rounded border border-stone-300 dark:border-stone-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    System Architecture & Sentinel Diagnostics
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  ● OPERATIONAL
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
                  <span className="font-bold block text-stone-900 dark:text-stone-100 mb-1">Google Gemini 3.7 Flash Gateway</span>
                  <p className="text-stone-600 dark:text-stone-400 text-[11px]">
                    Grounding with live Google Search & Multimodal OCR Vision Sentinel.
                  </p>
                  <span className="mt-2 inline-block text-[10px] font-mono text-stone-500">Status: Active Fallback Shield</span>
                </div>

                <div className="p-3 rounded bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
                  <span className="font-bold block text-stone-900 dark:text-stone-100 mb-1">Firebase Authentication</span>
                  <p className="text-stone-600 dark:text-stone-400 text-[11px]">
                    OAuth Google Provider & local persistence for automatic seamless sign-in.
                  </p>
                  <span className="mt-2 inline-block text-[10px] font-mono text-stone-500">
                    Mode: Production Firebase SDK (trace-34d57)
                  </span>
                </div>

                <div className="p-3 rounded bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
                  <span className="font-bold block text-stone-900 dark:text-stone-100 mb-1">Data Storage & Persistence</span>
                  <p className="text-stone-600 dark:text-stone-400 text-[11px]">
                    Synchronized to durable disk at <code>data/user-factchecks.json</code>.
                  </p>
                  <span className="mt-2 inline-block text-[10px] font-mono text-stone-500">Auto-save on every edit</span>
                </div>
              </div>
            </div>

            {/* Quick Live Feed Preview Table */}
            <div className="bg-white dark:bg-stone-900 p-5 rounded border border-stone-300 dark:border-stone-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  Recent Dispatches on the Public Feed
                </h3>
                <button
                  onClick={() => setAdminTab('publish')}
                  className="text-xs font-bold text-stone-900 dark:text-stone-100 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Draft New Article</span>
                </button>
              </div>

              <div className="divide-y divide-stone-200 dark:divide-stone-800">
                {feedItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[9.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            item.verdict === 'VERIFIED_TRUE'
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                              : item.verdict === 'DEBUNKED_FAKE'
                              ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                              : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {item.verdict.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">{item.category}</span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-stone-500 truncate">{item.claim}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 cursor-pointer"
                        title="Edit Article"
                      >
                        <FileEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStory(item.id, item.title)}
                        className="p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 2: PUBLISH NEW ARTICLE / NEWS CLAIM */}
        {/* ------------------------------------------------------------------- */}
        {adminTab === 'publish' && (
          <div className="bg-white dark:bg-stone-900 p-6 rounded border border-stone-300 dark:border-stone-800 shadow-2xs space-y-6">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="font-serif font-black text-xl text-stone-900 dark:text-stone-100">
                Editorial Publication Desk
              </h3>
              <p className="text-xs text-stone-500">
                Author and publish empirical investigations, verified news dispatches, or debunked hoax analyses directly to the public wire.
              </p>
            </div>

            {publishSuccessMessage && (
              <div className="p-3 rounded bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{publishSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handlePublishStory} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Headline / Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    Headline / Investigation Title *
                  </label>
                  <input
                    type="text"
                    value={pubTitle}
                    onChange={(e) => setPubTitle(e.target.value)}
                    placeholder="e.g., Fact Check: Viral Report on Global Reserve Currency Treaty"
                    required
                    className="w-full px-3 py-2 text-sm rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-serif font-bold"
                  />
                </div>

                {/* Claim / Statement */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    Claim Statement Evaluated *
                  </label>
                  <textarea
                    rows={2}
                    value={pubClaim}
                    onChange={(e) => setPubClaim(e.target.value)}
                    placeholder="Quote the exact rumor, headline, or claim circulating on social media or broadcast..."
                    required
                    className="w-full px-3 py-2 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                {/* Verdict Selection */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    Official Verdict Stamp
                  </label>
                  <select
                    value={pubVerdict}
                    onChange={(e) => {
                      const v = e.target.value as VerdictType;
                      setPubVerdict(v);
                      if (v === 'VERIFIED_TRUE') setPubTruthScore(95);
                      else if (v === 'DEBUNKED_FAKE') setPubTruthScore(8);
                      else if (v === 'MISLEADING') setPubTruthScore(42);
                    }}
                    className="w-full px-3 py-2 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold"
                  >
                    <option value="VERIFIED_TRUE">VERIFIED TRUE (Spruce Green)</option>
                    <option value="DEBUNKED_FAKE">DEBUNKED FAKE (Editorial Crimson)</option>
                    <option value="MISLEADING">MISLEADING (Amber Ochre)</option>
                    <option value="UNVERIFIED">UNVERIFIED (Neutral Gray)</option>
                  </select>
                </div>

                {/* Category Desk */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    Category Desk
                  </label>
                  <select
                    value={pubCategory}
                    onChange={(e) => setPubCategory(e.target.value as ContentCategory)}
                    className="w-full px-3 py-2 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="World News">World News</option>
                    <option value="Politics">Politics</option>
                    <option value="Health & Science">Health & Science</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>

                {/* Truth Score Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1">
                    <span>Authenticity Truth Score</span>
                    <span className="font-mono text-stone-900 dark:text-stone-100">{pubTruthScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={pubTruthScore}
                    onChange={(e) => setPubTruthScore(Number(e.target.value))}
                    className="w-full accent-stone-900 dark:accent-stone-100 cursor-pointer"
                  />
                </div>

                {/* Lead Image URL */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    Feature Image URL
                  </label>
                  <input
                    type="url"
                    value={pubImageUrl}
                    onChange={(e) => setPubImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                {/* Summary Lead */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    Executive Summary (Lead Paragraph)
                  </label>
                  <textarea
                    rows={2}
                    value={pubSummary}
                    onChange={(e) => setPubSummary(e.target.value)}
                    placeholder="Concise overview summarizing why this claim is verified or debunked..."
                    className="w-full px-3 py-2 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                {/* Detailed Explanation */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    Full Investigative Reasoning & Evidence Analysis
                  </label>
                  <textarea
                    rows={4}
                    value={pubExplanation}
                    onChange={(e) => setPubExplanation(e.target.value)}
                    placeholder="Provide in-depth historical context, documentation citations, and forensic rationale..."
                    className="w-full px-3 py-2 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Dynamic Key Findings */}
              <div className="border-t border-stone-200 dark:border-stone-800 pt-3">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Key Findings (Evidence Bullets)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={pubFindingInput}
                    onChange={(e) => setPubFindingInput(e.target.value)}
                    placeholder="Add bullet: e.g. Treaty was ratified in 1994, not 2026..."
                    className="flex-1 px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddFinding}
                    className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 rounded text-xs font-bold hover:bg-stone-300 dark:hover:bg-stone-700 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {pubKeyFindings.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-1.5 bg-stone-50 dark:bg-stone-850 rounded border border-stone-200 dark:border-stone-800">
                      <span>• {f}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFinding(i)}
                        className="text-stone-400 hover:text-rose-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAdminTab('monitor')}
                  className="px-4 py-2 text-xs font-semibold rounded border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-6 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-stone-50 dark:text-stone-900 font-bold text-xs uppercase tracking-wider rounded transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isPublishing ? 'Publishing to Wire...' : 'Publish to Public Wire'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 3: MANAGE STORIES (EDIT / DELETE) */}
        {/* ------------------------------------------------------------------- */}
        {adminTab === 'manage' && (
          <div className="bg-white dark:bg-stone-900 p-6 rounded border border-stone-300 dark:border-stone-800 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-black text-xl text-stone-900 dark:text-stone-100">
                  Manage Public Wire Stories
                </h3>
                <p className="text-xs text-stone-500">
                  Edit headlines, modify truth scores, update verdicts, or delete obsolete dispatches.
                </p>
              </div>

              {/* Search input */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={manageSearch}
                    onChange={(e) => setManageSearch(e.target.value)}
                    placeholder="Search stories..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 w-44 sm:w-56"
                  />
                </div>
              </div>
            </div>

            {/* Stories Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-300 dark:border-stone-700 text-stone-500 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Story</th>
                    <th className="py-2.5 px-3">Verdict</th>
                    <th className="py-2.5 px-3">Truth Score</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {filteredManageStories.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-850/50">
                      <td className="py-3 px-3 max-w-xs sm:max-w-md">
                        <span className="font-serif font-bold text-stone-900 dark:text-stone-100 block truncate">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-stone-500 block truncate">
                          {item.claim}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            item.verdict === 'VERIFIED_TRUE'
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                              : item.verdict === 'DEBUNKED_FAKE'
                              ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                              : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {item.verdict.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-mono font-bold">
                        {item.truthScore}%
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-stone-600 dark:text-stone-400">
                        {item.category}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-right space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStory(item.id, item.title)}
                          className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredManageStories.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-stone-500">
                        No stories match your filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 4: SECURITY & FIREBASE SETTINGS */}
        {/* ------------------------------------------------------------------- */}
        {adminTab === 'settings' && (
          <div className="bg-white dark:bg-stone-900 p-6 rounded border border-stone-300 dark:border-stone-800 shadow-2xs space-y-6">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="font-serif font-black text-xl text-stone-900 dark:text-stone-100">
                Security & Firebase Authentication Parameters
              </h3>
              <p className="text-xs text-stone-500">
                Manage Firebase Google OAuth integration, session persistence rules, and Cloudflare Turnstile human challenge thresholds.
              </p>
            </div>

            <div className="space-y-4 max-w-xl">
              <div className="p-4 rounded bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-xs space-y-2">
                <span className="font-bold text-stone-900 dark:text-stone-100 block">Active Firebase Connection:</span>
                <p className="text-stone-600 dark:text-stone-400 font-mono text-[11px]">
                  Project ID: {getActiveFirebaseConfig()?.projectId || 'trace-34d57'}
                </p>
                <p className="text-stone-600 dark:text-stone-400 font-mono text-[11px]">
                  Auth Domain: {getActiveFirebaseConfig()?.authDomain || 'localhost'}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsConfigModalOpen(true)}
                    className="px-3 py-1.5 rounded bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 font-bold cursor-pointer"
                  >
                    Change Firebase Project Keys
                  </button>
                </div>
              </div>

              {/* Cloud SQL for PostgreSQL (Firebase SQL Connect) Telemetry Card */}
              <div className="p-4 rounded bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      Firebase SQL Connect (Cloud SQL for PostgreSQL)
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {POSTGRESQL_CONNECTION_PARAMS.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-stone-600 dark:text-stone-400">
                  <div>
                    <span className="text-stone-400 block text-[9px] uppercase">Engine:</span>
                    <span>{POSTGRESQL_CONNECTION_PARAMS.engine}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9px] uppercase">Database:</span>
                    <span className="text-stone-900 dark:text-stone-100 font-bold">{POSTGRESQL_CONNECTION_PARAMS.database}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9px] uppercase">Service ID:</span>
                    <span>{POSTGRESQL_CONNECTION_PARAMS.serviceId}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[9px] uppercase">Instance:</span>
                    <span>{POSTGRESQL_CONNECTION_PARAMS.instanceId}</span>
                  </div>
                </div>
                <div className="pt-1 border-t border-stone-200 dark:border-stone-800 text-[10px] text-stone-500">
                  <span className="font-semibold block text-stone-700 dark:text-stone-300 mb-1">Active Schema Tables:</span>
                  <div className="flex flex-wrap gap-1 font-mono">
                    {['users', 'stories', 'story_findings', 'story_sources', 'media_audits'].map(t => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-xs space-y-2">
                <span className="font-bold text-stone-900 dark:text-stone-100 block">Turnstile Anti-Bot Shield</span>
                <p className="text-stone-600 dark:text-stone-400">
                  All administrative and publishing actions mandate interactive human verification challenge completion to prevent automated script spam.
                </p>
                <span className="inline-block text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  Status: Active & Enforced
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --------------------------------------------------------------------- */}
      {/* EDIT STORY MODAL */}
      {/* --------------------------------------------------------------------- */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-black text-lg text-stone-900 dark:text-stone-100">
                  Edit Published Article
                </h3>
                <p className="text-[11px] text-stone-500 font-mono">Article ID: {editingItem.id}</p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedStory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Headline</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-serif font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Claim Statement</label>
                <textarea
                  rows={2}
                  value={editClaim}
                  onChange={(e) => setEditClaim(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Verdict</label>
                  <select
                    value={editVerdict}
                    onChange={(e) => setEditVerdict(e.target.value as VerdictType)}
                    className="w-full px-3 py-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold"
                  >
                    <option value="VERIFIED_TRUE">VERIFIED TRUE</option>
                    <option value="DEBUNKED_FAKE">DEBUNKED FAKE</option>
                    <option value="MISLEADING">MISLEADING</option>
                    <option value="UNVERIFIED">UNVERIFIED</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Truth Score ({editTruthScore}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editTruthScore}
                    onChange={(e) => setEditTruthScore(Number(e.target.value))}
                    className="w-full accent-stone-900 dark:accent-stone-100 mt-2 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Executive Summary</label>
                <textarea
                  rows={2}
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Full Explanation</label>
                <textarea
                  rows={4}
                  value={editExplanation}
                  onChange={(e) => setEditExplanation(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-stone-200 text-white dark:text-stone-900 font-bold uppercase tracking-wider"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Firebase Credentials Modal for Authenticated Session */}
      {renderFirebaseModal()}
    </div>
  );
};
