import React, { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { Button, Row, Col, Card, Form, InputGroup } from "react-bootstrap";

// Renders the results for a single search hit
function SearchResult({ hit, onMovieSelect, selectedMovies }) {
  const isMovieSelected = selectedMovies.some(
    (movie) => movie["_id"] === hit["_id"]
  );
  const [isChecked, setIsChecked] = useState(isMovieSelected);
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    if (event.target.checked) {
      onMovieSelect(event, hit);
    } else {
      console.log(`Unselected movie: ${hit["_source"].title}`);
      onMovieSelect(event, hit);
    }
  };
  // TODO: Make the rendering of the movies better include details like actors and genre
  return (
    <Col className="search-entry">
      <Card>
        <Card.Body>
          <Row>
            <Col>
              <b>Movie: </b>
              <i>
                <Link to={"/movies/" + hit["_id"]} className="App-link">
                  {hit["_source"].title}
                </Link>
              </i>
            </Col>
            <Col>
              <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                label="I Liked This Movie"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
}

function AutocompleteSuggestion({ hit, onSuggestionClick }) {
  const handleClick = (event) => {
    onSuggestionClick(event, hit["_source"].title);
  };

  return (
    <Col className="search-entry">
      <div className="clickable-card" onClick={handleClick}>
        <Card>
          <Card.Body>
            <i>{hit["_source"].title}</i>
          </Card.Body>
        </Card>
      </div>
    </Col>
  );
}

// This function will update the JSON representation of the modifed value
function formReducer(state, event) {
  // event stores the name and value of the modified field, update it and leave
  // everything else unmodified
  return {
    ...state,
    [event.name]: event.value,
  };
}

function RecommendationForm() {
  // Default formData shouldn't be empty, this is used to hold all data from form
  const [formData, setFormData] = useReducer(formReducer, {
    search_query: "",
    search_by: "title",
  });
  // Field is rendered once we search
  const [searchResults, setSearchResults] = useState();
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const onMovieSelect = (event, hit) => {
    console.log(`Selected movie: ${hit["_source"].title}`);
    if (event.target.checked) {
      setSelectedMovies((prevMovies) => [...prevMovies, hit]);

      // todo:
      // render Get Recommendations button available when 5th movie is selected
    } else {
      console.log(`Trying to remove movie: ${hit["_source"].title}`);
      setSelectedMovies((prevMovies) =>
        prevMovies.filter((movie) => {
          const isMatch = movie["_id"] !== hit["_id"];
          console.log(
            `Comparing IDs: ${movie["_id"]} vs ${hit["_id"]}, isMatch: ${isMatch}`
          );
          return isMatch;
        })
      );
      // todo:
      // render Get Recommendations button unavailable when 5th movie is deselected
    }
  };

  // Function for handling a submit request
  const handleSubmit = (event) => {
    // Don't perform a GET request
    event.preventDefault();
    performSearch(formData);
  };

  // Given an event, this function sets up the name and value of the form component to be updated
  const handleChange = (event) => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
    });

    // Fetch autocomplete suggestions based on the input value and searchBy
    fetch(`/autocomplete?` + new URLSearchParams(formData))
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log the data to check its structure
        setAutocompleteSuggestions(data);
      })
      .catch((error) => {
        console.error("Error fetching autocomplete suggestions:", error);
      });
  };

  const handleSuggestionClick = (event, suggestion) => {
    // Prevent the default behavior of the event, e.g., preventing page refresh on click
    event.preventDefault();

    setFormData({
      name: "search_query",
      value: suggestion,
    });

    performSearch({
      search_by: formData.search_by,
      search_query: suggestion,
    });
  };

  const performSearch = (searchData) => {
    // Make API request to get search results
    fetch("/search?" + new URLSearchParams(searchData))
      .then((response) => response.json())
      .then((data) => {
        // This block of code parses and renders the search results
        // Log data recieved for debug purposes
        console.log(data);
        // Render the search results that were returned
        setSearchResults(
          <div className="search-results">
            <ul className="search-entries">
              {
                // For each hit we receive render an entry (title and description) for it
              }
              {data.map((hit) => (
                <SearchResult
                  hit={hit}
                  key={hit["_id"]}
                  onMovieSelect={onMovieSelect}
                  selectedMovies={selectedMovies}
                />
              ))}
            </ul>
          </div>
        );
        // Clear autocomplete suggestions when search is triggered
        setAutocompleteSuggestions([]);
      });
  };

  function RecommendationResult({ hit }) {
    // Check if the movie poster exists
    if (hit["_source"].backdrop_path) {
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
        <Card className=" search-entry d-flex justify-content-center">
          <Card.Body>
            <Card.Title>{hit["_source"].title}</Card.Title>
            <Card.Text>{hit["_source"].overview}</Card.Text>
          </Card.Body>
          <Link to={"/movies/" + hit["_id"]} className="stretched-link"></Link>
        </Card>
      );
    }
  }

  const GetRecommendationsButton = () => {
    const handleClick = async () => {
      const query_string = selectedMovies
        .map((selection, index) => `seeds[]=${selection["_source"].id}`)
        .join("&");

      fetch("/get-recommendations?" + query_string)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setRecommendations(data); // Set recommendations in the state
        });
    };

    return (
      <div>
        <button onClick={handleClick}>Get Recommendations</button>
        {recommendations.length > 0 && (
          <div>
            <h3>Recommendations:</h3>
            <ul>
              <Col xs={8} md={9} lg={10}>
                <Row g={false}>
                  {recommendations.map((recommendation) => (
                    // <li key={recommendation["_source"].id}>
                    //   <strong>Title:</strong> {recommendation["_source"].title},{" "}
                    //   <strong>ID:</strong> {recommendation["_source"].id}
                    // </li>
                    <Col xs={12} sm={6} lg={6} xl={6} xxl={4}>
                      <RecommendationResult
                        hit={recommendation}
                        key={recommendation["_id"]}
                      />
                    </Col>
                  ))}
                </Row>
              </Col>
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Generate the HTML to return
  return (
    <div className="search-form">
      <h2>Selected Movies</h2>
      <ul key={selectedMovies.length}>
        {selectedMovies.map((movie) => (
          <li key={movie["_id"]}>{movie["_source"].title}</li>
        ))}
      </ul>

      <Form onSubmit={handleSubmit}>
        {
          // Basic search bar
        }
        <InputGroup>
          {
            // TODO: I am hard coding the width of the search bar and select
            // This is in no way a permanent solution, but I needed a quick fix
            // for the demo
          }
          <Form.Select
            name="search_by"
            onChange={handleChange}
            style={{ width: "10%" }}
            defaultValue={"title"}
          >
            <option value="title">Title</option>
            <option value="credits">Actor</option>
            <option value="credits">Director</option>
            <option value="genres">Genre</option>
            <option value="production_companies">Production Company</option>
          </Form.Select>
          {
            // Adding this messes up the styling, figure out how to fix this
            // I think it's important for accessability?
            //<Form.Label for="search-bar">Search</Form.Label>
          }
          <Form.Control
            name="search_query"
            placeholder="Search"
            onChange={handleChange}
            value={formData.search_query || ""}
            id="search-bar"
            style={{ width: "80%" }}
          />
          {
            // Adding this messes up the styling, figure out how to fix this
            // I think it's important for accessability?
            //<Form.Label>Search by</Form.Label>
          }
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </InputGroup>

        {
          // Note we are missing a label, I think it looks better without it. How can we include it to
          // improve accessability without having it show up?
          // TODO: It would be cool if we could use this for a drop-down menu
          // https://react-bootstrap.github.io/docs/components/dropdowns/
          // This is a dropdown menu for selecting what to search by
        }
      </Form>
      <br />
      {/* Autocomplete suggestions */}
      <ul className="autocomplete-suggestions">
        {autocompleteSuggestions.map((hit) => (
          <AutocompleteSuggestion
            hit={hit}
            key={hit["_id"]}
            onSuggestionClick={handleSuggestionClick}
          />
        ))}
      </ul>
      {
        // Renders the results of the search after submitted
        searchResults
      }
      <GetRecommendationsButton />
    </div>
  );
}

export default RecommendationForm;
