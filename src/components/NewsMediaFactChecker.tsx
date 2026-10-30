/**
 * TruthLens AI - Multimodal News Photo & Broadcast Video Fact-Checker
 * 
 * Verifies news photos, newspaper clippings, broadcast screenshots, and video banners.
 * 
 * Process:
 * 1. Multimodal OCR: Extracts embedded headlines, lower-third tickers, and photo captions.
 * 2. Visual Layout Integrity: Checks font kerning, graphic overlay artifacts, and channel logos.
 * 3. Ground Truth Matching: Cross-checks extracted claim against international wire services.
 */

import React, { useState } from 'react';
import { NewsMediaFactCheckResult, FactCheckItem } from '../types';
import { Camera, Upload, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, FileSearch, RefreshCw, FileText, Award } from 'lucide-react';

interface NewsMediaFactCheckerProps {
  /** Optional user-configured Gemini API Key */
  apiKey?: string;
  /** Optional callback to create and open a formal FactCheckItem report */
  onGenerateReport?: (item: FactCheckItem) => void;
}

export const NewsMediaFactChecker: React.FC<NewsMediaFactCheckerProps> = ({ apiKey, onGenerateReport }) => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [userNotes, setUserNotes] = useState<string>('');
  
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [result, setResult] = useState<NewsMediaFactCheckResult | null>(null);

  const sampleMediaItems = [
    {
      title: 'Doctored Quarantine Banner',
      type: 'image' as const,
      preview: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1000&q=80',
      notes: 'Viral breaking news ticker image claiming immediate 30-day quarantine order.'
    },
    {
      title: 'Verified NASA Press Photo',
      type: 'image' as const,
      preview: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80',
      notes: 'NASA James Webb Space Telescope official astronomical discovery photo.'
    },
    {
      title: 'Altered Newspaper Clipping',
      type: 'image' as const,
      preview: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80',
      notes: 'Social media post sharing a scanned newspaper clipping with modified headline.'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setErrorMessage(null);
      if (file.size > 80 * 1024 * 1024) {
        setErrorMessage('File size is too large (max 80MB). Please select a shorter video or smaller photo.');
        return;
      }

      setMediaFile(file);
      const isVid = file.type.startsWith('video');
      setMediaType(isVid ? 'video' : 'image');

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeMedia = async (customPreview?: string, customNotes?: string, customType?: 'image' | 'video') => {
    const targetPreview = customPreview || mediaPreview;
    const targetNotes = customNotes !== undefined ? customNotes : userNotes;
    const targetType = customType || mediaType;

    if (!targetPreview && !targetNotes.trim()) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisStep('Performing OCR Text Extraction...');

    try {
      setTimeout(() => setAnalysisStep('Cross-Referencing Ground Truth News Archives...'), 700);
      setTimeout(() => setAnalysisStep('Inspecting Font Kerning & Visual Integrity...'), 1400);

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['x-gemini-api-key'] = apiKey;
      }

      const response = await fetch('/api/fact-check-media', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          mediaBase64: targetPreview?.startsWith('data:') ? targetPreview : undefined,
          mediaUrl: !targetPreview?.startsWith('data:') ? targetPreview : undefined,
          mediaType: targetType,
          userNotes: targetNotes.trim(),
          apiKey,
        })
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        console.error('Non-JSON response received:', responseText.slice(0, 200));
        throw new Error(response.status === 413 ? 'The uploaded video/photo file is too large for the server payload. Please select a smaller file.' : 'Server error occurred during news verification.');
      }

      if (data.success && data.result) {
        setResult(data.result);
      } else if (data.error) {
        setErrorMessage(data.details || data.error);
      }
    } catch (err: any) {
      console.error('Error analyzing news media:', err);
      setErrorMessage(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const convertToFactCheckItem = (res: NewsMediaFactCheckResult): FactCheckItem => ({
    id: res.id,
    title: res.headlineExtracted,
    claim: res.ocrText || res.headlineExtracted,
    verdict: res.verdict,
    truthScore: res.truthScore,
    category: 'World News',
    summary: res.summary,
    explanation: res.detailedReasoning,
    keyFindings: res.keyEvidence,
    sources: res.sources.map(s => ({
      name: s.name,
      credibilityScore: s.credibilityScore,
      type: (s.type as any) || 'Fact Checking Org'
    })),
    timestamp: res.timestamp,
    verifiedBy: apiKey ? 'TRACE Gemini 3.7 Multimodal Vision' : 'TRACE Multimodal Vision Engine',
    imageUrl: res.mediaUrl,
    sharesCount: 1420,
    tags: ['News Photo Check', 'OCR Verification', 'Visual Forensics']
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8 font-sans">
      
      {/* Editorial Header Banner */}
      <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded p-6 sm:p-8 relative shadow-2xs">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold uppercase tracking-widest">
            <Camera className="w-3.5 h-3.5 shrink-0" />
            <span>TRACE Multimodal Vision & OCR News Desk</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-stone-900 dark:text-stone-50 tracking-tight leading-tight">
            News Photo & Broadcast Media Verification Desk
          </h2>

          <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-base leading-relaxed">
            Upload any newspaper clipping, viral social media screenshot, photo caption, or broadcast television frame.
            TRACE (Truth Review & Authenticity Checking Engine) runs multimodal optical character recognition (OCR), cross-checks extracted claims against international wire services, and exposes doctored graphics.
          </p>
        </div>
      </div>

      {/* Main Grid: Upload & Controls + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Upload & Sample Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          
          {errorMessage && (
            <div className="p-3.5 sm:p-4 rounded bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-semibold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-700 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-red-900 dark:text-red-200">Verification Notice</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}
          
          {/* Sample Presets */}
          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded p-4 sm:p-5 space-y-3 shadow-2xs">
            <h3 className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300 shrink-0" />
              <span>Benchmark Media Evidence</span>
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {sampleMediaItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMediaPreview(item.preview);
                    setMediaType(item.type);
                    setUserNotes(item.notes);
                    handleAnalyzeMedia(item.preview, item.notes, item.type);
                  }}
                  className="p-2 sm:p-2.5 rounded bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 flex items-center gap-3 text-left transition-colors group active:scale-[0.99]"
                >
                  <img src={item.preview} alt={item.title} className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover border border-stone-200 dark:border-stone-800 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-stone-600 dark:group-hover:text-stone-300 truncate">{item.title}</p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{item.notes}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded p-4 sm:p-5 space-y-3.5 shadow-2xs">
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 uppercase tracking-wider">
              <Upload className="w-4 h-4 shrink-0" />
              <span>Upload News Clipping or Broadcast</span>
            </h3>

            <div className="relative border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-stone-500 dark:hover:border-stone-500 bg-stone-50 dark:bg-stone-950/60 rounded p-4 sm:p-6 text-center transition-colors cursor-pointer group">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {mediaPreview ? (
                <div className="space-y-2.5">
                  {mediaType === 'video' ? (
                    <video src={mediaPreview} controls className="max-h-48 sm:max-h-56 mx-auto rounded border border-stone-300 dark:border-stone-700" />
                  ) : (
                    <img src={mediaPreview} alt="Uploaded news preview" className="max-h-48 sm:max-h-56 mx-auto rounded object-contain border border-stone-300 dark:border-stone-700 shadow-2xs" />
                  )}
                  <p className="text-[11px] sm:text-xs text-stone-700 dark:text-stone-300 font-semibold">Click or drag to replace media</p>
                </div>
              ) : (
                <div className="space-y-2 py-3 sm:py-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">Drag & Drop news clipping or broadcast frame here</p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">Supports JPG, PNG, WEBP, MP4 files</p>
                </div>
              )}
            </div>

            {/* Context Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[11px]">Context or Claim Mentioned (Optional):</label>
              <textarea
                rows={3}
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="e.g. This clipping claims a nationwide curfew was instituted..."
                className="w-full bg-[#fbfaf8] dark:bg-[#111317] border border-stone-300 dark:border-stone-700 rounded p-2.5 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-stone-900 dark:focus:border-stone-300"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={() => handleAnalyzeMedia()}
              disabled={isAnalyzing || (!mediaPreview && !userNotes.trim())}
              className="w-full py-2.5 px-4 rounded bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white font-semibold text-stone-50 dark:text-stone-900 text-xs sm:text-sm uppercase tracking-wider shadow-2xs disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  <span>{analysisStep || 'Analyzing Media...'}</span>
                </>
              ) : (
                <>
                  <FileSearch className="w-4 h-4 shrink-0" />
                  <span>Examine News Media</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Fact-Check Result Output (7 Cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded p-5 sm:p-7 space-y-5 shadow-2xs relative">
              
              {/* Verdict Header Badge */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest block">TRACE Multimodal Verification</span>
                  <h3 className="font-serif text-lg sm:text-2xl font-bold text-stone-900 dark:text-stone-50 mt-1 leading-snug">{result.headlineExtracted}</h3>
                </div>

                <div className={`px-3 py-1.5 rounded border font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${
                  result.verdict === 'VERIFIED_TRUE'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : result.verdict === 'DEBUNKED_FAKE'
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                }`}>
                  {result.verdict === 'VERIFIED_TRUE' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  {result.verdict === 'DEBUNKED_FAKE' && <ShieldCheck className="w-4 h-4 shrink-0" />}
                  {result.verdict === 'MISLEADING' && <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>{result.verdict.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Truth & Integrity Score Meters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3.5 rounded bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider text-[10px]">News Truth Score</span>
                    <span className={`font-bold text-xs sm:text-sm ${result.truthScore > 70 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                      {result.truthScore} / 100
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${result.truthScore > 70 ? 'bg-emerald-600' : 'bg-red-600'}`}
                      style={{ width: `${result.truthScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider text-[10px]">Visual & Font Integrity</span>
                    <span className={`font-bold text-xs sm:text-sm ${result.visualIntegrityScore > 70 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                      {result.visualIntegrityScore} / 100
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${result.visualIntegrityScore > 70 ? 'bg-emerald-600' : 'bg-amber-600'}`}
                      style={{ width: `${result.visualIntegrityScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Extracted OCR Text Transcript */}
              <div className="p-3.5 rounded bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Extracted OCR Transcript from Photo/Broadcast</span>
                </div>
                <p className="text-xs text-stone-800 dark:text-stone-200 font-mono bg-white dark:bg-stone-900 p-2.5 rounded border border-stone-300 dark:border-stone-800 leading-relaxed break-words">
                  {result.ocrText}
                </p>
              </div>

              {/* Executive Summary */}
              <div className="p-3.5 rounded bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-1.5">
                <h4 className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Fact-Check Executive Verdict</h4>
                <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
                  {result.summary}
                </p>
              </div>

              {/* Detailed Reasoning & Evidence */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Audit Evidence & Wire Comparison</h4>
                <div className="p-3.5 rounded bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3 text-xs text-stone-700 dark:text-stone-300">
                  <p className="leading-relaxed whitespace-pre-line font-sans">{result.detailedReasoning}</p>
                  
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
                    <span className="font-bold text-stone-900 dark:text-stone-100 block text-[11px] uppercase tracking-wider">Evidence Points:</span>
                    <ul className="space-y-1.5">
                      {result.keyEvidence.map((ev, i) => (
                        <li key={i} className="flex items-start gap-2 text-stone-700 dark:text-stone-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] sm:text-xs">{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Ground Truth Sources */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">Cross-Referenced Wire Sources</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.sources.map((src, i) => (
                    <div key={i} className="p-2.5 rounded bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs gap-2">
                      <div className="min-w-0 pr-1">
                        <p className="font-bold text-stone-900 dark:text-stone-100 truncate text-[11px]">{src.name}</p>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 block">{src.type}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-stone-200/80 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 text-[10px] font-bold shrink-0">
                        {src.credibilityScore}% Trust
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Certificate Trigger */}
              {onGenerateReport && (
                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end">
                  <button
                    onClick={() => onGenerateReport(convertToFactCheckItem(result))}
                    className="w-full sm:w-auto px-4 py-2 rounded bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-stone-50 dark:text-stone-900 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xs"
                  >
                    <Award className="w-4 h-4 shrink-0" />
                    <span>View Official Verification Certificate</span>
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded p-8 sm:p-12 text-center text-stone-500 dark:text-stone-400 space-y-3 shadow-2xs">
              <Camera className="w-10 h-10 mx-auto text-stone-400 dark:text-stone-600" />
              <p className="text-sm font-serif">Upload a news photo, clipping, or broadcast video above to inspect text OCR and doctored graphics.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
