import React from 'react';
import classNames from 'classnames';
import { isEmail } from 'validator';
import { Mutation, ApolloConsumer } from 'react-apollo';

import { getUserId } from './../utils/utils';

import { LOGIN } from './../graphql/server';
import { SET_AUTH } from './../graphql/client';

import Loader from './Loader';
import Error from './Error';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            errors: {}
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearState = this.clearState.bind(this);
    }

    handleEmailChange(e) {
        const email = e.target.value;
        this.setState(() => ({
            email
        }));
    }

    handlePasswordChange(e) {
        const password = e.target.value;
        this.setState(() => ({
            password
        }));
    }

    clearState() {
        this.setState(() => ({
            email: "",
            password: "",
            errors: {}
        }));
    }

    handleSubmit(e, login) {
        e.preventDefault();

        if (!this.state.email) {
            this.setState(() => ({
                errors: { email: "Email is Required" }
            }));
            return;
        } else if (!isEmail(this.state.email)) {
            this.setState(() => ({
                errors: { email: "Invalid Email" }
            }));
            return;
        }
        if (!this.state.password) {
            this.setState(() => ({
                errors: { password: "Password is Required " }
            }));
            return;
        }

        login({
            variables: {
                email: this.state.email,
                password: this.state.password
            }
        }).catch(e => console.log(e));

        this.clearState();
    }

    render() {
        return (
            <ApolloConsumer>
                {client => {
                    return (
                        <Mutation
                            mutation={LOGIN}
                            onCompleted={(data) => {
                                const token = data.login.token;
                                const userId = getUserId(token);
                                localStorage.setItem('companyToken', token);
                                client.mutate({
                                    mutation: SET_AUTH,
                                    variables: {
                                        userId
                                    }
                                })
                            }}
                        >
                            {(login, {loading, error }) => {
                                if (loading) {
                                    return <Loader />
                                }
                                return <section className="container">
                                    {error && <Error>{error.message.substring(15)}</Error>}
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-text">Login</h5>
                                            <form onSubmit={(e) => {
                                                this.handleSubmit(e, login);
                                            }}>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        value={this.state.email}
                                                        placeholder="Enter Email"
                                                        onChange={this.handleEmailChange}
                                                        className={classNames('form-control', {
                                                            'is-invalid': this.state.errors.email
                                                        })}
                                                    />
                                                    <div className="invalid-feedback">{this.state.errors.email}</div>
                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="password"
                                                        value={this.state.password}
                                                        placeholder="Enter Password"
                                                        onChange={this.handlePasswordChange}
                                                        className={classNames('form-control', {
                                                            'is-invalid': this.state.errors.password
                                                        })}
                                                    />
                                                    <div className="invalid-feedback">{this.state.errors.password}</div>
                                                </div>
                                                <button type="submit" className="btn btn-dark">Submit</button>
                                            </form>
                                        </div>
                                    </div>
                                </section>
                            }}
                        </Mutation>
                    );
                }}
            </ApolloConsumer>
        );
    }
}

export default Login;