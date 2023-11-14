import React, { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Card, Form, InputGroup } from "react-bootstrap";
import genreIdToName from './genre'; // import the genre mapping


function SearchResult({ hit }) {
  return (
    <Col className="search-entry">
      <Card>
        <Card.Body>
          <b>Movie: </b>
          <i>
            <Link to={"/movies/" + hit["_id"]} className="App-link">
              {hit["_source"].title}
            </Link>
          </i>
          <p>
            <b>Description: </b> {hit["_source"].overview}
          </p>
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

function formReducer(state, event) {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    // performSearch(formData);
    fetch("/search?" + new URLSearchParams(formData)) //calls app.py
      .then((response) => response.json())
      .then((data) => {
        // This will extract all genre_ids from the hits, find the unique ids, 
        // map them to their genre names, and finally set the state with these names
        const uniqueGenreIds = Array.from(new Set(data.flatMap(hit => hit["_source"].genre_ids || [])));
        const genres = uniqueGenreIds.map(id => genreIdToName[id]).filter(name => name); // Ensure that we only add valid names
        setAvailableGenres(genres);
        setSearchResults(data);
        setSelectedGenres([]); // Reset the selected genres after new search
      });
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
    
    // TODO: MERGE CONFLICT

    // performSearch({
    //   search_by: formData.search_by,
    //   search_query: suggestion,
    // });
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
                <SearchResult hit={hit} key={hit["_id"]} />
              ))}
            </ul>
          </div>
        );
      });
  };



  const handleGenreChange = (event) => {
    if (event.target.checked) {
      setSelectedGenres(prevGenres => [...prevGenres, event.target.value]);
    } else {
      setSelectedGenres(prevGenres => prevGenres.filter(genre => genre !== event.target.value));
    }
  };

  const filteredResults = selectedGenres.length > 0
    ? searchResults.filter(hit => selectedGenres.includes(hit["_source"].genres))
    : searchResults;

  return (
    <div className="search-form">
      <Form onSubmit={handleSubmit}>
        <InputGroup>
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
      <div className="genre-filter">
        {availableGenres.map(genre => (
          <Form.Check
            type="checkbox"
            label={genre}
            key={genre}
            value={genre}
            onChange={handleGenreChange}
          />
        ))}
      </div>
      <br />
      <div className="search-results">
        <ul className="search-entries">
          {filteredResults.map((hit) => (
            <SearchResult hit={hit} key={hit["_id"]} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchForm;
