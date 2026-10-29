import { LevelInfo } from '../types/game';

export const GAME_LEVELS: LevelInfo[] = [
  {
    levelNumber: 1,
    title: 'Hutan Garis Bilangan',
    subTitle: 'Pengenalan & Membandingkan Bilangan Bulat',
    topic: 'Garis Bilangan & Perbandingan',
    description: 'Pelajari konsep posisi bilangan bulat positif, nol, dan negatif pada garis bilangan serta membandingkan nilai.',
    category: 'garis_bilangan',
    backgroundTheme: 'forest',
    targetQuestions: 4,
    monster: {
      id: 'slime_lumut',
      level: 1,
      name: 'Slime Lumut Negatif',
      title: 'Penjaga Batas Kiri Hutan',
      lore: 'Makhluk kenyal yang sering menyembunyikan angka di sebelah kiri titik nol.',
      element: 'nature',
      maxHp: 80,
      attackPower: 14,
      attackSpeedSeconds: 15,
      goldReward: 60,
      expReward: 50,
      colorTheme: {
        primary: '#10b981',
        secondary: '#047857',
        glow: 'rgba(16, 185, 129, 0.4)',
      },
      taunts: [
        'Garis bilangan ini milikku! Semakin ke kiri nilainya semakin kecil!',
        'Tahukah kamu angka -5 itu lebih kecil daripada 2?',
        'Buktikan kamu paham letak nol!'
      ],
      victoryCry: 'Aduh! Kamu ternyata paham betul letak bilangan bulat!'
    }
  },
  {
    levelNumber: 2,
    title: 'Gua Kristal Penjumlahan',
    subTitle: 'Penjumlahan Bilangan Bulat',
    topic: 'Penjumlahan (+ dan -)',
    description: 'Hadapi kristal es dengan menjumlahkan bilangan positif dan negatif menggunakan logika uang dan hutang.',
    category: 'penjumlahan',
    backgroundTheme: 'crystal_cave',
    targetQuestions: 4,
    monster: {
      id: 'golem_es',
      level: 2,
      name: 'Golemit Kristal Minus',
      title: 'Penjaga Gua Beku',
      lore: 'Tubuhnya tersusun dari serpihan es negatif bersuhu dingin menusuk tulang.',
      element: 'ice',
      maxHp: 120,
      attackPower: 18,
      attackSpeedSeconds: 14,
      goldReward: 85,
      expReward: 80,
      colorTheme: {
        primary: '#38bdf8',
        secondary: '#0284c7',
        glow: 'rgba(56, 189, 248, 0.4)',
      },
      taunts: [
        'Hawa dingin membekukan! Jika punya 10 lalu hutang 15, sisamu berapa?',
        'Minus ditambah minus hasilnya makin minus!',
        'Pertahanan kristalku kokoh terhadap jawaban yang ragu!'
      ],
      victoryCry: 'Kristal bekuku meleleh oleh kehangatan jawaban benarmu!'
    }
  },
  {
    levelNumber: 3,
    title: 'Rawa Kabut Pengurangan',
    subTitle: 'Pengurangan Bilangan Bulat & Aturan Tanda',
    topic: 'Pengurangan & Negatif Berhadapan',
    description: 'Pelajari trik ajaib: Pengurangan dengan bilangan negatif sama dengan penjumlahan (-(-a) = +a).',
    category: 'pengurangan',
    backgroundTheme: 'misty_swamp',
    targetQuestions: 4,
    monster: {
      id: 'serigala_rawa',
      level: 3,
      name: 'Serigala Bayangan Rawa',
      title: 'Peneror Kabut Hitam',
      lore: 'Serigala licik yang suka membalik tanda hitung untuk mengecoh para pengembara.',
      element: 'dark',
      maxHp: 165,
      attackPower: 22,
      attackSpeedSeconds: 13,
      goldReward: 110,
      expReward: 120,
      colorTheme: {
        primary: '#a855f7',
        secondary: '#7e22ce',
        glow: 'rgba(168, 85, 247, 0.4)',
      },
      taunts: [
        'Awas terperangkap kabut! Ingat rumus minus bertemu minus?',
        '10 - (-5) bukan 5 lho! Apa kamu bisa menebaknya?',
        'Langkahmu akan tersendat dalam rawa pengurangan ini!'
      ],
      victoryCry: 'Auuu! Trik tanda negatif gandaku telah kamu patahkan!'
    }
  },
  {
    levelNumber: 4,
    title: 'Gunung Vulkanik Perkalian',
    subTitle: 'Perkalian & Pembagian Bilangan Bulat',
    topic: 'Perkalian & Pembagian (+ × - , - × -)',
    description: 'Kuasai aturan tanda: tanda sama hasilnya positif (+), tanda beda hasilnya negatif (-).',
    category: 'perkalian_pembagian',
    backgroundTheme: 'volcano',
    targetQuestions: 4,
    monster: {
      id: 'naga_api',
      level: 4,
      name: 'Naga Lahar Pyros',
      title: 'Penguasa Api Kawah',
      lore: 'Naga perkasa bersisik magma yang menguji ketelitian perkalian dan pembagian cepat.',
      element: 'fire',
      maxHp: 215,
      attackPower: 26,
      attackSpeedSeconds: 12,
      goldReward: 140,
      expReward: 160,
      colorTheme: {
        primary: '#f97316',
        secondary: '#c2410c',
        glow: 'rgba(249, 115, 22, 0.4)',
      },
      taunts: [
        'Semburan api membara! Negatif kali negatif menghasilkan positif!',
        'Berapa hasil (-8) dikali 6? Jangan sampai hangus terbakar!',
        'Pembagian bilangan bulat adalah kunci untuk meredam apiku!'
      ],
      victoryCry: 'Kekuatan apiku padam oleh kecerdasan perkalianmu!'
    }
  },
  {
    levelNumber: 5,
    title: 'Kuil Kuno KABATAKU',
    subTitle: 'Operasi Hitung Campuran Bilangan Bulat',
    topic: 'Urutan KaBaTaKu & Tanda Kurung',
    description: 'Aturan tingkatan: Tanda kurung dahulu, lalu Kali & Bagi dari kiri, baru Tambah & Kurang.',
    category: 'operasi_campuran',
    backgroundTheme: 'ancient_shrine',
    targetQuestions: 5,
    monster: {
      id: 'ksatria_zirah',
      level: 5,
      name: 'Ksatria Zirah Kuno',
      title: 'Panglima Benteng KABATAKU',
      lore: 'Pelindung kuil legendaris yang hanya bisa dikalahkan dengan urutan operasi matematika yang tepat.',
      element: 'metal',
      maxHp: 270,
      attackPower: 30,
      attackSpeedSeconds: 12,
      goldReward: 180,
      expReward: 210,
      colorTheme: {
        primary: '#eab308',
        secondary: '#ca8a04',
        glow: 'rgba(234, 179, 8, 0.4)',
      },
      taunts: [
        'Jangan gegabah! Dahulukan perkalian sebelum penjumlahan!',
        'Selesaikan operasi di dalam tanda kurung terlebih dahulu!',
        'Zirah bajaku hanya bisa retak oleh operasi hitung yang disiplin!'
      ],
      victoryCry: 'Zirahku hancur! Kamu adalah ahli sejati urutan operasi campuran!'
    }
  },
  {
    levelNumber: 6,
    title: 'Puncak Menara Soal Cerita',
    subTitle: 'Aplikasi Kontekstual Dunia Nyata (Boss Akhir)',
    topic: 'Soal Cerita Suhu, Kedalaman Laut & Selisih',
    description: 'Hadapi Raja Terakhir dengan memecahkan persoalan sehari-hari: suhu freezer, kapal selam, dan lift gedung.',
    category: 'soal_cerita',
    backgroundTheme: 'sky_tower',
    targetQuestions: 5,
    monster: {
      id: 'kaisar_void',
      level: 6,
      name: 'Kaisar Nol Abadi',
      title: 'Penguasa Dimensi Bilangan Bulat',
      lore: 'Penguasa tertinggi yang mengendalikan seluruh dimensi angka positif dan negatif di alam semesta.',
      element: 'cosmic',
      maxHp: 340,
      attackPower: 35,
      attackSpeedSeconds: 11,
      goldReward: 250,
      expReward: 300,
      colorTheme: {
        primary: '#ec4899',
        secondary: '#be185d',
        glow: 'rgba(236, 72, 153, 0.4)',
      },
      taunts: [
        'Akulah suhu terdingin di kutub dan kedalaman palung samudra!',
        'Bisakah kau menghitung selisih suhu antara 32°C dan -5°C?',
        'Taklukkan teka-teki duniaku jika ingin lulus sebagai Pendekar Utama!'
      ],
      victoryCry: 'Luar biasa! Kamu telah menguasai seluruh konsep bilangan bulat kelas 6 SD!'
    }
  }
];
