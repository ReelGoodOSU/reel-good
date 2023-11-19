import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { Link, useParams } from "react-router-dom";

function PersonDetails() {
  // Take the id from the path of the URL and place in id variable
  const { id } = useParams();
  const [personDetails, setPersonDetails] = useState();

  useEffect(() => {
    fetch("/person/" + id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log the data to check its structure

        setPersonDetails(
          <Row className="mb-3 text-white">
            <Col>
                <Image
                  src={`https://image.tmdb.org/t/p/original/${data.profile_path}`}
                  alt={ data.name }
                  width="250px"
                  rounded
                />
            </Col>
            <Col>
              <h2>{ data.name }</h2>
              <p> { data.biography } </p>
            </Col>
            <Col>
             <Container>
              <Row>
                  <Col>
                    Place of Birth: { data.place_of_birth }
                  </Col>
                </Row>
                <Row>
                  <Col>
                    Birthday: { data.birthday }
                  </Col>
                </Row>
                {
                  data.deathday != null &&
                  <Row>
                    <Col>
                      Death: { data.deathday }
                    </Col>
                  </Row>
                }
             </Container>
            </Col>
          </Row>
        );
      })
      .catch((error) => {
        console.error("Error fetching person:", error);
      });
  }, []);

  return (
    <Container fluid className="p-3">
      {
        // Page is rendered by feting data from backend
      }
      {personDetails}
    </Container>
  );
}

export default PersonDetails;
