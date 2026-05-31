// ──────────────────────────────────────────────────
// Narration Scripts — Equal Groups (हिंदी)
// सभी नैरेशन हिंदी में हैं — ElevenLabs multilingual v2
// ──────────────────────────────────────────────────

import { say, ask, cheer, emphasize, think, celebrate, instruct, pause } from './audio';

// ─── INTRO SCREEN ────────────────────────────────
export function introNarration() {
  return [
    cheer("समान समूहों में आपका स्वागत है!"),
    say("आज हम गुणा और भाग के लिए समान समूहों के बारे में सीखेंगे।"),
    ask("क्या होता है जब हम हर समूह में एक जैसी चीज़ें रखते हैं? क्या हम कुल गिन सकते हैं?"),
    cheer("क्या आप समान समूहों को खोजने और मज़ेदार चुनौतियाँ हल करने के लिए तैयार हैं? चलो अपनी सीखने की यात्रा शुरू करते हैं!"),
  ];
}

// ─── WONDER PHASE ────────────────────────────────
export function wonderNarration(questionText, subtext) {
  return [
    ask(questionText),
    say(subtext),
  ];
}

export function wonderDiscoverNarration() {
  return [];
}

// ─── STORY PHASE ─────────────────────────────────
export function getStoryNarration(slideIndex) {
  switch (slideIndex) {
    case 0:
      return [
        say("मीरा के पास बारह स्ट्रॉबेरी हैं। वह हर थाली में एक जैसी स्ट्रॉबेरी रखना चाहती है।"),
        ask("क्या वह ऐसा कर सकती है? हर थाली में कितनी स्ट्रॉबेरी जाएंगी?"),
        say("चलो पता करते हैं कि समान समूह का मतलब क्या होता है!"),
      ];
    case 1:
      return [
        say("वेई मिंग अपने परिवार के साथ खाने की दुकान पर जाता है।"),
        say("वहाँ तीन मेज़ें हैं। हर मेज़ पर नूडल्स के चार कटोरे हैं।"),
        emphasize("हर मेज़ को एक जैसे कटोरे मिलते हैं। इसी को हम समान समूह कहते हैं!"),
      ];
    case 2:
      return [
        say("चार के तीन समूह। मेरे साथ गिनो: चार, आठ, बारह। कुल मिलाकर बारह!"),
        emphasize("जब हर समूह में एक जैसी चीज़ें हों, तो उन्हें समान समूह कहते हैं।"),
      ];
    case 3:
      return [
        say("अब वेई मिंग का परिवार दस सेब पाँच थैलियों में बराबर बाँटता है।"),
        emphasize("हर थैली में दो सेब जाते हैं। बराबर बाँटना मतलब समान समूह!"),
      ];
    case 4:
      return [
        say("समान समूह हमें गुणा करने में मदद करते हैं। चार के तीन समूह मतलब चार जमा चार जमा चार।"),
        emphasize("इसे बार-बार जोड़ना कहते हैं!"),
        say("और जब हम बराबर बाँटते हैं, तो वह भाग की शुरुआत होती है!"),
      ];
    case 5:
      return [
        cheer("अब आप जानते हैं कि समान समूह क्या होते हैं!"),
        say("चलो खुद समान समूह बनाने का अभ्यास करते हैं!"),
      ];
    default:
      return [];
  }
}

// ─── SIMULATE PHASE ──────────────────────────────
export function simulateStation1Intro() {
  return [
    instruct("वस्तुओं को घेरों में खींचो। हर समूह में एक जैसी संख्या रखो!"),
    ask("यह पक्का करो कि हर समूह में एक जैसी संख्या हो। क्या तुम कर सकते हो?"),
  ];
}

export function simulateStation2Intro() {
  return [
    instruct("इन व्यवस्थाओं को देखो। कौन सी समान समूह दिखाती है? टैप करके चुनो!"),
  ];
}

export function simulateStation3Intro() {
  return [
    ask("अब खाली जगह भरो। नंबर पैड का उपयोग करो!"),
  ];
}

export function simulateAllComplete() {
  return [];
}

// ─── PLAY PHASE ──────────────────────────────────
export function playWorldIntro(worldName) {
  return [
    celebrate(`${worldName} में आपका स्वागत है!`),
  ];
}

export function playReadQuestion(questionText) {
  return [
    say(questionText),
  ];
}

export function playCorrectNarration(streak = 0) {
  return [];
}

export function playWrongNarration() {
  return [];
}

export function playWorldComplete(worldName, score, total) {
  return [
    say(`${worldName} पूरा हुआ!`),
    say(`अंक: ${total} में से ${score}`),
  ];
}

// ─── REFLECT PHASE ───────────────────────────────
export function reflectIntroNarration() {
  return [
    ask("आपने समान समूहों के बारे में क्या सीखा?"),
  ];
}

export function reflectCorrectNarration() {
  return [];
}

export function reflectWrongNarration() {
  return [];
}

export function reflectConfidenceNarration() {
  return [
    ask("समान समूहों के बारे में आप कितना आत्मविश्वास महसूस करते हैं?"),
  ];
}

export function reflectCertificateNarration(pct) {
  return [
    say(`आपने ${Math.round(pct)} प्रतिशत अंक पाए`),
  ];
}
