import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import AnimatedSection from '../../components/AnimatedSection';
import { ChartSkeleton, StatCardSkeleton, TableSkeleton } from '../../components/SkeletonLoader';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './Admin.css';

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#6366f1'];

// Custom tooltip for the pie chart — clearly visible with color accent
const PieTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const { name, value } = payload[0].payload;
  const color = payload[0].fill;
  const total = payload[0].payload.total;
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{
      background: '#1a1535',
      border: `1.5px solid ${color}`,
      borderLeft: `5px solid ${color}`,
      borderRadius: '10px',
      padding: '10px 16px',
      minWidth: '160px',
      boxShadow: `0 8px 32px rgba(0,0,0,0.55), 0 0 16px ${color}33`,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}` }} />
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', letterSpacing: '0.01em' }}>{name}</span>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>COUNT</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>SHARE</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{pct}%</div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get('/api/dashboard/stats'),
      axios.get('/api/dashboard/chart-data'),
      axios.get('/api/dashboard/activity-logs'),
    ]).then(([s, c, l]) => {
      setStats(s.data.stats);
      setCharts(c.data);
      setLogs(l.data.logs);
    }).finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    try {
      setExporting(true);
      toast.success('Exporting...', 'Generating Excel file...');
      const response = await axios.get('/api/participants/export', { 
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
    } finally {
      setExporting(false);
    }
  };

  const LoadingDashboard = () => (
    <div className="admin-layout">
      <AdminSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Admin Portal</h1>
          </div>
        </header>
        <main className="admin-content">
          <div className="dashboard-stats" style={{ marginBottom: '24px' }}>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
          <div className="dashboard-charts">
            <div className="chart-card"><ChartSkeleton /></div>
            <div className="chart-card"><ChartSkeleton /></div>
          </div>
          <div className="card" style={{ marginTop: '32px' }}><TableSkeleton rows={3} columns={3} /></div>
        </main>
      </div>
    </div>
  );

  if (loading) return <LoadingDashboard />;

  return (
    <div className="admin-layout">
      <AdminSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className={`sidebar-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      
      <div className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="menu-toggle" onClick={() => setMenuOpen(true)}>☰</button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Admin Portal</h1>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={handleExport} className="btn btn-outline btn-sm" disabled={exporting}>
              {exporting ? '⏳ Exporting...' : '⬇ Export Data'}
            </button>
            <div className="admin-user">
              <span style={{ color: 'var(--text-secondary)' }}>{user?.email}</span>
              <div className="admin-avatar">{user?.name?.charAt(0) || 'A'}</div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <AnimatedSection>
            <h2 className="admin-page-title">Dashboard Overview</h2>
            
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--violet-light)' }}>👥</div>
                <div className="stat-value">{stats.totalParticipants}</div>
                <div className="stat-label">Total Participants</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--emerald-light)' }}>✅</div>
                <div className="stat-value">{stats.verifiedParticipants}</div>
                <div className="stat-label">Verified (Paid)</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--amber-light)' }}>⏳</div>
                <div className="stat-value">{(stats.totalParticipants || 0) - (stats.verifiedParticipants || 0)}</div>
                <div className="stat-label">Pending Payment</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--cyan-light)' }}>🛡️</div>
                <div className="stat-value">{stats.totalTeams}</div>
                <div className="stat-label">Total Teams</div>
              </div>
            </div>

            {charts && (
              <div className="dashboard-charts">
                <div className="chart-card">
                  <h3 className="chart-title">Registrations (Last 7 Days)</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={charts.registrationsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                      <RechartsTooltip cursor={{ fill: 'rgba(139,92,246,0.1)' }} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="var(--violet)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="chart-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 className="chart-title">Status Breakdown</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                     {/* Donut chart */}
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={(() => {
                            const total = charts.statusBreakdown.reduce((s, e) => s + e.value, 0);
                            return charts.statusBreakdown.map(e => ({ ...e, total }));
                          })()}
                          cx="50%" cy="50%"
                          innerRadius={58} outerRadius={95}
                          paddingAngle={4}
                          dataKey="value"
                          nameKey="name"
                        >
                          {charts.statusBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}
                              stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
                          ))}
                        </Pie>
                        <RechartsTooltip content={<PieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Legend */}
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
                      gap: '10px 20px', marginTop: '4px', padding: '0 12px 12px'
                    }}>
                      {charts.statusBreakdown.map((entry, index) => {
                        const total = charts.statusBreakdown.reduce((s, e) => s + e.value, 0);
                        const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
                        const entryWithTotal = { ...entry, total };
                        return (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Color swatch with number */}
                            <div style={{
                              width: '22px', height: '22px', borderRadius: '6px',
                              background: COLORS[index % COLORS.length],
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0, boxShadow: `0 2px 8px ${COLORS[index % COLORS.length]}55`
                            }}>
                              <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>{index + 1}</span>
                            </div>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: COLORS[index % COLORS.length], lineHeight: 1.2 }}>
                                {entry.name}
                              </div>
                              <div style={{ fontSize: '12px', color: '#fff', fontWeight: 500, marginTop: '2px' }}>
                                {entry.value} &nbsp;·&nbsp; <span style={{ color: COLORS[index % COLORS.length], fontWeight: 700 }}>{pct}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Log */}
            <div className="card" style={{ marginTop: '32px' }}>
              <h3 className="chart-title">Recent Activity</h3>
              {logs.length === 0 ? (
                <p className="empty-state">No activity yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {logs.slice(0, 10).map(l => (
                    <div key={l._id} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: 'rgba(139,92,246,0.03)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--violet)', flexShrink: 0, boxShadow: '0 0 10px var(--violet)' }} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600 }}>{l.action}</span>
                        {l.targetName && <span style={{ color: 'var(--violet-light)', fontSize: '15px' }}> — {l.targetName}</span>}
                        {l.details && <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{l.details}</p>}
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
                        {new Date(l.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        </main>
      </div>
    </div>
  );
}

export function AdminSidebar({ menuOpen, setMenuOpen }) {
  const { logout } = useAuth();
  const links = [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/admin/participants', icon: '👥', label: 'Participants' },
    { to: '/admin/teams', icon: '🏆', label: 'Teams' },
    { to: '/admin/team-allocation', icon: '🔗', label: 'Team Allocation' },
    { to: '/admin/previous-participants', icon: '📚', label: 'Past Winners' },
  ];
  
  return (
    <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <NavLink to="/" style={{ textDecoration: 'none' }} title="Back to Home Page">
          <div className="sidebar-brand">
            <span>⚡</span> ByteBrainiacs
          </div>
        </NavLink>
      </div>
      
      <nav className="sidebar-nav">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen?.(false)}>
            <span className="icon">{l.icon}</span> {l.label}
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}
