import { createQuery, router } from '../src'
import type { Middleware } from '../src'

const usePost = createQuery<{ title: string }, { id: number }>({
  queryKey: ['post'],
  fetcher: async variables => ({
    title: `post-${variables.id}`,
  }),
})

const queryMiddleware: Middleware<typeof usePost> = useQueryNext => options => {
  options.fetcher
  options.variables?.id

  // @ts-expect-error Query middleware should not expose mutation options.
  options.mutationFn

  return useQueryNext(options)
}

void queryMiddleware

type UsePostOptions = Parameters<typeof usePost>[0]

const validQueryOptions: UsePostOptions = {
  variables: { id: 1 },
}

void validQueryOptions

const invalidQueryOptions: UsePostOptions = {
  // @ts-expect-error Query hooks should not accept mutation options.
  mutationFn: async () => ({ title: 'post-1' }),
}

void invalidQueryOptions

const postRoutes = router('post', {
  byId: router.query({
    fetcher: async (variables: { id: number }) => ({
      id: variables.id,
      title: `post-${variables.id}`,
    }),
  }),
  add: router.mutation({
    mutationFn: async (variables: { title: string }) => ({
      title: variables.title,
    }),
  }),
})

postRoutes.byId.useQuery({
  variables: { id: 1 },
  enabled: false,
})

postRoutes.add.useMutation({
  onSuccess(data) {
    const title: string = data.title

    void title
  },
})

// @ts-expect-error Query routes should not expose mutation hooks.
postRoutes.byId.useMutation()

// @ts-expect-error Mutation routes should not expose query hooks.
postRoutes.add.useQuery()
