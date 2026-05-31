// ──────────────────────────────────────────────────
// Question Bank — समान समूह (100 प्रश्न, 10 प्रकार)
// Hindi Medium — Equal Groups: Multiplication & Division
// ──────────────────────────────────────────────────

// भारतीय नाम
const names = ['मीरा', 'रोहन', 'प्रिया', 'अर्जुन', 'अनीता', 'विजय', 'सोनम', 'कार्तिक', 'पूजा', 'आदित्य'];
const femaleNames = ['मीरा', 'प्रिया', 'अनीता', 'सोनम', 'पूजा'];

const objects = ['केक', 'गुब्बारे', 'स्टिकर', 'कंचे', 'सेब', 'बिस्किट', 'आम', 'रबड़', 'किताबें', 'मिठाइयाँ'];
const containers = ['थाली', 'थैला', 'डिब्बा', 'टोकरी', 'मेज़', 'ट्रे'];
const emojis = ['🍓', '⭐', '🍪', '🐟', '🎈', '🍎', '📚', '🧁', '🥭', '✏️'];

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pronoun(name) { return femaleNames.includes(name) ? 'वह' : 'वह'; }

export function generateDistractors(correct, min = 0, max = 40, count = 3) {
  const distractors = new Set();
  const offsets = [-3, -2, -1, 1, 2, 3];
  shuffleArray(offsets).forEach(offset => {
    const d = correct + offset;
    if (d >= min && d <= max && d !== correct && distractors.size < count) distractors.add(d);
  });
  while (distractors.size < count) {
    const d = correct + (distractors.size + 1);
    if (d <= max && d !== correct) distractors.add(d);
    else {
      const d2 = correct - (distractors.size + 1);
      if (d2 >= min && d2 !== correct) distractors.add(d2);
    }
  }
  return shuffleArray([correct, ...distractors]);
}

function genNums(diff) {
  let numGroups, groupSize;
  if (diff === 1) { numGroups = pick([2,3,4,5]); groupSize = pick([2,3,4,5]); while (numGroups * groupSize > 20) { groupSize = pick([2,3,4]); } }
  else if (diff === 2) { numGroups = pick([2,3,4,5,6]); groupSize = pick([2,3,4,5,6]); while (numGroups * groupSize > 30) { groupSize = pick([2,3,4,5]); } }
  else { numGroups = pick([2,3,4,5,6,7,8,9]); groupSize = pick([2,3,4,5,6,7,8,9]); while (numGroups * groupSize > 40) { groupSize = pick([2,3,4,5]); } }
  return { numGroups, groupSize, total: numGroups * groupSize };
}

// Q1: समूहों में कुल गिनो
function genQ1(id, diff) {
  const { numGroups, groupSize, total } = genNums(diff);
  const emoji = pick(emojis);
  return {
    id, type: 'count_groups', difficulty: diff, world: 0,
    numGroups, groupSize, total, missingSlot: 'total',
    questionText: `${numGroups} समूह हैं। हर समूह में ${groupSize} ${emoji} हैं। कुल कितने ${emoji} हैं?`,
    visual: 'groupDiagram', objectEmoji: emoji,
    hint1: `हर समूह में ${groupSize} गिनो। फिर सभी ${numGroups} समूह गिनो।`,
    hint2: `मेरे साथ गिनो: ${Array.from({length:numGroups},(_,i)=>groupSize*(i+1)).join(', ')}!`,
    explanation: `${numGroups} के ${groupSize} समूह = ${total}। हम गिन सकते हैं: ${Array.from({length:numGroups},(_,i)=>groupSize*(i+1)).join(', ')}!`,
    options: generateDistractors(total),
    correctAnswer: total,
  };
}

// Q2: समान समूह चित्र — सही व्यवस्था चुनो
function genQ2(id, diff) {
  const { numGroups, groupSize, total } = genNums(diff);
  const emoji = pick(emojis);
  const correctLabel = `${numGroups} के ${groupSize} समूह`;
  const wrongOptions = [
    `${numGroups + 1} के ${groupSize} समूह`,
    `${numGroups} के ${groupSize + 1} समूह`,
    `${groupSize} के ${numGroups !== groupSize ? numGroups : numGroups + 2} समूह`,
  ];
  return {
    id, type: 'picture_group', difficulty: diff, world: 0,
    numGroups, groupSize, total, missingSlot: 'total',
    questionText: `कौन सी तस्वीर ${numGroups} के ${groupSize} समूह दिखाती है?`,
    visual: 'picture', objectEmoji: emoji,
    hint1: `ठीक ${numGroups} घेरे खोजो जिनमें हर में ${groupSize} चीज़ें हों।`,
    hint2: `पहले समूह गिनो, फिर हर समूह में चीज़ें गिनो।`,
    explanation: `${numGroups} के ${groupSize} समूह मतलब ${numGroups} घेरे, हर में ${groupSize} ${emoji}।`,
    options: shuffleArray([correctLabel, ...wrongOptions.slice(0, 3)]),
    correctAnswer: correctLabel,
  };
}

