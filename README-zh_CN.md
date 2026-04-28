<div align="center">

<br />
<br />

<p align="center">
  <a aria-label="NPM version" href="./assets/logo.svg">
    <img alt="" src="./assets/logo.svg" height="40">
  </a>
</p>

<p>🕊️ 一个用于 ReactQuery 的工具包，它能使 ReactQuery 更易复用和类型安全</p>

<p align="center">
  <a href="https://github.com/liaoliao666/react-query-kit/actions/workflows/tests.yml"><img src="https://github.com/liaoliao666/react-query-kit/actions/workflows/tests.yml/badge.svg?branch=main" alt="Latest build" target="\_parent"></a>
  <a href="https://www.npmjs.com/package/react-query-kit"><img src="https://badgen.net/npm/v/react-query-kit" alt="Latest published version" target="\_parent"></a>
  <a href="https://github.com/liaoliao666/react-query-kit"><img src="https://badgen.net/npm/types/react-query-kit" alt="Types included" target="\_parent"></a>
  <a href="https://www.npmjs.com/package/react-query-kit"><img src="https://badgen.net/npm/license/react-query-kit" alt="License" target="\_parent"></a>
  <a href="https://www.npmjs.com/package/react-query-kit"><img src="https://badgen.net/npm/dt/react-query-kit" alt="Number of downloads" target="\_parent"></a>
  <a href="https://github.com/liaoliao666/react-query-kit"><img src="https://img.shields.io/github/stars/liaoliao666/react-query-kit.svg?style=social&amp;label=Star" alt="GitHub Stars" target="\_parent"></a>
</p>
</div>

---

## Motivation

- 以类型安全的方式管理 `queryKey`
- 让 `queryClient` 的操作更清楚地关联到哪个自定义 hook
- 可以从任何自定义 ReactQuery hook 中提取的 TypeScript 类型
- 中间件

