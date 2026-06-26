import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from '../components/CountdownTimer';
import ParticleBackground from '../components/ParticleBackground';
import AnimatedSection, { StaggerContainer, StaggerItem } from '../components/AnimatedSection';
import './Home.css';

const faqs = [
  { q: 'Who can participate?', a: 'Undergraduate students from B.Sc. IT, B.Sc. CS, B.Sc. Data Science, and BCA programs from colleges across Mumbai.' },
  { q: 'What is the team size?', a: 'Each team must have exactly 3 members. You can register individually and the admin will allocate you a team.' },
  { q: 'Is there a registration fee?', a: 'Yes, there is a nominal registration fee of ₹25 per participant. For a team of 3 members, the total fee is ₹75. Payment can be made online via UPI/Razorpay after registration.' },
  { q: 'What should we bring?', a: 'Bring your laptop, charger, valid college ID, and your enthusiasm! All tools and resources will be available.' },
  { q: 'What technologies can we use?', a: 'Any programming language or ML framework is allowed — Python (TensorFlow, PyTorch, sklearn), R, Julia, etc.' },
  { q: 'Will there be mentors?', a: 'Yes! Faculty mentors and industry experts will be available throughout the hackathon to guide you.' },
];

const schedule = [
  { date: 'July 15, 2025', event: 'Registration Opens', icon: '📋', color: 'var(--cyan)' },
  { date: 'August 10, 2025', event: 'Registration Closes', icon: '🔒', color: 'var(--orange)' },
  { date: 'August 15, 2025', event: 'Hackathon Day', icon: '⚡', color: 'var(--gold)' },
  { date: 'August 15, 2025', event: 'Results Announced', icon: '🏆', color: 'var(--green)' },
];

