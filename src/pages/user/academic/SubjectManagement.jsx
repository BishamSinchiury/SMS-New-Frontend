import React, { useState, useEffect } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import styles from './Academic.module.css';
import academicService from '@/services/academicService';

/**
 * SubjectManagement Component
 * 
 * Handles CRUD for curriculum subjects assigned to classes.
 */
const SubjectManagement = () => {
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSubject, setCurrentSubject] = useState({
        name: '',
        code: '',
        academic_class: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [subjectsRes, classesRes] = await Promise.all([
                academicService.getSubjects(),
                academicService.getClasses()
            ]);
            setSubjects(subjectsRes);
            setClasses(classesRes);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Could not load subjects.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (subject = { name: '', code: '', academic_class: '' }) => {
        setCurrentSubject(subject);
        setIsEditing(!!subject.id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentSubject({ name: '', code: '', academic_class: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await academicService.updateSubject(currentSubject.id, currentSubject);
            } else {
                await academicService.createSubject(currentSubject);
            }
            fetchInitialData();
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save subject:', err);
            alert('Failed to save subject.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This will affect teacher assignments and schedules.')) return;
        try {
            await academicService.deleteSubject(id);
            fetchInitialData();
        } catch (err) {
            console.error('Failed to delete subject:', err);
        }
    };

    return (
        <UserLayout title="Subject Management">
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.description}>Manage curriculum subjects and course modules.</p>
                    <button className={styles.addBtn} onClick={() => handleOpenModal()}>
                        + Add New Subject
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loading}>Loading subjects...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : subjects.length === 0 ? (
                    <div className={styles.empty}>No subjects found.</div>
                ) : (
                    <div className={styles.grid}>
                        {subjects.map((subject) => (
                            <div key={subject.id} className={styles.card}>
                                <div className={styles.cardInfo}>
                                    <h3>{subject.name}</h3>
                                    <p>Code: {subject.code || 'N/A'}</p>
                                    <p>Class: {subject.academic_class_name}</p>
                                </div>
                                <div className={styles.cardActions}>
                                    <button className={styles.editBtn} onClick={() => handleOpenModal(subject)}>Edit</button>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(subject.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Subject Modal */}
                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h2>{isEditing ? 'Edit Subject' : 'Add New Subject'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label>Subject Name</label>
                                    <input
                                        type="text"
                                        value={currentSubject.name}
                                        onChange={(e) => setCurrentSubject({ ...currentSubject, name: e.target.value })}
                                        required
                                        placeholder="e.g. Mathematics"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Subject Code</label>
                                    <input
                                        type="text"
                                        value={currentSubject.code}
                                        onChange={(e) => setCurrentSubject({ ...currentSubject, code: e.target.value })}
                                        placeholder="e.g. MATH101"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Academic Class</label>
                                    <select
                                        value={currentSubject.academic_class}
                                        onChange={(e) => setCurrentSubject({ ...currentSubject, academic_class: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className={styles.modalButtons}>
                                    <button type="button" onClick={handleCloseModal} className={styles.cancelBtn}>Cancel</button>
                                    <button type="submit" className={styles.saveBtn}>{isEditing ? 'Update' : 'Save'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

export default SubjectManagement;
