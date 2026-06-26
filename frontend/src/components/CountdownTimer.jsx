import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EVENT_DATE = new Date('2025-08-15T08:00:00');

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const prevRef = useRef(timeLeft);

  function getTimeLeft() {
    const diff = EVENT_DATE - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }

  useEffect(() => {
    const t = setInterval(() => {
      prevRef.current = timeLeft;
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="countdown-wrapper">
      {units.map(({ label, value }, index) => (
        <div key={label} className="countdown-unit">
          <div className="countdown-card">
            <div className="countdown-glow" />
            <AnimatePresence mode="popLayout">
              <motion.div
                key={value}
                className="countdown-value"
                initial={{ y: -20, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {String(value).padStart(2, '0')}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="countdown-label">{label}</div>
          {index < units.length - 1 && (
            <div className="countdown-separator">
              <span className="countdown-dot" />
              <span className="countdown-dot" />
            </div>
          )}
        </div>
      ))}

      <style>{`
        .countdown-wrapper {
          display: flex;
          gap: 8px;
          justify-content: center;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .countdown-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .countdown-card {
          position: relative;
          background: rgba(139,92,246,0.08);
          border: 1px solid rgba(139,92,246,0.2);
          border-radius: 18px;
          padding: 22px 26px;
          min-width: 90px;
          text-align: center;
          backdrop-filter: blur(12px);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .countdown-card:hover {
          border-color: rgba(139,92,246,0.4);
          box-shadow: 0 0 30px rgba(139,92,246,0.15);
          transform: translateY(-2px);
        }
        .countdown-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%);
          animation: glow-rotate 6s linear infinite;
          pointer-events: none;
        }
        @keyframes glow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .countdown-value {
          font-size: 48px;
          font-weight: 800;
          font-family: var(--font-heading);
          background: var(--grad-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          position: relative;
          z-index: 1;
          text-shadow: none;
        }
        .countdown-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-top: 10px;
          font-weight: 500;
        }
        .countdown-separator {
          position: absolute;
          right: -14px;
          top: 50%;
          transform: translateY(-70%);
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 2;
        }
        .countdown-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--violet);
          animation: pulse-dot 1s ease-in-out infinite;
          box-shadow: 0 0 8px rgba(139,92,246,0.5);
        }
        .countdown-dot:nth-child(2) {
          animation-delay: 0.5s;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @media (max-width: 480px) {
          .countdown-card { padding: 16px 20px; min-width: 70px; }
          .countdown-value { font-size: 36px; }
          .countdown-separator { right: -10px; }
        }
      `}</style>
    </div>
  );
}
