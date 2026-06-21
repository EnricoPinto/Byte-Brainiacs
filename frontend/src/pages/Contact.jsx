import { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const INSTAGRAM_URL = 'https://www.instagram.com/byte_brainiacs?igsh=OG1mbGZhbWNhb3N6';
const LINKEDIN_URL = 'https://www.linkedin.com/in/department-of-information-technology-svkm-s-narsee-monjee-college-125555376?utm_source=share_via&utm_content=profile&utm_medium=member_android';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/contact', formData);
      toast.success('Message Sent!', res.data.message);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Failed to send', err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg-secondary)', padding: '60px 0 40px', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="section-tag">// reach out</p>
          <h1 className="section-title">Contact <span className="gradient-text">Us</span></h1>
        </div>
      </div>
      <div className="container section-sm">
        <div className="grid-2" style={{ maxWidth: '900px', margin: '0 auto', gap: '32px' }}>
          <div>
            <h2 style={{ fontSize: '24px', marginBottom: '24px', color: 'var(--cyan)' }}>Get in Touch</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { icon: '👤', label: 'Event Lead', name: 'Veeya Shah', detail: '+91 8591235425', sub: 'veeya.shah027@nmcce.edu.in' },
                { icon: '💼', label: 'Sponsorship Lead', name: 'Dia Chauhan', detail: '+91 8779806646', sub: 'dia.chauhan003@nmcce.edu.in' },
              ].map(c => (
                <div key={c.label} className="card" style={{ padding: '24px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{c.icon} {c.label}</p>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{c.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>📞 {c.detail}</p>
                  <p style={{ color: 'var(--cyan)', fontSize: '14px', marginTop: '4px' }}>
                    <a href={`mailto:${c.sub}`} style={{ color: 'inherit' }}>✉️ {c.sub}</a>
                  </p>
                </div>
              ))}
            </div>

            <div className="card" style={{ marginTop: '20px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>📍 Venue</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7' }}>
                Narsee Monjee College of Commerce and Economics<br />
                (Empowered Autonomous), SVKM<br />
                Vile Parle West, Mumbai - 400056
              </p>
            </div>

            <div className="card" style={{ marginTop: '20px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>🌐 Social Media</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
                  📸 Instagram
                </a>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
                  💼 LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="card" style={{ height: 'fit-content' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '24px', color: 'var(--cyan)' }}>Send a Message</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input required type="text" className="form-input" placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Your Email</label>
                <input required type="email" className="form-input" placeholder="Your Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input type="text" className="form-input" placeholder="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea required className="form-input" rows={5} placeholder="Your message..." style={{ resize: 'vertical' }} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
              </div>
              <button disabled={loading} type="submit" className="btn btn-primary">{loading ? 'Sending...' : 'Send Message →'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
