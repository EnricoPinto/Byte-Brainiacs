import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ParticleBackground from '../components/ParticleBackground';
import './Payment.css';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const participantId = searchParams.get('participant_id');
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (participantId) {
      axios.get(`/api/participants/${participantId}`)
        .then(res => setParticipant(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [participantId]);

  if (loading) {
    return <div className="payment-status-page"><div className="spinner"></div></div>;
  }

  return (
    <div className="payment-status-page">
      <ParticleBackground particleCount={40} color="16,185,129" connectionDistance={100} speed={0.15} />
      
      <div className="payment-status-card payment-success-card">
        <div className="status-icon-wrapper icon-success">
          ✓
        </div>
        
        <h1 className="status-title title-success">Payment Successful!</h1>
        <p className="status-desc">
          Your registration for ByteBrainiacs is confirmed. We've sent the details to your email address.
        </p>
        
        {participant && (
          <div className="receipt-box">
            <div className="receipt-row">
              <span className="receipt-label">Participant ID</span>
              <span className="receipt-value">{participant.participantId}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Name</span>
              <span className="receipt-value">{participant.fullName}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Type</span>
              <span className="receipt-value" style={{ textTransform: 'capitalize' }}>
                {participant.registrationType}
                {participant.registrationType === 'team' && ` (${participant.teamMembers?.length + 1} members)`}
              </span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Payment Status</span>
              <span className="receipt-value" style={{ color: 'var(--emerald-light)' }}>Verified</span>
            </div>
          </div>
        )}
        
        <div className="status-actions">
          <Link to="/" className="btn btn-primary" style={{ width: '100%' }}>Return to Home</Link>
        </div>
      </div>
    </div>
  );
}
