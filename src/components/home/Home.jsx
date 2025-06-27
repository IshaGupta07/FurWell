import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaw, FaStethoscope, FaHeart, FaMapMarkerAlt, FaDog } from 'react-icons/fa';
import { auth } from '../authentication/firebase';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    auth.signOut()
      .then(() => navigate('/'))
      .catch((err) => console.error('Sign-out error:', err));
  };

  return (
    <div className="home-dashboard-container">
      <div className="bg-paws"></div>
      <div className="bg-blobs"></div>

      <nav className="navbar">
        <div className="navbar-content">
          <button className="navbar-brand" onClick={() => navigate('/home')}>
            <FaPaw className="paw-icon" /> FurWell
          </button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="main-card">
        <section className="welcome-section">
          <h1>Welcome to <span>FurWell</span></h1>
          <p className="subtitle">Your pet's health and happiness companion</p>
          <FaDog className="dog-icon" />
        </section>

        <section className="feature-buttons">
          <button className="feature-btn checker-btn" onClick={() => navigate('/pet-disease-symptom-checker')}>
            <div className="btn-icon-circle"><FaStethoscope /></div>
            <span>Symptom Checker</span>
          </button>

          <button className="feature-btn diet-btn" onClick={() => navigate('/diet-nutrition-recommendations')}>
            <div className="btn-icon-circle"><FaHeart /></div>
            <span>Diet Recommendations</span>
          </button>

          <button className="feature-btn adoptpage-btn" onClick={() => navigate('/adopt-donate')}>
            <div className="btn-icon-circle"><FaPaw /></div>
            <span>Adopt or Donate</span>
          </button>

          <button className="feature-btn vet-btn" onClick={() => navigate('/nearest-vet-clinics')}>
            <div className="btn-icon-circle"><FaMapMarkerAlt /></div>
            <span>Nearest Vets</span>
          </button>
        </section>
      </main>
    </div>
  );
};

export default Home;