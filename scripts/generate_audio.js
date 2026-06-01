import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiKey = process.env.VITE_ELEVENLABS_API_KEY;

// ── Indian Hindi Voices (ElevenLabs eleven_multilingual_v2) ──────────────────
// • Meera  – pFZP5JQG7iQjIQuC4Bku – warm female, child-friendly (RECOMMENDED)
// • Raju   – ODq5zmih8GrVes37Dizd – friendly male narrator
// • Monika – AZnzlk1XvdvUeBnXmlld – calm natural female
const voiceId = 'sTuFDs5r9KT8f6JSiJbq'; // Monika sogam — Hindi female voice

const audioDir = path.join(__dirname, '../public/assets/audio');

if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

const getElevenLabsSettings = (style) => {
    switch (style) {
        case 'celebration': return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
        case 'encouragement': return { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true };
        case 'question': return { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
        case 'emphasis': return { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
        case 'thinking': return { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true };
        case 'instruction': return { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true };
        default: return { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true };
    }
};

// ── All Hindi narration phrases (must match narration.js exactly) ────────────
const phrases = [
    // ── Intro ──────────────────────────────────────────────────────────────
    { text: "समान समूहों में आपका स्वागत है!", style: 'encouragement' },
    { text: "आज हम गुणा और भाग के लिए समान समूहों के बारे में सीखेंगे।", style: 'statement' },
    { text: "क्या होता है जब हम हर समूह में एक जैसी चीज़ें रखते हैं? क्या हम कुल गिन सकते हैं?", style: 'question' },
    { text: "क्या आप समान समूहों को खोजने और मज़ेदार चुनौतियाँ हल करने के लिए तैयार हैं? चलो अपनी सीखने की यात्रा शुरू करते हैं!", style: 'encouragement' },

    // ── Wonder ─────────────────────────────────────────────────────────────
    { text: "मीरा के पास 12 स्ट्रॉबेरी और 3 थालियाँ हैं। क्या वह हर थाली में एक जैसी स्ट्रॉबेरी रख सकती है?", style: 'question' },
    { text: "जब हर समूह को एक जैसी चीज़ मिले, तो उसे समान समूह कहते हैं!", style: 'statement' },
    { text: "4 मेज़ें हैं। हर मेज़ पर 3 कटोरे हैं। कुल कितने कटोरे हैं?", style: 'question' },
    { text: "समान समूह हमें बहुत सारी चीज़ें जल्दी गिनने में मदद करते हैं!", style: 'statement' },
    { text: "अगर हर थैले में 5 संतरे हैं और 3 थैले हैं, तो कुल कितने संतरे हैं?", style: 'question' },
    { text: "हर थैले में एक जैसी संख्या रखना — यही समान समूह है!", style: 'statement' },
    { text: "क्या आप 10 स्टिकर 5 दोस्तों में बराबर बाँट सकते हैं?", style: 'question' },
    { text: "बराबर बाँटना मतलब समान समूह बनाना — सबको एक जैसा मिले!", style: 'statement' },
    { text: "4 के 3 समूह — क्या यह 4 + 4 + 4 के बराबर है?", style: 'question' },
    { text: "समान समूह और बार-बार जोड़ना — दोनों एक ही बात है!", style: 'statement' },

    // ── Story ──────────────────────────────────────────────────────────────
    { text: "मीरा के पास बारह स्ट्रॉबेरी हैं। वह हर थाली में एक जैसी स्ट्रॉबेरी रखना चाहती है।", style: 'statement' },
    { text: "क्या वह ऐसा कर सकती है? हर थाली में कितनी स्ट्रॉबेरी जाएंगी?", style: 'question' },
    { text: "चलो पता करते हैं कि समान समूह का मतलब क्या होता है!", style: 'encouragement' },
    { text: "रोहन अपने परिवार के साथ खाने की दुकान पर जाता है।", style: 'statement' },
    { text: "वहाँ तीन मेज़ें हैं। हर मेज़ पर नूडल्स के चार कटोरे हैं।", style: 'statement' },
    { text: "हर मेज़ को एक जैसे कटोरे मिलते हैं। इसी को हम समान समूह कहते हैं!", style: 'emphasis' },
    { text: "चार के तीन समूह। मेरे साथ गिनो: चार, आठ, बारह। कुल मिलाकर बारह!", style: 'statement' },
    { text: "जब हर समूह में एक जैसी चीज़ें हों, तो उन्हें समान समूह कहते हैं।", style: 'emphasis' },
    { text: "अब रोहन का परिवार दस सेब पाँच थैलियों में बराबर बाँटता है।", style: 'statement' },
    { text: "हर थैली में दो सेब जाते हैं। बराबर बाँटना मतलब समान समूह!", style: 'emphasis' },
    { text: "समान समूह हमें गुणा करने में मदद करते हैं। चार के तीन समूह मतलब चार जमा चार जमा चार।", style: 'statement' },
    { text: "इसे बार-बार जोड़ना कहते हैं!", style: 'emphasis' },
    { text: "और जब हम बराबर बाँटते हैं, तो वह भाग की शुरुआत होती है!", style: 'statement' },
    { text: "अब आप जानते हैं कि समान समूह क्या होते हैं!", style: 'celebration' },
    { text: "चलो खुद समान समूह बनाने का अभ्यास करते हैं!", style: 'encouragement' },

    // ── Simulate ───────────────────────────────────────────────────────────
    { text: "वस्तुओं को घेरों में खींचो। हर समूह में एक जैसी संख्या रखो!", style: 'instruction' },
    { text: "यह पक्का करो कि हर समूह में एक जैसी संख्या हो। क्या तुम कर सकते हो?", style: 'question' },
    { text: "इन व्यवस्थाओं को देखो। कौन सी समान समूह दिखाती है? टैप करके चुनो!", style: 'instruction' },
    { text: "अब खाली जगह भरो। नंबर पैड का उपयोग करो!", style: 'question' },

    // ── Reflect ────────────────────────────────────────────────────────────
    { text: "आपने समान समूहों के बारे में क्या सीखा?", style: 'question' },
    { text: "समान समूहों के बारे में आप कितना आत्मविश्वास महसूस करते हैं?", style: 'question' },
];

async function generate() {
    console.log(`\n🎙️  Hindi Audio Generator — ElevenLabs (Meera voice)`);
    console.log(`📦  Total phrases: ${phrases.length}`);
    console.log(`🔑  API Key: ${apiKey ? '✅ Found' : '❌ Missing'}\n`);

    if (!apiKey) {
        console.error('ERROR: VITE_ELEVENLABS_API_KEY not found in .env.local');
        process.exit(1);
    }

    const mapData = {};

    for (let i = 0; i < phrases.length; i++) {
        const { text, style } = phrases[i];
        // Use Unicode-safe filename (hash the index)
        const filename = `hindi_audio_${String(i).padStart(3, '0')}.mp3`;
        const filepath = path.join(audioDir, filename);

        mapData[text] = `/assets/audio/${filename}`;

        if (fs.existsSync(filepath)) {
            console.log(`⏭️  Skipping (exists): ${filename}`);
            continue;
        }

        console.log(`🎵  Generating [${i + 1}/${phrases.length}]: ${filename}`);
        console.log(`     "${text.substring(0, 60)}..."`);

        const settings = getElevenLabsSettings(style);

        try {
            const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: settings
                })
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error(`❌  Failed [${i}]: ${res.status} ${res.statusText}`);
                console.error(`    ${errText}`);
                continue;
            }

            const buffer = await res.arrayBuffer();
            fs.writeFileSync(filepath, Buffer.from(buffer));
            console.log(`✅  Saved: ${filename}`);
        } catch (err) {
            console.error(`❌  Error [${i}]: ${err.message}`);
        }

        // Rate limit: wait 600ms between requests
        await new Promise(r => setTimeout(r, 600));
    }

    // Write the audioMap
    const mapFile = path.join(__dirname, '../src/utils/audioMap.js');
    const mapContent = `// Hindi audio map — generated by scripts/generate_audio.js\n// Voice: Meera (pFZP5JQG7iQjIQuC4Bku) — ElevenLabs eleven_multilingual_v2\nexport const audioMap = ${JSON.stringify(mapData, null, 2)};\n`;
    fs.writeFileSync(mapFile, mapContent);

    console.log(`\n✨  Done! ${phrases.length} Hindi audio files generated.`);
    console.log(`📄  audioMap.js updated at src/utils/audioMap.js\n`);
}

generate();
