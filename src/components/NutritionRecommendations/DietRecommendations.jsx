import React, { useState } from 'react';
import NavBar from '../nav/navbar';  // Import NavBar component
import './DietRecommendations.css';

const dietData = {
  small: {
    puppy: {
      title: "Small Breed Puppy Diet",
      subtitle: "0-12 months",
      description: "High protein diet (28-32%) for growth. Small kibble size. 4-5 meals/day.",
      foods: ["Boiled chicken", "Puppy kibble", "Scrambled eggs", "Mashed sweet potato", "Cottage cheese"],
      color: "#FF9AA2"
    },
    adult: {
      title: "Small Breed Adult Diet",
      subtitle: "1-7 years",
      description: "Balanced diet (20-25% protein, healthy fats). 2-3 meals/day.",
      foods: ["Lean meats", "Boiled rice", "Carrots", "Apples", "Eggs", "Yogurt", "Dog-friendly kibble"],
      color: "#FFB7B2"
    },
    senior: {
      title: "Small Breed Senior Diet",
      subtitle: "7+ years",
      description: "Lower protein, easy-to-digest diet. 2 meals/day. Avoid excess fat & salt.",
      foods: ["Soft foods", "Boiled chicken", "Pumpkin puree", "Rice", "Senior-formulated dog kibble"],
      color: "#FFDAC1"
    }
  },
  medium: {
    puppy: {
      title: "Medium Breed Puppy Diet",
      subtitle: "0-12 months",
      description: "High protein (26-30%) and fat (10-15%) for energy. 3-4 meals/day.",
      foods: ["Chicken", "Turkey", "Puppy kibble", "Brown rice", "Banana", "Bone broth"],
      color: "#E2F0CB"
    },
    adult: {
      title: "Medium Breed Adult Diet",
      subtitle: "1-7 years",
      description: "Balanced protein (20-25%) with fiber. 2 meals/day.",
      foods: ["Lean meats", "Brown rice", "Carrots", "Spinach", "Pumpkin", "Yogurt", "Kibble"],
      color: "#B5EAD7"
    },
    senior: {
      title: "Medium Breed Senior Diet",
      subtitle: "7+ years",
      description: "Low-calorie, joint-supportive diet. 2 meals/day.",
      foods: ["Soft foods", "Fish oil for joints", "Chicken broth", "Boiled veggies", "Grain-free kibble"],
      color: "#C7CEEA"
    }
  },
  large: {
    puppy: {
      title: "Large Breed Puppy Diet",
      subtitle: "0-12 months",
      description: "High protein (30-35%) & calcium-rich diet. 4 meals/day.",
      foods: ["Chicken", "Puppy kibble", "Eggs", "Carrots", "Fish oil", "Pumpkin puree", "Bone broth"],
      color: "#A2D2FF"
    },
    adult: {
      title: "Large Breed Adult Diet",
      subtitle: "1-7 years",
      description: "Balanced protein (22-26%) and controlled fat intake. 2 meals/day.",
      foods: ["Beef", "Fish", "Whole grains", "Boiled veggies", "Eggs", "Dry kibble"],
      color: "#CDB4DB"
    },
    senior: {
      title: "Large Breed Senior Diet",
      subtitle: "7+ years",
      description: "Joint-supportive, low-fat diet. 2 meals/day.",
      foods: ["Soft cooked chicken", "Oatmeal", "Pumpkin", "Turmeric (anti-inflammatory)", "Senior-formulated kibble"],
      color: "#FFC8DD"
    }
  }
};

const DietRecommendations = () => {
  const [selectedSize, setSelectedSize] = useState('small');
  const [selectedAge, setSelectedAge] = useState('puppy');
  const currentDiet = dietData[selectedSize][selectedAge];

  return (
    <div className="diet-app">
      <NavBar /> {/* NavBar included here */}

      <header className="app-header">
        <h1>🐶 Tailored Nutrition Guide</h1>
        <p className="subtitle">Find the perfect diet for your dog's size and age</p>
      </header>

      <div className="selector-container">
        <div className="size-selector">
          <h3>Select Breed Size:</h3>
          <div className="selector-buttons">
            {Object.entries({
              small: "Small",
              medium: "Medium",
              large: "Large"
            }).map(([size, label]) => (
              <button
                key={size}
                className={`selector-btn ${selectedSize === size ? 'active' : ''}`}
                onClick={() => setSelectedSize(size)}
                style={{
                  backgroundColor: selectedSize === size ? dietData[size][selectedAge].color : '#f5f5f5'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="age-selector">
          <h3>Select Life Stage:</h3>
          <div className="selector-buttons">
            {Object.entries({
              puppy: "Puppy",
              adult: "Adult",
              senior: "Senior"
            }).map(([age, label]) => (
              <button
                key={age}
                className={`selector-btn ${selectedAge === age ? 'active' : ''}`}
                onClick={() => setSelectedAge(age)}
                style={{
                  backgroundColor: selectedAge === age ? dietData[selectedSize][age].color : '#f5f5f5'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="diet-card" style={{ backgroundColor: currentDiet.color }}>
        <div className="card-header">
          <h2>{currentDiet.title}</h2>
          <h3>{currentDiet.subtitle}</h3>
        </div>
        <p className="diet-description">{currentDiet.description}</p>
        
        <div className="food-recommendations">
          <h4>Recommended Foods:</h4>
          <div className="food-grid">
            {currentDiet.foods.map((food, idx) => (
              <div className="food-item" key={idx}>
                <div className="food-icon">
                  {idx % 3 === 0 ? '🍗' : idx % 3 === 1 ? '🥕' : '🥣'}
                </div>
                <span>{food}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietRecommendations;
