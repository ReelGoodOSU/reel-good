import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import SearchForm from "../components/SearchForm";

function HomePage() {
  return (
    <Container fluid className="p-3">
      <Row className="mb-3">
        <Col className="mt-5">
          <h1 className="display-4 text-white">Welcome to Reel Good</h1>
          <p className="lead text-white">
            The app that helps you find movies that you might like based on your
            preferences and ratings.
          </p>
        </Col>
        <Col>
          <div className="float-end">
            <div className="btn-group">
              <Button variant="success" as={Link} to="/login">
                Log in now
              </Button>
              <Button variant="primary" as={Link} to="/signup">
                Sign up now
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Card bg="dark" text="white">
            <Card.Body>
              <Card.Title>Search Movies</Card.Title>
              <SearchForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
