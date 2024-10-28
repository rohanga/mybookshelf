import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './componants/navbar/navbar';
import Bookshelf from './componants/bookshelf/mybookshelf';
import Dashboard from './componants/dashboard/dashboard';
import Login from './componants/login/login';
import Signup from './componants/signup/signup';
import BookDetails from './componants/bookdetails/bookdetails';
import { useDispatch } from 'react-redux';
import { logout } from './store/action/authAction';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
      dispatch(logout());
     
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated && <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />}

      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/bookshelf" element={isAuthenticated ? <Bookshelf /> : <Navigate to="/login" />} />
        <Route path="/books/:bookId" element={isAuthenticated ? <BookDetails /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;