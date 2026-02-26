import React, { useState, useEffect, useCallback } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import peopleService from '@/services/peopleService';
import academicService from '@/services/academicService';
import userService from '@/services/userService';
import styles from './StudentManagement.module.css';
import {
    UserPlus, Edit2, Trash2, Link, Unlink, ChevronDown, ChevronUp,
    Search, Users, BookOpen, X, BookMarked
} from 'lucide-react';

const GENDER_OPTIONS = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];

const EMPTY_FORM = {
    first_name: '', last_name: '', email: '', phone_number: '',
    date_of_birth: '', gender: '', address: '', is_active: true
};

const EMPTY_ENROLL = { section: '', roll_number: '' };

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    // Modal states
    const [modalType, setModalType] = useState(null); // 'create' | 'edit' | 'link' | 'enroll'
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [enrollData, setEnrollData] = useState(EMPTY_ENROLL);
    const [formError, setFormError] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Expanded enrollment row
    const [expandedId, setExpandedId] = useState(null);

    // Link user modal data
    const [orgUsers, setOrgUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    // Sections for enrollment modal
    const [sections, setSections] = useState([]);

    // ─── Data fetching ──────────────────────────────────────────────────────────
    const fetchStudents = useCallback(async () => {
        try {
            setLoading(true);
            const data = await peopleService.getStudents();
            setStudents(data);
            setError(null);
        } catch {
            setError('Could not load students. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStudents(); }, [fetchStudents]);

    // ─── Helpers ───────────────────────────────────────────────────────────────
    const openCreate = () => {
        setFormData(EMPTY_FORM);
        setFormError(null);
        setModalType('create');
    };

    const openEdit = (student) => {
        setSelectedStudent(student);
        setFormData({
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email || '',
            phone_number: student.phone_number || '',
            date_of_birth: student.date_of_birth || '',
            gender: student.gender || '',
            address: student.address || '',
            is_active: student.is_active,
        });
        setFormError(null);
        setModalType('edit');
    };

    const openLinkUser = async (student) => {
        setSelectedStudent(student);
        setSelectedUserId(student.user_id || '');
        setFormError(null);
        try {
            const users = await userService.getUsers();
            setOrgUsers(Array.isArray(users) ? users : (users.results || []));
        } catch {
            setOrgUsers([]);
        }
        setModalType('link');
    };

    const openEnroll = async (student) => {
        setSelectedStudent(student);
        setEnrollData(EMPTY_ENROLL);
        setFormError(null);
        try {
            const data = await academicService.getSections();
            setSections(data);
        } catch {
            setSections([]);
        }
        setModalType('enroll');
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedStudent(null);
        setFormError(null);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    // ─── CRUD operations ───────────────────────────────────────────────────────
    const handleSave = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);
        try {
            if (modalType === 'create') {
                await peopleService.createStudent(formData);
            } else {
                await peopleService.updateStudent(selectedStudent.id, formData);
            }
            await fetchStudents();
            closeModal();
        } catch (err) {
            const errData = err.response?.data;
            setFormError(errData ? JSON.stringify(errData, null, 2) : 'Failed to save student.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (student) => {
        if (!window.confirm(`Delete ${student.full_name}? This cannot be undone.`)) return;
        try {
            await peopleService.deleteStudent(student.id);
            fetchStudents();
        } catch {
            alert('Failed to delete student.');
        }
    };

    // ─── Enrollment  ───────────────────────────────────────────────────────────
    const handleEnroll = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);
        try {
            await peopleService.enrollStudent(selectedStudent.id, enrollData);
            await fetchStudents();
            closeModal();
        } catch (err) {
            const errData = err.response?.data;
            setFormError(errData?.error || (errData ? JSON.stringify(errData) : 'Failed to enroll student.'));
        } finally {
            setFormLoading(false);
        }
    };

    const handleUnenroll = async (student, enrollment) => {
        if (!window.confirm(`Remove enrollment from "${enrollment.class} › ${enrollment.batch} › ${enrollment.section}"?`)) return;
        try {
            await peopleService.unenrollStudent(student.id, enrollment.enrollment_id);
            fetchStudents();
        } catch {
            alert('Failed to remove enrollment.');
        }
    };

    // ─── User Association ──────────────────────────────────────────────────────
    const handleLinkUser = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);
        try {
            await peopleService.linkUser(selectedStudent.id, selectedUserId);
            await fetchStudents();
            closeModal();
        } catch (err) {
            setFormError(err.response?.data?.error || 'Failed to link user.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleUnlinkUser = async (student) => {
        if (!window.confirm(`Unlink user account from ${student.full_name}?`)) return;
        try {
            await peopleService.unlinkUser(student.id);
            fetchStudents();
        } catch {
            alert('Failed to unlink user.');
        }
    };

    // ─── Filtering ─────────────────────────────────────────────────────────────
    const filtered = students.filter(s => {
        const q = search.toLowerCase();
        return (
            s.full_name?.toLowerCase().includes(q) ||
            s.email?.toLowerCase().includes(q) ||
            s.phone_number?.includes(q)
        );
    });

    // ─── Render ────────────────────────────────────────────────────────────────
    return (
        <UserLayout title="Student Management">
            <div className={styles.container}>

                {/* ── Header ── */}
                <div className={styles.header}>
                    <div className={styles.searchBox}>
                        <Search size={16} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <button className={styles.addBtn} onClick={openCreate}>
                        <UserPlus size={16} />
                        Add Student
                    </button>
                </div>

                {/* ── Stats ── */}
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <Users size={20} className={styles.statIcon} />
                        <div>
                            <div className={styles.statValue}>{students.length}</div>
                            <div className={styles.statLabel}>Total Students</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <BookOpen size={20} className={styles.statIcon} />
                        <div>
                            <div className={styles.statValue}>
                                {students.filter(s => s.enrollment_summary?.length > 0).length}
                            </div>
                            <div className={styles.statLabel}>Enrolled</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <Link size={20} className={styles.statIcon} />
                        <div>
                            <div className={styles.statValue}>
                                {students.filter(s => s.is_claimed).length}
                            </div>
                            <div className={styles.statLabel}>With User Account</div>
                        </div>
                    </div>
                </div>

                {/* ── Table ── */}
                {loading ? (
                    <div className={styles.loading}>Loading students…</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : filtered.length === 0 ? (
                    <div className={styles.empty}>
                        {search ? 'No students match your search.' : 'No students yet. Click "Add Student" to get started.'}
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Gender</th>
                                    <th>Enrolled In</th>
                                    <th>User Account</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(student => (
                                    <React.Fragment key={student.id}>
                                        <tr className={expandedId === student.id ? styles.rowExpanded : ''}>
                                            <td>
                                                <div className={styles.nameCell}>
                                                    <div className={styles.avatar}>
                                                        {student.first_name?.[0]}{student.last_name?.[0]}
                                                    </div>
                                                    <div className={styles.studentName}>{student.full_name}</div>
                                                </div>
                                            </td>
                                            <td>{student.email || '—'}</td>
                                            <td>{student.phone_number || '—'}</td>
                                            <td>{student.gender ? student.gender.replace(/_/g, ' ') : '—'}</td>
                                            <td>
                                                {student.enrollment_summary?.length > 0 ? (
                                                    <button
                                                        className={styles.enrollmentBtn}
                                                        onClick={() => setExpandedId(expandedId === student.id ? null : student.id)}
                                                    >
                                                        {student.enrollment_summary.length} section(s)
                                                        {expandedId === student.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                                    </button>
                                                ) : (
                                                    <span className={styles.notEnrolled}>Not enrolled</span>
                                                )}
                                            </td>
                                            <td>
                                                {student.is_claimed ? (
                                                    <div className={styles.linkedUser}>
                                                        <span className={styles.linkedBadge}>Linked</span>
                                                        <span className={styles.userEmail}>{student.user_email}</span>
                                                    </div>
                                                ) : (
                                                    <span className={styles.unlinkedBadge}>No account</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={student.is_active ? styles.activeBadge : styles.inactiveBadge}>
                                                    {student.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.actions}>
                                                    <button
                                                        className={styles.iconBtn}
                                                        onClick={() => openEdit(student)}
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        className={`${styles.iconBtn} ${styles.enrollBtn}`}
                                                        onClick={() => openEnroll(student)}
                                                        title="Enroll in Section"
                                                    >
                                                        <BookMarked size={14} />
                                                    </button>
                                                    {student.is_claimed ? (
                                                        <button
                                                            className={`${styles.iconBtn} ${styles.unlinkBtn}`}
                                                            onClick={() => handleUnlinkUser(student)}
                                                            title="Unlink User Account"
                                                        >
                                                            <Unlink size={14} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className={`${styles.iconBtn} ${styles.linkBtn}`}
                                                            onClick={() => openLinkUser(student)}
                                                            title="Link User Account"
                                                        >
                                                            <Link size={14} />
                                                        </button>
                                                    )}
                                                    <button
                                                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                                        onClick={() => handleDelete(student)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* ── Expanded enrollment details ── */}
                                        {expandedId === student.id && (
                                            <tr className={styles.expandedRow}>
                                                <td colSpan={8}>
                                                    <div className={styles.enrollmentDetails}>
                                                        <strong>Enrollments</strong>
                                                        <div className={styles.enrollmentCards}>
                                                            {student.enrollment_summary.map(en => (
                                                                <div key={en.enrollment_id} className={styles.enrollmentCard}>
                                                                    <span className={styles.enClass}>{en.class}</span>
                                                                    <span className={styles.enBatch}>{en.batch}</span>
                                                                    <span className={styles.enSection}>Section: {en.section}</span>
                                                                    {en.roll_number && (
                                                                        <span className={styles.enRoll}>Roll #{en.roll_number}</span>
                                                                    )}
                                                                    <button
                                                                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                                                        style={{ marginTop: '0.25rem', width: '100%', height: '24px' }}
                                                                        title="Remove enrollment"
                                                                        onClick={() => handleUnenroll(student, en)}
                                                                    >
                                                                        <Trash2 size={12} />
                                                                        <span style={{ fontSize: '0.72rem', marginLeft: '4px' }}>Remove</span>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════════════
                    Modal: Create / Edit Student
                ══════════════════════════════════════════════════════════════ */}
                {(modalType === 'create' || modalType === 'edit') && (
                    <div className={styles.overlay}>
                        <div className={styles.modal}>
                            <div className={styles.modalHeader}>
                                <h2>{modalType === 'create' ? 'Add New Student' : 'Edit Student'}</h2>
                                <button onClick={closeModal} className={styles.closeBtn}><X size={18} /></button>
                            </div>
                            {formError && <div className={styles.formError}>{formError}</div>}
                            <form onSubmit={handleSave}>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>First Name *</label>
                                        <input name="first_name" value={formData.first_name} onChange={handleFormChange} required placeholder="Alice" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Last Name *</label>
                                        <input name="last_name" value={formData.last_name} onChange={handleFormChange} required placeholder="Smith" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email</label>
                                        <input name="email" type="email" value={formData.email} onChange={handleFormChange} placeholder="alice@student.com" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Phone Number</label>
                                        <input name="phone_number" value={formData.phone_number} onChange={handleFormChange} placeholder="+977-9800000000" />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Date of Birth</label>
                                        <input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleFormChange} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleFormChange}>
                                            <option value="">Select Gender</option>
                                            {GENDER_OPTIONS.map(g => (
                                                <option key={g} value={g}>{g.replace(/_/g, ' ')}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label>Address</label>
                                        <textarea name="address" value={formData.address} onChange={handleFormChange} placeholder="Full mailing address…" rows={2} />
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
                                        <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleFormChange} id="is_active" />
                                        <label htmlFor="is_active">Active</label>
                                    </div>
                                </div>
                                <div className={styles.modalFooter}>
                                    <button type="button" onClick={closeModal} className={styles.cancelBtn}>Cancel</button>
                                    <button type="submit" className={styles.saveBtn} disabled={formLoading}>
                                        {formLoading ? 'Saving…' : (modalType === 'create' ? 'Add Student' : 'Save Changes')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════════════
                    Modal: Enroll Student in Section
                ══════════════════════════════════════════════════════════════ */}
                {modalType === 'enroll' && (
                    <div className={styles.overlay}>
                        <div className={styles.modal} style={{ maxWidth: '450px' }}>
                            <div className={styles.modalHeader}>
                                <h2>Enroll Student</h2>
                                <button onClick={closeModal} className={styles.closeBtn}><X size={18} /></button>
                            </div>
                            <p className={styles.linkDesc}>
                                Enroll <strong>{selectedStudent?.full_name}</strong> into a class section.
                            </p>
                            {formError && <div className={styles.formError}>{formError}</div>}
                            <form onSubmit={handleEnroll}>
                                <div className={styles.formGrid}>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label>Select Section *</label>
                                        <select
                                            value={enrollData.section}
                                            onChange={e => setEnrollData(prev => ({ ...prev, section: e.target.value }))}
                                            required
                                        >
                                            <option value="">Choose a section…</option>
                                            {sections.map(sec => (
                                                <option key={sec.id} value={sec.id}>
                                                    {sec.class_name} › {sec.batch_name} › {sec.name}
                                                </option>
                                            ))}
                                        </select>
                                        {sections.length === 0 && (
                                            <p className={styles.hint}>No sections found. Create one under Sections first.</p>
                                        )}
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label>Roll Number (optional)</label>
                                        <input
                                            type="text"
                                            value={enrollData.roll_number}
                                            onChange={e => setEnrollData(prev => ({ ...prev, roll_number: e.target.value }))}
                                            placeholder="e.g. S001"
                                        />
                                    </div>
                                </div>
                                <div className={styles.modalFooter}>
                                    <button type="button" onClick={closeModal} className={styles.cancelBtn}>Cancel</button>
                                    <button type="submit" className={styles.saveBtn} disabled={formLoading || !enrollData.section}>
                                        {formLoading ? 'Enrolling…' : 'Enroll'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════════════════
                    Modal: Link User Account
                ══════════════════════════════════════════════════════════════ */}
                {modalType === 'link' && (
                    <div className={styles.overlay}>
                        <div className={styles.modal} style={{ maxWidth: '440px' }}>
                            <div className={styles.modalHeader}>
                                <h2>Link User Account</h2>
                                <button onClick={closeModal} className={styles.closeBtn}><X size={18} /></button>
                            </div>
                            <p className={styles.linkDesc}>
                                Linking a user account allows <strong>{selectedStudent?.full_name}</strong> to log in and
                                access their personal portal using that account's credentials.
                            </p>
                            {formError && <div className={styles.formError}>{formError}</div>}
                            <form onSubmit={handleLinkUser}>
                                <div className={styles.formGrid}>
                                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                        <label>Select User Account</label>
                                        <select
                                            value={selectedUserId}
                                            onChange={e => setSelectedUserId(e.target.value)}
                                            required
                                        >
                                            <option value="">Choose a user…</option>
                                            {orgUsers.map(u => (
                                                <option key={u.id} value={u.id}>
                                                    {u.email} ({u.role})
                                                </option>
                                            ))}
                                        </select>
                                        {orgUsers.length === 0 && (
                                            <p className={styles.hint}>No user accounts found in your organization.</p>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.modalFooter}>
                                    <button type="button" onClick={closeModal} className={styles.cancelBtn}>Cancel</button>
                                    <button type="submit" className={styles.saveBtn} disabled={formLoading || !selectedUserId}>
                                        {formLoading ? 'Linking…' : 'Link Account'}
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

export default StudentManagement;
