import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const baseNavItems = [
  ["/", "Home"],
  ["/games", "Games"],
  ["/rules", "Rules"],
  ["/scores", "High Scores"],
];

function NavBar() {
  const { isLoggedIn, logout, user } = useAuth();

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        Sudoku Master
      </NavLink>
      <nav>
        <ul className="nav-list">
          {baseNavItems.map(([to, label]) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {label}
              </NavLink>
            </li>
          ))}
          {isLoggedIn ? (
            <>
              <li>
                <span className="nav-link">{user.username}</span>
              </li>
              <li>
                <button type="button" className="nav-link nav-button" onClick={logout}>
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;
