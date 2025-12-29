import { getAllUsers, updateUserRole, deleteUser, getPendingDistributors, approveDistributor } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { Trash2, Shield, User, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Button from '../../components/Button';

export default function UserManagement() {
    const { showToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('all'); // 'all' or 'pending-distributors'

    useEffect(() => {
        loadUsers();
    }, [view]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = view === 'pending-distributors'
                ? await getPendingDistributors()
                : await getAllUsers();
            setUsers(response.users || response.data?.users || []);
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

    const handleApproveDistributor = async (userId) => {
        if (!confirm('Approve this user as an official Fruits Aura Distributor?')) return;

        try {
            await approveDistributor(userId);
            showToast('Distributor approved!', 'success');
            loadUsers();
        } catch (error) {
            showToast('Failed to approve distributor', 'error');
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
                <div className="header-title-row">
                    <div>
                        <h1>Users</h1>
                        <p>Manage user accounts, roles, and distributor approvals</p>
                    </div>
                    <div className="admin-tabs">
                        <button
                            className={`tab-btn ${view === 'all' ? 'active' : ''}`}
                            onClick={() => setView('all')}
                        >
                            All Users
                        </button>
                        <button
                            className={`tab-btn ${view === 'pending-distributors' ? 'active' : ''}`}
                            onClick={() => setView('pending-distributors')}
                        >
                            Pending Distributors
                        </button>
                    </div>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No {view === 'pending-distributors' ? 'pending distributors' : 'users'} found
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div
                                                className="user-avatar"
                                                style={{
                                                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))'
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
                                            className={`role-badge ${user.role}`}
                                            onClick={() => handleRoleChange(user._id, user.role || 'consumer')}
                                            title="Click to change role"
                                        >
                                            {user.role || 'consumer'}
                                        </button>
                                    </td>
                                    <td>
                                        {user.role === 'distributor' ? (
                                            user.approved ? (
                                                <span className="status-verify verified"><CheckCircle size={14} /> Approved</span>
                                            ) : (
                                                <span className="status-verify pending"><Clock size={14} /> Pending</span>
                                            )
                                        ) : (
                                            <span className="status-verify none">N/A</span>
                                        )}
                                    </td>
                                    <td>{formatDate(user.createdAt)}</td>
                                    <td>
                                        <div className="action-row">
                                            {user.role === 'distributor' && !user.approved && (
                                                <button
                                                    className="action-btn approve"
                                                    onClick={() => handleApproveDistributor(user._id)}
                                                    title="Approve Distributor"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDelete(user._id)}
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
