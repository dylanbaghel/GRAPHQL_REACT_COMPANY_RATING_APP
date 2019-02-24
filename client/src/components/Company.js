import React from 'react';
import { Link } from 'react-router-dom';

const Company = ({
    company
}) => {
    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">{company.title}</h5>
                <p className="card-text">{company.email}</p>
                <Link to={`/companies/${company.id}`} className="btn btn-dark">View Company</Link>
            </div>
        </div>
    );
};

export default Company;