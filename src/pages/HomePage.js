import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import SearchForm from "../components/SearchForm";

function HomePage() {
  return (
    <Container fluid className="p-3">
      <Row className="mb-3 mt-5">
        {
          // Header of the website, has title and description of the website
        }
        <Col className="mt-5">
          <h1 className="large-bold-yellow">
            <strong>Reel Good</strong>
          </h1>
          <p className="lead text-white">
            The app that helps you find movies that you will enjoy based on your
            preferences and ratings.
          </p>
        </Col>
        <Col>
          <div className="float-end">
            <div className="btn-group">
              <Button variant="success" as={Link} to="/login">
                Log in
              </Button>
              <Button variant="primary" as={Link} to="/signup">
                Sign up
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        {
          // Setup for the search form
        }
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
