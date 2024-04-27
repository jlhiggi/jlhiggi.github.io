import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';
import Rewards from './Rewards';
import About from './About';
import Login from './Login';
import Signup from './Signup';
import UserDashboard from './UserDashboard';
import LogoutButton from './LogoutButton';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in on app startup
    axios.get('/api/user')
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, []);

  function handleLogin(userData) {
    setUser(userData);
  }

  function handleLogout() {
    axios.post('/api/logout')
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }

  function handleAddChore(chore) {
    axios.post('/api/chores', chore)
      .then((response) => {
        console.log('Chore added:', response.data);
        // Optionally, you can update the state to reflect the new chore
      })
      .catch((error) => {
        console.error('Error adding chore:', error);
      });
  }

  return (
    <Router>
      <div>
        <header>
          <h1>Chore Management App</h1>
          <nav>
            <Link to="/">Home</Link>
            {user ? (
              <>
                <Link to="/dashboard">User Dashboard</Link>
                <Link to="/rewards">Rewards</Link>
                <LogoutButton onLogout={handleLogout} />
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
              </>
            )}
            <Link to="/about">About</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={
              user ? (
                <UserDashboard user={user} onAddChore={handleAddChore} />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;