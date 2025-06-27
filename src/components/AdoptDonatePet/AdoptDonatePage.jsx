import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaw, FaHeart, FaHandHoldingHeart, FaSignOutAlt, FaListUl } from 'react-icons/fa';
import { auth } from '../authentication/firebase';
import './AdoptDonatePage.css';

const AdoptDonatePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    auth.signOut()
      .then(() => navigate('/'))
      .catch((error) => console.error('Error signing out:', error));
  };

  return (
    <div className="adopt-donate-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <button className="navbar-brand" onClick={() => navigate('/home')}>
            <FaPaw className="paw-icon" />
            FurWell
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="glass-card">
        <h2 className="section-title">Choose an Option</h2>
        <p className="section-subtitle">
          Help pets find loving homes or contribute to our cause
        </p>

        <div className="action-buttons">
          <button 
            className="primary-btn" 
            onClick={() => navigate('/adopt')}
          >
            <FaHeart className="btn-icon" />
            Adopt a Pet
          </button>
          <button 
            className="primary-btn secondary" 
            onClick={() => navigate('/donate')}
          >
            <FaHandHoldingHeart className="btn-icon" />
            Donate a Pet
          </button>
          <button 
            className="primary-btn my-listings-btn" 
            onClick={() => navigate('/my-donations')}
          >
            <FaListUl className="btn-icon" />
            My Listings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdoptDonatePage;
