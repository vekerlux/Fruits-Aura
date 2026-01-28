import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { getAdminMixes, createMix, updateMix, deleteMix, resetVotingCycle } from '../../api/adminApi';
import Button from '../../components/Button';
import Modal from '../../components/Modal'; // Assuming a Modal component exists
import { useToast } from '../../context/ToastContext';
import './VotingResults.css';

const VotingResults = () => {
    const [mixes, setMixes] = useState([]);
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMix, setEditingMix] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        optimalTiming: 'Pre/Post-Workout',
        ingredients: '', // Will treat as comma-separated string for simplicity in UI
        benefits: '',    // Will treat as comma-separated string
        fitnessApplication: '',
        nutrients: [{ label: '', value: '' }],
        isActive: true
    });
    const { showToast } = useToast();

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const res = await getAdminMixes();
            const mixesData = res.mixes || [];
            setMixes(mixesData);

            // Fetch detailed votes
            const detailedRes = await client.get('/votes').catch(() => ({ data: { votes: [] } }));
            setVotes(detailedRes.data.votes || []);

        } catch (error) {
            console.error(error);
            showToast('Failed to fetch voting data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const maxVotes = Math.max(...mixes.map(m => m.voteCount || 0), 10);

    const handleExportCSV = () => {
        if (!data.length && !votes.length) return;

        const headers = ['User', 'Mix Name', 'Comment', 'Date'];
        // Use votes if available, otherwise just summary
        const rows = votes.length ? votes.map(v => [
            v.user?.name || 'Anonymous',
            v.mixName,
            `"${(v.comment || '').replace(/"/g, '""')}"`,
            new Date(v.createdAt).toLocaleDateString()
        ]) : data.map(d => ['Summary', d.name, `${d.votes} Votes`, '-']);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'fruits_aura_votes.csv';
        link.click();
    };

    if (loading) return <div className="p-8">Loading voting data...</div>;

    const handleResetVotes = async () => {
        if (window.confirm('Are you sure you want to RESET all votes? This will clear the leaderboard and individual vote records.')) {
            try {
                await resetVotingCycle();
                showToast('Voting cycle reset successfully', 'success');
                fetchResults();
            } catch (error) {
                showToast('Failed to reset votes', 'error');
            }
        }
    };

    const handleDeleteMix = async (id) => {
        if (window.confirm('Delete this candidate? This will also remove its votes.')) {
            try {
                await deleteMix(id);
                showToast('Candidate removed', 'success');
                setMixes(mixes.filter(m => m._id !== id));
            } catch (error) {
                showToast('Failed to delete candidate', 'error');
            }
        }
    };

    const handleSaveMix = async (e) => {
        e.preventDefault();
        try {
            // Process comma-separated strings back into arrays
            const processedData = {
                ...formData,
                ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
                benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b),
                nutrients: formData.nutrients.filter(n => n.label && n.value)
            };

            if (editingMix) {
                await updateMix(editingMix._id, processedData);
                showToast('Candidate updated', 'success');
            } else {
                await createMix(processedData);
                showToast('Candidate added', 'success');
            }
            setIsModalOpen(false);
            setEditingMix(null);
            fetchResults();
        } catch (error) {
            showToast('Failed to save candidate', 'error');
        }
    };

    const openAddModal = () => {
        setEditingMix(null);
        setFormData({
            name: '',
            description: '',
            image: '',
            optimalTiming: 'Pre/Post-Workout',
            ingredients: '',
            benefits: '',
            fitnessApplication: '',
            nutrients: [{ label: '', value: '' }],
            isActive: true
        });
        setIsModalOpen(true);
    };

    const openEditModal = (mix) => {
        setEditingMix(mix);
        setFormData({
            name: mix.name || '',
            description: mix.description || '',
            image: mix.image || '',
            optimalTiming: mix.optimalTiming || 'Pre/Post-Workout',
            ingredients: (mix.ingredients || []).join(', '),
            benefits: (mix.benefits || []).join(', '),
            fitnessApplication: mix.fitnessApplication || '',
            nutrients: (mix.nutrients && mix.nutrients.length > 0) ? mix.nutrients : [{ label: '', value: '' }],
            isActive: mix.isActive !== undefined ? mix.isActive : true
        });
        setIsModalOpen(true);
    };

    const handleNutrientChange = (index, field, value) => {
        const newNutrients = [...formData.nutrients];
        newNutrients[index][field] = value;
        setFormData({ ...formData, nutrients: newNutrients });
    };

    const addNutrientRow = () => {
        setFormData({
            ...formData,
            nutrients: [...formData.nutrients, { label: '', value: '' }]
        });
    };

    const removeNutrientRow = (index) => {
        const newNutrients = formData.nutrients.filter((_, i) => i !== index);
        setFormData({ ...formData, nutrients: newNutrients });
    };

    return (
        <div className="voting-results-container">
            <div className="admin-page-header">
                <div>
                    <h1>Voting Results</h1>
                    <p>Community preferences and feedback</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant={votingActive ? "primary" : "secondary"} onClick={() => setVotingActive(!votingActive)}>
                        {votingActive ? 'Voting Active' : 'Voting Paused'}
                    </Button>
                    <Button onClick={handleResetVotes} style={{ background: '#FF3B30', color: 'white', border: 'none' }}>
                        Reset Cycle
                    </Button>
                    <Button onClick={handleExportCSV} variant="outline">
                        <Download size={18} /> Export CSV
                    </Button>
                </div>
            </div>

            <div className="results-grid">
                {/* CSS Chart Section */}
                <div className="chart-card">
                    <h3>Vote Distribution</h3>
                    <div className="css-chart-container">
                        {mixes.map((item, index) => (
                            <div key={index} className="chart-bar-row">
                                <span className="chart-label">{item.name}</span>
                                <div className="bar-track">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            width: `${(item.voteCount / maxVotes) * 100}%`,
                                            backgroundColor: item.color || 'var(--admin-primary)'
                                        }}
                                    >
                                        <span className="bar-value">{item.voteCount}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {mixes.length === 0 && <p className="no-data">No candidates found.</p>}
                    </div>
                </div>

                {/* Top Mix Winner */}
                <div className="winner-card">
                    <h3>Current Leader</h3>
                    {mixes.length > 0 && mixes[0].voteCount > 0 ? (
                        <div className="winner-content">
                            <div className="crown-icon">👑</div>
                            <h2 style={{ color: mixes[0].color || 'var(--admin-accent)' }}>{mixes[0].name}</h2>
                            <div className="vote-badge">
                                {mixes[0].voteCount} Votes
                            </div>
                            <p>Leading by {mixes.length > 1 ? mixes[0].voteCount - mixes[1].voteCount : mixes[0].voteCount} votes</p>
                        </div>
                    ) : (
                        <div className="no-winner">
                            <p>No leader yet</p>
                        </div>
                    )}

                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #333', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h4>Manage Candidates</h4>
                            <Button size="sm" variant="primary" onClick={openAddModal}>+ Add</Button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {mixes.map((item, idx) => (
                                <div key={idx} className="candidate-list-item">
                                    <div className="candidate-info">
                                        <span className="candidate-name">{item.name}</span>
                                        <small>{item.voteCount} votes</small>
                                    </div>
                                    <div className="candidate-actions">
                                        <button className="edit-btn" onClick={() => openEditModal(item)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDeleteMix(item._id)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Candidate Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingMix ? "Edit Candidate" : "Add Candidate"}
            >
                <form onSubmit={handleSaveMix} className="admin-form">
                    <div className="form-group">
                        <label>Candidate Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Tropical Ginger Blast"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Briefly describe the mix..."
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="text"
                            value={formData.image}
                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                            placeholder="/images/mixes/..."
                        />
                    </div>
                    <div className="form-group">
                        <label>Optimal Timing</label>
                        <select
                            value={formData.optimalTiming}
                            onChange={e => setFormData({ ...formData, optimalTiming: e.target.value })}
                        >
                            <option value="Pre-Workout">Pre-Workout</option>
                            <option value="Post-Workout">Post-Workout</option>
                            <option value="Pre/Post-Workout">Pre/Post-Workout</option>
                            <option value="With Meals">With Meals</option>
                            <option value="Anytime">Anytime</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Fitness Application</label>
                        <input
                            type="text"
                            value={formData.fitnessApplication}
                            onChange={e => setFormData({ ...formData, fitnessApplication: e.target.value })}
                            placeholder="e.g. Muscle Recovery, Endurance"
                        />
                    </div>

                    <div className="form-group">
                        <label>Ingredients (comma separated)</label>
                        <textarea
                            value={formData.ingredients}
                            onChange={e => setFormData({ ...formData, ingredients: e.target.value })}
                            placeholder="e.g. Orange, Ginger, Kale"
                        />
                    </div>

                    <div className="form-group">
                        <label>Benefits (comma separated)</label>
                        <textarea
                            value={formData.benefits}
                            onChange={e => setFormData({ ...formData, benefits: e.target.value })}
                            placeholder="e.g. Energy Boost, Muscle Repair"
                        />
                    </div>

                    <div className="form-group">
                        <label>Nutrients</label>
                        {formData.nutrients.map((nutrient, index) => (
                            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="text"
                                    placeholder="Label (e.g. Vit C)"
                                    value={nutrient.label}
                                    style={{ flex: 1 }}
                                    onChange={e => handleNutrientChange(index, 'label', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Value (e.g. 50mg)"
                                    value={nutrient.value}
                                    style={{ flex: 1 }}
                                    onChange={e => handleNutrientChange(index, 'value', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeNutrientRow(index)}
                                    style={{ background: '#FF3B30', color: '#fff', border: 'none', borderRadius: '4px', padding: '0 8px' }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="add-btn"
                            onClick={addNutrientRow}
                            style={{ fontSize: '0.8rem', padding: '4px 12px', background: '#eee', color: '#333' }}
                        >
                            + Add Nutrient
                        </button>
                    </div>
                    <div className="modal-footer" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Candidate</Button>
                    </div>
                </form>
            </Modal>

            {/* Comments Section */}
            <div className="comments-section">
                <h3>Recent Feedback</h3>
                <div className="comments-list">
                    {votes.filter(v => v.comment).slice(0, 10).map(vote => (
                        <div key={vote._id} className="comment-item">
                            <div className="comment-header">
                                <span className="user-name">{vote.user?.name || 'Anonymous'}</span>
                                <span className="voted-for">voted for <strong>{vote.mixName}</strong></span>
                                <span className="date">{new Date(vote.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="comment-text">"{vote.comment}"</p>
                        </div>
                    ))}
                    {votes.length === 0 && <p className="no-data">No comments yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default VotingResults;
