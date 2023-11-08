import React, { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Card, Form, InputGroup } from "react-bootstrap";
import genreIdToName from './genre'; // import the genre mapping

function SearchResult({ hit }) {
  // Convert genre IDs to genre names
  const genreNames = hit["_source"].genre_ids.map(id => genreIdToName[id] || 'Unknown');

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
          <p>
            <b>Genres: </b> {genreNames.join(', ')}
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

  const handleChange = (event) => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
    });
  };

  const handleGenreChange = (event) => {
    const genreName = event.target.value;
    if (event.target.checked) {
      setSelectedGenres(prevGenres => [...prevGenres, genreName]);
    } else {
      setSelectedGenres(prevGenres => prevGenres.filter(genre => genre !== genreName));
    }
  };

  const filteredResults = selectedGenres.length > 0
    ? searchResults.filter(hit => {
        const hitGenreIds = hit["_source"].genre_ids || [];
        return selectedGenres.some(genreName => hitGenreIds.includes(parseInt(Object.keys(genreIdToName).find(key => genreIdToName[key] === genreName))));
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
        {availableGenres.map(genreName => (
          <Form.Check
            type="checkbox"
            label={genreName}
            key={genreName}
            value={genreName}
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
