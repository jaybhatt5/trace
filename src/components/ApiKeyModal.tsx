import React, { useState } from 'react';
import { Key, Sparkles, CheckCircle2, AlertTriangle, X, RefreshCw, ExternalLink, Trash2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [inputKey, setInputKey] = useState<string>(apiKey);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!inputKey.trim()) {
      setTestResult({ success: false, message: 'Please enter a Gemini API Key before testing.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/verify-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': inputKey.trim(),
        },
        body: JSON.stringify({ apiKey: inputKey.trim() }),
      });

      const data = await response.json();
      if (data.valid) {
        setTestResult({
          success: true,
          message: data.message || 'API Key Verified! Successfully connected to Gemini 3.7 Flash.',
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'API Key validation failed. Please verify the key and permissions.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Network error while validating key.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    onClose();
  };

  const handleClear = () => {
    setInputKey('');
    onSaveApiKey('');
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 dark:bg-black/80 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded w-full max-w-lg overflow-hidden shadow-xl relative">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-100/90 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 flex items-center justify-center shrink-0">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-50">TRACE Google Gemini API Setup</h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">Power TRACE with live Gemini 3.7 Flash multimodal intelligence</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {/* Status Banner */}
          <div className={`p-3 rounded border flex items-center justify-between gap-3 text-xs ${
            apiKey ? 'bg-stone-100 dark:bg-stone-950 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200' : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${apiKey ? 'bg-emerald-600' : 'bg-amber-600'}`} />
              <span className="font-semibold text-[11px]">
                {apiKey ? 'Status: Custom Gemini 3.7 API Key Active' : 'Status: High-Precision Multi-Engine Forensic Mode'}
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              {apiKey ? 'Live AI' : 'Smart Offline'}
            </span>
          </div>

          {/* Key Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center justify-between">
              <span className="uppercase tracking-wider text-[11px]">Google Gemini API Key:</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-stone-900 dark:text-stone-100 underline inline-flex items-center gap-1 text-[11px]"
              >
                <span>Get a free API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>

            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-[#fbfaf8] dark:bg-[#111317] border border-stone-300 dark:border-stone-700 rounded px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 font-mono placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-stone-900 dark:focus:border-stone-300"
            />
            <p className="text-[10px] text-stone-500 dark:text-stone-400">
              Your API key is securely stored in your local browser storage and used directly for fact-checking and forensic requests.
            </p>
          </div>

          {/* Test Feedback Notice */}
          {testResult && (
            <div className={`p-3 rounded border text-xs flex items-start gap-2 ${
              testResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5">
          {apiKey ? (
            <button
              onClick={handleClear}
              className="w-full sm:w-auto px-3.5 py-2 rounded text-xs font-semibold text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider text-[11px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Key</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleTestKey}
              disabled={isTesting || !inputKey.trim()}
              className="bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded px-4 py-2 flex-1 sm:flex-none transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 uppercase tracking-wider text-[11px]"
            >
              {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Test Connection</span>
            </button>

            <button
              onClick={handleSave}
              className="bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-stone-50 dark:text-stone-900 font-semibold text-xs uppercase tracking-wider rounded px-5 py-2 shadow-2xs flex-1 sm:flex-none transition-all active:scale-95"
            >
              Save & Apply
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
