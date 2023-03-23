import type { MutationKey } from '@tanstack/react-query'
import { createMutation } from '../src/createMutation'

it('createMutation', () => {
  const mutationKey: MutationKey = ['mutationKey']
  const mutation = createMutation({
    mutationKey,
    mutationFn: async () => mutationKey,
  })

  expect(mutation.getKey()).toEqual(mutationKey)
  mutation.mutationFn().then(data => expect(data).toEqual(mutationKey))
})
