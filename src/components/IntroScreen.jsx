import { useEffect, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { introNarration } from '../utils/narration';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'सोचो', desc: 'समान समूहों का रहस्य!' },
  { icon: '📖', label: 'कहानी', desc: 'समान समूहों को देखो' },
  { icon: '🧪', label: 'अनुकरण', desc: 'समान समूह बनाओ' },
  { icon: '🎮', label: 'खेलो', desc: 'मज़ेदार चुनौतियाँ' },
  { icon: '📓', label: 'विचार', desc: 'आपने क्या सीखा?' },
];

export default function IntroScreen({ onStart, audioEnabled, onToggleAudio }) {
  const narrationRef = useRef(null);

  useEffect(() => {
    if (audioEnabled) {
      const timer = setTimeout(() => {
        narrationRef.current = narrate(introNarration(), true);
      }, 200);
      return () => {
        clearTimeout(timer);
        narrationRef.current?.cancel();
        stopNarration();
      };
    }
  }, [audioEnabled]);

  const handleStart = () => {
    narrationRef.current?.cancel();
    stopNarration();
    onStart();
  };

  return (
    <div className="intro-screen">
      {/* Curriculum badge */}
      <div className="intro-badge">
        ✨ · कक्षा 1 · गणित
      </div>

      {/* Title */}
      <h1 className="intro-title">
        <span style={{ color: 'var(--gold)' }}>समान समूह</span>{' '}—{' '}
        <span style={{ color: 'var(--coral)' }}>गुणा और भाग</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 4, fontFamily: 'var(--font-display)' }}>
        पाठ 4.1 · समान समूहों का परिचय
      </p>

      {/* Mascot */}
      <div className="mascot-container">
        <div className="mascot">🤖</div>
        <div className="speech-bubble">
          चलो समान समूहों को खोजते हैं! 🍓
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        <strong style={{ color: 'var(--gold)' }}>समान समूह</strong> हर जगह देखना सीखो, उन्हें गिनो, बराबर बाँटो, और गुणा तथा भाग के रहस्य खोजो!
      </p>

      {/* Journey map */}
      <div className="intro-journey-map">
        <h3 className="intro-journey-title">आपकी सीखने की यात्रा</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className="btn btn-primary btn-lg intro-start-btn" onClick={handleStart} id="start-journey-btn">
        🚀 यात्रा शुरू करो!
      </button>

      {/* Feature cards */}
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">🎯</div>
          <div className="feature-card-label">100 चुनौतियाँ</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">🍓</div>
          <div className="feature-card-label">समान समूह</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">✨</div>
          <div className="feature-card-label">बैज और XP</div>
        </div>
      </div>
    </div>
  );
}
