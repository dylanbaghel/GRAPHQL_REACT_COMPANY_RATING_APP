import React from 'react';
import { Query, Mutation } from 'react-apollo';
import RatingStars from 'react-stars';

import { GET_AUTH } from './../graphql/client';
import { DELETE_RATING, COMPANY_RATINGS, UPDATE_RATING } from './../graphql/server';
import { getFullDateTime } from './../utils/utils';

import Loader from './Loader';

class RatingItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            star: 0,
            comment: ""
        };
        this.clearState = this.clearState.bind(this);
        this.editRating = this.editRating.bind(this);
    }

    editRating(updateRating) {
        if (this.state.comment.length > 0) {
            updateRating({
                variables: {
                    id: this.props.rating.id,
                    star: this.state.star,
                    comment: this.state.comment
                },
                refetchQueries: [
                    {query: COMPANY_RATINGS, variables: { id: this.props.rating.company.id }}
                ]
            }).then(() => {
                this.clearState();
            }).catch(e => {
                console.log(e.message);
            });
        }
    }

    renderShowRating(userData) {
        return (
            <Mutation
                mutation={DELETE_RATING}
            >
                {(deleteRating, { loading }) => {
                    if (loading) {
                        return <Loader />
                    }
                    return (
                        <li className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{this.props.rating.comment}</h5>
                                {userData.auth.userId && userData.auth.userId === this.props.rating.creator.id && <small><span style={{cursor: 'pointer', fontSize: '16px', marginRight: '10px'}} onClick={() => {
                                    this.setState(() => ({
                                        isEdit: true,
                                        star: this.props.rating.star,
                                        comment: this.props.rating.comment
                                    }));
                                }}><i className="fas fa-pencil-alt"></i></span><span style={{ cursor: 'pointer', fontSize: '16px' }} onClick={() => {
                                    deleteRating({
                                        variables: {
                                            id: this.props.rating.id
                                        },
                                        refetchQueries: [{ query: COMPANY_RATINGS, variables: { id: this.props.rating.company.id, orderBy: 'createdAt_DESC' } }]
                                    });
                                }}><i className="fas fa-trash"></i></span></small>}
                            </div>
                            <p className="mb-1 text-muted">{getFullDateTime(this.props.rating.createdAt)}</p>
                            <RatingStars size={20} value={this.props.rating.star} edit={false} />
                            <small>{this.props.rating.creator.name}</small>
                        </li>
                    );
                }}
            </Mutation>
        );
    }

    clearState() {
        this.setState(() => ({
            isEdit: false,
            comment: "",
            star: 0
        }));
    }

    renderEditRating() {
        return (
            <Mutation
                mutation={DELETE_RATING}
            >
                {(deleteRating, { loading }) => {
                    if (loading) {
                        return <Loader />
                    }
                    return (
                        <li className="list-group-item list-group-item-action">
                            <div className="d-flex w-100 justify-content-between">
                                <input
                                    value={this.state.comment}
                                    onChange={(e) => {
                                        const comment = e.target.value;
                                        this.setState(() => ({
                                            comment
                                        }));
                                    }}
                                    placeholder="Enter Comment"
                                    className="form-control w-50"
                                    required
                                />
                                <Mutation
                                    mutation={UPDATE_RATING}
                                >
                                    {(updateRating) => {
                                        return (
                                            <button onClick={() => {
                                                this.editRating(updateRating);
                                            }} className="btn btn-dark">Save</button>
                                        );
                                    }}
                                </Mutation>
                                <button onClick={() => {
                                    this.clearState();
                                }} className="btn btn-secondary">Cancel</button>
                            </div>
                            <p className="mb-1 text-muted">{getFullDateTime(this.props.rating.createdAt)}</p>
                            <RatingStars size={20} color2={'#ff0000'} onChange={(star) => {
                                this.setState(() => ({
                                    star
                                }));
                            }} value={this.state.star} edit={true} />
                            <small>{this.props.rating.creator.name}</small>
                        </li>
                    );
                }}
            </Mutation>
        );
    }

    render() {
        return (
            <Query
                query={GET_AUTH}
            >
                {({ data: userData }) => {
                    return (
                        <React.Fragment>
                            {!this.state.isEdit && this.renderShowRating(userData)}
                            {this.state.isEdit && this.renderEditRating()}
                        </React.Fragment>
                    );
                }}
            </Query>
        );
    }
}

export default RatingItem;