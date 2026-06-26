import AnimatedSection, { StaggerContainer, StaggerItem } from '../components/AnimatedSection';

export default function Rules() {
  const categories = [
    {
      title: "Team Formation & Eligibility",
      icon: "👥",
      color: "var(--violet-light)",
      rules: [
        "Each team must consist of exactly 3 members.",
        "Participants must be undergraduate students from B.Sc. IT, CS, Data Science, or BCA programs.",
        "Cross-college teams are not permitted.",
        "Individual registrants will be grouped into teams of 3 by the organizing committee.",
        "Valid college ID cards are mandatory for venue entry and prize claim."
      ]
    },
    {
      title: "Development & Submission",
      icon: "💻",
      color: "var(--cyan-light)",
      rules: [
        "All code must be written during the hackathon. Use of pre-existing personal codebases will lead to disqualification.",
        "Use of open-source libraries, APIs, and frameworks is permitted and encouraged.",
        "The project must have a clear AI/ML component at its core.",
        "Final submissions must include a working prototype and source code repository link.",
        "The code must be pushed to a public GitHub repository before the submission deadline."
      ]
    },
    {
      title: "Code of Conduct",
      icon: "⚖️",
      color: "var(--emerald-light)",
      rules: [
        "Plagiarism of any form is strictly prohibited.",
        "Participants must maintain professional decorum throughout the event.",
        "Any damage to college property will result in immediate disqualification and penalties.",
        "The decision of the judging panel will be final and binding.",
        "The organizing committee reserves the right to modify rules if necessary."
      ]
    }
  ];

  return (
    <div className="page-content">
      <div className="container" style={{ padding: '20px 24px 100px', maxWidth: '900px' }}>
        <AnimatedSection className="text-center" style={{ marginBottom: '40px' }}>
          <p className="section-tag">// terms & conditions</p>
          <h1 className="section-title">Rules & <span className="gradient-text">Guidelines</span></h1>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Please read these guidelines carefully. Adherence to these rules is mandatory for all participants to ensure a fair and competitive environment.
          </p>
        </AnimatedSection>

        <StaggerContainer style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {categories.map((cat, idx) => (
            <StaggerItem key={idx}>
              <div className="card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  fontSize: '120px',
                  opacity: 0.05,
                  pointerEvents: 'none'
                }}>
                  {cat.icon}
                </div>
                
                <h2 style={{ fontSize: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: cat.color }}>
                  <span style={{ 
                    width: '40px', height: '40px', borderRadius: '10px', 
                    background: `color-mix(in srgb, ${cat.color} 15%, transparent)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' 
                  }}>
                    {cat.icon}
                  </span>
                  {cat.title}
                </h2>
                
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {cat.rules.map((rule, ruleIdx) => (
                    <li key={ruleIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{ 
                        color: cat.color, marginTop: '2px', flexShrink: 0,
                        background: `color-mix(in srgb, ${cat.color} 10%, transparent)`,
                        width: '24px', height: '24px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'
                      }}>✓</span>
                      <span style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection style={{ marginTop: '60px', textAlign: 'center' }}>
          <div className="card" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
            <p style={{ color: 'var(--rose-light)' }}>
              <strong>Note:</strong> Failure to comply with these rules may result in immediate disqualification. The organizing committee's decision is final.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
