import React, { useEffect, useState } from "react";
import { Container, Row, Col, Accordion, Spinner, Card } from "react-bootstrap";
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
        let movieDetails = await Promise.all(
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
        movieDetails = movieDetails.filter((entry) => entry !== null);
        // Sort movies by popularity, with most popular first in the array
        setMovies(
          movieDetails.sort((a, b) =>
            a.popularity === null || b.popularity === null
              ? 0
              : b.popularity - a.popularity
          )
        );
        console.log(movieDetails);
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
        {/* Container for the title and back button */}
        <div className="title-and-back-button-container">
            <h1 className="large-bold-yellow">Actor Details</h1>
            {/* Back button */}
            <button onClick={() => window.history.back()} className="App-link back-button">
            Back
            </button>
        </div>
      <Row>
        <Col>
          <Image
            src={`https://image.tmdb.org/t/p/original/${person.profile_path}`}
            alt={person.name}
            width="100%"
            rounded
          />
          <Card>
            <Card.Body>
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
            </Card.Body>
          </Card>
        </Col>
        <Col sm={8}>
          <Card>
            <Card.Body>
              <Card.Title className="fs-3 fw-bold">{person.name}</Card.Title>
              <Card.Text>{person.biography}</Card.Text>
            </Card.Body>
          </Card>
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
          <Spinner animation="border" role="status" className="mx-auto">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
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
                          {movie.release_date && movie.release_date + ": "}{" "}
                          <a href={`/movies/${movie.id}`}>{movie.title}</a>
                        </li>
                      );
                    })
                  }
                </ul>
              ) : (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
    </Container>
  ) : (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

export default PersonDetails;
