import React, { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

// Renders the results for a single search hit
function SearchResult({ hit }) {
  return (
    <li className="search-entry">
      <b>Movie: </b>
      <i>
        <Link to={"/movies/" + hit["_id"]} className="App-link">
          {hit["_source"].title}
        </Link>
      </i>
      <p>
        <b>Description: </b> {hit["_source"].overview}
      </p>
    </li>
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
  // Default formData shouldn't be empty, this is used to hold all data from form
  const [formData, setFormData] = useReducer(formReducer, {
    search_query: "",
    search_by: "title",
  });
  // Field is rendered once we search
  const [searchResults, setSearchResults] = useState();

  // Function for handling a submit request
  const handleSubmit = (event) => {
    // Don't perform a GET request
    event.preventDefault();

    // Make API request to get search results
    fetch("/search?" + new URLSearchParams(formData))
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

  // Given an event, this function sets up the name and value of the form component to be updated
  const handleChange = (event) => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
    });
  };

  // Generate the HTML to return
  return (
    <div className="search-form">
      <h1>Search a Movie</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          {
            // Basic search bar
          }
          <label>
            Search:
            <input
              name="search_query"
              onChange={handleChange}
              value={formData.search_query || ""}
            />
          </label>
          {
            // Note we are missing a label, I think it looks better without it. How can we include it to
            // improve accessability without having it show up?
            // TODO: It would be cool if we could use this for a drop-down menu
            // https://react-bootstrap.github.io/docs/components/dropdowns/
            // This is a dropdown menu for selecting what to search by
          }
          <select name="search_by" onChange={handleChange}>
            <option value="title">Title</option>
            <option value="credits">Actor</option>
            <option value="credits">Director</option>
            <option value="genres">Genre</option>
            <option value="production_companies">Production Company</option>
          </select>
        </fieldset>
        <button type="submit">Submit</button>
      </form>
      {
        // Renders the results of the search after submitted
        searchResults
      }
    </div>
  );
}

export default SearchForm;