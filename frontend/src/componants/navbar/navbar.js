import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = ({ isAuthenticated, handleLogout }) => {
  return (
    <nav className="navbar">
      <ul>
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/bookshelf">My Bookshelf</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li onClick={handleLogout} className="logout-button">
             Logout
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
