import React, { useState, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import NavBar from '../nav/navbar';
import './NearestVetClinics.css';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const NearestVetClinics = () => {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(5000);
  const [clinicDetails, setClinicDetails] = useState({});
  const [zipCode, setZipCode] = useState('');

  const mapRef = useRef(null);
  const placesServiceRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  libraries,
});

  const fetchUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationName('Geolocation not supported by browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        const loc = { lat: latitude, lng: longitude };
        setLocation(loc);

        const geocoder = new window.google.maps.Geocoder();
        const latLng = new window.google.maps.LatLng(latitude, longitude);

        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === 'OK' && results[0]) {
            setLocationName(results[0].formatted_address);
          } else {
            setLocationName('Location name unavailable');
          }
        });
      },
      (err) => {
        console.error('Geolocation error:', err);
        setLocationName('Unable to fetch location');
      }
    );
  };

  const fetchNearbyClinics = (lat, lng, rad) => {
    if (!placesServiceRef.current) return;
    setLoading(true);

    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: rad,
      type: 'veterinary_care',
    };

    placesServiceRef.current.nearbySearch(request, (results, status) => {
      setLoading(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        setClinics(results);
        results.slice(0, 5).forEach((clinic) => fetchClinicDetails(clinic.place_id));
      } else {
        setClinics([]);
      }
    });
  };

  const fetchClinicDetails = (placeId) => {
    if (!placesServiceRef.current) return;

    const request = {
      placeId,
      fields: ['formatted_phone_number'],
    };

    placesServiceRef.current.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setClinicDetails((prev) => ({
          ...prev,
          [placeId]: {
            phone: place.formatted_phone_number || 'Phone not available',
          },
        }));
      }
    });
  };

  const handleFindClinics = () => {
    if (location) {
      fetchNearbyClinics(location.lat, location.lng, radius);
    }
  };

  const handleZipCodeSearch = () => {
    if (!zipCode) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: zipCode }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location;
        const formattedLoc = { lat: loc.lat(), lng: loc.lng() };
        setLocation(formattedLoc);
        setLocationName(results[0].formatted_address);
        fetchNearbyClinics(formattedLoc.lat, formattedLoc.lng, radius);
      } else {
        alert('Invalid ZIP code or unable to find location.');
      }
    });
  };

  const getDirectionsUrl = (lat, lng) =>
    `https://www.google.com/maps/dir/?api=1&origin=${location?.lat},${location?.lng}&destination=${lat},${lng}&travelmode=driving`;

  const onMapLoad = (map) => {
    mapRef.current = map;
    placesServiceRef.current = new window.google.maps.places.PlacesService(map);
  };

  if (loadError) {
    return <div className="error-message">Failed to load Google Maps. Please check your API key.</div>;
  }

  return (
    <div className="container">
      <NavBar />
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <h3 className="title">Find Nearest Vet Clinics</h3>

          <button className="location-btn" onClick={fetchUserLocation}>
            Get My Current Location
          </button>

          {/* ZIP Code Search */}
          <div className="zip-search">
            <label htmlFor="zipcode">Or Enter ZIP Code:</label>
            <input
              type="text"
              id="zipcode"
              placeholder="Enter ZIP code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="zip-input"
            />
            <button className="zip-search-btn" onClick={handleZipCodeSearch}>
              Search by ZIP Code
            </button>
          </div>

          {locationName && (
            <div className="location-name">
              <strong>Your Current Location:</strong>
              <p>{locationName}</p>
            </div>
          )}

          <div className="radius-selector">
            <label htmlFor="radius">
              Select Search Radius: {radius / 1000} km
            </label>
            <input
              type="range"
              id="radius"
              min="1000"
              max="10000"
              step="1000"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="radius-slider"
            />
          </div>

          {location && (
            <button className="find-btn" onClick={handleFindClinics}>
              Find Nearby Vet Clinics
            </button>
          )}

          <h3 className="clinic-title">Nearest Veterinary Clinics</h3>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <ul className="clinic-list">
              {clinics.length ? (
                clinics.map((clinic) => (
                  <li key={clinic.place_id} className="clinic-item">
                    <strong>{clinic.name}</strong>
                    <br />
                    {clinic.vicinity || clinic.formatted_address || 'No address available'}
                    <br />
                    {clinicDetails[clinic.place_id]?.phone && (
                      <div>Phone: {clinicDetails[clinic.place_id].phone}</div>
                    )}
                    <a
                      href={getDirectionsUrl(
                        clinic.geometry.location.lat(),
                        clinic.geometry.location.lng()
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="directions-link"
                    >
                      Get Directions
                    </a>
                  </li>
                ))
              ) : (
                <li>No clinics found</li>
              )}
            </ul>
          )}
        </div>

        {/* Map Panel */}
        <div className="map-container">
          {isLoaded ? (
            <GoogleMap
              onLoad={onMapLoad}
              mapContainerStyle={mapContainerStyle}
              center={location || { lat: 12.9044, lng: 77.5637 }}
              zoom={12}
            >
              {clinics.map((clinic) => (
                <Marker
                  key={clinic.place_id}
                  position={{
                    lat: clinic.geometry.location.lat(),
                    lng: clinic.geometry.location.lng(),
                  }}
                  title={clinic.name}
                />
              ))}
            </GoogleMap>
          ) : (
            <div>Loading map...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearestVetClinics;
