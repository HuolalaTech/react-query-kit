import { createMutation } from '../src/createMutation';
it('createMutation', () => {
    const mutationKey = ['mutationKey'];
    const mutation = createMutation(mutationKey, async () => mutationKey);
    expect(mutation.getKey()).toEqual(mutationKey);
    mutation.mutationFn().then(data => expect(data).toEqual(mutationKey));
});
