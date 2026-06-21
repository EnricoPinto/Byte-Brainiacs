import { useSearchParams, Link } from 'react-router-dom';
import './Payment.css';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const participantId = searchParams.get('participant_id');

  return (
    <div className="page-content container payment-page">
      <div className="glass payment-card cancel-card animate-fade-up">
        <div className="status-icon cancel-icon">!</div>
        <h2 className="payment-title gradient-text-cool">Payment Cancelled</h2>
        <p className="payment-description">
          It looks like you cancelled the payment process. Your registration details are saved, but your spot is not confirmed until the payment goes through.
        </p>

        <div className="payment-instructions bg-secondary">
          <h4>How to complete your registration:</h4>
          <ul>
            <li>Click the button below to head back to the registration page.</li>
            <li>Fill out the form again to trigger a new secure payment checkout.</li>
            <li>If you faced a card decline, please try using another card or contact your bank.</li>
          </ul>
        </div>

        <div className="payment-actions">
          <Link to={`/register`} className="btn btn-primary">Try Registering Again</Link>
          <Link to="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
