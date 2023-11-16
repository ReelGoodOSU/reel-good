import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

function PersonDetails() {
  // Take the id from the path of the URL and place in id variable
  const { id } = useParams();
  const [PersonDetails, setPersonDetails] = useState();

  useEffect(() => {
    fetch("/person/" + id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log the data to check its structure

        //TODO: Figure out how we want to present the data
        setPersonDetails(
          <p className="text-white">
            <p>{data.name}</p>
            <Card.Img
              variant="top"
              src={`https://image.tmdb.org/t/p/original/${data.profile_path}`}
              alt={data.name}
            />
          </p>
        );
      })
      .catch((error) => {
        console.error("Error fetching person:", error);
      });
  }, []);

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
          <p className="lead text-white">This is some content</p>
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
        <Col>{PersonDetails}</Col>
      </Row>
    </Container>
  );
}

export default PersonDetails;
