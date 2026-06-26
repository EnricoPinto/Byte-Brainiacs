import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <AnimatedSection>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '4rem 2rem',
          maxWidth: '500px',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 50px rgba(139, 92, 246, 0.1)',
        }}>
          {/* Glow effects */}
          <div style={{
            position: 'absolute',
            top: '-50%', left: '-50%', width: '200%', height: '200%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 50%)',
            animation: 'spin 10s linear infinite',
            pointerEvents: 'none'
          }} />

          <h1 style={{
            fontSize: '8rem',
            fontWeight: 900,
            lineHeight: 1,
            margin: '0 0 1rem 0',
            background: 'var(--grad-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            position: 'relative',
            zIndex: 1
          }}>404</h1>
          
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 1
          }}>Lost in the Void</h2>
          
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            fontSize: '1rem',
            lineHeight: 1.6,
            position: 'relative',
            zIndex: 1
          }}>
            The page you're looking for has drifted into an alternate dimension. Let's get you back on track.
          </p>

          <Link to="/" className="btn btn-primary" style={{ position: 'relative', zIndex: 1, padding: '12px 32px' }}>
            Return to Home
          </Link>
        </div>
      </AnimatedSection>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
