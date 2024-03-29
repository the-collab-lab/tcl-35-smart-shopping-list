import React from 'react';
import AddItem from '../src/components/AddItem';
import ListItem from '../src/components/ListItem';
import Home from '../src/components/Home';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { ArchivalNoticeModal } from '@the-collab-lab/shopping-list-utils';

function App() {
  const existingToken = localStorage.getItem('currToken');

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/">
            <>
              <Home />
              <ArchivalNoticeModal />
            </>
          </Route>
          <Route exact path="/add">
            <AddItem />
          </Route>
          <Route exact path="/list">
            <ListItem />
          </Route>
        </Switch>
        {existingToken ? <Redirect to="/list" /> : <Redirect to="/" />}
      </div>
    </Router>
  );
}

export default App;
