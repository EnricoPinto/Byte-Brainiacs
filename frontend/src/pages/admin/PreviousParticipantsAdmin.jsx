import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { AdminSidebar } from './Dashboard';
import AnimatedSection from '../../components/AnimatedSection';
import './Admin.css';

const EMPTY = { year: '', teamName: '', participantNames: '', college: '', achievement: '', projectTitle: '' };

export default function PreviousParticipantsAdmin() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | record
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toast = useToast();

  const fetchRecords = () => {
    setLoading(true);
    axios.get('/api/previous-participants', { params: { limit: 100 } })
      .then(r => setRecords(r.data.records))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRecords(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (r) => {
    setForm({ ...r, participantNames: r.participantNames?.join(', ') || '' });
    setModal(r);
  };

  const save = async () => {
    setSaving(true);
    try {
      const data = { ...form, participantNames: form.participantNames.split(',').map(n => n.trim()).filter(Boolean), year: parseInt(form.year) };
      if (modal === 'add') {
        await axios.post('/api/previous-participants', data);
        toast.success('Added!', 'Record created.');
      } else {
        await axios.put(`/api/previous-participants/${modal._id}`, data);
        toast.success('Updated!', 'Record updated.');
      }
      setModal(null);
      fetchRecords();
    } catch (err) {
      toast.error('Error', err.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this record?')) return;
    await axios.delete(`/api/previous-participants/${id}`);
    toast.success('Deleted!');
    fetchRecords();
  };

  const ACHIEVEMENT_BADGE = { Winner: 'badge-gold', 'Runner-Up': 'badge-violet', Participant: 'badge-cyan' };

  return (
    <div className="admin-layout">
      <AdminSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className={`sidebar-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      
      <div className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="menu-toggle" onClick={() => setMenuOpen(true)}>☰</button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Past Winners</h1>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add Record</button>
        </header>

        <main className="admin-content">
          <AnimatedSection>
            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : (
              <div className="admin-table-container">
                <div className="table-wrapper" style={{ border: 'none', borderRadius: '0', backdropFilter: 'none' }}>
                  <table>
                    <thead>
                      <tr><th>Year</th><th>Team</th><th>Members</th><th>College</th><th>Achievement</th><th>Project</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {records.length === 0 ? (
                        <tr><td colSpan={7} className="empty-state">No records found.</td></tr>
                      ) : records.map(r => (
                        <tr key={r._id}>
                          <td><span className="badge badge-gray">{r.year}</span></td>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.teamName}</td>
                          <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{r.participantNames?.join(' · ')}</td>
                          <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{r.college}</td>
                          <td>{r.achievement && <span className={`badge ${ACHIEVEMENT_BADGE[r.achievement] || 'badge-gray'}`}>{r.achievement}</span>}</td>
                          <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{r.projectTitle || '—'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn btn-outline btn-sm" style={{ padding: '6px' }} onClick={() => openEdit(r)}>✏️</button>
                              <button className="btn btn-danger btn-sm" style={{ padding: '6px' }} onClick={() => remove(r._id)}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </AnimatedSection>

          {modal && (
            <div className="modal-overlay" onClick={() => setModal(null)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <h3 className="modal-title">{modal === 'add' ? 'Add' : 'Edit'} Past Winner</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { name: 'year', label: 'Year', type: 'number' },
                    { name: 'teamName', label: 'Team Name', type: 'text' },
                    { name: 'college', label: 'College', type: 'text' },
                    { name: 'projectTitle', label: 'Project Title', type: 'text' },
                    { name: 'participantNames', label: 'Members (comma-separated)', type: 'text' },
                  ].map(f => (
                    <div key={f.name} className="form-group">
                      <label className="form-label">{f.label}</label>
                      <input type={f.type} className="form-input" value={form[f.name]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} />
                    </div>
                  ))}
                  <div className="form-group">
                    <label className="form-label">Achievement</label>
                    <select className="form-input" value={form.achievement} onChange={e => setForm(p => ({ ...p, achievement: e.target.value }))}>
                      <option value="">Select</option>
                      {['Winner', 'Runner-Up', 'Participant'].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                  <button className="btn btn-primary" onClick={save} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Record'}
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
