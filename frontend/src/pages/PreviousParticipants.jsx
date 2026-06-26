import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import AnimatedSection, { StaggerContainer, StaggerItem } from '../components/AnimatedSection';

export default function PreviousParticipants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'winners'
  const [yearFilter, setYearFilter] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      // Assuming a public endpoint exists or providing fallback mock data for demo if not available
      const res = await axios.get('/api/participants/previous');
      setParticipants(res.data);
    } catch (err) {
      console.error('Failed to fetch previous participants', err);
      // Fallback dummy data for visualization purposes
      setParticipants([
        { id: 1, teamName: 'Neural Ninjas', year: '2023', members: ['Alice S.', 'Bob M.', 'Charlie K.'], achievement: 'Winner', projectTitle: 'AI Crop Disease Predictor' },
        { id: 2, teamName: 'Data Demons', year: '2023', members: ['Dave L.', 'Eve R.', 'Frank T.'], achievement: 'Runner-Up', projectTitle: 'Smart Traffic Routing' },
        { id: 3, teamName: 'Tensor Titans', year: '2022', members: ['Grace H.', 'Heidi S.', 'Ivan J.'], achievement: 'Winner', projectTitle: 'Fake News Detector' },
        { id: 4, teamName: 'Byte Busters', year: '2023', members: ['Judy A.', 'Mallory B.', 'Niaj C.'], achievement: 'Participant', projectTitle: 'Sentiment Analyzer' },
        { id: 5, teamName: 'Logic Lords', year: '2022', members: ['Oscar D.', 'Peggy E.', 'Trent F.'], achievement: 'Participant', projectTitle: 'Stock Predictor' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return participants.filter(p => {
      const matchFilter = filter === 'all' || (filter === 'winners' && (p.achievement === 'Winner' || p.achievement === 'Runner-Up'));
      const matchYear = yearFilter === 'all' || p.year === yearFilter;
      return matchFilter && matchYear;
    });
  }, [participants, filter, yearFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const years = ['all', ...new Set(participants.map(p => p.year))].sort((a, b) => b.localeCompare(a));

  return (
    <div className="page-content">
      <div className="container" style={{ padding: '20px 24px 100px' }}>
        <AnimatedSection className="text-center" style={{ marginBottom: '40px' }}>
          <p className="section-tag">// hall of fame</p>
          <h1 className="section-title">Past <span className="gradient-text">Innovators</span></h1>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            A look back at the brilliant minds and groundbreaking projects from previous editions of ByteBrainiacs.
          </p>
        </AnimatedSection>

        {/* Filters */}
        <AnimatedSection animation="fadeIn">
          <div className="card" style={{ padding: '20px', marginBottom: '40px', display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Status:</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                  onClick={() => { setFilter('all'); setPage(1); }}
                >
                  All Participants
                </button>
                <button 
                  className={`btn ${filter === 'winners' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                  onClick={() => { setFilter('winners'); setPage(1); }}
                >
                  🏆 Winners Only
                </button>
              </div>
            </div>

            <div style={{ width: '1px', height: '24px', background: 'var(--border)', display: 'none' }} className="desktop-divider"></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Year:</span>
              <select 
                className="form-input" 
                style={{ padding: '6px 12px', width: 'auto' }}
                value={yearFilter} 
                onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
              >
                {years.map(y => (
                  <option key={y} value={y}>{y === 'all' ? 'All Years' : y}</option>
                ))}
              </select>
            </div>
          </div>
        </AnimatedSection>

        {/* Data Grid */}
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : currentData.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3>No participants found</h3>
            <p>Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <StaggerContainer className="grid-3">
              {currentData.map(p => (
                <StaggerItem key={p.id}>
                  <div className="card" style={{ 
                    height: '100%', display: 'flex', flexDirection: 'column',
                    ...(p.achievement === 'Winner' ? { borderColor: 'var(--gold)', boxShadow: '0 0 20px rgba(245,158,11,0.1)' } : {}),
                    ...(p.achievement === 'Runner-Up' ? { borderColor: 'var(--violet)', boxShadow: '0 0 20px rgba(139,92,246,0.1)' } : {})
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', margin: 0 }}>{p.teamName}</h3>
                      <span className="badge badge-gray">{p.year}</span>
                    </div>
                    
                    {p.achievement && p.achievement !== 'Participant' && (
                      <div style={{ 
                        display: 'inline-block', marginBottom: '16px', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 'bold',
                        ...(p.achievement === 'Winner' ? { background: 'rgba(245,158,11,0.15)', color: 'var(--gold)' } : { background: 'rgba(139,92,246,0.15)', color: 'var(--violet-light)' })
                      }}>
                        {p.achievement === 'Winner' ? '🥇 Winner' : '🥈 Runner-Up'}
                      </div>
                    )}

                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Project</p>
                      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '24px', fontWeight: '500' }}>
                        {p.projectTitle || 'Undisclosed Project'}
                      </p>
                      
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Team Members</p>
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {(p.members || []).map((m, i) => (
                          <li key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--violet-light)', fontSize: '10px' }}>▶</span> {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="page-btn" 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                >
                  ←
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  className="page-btn" 
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => p + 1)}
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-divider { display: block !important; }
        }
      `}</style>
    </div>
  );
}
