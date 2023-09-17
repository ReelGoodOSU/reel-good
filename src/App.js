import { useState, useEffect } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [esResponse, setESResponse] = useState();

  useEffect(() => {
    // Get current time from backend
    fetch('/time').then((response) => response.json())
    .then((data) => {
      setCurrentTime(data.time);
    });

    // Request info on the elasticsearch container
    fetch('/info').then((response) => response.text())
    .then((data) => {
      setESResponse(data)
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>The time is { currentTime }.</p>
        <p>Response from ElasticSearch { esResponse } </p>
      </header>
    </div>
  );
}

export default App;
