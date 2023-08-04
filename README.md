<div align="center">
<h1>react-query-kit</h1>

<p>🕊️ A toolkit for ReactQuery that make ReactQuery reusable and typesafe</p>

<p align="center">
  <a href="https://github.com/liaoliao666/react-query-kit/actions/workflows/tests.yml"><img src="https://github.com/liaoliao666/react-query-kit/actions/workflows/tests.yml/badge.svg?branch=main" alt="Latest build" target="\_parent"></a>
  <a href="https://www.npmjs.com/package/react-query-kit"><img src="https://badgen.net/npm/v/react-query-kit" alt="Latest published version" target="\_parent"></a>
  <a href="https://unpkg.com/browse/react-query-kit@latest/build/umd/index.production.js" rel="nofollow"><img src="https://img.badgesize.io/https:/unpkg.com/react-query-kit@latest/build/umd/index.production.js?label=gzip%20size&compression=gzip" alt="gzip size"></a>
  <a href="https://github.com/liaoliao666/react-query-kit"><img src="https://badgen.net/npm/types/react-query-kit" alt="Types included" target="\_parent"></a>
  <a href="https://www.npmjs.com/package/react-query-kit"><img src="https://badgen.net/npm/license/react-query-kit" alt="License" target="\_parent"></a>
  <a href="https://www.npmjs.com/package/react-query-kit"><img src="https://badgen.net/npm/dt/react-query-kit" alt="Number of downloads" target="\_parent"></a>
  <a href="https://github.com/liaoliao666/react-query-kit"><img src="https://img.shields.io/github/stars/liaoliao666/react-query-kit.svg?style=social&amp;label=Star" alt="GitHub Stars" target="\_parent"></a>
</p>
</div>

---

## What could you benefit from it

- Make `queryKey` strongly related with `queryFn`
- Manage `queryKey` in a type-safe way
- Generate a custom ReactQuery hook quickly
- Make `queryClient`'s operations clearly associated with custom ReactQuery hooks
- Set defaultOptions for custom ReactQuery hooks easier and clearer

