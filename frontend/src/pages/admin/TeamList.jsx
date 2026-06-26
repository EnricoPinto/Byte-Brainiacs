import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { AdminSidebar } from './Dashboard';
import AnimatedSection from '../../components/AnimatedSection';
import { TableSkeleton } from '../../components/SkeletonLoader';
import './Admin.css';

export default function TeamList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [noteModal, setNoteModal] = useState(null);
  const [note, setNote] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [eligibleIndividuals, setEligibleIndividuals] = useState([]);
  const [savingEdit, setSavingEdit] = useState(false);
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

  const openEditModal = async (team) => {
    setEditModal({ team, memberIds: team.members.map(m => m._id) });
    try {
      const r = await axios.get('/api/teams/approved-individuals');
      setEligibleIndividuals(r.data.individuals);
    } catch (err) {
      toast.error('Error', 'Failed to fetch eligible individuals');
    }
  };

  const submitEditTeam = async () => {
    if (editModal.memberIds.length !== 3 || editModal.memberIds.includes('')) {
      return toast.error('Error', 'Please select exactly 3 members.');
    }
    setSavingEdit(true);
    try {
      await axios.put(`/api/teams/${editModal.team._id}/members`, { memberIds: editModal.memberIds });
      toast.success('Team Updated', 'Members updated successfully and emails sent.');
      setEditModal(null);
      fetchTeams();
    } catch (err) {
      toast.error('Error', err.response?.data?.message || 'Failed to update team');
    } finally {
      setSavingEdit(false);
    }
  };

  const updateEditSlot = (index, newId) => {
    const newIds = [...editModal.memberIds];
    newIds[index] = newId;
    setEditModal({ ...editModal, memberIds: newIds });
  };

  const STATUS_BADGE = { approved: 'badge-green', rejected: 'badge-red', pending: 'badge-gold' };

  return (
    <div className="admin-layout">
      <AdminSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className={`sidebar-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      
      <div className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="menu-toggle" onClick={() => setMenuOpen(true)}>☰</button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Teams</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{total} total teams</p>
            </div>
          </div>
        </header>
        
        <main className="admin-content">
          <AnimatedSection>
            <div className="admin-table-container">
              <div className="admin-table-header" style={{ justifyContent: 'flex-end' }}>
                <select className="form-input" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} style={{ width: '180px' }}>
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {loading ? (
                <div style={{ marginTop: '24px' }}><TableSkeleton rows={10} columns={6} /></div>
              ) : (
                <div className="table-wrapper" style={{ border: 'none', borderRadius: '0', backdropFilter: 'none' }}>
                  <table>
                    <thead>
                      <tr><th>Team Name</th><th>Members</th><th>Type</th><th>Status</th><th>Created</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {teams.length === 0 ? (
                        <tr><td colSpan={6} className="empty-state">No teams found.</td></tr>
                      ) : teams.map(t => (
                        <tr key={t._id}>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.teamName}</td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              {t.members?.map(m => (
                                <span key={m._id} style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                  <span style={{ color: 'var(--violet-light)', marginRight: '4px' }}>•</span>{m.fullName}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td><span className={`badge ${t.isAllocated ? 'badge-cyan' : 'badge-violet'}`}>{t.isAllocated ? 'Allocated' : 'Self-formed'}</span></td>
                          <td><span className={`badge ${STATUS_BADGE[t.status] || 'badge-gray'}`}>{t.status}</span></td>
                          <td style={{ fontSize: '12px' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              {t.status !== 'approved' && <button className="btn btn-success btn-sm" onClick={() => updateStatus(t._id, 'approved')}>✓</button>}
                              {t.status !== 'rejected' && <button className="btn btn-warn btn-sm" onClick={() => setNoteModal({ team: t })}>✗</button>}
                              {t.isAllocated && (
                                <button className="btn btn-ghost btn-sm" style={{ padding: '6px' }} onClick={() => openEditModal(t)} title="Edit Members">✏️</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {!loading && total > LIMIT && (
              <div className="pagination">
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>←</button>
                {Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => (
                  <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                ))}
                <button className="page-btn" disabled={page === Math.ceil(total / LIMIT)} onClick={() => setPage(p => p + 1)}>→</button>
              </div>
            )}
          </AnimatedSection>

          {noteModal && (
            <div className="modal-overlay" onClick={() => setNoteModal(null)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <h3 className="modal-title">Reject Team: {noteModal.team.teamName}</h3>
                <div className="form-group">
                  <label className="form-label">Reason (optional)</label>
                  <textarea className="form-input" rows={3} value={note} onChange={e => setNote(e.target.value)} />
                </div>
                <div className="modal-actions">
                  <button className="btn btn-ghost" onClick={() => setNoteModal(null)}>Cancel</button>
                  <button className="btn btn-danger" onClick={() => updateStatus(noteModal.team._id, 'rejected')}>Reject Team</button>
                </div>
              </div>
            </div>
          )}

          {editModal && (
            <div className="modal-overlay" onClick={() => setEditModal(null)}>
              <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <h3 className="modal-title">Edit Team: {editModal.team.teamName}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '13px' }}>
                  Swap members with other unallocated approved individuals. Removed members will be returned to the pool and notified.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  {[0, 1, 2].map((slotIdx) => (
                    <div key={slotIdx} className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '12px' }}>Member {slotIdx + 1}</label>
                      <select 
                        className="form-input" 
                        value={editModal.memberIds[slotIdx] || ''} 
                        onChange={(e) => updateEditSlot(slotIdx, e.target.value)}
                      >
                        <option value="">-- Select Member --</option>
                        {/* Current member for this slot always shown first */}
                        {editModal.team.members[slotIdx] && (
                          <option value={editModal.team.members[slotIdx]._id}>
                            {editModal.team.members[slotIdx].fullName} (Current)
                          </option>
                        )}
                        {eligibleIndividuals
                          // Exclude: members selected in OTHER slots (not this slot's current member)
                          .filter(p => {
                            const currentSlotMemberId = editModal.team.members[slotIdx]?._id;
                            // Always exclude if they're the current member for this slot (already shown above)
                            if (p._id === currentSlotMemberId) return false;
                            // Exclude if selected in any OTHER slot
                            const otherSlotIds = editModal.memberIds.filter((_, i) => i !== slotIdx);
                            return !otherSlotIds.includes(p._id);
                          })
                          .map(p => (
                            <option key={p._id} value={p._id}>{p.fullName} - {p.college}</option>
                          ))
                        }
                      </select>
                    </div>
                  ))}
                </div>
                <div className="modal-actions">
                  <button className="btn btn-ghost" onClick={() => setEditModal(null)}>Cancel</button>
                  <button className="btn btn-primary" onClick={submitEditTeam} disabled={savingEdit}>
                    {savingEdit ? '⏳ Saving...' : 'Save & Notify'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
