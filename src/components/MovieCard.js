import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Card, Form, InputGroup } from "react-bootstrap";
import "../App.css";

function MovieCard({ id }) {
  const [movie, setMovie] = useState(null);

  // Load in the data for the movie, if we get an error, keep it as null
  useEffect(() => {
    fetch("/movies/" + id)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error("Could not find movie");
        }
        setMovie(data);
        console.log(movie);
      })
      .catch((error) => {});
  }, []);

  // Format each movie entry as a card, just use image and title
  return (
    movie && (
      <Card>
        <Card.Img
          variant="top"
          src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
        />
        <Card.Title>{movie.title}</Card.Title>
      </Card>
    )
  );
}

export default MovieCard;
