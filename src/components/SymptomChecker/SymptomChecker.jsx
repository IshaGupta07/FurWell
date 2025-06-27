import React, { useState } from 'react';
import { FaPaw, FaSearch, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import NavBar from '../nav/navbar';
import './SymptomChecker.css';

const symptoms = [
  "Fever", "Nasal Discharge", "Lameness", "Lethargy", "Increased drinking and urination",
  "Neurological Disorders", "Swollen Lymph nodes", "Vomiting", "Weight Loss", "Breathing Difficulty",
  "Heart Complication", "Loss of appetite", "Depression", "Eating less than usual", "Seizures",
  "Paralysis", "Coughing", "Diarrhea", "Excessive Salivation", "Eye Discharge", "Weakness",
  "Discomfort", "Redness around Eye area", "Sepsis", "Anorexia", "Severe Dehydration", "Pain",
  "Tender abdomen", "Bloated Stomach", "Yellow gums", "Loss of Consciousness", "Blindness",
  "WeightLoss", "Aggression", "Constipation", "Wrinkled forehead", "Continuously erect and stiff ears",
  "Grinning appearance", "Stiff and hard tail", "Stiffness of muscles", "Excess jaw tone",
  "Blood in urine", "Bad breath", "Acute blindness", "Pale gums", "Urine infection", "Hunger",
  "Cataracts", "Glucose in urine", "Enlarged Liver", "Losing sight", "Coma", "Collapse",
  "Lack of energy", "Blood in stools", "Burping", "Eating grass", "Abdominal pain", "Passing gases",
  "Scratching", "Licking", "Face rubbing", "Redness of skin", "Loss of Fur", "Itchy skin",
  "Swelling of gum", "Bleeding of gum", "Purging", "Redness of gum", "Receding gum", "Tartar",
  "Plaque", "Lumps", "Difficulty Urinating", "Bloody discharge", "Swelling", "Dry Skin",
  "Red bumps", "Fur loss", "Red patches", "Dandruff", "Smelly", "Wounds", "Irritation", "Scabs"
];

export default function SymptomChecker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const filteredSymptoms = symptoms.filter(symptom =>
    symptom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });

      const data = await response.json();

      if (response.ok) {
        setPredictionResult(data.disease);
        setErrorMessage(null);
      } else {
        setErrorMessage(data.error || 'Unknown error');
        setPredictionResult(null);
      }
    } catch (error) {
      setErrorMessage('Error connecting to server: ' + error.message);
      setPredictionResult(null);
    }
  };

  return (
    <>
      <NavBar />
      <div className="symptom-checker-container">
        <header className="header-section">
          <h1>
            Pet <span>Symptom</span> Checker
          </h1>
          <p className="subtitle">Select symptoms to check possible diseases.</p>
          <div className="dog-illustration">
            <FaPaw className="dog-icon" />
          </div>
        </header>

        <div className="dropdown-container">
          <div
            className="dropdown-header"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setDropdownOpen(!dropdownOpen);
            }}
          >
            <div className="header-content">
              <FaPaw className="paw-icon" />
              {selectedSymptoms.length > 0
                ? `${selectedSymptoms.length} symptom(s) selected`
                : 'Select Symptoms'}
            </div>
            <div>{dropdownOpen ? '▲' : '▼'}</div>
          </div>

          {dropdownOpen && (
            <div className="symptoms-content">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search symptoms..."
                  className="symptom-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="symptoms-list">
                {filteredSymptoms.length > 0 ? (
                  filteredSymptoms.map(symptom => (
                    <div
                      key={symptom}
                      className={`symptom-item ${
                        selectedSymptoms.includes(symptom) ? 'selected' : ''
                      }`}
                      onClick={() => toggleSymptom(symptom)}
                    >
                      <div className="checkbox" />
                      <span>{symptom}</span>
                    </div>
                  ))
                ) : (
                  <p>No symptoms found</p>
                )}
              </div>
            </div>
          )}
        </div>

        {selectedSymptoms.length > 0 && (
          <section className="selected-section">
            <h3>
              <FaPaw className="icon" /> Selected Symptoms
            </h3>
            <div className="selected-symptoms">
              {selectedSymptoms.map(symptom => (
                <div key={symptom} className="symptom-tag">
                  {symptom}{' '}
                  <FaTimes
                    className="remove-btn"
                    onClick={() => removeSymptom(symptom)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Remove ${symptom}`}
                  />
                </div>
              ))}
            </div>
            <div className="button-group">
              <button className="analyze-btn" onClick={handleAnalyze}>
                <FaPaw className="paw-icon" /> Analyze Symptoms
              </button>

              <Link to="/nearest-vet-clinics" className="consult-btn-link">
  🏥 Consult Nearest Vet
</Link>


            </div>

            {predictionResult && (
              <div className="prediction-result">
                <h4>Predicted Disease:</h4>
                <p>{predictionResult}</p>
              </div>
            )}
            {errorMessage && (
              <div className="error-message">
                <p>{errorMessage}</p>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}