import { Link } from 'react-router-dom';
import { INSTAGRAM_URL, LINKEDIN_URL, InstagramIcon, LinkedInIcon } from './Navbar';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>
              <span style={{ marginRight: '8px' }}>⚡</span>
              <span className="gradient-text">ByteBrainiacs</span>
            </h3>
            <p>
              The ML Showdown — A flagship AI/ML hackathon organized by the Department of Information Technology,
              Narsee Monjee College of Commerce and Economics (SVKM), Vile Parle West, Mumbai.
            </p>
            <div className="footer-social" style={{ marginTop: '16px' }}>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Follow us on Instagram">
                <InstagramIcon />
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="Connect on LinkedIn">
                <LinkedInIcon />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/register">Register</Link>
            <Link to="/previous-participants">Participants</Link>
            <Link to="/rules">Rules & Guidelines</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="footer-links">
            <h4>Contact</h4>
            <a href="mailto:veeya.shah027@nmcce.edu.in">veeya.shah027@nmcce.edu.in</a>
            <a href="tel:+918591235425">+91 8591235425</a>
            <a href="mailto:dia.chauhan003@nmcce.edu.in">dia.chauhan003@nmcce.edu.in</a>
            <a href="tel:+918779806646">+91 8779806646</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ByteBrainiacs — The ML Showdown. All rights reserved.</p>
          <p style={{ marginTop: '4px' }}>SVKM's Narsee Monjee College of Commerce and Economics, Vile Parle West, Mumbai — 400056</p>
        </div>
      </div>
    </footer>
  );
}
