import React from 'react';
import AddItem from '../src/components/AddItem';
import ListItem from '../src/components/ListItem';
import Home from '../src/components/Home';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app container">
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
        <footer>
          <nav className="links-wrapper">
            <ul className="links">
              <li>
                <NavLink to="/list" activeClassName="active">
                  List
                </NavLink>
              </li>
              <li>
                <NavLink to="/add" activeClassName="active">
                  Add Item
                </NavLink>
              </li>
            </ul>
          </nav>
        </footer>
      </div>
    </Router>
  );
}

export default App;
