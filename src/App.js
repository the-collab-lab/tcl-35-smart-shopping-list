import React from 'react';
import AddItem from '../src/components/AddItem';
import ListItem from '../src/components/ListItem';
import Home from '../src/components/Home';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

function App() {
  const existingToken = localStorage.getItem('currToken');

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/">
            <Home />
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
