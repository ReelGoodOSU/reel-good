import React, { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Navbar, Nav, Container } from "react-bootstrap";
import "../App.css";

function Header() {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/recommendation">Recommendations</Nav.Link>
          <Nav.Link href="/">Browse</Nav.Link>
        </Nav>
        <div className="btn-group">
          <Button variant="success" as={Link} to="/login">
            Log in
          </Button>
          <Button variant="primary" as={Link} to="/signup">
            Sign up
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
