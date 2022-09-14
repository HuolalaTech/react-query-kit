import * as React from 'react'
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query'
import { Todos, useAddTodo, useTodos } from '../services/todos'

function Page() {
  const queryClient = useQueryClient()
  const [text, setText] = React.useState('')
  const todosQuery = useTodos()

  const addTodoMutation = useAddTodo({
    // When mutate is called:
    onMutate: async (newTodo: string) => {
      setText('')
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(useTodos.getKey())

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<Todos>(useTodos.getKey())

      // Optimistically update to the new value
      if (previousTodos) {
        queryClient.setQueryData<Todos>(useTodos.getKey(), {
          ...previousTodos,
          items: [
            ...previousTodos.items,
            { id: Math.random().toString(), text: newTodo },
          ],
        })
      }

      return { previousTodos }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData<Todos>(
          useTodos.getKey(),
          context.previousTodos
        )
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(useTodos.getKey())
    },
  })

  return (
    <div>
      <p>
        In this example, new items can be created using a mutation. The new item
        will be optimistically added to the list in hopes that the server
        accepts the item. If it does, the list is refetched with the true items
        from the list. Every now and then, the mutation may fail though. When
        that happens, the previous list of items is restored and the list is
        again refetched from the server.
      </p>
      <form
        onSubmit={e => {
          e.preventDefault()
          addTodoMutation.mutate(text)
        }}
      >
        <input
          type="text"
          onChange={event => setText(event.target.value)}
          value={text}
        />
        <button disabled={addTodoMutation.isLoading}>Create</button>
      </form>
      <br />
      {todosQuery.isSuccess && (
        <>
          <div>
            {/* The type of queryInfo.data will be narrowed because we check for isSuccess first */}
            Updated At: {new Date(todosQuery.data.ts).toLocaleTimeString()}
          </div>
          <ul>
            {todosQuery.data.items.map(todo => (
              <li key={todo.id}>{todo.text}</li>
            ))}
          </ul>
          {todosQuery.isFetching && <div>Updating in background...</div>}
        </>
      )}
      {todosQuery.isLoading && 'Loading'}
      {todosQuery.error instanceof Error && todosQuery.error.message}
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
