import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { auth, googleProvider } from '../authentication/firebase';
import { FaGoogle } from 'react-icons/fa';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      if (!user.emailVerified) {
        setError('Please verify your email before logging in.');
        setLoading(false);
        return;
      }

      navigate('/home');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setError('Verification email sent. Please verify before logging in.');
    } catch (err) {
      setError('Error creating account. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/home');
    } catch (err) {
      setError('Error signing in with Google. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="welcome-container">
      <div className="glass-card">
        <h2 className="text-center mb-4">Welcome to FurWell</h2>
        <div className="btn-group w-100 mb-4">
          <button
            className={`btn ${activeTab === 'login' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`btn ${activeTab === 'signup' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('signup')}
          >
            Signup
          </button>
        </div>

        {activeTab === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control input-field"
                placeholder="Enter Gmail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control input-field"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-success w-100 button-animate" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="or-separator">OR</div>

            <button className="btn btn-google w-100 button-animate" onClick={handleGoogleAuth} disabled={loading}>
              <FaGoogle /> {loading ? 'Logging in...' : 'Continue with Google'}
            </button>
          </form>
        )}

        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control input-field"
                placeholder="Enter Gmail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control input-field"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-success w-100 button-animate" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            

            <div className="or-separator">OR</div>

            <button className="btn btn-google w-100 button-animate" onClick={handleGoogleAuth} disabled={loading}>
              <FaGoogle /> {loading ? 'Signing up...' : 'Signup with Google'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Welcome;
