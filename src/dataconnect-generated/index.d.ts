import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AnalysisReport_Key {
  id: UUIDString;
  __typename?: 'AnalysisReport_Key';
}

export interface CreateMediaContentData {
  mediaContent_insert: MediaContent_Key;
}

export interface CreateMediaContentVariables {
  type: string;
  sourceUrl: string;
  analysisStatus: string;
  uploaderId: UUIDString;
}

export interface CreateReviewData {
  review_insert: Review_Key;
}

export interface CreateReviewVariables {
  rating: number;
  comment: string;
  mediaContentId: UUIDString;
  userId: UUIDString;
}

export interface GetAnalysisReportData {
  analysisReport?: {
    aiLikelihoodPercentage: number;
    reportDetails: string;
    mediaContent: {
      sourceUrl: string;
    };
  };
}

export interface GetAnalysisReportVariables {
  reportId: UUIDString;
}

export interface ListUserWatchlistData {
  watchlists: ({
    mediaContent: {
      type: string;
      sourceUrl: string;
    };
    dateAdded: TimestampString;
  })[];
}

export interface ListUserWatchlistVariables {
  userId: UUIDString;
}

export interface MediaContent_Key {
  id: UUIDString;
  __typename?: 'MediaContent_Key';
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface Watchlist_Key {
  id: UUIDString;
  __typename?: 'Watchlist_Key';
}

interface CreateMediaContentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMediaContentVariables): MutationRef<CreateMediaContentData, CreateMediaContentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateMediaContentVariables): MutationRef<CreateMediaContentData, CreateMediaContentVariables>;
  operationName: string;
}
export const createMediaContentRef: CreateMediaContentRef;

export function createMediaContent(vars: CreateMediaContentVariables): MutationPromise<CreateMediaContentData, CreateMediaContentVariables>;
export function createMediaContent(dc: DataConnect, vars: CreateMediaContentVariables): MutationPromise<CreateMediaContentData, CreateMediaContentVariables>;

interface CreateReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  operationName: string;
}
export const createReviewRef: CreateReviewRef;

export function createReview(vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;
export function createReview(dc: DataConnect, vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface ListUserWatchlistRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUserWatchlistVariables): QueryRef<ListUserWatchlistData, ListUserWatchlistVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListUserWatchlistVariables): QueryRef<ListUserWatchlistData, ListUserWatchlistVariables>;
  operationName: string;
}
export const listUserWatchlistRef: ListUserWatchlistRef;

export function listUserWatchlist(vars: ListUserWatchlistVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserWatchlistData, ListUserWatchlistVariables>;
export function listUserWatchlist(dc: DataConnect, vars: ListUserWatchlistVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserWatchlistData, ListUserWatchlistVariables>;

interface GetAnalysisReportRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAnalysisReportVariables): QueryRef<GetAnalysisReportData, GetAnalysisReportVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAnalysisReportVariables): QueryRef<GetAnalysisReportData, GetAnalysisReportVariables>;
  operationName: string;
}
export const getAnalysisReportRef: GetAnalysisReportRef;

export function getAnalysisReport(vars: GetAnalysisReportVariables, options?: ExecuteQueryOptions): QueryPromise<GetAnalysisReportData, GetAnalysisReportVariables>;
export function getAnalysisReport(dc: DataConnect, vars: GetAnalysisReportVariables, options?: ExecuteQueryOptions): QueryPromise<GetAnalysisReportData, GetAnalysisReportVariables>;

