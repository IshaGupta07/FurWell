import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../authentication/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { FaHeart, FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaw, FaSignOutAlt } from 'react-icons/fa';
import './AdoptPage.css';

const allStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands (union territory)",
  "Chandigarh (union territory)", "Dadra and Nagar Haveli and Daman and Diu (union territory)",
  "Delhi (NCT)", "Jammu and Kashmir (union territory)", "Ladakh (union territory)",
  "Lakshadweep (union territory)", "Puducherry (union territory)"
];

const allDogBreeds = [
  'Beagle', 'Labrador', 'Dachshund', 'Golden Retriever', 'Great Dane', 'Boxer',
  'Cocker Spaniel', 'German Shepherd', 'Indian Spitz', 'Pug', 'Mudhol hound',
  'Rottweiler', 'Doberman', 'Mastiff', 'Pomeranian', 'Rajapalayam',
  'Border Collie', 'Bulldog', 'Chippiparai', 'Afghan Hound', 'Basset Hound',
  'Dalmatian', 'Indian Pariah dog', 'Shih Tzu', 'Others'
];

const AdoptPage = () => {
  const navigate = useNavigate();
  const [adoptablePets, setAdoptablePets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [availableBreeds, setAvailableBreeds] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
  const [filter, setFilter] = useState({
    breed: '',
    age: [0, 20],
    state: '',
  });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const pets = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setAdoptablePets(pets);
        setAvailableBreeds(allDogBreeds);
        setAvailableStates(allStates);
      } catch (error) {
        console.error("Error fetching pets: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  const handleLogout = () => {
    localStorage.removeItem('user');
    auth.signOut()
      .then(() => navigate('/'))
      .catch((error) => console.error('Error signing out:', error));
  };

  const handleAdoptClick = (pet) => {
    setSelectedPet(pet);
  };

  const closeModal = () => {
    setSelectedPet(null);
  };

  const filteredPets = adoptablePets.filter(pet => {
    const breedMatch = filter.breed ? pet.breed === filter.breed : true;
    const stateMatch = filter.state ? pet.state === filter.state : true;
    const ageMatch = pet.age >= filter.age[0] && pet.age <= filter.age[1];
    return breedMatch && stateMatch && ageMatch;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading pets...</p>
      </div>
    );
  }

  return (
    <div className="adopt-page-container">
      <nav className="navbar">
        <div className="navbar-content">
          <button className="navbar-brand" onClick={() => navigate('/home')}>
            <FaPaw className="paw-icon" /> FurWell
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      <div className="page-content">
        <h2 className="page-title">Find Your Perfect Companion</h2>
        <p className="page-subtitle">These lovely pets are looking for a forever home</p>

        <button className="filter-toggle-btn" onClick={toggleFilters}>
          {filtersVisible ? 'Hide Filters' : 'Show Filters'}
        </button>

        {filtersVisible && (
          <div className="filters-container">
            <label>
              Breed:
              <select value={filter.breed} onChange={(e) => setFilter({ ...filter, breed: e.target.value })}>
                <option value="">All Breeds</option>
                {availableBreeds.map((b, i) => <option key={i} value={b}>{b}</option>)}
              </select>
            </label>

            <label>
              Age Range: {filter.age[0]} - {filter.age[1]} yrs
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={filter.age[1]}
                onChange={(e) => setFilter({ ...filter, age: [0, parseInt(e.target.value)] })}
              />
            </label>

            <label>
              State:
              <select value={filter.state} onChange={(e) => setFilter({ ...filter, state: e.target.value })}>
                <option value="">All States</option>
                {availableStates.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </label>
          </div>
        )}

        <div className="adopt-list">
          {filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <div key={pet.id} className="pet-card">
                <div className="pet-image-container">
                  <img src={pet.photoUrl} alt={pet.name || 'Pet'} className="pet-photo" />
                  <button className="favorite-btn">
                    <FaHeart className="heart-icon" />
                  </button>
                </div>
                <div className="pet-details">
                  <h3>{pet.breed || 'Mixed Breed'}</h3>
                  <p className="pet-location">
                    <FaMapMarkerAlt className="location-icon" />
                    {pet.city || 'Unknown'}, {pet.state || 'Unknown'}
                  </p>
                  <button className="adopt-btn" onClick={() => handleAdoptClick(pet)}>
                    {pet.name ? `Meet ${pet.name}` : 'Meet Me'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-pets">
              <p>No pets match the selected filters.</p>
            </div>
          )}
        </div>

        {selectedPet && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="pet-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={closeModal}>×</button>
              <div className="modal-content">
                <div className="modal-left">
                  <img src={selectedPet.photoUrl} alt={selectedPet.name || 'Pet'} />
                </div>
                <div className="modal-right">
                  <h2>{selectedPet.name} ({selectedPet.age} years)</h2>
                  <div className="pet-info">
                    <p><strong>Breed:</strong> {selectedPet.breed || 'Mixed Breed'}</p>
                    <p><strong>Location:</strong> {selectedPet.city || 'Unknown'}, {selectedPet.state || 'Unknown'}</p>
                  </div>
                  <div className="contact-info">
                    <h3>Contact Owner</h3>
                    <p><FaPhone /> {selectedPet.phone || 'N/A'}</p>
                    <p><FaEnvelope /> {selectedPet.contactEmail || 'N/A'}</p>
                  </div>
                  <button className="adopt-now-btn">Adopt Now</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptPage;
