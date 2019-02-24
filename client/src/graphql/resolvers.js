import { GET_AUTH } from './client';

export const defaults = {
    auth: {
        __typename: "Auth",
        userId: null
    }
};

export const resolvers = {
    Mutation: {
        setAuth: (_, { userId }, { cache }) => {
            const prevData = cache.readQuery({ query: GET_AUTH });
            
            const data = {
                ...prevData,
                auth: {
                    ...prevData.auth,
                    userId
                }
            };

            cache.writeQuery({ query: GET_AUTH, data });
            return null;
        }
    }
};