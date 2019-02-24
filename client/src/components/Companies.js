import React from 'react';
import { Query } from 'react-apollo';
import InfiniteScroll from 'react-infinite-scroll-component';

import { GET_COMPANIES } from './../graphql/server';

import Company from './Company';
import Loader from './Loader';

class Companies extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: 10,
            after: null,
            orderBy: 'createdAt_DESC'
        };
    }

    render() {
        return (
            <Query
                query={GET_COMPANIES}
                variables={{ first: this.state.first, after: this.state.after, orderBy: this.state.orderBy }}
                fetchPolicy={'cache-and-network'}
            >
                {({ data, loading, error, fetchMore }) => {
                    if (!data) {
                        return <div style={{textAlign: 'center'}}>Internal Server Error | No Data</div>
                    }
                    if (!data.companies) {
                        return <Loader />
                    }
                    if (data.companies.edges.length === 0) {
                        return <div>No Companies Found</div>
                    }
                    return (
                        <div className="container" id="guts">
                            {error && <p>{error.message}</p>}
                            <h1>Companies</h1>
                            <hr />
                            <InfiniteScroll
                                dataLength={data.companies.edges.length}
                                hasMore={data.companies.pageInfo.hasNextPage}
                                loader={<Loader />}
                                next={() => {
                                    fetchMore({
                                        variables: {
                                            after: data.companies.pageInfo.endCursor
                                        },
                                        updateQuery: (prev, { fetchMoreResult }) => {
                                            const newEdges = fetchMoreResult.companies.edges;
                                            const pageInfo = fetchMoreResult.companies.pageInfo;

                                            return newEdges.length ? {
                                                companies: {
                                                    __typename: prev.companies.__typename,
                                                    edges: [...prev.companies.edges, ...newEdges],
                                                    pageInfo
                                                }
                                            } : prev;
                                        }
                                    });
                                }}
                            >
                                <div className="row">
                                    {data.companies.edges.map((edge) => {
                                        return (
                                            <div key={edge.node.id} className="col-sm-4">
                                                <Company company={edge.node} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </InfiniteScroll>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default Companies;