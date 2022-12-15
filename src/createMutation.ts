import type {
  MutationFunction,
  MutationKey,
  UseMutationOptions,
} from '@tanstack/react-query'
import { parseMutationArgs, useMutation } from '@tanstack/react-query'
import { CreateMutationResult } from './types'

export function createMutation<
  TData = unknown,
  TVariables = void,
  TError = unknown,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): CreateMutationResult<TData, TError, TVariables>

export function createMutation<
  TData = unknown,
  TVariables = void,
  TError = unknown,
  TContext = unknown
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationFn'
  >
): CreateMutationResult<TData, TError, TVariables>

export function createMutation<
  TData = unknown,
  TVariables = void,
  TError = unknown,
  TContext = unknown
>(
  mutationKey: MutationKey,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationKey'
  >
): CreateMutationResult<TData, TError, TVariables>

export function createMutation<
  TData = unknown,
  TVariables = void,
  TError = unknown,
  TContext = unknown
>(
  mutationKey: MutationKey,
  mutationFn?: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationKey' | 'mutationFn'
  >
): CreateMutationResult<TData, TError, TVariables>

export function createMutation<
  TData = unknown,
  TVariables = void,
  TError = unknown,
  TContext = unknown
>(
  arg1:
    | MutationKey
    | MutationFunction<TData, TVariables>
    | UseMutationOptions<TData, TError, TVariables, TContext>,
  arg2?:
    | MutationFunction<TData, TVariables>
    | UseMutationOptions<TData, TError, TVariables, TContext>,
  arg3?: UseMutationOptions<TData, TError, TVariables, TContext>
): CreateMutationResult<TData, TError, TVariables> {
  const defaultOptions = parseMutationArgs(arg1, arg2, arg3)
  const getKey = () => defaultOptions.mutationKey

  function useGeneratedMutation(
    options?: Omit<
      UseMutationOptions<TData, TError, TVariables, TContext>,
      'mutationFn' | 'mutationKey'
    >
  ) {
    return useMutation({
      ...defaultOptions,
      ...options,
    })
  }

  useGeneratedMutation.getKey = getKey
  useGeneratedMutation.mutationFn = defaultOptions.mutationFn as NonNullable<
    MutationFunction<TData, TVariables>
  >

  return useGeneratedMutation as CreateMutationResult<TData, TError, TVariables>
}
