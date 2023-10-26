import React, { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Card, Form, InputGroup } from "react-bootstrap";

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
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("/search?" + new URLSearchParams(formData))
      .then((response) => response.json())
      .then((data) => {
        const genres = [...new Set(data.flatMap(hit => hit["_source"].genres ? hit["_source"].genres.split('-') : []))];
        setAvailableGenres(genres);
        setSearchResults(data);
        setSelectedGenres([]); // Reset the selected genres after new search
      });      
      
  };

  const handleChange = (event) => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
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
  ? searchResults.filter(hit => {
      const hitGenres = hit["_source"].genres ? hit["_source"].genres.split('-') : [];
      return selectedGenres.some(genre => hitGenres.includes(genre));
    })
  : searchResults;



  return (
    <div className="search-form">
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Select
            name="search_by"
            onChange={handleChange}
            style={{ width: "10%" }}
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
