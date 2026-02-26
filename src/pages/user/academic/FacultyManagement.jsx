import React, { useState, useEffect } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import styles from './Academic.module.css';
import academicService from '@/services/academicService';

/**
 * FacultyManagement Component
 * 
 * Handles CRUD for academic faculties (Science, Arts, etc.)
 */
const FacultyManagement = () => {
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFaculty, setCurrentFaculty] = useState({ name: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchFaculties();
    }, []);

    const fetchFaculties = async () => {
        try {
            setLoading(true);
            const response = await academicService.getFaculties();
            setFaculties(response);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch faculties:', err);
            setError('Could not load faculties. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (faculty = { name: '', description: '' }) => {
        setCurrentFaculty(faculty);
        setIsEditing(!!faculty.id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentFaculty({ name: '', description: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await academicService.updateFaculty(currentFaculty.id, currentFaculty);
            } else {
                await academicService.createFaculty(currentFaculty);
            }
            fetchFaculties();
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save faculty:', err);
            alert('Failed to save faculty. Please check your input.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this faculty?')) return;
        try {
            await academicService.deleteFaculty(id);
            fetchFaculties();
        } catch (err) {
            console.error('Failed to delete faculty:', err);
            alert('Failed to delete faculty.');
        }
    };

    return (
        <UserLayout title="Faculty Management">
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.description}>Manage broad educational departments and faculties.</p>
                    <button className={styles.addBtn} onClick={() => handleOpenModal()}>
                        + Add New Faculty
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loading}>Loading faculties...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : faculties.length === 0 ? (
                    <div className={styles.empty}> No faculties found. Add one to get started.</div>
                ) : (
                    <div className={styles.grid}>
                        {faculties.map((faculty) => (
                            <div key={faculty.id} className={styles.card}>
                                <div className={styles.cardInfo}>
                                    <h3>{faculty.name}</h3>
                                    <p>{faculty.description || 'No description provided.'}</p>
                                </div>
                                <div className={styles.cardActions}>
                                    <button
                                        className={styles.editBtn}
                                        onClick={() => handleOpenModal(faculty)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(faculty.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Simple Modal Overlay */}
                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h2>{isEditing ? 'Edit Faculty' : 'Add New Faculty'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        value={currentFaculty.name}
                                        onChange={(e) => setCurrentFaculty({ ...currentFaculty, name: e.target.value })}
                                        required
                                        placeholder="e.g. Faculty of Science"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Description</label>
                                    <textarea
                                        value={currentFaculty.description}
                                        onChange={(e) => setCurrentFaculty({ ...currentFaculty, description: e.target.value })}
                                        placeholder="Brief description of the faculty"
                                    />
                                </div>
                                <div className={styles.modalButtons}>
                                    <button type="button" onClick={handleCloseModal} className={styles.cancelBtn}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.saveBtn}>
                                        {isEditing ? 'Update' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

export default FacultyManagement;
