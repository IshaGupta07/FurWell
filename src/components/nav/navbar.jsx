import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';
import { auth } from '../authentication/firebase';
import '../nav/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    auth.signOut()
      .then(() => navigate('/'))
      .catch((error) => console.error('Error signing out:', error));
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <button className="navbar-brand" onClick={() => navigate('/home')}>
          <FaPaw className="paw-icon" /> FurWell
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
