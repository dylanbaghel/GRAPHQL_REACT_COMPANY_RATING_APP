import React from 'react';

const NoInternet = () => {
    return (
        <section className="container">
            <div id="notfound">
                <div className="notfound">
                    <div className="notfound-404">
                        <h3>Oops! No Internet</h3>
                        <h1><span>E</span><span>N</span><span>D</span></h1>
                    </div>
                    <h2>we've detected that you are not connected to internet, Please Connect To Internet To Use This Website</h2>
                </div>
            </div>
        </section>
    );
};

export default NoInternet;