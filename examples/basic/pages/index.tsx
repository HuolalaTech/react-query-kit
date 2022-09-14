import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRepo } from '../services/repos'

function Page() {
  const { isLoading, error, data } = useRepo()

  if (isLoading) return <div>'Loading...'</div>

  if (error) return <div>'An error has occurred: ' + error.message</div>

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  )
}

export default function App() {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  )
}
