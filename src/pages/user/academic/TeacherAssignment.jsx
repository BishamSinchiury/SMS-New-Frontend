import React, { useState, useEffect } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import styles from './Academic.module.css';
import academicService from '@/services/academicService';

/**
 * TeacherAssignment Component
 *
 * Handles assigning teachers (people with person_type=TEACHER) to subjects in sections.
 */
const TeacherAssignment = () => {
    const [assignments, setAssignments] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formError, setFormError] = useState(null);
    const [currentAssignment, setCurrentAssignment] = useState({
        teacher: '',
        section: '',
        subject: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [asRes, secRes, subRes, teachRes] = await Promise.all([
                academicService.getTeacherAssignments(),
                academicService.getSections(),
                academicService.getSubjects(),
                academicService.getTeachers()
            ]);
            setAssignments(asRes);
            setSections(secRes);
            setSubjects(subRes);
            setTeachers(teachRes);
            setError(null);
        } catch (err) {
            console.error('Failed to load assignment data:', err);
            setError('Could not load assignment data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setCurrentAssignment({ teacher: '', section: '', subject: '' });
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            await academicService.createTeacherAssignment(currentAssignment);
            fetchData();
            setIsModalOpen(false);
        } catch (err) {
            const msg = err.response?.data
                ? JSON.stringify(err.response.data)
                : 'Failed to create assignment.';
            setFormError(msg);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this teacher assignment?')) return;
        try {
            await academicService.deleteTeacherAssignment(id);
            fetchData();
        } catch (err) {
            alert('Failed to remove assignment.');
        }
    };

    return (
        <UserLayout title="Teacher Assignment">
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.description}>
                        Assign teachers to specific subjects within class sections.
                    </p>
                    <button className={styles.addBtn} onClick={handleOpenModal}>
                        + Assign Teacher
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loading}>Loading assignments...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : assignments.length === 0 ? (
                    <div className={styles.empty}>No assignments yet. Assign a teacher to get started.</div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Teacher</th>
                                    <th>Subject</th>
                                    <th>Section</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.map(as => (
                                    <tr key={as.id}>
                                        <td>
                                            {as.teacher_details
                                                ? `${as.teacher_details.first_name} ${as.teacher_details.last_name}`
                                                : 'N/A'}
                                        </td>
                                        <td>{as.subject_name}</td>
                                        <td>{as.section_name}</td>
                                        <td>
                                            <button
                                                className={styles.deleteBtn}
                                                style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                                                onClick={() => handleDelete(as.id)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h2>Assign Teacher</h2>
                            {formError && <div className={styles.formError}>{formError}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label>Teacher</label>
                                    <select
                                        required
                                        value={currentAssignment.teacher}
                                        onChange={e => setCurrentAssignment({ ...currentAssignment, teacher: e.target.value })}
                                    >
                                        <option value="">Select Teacher</option>
                                        {teachers.map(t => (
                                            <option key={t.id} value={t.id}>
                                                {t.first_name} {t.last_name} — {t.email}
                                            </option>
                                        ))}
                                    </select>
                                    {teachers.length === 0 && (
                                        <p className={styles.hint}>No teachers found. Add people with type "Teacher" first.</p>
                                    )}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Section</label>
                                    <select
                                        required
                                        value={currentAssignment.section}
                                        onChange={e => setCurrentAssignment({ ...currentAssignment, section: e.target.value })}
                                    >
                                        <option value="">Select Section</option>
                                        {sections.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.class_name} — {s.batch_name} — {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Subject</label>
                                    <select
                                        required
                                        value={currentAssignment.subject}
                                        onChange={e => setCurrentAssignment({ ...currentAssignment, subject: e.target.value })}
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.academic_class_name})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.modalButtons}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.saveBtn}>
                                        Assign
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

export default TeacherAssignment;
