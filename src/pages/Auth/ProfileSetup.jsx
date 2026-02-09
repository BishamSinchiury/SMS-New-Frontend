import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Calendar, ArrowRight, AlertCircle, LogOut } from 'lucide-react';
import AuthApi from '@/services/api/auth';
import { useAuth } from '@/context/AuthContext';
import GlassInput from '@/Components/UI/Inputs/GlassInput';
import styles from '@/Features/Website/landing/Landing.module.css'; // Reusing landing styles for consistency
import setupStyles from './ProfileSetup.module.css'; // Specific overrides

const ProfileSetup = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        date_of_birth: '',
        gender: 'M',
        phone_number: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await AuthApi.submitProfile(formData);
            // On success, redirect to status page
            navigate('/status');
            window.location.reload(); // Ensure context updates
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.response?.data?.detail || "Failed to submit profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className={styles.container}>
            {/* Background Shapes */}
            <div className={`${styles.shape} ${styles.shape1}`} />
            <div className={`${styles.shape} ${styles.shape2}`} />

            <div className={setupStyles.wrapper}>
                <div className={styles.authCard} style={{ maxWidth: '600px', width: '100%' }}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Complete Your Profile</h2>
                        <p className={styles.cardSubtitle}>
                            Please provide your details to request dashboard access.
                        </p>
                    </div>

                    {error && (
                        <div className={styles.error}>
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className={setupStyles.row}>
                            <GlassInput
                                id="first_name"
                                placeholder="First Name"
                                icon={User}
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                            <GlassInput
                                id="last_name"
                                placeholder="Last Name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={setupStyles.row}>
                            <div className={setupStyles.selectGroup}>
                                <label className={setupStyles.label}>Gender</label>
                                <select
                                    id="gender"
                                    className={setupStyles.select}
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Other</option>
                                </select>
                            </div>

                            <div className={setupStyles.dateGroup}>
                                <label className={setupStyles.label}>Date of Birth</label>
                                <input
                                    id="date_of_birth"
                                    type="date"
                                    className={setupStyles.dateInput}
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <GlassInput
                            id="phone_number"
                            type="tel"
                            placeholder="Phone Number"
                            icon={Phone}
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                        />

                        <GlassInput
                            id="address"
                            placeholder="Address"
                            icon={MapPin}
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Request'} <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                        </button>
                    </form>

                    <button
                        onClick={handleLogout}
                        className={styles.backBtn}
                        style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;
