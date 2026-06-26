import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { AdminSidebar } from './Dashboard';
import AnimatedSection from '../../components/AnimatedSection';
import './Admin.css';

export default function TeamAllocation() {
  const [individuals, setIndividuals] = useState([]);
  const [selected, setSelected] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const toast = useToast();

  const fetchIndividuals = () => {
    setLoading(true);
    axios.get('/api/teams/approved-individuals')
      .then(r => setIndividuals(r.data.individuals))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchIndividuals(); }, []);

  const toggleSelect = (id) => {
    setSelected(s =>
      s.includes(id) ? s.filter(x => x !== id) : s.length < 3 ? [...s, id] : s
    );
  };

  const allocate = async () => {
    if (selected.length !== 3) return toast.error('Select exactly 3', 'Please select exactly 3 participants.');
    if (!teamName.trim()) return toast.error('Team name required', 'Enter a team name.');
    setSubmitting(true);
    try {
      await axios.post('/api/teams/allocate', { memberIds: selected, teamName: teamName.trim() });
      setSuccessMsg(teamName.trim());
      toast.success('Team Allocated!', `Team "${teamName.trim()}" created. Members notified via email.`);
      // Remove allocated members from list
      setIndividuals(prev => prev.filter(x => !selected.includes(x._id)));
      setSelected([]);
      setTeamName('');
    } catch (err) {
      toast.error('Error', err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
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
              <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Team Allocation</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                Select 2 or 3 approved individuals to form a team
              </p>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={fetchIndividuals}>↻ Refresh List</button>
        </header>

        <main className="admin-content">
          <AnimatedSection>
            {/* Success Banner */}
            {successMsg && (
              <div style={{
                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '12px', padding: '16px 20px', marginBottom: '24px',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <span style={{ fontSize: '20px' }}>✅</span>
                <p style={{ color: 'var(--emerald)', fontSize: '14px', flex: 1 }}>
                  Team "<strong>{successMsg}</strong>" was successfully created! All 3 members have been notified via email.
                </p>
                <button onClick={() => setSuccessMsg('')} style={{ background: 'none', border: 'none', color: 'var(--emerald)', cursor: 'pointer', fontSize: '18px' }}>×</button>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'flex-start' }}>

              {/* ── Individuals Pool ── */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', color: 'var(--violet-light)' }}>
                    Approved Individuals <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({individuals.length} available)</span>
                  </h3>
                  {selected.length > 0 && (
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected([])}>Clear selection</button>
                  )}
                </div>

                {loading ? (
                  <div className="loading-center"><div className="spinner" /></div>
                ) : individuals.length === 0 ? (
                  <div className="empty-state">
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
                    <h3>No eligible individuals</h3>
                    <p>Approve some individual registrations first, then return here to allocate teams.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px' }}>
                    {individuals.map(p => {
                      const isSelected = selected.includes(p._id);
                      const selIdx = selected.indexOf(p._id);
                      const maxReached = selected.length >= 3 && !isSelected;
                      return (
                        <div key={p._id}
                          onClick={() => !maxReached && toggleSelect(p._id)}
                          style={{
                            padding: '16px',
                            borderRadius: '12px',
                            border: `1px solid ${isSelected ? 'var(--violet)' : 'var(--border)'}`,
                            background: isSelected ? 'rgba(139,92,246,0.05)' : 'var(--bg-card)',
                            cursor: maxReached ? 'not-allowed' : 'pointer',
                            opacity: maxReached ? 0.5 : 1,
                            transition: 'var(--transition)',
                            display: 'flex', alignItems: 'center', gap: '16px',
                            boxShadow: isSelected ? '0 0 15px rgba(139,92,246,0.1)' : 'none'
                          }}>
                          {/* Selection number badge */}
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                            background: isSelected ? 'var(--violet)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isSelected ? 'var(--violet)' : 'var(--border)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', fontWeight: 700,
                            color: isSelected ? '#fff' : 'var(--text-muted)',
                            transition: 'var(--transition)',
                          }}>
                            {isSelected ? selIdx + 1 : '○'}
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>{p.fullName}</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              {p.college} &nbsp;·&nbsp; {p.yearOfStudy} &nbsp;·&nbsp; {p.city || 'Mumbai'}
                            </div>
                          </div>

                          {isSelected && (
                            <span style={{ fontSize: '12px', background: 'rgba(139,92,246,0.2)', color: 'var(--violet-light)', padding: '4px 10px', borderRadius: '100px', flexShrink: 0, fontWeight: 500 }}>
                              Selected
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Allocation Panel ── */}
              <div className="card" style={{ position: 'sticky', top: '100px', border: '1px solid var(--violet)', boxShadow: '0 0 30px rgba(139,92,246,0.05)' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '24px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--cyan)' }}>🔗</span> Create Team
                </h3>

                {/* Progress indicator */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Members selected</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: selected.length >= 2 ? 'var(--emerald)' : 'var(--amber)' }}>
                      {selected.length} / 3
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '4px',
                      width: `${(selected.length / 3) * 100}%`,
                      background: selected.length >= 2 ? 'var(--emerald)' : 'var(--grad-primary)',
                      transition: 'width 0.3s ease, background 0.3s ease',
                    }} />
                  </div>
                </div>

                {/* Selected members list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                  {[0, 1, 2].map(i => {
                    const memberId = selected[i];
                    const member = memberId ? individuals.find(x => x._id === memberId) : null;
                    return (
                      <div key={i} style={{
                        padding: '12px 16px', borderRadius: '10px',
                        background: member ? 'var(--bg-secondary)' : 'rgba(255,255,255,0.01)',
                        border: `1px dashed ${member ? 'var(--violet)' : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', gap: '12px',
                        minHeight: '52px',
                      }}>
                        <span style={{
                          width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                          background: member ? 'var(--violet)' : 'rgba(139,92,246,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px', fontWeight: 700,
                          color: member ? '#fff' : 'var(--text-muted)',
                        }}>{i + 1}</span>
                        {member ? (
                          <>
                            <span style={{ fontSize: '14px', fontWeight: 500, flex: 1, color: 'var(--text-primary)' }}>{member.fullName}</span>
                            <button onClick={() => toggleSelect(memberId)}
                              style={{ background: 'none', border: 'none', color: 'var(--rose)', cursor: 'pointer', fontSize: '18px', padding: '0 4px', transition: 'transform 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                            >×</button>
                          </>
                        ) : (
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Select from list...</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Team name */}
                <div className="form-group" style={{ marginBottom: '32px' }}>
                  <label className="form-label">Team Name <span style={{ color: 'var(--rose)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    placeholder="e.g. NeuralNinjas"
                  />
                </div>

                {/* Submit */}
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px' }}
                  disabled={selected.length < 2 || selected.length > 3 || !teamName.trim() || submitting}
                  onClick={allocate}
                >
                  {submitting ? '⏳ Allocating...' : 'Allocate & Notify Members'}
                </button>

                {/* Info box */}
                <div style={{
                  marginTop: '24px', padding: '16px',
                  background: 'rgba(6,182,212,0.05)', borderRadius: '10px',
                  border: '1px solid rgba(6,182,212,0.15)',
                  fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6',
                  display: 'flex', gap: '12px', alignItems: 'flex-start'
                }}>
                  <span style={{ fontSize: '18px' }}>📧</span>
                  <p style={{ margin: 0 }}>Once allocated, all 3 members will automatically receive a team notification email with teammate details.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </main>
      </div>
    </div>
  );
}
