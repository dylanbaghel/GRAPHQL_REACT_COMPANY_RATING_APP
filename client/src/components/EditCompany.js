import React from 'react';
import { Mutation, Query } from 'react-apollo';

import { GET_INDI_COMPANY, UPDATE_COMPANY } from './../graphql/server';
import { GET_AUTH } from './../graphql/client';

import CompanyForm from './CompanyForm';
import Unauthorized from './Unauthorized';
import NotFound from './NotFound';
import Loader from './Loader';
import Error from './Error';

const EditCompany = ({
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

                                if (!userData.auth.userId || userData.auth.userId !== data.company.creator.id) {
                                    return <Unauthorized />
                                }

                                return (
                                    <Mutation
                                        mutation={UPDATE_COMPANY}
                                    >
                                        {(updateCompany, { error, loading }) => {
                                            if (loading) {
                                                return <Loader />
                                            }
                                            return (
                                                <React.Fragment>
                                                    {error && <Error>{error.message}</Error>}
                                                    <CompanyForm
                                                        onSubmit={(updatedCompany) => {
                                                            updateCompany({
                                                                variables: {
                                                                    id: data.company.id,
                                                                    ...updatedCompany
                                                                }
                                                            }).then(() => {
                                                                history.replace(`/companies/${data.company.id}`);
                                                            }).catch(e => console.log(e));
                                                        }}
                                                        company={data.company}
                                                    />
                                                </React.Fragment>
                                            );
                                        }}
                                    </Mutation>
                                );
                            }}
                        </Query>
                    );
                }}
            </Query>
        </section>
    );
};

export default EditCompany;