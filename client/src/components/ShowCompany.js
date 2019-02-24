import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';

import { GET_AUTH } from './../graphql/client';
import { GET_INDI_COMPANY, DELETE_COMPANY } from './../graphql/server';
import { getFullDateTime } from './../utils/utils';

import Ratings from './Ratings';
import AddRating from './AddRating';
import NotFound from './NotFound';
import Loader from './Loader';
import Error from './Error';

const ShowCompany = ({
    match,
    history
}) => {
    return (
        <section className="container">
            <Query
                query={GET_AUTH}
            >
                {({ data: userData }) => {
                    return (
                        <Query
                            query={GET_INDI_COMPANY}
                            variables={{ id: match.params.companyId }}
                            fetchPolicy={'cache-and-network'}
                        >
                            {({ data, loading, error }) => {
                                if (loading) {
                                    return <Loader />
                                }
                                if (!data) {
                                    return <NotFound />
                                }
                                return (
                                    <React.Fragment>
                                        <div className="card mb-2">
                                            {error && <Error>{error.message}</Error>}
                                            <div className="card-body">
                                                <h5 className="card-titl">{data.company.title}</h5>
                                                <small className="text-muted">{getFullDateTime(data.company.createdAt)}</small>
                                                <br />
                                                <small className="text-muted">-               {data.company.creator.name}</small>
                                                <hr />
                                                <h5>Contact Details: </h5>
                                                <ul className="list-group">
                                                    <li className="list-group-item">Email: {data.company.email}</li>
                                                    <li className="list-group-item">Phone: {data.company.phone}</li>
                                                </ul>
                                                <hr />
                                                <h5>Services</h5>
                                                <ul className="list-group mb-2">
                                                    {data.company.services.map((service, index) => {
                                                        return <li className="list-group-item" key={index}>{service}</li>
                                                    })}
                                                </ul>
                                                {
                                                    userData.auth.userId && userData.auth.userId === data.company.creator.id ? (
                                                        <React.Fragment>
                                                            <Link className="btn btn-dark mr-1" to={`/companies/edit/${data.company.id}`}>Edit</Link>
                                                            <Mutation
                                                                mutation={DELETE_COMPANY}
                                                            >
                                                                {(deleteCompany) => {
                                                                    return (
                                                                        <button className="btn btn-danger" onClick={() => {
                                                                            deleteCompany({
                                                                                variables: { id: data.company.id }
                                                                            }).then(() => {
                                                                                history.replace("/dashboard");
                                                                            });
                                                                        }}>Delete</button>
                                                                    );
                                                                }}
                                                            </Mutation>
                                                        </React.Fragment>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                        {data.company.published &&
                                            <Ratings companyId={data.company.id} />
                                        }
                                        {data.company.creator.id !== userData.auth.userId && userData.auth.userId && data.company.published && <AddRating companyId={data.company.id} />}
                                        {!userData.auth.userId && (
                                            <div className="card card-body mt-2 mb-2">
                                                <p className="card-text">Please <Link to="/login">Login</Link> To Give Rating</p>
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            }}
                        </Query>
                    );
                }}
            </Query>
        </section>
    );
};

export default ShowCompany;