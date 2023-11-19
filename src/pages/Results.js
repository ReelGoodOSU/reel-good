import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import RecommendationForm from "../components/RecommendationForm";

function Results() {
  return (
    <Container fluid className="p-3">
      <Row className="mb-3 mt-5">
        <Col className="mt-5">
          <h1 className="large-bold-yellow">
            <strong>Results</strong>
          </h1>
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
        <Col>
          <Card bg="dark" text="white">
            <Card.Body>
              <Card.Title>Input</Card.Title>
              <RecommendationForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Results;
