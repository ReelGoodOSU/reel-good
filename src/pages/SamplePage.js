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
  // Default formData is empty, this is used for the search bar
  const [formData, setFormData] = useReducer(formReducer, {});
  // Field is rendered once we search
  const [searchResults, setSearchResults] = useState();

  // Function handles a submit event
  const handleSubmit = (event) => {
    // Don't perform a GET request
    event.preventDefault();

    // Make API request to get search results
    fetch("/search?" + new URLSearchParams({
      search_query: formData.search,
      search_by: "title"
    }))
      .then((response) => response.json())
      .then((data) => {
        // Log data recieved for debug purposes
        console.log(data);
        // Render the search results there were returned
        setSearchResults(
          (
            <div className="search">
              <ul>
                {data.map((hit) => (
                  <li><b>Movie:</b> <i>{hit['_source'].title}</i>, <b>Description:</b> {hit['_source'].overview}</li>
                ))}
              </ul>
            </div>
          )
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
    <div className="wrapper">
      <h1>Search a Movie</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Search:
            <input
              name="search"
              onChange={handleChange}
              value={formData.search || ""}
            />
          </label>
        </fieldset>
        <button type="submit">Submit</button>
      </form>
      { searchResults }
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
