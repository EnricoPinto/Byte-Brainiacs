import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ParticleBackground from '../components/ParticleBackground';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { adminLogin, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(email, password);
      toast.success('Login Successful', 'Welcome to the admin dashboard.');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error('Login Failed', err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <ParticleBackground particleCount={50} color="139,92,246" connectionDistance={120} speed={0.2} />
      
      {/* Background glow effects */}
      <div style={{ position: 'absolute', top: '20%', right: '10%', width: '400px', height: '400px', background: 'rgba(139,92,246,0.15)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '400px', height: '400px', background: 'rgba(6,182,212,0.1)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
      
      <div className="card" style={{ 
        width: '100%', maxWidth: '420px', margin: '0 24px', position: 'relative', zIndex: 1, 
        padding: '48px 32px', textAlign: 'center',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 2px rgba(139,92,246,0.5)'
      }}>
        <div style={{ 
          width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(139,92,246,0.1)', 
          border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', margin: '0 auto 24px', color: 'var(--violet-light)'
        }}>
          🛡️
        </div>
        
        <h1 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: '800' }}>Admin <span className="gradient-text">Portal</span></h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>Sign in to manage ByteBrainiacs data.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@bytebrainiacs.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ marginTop: '12px', padding: '14px', fontSize: '16px' }}
          >
            {loading ? 'Authenticating...' : 'Secure Login →'}
          </button>
        </form>
        
        <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-muted)' }}>
          🔒 Restricted Access. Authorized personnel only.
        </div>
      </div>
    </div>
  );
}
