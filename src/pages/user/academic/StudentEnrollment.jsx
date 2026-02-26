import React, { useState, useEffect } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import styles from './Academic.module.css';
import academicService from '@/services/academicService';

/**
 * StudentEnrollment Component
 *
 * Handles enrolling students (people with person_type=STUDENT) into sections.
 */
const StudentEnrollment = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formError, setFormError] = useState(null);
    const [currentEnrollment, setCurrentEnrollment] = useState({
        student: '',
        section: '',
        roll_number: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [enRes, secRes, studRes] = await Promise.all([
                academicService.getEnrollments(),
                academicService.getSections(),
                academicService.getStudents()
            ]);
            setEnrollments(enRes);
            setSections(secRes);
            setStudents(studRes);
            setError(null);
        } catch (err) {
            console.error('Failed to load enrollment data:', err);
            setError('Could not load enrollment data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setCurrentEnrollment({ student: '', section: '', roll_number: '' });
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            await academicService.createEnrollment(currentEnrollment);
            fetchData();
            setIsModalOpen(false);
        } catch (err) {
            const msg = err.response?.data
                ? JSON.stringify(err.response.data)
                : 'Failed to enroll student.';
            setFormError(msg);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this student from the section?')) return;
        try {
            await academicService.deleteEnrollment(id);
            fetchData();
        } catch (err) {
            alert('Failed to remove enrollment.');
        }
    };

    return (
        <UserLayout title="Student Enrollment">
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.description}>
                        Enroll students into academic sections and assign roll numbers.
                    </p>
                    <button className={styles.addBtn} onClick={handleOpenModal}>
                        + Enroll Student
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loading}>Loading enrollments...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : enrollments.length === 0 ? (
                    <div className={styles.empty}>No enrollments yet. Add students to get started.</div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Email</th>
                                    <th>Section</th>
                                    <th>Batch</th>
                                    <th>Roll No.</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map(en => (
                                    <tr key={en.id}>
                                        <td>
                                            {en.student_details
                                                ? `${en.student_details.first_name} ${en.student_details.last_name}`
                                                : 'N/A'}
                                        </td>
                                        <td>{en.student_details?.email || '—'}</td>
                                        <td>{en.section_name}</td>
                                        <td>{en.batch_name}</td>
                                        <td>{en.roll_number || '—'}</td>
                                        <td>
                                            <button
                                                className={styles.deleteBtn}
                                                style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                                                onClick={() => handleDelete(en.id)}
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
                            <h2>Enroll Student</h2>
                            {formError && <div className={styles.formError}>{formError}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label>Student</label>
                                    <select
                                        required
                                        value={currentEnrollment.student}
                                        onChange={e => setCurrentEnrollment({ ...currentEnrollment, student: e.target.value })}
                                    >
                                        <option value="">Select Student</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.first_name} {s.last_name} — {s.email}
                                            </option>
                                        ))}
                                    </select>
                                    {students.length === 0 && (
                                        <p className={styles.hint}>No students found. Add people with type "Student" first.</p>
                                    )}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Section</label>
                                    <select
                                        required
                                        value={currentEnrollment.section}
                                        onChange={e => setCurrentEnrollment({ ...currentEnrollment, section: e.target.value })}
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
                                    <label>Roll Number (Optional)</label>
                                    <input
                                        type="text"
                                        value={currentEnrollment.roll_number}
                                        onChange={e => setCurrentEnrollment({ ...currentEnrollment, roll_number: e.target.value })}
                                        placeholder="e.g. 001A"
                                    />
                                </div>
                                <div className={styles.modalButtons}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.saveBtn}>
                                        Enroll
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

export default StudentEnrollment;
