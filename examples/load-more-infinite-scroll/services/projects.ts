import axios from 'axios'
import { createQuery } from 'react-query-kit'

interface Project {
  id: number
  name: string
}

export const useProjects = createQuery<Project[]>(
  '/api/projects',
  async ({ queryKey: [url], pageParam = 0 }) => {
    const res = await axios.get(`${url}?cursor=${pageParam}`)
    return res.data
  },
  {
    getPreviousPageParam: firstPage => firstPage.previousId ?? undefined,
    getNextPageParam: lastPage => lastPage.nextId ?? undefined,
  }
)
