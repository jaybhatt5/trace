/**
 * TRACE - Broadsheet Newspaper Colophon & Footer
 * 
 * TRACE: Truth Review & Authenticity Checking Engine
 * 
 * Contains brand metadata, editorial mission statement, and academic developer credits
 * (Thakar Dhaval & Bhatt Jay, BCA Semester 3, Shree Swaminarayan College of Computer Science).
 */

import React from 'react';
import { TraceLogo } from './TraceLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-100/90 dark:bg-stone-950 border-t-2 border-stone-900 dark:border-stone-100 text-stone-600 dark:text-stone-400 text-xs py-8 px-3 sm:px-6 lg:px-8 pb-safe transition-colors duration-200 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        
        {/* Brand & Platform Tagline */}
        <div className="flex items-center gap-3">
          <TraceLogo
            className="w-9 h-9 rounded-xl shrink-0"
          />
          <div className="text-left">
            <p className="font-serif font-black text-stone-900 dark:text-stone-100 text-sm tracking-wide uppercase">
              TRACE • The Independent Dispatch
            </p>
            <p className="text-[11px] text-stone-500 font-semibold">
              Truth Review & Authenticity Checking Engine
            </p>
          </div>
        </div>

        {/* Academic Project Credits */}
        <div className="text-center md:text-right space-y-0.5">
          <p className="text-stone-800 dark:text-stone-200 font-semibold text-xs">
            Engineered & Developed by <span className="font-bold text-stone-950 dark:text-stone-50">Thakar Dhaval</span> & <span className="font-bold text-stone-950 dark:text-stone-50">Bhatt Jay</span>
          </p>
          <p className="text-stone-500 text-[11px]">
            BCA Semester 3 • Shree Swaminarayan College of Computer Science
          </p>
          <p className="text-[10px] text-stone-400 dark:text-stone-500 italic">
            Powered by Google Gemini 3.7 Multimodal Intelligence & Search Grounding
          </p>
        </div>

      </div>
    </footer>
  );
};
