import React, { useEffect, useState } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { useParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";

function PersonDetails() {
  // Take the id from the path of the URL and place in id variable
  const { id } = useParams();
  const [person, setPerson] = useState();
  const [movies, setMovies] = useState();

  // Used to set up an array holding the movie entries for the person
  useEffect(() => {
    if (person && person.credits) {
      // Function used to fetch the data for all the movies the actor is in
      const fetchMovies = async () => {
        // Store array of movie data in movieDetails
        const movieDetails = await Promise.all(
          person.credits.map(async (movieId) => {
            const response = await fetch(`/movies/${movieId}`);
            if (!response.ok) {
              return null;
            }
            const data = await response.json();
            return data;
          })
        );
        // Set movies variable to hold array of movie data, ignore null entries
        setMovies(movieDetails.filter((entry) => entry !== null));
      };

      fetchMovies();
    }
  }, [person]);

  // Used to load the data for a person
  useEffect(() => {
    // Fetch the data for the person with id
    fetch("/person/" + id)
      .then((response) => response.json())
      .then((data) => {
        // Set the person variable
        setPerson(data);
      })
      .catch((error) => {
        console.error("Error fetching person:", error);
      });
  }, [id]);

  return person ? (
    <Container className="p-3 text-white">
      <Row className="mb-3">
        <Col>
          <Image
            src={`https://image.tmdb.org/t/p/original/${person.profile_path}`}
            alt={person.name}
            width="250px"
            rounded
          />
        </Col>
        <Col>
          <h2>{person.name}</h2>
          <p> {person.biography} </p>
        </Col>
        <Col>
          <Container>
            <Row>
              <Col>Place of Birth: {person.place_of_birth}</Col>
            </Row>
            <Row>
              <Col>Birthday: {person.birthday}</Col>
            </Row>
            {person.deathday != null && (
              <Row>
                <Col>Death: {person.deathday}</Col>
              </Row>
            )}
          </Container>
        </Col>
      </Row>
      <Row className="flex-nowrap overflow-auto" sm={4}>
        {movies ? (
          movies.slice(0, 25).map((movie) => {
            return (
              <Col>
                <MovieCard movie={movie} />
              </Col>
            );
          })
        ) : (
          <p>Loading ...</p>
        )}
      </Row>
      <Row>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Full Credits List</Accordion.Header>
            <Accordion.Body>
              {movies ? (
                <ul>
                  {
                    // Render a list of movies that the person was involved in
                    movies.map((movie) => {
                      return (
                        <li key={movie.id}>
                          <a href={`/movies/${movie.id}`}>{movie.title}</a>
                        </li>
                      );
                    })
                  }
                </ul>
              ) : (
                <p>Loading ...</p>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
    </Container>
  ) : (
    <p className="lead text-white">Loading...</p>
  );
}

export default PersonDetails;
