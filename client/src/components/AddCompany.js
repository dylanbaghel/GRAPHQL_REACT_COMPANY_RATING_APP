import React from 'react';
import { Mutation } from 'react-apollo';

import { CREATE_COMPANY } from './../graphql/server';

import CompanyForm from './CompanyForm';
import Loader from './Loader';
import Error from './Error';

const AddCompany = ({
    history
}) => {
    return (
        <section className="container">
            <Mutation
                mutation={CREATE_COMPANY}
            >
                {(createCompany, { loading, error }) => {
                    if (loading) {
                        return <Loader />
                    }
                    return (
                        <React.Fragment>
                            {error && <Error>{error.message}</Error>}
                            <CompanyForm
                                onSubmit={(data) => {
                                    createCompany({
                                        variables: {
                                            ...data
                                        }
                                    }).then(() => {
                                        history.replace("/dashboard");
                                    }).catch(e => {
                                        console.log(e);
                                    });
                                }}
                            />
                        </React.Fragment>
                    );
                }}
            </Mutation>
        </section>
    );
};

export default AddCompany;