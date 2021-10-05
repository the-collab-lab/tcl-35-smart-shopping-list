import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

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
        <nav className="links-wrapper">
          <ul className="links">
            <li className={`link list-link ${activeList ? 'active' : ''}`}>
              <Link
                to="/list"
                onClick={() => (setActiveAdd(false), setActiveList(true))}
              >
                List
              </Link>
            </li>
            <li className={`link add-link ${activeAdd ? 'active' : ''}`}>
              <Link
                to="/add"
                onClick={() => (setActiveList(false), setActiveAdd(true))}
              >
                Add Item
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </Router>
  );
}

export default App;
