import React, { useEffect } from "react";
import logo from "../assets/logo.svg";
import "../css/App.css";
import { NavLink, useLocation } from "react-router-dom";
import { signout, useAuth } from "../hooks";
import { Button } from "@mui/material";
import { logout, token } from "../services";

export function App() {
  const { user, dispatch } = useAuth();
  const location = useLocation();
  useEffect(() => {
    console.log("user", user);
  }, []);

  const handleLogout = () => {
    logout()
      .then(() => {
        dispatch(signout());
        return;
      })
      .catch((reason: any) => {
        console.log("Logout Fail", reason);
        return;
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello {user?.fullName} ! You're {location.pathname} of Chat App
        </p>
        <NavLink to={"/login"}>Comback to login</NavLink>
        {user && (
          <>
            <NavLink to={"/home"} replace>
              HOME
            </NavLink>
            <NavLink to={"/about"} replace>
              ABOUT
            </NavLink>
            <Button variant="contained" onClick={handleLogout}>
              Log out
            </Button>
            <Button variant="contained" onClick={token}>
              Refresh Token
            </Button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
