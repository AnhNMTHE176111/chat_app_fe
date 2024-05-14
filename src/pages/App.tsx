import React from "react";
import logo from "../assets/logo.svg";
import "../css/App.css";

export function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello! You're home page of Chat App</p>
        <a
          className="App-link"
          href="/login"
          target="_blank"
          rel="noopener noreferrer"
        >
          Comback to login
        </a>
      </header>
    </div>
  );
}

export default App;
