import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { defaults, resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/typeDefs';
import { getUserId } from './utils/utils';
import { SET_AUTH } from './graphql/client';

const client = new ApolloClient({
    uri: "http://localhost:4200",
    request: operation => {
        const token = localStorage.getItem('companyToken');
      operation.setContext({
          headers: {
              authorization: token ? `Bearer ${token}` : ""
          }
      })  
    },
    clientState: {
        defaults,
        resolvers,
        typeDefs
    }
});

if (localStorage.getItem('companyToken')) {
    const token = localStorage.getItem('companyToken');
    const userId = getUserId(token);

    client.mutate({ mutation: SET_AUTH, variables: { userId }})
        .then(() => {
            renderApp();
        });
} else {
    client.mutate({ mutation: SET_AUTH, variables: { userId: null } })
        .then(() => {
            renderApp();
        });
}

const jsx = (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);

const renderApp = () => {
    ReactDOM.render(jsx, document.getElementById('root'));
}

