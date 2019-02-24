import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';

import { GET_AUTH } from './../graphql/client';

const PublicRoute = ({
    component: Component,
    ...rest
}) => {
    return (
        <Query
            query={GET_AUTH}
        >
            {({ data }) => {
                return (
                    <Route 
                        {...rest}
                        render={(props) => {
                            return (
                                !data.auth.userId ? <Component {...props} /> : <Redirect to="/dashboard" />
                            );
                        }}
                    />
                );
            }}
        </Query>
    );
};

export default PublicRoute;