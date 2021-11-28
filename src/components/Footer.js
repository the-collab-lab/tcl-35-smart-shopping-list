import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <nav className="links-wrapper App-Navbar-Bottom fixed-bottom">
        <ul className="links mt-5 nav nav-pills nav-fill">
          <li className="nav-item">
            <NavLink to="/list" activeClassName="active nav-link p-2 selected">
              List
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/add" activeClassName="active nav-link p-2 selected">
              Add Item
            </NavLink>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
