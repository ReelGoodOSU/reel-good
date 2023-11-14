import React, { useState, useEffect } from 'react';
import "../App.css";
import { Card, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';


function MovieDetails() {
  const [movie, setMovie] = useState(null);
  const [actors, setActors] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const location = useLocation();

  // Extract the movieId from the URL path
  const movieId = location.pathname.split('/').pop();

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
            const moviesDetails = await Promise.all(movie.recommendations.map(async (movieId) => {
                const response = await fetch(`/movies/${movieId}`);
                const data = await response.json();
                return data; // Assuming the response contains the movie details
            }));
            setRecommendedMovies(moviesDetails);
        };

        fetchRecommendedMovies();
    }
}, [movie]);

  useEffect(() => {
    if (movie && movie.credits && movie.credits.cast) {
        const fetchActors = async () => {
            const actorDetails = await Promise.all(movie.credits.cast.map(async (actor) => {
                const response = await fetch(`/actors/${actor.id}`);
                const data = await response.json();
                return { ...actor, name: data.name };
            }));
            setActors(actorDetails);
        };

        fetchActors();
    }
}, [movie]);

    // Render logic goes here - for now, let's just render JSON to the screen
    return (
        <div>
        {/* Container for the title and back button */}
        <div className="title-and-back-button-container">
            <h1 className="large-bold-yellow">Movie Details</h1>
            {/* Back button */}
            <button onClick={() => window.history.back()} className="App-link back-button">
            Back
            </button>
        </div>
    
                {/* get the json and print it
            <pre className="lead text-white">{JSON.stringify(movie, null, 2)}</pre>
            */}

        {movie ? (
            <Card>
                <Row noGutters>
                    <Col md={4}>
                        <Card.Img 
                            variant="top" 
                            src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} 
                            alt="Movie Poster" 
                        />
                    </Col>
                    <Col md={8}>
                        <Card.Body>
                            <Card.Title>{movie.title}</Card.Title>
                            <Card.Text>
                                {movie.overview}
                            </Card.Text>
                        </Card.Body>
                    </Col>
                </Row>

                <Card.Body>
                    <Card.Title>Cast</Card.Title>
                    <ul>
                        {actors.map(actor => (
                            <li key={actor.id}>{actor.name} as {actor.character}</li>
                        ))}
                    </ul>
                    <Card.Title>Recommendations</Card.Title>
                    <ul>
                        {recommendedMovies.map(recommendedMovie => (
                            <li key={recommendedMovie.id}>
                                <a href={`/movies/${recommendedMovie.id}`}>{recommendedMovie.title}</a>
                            </li>
                        ))}
                    </ul>
                </Card.Body>
            </Card>
        ) : (
            <p className="lead text-white">Loading...</p>
        )}
        </div>
    );
  
  
}


export default MovieDetails;
