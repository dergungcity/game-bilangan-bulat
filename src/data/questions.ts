import { MathCategory, Question } from '../types/game';

// Utility helper to shuffle array
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Random integer between min and max (inclusive)
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pick random item from array
export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Generate plausible multiple choice distractors around correct numeric answer
export function generateNumericOptions(correct: number, count = 4): number[] {
  const options = new Set<number>([correct]);
  
  const distractors = [
    -correct, // Opposite sign
    correct + 1,
    correct - 1,
    correct + 2,
    correct - 2,
    correct + 5,
    correct - 5,
    correct + 10,
    correct - 10,
    Math.abs(correct),
    -Math.abs(correct),
  ];

  for (const d of distractors) {
    if (d !== correct) {
      options.add(d);
    }
    if (options.size >= count) break;
  }

  while (options.size < count) {
    const delta = (randInt(1, 10)) * (Math.random() > 0.5 ? 1 : -1);
    const candidate = correct + delta;
    if (candidate !== correct) {
      options.add(candidate);
    }
  }

  return shuffle(Array.from(options));
}

// Generate options for string-based questions
export function generateTextOptions(correct: string, pool: string[], count = 4): string[] {
  const options = new Set<string>([correct]);
  for (const item of pool) {
    if (item !== correct) {
      options.add(item);
    }
    if (options.size >= count) break;
  }
  return shuffle(Array.from(options));
}

