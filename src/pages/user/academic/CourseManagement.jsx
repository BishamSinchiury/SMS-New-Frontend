import React, { useState, useEffect } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import styles from './Academic.module.css';
import academicService from '@/services/academicService';

/**
 * CourseManagement Component
 * 
 * Handles CRUD for academic courses linked to classes and faculties.
 */
const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [classes, setClasses] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCourse, setCurrentCourse] = useState({
        name: '',
        academic_class: '',
        faculty: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [coursesRes, classesRes, facultiesRes] = await Promise.all([
                academicService.getCourses(),
                academicService.getClasses(),
                academicService.getFaculties()
            ]);
            setCourses(coursesRes);
            setClasses(classesRes);
            setFaculties(facultiesRes);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Could not load course data.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (course = { name: '', academic_class: '', faculty: '' }) => {
        setCurrentCourse(course);
        setIsEditing(!!course.id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCourse({ name: '', academic_class: '', faculty: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await academicService.updateCourse(currentCourse.id, currentCourse);
            } else {
                await academicService.createCourse(currentCourse);
            }
            fetchInitialData(); // Refresh list
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save course:', err);
            alert('Failed to save course.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await academicService.deleteCourse(id);
            fetchInitialData();
        } catch (err) {
            console.error('Failed to delete course:', err);
        }
    };

    return (
        <UserLayout title="Course Management">
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.description}>Define and manage academic courses and programs.</p>
                    <button className={styles.addBtn} onClick={() => handleOpenModal()}>
                        + Add New Course
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loading}>Loading courses...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : courses.length === 0 ? (
                    <div className={styles.empty}>No courses found.</div>
                ) : (
                    <div className={styles.grid}>
                        {courses.map((course) => (
                            <div key={course.id} className={styles.card}>
                                <div className={styles.cardInfo}>
                                    <h3>{course.name}</h3>
                                    <p><strong>Class:</strong> {course.academic_class_name}</p>
                                    <p><strong>Faculty:</strong> {course.faculty_name || 'N/A'}</p>
                                </div>
                                <div className={styles.cardActions}>
                                    <button className={styles.editBtn} onClick={() => handleOpenModal(course)}>Edit</button>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(course.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Course Modal */}
                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h2>{isEditing ? 'Edit Course' : 'Add New Course'}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroup}>
                                    <label>Course Name</label>
                                    <input
                                        type="text"
                                        value={currentCourse.name}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Academic Class</label>
                                    <select
                                        value={currentCourse.academic_class}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, academic_class: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Faculty (Optional)</label>
                                    <select
                                        value={currentCourse.faculty || ''}
                                        onChange={(e) => setCurrentCourse({ ...currentCourse, faculty: e.target.value })}
                                    >
                                        <option value="">Select Faculty</option>
                                        {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
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

export default CourseManagement;
