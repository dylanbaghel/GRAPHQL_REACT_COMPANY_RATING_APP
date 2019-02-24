import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'

import Header from './../components/Header';
import Companies from './../components/Companies';
import LandingPage from './../components/LandingPage';
import Signup from './../components/Signup';
import Login from './../components/Login';
import Dashboard from './../components/Dashboard';
import ShowCompany from './../components/ShowCompany';
import EditCompany from './../components/EditCompany';
import Profile from './../components/Profile';
import AddCompany from './../components/AddCompany';
import NotFound from './../components/NotFound';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export const history = createHistory();

const AppRouter = () => {
    return (
        <Router history={history}>
            <div>
                <Header />
                <Switch>
                    <PublicRoute 
                        exact path="/"
                        component={LandingPage}
                    />
                    <Route 
                        exact path="/companies"
                        component={Companies}
                    />
                    <Route 
                        exact path="/companies/:companyId"
                        component={ShowCompany}
                    />
                    <Route 
                        exact path="/companies/edit/:companyId"
                        component={EditCompany}
                    />
                    <PublicRoute 
                        exact path="/signup"
                        component={Signup}
                    />
                    <PublicRoute 
                        exact path="/login"
                        component={Login}
                    />
                    <PrivateRoute 
                        exact path="/add"
                        component={AddCompany}
                    />
                    <PrivateRoute 
                        exact path="/dashboard"
                        component={Dashboard}
                    />
                    <PrivateRoute 
                        exact path="/settings"
                        component={Profile}
                    />
                    <Route 
                        component={NotFound}
                    />
                </Switch>
            </div>
        </Router>
    );
};

export default AppRouter;