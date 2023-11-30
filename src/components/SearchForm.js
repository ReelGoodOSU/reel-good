import React, { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Row, Card, Form, InputGroup } from "react-bootstrap";
import "../App.css";
import genreIdToName from "./genre"; // import the genre mapping

// Renders the results for a single search hit
function SearchResult({ hit }) {
  // Convert genre IDs to genre names
  const genreNames = hit["_source"].genre_ids.map(
    (id) => genreIdToName[id] || "Unknown"
  );

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

function SearchForm() {
  const [formData, setFormData] = useReducer(formReducer, {
    search_query: "",
    search_by: "title",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

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

        // This will extract all genre_ids from the hits, find the unique ids,
        // map them to their genre names, and finally set the state with these names
        const uniqueGenreIds = Array.from(
          new Set(data.flatMap((hit) => hit["_source"].genre_ids || []))
        );
        // Ensure that we only add valid names
        const genres = uniqueGenreIds
          .map((id) => genreIdToName[id])
          .filter((name) => name);
        setAvailableGenres(genres);
        setSearchResults(data);
        // Reset the selected genres after new search
        setSelectedGenres([]);
        // Clear autocomplete suggestions when search is triggered
        setAutocompleteSuggestions([]);
      });
  };

  const handleGenreChange = (event) => {
    const genreName = event.target.value;
    if (event.target.checked) {
      setSelectedGenres((prevGenres) => [...prevGenres, genreName]);
    } else {
      setSelectedGenres((prevGenres) =>
        prevGenres.filter((genre) => genre !== genreName)
      );
    }
  };

  const filteredResults =
    selectedGenres.length > 0
      ? searchResults.filter((hit) => {
          const hitGenreIds = hit["_source"].genre_ids || [];
          return selectedGenres.some((genreName) =>
            hitGenreIds.includes(
              parseInt(
                Object.keys(genreIdToName).find(
                  (key) => genreIdToName[key] === genreName
                )
              )
            )
          );
        })
      : searchResults;

  return (
    <div className="search-form">
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
            <option value="person">Actor</option>
            <option value="person">Director</option>
            <option value="genres">Genre</option>
            <option value="production_company">Production Company</option>
          </Form.Select>
          <Form.Control
            name="search_query"
            placeholder="Search"
            onChange={handleChange}
            value={formData.search_query || ""}
            id="search-bar"
            style={{ width: "80%" }}
          />
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </InputGroup>
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
      <Row>
        <Col xs={4} md={3} lg={2}>
          <ul className="genre-filter">
            {availableGenres.map((genreName) => (
              <Form.Check
                type="checkbox"
                label={genreName}
                key={genreName}
                value={genreName}
                onChange={handleGenreChange}
              />
            ))}
          </ul>
        </Col>
        <Col xs={8} md={9} lg={10}>
          <Row>
            {
              // Renders the results of the search after submitted
              filteredResults.map((hit) => (
                <Col xs={12} sm={6} lg={6} xl={6} xxl={4}>
                  <SearchResult hit={hit} key={hit["_id"]} />
                </Col>
              ))
            }
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default SearchForm;
