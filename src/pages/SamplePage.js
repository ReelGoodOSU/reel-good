import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

function SamplePage() {
  // This is a mock state for demonstration purposes only
  const [movies] = React.useState([
    {
      id: 1,
      title: "The Shawshank Redemption",
      year: 1994,
      genre: "Drama",
      director: "Frank Darabont",
      actors: "Tim Robbins, Morgan Freeman",
      rating: 5,
      poster:
        "https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg",
    },
    {
      id: 2,
      title: "The Godfather",
      year: 1972,
      genre: "Crime",
      director: "Francis Ford Coppola",
      actors: "Marlon Brando, Al Pacino",
      rating: 4,
      poster:
        "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg",
    },
    {
      id: 3,
      title: "The Dark Knight",
      year: 2008,
      genre: "Action",
      director: "Christopher Nolan",
      actors: "Christian Bale, Heath Ledger",
      rating: 5,
      poster:
        "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg",
    },
    {
      id: 4,
      title: "The Matrix",
      year: 1999,
      genre: "Sci-Fi",
      director: "Lana Wachowski, Lilly Wachowski",
      actors: "Keanu Reeves, Laurence Fishburne",
      rating: 4,
      poster:
        "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg",
    },
    {
      id: 5,
      title: "The Lord of the Rings: The Return of the King",
      year: 2003,
      genre: "Fantasy",
      director: "Peter Jackson",
      actors: "Elijah Wood, Ian McKellen",
      rating: 5,
      poster:
        "https://upload.wikimedia.org/wikipedia/en/thumb/2/23/The_Lord_of_the_Rings%2C_TROTK_%282003%29.jpg/220px-The_Lord_of_the_Rings%2C_TROTK_%282003%29.jpg",
    },
  ]);

  // This is a mock function for demonstration purposes only
  const handleRecommend = () => {
    // This is a mock algorithm for demonstration purposes only
    // It randomly selects three movies from the state and returns them as recommendations
    const recommendations = [];
    while (recommendations.length < 3) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      const randomMovie = movies[randomIndex];
      if (!recommendations.includes(randomMovie)) {
        recommendations.push(randomMovie);
      }
    }
    alert(
      `Your recommendations are:\n${recommendations
        .map((movie) => movie.title)
        .join("\n")}`
    );
  };

  return (
    <Container fluid className="contact-content debug-border">
      <div className="App">
        <div className="div1">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">
              Reel Good
            </a>
            <a className="nav-link" href="/">
              Home&nbsp;&nbsp;
            </a>
            <a className="nav-link" href="/sample">
              Sample Page
            </a>
          </nav>
        </div>

        <div className="div2">
          {movies.map((movie) => (
            <Col key={movie.id} md={4} lg={3} className="mb-3">
              <Card>
                <Card.Img variant="top" src={movie.poster} />
                <Card.Body>
                  <Card.Title className="text-center">{movie.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted text-center">
                    {movie.year}
                  </Card.Subtitle>
                  <Card.Text>
                    Genre: {movie.genre}
                    <br />
                    Director: {movie.director}
                    <br />
                    Actors: {movie.actors}
                    <br />
                    Rating: {movie.rating} / 5
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}

          <Row className="mb-3">
            <Col>
              <Button variant="primary" onClick={handleRecommend}>
                Recommend
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
}

export default SamplePage;
