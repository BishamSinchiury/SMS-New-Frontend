import React, { useState, useEffect } from 'react';
import { userService } from '@/services';
import AdminLayout from '@/components/layout/AdminLayout';
import styles from './UserManagement.module.css';
import { Search, Plus, UserCheck, UserX, Edit2, Trash2, Filter } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        role: '',
        search: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'USER',
        is_active: true,
        approval_status: 'APPROVED'
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.sysAdminList(filters);
            // Handle paginated response
            const userData = response.results || response.data || response;
            setUsers(Array.isArray(userData) ? userData : []);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError(err.message || 'Failed to fetch users. Access denied.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filters.status, filters.role]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApproval = async (id, status, reason = '') => {
        try {
            await userService.sysAdminUpdateApproval(id, {
                approval_status: status,
                rejection_reason: reason
            });
            fetchUsers();
        } catch (err) {
            alert('Action failed: ' + (err.response?.data?.error || 'Unknown error'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await userService.sysAdminDelete(id);
            fetchUsers();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setCurrentUser(user);
            const userRole = user.roles?.[0];
            const roleName = typeof userRole === 'string' ? userRole : userRole?.name || 'USER';
            setFormData({
                email: user.email,
                password: '',
                role: roleName,
                is_active: user.is_active,
                approval_status: user.approval_status
            });
        } else {
            setCurrentUser(null);
            setFormData({
                email: '',
                password: '',
                role: 'USER',
                is_active: true,
                approval_status: 'APPROVED'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (currentUser) {
                const { password, role, ...updateData } = formData;
                // Wrap role in array for backend many-to-many slug field
                await userService.sysAdminUpdate(currentUser.id, {
                    ...updateData,
                    roles: [role]
                });
            } else {
                const { role, ...createData } = formData;
                await userService.sysAdminCreate({
                    ...createData,
                    roles: [role]
                });
            }
            handleCloseModal();
            fetchUsers();
        } catch (err) {
            alert('Save failed: ' + (err.response?.data?.message || err.response?.data?.error || 'Check fields'));
        }
    };

    return (
        <AdminLayout title="User Management">
            <div className={styles.container}>
                <div className={styles.controls}>
                    <div className={styles.searchWrapper}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search by name or email..."
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <select name="status" value={filters.status} onChange={handleFilterChange} className={styles.select}>
                            <option value="">Status: All</option>
                            <option value="PENDING_APPROVAL">Pending Approval</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <select name="role" value={filters.role} onChange={handleFilterChange} className={styles.select}>
                            <option value="">Role: All</option>
                            <option value="ORG_ADMIN">Administrator</option>
                            <option value="TEACHER">Teacher</option>
                            <option value="STUDENT">Student</option>
                        </select>
                    </div>

                    <button className={styles.addBtn} onClick={() => handleOpenModal()}>
                        <Plus size={18} />
                        <span>Add User</span>
                    </button>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.tableWrapper}>
                    {loading ? (
                        <div className={styles.loading}>Updating user directory...</div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>User Personnel</th>
                                    <th>Role / Status</th>
                                    <th>Verification</th>
                                    <th>Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.filter(u =>
                                    u.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                                    (u.person_profile?.first_name + ' ' + u.person_profile?.last_name).toLowerCase().includes(filters.search.toLowerCase())
                                ).map(user => (
                                    <tr key={user.id} className={styles.tableRow}>
                                        <td>
                                            <div className={styles.personCell}>
                                                <img
                                                    src={user.person_profile?.photo || '/default-avatar.png'}
                                                    alt="Avatar"
                                                    className={styles.avatarSmall}
                                                    onError={(e) => {
                                                        if (e.target.src.indexOf('/default-avatar.png') === -1) {
                                                            e.target.src = '/default-avatar.png';
                                                        }
                                                    }}
                                                />
                                                <div className={styles.personInfo}>
                                                    <div className={styles.userName}>
                                                        {user.person_profile ? `${user.person_profile.first_name} ${user.person_profile.last_name}` : 'No Profile Data'}
                                                    </div>
                                                    <div className={styles.userEmail}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.roleList}>
                                                {user.roles?.map((role, idx) => (
                                                    <span key={idx} className={styles.roleBadge}>
                                                        {typeof role === 'string' ? role : role.name}
                                                    </span>
                                                )) || <span className={styles.roleBadge}>USER</span>}
                                            </div>
                                            <div className={`${styles.statusBadge} ${styles[user.approval_status.toLowerCase()]}`}>
                                                {user.approval_status.replace('_', ' ')}
                                            </div>
                                        </td>
                                        <td>
                                            {(user.approval_status === 'PENDING_APPROVAL' || user.approval_status === 'REJECTED') && (
                                                <div className={styles.approvalActions}>
                                                    <button onClick={() => handleApproval(user.id, 'APPROVED')} className={styles.approveBtn}>
                                                        <UserCheck size={16} />
                                                        Approve
                                                    </button>
                                                    {user.approval_status !== 'REJECTED' && (
                                                        <button onClick={() => {
                                                            const reason = prompt('Please provide a reason for rejection:');
                                                            if (reason) handleApproval(user.id, 'REJECTED', reason);
                                                        }} className={styles.rejectBtn}>
                                                            <UserX size={16} />
                                                            Reject
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className={styles.actionsCell}>
                                            <button className={styles.iconBtn} title="Update Profile" onClick={() => handleOpenModal(user)}><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(user.id)} className={styles.iconBtnClose} title="Remove User"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className={styles.noResults}>No personnel records found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>{currentUser ? 'Edit User Personnel' : 'Add New Personnel'}</h3>
                        <p className={styles.modalSubtitle}>
                            {currentUser ? `Updating access for ${currentUser.email}` : 'Enter authentication credentials for the new user.'}
                        </p>

                        <form onSubmit={handleSave} className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    required
                                    className={styles.modalInput}
                                    placeholder="user@example.com"
                                />
                            </div>

                            {!currentUser && (
                                <div className={styles.formGroup}>
                                    <label>Initial Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleFormChange}
                                        required
                                        className={styles.modalInput}
                                        placeholder="Min 8 characters"
                                    />
                                </div>
                            )}

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>System Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleFormChange}
                                        className={styles.modalSelect}
                                    >
                                        <option value="USER">Base User</option>
                                        <option value="STAFF">Operations Staff</option>
                                        <option value="ADMIN">Organization Admin</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Approval Status</label>
                                    <select
                                        name="approval_status"
                                        value={formData.approval_status}
                                        onChange={handleFormChange}
                                        className={styles.modalSelect}
                                    >
                                        <option value="PENDING_PROFILE">Pending Profile</option>
                                        <option value="PENDING_APPROVAL">Pending Approval</option>
                                        <option value="APPROVED">Approved</option>
                                        <option value="REJECTED">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleFormChange}
                                />
                                <label htmlFor="is_active">Account is active and allowed to login</label>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={handleCloseModal} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn}>
                                    {currentUser ? 'Save Changes' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default UserManagement;
