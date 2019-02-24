import { gql } from 'apollo-boost';

export const GET_AUTH = gql`
    query {
        auth @client {
            userId
        }
    }
`;

export const SET_AUTH = gql`
    mutation($userId: String) {
        setAuth(userId: $userId) @client
    }
`;