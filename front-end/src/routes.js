import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import CreateAccount from './pages/CreateAccount/CreateAccount';
import Security from './pages/Security/Security';
import PropsalCreate from './pages/ProposalCreate/ProposalCreate';
import Dashboard from './pages/Dashboard/Dashboard';
import ProposalDetail from './pages/ProposalDetail/ProposalDetail';
import ProposalEdit from './pages/ProposalEdit/ProposalEdit';
import ProposalVote from './pages/ProposalVote/ProposalVote';
import ProposalView from './pages/ProposalView/ProposalView';
import VoteSuccessfult from './pages/ProposalView/VoteSuccesfult';

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
                <PropsalCreate />
            </Route>
            <Route path="/dashboard">
                <Dashboard />
            </Route>
            <Route path="/proposal/:proposal_id">
                <ProposalDetail />
            </Route>
            <Route path="/proposal-edit/:proposal_id">
                <ProposalEdit />
            </Route>
            <Route path="/proposals-vote">
                <ProposalVote />
            </Route>
            <Route path="/vote">
                <ProposalView />
            </Route>
            <Route path="/succesfult">
                <VoteSuccessfult />
            </Route>
        </Switch>
    </Router >
);

export default Routes;