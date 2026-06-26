import { Link, useSearchParams } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import './Payment.css';

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const participantId = searchParams.get('participant_id');

  return (
    <div className="payment-status-page">
      <ParticleBackground particleCount={40} color="249,115,22" connectionDistance={100} speed={0.15} />
      
      <div className="payment-status-card payment-cancel-card">
        <div className="status-icon-wrapper icon-cancel">
          !
        </div>
        
        <h1 className="status-title title-cancel">Payment Cancelled</h1>
        <p className="status-desc">
          Your payment was not completed. If money was deducted, it will be refunded within 3-5 business days.
        </p>
        
        <div className="receipt-box" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Your registration is currently <strong style={{ color: 'var(--orange-light)' }}>pending</strong>. 
            You can try paying again to confirm your spot.
          </p>
        </div>
        
        <div className="status-actions">
          <Link to="/" className="btn btn-ghost">Return to Home</Link>
          <Link to="/register" className="btn btn-warn">Try Again</Link>
        </div>
        
        {participantId && (
          <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Reference ID: {participantId}
          </p>
        )}
      </div>
    </div>
  );
}
