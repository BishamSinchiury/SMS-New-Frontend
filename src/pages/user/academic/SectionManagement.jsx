import React, { useState, useEffect } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import styles from './Academic.module.css';
import academicService from '@/services/academicService';

/**
 * SectionManagement Component
 * 
 * Handles CRUD for sub-divisions of batches (e.g., Section A, Section B).
 */
const SectionManagement = () => {
    const [sections, setSections] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSection, setCurrentSection] = useState({
        name: '',
        batch: '',
        room_number: '',
        capacity: 40
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [sectionsRes, batchesRes] = await Promise.all([
                academicService.getSections(),
                academicService.getBatches()
            ]);
            setSections(sectionsRes);
            setBatches(batchesRes);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch sections:', err);
            setError('Could not load section data.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (section = { name: '', batch: '', room_number: '', capacity: 40 }) => {
        setCurrentSection(section);
        setIsEditing(!!section.id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentSection({ name: '', batch: '', room_number: '', capacity: 40 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await academicService.updateSection(currentSection.id, currentSection);
            } else {
                await academicService.createSection(currentSection);
            }
            fetchInitialData();
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save section:', err);
            alert('Failed to save section.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This will delete all enrollments and schedules for this section.')) return;
        try {
            await academicService.deleteSection(id);
            fetchInitialData();
        } catch (err) {
            console.error('Failed to delete section:', err);
        }
    };

    return (
        <UserLayout title="Section Management">
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.description}>Manage sub-divisions and class sections.</p>
                    <button className={styles.addBtn} onClick={() => handleOpenModal()}>
                        + Add New Section
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loading}>Loading sections...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : sections.length === 0 ? (
                    <div className={styles.empty}>No sections found.</div>
                ) : (
                    <div className={styles.grid}>
                        {sections.map((section) => (
                            <div key={section.id} className={styles.card}>
                                <div className={styles.cardInfo}>
                                    <h3>{section.name}</h3>
                                    <p><strong>Class:</strong> {section.class_name}</p>
                                    <p><strong>Batch:</strong> {section.batch_name}</p>
                                    <p><strong>Room:</strong> {section.room_number || 'N/A'}</p>
                                    <p><strong>Capacity:</strong> {section.capacity}</p>
                                </div>
                                <div className={styles.cardActions}>
                                    <button className={styles.editBtn} onClick={() => handleOpenModal(section)}>Edit</button>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(section.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Section Modal */}
                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h2>{isEditing ? 'Edit Section' : 'Add New Section'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label>Section Name</label>
                                    <input
                                        type="text"
                                        value={currentSection.name}
                                        onChange={(e) => setCurrentSection({ ...currentSection, name: e.target.value })}
                                        required
                                        placeholder="e.g. Section A"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Batch</label>
                                    <select
                                        value={currentSection.batch}
                                        onChange={(e) => setCurrentSection({ ...currentSection, batch: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Batch</option>
                                        {batches.map(b => (
                                            <option key={b.id} value={b.id}>
                                                {b.academic_class_name} — {b.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Room Number</label>
                                    <input
                                        type="text"
                                        value={currentSection.room_number}
                                        onChange={(e) => setCurrentSection({ ...currentSection, room_number: e.target.value })}
                                        placeholder="e.g. 101 or Lab 1"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Capacity</label>
                                    <input
                                        type="number"
                                        value={currentSection.capacity}
                                        onChange={(e) => setCurrentSection({ ...currentSection, capacity: parseInt(e.target.value) })}
                                        required
                                        min="1"
                                    />
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

export default SectionManagement;
