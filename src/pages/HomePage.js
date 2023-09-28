import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import SearchForm from "../components/SearchForm";

function HomePage() {
  return (
    <Container fluid className="p-3">
      <Row className="mb-3">
        <Col>
          <h1 className="display-4">Welcome to Reel Good</h1>
          <p className="lead">
            This is a webapp that helps you find movies that you might like
            based on your preferences and ratings.
          </p>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>How it works</Card.Title>
              <Card.Text>
                To get started, you need to create an account and log in. Then
                you can browse through our catalog of movies and rate the ones
                that you have seen or want to see. Based on your ratings, we
                will generate personalized recommendations for you. You can also
                search for movies by genre, year, director, actor, or keyword.
                You can also view the details, reviews, and trailers of each
                movie.
              </Card.Text>
              <Button variant="primary" as={Link} to="/signup">
                Sign up now
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Why use Reel Good</Card.Title>
              <Card.Text>
                Reel Good is a webapp that uses advanced machine learning
                algorithms to provide you with the best movie suggestions.
                Unlike other websites that rely on popularity or critics'
                ratings, Reel Good takes into account your personal taste and
                preferences. You can also discover new movies that you might
                have missed or overlooked. Reel Good is easy to use, fast, and
                fun. Try it today and see for yourself.
              </Card.Text>
              <Button variant="success" as={Link} to="/login">
                Log in now
              </Button>
            </Card.Body>
          </Card>
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
