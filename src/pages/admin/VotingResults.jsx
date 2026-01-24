import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { getVotingRankings } from '../../api/votingApi';
import client from '../../api/client';
import Button from '../../components/Button';
import { useToast } from '../../context/ToastContext';
import './VotingResults.css';

const VotingResults = () => {
    const [data, setData] = useState([]);
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const rankingsRes = await getVotingRankings();
            const rankings = rankingsRes.products || rankingsRes.data || [];

            const chartData = rankings.map(item => ({
                name: item.mixName || item.name,
                votes: item.voteCount || 0,
                color: item.color || '#FF8C00'
            }));

            // Sort by votes descending
            chartData.sort((a, b) => b.votes - a.votes);

            setData(chartData);

            // Fetch detailed votes from votes endpoint
            const detailedRes = await client.get('/votes').catch(() => ({ data: { votes: [] } }));
            setVotes(detailedRes.data.votes || []);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
        if (confirm('Are you sure you want to RESET all votes? This action cannot be undone.')) {
            try {
                // await client.post('/admin/votes/reset');
                showToast('Voting cycle reset successfully', 'success');
                setVotes([]);
                setData(data.map(d => ({ ...d, votes: 0 })));
            } catch (error) {
                showToast('Failed to reset votes', 'error');
            }
        }
    };

    const [votingActive, setVotingActive] = useState(true);

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
                        {data.map((item, index) => (
                            <div key={index} className="chart-bar-row">
                                <span className="chart-label">{item.name}</span>
                                <div className="bar-track">
                                    <div
                                        className="bar-fill"
                                        style={{
                                            width: `${(item.votes / maxVotes) * 100}%`,
                                            backgroundColor: item.color
                                        }}
                                    >
                                        <span className="bar-value">{item.votes}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {data.length === 0 && <p className="no-data">No votes recorded yet.</p>}
                    </div>
                </div>

                {/* Top Mix Winner */}
                <div className="winner-card">
                    <h3>Current Leader</h3>
                    {data.length > 0 && (
                        <div className="winner-content">
                            <div className="crown-icon">👑</div>
                            <h2 style={{ color: data[0].color }}>{data[0].name}</h2>
                            <div className="vote-badge">
                                {data[0].votes} Votes
                            </div>
                            <p>Leading by {data.length > 1 ? data[0].votes - data[1].votes : 0} votes</p>
                        </div>
                    )}

                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #333', width: '100%' }}>
                        <h4>Manage Candidates</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                            {data.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#121212', borderRadius: '6px' }}>
                                    <span>{item.name}</span>
                                    <button style={{ color: '#FF3B30', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                                </div>
                            ))}
                            <Button size="sm" variant="outline" style={{ marginTop: '8px' }}>+ Add Candidate</Button>
                        </div>
                    </div>
                </div>
            </div>

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
