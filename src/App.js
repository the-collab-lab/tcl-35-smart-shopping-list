import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
} from 'react-router-dom';

import ListItems from './Components/ListItems';
import Home from './Components/Home';
import AddItem from './Components/AddItem';

import './App.css';

function App() {
  const [activeAdd, setActiveAdd] = useState(false);
  const [activeList, setActiveList] = useState(false);

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
            <ListItems />
          </Route>
        </Switch>
        <footer>
          <nav className="links-wrapper">
            <ul className="links">
              <li className={`link list-link ${activeList ? 'active' : ''}`}>
                <NavLink to="/list" activeClassName="active">
                  List
                </NavLink>
              </li>
              <li className={`link add-link ${activeAdd ? 'active' : ''}`}>
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
