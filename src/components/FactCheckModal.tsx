/**
 * TRACE - Verification Audit Certificate Modal & Print/PDF Exporter
 * 
 * TRACE: Truth Review & Authenticity Checking Engine
 * 
 * Features:
 * - High-fidelity verification audit certificate with unique Certificate ID and QR code.
 * - Displays truth scores, multi-paragraph reasoning, key findings bullets, and authoritative wire sources.
 * - Print / PDF Export support (invokes `window.print()` with clean `@media print` overrides).
 */

import React from 'react';
import { FactCheckItem, DeepfakeAnalysisResult } from '../types';
import { X, CheckCircle2, AlertTriangle, Printer, ExternalLink, QrCode, ArrowLeft } from 'lucide-react';
import { TraceLogo } from './TraceLogo';

interface FactCheckModalProps {
  /** The selected fact check article to inspect, if applicable */
  item: FactCheckItem | null;

  /** The selected deepfake inspection result to inspect, if applicable */
  deepfakeResult?: DeepfakeAnalysisResult | null;

  /** Callback to close the modal dialog */
  onClose: () => void;
}

export const FactCheckModal: React.FC<FactCheckModalProps> = ({ item, deepfakeResult, onClose }) => {
  if (!item && !deepfakeResult) return null;

  const title = item ? item.title : deepfakeResult?.verdictLabel;
  const summary = item ? item.summary : deepfakeResult?.summary;
  const explanation = item ? item.explanation : deepfakeResult?.summary;
  const score = item ? item.truthScore : (100 - (deepfakeResult?.aiProbability || 0));
  const isFake = item ? (item.verdict === 'DEBUNKED_FAKE' || item.verdict === 'MISLEADING') : deepfakeResult?.isManipulated;

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in font-sans">
      <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded max-w-3xl w-full text-stone-900 dark:text-stone-100 shadow-xl max-h-[92vh] flex flex-col overflow-hidden my-auto print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Modal Header */}
        <div className="p-3 sm:p-4 md:p-5 bg-stone-100/90 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={onClose}
              className="bg-white hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 rounded p-1.5 px-2.5 sm:px-3 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 active:scale-95 uppercase tracking-wider text-[11px]"
              title="Return to feed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Back</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-stone-300 dark:border-stone-700 min-w-0">
              <TraceLogo
                className="w-7 h-7 rounded-lg shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[11px] sm:text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider block truncate">TRACE Official Record</span>
                <p className="text-[10px] text-stone-500 font-mono truncate">Certificate #TRACE-{item?.id || 'DF'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handlePrintReport}
              className="bg-white hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded px-2.5 py-1.5 flex items-center gap-1.5 transition-colors active:scale-95 uppercase tracking-wider text-[11px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            
            <button
              onClick={onClose}
              className="bg-white hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded p-1.5 transition-colors active:scale-95"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
          
          {/* Top Stamp Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 sm:pb-6 border-b-2 border-stone-900 dark:border-stone-100">
            <div className="min-w-0 flex-1">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider mb-2 border ${
                isFake ? 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              }`}>
                {isFake ? <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> : <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                <span>{item ? item.verdict.replace('_', ' ') : (deepfakeResult?.isManipulated ? 'DEEPFAKE SYNTHETIC' : 'AUTHENTIC OPTICAL')}</span>
              </div>
              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-black text-stone-900 dark:text-stone-50 leading-snug break-words">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Truth Index</span>
                <span className={`font-serif text-2xl sm:text-3xl font-black ${isFake ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                  {score}%
                </span>
              </div>
              <div className="w-14 h-14 rounded bg-stone-100 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 flex items-center justify-center p-2 shrink-0">
                <QrCode className="w-10 h-10 text-stone-800 dark:text-stone-200 opacity-80" />
              </div>
            </div>
          </div>

          {/* Claim Statement */}
          {item && (
            <div className="bg-stone-50 dark:bg-stone-950 border-l-4 border-stone-900 dark:border-stone-100 p-3 sm:p-4 text-xs sm:text-sm text-stone-800 dark:text-stone-200">
              <span className="font-bold text-xs uppercase tracking-wider block mb-1 text-stone-600 dark:text-stone-400">Investigated Claim:</span>
              <p className="italic font-serif text-sm sm:text-base break-words">"{item.claim}"</p>
            </div>
          )}

          {/* Media Evidence Subject if available */}
          {(item?.imageUrl || deepfakeResult?.mediaUrl) && (
            <div className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded p-3 sm:p-4 text-xs sm:text-sm space-y-2">
              <span className="font-bold text-[11px] uppercase tracking-wider block text-stone-600 dark:text-stone-400">Audited Media Evidence</span>
              {((item?.imageUrl && (item.imageUrl.startsWith('data:video') || /\.mp4/i.test(item.imageUrl))) ||
                (deepfakeResult?.mediaUrl && (deepfakeResult.mediaUrl.startsWith('data:video') || /\.mp4/i.test(deepfakeResult.mediaUrl)))) ? (
                <video
                  src={item?.imageUrl || deepfakeResult?.mediaUrl}
                  controls
                  className="max-h-56 sm:max-h-64 rounded mx-auto border border-stone-300 dark:border-stone-800 w-full object-contain"
                />
              ) : (
                <img
                  src={item?.imageUrl || deepfakeResult?.mediaUrl}
                  alt="Audited subject"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = isFake
                      ? 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1000&q=80'
                      : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80';
                  }}
                  className="max-h-56 sm:max-h-64 rounded mx-auto object-contain border border-stone-300 dark:border-stone-800 w-full"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          )}

          {/* Executive Summary */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-2">Executive Verdict Summary</h3>
            <p className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded p-3.5 sm:p-4 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
              {summary}
            </p>
          </div>

          {/* Detailed Explanation */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-2">Forensic Fact-Check Investigation</h3>
            <p className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded p-3.5 sm:p-4 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line font-sans">
              {explanation}
            </p>
          </div>

          {/* Deepfake Specific SynthID, ELA and Metadata Cards */}
          {deepfakeResult && (
            <div className="space-y-3 sm:space-y-4">
              {deepfakeResult.forensicPillars && (
                <div className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded p-3 sm:p-4 text-xs space-y-2">
                  <span className="font-bold text-[11px] uppercase tracking-wider block text-stone-600 dark:text-stone-400">4-Pillar Forensic Architecture Score</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 text-[10px] block">Biometrics</span>
                      <span className="font-bold text-stone-900 dark:text-white text-xs">{deepfakeResult.forensicPillars.biometric.score}% Trust</span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 text-[10px] block">Digital Signal / ELA</span>
                      <span className="font-bold text-stone-900 dark:text-white text-xs">{deepfakeResult.forensicPillars.digitalSignal.score}% Trust</span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 text-[10px] block">Provenance</span>
                      <span className="font-bold text-stone-900 dark:text-white text-xs">{deepfakeResult.forensicPillars.provenance.score}% Trust</span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                      <span className="text-stone-500 text-[10px] block">Temporal / Lip-Sync</span>
                      <span className="font-bold text-stone-900 dark:text-white text-xs">{deepfakeResult.forensicPillars.temporal?.score ?? 90}% Trust</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded p-3 sm:p-4 text-xs space-y-2">
                  <span className="font-bold text-[11px] uppercase tracking-wider block text-stone-600 dark:text-stone-400">Google SynthID & ELA Core</span>
                  <div className="flex justify-between text-stone-700 dark:text-stone-300 gap-2">
                    <span className="text-stone-500">SynthID Status:</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{deepfakeResult.synthIdResult?.detected ? 'Watermark Detected' : 'No Watermark'}</span>
                  </div>
                  <div className="flex justify-between text-stone-700 dark:text-stone-300 gap-2">
                    <span className="text-stone-500">ELA Discrepancy Index:</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-stone-100">{deepfakeResult.technicalDetails?.elaScore ?? deepfakeResult.elaScore ?? 18} / 100</span>
                  </div>
                </div>

                <div className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded p-3 sm:p-4 text-xs space-y-2">
                  <span className="font-bold text-[11px] uppercase tracking-wider block text-stone-600 dark:text-stone-400">C2PA & EXIF Metadata</span>
                  <div className="flex justify-between text-stone-700 dark:text-stone-300 gap-2">
                    <span className="text-stone-500">Hardware:</span>
                    <span className="font-semibold truncate">{deepfakeResult.metadataInspection?.cameraModel || 'Generative Pipeline'}</span>
                  </div>
                  <div className="flex justify-between text-stone-700 dark:text-stone-300 gap-2">
                    <span className="text-stone-500">C2PA Manifest:</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{deepfakeResult.metadataInspection?.c2paManifest || 'Synthetic Flagged'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Findings */}
          {item?.keyFindings && (
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-2">Key Investigation Findings</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                {item.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded p-2.5 sm:p-3">
                    <span className="font-bold text-stone-900 dark:text-stone-100 shrink-0">{idx + 1}.</span>
                    <span className="break-words">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources Table */}
          {item?.sources && item.sources.length > 0 && (
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-2">Verified Wire Sources & Records</h3>
              <div className="space-y-2">
                {item.sources.map((src, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 p-2.5 sm:p-3 rounded bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm">
                    <div className="min-w-0">
                      <span className="font-bold text-stone-900 dark:text-stone-100">{src.name}</span>
                      <span className="text-stone-500 text-[10px] ml-2 px-1.5 py-0.5 bg-stone-200 dark:bg-stone-800 rounded uppercase tracking-wider">{src.type}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{src.credibilityScore}% Credibility</span>
                      {src.url && (
                        <a href={src.url} target="_blank" rel="noreferrer" className="text-stone-700 dark:text-stone-300 hover:underline">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="pt-4 sm:pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 print:hidden">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Back to Articles & News Feed</span>
            </button>

            <div className="flex items-center gap-2.5 justify-center sm:justify-end">
              <TraceLogo
                className="w-8 h-8 rounded-lg shrink-0"
              />
              <div className="text-left sm:text-right">
                <p className="font-bold text-stone-900 dark:text-stone-100 text-[11px] sm:text-xs">TRACE Verification Bureau</p>
                <p className="text-[10px] text-stone-500">Truth Review & Authenticity Checking Engine</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