// ==========================================
// 1. GENERATOR: GARIS BILANGAN & PERBANDINGAN
// ==========================================
export function generateGarisBilanganQuestion(): Question {
  const subTypes = ['compare', 'statement', 'opposite', 'steps', 'order', 'distance', 'word_name'];
  const type = pickRandom(subTypes);
  const qId = `gb_${Date.now()}_${Math.random()}`;

  if (type === 'compare') {
    // -a ... b  OR  -a ... -b
    const a = randInt(-35, 35);
    let b = randInt(-35, 35);
    while (b === a) b = randInt(-35, 35);

    const isLess = a < b;
    const correctSymbol = isLess ? '<' : '>';
    const signText = isLess ? 'lebih kecil dari' : 'lebih besar dari';

    return {
      id: qId,
      category: 'garis_bilangan',
      questionText: `Manakah tanda pertidaksamaan yang tepat untuk: ${a} ... ${b} ?`,
      options: ['<', '>', '=', '≥'],
      correctAnswer: correctSymbol,
      explanation: `Pada garis bilangan, angka ${a} berada di sebelah ${isLess ? 'kiri' : 'kanan'} angka ${b}. Semakin ke kiri semakin kecil. Jadi ${a} ${correctSymbol} ${b} (${a} ${signText} ${b}).`,
      numberLineHint: { start: a, step: b - a, result: b },
    };
  }

  if (type === 'opposite') {
    const val = randInt(-60, 60);
    if (val === 0) return generateGarisBilanganQuestion();
    const opp = -val;

    return {
      id: qId,
      category: 'garis_bilangan',
      questionText: `Lawan dari bilangan bulat ${val} adalah...`,
      options: generateNumericOptions(opp),
      correctAnswer: opp,
      explanation: `Lawan dari bilangan ${val < 0 ? 'negatif (-a)' : 'positif (+a)'} adalah ${opp < 0 ? 'negatifnya' : 'positifnya'}. Jadi lawan dari ${val} adalah ${opp}.`,
    };
  }

  if (type === 'steps') {
    const start = randInt(-20, 20);
    const steps = randInt(3, 15);
    const isLeft = Math.random() > 0.5;
    const result = isLeft ? start - steps : start + steps;
    const dir = isLeft ? 'kiri (-)' : 'kanan (+)';

    return {
      id: qId,
      category: 'garis_bilangan',
      questionText: `Bilangan bulat yang terletak ${steps} satuan di sebelah ${isLeft ? 'kiri' : 'kanan'} angka ${start} adalah...`,
      options: generateNumericOptions(result),
      correctAnswer: result,
      explanation: `Bergerak ke ${dir} dari ${start}: ${start} ${isLeft ? '-' : '+'} ${steps} = ${result}.`,
      numberLineHint: { start, step: isLeft ? -steps : steps, result },
    };
  }

  if (type === 'distance') {
    const a = randInt(-15, 0);
    const b = randInt(1, 15);
    const distance = Math.abs(b - a);

    return {
      id: qId,
      category: 'garis_bilangan',
      questionText: `Berapa satuan jarak antara titik (${a}) dan titik (${b}) pada garis bilangan?`,
      options: generateNumericOptions(distance),
      correctAnswer: distance,
      explanation: `Jarak pada garis bilangan dihitung dari titik tertinggi dikurangi titik terendah: ${b} - (${a}) = ${b} + ${Math.abs(a)} = ${distance} satuan.`,
    };
  }

  if (type === 'order') {
    // Generate 4 distinct numbers
    const set = new Set<number>();
    while (set.size < 4) {
      set.add(randInt(-25, 25));
    }
    const nums = Array.from(set);
    const sorted = [...nums].sort((x, y) => x - y);
    const correctStr = sorted.join(', ');

    // Distractor variations
    const reversed = [...sorted].reverse().join(', ');
    const fake1 = [...nums].sort(() => Math.random() - 0.5).join(', ');
    const fake2 = sorted.map((n) => -n).sort((x, y) => x - y).join(', ');

    const opts = Array.from(new Set([correctStr, reversed, fake1, fake2]));
    while (opts.length < 4) {
      opts.push([...nums].reverse().join(', '));
    }

    return {
      id: qId,
      category: 'garis_bilangan',
      questionText: `Urutan bilangan: ${nums.join(', ')} dari yang TERKECIL adalah...`,
      options: shuffle(opts),
      correctAnswer: correctStr,
      explanation: `Urutan dari terkecil dimulai dari bilangan negatif yang posisinya paling kiri, lalu mendekati nol, kemudian bilangan positif: ${correctStr}.`,
    };
  }

  // Word notation fallback
  const units = ['tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
  const tens = ['dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh'];
  const uIdx = randInt(0, units.length - 1);
  const tIdx = randInt(0, tens.length - 1);
  const val = -((tIdx + 2) * 10 + (uIdx + 3));
  const word = `Negatif ${tens[tIdx]} ${units[uIdx]}`;

  return {
    id: qId,
    category: 'garis_bilangan',
    questionText: `Lambang bilangan dari "${word}" adalah...`,
    options: shuffle([`${val}`, `${Math.abs(val)}`, `-${Math.abs(val) + 10}`, `${Math.abs(val) - 5}`]),
    correctAnswer: `${val}`,
    explanation: `Bilangan negatif ditulis dengan simbol minus (-) di depan angka. Jadi ${word} ditulis ${val}.`,
  };
}

// ==========================================
// 2. GENERATOR: PENJUMLAHAN BILANGAN BULAT
// ==========================================
export function generatePenjumlahanQuestion(): Question {
  const qId = `pj_${Date.now()}_${Math.random()}`;
  const subType = pickRandom(['neg_pos', 'neg_neg', 'pos_neg', 'three_terms', 'missing_box']);

  if (subType === 'neg_neg') {
    const a = randInt(-45, -5);
    const b = randInt(-45, -5);
    const ans = a + b;
    return {
      id: qId,
      category: 'penjumlahan',
      questionText: `Berapakah hasil dari: (${a}) + (${b}) ?`,
      options: generateNumericOptions(ans),
      correctAnswer: ans,
      explanation: `Menjumlahkan dua bilangan negatif sama dengan menambah hutang. Hasilnya tetap negatif yang semakin besar: (${a}) + (${b}) = ${ans}.`,
      numberLineHint: { start: a, step: b, result: ans },
    };
  }

  if (subType === 'three_terms') {
    const a = randInt(-30, 30);
    const b = randInt(-30, 30);
    const c = randInt(-30, 30);
    const ans = a + b + c;
    const aStr = a < 0 ? `(${a})` : `${a}`;
    const bStr = b < 0 ? `(${b})` : `${b}`;
    const cStr = c < 0 ? `(${c})` : `${c}`;

    return {
      id: qId,
      category: 'penjumlahan',
      questionText: `Berapakah hasil dari: ${aStr} + ${bStr} + ${cStr} ?`,
      options: generateNumericOptions(ans),
      correctAnswer: ans,
      explanation: `Hitung bertahap dari kiri: ${aStr} + ${bStr} = ${a + b}. Lalu ${a + b} + ${cStr} = ${ans}.`,
    };
  }

  if (subType === 'missing_box') {
    const a = randInt(-35, 35);
    const ans = randInt(-35, 35);
    const target = a + ans;
    const aStr = a < 0 ? `(${a})` : `${a}`;
    const targetStr = target < 0 ? `(${target})` : `${target}`;

    return {
      id: qId,
      category: 'penjumlahan',
      questionText: `Tentukan bilangan pengisi kotak: ${aStr} + [ ? ] = ${targetStr}`,
      options: generateNumericOptions(ans),
      correctAnswer: ans,
      explanation: `Untuk mencari nilai di dalam kotak, kurangkan hasil dengan bilangan awal: ${target} - (${a}) = ${target} + ${-a} = ${ans}.`,
    };
  }

  // Standard neg + pos or pos + neg
  const a = randInt(-50, 50);
  let b = randInt(-50, 50);
  while (b === 0) b = randInt(-50, 50);
  const ans = a + b;
  const aStr = a < 0 ? `(${a})` : `${a}`;
  const bStr = b < 0 ? `(${b})` : `${b}`;

  return {
    id: qId,
    category: 'penjumlahan',
    questionText: `Berapakah hasil dari: ${aStr} + ${bStr} ?`,
    options: generateNumericOptions(ans),
    correctAnswer: ans,
    explanation: `Ingat konsep uang dan hutang: ${aStr} + ${bStr} = ${ans}.`,
    numberLineHint: { start: a, step: b, result: ans },
  };
}

// ==========================================
// 3. GENERATOR: PENGURANGAN BILANGAN BULAT
// ==========================================
export function generatePenguranganQuestion(): Question {
  const qId = `pg_${Date.now()}_${Math.random()}`;
  const subType = pickRandom(['double_negative', 'neg_minus_pos', 'pos_minus_large', 'neg_minus_neg', 'missing_box']);

  if (subType === 'double_negative') {
    // a - (-b) = a + b
    const a = randInt(-25, 40);
    const b = randInt(-35, -2);
    const ans = a - b;
    const aStr = a < 0 ? `(${a})` : `${a}`;

    return {
      id: qId,
      category: 'pengurangan',
      questionText: `Berapakah hasil dari: ${aStr} - (${b}) ?`,
      options: generateNumericOptions(ans),
      correctAnswer: ans,
      explanation: `Ingat rumus emas: Pengurangan dengan bilangan negatif berubah menjadi penjumlahan! ${aStr} - (${b}) = ${a} + ${Math.abs(b)} = ${ans}.`,
      numberLineHint: { start: a, step: -b, result: ans },
    };
  }

  if (subType === 'neg_minus_neg') {
    const a = randInt(-45, -5);
    const b = randInt(-45, -5);
    const ans = a - b;

    return {
      id: qId,
      category: 'pengurangan',
      questionText: `Berapakah hasil dari: (${a}) - (${b}) ?`,
      options: generateNumericOptions(ans),
      correctAnswer: ans,
      explanation: `Tanda minus berhadapan menjadi tambah: (${a}) - (${b}) = ${a} + ${Math.abs(b)} = ${ans}.`,
    };
  }

  if (subType === 'missing_box') {
    const a = randInt(-25, 30);
    const b = randInt(-30, 30);
    const target = a - b;
    const aStr = a < 0 ? `(${a})` : `${a}`;
    const targetStr = target < 0 ? `(${target})` : `${target}`;

    return {
      id: qId,
      category: 'pengurangan',
      questionText: `Tentukan bilangan pengisi kotak: ${aStr} - [ ? ] = ${targetStr}`,
      options: generateNumericOptions(b),
      correctAnswer: b,
      explanation: `Untuk mencari pengurang: [ ? ] = ${a} - (${target}) = ${b}.`,
    };
  }

  // General subtraction
  const a = randInt(-35, 35);
  const b = randInt(-35, 35);
  const ans = a - b;
  const aStr = a < 0 ? `(${a})` : `${a}`;
  const bStr = b < 0 ? `(${b})` : `${b}`;

  return {
    id: qId,
    category: 'pengurangan',
    questionText: `Berapakah hasil dari: ${aStr} - ${bStr} ?`,
    options: generateNumericOptions(ans),
    correctAnswer: ans,
    explanation: `Pengurangan bilangan bulat: ${aStr} - ${bStr} = ${ans}.`,
  };
}

// ==========================================
// 4. GENERATOR: PERKALIAN & PEMBAGIAN
// ==========================================
export function generatePerkalianPembagianQuestion(): Question {
  const qId = `pp_${Date.now()}_${Math.random()}`;
  const isMultiplication = Math.random() > 0.45;

  if (isMultiplication) {
    const a = pickRandom([-12, -11, -9, -8, -7, -6, -5, -4, 4, 5, 6, 7, 8, 9, 11, 12]);
    const b = pickRandom([-12, -10, -9, -8, -7, -6, -5, -4, 4, 5, 6, 7, 8, 9, 10, 12]);
    const ans = a * b;
    const aStr = a < 0 ? `(${a})` : `${a}`;
    const bStr = b < 0 ? `(${b})` : `${b}`;
    const isBothNegative = a < 0 && b < 0;

    return {
      id: qId,
      category: 'perkalian_pembagian',
      questionText: `Berapakah hasil dari: ${aStr} × ${bStr} ?`,
      options: generateNumericOptions(ans),
      correctAnswer: ans,
      explanation: isBothNegative
        ? `Tanda SAMA (negatif × negatif) menghasilkan bilangan POSITIF! ${aStr} × ${bStr} = +${ans}.`
        : `Tanda BERBEDA (positif × negatif) menghasilkan bilangan NEGATIF! ${aStr} × ${bStr} = ${ans}.`,
    };
  } else {
    // Division
    const divisor = pickRandom([-12, -9, -8, -7, -6, -5, -4, -3, 3, 4, 5, 6, 7, 8, 9, 12]);
    const quotient = pickRandom([-15, -12, -9, -8, -7, -6, 6, 7, 8, 9, 12, 15]);
    const dividend = divisor * quotient;

    const divStr = divisor < 0 ? `(${divisor})` : `${divisor}`;
    const dividendStr = dividend < 0 ? `(${dividend})` : `${dividend}`;
    const isBothNegative = dividend < 0 && divisor < 0;

    return {
      id: qId,
      category: 'perkalian_pembagian',
      questionText: `Berapakah hasil dari: ${dividendStr} : ${divStr} ?`,
      options: generateNumericOptions(quotient),
      correctAnswer: quotient,
      explanation: isBothNegative
        ? `Tanda SAMA (negatif : negatif) menghasilkan bilangan POSITIF! ${dividendStr} : ${divStr} = +${quotient}.`
        : `Tanda BERBEDA menghasilkan bilangan NEGATIF! ${dividendStr} : ${divStr} = ${quotient}.`,
    };
  }
}

// ==========================================
// 5. GENERATOR: OPERASI HITUNG CAMPURAN (KABATAKU)
// ==========================================
export function generateOperasiCampuranQuestion(): Question {
  const qId = `oc_${Date.now()}_${Math.random()}`;
  const templateType = pickRandom(['add_mult', 'sub_div', 'parentheses', 'mult_add_sub']);

  if (templateType === 'add_mult') {
    // a + b × (-c)
    const a = randInt(-30, 40);
    const b = randInt(2, 8);
    const c = randInt(-9, -2);
    const mult = b * c;
    const ans = a + mult;
    const aStr = a < 0 ? `(${a})` : `${a}`;

    return {
      id: qId,
      category: 'operasi_campuran',
      questionText: `Berapakah hasil dari: ${aStr} + ${b} × (${c}) ?`,
      options: generateNumericOptions(ans),
      correctAnswer: ans,
      explanation: `Dahulukan perkalian! 1) ${b} × (${c}) = ${mult}. 2) ${aStr} + (${mult}) = ${ans}.`,
    };
  }

  if (templateType === 'sub_div') {
    // a - b : (-c)
    const c = pickRandom([-6, -5, -4, -3, 3, 4, 5, 6]);
    const divRes = randInt(-10, 10);
    const b = divRes * c;
    const a = randInt(-25, 45);
    const ans = a - divRes;
    const aStr = a < 0 ? `(${a})` : `${a}`;
    const bStr = b < 0 ? `(${b})` : `${b}`;
    const cStr = c < 0 ? `(${c})` : `${c}`;

    return {
      id: qId,
      category: 'operasi_campuran',
      questionText: `Berapakah hasil dari: ${aStr} - ${bStr} : ${cStr} ?`,
      options: generateNumericOptions(ans),
      correctAnswer: ans,
      explanation: `Dahulukan pembagian! 1) ${bStr} : ${cStr} = ${divRes}. 2) ${aStr} - (${divRes}) = ${ans}.`,
    };
  }

  if (templateType === 'parentheses') {
    // (a - b) × c
    const a = randInt(-20, 20);
    const b = randInt(5, 25);
    const c = pickRandom([-6, -5, -4, 4, 5, 6]);
    const inner = a - b;
    const ans = inner * c;
    const aStr = a < 0 ? `(${a})` : `${a}`;
    const cStr = c < 0 ? `(${c})` : `${c}`;

    return {
      id: qId,
      category: 'operasi_campuran',
      questionText: `Berapakah hasil dari: (${aStr} - ${b}) × ${cStr} ?`,
      options: generateNumericOptions(ans),
      correctAnswer: ans,
      explanation: `Dahulukan operasi di dalam tanda kurung! 1) ${aStr} - ${b} = ${inner}. 2) ${inner} × ${cStr} = ${ans}.`,
    };
  }

  // mult_add_sub: a × b + c - d
  const a = pickRandom([-8, -7, -6, -5, 5, 6, 7, 8]);
  const b = pickRandom([-5, -4, -3, 3, 4, 5]);
  const c = randInt(-20, 30);
  const d = randInt(-15, 20);
  const mult = a * b;
  const ans = mult + c - d;
  const aStr = a < 0 ? `(${a})` : `${a}`;
  const bStr = b < 0 ? `(${b})` : `${b}`;
  const cStr = c < 0 ? `(${c})` : `${c}`;
  const dStr = d < 0 ? `(${d})` : `${d}`;

  return {
    id: qId,
    category: 'operasi_campuran',
    questionText: `Berapakah hasil dari: ${aStr} × ${bStr} + ${cStr} - ${dStr} ?`,
    options: generateNumericOptions(ans),
    correctAnswer: ans,
    explanation: `1) Kalikan: ${aStr} × ${bStr} = ${mult}. 2) Tambah: ${mult} + ${cStr} = ${mult + c}. 3) Kurang: ${mult + c} - ${dStr} = ${ans}.`,
  };
}

// ==========================================
// 6. GENERATOR: SOAL CERITA KONTEKSTUAL DUNIA NYATA
// ==========================================
export function generateSoalCeritaQuestion(): Question {
  const qId = `sc_${Date.now()}_${Math.random()}`;
  const templates = [
    'freezer',
    'submarine',
    'bird_fish',
    'city_temp',
    'elevator',
    'ice_melting',
    'quiz_score',
    'mountain_temp',
    'cave_diver',
  ];
  const type = pickRandom(templates);

  if (type === 'freezer') {
    const initialTemp = randInt(-12, -4);
    const rise = randInt(7, 18);
    const finalTemp = initialTemp + rise;

    return {
      id: qId,
      category: 'soal_cerita',
      questionText: `Suhu di dalam freezer awalnya ${initialTemp}°C. Karena listrik padam selama beberapa jam, suhu naik ${rise}°C. Berapakah suhu di dalam freezer sekarang?`,
      options: shuffle([`${finalTemp}°C`, `${-finalTemp}°C`, `${initialTemp - rise}°C`, `${finalTemp + 5}°C`]),
      correctAnswer: `${finalTemp}°C`,
      explanation: `Suhu awal ${initialTemp}°C, naik (+) ${rise}°C: ${initialTemp} + ${rise} = ${finalTemp}°C.`,
    };
  }

  if (type === 'submarine') {
    const depth = randInt(80, 250);
    const rise = randInt(30, 75);
    const finalDepth = -depth + rise;

    return {
      id: qId,
      category: 'soal_cerita',
      questionText: `Sebuah kapal selam berada di kedalaman ${depth} meter di bawah permukaan laut (-${depth} m). Kemudian kapal tersebut naik sejauh ${rise} meter. Di posisi berapakah kapal selam berada sekarang?`,
      options: shuffle([`${finalDepth} m`, `${-depth - rise} m`, `${Math.abs(finalDepth)} m`, `${finalDepth - 20} m`]),
      correctAnswer: `${finalDepth} m`,
      explanation: `Kedalaman awal -${depth} m. Naik (+) ${rise} m: -${depth} + ${rise} = ${finalDepth} m (${Math.abs(finalDepth)} meter di bawah laut).`,
    };
  }

  if (type === 'bird_fish') {
    const birdHeight = randInt(12, 35);
    const fishDepth = randInt(5, 20);
    const distance = birdHeight + fishDepth;

    return {
      id: qId,
      category: 'soal_cerita',
      questionText: `Seekor burung elang terbang di ketinggian ${birdHeight} m di atas permukaan laut. Seekor ikan berenang di kedalaman ${fishDepth} m di bawah permukaan laut. Berapakah jarak vertikal antara burung dan ikan?`,
      options: shuffle([`${distance} m`, `${birdHeight - fishDepth} m`, `${-distance} m`, `${distance + 5} m`]),
      correctAnswer: `${distance} m`,
      explanation: `Jarak vertikal dihitung dari posisi tertinggi dikurangi terendah: ${birdHeight} - (-${fishDepth}) = ${birdHeight} + ${fishDepth} = ${distance} meter.`,
    };
  }

  if (type === 'city_temp') {
    const coldCity = pickRandom(['Moskow', 'London', 'Tokyo', 'Seoul']);
    const warmCity = pickRandom(['Jakarta', 'Surabaya', 'Denpasar', 'Medan']);
    const coldTemp = randInt(-8, -2);
    const warmTemp = randInt(28, 35);
    const diff = warmTemp - coldTemp;

    return {
      id: qId,
      category: 'soal_cerita',
      questionText: `Suhu udara di kota ${coldCity} adalah ${coldTemp}°C, sedangkan suhu di kota ${warmCity} adalah ${warmTemp}°C. Berapakah selisih suhu antara kedua kota tersebut?`,
      options: shuffle([`${diff}°C`, `${warmTemp + coldTemp}°C`, `${-diff}°C`, `${diff - 4}°C`]),
      correctAnswer: `${diff}°C`,
      explanation: `Selisih = Suhu tertinggi - Suhu terendah: ${warmTemp} - (${coldTemp}) = ${warmTemp} + ${Math.abs(coldTemp)} = ${diff}°C.`,
    };
  }

  if (type === 'elevator') {
    const startFloor = randInt(4, 9);
    const drop = randInt(startFloor + 2, startFloor + 5);
    const basementFloor = startFloor - drop; // e.g. -2 or -3

    return {
      id: qId,
      category: 'soal_cerita',
      questionText: `Rian naik lift dari lantai ${startFloor}. Lalu ia turun sebanyak ${drop} lantai menuju tempat parkir bawah tanah. Di lantai berapakah Rian sekarang?`,
      options: shuffle([
        `Lantai ${basementFloor} (B${Math.abs(basementFloor)})`,
        `Lantai ${Math.abs(basementFloor)}`,
        `Lantai ${startFloor + drop}`,
        `Lantai -1`
      ]),
      correctAnswer: `Lantai ${basementFloor} (B${Math.abs(basementFloor)})`,
      explanation: `Posisi awal ${startFloor}. Turun ${drop} lantai: ${startFloor} - ${drop} = ${basementFloor} (Basement ${Math.abs(basementFloor)}).`,
    };
  }

  if (type === 'ice_melting') {
    const initialTemp = randInt(-15, -6);
    const rate = pickRandom([2, 3]);
    const intervals = randInt(3, 5);
    const totalMinutes = intervals * 3;
    const finalTemp = initialTemp + intervals * rate;

    return {
      id: qId,
      category: 'soal_cerita',
      questionText: `Sebuah balok es bersuhu ${initialTemp}°C dikeluarkan. Setiap 3 menit suhunya naik ${rate}°C. Berapakah suhu es batu tersebut setelah ${totalMinutes} menit?`,
      options: shuffle([`${finalTemp}°C`, `${initialTemp + rate}°C`, `${-finalTemp}°C`, `${finalTemp - 5}°C`]),
      correctAnswer: `${finalTemp}°C`,
      explanation: `Dalam ${totalMinutes} menit ada: ${totalMinutes} : 3 = ${intervals} kali kenaikan. Kenaikan suhu = ${intervals} × ${rate}°C = ${intervals * rate}°C. Suhu akhir = ${initialTemp} + ${intervals * rate} = ${finalTemp}°C.`,
    };
  }

  if (type === 'quiz_score') {
    const student = pickRandom(['Budi', 'Siti', 'Edo', 'Lina', 'Doni']);
    const correctCount = randInt(6, 9);
    const wrongCount = randInt(2, 4);
    // Score rule: Correct = +4, Wrong = -2
    const score = correctCount * 4 + wrongCount * (-2);

    return {
      id: qId,
      category: 'soal_cerita',
      questionText: `Dalam lomba matematika, setiap jawaban benar bernilai 4 dan salah bernilai -2. Jika ${student} menjawab ${correctCount} soal benar dan ${wrongCount} soal salah, berapakah total nilai ${student}?`,
      options: generateNumericOptions(score).map((s) => `${s} poin`),
      correctAnswer: `${score} poin`,
      explanation: `Nilai benar: ${correctCount} × 4 = ${correctCount * 4}. Nilai salah: ${wrongCount} × (-2) = ${wrongCount * (-2)}. Total nilai: ${correctCount * 4} + (${wrongCount * (-2)}) = ${score} poin.`,
    };
  }

  if (type === 'mountain_temp') {
    const dayTemp = randInt(10, 16);
    const drop = randInt(14, 20);
    const nightTemp = dayTemp - drop;

    return {
      id: qId,
      category: 'soal_cerita',
      questionText: `Suhu udara di lereng gunung pada siang hari adalah ${dayTemp}°C. Menjelang malam hari suhu turun drastis sebesar ${drop}°C. Berapakah suhu udara saat malam hari?`,
      options: shuffle([`${nightTemp}°C`, `${dayTemp + drop}°C`, `${Math.abs(nightTemp)}°C`, `${nightTemp - 3}°C`]),
      correctAnswer: `${nightTemp}°C`,
      explanation: `Suhu siang ${dayTemp}°C, turun (-) ${drop}°C: ${dayTemp} - ${drop} = ${nightTemp}°C.`,
    };
  }

  // Cave diver fallback
  const startDepth = randInt(15, 30);
  const extraDepth = randInt(8, 20);
  const totalDepth = -(startDepth + extraDepth);

  return {
    id: qId,
    category: 'soal_cerita',
    questionText: `Seorang penyelam mula-mula berada di kedalaman ${startDepth} m di bawah permukaan laut (-${startDepth} m). Kemudian ia menyelam lagi sedalam ${extraDepth} m lebih jauh. Di kedalaman berapa meter ia sekarang?`,
    options: shuffle([`${totalDepth} m`, `${startDepth - extraDepth} m`, `${Math.abs(totalDepth)} m`, `${totalDepth + 5} m`]),
    correctAnswer: `${totalDepth} m`,
    explanation: `Posisi awal -${startDepth} m. Menyelam lebih dalam berarti bertambah negatif: -${startDepth} + (-${extraDepth}) = ${totalDepth} m (${Math.abs(totalDepth)} meter di bawah permukaan laut).`,
  };
}

// Master generator dispatch by category
export function generateQuestionForCategory(category: MathCategory): Question {
  switch (category) {
    case 'garis_bilangan':
      return generateGarisBilanganQuestion();
    case 'penjumlahan':
      return generatePenjumlahanQuestion();
    case 'pengurangan':
      return generatePenguranganQuestion();
    case 'perkalian_pembagian':
      return generatePerkalianPembagianQuestion();
    case 'operasi_campuran':
      return generateOperasiCampuranQuestion();
    case 'soal_cerita':
      return generateSoalCeritaQuestion();
    default:
      return generatePenjumlahanQuestion();
  }
}

// Helper to get fresh non-repeating question for a battle
export function getFreshBattleQuestion(
  category: MathCategory,
  usedSignatures: Set<string>
): Question {
  let attempts = 0;
  while (attempts < 20) {
    const q = generateQuestionForCategory(category);
    const signature = `${q.category}_${q.questionText}`;
    if (!usedSignatures.has(signature)) {
      usedSignatures.add(signature);
      return q;
    }
    attempts++;
  }
  // Fallback if many generated
  const fallback = generateQuestionForCategory(category);
  usedSignatures.add(`${fallback.category}_${fallback.questionText}`);
  return fallback;
}
