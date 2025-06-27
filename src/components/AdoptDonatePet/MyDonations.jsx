import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../authentication/firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import './MyDonations.css';

const MyDonations = () => { 
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyDonations = async (email) => {
    try {
      const q = query(collection(db, 'donations'), where('contactEmail', '==', email));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDonations(data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await deleteDoc(doc(db, 'donations', id));
      setDonations(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting donation:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        fetchMyDonations(user.email);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="my-donations-container">
      <button className="back-btn" onClick={() => navigate('/adopt-donate')}>
        ⬅ Back to Options
      </button>
      <h2>My Dog Donation Listings</h2>

      {loading ? (
        <p>Loading your listings...</p>
      ) : donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <div className="donation-list">
          {donations.map((donation) => (
            <div key={donation.id} className="donation-card">
              <img src={donation.photoUrl} alt={donation.dogName} className="dog-image" />
              <div className="donation-details">
                <h3>{donation.dogName}</h3>
                <p><strong>Breed:</strong> {donation.breed}</p>
                <p><strong>Age:</strong> {donation.age}</p>
                <p><strong>Location:</strong> {donation.city}, {donation.state}</p>
                <p><strong>Email:</strong> {donation.contactEmail}</p>
                <button className="delete-btn" onClick={() => handleDelete(donation.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonations;
