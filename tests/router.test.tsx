import { router } from '../src'

describe('router', () => {
  it('should return the correct shape', () => {
    const posts = router(`posts`, {
      byId: router.query({
        fetcher: (variables: { id: number }): Promise<{ id: 1 }> =>
          fetch(`/posts/${variables.id}`).then(res => res.json()),
      }),

      list: router.infiniteQuery({
        fetcher: (_variables, { pageParam }) =>
          fetch(`/posts/?cursor=${pageParam}`).then(res => res.json()),
        getNextPageParam: lastPage => lastPage.nextCursor,
        initialPageParam: 0,
      }),

      add: router.mutation({
        mutationFn: async (variables: {
          title: string
          content: string
        }): Promise<{
          ret: number
        }> =>
          fetch('/posts', {
            method: 'POST',
            body: JSON.stringify(variables),
          }).then(res => res.json()),
      }),
    })

    expect(posts.getKey()).toEqual(['posts'])
    expect(posts.byId.getKey()).toEqual(['posts', 'byId'])
    expect(posts.byId.getKey({ id: 1 })).toEqual(['posts', 'byId', { id: 1 }])
    expect(posts.list.getKey()).toEqual(['posts', 'list'])
    expect(posts.list.getKey()).toEqual(['posts', 'list'])
    expect(posts.add.getKey()).toEqual(['posts', 'add'])
    expect(typeof posts.byId.fetcher === 'function').toBe(true)
    expect(typeof posts.byId.getFetchOptions === 'function').toBe(true)
    expect(typeof posts.byId.getOptions === 'function').toBe(true)
    expect(typeof posts.byId.useQuery === 'function').toBe(true)
    expect(typeof posts.byId.useSuspenseQuery === 'function').toBe(true)
    expect(typeof posts.list.fetcher === 'function').toBe(true)
    expect(typeof posts.list.getFetchOptions === 'function').toBe(true)
    expect(typeof posts.list.getOptions === 'function').toBe(true)
    expect(typeof posts.list.useInfiniteQuery === 'function').toBe(true)
    expect(typeof posts.list.useSuspenseInfiniteQuery === 'function').toBe(true)
    expect(typeof posts.add.mutationFn === 'function').toBe(true)
    expect(typeof posts.add.getKey === 'function').toBe(true)
    expect(typeof posts.add.getOptions === 'function').toBe(true)
    expect(typeof posts.add.useMutation === 'function').toBe(true)
  })
})
