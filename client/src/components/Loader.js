import React from 'react';
import SpinLoader from './../assets/spin_loader.svg';

const Loader = () => {
    return (
        <section className="container">
            <div className="loader">
                <img src={SpinLoader} alt="Loading..."/>
            </div>
        </section>
    );
};

export default Loader;