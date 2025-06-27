import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage, db, auth } from '../authentication/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { FaPaw, FaExclamationTriangle, FaSignOutAlt, FaHeart } from 'react-icons/fa';
import './DonatePage.css';

const cityData = {
  "Andaman and Nicobar Islands (union territory)": ["Port Blair"],
  "Andhra Pradesh": ["Adoni","Amaravati","Anantapur","Chandragiri","Chittoor","Dowlaiswaram","Eluru","Guntur","Kadapa","Kakinada","Kurnool",
    "Machilipatnam","Nagarjunakoṇḍa","Rajahmundry","Srikakulam","Tirupati","Vijayawada","Visakhapatnam","Vizianagaram","Yemmiganur"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun"],
  "Assam": ["Dhuburi", "Dibrugarh", "Dispur", "Guwahati", "Jorhat", "Nagaon", "Sivasagar", "Silchar", "Tezpur", "Tinsukia"],
  "Bihar": ["Ara", "Barauni", "Begusarai", "Bettiah", "Bhagalpur", "Bihar Sharif", "Bodh Gaya", "Buxar", "Chapra", "Darbhanga", 
    "Dehri", "Dinapur Nizamat", "Gaya", "Hajipur", "Jamalpur", "Katihar", "Madhubani", "Motihari", "Munger", "Muzaffarpur", "Patna", "Purnia", "Pusa", "Saharsa", "Samastipur", "Sasaram", "Sitamarhi", "Siwan"],
  "Chandigarh (Union Territory)": ["Chandigarh"],
  "Chhattisgarh": ["Ambikapur", "Bhilai", "Bilaspur", "Dhamtari", "Durg", "Jagdalpur", "Raipur", "Rajnandgaon"],
  "Dadra and Nagar Haveli and Daman and Diu (Union Territory)": ["Daman", "Diu", "Silvassa"],
  "Delhi (National Capital Territory)": ["Delhi", "New Delhi"],
  "Goa": ["Madgaon", "Panaji"],
  "Gujarat": ["Ahmadabad", "Amreli", "Bharuch", "Bhavnagar", "Bhuj", "Dwarka", "Gandhinagar", "Godhra", "Jamnagar", "Junagadh", "Kandla", "Khambhat", "Kheda", "Mahesana", "Morbi", "Nadiad", "Navsari", "Okha", "Palanpur", "Patan", "Porbandar", "Rajkot", "Surat", "Surendranagar", "Valsad", "Veraval"],
  "Haryana": ["Ambala", "Bhiwani", "Chandigarh", "Faridabad", "Firozpur Jhirka", "Gurugram", "Hansi", "Hisar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Panipat", "Pehowa", "Rewari", "Rohtak", "Sirsa", "Sonipat"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Dalhousie", "Dharmshala", "Hamirpur", "Kangra", "Kullu", "Mandi", "Nahan", "Shimla", "Una"],
  "Jammu and Kashmir (Union Territory)": ["Anantnag", "Baramula", "Doda", "Gulmarg", "Jammu", "Kathua", "Punch", "Rajouri", "Srinagar", "Udhampur"],
  "Jharkhand": ["Bokaro", "Chaibasa", "Deoghar", "Dhanbad", "Dumka", "Giridih", "Hazaribag", "Jamshedpur", "Jharia", "Rajmahal", "Ranchi", "Saraikela"],
  "Karnataka": ["Badami", "Ballari", "Bengaluru", "Belagavi", "Bhadravati", "Bidar", "Chikkamagaluru", "Chitradurga", "Davangere", "Halebid", "Hassan", "Hubballi-Dharwad", "Kalaburagi", "Kolar", "Madikeri", "Mandya", "Mangaluru", "Mysuru", "Raichur", "Shivamogga", "Shravanabelagola", "Shrirangapattana", "Tumakuru", "Vijayapura"],
  "Kerala": ["Alappuzha", "Vatakara", "Idukki", "Kannur", "Kochi", "Kollam", "Kottayam", "Kozhikode", "Mattancheri", "Palakkad", "Thalassery", "Thiruvananthapuram", "Thrissur"],
  "Ladakh (Union Territory)": ["Kargil", "Leh"],
  "Madhya Pradesh": ["Balaghat", "Barwani", "Betul", "Bharhut", "Bhind", "Bhojpur", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dr. Ambedkar Nagar (Mhow)", "Guna", "Gwalior", "Hoshangabad", "Indore", "Itarsi", "Jabalpur", "Jhabua", "Khajuraho", "Khandwa", "Khargone", "Maheshwar", "Mandla", "Mandsaur", "Morena", "Murwara", "Narsimhapur", "Narsinghgarh", "Narwar", "Neemuch", "Nowgong", "Orchha", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Sarangpur", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Ujjain", "Vidisha"],
  "Maharashtra": ["Ahmadnagar", "Akola", "Amravati", "Aurangabad", "Bhandara", "Bhusawal", "Bid", "Buldhana", "Chandrapur", "Daulatabad", "Dhule", "Jalgaon", "Kalyan", "Karli", "Kolhapur", "Mahabaleshwar", "Malegaon", "Matheran", "Mumbai", "Nagpur", "Nanded", "Nashik", "Osmanabad", "Pandharpur", "Parbhani", "Pune", "Ratnagiri", "Sangli", "Satara", "Sevagram", "Solapur", "Thane", "Ulhasnagar", "Vasai-Virar", "Wardha", "Yavatmal"],
  "Manipur": ["Imphal"],
  "Meghalaya": ["Cherrapunji", "Shillong"],
  "Mizoram": ["Aizawl", "Lunglei"],
  "Nagaland": ["Kohima", "Mon", "Phek", "Wokha", "Zunheboto"],
  "Odisha": ["Balangir", "Baleshwar", "Baripada", "Bhubaneshwar", "Brahmapur", "Cuttack", "Dhenkanal", "Kendujhar", "Konark", "Koraput", "Paradip", "Phulabani", "Puri", "Sambalpur", "Udayagiri"],
  "Puducherry (Union Territory)": ["Karaikal", "Mahe", "Puducherry", "Yanam"],
  "Punjab": ["Amritsar", "Batala", "Chandigarh", "Faridkot", "Firozpur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Nabha", "Patiala", "Rupnagar", "Sangrur"],
  "Rajasthan": ["Abu", "Ajmer", "Alwar", "Amer", "Barmer", "Beawar", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittaurgarh", "Churu", "Dhaulpur", "Dungarpur", "Ganganagar",
    "Hanumangarh","Jaipur","Jaisalmer","Jalor","Jhalawar","Jhunjhunu","Jodhpur","Kishangarh","Kota","Merta","Nagaur","Nathdwara","Pali","Phalodi","Pushkar","Sawai Madhopur","Shahpura","Sikar","Sirohi","Tonk","Udaipur"],
  "Sikkim": ["Gangtok", "Gyalshing", "Lachung", "Mangan"],
  "Tamil Nadu": ["Arcot", "Chengalpattu", "Chennai", "Chidambaram", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kanchipuram", "Kanniyakumari", "Kodaikanal", "Kumbakonam", "Madurai", "Mamallapuram", "Nagappattinam", "Nagercoil", "Palayamkottai", "Pudukkottai", "Rajapalayam", "Ramanathapuram", "Salem", "Thanjavur", "Tiruchchirappalli", "Tirunelveli", "Tiruppur", "Thoothukudi", "Udhagamandalam", "Vellore"],
  "Telangana": ["Hyderabad", "Karimnagar", "Khammam", "Mahbubnagar", "Nizamabad", "Sangareddi", "Warangal"],
  "Tripura": ["Agartala"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Amroha", "Ayodhya", "Azamgarh", "Bahraich", "Ballia", "Banda", "Bara Banki", "Bareilly", "Basti", "Bijnor", "Bithur", "Budaun", "Bulandshahr", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad-cum-Fatehgarh", "Fatehpur", "Fatehpur Sikri", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur", "Lakhimpur", "Lalitpur", "Lucknow", "Mainpuri", "Mathura", "Meerut", "Mirzapur-Vindhyachal", "Moradabad", "Muzaffarnagar", "Partapgarh", "Pilibhit", "Prayagraj", "Rae Bareli", "Rampur", "Saharanpur", "Sambhal", "Shahjahanpur", "Sitapur", "Sultanpur", "Tehri", "Varanasi"],
  "Uttarakhand": ["Almora", "Dehra Dun", "Haridwar", "Mussoorie", "Nainital", "Pithoragarh"],
  "West Bengal": ["Alipore", "Alipur Duar", "Asansol", "Baharampur", "Bally", "Balurghat", "Bankura", "Baranagar", "Barasat", "Barrackpore", "Basirhat", "Bhatpara", "Bishnupur", "Budge Budge", "Burdwan", "Chandernagore", "Darjeeling", "Diamond Harbour", "Dum Dum", "Durgapur", "Halisahar", "Haora", "Hugli", "Ingraj Bazar", "Jalpaiguri", "Kalimpong", "Kamarhati", "Kanchrapara", "Kharagpur", "Cooch Behar", "Kolkata", "Krishnanagar", "Malda", "Midnapore", "Murshidabad", "Nabadwip", "Palashi", "Panihati", "Purulia", "Raiganj", "Santipur", "Shantiniketan", "Shrirampur", "Siliguri", "Siuri", "Tamluk", "Titagarh"],
  "Others": ['Others']
};


const dogBreeds = [
  'Beagle',
  'Labrador',
  'Dachshund',
  'Golden Retriever',
  'Great Dane',
  'Boxer',
  'Cocker Spaniel',
  'German Shepherd',
  'Indian Spitz',
  'Pug',
  'Mudhol hound',
  'Rottweiler',
  'Doberman',
  'Mastiff',
  'Pomeranian',
  'Rajapalayam',
  'Border Collie',
  'Bulldog',
  'Chippiparai',
  'Afghan Hound',
  'Basset Hound',
  'Dalmatian',
  'Indian Pariah dog',
  'Shih Tzu',
  'Others'
];

const DonatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    photo: '',
    photoPreview: '',
    name: '',
    age: '',
    breed: '',
    customBreed: '',
    state: '',
    city: '',
    customCity: '',
    phone: '',
    contactEmail: ''
  });

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.email) {
      setFormData(prev => ({ ...prev, contactEmail: user.email }));
    }
  }, []);

  useEffect(() => {
    if (formData.state && cityData[formData.state]) {
      setCities(cityData[formData.state]);
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    auth.signOut().then(() => navigate('/')).catch(console.error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setFormData(prev => ({ ...prev, state: value, city: '', customCity: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setError("Image size should be less than 5MB");
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return setError("Only JPG, PNG, or WEBP allowed");

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photo: file, photoPreview: reader.result }));
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const finalBreed = formData.breed === 'Others' ? formData.customBreed : formData.breed;
    const finalCity = formData.city === 'Others' || formData.state === 'Others' ? formData.customCity : formData.city;

    if (!formData.photo) return setError("Please upload a dog photo");
    if (!formData.name.trim()) return setError("Please enter the dog's name");
    if (!formData.age || isNaN(formData.age) || +formData.age <= 0) return setError("Please enter a valid age");
    if (!finalBreed) return setError("Please select or specify a breed");
    if (!formData.state || !finalCity) return setError("Please select both state and city");
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) return setError("Enter a valid 10-digit phone number");
    if (!formData.contactEmail) return setError("Email not available. Please login again.");
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const fileName = `dog_photos/${Date.now()}_${formData.photo.name}`;
      const imageRef = ref(storage, fileName);
      await uploadBytesResumable(imageRef, formData.photo);
      const downloadURL = await getDownloadURL(imageRef);

      const finalBreed = formData.breed === 'Others' ? formData.customBreed : formData.breed;
      const finalCity = formData.city === 'Others' ? formData.customCity : formData.city;

      const petData = {
        name: formData.name,
        age: formData.age,
        breed: finalBreed,
        state: formData.state,
        city: finalCity,
        phone: formData.phone,
        contactEmail: formData.contactEmail,
        photoUrl: downloadURL,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'donations'), petData);
      setSubmitSuccess(true);
      setFormData({
        photo: '',
        photoPreview: '',
        name: '',
        age: '',
        breed: '',
        customBreed: '',
        state: '',
        city: '',
        customCity: '',
        phone: '',
        contactEmail: auth.currentUser?.email || ''
      });
    } catch (err) {
      console.error("Submit error", err);
      setError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <nav className="navbar">
        <div className="navbar-content">
          <button className="navbar-brand" onClick={() => navigate('/home')}><FaPaw className="paw-icon" /> FurWell</button>
          <div className="navbar-right">
            <button className="favorite-btn"><FaHeart className="heart-icon" /></button>
            <button className="logout-btn" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
          </div>
        </div>
      </nav>

      <div className="donate-page-container">
        <div className="donate-form-container">
          <div className="donate-form">
            <h3>Donate a Pet</h3>
            {error && <div className="error-message"><FaExclamationTriangle /> {error}</div>}
            {submitSuccess && <div className="success-message">🎉 Your pet has been listed for adoption!</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Dog Photo *</label>
                <div className="photo-upload-wrapper">
                  <div className="photo-preview">
                    {formData.photoPreview ? <img src={formData.photoPreview} alt="Dog Preview" /> : <FaPaw className="placeholder-icon" />}
                  </div>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Dog Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Dog Age *</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required min="0" />
              </div>

              <div className="form-group">
                <label>Dog Breed *</label>
                <select name="breed" value={formData.breed} onChange={handleChange} required>
                  <option value="">Select Breed</option>
                  {dogBreeds.map((b, i) => <option key={i} value={b}>{b}</option>)}
                </select>
                {formData.breed === 'Others' && (
                  <input type="text" name="customBreed" value={formData.customBreed} onChange={handleChange} required placeholder="Enter breed" />
                )}
              </div>

              <div className="form-group">
                <label>State *</label>
                <select name="state" value={formData.state} onChange={handleChange} required>
                  <option value="">Select State</option>
                  {Object.keys(cityData).map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>City *</label>
                <select name="city" value={formData.city} onChange={handleChange} required disabled={!formData.state}>
                  <option value="">{formData.state ? 'Select City' : 'Select State First'}</option>
                  {cities.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
                {(formData.city === 'Others' || formData.state === 'Others') && (
                  <input type="text" name="customCity" value={formData.customCity} onChange={handleChange} required placeholder="Enter city" />
                )}
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} pattern="\d{10}" required placeholder="10-digit phone number" />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} readOnly required />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Donation'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
