import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import RecommendationForm from "../components/RecommendationForm";

function RecommendationPage() {
  return (
    <Container fluid className="p-3">
      <Row className="mb-1 mt-2">
        {
          // Header of the website, has title and description of the website
        }
        <Col className="mt-5">
          <h1 className="large-bold-yellow">
            <strong>Recommendations</strong>
          </h1>
          <p className="lead text-white">Select 5 or more movies to begin!</p>
        </Col>
        <Col></Col>
      </Row>
      <Row className="mb-3">
        {
          // Setup for the search form
        }
        <Col>
          <Card bg="dark" text="white">
            <Card.Body>
              <RecommendationForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RecommendationPage;
