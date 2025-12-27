import { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, deleteUser } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { Trash2, Shield, User } from 'lucide-react';

export default function UserManagement() {
    const { showToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.users);
        } catch (error) {
            showToast('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, currentRole) => {
        // Simple cycle for now: consumer -> distributor -> admin -> consumer
        let newRole = 'consumer';
        if (currentRole === 'consumer') newRole = 'distributor';
        else if (currentRole === 'distributor') newRole = 'admin';

        if (!confirm(`Change user role from ${currentRole} to ${newRole}?`)) return;

        try {
            await updateUserRole(userId, newRole);
            showToast('User role updated', 'success');
            loadUsers();
        } catch (error) {
            showToast('Failed to update user role', 'error');
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await deleteUser(userId);
            showToast('User deleted successfully', 'success');
            loadUsers();
        } catch (error) {
            showToast('Failed to delete user', 'error');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="admin-page-header">
                <h1>Loading users...</h1>
            </div>
        );
    }

    return (
        <div className="user-management">
            <div className="admin-page-header">
                <h1>Users</h1>
                <p>Manage user accounts and permissions</p>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role (Click to Cycle)</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: '600'
                                            }}
                                        >
                                            {user.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <p style={{ fontWeight: '600' }}>{user.name}</p>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <button
                                        className={`status-badge ${user.role}`}
                                        onClick={() => handleRoleChange(user._id, user.role || 'consumer')}
                                        style={{
                                            cursor: 'pointer',
                                            border: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {user.role || 'consumer'}
                                    </button>
                                </td>
                                <td>{formatDate(user.createdAt)}</td>
                                <td>
                                    <button
                                        className="action-btn delete"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
