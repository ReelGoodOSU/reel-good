import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SamplePage from "./pages/SamplePage";
import MovieDetails from "./pages/MovieDetails";
import PersonDetails from "./pages/PersonDetails";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/sample" element={<SamplePage />} />
          <Route exact path="/movies/:id" element={<MovieDetails />} />
          <Route exact path="/person/:id" element={<PersonDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
