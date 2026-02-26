import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import userService from '@/services/userService';
import styles from './ProfileSetup.module.css';

const ProfileSetup = () => {
    const navigate = useNavigate();
    const { user, checkAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        first_name: user?.person_profile?.first_name || '',
        last_name: user?.person_profile?.last_name || '',
        phone_number: user?.person_profile?.phone_number || '',
        date_of_birth: user?.person_profile?.date_of_birth || '',
        gender: user?.person_profile?.gender || '',
        address: user?.person_profile?.address || '',
        student_profile: {
            admission_number: user?.person_profile?.student_profile?.admission_number || ''
        },
        teacher_profile: {
            employee_id: user?.person_profile?.teacher_profile?.employee_id || '',
            specialization: user?.person_profile?.teacher_profile?.specialization || ''
        },
        employee_profile: {
            employee_id: user?.person_profile?.employee_profile?.employee_id || '',
            department: user?.person_profile?.employee_profile?.department || '',
            designation: user?.person_profile?.employee_profile?.designation || ''
        },
        guardian_profile: {
            occupation: user?.person_profile?.guardian_profile?.occupation || ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Prepare data based on roles
        const submitData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            date_of_birth: formData.date_of_birth,
            gender: formData.gender,
            address: formData.address,
        };

        if (user?.roles?.includes('STUDENT')) {
            submitData.student_profile = formData.student_profile;
        }
        if (user?.roles?.includes('TEACHER')) {
            submitData.teacher_profile = formData.teacher_profile;
        }
        if (user?.roles?.includes('STAFF')) {
            submitData.employee_profile = formData.employee_profile;
        }
        if (user?.roles?.includes('GUARDIAN')) {
            submitData.guardian_profile = formData.guardian_profile;
        }

        try {
            await userService.setupProfile(submitData);
            await checkAuth();
            navigate(ROUTES.DASHBOARD);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const hasRole = (role) => user?.roles?.includes(role);

    return (
        <div className={styles.setupContainer}>
            <div className={styles.setupCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Complete Your Profile</h1>
                    <p className={styles.description}>
                        Please provide your details to complete your registration.
                    </p>
                </div>

                {error && <div className={styles.errorAlert}>{error}</div>}

                {user?.approval_status === 'REJECTED' && (
                    <div className={styles.rejectionAlert}>
                        <strong>Profile Rejected:</strong> {user.rejection_reason}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>First Name</label>
                        <input type="text" name="first_name" className={styles.input} value={formData.first_name} onChange={handleChange} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Last Name</label>
                        <input type="text" name="last_name" className={styles.input} value={formData.last_name} onChange={handleChange} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Phone Number</label>
                        <input type="tel" name="phone_number" className={styles.input} value={formData.phone_number} onChange={handleChange} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Date of Birth</label>
                        <input type="date" name="date_of_birth" className={styles.input} value={formData.date_of_birth} onChange={handleChange} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Gender</label>
                        <select name="gender" className={styles.input} value={formData.gender} onChange={handleChange} required>
                            <option value="">Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div className={styles.fullWidth}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Address</label>
                            <textarea name="address" className={styles.textarea} value={formData.address} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Dynamic Role-Based Fields */}
                    {hasRole('STUDENT') && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Admission Number</label>
                            <input type="text" name="student_profile.admission_number" className={styles.input} value={formData.student_profile.admission_number} onChange={handleChange} />
                        </div>
                    )}

                    {hasRole('TEACHER') && (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Employee ID</label>
                                <input type="text" name="teacher_profile.employee_id" className={styles.input} value={formData.teacher_profile.employee_id} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Specialization</label>
                                <input type="text" name="teacher_profile.specialization" className={styles.input} value={formData.teacher_profile.specialization} onChange={handleChange} />
                            </div>
                        </>
                    )}

                    {hasRole('STAFF') && (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Employee ID</label>
                                <input type="text" name="employee_profile.employee_id" className={styles.input} value={formData.employee_profile.employee_id} onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Department</label>
                                <input type="text" name="employee_profile.department" className={styles.input} value={formData.employee_profile.department} onChange={handleChange} />
                            </div>
                        </>
                    )}

                    {hasRole('GUARDIAN') && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Occupation</label>
                            <input type="text" name="guardian_profile.occupation" className={styles.input} value={formData.guardian_profile.occupation} onChange={handleChange} />
                        </div>
                    )}

                    <div className={styles.fullWidth}>
                        <button type="submit" className={styles.submitBtn} disabled={loading || user?.approval_status === 'PENDING_APPROVAL'}>
                            {loading ? 'Submitting...' : 'Complete Registration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;
