import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../logo.svg";
import "../App.css";

function HomePage() {
  const [currentTime, setCurrentTime] = useState(0);
  const [esResponse, setESResponse] = useState();

  useEffect(() => {
    // Get current time from backend
    fetch("/time")
      .then((response) => response.json())
      .then((data) => {
        setCurrentTime(data.time);
      });

    // Request info on the elasticsearch container
    fetch("/info")
      .then((response) => response.text())
      .then((data) => {
        setESResponse(data);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Link to="/sample" className="App-link">
          Go to Sample Page
        </Link>
        <p>The time is {currentTime}.</p>
        <p>Response from ElasticSearch {esResponse} </p>
      </header>
    </div>
  );
}

export default HomePage;
