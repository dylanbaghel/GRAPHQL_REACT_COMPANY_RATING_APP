import React from 'react';
import { Query, Mutation, ApolloConsumer } from 'react-apollo';
import classNames from 'classnames';

import { ME, UPDATE_USER, DELETE_USER } from './../graphql/server';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: {
                name: false
            },
            name: "",
            errors: {}
        }
        this.handleEditName = this.handleEditName.bind(this);
        this.resetState = this.resetState.bind(this);
    }

    handleEditName(updateUser) {
        if (!this.state.name) {
            this.setState(() => ({
                errors: { name: true }
            }));
            return;
        }

        updateUser({
            variables: {
                name: this.state.name
            },
            refetchQueries: [
                { query: ME }
            ]
        }).then(() => {
            this.resetState();
        }).catch(e => {
            console.log(e);
            this.resetState();
        });
    }

    permanentDeleteUser(client) {
        client.mutate({
            mutation: DELETE_USER
        }).then(() => {
            localStorage.removeItem('companyToken');
            client.resetStore();
            this.props.history.replace("/");
        });
    }

    resetState() {
        this.setState(() => ({
            isEdit: {
                name: false
            },
            name: "",
            errors: {}
        }))
    }

    renderName(name) {
        if (this.state.isEdit.name) {
            return (
                <React.Fragment>
                    <input
                        value={this.state.name}
                        placeholder="Enter Name"
                        className={classNames('form-control w-50 mr-3', {
                            'is-invalid': this.state.errors.name
                        })}
                        onChange={(e) => {
                            const name = e.target.value;
                            this.setState(() => ({
                                name
                            }));
                        }}
                    />
                    <Mutation
                        mutation={UPDATE_USER}
                    >
                        {(updateUser) => {
                            return (
                                <button className="btn btn-dark mr-1" onClick={() => {
                                    this.handleEditName(updateUser);
                                }}>Save</button>
                            );
                        }}
                    </Mutation>
                    <button className="btn btn-light ml-1" onClick={() => {
                        this.setState(() => ({
                            isEdit: {
                                name: false
                            }
                        }));
                    }}>Cancel</button>
                </React.Fragment>
            );
        } else {
            return (<p>{name} <i className="fas fa-pencil-alt ml-2" style={{cursor: 'pointer'}} onClick={() => {
                this.setState(() => ({
                    isEdit: {
                        name: true
                    },
                    name
                }))
            }}></i></p>);
        }
    }

    render() {
        return (
            <section className="container">
                <Query
                    query={ME}
                >
                    {({ data, loading }) => {
                        if (loading) {
                            return <div>Loading...</div>
                        }
                        return (
                            <React.Fragment>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Settings</h5>
                                        <div className="list-group">
                                            <div className="list-group-item">
                                                <div className="row">
                                                    <div className="col-sm-2">Name</div>
                                                    <div className="col-sm-10 d-flex">{this.renderName(data.me.name)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <ApolloConsumer>
                                    {client => {
                                        return (
                                            <React.Fragment>
                                                <button onClick={() => {
                                                    this.permanentDeleteUser(client);
                                                }} className="btn btn-danger mt-5">Delete Account</button>
                                            </React.Fragment>
                                        );
                                    }}
                                </ApolloConsumer>
                            </React.Fragment>
                        );
                    }}
                </Query>
            </section>
        );
    }
}

export default Profile;