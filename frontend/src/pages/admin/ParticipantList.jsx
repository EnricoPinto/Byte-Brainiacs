import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { AdminSidebar } from './Dashboard';
import AnimatedSection from '../../components/AnimatedSection';
import { TableSkeleton } from '../../components/SkeletonLoader';
import './Admin.css';

const getCollegeIdUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  let normalized = url.replace(/\\/g, '/').replace(/^backend\//, '');
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }
  return normalized;
};

const STATUS_BADGE = {
  approved: 'badge-green',
  rejected: 'badge-red',
  pending: 'badge-gold',
  waiting_for_team: 'badge-cyan',
};

export default function ParticipantList() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [noteModal, setNoteModal] = useState(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null);
  const [note, setNote] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const toast = useToast();
  const LIMIT = 15;

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (search) params.search = search;
    if (type) params.type = type;
    if (status) params.status = status;
    axios.get('/api/participants', { params })
      .then(r => { setParticipants(r.data.participants); setTotal(r.data.total); })
      .finally(() => setLoading(false));
  }, [page, search, type, status]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`/api/participants/${id}/status`, { status: newStatus, adminNote: note });
      toast.success('Updated!', `Participant ${newStatus}.`);
      setNoteModal(null); setNote('');
      fetchData();
    } catch (err) {
      toast.error('Error', err.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/participants/${id}`);
      toast.success('Deleted!', 'Participant deleted successfully.');
      setDeleteConfirmModal(null);
      fetchData();
    } catch (err) {
      toast.error('Error', err.response?.data?.message || 'Failed to delete participant.');
    }
  };

  const handleAction = (participant, action) => {
    if (action === 'rejected') {
      setNoteModal({ participant, action });
    } else {
      updateStatus(participant._id, action);
    }
  };

  const handleExport = async () => {
    try {
      toast.success('Exporting...', 'Generating Excel file...');
      const response = await axios.get('/api/participants/export', { 
        params: { type, status },
        responseType: 'blob' 
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ByteBrainiacs_Participants.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Export Failed', 'Could not download the Excel file.');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className={`sidebar-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      
      <div className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="menu-toggle" onClick={() => setMenuOpen(true)}>☰</button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Participants</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{total} total registrations</p>
            </div>
          </div>
          <button onClick={handleExport} className="btn btn-outline btn-sm">⬇ Export Data</button>
        </header>

        <main className="admin-content">
          <AnimatedSection>
            {/* Filters */}
            <div className="admin-table-container">
              <div className="admin-table-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
                <input 
                  type="text"
                  className="search-input" 
                  placeholder="Search name, email, college..." 
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }} 
                />
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <select className="form-input" value={type} onChange={e => { setType(e.target.value); setPage(1); }} style={{ width: '160px' }}>
                    <option value="">All Types</option>
                    <option value="individual">Individual</option>
                    <option value="team">Team</option>
                  </select>
                  <select className="form-input" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} style={{ width: '180px' }}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved (Paid)</option>
                    <option value="rejected">Rejected</option>
                    <option value="waiting_for_team">Waiting for Team</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div style={{ marginTop: '24px' }}><TableSkeleton rows={10} columns={8} /></div>
              ) : (
                <div className="table-wrapper" style={{ border: 'none', borderRadius: '0', backdropFilter: 'none' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th><th>Email</th><th>College</th><th>Type</th>
                        <th>Team</th><th>Status</th><th>Registered</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.length === 0 ? (
                        <tr><td colSpan={8} className="empty-state">No participants found.</td></tr>
                      ) : participants.map(p => (
                        <tr key={p._id}>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.fullName}</td>
                          <td>{p.email}</td>
                          <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.college}>{p.college}</td>
                          <td><span className={`badge ${p.registrationType === 'individual' ? 'badge-cyan' : 'badge-violet'}`}>{p.registrationType}</span></td>
                          <td>{p.teamName || p.teamId?.teamName || '—'}</td>
                          <td><span className={`badge ${STATUS_BADGE[p.status] || 'badge-gray'}`}>{p.status.replace('_', ' ')}</span></td>
                          <td style={{ fontSize: '12px' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              {p.status !== 'approved' && (
                                <button className="btn btn-success btn-sm" style={{ padding: '6px' }} title="Approve Participant" onClick={() => handleAction(p, 'approved')}>✓</button>
                              )}
                              {p.status !== 'rejected' && (
                                <button className="btn btn-warn btn-sm" style={{ padding: '6px' }} title="Reject Participant" onClick={() => handleAction(p, 'rejected')}>✗</button>
                              )}
                              {p.collegeIdUrl && (
                                <a href={getCollegeIdUrl(p.collegeIdUrl)} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ padding: '6px' }} title="View College ID">📄</a>
                              )}
                              <button className="btn btn-danger btn-sm" style={{ padding: '6px' }} title="Delete Participant" onClick={() => setDeleteConfirmModal(p)}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {!loading && total > LIMIT && (
              <div className="pagination">
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>←</button>
                {Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => (
                  <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                ))}
                <button className="page-btn" disabled={page === Math.ceil(total / LIMIT)} onClick={() => setPage(p => p + 1)}>→</button>
              </div>
            )}
          </AnimatedSection>

          {/* Modals */}
          {noteModal && (
            <div className="modal-overlay" onClick={() => setNoteModal(null)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <h3 className="modal-title">Reject Participant</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Rejecting <strong>{noteModal.participant.fullName}</strong>. Add an optional note:
                </p>
                <div className="form-group">
                  <label className="form-label">Admin Note (optional)</label>
                  <textarea className="form-input" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Reason for rejection..." />
                </div>
                <div className="modal-actions">
                  <button className="btn btn-ghost" onClick={() => setNoteModal(null)}>Cancel</button>
                  <button className="btn btn-danger" onClick={() => updateStatus(noteModal.participant._id, 'rejected')}>Reject</button>
                </div>
              </div>
            </div>
          )}

          {deleteConfirmModal && (
            <div className="modal-overlay" onClick={() => setDeleteConfirmModal(null)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <h3 className="modal-title" style={{ color: 'var(--rose-light)' }}>Delete Participant</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                  Are you sure you want to permanently delete <strong style={{ color: 'var(--text-primary)' }}>{deleteConfirmModal.fullName}</strong>?
                  This will remove their record from the database and any associated teams. This action cannot be undone.
                </p>
                <div className="modal-actions">
                  <button className="btn btn-ghost" onClick={() => setDeleteConfirmModal(null)}>Cancel</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirmModal._id)}>Delete Permanently</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
