import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const participantId = searchParams.get('participant_id');
  // BUG 10 FIX: Removed unused sessionId (Stripe leftover)

  const [loading, setLoading] = useState(true);
  const [participant, setParticipant] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!participantId) {
      setError('Missing participant ID.');
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await axios.get(`/api/payments/status/${participantId}`);
        if (res.data.success) {
          setParticipant(res.data.participant);
        } else {
          setError(res.data.message || 'Failed to fetch status.');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Error checking payment status.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [participantId]);

  if (loading) {
    return (
      <div className="page-content loading-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !participant) {
    return (
      <div className="page-content container payment-page">
        <div className="glass payment-card error-card animate-fade-up">
          <div className="status-icon error-icon">❌</div>
          <h2 className="payment-title">Payment Verification Error</h2>
          <p className="payment-description">
            {error || "We couldn't retrieve your registration details."}
          </p>
          <div className="payment-actions">
            <Link to="/" className="btn btn-primary">Go to Home</Link>
            <Link to="/register" className="btn btn-outline">Try Registering Again</Link>
          </div>
        </div>
      </div>
    );
  }

  const isVerified = participant.paymentStatus === 'verified';

  return (
    <div className="page-content container payment-page">
      <div className="glass payment-card success-card animate-fade-up">
        <div className="status-icon success-icon">✓</div>
        
        {isVerified ? (
          <>
            <h2 className="payment-title gradient-text">Payment Successful!</h2>
            <p className="payment-description">
              Thank you, <strong>{participant.fullName}</strong>. Your payment of <strong>₹{participant.amount}</strong> is confirmed.
            </p>
          </>
        ) : (
          <>
            <h2 className="payment-title warning-text">Payment Processing</h2>
            <p className="payment-description">
              Your payment is currently processing. It should update shortly.
            </p>
          </>
        )}

        <div className="receipt-details">
          <div className="receipt-header">Registration Receipt</div>
          <div className="receipt-row">
            <span className="receipt-label">Participant ID</span>
            <span className="receipt-value mono">{participant._id}</span>
          </div>
          <div className="receipt-row">
            <span className="receipt-label">Registration Type</span>
            <span className="receipt-value capitalize">{participant.registrationType}</span>
          </div>
          {participant.registrationType === 'team' && (
            <div className="receipt-row">
              <span className="receipt-label">Team Name</span>
              <span className="receipt-value font-bold">{participant.teamName}</span>
            </div>
          )}
          <div className="receipt-row">
            <span className="receipt-label">Email Address</span>
            <span className="receipt-value">{participant.email}</span>
          </div>
          <div className="divider"></div>
          <div className="receipt-row total-row">
            <span className="receipt-label">Amount Paid</span>
            <span className="receipt-value payment-amount">₹{participant.amount}</span>
          </div>
        </div>

        <div className="payment-note">
          A confirmation email has been sent to <strong>{participant.email}</strong> with details of your registration.
        </div>

        <div className="payment-actions">
          <Link to="/" className="btn btn-primary">Go to Homepage</Link>
          <Link to="/rules" className="btn btn-outline">Read Hackathon Rules</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
