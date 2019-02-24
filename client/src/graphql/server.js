import { gql } from 'apollo-boost';

export const GET_COMPANIES = gql`
    query($first: Int, $after: ID, $orderBy: CompanyOrderByInput) {
        companies(first: $first, after: $after, orderBy: $orderBy) {
            pageInfo {
                endCursor
                hasNextPage
            }
            edges {
                node {
                    id
                    title
                    email
                }
            }
        }
    }
`;


export const GET_MY_COMPANIES = gql`
    query MyCompanies($after: ID, $orderBy: CompanyOrderByInput) {
        myCompanies(first: 10, after: $after, orderBy: $orderBy) {
            pageInfo {
                endCursor
                hasNextPage
            }
            edges {
                node {
                    id
                    title
                    published
                    email
                }
            }
        }
    }
`;

export const GET_INDI_COMPANY = gql`
    query($id: ID!) {
        company(id: $id) {
            id
            title
            email
            phone
            published
            description
            services
            createdAt
            creator {
                id
                name
            }
        }
    } 
`;

export const COMPANY_RATINGS = gql`
    query($id: ID!, $orderBy: RatingOrderByInput) {
        companyRatings(id: $id, orderBy: $orderBy) {
            edges {
                node {
                    id
                    comment
                    star
                    createdAt
                    creator {
                        id
                        name
                    }
                    company {
                        id
                    }
                }
            }
        }
    }
`;

//Mutation
export const LOGIN = gql`
    mutation($email: String!, $password: String!) {
        login(data: { email: $email, password: $password }) {
            token
        }
    }
`;

export const SIGNUP = gql`
    mutation($name: String!, $email: String!, $password: String!) {
        createUser(data: { name: $name, email: $email, password: $password }) {
            token
        }
    }
`;

export const ME = gql`
    query {
        me {
            name
        }
    }
`;

export const UPDATE_USER = gql`
    mutation($name: String, $email: String, $password: String) {
        updateUser(data: { name: $name, email: $email, password: $password }) {
            name
        }
    }
`;

export const DELETE_USER = gql`
    mutation {
        deleteUser {
            name
        }
    }
`;

export const CREATE_COMPANY = gql`
    mutation($title: String!, $email: String!, $description: String, $phone: String!, $published: Boolean!, $services: [String!]!) {
        createCompany(data: {title: $title, email: $email, description: $description, phone: $phone, published: $published, services: $services}) {
            id
            title
            email
        }
    }
`;

export const UPDATE_COMPANY = gql`
    mutation($id: ID!, $title: String, $email: String, $description: String, $phone: String, $published: Boolean, $services: [String]) {
        updateCompany(id: $id, data: {title: $title, email: $email, description: $description, phone: $phone, published: $published, services: $services}) {
            id
            title
            email
        }
    }
`;

export const DELETE_COMPANY = gql`
    mutation($id: ID!) {
        deleteCompany(id: $id) {
            id
        }
    }
`;

export const ADD_RATING = gql`
    mutation($comment: String!, $star: Float!, $company: ID!) {
        createRating(data: {comment: $comment, star: $star, company: $company}) {
            id
        }
    }
`;

export const UPDATE_RATING = gql`
    mutation($id: ID!, $comment: String, $star: Float) {
        updateRating(id: $id, data: { comment: $comment, star: $star }) {
            id
        } 
    }
`;

export const DELETE_RATING = gql`
    mutation($id: ID!) {
        deleteRating(id: $id) {
            id
        }
    }
`;