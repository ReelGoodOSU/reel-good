import React, { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import {
  Button,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Container,
} from "react-bootstrap";

// Renders the results for a single search hit
function SearchResultCard({ hit, isRecommendation}) {
    // Convert genre IDs to genre names
    const genreNames = hit["_source"].genre_ids.map(
      (id) => genreIdToName[id] || "Unknown"
    );

    // Check if the movie poster exists
    if (hit["_source"].backdrop_path || isRecommendation) {
      return (
        <Card className="bg-dark text-white search-entry d-flex justify-content-center">
          <Card.Img
            variant="bottom"
            src={
              "https://image.tmdb.org/t/p/original/" +
              hit["_source"].backdrop_path
            }
            alt="Movie Poster"
            className="movie-poster"
            class="card-img-top"
          />
          <Card.ImgOverlay>
            <Card
              style={{
                display: "inline-block",
                opacity: ".7",
                padding: "5px",
                color: "white",
              }}
              className="bg-dark cardClass"
            >
              <Card.Title>{hit["_source"].title}</Card.Title>
            </Card>
          </Card.ImgOverlay>
          <Link to={"/movies/" + hit["_id"]} className="stretched-link"></Link>
        </Card>
      );
    } else {
      // Render a different card when there's no movie poster
      return (
        <Card className="search-entry d-flex justify-content-center h-100">
          <Card.Body>
            <Card.Title>{hit["_source"].title}</Card.Title>
            <Card.Text>{hit["_source"].overview}</Card.Text>
          </Card.Body>
          <Link to={"/movies/" + hit["_id"]} className="stretched-link"></Link>
        </Card>
      );
    }
  }

export default SearchResultCard;