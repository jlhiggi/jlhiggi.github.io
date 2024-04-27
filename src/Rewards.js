import React from 'react';
import { Link } from 'react-router-dom';
import './Rewards.css';

function Rewards() {
  return (
    <div className="rewards">
      <h1>Rewards</h1>
      <p>Earn points by completing chores and redeem them for rewards!</p>
      <ul>
        <li>10 points: Ice cream treat</li>
        <li>20 points: Movie night</li>
        <li>50 points: Day trip of your choice</li>
      </ul>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default Rewards;