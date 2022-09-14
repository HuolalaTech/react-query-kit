import { createQuery } from 'react-query-kit'

interface Repo {
  name: string
  description: string
  subscribers_count: number
  stargazers_count: number
  forks_count: number
}

export const useRepo = createQuery<Repo>(
  'https://api.github.com/repos/liaoliao666/react-query-kit',
  ({ queryKey: [url] }) => fetch(url).then(res => res.json())
)
