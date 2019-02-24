import React from 'react';
import { Query } from 'react-apollo';

import { COMPANY_RATINGS } from './../graphql/server';

import RatingItem from './RatingItem';
import Loader from './Loader';

const Ratings = ({
    companyId
}) => {
    return (
        <Query
            query={COMPANY_RATINGS}
            variables={{ id: companyId, orderBy: 'createdAt_DESC' }}
            fetchPolicy={'cache-and-network'}
        >
            {({ data: { companyRatings: ratings }, loading }) => {
                if (loading) {
                    return <Loader />
                }

                const style = {
                    overflow: 'auto',
                    height: ratings.edges.length > 5 ? '300px' : '100%'
                };

                if (ratings.edges.length === 0) {
                    return null;
                }

                return (
                    <div className="card card-body">
                        <h5 className="card-title">Ratings</h5>
                        <ul className="list-group" style={style}>
                            {ratings.edges.map(rating => {
                                return (
                                    <RatingItem
                                        key={rating.node.id}
                                        rating={rating.node}
                                    />
                                );
                            })}
                        </ul>
                    </div>
                );
            }}
        </Query>
    );
};


export default Ratings;