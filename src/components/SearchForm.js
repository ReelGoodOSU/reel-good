import React, { useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import { Button, Col, Card, Form, InputGroup } from 'react-bootstrap'

// Renders the results for a single search hit
function SearchResult ({ hit }) {
  // TODO: Make the rendering of the movies better include details like actors and genre
  return (
    <Col className='search-entry'>
      <Card>
        <Card.Body>
          <b>Movie: </b>
          <i>
            <Link to={'/movies/' + hit['_id']} className='App-link'>
              {hit['_source'].title}
            </Link>
          </i>
          <p>
            <b>Description: </b> {hit['_source'].overview}
          </p>
        </Card.Body>
      </Card>
    </Col>
  )
}

function AutocompleteSuggestion ({ hit }) {
  return (
    <Col className='search-entry'>
      <Card>
        <Card.Body>
          <i>{hit['_source'].title}</i>
        </Card.Body>
      </Card>
    </Col>
  )
}

// This function will update the JSON representation of the modifed value
function formReducer (state, event) {
  // event stores the name and value of the modified field, update it and leave
  // everything else unmodified
  return {
    ...state,
    [event.name]: event.value
  }
}

function SearchForm () {
  // Default formData shouldn't be empty, this is used to hold all data from form
  const [formData, setFormData] = useReducer(formReducer, {
    search_query: '',
    search_by: 'title'
  })
  // Field is rendered once we search
  const [searchResults, setSearchResults] = useState()
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([])

  // Function for handling a submit request
  const handleSubmit = event => {
    // Don't perform a GET request
    event.preventDefault()

    // Make API request to get search results
    fetch('/search?' + new URLSearchParams(formData))
      .then(response => response.json())
      .then(data => {
        // This block of code parses and renders the search results
        // Log data recieved for debug purposes
        console.log(data)
        // Render the search results that were returned
        setSearchResults(
          <div className='search-results'>
            <ul className='search-entries'>
              {
                // For each hit we receive render an entry (title and description) for it
              }
              {data.map(hit => (
                <SearchResult hit={hit} key={hit['_id']} />
              ))}
            </ul>
          </div>
        )
        // Clear autocomplete suggestions when search is triggered
        setAutocompleteSuggestions([])
      })
  }

  // Given an event, this function sets up the name and value of the form component to be updated
  const handleChange = event => {
    const inputValue = event.target.value
    const searchBy = formData.search_by
    setFormData({
      name: event.target.name,
      value: event.target.value
    })

    // Fetch autocomplete suggestions based on the input value and searchBy
    fetch(`/autocomplete?search_query=${inputValue}&search_by=${searchBy}`)
      .then(response => response.json())
      .then(data => {
        console.log(data) // Log the data to check its structure
        setAutocompleteSuggestions(data)
      })
      .catch(error => {
        console.error('Error fetching autocomplete suggestions:', error)
      })
  }

  const handleSuggestionClick = (event, suggestion) => {
    // Prevent the default behavior of the event, e.g., preventing page refresh on click
    event.preventDefault()
    // Set the search query to the selected suggestion and trigger a search
    setFormData({
      name: 'search_query',
      value: suggestion
    })
    handleSubmit(event)
  }

  // Generate the HTML to return
  return (
    <div className='search-form'>
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
            name='search_by'
            onChange={handleChange}
            style={{ width: '10%' }}
          >
            <option selected value='title'>
              Title
            </option>
            <option value='credits'>Actor</option>
            <option value='credits'>Director</option>
            <option value='genres'>Genre</option>
            <option value='production_companies'>Production Company</option>
          </Form.Select>
          {
            // Adding this messes up the styling, figure out how to fix this
            // I think it's important for accessability?
            //<Form.Label for="search-bar">Search</Form.Label>
          }
          <Form.Control
            name='search_query'
            placeholder='Search'
            onChange={handleChange}
            value={formData.search_query || ''}
            id='search-bar'
            style={{ width: '80%' }}
          />
          {
            // Adding this messes up the styling, figure out how to fix this
            // I think it's important for accessability?
            //<Form.Label>Search by</Form.Label>
          }
          <Button type='submit' variant='primary'>
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
      <ul className='autocomplete-suggestions'>
        {autocompleteSuggestions.map(hit => (
          <div className='clickable-card' onClick={handleSuggestionClick}>
            <AutocompleteSuggestion hit={hit} key={hit['_id']} />
          </div>
        ))}
      </ul>
      {
        // Renders the results of the search after submitted
        searchResults
      }
    </div>
  )
}

export default SearchForm
