import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import List from './Components/List';
import Home from './Components/Home';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/list" component={List}></Route>
          </Switch>
          <ul className="App">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/list">List</Link>
            </li>
          </ul>
        </nav>
      </div>
    </Router>
  );
}

export default App;
