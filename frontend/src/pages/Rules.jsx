export default function Rules() {
  const sections = [
    {
      title: '📋 Eligibility',
      rules: [
        'Open to undergraduate students from B.Sc. IT, B.Sc. CS, B.Sc. Data Science, and BCA programs.',
        'Students from any college in Mumbai are eligible to participate.',
        'Participants must carry a valid college ID card on event day.',
        'Maximum of 100 teams/participants will be selected.',
      ],
    },
    {
      title: '👥 Team Rules',
      rules: [
        'Each team must have exactly 3 members.',
        'Teams can be self-formed (Team Registration) or admin-allocated (Individual Registration).',
        'A participant cannot be part of more than one team.',
        'Team name must be unique and appropriate.',
      ],
    },
    {
      title: '💻 Hackathon Rules',
      rules: [
        'The hackathon is 6 hours long. All work must be done within the time limit.',
        'All code must be written during the event. Pre-written code is not allowed.',
        'Teams may use any programming language or ML framework.',
        'Open-source libraries and APIs are permitted.',
        'Internet access is allowed for research and package installation only.',
        'Plagiarism or use of others\' work will result in immediate disqualification.',
      ],
    },
    {
      title: '⚖️ Judging Criteria',
      rules: [
        'Innovation & Creativity (25%) — Novelty of the problem-solving approach.',
        'Technical Implementation (30%) — Quality of code, ML model performance.',
        'Practical Applicability (20%) — Real-world impact and usability.',
        'Presentation & Demo (25%) — Clarity of explanation and UI/UX.',
      ],
    },
    {
      title: '🚫 Code of Conduct',
      rules: [
        'Respect all participants, mentors, judges, and organizers.',
        'Harassment of any kind will not be tolerated.',
        'Do not tamper with others\' work or equipment.',
        'Decisions of the judging panel are final and binding.',
        'Organizers reserve the right to disqualify any team for misconduct.',
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg-secondary)', padding: '60px 0 40px', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="section-tag">// read carefully</p>
          <h1 className="section-title">Rules & <span className="gradient-text">Guidelines</span></h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            All participants must read and agree to these rules before registering.
          </p>
        </div>
      </div>
      <div className="container section-sm" style={{ maxWidth: '860px' }}>
        {sections.map((s, i) => (
          <div key={i} className="card" style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: 'var(--violet-light)' }}>{s.title}</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {s.rules.map((r, j) => (
                <li key={j} style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
                  <span style={{ color: 'var(--cyan)', flexShrink: 0 }}>→</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
