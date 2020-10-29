import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import Security from './pages/Security/Security';
import ProposalCreate from './pages/ProposalCreate/ProposalCreate';
import Dashboard from './pages/Dashboard/Dashboard';

const Routes = () => (
    <Router >
        <Switch>
            <Route exact path="/">
                <CreateAccount />
            </Route>
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/test">
                <Home />
            </Route>
            <Route path="/security">
                <Security />
            </Route>
            <Route path="/proposal-create">
                <ProposalCreate />
            </Route>
            <Route path="/dashboard">
                <Dashboard />
            </Route>
        </Switch>
    </Router>
);

export default Routes;