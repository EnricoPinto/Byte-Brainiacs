import { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import AnimatedSection from '../components/AnimatedSection';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contact', formData);
      toast.success('Message Sent', 'We will get back to you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Error', 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="container" style={{ padding: '20px 24px 100px' }}>
        <AnimatedSection className="text-center" style={{ marginBottom: '40px' }}>
          <p className="section-tag">// get in touch</p>
          <h1 className="section-title">Contact <span className="gradient-text">Us</span></h1>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Have questions about the hackathon? Need help with registration? Drop us a message.
          </p>
        </AnimatedSection>

        <div className="grid-2" style={{ alignItems: 'start', gap: '48px' }}>
          <AnimatedSection animation="slideLeft">
            <div className="card" style={{ padding: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '32px' }}>Send a Message</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input type="text" className="form-input" required
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" required
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input type="text" className="form-input" required
                    value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-input" rows="5" required style={{ resize: 'vertical' }}
                    value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: '10px' }}>
                  {loading ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="slideRight">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'var(--violet-light)' }}>
                  📍
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Venue</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Narsee Monjee College of Commerce and Economics, Vile Parle (W), Mumbai</p>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'var(--cyan-light)' }}>
                  📧
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Email</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>bytebrainiacs.hackathon@gmail.com</p>
                </div>
              </div>

              <div className="card" style={{ padding: '0', overflow: 'hidden', height: '320px' }}>
                <iframe
                  title="NM College Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.012521789721!2d72.83516311540842!3d19.10709608706981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c676018b43%3A0x75f29a4205098f99!2sNarsee%20Monjee%20College%20of%20Commerce%20and%20Economics!5e0!3m2!1sen!2sin!4v1689000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(80%)' }} // Dark mode map
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
