import ky from 'ky-universal'
import { createQuery } from 'react-query-kit'

export const usePosts = createQuery<void, { limit: number }>(
  'https://jsonplaceholder.typicode.com/posts',
  async ({ queryKey: [url, variables] }) => {
    const limit = variables.limit ?? 10
    const parsed = await ky(url).json()
    const result = parsed.filter(x => x.id <= limit)
    return result
  }
)
