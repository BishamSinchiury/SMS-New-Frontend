import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/Components/Toast/ToastContext';
import AdminApi from '@/services/api/admin';
import { Users, CheckCircle, XCircle, RefreshCw, LogOut } from 'lucide-react';
import styles from '@/Features/Core/Dashboard/Dashboard.module.css';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { success, error } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING_APPROVAL');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await AdminApi.getUsers(filter);
            setUsers(response.data);
        } catch (err) {
            error('Failed to load users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const handleApprove = async (userId) => {
        try {
            await AdminApi.approveUser(userId);
            success('User approved successfully');
            fetchUsers();
        } catch (err) {
            error('Failed to approve user');
            console.error(err);
        }
    };

    const handleReject = async (userId) => {
        try {
            await AdminApi.rejectUser(userId);
            success('User rejected');
            fetchUsers();
        } catch (err) {
            error('Failed to reject user');
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Users size={28} />
                    <h1 className={styles.title}>User Management</h1>
                </div>
                <button onClick={logout} className={styles.logoutBtn}>
                    <LogOut size={18} style={{ marginRight: '0.5rem' }} />
                    Sign Out
                </button>
            </header>

            <main className={styles.grid} style={{ gridTemplateColumns: '1fr' }}>
                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <button
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: filter === 'PENDING_APPROVAL' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                        onClick={() => setFilter('PENDING_APPROVAL')}
                    >
                        Pending Approval
                    </button>
                    <button
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: filter === 'APPROVED' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                        onClick={() => setFilter('APPROVED')}
                    >
                        Approved
                    </button>
                    <button
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: filter === 'REJECTED' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                        onClick={() => setFilter('REJECTED')}
                    >
                        Rejected
                    </button>
                    <button
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: filter === null ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onClick={() => setFilter(null)}
                    >
                        All Users
                    </button>
                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginLeft: 'auto'
                        }}
                    >
                        <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                        Refresh
                    </button>
                </div>

                {/* User List */}
                {loading ? (
                    <div className={styles.card}>
                        <p>Loading users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className={styles.card}>
                        <p>No users found</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {users.map((u) => (
                            <div key={u.id} className={styles.card}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{u.email}</h3>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '1rem',
                                                background: u.approval_status === 'APPROVED' ? 'rgba(34, 197, 94, 0.2)' :
                                                    u.approval_status === 'REJECTED' ? 'rgba(239, 68, 68, 0.2)' :
                                                        'rgba(59, 130, 246, 0.2)',
                                                color: u.approval_status === 'APPROVED' ? '#22c55e' :
                                                    u.approval_status === 'REJECTED' ? '#ef4444' :
                                                        '#3b82f6'
                                            }}>
                                                {u.approval_status.replace('_', ' ')}
                                            </span>
                                            <span>Joined: {new Date(u.created_at || Date.now()).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {u.approval_status === 'PENDING_APPROVAL' && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleApprove(u.id)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.5rem',
                                                    border: 'none',
                                                    background: 'rgba(34, 197, 94, 0.2)',
                                                    color: '#22c55e',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <CheckCircle size={16} />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(u.id)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.5rem',
                                                    border: 'none',
                                                    background: 'rgba(239, 68, 68, 0.2)',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <XCircle size={16} />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
