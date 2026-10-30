import { CreateMediaContentData, CreateMediaContentVariables, CreateReviewData, CreateReviewVariables, ListUserWatchlistData, ListUserWatchlistVariables, GetAnalysisReportData, GetAnalysisReportVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateMediaContent(options?: useDataConnectMutationOptions<CreateMediaContentData, FirebaseError, CreateMediaContentVariables>): UseDataConnectMutationResult<CreateMediaContentData, CreateMediaContentVariables>;
export function useCreateMediaContent(dc: DataConnect, options?: useDataConnectMutationOptions<CreateMediaContentData, FirebaseError, CreateMediaContentVariables>): UseDataConnectMutationResult<CreateMediaContentData, CreateMediaContentVariables>;

export function useCreateReview(options?: useDataConnectMutationOptions<CreateReviewData, FirebaseError, CreateReviewVariables>): UseDataConnectMutationResult<CreateReviewData, CreateReviewVariables>;
export function useCreateReview(dc: DataConnect, options?: useDataConnectMutationOptions<CreateReviewData, FirebaseError, CreateReviewVariables>): UseDataConnectMutationResult<CreateReviewData, CreateReviewVariables>;

export function useListUserWatchlist(vars: ListUserWatchlistVariables, options?: useDataConnectQueryOptions<ListUserWatchlistData>): UseDataConnectQueryResult<ListUserWatchlistData, ListUserWatchlistVariables>;
export function useListUserWatchlist(dc: DataConnect, vars: ListUserWatchlistVariables, options?: useDataConnectQueryOptions<ListUserWatchlistData>): UseDataConnectQueryResult<ListUserWatchlistData, ListUserWatchlistVariables>;

export function useGetAnalysisReport(vars: GetAnalysisReportVariables, options?: useDataConnectQueryOptions<GetAnalysisReportData>): UseDataConnectQueryResult<GetAnalysisReportData, GetAnalysisReportVariables>;
export function useGetAnalysisReport(dc: DataConnect, vars: GetAnalysisReportVariables, options?: useDataConnectQueryOptions<GetAnalysisReportData>): UseDataConnectQueryResult<GetAnalysisReportData, GetAnalysisReportVariables>;
