import React from 'react';
import ReactStars from 'react-stars';
import { Mutation } from 'react-apollo';

import { ADD_RATING, COMPANY_RATINGS } from './../graphql/server';

import Loader from './Loader';

class AddRating extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            star: null,
            comment: ""
        };
        this.handleStarChange = this.handleStarChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.clearState = this.clearState.bind(this);
    }

    handleStarChange(newStar) {
        this.setState(() => ({
            star: newStar
        }));
    }

    handleCommentChange(e) {
        const comment = e.target.value;
        this.setState(() => ({
            comment
        }));
    }

    handleSubmit(createRating) {
        const { star, comment } = this.state;
        if (star && comment) {
            createRating({
                variables: {
                    comment: this.state.comment,
                    star: this.state.star,
                    company: this.props.companyId
                },
                refetchQueries: [{ query: COMPANY_RATINGS, variables: { id: this.props.companyId, orderBy: 'createdAt_DESC' }}]
            });
            this.clearState();
        }
    }

    clearState() {
        this.setState(() => ({
            star: null,
            comment: ""
        }));
    }

    render() {
        return (
            <Mutation
                mutation={ADD_RATING}
            >
                {(createRating, { loading, error }) => {
                    if (loading) {
                        return <Loader />
                    }
                    return (
                        <div className="card">
                            <div className="card-body">
                                {error && <p>{error.message}</p>}
                                <h5 className="card-title">Add Comment</h5>
                                <input
                                    type="text"
                                    placeholder="Enter Comment"
                                    value={this.state.comment}
                                    onChange={this.handleCommentChange}
                                    className="form-control"
                                />
                                <ReactStars
                                    count={5}
                                    value={this.state.star}
                                    onChange={this.handleStarChange}
                                    size={40}
                                    color2={'#ff0000'}
                                />
                                <button onClick={() => {
                                    this.handleSubmit(createRating);
                                }} className="btn btn-dark">Add Comment</button>
                            </div>
                        </div>
                    );
                }}
            </Mutation>
        );
    }
}

export default AddRating;