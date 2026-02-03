import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OrgSetup.module.css';
import BasicInfo from './Steps/BasicInfo';
import ContactInfo from './Steps/ContactInfo';
import Branding from './Steps/Branding';
import OrgApi from '@/services/api/org';
import { useToast } from '@/Components/Toast/ToastContext';

const STEPS = [
  { id: 1, label: 'Basic Info' },
  { id: 2, label: 'Contact & Location' },
  { id: 3, label: 'Branding' }
];

const OrgSetup = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    established_date: '',
    pan_vat_number: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    latitude: '',
    longitude: '',
    logo: null,
    theme_color_primary: '#6366f1',
    theme_color_secondary: '#ec4899'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Organization name is required';
      if (!formData.established_date) newErrors.established_date = 'Established date is required';
    }

    if (step === 2) {
      if (!formData.contact_email) {
        newErrors.contact_email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
        newErrors.contact_email = 'Invalid email format';
      }
      if (!formData.contact_phone) newErrors.contact_phone = 'Phone number is required';
      if (!formData.address) newErrors.address = 'Address is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const domain = window.location.hostname;
      const data = new FormData();

      // Append all fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });
      data.append('domain_name', domain);

      await OrgApi.createProfile(data);

      success('Organization profile created successfully!');

      // Update session storage to reflect new status
      sessionStorage.removeItem("orgStatus");

      // Redirect to home/dashboard
      navigate('/', { replace: true });

    } catch (err) {
      console.error(err);
      error(err.response?.data?.error || 'Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfo formData={formData} handleChange={handleChange} errors={errors} />;
      case 2:
        return <ContactInfo formData={formData} handleChange={handleChange} setFormData={setFormData} errors={errors} />;
      case 3:
        return <Branding formData={formData} handleChange={handleChange} setFormData={setFormData} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.formCard}`}>
        <div className={styles.header}>
          <h1 className={`text-gradient ${styles.title}`}>Setup Organization</h1>
          <p className={styles.subtitle}>Let's get your digital campus ready</p>
        </div>

        <div>
          <div className={styles.progressContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
          <div className={styles.stepsIndicator}>
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`${styles.step} ${currentStep >= step.id ? styles.active : ''} ${currentStep > step.id ? styles.completed : ''}`}
              >
                <div className={styles.stepDot}>
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <span className={styles.stepLabel}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[300px]">
          {renderStep()}
        </div>

        <div className={styles.actions}>
          <button
            onClick={handleBack}
            className="btn-glass"
            disabled={currentStep === 1 || isSubmitting}
            style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
          >
            Back
          </button>

          {currentStep < STEPS.length ? (
            <button onClick={handleNext} className="btn-primary">
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Setting up...' : 'Complete Setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrgSetup;