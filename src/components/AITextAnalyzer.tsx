/**
 * TruthLens AI - Authorship & NLP Linguistic Audit Desk
 * 
 * Inspects written articles, essays, and press releases to detect LLM synthetic generation.
 * 
 * Forensics Evaluated:
 * 1. Perplexity Score: Measures unpredictability of token sequence selections.
 * 2. Burstiness Score: Measures variability in sentence length, structure, and rhythmic cadence.
 * 3. Predicted LLM Model: Identifies stylistic fingerprints (e.g. GPT-4, Claude, Gemini).
 * 4. Sentence Breakdown: Highlights individual sentences with risk tags and forensic explanations.
 */

import React, { useState } from 'react';
import { AITextAnalysisResult } from '../types';
import { Cpu, Bot, Sparkles, FileText, Zap, RefreshCw, Layers } from 'lucide-react';

interface AITextAnalyzerProps {
  /** Optional user-configured Gemini API Key */
  apiKey?: string;
}

export const AITextAnalyzer: React.FC<AITextAnalyzerProps> = ({ apiKey }) => {
  const [inputText, setInputText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AITextAnalysisResult | null>(null);

  const sampleTexts = [
    {
      title: 'AI Essay (ChatGPT)',
      content: `In conclusion, renewable energy sources represent a paramount milestone in combating climate change. Harnessing solar and wind power enables societies to foster sustainable development while significantly mitigating greenhouse gas emissions. Furthermore, policy makers must prioritize green infrastructure investments to facilitate seamless integration.`
    },
    {
      title: 'AI Tech Analysis (Claude/Gemini)',
      content: `To delve into the multifaceted implications of quantum cryptography, one must examine the delicate interplay between entanglement fidelity and decoherence mitigation. Crucially, this paradigm fosters robust security architectures across distributed ledger networks.`
    },
    {
      title: 'Organic Human Story',
      content: `I caught the 5 AM red-eye out of Mumbai yesterday. The rain was pounding against the tarmac, delay after delay. Honestly, nobody had any clue what was going on until the captain finally hopped on the mic at 3 AM and told us we were good to go.`
    },
    {
      title: 'Academic Abstract',
      content: `We measured dielectric breakdown voltages across twelve synthetic graphene polymer samples under cryogenic thermal cycles. Experimental data revealed an exponential deviation from classical Arrhenius rate law predictions at temperatures below 40 Kelvin.`
    }
  ];

  const handleAnalyze = async () => {
    if (!inputText.trim() || inputText.length < 15) return;

    setIsAnalyzing(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['x-gemini-api-key'] = apiKey;
      }

      const response = await fetch('/api/analyze-text', {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: inputText, apiKey }),
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        console.error('Non-JSON response in AITextAnalyzer:', responseText.slice(0, 150));
        return;
      }

      if (data.success && data.result) {
        setAnalysisResult(data.result);
      }
    } catch (err) {
      console.error('Text analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="bg-[#fbfaf8] dark:bg-[#111317] text-stone-900 dark:text-stone-100 py-8 sm:py-12 min-h-screen border-t border-stone-200 dark:border-stone-800 transition-colors duration-200 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8 border-b-2 border-stone-900 dark:border-stone-100 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2">
            <Cpu className="w-3.5 h-3.5 shrink-0" />
            <span>NLP Linguistic Forensic Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black text-stone-900 dark:text-stone-50 tracking-tight">
            AI Content & Linguistic Forensic Desk
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1 max-w-3xl">
            Audit whether an article, speech, or news report was authored by an LLM (ChatGPT, Claude, Gemini) or a human author using token perplexity, sentence burstiness, and linguistic cadence.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Left Column: Input Box */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            
            <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded p-4 sm:p-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <label className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 uppercase tracking-wider text-[11px]">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Paste Text ({inputText.length} chars, ~{inputText.split(/\s+/).filter(Boolean).length} words)</span>
                </label>
                
                <div className="flex flex-wrap items-center gap-1.5">
                  {sampleTexts.map((st, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputText(st.content)}
                      className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 text-[10px] sm:text-[11px] px-2 py-0.5 rounded font-medium transition-colors active:scale-95"
                      title={st.title}
                    >
                      {st.title.split(' ')[0]} {st.title.includes('Human') ? '👤' : '🤖'}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={7}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste news story, draft, or article passage here to inspect authorship..."
                className="w-full bg-[#fbfaf8] dark:bg-[#111317] border border-stone-300 dark:border-stone-700 rounded p-3 sm:p-4 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-stone-900 dark:focus:border-stone-300 leading-relaxed font-mono resize-y min-h-[150px]"
              />

              <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <span className="text-[11px] text-stone-500 dark:text-stone-400">Minimum 15 characters required</span>
                
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || inputText.length < 15}
                  className="w-full sm:w-auto px-5 py-2.5 rounded bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-stone-50 dark:text-stone-900 font-semibold text-xs uppercase tracking-wider shadow-2xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                      <span>Computing Forensics...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 shrink-0" />
                      <span>Audit Authorship</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Methodology Box */}
            <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded p-4 sm:p-5 text-xs text-stone-600 dark:text-stone-400 space-y-2.5 shadow-2xs">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm flex items-center gap-2 uppercase tracking-wider font-serif">
                <Sparkles className="w-4 h-4 text-stone-600 dark:text-stone-400 shrink-0" />
                <span>Linguistic Methodology</span>
              </h4>
              <p className="leading-relaxed">
                <strong className="text-stone-900 dark:text-stone-200">Perplexity:</strong> Evaluates lexical unpredictability. Human journalism displays natural vocabulary divergence, whereas LLM text relies on high-probability token selections.
              </p>
              <p className="leading-relaxed">
                <strong className="text-stone-900 dark:text-stone-200">Burstiness:</strong> Evaluates sentence length and structure variability. Human writing alternates between short declarative statements and complex subordinate clauses; AI generates uniform syntax.
              </p>
            </div>

          </div>

          {/* Right Column: Forensic Output */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            {!analysisResult ? (
              <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded p-8 sm:p-12 text-center text-stone-500 dark:text-stone-400 space-y-3 shadow-2xs">
                <Bot className="w-10 h-10 mx-auto text-stone-400 dark:text-stone-600" />
                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base">Awaiting Text Passage</h3>
                <p className="text-xs max-w-sm mx-auto leading-relaxed">
                  Paste an article, quote, or draft on the left, then click <strong>"Audit Authorship"</strong> to calculate perplexity, burstiness, and predicted LLM fingerprint.
                </p>
              </div>
            ) : (
              <>
                {/* Score Card */}
                <div className={`p-4 sm:p-6 rounded border shadow-2xs ${
                  (analysisResult?.aiScore || 0) > 60
                    ? 'bg-stone-100 dark:bg-stone-900 border-stone-400 dark:border-stone-700 text-stone-900 dark:text-stone-100'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-600 dark:text-stone-400">Authorship Verdict</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider shrink-0 ${
                      (analysisResult?.aiScore || 0) > 60 ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' : 'bg-emerald-700 text-white dark:bg-emerald-500 dark:text-stone-950'
                    }`}>
                      {(analysisResult?.aiScore || 0) > 60 ? 'AI GENERATED SYNTHESIS' : 'ORGANIC HUMAN AUTHOR'}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2 sm:gap-3 flex-wrap">
                    <span className="font-serif text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50">{analysisResult?.aiScore}%</span>
                    <span className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400">
                      AI Likelihood ({analysisResult?.humanScore}% Human Probability)
                    </span>
                  </div>

                  {/* High-Contrast Dual Gauge */}
                  <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded overflow-hidden mt-3 flex">
                    <div className="bg-stone-800 dark:bg-stone-200 h-full" style={{ width: `${analysisResult?.aiScore}%` }} />
                    <div className="bg-emerald-600 h-full" style={{ width: `${analysisResult?.humanScore}%` }} />
                  </div>

                  <p className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-3 flex items-center gap-1.5 uppercase tracking-wider">
                    <Bot className="w-4 h-4 shrink-0" />
                    <span>Stylistic Signature: {analysisResult?.predictedModel}</span>
                  </p>

                  <p className="text-xs mt-2 text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                    {analysisResult?.summaryExplanation}
                  </p>
                </div>

                {/* Metrics Gauge */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-3.5 sm:p-4 rounded shadow-2xs">
                    <span className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider block">Perplexity Index</span>
                    <p className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">{analysisResult?.perplexityScore} / 100</p>
                    <span className="text-[10px] text-stone-400 block">Lower = High statistical probability</span>
                  </div>

                  <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-3.5 sm:p-4 rounded shadow-2xs">
                    <span className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-bold uppercase tracking-wider block">Burstiness Index</span>
                    <p className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">{analysisResult?.burstinessScore} / 100</p>
                    <span className="text-[10px] text-stone-400 block">Lower = Syntactic monotony</span>
                  </div>
                </div>

                {/* Sentence Level Highlighting */}
                <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded p-4 sm:p-5 shadow-2xs">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <Layers className="w-4 h-4 shrink-0" />
                    <span>Sentence-by-Sentence Forensic Log</span>
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    {analysisResult?.highlightedSentences.map((sent, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 sm:p-3 rounded border leading-relaxed ${
                          sent.aiLikelihood === 'High'
                            ? 'bg-stone-100 dark:bg-stone-950 border-stone-400 dark:border-stone-700 text-stone-900 dark:text-stone-100'
                            : sent.aiLikelihood === 'Medium'
                            ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 text-stone-900 dark:text-stone-100'
                            : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-stone-900 dark:text-stone-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`font-bold text-[10px] uppercase tracking-wider shrink-0 ${
                            sent.aiLikelihood === 'High' ? 'text-stone-900 dark:text-stone-100' : sent.aiLikelihood === 'Medium' ? 'text-amber-800 dark:text-amber-300' : 'text-emerald-800 dark:text-emerald-300'
                          }`}>
                            Risk: {sent.aiLikelihood}
                          </span>
                          <span className="text-[10px] text-stone-500 truncate">{sent.reason}</span>
                        </div>
                        <p className="font-mono text-[11px] sm:text-xs text-stone-900 dark:text-stone-100 break-words">"{sent.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
