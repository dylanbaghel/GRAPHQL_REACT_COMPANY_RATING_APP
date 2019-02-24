import React from 'react';
import classNames from 'classnames';
import { isEmail } from 'validator';
import CheckSwitch from 'react-switch';
import Chips from 'react-chips';

class AddCompany extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.company ? this.props.company.title : "",
            email: this.props.company ? this.props.company.email : "",
            phone: this.props.company ? this.props.company.phone : "",
            description: this.props.company && this.props.company.description ? this.props.company.description : "",
            published: this.props.company ? this.props.company.published : false,
            services: this.props.company ? this.props.company.services: [],
            errors: {}
        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePublishedChange = this.handlePublishedChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearState = this.clearState.bind(this);
        this.handleServicesChange = this.handleServicesChange.bind(this);
    }

    handleTitleChange(e) {
        const title = e.target.value;
        this.setState(() => ({
            title
        }));
    }

    handleEmailChange(e) {
        const email = e.target.value;
        this.setState(() => ({
            email
        }));
    }

    handlePhoneChange(e) {
        const phone = e.target.value;
        this.setState(() => ({
            phone
        }));
    }

    handlePublishedChange(e) {
        this.setState((prevState) => ({
            published: !prevState.published
        }));
    }

    handleServicesChange(chips) {
        this.setState(() => ({
            services: chips
        }));
    }

    handleDescriptionChange(e) {
        const description = e.target.value;
        this.setState(() => ({
            description
        }));
    }

    clearState() {
        this.setState(() => ({
            title: "",
            email: "",
            phone: "",
            published: false,
            errors: {},
            services: []
        }));
    }

    handleSubmit(e, createCompany) {
        e.preventDefault();
        if (!this.state.title) {
            this.setState(() => ({
                errors: { title: "Title is Required" }
            }));
            return;
        }
        if (!this.state.email) {
            this.setState(() => ({
                errors: { email: "Email is Required" }
            }));
            return;
        } else if (!isEmail(this.state.email)) {
            this.setState(() => ({
                errors: { email: "Invalid Email" }
            }));
            return;
        }
        if (!this.state.phone) {
            this.setState(() => ({
                errors: { phone: "Phone is Required " }
            }));
            return;
        }
        if (this.state.services.length === 0) {
            this.setState(() => ({
                errors: { services: "Add Atleast One Service" }
            }));
            return;
        }

        this.props.onSubmit({
            title: this.state.title,
            email: this.state.email,
            phone: this.state.phone,
            description: this.state.description,
            published: this.state.published,
            services: this.state.services
        });
        this.clearState();
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Add Company</h5>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Enter Title"
                                value={this.state.title}
                                onChange={this.handleTitleChange}
                                className={classNames('form-control', {
                                    'is-invalid': this.state.errors.title
                                })}
                            />
                            <div className="invalid-feedback">{this.state.errors.title}</div>
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Enter Company Email"
                                value={this.state.email}
                                onChange={this.handleEmailChange}
                                className={classNames('form-control', {
                                    'is-invalid': this.state.errors.email
                                })}
                            />
                            <div className="invalid-feedback">{this.state.errors.email}</div>
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                placeholder="Enter Company Phone"
                                value={this.state.phone}
                                onChange={this.handlePhoneChange}
                                className={classNames('form-control', {
                                    'is-invalid': this.state.errors.phone
                                })}
                            />
                            <div className="invalid-feedback">{this.state.errors.phone}</div>
                        </div>
                        <div className="form-group">
                            <textarea value={this.state.description}
                                    onChange={this.handleDescriptionChange}
                                    className={classNames('form-control', {
                                        'is-invalid': this.state.errors.description
                                    })}
                                    placeholder="Company Description(Optional)"
                            ></textarea>
                            <div className="invalid-feedback">{this.state.errors.description}</div>
                        </div>
                        <div className="form-group">
                            <CheckSwitch
                                checked={this.state.published}
                                onChange={this.handlePublishedChange}
                            />
                        </div>
                        <Chips
                            value={this.state.services}
                            onChange={this.handleServicesChange}
                            suggestions={["Java", "JavaScript", "Python"]}
                            createChipKeys={[13]}
                            uniqueChips={true}
                            placeholder={'Services'}

                        />
                        {this.state.errors.services && <p style={{fontSize: '13px'}} className="text-danger">{this.state.errors.services}</p>}
                        <button type="submit" className="btn btn-success mt-3">Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddCompany;