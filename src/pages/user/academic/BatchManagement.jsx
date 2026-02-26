import React, { useState, useEffect } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import styles from './Academic.module.css';
import academicService from '@/services/academicService';

/**
 * BatchManagement Component
 * 
 * Handles CRUD for academic batches (Sessions/Cohorts).
 */
const BatchManagement = () => {
    const [batches, setBatches] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBatch, setCurrentBatch] = useState({
        name: '',
        academic_class: '',
        start_date: '',
        end_date: '',
        is_active: true
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [batchesRes, classesRes] = await Promise.all([
                academicService.getBatches(),
                academicService.getClasses()
            ]);
            setBatches(batchesRes);
            setClasses(classesRes);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch batches:', err);
            setError('Could not load batch data.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (batch = { name: '', academic_class: '', start_date: '', end_date: '', is_active: true }) => {
        setCurrentBatch(batch);
        setIsEditing(!!batch.id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentBatch({ name: '', academic_class: '', start_date: '', end_date: '', is_active: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await academicService.updateBatch(currentBatch.id, currentBatch);
            } else {
                await academicService.createBatch(currentBatch);
            }
            fetchInitialData();
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save batch:', err);
            alert('Failed to save batch. Ensure dates are valid.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This will affect all student enrollments in this batch.')) return;
        try {
            await academicService.deleteBatch(id);
            fetchInitialData();
        } catch (err) {
            console.error('Failed to delete batch:', err);
        }
    };

    return (
        <UserLayout title="Batch Management">
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.description}>Manage intake batches and academic years.</p>
                    <button className={styles.addBtn} onClick={() => handleOpenModal()}>
                        + Add New Batch
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loading}>Loading batches...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : batches.length === 0 ? (
                    <div className={styles.empty}>No batches found.</div>
                ) : (
                    <div className={styles.grid}>
                        {batches.map((batch) => (
                            <div key={batch.id} className={styles.card}>
                                <div className={styles.cardInfo}>
                                    <h3>{batch.name}</h3>
                                    <p><strong>Class:</strong> {batch.academic_class_name}</p>
                                    <p><strong>Dates:</strong> {batch.start_date} to {batch.end_date}</p>
                                    <p><strong>Status:</strong> {batch.is_active ? 'Active' : 'Inactive'}</p>
                                </div>
                                <div className={styles.cardActions}>
                                    <button className={styles.editBtn} onClick={() => handleOpenModal(batch)}>Edit</button>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(batch.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Batch Modal */}
                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h2>{isEditing ? 'Edit Batch' : 'Add New Batch'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label>Batch Name</label>
                                    <input
                                        type="text"
                                        value={currentBatch.name}
                                        onChange={(e) => setCurrentBatch({ ...currentBatch, name: e.target.value })}
                                        required
                                        placeholder="e.g. Session 2024"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Academic Class</label>
                                    <select
                                        value={currentBatch.academic_class}
                                        onChange={(e) => setCurrentBatch({ ...currentBatch, academic_class: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        value={currentBatch.start_date}
                                        onChange={(e) => setCurrentBatch({ ...currentBatch, start_date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        value={currentBatch.end_date}
                                        onChange={(e) => setCurrentBatch({ ...currentBatch, end_date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="checkbox"
                                        checked={currentBatch.is_active}
                                        onChange={(e) => setCurrentBatch({ ...currentBatch, is_active: e.target.checked })}
                                        style={{ width: 'auto' }}
                                    />
                                    <label style={{ marginBottom: 0 }}>Is Active</label>
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

export default BatchManagement;
