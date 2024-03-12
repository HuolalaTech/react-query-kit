import { router } from '../src'

describe('router', () => {
  it('should return the correct shape', () => {
    const post = router(`post`, {
      byId: router.query({
        fetcher: (variables: {
          id: number
        }): Promise<{ title: string; content: string }> =>
          fetch(`/post/${variables.id}`).then(res => res.json()),
      }),

      list: router.infiniteQuery({
        fetcher: (_variables, { pageParam }) =>
          fetch(`/post/?cursor=${pageParam}`).then(res => res.json()),
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
          fetch('/post', {
            method: 'POST',
            body: JSON.stringify(variables),
          }).then(res => res.json()),
      }),

      command: {
        report: router.query({
          fetcher: (variables: {
            id: number
          }): Promise<{ title: string; content: string }> =>
            fetch(`/post/report/${variables.id}`).then(res => res.json()),
        }),
      },
    })

    expect(post.getKey()).toEqual(['post'])
    expect(post.byId.getKey()).toEqual(['post', 'byId'])
    expect(post.byId.getKey({ id: 1 })).toEqual(['post', 'byId', { id: 1 }])
    expect(post.list.getKey()).toEqual(['post', 'list'])
    expect(post.add.getKey()).toEqual(['post', 'add'])
    expect(post.command.getKey()).toEqual(['post', 'command'])
    expect(post.command.report.getKey()).toEqual(['post', 'command', 'report'])
    expect(post.command.report.getKey({ id: 1 })).toEqual([
      'post',
      'command',
      'report',
      { id: 1 },
    ])
    expect(typeof post.command.report.fetcher === 'function').toBe(true)
    expect(typeof post.command.report.getFetchOptions === 'function').toBe(true)
    expect(typeof post.command.report.getOptions === 'function').toBe(true)
    expect(typeof post.command.report.useQuery === 'function').toBe(true)
    expect(typeof post.command.report.useSuspenseQuery === 'function').toBe(
      true
    )
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

  it('should return the correct shape when pass a array keys', () => {
    const post = router(['scope', `post`], {
      byId: router.query({
        fetcher: (variables: {
          id: number
        }): Promise<{ title: string; content: string }> =>
          fetch(`/post/${variables.id}`).then(res => res.json()),
      }),

      list: router.infiniteQuery({
        fetcher: (_variables, { pageParam }) =>
          fetch(`/post/?cursor=${pageParam}`).then(res => res.json()),
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
          fetch('/post', {
            method: 'POST',
            body: JSON.stringify(variables),
          }).then(res => res.json()),
      }),

      command: {
        report: router.query({
          fetcher: (variables: {
            id: number
          }): Promise<{ title: string; content: string }> =>
            fetch(`/post/report/${variables.id}`).then(res => res.json()),
        }),
      },
    })

    expect(post.getKey()).toEqual(['scope', 'post'])
    expect(post.byId.getKey()).toEqual(['scope', 'post', 'byId'])
    expect(post.byId.getKey({ id: 1 })).toEqual([
      'scope',
      'post',
      'byId',
      { id: 1 },
    ])
    expect(post.list.getKey()).toEqual(['scope', 'post', 'list'])
    expect(post.add.getKey()).toEqual(['scope', 'post', 'add'])
    expect(post.command.getKey()).toEqual(['scope', 'post', 'command'])
    expect(post.command.report.getKey()).toEqual([
      'scope',
      'post',
      'command',
      'report',
    ])
    expect(post.command.report.getKey({ id: 1 })).toEqual([
      'scope',
      'post',
      'command',
      'report',
      { id: 1 },
    ])
    expect(typeof post.command.report.fetcher === 'function').toBe(true)
    expect(typeof post.command.report.getFetchOptions === 'function').toBe(true)
    expect(typeof post.command.report.getOptions === 'function').toBe(true)
    expect(typeof post.command.report.useQuery === 'function').toBe(true)
    expect(typeof post.command.report.useSuspenseQuery === 'function').toBe(
      true
    )
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
