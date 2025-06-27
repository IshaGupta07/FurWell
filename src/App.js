import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './components/authentication/firebase';

// Component imports
import Welcome from './components/Welcome/Welcome';
import Home from './components/home/Home';
import PetDiseaseSymptomChecker from './components/SymptomChecker/SymptomChecker';
import DietNutritionRecommendations from './components/NutritionRecommendations/DietRecommendations';
import AdoptDonatePage from './components/AdoptDonatePet/AdoptDonatePage';
import AdoptPage from './components/AdoptDonatePet/AdoptPage';
import DonatePage from './components/AdoptDonatePet/DonatePage';
import MyDonations from './components/AdoptDonatePet/MyDonations'; // ✅ Import added
import NearestVetClinics from './components/NearestVetClinics/NearestVetClinics';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={user ? <Home /> : <Welcome />} />
        <Route path="/pet-disease-symptom-checker" element={user ? <PetDiseaseSymptomChecker /> : <Welcome />} />
        <Route path="/diet-nutrition-recommendations" element={user ? <DietNutritionRecommendations /> : <Welcome />} />
        <Route path="/adopt-donate" element={user ? <AdoptDonatePage /> : <Welcome />} />
        <Route path="/adopt" element={user ? <AdoptPage /> : <Welcome />} />
        <Route path="/donate" element={user ? <DonatePage /> : <Welcome />} />
        <Route path="/my-donations" element={user ? <MyDonations /> : <Welcome />} /> {/* ✅ Route added */}
        <Route path="/nearest-vet-clinics" element={user ? <NearestVetClinics /> : <Welcome />} />
      </Routes>
    </Router>
  );
}

export default App;
