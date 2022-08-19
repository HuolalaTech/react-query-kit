import { QueryClient } from '@tanstack/react-query';
import { createQuery } from '../src/createQuery';
const queryClient = new QueryClient();
it('createQuery', () => {
    const primaryKey = 'primaryKey';
    const variables = 1;
    const queryKey = [primaryKey, variables];
    const query = createQuery({
        primaryKey,
        queryFn: ({ queryKey }) => queryKey,
    });
    expect(query.getPrimaryKey()).toBe(primaryKey);
    expect(query.getKey(variables)).toEqual(queryKey);
    queryClient
        .fetchQuery(queryKey, query.queryFn)
        .then(data => expect(data).toEqual(queryKey));
});
