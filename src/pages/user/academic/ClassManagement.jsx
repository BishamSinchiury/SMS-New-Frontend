import React, { useState, useEffect } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import styles from './Academic.module.css';
import academicService from '@/services/academicService';

/**
 * ClassManagement Component
 * 
 * Handles CRUD for academic classes (Grade levels).
 */
const ClassManagement = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentClass, setCurrentClass] = useState({
        name: '',
        level_order: 1
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await academicService.getClasses();
            // Sort by level_order by default
            const sortedClasses = response.sort((a, b) => a.level_order - b.level_order);
            setClasses(sortedClasses);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch classes:', err);
            setError('Could not load classes.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (cls = { name: '', level_order: 1 }) => {
        setCurrentClass(cls);
        setIsEditing(!!cls.id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentClass({ name: '', level_order: 1 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await academicService.updateClass(currentClass.id, currentClass);
            } else {
                await academicService.createClass(currentClass);
            }
            fetchClasses();
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save class:', err);
            alert('Failed to save class.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this class? All linked courses, batches, and subjects may be affected.')) return;
        try {
            await academicService.deleteClass(id);
            fetchClasses();
        } catch (err) {
            console.error('Failed to delete class:', err);
            alert('Failed to delete class.');
        }
    };

    return (
        <UserLayout title="Class Management">
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.description}>Manage grade levels and academic classes.</p>
                    <button className={styles.addBtn} onClick={() => handleOpenModal()}>
                        + Add New Class
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loading}>Loading classes...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : classes.length === 0 ? (
                    <div className={styles.empty}>No classes found. Add one to get started.</div>
                ) : (
                    <div className={styles.grid}>
                        {classes.map((cls) => (
                            <div key={cls.id} className={styles.card}>
                                <div className={styles.cardInfo}>
                                    <h3>{cls.name}</h3>
                                    <p>Level Order: {cls.level_order}</p>
                                </div>
                                <div className={styles.cardActions}>
                                    <button
                                        className={styles.editBtn}
                                        onClick={() => handleOpenModal(cls)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(cls.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Class Modal */}
                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h2>{isEditing ? 'Edit Class' : 'Add New Class'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label>Class Name</label>
                                    <input
                                        type="text"
                                        value={currentClass.name}
                                        onChange={(e) => setCurrentClass({ ...currentClass, name: e.target.value })}
                                        required
                                        placeholder="e.g. Class 10 or Nursery"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Level Order</label>
                                    <input
                                        type="number"
                                        value={currentClass.level_order}
                                        onChange={(e) => setCurrentClass({ ...currentClass, level_order: parseInt(e.target.value) })}
                                        required
                                        min="1"
                                    />
                                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                                        Used for sorting classes (e.g., 1 for Nursery, 10 for Class 10)
                                    </p>
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

export default ClassManagement;
