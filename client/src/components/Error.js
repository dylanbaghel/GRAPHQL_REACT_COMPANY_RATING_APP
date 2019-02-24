import React from 'react';

class Error extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: true
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                isError: false
            });
        }, 5000);
    }

    render() {
        if (!this.state.isError) {
            return null;
        }
        return(
            <div className="alert alert-danger">
                {this.props.children}
            </div>
        );
    }
}

export default Error;