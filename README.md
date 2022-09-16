<div align="center">
<h1>react-query-kit</h1>

<p>🕊️ A toolkit for ReactQuery that make ReactQuery reusable and typesafe</p>

<p align="center">
  <a href="https://github.com/liaoliao666/react-query-kit/actions/workflows/tests.yml"><img src="https://github.com/liaoliao666/react-query-kit/actions/workflows/tests.yml/badge.svg?branch=main" alt="Latest build" target="\_parent"></a>
  <a href="https://www.npmjs.com/package/react-query-kit"><img src="https://badgen.net/npm/v/react-query-kit" alt="Latest published version" target="\_parent"></a>
  <a href="https://bundlephobia.com/package/react-query-kit@latest"><img src="https://badgen.net/bundlephobia/minzip/react-query-kit" alt="Bundlephobia" target="\_parent"></a>
  <a href="https://bundlephobia.com/package/react-query-kit@latest"><img src="https://badgen.net/bundlephobia/dependency-count/react-query-kit" alt="Dependency count 0" target="\_parent"></a>
  <a href="https://github.com/liaoliao666/react-query-kit"><img src="https://badgen.net/npm/types/react-query-kit" alt="Types included" target="\_parent"></a>
  <a href="https://www.npmjs.com/package/react-query-kit"><img src="https://badgen.net/npm/license/react-query-kit" alt="License" target="\_parent"></a>
  <a href="https://www.npmjs.com/package/react-query-kit"><img src="https://badgen.net/npm/dt/react-query-kit" alt="Number of downloads" target="\_parent"></a>
  <a href="https://github.com/liaoliao666/react-query-kit"><img src="https://img.shields.io/github/stars/liaoliao666/react-query-kit.svg?style=social&amp;label=Star" alt="GitHub Stars" target="\_parent"></a>
</p>
</div>

---

## Motivation

People will face with these pain points when writing ReactQuery hooks.
- Share a custom hook between multiple components
- How to pass variables to custom ReactQuery hook in a type-safe way
- How to get `queryKey` in a type-safe way
- How to combining `queryKey` with `queryClient` in a type-safe way
- Set `defaultOptions` for custom ReactQuery hooks easier and clearer

![react-query-kit.gif](https://files.catbox.moe/9na7tp.gif)

English | [简体中文](./README-zh_CN.md)

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Examples](#examples)
- Usage
  - [createQuery](#createQuery)
  - [createInfiniteQuery](#createInfiniteQuery)
  - [createMutation](#createMutation)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```bash
$ npm i @tanstack/react-query-kit @tanstack/react-query
# or
$ yarn add @tanstack/react-query-kit @tanstack/react-query
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
import { createQuery } from 'react-query-kit'

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
  suspense: true
})

// or using the alternative syntax to create
// const usePost = createQuery<Response, Variables, Error>(
//   '/posts',
//   ({ queryKey: [primaryKey, variables] }) => {
//     // primaryKey equals to '/posts'
//     return fetch(`${primaryKey}/${variables.id}`).then(res => res.json())
//   },
//   {
//     // if u only wanna fetch once
//     enabled: (data) => !data,
//     suspense: true
//   }
// )


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

  await queryClient.prefetchQuery(usePost.getKey(variables), usePost.queryFn)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

// usage outside of react component
const data = await queryClient.fetchQuery(
  usePost.getKey(variables),
  usePost.queryFn
)

// useQueries example
const queries = useQueries({
  queries: [
    { queryKey: usePost.getKey(variables), queryFn: usePost.queryFn },
    { queryKey: useProjects.getKey(), queryFn: useProjects.queryFn },
  ],
})

// setQueryData
queryClient.setQueryData(usePost.getKey(variables), {...})
```

### Additional API Reference

Options
- `primaryKey: string`
    - Required
    - `primaryKey` will be the first element of the array of `queryKey`
- `enabled: boolean | ((data: TData) => boolean)`
  - Optional
  - Set this to `false` to disable this query from automatically running.
  - If set to a function, the function will be executed with the latest data to compute the boolean

Expose Methods
- `getPrimaryKey: () => primaryKey`
- `getKey: (variables: TVariables) => [primaryKey, variables]`
- `queryFn: QueryFunction<TFnData, [primaryKey, TVariables]>`

Returns
- `setData: (updater: Updater<TData>, options?: SetDataOptions) => TData | undefined`
    - it's args similar with `queryClient.setQueryData` but without `queryKey`

## createInfiniteQuery

### Usage

```tsx
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { createInfiniteQuery } from 'react-query-kit'

type Data = { projects: { id: string; name: string }[]; nextCursor: number }
type Variables = { active: boolean }

const useProjects = createInfiniteQuery<Data, Variables, Error>({
  primaryKey: 'projects',
  queryFn: ({ queryKey: [_primaryKey, variables], pageParam = 1 }) => {
    return fetch(`/projects?cursor=${pageParam}?active=${variables.active}`).then(res => res.json())
  },
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
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

  await queryClient.prefetchInfiniteQuery(
    useProjects.getKey(variables),
    useProjects.queryFn
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

// usage outside of react component
const data = await queryClient.fetchInfiniteQuery(
  useProjects.getKey(variables),
  useProjects.queryFn
)
```

### Additional API Reference

Options
- `primaryKey: string`
    - Required
    - `primaryKey` will be the first element of the arrary of `queryKey`
- `enabled: boolean | ((data: TData) => boolean)`
  - Optional
  - Set this to `false` to disable this query from automatically running.
  - If set to a function, the function will be executed with the latest data to compute the boolean

Expose Methods
- `getPrimaryKey: () => primaryKey`
- `getKey: (variables: TVariables) => [primaryKey, variables]`
- `queryFn: QueryFunction<TFnData, [primaryKey, TVariables]>`

Returns
- `setData: (updater: Updater<InfiniteData<TFnData>>, options?: SetDataOptions) => TData | undefined`
    - it's args similar with `queryClient.setQueryData` but without `queryKey`

## createMutation

### Usage

```tsx
import { createMutation } from 'react-query-kit'

const useAddTodo = createMutation(
  async (data: { title: string; content: string }) =>
    fetch('/post', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(res => res.json()),
  {
    onSuccess(data, variables, context) {
      // do somethings
    },
  }
)

function App() {
  const mutation = useAddTodo({  
    onSettled: (data, error, variables, context) => {
        // Error or success... doesn't matter!
    }
  })

  return (
    <div>
      {mutation.isLoading ? (
        'Adding todo...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({  title: 'Do Laundry', content: "content..." })
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
useAddTodo.mutationFn({  title: 'Do Laundry', content: "content..." })
```

### Additional API Reference

Returns
- `getKey: () => MutationKey`
- `mutationFn: MutationFunction<TData, TVariables>`

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