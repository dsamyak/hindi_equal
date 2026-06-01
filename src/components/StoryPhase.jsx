import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration, preloadNarration } from '../utils/audio';
import { getStoryNarration } from '../utils/narration';

const STORY_SLIDES = [
  {
    image: '/images/story_strawberries.png',
    title: "मीरा की स्ट्रॉबेरी",
    text: 'मीरा के पास बारह स्ट्रॉबेरी हैं। वह हर थाली में एक जैसी स्ट्रॉबेरी रखना चाहती है। क्या वह ऐसा कर सकती है? हर थाली में कितनी स्ट्रॉबेरी जाएंगी?',
    highlight: '"क्या हम उन्हें बराबर बाँट सकते हैं?"',
    mascotText: "चलो पता करते हैं समान समूह का मतलब! 🍓",
  },
  {
    image: '/images/story_hawker.png',
    title: "खाने की दुकान पर",
    text: 'रोहन अपने परिवार के साथ खाने की दुकान पर जाता है। वहाँ तीन मेज़ें हैं। हर मेज़ पर नूडल्स के चार कटोरे हैं। हर मेज़ को एक जैसे कटोरे मिलते हैं। इसी को हम समान समूह कहते हैं!',
    highlight: '"हर समूह में एक जैसी संख्या = समान समूह!"',
    mascotText: "समान मतलब एक जैसा! 🍜",
  },
  {
    image: '/images/story_counting.png',
    title: "समूहों में गिनो",
    text: 'चार के तीन समूह। मेरे साथ गिनो: चार, आठ, बारह। कुल मिलाकर बारह! जब हर समूह में एक जैसी चीज़ें हों, तो उन्हें समान समूह कहते हैं।',
    highlight: '"4 + 4 + 4 = 12"',
    mascotText: "यही बार-बार जोड़ना है! ➕",
  },
  {
    image: '/images/story_sharing.png',
    title: "बराबर बाँटना",
    text: 'अब रोहन का परिवार दस सेब पाँच थैलियों में बराबर बाँटता है। हर थैली में दो सेब जाते हैं। बराबर बाँटना मतलब समान समूह!',
    highlight: '"10 को 5 समूहों में = हर में 2"',
    mascotText: "बराबर बाँटना ही भाग है! ➗",
  },
  {
    image: '/images/story_multiply.png',
    title: "गुणा और भाग",
    text: 'समान समूह हमें गुणा करने में मदद करते हैं। चार के तीन समूह मतलब चार जमा चार जमा चार। इसे बार-बार जोड़ना कहते हैं! और जब हम बराबर बाँटते हैं, तो वह भाग की शुरुआत होती है!',
    highlight: '"बार-बार जोड़ना → गुणा!"',
    mascotText: "आप बहुत तेज़ सीख रहे हो! 🚀",
  },
  {
    image: '/images/story_practice.png',
    title: "आपकी बारी!",
    text: 'अब आप जानते हैं कि समान समूह क्या होते हैं! जब हर समूह में एक जैसी चीज़ें हों, तो हम उन्हें समान समूह से जल्दी गिन सकते हैं। चलो खुद समान समूह बनाने का अभ्यास करते हैं!',
    highlight: '"समान समूह — चलो शुरू करते हैं!"',
    mascotText: "खोज के लिए तैयार! ✨",
  },
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(false);
  const [textVis, setTextVis] = useState(false);
  const [hlVis, setHlVis] = useState(false);
  const narrationRef = useRef(null);
  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;
  const pct = ((slide + 1) / STORY_SLIDES.length) * 100;

  // Preload audio
  useEffect(() => {
    if (audioEnabled) {
      preloadNarration(getStoryNarration(slide));
      if (slide + 1 < STORY_SLIDES.length) {
        preloadNarration(getStoryNarration(slide + 1));
      }
    }
  }, [slide, audioEnabled]);

  useEffect(() => {
    setTextVis(false); setHlVis(false);
    const t1 = setTimeout(() => setTextVis(true), 100);
    const t2 = setTimeout(() => setHlVis(true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [slide]);

  useEffect(() => {
    if (textVis && audioEnabled) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(getStoryNarration(slide), true);
    }
    return () => { narrationRef.current?.cancel(); };
  }, [textVis, slide, audioEnabled]);

  const goNext = useCallback(() => {
    if (anim) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => { isLast ? onComplete() : setSlide(i => i + 1); setAnim(false); }, 400);
  }, [anim, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (anim || slide === 0) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => { setSlide(i => i - 1); setAnim(false); }, 400);
  }, [anim, slide]);

  return (
    <div className="story-phase">
      <div className="story-progress">
        <div className="story-progress-bar"><div className="story-progress-fill" style={{ width: `${pct}%` }} /></div>
        <span className="story-progress-label">{slide + 1} / {STORY_SLIDES.length}</span>
      </div>
      <div className={`story-card ${anim ? 'flipping' : ''}`}>
        <div className="story-image-section">
          <img src={s.image} alt={s.title} className="story-image" onError={(e) => { e.target.style.display = 'none'; }} />
          <div className="story-image-overlay" />
        </div>
        <div className="story-text-section">
          <h2 className="story-title">{s.title}</h2>
          <p className={`story-text ${textVis ? 'revealed' : ''}`}>{s.text}</p>
          <div className={`story-highlight ${hlVis ? 'visible' : ''}`}>
            <span>✨</span><span className="story-highlight-text">{s.highlight}</span><span>✨</span>
          </div>
          <div className="story-mascot">
            <div className="mascot" style={{ width: 50, height: 50, fontSize: '1.4rem' }}>🤖</div>
            <div className="speech-bubble" style={{ fontSize: '0.8rem', padding: '8px 14px', maxWidth: 180 }}>{s.mascotText}</div>
          </div>
        </div>
      </div>
      <div className="story-nav">
        <button className="btn btn-outline btn-sm" onClick={goPrev} disabled={slide === 0} style={{ opacity: slide === 0 ? 0.3 : 1 }}>← वापस</button>
        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (<div key={i} className={`story-dot ${i === slide ? 'active' : i < slide ? 'completed' : ''}`} />))}
        </div>
        <button className={`btn ${isLast ? 'btn-green' : 'btn-primary'} btn-sm`} onClick={goNext}>
          {isLast ? "🚀 चलो खोजते हैं!" : 'आगे →'}
        </button>
      </div>
    </div>
  );
}