// Q3: खाली जगह भरो — कुल बताओ
function genQ3(id, diff) {
  const { numGroups, groupSize, total } = genNums(diff);
  return {
    id, type: 'fill_total', difficulty: diff, world: 0,
    numGroups, groupSize, total, missingSlot: 'total',
    questionText: `${numGroups} के ${groupSize} समूह = ___`,
    visual: 'sentence', objectEmoji: pick(emojis),
    hint1: `${groupSize} को ${numGroups} बार जोड़ो।`,
    hint2: `${Array(numGroups).fill(groupSize).join(' + ')} = ?`,
    explanation: `${numGroups} के ${groupSize} समूह = ${total}।`,
    options: generateDistractors(total),
    correctAnswer: total,
  };
}

// Q4: खाली जगह भरो — समूह का आकार बताओ
function genQ4(id, diff) {
  const { numGroups, groupSize, total } = genNums(diff);
  return {
    id, type: 'fill_group_size', difficulty: diff, world: 0,
    numGroups, groupSize, total, missingSlot: 'groupSize',
    questionText: `${numGroups} के ___ समूह = ${total}`,
    visual: 'sentence', objectEmoji: pick(emojis),
    hint1: `${total} को ${numGroups} समूहों में बराबर बाँटो।`,
    hint2: `अगर ${numGroups} समूह मिलकर ${total} बनाते हैं, तो हर में कितने?`,
    explanation: `${total} को ${numGroups} समूहों में बाँटने पर हर में ${groupSize} आते हैं।`,
    options: generateDistractors(groupSize),
    correctAnswer: groupSize,
  };
}

// Q5: खाली जगह भरो — समूहों की संख्या बताओ
function genQ5(id, diff) {
  const { numGroups, groupSize, total } = genNums(diff);
  return {
    id, type: 'fill_num_groups', difficulty: diff, world: 0,
    numGroups, groupSize, total, missingSlot: 'numGroups',
    questionText: `___ के ${groupSize} समूह = ${total}`,
    visual: 'sentence', objectEmoji: pick(emojis),
    hint1: `${groupSize} ${total} में कितनी बार आता है?`,
    hint2: `${groupSize}-${groupSize}-${groupSize} गिनते जाओ जब तक ${total} न मिले।`,
    explanation: `${total} को ${groupSize} के समूहों में बाँटने पर ${numGroups} समूह बनते हैं।`,
    options: generateDistractors(numGroups),
    correctAnswer: numGroups,
  };
}

// Q6: हिंदी शब्द समस्या (गुणा)
function genQ6(id, diff) {
  const { numGroups, groupSize, total } = genNums(diff);
  const name = pick(names);
  const obj = pick(objects);
  const container = pick(containers);
  const emoji = pick(emojis);
  return {
    id, type: 'word_problem_mult', difficulty: diff, world: 0,
    numGroups, groupSize, total, missingSlot: 'total',
    questionText: `${name} हर ${container} पर ${groupSize} ${obj} रखता है। उसके पास ${numGroups} ${container} हैं। कुल कितने ${obj} हैं?`,
    visual: 'groupDiagram', objectEmoji: emoji,
    characterName: name, containerName: container, objectName: obj,
    hint1: `${numGroups} घेरे बनाओ। हर में ${groupSize} ${obj} रखो।`,
    hint2: `${Array(numGroups).fill(groupSize).join(' + ')} = ?`,
    explanation: `${numGroups} के ${groupSize} समूह = ${total}। ${name} के पास कुल ${total} ${obj} हैं।`,
    options: generateDistractors(total),
    correctAnswer: total,
  };
}

// Q7: हिंदी शब्द समस्या (बराबर बाँटना / भाग)
function genQ7(id, diff) {
  const { numGroups, groupSize, total } = genNums(diff);
  const name = pick(names);
  const obj = pick(objects);
  const container = pick(containers);
  const emoji = pick(emojis);
  return {
    id, type: 'word_problem_div', difficulty: diff, world: 0,
    numGroups, groupSize, total, missingSlot: 'groupSize',
    questionText: `${name} के पास ${total} ${obj} हैं। वह उन्हें ${numGroups} ${container}ों में बराबर बाँटता है। हर ${container} में कितने ${obj} आएंगे?`,
    visual: 'groupDiagram', objectEmoji: emoji,
    characterName: name, containerName: container, objectName: obj,
    hint1: `${numGroups} ${container} बनाओ। ${total} ${obj} बराबर बाँटो।`,
    hint2: `${total} को ${numGroups} बराबर समूहों में — हर में ${groupSize}!`,
    explanation: `${total} को ${numGroups} समूहों में बाँटने पर हर में ${groupSize} आते हैं।`,
    options: generateDistractors(groupSize),
    correctAnswer: groupSize,
  };
}

