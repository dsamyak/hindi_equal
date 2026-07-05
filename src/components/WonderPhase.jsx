import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { wonderNarration, wonderDiscoverNarration } from '../utils/narration';

const WONDER_QUESTIONS = [
  {
    question: "मीरा के पास 12 स्ट्रॉबेरी और 3 थालियाँ हैं। क्या वह हर थाली में एक जैसी स्ट्रॉबेरी रख सकती है?",
    subtext: "जब हर समूह को एक जैसी चीज़ मिले, तो उसे समान समूह कहते हैं!",
    emoji: "🍓",
    bgEmojis: ["🍓", "🍽️", "✨", "🔢"],
  },
  {
    question: "4 मेज़ें हैं। हर मेज़ पर 3 कटोरे हैं। कुल कितने कटोरे हैं?",
    subtext: "समान समूह हमें बहुत सारी चीज़ें जल्दी गिनने में मदद करते हैं!",
    emoji: "🍜",
    bgEmojis: ["🍜", "🪑", "🔢", "💡"],
  },
  {
    question: "अगर हर थैले में 5 oranges हैं और 3 थैले हैं, तो कुल कितने oranges हैं?",
    subtext: "हर थैले में एक जैसी संख्या रखना — यही समान समूह है!",
    emoji: "🍊",
    bgEmojis: ["🍊", "🛍️", "🧮", "✨"],
  },
  {
    question: "क्या आप 10 स्टिकर 5 दोस्तों में बराबर बाँट सकते हैं?",
    subtext: "बराबर बाँटना मतलब समान समूह बनाना — सबको एक जैसा मिले!",
    emoji: "⭐",
    bgEmojis: ["⭐", "🤝", "🎯", "🔢"],
  },
  {
    question: "4 के 3 समूह — क्या यह 4 + 4 + 4 के बराबर है?",
    subtext: "समान समूह और बार-बार जोड़ना — दोनों एक ही बात है!",
    emoji: "🧮",
    bgEmojis: ["🧮", "➕", "🎲", "🌟"],
  },
];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [wonder] = useState(() => WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)]);
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState([]);
  const narrationRef = useRef(null);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: wonder.bgEmojis[i % wonder.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.5,
    }));
    setParticles(p);
  }, [wonder]);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (stage === 1 && audioEnabled) {
      narrationRef.current = narrate(
        wonderNarration(wonder.question, wonder.subtext),
        true
      );
    }
    return () => {
      narrationRef.current?.cancel();
    };
  }, [stage, wonder.question, wonder.subtext, audioEnabled]);

  const handleDiscover = useCallback(() => {
    narrationRef.current?.cancel();
    stopNarration();
    if (audioEnabled) {
      const n = narrate(wonderDiscoverNarration(), true);
      n.promise.then(() => onComplete());
      setTimeout(() => onComplete(), 3000);
    } else {
      setTimeout(() => onComplete(), 600);
    }
  }, [onComplete, audioEnabled]);

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {particles.map(p => (
          <span key={p.id} className="wonder-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}>{p.emoji}</span>
        ))}
      </div>
      <div className="wonder-content">
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">?</span>
          <div className="wonder-qmark-glow" />
        </div>
        <div className={`wonder-mascot ${stage >= 1 ? 'visible' : ''}`}>
          <div className="mascot thinking">🤖</div>
          <div className="speech-bubble wonder-bubble">हम्म... मैं सोच रहा हूँ... 🤔</div>
        </div>
        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
          <div className="wonder-emoji">{wonder.emoji}</div>
          <h2 className="wonder-question-text">{wonder.question}</h2>
          <p className="wonder-subtext">{wonder.subtext}</p>
        </div>
        <button className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`} onClick={handleDiscover} id="discover-btn">
          <span className="wonder-btn-sparkle">✨</span>
          चलो खोजते हैं!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}
