# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `trace`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListUserWatchlist*](#listuserwatchlist)
  - [*GetAnalysisReport*](#getanalysisreport)
- [**Mutations**](#mutations)
  - [*CreateMediaContent*](#createmediacontent)
  - [*CreateReview*](#createreview)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `trace`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `trace` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListUserWatchlist
You can execute the `ListUserWatchlist` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUserWatchlist(vars: ListUserWatchlistVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserWatchlistData, ListUserWatchlistVariables>;

interface ListUserWatchlistRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUserWatchlistVariables): QueryRef<ListUserWatchlistData, ListUserWatchlistVariables>;
}
export const listUserWatchlistRef: ListUserWatchlistRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUserWatchlist(dc: DataConnect, vars: ListUserWatchlistVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserWatchlistData, ListUserWatchlistVariables>;

interface ListUserWatchlistRef {
  ...
  (dc: DataConnect, vars: ListUserWatchlistVariables): QueryRef<ListUserWatchlistData, ListUserWatchlistVariables>;
}
export const listUserWatchlistRef: ListUserWatchlistRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUserWatchlistRef:
```typescript
const name = listUserWatchlistRef.operationName;
console.log(name);
```

### Variables
The `ListUserWatchlist` query requires an argument of type `ListUserWatchlistVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListUserWatchlistVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `ListUserWatchlist` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUserWatchlistData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUserWatchlistData {
  watchlists: ({
    mediaContent: {
      type: string;
      sourceUrl: string;
    };
    dateAdded: TimestampString;
  })[];
}
```
### Using `ListUserWatchlist`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUserWatchlist, ListUserWatchlistVariables } from '@dataconnect/generated';

// The `ListUserWatchlist` query requires an argument of type `ListUserWatchlistVariables`:
const listUserWatchlistVars: ListUserWatchlistVariables = {
  userId: ..., 
};

// Call the `listUserWatchlist()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUserWatchlist(listUserWatchlistVars);
// Variables can be defined inline as well.
const { data } = await listUserWatchlist({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUserWatchlist(dataConnect, listUserWatchlistVars);

console.log(data.watchlists);

// Or, you can use the `Promise` API.
listUserWatchlist(listUserWatchlistVars).then((response) => {
  const data = response.data;
  console.log(data.watchlists);
});
```

### Using `ListUserWatchlist`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUserWatchlistRef, ListUserWatchlistVariables } from '@dataconnect/generated';

// The `ListUserWatchlist` query requires an argument of type `ListUserWatchlistVariables`:
const listUserWatchlistVars: ListUserWatchlistVariables = {
  userId: ..., 
};

// Call the `listUserWatchlistRef()` function to get a reference to the query.
const ref = listUserWatchlistRef(listUserWatchlistVars);
// Variables can be defined inline as well.
const ref = listUserWatchlistRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUserWatchlistRef(dataConnect, listUserWatchlistVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.watchlists);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.watchlists);
});
```

## GetAnalysisReport
You can execute the `GetAnalysisReport` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getAnalysisReport(vars: GetAnalysisReportVariables, options?: ExecuteQueryOptions): QueryPromise<GetAnalysisReportData, GetAnalysisReportVariables>;

interface GetAnalysisReportRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAnalysisReportVariables): QueryRef<GetAnalysisReportData, GetAnalysisReportVariables>;
}
export const getAnalysisReportRef: GetAnalysisReportRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAnalysisReport(dc: DataConnect, vars: GetAnalysisReportVariables, options?: ExecuteQueryOptions): QueryPromise<GetAnalysisReportData, GetAnalysisReportVariables>;

interface GetAnalysisReportRef {
  ...
  (dc: DataConnect, vars: GetAnalysisReportVariables): QueryRef<GetAnalysisReportData, GetAnalysisReportVariables>;
}
export const getAnalysisReportRef: GetAnalysisReportRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAnalysisReportRef:
```typescript
const name = getAnalysisReportRef.operationName;
console.log(name);
```

### Variables
The `GetAnalysisReport` query requires an argument of type `GetAnalysisReportVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAnalysisReportVariables {
  reportId: UUIDString;
}
```
### Return Type
Recall that executing the `GetAnalysisReport` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAnalysisReportData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAnalysisReportData {
  analysisReport?: {
    aiLikelihoodPercentage: number;
    reportDetails: string;
    mediaContent: {
      sourceUrl: string;
    };
  };
}
```
### Using `GetAnalysisReport`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAnalysisReport, GetAnalysisReportVariables } from '@dataconnect/generated';

// The `GetAnalysisReport` query requires an argument of type `GetAnalysisReportVariables`:
const getAnalysisReportVars: GetAnalysisReportVariables = {
  reportId: ..., 
};

// Call the `getAnalysisReport()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAnalysisReport(getAnalysisReportVars);
// Variables can be defined inline as well.
const { data } = await getAnalysisReport({ reportId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAnalysisReport(dataConnect, getAnalysisReportVars);

console.log(data.analysisReport);

// Or, you can use the `Promise` API.
getAnalysisReport(getAnalysisReportVars).then((response) => {
  const data = response.data;
  console.log(data.analysisReport);
});
```

### Using `GetAnalysisReport`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAnalysisReportRef, GetAnalysisReportVariables } from '@dataconnect/generated';

// The `GetAnalysisReport` query requires an argument of type `GetAnalysisReportVariables`:
const getAnalysisReportVars: GetAnalysisReportVariables = {
  reportId: ..., 
};

// Call the `getAnalysisReportRef()` function to get a reference to the query.
const ref = getAnalysisReportRef(getAnalysisReportVars);
// Variables can be defined inline as well.
const ref = getAnalysisReportRef({ reportId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAnalysisReportRef(dataConnect, getAnalysisReportVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.analysisReport);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.analysisReport);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `trace` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateMediaContent
You can execute the `CreateMediaContent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createMediaContent(vars: CreateMediaContentVariables): MutationPromise<CreateMediaContentData, CreateMediaContentVariables>;

interface CreateMediaContentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMediaContentVariables): MutationRef<CreateMediaContentData, CreateMediaContentVariables>;
}
export const createMediaContentRef: CreateMediaContentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMediaContent(dc: DataConnect, vars: CreateMediaContentVariables): MutationPromise<CreateMediaContentData, CreateMediaContentVariables>;

interface CreateMediaContentRef {
  ...
  (dc: DataConnect, vars: CreateMediaContentVariables): MutationRef<CreateMediaContentData, CreateMediaContentVariables>;
}
export const createMediaContentRef: CreateMediaContentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMediaContentRef:
```typescript
const name = createMediaContentRef.operationName;
console.log(name);
```

### Variables
The `CreateMediaContent` mutation requires an argument of type `CreateMediaContentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateMediaContentVariables {
  type: string;
  sourceUrl: string;
  analysisStatus: string;
  uploaderId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateMediaContent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMediaContentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMediaContentData {
  mediaContent_insert: MediaContent_Key;
}
```
### Using `CreateMediaContent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMediaContent, CreateMediaContentVariables } from '@dataconnect/generated';

// The `CreateMediaContent` mutation requires an argument of type `CreateMediaContentVariables`:
const createMediaContentVars: CreateMediaContentVariables = {
  type: ..., 
  sourceUrl: ..., 
  analysisStatus: ..., 
  uploaderId: ..., 
};

// Call the `createMediaContent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMediaContent(createMediaContentVars);
// Variables can be defined inline as well.
const { data } = await createMediaContent({ type: ..., sourceUrl: ..., analysisStatus: ..., uploaderId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMediaContent(dataConnect, createMediaContentVars);

console.log(data.mediaContent_insert);

// Or, you can use the `Promise` API.
createMediaContent(createMediaContentVars).then((response) => {
  const data = response.data;
  console.log(data.mediaContent_insert);
});
```

### Using `CreateMediaContent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMediaContentRef, CreateMediaContentVariables } from '@dataconnect/generated';

// The `CreateMediaContent` mutation requires an argument of type `CreateMediaContentVariables`:
const createMediaContentVars: CreateMediaContentVariables = {
  type: ..., 
  sourceUrl: ..., 
  analysisStatus: ..., 
  uploaderId: ..., 
};

// Call the `createMediaContentRef()` function to get a reference to the mutation.
const ref = createMediaContentRef(createMediaContentVars);
// Variables can be defined inline as well.
const ref = createMediaContentRef({ type: ..., sourceUrl: ..., analysisStatus: ..., uploaderId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMediaContentRef(dataConnect, createMediaContentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.mediaContent_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.mediaContent_insert);
});
```

## CreateReview
You can execute the `CreateReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createReview(vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface CreateReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
}
export const createReviewRef: CreateReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createReview(dc: DataConnect, vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface CreateReviewRef {
  ...
  (dc: DataConnect, vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
}
export const createReviewRef: CreateReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createReviewRef:
```typescript
const name = createReviewRef.operationName;
console.log(name);
```

### Variables
The `CreateReview` mutation requires an argument of type `CreateReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateReviewVariables {
  rating: number;
  comment: string;
  mediaContentId: UUIDString;
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateReviewData {
  review_insert: Review_Key;
}
```
### Using `CreateReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createReview, CreateReviewVariables } from '@dataconnect/generated';

// The `CreateReview` mutation requires an argument of type `CreateReviewVariables`:
const createReviewVars: CreateReviewVariables = {
  rating: ..., 
  comment: ..., 
  mediaContentId: ..., 
  userId: ..., 
};

// Call the `createReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createReview(createReviewVars);
// Variables can be defined inline as well.
const { data } = await createReview({ rating: ..., comment: ..., mediaContentId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createReview(dataConnect, createReviewVars);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
createReview(createReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

### Using `CreateReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createReviewRef, CreateReviewVariables } from '@dataconnect/generated';

// The `CreateReview` mutation requires an argument of type `CreateReviewVariables`:
const createReviewVars: CreateReviewVariables = {
  rating: ..., 
  comment: ..., 
  mediaContentId: ..., 
  userId: ..., 
};

// Call the `createReviewRef()` function to get a reference to the mutation.
const ref = createReviewRef(createReviewVars);
// Variables can be defined inline as well.
const ref = createReviewRef({ rating: ..., comment: ..., mediaContentId: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createReviewRef(dataConnect, createReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

