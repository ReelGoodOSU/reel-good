import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { Link, useParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";

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
          <Container className="p-3 text-white">
            <Row className="mb-3">
              <Col>
                <Image
                  src={`https://image.tmdb.org/t/p/original/${data.profile_path}`}
                  alt={data.name}
                  width="250px"
                  rounded
                />
              </Col>
              <Col>
                <h2>{data.name}</h2>
                <p> {data.biography} </p>
              </Col>
              <Col>
                <Container>
                  <Row>
                    <Col>Place of Birth: {data.place_of_birth}</Col>
                  </Row>
                  <Row>
                    <Col>Birthday: {data.birthday}</Col>
                  </Row>
                  {data.deathday != null && (
                    <Row>
                      <Col>Death: {data.deathday}</Col>
                    </Row>
                  )}
                </Container>
              </Col>
            </Row>
            <Row className="flex-nowrap overflow-auto" sm={4}>
              {data.credits.map((movieId) => {
                return (
                  <Col>
                    <MovieCard id={movieId} />
                  </Col>
                );
              })}
            </Row>
          </Container>
        );
      })
      .catch((error) => {
        console.error("Error fetching person:", error);
      });
  }, []);

  return (
    <div>
      {
        // Page is rendered by feting data from backend
      }
      {personDetails}
    </div>
  );
}

export default PersonDetails;