const prizes = [
  { rank: '🥇 Winner', amount: '₹5,000 Cash', desc: 'Cash prize + Trophy + Certificate + Goodies', color: 'var(--gold)', glow: 'rgba(245,158,11,0.25)' },
  { rank: '🥈 Runner-Up', amount: 'Goodies & Merch', desc: 'Premium merchandise pack + Certificate + Trophy', color: 'var(--violet)', glow: 'rgba(139,92,246,0.2)' },
  { rank: '🥉 All Participants', amount: 'E-Certificate', desc: 'Participation certificate for all teams', color: 'var(--emerald)', glow: 'rgba(16,185,129,0.15)' },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="home">
      {/* ─── Hero ─── */}
      <section className="hero">
        <div className="hero-bg">
          <ParticleBackground particleCount={70} color="139,92,246" connectionDistance={130} speed={0.25} />
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="hero-badge badge badge-violet">
              <span>🎓</span> NMCCE — IT Department Presents
            </div>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <span style={{ color: 'var(--violet-light)', fontWeight: '900', textShadow: '0 0 20px rgba(167, 139, 250, 0.4)' }}>ByteBrainiacs</span>
            <br />
            <span className="hero-subtitle">The ML Showdown</span>
          </motion.h1>

          <motion.p
            className="hero-desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            A high-energy 6-hour AI/ML hackathon where Mumbai's brightest minds code, innovate,
            and compete to build real-world machine learning solutions from scratch.
          </motion.p>

          <motion.p
            className="hero-org"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Organized by the <strong>Department of Information Technology</strong>,<br />
            Narsee Monjee College of Commerce and Economics, Vile Parle West, Mumbai.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Link to="/register" className="btn btn-primary btn-lg">Register Now →</Link>
            <a href="#about" className="btn btn-outline btn-lg">Learn More</a>
          </motion.div>

          <motion.div
            style={{ marginTop: '48px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Event Countdown
            </p>
            <CountdownTimer />
          </motion.div>
        </div>
      </section>

      {/* ─── About ─── */}
      <section id="about" className="section">
        <div className="container">
          <AnimatedSection className="text-center" style={{ marginBottom: '60px' }}>
            <p className="section-tag">// about the event</p>
            <h2 className="section-title">What is <span className="gradient-text">ByteBrainiacs</span>?</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              A flagship AI/ML challenge initiative conceptualized by NMCCE's IT faculty and powered by a dynamic student team.
            </p>
          </AnimatedSection>
          <div className="grid-2" style={{ alignItems: 'center', gap: '48px' }}>
            <AnimatedSection animation="slideLeft">
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px', marginBottom: '24px' }}>
                ByteBrainiacs is an intensive <strong style={{ color: 'var(--violet-light)' }}>6-hour hackathon</strong> that challenges
                students to code smartly, think creatively, and apply real-world AI/ML methodologies to architect functional solutions from scratch.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px' }}>
                The sprint is engineered to test technical acumen, collaborative teamwork, and problem-solving under a high-fidelity,
                fast-paced corporate tech simulation. Exclusively for Mumbai's top undergraduate talent.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '28px' }}>
                {['100 Participants', '6 Hours', 'AI/ML Focus', 'Mumbai-wide', 'Team of 3'].map(tag => (
                  <span key={tag} className="badge badge-violet">{tag}</span>
                ))}
              </div>
            </AnimatedSection>
            <StaggerContainer className="grid-2" style={{ gap: '16px' }}>
              {[
                { icon: '🧠', title: 'Real ML Problems', desc: 'Work on actual datasets and real-world challenges' },
                { icon: '🤝', title: 'Team Collaboration', desc: 'Build solutions with your 3-person dream team' },
                { icon: '🏆', title: 'Win Prizes', desc: '₹5,000 cash prize + goodies for top teams' },
                { icon: '🌐', title: 'Industry Exposure', desc: 'Connect with sponsors, mentors, and tech companies' },
              ].map(b => (
                <StaggerItem key={b.title}>
                  <div className="card feature-card" style={{ padding: '24px' }}>
                    <div className="feature-icon">{b.icon}</div>
                    <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{b.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{b.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ─── Prizes ─── */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <AnimatedSection className="text-center" style={{ marginBottom: '60px' }}>
            <p className="section-tag">// prizes & rewards</p>
            <h2 className="section-title">Win <span className="gradient-text-gold">Amazing Prizes</span></h2>
          </AnimatedSection>
          <StaggerContainer className="grid-3">
            {prizes.map(p => (
              <StaggerItem key={p.rank}>
                <div className="prize-card" style={{ '--glow': p.glow, '--color': p.color }}>
                  <div className="prize-rank">{p.rank}</div>
                  <div className="prize-amount">{p.amount}</div>
                  <p className="prize-desc">{p.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Schedule ─── */}
      <section id="schedule" className="section">
        <div className="container">
          <AnimatedSection className="text-center" style={{ marginBottom: '60px' }}>
            <p className="section-tag">// important dates</p>
            <h2 className="section-title">Event <span className="gradient-text">Schedule</span></h2>
          </AnimatedSection>
          <div className="timeline">
            {schedule.map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.12} className="timeline-item">
                <div className="timeline-dot" style={{ background: s.color, boxShadow: `0 0 20px ${s.color}` }}>{s.icon}</div>
                <div className="timeline-content card">
                  <div className="timeline-date">{s.date}</div>
                  <div className="timeline-event">{s.event}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection>
            <div className="card" style={{ marginTop: '48px' }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--violet-light)' }}>⏱️ Hackathon Day Timeline</h3>
              <div className="day-schedule">
                {[
                  ['07:00 AM', 'Arrival & Registration'],
                  ['08:00 AM', 'Official Commencement'],
                  ['09:00 AM', 'Technical Briefing'],
                  ['10:00 AM', 'Coding Phase 1'],
                  ['12:15 PM', 'Coding Phase 2'],
                  ['01:45 PM', 'Coding Phase 3'],
                  ['04:00 PM', 'Expert Judgement'],
                  ['05:00 PM', 'Valedictory & Awards'],
                ].map(([time, event]) => (
                  <div key={time} className="day-schedule-item">
                    <span className="day-time">{time}</span>
                    <span className="day-event">{event}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection className="text-center" style={{ marginBottom: '60px' }}>
            <p className="section-tag">// frequently asked</p>
            <h2 className="section-title">Got <span className="gradient-text">Questions</span>?</h2>
          </AnimatedSection>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <AnimatedSection key={i} delay={i * 0.06}>
                <div className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                  <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{f.q}</span>
                    <motion.span
                      className="faq-chevron"
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        className="faq-a"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <div style={{ padding: '0 24px 20px' }}>{f.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <AnimatedSection animation="scaleIn">
            <div className="cta-card">
              <div className="cta-glow" />
              <p className="section-tag">// join the showdown</p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: '16px' }}>
                Ready to Build the <span className="gradient-text">Future of AI</span>?
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '36px', fontSize: '16px' }}>
                Registration is open. Don't miss your chance to compete with Mumbai's top tech talent.
              </p>
              <Link to="/register" className="btn btn-primary btn-lg">
                Register Now — ₹25/person →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
