import { useState, useCallback, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../utils/audio';
import {
  reflectIntroNarration, reflectCorrectNarration, reflectWrongNarration,
  reflectConfidenceNarration, reflectCertificateNarration,
} from '../utils/narration';

const REFLECT_QUESTIONS = [
  { q: "3 थालियाँ हैं। हर थाली पर 4 बिस्किट हैं। कुल कितने बिस्किट हैं?", options: [
    { text: "12 — 4 को तीन बार जोड़ो", correct: true, emoji: "🍪" },
    { text: "7 — 3 और 4 जोड़ो", correct: false, emoji: "➕" },
    { text: "हम नहीं बता सकते", correct: false, emoji: "❓" },
  ]},
  { q: "समूहों को 'समान' क्या बनाता है?", options: [
    { text: "हर समूह में एक जैसी संख्या हो", correct: true, emoji: "✅" },
    { text: "सभी समूह बड़े हों", correct: false, emoji: "❌" },
    { text: "समूह एक-दूसरे के पास हों", correct: false, emoji: "❓" },
  ]},
  { q: "15 स्टिकर 5 दोस्तों में बराबर बाँटे। हर दोस्त को कितने मिलेंगे?", options: [
    { text: "3 प्रत्येक को", correct: true, emoji: "🧩" },
    { text: "5 प्रत्येक को", correct: false, emoji: "❌" },
    { text: "10 प्रत्येक को", correct: false, emoji: "❓" },
  ]},
];

const CONFIDENCE_LEVELS = [
  { emoji: '😊', label: "मैं समान समूहों में बहुत अच्छा हूँ!", color: '#4caf50' },
  { emoji: '🙂', label: 'मैं अधिकतर समान समूह बना सकता हूँ!', color: '#ff9800' },
  { emoji: '😐', label: "मैं अभी सीख रहा हूँ", color: '#42a5f5' },
];

export default function ReflectPhase({ stats, onRestart, onGoHome, audioEnabled }) {
  const [step, setStep] = useState(0);
  const [teachIdx, setTeachIdx] = useState(0);
  const [teachAnswered, setTeachAnswered] = useState(false);
  const [teachCorrect, setTeachCorrect] = useState(0);
  const [confidence, setConfidence] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const narrationRef = useRef(null);

  const { score = 0, totalAnswered = 0, xp = 0, maxStreak = 0, worldResults = {} } = stats || {};
  const pct = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
  const totalStars = Object.values(worldResults).reduce((a, r) => a + (r.stars || 0), 0);

  useEffect(() => {
    if (step === 0 && audioEnabled) {
      narrationRef.current = narrate(reflectIntroNarration(), true);
    }
    return () => { narrationRef.current?.cancel(); };
  }, [step, audioEnabled]);

  useEffect(() => {
    if (showConfetti) {
      const pieces = Array.from({ length: 40 }, (_, i) => ({
        id: i, x: Math.random() * 100, delay: Math.random() * 2,
        color: ['#ffc107', '#e91e63', '#4caf50', '#2196f3', '#ff5722', '#9c27b0'][i % 6],
        size: 6 + Math.random() * 10, duration: 2 + Math.random() * 3,
      }));
      setConfettiPieces(pieces);
    }
  }, [showConfetti]);

  const handleTeachAnswer = useCallback((option) => {
    if (teachAnswered) return;
    setTeachAnswered(true);
    narrationRef.current?.cancel();
    if (option.correct) {
      setTeachCorrect(c => c + 1);
      sounds.correct();
      if (audioEnabled) narrationRef.current = narrate(reflectCorrectNarration(), true);
    } else {
      sounds.wrong();
      if (audioEnabled) narrationRef.current = narrate(reflectWrongNarration(), true);
    }
    setTimeout(() => {
      setTeachAnswered(false);
      if (teachIdx + 1 < REFLECT_QUESTIONS.length) {
        setTeachIdx(i => i + 1);
      } else {
        setStep(1);
      }
    }, 1500);
  }, [teachAnswered, teachIdx, audioEnabled]);

  const handleConfidenceSelect = useCallback((idx) => {
    setConfidence(idx);
    sounds.badge();
    setShowConfetti(true);
    narrationRef.current?.cancel();
    if (audioEnabled) narrationRef.current = narrate(reflectCertificateNarration(pct), true);
    setTimeout(() => setStep(2), 1000);
  }, [audioEnabled, pct]);

  useEffect(() => {
    if (step === 1 && audioEnabled) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(reflectConfidenceNarration(), true);
    }
  }, [step, audioEnabled]);

  useEffect(() => {
    return () => { narrationRef.current?.cancel(); stopNarration(); };
  }, []);

  // Step 0: Teach the Mascot
  if (step === 0) {
    const rq = REFLECT_QUESTIONS[teachIdx];
    return (
      <div className="reflect-phase">
        <div className="reflect-header">
          <h3 className="reflect-label">📓 विचार करो</h3>
          <p className="reflect-sublabel">रोबोट को वह सिखाओ जो तुमने सीखा!</p>
        </div>
        <div className="reflect-card">
          <div className="reflect-mascot-row">
            <div className="mascot thinking" style={{ width: 70, height: 70, fontSize: '2rem' }}>🤖</div>
            <div className="speech-bubble" style={{ maxWidth: 280 }}>क्या तुम मेरी मदद कर सकते हो? {rq.q}</div>
          </div>
          <div className="reflect-options">
            {rq.options.map((opt, i) => (
              <button key={i}
                className={`reflect-option ${teachAnswered ? (opt.correct ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleTeachAnswer(opt)} disabled={teachAnswered}>
                <span className="reflect-option-emoji">{opt.emoji}</span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
          <div className="reflect-progress">
            {REFLECT_QUESTIONS.map((_, i) => (
              <div key={i} className={`reflect-dot ${i === teachIdx ? 'active' : i < teachIdx ? 'done' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Confidence
  if (step === 1) {
    return (
      <div className="reflect-phase">
        <div className="reflect-card">
          <h3 className="reflect-card-title">समान समूहों के बारे में आप कैसा महसूस करते हैं?</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>ईमानदार रहो — हर जवाब अच्छा है!</p>
          <div className="confidence-grid">
            {CONFIDENCE_LEVELS.map((c, i) => (
              <button key={i} className={`confidence-btn ${confidence === i ? 'selected' : ''}`}
                onClick={() => handleConfidenceSelect(i)} style={{ '--conf-color': c.color }}>
                <span className="confidence-emoji">{c.emoji}</span>
                <span className="confidence-label">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Certificate
  return (
    <div className="reflect-phase">
      {showConfetti && (
        <div className="confetti-container">
          {confettiPieces.map(p => (
            <div key={p.id} className="confetti-piece" style={{
              left: `${p.x}%`, animationDelay: `${p.delay}s`,
              backgroundColor: p.color, width: p.size, height: p.size,
              animationDuration: `${p.duration}s`,
            }} />
          ))}
        </div>
      )}
      <div className="certificate-card">
        <div className="cert-badge">🏆</div>
        <h2 className="cert-title">यात्रा पूरी हुई!</h2>
        <p className="cert-subtitle">आपने सभी 5 चरण पूरे किए!</p>
        <div className="score-circle">
          <span className="score-number">{pct}%</span>
          <span className="score-label">{score}/{totalAnswered}</span>
        </div>
        <div style={{ fontSize: '2rem', display: 'flex', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
          {[1, 2, 3].map(i => (
            <span key={i} style={{ opacity: i <= Math.ceil(totalStars / 3) ? 1 : 0.2 }}>⭐</span>
          ))}
        </div>
        <div className="cert-stats">
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--gold)' }}>{xp}</div>
            <div className="cert-stat-label">XP मिले</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--coral)' }}>🔥 {maxStreak}</div>
            <div className="cert-stat-label">सबसे लंबी श्रृंखला</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--green-light)' }}>{teachCorrect}/{REFLECT_QUESTIONS.length}</div>
            <div className="cert-stat-label">सिखाया</div>
          </div>
        </div>
        <div className="mascot-container" style={{ marginTop: 16 }}>
          <div className="mascot happy" style={{ width: 80, height: 80, fontSize: '2rem' }}>🤖</div>
          <div className="speech-bubble">
            {pct >= 80 ? 'अद्भुत! आप समान समूह के उस्ताद हैं! 🏆' : pct >= 50 ? 'शानदार प्रयास! अभ्यास जारी रखो! 💪' : 'अच्छी शुरुआत! सुधार के लिए फिर कोशिश करो! 📚'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 }}>
          <button className="btn btn-primary btn-lg" onClick={() => { narrationRef.current?.cancel(); stopNarration(); onRestart(); }}>🔄 फिर से खेलो</button>
          <button className="btn btn-secondary" onClick={() => { narrationRef.current?.cancel(); stopNarration(); onGoHome(); }}>🏠 होम</button>
        </div>
      </div>
    </div>
  );
}
