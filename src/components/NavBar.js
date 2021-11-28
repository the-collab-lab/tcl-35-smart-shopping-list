import React from 'react';

import { Navbar, Container } from 'react-bootstrap';

const NavBar = ({ title }) => {
  return (
    <Navbar
      title="banner"
      bg="success"
      variant="dark"
      expand="lg"
      className="nav"
    >
      <Container className="d-flex justify-content-center">
        <h1 className="h2 nav-h1 text-uppercase text-white text-center py-2">
          {title}
        </h1>
      </Container>
    </Navbar>
  );
};

export default NavBar;
