<div align="center">

<br />
<br />

<p align="center">
  <a aria-label="NPM version" href="./assets/logo.svg">
    <img alt="" src="./assets/logo.svg" height="40">
  </a>
</p>

<p>🕊️ A toolkit for ReactQuery that make ReactQuery reusable and typesafe</p>

<p align="center">
  <a href="https://github.com/liaoliao666/react-query-kit/actions/workflows/tests.yml"><img src="https://github.com/liaoliao666/react-query-kit/actions/workflows/tests.yml/badge.svg?branch=main" alt="Latest build" target="\_parent"></a>
  <a href="https://www.npmjs.com/package/react-query-kit"><img src="https://badgen.net/npm/v/react-query-kit" alt="Latest published version" target="\_parent"></a>
  <a href="https://unpkg.com/browse/react-query-kit@latest/build/zip/zip.esm.js" rel="nofollow"><img src="https://img.badgesize.io/https:/unpkg.com/react-query-kit@latest/build/zip/zip.esm.js?label=gzip%20size&compression=gzip" alt="gzip size"></a>
  <a href="https://github.com/liaoliao666/react-query-kit"><img src="https://badgen.net/npm/types/react-query-kit" alt="Types included" target="\_parent"></a>
  <a href="https://github.com/liaoliao666/react-query-kit/blob/main/LICENSE"><img src="https://badgen.net/npm/license/react-query-kit" alt="License" target="\_parent"></a>
  <a href="https://www.npmjs.com/package/react-query-kit"><img src="https://badgen.net/npm/dt/react-query-kit" alt="Number of downloads" target="\_parent"></a>
  <a href="https://github.com/liaoliao666/react-query-kit"><img src="https://img.shields.io/github/stars/liaoliao666/react-query-kit.svg?style=social&amp;label=Star" alt="GitHub Stars" target="\_parent"></a>
</p>
</div>

---

## What could you benefit from it

