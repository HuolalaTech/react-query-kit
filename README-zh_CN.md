<div align="center">

<br />
<br />

<p align="center">
  <a aria-label="NPM version" href="https://quaere-site.vercel.app">
    <img alt="" src="./assets/logo.svg" height="40">
  </a>
</p>

<p>🕊️ 一个用于 ReactQuery 的工具包，它能使 ReactQuery 更易复用和类型安全</p>

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

## Motivation

- 使 `queryKey` 与 `queryFn` 强相关
- 以类型安全的方式管理 `queryKey`
- 快速生成自定义 ReactQuery 钩子
- 让 `queryClient` 的操作更清楚地关联到哪个自定义 ReactQuery 钩子
- 为自定义 ReactQuery 钩子设置默认选项更容易和更清晰

![react-query-kit.gif](https://files.catbox.moe/cw5hex.gif)

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
  - [中间件](#中间件)
  - [类型推导](#类型推导)
- [问题](#issues)
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
    // primaryKey 相等于 '/posts'
    return fetch(`${primaryKey}/${variables.id}`).then(res => res.json())
  },
  // 如果你只想在有id时且没有数据时请求，可以这么设置
  enabled: (data, variables) => !data && variables.id,
  suspense: true,
  // 你还可以通过中间件来定制这个 hook 的行为
  use: [myMiddleware]
})

const variables = { id: 1 }

// example
export default function Page() {
  // queryKey 相等于 ['/posts', { id: 1 }]
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
    usePost.getFetchOptions(variables)，
    useUser.getFetchOptions(),
  ],
})

// setQueryData
queryClient.setQueryData(usePost.getKey(variables), {...})
```

### 额外的 API 文档

Options

- `primaryKey: string`
  - 必填
  - `primaryKey` 将是 `queryKey` 数组的第一个元素
- `enabled: boolean | ((data: TData, variables: TVariables) => boolean)`
  - 可选
  - 将此设置为 `false` 以禁用此查询自动运行。
  - 如果设置为函数，该函数将使用最新数据执行以计算布尔值
- `use: Middleware[]`
  - 可选
  - 中间件函数数组 [(详情)](#中间件)

Expose Methods

- `getPrimaryKey: () => primaryKey`
- `getKey: (variables: TVariables) => [primaryKey, variables]`
- `getFetchOptions: (variables: TVariables) => {queryKey, queryFn, queryKeyHashFn}`
- `queryFn: QueryFunction<TFnData, [primaryKey, TVariables]>`
- `queryKeyHashFn: (queryKey: [primaryKey, TVariables]) => string`

Returns

- `queryKey: [primaryKey, TVariables]`
  - 自定义 hook 的 queryKey.
- `variables: TVariables`
  - 自定义 hook 的 variables.
- `setData: (updater: Updater<TData>, options?: SetDataOptions) => TData | undefined`
  - 它的参数与 `queryClient.setQueryData` 类似，但不需要传入 `queryKey`

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

- `primaryKey: string`
  - 必填
  - `primaryKey` 将是 `queryKey` 数组的第一个元素
- `enabled: boolean | ((data: TData, variables: TVariables) => boolean)`
  - 可选
  - 将此设置为 `false` 以禁用此查询自动运行。
  - 如果设置为函数，该函数将使用最新数据执行以计算布尔值
- `use: Middleware[]`
  - 可选
  - 中间件函数数组 [(详情)](#中间件)

Expose Methods

- `getPrimaryKey: () => primaryKey`
- `getKey: (variables: TVariables) => [primaryKey, variables]`
- `getFetchOptions: (variables: TVariables) => {queryKey, queryFn, queryKeyHashFn}`
- `queryFn: QueryFunction<TFnData, [primaryKey, TVariables]>`
- `queryKeyHashFn: (queryKey: [primaryKey, TVariables]) => string`

Returns

- `queryKey: [primaryKey, TVariables]`
  - 自定义 hook 的 queryKey.
- `variables: TVariables`
  - 自定义 hook 的 variables.
- `setData: (updater: Updater<TData>, options?: SetDataOptions) => TData | undefined`
  - 它的参数与 `queryClient.setQueryData` 类似，但不需要传入 `queryKey`

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
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
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

Returns

- `getKey: () => MutationKey`
- `mutationFn: MutationFunction<TData, TVariables>`

## 中间件

此功能的灵感来自于 [SWR 的中间件功能](https://swr.vercel.app/docs/middleware)。

中间件接收 hook，可以在运行它之前和之后执行逻辑。如果有多个中间件，则每个中间件包装下一个中间件。列表中的最后一个中间件将接收原始的 hook。

### 使用

```ts
import { Middleware, MutationHook, QueryHook } from 'react-query-kit'

const myMiddleware: Middleware<
  QueryHook<Response, Variables>
> = useQueryNext => {
  return options => {
    const { userId } = useAuth()
    return useQueryNext({
      ...options,
      variables: options.variables ?? { id: userId },
    })
  }
}

const useUser = createQuery<Response, Variables>({
  // ...
  use: [myMiddleware],
})

// 全局中间件
const queryMiddleware = Middleware<QueryHook>
const mutationMiddleware = Middleware<MutationHook>

const queryClient = createQueryClient({
  queries: {
    use: [queryMiddleware],
  },
  mutations: {
    use: [mutationMiddleware],
  },
})
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

## 类型推导

您可以使用 `inferVariables` 或 `inferData` 提取任何自定义 hook 的 TypeScript 类型

```ts
import { inferData, inferFnData, inferVariables } from 'react-query-kit'

const useProjects = createInfiniteQuery<Response, Variables>(...)

inferVariables<typeof usePost> // Variables
inferData<typeof usePost> // InfiniteData<Response>
inferFnData<typeof usePost> // Response
```

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
