/**
 * TruthLens AI - Baseline State & Data Definitions
 * 
 * In this production configuration, all synthetic demo claims have been discarded.
 * The application starts fresh and loads actual user-verified claims, photos, and deepfakes
 * from persistent storage.
 */

import { FactCheckItem, VerificationStats } from '../types';

/**
 * Initial empty fact-check feed for a fresh instance.
 * User-verified claims and media populate this dynamically.
 */
export const INITIAL_FACT_CHECKS: FactCheckItem[] = [];

/**
 * Initial zero-baseline platform statistics for a fresh instance.
 */
export const INITIAL_STATS: VerificationStats = {
  totalClaimsChecked: 0,
  fakeNewsBusted: 0,
  deepfakesIntercepted: 0,
  mediaAuditsCompleted: 0,
  accuracyRate: 100,
  categoriesBreakdown: [
    { category: 'Politics', count: 0 },
    { category: 'Health & Science', count: 0 },
    { category: 'World News', count: 0 },
    { category: 'Technology', count: 0 },
    { category: 'Finance', count: 0 }
  ]
};
