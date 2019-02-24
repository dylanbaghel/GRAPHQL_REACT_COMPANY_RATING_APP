import React from 'react';
import { Link } from 'react-router-dom';
import { Mutation, Query, ApolloConsumer } from 'react-apollo';

import { SET_AUTH, GET_AUTH } from './../graphql/client';
import { history } from './../router/AppRouter';
import Logo from './../assets/logo.png';

const Header = () => {
    return (
        <ApolloConsumer>
            {client => {
                return (
                    <Query
                        query={GET_AUTH}
                    >
                        {({ data }) => {
                            return <nav className="navbar navbar-dark bg-dark mb-5">
                                <div className="container">
                                    <Link to="/" className="navbar-brand"><img className="logo" src={Logo} alt="Rate It Logo"/></Link>
                                    <ul className="navbar-nav ml-auto">
                                        <li className="nav-item">
                                            <Link to="/companies" className="nav-link">Companies</Link>
                                        </li>
                                        {data.auth.userId ? (
                                            <React.Fragment>
                                                <li className="nav-item">
                                                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link to="/settings" className="nav-link">Settings</Link>
                                                </li>
                                                <Mutation
                                                    mutation={SET_AUTH}
                                                >
                                                    {(setAuth) => {
                                                        return <li className="nav-item">
                                                            <button className="btn btn-danger" onClick={() => {
                                                                setAuth({ variables: { userId: null } }).then(() => {
                                                                    localStorage.removeItem('companyToken');
                                                                    history.replace("/login");
                                                                    client.resetStore();
                                                                });
                                                            }}>Logout</button>
                                                        </li>
                                                    }}
                                                </Mutation>
                                            </React.Fragment>
                                        ) : (
                                                <React.Fragment>
                                                    <li className="nav-item">
                                                        <Link to="/signup" className="nav-link">Signup</Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link to="/login" className="nav-link">Login</Link>
                                                    </li>
                                                </React.Fragment>
                                            )}
                                    </ul>
                                </div>
                            </nav>
                        }}
                    </Query>
                );
            }}
        </ApolloConsumer>
    );
};

export default Header;