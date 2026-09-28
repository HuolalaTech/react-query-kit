import { skipToken } from '@tanstack/react-query'

import {
  createInfiniteQuery,
  createQuery,
  createSuspenseInfiniteQuery,
  createSuspenseQuery,
  router,
} from '../src'
import type { inferOptions } from '../src'

declare module '../src' {
  interface Register {
    strictVariables: true
  }
}

type Variables = { id: number }
type Post = { title: string }

declare const maybeVariables: Variables | undefined

const usePost = createQuery({
  queryKey: ['post'],
  fetcher: (variables: Variables): Post => ({ title: `post-${variables.id}` }),
})

const useUser = createQuery({
  queryKey: ['user'],
  fetcher: () => ({ name: 'user' }),
})

const usePosts = createQuery({
  queryKey: ['posts'],
  fetcher: (variables: { page: number } | undefined): Post[] => [
    { title: `page-${variables?.page ?? 1}` },
  ],
})

const useQueryVariables = () => {
  usePost({ variables: { id: 1 } })
  usePost({ variables: maybeVariables ?? skipToken })

  // @ts-expect-error Query hooks should require variables the fetcher needs.
  usePost()

  // @ts-expect-error Query hooks should require variables the fetcher needs.
  usePost({ enabled: true })

  // @ts-expect-error Query hooks should not accept possibly undefined variables.
  usePost({ variables: maybeVariables })

  const selected: string | undefined = usePost({
    variables: { id: 1 },
    select: post => post.title,
  }).data

  void selected

  const defined: Post = usePost({
    variables: { id: 1 },
    initialData: { title: 'post-1' },
  }).data

  void defined

  // @ts-expect-error Query hooks with initialData should also require variables.
  usePost({ initialData: { title: 'post-1' } })

  useUser()
  useUser({ enabled: true })

  // @ts-expect-error Query hooks without variables should not accept them.
  useUser({ variables: { id: 1 } })

  usePosts()
  usePosts({ variables: { page: 1 } })
}

void useQueryVariables

const validPostOptions: inferOptions<typeof usePost> = {
  variables: { id: 1 },
}

void validPostOptions

// @ts-expect-error inferOptions should require variables like the hook does.
const invalidPostOptions: inferOptions<typeof usePost> = {}

void invalidPostOptions

const useSuspensePost = createSuspenseQuery({
  queryKey: ['post'],
  fetcher: (variables: Variables): Post => ({ title: `post-${variables.id}` }),
})

const useSuspenseQueryVariables = () => {
  useSuspensePost({ variables: { id: 1 } })

  // @ts-expect-error Suspense query hooks should require variables.
  useSuspensePost()
}

void useSuspenseQueryVariables

const infiniteOptions = {
  queryKey: ['projects'],
  fetcher: (variables: Variables, { pageParam }: { pageParam: number }) => ({
    projects: [variables.id],
    nextCursor: pageParam + 1,
  }),
  initialPageParam: 1,
  getNextPageParam: (lastPage: { nextCursor: number }) => lastPage.nextCursor,
}

const useProjects = createInfiniteQuery(infiniteOptions)
const useSuspenseProjects = createSuspenseInfiniteQuery(infiniteOptions)

const useInfiniteQueryVariables = () => {
  useProjects({ variables: { id: 1 } })

  // @ts-expect-error Infinite query hooks should require variables.
  useProjects()

  // @ts-expect-error Infinite query hooks should require variables.
  useProjects({ enabled: true })

  useSuspenseProjects({ variables: { id: 1 } })

  // @ts-expect-error Suspense infinite query hooks should require variables.
  useSuspenseProjects()
}

void useInfiniteQueryVariables

const postRoutes = router('post', {
  byId: router.query({
    fetcher: (variables: Variables): Post => ({
      title: `post-${variables.id}`,
    }),
  }),
})

postRoutes.byId.useQuery({ variables: { id: 1 } })

// @ts-expect-error Router query hooks should require variables.
postRoutes.byId.useQuery()

// @ts-expect-error Router suspense query hooks should require variables.
postRoutes.byId.useSuspenseQuery()
