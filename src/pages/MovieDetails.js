import React, { useState, useEffect } from "react";
import "../App.css";
import {
  Container,
  Spinner,
  Card,
  Row,
  Col,
  Button,
  Image,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import ActorCard from "../components/ActorCard";
import MovieCard from "../components/MovieCard";

function MovieDetails() {
  const [movie, setMovie] = useState(null);
  const [actors, setActors] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const location = useLocation();

  // Extract the movieId from the URL path
  const movieId = location.pathname.split("/").pop();

  useEffect(() => {
    // Define an async function that will fetch the movie data
    const fetchMovieData = async () => {
      try {
        // Use fetch to make a GET request to your Flask endpoint
        const response = await fetch(`/movies/${movieId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Update the movie state with the fetched data
        setMovie(data);

        // Log the data to the console
        console.log(data);
      } catch (error) {
        console.error("Could not fetch movie data:", error);
      }
    };

    // Call the function
    fetchMovieData();
  }, [movieId]); // The effect will re-run if movieId changes

  useEffect(() => {
    if (movie && movie.recommendations) {
      const fetchRecommendedMovies = async () => {
        const moviesDetails = await Promise.all(
          movie.recommendations.map(async (movieId) => {
            const response = await fetch(`/movies/${movieId}`);
            const data = await response.json();
            return data; // Assuming the response contains the movie details
          })
        );
        setRecommendedMovies(moviesDetails);
      };

      fetchRecommendedMovies();
    }
  }, [movie]);

  useEffect(() => {
    if (movie && movie.credits && movie.credits.cast) {
      const fetchActors = async () => {
        const actorDetails = await Promise.all(
          movie.credits.cast.map(async (actor) => {
            const response = await fetch(`/person/${actor.id}`);
            const data = await response.json();
            return {
              ...actor,
              name: data.name,
              profile_path: data.profile_path,
            };
          })
        );
        setActors(actorDetails);
      };

      fetchActors();
    }
  }, [movie]);

  // Render logic goes here - for now, let's just render JSON to the screen
  return movie ? (
    <Container className="p-3 text-white">
      {/* Container for the title and back button */}
      <div className="title-and-back-button-container">
        <h1 className="large-bold-yellow">Movie Details</h1>
        {/* Back button */}
        <Button onClick={() => window.history.back()} variant="warning">
          Back
        </Button>
      </div>

      {/* get the json and print it
            <pre className="lead text-white">{JSON.stringify(movie, null, 2)}</pre>
            */}

      <Row noGutters>
        <Col md={4}>
          <Image
            variant="top"
            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
            alt={movie.title + " poster"}
            width="100%"
            rounded
          />
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title className="fs-3 fw-bold">{movie.title}</Card.Title>
              <Card.Text>{movie.overview}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <h3>Cast</h3>
      </Row>
      <Row
        noGutters
        style={{ height: "auto" }}
        className="flex-nowrap overflow-auto"
        sm={4}
      >
        {actors ? (
          actors.map((actor) => {
            return (
              <Col>
                <ActorCard actor={actor} />
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
        <h3>Recommendations</h3>
      </Row>
      <Row className="flex-nowrap overflow-auto" sm={4}>
        {recommendedMovies ? (
          recommendedMovies.map((recommendedMovie) => {
            return (
              <Col>
                <MovieCard movie={recommendedMovie} />
              </Col>
            );
          })
        ) : (
          <Spinner animation="border" role="status" className="mx-auto">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
      </Row>
    </Container>
  ) : (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

export default MovieDetails;
