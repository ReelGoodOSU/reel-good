import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import "../App.css";

function ActorCard({ actor }) {
  // Format each actor entry as a card, just use image and title
  console.log(actor);
  return (
    actor && (
      <Card className="h-100">
        {actor.profile_path ? (
          <Card.Img
            variant="top"
            src={`https://image.tmdb.org/t/p/original/${actor.profile_path}`}
          />
        ) : (
          <p>No available image</p>
        )}
        <Card.Title>
          {actor.name} as {actor.character}
        </Card.Title>
        <Link to={`/person/${actor.id}`} className="stretched-link"></Link>
      </Card>
    )
  );
}

export default ActorCard;
