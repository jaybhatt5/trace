# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `trace`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListStories*](#liststories)
  - [*GetStory*](#getstory)
  - [*ListStoriesByCategory*](#liststoriesbycategory)
  - [*ListStoriesByVerdict*](#liststoriesbyverdict)
  - [*GetUserProfile*](#getuserprofile)
- [**Mutations**](#mutations)
  - [*CreateStory*](#createstory)
  - [*UpdateStory*](#updatestory)
  - [*DeleteStory*](#deletestory)
  - [*UpsertUser*](#upsertuser)
  - [*LogMediaAudit*](#logmediaaudit)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `trace`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@trace/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@trace/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@trace/dataconnect';

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

## ListStories
You can execute the `ListStories` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listStories(options?: ExecuteQueryOptions): QueryPromise<ListStoriesData, undefined>;

interface ListStoriesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListStoriesData, undefined>;
}
export const listStoriesRef: ListStoriesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listStories(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListStoriesData, undefined>;

interface ListStoriesRef {
  ...
  (dc: DataConnect): QueryRef<ListStoriesData, undefined>;
}
export const listStoriesRef: ListStoriesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listStoriesRef:
```typescript
const name = listStoriesRef.operationName;
console.log(name);
```

### Variables
The `ListStories` query has no variables.
### Return Type
Recall that executing the `ListStories` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListStoriesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListStories`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listStories } from '@trace/dataconnect';


// Call the `listStories()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listStories();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listStories(dataConnect);

console.log(data.stories);

// Or, you can use the `Promise` API.
listStories().then((response) => {
  const data = response.data;
  console.log(data.stories);
});
```

### Using `ListStories`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listStoriesRef } from '@trace/dataconnect';


// Call the `listStoriesRef()` function to get a reference to the query.
const ref = listStoriesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listStoriesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.stories);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.stories);
});
```

## GetStory
You can execute the `GetStory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getStory(vars: GetStoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetStoryData, GetStoryVariables>;

interface GetStoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStoryVariables): QueryRef<GetStoryData, GetStoryVariables>;
}
export const getStoryRef: GetStoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStory(dc: DataConnect, vars: GetStoryVariables, options?: ExecuteQueryOptions): QueryPromise<GetStoryData, GetStoryVariables>;

interface GetStoryRef {
  ...
  (dc: DataConnect, vars: GetStoryVariables): QueryRef<GetStoryData, GetStoryVariables>;
}
export const getStoryRef: GetStoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStoryRef:
```typescript
const name = getStoryRef.operationName;
console.log(name);
```

### Variables
The `GetStory` query requires an argument of type `GetStoryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetStoryVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetStory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStoryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetStory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStory, GetStoryVariables } from '@trace/dataconnect';

// The `GetStory` query requires an argument of type `GetStoryVariables`:
const getStoryVars: GetStoryVariables = {
  id: ..., 
};

// Call the `getStory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStory(getStoryVars);
// Variables can be defined inline as well.
const { data } = await getStory({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStory(dataConnect, getStoryVars);

console.log(data.story);

// Or, you can use the `Promise` API.
getStory(getStoryVars).then((response) => {
  const data = response.data;
  console.log(data.story);
});
```

### Using `GetStory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStoryRef, GetStoryVariables } from '@trace/dataconnect';

// The `GetStory` query requires an argument of type `GetStoryVariables`:
const getStoryVars: GetStoryVariables = {
  id: ..., 
};

// Call the `getStoryRef()` function to get a reference to the query.
const ref = getStoryRef(getStoryVars);
// Variables can be defined inline as well.
const ref = getStoryRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStoryRef(dataConnect, getStoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.story);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.story);
});
```

## ListStoriesByCategory
You can execute the `ListStoriesByCategory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listStoriesByCategory(vars: ListStoriesByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListStoriesByCategoryData, ListStoriesByCategoryVariables>;

interface ListStoriesByCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListStoriesByCategoryVariables): QueryRef<ListStoriesByCategoryData, ListStoriesByCategoryVariables>;
}
export const listStoriesByCategoryRef: ListStoriesByCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listStoriesByCategory(dc: DataConnect, vars: ListStoriesByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListStoriesByCategoryData, ListStoriesByCategoryVariables>;

interface ListStoriesByCategoryRef {
  ...
  (dc: DataConnect, vars: ListStoriesByCategoryVariables): QueryRef<ListStoriesByCategoryData, ListStoriesByCategoryVariables>;
}
export const listStoriesByCategoryRef: ListStoriesByCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listStoriesByCategoryRef:
```typescript
const name = listStoriesByCategoryRef.operationName;
console.log(name);
```

### Variables
The `ListStoriesByCategory` query requires an argument of type `ListStoriesByCategoryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListStoriesByCategoryVariables {
  category: string;
}
```
### Return Type
Recall that executing the `ListStoriesByCategory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListStoriesByCategoryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListStoriesByCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listStoriesByCategory, ListStoriesByCategoryVariables } from '@trace/dataconnect';

// The `ListStoriesByCategory` query requires an argument of type `ListStoriesByCategoryVariables`:
const listStoriesByCategoryVars: ListStoriesByCategoryVariables = {
  category: ..., 
};

// Call the `listStoriesByCategory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listStoriesByCategory(listStoriesByCategoryVars);
// Variables can be defined inline as well.
const { data } = await listStoriesByCategory({ category: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listStoriesByCategory(dataConnect, listStoriesByCategoryVars);

console.log(data.stories);

// Or, you can use the `Promise` API.
listStoriesByCategory(listStoriesByCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.stories);
});
```

### Using `ListStoriesByCategory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listStoriesByCategoryRef, ListStoriesByCategoryVariables } from '@trace/dataconnect';

// The `ListStoriesByCategory` query requires an argument of type `ListStoriesByCategoryVariables`:
const listStoriesByCategoryVars: ListStoriesByCategoryVariables = {
  category: ..., 
};

// Call the `listStoriesByCategoryRef()` function to get a reference to the query.
const ref = listStoriesByCategoryRef(listStoriesByCategoryVars);
// Variables can be defined inline as well.
const ref = listStoriesByCategoryRef({ category: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listStoriesByCategoryRef(dataConnect, listStoriesByCategoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.stories);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.stories);
});
```

## ListStoriesByVerdict
You can execute the `ListStoriesByVerdict` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listStoriesByVerdict(vars: ListStoriesByVerdictVariables, options?: ExecuteQueryOptions): QueryPromise<ListStoriesByVerdictData, ListStoriesByVerdictVariables>;

interface ListStoriesByVerdictRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListStoriesByVerdictVariables): QueryRef<ListStoriesByVerdictData, ListStoriesByVerdictVariables>;
}
export const listStoriesByVerdictRef: ListStoriesByVerdictRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listStoriesByVerdict(dc: DataConnect, vars: ListStoriesByVerdictVariables, options?: ExecuteQueryOptions): QueryPromise<ListStoriesByVerdictData, ListStoriesByVerdictVariables>;

interface ListStoriesByVerdictRef {
  ...
  (dc: DataConnect, vars: ListStoriesByVerdictVariables): QueryRef<ListStoriesByVerdictData, ListStoriesByVerdictVariables>;
}
export const listStoriesByVerdictRef: ListStoriesByVerdictRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listStoriesByVerdictRef:
```typescript
const name = listStoriesByVerdictRef.operationName;
console.log(name);
```

### Variables
The `ListStoriesByVerdict` query requires an argument of type `ListStoriesByVerdictVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListStoriesByVerdictVariables {
  verdict: string;
}
```
### Return Type
Recall that executing the `ListStoriesByVerdict` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListStoriesByVerdictData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListStoriesByVerdict`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listStoriesByVerdict, ListStoriesByVerdictVariables } from '@trace/dataconnect';

// The `ListStoriesByVerdict` query requires an argument of type `ListStoriesByVerdictVariables`:
const listStoriesByVerdictVars: ListStoriesByVerdictVariables = {
  verdict: ..., 
};

// Call the `listStoriesByVerdict()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listStoriesByVerdict(listStoriesByVerdictVars);
// Variables can be defined inline as well.
const { data } = await listStoriesByVerdict({ verdict: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listStoriesByVerdict(dataConnect, listStoriesByVerdictVars);

console.log(data.stories);

// Or, you can use the `Promise` API.
listStoriesByVerdict(listStoriesByVerdictVars).then((response) => {
  const data = response.data;
  console.log(data.stories);
});
```

### Using `ListStoriesByVerdict`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listStoriesByVerdictRef, ListStoriesByVerdictVariables } from '@trace/dataconnect';

// The `ListStoriesByVerdict` query requires an argument of type `ListStoriesByVerdictVariables`:
const listStoriesByVerdictVars: ListStoriesByVerdictVariables = {
  verdict: ..., 
};

// Call the `listStoriesByVerdictRef()` function to get a reference to the query.
const ref = listStoriesByVerdictRef(listStoriesByVerdictVars);
// Variables can be defined inline as well.
const ref = listStoriesByVerdictRef({ verdict: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listStoriesByVerdictRef(dataConnect, listStoriesByVerdictVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.stories);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.stories);
});
```

## GetUserProfile
You can execute the `GetUserProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserProfile(vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;

interface GetUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
}
export const getUserProfileRef: GetUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserProfile(dc: DataConnect, vars: GetUserProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserProfileData, GetUserProfileVariables>;

interface GetUserProfileRef {
  ...
  (dc: DataConnect, vars: GetUserProfileVariables): QueryRef<GetUserProfileData, GetUserProfileVariables>;
}
export const getUserProfileRef: GetUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserProfileRef:
```typescript
const name = getUserProfileRef.operationName;
console.log(name);
```

### Variables
The `GetUserProfile` query requires an argument of type `GetUserProfileVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserProfileVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `GetUserProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserProfileData {
  user?: {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    role: string;
    createdAt: TimestampString;
  } & User_Key;
}
```
### Using `GetUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserProfile, GetUserProfileVariables } from '@trace/dataconnect';

// The `GetUserProfile` query requires an argument of type `GetUserProfileVariables`:
const getUserProfileVars: GetUserProfileVariables = {
  uid: ..., 
};

// Call the `getUserProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserProfile(getUserProfileVars);
// Variables can be defined inline as well.
const { data } = await getUserProfile({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserProfile(dataConnect, getUserProfileVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUserProfile(getUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUserProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserProfileRef, GetUserProfileVariables } from '@trace/dataconnect';

// The `GetUserProfile` query requires an argument of type `GetUserProfileVariables`:
const getUserProfileVars: GetUserProfileVariables = {
  uid: ..., 
};

// Call the `getUserProfileRef()` function to get a reference to the query.
const ref = getUserProfileRef(getUserProfileVars);
// Variables can be defined inline as well.
const ref = getUserProfileRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserProfileRef(dataConnect, getUserProfileVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
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

## CreateStory
You can execute the `CreateStory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createStory(vars: CreateStoryVariables): MutationPromise<CreateStoryData, CreateStoryVariables>;

interface CreateStoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateStoryVariables): MutationRef<CreateStoryData, CreateStoryVariables>;
}
export const createStoryRef: CreateStoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createStory(dc: DataConnect, vars: CreateStoryVariables): MutationPromise<CreateStoryData, CreateStoryVariables>;

interface CreateStoryRef {
  ...
  (dc: DataConnect, vars: CreateStoryVariables): MutationRef<CreateStoryData, CreateStoryVariables>;
}
export const createStoryRef: CreateStoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createStoryRef:
```typescript
const name = createStoryRef.operationName;
console.log(name);
```

### Variables
The `CreateStory` mutation requires an argument of type `CreateStoryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateStory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateStoryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateStoryData {
  story_insert: Story_Key;
}
```
### Using `CreateStory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createStory, CreateStoryVariables } from '@trace/dataconnect';

// The `CreateStory` mutation requires an argument of type `CreateStoryVariables`:
const createStoryVars: CreateStoryVariables = {
  title: ..., 
  claim: ..., 
  verdict: ..., 
  truthScore: ..., 
  category: ..., 
  summary: ..., 
  explanation: ..., 
  author: ..., 
  imageUrl: ..., // optional
};

// Call the `createStory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createStory(createStoryVars);
// Variables can be defined inline as well.
const { data } = await createStory({ title: ..., claim: ..., verdict: ..., truthScore: ..., category: ..., summary: ..., explanation: ..., author: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createStory(dataConnect, createStoryVars);

console.log(data.story_insert);

// Or, you can use the `Promise` API.
createStory(createStoryVars).then((response) => {
  const data = response.data;
  console.log(data.story_insert);
});
```

### Using `CreateStory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createStoryRef, CreateStoryVariables } from '@trace/dataconnect';

// The `CreateStory` mutation requires an argument of type `CreateStoryVariables`:
const createStoryVars: CreateStoryVariables = {
  title: ..., 
  claim: ..., 
  verdict: ..., 
  truthScore: ..., 
  category: ..., 
  summary: ..., 
  explanation: ..., 
  author: ..., 
  imageUrl: ..., // optional
};

// Call the `createStoryRef()` function to get a reference to the mutation.
const ref = createStoryRef(createStoryVars);
// Variables can be defined inline as well.
const ref = createStoryRef({ title: ..., claim: ..., verdict: ..., truthScore: ..., category: ..., summary: ..., explanation: ..., author: ..., imageUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createStoryRef(dataConnect, createStoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.story_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.story_insert);
});
```

## UpdateStory
You can execute the `UpdateStory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateStory(vars: UpdateStoryVariables): MutationPromise<UpdateStoryData, UpdateStoryVariables>;

interface UpdateStoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStoryVariables): MutationRef<UpdateStoryData, UpdateStoryVariables>;
}
export const updateStoryRef: UpdateStoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStory(dc: DataConnect, vars: UpdateStoryVariables): MutationPromise<UpdateStoryData, UpdateStoryVariables>;

interface UpdateStoryRef {
  ...
  (dc: DataConnect, vars: UpdateStoryVariables): MutationRef<UpdateStoryData, UpdateStoryVariables>;
}
export const updateStoryRef: UpdateStoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStoryRef:
```typescript
const name = updateStoryRef.operationName;
console.log(name);
```

### Variables
The `UpdateStory` mutation requires an argument of type `UpdateStoryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpdateStory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStoryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStoryData {
  story_update?: Story_Key | null;
}
```
### Using `UpdateStory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStory, UpdateStoryVariables } from '@trace/dataconnect';

// The `UpdateStory` mutation requires an argument of type `UpdateStoryVariables`:
const updateStoryVars: UpdateStoryVariables = {
  id: ..., 
  title: ..., // optional
  claim: ..., // optional
  verdict: ..., // optional
  truthScore: ..., // optional
  category: ..., // optional
  summary: ..., // optional
  explanation: ..., // optional
};

// Call the `updateStory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStory(updateStoryVars);
// Variables can be defined inline as well.
const { data } = await updateStory({ id: ..., title: ..., claim: ..., verdict: ..., truthScore: ..., category: ..., summary: ..., explanation: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStory(dataConnect, updateStoryVars);

console.log(data.story_update);

// Or, you can use the `Promise` API.
updateStory(updateStoryVars).then((response) => {
  const data = response.data;
  console.log(data.story_update);
});
```

### Using `UpdateStory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStoryRef, UpdateStoryVariables } from '@trace/dataconnect';

// The `UpdateStory` mutation requires an argument of type `UpdateStoryVariables`:
const updateStoryVars: UpdateStoryVariables = {
  id: ..., 
  title: ..., // optional
  claim: ..., // optional
  verdict: ..., // optional
  truthScore: ..., // optional
  category: ..., // optional
  summary: ..., // optional
  explanation: ..., // optional
};

// Call the `updateStoryRef()` function to get a reference to the mutation.
const ref = updateStoryRef(updateStoryVars);
// Variables can be defined inline as well.
const ref = updateStoryRef({ id: ..., title: ..., claim: ..., verdict: ..., truthScore: ..., category: ..., summary: ..., explanation: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStoryRef(dataConnect, updateStoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.story_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.story_update);
});
```

## DeleteStory
You can execute the `DeleteStory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteStory(vars: DeleteStoryVariables): MutationPromise<DeleteStoryData, DeleteStoryVariables>;

interface DeleteStoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteStoryVariables): MutationRef<DeleteStoryData, DeleteStoryVariables>;
}
export const deleteStoryRef: DeleteStoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteStory(dc: DataConnect, vars: DeleteStoryVariables): MutationPromise<DeleteStoryData, DeleteStoryVariables>;

interface DeleteStoryRef {
  ...
  (dc: DataConnect, vars: DeleteStoryVariables): MutationRef<DeleteStoryData, DeleteStoryVariables>;
}
export const deleteStoryRef: DeleteStoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteStoryRef:
```typescript
const name = deleteStoryRef.operationName;
console.log(name);
```

### Variables
The `DeleteStory` mutation requires an argument of type `DeleteStoryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteStoryVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteStory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteStoryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteStoryData {
  story_delete?: Story_Key | null;
}
```
### Using `DeleteStory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteStory, DeleteStoryVariables } from '@trace/dataconnect';

// The `DeleteStory` mutation requires an argument of type `DeleteStoryVariables`:
const deleteStoryVars: DeleteStoryVariables = {
  id: ..., 
};

// Call the `deleteStory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteStory(deleteStoryVars);
// Variables can be defined inline as well.
const { data } = await deleteStory({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteStory(dataConnect, deleteStoryVars);

console.log(data.story_delete);

// Or, you can use the `Promise` API.
deleteStory(deleteStoryVars).then((response) => {
  const data = response.data;
  console.log(data.story_delete);
});
```

### Using `DeleteStory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteStoryRef, DeleteStoryVariables } from '@trace/dataconnect';

// The `DeleteStory` mutation requires an argument of type `DeleteStoryVariables`:
const deleteStoryVars: DeleteStoryVariables = {
  id: ..., 
};

// Call the `deleteStoryRef()` function to get a reference to the mutation.
const ref = deleteStoryRef(deleteStoryVars);
// Variables can be defined inline as well.
const ref = deleteStoryRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteStoryRef(dataConnect, deleteStoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.story_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.story_delete);
});
```

## UpsertUser
You can execute the `UpsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserRef:
```typescript
const name = upsertUserRef.operationName;
console.log(name);
```

### Variables
The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserVariables {
  email?: string | null;
  displayName?: string | null;
  role: string;
}
```
### Return Type
Recall that executing the `UpsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```
### Using `UpsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUser, UpsertUserVariables } from '@trace/dataconnect';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  email: ..., // optional
  displayName: ..., // optional
  role: ..., 
};

// Call the `upsertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUser(upsertUserVars);
// Variables can be defined inline as well.
const { data } = await upsertUser({ email: ..., displayName: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUser(dataConnect, upsertUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUser(upsertUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserRef, UpsertUserVariables } from '@trace/dataconnect';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  email: ..., // optional
  displayName: ..., // optional
  role: ..., 
};

// Call the `upsertUserRef()` function to get a reference to the mutation.
const ref = upsertUserRef(upsertUserVars);
// Variables can be defined inline as well.
const ref = upsertUserRef({ email: ..., displayName: ..., role: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserRef(dataConnect, upsertUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## LogMediaAudit
You can execute the `LogMediaAudit` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
logMediaAudit(vars: LogMediaAuditVariables): MutationPromise<LogMediaAuditData, LogMediaAuditVariables>;

interface LogMediaAuditRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogMediaAuditVariables): MutationRef<LogMediaAuditData, LogMediaAuditVariables>;
}
export const logMediaAuditRef: LogMediaAuditRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
logMediaAudit(dc: DataConnect, vars: LogMediaAuditVariables): MutationPromise<LogMediaAuditData, LogMediaAuditVariables>;

interface LogMediaAuditRef {
  ...
  (dc: DataConnect, vars: LogMediaAuditVariables): MutationRef<LogMediaAuditData, LogMediaAuditVariables>;
}
export const logMediaAuditRef: LogMediaAuditRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the logMediaAuditRef:
```typescript
const name = logMediaAuditRef.operationName;
console.log(name);
```

### Variables
The `LogMediaAudit` mutation requires an argument of type `LogMediaAuditVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LogMediaAuditVariables {
  auditType: string;
  mediaUrl?: string | null;
  score: number;
  verdict: string;
  detailsJson?: string | null;
}
```
### Return Type
Recall that executing the `LogMediaAudit` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LogMediaAuditData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LogMediaAuditData {
  mediaAudit_insert: MediaAudit_Key;
}
```
### Using `LogMediaAudit`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, logMediaAudit, LogMediaAuditVariables } from '@trace/dataconnect';

// The `LogMediaAudit` mutation requires an argument of type `LogMediaAuditVariables`:
const logMediaAuditVars: LogMediaAuditVariables = {
  auditType: ..., 
  mediaUrl: ..., // optional
  score: ..., 
  verdict: ..., 
  detailsJson: ..., // optional
};

// Call the `logMediaAudit()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await logMediaAudit(logMediaAuditVars);
// Variables can be defined inline as well.
const { data } = await logMediaAudit({ auditType: ..., mediaUrl: ..., score: ..., verdict: ..., detailsJson: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await logMediaAudit(dataConnect, logMediaAuditVars);

console.log(data.mediaAudit_insert);

// Or, you can use the `Promise` API.
logMediaAudit(logMediaAuditVars).then((response) => {
  const data = response.data;
  console.log(data.mediaAudit_insert);
});
```

### Using `LogMediaAudit`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, logMediaAuditRef, LogMediaAuditVariables } from '@trace/dataconnect';

// The `LogMediaAudit` mutation requires an argument of type `LogMediaAuditVariables`:
const logMediaAuditVars: LogMediaAuditVariables = {
  auditType: ..., 
  mediaUrl: ..., // optional
  score: ..., 
  verdict: ..., 
  detailsJson: ..., // optional
};

// Call the `logMediaAuditRef()` function to get a reference to the mutation.
const ref = logMediaAuditRef(logMediaAuditVars);
// Variables can be defined inline as well.
const ref = logMediaAuditRef({ auditType: ..., mediaUrl: ..., score: ..., verdict: ..., detailsJson: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = logMediaAuditRef(dataConnect, logMediaAuditVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.mediaAudit_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.mediaAudit_insert);
});
```

