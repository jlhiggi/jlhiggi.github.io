import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  return (
    <div className="about">
      <h1>About Us</h1>
      <p>We are dedicated to making chore management easy and fun for families.</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default About;