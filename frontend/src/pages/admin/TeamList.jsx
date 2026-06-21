import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { AdminSidebar } from './Dashboard';
import './Admin.css';

export default function TeamList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [noteModal, setNoteModal] = useState(null);
  const [note, setNote] = useState('');
  const toast = useToast();
  const LIMIT = 15;

  const fetchTeams = () => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (status) params.status = status;
    axios.get('/api/teams', { params })
      .then(r => { setTeams(r.data.teams); setTotal(r.data.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTeams(); }, [page, status]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`/api/teams/${id}/status`, { status: newStatus, adminNote: note });
      toast.success('Updated!', `Team ${newStatus}.`);
      setNoteModal(null); setNote('');
      fetchTeams();
    } catch (err) {
      toast.error('Error', err.response?.data?.message);
    }
  };

  const STATUS_BADGE = { approved: 'badge-green', rejected: 'badge-red', pending: 'badge-gold' };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Teams</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{total} total teams</p>
          </div>
        </div>
        <div className="filters-bar">
          <select className="form-input" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} style={{ width: '180px' }}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? <div className="loading-center"><div className="spinner" /></div> : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Team Name</th><th>Members</th><th>Type</th><th>Status</th><th>Created</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {teams.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No teams found.</td></tr>
                  ) : teams.map(t => (
                    <tr key={t._id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.teamName}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {t.members?.map(m => (
                            <span key={m._id} style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.fullName}</span>
                          ))}
                        </div>
                      </td>
                      <td><span className={`badge ${t.isAllocated ? 'badge-cyan' : 'badge-violet'}`}>{t.isAllocated ? 'Allocated' : 'Self-formed'}</span></td>
                      <td><span className={`badge ${STATUS_BADGE[t.status]}`}>{t.status}</span></td>
                      <td style={{ fontSize: '12px' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="actions-cell">
                          {t.status !== 'approved' && <button className="btn btn-success btn-sm" onClick={() => updateStatus(t._id, 'approved')}>✓ Approve</button>}
                          {t.status !== 'rejected' && <button className="btn btn-danger btn-sm" onClick={() => setNoteModal({ team: t })}>✗ Reject</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {total > LIMIT && (
              <div className="pagination">
                {Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => (
                  <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                ))}
              </div>
            )}
          </>
        )}

        {noteModal && (
          <div className="modal-overlay" onClick={() => setNoteModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3 className="modal-title">Reject Team: {noteModal.team.teamName}</h3>
              <div className="form-group">
                <label className="form-label">Reason (optional)</label>
                <textarea className="form-input" rows={3} value={note} onChange={e => setNote(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button className="btn btn-ghost" onClick={() => setNoteModal(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => updateStatus(noteModal.team._id, 'rejected')}>Reject Team</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
