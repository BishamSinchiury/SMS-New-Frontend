import React, { useState, useEffect } from 'react';
import { orgService } from '@/services';
import AdminLayout from '@/components/layout/AdminLayout';
import styles from './OrganizationProfile.module.css';

const OrganizationProfile = () => {
    const [profile, setProfile] = useState({
        org_name: '',
        description: '',
        address: '',
        phone_number: '',
        website: '',
    });
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [isSetupMode, setIsSetupMode] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000/media/';

    const processLogoUrl = (rawUrl) => {
        if (!rawUrl) return null;
        if (rawUrl.startsWith('http')) return rawUrl;

        const path = rawUrl.startsWith('/media/')
            ? rawUrl.replace('/media/', '')
            : rawUrl;

        const base = MEDIA_URL.endsWith('/') ? MEDIA_URL : `${MEDIA_URL}/`;
        const relative = path.startsWith('/') ? path.slice(1) : path;

        return `${base}${relative}`;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await orgService.getProfile();
                if (response.data || response) {
                    const data = response.data || response;
                    setProfile({
                        org_name: data.organization_name || '',
                        description: data.description || '',
                        address: data.address || '',
                        phone_number: data.phone_number || '',
                        website: data.website || '',
                    });
                    if (data.logo) {
                        setLogoPreview(processLogoUrl(data.logo));
                    }
                }
            } catch (err) {
                console.error('Failed to fetch org profile:', err);
                if (err.status === 404) {
                    setError('NOT_FOUND');
                } else if (err.status === 403) {
                    setError('FORBIDDEN');
                } else {
                    setError('Failed to load organization profile.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [MEDIA_URL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Validate File Type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            setError('Invalid file type. Please upload an image (JPG, PNG, GIF, WEBP, or SVG).');
            return;
        }

        // 2. Validate File Size (2MB limit)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            setError('File is too large. Maximum size allowed is 2MB.');
            return;
        }

        // Clear error if validation passes
        setError('');
        setLogo(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            Object.keys(profile).forEach(key => {
                if (profile[key]) formData.append(key, profile[key]);
            });
            if (logo) {
                formData.append('logo', logo);
            }

            const response = await orgService.updateProfile(formData);
            const data = response.data || response;

            setSuccess('Organization profile updated successfully.');
            setEditMode(false);
            setIsSetupMode(false);
            setError('');

            // Sync local state with backend response
            setProfile({
                org_name: data.organization_name || '',
                description: data.description || '',
                address: data.address || '',
                phone_number: data.phone_number || '',
                website: data.website || '',
            });
            if (data.logo) {
                setLogoPreview(processLogoUrl(data.logo));
            }
        } catch (err) {
            console.error('Failed to update profile:', err);

            // Handle field-specific errors from backend (e.g., { "logo": ["error..."] })
            if (err.response?.data && typeof err.response.data === 'object') {
                const data = err.response.data;
                const messages = [];

                Object.keys(data).forEach(key => {
                    const value = data[key];
                    if (Array.isArray(value)) {
                        messages.push(`${key}: ${value.join(' ')}`);
                    } else if (typeof value === 'string') {
                        messages.push(`${key}: ${value}`);
                    }
                });

                if (messages.length > 0) {
                    setError(messages.join('\n'));
                } else {
                    setError(err.message || 'Failed to update organization profile.');
                }
            } else {
                setError(err.message || 'Failed to update organization profile.');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <AdminLayout title="Organization Profile">
            <div className={styles.loading}>Loading organization profile...</div>
        </AdminLayout>
    );

    if (error === 'FORBIDDEN') {
        return (
            <AdminLayout title="Organization Profile">
                <div className={styles.container}>
                    <div className={styles.errorCard}>
                        <h2>Access Denied</h2>
                        <p>You do not have permission to manage the organization profile.</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error === 'NOT_FOUND') {
        return (
            <AdminLayout title="Organization Profile">
                <div className={styles.container}>
                    <div className={styles.setupCard}>
                        {!isSetupMode ? (
                            <>
                                <h2>Organization Profile Not Initialized</h2>
                                <p>Your organization profile hasn't been set up yet.</p>
                                <div className={styles.actions} style={{ justifyContent: 'center' }}>
                                    <button
                                        className={styles.saveBtn}
                                        onClick={() => setIsSetupMode(true)}
                                    >
                                        Initialize Organization Profile
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2>Setup Your Organization</h2>
                                <form onSubmit={handleSubmit} className={styles.form}>
                                    <div className={styles.formGroup}>
                                        <label>Organization Name</label>
                                        <input
                                            type="text"
                                            name="org_name"
                                            value={profile.org_name}
                                            onChange={handleChange}
                                            required
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.actions}>
                                        <button type="submit" className={styles.saveBtn} disabled={saving}>
                                            {saving ? 'Initializing...' : 'Create Profile'}
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.backBtn}
                                            onClick={() => setIsSetupMode(false)}
                                            disabled={saving}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Organization Profile">
            <div className={styles.container}>
                {success && <div className={styles.successAlert}>{success}</div>}
                {error && <div className={styles.errorAlert}>{error}</div>}

                <div className={`${styles.profileCard} ${editMode ? styles.editMode : ''}`}>
                    <div className={styles.cardHeader}></div>
                    <div className={styles.cardBody}>
                        <div className={styles.cardLogoWrapper}>
                            {logoPreview ? (
                                <img
                                    src={logoPreview}
                                    alt="Org Logo"
                                    className={styles.cardLogo}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        setLogoPreview(null);
                                    }}
                                />
                            ) : (
                                <div className={styles.logoPlaceholder}>No Logo</div>
                            )}

                            {editMode && (
                                <label className={styles.logoUploadOverlay}>
                                    <input
                                        type="file"
                                        onChange={handleLogoChange}
                                        accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
                                        hidden
                                    />
                                    <div className={styles.uploadIcon}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                            <circle cx="12" cy="13" r="4"></circle>
                                        </svg>
                                    </div>
                                </label>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className={styles.profileForm}>
                            <div className={styles.cardTitleSection}>
                                <div className={styles.titleArea}>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="org_name"
                                            value={profile.org_name}
                                            onChange={handleChange}
                                            className={styles.orgNameInput}
                                            placeholder="Organization Name"
                                            required
                                            autoFocus
                                        />
                                    ) : (
                                        <h1 className={styles.orgName}>{profile.org_name}</h1>
                                    )}
                                </div>
                                <div className={styles.cardActions}>
                                    {!editMode ? (
                                        <button type="button" className={styles.editBtn} onClick={() => setEditMode(true)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                            </svg>
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <div className={styles.inlineActions}>
                                            <button type="submit" className={styles.saveBtn} disabled={saving}>
                                                {saving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button type="button" className={styles.cancelBtn} onClick={() => setEditMode(false)}>
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.contentSection}>
                                {editMode ? (
                                    <textarea
                                        name="description"
                                        value={profile.description}
                                        onChange={handleChange}
                                        className={styles.descriptionTextarea}
                                        placeholder="Briefly describe your organization..."
                                    />
                                ) : (
                                    <p className={styles.description}>
                                        {profile.description || 'No description provided for this organization.'}
                                    </p>
                                )}
                            </div>

                            <div className={styles.cardGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Phone</span>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="phone_number"
                                            value={profile.phone_number}
                                            onChange={handleChange}
                                            className={styles.inlineInput}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    ) : (
                                        <span className={styles.infoValue}>{profile.phone_number || 'Not provided'}</span>
                                    )}
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Website</span>
                                    {editMode ? (
                                        <input
                                            type="url"
                                            name="website"
                                            value={profile.website}
                                            onChange={handleChange}
                                            className={styles.inlineInput}
                                            placeholder="https://example.com"
                                        />
                                    ) : (
                                        <span className={styles.infoValue}>
                                            {profile.website ? (
                                                <a href={profile.website} target="_blank" rel="noopener noreferrer">
                                                    {profile.website}
                                                </a>
                                            ) : 'Not provided'}
                                        </span>
                                    )}
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Address</span>
                                    {editMode ? (
                                        <textarea
                                            name="address"
                                            value={profile.address}
                                            onChange={handleChange}
                                            className={styles.inlineTextarea}
                                            placeholder="Business address..."
                                        />
                                    ) : (
                                        <span className={styles.infoValue}>{profile.address || 'Not provided'}</span>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrganizationProfile;
