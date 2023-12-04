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

- Manage `queryKey` in a type-safe way
- Make `queryClient`'s operations clearly associated with custom ReactQuery hooks
- You can extract the TypeScript type of any custom ReactQuery hooks
- Middleware

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
  - [router](#router)
  - [Middleware](#middleware)
  - [Type inference](#type-inference)
- [FAQ](#faq)
- [Migration](#migration)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```bash
$ npm i react-query-kit@beta
# or
$ yarn add react-query-kit@beta
```

If you still on React Query Kit v2? Check out the v2 docs here: https://github.com/liaoliao666/react-query-kit/tree/v2#readme.

# Examples

- [Basic](https://codesandbox.io/s/example-react-query-kit-basic-1ny2j8)
- [Optimistic Updates](https://codesandbox.io/s/example-react-query-kit-optimistic-updates-eefg0v)
- [Next.js](https://codesandbox.io/s/example-react-query-kit-nextjs-uldl88)
- [Load-More & Infinite Scroll](https://codesandbox.io/s/example-react-query-kit-load-more-infinite-scroll-vg494v)

## createQuery

### Usage

```tsx
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { createQuery } from 'react-query-kit'

type Response = { title: string; content: string }
type Variables = { id: number }

const usePost = createQuery({
  queryKey: ['posts'],
  fetcher: (variables: Variables): Promise<Response> => {
    return fetch(`/posts/${variables.id}`).then(res => res.json())
  },
  // u can also pass middleware to cutomize this hook's behavior
  use: [myMiddleware]
})


const variables = { id: 1 }

// example
export default function Page() {
  // queryKey will be `['posts', { id: 1 }]` if u passed variables
  const { data } = usePost({ variables })

  return (
    <div>
      <div>{data?.title}</div>
      <div>{data?.content}</div>
    </div>
  )
}

console.log(usePost.getKey()) //  ['posts']
console.log(usePost.getKey(variables)) //  ['posts', { id: 1 }]

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
   usePost.getOptions(variables),
   useUser.getOptions(),
  ],
})

// getQueryData
queryClient.getQueryData(usePost.getKey(variables)) // Response

// setQueryData
queryClient.setQueryData(usePost.getKey(variables), {...})
```

### Additional API Reference

Options

- `fetcher: (variables: TVariables, context: QueryFunctionContext<QueryKey, TPageParam>) => TFnData | Promise<TFnData>`
  - Required
  - The function that the query will use to request data. And The second param is the `QueryFunctionContext` of `queryFn`.
- `variables?: TVariables`
  - Optional
  - `variables` will be the frist param of fetcher and the last element of the `queryKey` array
- `use: Middleware[]`
  - Optional
  - array of middleware functions [(details)](#middleware)

Expose Methods

- `fetcher: (variables: TVariables, context: QueryFunctionContext<QueryKey, TPageParam>) => TFnData | Promise<TFnData>`
- `getKey: (variables: TVariables) => QueryKey`
- `getOptions: (variables: TVariables) => UseQueryOptions`
- `getFetchOptions: (variables: TVariables) => ({ queryKey, queryFn, queryKeyHashFn })`

## createInfiniteQuery

### Usage

```tsx
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { createInfiniteQuery } from 'react-query-kit'

type Response = { projects: { id: string; name: string }[]; nextCursor: number }
type Variables = { active: boolean }

const useProjects = createInfiniteQuery({
  queryKey: ['projects'],
  fetcher: (variables: Variables, { pageParam }): Promise<Response> => {
    return fetch(
      `/projects?cursor=${pageParam}?active=${variables.active}`
    ).then(res => res.json())
  },
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  initialPageParam: 0,
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

- `fetcher: (variables: TVariables, context: QueryFunctionContext<QueryKey, TPageParam>) => TFnData | Promise<TFnData>`
  - Required
  - The function that the query will use to request data. And The second param is the `QueryFunctionContext` of `queryFn`.
- `variables?: TVariables`
  - Optional
  - `variables` will be the frist param of fetcher and the last element of the `queryKey` array
- `use: Middleware[]`
  - Optional
  - array of middleware functions [(details)](#middleware)

Expose Methods

- `fetcher: (variables: TVariables, context: QueryFunctionContext<QueryKey, TPageParam>) => TFnData | Promise<TFnData>`
- `getKey: (variables: TVariables) => QueryKey`
- `getOptions: (variables: TVariables) => UseInfiniteQueryOptions`
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
- `getOptions: () => UseMutationOptions`
- `mutationFn: MutationFunction<TData, TVariables>`

## router

`router` which allow you to create a shape of your entire API

### Usage

```tsx
import { router } from 'react-query-kit'

const posts = router(`posts`, {
  byId: router.query({
    fetcher: (variables: { id: number }) => {
      return fetch(`/posts/${variables.id}`).then(res => res.json())
    },
    use: [myMiddleware],
  }),

  list: router.infiniteQuery({
    fetcher: (
      variables: { active: boolean },
      { pageParam }
    ): Promise<{
      projects: { id: string; name: string }[]
      nextCursor: number
    }> => {
      return fetch(
        `/posts/?cursor=${pageParam}?active=${variables.active}`
      ).then(res => res.json())
    },
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: 0,
  }),

  add: router.mutation({
    mutationFn: async (variables: { title: string; content: string }) =>
      fetch('/posts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variables),
      }).then(res => res.json()),
  }),
})

// get root key
posts.getKey() // ['posts']

// hooks
posts.byId.useQuery({ variables: { id: 1 } })
posts.byId.useSuspenseQuery({ variables: { id: 1 } })
posts.list.useInfiniteQuery({ variables: { active: true } })
posts.list.useSuspenseInfiniteQuery({ variables: { active: true } })
posts.add.useMutation()

// expose methods
posts.byId.getKey({ id: 1 }) // ['posts', 'byId', { id: 1 }]
posts.byId.getFetchOptions({ id: 1 })
posts.byId.getOptions({ id: 1 })
posts.byId.fetcher({ id: 1 })
posts.add.getKey() // ['posts', 'add']
posts.add.getOptions()
posts.add.mutationFn({ title: 'title', content: 'content' })
```

## API Reference

`type Router = (key: string, config: TConfig) => TRouter`

Expose Methods

- `query`
  Similar to `createQuery` but without option `queryKey`
- `infiniteQuery`
  Similar to `createInfiniteQuery` but without option `queryKey`
- `mutation`
  Similar to `createMutation` but without option `mutationKey`

## Middleware

This feature is inspired by the [Middleware feature from SWR](https://swr.vercel.app/docs/middleware). The middleware feature is a new addition in ReactQueryKit 1.5.0 that enables you to execute logic before and after hooks.

Middleware receive the hook and can execute logic before and after running it. If there are multiple middleware, each middleware wraps the next middleware. The last middleware in the list will receive the original hook.

### Usage

```ts
import { QueryClient } from '@tanstack/react-query'
import { Middleware, MutationHook, QueryHook, getKey } from 'react-query-kit'

const logger: Middleware<QueryHook<Response, Variables>> = useQueryNext => {
  return options => {
    const logger = useLogger()
    const fetcher = (variables, context) => {
      logger.log(context.queryKey, variables)
      return options.fetcher(variables, context)
    }

    return useQueryNext({
      ...options,
      fetcher,
    })
  }
}

const useUser = createQuery<Response, Variables>({
  // ...
  use: [logger],
})

// global middlewares
const queryMiddleware: Middleware<QueryHook> = useQueryNext => {
  return options => {
    // u can also get queryKey via function getKey
    const fullKey = getKey(options.queryKey, options.variables)
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

## FAQ

### What is the difference between `getFetchOptions` and `getOptions`?

`getFetchOptions` will only return necessary options, while options like `staleTime` and `retry` will be omited

```ts
const useTest1 = createQuery({
  staleTime: Infinity,
})

// Only triggers on the first request
queryClient.prefetchQuery(useTest1.getOptions())
// Will always trigger a request
queryClient.prefetchQuery(useTest1.getFetchOptions())

const useTest2 = createQuery({
  retry: 3,
})

// Automatically retries 3 times
queryClient.prefetchQuery(useTest2.getOptions())
// Does not automatically retry
queryClient.prefetchQuery(useTest2.getFetchOptions())
```

### What is the difference between `fetcher` and `queryFn`?

ReactQueryKit automatically converts fetcher to queryFn, as shown below:

```ts
const useTest = createQuery({
  queryKey: ['test'],
  fetcher: (variables, context) => {
    // ...
  },
})

// => useTest.getOptions(variables):
// {
//   queryKey: ['test', variables],
//   queryFn: (context) => fetcher(variables, context)
// }
```

## Migration

Upgrading from ReactQueryKit 2 → ReactQueryKit 3

```diff
createQuery({
-  primaryKey: 'posts',
-  queryFn: ({ queryKey: [_primaryKey, variables] }) => {},
+  queryKey: ['posts'],
+  fetcher: variables => {},
})
```

What you benefit from ReactQueryKit 3

- Support hierarchical key
- Support infer the types of fetcher, you can enjoy the preferred types automatically.

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