[English](./README.md) | 简体中文

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [安装](#installation)
- [例子](#examples)
- 使用
  - [createQuery](#createquery)
  - [createInfiniteQuery](#createinfinitequery)
  - [createSuspenseQuery](#createsuspensequery)
  - [createSuspenseInfiniteQuery](#createsuspenseinfinitequery)
  - [createMutation](#createmutation)
  - [router](#router)
  - [中间件](#中间件)
  - [TypeScript](#typescript)
  - [类型推导](#类型推导)
  - [禁用查询](#禁用查询)
- [常见问题](#常见问题)
- [迁移](#迁移)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```bash
$ npm i react-query-kit
# or
$ yarn add react-query-kit
```

如果您还在使用 React Query Kit v2？ 请在此处查看 v2 文档：https://github.com/liaoliao666/react-query-kit/tree/v2#readme.

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

type Data = { title: string; content: string }
type Variables = { id: number }

const usePost = createQuery({
  queryKey: ['posts'],
  fetcher: (variables: Variables): Promise<Data> => {
    return fetch(`/posts/${variables.id}`).then(res => res.json())
  },
  // 你还可以通过中间件来定制这个 hook 的行为
  use: [myMiddleware]
})

const variables = { id: 1 }

// example
export default function Page() {
  // queryKey 相等于 ['/posts', { id: 1 }]
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

// nextjs 例子
export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(usePost.getFetchOptions(variables))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

// 在 react 组件外使用
const data = await queryClient.fetchQuery(
  usePost.getFetchOptions(variables)
)

// useQueries 例子
const queries = useQueries({
  queries: [
    usePost.getOptions(variables)，
    useUser.getOptions(),
  ],
})

// getQueryData
queryClient.getQueryData(usePost.getKey(variables)) // Data

// setQueryData
queryClient.setQueryData(usePost.getKey(variables), {...})
```

### 额外的 API 文档

Options

- `fetcher: (variables: TVariables, context: QueryFunctionContext<QueryKey, TPageParam>) => TFnData | Promise<TFnData>`
  - 必填
  - 用于请求数据的函数。 第二个参数是“queryFn”的“QueryFunctionContext”
- `variables?: TVariables`
  - 可选
  - `variables` 将是 fetcher 的第一个参数和 `queryKey` 数组的最后一个元素
- `use: Middleware[]`
  - 可选
  - 中间件函数数组 [(详情)](#中间件)

Expose Methods

- `fetcher: (variables: TVariables, context: QueryFunctionContext<QueryKey, TPageParam>) => TFnData | Promise<TFnData>`
- `getKey: (variables: TVariables) => QueryKey`
- `getOptions: (variables: TVariables) => UseInfiniteQueryOptions`
- `getFetchOptions: (variables: TVariables) => ({ queryKey, queryFn, queryKeyHashFn })`

## createInfiniteQuery

### Usage

```tsx
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { createInfiniteQuery } from 'react-query-kit'

type Data = { projects: { id: string; name: string }[]; nextCursor: number }
type Variables = { active: boolean }

const useProjects = createInfiniteQuery({
  queryKey: ['projects'],
  fetcher: (variables: Variables, { pageParam }): Promise<Data> => {
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

// 在 react 组件外使用
const data = await queryClient.fetchInfiniteQuery(
  useProjects.getFetchOptions(variables)
)
```

### 额外的 API 文档

Options

- `fetcher: (variables: TVariables, context: QueryFunctionContext<QueryKey, TPageParam>) => TFnData | Promise<TFnData>`
  - 必填
  - 查询将用于请求数据的函数。 第二个参数是“queryFn”的“QueryFunctionContext”
- `variables?: TVariables`
  - 可选
  - `variables` 将是 fetcher 的第一个参数和 `queryKey` 数组的最后一个元素
- `use: Middleware[]`
  - 可选
  - 中间件函数数组 [(详情)](#中间件)

Expose Methods

- `fetcher: (variables: TVariables, context: QueryFunctionContext<QueryKey, TPageParam>) => TFnData | Promise<TFnData>`
- `getKey: (variables: TVariables) => QueryKey`
- `getOptions: (variables: TVariables) => UseInfiniteQueryOptions`
- `getFetchOptions: (variables: TVariables) => ({ queryKey, queryFn, queryKeyHashFn, getNextPageParam, getPreviousPageParam, initialPageParam })`

## createSuspenseQuery

这与在查询配置中将 suspense 选项设置为 true 具有相同的效果，但在 TypeScript 的体验更好，因为 data 是有定义的（因为错误和加载状态由 Suspense 和 ErrorBoundaries 处理）。

```ts
import { createSuspenseQuery } from 'react-query-kit'

createSuspenseQuery({
  ...options,
})

// 相当于
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

// 相当于
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

const useAddTodo = createMutation(
  async (variables: { title: string; content: string }) =>
    fetch('/post', {
      method: 'POST',
      body: JSON.stringify(variables),
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

### 额外的 API 文档

Options

- `use: Middleware[]`
  - 可选
  - 中间件函数数组 [(详情)](#中间件)

Expose Methods

- `getKey: () => MutationKey`
- `getOptions: () => UseMutationOptions`
- `mutationFn: ExposeMutationFn<TData, TVariables>`

## router

`router` 允许您创建整个 API 的形状

### Usage

```tsx
import { router } from 'react-query-kit'

const post = router(`post`, {
  byId: router.query({
    fetcher: (variables: { id: number }) =>
      fetch(`/posts/${variables.id}`).then(res => res.json()),
    use: [myMiddleware],
  }),

  list: router.infiniteQuery({
    fetcher: (_variables, { pageParam }) =>
      fetch(`/posts/?cursor=${pageParam}`).then(res => res.json()),
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialPageParam: 0,
  }),

  add: router.mutation({
    mutationFn: async (variables: { title: string; content: string }) =>
      fetch('/posts', {
        method: 'POST',
        body: JSON.stringify(variables),
      }).then(res => res.json()),
  }),

  // nest router
  command: {
    report: router.mutation({ mutationFn }),

    promote: router.mutation({ mutationFn }),
  },
})

// get root key
post.getKey() // ['post']

// hooks
post.byId.useQuery({ variables: { id: 1 } })
post.byId.useSuspenseQuery({ variables: { id: 1 } })
post.list.useInfiniteQuery()
post.list.useSuspenseInfiniteQuery()
post.add.useMutation()
post.command.report.useMutation()

// expose methods
post.byId.getKey({ id: 1 }) // ['post', 'byId', { id: 1 }]
post.byId.getFetchOptions({ id: 1 })
post.byId.getOptions({ id: 1 })
post.byId.fetcher({ id: 1 })
post.add.getKey() // ['post', 'add']
post.add.getOptions()
post.add.mutationFn({ title: 'title', content: 'content' })

// infer types
type Data = inferData<typeof post.list>
type FnData = inferFnData<typeof post.list>
type Variables = inferVariables<typeof post.list>
type Error = inferError<typeof post.list>
```

### 合并路由

```ts
import { router } from 'react-query-kit'

const user = router(`user`, {})
const post = router(`post`, {})

const k = {
  user,
  post,
}
```

### API 文档

`type Router = (key: string | unknown[], config: TConfig) => TRouter`

Expose Methods

- `query`
  与 `createQuery` 类似，但无需选项 `queryKey`
- `infiniteQuery`
  与 `createInfiniteQuery` 类似，但无需选项 `queryKey`
- `mutation`
  与 `createMutation` 类似，但无需选项 `mutationKey`

## 中间件

此功能的灵感来自于 [SWR 的中间件功能](https://swr.vercel.app/docs/middleware)。

中间件接收 hook，可以在运行它之前和之后执行逻辑。如果有多个中间件，则每个中间件包装下一个中间件。列表中的最后一个中间件将接收原始的 hook。

### 使用

```ts
import { QueryClient } from '@tanstack/react-query'
import { Middleware, MutationHook, QueryHook, getKey } from 'react-query-kit'

const logger: Middleware<QueryHook<Data, Variables>> = useQueryNext => {
  return options => {
    const log = useLogger()
    const fetcher = (variables, context) => {
      log(context.queryKey, variables)
      return options.fetcher(variables, context)
    }

    return useQueryNext({
      ...options,
      fetcher,
    })
  }
}

const useUser = createQuery<Data, Variables>({
  use: [logger],
})

// 全局中间件
const queryMiddleware: Middleware<QueryHook> = useQueryNext => {
  return options => {
    // 你还可以通过函数 getKey 获取 queryKey
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

### 扩展

中间件将从上级合并。例如：

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

相当于：

```js
createQuery({ use: [a, b, c] })
```

### 多个中间件

每个中间件包装下一个中间件，最后一个只包装 useQuery hook。例如：

```jsx
createQuery({ use: [a, b, c] })
```

中间件执行的顺序是 `a → b → c`，如下所示：

```plaintext
enter a
  enter b
    enter c
      useQuery()
    exit  c
  exit  b
exit  a
```

### 多个 QueryClient

在 ReactQuery v5 中，`QueryClient` 将是 `useQuery` 和 `useMutation` 的第二个参数。 如果你在全局中有多个 `QueryClient`，你应该在中间件钩子中接收 `QueryClient`

```ts
const useSomething = createQuery({
  use: [
    function myMiddleware(useQueryNext) {
      // 你应该接收 queryClient 作为第二个参数
      return (options, queryClient) => {
        const client = useQueryClient(queryClient)
        // ...
        return useQueryNext(options, queryClient)
      }
    },
  ],
})

// 如果你传入另一个 QueryClient
useSomething({...}, anotherQueryClient)
```

## TypeScript

默认情况下，ReactQueryKit 还会从 `fetcher` 推断 `data` 和 `variables` 的类型，因此您可以自动获得首选类型。

```ts
type Data = { title: string; content: string }
type Variables = { id: number }

const usePost = createQuery({
  queryKey: ['posts'],
  fetcher: (variables: Variables): Promise<Data> => {
    return fetch(`/posts/${variables}`).then(res => res.json())
  },
})

// `data` 将被推断为 `Data | undefined`.
// `variables` 将被推断为 `Variables`.
const { data } = usePost({ variables: { id: 1 } })
```

您还可以显式指定 `fetcher` 参数和返回的类型。

```ts
type Data = { title: string; content: string }
type Variables = { id: number }

const usePost = createQuery<Data, Variables, Error>({
  queryKey: ['posts'],
  fetcher: variables => {
    return fetch(`/posts/${variables}`).then(res => res.json())
  },
})

// `data` 将被推断为 `Data | undefined`.
// `error` 将被推断为 `Error | null`
// `variables` 将被推断为 `Variables`.
const { data, error } = usePost({ variables: { id: 1 } })
```

## 类型推导

您可以使用 `inferData` 或 `inferVariables` 提取任何自定义 hook 的 TypeScript 类型

```ts
import { inferData, inferFnData, inferError, inferVariables, inferOptions } from 'react-query-kit'

const useProjects = createInfiniteQuery<Data, Variables>(...)

inferData<typeof useProjects> // InfiniteData<Data>
inferFnData<typeof useProjects> // Data
inferVariables<typeof useProjects> // Variables
inferError<typeof useProjects> // Error
inferOptions<typeof useProjects> // InfiniteQueryHookOptions<...>
```

## 禁用查询

要禁用查询，您可以将 `skipToken` 作为选项 `variables` 传递给您的自定义查询。这将阻止查询被执行。

```ts
import { skipToken } from '@tanstack/react-query'

const [name, setName] = useState<string | undefined>()
const result = usePost({
  variables: id ? { id: id } : skipToken,
})

// 以及用于 useQueries 的示例
const queries = useQueries({
  queries: [usePost.getOptions(id ? { id: id } : skipToken)],
})
```

## 常见问题

### `getFetchOptions` 和 `getOptions` 有什么不同

`getFetchOptions` 只会返回必要的选项，而像 `staleTime` 和 `retry` 等选项会被忽略

### `fetcher` 和 `queryFn` 有什么不同

ReactQueryKit 会自动将 `fetcher` 转换为 `queryFn`，例如

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

## 迁移

从 ReactQueryKit 2 升级 → ReactQueryKit 3

```diff
createQuery({
-  primaryKey: 'posts',
-  queryFn: ({ queryKey: [_primaryKey, variables] }) => {},
+  queryKey: ['posts'],
+  fetcher: variables => {},
})
```

您可以从 ReactQueryKit 3 中受益

- 支持传入数组 `queryKey`
- 支持推断 fetcher 的类型，您可以自动享受首选的类型。
- 支持创建整个 API 的形状

## Issues

_Looking to contribute? Look for the [Good First Issue][good-first-issue]
label._

### 🐛 Bugs

请针对错误、缺少文档或意外行为提出问题。

[**See Bugs**][bugs]

### 💡 Feature Requests

请提交问题以建议新功能。 通过添加对功能请求进行投票
一个 👍。 这有助于维护人员优先处理要处理的内容。

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
