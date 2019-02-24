import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import moment from 'moment';

import { defaults, resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/typeDefs';
import { getUserInfo } from './utils/utils';
import { SET_AUTH } from './graphql/client';

const client = new ApolloClient({
    uri: "https://graphql-react-company-rating.herokuapp.com",
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
    const user = getUserInfo(token);
    const now = moment().unix();
    if (moment(now).isBefore(user.exp)) {
        client.mutate({ mutation: SET_AUTH, variables: { userId: user.userId }})
        .then(() => {
            renderApp();
        });
    } else {
        localStorage.removeItem('companyToken');
        client.mutate({ mutation: SET_AUTH, variables: { userId: null } })
        .then(() => {
            renderApp();
        });
    }
    
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

