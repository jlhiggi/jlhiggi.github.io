import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoutButton.css';

function LogoutButton({ onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate('/');
  }

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;