import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
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
  );
};

export default Footer;
