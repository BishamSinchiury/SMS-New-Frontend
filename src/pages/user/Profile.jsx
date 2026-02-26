import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import userService from '@/services/userService';
import authService from '@/services/authService';
import styles from './Profile.module.css';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Clock,
    CheckCircle,
    AlertCircle,
    Send,
    Edit3,
    Camera,
    X,
    Briefcase
} from 'lucide-react';

const Profile = () => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileExists, setProfileExists] = useState(true);
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        address: '',
        bio: '',
        gender: 'OTHER'
    });
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (user?.approval_status === 'PENDING_PROFILE') {
            setIsEditing(true);
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await userService.getProfile();
            setProfileExists(true);
            if (data) {
                setProfileData({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    phone_number: data.phone_number || '',
                    address: data.address || '',
                    bio: data.bio || '',
                    gender: data.gender || 'OTHER'
                });
                if (data.photo) {
                    setPhotoPreview(data.photo);
                }
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setProfileExists(false);
                setIsEditing(true); // Automatically open editor for new users
            } else {
                console.error('Error fetching profile:', error);
                setMessage({ type: 'error', text: 'Failed to load profile details.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            setMessage({ type: '', text: '' });

            const formData = new FormData();
            Object.keys(profileData).forEach(key => {
                formData.append(key, profileData[key]);
            });
            if (photo) {
                formData.append('photo', photo);
            }

            // Also include extension data if needed (atomic setup)
            // For now keeping it simple as per implementation plan
            await userService.setupProfile(formData);

            setMessage({ type: 'success', text: profileExists ? 'Profile updated successfully!' : 'Profile created successfully! Awaiting approval.' });
            setIsEditing(false);
            setProfileExists(true);

            // Refresh user data to get updated status
            const updatedUser = await authService.getMe();
            login(updatedUser);
            fetchProfile();

        } catch (error) {
            console.error('Error submitting profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please check fields.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className={styles.container}>Loading profile...</div>;

    const status = user?.approval_status;
    const rejectionReason = user?.rejection_reason;
    const roleDisplay = user?.roles?.map(r => typeof r === 'string' ? r : r.name).join(', ') || 'Base User';

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>User Profile</h1>
                <p>Manage your personal information and track approval status.</p>
            </div>

            {!profileExists && !isEditing && (
                <div className={`${styles.banner} ${styles.noProfile}`}>
                    <AlertCircle size={20} />
                    <div>
                        <strong>No Profile Found</strong>
                        <p>It looks like you haven't set up your profile yet. Please create one to continue.</p>
                    </div>
                    <button className={styles.createBtn} onClick={() => setIsEditing(true)}>
                        Create Profile Now
                    </button>
                </div>
            )}

            <div className={styles.statusBanners}>
                {status === 'PENDING_PROFILE' && profileExists && (
                    <div className={`${styles.banner} ${styles.pendingSetup}`}>
                        <AlertCircle size={20} />
                        <div>
                            <strong>Profile Setup Required</strong>
                            <p>Please complete your profile details to gain access to all features.</p>
                        </div>
                    </div>
                )}

                {status === 'PENDING_APPROVAL' && (
                    <div className={`${styles.banner} ${styles.pendingApproval}`}>
                        <Clock size={20} />
                        <div>
                            <strong>Approval Pending</strong>
                            <p>Your profile is currently under review by our administrators.</p>
                        </div>
                    </div>
                )}

                {status === 'REJECTED' && (
                    <div className={`${styles.banner} ${styles.rejected}`}>
                        <AlertCircle size={20} />
                        <div>
                            <strong>Profile Rejected</strong>
                            <div className={styles.rejectionSection}>
                                <p>Your profile was not approved for the following reason:</p>
                                <div className={styles.rejectionReason}>"{rejectionReason}"</div>
                                <p>Please update your information and resubmit.</p>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'APPROVED' && (
                    <div className={`${styles.banner} ${styles.approved}`}>
                        <CheckCircle size={20} />
                        <div>
                            <strong>Profile Approved</strong>
                            <p>All set! Your profile is verified and active.</p>
                        </div>
                    </div>
                )}
            </div>

            {message.text && (
                <div className={`${styles.banner} ${styles[message.type]}`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <p>{message.text}</p>
                </div>
            )}

            <div className={styles.profileContent}>
                {!isEditing && profileExists ? (
                    <div className={styles.profileCard}>
                        <div className={styles.cardHeader}>
                            <img
                                src={photoPreview || '/default-avatar.png'}
                                alt="Profile"
                                className={styles.largeAvatar}
                                onError={(e) => {
                                    if (e.target.src.indexOf('/default-avatar.png') === -1) {
                                        e.target.src = '/default-avatar.png';
                                    }
                                }}
                            />
                            <div className={styles.headerInfo}>
                                <h2>{profileData.first_name} {profileData.last_name}</h2>
                                <span className={styles.roleChip}>{roleDisplay}</span>
                            </div>
                        </div>

                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <Mail className={styles.infoIcon} size={20} />
                                <div className={styles.infoContent}>
                                    <label>Email Address</label>
                                    <p>{user?.email}</p>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <Phone className={styles.infoIcon} size={20} />
                                <div className={styles.infoContent}>
                                    <label>Phone Number</label>
                                    <p>{profileData.phone_number || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <MapPin className={styles.infoIcon} size={20} />
                                <div className={styles.infoContent}>
                                    <label>Residential Address</label>
                                    <p>{profileData.address || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <User className={styles.infoIcon} size={20} />
                                <div className={styles.infoContent}>
                                    <label>Gender</label>
                                    <p>{profileData.gender}</p>
                                </div>
                            </div>
                            {profileData.bio && (
                                <div className={styles.infoItem} style={{ gridColumn: '1 / -1' }}>
                                    <Edit3 className={styles.infoIcon} size={20} />
                                    <div className={styles.infoContent}>
                                        <label>Biography</label>
                                        <p>{profileData.bio}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.actions}>
                            <button
                                className={styles.editBtn}
                                onClick={() => setIsEditing(true)}
                                disabled={status === 'PENDING_APPROVAL'}
                            >
                                <Edit3 size={18} />
                                Edit Profile information
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className={styles.editHeader}>
                            <h3>{profileExists ? 'Update Profile' : 'Create Your Profile'}</h3>
                            <p>{profileExists ? 'Modify your existing information.' : 'Enter your details to get started.'}</p>
                        </div>

                        <div
                            className={styles.photoUpload}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                hidden
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className={styles.photoPreview} />
                            ) : (
                                <div className={styles.uploadPlaceholder}>
                                    <Camera size={40} />
                                    <span>{profileExists ? 'Change' : 'Upload'} Profile Photo</span>
                                </div>
                            )}
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={profileData.first_name}
                                    onChange={handleChange}
                                    placeholder="E.g. John"
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={profileData.last_name}
                                    onChange={handleChange}
                                    placeholder="E.g. Doe"
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={user?.email}
                                    disabled
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={profileData.phone_number}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Gender</label>
                                <select
                                    name="gender"
                                    value={profileData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                                <label>Residential Address</label>
                                <textarea
                                    name="address"
                                    value={profileData.address}
                                    onChange={handleChange}
                                    placeholder="Full street address..."
                                    rows="2"
                                />
                            </div>
                            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                                <label>Short Biography</label>
                                <textarea
                                    name="bio"
                                    value={profileData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about yourself..."
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className={styles.actions}>
                            {profileExists && (
                                <button
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    'Saving...'
                                ) : (
                                    <>
                                        {status === 'REJECTED' ? <Edit3 size={18} /> : <Send size={18} />}
                                        {status === 'REJECTED' ? 'Resubmit Profile' : (profileExists ? 'Save Changes' : 'Create Profile')}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