- Make `queryKey` strongly related with `queryFn`
- Manage `queryKey` in a type-safe way
- Make `queryClient`'s operations clearly associated with custom ReactQuery hooks
- Set defaultOptions for custom ReactQuery hooks easier and clearer
- Middleware

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
  - [createSuspenseQuery](#createsuspensequery)
  - [createSuspenseInfiniteQuery](#createsuspenseinfinitequery)
  - [createMutation](#createmutation)
  - [Middleware](#middleware)
  - [Type inference](#type-inference)
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
  // u can also pass middleware to cutomize this hook's behavior
  use: [myMiddleware]
})


const variables = { id: 1 }

// example
export default function Page() {
  // queryKey equals to ['/posts', { id: 1 }]
  const { data } = usePost({ variables })

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

  await queryClient.prefetchQuery(usePost.getFetchOptions(variables))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

// usage outside of react component
const data = await queryClient.fetchQuery(usePost.getFetchOptions(variables))

// useQueries example
const queries = useQueries({
  queries: [
   usePost.getFetchOptions(variables),
   useUser.getFetchOptions(),
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
- `use: Middleware[]`
  - Optional
  - array of middleware functions [(details)](#middleware)

Expose Methods

- `getPrimaryKey: () => primaryKey`
- `getKey: (variables: TVariables) => [primaryKey, variables]`
- `queryFn: QueryFunction<TFnData, [primaryKey, TVariables]>`
- `queryKeyHashFn: (queryKey: [primaryKey, TVariables]) => string`
- `getFetchOptions: (variables: TVariables) => ({ queryKey, queryFn, queryKeyHashFn })`

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
  initialPageParam: 1,
})

const variables = { active: true }

// example
export default function Page() {
  // queryKey equals to ['projects', { active: true }]
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useProjects({ variables })

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

  await queryClient.prefetchInfiniteQuery(
    useProjects.getFetchOptions(variables)
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

// usage outside of react component
const data = await queryClient.fetchInfiniteQuery(
  useProjects.getFetchOptions(variables)
)
```

### Additional API Reference

Options

- `primaryKey: string`
  - Required
  - `primaryKey` will be the first element of the arrary of `queryKey`
- `use: Middleware[]`
  - Optional
  - array of middleware functions [(details)](#middleware)

Expose Methods

- `getPrimaryKey: () => primaryKey`
- `getKey: (variables: TVariables) => [primaryKey, variables]`
- `queryFn: QueryFunction<TFnData, [primaryKey, TVariables]>`
- `queryKeyHashFn: (queryKey: [primaryKey, TVariables]) => string`
- `getFetchOptions: (variables: TVariables) => ({ queryKey, queryFn, queryKeyHashFn, getNextPageParam, getPreviousPageParam, initialPageParam })`

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

- `use: Middleware[]`
  - Optional
  - array of middleware functions [(details)](#middleware)

Returns

- `getKey: () => MutationKey`
- `mutationFn: MutationFunction<TData, TVariables>`

## Middleware

This feature is inspired by the [Middleware feature from SWR](https://swr.vercel.app/docs/middleware). The middleware feature is a new addition in ReactQueryKit 1.5.0 that enables you to execute logic before and after hooks.

Middleware receive the hook and can execute logic before and after running it. If there are multiple middleware, each middleware wraps the next middleware. The last middleware in the list will receive the original hook.

### Usage

```ts
import { QueryClient } from '@tanstack/react-query'
import { Middleware, MutationHook, QueryHook, getKey } from 'react-query-kit'

const myMiddleware: Middleware<
  QueryHook<Response, Variables>
> = useQueryNext => {
  return options => {
    const { userId } = useAuth()
    const client = useQueryClient()
    const variables = options.variables ?? { id: userId }
    const hasData = () => !!client.getQueryData(useUser.getKey(variables))

    return useQueryNext({
      ...options,
      variables,
      enabled: options.enabled ?? !hasData(),
    })
  }
}

const useUser = createQuery<Response, Variables>({
  // ...
  use: [
    myMiddleware,
    // or just defined inside of `use`
    function myMiddleware2(useQueryNext) {
      return options => {
        // ...
        return useQueryNext(options)
      }
    },
  ],
})

// global middlewares
const queryMiddleware: Middleware<QueryHook> = useQueryNext => {
  return options => {
    // u can also get queryKey via function getKey
    const queryKey = getKey(options.primaryKey, options.variables)
    // ...
    return useQueryNext(options)
  }
}
const mutationMiddleware: Middleware<MutationHook> = useMutationNext => {
  return options => {
    // ...
    return useMutationNext(options)
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      use: [queryMiddleware],
    },
    mutations: {
      use: [mutationMiddleware],
    },
  },
})
```

### Extend

Middleware will be merged from superior. For example:

```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      use: [a],
    },
  },
})

const useSomething = createQuery({
  use: [b],
})

useSomething({ use: [c] })
```

is equivalent to:

```js
createQuery({ use: [a, b, c] })
```

### Multiple Middleware

Each middleware wraps the next middleware, and the last one just wraps the useQuery. For example:

```jsx
createQuery({ use: [a, b, c] })
```

The order of middleware executions will be a → b → c, as shown below:

```plaintext
enter a
  enter b
    enter c
      useQuery()
    exit  c
  exit  b
exit  a
```

### Multiple QueryClient

In ReactQuery v5, the `QueryClient` will be the second argument to `useQuery` and `useMutation`. If u have multiple `QueryClient` in global, u should receive `QueryClient` in middleware hook.

```ts
const useSomething = createQuery({
  use: [
    function myMiddleware(useQueryNext) {
      // u should receive queryClient as the second argument here
      return (options, queryClient) => {
        const client = useQueryClient(queryClient)
        // ...
        return useQueryNext(options, queryClient)
      }
    },
  ],
})

// if u need to pass an another QueryClient
useSomething({...}, anotherQueryClient)
```

## Type inference

You can extract the TypeScript type of any custom hook with `inferData` or `inferVariables`

```ts
import { inferData, inferFnData, inferError, inferVariables, inferOptions } from 'react-query-kit'

const useProjects = createInfiniteQuery<Response, Variables, Error>(...)

inferData<typeof useProjects> // InfiniteData<Response>
inferFnData<typeof useProjects> // Response
inferVariables<typeof useProjects> // Variables
inferError<typeof useProjects> // Error
inferOptions<typeof useProjects> // InfiniteQueryHookOptions<...>
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
