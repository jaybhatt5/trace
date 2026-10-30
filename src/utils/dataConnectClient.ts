/**
 * TRACE - Firebase SQL Connect (Cloud SQL for PostgreSQL) Client Module
 * 
 * Manages:
 * - Firebase SQL Connect service connection to Cloud SQL for PostgreSQL
 * - Relational PostgreSQL schema queries & mutations for fact-checking stories
 * - User synchronizations with PostgreSQL users table
 * - Seamless integration with local Express persistence
 */

import { getDataConnect, connectDataConnectEmulator, type DataConnect } from 'firebase/data-connect';
import { initFirebase } from './firebase';
import { connectorConfig } from '../lib/dataconnect';
export * from '../lib/dataconnect';

export interface DataConnectConfig {
  connector: string;
  service: string;
  location: string;
}

export const TRACE_DATACONNECT_CONFIG: DataConnectConfig = connectorConfig;

let dataConnectInstance: DataConnect | null = null;
let isEmulatorConnected = false;

/**
 * Initialize Firebase SQL Connect (PostgreSQL)
 * Connects directly to Cloud SQL or local emulator on localhost:9399
 */
export const initDataConnect = (): DataConnect | null => {
  if (dataConnectInstance) return dataConnectInstance;

  const { app } = initFirebase();
  if (!app) {
    console.warn('[TRACE DataConnect] Firebase App is not initialized.');
    return null;
  }

  try {
    dataConnectInstance = getDataConnect(app, connectorConfig);

    // Auto-connect to local Data Connect emulator if running locally
    if (
      !isEmulatorConnected &&
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ) {
      try {
        connectDataConnectEmulator(dataConnectInstance, 'localhost', 9399);
        isEmulatorConnected = true;
        console.info('[TRACE DataConnect] Connected to local PostgreSQL Data Connect emulator on 127.0.0.1:9399');
      } catch (emuErr) {
        console.info('[TRACE DataConnect] Emulator notice:', emuErr);
      }
    }

    return dataConnectInstance;
  } catch (err) {
    console.warn('[TRACE DataConnect] Notice initializing DataConnect:', err);
    return null;
  }
};

/**
 * PostgreSQL Connection Parameters
 */
export const POSTGRESQL_CONNECTION_PARAMS = {
  serviceId: 'trace-34d57-service',
  connectorId: 'trace',
  connectorPath: 'us-east4/trace-34d57-service/trace',
  instanceId: 'trace-postgres',
  database: 'trace_db',
  location: 'us-east4',
  engine: 'PostgreSQL 15 / 16',
  provider: 'Cloud SQL for PostgreSQL via Firebase SQL Connect',
  emulatorPort: 9399,
  emulatorHost: '127.0.0.1:9399',
  hubPort: 4400,
  status: 'EMULATOR ACTIVE & RUNNING'
} as const;

/**
 * Fetch all stories from PostgreSQL via Data Connect
 */
export const fetchStoriesDataConnect = async () => {
  const dc = initDataConnect();
  if (!dc) return null;
  try {
    const { listStories } = await import('../lib/dataconnect');
    const res = await listStories(dc);
    return res.data?.stories || [];
  } catch (err) {
    console.warn('[TRACE DataConnect] Query error:', err);
    return null;
  }
};

/**
 * Save new story to PostgreSQL via Data Connect
 */
export const createStoryDataConnect = async (vars: {
  title: string;
  claim: string;
  verdict: string;
  truthScore: number;
  category: string;
  summary: string;
  explanation: string;
  author: string;
  imageUrl?: string | null;
}) => {
  const dc = initDataConnect();
  if (!dc) return null;
  try {
    const { createStory } = await import('../lib/dataconnect');
    const res = await createStory(dc, vars);
    return res.data?.story_insert;
  } catch (err) {
    console.warn('[TRACE DataConnect] Insert story error:', err);
    return null;
  }
};

/**
 * Delete story from PostgreSQL via Data Connect
 */
export const deleteStoryDataConnect = async (id: string) => {
  const dc = initDataConnect();
  if (!dc) return false;
  try {
    const { deleteStory } = await import('../lib/dataconnect');
    await deleteStory(dc, { id });
    return true;
  } catch (err) {
    console.warn('[TRACE DataConnect] Delete story error:', err);
    return false;
  }
};
