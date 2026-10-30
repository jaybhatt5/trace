import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateStoryData {
  story_insert: Story_Key;
}

export interface CreateStoryVariables {
  title: string;
  claim: string;
  verdict: string;
  truthScore: number;
  category: string;
  summary: string;
  explanation: string;
  author: string;
  imageUrl?: string | null;
}

export interface DeleteStoryData {
  story_delete?: Story_Key | null;
}

export interface DeleteStoryVariables {
  id: UUIDString;
}

export interface GetStoryData {
  story?: {
    id: UUIDString;
    title: string;
    claim: string;
    verdict: string;
    truthScore: number;
    category: string;
    summary: string;
    explanation: string;
    author: string;
    imageUrl?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Story_Key;
}

export interface GetStoryVariables {
  id: UUIDString;
}

export interface GetUserProfileData {
  user?: {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    role: string;
    createdAt: TimestampString;
  } & User_Key;
}

export interface GetUserProfileVariables {
  uid: string;
}

export interface ListStoriesByCategoryData {
  stories: ({
    id: UUIDString;
    title: string;
    claim: string;
    verdict: string;
    truthScore: number;
    category: string;
    summary: string;
    author: string;
    imageUrl?: string | null;
    createdAt: TimestampString;
  } & Story_Key)[];
}

export interface ListStoriesByCategoryVariables {
  category: string;
}

export interface ListStoriesByVerdictData {
  stories: ({
    id: UUIDString;
    title: string;
    claim: string;
    verdict: string;
    truthScore: number;
    category: string;
    summary: string;
    author: string;
    imageUrl?: string | null;
    createdAt: TimestampString;
  } & Story_Key)[];
}

export interface ListStoriesByVerdictVariables {
  verdict: string;
}

export interface ListStoriesData {
  stories: ({
    id: UUIDString;
    title: string;
    claim: string;
    verdict: string;
    truthScore: number;
    category: string;
    summary: string;
    explanation: string;
    author: string;
    imageUrl?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Story_Key)[];
}

export interface LogMediaAuditData {
  mediaAudit_insert: MediaAudit_Key;
}

export interface LogMediaAuditVariables {
  auditType: string;
  mediaUrl?: string | null;
  score: number;
  verdict: string;
  detailsJson?: string | null;
}

export interface MediaAudit_Key {
  id: UUIDString;
  __typename?: 'MediaAudit_Key';
}

export interface StoryFinding_Key {
  id: UUIDString;
  __typename?: 'StoryFinding_Key';
}

export interface StorySource_Key {
  id: UUIDString;
  __typename?: 'StorySource_Key';
}

export interface Story_Key {
  id: UUIDString;
  __typename?: 'Story_Key';
}

export interface UpdateStoryData {
  story_update?: Story_Key | null;
}

export interface UpdateStoryVariables {
  id: UUIDString;
  title?: string | null;
  claim?: string | null;
  verdict?: string | null;
  truthScore?: number | null;
  category?: string | null;
  summary?: string | null;
  explanation?: string | null;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  email?: string | null;
  displayName?: string | null;
  role: string;
}

export interface User_Key {
  uid: string;
  __typename?: 'User_Key';
}

interface CreateStoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStoryVariables): MutationRef<CreateStoryData, CreateStoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateStoryVariables): MutationRef<CreateStoryData, CreateStoryVariables>;
  operationName: string;
}
export const createStoryRef: CreateStoryRef;

export function createStory(vars: CreateStoryVariables): MutationPromise<CreateStoryData, CreateStoryVariables>;
export function createStory(dc: DataConnect, vars: CreateStoryVariables): MutationPromise<CreateStoryData, CreateStoryVariables>;

interface UpdateStoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStoryVariables): MutationRef<UpdateStoryData, UpdateStoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStoryVariables): MutationRef<UpdateStoryData, UpdateStoryVariables>;
  operationName: string;
}
export const updateStoryRef: UpdateStoryRef;

