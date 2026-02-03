import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, User, Lock, Mail, ArrowRight } from 'lucide-react';
import AuthApi from '@/services/api/auth';
import { useAuth } from '@/context/AuthContext';
import GlassInput from '@/Components/UI/Inputs/GlassInput';
import OTPInput from '@/Components/UI/Inputs/OTPInput';
import styles from './Landing.module.css';

const Landing = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [signupStep, setSignupStep] = useState(1); // 1: details, 2: otp

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Placeholder Org Data
  const orgName = "School Portal";

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await AuthApi.login(formData.email, formData.password);
      window.location.reload(); // Or navigate + context update
      // navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await AuthApi.signup(formData.email, formData.password);
      setSignupStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await AuthApi.verifySignup(formData.email, otp);
      // Navigate to org setup after successful signup/login
      navigate('/org-setup');
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background Shapes */}
      <div className={`${styles.shape} ${styles.shape1}`} />
      <div className={`${styles.shape} ${styles.shape2}`} />

      <div className={styles.content}>
        {/* Left: Branding */}
        <div className={styles.branding}>
          <h1 className={styles.heroTitle}>The Future of <br />Education is Here</h1>
          <p className={styles.heroSubtitle}>
            Welcome to <strong>{orgName}</strong>. Access your personalized dashboard to manage academics, attendance, and performance with ease.
          </p>
        </div>

        {/* Right: Auth Card */}
        <div className={styles.authCard}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${authMode === 'login' ? styles.activeTab : ''}`}
              onClick={() => { setAuthMode('login'); setError(null); }}
            >
              Login
            </button>
            <button
              className={`${styles.tab} ${authMode === 'signup' ? styles.activeTab : ''}`}
              onClick={() => { setAuthMode('signup'); setSignupStep(1); setError(null); }}
            >
              Sign Up
            </button>
          </div>

          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              {authMode === 'login' ? 'Welcome Back' : (signupStep === 1 ? 'Create Account' : 'Verify Email')}
            </h2>
            <p className={styles.cardSubtitle}>
              {authMode === 'login'
                ? 'Enter your credentials to access your account'
                : (signupStep === 1 ? 'Start your journey with us' : `Enter code sent to ${formData.email}`)
              }
            </p>
          </div>

          {error && (
            <div className={styles.error}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {authMode === 'login' && (
            <form onSubmit={handleLogin}>
              <GlassInput
                id="email"
                type="email"
                placeholder="Email Address"
                icon={Mail}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <GlassInput
                id="password"
                type="password"
                placeholder="Password"
                icon={Lock}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <div className={styles.forgotPasswordWrapper}>
                <a href="#" className={styles.forgotPassword}>Forgot password?</a>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}

          {authMode === 'signup' && signupStep === 1 && (
            <form onSubmit={handleSignup}>
              <GlassInput
                id="email"
                type="email"
                placeholder="Email Address"
                icon={Mail}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <GlassInput
                id="password"
                type="password"
                placeholder="Password"
                icon={Lock}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <GlassInput
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Creating Account...' : 'Continue'} <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
              </button>
            </form>
          )}

          {authMode === 'signup' && signupStep === 2 && (
            <form onSubmit={handleVerifySignup}>
              <OTPInput
                length={6}
                value={otp}
                onChange={setOtp}
              />
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Setup'}
              </button>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setSignupStep(1)}
              >
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;