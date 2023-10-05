// Sample.js

import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import SearchForm from "../components/SearchForm";

function SamplePage() {
  return (
    <div className="App">
      <Link to="/" className="App-link">
        Back to Home Page
      </Link>
      <SearchForm />
    </div>
  );
}

export default SamplePage;
