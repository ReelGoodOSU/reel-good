// Sample.js

import React, { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

// This function will update the JSON representation of the modifed value
function formReducer(state, event) {
  // event stores the name and value of the modified field, update it and leave
  // everything else unmodified
  return {
    ...state,
    [event.name]: event.value,
  };
}

function TestForm() {
  // Default formData shouldn't be empty, this is used to hold all data from form
  const [formData, setFormData] = useReducer(formReducer, {
    search_query: "",
    search_by: "title",
  });
  // Field is rendered once we search
  const [searchResults, setSearchResults] = useState();

  // Function handles a submit event
  const handleSubmit = (event) => {
    // Don't perform a GET request
    event.preventDefault();

    // Make API request to get search results
    fetch("/search?" + new URLSearchParams(formData))
      .then((response) => response.json())
      .then((data) => {
        // Log data recieved for debug purposes
        console.log(data);
        // Render the search results there were returned
        setSearchResults(
          <div className="search-results">
            <ul className="search-entries">
              {
                // For each hit we receive render an entry (title and description) for it
              }
              {data.map((hit) => (
                <li className="search-entry" key={hit["_id"]}>
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
              ))}
            </ul>
          </div>
        );
      });
  };

  const handleChange = (event) => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
    });
  };


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
      {searchResults}
    </div>
  );
}

function SamplePage() {
  return (
    <div className="App">
      <Link to="/" className="App-link">
        Back to Home Page
      </Link>
      <TestForm />
    </div>
  );
}

export default SamplePage;
