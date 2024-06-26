import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to Good Gremlin!</h1>
      <p>Manage your household chores easily and efficiently!</p>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  );
}

export default Home;