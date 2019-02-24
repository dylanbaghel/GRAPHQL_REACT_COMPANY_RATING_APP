import React from 'react';
import { Query } from 'react-apollo';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

import { GET_MY_COMPANIES, ME } from './../graphql/server';

import Loader from './Loader';
import Error from './Error';

const Dashboard = () => {
    return (
        <section className="container">
            <Query
                query={ME}
            >
                {({ data, loading, error }) => {
                    if (loading) {
                        return null;
                    }
                    if (error) {
                        return <Error>{error.message}, Please Reload Page</Error>
                    }
                    return (
                        <h1>Hello, { data.me.name }</h1>
                    )
                }}
            </Query>
            <hr />
            <Link to="/add" className="btn btn-danger">Add Company</Link>
            <hr />
            <Query
                query={GET_MY_COMPANIES}
                variables={{ orderBy: 'createdAt_DESC' }}
                fetchPolicy={'cache-and-network'}
            >
                {({ data, error, loading, fetchMore }) => {
                    if (!data) {
                        return <div style={{textAlign: 'center'}}>Internal Server Error | No Data</div>
                    }
                    if (!data.myCompanies) {
                        return <Loader />
                    }
                    if (data.myCompanies.edges.length === 0) {
                        return <div>No Companies Created</div>
                    }
                    return (
                        <InfiniteScroll
                            dataLength={data.myCompanies.edges.length}
                            hasMore={data.myCompanies.pageInfo.hasNextPage}
                            loader={<Loader />}
                            next={() => {
                                fetchMore({
                                    variables: {
                                        after: data.myCompanies.pageInfo.endCursor
                                    },
                                    updateQuery: (prevResult, { fetchMoreResult }) => {
                                        const newEdges = fetchMoreResult.myCompanies.edges;
                                        const pageInfo = fetchMoreResult.myCompanies.pageInfo;

                                        return newEdges.length ? {
                                            myCompanies: {
                                                __typename: prevResult.myCompanies.__typename,
                                                edges: [...prevResult.myCompanies.edges, ...newEdges],
                                                pageInfo
                                            }
                                        } : prevResult;
                                    }
                                });
                            }}
                        >   
                            {error && <Error>{error.message}</Error>}
                            <table className="table">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Email</th>
                                        <th>Published</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.myCompanies.edges.map((edge, index) => {
                                        return (
                                            <tr key={edge.node.id}>
                                                <td>{index + 1}</td>
                                                <td>{edge.node.title}</td>
                                                <td>{edge.node.email}</td>
                                                <td>{edge.node.published.toString()}</td>
                                                <td><Link to={`/companies/${edge.node.id}`} className="btn btn-dark">{edge.node.published ? 'View' : 'Preview'}</Link></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </InfiniteScroll>
                    );
                }}
            </Query>
        </section>
    );
};

export default Dashboard;