export function updateStory(vars: UpdateStoryVariables): MutationPromise<UpdateStoryData, UpdateStoryVariables>;
export function updateStory(dc: DataConnect, vars: UpdateStoryVariables): MutationPromise<UpdateStoryData, UpdateStoryVariables>;

interface DeleteStoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteStoryVariables): MutationRef<DeleteStoryData, DeleteStoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteStoryVariables): MutationRef<DeleteStoryData, DeleteStoryVariables>;
  operationName: string;
}
export const deleteStoryRef: DeleteStoryRef;

export function deleteStory(vars: DeleteStoryVariables): MutationPromise<DeleteStoryData, DeleteStoryVariables>;
export function deleteStory(dc: DataConnect, vars: DeleteStoryVariables): MutationPromise<DeleteStoryData, DeleteStoryVariables>;

interface UpsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  operationName: string;
}
export const upsertUserRef: UpsertUserRef;

export function upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface LogMediaAuditRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogMediaAuditVariables): MutationRef<LogMediaAuditData, LogMediaAuditVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LogMediaAuditVariables): MutationRef<LogMediaAuditData, LogMediaAuditVariables>;
  operationName: string;
}
export const logMediaAuditRef: LogMediaAuditRef;

export function logMediaAudit(vars: LogMediaAuditVariables): MutationPromise<LogMediaAuditData, LogMediaAuditVariables>;
export function logMediaAudit(dc: DataConnect, vars: LogMediaAuditVariables): MutationPromise<LogMediaAuditData, LogMediaAuditVariables>;

interface ListStoriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListStoriesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListStoriesData, undefined>;
  operationName: string;
}
export const listStoriesRef: ListStoriesRef;

export function listStories(options?: ExecuteQueryOptions): QueryPromise<ListStoriesData, undefined>;
export function listStories(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListStoriesData, undefined>;

interface GetStoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStoryVariables): QueryRef<GetStoryData, GetStoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStoryVariables): QueryRef<GetStoryData, GetStoryVariables>;
  operationName: string;
}
export const getStoryRef: GetStoryRef;

export function getStory(vars: GetStoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetStoryData, GetStoryVariables>;
export function getStory(dc: DataConnect, vars: GetStoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetStoryData, GetStoryVariables>;

interface ListStoriesByCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListStoriesByCategoryVariables): QueryRef<ListStoriesByCategoryData, ListStoriesByCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListStoriesByCategoryVariables): QueryRef<ListStoriesByCategoryData, ListStoriesByCategoryVariables>;
  operationName: string;
}
export const listStoriesByCategoryRef: ListStoriesByCategoryRef;

export function listStoriesByCategory(vars: ListStoriesByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListStoriesByCategoryData, ListStoriesByCategoryVariables>;
export function listStoriesByCategory(dc: DataConnect, vars: ListStoriesByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListStoriesByCategoryData, ListStoriesByCategoryVariables>;

interface ListStoriesByVerdictRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListStoriesByVerdictVariables): QueryRef<ListStoriesByVerdictData, ListStoriesByVerdictVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListStoriesByVerdictVariables): QueryRef<ListStoriesByVerdictData, ListStoriesByVerdictVariables>;
  operationName: string;
}
export const listStoriesByVerdictRef: ListStoriesByVerdictRef;

export function listStoriesByVerdict(vars: ListStoriesByVerdictVariables, options?: ExecuteQueryOptions): QueryPromise<ListStoriesByVerdictData, ListStoriesByVerdictVariables>;
export function listStoriesByVerdict(dc: DataConnect, vars: ListStoriesByVerdictVariables, options?: ExecuteQueryOptions): QueryPromise<ListStoriesByVerdictData, ListStoriesByVerdictVariables>;

interface GetUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
  operationName: string;
}
export const getUserProfileRef: GetUserProfileRef;

export function getUserProfile(vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;
export function getUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;

