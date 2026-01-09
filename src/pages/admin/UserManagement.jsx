import React, { useState, useEffect, useCallback } from 'react';
import { getAllUsers, updateUserRole, deleteUser, getPendingDistributors, approveDistributor, updateUserSubscription } from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';
import { Trash2, CheckCircle, Clock, Edit2, Gift, Users } from 'lucide-react';
import Button from '../../components/Button';
import { updateUserAdmin } from '../../api/adminApi'; // Assuming this exists or using generic update

export default function UserManagement() {
    const { showToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('all'); // 'all' or 'pending-distributors'

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = view === 'pending-distributors'
                ? await getPendingDistributors()
                : await getAllUsers();
            setUsers(response.users || response.data?.users || []);
        } catch (err) {
            console.error('Error loading users:', err);
            showToast('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    }, [view, showToast]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

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
        } catch (err) {
            console.error('Error updating role:', err);
            showToast('Failed to update user role', 'error');
        }
    };

    const handleSubscriptionChange = async (userId, currentPlan) => {
        const plans = ['fresher', 'aura', 'farming'];
        const currentIndex = plans.indexOf(currentPlan || 'aura');
        const nextPlan = plans[(currentIndex + 1) % plans.length]; // Cycle through plans

        if (!confirm(`Change plan from ${currentPlan || 'aura'} to ${nextPlan}?`)) return;

        try {
            await updateUserSubscription(userId, { plan: nextPlan });
            showToast(`Subscription updated to ${nextPlan}`, 'success');
            loadUsers();
        } catch (err) {
            console.error('Error updating subscription:', err);
            showToast('Failed to update subscription', 'error');
        }
    };

    const handleApproveDistributor = async (userId) => {
        if (!confirm('Approve this user as an official Fruits Aura Distributor?')) return;

        try {
            await approveDistributor(userId);
            showToast('Distributor approved!', 'success');
            loadUsers();
        } catch (err) {
            console.error('Error approving distributor:', err);
            showToast('Failed to approve distributor', 'error');
        }
    };

    const handleClaimReward = async (userId) => {
        if (!confirm('Mark this referral reward as claimed/delivered?')) return;

        try {
            await claimReferralReward(userId);
            showToast('Reward marked as claimed!', 'success');
            loadUsers();
        } catch (err) {
            console.error('Error claiming reward:', err);
            showToast('Failed to mark reward as claimed', 'error');
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await deleteUser(userId);
            showToast('User deleted successfully', 'success');
            loadUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
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
                            <th>Sub. Plan</th>
                            <th>Referrals</th>
                            <th>Rewards</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
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
                                        <button
                                            className="status-badge"
                                            style={{
                                                textTransform: 'capitalize',
                                                background: user.subscription?.plan === 'farming' ? '#4ade8020' : '#f4f4f5',
                                                color: user.subscription?.plan === 'farming' ? '#16a34a' : '#52525b',
                                                border: '1px solid currentColor',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => handleSubscriptionChange(user._id, user.subscription?.plan)}
                                            title="Click to change plan"
                                        >
                                            {user.subscription?.plan || 'aura'}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="referral-info-cell">
                                            <Users size={14} />
                                            <span>{user.referrals?.length || 0}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {user.referrals?.length >= 5 ? (
                                            <div className={`reward-status ${user.referralRewardClaimed ? 'claimed' : 'unclaimed'}`}>
                                                <Gift size={14} />
                                                <span>{user.referralRewardClaimed ? 'Claimed' : 'READY!'}</span>
                                            </div>
                                        ) : (
                                            <span style={{ color: '#ccc', fontSize: '0.8rem' }}>{user.referrals?.length}/5</span>
                                        )}
                                    </td>
                                    <td>{formatDate(user.createdAt)}</td>
                                    <td>
                                        <div className="action-row">
                                            {user.referrals?.length >= 5 && !user.referralRewardClaimed && (
                                                <button
                                                    className="action-btn claim"
                                                    onClick={() => handleClaimReward(user._id)}
                                                    title="Mark Reward as Claimed"
                                                >
                                                    <Gift size={16} />
                                                </button>
                                            )}
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
