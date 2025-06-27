# 🐾 FurWell – Fitness and Fun for Your Furry Friend

FurWell is a full-stack pet care web application built with **React**, **Firebase**, and **Flask (Python)**. It empowers pet owners with tools to manage their pets' health and well-being through smart, intuitive features.

## 🚀 Features

- 🧠 **Symptom Checker**: Predict potential pet diseases using a machine learning model.
- 🥗 **Nutrition Recommendations**: Suggests a suitable diet plan for pets based on their condition.
- 🐶 **Adopt/Donate Pet**: Find loving homes for dogs or adopt one yourself.
- 📍 **Nearest Vet Clinics**: Locate nearby veterinary clinics using the Google Maps API.
- 🔐 **Authentication**: Secure login with email verification and phone OTP.

## 🛠️ Tech Stack

- **Frontend**: React, Bootstrap, Google Maps API
- **Backend**: Python (Flask)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth (Email/Password, Google Sign-In, Phone OTP)

---

## 📦 Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- Node.js and npm installed
- Firebase project set up with Auth, Firestore, and Storage enabled
- Google Maps API Key enabled

---

## 🧪 Available Scripts

In the project directory, run:

### `npm install`

Installs all required dependencies.

### `npm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) in your browser.

### `npm run build`

Builds the app for production in the `build` folder.

---

## 🔐 Environment Variables

Create a `.env` file at the root of your project:

```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key