![react-query-kit.gif](https://files.catbox.moe/cw5hex.gif)

English | [简体中文](./README-zh_CN.md)

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Examples](#examples)
- Usage
  - [createQuery](#createquery)
  - [createInfiniteQuery](#createinfinitequery)
  - [createMutation](#createmutation)
  - [createImmutableQuery](#createimmutablequery)
  - [createSuspenseQuery](#createsuspensequery)
  - [createSuspenseInfiniteQuery](#createsuspenseinfinitequery)
  - [createMutation](#createmutation)
  - [Type inference](#type-inference)
  - [Caution](#caution)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```bash
$ npm i react-query-kit
# or
$ yarn add react-query-kit
```

# Examples

- [Basic](https://codesandbox.io/s/example-react-query-kit-basic-1ny2j8)
- [Optimistic Updates](https://codesandbox.io/s/example-react-query-kit-optimistic-updates-eefg0v)
- [Next.js](https://codesandbox.io/s/example-react-query-kit-nextjs-uldl88)
- [Load-More & Infinite Scroll](https://codesandbox.io/s/example-react-query-kit-load-more-infinite-scroll-vg494v)

## createQuery

### Usage

```tsx
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { createQuery, inferData } from 'react-query-kit'

type Response = { title: string; content: string }
type Variables = { id: number }

const usePost = createQuery<Response, Variables, Error>({
  primaryKey: '/posts',
  queryFn: ({ queryKey: [primaryKey, variables] }) => {
    // primaryKey equals to '/posts'
    return fetch(`${primaryKey}/${variables.id}`).then(res => res.json())
  },
  // if u only wanna fetch once
  enabled: (data) => !data,
  suspense: true,
  // u can also pass default options via useDefaultOptions
  useDefaultOptions: () => {
    const { id } = useSomething()
    return {
      variables: { id }
    }
  }
})


const variables = { id: 1 }

// example
export default function Page() {
  // queryKey equals to ['/posts', { id: 1 }]
  const { data } = usePost({ variables, suspense: true })

  return (
    <div>
      <div>{data?.title}</div>
      <div>{data?.content}</div>
    </div>
  )
}

console.log(usePost.getKey()) //  ['/posts']
console.log(usePost.getKey(variables)) //  ['/posts', { id: 1 }]

// nextjs example
export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: usePost.getKey(variables),
    queryFn: usePost.queryFn
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

// usage outside of react component
const data = await queryClient.fetchQuery({
  queryKey: usePost.getKey(variables),
  queryFn: usePost.queryFn
})

// useQueries example
const queries = useQueries({
  queries: [
    { queryKey: usePost.getKey(variables), queryFn: usePost.queryFn },
    { queryKey: useProjects.getKey(), queryFn: useProjects.queryFn },
  ],
})

// setQueryData
queryClient.setQueryData<inferData<typeof usePost>>(usePost.getKey(variables), {...})
```

### Additional API Reference

Options

- `primaryKey: string`
  - Required
  - `primaryKey` will be the first element of the array of `queryKey`
- `enabled: boolean | ((data: TData, variables: TVariables) => boolean)`
  - Optional
  - Set this to `false` to disable this query from automatically running.
  - If set to a function, the function will be executed with the latest data to compute the boolean
- `useDefaultOptions: () => QueryHookOptions`
  - Optional
  - If u wanna inject return values from hooks into query, u can use this option.

Expose Methods

- `getPrimaryKey: () => primaryKey`
- `getKey: (variables: TVariables) => [primaryKey, variables]`
- `queryFn: QueryFunction<TFnData, [primaryKey, TVariables]>`
- `queryKeyHashFn: (queryKey: [primaryKey, TVariables]) => string`

Returns

- `queryKey: [primaryKey, TVariables]`
  - The query key of this custom query.
- `variables: TVariables`
  - The variables of this custom query.
- `setData: (updater: Updater<TData>, options?: SetDataOptions) => TData | undefined`
  - it's args similar with `queryClient.setQueryData` but without `queryKey`

## createInfiniteQuery

### Usage

```tsx
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { createInfiniteQuery } from 'react-query-kit'

type Response = { projects: { id: string; name: string }[]; nextCursor: number }
type Variables = { active: boolean }

const useProjects = createInfiniteQuery<Response, Variables, Error>({
  primaryKey: 'projects',
  queryFn: ({ queryKey: [_primaryKey, variables], pageParam }) => {
    return fetch(
      `/projects?cursor=${pageParam}?active=${variables.active}`
    ).then(res => res.json())
  },
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  defaultPageParam: 1,
})

const variables = { active: true }

// example
export default function Page() {
  // queryKey equals to ['projects', { active: true }]
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useProjects({ variables, suspense: true })

  return (
    <div>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.projects.map(project => (
            <p key={project.id}>{project.name}</p>
          ))}
        </React.Fragment>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load More'
            : 'Nothing more to load'}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </div>
  )
}

// nextjs example
export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: useProjects.getKey(variables),
    queryFn: useProjects.queryFn,
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

// usage outside of react component
const data = await queryClient.fetchInfiniteQuery({
  queryKey: useProjects.getKey(variables),
  queryFn: useProjects.queryFn,
})

// usage outside of react component
const data = await queryClient.fetchInfiniteQuery({
  queryKey: useProjects.getKey(variables),
  queryFn: useProjects.queryFn,
})
```

### Additional API Reference

Options

- `primaryKey: string`
  - Required
  - `primaryKey` will be the first element of the arrary of `queryKey`
- `enabled: boolean | ((data: TData, variables: TVariables) => boolean)`
  - Optional
  - Set this to `false` to disable this query from automatically running.
  - If set to a function, the function will be executed with the latest data to compute the boolean
- `useDefaultOptions: () => InfiniteQueryHookOptions`
  - Optional
  - If u wanna inject return values from hooks into query, u can use this option.

Expose Methods

- `getPrimaryKey: () => primaryKey`
- `getKey: (variables: TVariables) => [primaryKey, variables]`
- `queryFn: QueryFunction<TFnData, [primaryKey, TVariables]>`
- `queryKeyHashFn: (queryKey: [primaryKey, TVariables]) => string`

Returns

- `queryKey: [primaryKey, TVariables]`
  - The query key of this custom query.
- `variables: TVariables`
  - The variables of this custom query.
- `setData: (updater: Updater<InfiniteData<TFnData>>, options?: SetDataOptions) => TData | undefined`
  - it's args similar with `queryClient.setQueryData` but without `queryKey`

## createImmutableQuery

If the resource is immutable, no matter how many times we request it again, it will never change. In this case, we can disable all automatic re-requests for it.
ReactQueryKit provides a helper function `createImmutableQuery` to mark a resource as immutable.

```ts
import { createImmutableQuery } from 'react-query-kit'

createImmutableQuery({
  ...options,
})

// equals to
createQuery({
  ...options,
  refetchInterval: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  staleTime: Infinity,
  gcTime: Infinity,
})
```

## createSuspenseQuery

This has the same effect as setting the `suspense` option to `true` in the query config, but it works better in TypeScript, because `data` is guaranteed to be defined (as errors and loading states are handled by Suspense- and ErrorBoundaries).

```ts
import { createSuspenseQuery } from 'react-query-kit'

createSuspenseQuery({
  ...options,
})

// equals to
createQuery({
  ...options,
  enabled: true,
  suspense: true,
  throwOnError: true,
})
```

## createSuspenseInfiniteQuery

```ts
import { createSuspenseInfiniteQuery } from 'react-query-kit'

createSuspenseInfiniteQuery({
  ...options,
})

// equals to
createInfiniteQuery({
  ...options,
  enabled: true,
  suspense: true,
  throwOnError: true,
})
```

## createMutation

### Usage

```tsx
import { createMutation } from 'react-query-kit'

const useAddTodo = createMutation({
  mutationFn: async (variables: { title: string; content: string }) =>
    fetch('/post', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(variables),
    }).then(res => res.json()),
  onSuccess(data, variables, context) {
    // do somethings
  },
})

function App() {
  const mutation = useAddTodo({
    onSettled: (data, error, variables, context) => {
      // Error or success... doesn't matter!
    },
  })

  return (
    <div>
      {mutation.isPending ? (
        'Adding todo...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ title: 'Do Laundry', content: 'content...' })
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  )
}

// usage outside of react component
useAddTodo.mutationFn({ title: 'Do Laundry', content: 'content...' })
```

### Additional API Reference

Options

- `useDefaultOptions: () => MutationHookOptions`
  - Optional
  - If u wanna inject return values from hooks into mutation, u can use this option.

Returns

- `getKey: () => MutationKey`
- `mutationFn: MutationFunction<TData, TVariables>`

## Type inference

You can extract the TypeScript type of any custom hook with `inferVariables` or `inferData`

```ts
import { inferVariables, inferData, inferFnData } from 'react-query-kit'

type Variables = inferVariables<typeof usePost>
type Data = inferData<typeof usePost>
type FnData = inferFnData<typeof usePost>
```

## Caution

Since the `variables` type of `createQuery` or `createInfiniteQuery` defaults to `any`, the `variables` option of a custom hook can pass any value when you don't set the type of `varibables`, as below

```ts
const usePost = createQuery<Response>({...})
usePost({
  // This will not throw type errors
  variables: {foo: 1}
})
```

For stricter type validation, when you don't want to pass the `variables` option, I suggest you use the `void` type as the `variables` type, as shown below. When you pass value to variables, usePost will throw a TypeError.

```ts
const usePost = createQuery<Response, void>({...})
usePost({
  // This will throw a type error
  variables: {foo: 1}
})
```

## Issues

_Looking to contribute? Look for the [Good First Issue][good-first-issue]
label._

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**][bugs]

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**][requests]

## LICENSE

MIT

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com
[node]: https://nodejs.org
[bugs]: https://github.com/liaoliao666/react-query-kit/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Acreated-desc+label%3Abug
[requests]: https://github.com/liaoliao666/react-query-kit/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3Aenhancement
[good-first-issue]: https://github.com/liaoliao666/react-query-kit/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3Aenhancement+label%3A%22good+first+issue%22
<!-- prettier-ignore-end -->
