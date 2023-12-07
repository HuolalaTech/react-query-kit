import { router } from '../src'

describe('router', () => {
  it('should return the correct shape', () => {
    const post = router(`post`, {
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

    expect(post.getKey()).toEqual(['posts'])
    expect(post.byId.getKey()).toEqual(['posts', 'byId'])
    expect(post.byId.getKey({ id: 1 })).toEqual(['posts', 'byId', { id: 1 }])
    expect(post.list.getKey()).toEqual(['posts', 'list'])
    expect(post.list.getKey()).toEqual(['posts', 'list'])
    expect(post.add.getKey()).toEqual(['posts', 'add'])
    expect(typeof post.byId.fetcher === 'function').toBe(true)
    expect(typeof post.byId.getFetchOptions === 'function').toBe(true)
    expect(typeof post.byId.getOptions === 'function').toBe(true)
    expect(typeof post.byId.useQuery === 'function').toBe(true)
    expect(typeof post.byId.useSuspenseQuery === 'function').toBe(true)
    expect(typeof post.list.fetcher === 'function').toBe(true)
    expect(typeof post.list.getFetchOptions === 'function').toBe(true)
    expect(typeof post.list.getOptions === 'function').toBe(true)
    expect(typeof post.list.useInfiniteQuery === 'function').toBe(true)
    expect(typeof post.list.useSuspenseInfiniteQuery === 'function').toBe(true)
    expect(typeof post.add.mutationFn === 'function').toBe(true)
    expect(typeof post.add.getKey === 'function').toBe(true)
    expect(typeof post.add.getOptions === 'function').toBe(true)
    expect(typeof post.add.useMutation === 'function').toBe(true)
  })
})