// Q8: सच या झूठ — क्या यह समान है?
function genQ8(id, diff) {
  const { numGroups, groupSize, total } = genNums(diff);
  const isTrue = Math.random() > 0.5;
  const shownTotal = isTrue ? total : total + pick([-2, -1, 1, 2]);
  return {
    id, type: 'true_false_group', difficulty: diff, world: 0,
    numGroups, groupSize, total, missingSlot: 'none', isTrue,
    questionText: `"${numGroups} के ${groupSize} समूह = ${shownTotal}" — सच है या झूठ?`,
    visual: 'sentence', objectEmoji: pick(emojis),
    hint1: `हिसाब लगाओ: ${numGroups} के ${groupSize} समूह कितने होते हैं?`,
    hint2: `गिनो: ${Array(numGroups).fill(groupSize).join(' + ')} = ?`,
    explanation: `${numGroups} के ${groupSize} समूह = ${total}। इसलिए यह कथन ${isTrue ? 'सच' : 'झूठ'} है।`,
    options: ['सच', 'झूठ'],
    correctAnswer: isTrue ? 'सच' : 'झूठ',
  };
}

// Q9: समान समूह पहचानो (चित्रात्मक MCQ)
function genQ9(id, diff) {
  const { numGroups, groupSize, total } = genNums(diff);
  const emoji = pick(emojis);
  const correctLabel = `सभी समूहों में ${groupSize} हैं`;
  const wrong1 = `समूहों में ${groupSize} और ${groupSize + 1} हैं`;
  const wrong2 = `समूहों में ${groupSize - 1} और ${groupSize} हैं`;
  const wrong3 = `समूहों में अलग-अलग मात्रा है`;
  return {
    id, type: 'spot_group_mcq', difficulty: diff, world: 0,
    numGroups, groupSize, total, missingSlot: 'none',
    questionText: `कौन सी तस्वीर समान समूह दिखाती है?`,
    visual: 'picture', objectEmoji: emoji,
    hint1: `समान समूह मतलब हर समूह में एक जैसी संख्या।`,
    hint2: `हर समूह को ध्यान से गिनो। किसमें सब एक जैसे हैं?`,
    explanation: `समान समूह मतलब सभी समूहों में ${groupSize}-${groupSize} हैं।`,
    options: shuffleArray([correctLabel, wrong1, wrong2, wrong3]),
    correctAnswer: correctLabel,
  };
}

// Q10: बार-बार जोड़ना
function genQ10(id, diff) {
  const { numGroups, groupSize, total } = genNums(diff);
  const repeatedAdd = Array(numGroups).fill(groupSize).join(' + ');
  return {
    id, type: 'repeated_addition', difficulty: diff, world: 0,
    numGroups, groupSize, total, missingSlot: 'numGroups',
    questionText: `${repeatedAdd} = ___ के ${groupSize} समूह`,
    visual: 'sentence', objectEmoji: pick(emojis),
    hint1: `${groupSize} कितनी बार आता है? वही समूहों की संख्या है।`,
    hint2: `${groupSize} यहाँ ${numGroups} बार है! इसलिए ${numGroups} के ${groupSize} समूह।`,
    explanation: `${repeatedAdd} में ${groupSize}, ${numGroups} बार है। इसलिए यह ${numGroups} के ${groupSize} समूह है।`,
    options: generateDistractors(numGroups),
    correctAnswer: numGroups,
  };
}

const generators = [genQ1, genQ2, genQ3, genQ4, genQ5, genQ6, genQ7, genQ8, genQ9, genQ10];

const diffDist = {
  q1:  [1,1,1,1,1,2,2,2,3,3],
  q2:  [1,1,1,1,1,2,2,2,3,3],
  q3:  [1,1,1,1,2,2,2,2,3,3],
  q4:  [1,1,1,2,2,2,2,3,3,3],
  q5:  [1,1,1,2,2,2,2,3,3,3],
  q6:  [1,1,1,2,2,2,2,3,3,3],
  q7:  [1,1,1,2,2,2,2,3,3,3],
  q8:  [1,1,1,1,1,2,2,2,3,3],
  q9:  [1,1,1,1,2,2,2,2,3,3],
  q10: [1,1,1,2,2,2,2,3,3,3],
};

export function generateSessionQuestions() {
  const bank = [];
  let qid = 1;
  const qKeys = ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10'];

  generators.forEach((gen, gi) => {
    const diffs = diffDist[qKeys[gi]];
    diffs.forEach(diff => {
      bank.push(gen(`Q${gi + 1}_${String(qid).padStart(3, '0')}`, diff));
      qid++;
    });
  });

  const selected = shuffleArray(bank);
  selected.forEach((q, index) => {
    q.world = Math.floor(index / 10);
  });

  return selected;
}

export { names };
