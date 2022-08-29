<div align="center">
<h1>react-query-kit</h1>

<p>Simple reusable and mini(&#60;1kb) React Query utils</p>
</div>

---

## The problem

- ReactQuery that needs you manual manage your queryKey
- ReactQuery doesn't have an elegant way to set defaultOptions for per custom useQuery hook
- ReactQuery doesn't have a type-safe way to get the queryKey

## This solution

A simplest way to create your custom useQuery hooks without considering the consistence of the queryKey and provide default options to per hooks you create

![react-query-kit.gif](https://files.catbox.moe/dkwp3p.gif)

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
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

```
npm install --save react-query-kit @tanstack/react-query
```

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
})

// or using the alternative syntax to create
const usePost = createQuery('/posts', ({ queryKey: [primaryKey, variables] }) => {
  // primaryKey equals to '/posts'
  return fetch(`${primaryKey}/${variables.id}`).then(res => res.json())
})


const variables = { id: 1 }

// example
export default function Page() {
  // queryKey equals to `['/posts', { id: 1 }]`
  const { data } = usePost({ variables, suspense: true })

  return (
    <div>
      <div>{data?.title}</div>
      <div>{data?.content}</div>
    </div>
  )
}

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

// set data to all queries of `post`
queryClient.setQueriesData([usePost.getKey()], {...})
// or set data to some speicial queries of `post`
queryClient.setQueriesData(usePost.getKey(variables), {...})

// invalidate all queries of `post`
queryClient.invalidateQueries(usePost.getKey())
// or invalidate some speicial queries of `post`
queryClient.invalidateQueries(usePost.getKey(variables))
```

### Additional API Reference

Options
- `primaryKey: string`
    - Required
    - `primaryKey` will be the first element of the array of `queryKey`

Returns
- `getPrimaryKey: () => primaryKey`
- `getKey: (variables: TVariables) => [primaryKey, variables]`
- `queryFn: QueryFunction<TFnData, [primaryKey, TVariables]>`

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
  // queryKey equals to `['projects', { active: true }]`
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useProjects({ suspense: true, variables })

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

// setQueryData
queryClient.setQueryData(useProjects.getKey(variables), {...})

// set data of all queries of `projects`
queryClient.setQueriesData(usePost.getKey({...}), {...})

// invalidate all queries of `projects`
queryClient.invalidateQueries(usePost.getKey({...}))
```

### Additional API Reference

Options
- `primaryKey: string`
    - Required
    - `primaryKey` will be the first element of the arrary of `queryKey`

Returns
- `getPrimaryKey: () => primaryKey`
- `getKey: (variables: TVariables) => [primaryKey, variables]`
- `queryFn: QueryFunction<TFnData, [primaryKey, TVariables]>`

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