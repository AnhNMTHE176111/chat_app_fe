import React, { useEffect } from "react";
import logo from "../assets/logo.svg";
import "../css/App.css";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks";
import Cookies from "js-cookie";

export function App() {
  const { user } = useAuth();
  const location = useLocation();
  useEffect(() => {
    console.log("user", user);
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello {user?.username} ! You're {location.pathname} of Chat App
        </p>
        <NavLink to={"/login"}>Comback to login</NavLink>
        {user && (
          <>
            <NavLink to={"/home"} replace>
              HOME
            </NavLink>
            <NavLink to={"/about"} replace>``
              ABOUT
            </NavLink>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
