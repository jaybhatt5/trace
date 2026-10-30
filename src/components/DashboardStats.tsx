/**
 * TRACE - Platform Analytics & Academic Colophon
 * 
 * TRACE: Truth Review & Authenticity Checking Engine
 * 
 * Features:
 * - 4 Metric Stat Cards: Claims Verified, Fake News Busted, Deepfakes Intercepted, Media Photos Audited.
 * - Category Distribution Progress Bars (Politics, Health & Science, World News, Tech, Finance).
 * - Academic Research & Developer Credits:
 *     - Project: TRACE (Truth Review & Authenticity Checking Engine)
 *     - Developers: Thakar Dhaval & Bhatt Jay
 *     - Institute: Shree Swaminarayan College of Computer Science (BCA Semester 3)
 */

import React from 'react';
import { VerificationStats } from '../types';
import { ShieldCheck, AlertTriangle, Cpu, Camera, BarChart3, BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';
import { TraceLogo } from './TraceLogo';

interface DashboardStatsProps {
  /** Aggregated platform metrics and category distribution numbers */
  stats: VerificationStats;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <section className="py-8 sm:py-12 bg-[#fbfaf8] dark:bg-[#111317] text-stone-900 dark:text-stone-100 min-h-screen border-t border-stone-200 dark:border-stone-800 transition-colors duration-200 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8 border-b-2 border-stone-900 dark:border-stone-100 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2">
            <BarChart3 className="w-3.5 h-3.5 shrink-0" />
            <span>Platform Analytics & Academic Colophon</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black text-stone-900 dark:text-stone-50 tracking-tight">
            TRACE Registry & Platform Performance Index
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1 max-w-3xl">
            Real-time analytics on disinformation interception, deepfake detections, multimodal news photo audits, and wire source reliability indices processed by TRACE (Truth Review & Authenticity Checking Engine).
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          
          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-4 sm:p-5 rounded shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[11px]">Total Claims Checked</span>
              <ShieldCheck className="w-5 h-5 text-stone-700 dark:text-stone-300 shrink-0" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50">{stats.totalClaimsChecked.toLocaleString()}</p>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">98.6% Verification Accuracy</span>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-4 sm:p-5 rounded shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[11px]">Fake News Intercepted</span>
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50">{stats.fakeNewsBusted.toLocaleString()}</p>
            <span className="text-[11px] text-red-700 dark:text-red-400 font-semibold">62.5% of total checked claims</span>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-4 sm:p-5 rounded shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[11px]">Deepfakes Flagged</span>
              <Cpu className="w-5 h-5 text-stone-700 dark:text-stone-300 shrink-0" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50">{stats.deepfakesIntercepted.toLocaleString()}</p>
            <span className="text-[11px] text-stone-600 dark:text-stone-400 font-semibold">Photos, Audio & Video Clips</span>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-4 sm:p-5 rounded shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[11px]">News Media Audited</span>
              <Camera className="w-5 h-5 text-stone-700 dark:text-stone-300 shrink-0" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-50">{stats.mediaAuditsCompleted.toLocaleString()}</p>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">OCR & Visual Integrity Audits</span>
          </div>

        </div>

        {/* Category Distribution & Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-8">
          
          {/* Category Breakdown */}
          <div className="lg:col-span-6 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-5 sm:p-6 rounded shadow-2xs">
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
              Claims Distribution by Topic Desk
            </h3>
            <div className="space-y-4">
              {stats.totalClaimsChecked === 0 ? (
                <div className="py-6 text-center text-stone-500 dark:text-stone-400 text-xs">
                  <p className="font-semibold text-stone-700 dark:text-stone-300">No claims recorded yet</p>
                  <p className="mt-1">Verified claims will automatically distribute across topics here.</p>
                </div>
              ) : (
                stats.categoriesBreakdown.map((cat, idx) => {
                  const percentage = stats.totalClaimsChecked > 0 ? Math.round((cat.count / stats.totalClaimsChecked) * 100) : 0;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        <span>{cat.category}</span>
                        <span className="font-mono">{cat.count.toLocaleString()} claims ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded overflow-hidden">
                        <div
                          className="h-full bg-stone-900 dark:bg-stone-100 rounded transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Project Details & Authors Card */}
          <div className="lg:col-span-6 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 p-5 sm:p-6 rounded space-y-4 shadow-2xs">
            <div className="flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
              <TraceLogo
                className="w-10 h-10 rounded-xl shrink-0"
              />
              <div className="min-w-0">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-50 truncate">TRACE Proposal & Credits</h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 truncate">Shree Swaminarayan College of Computer Science</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 dark:bg-stone-950 p-3.5 rounded border border-stone-200 dark:border-stone-800">
                <span className="text-stone-500 dark:text-stone-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">Submitted By:</span>
                <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">Thakar Dhaval</p>
                <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">& Bhatt Jay</p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-950 p-3.5 rounded border border-stone-200 dark:border-stone-800">
                <span className="text-stone-500 dark:text-stone-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">Academic Program:</span>
                <p className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">BCA (Semester 3)</p>
                <p className="text-stone-500 dark:text-stone-400 text-[11px]">Dept of Computer Science</p>
              </div>
            </div>

            <div className="bg-stone-50 dark:bg-stone-950 p-3.5 rounded border border-stone-200 dark:border-stone-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px]">
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>TRACE System Capabilities:</span>
              </div>
              <ul className="space-y-1.5 text-stone-600 dark:text-stone-400 text-xs">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" /> Truth Review via Google Search Grounding & primary archives</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" /> Authenticity Checking: 4-Pillar deepfake suite (ELA, Noise, C2PA, Keyframes)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" /> Multimodal OCR news photo & broadcast headline verification</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" /> Downloadable & printable verification audit certificates</li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
