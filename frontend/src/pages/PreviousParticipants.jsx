import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PreviousParticipants() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const [college, setCollege] = useState('');
  const [years, setYears] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 12;

  useEffect(() => {
    axios.get('/api/previous-participants/filters').then(r => {
      setYears(r.data.years); setColleges(r.data.colleges);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (search) params.search = search;
    if (year) params.year = year;
    if (college) params.college = college;
    axios.get('/api/previous-participants', { params })
      .then(r => { setRecords(r.data.records); setTotal(r.data.total); })
      .finally(() => setLoading(false));
  }, [search, year, college, page]);

  const achievementColor = (a) => {
    if (a === 'Winner') return 'badge-gold';
    if (a === 'Runner-Up') return 'badge-violet';
    return 'badge-cyan';
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg-secondary)', padding: '60px 0 40px', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="section-tag">// hall of fame</p>
          <h1 className="section-title">Previous <span className="gradient-text">Participants</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            Celebrating the brilliant minds who shaped ByteBrainiacs.
          </p>
        </div>
      </div>

      <div className="container section-sm">
        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <input className="form-input" placeholder="🔍 Search name, team, college..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ flex: '1', minWidth: '200px' }} />
          <select className="form-input" value={year} onChange={e => { setYear(e.target.value); setPage(1); }} style={{ width: '160px' }}>
            <option value="">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select className="form-input" value={college} onChange={e => { setCollege(e.target.value); setPage(1); }} style={{ width: '240px', minWidth: '180px' }}>
            <option value="">All Colleges</option>
            {colleges.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '48px' }}>🏆</div>
            <h3>No records found</h3>
            <p>Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid-3">
            {records.map(r => (
              <div key={r._id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <span className="badge badge-gray">📅 {r.year}</span>
                  {r.achievement && <span className={`badge ${achievementColor(r.achievement)}`}>{r.achievement}</span>}
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--violet-light)' }}>🏷️ {r.teamName}</h3>
                {r.projectTitle && <p style={{ fontSize: '13px', color: 'var(--cyan)', marginBottom: '12px' }}>💡 {r.projectTitle}</p>}
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>🏛️ {r.college}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {r.participantNames?.map(n => (
                    <span key={n} style={{ background: 'rgba(99,102,241,0.1)', padding: '4px 10px', borderRadius: '100px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > LIMIT && (
          <div className="pagination">
            {Array.from({ length: Math.ceil(total / LIMIT) }, (_, i) => (
              <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
