<div align="center">
<h1>react-query-kit</h1>

<p>🕊️ 一个用于 ReactQuery 的工具包，它能使 ReactQuery 更易复用和类型安全</p>

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

- 使 `queryKey` 与 `queryFn` 强相关
- 以类型安全的方式管理 `queryKey`
- 快速生成自定义 ReactQuery 钩子
- 让 `queryClient` 的操作更清楚地关联到哪个自定义 ReactQuery 钩子
- 为自定义 ReactQuery 钩子设置默认选项更容易和更清晰

![react-query-kit.gif](https://files.catbox.moe/9na7tp.gif)

[English](./README.md) | 简体中文

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [安装](#installation)
- [例子](#examples)
- 使用
  - [createQuery](#createQuery)
  - [createInfiniteQuery](#createInfiniteQuery)
  - [createMutation](#createMutation)
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
  suspense: true
})

// 你也可以使用以下的语法来创建自定义hook
// const usePost = createQuery<Response, Variables, Error>(
//   '/posts',
//   ({ queryKey: [primaryKey, variables] }) => {
//     // primaryKey 相等于 '/posts'
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

  await queryClient.prefetchQuery(usePost.getKey(variables), usePost.queryFn)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

// 在 react 组件外使用
const data = await queryClient.fetchQuery(
  usePost.getKey(variables),
  usePost.queryFn
)

// useQueries 例子
const queries = useQueries({
  queries: [
    { queryKey: usePost.getKey(variables), queryFn: usePost.queryFn },
    { queryKey: useProjects.getKey(), queryFn: useProjects.queryFn },
  ],
})

// setQueryData
queryClient.setQueryData(usePost.getKey(variables), {...})
```

### 额外的API文档

Options
- `primaryKey: string`
    - 必填
    - `primaryKey` 将是 `queryKey` 数组的第一个元素
- `enabled: boolean | ((data: TData, variables: TVariables) => boolean)`
  - Optional
  - 将此设置为 `false` 以禁用此查询自动运行。
  - 如果设置为函数，该函数将使用最新数据执行以计算布尔值

Expose Methods
- `getPrimaryKey: () => primaryKey`
- `getKey: (variables: TVariables) => [primaryKey, variables]`
- `queryFn: QueryFunction<TFnData, [primaryKey, TVariables]>`

Returns
- `setData: (updater: Updater<TData>, options?: SetDataOptions) => TData | undefined`
    - 它的参数与 `queryClient.setQueryData` 类似，但不需要传入 `queryKey`

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

// 在 react 组件外使用
const data = await queryClient.fetchInfiniteQuery(
  useProjects.getKey(variables),
  useProjects.queryFn
)
```

### 额外的API文档

Options
- `primaryKey: string`
    - 必填
    - `primaryKey` 将是 `queryKey` 数组的第一个元素
- `enabled: boolean | ((data: TData, variables: TVariables) => boolean)`
  - Optional
  - 将此设置为 `false` 以禁用此查询自动运行。
  - 如果设置为函数，该函数将使用最新数据执行以计算布尔值

Expose Methods
- `getPrimaryKey: () => primaryKey`
- `getKey: (variables: TVariables) => [primaryKey, variables]`
- `queryFn: QueryFunction<TFnData, [primaryKey, TVariables]>`

Returns
- `setData: (updater: Updater<TData>, options?: SetDataOptions) => TData | undefined`
    - 它的参数与 `queryClient.setQueryData` 类似，但不需要传入 `queryKey`

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

### 额外的API文档

Returns
- `getKey: () => MutationKey`
- `mutationFn: MutationFunction<TData, TVariables>`

## Issues

_Looking to contribute? Look for the [Good First Issue][good-first-issue]
label._

### 🐛 Bugs

请针对错误、缺少文档或意外行为提出问题。

[**See Bugs**][bugs]

### 💡 Feature Requests

请提交问题以建议新功能。 通过添加对功能请求进行投票
一个👍。 这有助于维护人员优先处理要处理的内容。

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