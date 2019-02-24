import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="container">
            <div style={{textAlign: 'center', marginTop: '150px'}}>
            <h1>Company Rating</h1>
            <small className="text-muted">Created By Abhishek Baghel</small>
            <hr/>
            <Link to="/login" className="btn btn-primary btn-lg mr-1">Login</Link>
            <Link to="/signup" className="btn btn-danger btn-lg ml-1">Signup</Link>
            </div>
        </div>
    );
};

export default LandingPage;