(() => {
  const canvas = document.querySelector('#game-canvas');
  const ctx = canvas.getContext('2d');
  const arena = canvas.parentElement;
  const app = document.querySelector('.app');
  const toastNode = document.querySelector('#toast');
  const startButton = document.querySelector('#start-button');
  const resultScreen = document.querySelector('#result-screen');
  const soundButton = document.querySelector('#sound-button');
  const iconShapes = {
    bao: '<path d="M7 27c0-9 7-16 17-16s17 7 17 16c0 8-7 13-17 13S7 35 7 27Z" fill="#fff5dc"/><path d="M8 26c4-2 7-5 9-10m14 0c2 5 5 8 9 10M13 32c7 4 15 4 22 0"/><circle cx="19" cy="25" r="1.5" fill="currentColor"/><circle cx="29" cy="25" r="1.5" fill="currentColor"/><path d="M21 30q3 3 6 0"/>',
    rabbit: '<path d="M16 19 12 5q-1-4 3-2l9 14m1 0 8-14q3-3 4 1l-3 16" fill="#fff5dc"/><path d="M9 29c0-8 6-13 15-13s15 5 15 13-6 12-15 12S9 37 9 29Z" fill="#fff5dc"/><circle cx="19" cy="28" r="1.5"/><circle cx="29" cy="28" r="1.5"/><path d="M21 33q3 3 6 0"/>',
    cat: '<path d="m11 20-1-12 12 7m5 0 12-7-1 12" fill="#fff5dc"/><path d="M9 29c0-8 6-13 15-13s15 5 15 13-6 12-15 12S9 37 9 29Z" fill="#fff5dc"/><circle cx="19" cy="28" r="1.5"/><circle cx="29" cy="28" r="1.5"/><path d="M21 33q3 3 6 0m-9-1-7 2m25-2 7 2"/>',
    fox: '<path d="m10 19 2-12 12 7 12-7 2 12" fill="#ffc99d"/><path d="M9 29c0-8 6-13 15-13s15 5 15 13-6 12-15 12S9 37 9 29Z" fill="#fff5dc"/><path d="m19 32 5-4 5 4-5 5Z" fill="#e66c7d"/><circle cx="18" cy="26" r="1.5"/><circle cx="30" cy="26" r="1.5"/>',
    coin: '<circle cx="24" cy="24" r="17" fill="#ffd45c"/><circle cx="24" cy="24" r="12"/><path d="m24 15 3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1Z" fill="#fffdf6"/>',
    gem: '<path d="m24 5 14 9-14 29L10 14Z" fill="#c3b3ff"/><path d="m10 14 14 2 14-2M24 16v27"/>',
    home: '<path d="m5 23 19-16 19 16v18H28V29h-8v12H5Z" fill="#ffd45c"/><path d="M3 24 24 6l21 18"/>',
    shop: '<path d="M8 18h32l-3 24H11Z" fill="#ffb9c8"/><path d="M16 18v-5a8 8 0 0 1 16 0v5M8 24h32M19 31h10"/>',
    palette: '<path d="M24 6a18 18 0 1 0 0 36h3a5 5 0 0 0 3-9c-2-2-1-5 2-5h4a6 6 0 0 0 6-6A18 18 0 0 0 24 6Z" fill="#ffb9c8"/><circle cx="15" cy="20" r="2"/><circle cx="22" cy="13" r="2"/><circle cx="31" cy="15" r="2"/>',
    cloud: '<path d="M12 36a8 8 0 0 1-1-16 13 13 0 0 1 25 3 7 7 0 0 1-1 13Z" fill="#d6ccff"/>',
    sound: '<path d="M8 20h8l10-8v24l-10-8H8Z" fill="#ffd45c"/><path d="M31 18q8 6 0 12m4-17q13 11 0 22"/>',
    mute: '<path d="M8 20h8l10-8v24l-10-8H8Z" fill="#d7d3e1"/><path d="m32 20 10 10m0-10L32 30"/>',
    star: '<path d="m24 5 6 12 13 2-10 9 2 13-11-6-12 6 3-13-10-9 13-2Z" fill="#ffd45c"/>',
    lock: '<rect x="9" y="21" width="30" height="22" rx="4" fill="#d7d3e1"/><path d="M16 21v-7a8 8 0 0 1 16 0v7m-8 9v5"/>',
    gift: '<path d="M6 20h36v23H6Z" fill="#ffb9c8"/><path d="M24 20v23M6 27h36M24 20H12a5 5 0 1 1 5-5c0 3 3 5 7 5Zm0 0h12a5 5 0 1 0-5-5c0 3-3 5-7 5Z"/>',
    toolbox: '<path d="M6 18h36v24H6Z" fill="#a9e6f2"/><path d="M16 18v-6h16v6M6 27h36m-22 0v6h8v-6"/>',
    clock: '<circle cx="24" cy="25" r="17" fill="#fff5dc"/><path d="M24 14v12l8 5M18 5h12"/>',
    mitten: '<path d="M13 39c-4-5-7-11-8-18-.6-4 4-5 6-1l4 7L13 8c0-4 6-4 6 0l2 15V6c0-4 6-4 6 0v17l2-12c.6-4 6-3 6 1l-1 14c-.3 6-3 11-7 14Z" fill="#ffb9c8"/>',
    purse: '<path d="M9 18h30l3 24H6Z" fill="#ffb9c8"/><path d="M15 18q0-9 9-9t9 9m-9 8v8m-4-4h8"/>',
    bubble: '<circle cx="23" cy="22" r="15" fill="#a9e6f2"/><path d="m15 34-4 9 11-6m7-20 1-4m8 10 4-1M13 15l-3-3"/><circle cx="19" cy="21" r="2"/>',
    pepper: '<path d="M17 15q2-7 10-8m-2 5c2-5 7-5 10-2-4 1-5 4-5 7 9 8 8 20-2 25-9 5-22-2-21-13 1-7 5-11 10-14Z" fill="#ff6c59"/>',
    teapot: '<path d="M11 21h22a9 9 0 0 1 0 18H16a8 8 0 0 1-5-18Zm22 4h6q6 0 3 6l-7 3M18 20q-2-7 4-9t6 9m-4-9V6" fill="#c8f2dd"/>',
    moon: '<path d="M34 8a18 18 0 1 0 7 28A19 19 0 0 1 34 8Z" fill="#c3b3ff"/><path d="m13 12 1-4m-8 12-4-1m12 22-2 4"/>',
    sun: '<circle cx="24" cy="24" r="10" fill="#ffd45c"/><path d="M24 3v7m0 28v7M3 24h7m28 0h7M9 9l5 5m20 20 5 5m0-30-5 5M14 34l-5 5"/>',
    glove: '<path d="M11 39c-3-4-5-10-5-16 0-4 5-5 7-1l3 5V9c0-5 7-5 7 0v14-17c0-5 7-5 7 0v18-13c0-5 7-5 7 0v17c0 9-6 15-15 15Z" fill="#c8f2dd"/>',
    puff: '<path d="M13 37a8 8 0 0 1-1-16 12 12 0 0 1 23 3 7 7 0 0 1-1 13Z" fill="#d6ccff"/><path d="m24 13 1-5"/>',
    rainbow: '<path d="M7 37a17 17 0 0 1 34 0M13 37a11 11 0 0 1 22 0M19 37a5 5 0 0 1 10 0"/><path d="M6 12v7m-3-3h6m33 10v7m-3-3h6"/>',
    heart: '<path d="M24 41 8 25C-2 13 13 3 24 15 35 3 50 13 40 25Z" fill="#ffb9c8"/>',
    clover: '<circle cx="18" cy="17" r="7" fill="#c8f2dd"/><circle cx="30" cy="17" r="7" fill="#c8f2dd"/><circle cx="18" cy="29" r="7" fill="#c8f2dd"/><circle cx="30" cy="29" r="7" fill="#c8f2dd"/><path d="m24 24 5 17"/>',
    bed: '<path d="M7 38V13m0 17h34v8M7 24h11a7 7 0 0 1 7 7m0 0V20h10a6 6 0 0 1 6 6v5"/><path d="M11 18h7v6h-7Z" fill="#c3b3ff"/>',
    lotus: '<path d="M24 39C10 37 4 28 7 19c8 1 13 7 17 20Zm0 0c-3-14 1-26 8-32 7 7 8 19-8 32Zm0 0c4-13 11-19 19-20 2 9-4 18-19 20Z" fill="#ffb9c8"/>',
    sprout: '<path d="M24 41V22m0 8C11 31 8 23 9 15c9-1 15 4 15 15Zm0-6c0-9 6-14 15-14 0 9-6 14-15 14Z" fill="#c8f2dd"/>',
    fan: '<path d="M24 25 7 12q-4-3 0-6 10-4 17 19ZM24 25l-2-21q0-5 5-4 10 5 3 25Zm0 0L39 9q4-3 6 2 0 11-21 14Zm0 0 17 12q4 3 0 6-10 4-17-18Zm0 0 2 21q0 5-5 4-10-5-3-25Z" fill="#ffd45c"/><circle cx="24" cy="25" r="4" fill="#ff6c59"/>',
    ice: '<path d="M24 5v38M8 14l32 20M8 34l32-20M19 10l5 5 5-5m-10 28 5-5 5 5M9 21l7 1-2-7m25 18-7-1 2 7M9 27l7-1-2 7m25-18-7 1 2-7"/>',
    calm: '<circle cx="24" cy="24" r="18" fill="#c8f2dd"/><path d="M14 25q10 12 20 0m-15-6h.1m10 0h.1M24 8v5"/>',
    snow: '<path d="M24 5v38M8 14l32 20M8 34l32-20m-21-3 5 5 5-5m-10 31 5-5 5 5M6 21l7 1-2-7m31 18-7-1 2 7M6 27l7-1-2 7m31-18-7 1 2-7"/>',
    berry: '<path d="M14 15q10-8 20 0c4 5-2 21-10 27-8-6-14-22-10-27Z" fill="#ffb9c8"/><path d="M24 14q-1-8 7-9m-18 7 3-2m9 8v1m5 5v1m-9 4v1"/>',
    matcha: '<path d="M24 41V10m0 20c-11 0-15-6-15-14 9-1 15 4 15 14Zm0-6c0-9 6-14 15-14 0 9-6 14-15 14Z" fill="#c8f2dd"/>',
    blueberry: '<circle cx="24" cy="26" r="15" fill="#a9e6f2"/><path d="m18 12 6 4 6-4m-16 5 6 4m14-4-6 4"/>',
    confetti: '<path d="m10 11 6-5 4 9-7 3Zm21-3 8 3-5 9-7-4ZM9 33l2-9 9 4-4 8Zm25 7-7-5 7-7 6 6Z" fill="#ffd45c"/>',
    peach: '<path d="M24 15c-13-7-23 7-14 20 5 8 14 8 14 4 0 4 9 4 14-4 9-13-1-27-14-20Z" fill="#ffc99d"/><path d="M24 16q-1-9 8-11m-8 11q-4-6-10-4"/>',
    citrus: '<path d="M24 8c14 0 22 12 16 25-6 12-26 12-32 0C2 20 10 8 24 8Z" fill="#f8ed83"/><path d="M24 8q1-6 8-5m-8 5v6m0 0-7 6m7-6 7 6m-7-6v10"/>',
    cocoa: '<path d="M13 8h22v32H13Z" fill="#bf9079"/><path d="M18 8v32m12-32v32M13 17h22m-22 12h22"/>',
    galaxy: '<path d="m24 5 4 13 14 1-11 8 4 14-11-8-11 8 4-14-11-8 14-1Z" fill="#c3b3ff"/><circle cx="8" cy="9" r="2" fill="#ffd45c"/><circle cx="40" cy="35" r="2" fill="#ffb9c8"/>',
    cloudSkin: '<path d="M11 36a8 8 0 0 1-1-16 14 14 0 0 1 26 3 7 7 0 0 1-1 13Z" fill="#d6ccff"/><path d="M16 29h16"/>',
    sparkle: '<path d="m24 4 4 15 15 5-15 5-4 15-5-15-15-5 15-5Z" fill="#ffd45c"/><path d="m39 4 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#ffb9c8"/>',
    trophy: '<path d="M13 8h22v12a11 11 0 0 1-22 0Zm0 5H6v5q0 9 12 9m17-14h7v5q0 9-12 9m-6 4v7m-9 0h18" fill="#ffd45c"/>',
    sad: '<circle cx="24" cy="24" r="18" fill="#fff5dc"/><circle cx="18" cy="21" r="1.7"/><circle cx="30" cy="21" r="1.7"/><path d="M17 33q7-9 14 0"/>',
    breeze: '<path d="M7 17h24q8 0 6-7-2-5-7-2M5 24h34q7 0 5 7-2 5-7 2M9 31h16"/>'
  };
  function iconSvg(name, className = '') {
    return `<svg class="icon-svg ${className}" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${iconShapes[name] || iconShapes.sparkle}</svg>`;
  }
  try {
    for (const key of ['squishy-bao-save', 'squishy-bao-best', 'squishy-bao-sound']) localStorage.removeItem(key);
  } catch {}
  const skinPalettes = [
    { name: 'Classic', icon: 'bao', color: '#fff5dc', accent: '#f49b8d', pattern: 'plain' },
    { name: 'Berry', icon: 'berry', color: '#ffb9c8', accent: '#e66c7d', pattern: 'seeds' },
    { name: 'Matcha', icon: 'matcha', color: '#addf9d', accent: '#579568', pattern: 'leaf' },
    { name: 'Blueberry', icon: 'blueberry', color: '#a9e6f2', accent: '#5486bc', pattern: 'dots' },
    { name: 'Confetti', icon: 'confetti', color: '#ffe07b', accent: '#ff786c', pattern: 'sprinkles' },
    { name: 'Peach', icon: 'peach', color: '#ffc99d', accent: '#ed806c', pattern: 'dots' },
    { name: 'Citrus', icon: 'citrus', color: '#f8ed83', accent: '#d69b39', pattern: 'seeds' },
    { name: 'Cocoa', icon: 'cocoa', color: '#bf9079', accent: '#795447', pattern: 'sprinkles' },
    { name: 'Cloud', icon: 'cloudSkin', color: '#d6ccff', accent: '#8171cc', pattern: 'stars' },
    { name: 'Galaxy', icon: 'galaxy', color: '#8e83cc', accent: '#f49cc9', pattern: 'stars' }
  ];
  const skinForms = [
    { name: 'Bao', icon: 'bao' },
    { name: 'Mallow', icon: 'bao' },
    { name: 'Mochi', icon: 'rabbit' },
    { name: 'Puff', icon: 'cat' },
    { name: 'Dumpling', icon: 'fox' }
  ];
  const skinCatalog = skinPalettes.flatMap((palette, paletteIndex) => skinForms.map((form, formIndex) => {
    const number = paletteIndex * skinForms.length + formIndex + 1;
    return {
      id: `skin-${String(number).padStart(2, '0')}`,
      name: `${palette.name} ${form.name}`,
      icon: palette.icon,
      formIcon: form.icon,
      color: palette.color,
      accent: palette.accent,
      pattern: palette.pattern,
      rarity: number % 5 === 0 ? 'rare' : 'common'
    };
  }));
  const featureCatalog = [
    { id: 'long-steam', name: 'Extra Steam', icon: 'clock', description: 'Start each stage with 5 extra seconds.', effect: { secondsBonus: 5 } },
    { id: 'big-squish', name: 'Squish Mitts', icon: 'mitten', description: 'A bigger tap zone makes buns easier to pop.', effect: { tapBonus: 11 } },
    { id: 'coin-purse', name: 'Lucky Apron', icon: 'purse', description: 'Earn 25% more coins when you clear a stage.', effect: { coinBonus: 0.25 } },
    { id: 'streak-shield', name: 'Streak Bubble', icon: 'bubble', description: 'Keep your streak through one missed bun.', effect: { missProtection: 1 } },
    { id: 'chili-shield', name: 'Chili Mitt', icon: 'pepper', description: 'Spicy buns cost less time.', effect: { bombPenaltyReduction: 2 } },
    ...[
      ['mint-tea', 'Mint Tea Flask', 'teapot', 'Bring 1 extra second to every level.', { secondsBonus: 1 }],
      ['berry-watch', 'Berry Watch', 'clock', 'Bring 2 extra seconds to every level.', { secondsBonus: 2 }],
      ['moon-timer', 'Moon Timer', 'moon', 'Bring 3 extra seconds to every level.', { secondsBonus: 3 }],
      ['sun-clock', 'Sunshine Clock', 'sun', 'Bring 4 extra seconds to every level.', { secondsBonus: 4 }],
      ['jelly-gloves', 'Jelly Gloves', 'glove', 'Make your squish zone a little wider.', { tapBonus: 4 }],
      ['puffy-palms', 'Puffy Palms', 'puff', 'Give every tap a little extra reach.', { tapBonus: 6 }],
      ['star-mitts', 'Star Mitts', 'star', 'Make bun tapping easier.', { tapBonus: 8 }],
      ['rainbow-mitts', 'Rainbow Mitts', 'rainbow', 'Give your squish zone a big boost.', { tapBonus: 10 }],
      ['copper-apron', 'Copper Apron', 'heart', 'Earn a few extra coins on wins.', { coinBonus: 0.05 }],
      ['coin-sprinkle', 'Coin Sprinkle', 'sparkle', 'Earn more coins on wins.', { coinBonus: 0.08 }],
      ['lucky-napkin', 'Lucky Napkin', 'berry', 'Add a coin bonus to clear rewards.', { coinBonus: 0.1 }],
      ['golden-crumbs', 'Golden Crumbs', 'star', 'Earn the biggest apron bonus.', { coinBonus: 0.12 }],
      ['bubble-buddy', 'Bubble Buddy', 'bubble', 'Save your streak once when a bun escapes.', { missProtection: 1 }],
      ['pillow-promise', 'Pillow Promise', 'bed', 'Get a second streak save.', { missProtection: 2 }],
      ['soft-landing', 'Soft Landing', 'lotus', 'Protect your streak from two misses.', { missProtection: 2 }],
      ['safety-sprout', 'Safety Sprout', 'sprout', 'Save your streak once per round.', { missProtection: 1 }],
      ['cooling-fan', 'Cooling Fan', 'fan', 'See fewer chili bombs.', { bombChanceReduction: 0.025 }],
      ['frosty-tray', 'Frosty Tray', 'ice', 'Cool the kitchen and reduce hazards.', { bombChanceReduction: 0.04 }],
      ['calm-kitchen', 'Calm Kitchen', 'calm', 'Make spicy surprises less common.', { bombChanceReduction: 0.055 }],
      ['snowy-steamer', 'Snowy Steamer', 'snow', 'Chill the kitchen and slow down buns.', { bombChanceReduction: 0.07, targetLifeBonus: 0.12 }]
    ].map(([id, name, icon, description, effect]) => ({ id, name, icon, description, effect }))
  ];
  const chapters = ['Steam Garden', 'Berry Boardwalk', 'Cloud Kitchen', 'Rainbow Market', 'Moonlight Picnic', 'Sugar-Star Summit', 'Bubble Bay', 'Gummy Grove', 'Sprinkle Station', 'Dreamy Dessertland', 'Pudding Pier', 'Lollipop Lane', 'Jellyfish Junction', 'Marshmallow Meadow', 'Cherry Blossom Hill', 'Waffle Woods', 'Coconut Cove', 'Peppermint Plaza', 'Fizzy Soda Springs', 'Caramel Canyon', 'Cookie Castle', 'Popsicle Peaks', 'Toffee Town', 'Starlight Bakery', 'Big Bao Bonanza'];
  const levelsPerCategory = 20;
  const maxLevel = 500;
  const giftCost = 120;
  const rareSkinGiftCost = 3;
  const featureGiftCost = 190;
  const legacySkinIds = { classic: 'skin-01', strawberry: 'skin-06', matcha: 'skin-11', blueberry: 'skin-16', rainbow: 'skin-21', cloud: 'skin-41' };
  const defaultState = {
    schemaVersion: 1,
    contentVersion: 3,
    coins: 250,
    diamonds: 5,
    bestScore: 0,
    unlockedLevel: 1,
    selectedLevel: 1,
    completedLevels: [],
    ownedSkins: ['skin-01'],
    selectedSkins: ['skin-01'],
    ownedFeatures: [],
    selectedFeatures: []
  };

  function uniqueKnown(items, catalog) {
    return [...new Set(Array.isArray(items) ? items.filter(id => catalog.some(item => item.id === id)) : [])];
  }

  function normalizeSkinIds(items) {
    return uniqueKnown(Array.isArray(items) ? items.map(id => legacySkinIds[id] || id) : [], skinCatalog);
  }

  function loadState(saved = null) {
    try {
      if (!saved || saved.schemaVersion !== 1) return { ...defaultState, completedLevels: [], ownedSkins: ['skin-01'], selectedSkins: ['skin-01'], ownedFeatures: [], selectedFeatures: [] };
      const ownedSkins = normalizeSkinIds(saved.ownedSkins);
      if (!ownedSkins.includes('skin-01')) ownedSkins.unshift('skin-01');
      const ownedFeatures = uniqueKnown(saved.ownedFeatures, featureCatalog);
      const selectedSkins = normalizeSkinIds(saved.selectedSkins).filter(id => ownedSkins.includes(id)).slice(0, 5);
      const selectedFeatures = uniqueKnown(saved.selectedFeatures, featureCatalog).filter(id => ownedFeatures.includes(id)).slice(0, 3);
      return {
        ...defaultState,
        ...saved,
        contentVersion: 3,
        coins: Math.max(0, Number(saved.coins) || 0),
        diamonds: Math.max(0, Number(saved.diamonds) || 0),
        bestScore: Math.max(defaultState.bestScore, Number(saved.bestScore) || 0),
        unlockedLevel: Math.max(1, Math.min(saved.contentVersion >= 3 ? maxLevel : saved.contentVersion >= 2 ? 200 : 30, Number(saved.unlockedLevel) || 1)),
        selectedLevel: Math.max(1, Math.min(saved.contentVersion >= 3 ? maxLevel : saved.contentVersion >= 2 ? 200 : 30, Number(saved.unlockedLevel) || 1, Number(saved.selectedLevel) || 1)),
        completedLevels: [...new Set(Array.isArray(saved.completedLevels) ? saved.completedLevels.filter(level => Number.isInteger(level) && level >= 1 && level <= (saved.contentVersion >= 3 ? maxLevel : saved.contentVersion >= 2 ? 200 : 30)) : [])],
        ownedSkins,
        selectedSkins,
        ownedFeatures,
        selectedFeatures
      };
    } catch {
      return { ...defaultState };
    }
  }

  let state = loadState();
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let targets = [];
  let particles = [];
  let score = 0;
  let combo = 0;
  let bestCombo = 0;
  let hitCount = 0;
  let secondsLeft = 0;
  let running = false;
  let lastFrame = 0;
  let spawnClock = 0;
  let elapsed = 0;
  let currentLevel = state.selectedLevel;
  let currentConfig = null;
  let protectedMissesRemaining = 0;
  let audioContext = null;
  let soundOn = true;
  let adminUnlocked = false;
  let toastTimeout = 0;
  let giftCloseTimeout = 0;

  function levelConfig(level) {
    const chapter = Math.floor((level - 1) / levelsPerCategory);
    const bonuses = featureBonuses();
    return {
      goal: 10 + Math.floor((level - 1) / 5),
      seconds: Math.max(27, 40 - (level - 1) * 0.025) + bonuses.secondsBonus,
      spawn: Math.max(0.36, (0.98 - (level - 1) * 0.0011) * (1 - bonuses.spawnReduction)),
      targetLife: Math.max(0.82, 2.95 - (level - 1) * 0.0041 + bonuses.targetLifeBonus),
      bombChance: Math.max(0.015, Math.min(0.22, 0.04 + level * 0.00065 - bonuses.bombChanceReduction)),
      reward: 20 + level * 4,
      chapter: chapters[chapter],
      chapterNumber: chapter + 1,
      isSpecial: level % 10 === 0
    };
  }

  function featureBonuses() {
    return state.selectedFeatures.reduce((total, id) => {
      const effect = featureCatalog.find(feature => feature.id === id)?.effect || {};
      for (const key of ['secondsBonus', 'tapBonus', 'coinBonus', 'missProtection', 'bombPenaltyReduction', 'bombChanceReduction', 'targetLifeBonus', 'spawnReduction']) {
        total[key] = (total[key] || 0) + (effect[key] || 0);
      }
      return total;
    }, { secondsBonus: 0, tapBonus: 0, coinBonus: 0, missProtection: 0, bombPenaltyReduction: 0, bombChanceReduction: 0, targetLifeBonus: 0, spawnReduction: 0 });
  }

  function saveState() {
    if (!adminUnlocked) window.BaoCloud?.saveProgress(state);
  }

  function playTone(frequency, duration, type = 'sine', volume = 0.055) {
    if (!soundOn) return;
    try {
      audioContext ||= new AudioContext();
      if (audioContext.state === 'suspended') audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      gain.gain.setValueAtTime(volume, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch {
      soundOn = false;
    }
  }

  function vibrate(pattern = 12) {
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  }

  function showToast(message) {
    toastNode.textContent = message;
    toastNode.classList.remove('show');
    void toastNode.offsetWidth;
    toastNode.classList.add('show');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toastNode.classList.remove('show'), 900);
  }

  function setView(view) {
    if (running && view !== 'game') return;
    app.dataset.view = view;
    document.querySelectorAll('.nav-tab').forEach(button => {
      const selected = button.dataset.section === view;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-selected', String(selected));
    });
    requestAnimationFrame(resize);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderWallet() {
    document.querySelector('#coin-count').textContent = adminUnlocked ? '∞' : String(state.coins);
    document.querySelector('#diamond-count').textContent = adminUnlocked ? '∞' : String(state.diamonds);
    document.querySelector('#unlocked-summary').textContent = `${state.unlockedLevel} / ${maxLevel} open`;
    document.querySelector('#home-progress').textContent = state.completedLevels.length ? `${state.completedLevels.length} stage${state.completedLevels.length === 1 ? '' : 's'} cleared!` : 'Your first stage is ready!';
    document.querySelector('#gift-box-button').disabled = state.coins < giftCost;
    document.querySelector('#rare-skin-gift-button').disabled = state.diamonds < rareSkinGiftCost;
    document.querySelector('#feature-gift-box-button').disabled = state.coins < featureGiftCost;
  }

  function renderLevels() {
    const grid = document.querySelector('#level-grid');
    grid.replaceChildren();
    for (let categoryIndex = 0; categoryIndex < chapters.length; categoryIndex += 1) {
      const startLevel = categoryIndex * levelsPerCategory + 1;
      const endLevel = startLevel + levelsPerCategory - 1;
      const category = document.createElement('section');
      category.className = 'level-category';
      const header = document.createElement('div');
      header.className = 'level-category-heading';
      const completedCount = state.completedLevels.filter(level => level >= startLevel && level <= endLevel).length;
      header.innerHTML = `<h3>${String(categoryIndex + 1).padStart(2, '0')} · ${chapters[categoryIndex]}</h3><span>${completedCount} / ${levelsPerCategory} ${iconSvg('gem', 'tiny-icon')}</span>`;
      category.append(header);
      const categoryLevels = document.createElement('div');
      categoryLevels.className = 'level-category-grid';
      for (let level = startLevel; level <= endLevel; level += 1) {
        const button = document.createElement('button');
        const unlocked = level <= state.unlockedLevel;
        const completed = state.completedLevels.includes(level);
        const special = levelConfig(level).isSpecial;
        button.type = 'button';
        button.className = `level-node${completed ? ' complete' : ''}${state.selectedLevel === level ? ' current' : ''}${special ? ' special' : ''}`;
        button.dataset.level = String(level);
        button.disabled = !unlocked;
        button.setAttribute('aria-label', `${unlocked ? `Level ${level}` : `Level ${level}, locked`}${special ? ', special diamond level, up to 3 diamonds' : ''}${completed ? ', complete' : ''}`);
        button.innerHTML = `${level}${completed ? iconSvg('star', 'level-marker') : special ? iconSvg('gem', 'level-marker') : !unlocked ? iconSvg('lock', 'level-marker') : ''}`;
        categoryLevels.append(button);
      }
      category.append(categoryLevels);
      grid.append(category);
    }
    updateSelectedLevel();
  }

  function updateSelectedLevel() {
    currentConfig = levelConfig(state.selectedLevel);
    document.querySelector('#start-button').textContent = `Play level ${state.selectedLevel}`;
    document.querySelector('#round-kicker').textContent = `LEVEL ${String(state.selectedLevel).padStart(3, '0')} · ${currentConfig.chapter.toUpperCase()}`;
    document.querySelector('#round-level-name').textContent = `Level ${state.selectedLevel}`;
    document.querySelector('#round-level-detail').textContent = currentConfig.isSpecial ? 'Diamond bonus level! Up to 3 diamonds' : `Pop ${currentConfig.goal} happy buns!`;
    document.querySelector('#hit-goal').textContent = String(currentConfig.goal);
  }

  function renderShop() {
    const skinGrid = document.querySelector('#skin-shop-grid');
    const featureGrid = document.querySelector('#feature-shop-grid');
    const commonSkinChance = (88 / skinCatalog.filter(skin => skin.rarity === 'common').length).toFixed(1);
    const rareSkinChance = (12 / skinCatalog.filter(skin => skin.rarity === 'rare').length).toFixed(1);
    const availableSkins = skinCatalog.filter(skin => !state.ownedSkins.includes(skin.id));
    skinGrid.innerHTML = availableSkins.length ? availableSkins.map(skin => {
      const chance = skin.rarity === 'rare' ? rareSkinChance : commonSkinChance;
      return `<article class="item-card"><div class="item-card-top"><span class="item-art skin-art" style="background:${skin.color}" aria-hidden="true">${iconSvg(skin.formIcon, 'skin-icon-main')}${iconSvg(skin.icon, 'skin-icon-badge')}</span><span class="item-tag ${skin.rarity}">${skin.rarity}</span></div><h3>${skin.name}</h3><p>${chance}% chance per Bao Box.</p><span class="collect-note">Bao Box only</span></article>`;
    }).join('') : '<p class="shop-message">Every skin collected! Open a box for a surprise repeat draw.</p>';
    const availableFeatures = featureCatalog.filter(feature => !state.ownedFeatures.includes(feature.id));
    featureGrid.innerHTML = availableFeatures.length ? availableFeatures.map(feature => {
      return `<article class="item-card"><div class="item-card-top"><span class="item-art" aria-hidden="true">${iconSvg(feature.icon, 'item-icon')}</span><span class="item-tag">Mystery</span></div><h3>${feature.name}</h3><p>4% chance per Feature Box. ${feature.description}</p><span class="collect-note">Feature Box only</span></article>`;
    }).join('') : '<p class="shop-message">Every feature collected! Open a box for a surprise repeat draw.</p>';
    document.querySelector('#skin-collection-count').textContent = `${state.ownedSkins.length} / 50 collected`;
    document.querySelector('#feature-collection-count').textContent = `${state.ownedFeatures.length} / 25 collected`;
    renderWallet();
  }

  function renderWardrobe() {
    const skinGrid = document.querySelector('#wardrobe-skins');
    const featureGrid = document.querySelector('#wardrobe-features');
    const ownedSkins = skinCatalog.filter(skin => state.ownedSkins.includes(skin.id));
    const ownedFeatures = featureCatalog.filter(feature => state.ownedFeatures.includes(feature.id));
    skinGrid.innerHTML = ownedSkins.map(skin => {
      const selected = state.selectedSkins.includes(skin.id);
      return `<article class="item-card${selected ? ' active-loadout' : ''}"><div class="item-card-top"><span class="item-art skin-art" style="background:${skin.color}" aria-hidden="true">${iconSvg(skin.formIcon, 'skin-icon-main')}${iconSvg(skin.icon, 'skin-icon-badge')}</span><span class="item-tag ${skin.rarity}">${skin.rarity}</span></div><h3>${skin.name}</h3><p>Your buns are picked at random from your active tray.</p><button class="loadout-button${selected ? ' selected' : ''}" type="button" data-equip-kind="skin" data-item-id="${skin.id}" aria-pressed="${selected}">${selected ? 'On tray' : 'Add to tray'}</button></article>`;
    }).join('');
    featureGrid.innerHTML = ownedFeatures.length ? ownedFeatures.map(feature => {
      const selected = state.selectedFeatures.includes(feature.id);
      return `<article class="item-card${selected ? ' active-loadout' : ''}"><div class="item-card-top"><span class="item-art" aria-hidden="true">${iconSvg(feature.icon, 'item-icon')}</span><span class="item-tag">${selected ? 'Equipped' : 'Owned'}</span></div><h3>${feature.name}</h3><p>${feature.description}</p><button class="loadout-button${selected ? ' selected' : ''}" type="button" data-equip-kind="feature" data-item-id="${feature.id}" aria-pressed="${selected}">${selected ? 'Equipped' : 'Equip feature'}</button></article>`;
    }).join('') : '<p class="shop-message">No features yet. Find a favourite in the Snack Shop!</p>';
    document.querySelector('#skin-loadout-count').textContent = `${state.selectedSkins.length} / 5`;
    document.querySelector('#feature-loadout-count').textContent = `${state.selectedFeatures.length} / 3`;
  }

  function renderAll() {
    renderWallet();
    renderLevels();
    renderShop();
    renderWardrobe();
    updateHud();
  }

  function updateHud() {
    const scoreNode = document.querySelector('#score');
    const timerNode = document.querySelector('#timer');
    const timerCard = document.querySelector('#timer-card');
    const multiplierNode = document.querySelector('#multiplier');
    scoreNode.textContent = String(score);
    document.querySelector('#hit-count').textContent = String(hitCount);
    document.querySelector('#combo').textContent = String(combo);
    const multiplier = Math.min(5, 1 + Math.floor(combo / 5));
    multiplierNode.textContent = `x${multiplier}`;
    timerNode.textContent = String(Math.max(0, Math.ceil(secondsLeft)));
    timerCard.classList.toggle('low', secondsLeft <= 8 && running);
    const progress = combo % 5;
    const fill = document.querySelector('#streak-fill');
    fill.style.width = `${progress * 20}%`;
    document.querySelector('.streak-meter').setAttribute('aria-valuenow', String(progress));
    document.querySelector('#bonus-label').textContent = progress === 0 ? '5 pops to x2' : `${5 - progress} more to x${Math.min(5, multiplier + 1)}`;
    document.querySelectorAll('#spice-label').forEach(node => {
      node.textContent = elapsed > currentLevel * 0.85 ? 'Extra spicy!' : elapsed > currentLevel * 0.35 ? 'Getting warm' : 'Mild';
    });
  }

  function resize() {
    const bounds = arena.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    width = bounds.width;
    height = bounds.height;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function addTarget() {
    const isBomb = elapsed > 4 && Math.random() < currentConfig.bombChance;
    const radius = Math.max(31, Math.min(42, Math.min(width, height) * 0.12));
    const pad = radius + 12;
    const activeSkins = state.selectedSkins.length ? state.selectedSkins : ['classic'];
    const skinId = activeSkins[Math.floor(Math.random() * activeSkins.length)];
    targets.push({
      x: pad + Math.random() * Math.max(1, width - pad * 2),
      y: 55 + radius + Math.random() * Math.max(1, height - radius * 2 - 70),
      radius,
      kind: isBomb ? 'bomb' : 'bao',
      skinId,
      born: elapsed,
      life: currentConfig.targetLife,
      phase: Math.random() * Math.PI * 2,
      popped: 0
    });
  }

  function addBurst(x, y, color, count = 10, label = '') {
    if (label) particles.push({ x, y, text: label, color, life: 0.8, maxLife: 0.8, vx: 0, vy: -42 });
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count + Math.random() * 0.4;
      const speed = 50 + Math.random() * 120;
      particles.push({ x, y, color, radius: 3 + Math.random() * 4, life: 0.45 + Math.random() * 0.35, maxLife: 0.8, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 34 });
    }
  }

  function startRound(level = state.selectedLevel) {
    currentLevel = Math.max(1, Math.min(state.unlockedLevel, level));
    state.selectedLevel = currentLevel;
    currentConfig = levelConfig(currentLevel);
    score = 0;
    combo = 0;
    bestCombo = 0;
    hitCount = 0;
    secondsLeft = currentConfig.seconds;
    elapsed = 0;
    spawnClock = 0;
    targets = [];
    particles = [];
    protectedMissesRemaining = featureBonuses().missProtection;
    running = true;
    resultScreen.hidden = true;
    updateSelectedLevel();
    app.dataset.view = 'game';
    updateHud();
    resize();
    addTarget();
    playTone(520, 0.1);
    lastFrame = performance.now();
  }

  function endRound(won) {
    if (!running) return;
    running = false;
    secondsLeft = Math.max(0, secondsLeft);
    const firstClear = won && !state.completedLevels.includes(currentLevel);
    let coinReward = won ? (firstClear ? currentConfig.reward + Math.floor(score / 100) : Math.max(5, Math.floor(currentConfig.reward * 0.2))) : 0;
    coinReward = Math.floor(coinReward * (1 + featureBonuses().coinBonus));
    let diamondReward = 0;
    let categoryComplete = false;
    let specialDiamonds = 0;
    if (firstClear) {
      state.completedLevels.push(currentLevel);
      state.unlockedLevel = Math.min(maxLevel, Math.max(state.unlockedLevel, currentLevel + 1));
      if (currentLevel % levelsPerCategory === 0) {
        const categoryStart = Math.floor((currentLevel - 1) / levelsPerCategory) * levelsPerCategory + 1;
        categoryComplete = Array.from({ length: levelsPerCategory }, (_, index) => categoryStart + index).every(level => state.completedLevels.includes(level));
        if (categoryComplete) diamondReward += 3;
      }
      if (currentConfig.isSpecial) specialDiamonds = Math.min(3, 1 + Math.floor(bestCombo / 4));
      diamondReward += specialDiamonds;
      state.diamonds += diamondReward;
    }
    state.coins += coinReward;
    state.bestScore = Math.max(state.bestScore, score);
    state.selectedLevel = Math.min(state.unlockedLevel, currentLevel + (won && currentLevel < maxLevel ? 1 : 0));
    document.querySelector('#result-dumpling').innerHTML = iconSvg(won ? (diamondReward ? 'gem' : 'sparkle') : 'sad', 'result-icon');
    document.querySelector('#result-kicker').textContent = won ? (categoryComplete ? 'WORLD COMPLETE!' : currentConfig.isSpecial ? 'SPECIAL LEVEL CLEAR!' : `LEVEL ${currentLevel} COMPLETE!`) : 'SO CLOSE!';
    document.querySelector('#result-title').textContent = won ? (categoryComplete ? `${currentConfig.chapter} complete!` : currentConfig.isSpecial ? 'Diamond dumpling!' : ['Bun-believable!', 'Bao wow!', 'You’re on a roll!'][currentLevel % 3]) : 'One more try?';
    document.querySelector('#result-copy').textContent = won ? `${hitCount} buns popped. ${categoryComplete ? 'Every level in this world is complete!' : currentConfig.isSpecial ? `Your best streak earned up to ${specialDiamonds} diamonds.` : 'Your whole bao bunch is cheering!'}` : `You popped ${hitCount} of ${currentConfig.goal} buns. Your next run is going to be great!`;
    document.querySelector('#result-reward').innerHTML = won ? `+${coinReward} ${iconSvg('coin', 'reward-icon')}${diamondReward ? ` +${diamondReward} ${iconSvg('gem', 'reward-icon')}` : ''}` : 'Your coins are safe. Give it another go!';
    document.querySelector('#continue-button').hidden = !won || currentLevel >= maxLevel;
    document.querySelector('#continue-button').textContent = `Next level · ${Math.min(maxLevel, currentLevel + 1)}`;
    document.querySelector('#replay-button').textContent = won ? 'Play this level again' : 'Try again';
    resultScreen.hidden = false;
    saveState();
    renderAll();
    playTone(won ? 760 : 280, 0.22, 'triangle', 0.07);
    if (won) vibrate([15, 35, 25]);
  }

  function squish(target) {
    if (!running || target.popped) return;
    target.popped = performance.now() / 1000;
    if (target.kind === 'bomb') {
      const penalty = Math.max(1, 3 - featureBonuses().bombPenaltyReduction);
      secondsLeft = Math.max(0, secondsLeft - penalty);
      combo = 0;
      addBurst(target.x, target.y, '#ff6c59', 13, 'SPICY!');
      showToast(`Oops! -${penalty} sec`);
      playTone(125, 0.23, 'sawtooth', 0.07);
      vibrate([25, 35, 25]);
      updateHud();
      if (secondsLeft <= 0) endRound(false);
      return;
    }
    hitCount += 1;
    combo += 1;
    bestCombo = Math.max(bestCombo, combo);
    const multiplier = Math.min(5, 1 + Math.floor((combo - 1) / 5));
    const nextMultiplier = Math.min(5, 1 + Math.floor(combo / 5));
    score += 10 * multiplier;
    const skin = skinCatalog.find(item => item.id === target.skinId) || skinCatalog[0];
    addBurst(target.x, target.y, skin.accent, 9 + multiplier, combo % 5 === 0 ? `${nextMultiplier}x!` : `+${10 * multiplier}`);
    playTone(430 + Math.min(combo, 18) * 24, 0.09);
    vibrate(combo % 5 === 0 ? 22 : 10);
    if (combo % 5 === 0) showToast(`${nextMultiplier}x STEAM!`);
    updateHud();
    if (hitCount >= currentConfig.goal) endRound(true);
  }

  function onPointerDown(event) {
    if (!running) return;
    event.preventDefault();
    const bounds = canvas.getBoundingClientRect();
    const x = (event.clientX - bounds.left) * (width / bounds.width);
    const y = (event.clientY - bounds.top) * (height / bounds.height);
    const touchBonus = featureBonuses().tapBonus;
    for (let index = targets.length - 1; index >= 0; index -= 1) {
      const target = targets[index];
      if (target.popped) continue;
      const dx = x - target.x;
      const dy = y - target.y;
      if (dx * dx + dy * dy <= (target.radius + 8 + touchBonus) ** 2) {
        squish(target);
        return;
      }
    }
  }

  function handleMiss() {
    if (combo > 0 && protectedMissesRemaining > 0) {
      protectedMissesRemaining -= 1;
      showToast(`Streak saved! ${protectedMissesRemaining ? `${protectedMissesRemaining} left` : ''}`);
      return;
    }
    combo = 0;
    updateHud();
  }

  function drawBackground(now) {
    ctx.fillStyle = '#bdebd4';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgb(255 255 255 / 34%)';
    for (let row = 0; row < Math.ceil(height / 36); row += 1) {
      for (let column = 0; column < Math.ceil(width / 36); column += 1) {
        const drift = Math.sin(now * 0.0004 + column + row) * 1.3;
        ctx.beginPath();
        ctx.arc(16 + column * 36, 16 + row * 36 + drift, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.strokeStyle = 'rgb(255 255 255 / 35%)';
    ctx.lineWidth = 2;
    for (let index = 0; index < 3; index += 1) {
      const x = 22 + index * 18;
      const rise = (now * 0.025 + index * 38) % (height + 70);
      ctx.beginPath();
      ctx.moveTo(x, height - rise);
      ctx.bezierCurveTo(x - 10, height - rise - 9, x + 9, height - rise - 20, x, height - rise - 30);
      ctx.stroke();
    }
  }

  function drawBao(target, now) {
    const skin = skinCatalog.find(item => item.id === target.skinId) || skinCatalog[0];
    const age = target.popped ? now / 1000 - target.popped : elapsed - target.born;
    let scaleX = 1 + Math.sin(now / 220 + target.phase) * 0.045;
    let scaleY = 1 - Math.sin(now / 220 + target.phase) * 0.045;
    if (target.popped) {
      const pop = Math.min(1, age / 0.23);
      scaleX *= 1 + Math.sin(pop * Math.PI) * 0.27;
      scaleY *= Math.max(0.02, 1 - pop * 0.88);
    }
    ctx.save();
    ctx.translate(target.x, target.y + Math.sin(now / 260 + target.phase) * 3);
    ctx.rotate(Math.sin(now / 450 + target.phase) * 0.035);
    ctx.scale(scaleX, scaleY);
    ctx.shadowColor = 'rgb(48 45 80 / 18%)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.moveTo(-target.radius, 8);
    ctx.bezierCurveTo(-target.radius - 3, -15, -target.radius * 0.62, -target.radius * 0.72, 0, -target.radius * 0.73);
    ctx.bezierCurveTo(target.radius * 0.5, -target.radius * 0.72, target.radius + 5, -12, target.radius, 8);
    ctx.bezierCurveTo(target.radius - 2, target.radius * 0.56, target.radius * 0.55, target.radius * 0.69, 0, target.radius * 0.69);
    ctx.bezierCurveTo(-target.radius * 0.7, target.radius * 0.68, -target.radius - 2, target.radius * 0.44, -target.radius, 8);
    ctx.fillStyle = skin.color;
    ctx.fill();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#302d50';
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = skin.accent;
    ctx.lineCap = 'round';
    for (let fold = -1; fold <= 1; fold += 1) {
      ctx.beginPath();
      ctx.moveTo(fold * 11, -target.radius * 0.59);
      ctx.quadraticCurveTo(fold * 8, -target.radius * 0.79, fold * 2, -target.radius * 0.86);
      ctx.stroke();
    }
    if (skin.pattern === 'seeds' || skin.pattern === 'dots' || skin.pattern === 'sprinkles') {
      for (let mark = 0; mark < 5; mark += 1) {
        const angle = (mark / 5) * Math.PI * 2;
        const px = Math.cos(angle) * target.radius * 0.54;
        const py = Math.sin(angle) * target.radius * 0.24 - 5;
        ctx.fillStyle = skin.accent;
        ctx.beginPath();
        if (skin.pattern === 'sprinkles') {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(angle);
          ctx.roundRect(-2, -5, 4, 10, 2);
          ctx.restore();
        } else {
          ctx.ellipse(px, py, 2.5, 4, angle, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    }
    if (skin.pattern === 'leaf') {
      ctx.fillStyle = skin.accent;
      ctx.beginPath();
      ctx.ellipse(0, -12, 5, 9, -0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#302d50';
    ctx.beginPath();
    ctx.ellipse(-11, 3, 2.6, 3.2, 0, 0, Math.PI * 2);
    ctx.ellipse(11, 3, 2.6, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f28a9e';
    ctx.beginPath();
    ctx.ellipse(-19, 11, 5, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(19, 11, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#302d50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, 13);
    ctx.quadraticCurveTo(0, 18, 4, 13);
    ctx.stroke();
    ctx.restore();
  }

  function drawBomb(target, now) {
    const pulse = 1 + Math.sin(now / 95 + target.phase) * 0.055;
    ctx.save();
    ctx.translate(target.x, target.y);
    ctx.rotate(Math.sin(now / 120 + target.phase) * 0.08);
    ctx.scale(pulse, pulse);
    ctx.shadowColor = 'rgb(48 45 80 / 22%)';
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = '#ff6c59';
    ctx.strokeStyle = '#302d50';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 3, target.radius * 0.78, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#302d50';
    ctx.beginPath();
    ctx.arc(-9, 1, 2.6, 0, Math.PI * 2);
    ctx.arc(9, 1, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#302d50';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 15, 5, Math.PI, 0);
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -target.radius * 0.7);
    ctx.quadraticCurveTo(-7, -target.radius * 0.95, 0, -target.radius * 1.12);
    ctx.stroke();
    ctx.strokeStyle = '#ffd45c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(6, -target.radius * 0.94);
    ctx.lineTo(10, -target.radius * 1.04);
    ctx.moveTo(-6, -target.radius * 0.94);
    ctx.lineTo(-10, -target.radius * 1.04);
    ctx.stroke();
    ctx.restore();
  }

  function drawParticles(delta) {
    particles = particles.filter(particle => particle.life > 0);
    for (const particle of particles) {
      particle.life -= delta;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += 75 * delta;
      ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
      if (particle.text) {
        ctx.fillStyle = particle.color;
        ctx.font = '800 16px Nunito, Trebuchet MS, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(particle.text, particle.x, particle.y);
      } else {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    const delta = Math.min(0.05, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;
    if (width && height) drawBackground(now);
    if (running) {
      elapsed += delta;
      secondsLeft -= delta;
      spawnClock += delta;
      const activeTargets = targets.filter(target => !target.popped).length;
      if (spawnClock >= currentConfig.spawn && activeTargets < 5) {
        addTarget();
        spawnClock = 0;
      }
      targets = targets.filter(target => {
        if (target.popped && now / 1000 - target.popped > 0.23) return false;
        if (!target.popped && elapsed - target.born > target.life) {
          if (target.kind === 'bao') handleMiss();
          return false;
        }
        return true;
      });
      if (secondsLeft <= 0) endRound(false);
      updateHud();
    }
    for (const target of targets) {
      if (target.kind === 'bomb') drawBomb(target, now);
      else drawBao(target, now);
    }
    drawParticles(delta);
    requestAnimationFrame(frame);
  }

  function toggleLoadout(kind, id) {
    const isSkin = kind === 'skin';
    const selected = isSkin ? state.selectedSkins : state.selectedFeatures;
    const owned = isSkin ? state.ownedSkins : state.ownedFeatures;
    const limit = isSkin ? 5 : 3;
    if (!owned.includes(id)) return;
    const index = selected.indexOf(id);
    if (index >= 0) selected.splice(index, 1);
    else if (selected.length >= limit) {
      showToast(`You can pick ${limit} ${isSkin ? 'skins' : 'features'} at a time!`);
      document.querySelector('#wardrobe-message').textContent = `Your tray is full: choose up to ${limit} ${isSkin ? 'skins' : 'features'}.`;
      return;
    } else selected.push(id);
    document.querySelector('#wardrobe-message').textContent = '';
    saveState();
    renderWardrobe();
  }

  function openGiftBox(kind) {
    const isSkinBox = kind === 'skin';
    const isRareSkinBox = kind === 'rare-skin';
    const currency = isRareSkinBox ? 'diamonds' : 'coins';
    const price = isSkinBox ? giftCost : isRareSkinBox ? rareSkinGiftCost : featureGiftCost;
    if (state[currency] < price) {
      showToast(`You need ${price} ${isRareSkinBox ? 'diamonds' : 'coins'} for this box.`);
      return;
    }
    state[currency] -= price;
    const skinBox = isSkinBox || isRareSkinBox;
    const catalog = skinBox ? skinCatalog : featureCatalog;
    const owned = skinBox ? state.ownedSkins : state.ownedFeatures;
    let item;
    if (skinBox) {
      const rare = isRareSkinBox || Math.random() < 0.12;
      const pool = skinCatalog.filter(skin => skin.rarity === (rare ? 'rare' : 'common'));
      item = pool[Math.floor(Math.random() * pool.length)];
    } else {
      item = catalog[Math.floor(Math.random() * catalog.length)];
    }
    const duplicate = owned.includes(item.id);
    let rewardText;
    if (duplicate) {
      rewardText = `You drew ${item.name} again. No reward this time; the ${isRareSkinBox ? 'diamonds' : 'coins'} are spent.`;
    } else {
      owned.push(item.id);
      rewardText = `${item.name} ${skinBox ? 'joined your bao parade' : 'joined your feature shelf'}!`;
      const loadout = skinBox ? state.selectedSkins : state.selectedFeatures;
      const loadoutLimit = skinBox ? 5 : 3;
      if (loadout.length < loadoutLimit) loadout.push(item.id);
    }
    const revealArt = document.querySelector('#gift-reveal-art');
    revealArt.classList.toggle('skin-reveal-art', skinBox && !duplicate);
    revealArt.innerHTML = duplicate ? iconSvg('breeze', 'reveal-icon') : skinBox ? `${iconSvg(item.formIcon, 'skin-icon-main')}${iconSvg(item.icon, 'skin-icon-badge')}` : iconSvg(item.icon, 'reveal-icon');
    if (skinBox && !duplicate) revealArt.style.background = item.color;
    else revealArt.style.background = '';
    document.querySelector('#gift-reveal-title').textContent = duplicate ? 'A repeat draw!' : skinBox ? 'A new bao buddy!' : 'A new pocket pal!';
    document.querySelector('#gift-reveal-copy').textContent = rewardText;
    document.querySelector('#gift-reveal').hidden = false;
    saveState();
    renderAll();
    playTone(730, 0.2, 'triangle', 0.07);
  }

  function redeemAdminCode(event) {
    event.preventDefault();
    const input = document.querySelector('#admin-code');
    const message = document.querySelector('#admin-code-message');
    if (input.value.trim().toUpperCase() !== 'ADMIN333') {
      message.textContent = 'That code did not unlock this bao box.';
      return;
    }
    adminUnlocked = true;
    state.coins = Number.MAX_SAFE_INTEGER;
    state.diamonds = Number.MAX_SAFE_INTEGER;
    state.ownedSkins = skinCatalog.map(skin => skin.id);
    state.selectedSkins = state.selectedSkins.filter(id => state.ownedSkins.includes(id)).slice(0, 5);
    if (!state.selectedSkins.length) state.selectedSkins = state.ownedSkins.slice(0, 5);
    input.value = '';
    message.textContent = 'ADMIN unlocked for this visit: infinite coins and diamonds, plus all 50 skins!';
    saveState();
    renderAll();
  }

  function showAccountNote(message) {
    const note = document.querySelector('#account-note');
    note.textContent = message;
    note.hidden = false;
    window.clearTimeout(giftCloseTimeout);
    giftCloseTimeout = window.setTimeout(() => { note.hidden = true; }, 4500);
  }

  document.querySelectorAll('.nav-tab').forEach(button => button.addEventListener('click', () => setView(button.dataset.section)));
  document.querySelector('#level-grid').addEventListener('click', event => {
    const button = event.target.closest('[data-level]');
    if (!button || button.disabled) return;
    state.selectedLevel = Number(button.dataset.level);
    saveState();
    renderLevels();
    playTone(510, 0.06, 'triangle', 0.035);
  });
  canvas.addEventListener('pointerdown', onPointerDown, { passive: false });
  startButton.addEventListener('click', () => startRound(state.selectedLevel));
  document.querySelector('#exit-game').addEventListener('click', () => {
    running = false;
    resultScreen.hidden = true;
    setView('home');
  });
  document.querySelector('#continue-button').addEventListener('click', () => {
    resultScreen.hidden = true;
    if (currentLevel >= maxLevel) setView('home');
    else startRound(currentLevel + 1);
  });
  document.querySelector('#replay-button').addEventListener('click', () => startRound(currentLevel));
  document.querySelector('#result-home-button').addEventListener('click', () => {
    resultScreen.hidden = true;
    setView('home');
  });
  document.querySelector('#gift-box-button').addEventListener('click', () => openGiftBox('skin'));
  document.querySelector('#rare-skin-gift-button').addEventListener('click', () => openGiftBox('rare-skin'));
  document.querySelector('#feature-gift-box-button').addEventListener('click', () => openGiftBox('feature'));
  document.querySelector('#admin-code-form').addEventListener('submit', redeemAdminCode);
  document.querySelector('#wardrobe-view').addEventListener('click', event => {
    const button = event.target.closest('[data-equip-kind]');
    if (button) toggleLoadout(button.dataset.equipKind, button.dataset.itemId);
  });
  document.querySelector('#gift-reveal-close').addEventListener('click', () => { document.querySelector('#gift-reveal').hidden = true; });
  document.querySelector('#gift-reveal').addEventListener('click', event => {
    if (event.target.id === 'gift-reveal') event.currentTarget.hidden = true;
  });
  soundButton.innerHTML = iconSvg(soundOn ? 'sound' : 'mute', 'button-icon');
  soundButton.setAttribute('aria-label', soundOn ? 'Turn sound off' : 'Turn sound on');
  soundButton.title = soundOn ? 'Sound on' : 'Sound off';
  soundButton.addEventListener('click', () => {
    soundOn = !soundOn;
    soundButton.innerHTML = iconSvg(soundOn ? 'sound' : 'mute', 'button-icon');
    soundButton.setAttribute('aria-label', soundOn ? 'Turn sound off' : 'Turn sound on');
    soundButton.title = soundOn ? 'Sound on' : 'Sound off';
    if (soundOn) playTone(520, 0.08);
  });
  document.querySelector('#account-button').addEventListener('click', () => {
    if (window.BaoCloud?.signedIn) window.BaoCloud.logout();
    else window.BaoCloud?.login();
  });
  window.addEventListener('bao-cloud-state', event => {
    const remote = event.detail?.progress;
    if (remote?.schemaVersion === 1) {
      state = loadState(remote);
    } else if (event.detail?.signedIn) {
      saveState();
    }
    renderAll();
  });
  window.addEventListener('resize', resize);
  new ResizeObserver(resize).observe(arena);
  renderAll();
  resize();
  lastFrame = performance.now();
  requestAnimationFrame(frame);
})();
