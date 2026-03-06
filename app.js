// =====================
// STATE
// =====================
const state = {
  garageLevel: 1,
  garageCap: 1,
  garageName: "Garage Turbo",

  // Profil joueur
  profile: {
    pseudo:  "Mécanicien",
    avatar:  "🔧",
    country: "FR",
    banner:  "#1a2a4a",
  },

  money: 100,
  moneyPerSec: 0,
  rep: 0,

  carsSold: 0,

  diagReward: 1,

  talentPoints: 0,
  talents: {},                // { talentId: rank }
  talentLevelGranted: 1,      // dernier niveau qui a déjà donné des points

  // réparation
  repairClick: 0.5,   // ✅ secondes retirées par clic
  repairAuto: 0.0,   // ✅ secondes retirées par seconde
  speedMult: 1.0,
  saleBonusPct: 0.0,    // formation négociation

  // files
  queue: [],            // voitures en attente (diagnostiquées)
  active: null,         // voiture en cours de réparation
  showroom: [],         // voitures prêtes à vendre

  // ── PRESTIGE ────────────────────────────────────
  prestigeCount:    0,
  heritagePoints:   0,
  heritageSpent:    0,
  heritagePerks:    {},
  heritageBonuses: {
    startMoney:       0,
    repSpeed:         1.0,
    saleBonus:        0,
    passiveBonus:     0,
    repGainMult:      1.0,
    talentBonus:      0,
    diagBonus:        0,
    prestigeGainMult: 1.0,
  },

  // upgrades
  activeTab: "tools",
  upgrades: [
    { id:"manual",  tab:"tools", icon:"📘", name:"Manuel de Réparation", lvl:0, desc:"+1€ par diag", cost:94 },
    { id:"toolbox", tab:"tools", icon:"🧰", name:"Caisse à Outils",      lvl:0, desc:"+0.10 Puissance Répa. Clic", cost:268 },
    { id:"obd",     tab:"tools", icon:"🔎", name:"Scanner OBD Basique",   lvl:0, desc:"+5€ par diag", cost:337 },
    { id:"impact",  tab:"tools", icon:"⚡", name:"Perceuse Pneumatique",  lvl:0, desc:"+0.15 Puissance Répa. Clic", cost:800 },
    { id:"nego",    tab:"deals", icon:"🧾", name:"Formation Négociation", lvl:0, desc:"+5% valeur de vente", cost:1000 },
    { id:"comp",    tab:"tools", icon:"🌀", name:"Compresseur Pro",       lvl:0, desc:"+10% Vitesse Réparation", cost:3500 },
    { id:"lift",    tab:"deals", icon:"🅿️", name:"Agrandissement Garage", lvl:0, desc:"+1 Emplacement de garage", cost:5000, maxLvl:5 },
    { id:"impact2", tab:"tools", icon:"🔧", name:"Pistolet à Choc",       lvl:0, desc:"+0.25 Puissance Répa. Clic", cost:7500 },
    { id:"diagpro", tab:"tools", icon:"🧠", name:"Station Diag Pro",      lvl:0, desc:"+20€ par diag", cost:12000 },

    // ÉQUIPE
    { id:"stagiaire",  tab:"team", icon:"🧑‍🔧", name:"Stagiaire Accueil",  lvl:0, desc:"Diagnostique auto toutes les 12s (min 6s au niv.max)", cost: 2500, maxLvl:10 },
    { id:"vendeur",    tab:"team", icon:"👔",    name:"Vendeur Junior",     lvl:0, desc:"Vend auto toutes les 15s (min 8s au niv.max)",          cost: 6000, maxLvl:10 },
    { id:"apprenti",   tab:"team", icon:"🔩",    name:"Apprenti Mécanicien",lvl:0, desc:"+0.3s/s de réparation auto par rang",                   cost: 4000 },
    { id:"mecanicien", tab:"team", icon:"🛠️",   name:"Mécanicien",         lvl:0, desc:"+1.0s/s de réparation auto par rang",                   cost: 15000 },

    // AFFAIRES — revenus passifs
    { id:"loc_outils",   tab:"deals", icon:"🔑",  name:"Location d'Outils",      lvl:0, desc:"+2 €/s de revenu passif",   cost: 3000 },
    { id:"contrat_taxi", tab:"deals", icon:"🚕",  name:"Contrat Taxi Local",      lvl:0, desc:"+5 €/s de revenu passif",   cost: 8000 },
    { id:"assurance",    tab:"deals", icon:"📋",  name:"Partenariat Assurance",   lvl:0, desc:"+10 €/s de revenu passif",  cost: 20000 },
    { id:"atelier_nuit", tab:"deals", icon:"🌙",  name:"Atelier de Nuit",         lvl:0, desc:"+20 €/s de revenu passif",  cost: 50000 },
    { id:"franchise",    tab:"deals", icon:"🏢",  name:"Franchise Régionale",     lvl:0, desc:"+50 €/s de revenu passif",  cost: 150000 },
  ],
};

// =====================
// GARAGE LEVELING
// =====================
// ventes nécessaires pour atteindre chaque niveau (index = niveau)
const GARAGE_LEVEL_REQUIREMENTS = {
  1: 0, 2: 1, 3: 4, 4: 11, 5: 22, 6: 38, 7: 59, 8: 85, 9: 118, 10: 156,
  11: 201, 12: 253, 13: 311, 14: 377, 15: 451, 16: 532, 17: 621, 18: 718, 19: 824, 20: 938,
  21: 1061, 22: 1192, 23: 1333, 24: 1483, 25: 1643, 26: 1812, 27: 1991, 28: 2180, 29: 2378, 30: 2587,
  31: 2807, 32: 3036, 33: 3277, 34: 3528, 35: 3790, 36: 4063, 37: 4347, 38: 4643, 39: 4950, 40: 5268,
  41: 5598, 42: 5940, 43: 6293, 44: 6659, 45: 7037, 46: 7427, 47: 7829, 48: 8244, 49: 8671, 50: 9111,
  51: 9564, 52: 10029, 53: 10507, 54: 10999, 55: 11504, 56: 12022, 57: 12553, 58: 13098, 59: 13656, 60: 14228,
  61: 14813, 62: 15413, 63: 16026, 64: 16654, 65: 17295, 66: 17951, 67: 18621, 68: 19305, 69: 20004, 70: 20717,
  71: 21445, 72: 22188, 73: 22945, 74: 23717, 75: 24505, 76: 25307, 77: 26124, 78: 26957, 79: 27805, 80: 28668,
  81: 29546, 82: 30441, 83: 31350, 84: 32276, 85: 33217, 86: 34174, 87: 35147, 88: 36136, 89: 37141, 90: 38162,
  91: 39199, 92: 40252, 93: 41322, 94: 42408, 95: 43511, 96: 44630, 97: 45766, 98: 46918, 99: 48088, 100: 49274,
  101: 50477, 102: 51697, 103: 52933, 104: 54188, 105: 55459, 106: 56747, 107: 58053, 108: 59376, 109: 60717, 110: 62075,
  111: 63450, 112: 64843, 113: 66254, 114: 67683, 115: 69129, 116: 70594, 117: 72076, 118: 73576, 119: 75094, 120: 76631,
  121: 78185, 122: 79758, 123: 81349, 124: 82959, 125: 84587, 126: 86233, 127: 87898, 128: 89582, 129: 91284, 130: 93005,
  131: 94745, 132: 96503, 133: 98281, 134: 100077, 135: 101892, 136: 103727, 137: 105580, 138: 107453, 139: 109345, 140: 111257,
  141: 113187, 142: 115137, 143: 117107, 144: 119096, 145: 121104, 146: 123133, 147: 125181, 148: 127248, 149: 129336, 150: 131443,
  151: 133570, 152: 135717, 153: 137884, 154: 140071, 155: 142279, 156: 144506, 157: 146754, 158: 149022, 159: 151310, 160: 153618,
  161: 155947, 162: 158297, 163: 160667, 164: 163057, 165: 165468, 166: 167900, 167: 170353, 168: 172826, 169: 175320, 170: 177835,
  171: 180371, 172: 182928, 173: 185506, 174: 188105, 175: 190725, 176: 193367, 177: 196029, 178: 198713, 179: 201418, 180: 204144,
  181: 206892, 182: 209661, 183: 212452, 184: 215265, 185: 218099, 186: 220954, 187: 223831, 188: 226730, 189: 229651, 190: 232594,
  191: 235558, 192: 238545, 193: 241553, 194: 244584, 195: 247636, 196: 250711, 197: 253808, 198: 256927, 199: 260068, 200: 263231,
};

const MAX_GARAGE_LEVEL = 200;

function getGarageLevelFromSales(sold){
  // retourne le plus grand niveau dont le requirement est <= sold
  let lvl = 1;
  for(let i = 2; i <= MAX_GARAGE_LEVEL; i++){
    if(sold >= GARAGE_LEVEL_REQUIREMENTS[i]) lvl = i;
  }
  return lvl;
}

function updateGarageLevel(){
  const newLevel = getGarageLevelFromSales(state.carsSold);
  if(newLevel !== state.garageLevel){
    state.garageLevel = newLevel;

      garageProgressFill.style.transition = "none";
  setTimeout(() => {
    garageProgressFill.style.transition = "width .25s ease";
  }, 50);

    // ✅ points de talent: 1 par niveau atteint (diff)
  const granted = state.talentLevelGranted ?? 1;
  if(state.garageLevel > granted){
    const gained = state.garageLevel - granted;
    state.talentPoints += gained;
    state.talentLevelGranted = state.garageLevel;
  }
    // Optionnel : bonus à chaque montée de niveau (à toi de choisir)
    // state.garageCap += 1;

    renderAll(); // rafraîchit UI + badge etc.
  }
}

// =====================
// TIER SYSTEM
// =====================
// Tiers par lettre, du plus commun au plus rare
const TIERS = {
  F:    { label:"F",    color:"#8ca8c0", bg:"rgba(140,168,192,.12)", border:"rgba(140,168,192,.22)", desc:"Épave",      repReq:0,      repGain:1   },
  E:    { label:"E",    color:"#a0b890", bg:"rgba(160,184,144,.12)", border:"rgba(160,184,144,.22)", desc:"Populaire",  repReq:0,      repGain:1   },
  D:    { label:"D",    color:"#c4b870", bg:"rgba(196,184,112,.12)", border:"rgba(196,184,112,.22)", desc:"Commune",    repReq:80,     repGain:2   },
  C:    { label:"C",    color:"#4dff9a", bg:"rgba(77,255,154,.10)",  border:"rgba(77,255,154,.22)",  desc:"Correcte",   repReq:300,    repGain:4   },
  B:    { label:"B",    color:"#7ab0ff", bg:"rgba(80,140,255,.10)",  border:"rgba(80,140,255,.22)",  desc:"Sportive",   repReq:1500,   repGain:8   },
  A:    { label:"A",    color:"#a07aff", bg:"rgba(120,80,255,.10)",  border:"rgba(120,80,255,.22)",  desc:"Rare",       repReq:6000,   repGain:15  },
  S:    { label:"S",    color:"#ffc83a", bg:"rgba(255,200,50,.10)",  border:"rgba(255,200,50,.22)",  desc:"Prestige",   repReq:20000,  repGain:30  },
  SS:   { label:"SS",   color:"#ff8c40", bg:"rgba(255,140,64,.12)",  border:"rgba(255,140,64,.28)",  desc:"Collection", repReq:70000,  repGain:60  },
  SSS:  { label:"SSS",  color:"#ff4d70", bg:"rgba(255,77,112,.12)",  border:"rgba(255,77,112,.28)",  desc:"Légendaire", repReq:200000, repGain:120 },
  "SSS+":{ label:"SSS+",color:"#ffffff", bg:"rgba(255,255,255,.08)", border:"rgba(255,255,255,.35)", desc:"Mythique",   repReq:600000, repGain:250 },
};

// Poids de probabilité d'apparition par tier selon la réputation
// Conçu pour un run long terme (~60k+ ventes avant SSS+)
function getTierWeights(rep){
  const ramp = (threshold, startW, rate, cap) =>
    rep >= threshold ? Math.min(cap, startW + (rep - threshold) * rate) : 0;

  const weights = {
    F:      Math.max(0,  50  - rep * 0.0002),
    E:      Math.max(0,  35  - rep * 0.0002),
    D:      rep >= 80    ? Math.max(2, 22 - rep * 0.0001)  : 0,
    C:      ramp(300,    3,   0.002,  18),
    B:      ramp(1500,   2,   0.001,  14),
    A:      ramp(6000,   2,   0.0008, 10),
    S:      ramp(20000,  1.5, 0.0004,  6),
    SS:     ramp(70000,  1,   0.0002,  3),
    SSS:    ramp(200000, 0.5, 0.00006, 1.2),
    "SSS+": ramp(600000, 0.2, 0.00002, 0.4),
  };
  return weights;
}

function weightedPickTier(rep){
  const weights = getTierWeights(rep);
  const total = Object.values(weights).reduce((a,b)=>a+b, 0);
  if(total <= 0) return "F";
  let r = Math.random() * total;
  for(const [tier, w] of Object.entries(weights)){
    r -= w;
    if(r <= 0) return tier;
  }
  return "F";
}

// =====================
// CAR CATALOG — Tiers A→SSS+
// =====================
const CAR_CATALOG = [

  // ── TIER F — Épaves & guimbardes (80–200€, 5–12s) ──────────────────
  { tier:"F", name:"Renno Twinko",        baseValue:80,  repairTime:5  }, // Renault Twingo
  { tier:"F", name:"Pijot 10six",         baseValue:100, repairTime:6  }, // Peugeot 106
  { tier:"F", name:"Fiato Pantôme",       baseValue:90,  repairTime:5  }, // Fiat Punto
  { tier:"F", name:"Citron Saxôh VTS",    baseValue:130, repairTime:7  }, // Citroën Saxo VTS
  { tier:"F", name:"Opal Corsa B",        baseValue:110, repairTime:6  }, // Opel Corsa
  { tier:"F", name:"Fjord Kaa",           baseValue:95,  repairTime:6  }, // Ford Ka
  { tier:"F", name:"Renno Clioz 2",       baseValue:150, repairTime:8  }, // Renault Clio 2
  { tier:"F", name:"Daïhatsou Curoule",   baseValue:85,  repairTime:5  }, // Daihatsu Cuore
  { tier:"F", name:"Lada Niiivah",        baseValue:70,  repairTime:5  }, // Lada Niva
  { tier:"F", name:"Citron Axia",         baseValue:105, repairTime:6  }, // Citroën Xsara
  { tier:"F", name:"Pijot 206i",          baseValue:140, repairTime:8  }, // Peugeot 206
  { tier:"F", name:"Kia Prido",           baseValue:88,  repairTime:5  }, // Kia Pride
  { tier:"F", name:"Séat Malaga Poussah", baseValue:75,  repairTime:5  }, // Seat Malaga
  { tier:"F", name:"Trabounet 601 Plastoc",baseValue:60, repairTime:4  }, // Trabant 601
  { tier:"F", name:"Yugo Zastava Bravo",  baseValue:55,  repairTime:4  }, // Yugo
  { tier:"F", name:"Roveur Minousse",     baseValue:165, repairTime:9  }, // Rover Mini
  { tier:"F", name:"Renno 4L Cahotante",  baseValue:95,  repairTime:6  }, // Renault 4L
  { tier:"F", name:"Fjord Esquorte Mk5",  baseValue:120, repairTime:7  }, // Ford Escort
  { tier:"F", name:"Pijot 104 Choupinette",baseValue:72, repairTime:5  }, // Peugeot 104
  { tier:"F", name:"Citron BX Brisquette",baseValue:88,  repairTime:6  }, // Citroën BX
  { tier:"F", name:"Fiato Séitchento",    baseValue:96,  repairTime:6  }, // Fiat Seicento
  { tier:"F", name:"Opal Kâdette Sieste", baseValue:82,  repairTime:5  }, // Opel Kadett
  { tier:"F", name:"Zaporoj 966 Tartinette",baseValue:45,repairTime:4  }, // Zaporozhets
  { tier:"F", name:"Skoda Félisha Flouze",baseValue:115, repairTime:7  }, // Skoda Felicia
  { tier:"F", name:"Renno Twingo 2 Boudeur",baseValue:155,repairTime:8 }, // Renault Twingo 2

  // ── TIER E — Citadines basiques (200–450€, 12–22s) ─────────────────
  { tier:"E", name:"Volkz Pôlo III",      baseValue:220, repairTime:14 }, // VW Polo
  { tier:"E", name:"Fjord Fiestôt",       baseValue:200, repairTime:13 }, // Ford Fiesta
  { tier:"E", name:"Opèl Astrâ G",        baseValue:250, repairTime:15 }, // Opel Astra
  { tier:"E", name:"Renno Mégânon",       baseValue:280, repairTime:16 }, // Renault Mégane
  { tier:"E", name:"Citron C3 Plurya",    baseValue:230, repairTime:14 }, // Citroën C3 Pluriel
  { tier:"E", name:"Hyundra Getzzi",      baseValue:210, repairTime:13 }, // Hyundai Getz
  { tier:"E", name:"Kia Riyo",            baseValue:240, repairTime:15 }, // Kia Rio
  { tier:"E", name:"Nissin Micra K12",    baseValue:195, repairTime:12 }, // Nissan Micra
  { tier:"E", name:"Toyo Yarriz",         baseValue:260, repairTime:16 }, // Toyota Yaris
  { tier:"E", name:"Seet Ibizzôh",        baseValue:270, repairTime:16 }, // Seat Ibiza
  { tier:"E", name:"Suzuka Swyft",        baseValue:235, repairTime:14 }, // Suzuki Swift
  { tier:"E", name:"Pijot 207i",          baseValue:290, repairTime:17 }, // Peugeot 207
  { tier:"E", name:"Renno Kangourou",     baseValue:300, repairTime:18 }, // Renault Kangoo
  { tier:"E", name:"Citron Berllingot",   baseValue:245, repairTime:15 }, // Citroën Berlingo
  { tier:"E", name:"Pijot Partenaire Bizz",baseValue:225,repairTime:14 }, // Peugeot Partner
  { tier:"E", name:"Mitsubish Colto",     baseValue:215, repairTime:13 }, // Mitsubishi Colt
  { tier:"E", name:"Chevro Sparcouille",  baseValue:205, repairTime:13 }, // Chevrolet Spark
  { tier:"E", name:"Fiato Pâllio Frotti", baseValue:220, repairTime:14 }, // Fiat Palio
  { tier:"E", name:"Skodda Fâbia Plouc",  baseValue:255, repairTime:15 }, // Skoda Fabia
  { tier:"E", name:"Toyo iQ Nanoïde",     baseValue:285, repairTime:17 }, // Toyota iQ
  { tier:"E", name:"Smaart Fortouze",     baseValue:310, repairTime:18 }, // Smart Fortwo
  { tier:"E", name:"Hyundra i10 Minot",   baseValue:230, repairTime:14 }, // Hyundai i10
  { tier:"E", name:"Kia Picantoune",      baseValue:195, repairTime:12 }, // Kia Picanto
  { tier:"E", name:"Fiato 500 Popotin",   baseValue:340, repairTime:19 }, // Fiat 500

  // ── TIER D — Compactes & familiales (500–1000€, 25–40s) ────────────
  { tier:"D", name:"Volkz Golph IV",      baseValue:550, repairTime:28 }, // VW Golf 4
  { tier:"D", name:"Odi A-Tri",           baseValue:600, repairTime:30 }, // Audi A3
  { tier:"D", name:"BimV Série Oon",      baseValue:700, repairTime:34 }, // BMW Série 1
  { tier:"D", name:"Fjord Foucos",        baseValue:520, repairTime:27 }, // Ford Focus
  { tier:"D", name:"Renno Lagouna",       baseValue:580, repairTime:29 }, // Renault Laguna
  { tier:"D", name:"Pijot 406 Coupâl",    baseValue:650, repairTime:31 }, // Peugeot 406 Coupé
  { tier:"D", name:"Merko Classa A",      baseValue:630, repairTime:30 }, // Mercedes Classe A
  { tier:"D", name:"Saab 9-Troi",         baseValue:720, repairTime:35 }, // Saab 9-3
  { tier:"D", name:"Volvo V40 Soixante",  baseValue:680, repairTime:33 }, // Volvo V40
  { tier:"D", name:"Odi A-Four B6",       baseValue:800, repairTime:38 }, // Audi A4 B6
  { tier:"D", name:"Hyundra Elantrouze",  baseValue:530, repairTime:27 }, // Hyundai Elantra
  { tier:"D", name:"Toyo Corrola",        baseValue:560, repairTime:28 }, // Toyota Corolla
  { tier:"D", name:"Pijot 307 Brouillon", baseValue:570, repairTime:28 }, // Peugeot 307
  { tier:"D", name:"Renno Scénik Picnic", baseValue:610, repairTime:30 }, // Renault Scenic
  { tier:"D", name:"Citron Eczéma C5",    baseValue:640, repairTime:31 }, // Citroën C5
  { tier:"D", name:"Hinda Accordéon",     baseValue:760, repairTime:36 }, // Honda Accord
  { tier:"D", name:"Toyo Rây",            baseValue:690, repairTime:33 }, // Toyota RAV4
  { tier:"D", name:"Nissou Almîra",       baseValue:505, repairTime:26 }, // Nissan Almera
  { tier:"D", name:"Mazda Sikss Bi-Tourné",baseValue:730,repairTime:35 }, // Mazda 6
  { tier:"D", name:"Volkz Tournhalle",    baseValue:810, repairTime:38 }, // VW Touran
  { tier:"D", name:"Seet Léonne Tigr",    baseValue:545, repairTime:27 }, // Seat Leon
  { tier:"D", name:"Kia Cîid Tartinette", baseValue:520, repairTime:26 }, // Kia Ceed

  // ── TIER C — Berlines & compactes sportives (1000–3000€, 45–70s) ───
  { tier:"C", name:"BimV M3 E-trente",    baseValue:1800, repairTime:60 }, // BMW M3 E30
  { tier:"C", name:"Volkz Golph GTI Mk3", baseValue:1200, repairTime:48 }, // VW Golf GTI
  { tier:"C", name:"Merko C200 Kompô",    baseValue:1500, repairTime:54 }, // Mercedes C200
  { tier:"C", name:"Odi A4 Quâtro",       baseValue:1600, repairTime:56 }, // Audi A4 Quattro
  { tier:"C", name:"Alfa Roméa 156",      baseValue:1100, repairTime:46 }, // Alfa Romeo 156
  { tier:"C", name:"Renno Spasso V6",     baseValue:2000, repairTime:64 }, // Renault Espace V6
  { tier:"C", name:"Pijot 306 S16",       baseValue:1400, repairTime:52 }, // Peugeot 306 S16
  { tier:"C", name:"Hinda Civique Type-S",baseValue:1300, repairTime:50 }, // Honda Civic Type-S
  { tier:"C", name:"Toyo Avénsis",        baseValue:1050, repairTime:45 }, // Toyota Avensis
  { tier:"C", name:"Volkz Passoa",        baseValue:1150, repairTime:47 }, // VW Passat
  { tier:"C", name:"Fjord MondeoXL",      baseValue:1000, repairTime:45 }, // Ford Mondeo
  { tier:"C", name:"Minni Coupairre",     baseValue:2200, repairTime:68 }, // Mini Cooper
  { tier:"C", name:"Renno Mégânon RS",    baseValue:2400, repairTime:70 }, // Renault Megane RS
  { tier:"C", name:"Odi TT Coupounet",    baseValue:2600, repairTime:72 }, // Audi TT
  { tier:"C", name:"BimV 3-Série E46 Chic",baseValue:1700,repairTime:58 }, // BMW E46
  { tier:"C", name:"Merko Classa C W203", baseValue:1350, repairTime:51 }, // Mercedes C W203
  { tier:"C", name:"Toyo Célica Caramel", baseValue:1900, repairTime:62 }, // Toyota Celica
  { tier:"C", name:"Hinda Préloud",       baseValue:1450, repairTime:53 }, // Honda Prelude
  { tier:"C", name:"Alfa Roméa GTV Pâtisserie",baseValue:1600,repairTime:56}, // Alfa GTV
  { tier:"C", name:"Pijot RCZ Ragueneau", baseValue:2800, repairTime:74 }, // Peugeot RCZ
  { tier:"C", name:"Renno Mégânon Coupwé",baseValue:1300, repairTime:50 }, // Renault Mégane Coupé
  { tier:"C", name:"Seet Léonne Cupra",   baseValue:2100, repairTime:65 }, // Seat Leon Cupra

  // ── TIER B — Sportives & youngtimers (3000–8000€, 80–110s) ─────────
  { tier:"B", name:"Subaro Imprézah WRX", baseValue:3500, repairTime:85 }, // Subaru Impreza WRX
  { tier:"B", name:"Nissou 350-Zed",      baseValue:4000, repairTime:90 }, // Nissan 350Z
  { tier:"B", name:"Mazda Mx-5 Miaaata",  baseValue:3200, repairTime:82 }, // Mazda MX-5 Miata
  { tier:"B", name:"Hinda S2Mille",       baseValue:4500, repairTime:94 }, // Honda S2000
  { tier:"B", name:"Toyo Souprà MkIV",    baseValue:5500, repairTime:100}, // Toyota Supra MkIV
  { tier:"B", name:"Pijot 205 Gti 1.9",   baseValue:3800, repairTime:88 }, // Peugeot 205 GTI
  { tier:"B", name:"Lancia Deltâ Intégr", baseValue:5000, repairTime:96 }, // Lancia Delta Integrale
  { tier:"B", name:"Mitsubish Ekliipse",  baseValue:3600, repairTime:86 }, // Mitsubishi Eclipse
  { tier:"B", name:"Hinda Integra Type-R",baseValue:4200, repairTime:91 }, // Honda Integra Type-R
  { tier:"B", name:"Porsha Boxstarr 986", baseValue:6000, repairTime:104}, // Porsche Boxster 986
  { tier:"B", name:"Renno Spasse F1",     baseValue:4800, repairTime:95 }, // Renault Espace F1 (joke)
  { tier:"B", name:"BimV M3 E36",         baseValue:4000, repairTime:90 }, // BMW M3 E36
  { tier:"B", name:"Mitsubish Lanciâ Evo7",baseValue:5200,repairTime:98 }, // Mitsubishi Lancer Evo
  { tier:"B", name:"Subaro Légassie BH5", baseValue:3400, repairTime:84 }, // Subaru Legacy
  { tier:"B", name:"Toyo MR2 Spydouille", baseValue:3700, repairTime:87 }, // Toyota MR2
  { tier:"B", name:"Nissou Sîlvia S15",   baseValue:4600, repairTime:93 }, // Nissan Silvia S15
  { tier:"B", name:"Fjord Puma Rugissant", baseValue:3300, repairTime:83 }, // Ford Puma
  { tier:"B", name:"Alfa Roméa 147 GTA",  baseValue:4900, repairTime:96 }, // Alfa 147 GTA
  { tier:"B", name:"Renno Clioz V6 Folasse",baseValue:5800,repairTime:102}, // Renault Clio V6
  { tier:"B", name:"Mazda RX-Septe Wânkel",baseValue:4100,repairTime:91 }, // Mazda RX-7
  { tier:"B", name:"BimV Z3 Décapoté",    baseValue:3900, repairTime:89 }, // BMW Z3
  { tier:"B", name:"VW Corraïdo Vent",    baseValue:3600, repairTime:86 }, // VW Corrado
  { tier:"B", name:"Mitsubish 3000GT Brouaha",baseValue:4700,repairTime:94}, // Mitsubishi 3000GT

  // ── TIER A — Luxe & SUV premium (8000–20000€, 120–170s) ────────────
  { tier:"A", name:"Porsha Cayennard",    baseValue:9000,  repairTime:130}, // Porsche Cayenne
  { tier:"A", name:"Odi Q7 Quâtroc",      baseValue:10000, repairTime:140}, // Audi Q7
  { tier:"A", name:"Cadillak Escalâde",   baseValue:12000, repairTime:150}, // Cadillac Escalade
  { tier:"A", name:"Teslla Modèl Ès",     baseValue:15000, repairTime:160}, // Tesla Model S
  { tier:"A", name:"Merko G63 AMGueule",  baseValue:18000, repairTime:170}, // Mercedes G63 AMG
  { tier:"A", name:"BimV X5 Emmm",        baseValue:11000, repairTime:145}, // BMW X5 M
  { tier:"A", name:"Hummur H2 Bouzin",    baseValue:9500,  repairTime:135}, // Hummer H2
  { tier:"A", name:"Bentlaï Continentâl", baseValue:20000, repairTime:175}, // Bentley Continental
  { tier:"A", name:"Lexys LX570",         baseValue:14000, repairTime:158}, // Lexus LX570
  { tier:"A", name:"Ranjet Roupie",       baseValue:16000, repairTime:165}, // Range Rover
  { tier:"A", name:"Maybach 57 Blingbling",baseValue:19000,repairTime:172}, // Maybach
  { tier:"A", name:"Merko AMG GT4 Pattes",baseValue:17000, repairTime:168}, // Mercedes AMG GT
  { tier:"A", name:"Odi RS6 Avanguarde",  baseValue:16500, repairTime:166}, // Audi RS6
  { tier:"A", name:"BimV M5 E39 Bombasse",baseValue:13000, repairTime:153}, // BMW M5 E39
  { tier:"A", name:"Mézarâti Quattropattes",baseValue:18500,repairTime:171}, // Maserati Quattroporte
  { tier:"A", name:"Porsha Panâméra Ventru",baseValue:17500,repairTime:169}, // Porsche Panamera
  { tier:"A", name:"Lambô Urus Pachyderme",baseValue:19500,repairTime:174}, // Lamborghini Urus
  { tier:"A", name:"Teslla Modèl X Porte",baseValue:14500, repairTime:159}, // Tesla Model X
  { tier:"A", name:"Infinitii FX45 Grosse",baseValue:9800, repairTime:136}, // Infiniti FX45
  { tier:"A", name:"Toyo Landcruzer Boss", baseValue:12500, repairTime:151}, // Toyota Land Cruiser
  { tier:"A", name:"Merko Klass E W212",  baseValue:10500, repairTime:142}, // Mercedes Classe E
  { tier:"A", name:"Rollz Royce Champô",  baseValue:20000, repairTime:176}, // Rolls Royce

  // ── TIER S — Sportives prestige (25000–60000€, 200–280s) ────────────
  { tier:"S", name:"Porsha 911 NeufNeuf", baseValue:28000, repairTime:210}, // Porsche 911
  { tier:"S", name:"Jagwa F-Type Câlin",  baseValue:32000, repairTime:220}, // Jaguar F-Type
  { tier:"S", name:"Fjord Mustângu GT500",baseValue:30000, repairTime:215}, // Ford Mustang GT500
  { tier:"S", name:"Chevrolèt Corvette C7",baseValue:38000,repairTime:235}, // Chevrolet Corvette C7
  { tier:"S", name:"Ferrero TestaRôssa",  baseValue:45000, repairTime:255}, // Ferrari Testarossa
  { tier:"S", name:"Dodje Viperouille",   baseValue:35000, repairTime:228}, // Dodge Viper
  { tier:"S", name:"A-C Cobra 427 Bête",  baseValue:29000, repairTime:212}, // AC Cobra 427
  { tier:"S", name:"Aston Marten DB7",    baseValue:34000, repairTime:224}, // Aston Martin DB7
  { tier:"S", name:"De Tomâso Pantère",   baseValue:31000, repairTime:218}, // De Tomaso Pantera
  { tier:"S", name:"Lambo Diâboulet",     baseValue:50000, repairTime:268}, // Lamborghini Diablo
  { tier:"S", name:"Ferrarro F355 Moâh",  baseValue:42000, repairTime:248}, // Ferrari F355
  { tier:"S", name:"BimV M1 Ancestral",   baseValue:55000, repairTime:275}, // BMW M1
  { tier:"S", name:"Merko SLK Saucisson", baseValue:27000, repairTime:208}, // Mercedes SLK
  { tier:"S", name:"Odi R8 Spidrou",      baseValue:48000, repairTime:262}, // Audi R8
  { tier:"S", name:"Nissou GT-R R34 Légendzo",baseValue:52000,repairTime:272}, // Nissan GTR R34
  { tier:"S", name:"BimV M6 E63 Bravo",   baseValue:36000, repairTime:230}, // BMW M6
  { tier:"S", name:"Ferrero 348 Coucouzi", baseValue:40000,repairTime:242}, // Ferrari 348
  { tier:"S", name:"Porsha 944 Turbo Souf",baseValue:26500,repairTime:206}, // Porsche 944 Turbo
  { tier:"S", name:"Aston Marten Vantâje", baseValue:44000,repairTime:253}, // Aston Martin Vantage
  { tier:"S", name:"Mézarâti GranTurismo", baseValue:33000,repairTime:222}, // Maserati GranTurismo
  { tier:"S", name:"Lambo Gallardeau",    baseValue:46000, repairTime:258}, // Lamborghini Gallardo
  { tier:"S", name:"Chevrolèt Camarôh ZL1",baseValue:29500,repairTime:213}, // Chevrolet Camaro ZL1

  // ── TIER SS — Supercars (70000–200000€, 320–480s) ───────────────────
  { tier:"SS", name:"Ferrero F40 Quarante",baseValue:90000, repairTime:360}, // Ferrari F40
  { tier:"SS", name:"Lambo Murcîelago",    baseValue:110000,repairTime:400}, // Lamborghini Murciélago
  { tier:"SS", name:"Porsha Carrera GT Fô",baseValue:130000,repairTime:430}, // Porsche Carrera GT
  { tier:"SS", name:"Lexys LF-Âh",         baseValue:95000, repairTime:375}, // Lexus LFA
  { tier:"SS", name:"Aston Marten DBS Glo",baseValue:105000,repairTime:390}, // Aston Martin DBS
  { tier:"SS", name:"McLoren MP4-12C",      baseValue:140000,repairTime:440}, // McLaren MP4-12C
  { tier:"SS", name:"Nissou GT-R R35 Godzl",baseValue:85000,repairTime:355}, // Nissan GT-R R35
  { tier:"SS", name:"Mézarâti MC12 Vroom",  baseValue:175000,repairTime:470}, // Maserati MC12
  { tier:"SS", name:"Ferrarro Enzô Boûff",  baseValue:200000,repairTime:480}, // Ferrari Enzo
  { tier:"SS", name:"Zonda Paganizone",      baseValue:160000,repairTime:460}, // Pagani Zonda
  { tier:"SS", name:"Ferrero 599 GTO Pouet", baseValue:120000,repairTime:420}, // Ferrari 599 GTO
  { tier:"SS", name:"Lambo Huracannable",   baseValue:100000,repairTime:385}, // Lamborghini Huracan
  { tier:"SS", name:"Porsha GT3 RS Puncheur",baseValue:115000,repairTime:410}, // Porsche GT3 RS
  { tier:"SS", name:"McLoren 675LT Longtoi", baseValue:145000,repairTime:445}, // McLaren 675LT
  { tier:"SS", name:"Aston Marten One-77 Bling",baseValue:185000,repairTime:475}, // Aston One-77
  { tier:"SS", name:"Rollz Royce Phàntôme Roi",baseValue:195000,repairTime:479}, // Rolls Ghost
  { tier:"SS", name:"BimV M8 GTS Furioso",  baseValue:80000, repairTime:352}, // BMW M8 GTS
  { tier:"SS", name:"Merko SLS AMG Aiglette",baseValue:92000,repairTime:365}, // Mercedes SLS AMG

  // ── TIER SSS — Hypercars rares (300000–800000€, 600–900s) ───────────
  { tier:"SSS", name:"Bugatti Vaiyronne",   baseValue:350000,repairTime:650}, // Bugatti Veyron
  { tier:"SSS", name:"Pagânì Huayrra Brr",  baseValue:500000,repairTime:750}, // Pagani Huayra
  { tier:"SSS", name:"Koenigsmeg Agéra RS", baseValue:450000,repairTime:720}, // Koenigsegg Agera RS
  { tier:"SSS", name:"McLoren P1 PleurÔ",   baseValue:600000,repairTime:820}, // McLaren P1
  { tier:"SSS", name:"Porsha 918 Spidrou",  baseValue:550000,repairTime:780}, // Porsche 918 Spyder
  { tier:"SSS", name:"Ferrarro LaFerrarî",  baseValue:700000,repairTime:880}, // Ferrari LaFerrari
  { tier:"SSS", name:"Lambo Aventadôr SVJ", baseValue:400000,repairTime:700}, // Lamborghini Aventador SVJ
  { tier:"SSS", name:"Ferrero FXX-K Démon", baseValue:750000,repairTime:890}, // Ferrari FXX-K
  { tier:"SSS", name:"McLoren Sènnne Ouf",  baseValue:650000,repairTime:840}, // McLaren Senna
  { tier:"SSS", name:"Rimac Nevéra Électrik",baseValue:580000,repairTime:800}, // Rimac Nevera
  { tier:"SSS", name:"Koenigsmeg Regéra Svp",baseValue:480000,repairTime:740}, // Koenigsegg Regera
  { tier:"SSS", name:"Lambo Venéno Dinguo", baseValue:800000,repairTime:900}, // Lamborghini Veneno
  { tier:"SSS", name:"Aston Marten Vulcaîne",baseValue:420000,repairTime:710}, // Aston Martin Vulcan
  { tier:"SSS", name:"Porsha GT1 Ancêtre",  baseValue:460000,repairTime:730}, // Porsche GT1
  { tier:"SSS", name:"Bugatti EB110 Ancétral",baseValue:380000,repairTime:680}, // Bugatti EB110

  // ── TIER SSS+ — Legendary (1M€+, 1200–2000s) ───────────────────────
  { tier:"SSS+", name:"Bugatti Shironisé",    baseValue:1500000,repairTime:1500}, // Bugatti Chiron
  { tier:"SSS+", name:"Koenigsmeg Jeskô Fls", baseValue:1200000,repairTime:1300}, // Koenigsegg Jesko
  { tier:"SSS+", name:"McLoren F1 Légendâre", baseValue:2000000,repairTime:1800}, // McLaren F1
  { tier:"SSS+", name:"Pagânì Zondà R Ultime",baseValue:1800000,repairTime:1700}, // Pagani Zonda R
  { tier:"SSS+", name:"Bugatti Divo Divinité",baseValue:1600000,repairTime:1600}, // Bugatti Divo
  { tier:"SSS+", name:"Lambo Sîan Mythique",  baseValue:1400000,repairTime:1450}, // Lamborghini Sian
  { tier:"SSS+", name:"Merko AMG ONE F1Street",baseValue:1350000,repairTime:1420}, // Mercedes AMG One
  { tier:"SSS+", name:"Ferrero Monza SP1 Dieu",baseValue:1700000,repairTime:1650}, // Ferrari Monza SP1
  { tier:"SSS+", name:"Gordon Murray T50 GraalO",baseValue:2200000,repairTime:1900}, // Gordon Murray T50
  { tier:"SSS+", name:"Koenigsmeg CC850 Absolu",baseValue:1900000,repairTime:1750}, // Koenigsegg CC850
  { tier:"SSS+", name:"Rollz Royce Boat-Tail Oups",baseValue:2500000,repairTime:2000}, // Rolls Boat Tail

  // ── TIER F — Nouvelles épaves ──────────────────────────────────────
  { tier:"F", name:"Talbot Horizonne Fantôme",  baseValue:65,  repairTime:4  }, // Talbot Horizon
  { tier:"F", name:"Simca 1100 Rouillarde",     baseValue:68,  repairTime:4  }, // Simca 1100
  { tier:"F", name:"Renno 5 Supercinq",         baseValue:78,  repairTime:5  }, // Renault 5
  { tier:"F", name:"Renno 11 Onzième",          baseValue:74,  repairTime:5  }, // Renault 11
  { tier:"F", name:"Pijot 104 ZS Zézette",      baseValue:82,  repairTime:5  }, // Peugeot 104 ZS
  { tier:"F", name:"Citron 2CV Deudeuche",      baseValue:90,  repairTime:6  }, // Citroën 2CV
  { tier:"F", name:"Citron GSA Grenouillard",   baseValue:72,  repairTime:5  }, // Citroën GSA
  { tier:"F", name:"Fjord Sierrap Bêlante",     baseValue:86,  repairTime:5  }, // Ford Sierra
  { tier:"F", name:"Fiato Pândola Pendouille",  baseValue:79,  repairTime:5  }, // Fiat Pandina
  { tier:"F", name:"Mazda 323 Trozième",        baseValue:83,  repairTime:5  }, // Mazda 323
  { tier:"F", name:"Opal Monzah Ronflette",     baseValue:91,  repairTime:6  }, // Opel Monza
  { tier:"F", name:"Hinda Lôgique CX",          baseValue:97,  repairTime:6  }, // Honda Logic
  { tier:"F", name:"Mitsubish Celérité",        baseValue:93,  repairTime:6  }, // Mitsubishi Celerio
  { tier:"F", name:"Daiwo Matiz Mignonouille",  baseValue:66,  repairTime:4  }, // Daewoo Matiz
  { tier:"F", name:"Lada Samarô Stoïk",         baseValue:62,  repairTime:4  }, // Lada Samara

  // ── TIER E — Nouvelles citadines ──────────────────────────────────
  { tier:"E", name:"Renno Twîngoo 2 Ronchon",  baseValue:310, repairTime:18 }, // Renault Twingo 2
  { tier:"E", name:"Pijot 208 Deux-zérouit",   baseValue:320, repairTime:18 }, // Peugeot 208
  { tier:"E", name:"Citron C1 Bichette",        baseValue:195, repairTime:12 }, // Citroën C1
  { tier:"E", name:"Toyo Âïgo Nanard",          baseValue:200, repairTime:13 }, // Toyota Aygo
  { tier:"E", name:"Pijot 107 CentSept",        baseValue:198, repairTime:12 }, // Peugeot 107
  { tier:"E", name:"Volkz Loupine",             baseValue:330, repairTime:19 }, // VW Lupo
  { tier:"E", name:"Seet Ârmosa Joliette",      baseValue:225, repairTime:14 }, // Seat Arosa
  { tier:"E", name:"Renno Zoé Électricouille",  baseValue:355, repairTime:20 }, // Renault Zoe
  { tier:"E", name:"Hyundra Accent Zézayeur",   baseValue:240, repairTime:15 }, // Hyundai Accent
  { tier:"E", name:"Kia Soulmate",              baseValue:275, repairTime:16 }, // Kia Soul
  { tier:"E", name:"Nissin Notche Cubique",     baseValue:260, repairTime:16 }, // Nissan Note
  { tier:"E", name:"Hinda Jazza Jazzy",         baseValue:295, repairTime:17 }, // Honda Jazz
  { tier:"E", name:"Mazda Deuxième Deuz",       baseValue:270, repairTime:16 }, // Mazda 2
  { tier:"E", name:"Chevro Avéo Pépiette",      baseValue:215, repairTime:13 }, // Chevrolet Aveo
  { tier:"E", name:"Fiato Grânde Pounto",       baseValue:305, repairTime:18 }, // Fiat Grande Punto

  // ── TIER D — Nouvelles compactes ──────────────────────────────────
  { tier:"D", name:"Renno Flûence Sifflette",   baseValue:525, repairTime:27 }, // Renault Fluence
  { tier:"D", name:"Pijot 308 Troiscenthuit",   baseValue:575, repairTime:29 }, // Peugeot 308
  { tier:"D", name:"Citron C4 Quatrième",       baseValue:555, repairTime:28 }, // Citroën C4
  { tier:"D", name:"Fjord Foucos C-Max Boxon",  baseValue:540, repairTime:27 }, // Ford C-Max
  { tier:"D", name:"Volkz Jêta Jétable",        baseValue:590, repairTime:29 }, // VW Jetta
  { tier:"D", name:"Skodda Octavia Octopusse",  baseValue:610, repairTime:30 }, // Skoda Octavia
  { tier:"D", name:"Toyo Austurès",             baseValue:635, repairTime:31 }, // Toyota Auris
  { tier:"D", name:"Hyundra i30 Trentième",     baseValue:545, repairTime:27 }, // Hyundai i30
  { tier:"D", name:"Kia Céed Cédille",          baseValue:530, repairTime:27 }, // Kia Ceed
  { tier:"D", name:"Nissou Première P12",       baseValue:515, repairTime:26 }, // Nissan Primera
  { tier:"D", name:"Hinda Civique Mk7",         baseValue:660, repairTime:32 }, // Honda Civic Mk7
  { tier:"D", name:"Odi A3 Sportbakc Ados",     baseValue:695, repairTime:33 }, // Audi A3 Sportback
  { tier:"D", name:"Merko Classa B Deub",       baseValue:650, repairTime:31 }, // Mercedes Classe B
  { tier:"D", name:"Volkz Tigrouan",            baseValue:780, repairTime:37 }, // VW Tiguan
  { tier:"D", name:"Renno Kôléos Colosse",      baseValue:740, repairTime:35 }, // Renault Koleos

  // ── TIER C — Nouvelles berlines sportives ─────────────────────────
  { tier:"C", name:"Renno Clioz RS Mk3 Saucette",baseValue:2300,repairTime:69}, // Renault Clio RS
  { tier:"C", name:"Hinda Civique Type-R FK8",  baseValue:2900, repairTime:75 }, // Honda Civic Type-R
  { tier:"C", name:"Volkz Golph R Mk6",         baseValue:2100, repairTime:65 }, // VW Golf R
  { tier:"C", name:"Odi S3 Sportbaguette",      baseValue:2400, repairTime:70 }, // Audi S3
  { tier:"C", name:"Merko A45 AMG Agité",       baseValue:2700, repairTime:73 }, // Mercedes A45 AMG
  { tier:"C", name:"BimV M135i Ventilateur",    baseValue:2200, repairTime:67 }, // BMW M135i
  { tier:"C", name:"Seet Léonne Cupra 290",     baseValue:2000, repairTime:63 }, // Seat Leon Cupra 290
  { tier:"C", name:"Volkz Sîroco Tourbillon",   baseValue:1850, repairTime:61 }, // VW Scirocco
  { tier:"C", name:"Pijot 308 GTi Gustatif",    baseValue:2500, repairTime:71 }, // Peugeot 308 GTi
  { tier:"C", name:"Renno Mégânon 4 RS Trophée",baseValue:2800, repairTime:74}, // Renault Megane 4 RS
  { tier:"C", name:"Alfa Roméa Giuliettah",     baseValue:1750, repairTime:59 }, // Alfa Romeo Giulietta
  { tier:"C", name:"Toyo GT86 Katanouille",     baseValue:2350, repairTime:69 }, // Toyota GT86
  { tier:"C", name:"Subaro BRZ Brisouille",     baseValue:2300, repairTime:68 }, // Subaru BRZ
  { tier:"C", name:"Mazda MX-5 RF Toit Fou",    baseValue:2600, repairTime:72 }, // Mazda MX-5 RF

  // ── TIER B — Nouvelles sportives ──────────────────────────────────
  { tier:"B", name:"Odi TT RS Toutaticouille",  baseValue:5400, repairTime:99 }, // Audi TT RS
  { tier:"B", name:"Merko C63 AMG Bagarreur",   baseValue:6200, repairTime:105}, // Mercedes C63 AMG
  { tier:"B", name:"BimV M4 F82 Déchaîné",      baseValue:5800, repairTime:102}, // BMW M4
  { tier:"B", name:"Porsha Cây S Turbote",      baseValue:5500, repairTime:100}, // Porsche Cayman S
  { tier:"B", name:"Alfa Roméa 4C Carbonifère", baseValue:4800, repairTime:95 }, // Alfa Romeo 4C
  { tier:"B", name:"Fjord Mustângu GT350R",     baseValue:5200, repairTime:98 }, // Ford Mustang GT350R
  { tier:"B", name:"Chevro Camâro SS Boucan",   baseValue:4600, repairTime:93 }, // Chevrolet Camaro SS
  { tier:"B", name:"Odi RS3 Sportbatailleur",   baseValue:5600, repairTime:101}, // Audi RS3
  { tier:"B", name:"BimV M2 F87 Rascal",        baseValue:4900, repairTime:96 }, // BMW M2
  { tier:"B", name:"Merko CLA 45 AMG Turbine",  baseValue:4400, repairTime:92 }, // Mercedes CLA 45
  { tier:"B", name:"Renno Mégânon RS Trophy",   baseValue:4200, repairTime:91 }, // Renault Megane RS Trophy
  { tier:"B", name:"Hinda NSX Mk1 Niponaise",   baseValue:6500, repairTime:107}, // Honda NSX Mk1
  { tier:"B", name:"Toyo Souprà Mk5 Reborn",    baseValue:6000, repairTime:104}, // Toyota Supra Mk5
  { tier:"B", name:"Subaro WRX STI Spec C",     baseValue:4300, repairTime:91 }, // Subaru WRX STI

  // ── TIER A — Nouveau luxe & GT ─────────────────────────────────────
  { tier:"A", name:"Odi RS7 Sportbahut",        baseValue:17800,repairTime:169}, // Audi RS7
  { tier:"A", name:"BimV M8 Coupé Costaud",     baseValue:19000,repairTime:173}, // BMW M8
  { tier:"A", name:"Merko E63 AMG Sergent",     baseValue:16000,repairTime:164}, // Mercedes E63 AMG
  { tier:"A", name:"Porsha Taycan Voltique",    baseValue:15500,repairTime:162}, // Porsche Taycan
  { tier:"A", name:"Odi e-tron GT Ampère",      baseValue:14800,repairTime:160}, // Audi e-tron GT
  { tier:"A", name:"BimV M5 F90 Conducteur",   baseValue:18000,repairTime:170}, // BMW M5 F90
  { tier:"A", name:"Merko GT 63 AMG Rugit",    baseValue:19500,repairTime:174}, // Mercedes AMG GT 63
  { tier:"A", name:"Lambo Huracan Evo Fissa",  baseValue:18500,repairTime:171}, // Lamborghini Huracan Evo
  { tier:"A", name:"Ferrero Roma Romantique",  baseValue:17000,repairTime:167}, // Ferrari Roma
  { tier:"A", name:"Mézarâti Grécal Crêpe",   baseValue:12000,repairTime:149}, // Maserati Grecale
  { tier:"A", name:"Bentlaï Bentaïga Costaud", baseValue:19800,repairTime:175}, // Bentley Bentayga
  { tier:"A", name:"Rollz Ghost Spectral",     baseValue:19900,repairTime:175}, // Rolls Royce Ghost

  // ── TIER S — Nouvelles GT prestige ────────────────────────────────
  { tier:"S", name:"Ferrero F8 Tributaire",    baseValue:26000,repairTime:205}, // Ferrari F8 Tributo
  { tier:"S", name:"Lambo Urus Pérformante",   baseValue:30000,repairTime:215}, // Lamborghini Urus Perf
  { tier:"S", name:"McLoren Artoura Sculptée", baseValue:35000,repairTime:227}, // McLaren Artura
  { tier:"S", name:"Porsha GT4 Piquant",       baseValue:28500,repairTime:211}, // Porsche GT4
  { tier:"S", name:"Odi R8 V10 Plus Glouton",  baseValue:47000,repairTime:260}, // Audi R8 V10 Plus
  { tier:"S", name:"BimV M8 Compé Rondouil",   baseValue:32000,repairTime:221}, // BMW M8 Competition
  { tier:"S", name:"Merko SL63 AMG Cabriouge", baseValue:38500,repairTime:237}, // Mercedes SL63 AMG
  { tier:"S", name:"Aston Marten DBX Boxer",   baseValue:27500,repairTime:209}, // Aston Martin DBX
  { tier:"S", name:"Ferrero Portofino Caillou", baseValue:33000,repairTime:222}, // Ferrari Portofino
  { tier:"S", name:"Mézarâti MC20 Tornade",    baseValue:44000,repairTime:253}, // Maserati MC20
  { tier:"S", name:"Nissou GT-R Nismo Ninja",  baseValue:48000,repairTime:263}, // Nissan GT-R Nismo

  // ── TIER SS — Nouvelles supercars ─────────────────────────────────
  { tier:"SS", name:"Ferrero SF90 Stradaoulette",baseValue:98000,repairTime:380}, // Ferrari SF90
  { tier:"SS", name:"McLoren 765LT Soufflant",  baseValue:120000,repairTime:418}, // McLaren 765LT
  { tier:"SS", name:"Lambo SVJ 63 Monstre",     baseValue:135000,repairTime:435}, // Lamborghini SVJ 63
  { tier:"SS", name:"Porsha GT2 RS Perforate",  baseValue:125000,repairTime:425}, // Porsche GT2 RS
  { tier:"SS", name:"Odi R8 GT Ultime Dorée",   baseValue:115000,repairTime:408}, // Audi R8 GT
  { tier:"SS", name:"BimV M4 GT3 Piste Pure",   baseValue:105000,repairTime:392}, // BMW M4 GT3
  { tier:"SS", name:"Merko AMG GT Black Série",  baseValue:145000,repairTime:445}, // AMG GT Black Series
  { tier:"SS", name:"Ferrero 812 Superfelice",  baseValue:108000,repairTime:396}, // Ferrari 812 Superfast
  { tier:"SS", name:"McLoren Elva Vent Capote",  baseValue:165000,repairTime:462}, // McLaren Elva

  // ── TIER SSS — Nouveaux hypercars ─────────────────────────────────
  { tier:"SSS", name:"Rimac C_Deux Électrosaur",baseValue:430000,repairTime:712}, // Rimac C_Two
  { tier:"SSS", name:"Koenigsmeg Gemêra Fameux", baseValue:495000,repairTime:748}, // Koenigsegg Gemera
  { tier:"SSS", name:"McLoren Spèdtail Caudal",  baseValue:520000,repairTime:758}, // McLaren Speedtail
  { tier:"SSS", name:"Lambo Countach LPI Rétro", baseValue:475000,repairTime:738}, // Lamborghini Countach LPI
  { tier:"SSS", name:"Aston Marten Valkyrie Dieu",baseValue:640000,repairTime:837}, // Aston Valkyrie
  { tier:"SSS", name:"Ferrero Daytona SP3 Soleil",baseValue:720000,repairTime:884}, // Ferrari Daytona SP3
  { tier:"SSS", name:"McLoren P1 GTR Pistouille",baseValue:610000,repairTime:823}, // McLaren P1 GTR
  { tier:"SSS", name:"Porsha 959 Classicos",     baseValue:360000,repairTime:660}, // Porsche 959

  // ── TIER SSS+ — Nouvelles légendes ────────────────────────────────
  { tier:"SSS+", name:"Ferrero FXX Evoluzounne",  baseValue:1100000,repairTime:1250}, // Ferrari FXX Evoluzione
  { tier:"SSS+", name:"Pagânì Utopîa Cieliste",   baseValue:2100000,repairTime:1850}, // Pagani Utopia
  { tier:"SSS+", name:"Koenigsmeg One:1 Absolu",  baseValue:2300000,repairTime:1950}, // Koenigsegg One:1
  { tier:"SSS+", name:"Lambo Égoïsta Solitaire",  baseValue:1800000,repairTime:1700}, // Lamborghini Egoista
  { tier:"SSS+", name:"Rimac Nêvera Apoc Record", baseValue:1300000,repairTime:1380}, // Rimac Nevera Record
  { tier:"SSS+", name:"Aston Marten Valkyrie AMR", baseValue:1950000,repairTime:1780}, // Aston Valkyrie AMR Pro
  { tier:"SSS+", name:"Bugatti Bolide Atomique",   baseValue:2800000,repairTime:2000}, // Bugatti Bolide
];

// helpers
function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

// Génération d'un véhicule selon le tier tiré au sort (basé sur la réputation)
function makeCar(){
  const tier = weightedPickTier(state.rep);
  const pool = CAR_CATALOG.filter(c => c.tier === tier);
  const base = pool.length ? pick(pool) : CAR_CATALOG[0];

  const value = Math.round(base.baseValue * (0.92 + Math.random() * 0.16));
  const time  = Math.max(1, Math.round(base.repairTime * (0.92 + Math.random() * 0.16)));

  return {
    id: crypto.randomUUID(),
    name: base.name,
    tier: base.tier,
    baseValue: value,
    repairTime: time,
    timeRemaining: time,
  };
}


// =====================
// UI REFS
// =====================
const $ = (s) => document.querySelector(s);

const moneyEl = $("#money");
const moneyPerSecEl = $("#moneyPerSec");
const repEl = $("#rep");
const garageLevelEl = $("#garageLevel");

const diagRewardEl = $("#diagReward");
const repairClickEl = $("#repairClick");
const repairAutoEl = $("#repairAuto");

const upgradeLevelEl = $("#upgradeLevel");
const upgradeListEl = $("#upgradeList");

const activeCarTitleEl = $("#activeCarTitle");
const activeCarValueEl = $("#activeCarValue");
const activeCarTimeEl  = $("#activeCarTime");
const activeCarTierEl  = $("#activeCarTier");
const repairBarEl      = $("#repairBar");

const queueCountEl = $("#queueCount");
const garageCapEl  = $("#garageCap");
const queueListEl  = $("#queueList");
const garageSlotsEl = $("#garageSlots");

const showroomListEl = $("#showroomList");
const showroomEmptyEl= $("#showroomEmpty");

const btnAnalyze = $("#btnAnalyze");
const btnRepairClick = $("#btnRepairClick");
const btnSave = $("#btnSave");

// Nom du garage éditable
const garageNameEl = $("#garageName");

function applyGarageName(){
  if(garageNameEl) garageNameEl.textContent = state.garageName || "Garage Turbo";
}

garageNameEl.addEventListener("click", () => {
  const current = state.garageName || "Garage Turbo";
  const input = document.createElement("input");
  input.type = "text";
  input.value = current;
  input.className = "brand__title brand__title--editing";
  input.maxLength = 30;

  garageNameEl.replaceWith(input);
  input.focus();
  input.select();

  function confirmEdit(){
    const val = input.value.trim() || "Garage Turbo";
    state.garageName = val;
    input.replaceWith(garageNameEl);
    applyGarageName();
  }

  input.addEventListener("blur", confirmEdit);
  input.addEventListener("keydown", (e) => {
    if(e.key === "Enter")  { input.blur(); }
    if(e.key === "Escape") { input.value = current; input.blur(); }
  });
});

const carsSoldEl = $("#carsSold");

const garageProgressText = $("#garageProgressText");
const garageProgressFill = $("#garageProgressFill");

const btnTalents = $("#btnTalents");
const talentsModal = $("#talentsModal");
const talentsBackdrop = $("#talentsBackdrop");
const btnTalentsClose = $("#btnTalentsClose");
const talentPointsEl = $("#talentPoints");
const talentListEl = $("#talentList");
const btnTalentsReset = $("#btnTalentsReset");


function renderGarageProgress(){
  const currentLevel = state.garageLevel;
  const sold = state.carsSold;

  const currentRequirement = GARAGE_LEVEL_REQUIREMENTS[currentLevel];
  const nextRequirement = GARAGE_LEVEL_REQUIREMENTS[currentLevel + 1];

  // Niveau max
  if(!nextRequirement){
    setIfChanged(garageProgressText, "Niveau maximum atteint");
    if(garageProgressFill._lastWidth !== "100%"){
      garageProgressFill._lastWidth = "100%";
      garageProgressFill.style.width = "100%";
    }
    return;
  }

  const progress = sold - currentRequirement;
  const needed   = nextRequirement - currentRequirement;
  const pct      = Math.max(0, Math.min(1, progress / needed));
  const pctStr   = `${(pct * 100).toFixed(2)}%`;

  setIfChanged(garageProgressText, `${progress} / ${needed} ventes`);

  // Ne touche à la largeur que si elle a vraiment changé
  if(garageProgressFill._lastWidth !== pctStr){
    garageProgressFill._lastWidth = pctStr;
    garageProgressFill.style.width = pctStr;
  }
}

function computeTalentEffects(){
  let passive   = 0;
  let speedMult = 1.0;
  let diagBonus = 0;
  let saleBonus = 0;
  let clickBonus= 0;

  // Business — passif
  passive += getTalentRank("passive_1") * 2;
  passive += getTalentRank("passive_2") * 8;

  // Business — vente
  saleBonus += getTalentRank("sale_1") * 0.03;
  saleBonus += getTalentRank("sale_2") * 0.08;

  // Atelier — vitesse
  speedMult *= (1 + getTalentRank("speed_1") * 0.06);
  speedMult *= (1 + getTalentRank("speed_2") * 0.10);

  // Atelier — clic bonus
  clickBonus += getTalentRank("click_1") * 0.2;

  // Diagnostic
  diagBonus += getTalentRank("diag_1") * 3;
  diagBonus += getTalentRank("diag_2") * 8;

  return { passive, speedMult, diagBonus, saleBonus, clickBonus };
}

function calcDealsPassive(){
  const rates = { loc_outils:2, contrat_taxi:5, assurance:10, atelier_nuit:20, franchise:50 };
  let total = 0;
  for(const [id, rate] of Object.entries(rates)){
    const u = state.upgrades.find(x => x.id === id);
    if(u) total += u.lvl * rate;
  }
  return total;
}

function applyTalentEffects(){
  const fx = computeTalentEffects();

  state.moneyPerSec    = fx.passive + calcDealsPassive() + (state.heritageBonuses?.passiveBonus ?? 0);
  state.talentSpeedMult= fx.speedMult;
  state.talentDiagBonus= fx.diagBonus;
  state.talentSaleBonus= fx.saleBonus;
  state.talentClickBonus = fx.clickBonus;
}

// =====================
// TALENT TREE
// =====================
const TALENTS = [
  // Branche Business
  { id:"passive_1", name:"Caisse Automatique", maxRank:10, category:"Business",
    icon:"💰",
    desc:"+2 €/s par rang — revenu passif de base",
    requires:[] },

  { id:"passive_2", name:"Contrats Mensuels", maxRank:10, category:"Business",
    icon:"📑",
    desc:"+8 €/s par rang (nécessite Caisse Automatique rang 3)",
    requires:[{id:"passive_1", rank:3}] },

  { id:"sale_1", name:"Négociateur Né", maxRank:10, category:"Business",
    icon:"🤝",
    desc:"+3% valeur de vente par rang",
    requires:[] },

  { id:"sale_2", name:"Réputation Locale", maxRank:10, category:"Business",
    icon:"🏆",
    desc:"+8% valeur de vente par rang (nécessite Négociateur rang 3)",
    requires:[{id:"sale_1", rank:3}] },

  // Branche Atelier
  { id:"speed_1", name:"Routine Atelier", maxRank:10, category:"Atelier",
    icon:"⚡",
    desc:"+6% vitesse de réparation par rang (clic + auto)",
    requires:[] },

  { id:"speed_2", name:"Organisation Pro", maxRank:10, category:"Atelier",
    icon:"🔧",
    desc:"+10% vitesse de réparation par rang (nécessite Routine rang 3)",
    requires:[{id:"speed_1", rank:3}] },

  { id:"click_1", name:"Main de Fer", maxRank:10, category:"Atelier",
    icon:"🖱️",
    desc:"+0.2s retirées par clic par rang",
    requires:[] },

  // Branche Diagnostic
  { id:"diag_1", name:"Œil de Lynx", maxRank:10, category:"Diagnostic",
    icon:"🔍",
    desc:"+3 € par analyse par rang",
    requires:[] },

  { id:"diag_2", name:"Scan Avancé", maxRank:10, category:"Diagnostic",
    icon:"🧠",
    desc:"+8 € par analyse par rang (nécessite Œil de Lynx rang 3)",
    requires:[{id:"diag_1", rank:3}] },
];


// =====================
// ARBRE HÉRITAGE (Prestige)
// =====================
const HERITAGE_PERKS = [

  // ══ BRANCHE MÉCANIQUE (rouge/orange) ══════════════════
  { id:"meca_speed_1",   branch:"Mécanique", icon:"⚡", name:"Cadence Atelier",
    desc:"+8% vitesse de réparation par rang (clic + auto)",
    maxRank:5, costPerRank:1,
    requires:[] },

  { id:"meca_click_1",   branch:"Mécanique", icon:"🔨", name:"Coups de Maître",
    desc:"+0.3s retirées par clic par rang",
    maxRank:5, costPerRank:1,
    requires:[{id:"meca_speed_1", rank:1}] },

  { id:"meca_auto_1",    branch:"Mécanique", icon:"🤖", name:"Mécanicien Fantôme",
    desc:"+0.5s/s de réparation auto par rang",
    maxRank:5, costPerRank:2,
    requires:[{id:"meca_speed_1", rank:2}] },

  { id:"meca_speed_2",   branch:"Mécanique", icon:"🚀", name:"Flux Continu",
    desc:"+15% vitesse de réparation par rang",
    maxRank:3, costPerRank:3,
    requires:[{id:"meca_speed_1", rank:3}, {id:"meca_auto_1", rank:2}] },

  { id:"meca_click_2",   branch:"Mécanique", icon:"💥", name:"Touche Précise",
    desc:"+0.8s retirées par clic par rang",
    maxRank:3, costPerRank:3,
    requires:[{id:"meca_click_1", rank:3}] },

  { id:"meca_ultimate",  branch:"Mécanique", icon:"🏎️", name:"Pilote de Course",
    desc:"×1.5 à toute la vitesse de réparation (unique)",
    maxRank:1, costPerRank:8,
    requires:[{id:"meca_speed_2", rank:2}, {id:"meca_click_2", rank:2}] },

  // ══ BRANCHE COMMERCE (vert/or) ════════════════════════
  { id:"com_start_1",    branch:"Commerce", icon:"💵", name:"Capital de Départ",
    desc:"+500€ à chaque nouveau prestige par rang",
    maxRank:5, costPerRank:1,
    requires:[] },

  { id:"com_sale_1",     branch:"Commerce", icon:"🤝", name:"Négociateur Hérité",
    desc:"+5% valeur de vente permanente par rang",
    maxRank:5, costPerRank:1,
    requires:[{id:"com_start_1", rank:1}] },

  { id:"com_passive_1",  branch:"Commerce", icon:"📈", name:"Rentes Familiales",
    desc:"+5 €/s de revenu passif permanent par rang",
    maxRank:5, costPerRank:2,
    requires:[{id:"com_start_1", rank:2}] },

  { id:"com_diag_1",     branch:"Commerce", icon:"🔬", name:"Expertise Reconnue",
    desc:"+10€ par diagnostic par rang",
    maxRank:5, costPerRank:2,
    requires:[{id:"com_sale_1", rank:2}] },

  { id:"com_sale_2",     branch:"Commerce", icon:"💎", name:"Réseau Premium",
    desc:"+12% valeur de vente par rang",
    maxRank:3, costPerRank:3,
    requires:[{id:"com_sale_1", rank:3}, {id:"com_passive_1", rank:2}] },

  { id:"com_ultimate",   branch:"Commerce", icon:"🏦", name:"Empire Automobile",
    desc:"×2 sur tous les revenus passifs (unique)",
    maxRank:1, costPerRank:8,
    requires:[{id:"com_sale_2", rank:2}, {id:"com_diag_1", rank:3}] },

  // ══ BRANCHE RÉPUTATION (bleu/violet) ══════════════════
  { id:"rep_gain_1",     branch:"Réputation", icon:"🏆", name:"Légende Locale",
    desc:"+15% REP gagné par vente par rang",
    maxRank:5, costPerRank:1,
    requires:[] },

  { id:"rep_talent_1",   branch:"Réputation", icon:"⭐", name:"Savoir Transmis",
    desc:"+1 point talent bonus au départ par rang",
    maxRank:5, costPerRank:1,
    requires:[{id:"rep_gain_1", rank:1}] },

  { id:"rep_prestige_1", branch:"Réputation", icon:"✨", name:"Héritage Amplifié",
    desc:"+10% points héritage gagnés par prestige par rang",
    maxRank:5, costPerRank:2,
    requires:[{id:"rep_gain_1", rank:2}] },

  { id:"rep_gain_2",     branch:"Réputation", icon:"👑", name:"Réputation Nationale",
    desc:"+25% REP gagné par vente par rang",
    maxRank:3, costPerRank:3,
    requires:[{id:"rep_gain_1", rank:3}, {id:"rep_talent_1", rank:2}] },

  { id:"rep_talent_2",   branch:"Réputation", icon:"🎓", name:"École du Garage",
    desc:"+2 points talent bonus au départ par rang",
    maxRank:3, costPerRank:3,
    requires:[{id:"rep_talent_1", rank:3}] },

  { id:"rep_ultimate",   branch:"Réputation", icon:"🌟", name:"Légende Vivante",
    desc:"×2 REP gagné sur toutes les ventes (unique)",
    maxRank:1, costPerRank:8,
    requires:[{id:"rep_gain_2", rank:2}, {id:"rep_prestige_1", rank:3}] },
];

function getHeritagePerkRank(id){
  return state.heritagePerks[id] ?? 0;
}

function hasHeritageRequirements(perk){
  return (perk.requires || []).every(r => getHeritagePerkRank(r.id) >= r.rank);
}

function calcHeritagePoints(){
  // Formule nerfée : chaque composante est plus dure à atteindre
  // garageLevel/20 + carsSold/2000 + rep/25000
  // Premier prestige minimum : floor(50/20) + floor(x/2000) + floor(50000/25000) = 2+0+2 = 4 pts
  const base = Math.floor(state.garageLevel / 20)
             + Math.floor((state.carsSold ?? 0) / 2000)
             + Math.floor((state.rep ?? 0) / 25000);
  // Le mult est calculé depuis les perks actuels (appliqués avant cet appel)
  const mult = state.heritageBonuses?.prestigeGainMult ?? 1.0;
  return Math.max(1, Math.floor(base * mult));
}

function canPrestige(){
  return state.garageLevel >= 50 && state.rep >= 50000;
}

function applyHeritageBonuses(){
  const b = {
    startMoney:       0,
    repSpeed:         1.0,
    saleBonus:        0,
    passiveBonus:     0,
    repGainMult:      1.0,
    talentBonus:      0,
    diagBonus:        0,
    prestigeGainMult: 1.0,
  };

  for(const p of HERITAGE_PERKS){
    const rank = getHeritagePerkRank(p.id);
    if(rank === 0) continue;

    // Mécanique
    if(p.id === "meca_speed_1")  b.repSpeed       *= Math.pow(1.08, rank);
    if(p.id === "meca_click_1")  b.repSpeed       += 0; // géré via repairClick au prestige
    if(p.id === "meca_auto_1")   b.repSpeed       += 0; // géré via repairAuto au prestige
    if(p.id === "meca_speed_2")  b.repSpeed       *= Math.pow(1.15, rank);
    if(p.id === "meca_click_2")  b.repSpeed       += 0;
    if(p.id === "meca_ultimate") b.repSpeed       *= 1.5;

    // Commerce
    if(p.id === "com_start_1")   b.startMoney     += rank * 500;
    if(p.id === "com_sale_1")    b.saleBonus      += rank * 0.05;
    if(p.id === "com_passive_1") b.passiveBonus   += rank * 5;
    if(p.id === "com_diag_1")    b.diagBonus      += rank * 10;
    if(p.id === "com_sale_2")    b.saleBonus      += rank * 0.12;
    if(p.id === "com_ultimate")  b.passiveBonus   *= 2;

    // Réputation
    if(p.id === "rep_gain_1")    b.repGainMult    *= Math.pow(1.15, rank);
    if(p.id === "rep_talent_1")  b.talentBonus    += rank * 1;
    if(p.id === "rep_prestige_1")b.prestigeGainMult += rank * 0.10;
    if(p.id === "rep_gain_2")    b.repGainMult    *= Math.pow(1.25, rank);
    if(p.id === "rep_talent_2")  b.talentBonus    += rank * 2;
    if(p.id === "rep_ultimate")  b.repGainMult    *= 2;
  }

  state.heritageBonuses = b;
}

function doPrestige(){
  // Applique les bonuses héritage EN PREMIER pour que calcHeritagePoints les prenne en compte
  applyHeritageBonuses();
  const pts = calcHeritagePoints();

  // Sauvegarder ce qui persiste
  const persistProfile    = state.profile;
  const persistAchievements = state.achievements;
  const persistPerks      = state.heritagePerks;
  const persistCount      = state.prestigeCount + 1;
  const persistSpent      = state.heritageSpent;
  const persistGarageName = state.garageName;
  const persistTotalMoney = state.totalMoneyEarned ?? 0;
  const persistTotalRep   = state.totalRepairs ?? 0;
  const persistTotalAna   = state.totalAnalyses ?? 0;
  const persistTotalClick = state.totalClickRepairs ?? 0;
  const persistSession    = state.sessionStart;

  // Reset du state (même structure que state initial)
  const baseUpgrades = JSON.parse(JSON.stringify(
    state.upgrades.map(u => ({ ...u, lvl:0, cost: getBaseUpgradeCost(u.id) }))
  ));

  // Les bonuses sont déjà appliqués en début de fonction
  const b = state.heritageBonuses;

  // Points talent bonus dès le départ
  const bonusTalent = Math.floor(b.talentBonus);

  Object.assign(state, {
    garageLevel:       1,
    garageCap:         1,
    garageName:        persistGarageName,
    money:             100 + b.startMoney,
    moneyPerSec:       b.passiveBonus,
    rep:               0,
    carsSold:          0,
    diagReward:        1 + b.diagBonus,
    repairClick:       0.5,
    repairAuto:        0.0,
    speedMult:         b.repSpeed,
    saleBonusPct:      b.saleBonus,
    talentPoints:      bonusTalent,
    talentLevelGranted:1,
    talents:           {},
    upgrades:          baseUpgrades,
    showroom:          [],
    queue:             [],
    active:            null,
    activeTab:         "tools",
    // Prestige
    prestigeCount:     persistCount,
    heritagePoints:    (state.heritagePoints ?? 0) + pts,
    heritageSpent:     persistSpent,
    heritagePerks:     persistPerks,
    heritageBonuses:   b,
    // Persistants
    profile:           persistProfile,
    achievements:      persistAchievements,
    totalMoneyEarned:  persistTotalMoney,
    totalRepairs:      persistTotalRep,
    totalAnalyses:     persistTotalAna,
    totalClickRepairs: persistTotalClick,
    sessionStart:      persistSession,
    _hasSaved:         false,
    _wasBroke:         false,
    _lastRepairedTier: "",
  });

  applyGarageName();
  applyTalentEffects();
  recalcRepairAuto();
  updateGarageLevel();
  updateTopbarProfile();
  renderAll();
  renderPrestigeNotif();
  save();

  showPrestigePopup(pts, persistCount);
}

// Coût de base d'un upgrade (pour reset au prestige)
const UPGRADE_BASE_COSTS = {
  manual:94, toolbox:268, obd:337, impact:800, nego:1000, comp:3500,
  lift:5000, impact2:7500, diagpro:12000, stagiaire:2500, vendeur:6000,
  apprenti:4000, mecanicien:15000, loc_outils:3000, contrat_taxi:8000,
  assurance:20000, atelier_nuit:50000, franchise:150000,
};
function getBaseUpgradeCost(id){ return UPGRADE_BASE_COSTS[id] ?? 100; }

function getTalentRank(id){
  return state.talents[id] ?? 0;
}

function hasRequirements(talent){
  return (talent.requires || []).every(r => getTalentRank(r.id) >= r.rank);
}

let _talentFilter = "Tous";

function renderTalentsUI(){
  // Points dispo
  const pointsEl = document.getElementById("talentPoints");
  if(pointsEl) setIfChanged(pointsEl, state.talentPoints);

  // Filtres par catégorie
  const filtersEl = document.getElementById("talentFilters");
  if(filtersEl){
    const cats = ["Tous", ...new Set(TALENTS.map(t=>t.category))];
    filtersEl.innerHTML = cats.map(c => {
      const catRanks = TALENTS.filter(t=>t.category===c).reduce((a,t)=>a+getTalentRank(t.id),0);
      const catMax   = TALENTS.filter(t=>t.category===c).reduce((a,t)=>a+t.maxRank,0);
      const label    = c === "Tous" ? "Tous" : `${c} ${catRanks}/${catMax}`;
      return `<button class="talentFilter${c===_talentFilter?" talentFilter--active":""}" data-cat="${c}">${label}</button>`;
    }).join("");
    filtersEl.querySelectorAll(".talentFilter").forEach(btn => {
      btn.addEventListener("click", () => { _talentFilter = btn.dataset.cat; renderTalentsUI(); });
    });
  }

  // Cartes
  talentListEl.innerHTML = "";
  const list = _talentFilter === "Tous" ? TALENTS : TALENTS.filter(t=>t.category===_talentFilter);

  for(const t of list){
    const rank   = getTalentRank(t.id);
    const locked = !hasRequirements(t);
    const maxed  = rank >= t.maxRank;
    const canBuy = !locked && state.talentPoints > 0 && !maxed;

    let cardClass = "talentCard";
    if(locked)      cardClass += " talentCard--locked";
    else if(maxed)  cardClass += " talentCard--maxed";
    else if(rank>0) cardClass += " talentCard--active";

    const dots = Array.from({length: t.maxRank}, (_, i) =>
      `<div class="talentCard__dot${i < rank ? " talentCard__dot--filled" : ""}"></div>`
    ).join("");

    let btnClass = "talentBtn";
    let btnLabel = `Acheter — 1 point`;
    if(locked){ btnClass += " talentBtn--locked"; btnLabel = "🔒 Prérequis manquant"; }
    else if(maxed){ btnClass += " talentBtn--maxed"; btnLabel = "✅ Rang maximum"; }

    const card = document.createElement("div");
    card.className = cardClass;
    card.innerHTML = `
      <div class="talentCard__header">
        <div class="talentCard__iconWrap">${t.icon ?? "⭐"}</div>
        <div class="talentCard__info">
          <div class="talentCard__name">${t.name}</div>
          <div class="talentCard__desc">${t.desc}</div>
        </div>
        <div class="talentCard__cat">${t.category}</div>
      </div>
      <div class="talentCard__rankRow">
        <div class="talentCard__dots">${dots}</div>
        <div class="talentCard__rankLabel">${rank} / ${t.maxRank}</div>
      </div>
      <button class="${btnClass}" data-talent-buy="${t.id}" ${canBuy ? "" : "disabled"}>
        ${btnLabel}
      </button>
    `;
    talentListEl.appendChild(card);
  }
}

talentListEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-talent-buy]");
  if(!btn) return;

  const id = btn.getAttribute("data-talent-buy");
  const t = TALENTS.find(x => x.id === id);
  if(!t) return;

  if(!hasRequirements(t)) return;

  const rank = getTalentRank(id);
  if(rank >= t.maxRank) return;
  if(state.talentPoints <= 0) return;

  state.talentPoints -= 1;
  state.talents[id] = rank + 1;

  applyTalentEffects();
  renderAll();
});

function openTalents(){
  talentsModal.style.display = "block";
  renderTalentsUI();
}
function closeTalents(){
  talentsModal.style.display = "none";
}

btnTalents.addEventListener("click", openTalents);
btnTalentsClose.addEventListener("click", closeTalents);
talentsBackdrop.addEventListener("click", closeTalents);

// Debug reset (optionnel)
// Reset talent payant
function calcTalentResetCost(){
  const totalRanks = Object.values(state.talents).reduce((a,v)=>a+v, 0);
  return Math.max(500, totalRanks * 500);
}

if(btnTalentsReset) btnTalentsReset.addEventListener("click", () => {
  const totalRanks = Object.values(state.talents).reduce((a,v)=>a+v, 0);
  if(totalRanks === 0){ showSaveIndicator("⚠️ Aucun talent actif"); return; }

  const cost = calcTalentResetCost();
  const costEl = document.getElementById("resetCostDisplay");
  if(costEl) costEl.textContent = formatMoney(cost);

  document.getElementById("talentResetModal").style.display = "block";
});

document.getElementById("btnResetCancel")?.addEventListener("click", () => {
  document.getElementById("talentResetModal").style.display = "none";
});
document.getElementById("talentResetBackdrop")?.addEventListener("click", () => {
  document.getElementById("talentResetModal").style.display = "none";
});
document.getElementById("btnResetConfirm")?.addEventListener("click", () => {
  const cost = calcTalentResetCost();
  if(state.money < cost){
    showSaveIndicator(`⚠️ Fonds insuffisants (${formatMoney(cost)})`);
    document.getElementById("talentResetModal").style.display = "none";
    return;
  }

  // Rembourser les points
  const totalRanks = Object.values(state.talents).reduce((a,v)=>a+v, 0);
  state.money      -= cost;
  state.talentPoints += totalRanks;
  state.talents    = {};
  state.talentSpeedMult  = 1;
  state.talentDiagBonus  = 0;
  state.talentSaleBonus  = 0;
  state.talentClickBonus = 0;

  applyTalentEffects();
  document.getElementById("talentResetModal").style.display = "none";
  showSaveIndicator(`✅ Reset — ${totalRanks} pts remboursés`);
  renderAll();
});

// =====================
// STATS MODAL
// =====================
const btnStats       = $("#btnStats");
const statsModal     = $("#statsModal");
const statsBackdrop  = $("#statsBackdrop");
const btnStatsClose  = $("#btnStatsClose");
const statsGridEl    = $("#statsGrid");

// Compteurs persistants pour les stats
if(!state.totalMoneyEarned)  state.totalMoneyEarned  = 0;
if(!state.totalRepairs)      state.totalRepairs      = 0;
if(!state.totalAnalyses)     state.totalAnalyses     = 0;
if(!state.totalClickRepairs) state.totalClickRepairs = 0;
if(!state.sessionStart)      state.sessionStart      = Date.now();

function renderStatsUI(){
  if(!statsGridEl) return;

  const upTotalLvl    = state.upgrades.reduce((a,u)=>a+u.lvl, 0);
  const talentTotal   = Object.values(state.talents).reduce((a,v)=>a+v, 0);
  const dealsPassive  = calcDealsPassive();
  const talentPassive = (getTalentRank("passive_1")*2) + (getTalentRank("passive_2")*8);
  const mult          = (state.speedMult??1) * (state.talentSpeedMult??1);
  const clickAmt      = ((state.repairClick??0) + (state.talentClickBonus??0)) * mult;
  const autoAmt       = (state.repairAuto??0) * mult;
  const salePct       = Math.round((state.saleBonusPct + (state.talentSaleBonus??0)) * 100);
  const sessionMin    = Math.floor((Date.now() - (state.sessionStart??Date.now())) / 60000);
  const achUnlocked   = Object.keys(state.achievements??{}).length;

  // Subtitle session
  const subEl = document.getElementById("statsSubtitle");
  if(subEl) subEl.textContent = sessionMin >= 60
    ? `Session : ${Math.floor(sessionMin/60)}h ${sessionMin%60}min`
    : `Session : ${sessionMin} min`;

  const tierOrder = ["F","E","D","C","B","A","S","SS","SSS","SSS+"];
  const nextTier     = tierOrder.find(t => state.rep < TIERS[t].repReq);
  const nextTierData = nextTier ? TIERS[nextTier] : null;
  const nextTierPct  = nextTierData ? Math.min(100, (state.rep / nextTierData.repReq * 100).toFixed(1)) : 100;

  statsGridEl.innerHTML = `
    <div class="statSection statSection--eco">
      <div class="statSection__title"><span class="statSection__titleIcon">💰</span>Économie</div>
      <div class="statRow"><span class="statRow__label">Argent actuel</span><span class="statRow__val statRow__val--green">${formatMoney(state.money)}</span></div>
      <div class="statRow"><span class="statRow__label">Revenu passif total</span><span class="statRow__val statRow__val--green">${formatMoney(state.moneyPerSec)}/s</span></div>
      <div class="statRow statRow--sub"><span class="statRow__label">· dont talents</span><span class="statRow__val">${talentPassive} €/s</span></div>
      <div class="statRow statRow--sub"><span class="statRow__label">· dont affaires</span><span class="statRow__val">${dealsPassive} €/s</span></div>
      <div class="statRow"><span class="statRow__label">Bonus vente</span><span class="statRow__val statRow__val--green">+${salePct}%</span></div>
    </div>

    <div class="statSection statSection--rep">
      <div class="statSection__title"><span class="statSection__titleIcon">🏆</span>Réputation</div>
      <div class="statRow"><span class="statRow__label">REP total</span><span class="statRow__val statRow__val--blue">${state.rep.toLocaleString("fr-FR")}</span></div>
      <div class="statRow"><span class="statRow__label">Tiers débloqués</span><span class="statRow__val statRow__val--blue">${tierOrder.filter(t=>state.rep>=TIERS[t].repReq).length} / 10</span></div>
      ${nextTierData ? `
      <div class="statRow"><span class="statRow__label">Prochain tier</span><span class="statRow__val" style="color:${nextTierData.color}">${nextTierData.label} — ${nextTierData.desc}</span></div>
      <div class="statTierProgress">
        <div class="statTierProgress__label">
          <span>${state.rep.toLocaleString("fr-FR")} REP</span>
          <span>${nextTierData.repReq.toLocaleString("fr-FR")} REP (${nextTierPct}%)</span>
        </div>
        <div class="statTierProgress__bar"><div class="statTierProgress__fill" style="width:${nextTierPct}%"></div></div>
      </div>` : `<div class="statRow"><span class="statRow__label">Tous tiers débloqués</span><span class="statRow__val statRow__val--green">✅</span></div>`}
    </div>

    <div class="statSection statSection--activity">
      <div class="statSection__title"><span class="statSection__titleIcon">🚗</span>Activité</div>
      <div class="statRow"><span class="statRow__label">Voitures vendues</span><span class="statRow__val statRow__val--cyan">${state.carsSold.toLocaleString("fr-FR")}</span></div>
      <div class="statRow"><span class="statRow__label">Réparations terminées</span><span class="statRow__val">${(state.totalRepairs??0).toLocaleString("fr-FR")}</span></div>
      <div class="statRow"><span class="statRow__label">Diagnostics effectués</span><span class="statRow__val">${(state.totalAnalyses??0).toLocaleString("fr-FR")}</span></div>
      <div class="statRow"><span class="statRow__label">Clics de réparation</span><span class="statRow__val">${(state.totalClickRepairs??0).toLocaleString("fr-FR")}</span></div>
    </div>

    <div class="statSection statSection--workshop">
      <div class="statSection__title"><span class="statSection__titleIcon">🔧</span>Atelier</div>
      <div class="statRow"><span class="statRow__label">Puissance clic</span><span class="statRow__val statRow__val--gold">${clickAmt.toFixed(2)}s / clic</span></div>
      <div class="statRow"><span class="statRow__label">Vitesse auto</span><span class="statRow__val statRow__val--gold">${autoAmt.toFixed(2)}s / s</span></div>
      <div class="statRow"><span class="statRow__label">Multiplicateur vitesse</span><span class="statRow__val statRow__val--gold">×${mult.toFixed(2)}</span></div>
      <div class="statRow"><span class="statRow__label">Emplacements garage</span><span class="statRow__val">${state.garageCap}</span></div>
      <div class="statRow"><span class="statRow__label">Niveaux améliorations</span><span class="statRow__val">${upTotalLvl}</span></div>
    </div>

    <div class="statSection statSection--full statSection--rep">
      <div class="statSection__title"><span class="statSection__titleIcon">📈</span>Tiers & Réputation par vente</div>
      <div class="statTierRow">
        ${tierOrder.map(tid => {
          const td = TIERS[tid];
          const unlocked = state.rep >= td.repReq;
          return `<div class="statTierBadge ${unlocked?"":"statTierBadge--locked"}" style="border:1px solid ${td.border};background:${td.bg}">
            <span class="statTierBadge__label" style="color:${td.color}">${td.label}</span>
            <span class="statTierBadge__gain">+${td.repGain} REP</span>
            ${!unlocked ? `<span class="statTierBadge__req">(${td.repReq.toLocaleString("fr-FR")})</span>` : ""}
          </div>`;
        }).join("")}
      </div>
    </div>

    <div class="statSection statSection--progress">
      <div class="statSection__title"><span class="statSection__titleIcon">⭐</span>Progression</div>
      <div class="statRow"><span class="statRow__label">Niveau Garage</span><span class="statRow__val statRow__val--purple">${state.garageLevel}</span></div>
      <div class="statRow"><span class="statRow__label">Talents dépensés</span><span class="statRow__val statRow__val--purple">${talentTotal} pts</span></div>
      <div class="statRow"><span class="statRow__label">Points talent restants</span><span class="statRow__val statRow__val--purple">${state.talentPoints}</span></div>
    </div>

    <div class="statSection statSection--eco">
      <div class="statSection__title"><span class="statSection__titleIcon">🎖️</span>Succès</div>
      <div class="statRow"><span class="statRow__label">Débloqués</span><span class="statRow__val statRow__val--green">${achUnlocked} / ${ACHIEVEMENTS.length}</span></div>
      <div class="statRow"><span class="statRow__label">Complétion</span><span class="statRow__val statRow__val--green">${Math.round(achUnlocked/ACHIEVEMENTS.length*100)}%</span></div>
    </div>
  `;
}

function openStats(){
  statsModal.style.display = "block";
  renderStatsUI();
}
function closeStats(){
  statsModal.style.display = "none";
}

btnStats.addEventListener("click", openStats);
btnStatsClose.addEventListener("click", closeStats);
statsBackdrop.addEventListener("click", closeStats);

// =====================
// RENDER
// =====================
function formatMoney(n){
  if(n >= 1_000_000_000_000) return (n / 1_000_000_000_000).toFixed(2) + " B€";
  if(n >= 1_000_000_000)     return (n / 1_000_000_000).toFixed(2)     + " G€";
  if(n >= 1_000_000)         return (n / 1_000_000).toFixed(2)         + " M€";
  if(n >= 10_000)            return (n / 1_000).toFixed(1)             + " k€";
  return Math.floor(n).toLocaleString("fr-FR")                         + " €";
}

// Cache des dernières valeurs affichées — évite les micro-tremblements DOM à 60fps
const _topCache = {};
function setIfChanged(el, val){
  if(!el) return;
  const s = String(val);
  if(el._lastVal === s) return;
  el._lastVal = s;
  el.textContent = s;
}

function renderTop(){
  setIfChanged(moneyEl,       formatMoney(state.money));
  setIfChanged(moneyPerSecEl, formatMoney(state.moneyPerSec) + "/s");
  setIfChanged(repEl,         state.rep);
  setIfChanged(garageLevelEl, state.garageLevel);
  setIfChanged(carsSoldEl,    state.carsSold);

  const diagTotal = state.diagReward + (state.talentDiagBonus ?? 0);
  setIfChanged(diagRewardEl, diagTotal);

  const mult = (state.speedMult ?? 1) * (state.talentSpeedMult ?? 1);
  setIfChanged(repairAutoEl,  (state.repairAuto  * mult).toFixed(2));
  setIfChanged(repairClickEl, (state.repairClick * mult).toFixed(2));

  // Point de notification talents
  const dot = document.getElementById("talentNotifDot");
  if(dot) dot.style.display = state.talentPoints > 0 ? "block" : "none";
}

function renderQueue(){
  // Occupés = voiture en atelier + voitures en file
  const occupied = (state.active ? 1 : 0) + state.queue.length;
  queueCountEl.textContent = occupied;
  garageCapEl.textContent  = state.garageCap;

  if(!garageSlotsEl) return;
  garageSlotsEl.innerHTML = "";

  // Calcul du badge worker pour le slot actif
  const apprentiLvl   = state.upgrades.find(u => u.id === "apprenti")?.lvl   || 0;
  const mecanicienLvl = state.upgrades.find(u => u.id === "mecanicien")?.lvl || 0;
  const hasWorker = apprentiLvl > 0 || mecanicienLvl > 0;
  const workerLabel = mecanicienLvl > 0
    ? `🛠️ Méca. niv.${mecanicienLvl}`
    : `🔩 Apprenti niv.${apprentiLvl}`;

  for(let i = 0; i < state.garageCap; i++){
    const slot = document.createElement("div");

    if(i === 0){
      const car = state.active;
      if(car){
        const pct = car.repairTime > 0 ? Math.max(0, (1 - car.timeRemaining / car.repairTime) * 100) : 100;
        const t = TIERS[car.tier] || TIERS["F"];
        slot.className = "garageSlot garageSlot--active";
        slot.innerHTML = `
          <div class="garageSlot__num">🔧</div>
          <div class="garageSlot__body">
            <div class="garageSlot__row">
              <div style="display:flex;align-items:center;gap:7px;min-width:0">
                <span class="tierBadge" style="background:${t.bg};border-color:${t.border};color:${t.color}">${t.label}</span>
                <div class="garageSlot__name">${car.name}</div>
              </div>
              <span class="garageSlot__status garageSlot__status--active">EN RÉPARATION</span>
            </div>
            <div class="garageSlot__bar">
              <div class="garageSlot__barFill" style="width:${pct.toFixed(1)}%"></div>
            </div>
            <div class="garageSlot__row">
              <div class="garageSlot__meta">${t.desc} · ${formatMoney(car.baseValue)} · ${pct.toFixed(0)}%</div>
              ${hasWorker ? `<span class="garageSlot__status garageSlot__status--worker">${workerLabel}</span>` : ""}
            </div>
          </div>
        `;
      } else {
        slot.className = "garageSlot garageSlot--empty";
        slot.innerHTML = `
          <div class="garageSlot__num">🔧</div>
          <div class="garageSlot__body">
            <div class="garageSlot__label">Atelier libre — en attente d'une voiture</div>
          </div>
        `;
      }
    } else {
      const car = state.queue[i - 1];
      if(car){
        const t = TIERS[car.tier] || TIERS["F"];
        slot.className = "garageSlot garageSlot--occupied";
        slot.innerHTML = `
          <div class="garageSlot__num">${i + 1}</div>
          <div class="garageSlot__body">
            <div class="garageSlot__row">
              <div style="display:flex;align-items:center;gap:7px;min-width:0">
                <span class="tierBadge" style="background:${t.bg};border-color:${t.border};color:${t.color}">${t.label}</span>
                <div class="garageSlot__name">${car.name}</div>
              </div>
              <span class="garageSlot__status garageSlot__status--wait">EN ATTENTE</span>
            </div>
            <div class="garageSlot__meta">${t.desc} · ${formatMoney(car.baseValue)} · ⏱️ ${car.repairTime}s</div>
          </div>
        `;
      } else {
        slot.className = "garageSlot garageSlot--empty";
        slot.innerHTML = `
          <div class="garageSlot__num">${i + 1}</div>
          <div class="garageSlot__body">
            <div class="garageSlot__label">Emplacement libre</div>
          </div>
        `;
      }
    }

    garageSlotsEl.appendChild(slot);
  }
}

function renderActive(){
  const car = state.active;

  if(!car){
    activeCarTitleEl.textContent = "Atelier vide";
    activeCarValueEl.textContent = "—";
    activeCarTimeEl.textContent = "—";
    activeCarTierEl.textContent = "—";
    repairBarEl.style.width = "0%";
    // Mettre à jour le slot atelier dans la grille
    const activeSlot = garageSlotsEl?.querySelector(".garageSlot--active, .garageSlot--empty");
    if(activeSlot) renderQueue();
    return;
  }

  activeCarTitleEl.textContent = car.name;
  activeCarValueEl.textContent = formatMoney(car.baseValue);
  activeCarTimeEl.textContent = car.timeRemaining.toFixed(1);
  activeCarTierEl.textContent = car.tier;

  const total = car.repairTime;
  const left  = Math.max(0, car.timeRemaining);
  const pct   = total > 0 ? (1 - (left / total)) : 1;
  repairBarEl.style.width = `${(pct * 100).toFixed(1)}%`;

  // Mettre à jour la mini barre dans le slot actif de la grille
  const fill = garageSlotsEl?.querySelector(".garageSlot--active .garageSlot__barFill");
  if(fill) fill.style.width = `${(pct * 100).toFixed(1)}%`;

  const metaEl = garageSlotsEl?.querySelector(".garageSlot--active .garageSlot__meta");
  const t = TIERS[car.tier] || TIERS["F"];
  if(metaEl) metaEl.textContent = `${t.desc} · ${formatMoney(car.baseValue)} · ${(pct*100).toFixed(0)}%`;
}

function renderShowroom(){
  showroomListEl.innerHTML = "";

  if(state.showroom.length === 0){
    showroomEmptyEl.style.display = "grid";
    showroomListEl.style.display = "none";
    return;
  }

  showroomEmptyEl.style.display = "none";
  showroomListEl.style.display = "block";

  for(const car of state.showroom){
    const saleValue = calcSaleValue(car);
    const t = TIERS[car.tier] || TIERS["F"];
    const div = document.createElement("div");
    div.className = "sItem";
    div.innerHTML = `
      <div style="min-width:0;flex:1">
        <div style="display:flex;align-items:center;gap:8px">
          <span class="tierBadge" style="background:${t.bg};border-color:${t.border};color:${t.color}">${t.label}</span>
          <div class="sItem__name">${car.name}</div>
        </div>
        <div class="sItem__meta" style="margin-top:4px">${t.desc} — ${formatMoney(saleValue)}</div>
      </div>
      <button class="sell" data-sell="${car.id}">Vendre</button>
    `;
    showroomListEl.appendChild(div);
  }
}

function renderUpgrades(){
  upgradeListEl.innerHTML = "";
  const totalLvls = state.upgrades.reduce((a,u)=>a+u.lvl,0);
  upgradeLevelEl.textContent = totalLvls;

  const filteredUpgrades = state.upgrades.filter(u => u.tab === state.activeTab);

  for(const u of filteredUpgrades){
    const isMaxed = u.maxLvl !== undefined && u.lvl >= u.maxLvl;
    const canBuy  = !isMaxed && state.money >= u.cost;

    const maxLvlHtml = u.maxLvl !== undefined
      ? `<div class="item__maxlvl">${isMaxed ? `✅ Niveau maximum atteint (${u.maxLvl})` : `Niveau max : ${u.maxLvl}`}</div>`
      : "";

    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <div class="item__left">
        <div class="item__icon">${u.icon}</div>
        <div class="item__txt">
          <div class="item__name">${u.name} <span class="pill">niv. ${u.lvl}</span></div>
          <div class="item__desc">${u.desc}</div>
          ${maxLvlHtml}
        </div>
      </div>
      <div class="item__right">
        <button class="buy" ${canBuy ? "" : "disabled"} data-buy="${u.id}">
          ${isMaxed ? "Max" : formatMoney(u.cost)}
        </button>
      </div>
    `;
    upgradeListEl.appendChild(item);
  }
}

// AJOUTE CE CODE dans la section "ACTIONS" (vers la ligne de l'écouteur btnAnalyze) :
document.querySelector(".tabs").addEventListener("click", (e) => {
  if(!e.target.classList.contains("tab")) return;
  
  // Met à jour l'UI des onglets
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("tab--active"));
  e.target.classList.add("tab--active");
  
  // Met à jour le state et re-render
  state.activeTab = e.target.getAttribute("data-tab");
  renderUpgrades();
});

function renderAll(){
  applyTalentEffects();
  renderTop();
  renderQueue();
  renderActive();
  renderShowroom();
  renderUpgrades();
  renderGarageProgress();
  renderTalentsUI();
  renderPrestigeNotif();
}

// =====================
// PRESTIGE UI
// =====================
let _heritageFilter = "Tous";

function renderPrestigeNotif(){
  const dot = document.getElementById("prestigeNotifDot");
  if(dot) dot.style.display = canPrestige() ? "block" : "none";
}

function renderPrestigeModal(){
  const pts = calcHeritagePoints();
  const can = canPrestige();

  // Header info
  const el = document.getElementById("prestigeInfo");
  if(el) el.innerHTML = `
    <div class="prestige__infoRow">
      <div class="prestige__infoBlock">
        <div class="prestige__infoLabel">PRESTIGES</div>
        <div class="prestige__infoVal" style="color:#ff8c40">${state.prestigeCount}</div>
      </div>
      <div class="prestige__infoBlock">
        <div class="prestige__infoLabel">POINTS HÉRITAGE</div>
        <div class="prestige__infoVal" style="color:#ffc83a">${state.heritagePoints}</div>
      </div>
      <div class="prestige__infoBlock">
        <div class="prestige__infoLabel">GAIN ESTIMÉ</div>
        <div class="prestige__infoVal" style="color:${can ? '#2ee59d' : '#888'}">${can ? '+' + pts : '—'}</div>
      </div>
    </div>
    <div class="prestige__conditions">
      <div class="prestige__cond ${state.garageLevel >= 50 ? 'prestige__cond--ok' : ''}">
        ${state.garageLevel >= 50 ? '✅' : '🔒'} Garage LVL 50
        <span>${state.garageLevel}/50</span>
      </div>
      <div class="prestige__cond ${state.rep >= 50000 ? 'prestige__cond--ok' : ''}">
        ${state.rep >= 50000 ? '✅' : '🔒'} 50 000 REP
        <span>${state.rep.toLocaleString("fr-FR")}/50 000</span>
      </div>
    </div>
    <button class="prestige__btn ${can ? '' : 'prestige__btn--locked'}" id="btnDoPrestige" ${can ? '' : 'disabled'}>
      ${can ? '🔥 LANCER LE PRESTIGE' : '🔒 Conditions non remplies'}
    </button>
  `;

  // Rebind prestige button
  const btn = document.getElementById("btnDoPrestige");
  if(btn && can) btn.addEventListener("click", () => {
    document.getElementById("prestigeConfirmModal").style.display = "block";
    const gainEl = document.getElementById("prestigeConfirmGain");
    if(gainEl) gainEl.textContent = "+" + pts + " points Héritage";
  });

  // Filters
  const branches = ["Tous", "Mécanique", "Commerce", "Réputation"];
  const filtersEl = document.getElementById("heritageFilters");
  if(filtersEl){
    filtersEl.innerHTML = branches.map(b => {
      const branchPerks = HERITAGE_PERKS.filter(p => b === "Tous" || p.branch === b);
      const spent = branchPerks.reduce((a,p) => a + getHeritagePerkRank(p.id) * p.costPerRank, 0);
      const maxSpend = branchPerks.reduce((a,p) => a + p.maxRank * p.costPerRank, 0);
      const label = b === "Tous" ? "Tous" : `${b} ${spent}/${maxSpend}`;
      return `<button class="heritageFilter${b === _heritageFilter ? " heritageFilter--active" : ""}" data-hbranch="${b}">${label}</button>`;
    }).join("");
    filtersEl.querySelectorAll(".heritageFilter").forEach(btn => {
      btn.addEventListener("click", () => {
        _heritageFilter = btn.getAttribute("data-hbranch");
        renderPrestigeModal();
      });
    });
  }

  // Grid
  const gridEl = document.getElementById("heritageGrid");
  if(!gridEl) return;
  const list = _heritageFilter === "Tous"
    ? HERITAGE_PERKS
    : HERITAGE_PERKS.filter(p => p.branch === _heritageFilter);

  const branchColors = {
    "Mécanique":  { main:"#ff7043", bg:"rgba(255,112,67,.08)", border:"rgba(255,112,67,.2)" },
    "Commerce":   { main:"#ffc83a", bg:"rgba(255,200,58,.08)", border:"rgba(255,200,58,.2)" },
    "Réputation": { main:"#a78bfa", bg:"rgba(167,139,250,.08)", border:"rgba(167,139,250,.2)" },
  };

  gridEl.innerHTML = "";
  for(const p of list){
    const rank    = getHeritagePerkRank(p.id);
    const locked  = !hasHeritageRequirements(p);
    const maxed   = rank >= p.maxRank;
    const cost    = p.costPerRank;
    const canBuy  = !locked && !maxed && state.heritagePoints >= cost;
    const col     = branchColors[p.branch] || { main:"#888", bg:"rgba(0,0,0,.1)", border:"rgba(255,255,255,.1)" };

    let cardClass = "heritageCard";
    if(maxed)        cardClass += " heritageCard--maxed";
    else if(rank > 0) cardClass += " heritageCard--active";
    else if(locked)  cardClass += " heritageCard--locked";

    const dots = Array.from({length: p.maxRank}, (_, i) =>
      `<div class="heritageCard__dot${i < rank ? " heritageCard__dot--filled" : ""}" style="${i < rank ? `background:${col.main};border-color:${col.main};box-shadow:0 0 5px ${col.main}40` : ""}"></div>`
    ).join("");

    let btnLabel, btnClass;
    if(maxed)        { btnLabel = "✅ Rang maximum"; btnClass = "heritageBtn heritageBtn--maxed"; }
    else if(locked)  { btnLabel = "🔒 Prérequis manquant"; btnClass = "heritageBtn heritageBtn--locked"; }
    else if(!canBuy) { btnLabel = `${cost} pt${cost>1?'s':''} requis`; btnClass = "heritageBtn heritageBtn--locked"; }
    else             { btnLabel = `Acheter — ${cost} pt${cost>1?'s':''}`; btnClass = "heritageBtn"; }

    const card = document.createElement("div");
    card.className = cardClass;
    card.style.cssText = maxed
      ? `border-color:rgba(49,214,255,.25);background:rgba(49,214,255,.04)`
      : rank > 0
        ? `border-color:${col.border};background:${col.bg}`
        : "";

    card.innerHTML = `
      ${rank > 0 || maxed ? `<div class="heritageCard__line" style="background:linear-gradient(180deg,${maxed ? '#31d6ff' : col.main},transparent)"></div>` : ""}
      <div class="heritageCard__header">
        <div class="heritageCard__iconWrap" style="${rank > 0 ? `background:${col.bg};border-color:${col.border};box-shadow:0 0 14px ${col.main}22` : ""}">${p.icon}</div>
        <div class="heritageCard__info">
          <div class="heritageCard__name">${p.name}</div>
          <div class="heritageCard__desc">${p.desc}</div>
        </div>
        <div class="heritageCard__branch" style="color:${col.main};background:${col.bg};border-color:${col.border}">${p.branch}</div>
      </div>
      <div class="heritageCard__rankRow">
        <div class="heritageCard__dots">${dots}</div>
        <div class="heritageCard__rankLabel" style="${rank > 0 ? `color:${col.main}` : ""}">${rank} / ${p.maxRank}</div>
      </div>
      <button class="${btnClass}" data-hperk="${p.id}" ${(!canBuy || locked || maxed) ? "disabled" : ""}>${btnLabel}</button>
    `;
    gridEl.appendChild(card);
  }

  // Boutons acheter
  gridEl.querySelectorAll(".heritageBtn:not(:disabled)").forEach(btn => {
    btn.addEventListener("click", () => {
      const id   = btn.getAttribute("data-hperk");
      const perk = HERITAGE_PERKS.find(p => p.id === id);
      if(!perk) return;
      const cost = perk.costPerRank;
      if(state.heritagePoints < cost) return;
      state.heritagePoints -= cost;
      state.heritageSpent  += cost;
      state.heritagePerks[id] = (state.heritagePerks[id] ?? 0) + 1;
      applyHeritageBonuses();
      applyTalentEffects();
      renderPrestigeModal();
      save();
    });
  });

  // Points restants en header
  const ptsEl = document.getElementById("heritagePointsDisplay");
  if(ptsEl) ptsEl.textContent = "Points disponibles : " + state.heritagePoints;
}

function showPrestigePopup(pts, count){
  const popup = document.getElementById("prestigePopup");
  if(!popup) return;
  document.getElementById("prestigePopupCount").textContent = "Prestige #" + count;
  document.getElementById("prestigePopupPts").textContent   = "+" + pts + " points Héritage";
  popup.style.display = "block";
  // Animation
  popup.classList.remove("prestigePopup--in");
  void popup.offsetWidth;
  popup.classList.add("prestigePopup--in");
  setTimeout(() => { popup.style.display = "none"; popup.classList.remove("prestigePopup--in"); }, 4500);
}

function openPrestige(){
  document.getElementById("prestigeModal").style.display = "block";
  renderPrestigeModal();
}
function closePrestige(){
  document.getElementById("prestigeModal").style.display = "none";
}

// Bouton topbar prestige
const btnPrestige = document.getElementById("btnPrestige");
if(btnPrestige) btnPrestige.addEventListener("click", openPrestige);
document.getElementById("btnPrestigeClose")?.addEventListener("click", closePrestige);
document.getElementById("prestigeBackdrop")?.addEventListener("click", closePrestige);

// Confirmation modal
document.getElementById("prestigeConfirmCancel")?.addEventListener("click", () => {
  document.getElementById("prestigeConfirmModal").style.display = "none";
});
document.getElementById("prestigeConfirmBackdrop")?.addEventListener("click", () => {
  document.getElementById("prestigeConfirmModal").style.display = "none";
});
document.getElementById("prestigeConfirmOk")?.addEventListener("click", () => {
  document.getElementById("prestigeConfirmModal").style.display = "none";
  closePrestige();
  doPrestige();
});

// =====================
// GAMEPLAY HELPERS
// =====================
function tryStartNextRepair(){
  if(state.active) return;
  const next = state.queue.shift();
  if(!next) return;
  state.active = next;
}

function calcSaleValue(car){
  const bonus = 1 + state.saleBonusPct + (state.talentSaleBonus ?? 0);
  return Math.round(car.baseValue * bonus);
}

function finishRepair(){
  state._lastRepairedTier = state.active.tier; // pour succès "Réparer du Luxe"
  state.showroom.unshift(state.active);
  state.active = null;
  state.totalRepairs = (state.totalRepairs ?? 0) + 1;
  tryStartNextRepair();
  renderAll();
}

function applyRepairTime(seconds){
  if(!state.active) return;

  state.active.timeRemaining -= seconds;
  if(state.active.timeRemaining <= 0){
    finishRepair();
  }
}

// =====================
// ACTIONS
// =====================
// =====================
// ANTI-AUTOCLICK
// =====================
// Cooldown minimum entre deux clics : 150ms (~6-7 clics/s max)
// Un humain rapide fait 8-10 clics/s max, on laisse de la marge
const CLICK_COOLDOWN_MS = 50;
let _lastRepairClick  = 0;
let _lastAnalyzeClick = 0;

btnAnalyze.addEventListener("click", () => {
  const now = Date.now();
  if(now - _lastAnalyzeClick < CLICK_COOLDOWN_MS) return; // trop rapide = ignoré
  _lastAnalyzeClick = now;

  const occupied = (state.active ? 1 : 0) + state.queue.length;
  if (occupied >= state.garageCap) return;

  state.money += state.diagReward + (state.talentDiagBonus ?? 0);
  state.totalAnalyses = (state.totalAnalyses ?? 0) + 1;
  state.queue.push(makeCar());
  tryStartNextRepair();
  renderAll();
});

btnRepairClick.addEventListener("click", () => {
  const now = Date.now();
  if(now - _lastRepairClick < CLICK_COOLDOWN_MS) return; // trop rapide = ignoré
  _lastRepairClick = now;

  const mult = (state.speedMult ?? 1) * (state.talentSpeedMult ?? 1);
  const clickAmt = (state.repairClick + (state.talentClickBonus ?? 0)) * mult;
  applyRepairTime(clickAmt);
  state.totalClickRepairs = (state.totalClickRepairs ?? 0) + 1;
  renderActive();
});

let _lastSellClick = 0;
showroomListEl.addEventListener("click", (e) => {
  const now = Date.now();
  if(now - _lastSellClick < CLICK_COOLDOWN_MS) return;
  _lastSellClick = now;

  const btn = e.target.closest("[data-sell]");
  if(!btn) return;

  const id = btn.getAttribute("data-sell");
  const idx = state.showroom.findIndex(c => c.id === id);
  if(idx === -1) return;

  const car = state.showroom[idx];
  const saleValue = calcSaleValue(car);
  state.money += saleValue;

  // REP gagné selon le tier de la voiture vendue
  const tierData = TIERS[car.tier] || TIERS["F"];
  const repMult = state.heritageBonuses?.repGainMult ?? 1.0;
  state.rep += Math.round(tierData.repGain * repMult);

  state.carsSold += 1;
  updateGarageLevel();

  state.showroom.splice(idx, 1);

  renderAll();
});

upgradeListEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-buy]");
  if(!btn) return;

  const id = btn.getAttribute("data-buy");
  const u = state.upgrades.find(x => x.id === id);
  if(!u) return;
  if(state.money < u.cost) return;
  if(u.maxLvl !== undefined && u.lvl >= u.maxLvl) return;

  state.money -= u.cost;
  u.lvl += 1;

// EFFETS (version "temps", cohérente)
if(id === "manual")  state.diagReward += 1;
if(id === "obd")     state.diagReward += 5;

// ✅ clic = secondes retirées par clic (petits gains)
if(id === "toolbox") state.repairClick += 0.10;
if(id === "impact")  state.repairClick += 0.15; 
if(id === "impact2") state.repairClick += 0.25; 

// ✅ vente / vitesse / capacité
if(id === "nego")    state.saleBonusPct += 0.05;
if(id === "comp")    state.speedMult *= 1.10;
if(id === "lift")    state.garageCap += 1;
if(id === "diagpro") state.diagReward += 20;

// Équipe auto-repair : on recalcule repairAuto depuis les niveaux
if(id === "apprenti" || id === "mecanicien") recalcRepairAuto();

  // coût scale
  u.cost = Math.ceil(u.cost * 1.25);

  renderAll();
});

function recalcRepairAuto(){
  const apprentiLvl   = state.upgrades.find(u => u.id === "apprenti")?.lvl   || 0;
  const mecanicienLvl = state.upgrades.find(u => u.id === "mecanicien")?.lvl || 0;
  state.repairAuto = (apprentiLvl * 0.3) + (mecanicienLvl * 1.0);
}

// =====================
// IDLE LOOP
// =====================
let last = performance.now();
let autoAnalyzeTimer = 0;
let autoSellTimer = 0;
let achCheckTimer = 0;

function tick(now){
  const dt = (now - last) / 1000;
  last = now;

  state.money += state.moneyPerSec * dt;

  if(state.active){
    const mult = (state.speedMult ?? 1) * (state.talentSpeedMult ?? 1);
    const secPerSec = state.repairAuto * mult;
    applyRepairTime(secPerSec * dt);
  } else {
    tryStartNextRepair();
  }

  // --- LOGIQUE D'AUTOMATISATION ---
  const stagiaireLvl = state.upgrades.find(u => u.id === "stagiaire")?.lvl || 0;
  if (stagiaireLvl > 0) {
    autoAnalyzeTimer += dt;
    // Nerfé : démarre à 12s, descend à 6s max (niveau 5 = ~9s, niveau 10 = 6s)
    const delay = Math.max(6, 12 - (stagiaireLvl * 0.6));
    if (autoAnalyzeTimer >= delay) {
      autoAnalyzeTimer = 0;
      // Utilise la même limite que le bouton manuel : queue < garageCap - 1
      const occupied = (state.active ? 1 : 0) + state.queue.length;
      if (occupied < state.garageCap) {
        document.getElementById("btnAnalyze").click();
      }
    }
  }

  const vendeurLvl = state.upgrades.find(u => u.id === "vendeur")?.lvl || 0;
  if (vendeurLvl > 0 && state.showroom.length > 0) {
    autoSellTimer += dt;
    // Nerfé : démarre à 15s, descend à 8s max
    const delay = Math.max(8, 15 - (vendeurLvl * 0.7));
    if (autoSellTimer >= delay) {
      autoSellTimer = 0;
      const firstCarSellBtn = document.querySelector("#showroomList .sell");
      if(firstCarSellBtn) firstCarSellBtn.click();
    }
  }

  renderTop();
  renderActive();

  // Vérification des succès toutes les 2s
  achCheckTimer += dt;
  if(achCheckTimer >= 2){
    achCheckTimer = 0;
    checkAchievements();
  }

  requestAnimationFrame(tick);
}

// =====================
// SUPABASE AUTH + CLOUD SAVE
// =====================

// ⚠️  Remplace ces deux valeurs par tes vraies clés Supabase
//     Dashboard Supabase → Project Settings → API
const SUPABASE_URL      = "https://ydruyvfusnrekfllocqq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnV5dmZ1c25yZWtmbGxvY3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2ODE3MDIsImV4cCI6MjA4ODI1NzcwMn0.dgwUXXNHzg0oyQdcnaJNkrIo6S63d6Dw-BDmWqhwS7w";

const _supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let _authReady  = false; // empêche le tick de sauvegarder avant que la session soit connue

// Unique point d'entrée pour toute la gestion de session
_supa.auth.onAuthStateChange(async (event, session) => {
  console.log("[auth] event:", event, "user:", session?.user?.id ?? "null");
  currentUser = session?.user ?? null;
  updateAuthUI();

  if(event === "INITIAL_SESSION" || event === "SIGNED_IN"){
    if(currentUser){
      // Petit délai pour laisser le token JWT se stabiliser
      await new Promise(r => setTimeout(r, 300));
      await cloudLoad();
    } else {
      localLoad();
      renderAll();
    }
    _authReady = true;
    tryStartNextRepair();
  }

  if(event === "SIGNED_OUT"){
    localSave();
    updateAuthUI();
    renderAll();
  }
});

function updateAuthUI(){
  const btnAuth    = document.getElementById("btnAuth");
  const btnProfile = document.getElementById("btnProfile");
  if(!btnAuth) return;
  if(currentUser){
    btnAuth.style.display = "none";
    if(btnProfile) btnProfile.style.display = "flex";
    updateTopbarProfile();
  } else {
    btnAuth.style.display = "flex";
    if(btnProfile) btnProfile.style.display = "none";
  }
}

function updateTopbarProfile(){
  const avatarEl = document.getElementById("topbarAvatar");
  const pseudoEl = document.getElementById("topbarPseudo");
  if(avatarEl) avatarEl.textContent = state.profile?.avatar || "🔧";
  if(pseudoEl) pseudoEl.textContent = state.profile?.pseudo || "Mécanicien";
}

function openAuth(){
  if(currentUser){ _supa.auth.signOut(); return; }
  const modal = document.getElementById("supaAuthModal");
  if(modal){ modal.style.display = "block"; document.getElementById("supaAuthEmail")?.focus(); }
}

async function supaAuthSubmit(mode){
  const email = document.getElementById("supaAuthEmail")?.value?.trim();
  const pwd   = document.getElementById("supaAuthPwd")?.value;
  const msgEl = document.getElementById("supaAuthMsg");
  if(!email || !pwd){ if(msgEl) msgEl.textContent = "Email et mot de passe requis."; return; }
  if(msgEl) msgEl.textContent = "⏳...";
  let error;
  if(mode === "signup"){
    const r = await _supa.auth.signUp({ email, password: pwd });
    error = r.error;
    if(!error && msgEl) msgEl.textContent = "✅ Vérifie ton email pour confirmer !";
  } else {
    const r = await _supa.auth.signInWithPassword({ email, password: pwd });
    error = r.error;
    if(!error) document.getElementById("supaAuthModal").style.display = "none";
  }
  if(error && msgEl) msgEl.textContent = "❌ " + error.message;
}

async function supaResetPassword(){
  const email = document.getElementById("supaAuthEmail")?.value?.trim();
  const msgEl = document.getElementById("supaAuthMsg");
  if(!email){ if(msgEl) msgEl.textContent = "Entre ton email d'abord."; return; }
  await _supa.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
  if(msgEl) msgEl.textContent = "✅ Email de réinitialisation envoyé !";
}

document.getElementById("supaAuthClose")?.addEventListener("click", () => {
  document.getElementById("supaAuthModal").style.display = "none";
});
document.getElementById("supaAuthBackdrop")?.addEventListener("click", () => {
  document.getElementById("supaAuthModal").style.display = "none";
});
document.getElementById("supaAuthBtnLogin")?.addEventListener("click",  () => supaAuthSubmit("login"));
document.getElementById("supaAuthBtnSignup")?.addEventListener("click", () => supaAuthSubmit("signup"));
document.getElementById("supaAuthBtnReset")?.addEventListener("click",  supaResetPassword);
document.getElementById("supaAuthPwd")?.addEventListener("keydown", (e) => {
  if(e.key === "Enter") supaAuthSubmit("login");
});

// =====================
// SAVE / LOAD — Supabase direct + LocalStorage fallback
// =====================
const SAVE_KEY = "garage_idle_save_v2";

// Données à sauvegarder
function buildSavePayload(){
  return {
    garageLevel:        state.garageLevel,
    garageCap:          state.garageCap,
    garageName:         state.garageName,
    money:              state.money,
    moneyPerSec:        state.moneyPerSec,
    rep:                state.rep,
    carsSold:           state.carsSold,
    diagReward:         state.diagReward,
    repairClick:        state.repairClick,
    repairAuto:         state.repairAuto,
    speedMult:          state.speedMult,
    saleBonusPct:       state.saleBonusPct,
    talentPoints:       state.talentPoints,
    talentLevelGranted: state.talentLevelGranted,
    talents:            state.talents,
    upgrades:           state.upgrades,
    showroom:           state.showroom,
    queue:              state.queue,
    activeTab:          state.activeTab,
    totalMoneyEarned:   state.totalMoneyEarned,
    totalRepairs:       state.totalRepairs,
    totalAnalyses:      state.totalAnalyses,
    totalClickRepairs:  state.totalClickRepairs,
    sessionStart:       state.sessionStart,
    profile:            state.profile,
    achievements:       state.achievements,
    prestigeCount:      state.prestigeCount,
    heritagePoints:     state.heritagePoints,
    heritageSpent:      state.heritageSpent,
    heritagePerks:      state.heritagePerks,
    heritageBonuses:    state.heritageBonuses,
    _hasSaved:          state._hasSaved,
    _wasBroke:          state._wasBroke,
    _lastRepairedTier:  state._lastRepairedTier,
  };
}

// Applique les données chargées dans le state
function applySaveData(data){
  const baseUpgrades = JSON.parse(JSON.stringify(state.upgrades));
  Object.assign(state, data);

  // Fusion intelligente des upgrades (préserve les nouvelles amélis)
  if(data.upgrades){
    state.upgrades = baseUpgrades.map(baseItem => {
      const saved = data.upgrades.find(x => x.id === baseItem.id);
      if(saved){ baseItem.lvl = saved.lvl; baseItem.cost = saved.cost; }
      return baseItem;
    });
  }

  // Sécurités
  if(typeof state.carsSold !== "number")          state.carsSold = 0;
  if(typeof state.talentPoints !== "number")      state.talentPoints = 0;
  if(typeof state.talents !== "object" || !state.talents) state.talents = {};
  if(typeof state.talentLevelGranted !== "number") state.talentLevelGranted = state.garageLevel ?? 1;
  if(!state.activeTab)  state.activeTab  = "tools";
  if(!state.garageName) state.garageName = "Garage Turbo";
  if(!state.profile || typeof state.profile !== "object") state.profile = { pseudo:"Mécanicien", avatar:"🔧", country:"FR", banner:"#1a2a4a" };
  else {
    state.profile.pseudo  = state.profile.pseudo  || "Mécanicien";
    state.profile.avatar  = state.profile.avatar  || "🔧";
    state.profile.country = state.profile.country || "FR";
    state.profile.banner  = state.profile.banner  || "#1a2a4a";
  }
  if(!state.achievements || typeof state.achievements !== "object") state.achievements = {};
  if(typeof state.prestigeCount  !== "number") state.prestigeCount  = 0;
  if(typeof state.heritagePoints !== "number") state.heritagePoints = 0;
  if(typeof state.heritageSpent  !== "number") state.heritageSpent  = 0;
  if(!state.heritagePerks   || typeof state.heritagePerks   !== "object") state.heritagePerks   = {};
  if(!state.heritageBonuses || typeof state.heritageBonuses !== "object") state.heritageBonuses = { startMoney:0, repSpeed:1.0, saleBonus:0, passiveBonus:0, repGainMult:1.0, talentBonus:0, diagBonus:0, prestigeGainMult:1.0 };
  if(!state._hasSaved)         state._hasSaved         = false;
  if(!state._wasBroke)         state._wasBroke         = false;
  if(!state._lastRepairedTier) state._lastRepairedTier = "";

  applyGarageName();
  applyTalentEffects();
  recalcRepairAuto();
  updateGarageLevel();
  updateTopbarProfile();
}
function localSave(){
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(buildSavePayload())); } catch(e){}
}
function localLoad(){
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if(raw) applySaveData(JSON.parse(raw));
  } catch(e){ console.error("Erreur load local:", e); }
}

let cloudSaving = false;
async function cloudSave(){
  if(!currentUser || cloudSaving) return;
  cloudSaving = true;
  console.log("[cloudSave] sauvegarde pour user:", currentUser.id);
  try {
    const { error } = await _supa
      .from("saves")
      .upsert(
        { user_id: currentUser.id, save_data: buildSavePayload(), updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
    if(error) throw error;
    console.log("[cloudSave] ✅ succès");
    showSaveIndicator("☁️ Sauvegardé");
  } catch(e){
    console.error("[cloudSave] ❌ erreur:", e);
    showSaveIndicator("⚠️ Erreur cloud");
  } finally { cloudSaving = false; }
}

async function cloudLoad(){
  if(!currentUser) { console.warn("[cloudLoad] pas de currentUser"); return; }
  console.log("[cloudLoad] user:", currentUser.id);
  try {
    // Timeout de sécurité 8s pour éviter le freeze
    const fetchPromise = _supa
      .from("saves")
      .select("save_data")
      .eq("user_id", currentUser.id)
      .maybeSingle();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 8000)
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
    console.log("[cloudLoad] data:", data, "error:", error);
    if(error) throw error;
    if(data?.save_data){
      console.log("[cloudLoad] save trouvée, application...");
      applySaveData(data.save_data);
      localSave();
      showSaveIndicator("☁️ Partie chargée");
    } else {
      console.warn("[cloudLoad] aucune save trouvée pour cet user");
    }
    renderAll();
  } catch(e){
    console.error("[cloudLoad] erreur:", e.message);
    // Fallback sur le localStorage si le cloud ne répond pas
    console.warn("[cloudLoad] fallback localStorage");
    localLoad();
    renderAll();
  }
}

function showSaveIndicator(msg){
  const btn = document.getElementById("btnSave");
  if(!btn) return;
  const orig = btn.textContent;
  btn.textContent = msg;
  setTimeout(() => btn.textContent = orig, 2000);
}

function save(){
  if(!_authReady) return; // ne pas sauvegarder avant que la session soit connue
  state._hasSaved = true;
  localSave();
  if(currentUser) cloudSave();
}

btnSave.addEventListener("click", save);
const btnAuth = document.getElementById("btnAuth");
if(btnAuth) btnAuth.addEventListener("click", openAuth);

// =====================
// PROFIL
// =====================
const AVATARS = [
  "🔧","🔩","🚗","🏎️","🚙","🛻","🏁","⚙️","🛠️","🔨",
  "🪛","🔋","💨","🔥","⚡","🏆","👑","💎","🤖","🦊",
  "🐺","🦁","🐻","🐯","🦅","🐉","👾","🎮","💀","🌟"
];

const BANNERS = [
  "#1a2a4a","#0d2137","#1a1a2e","#16213e",
  "#2d1b4e","#1b3a4b","#1a3a2a","#3a1a1a",
  "#2a1a3a","#3a2a1a","#1a3a3a","#0a0a0a",
  "linear-gradient(135deg,#1a2a4a,#2d1b4e)",
  "linear-gradient(135deg,#1b3a4b,#1a3a2a)",
  "linear-gradient(135deg,#3a1a1a,#3a2a1a)",
  "linear-gradient(135deg,#0d1829,#1a2a1a)",
];

const COUNTRIES = [
  {code:"FR",name:"France"},{code:"BE",name:"Belgique"},{code:"CH",name:"Suisse"},
  {code:"CA",name:"Canada"},{code:"DE",name:"Allemagne"},{code:"ES",name:"Espagne"},
  {code:"IT",name:"Italie"},{code:"PT",name:"Portugal"},{code:"GB",name:"Royaume-Uni"},
  {code:"US",name:"États-Unis"},{code:"JP",name:"Japon"},{code:"BR",name:"Brésil"},
  {code:"MX",name:"Mexique"},{code:"AU",name:"Australie"},{code:"NL",name:"Pays-Bas"},
  {code:"PL",name:"Pologne"},{code:"RU",name:"Russie"},{code:"MA",name:"Maroc"},
  {code:"DZ",name:"Algérie"},{code:"TN",name:"Tunisie"},{code:"OTHER",name:"Autre"},
];

// Génère une image drapeau via flagcdn.com (compatible tous navigateurs/OS)
function flagImg(code){
  if(code === "OTHER") return `<span style="font-size:14px;">🌍</span>`;
  return `<img src="https://flagcdn.com/16x12/${code.toLowerCase()}.png" width="16" height="12" style="border-radius:2px;vertical-align:middle;margin-right:6px;" alt="${code}">`;
}

let selectedAvatar = null;
let selectedBanner = null;

function openProfileModal(){
  const modal = document.getElementById("profileModal");
  if(!modal) return;

  // Pré-remplir depuis state.profile
  const p = state.profile || {};
  selectedAvatar = p.avatar || "🔧";
  selectedBanner = p.banner || "#1a2a4a";

  document.getElementById("profilePseudo").value = p.pseudo || "";

  // Remplir pays — le select natif ne supporte pas le HTML, on utilise un select custom simple
  const sel = document.getElementById("profileCountry");
  sel.innerHTML = COUNTRIES.map(c =>
    `<option value="${c.code}" ${c.code === (p.country||"FR") ? "selected" : ""}>${c.name}</option>`
  ).join("");

  // Remplir avatars
  const grid = document.getElementById("avatarGrid");
  grid.innerHTML = AVATARS.map(a =>
    `<div class="avatarOption${a === selectedAvatar ? " avatarOption--selected" : ""}" data-avatar="${a}">${a}</div>`
  ).join("");

  grid.querySelectorAll(".avatarOption").forEach(el => {
    el.addEventListener("click", () => {
      selectedAvatar = el.dataset.avatar;
      grid.querySelectorAll(".avatarOption").forEach(x => x.classList.remove("avatarOption--selected"));
      el.classList.add("avatarOption--selected");
      updateProfilePreview();
    });
  });

  // Remplir bannières
  const picker = document.getElementById("bannerPicker");
  picker.innerHTML = BANNERS.map((b,i) =>
    `<div class="bannerOption${b === selectedBanner ? " bannerOption--selected" : ""}" data-banner="${b}" style="background:${b}"></div>`
  ).join("");

  picker.querySelectorAll(".bannerOption").forEach(el => {
    el.addEventListener("click", () => {
      selectedBanner = el.dataset.banner;
      picker.querySelectorAll(".bannerOption").forEach(x => x.classList.remove("bannerOption--selected"));
      el.classList.add("bannerOption--selected");
      updateProfilePreview();
    });
  });

  updateProfilePreview();
  modal.style.display = "flex";
}

function updateProfilePreview(){
  const pseudo  = document.getElementById("profilePseudo")?.value || "Mécanicien";
  const country = document.getElementById("profileCountry")?.value || "FR";
  const countryData = COUNTRIES.find(c => c.code === country);

  document.getElementById("previewBanner").style.background = selectedBanner || "#1a2a4a";
  document.getElementById("previewAvatar").textContent = selectedAvatar || "🔧";
  document.getElementById("previewPseudo").textContent  = pseudo || "Mécanicien";
  const previewCountryEl = document.getElementById("previewCountry");
  if(previewCountryEl){
    previewCountryEl.innerHTML = countryData
      ? `${flagImg(countryData.code)}${countryData.name}`
      : "";
  }
}

function saveProfile(){
  const pseudo   = document.getElementById("profilePseudo")?.value.trim() || "Mécanicien";
  const country  = document.getElementById("profileCountry")?.value || "FR";

  state.profile = {
    pseudo:  pseudo.substring(0, 20),
    avatar:  selectedAvatar || "🔧",
    country: country,
    banner:  selectedBanner || "#1a2a4a",
  };

  updateTopbarProfile();
  save();
  document.getElementById("profileModal").style.display = "none";
  showSaveIndicator("✅ Profil sauvegardé");
}

// Listeners profil
const btnProfile = document.getElementById("btnProfile");
if(btnProfile) btnProfile.addEventListener("click", openProfileModal);

const btnProfileClose = document.getElementById("btnProfileClose");
if(btnProfileClose) btnProfileClose.addEventListener("click", () => {
  document.getElementById("profileModal").style.display = "none";
});

const profileBackdrop = document.getElementById("profileBackdrop");
if(profileBackdrop) profileBackdrop.addEventListener("click", () => {
  document.getElementById("profileModal").style.display = "none";
});

const btnProfileSave = document.getElementById("btnProfileSave");
if(btnProfileSave) btnProfileSave.addEventListener("click", saveProfile);

// Mise à jour preview en temps réel sur frappe pseudo
document.getElementById("profilePseudo")?.addEventListener("input", updateProfilePreview);
document.getElementById("profileCountry")?.addEventListener("change", updateProfilePreview);



// =====================
// SUCCÈS
// =====================
const ACHIEVEMENTS = [
  // ── VENTES ──────────────────────────────────────────
  { id:"sell_1",      cat:"Ventes",      icon:"🚗", name:"Premier Client",         desc:"Vendre 1 voiture",                     cond:s=>s.carsSold>=1,        reward:{rep:5,   money:0,      talent:0} },
  { id:"sell_10",     cat:"Ventes",      icon:"🚗", name:"Petit Commerce",          desc:"Vendre 10 voitures",                   cond:s=>s.carsSold>=10,       reward:{rep:10,  money:500,    talent:0} },
  { id:"sell_50",     cat:"Ventes",      icon:"🚙", name:"Vendeur Confirmé",        desc:"Vendre 50 voitures",                   cond:s=>s.carsSold>=50,       reward:{rep:25,  money:2000,   talent:1} },
  { id:"sell_100",    cat:"Ventes",      icon:"🚙", name:"Centenaire",              desc:"Vendre 100 voitures",                  cond:s=>s.carsSold>=100,      reward:{rep:50,  money:5000,   talent:1} },
  { id:"sell_250",    cat:"Ventes",      icon:"🏎️", name:"Série Noire",             desc:"Vendre 250 voitures",                  cond:s=>s.carsSold>=250,      reward:{rep:100, money:10000,  talent:1} },
  { id:"sell_500",    cat:"Ventes",      icon:"🏎️", name:"Demi-Millier",            desc:"Vendre 500 voitures",                  cond:s=>s.carsSold>=500,      reward:{rep:200, money:25000,  talent:2} },
  { id:"sell_1000",   cat:"Ventes",      icon:"🏁", name:"Mille Voitures",          desc:"Vendre 1 000 voitures",                cond:s=>s.carsSold>=1000,     reward:{rep:400, money:50000,  talent:2} },
  { id:"sell_5000",   cat:"Ventes",      icon:"🏁", name:"Tycoon de l'Occasion",    desc:"Vendre 5 000 voitures",                cond:s=>s.carsSold>=5000,     reward:{rep:1000,money:200000, talent:3} },
  { id:"sell_10000",  cat:"Ventes",      icon:"👑", name:"Empire de l'Auto",        desc:"Vendre 10 000 voitures",               cond:s=>s.carsSold>=10000,    reward:{rep:2000,money:500000, talent:5} },
  { id:"sell_50000",  cat:"Ventes",      icon:"👑", name:"Légende Vivante",         desc:"Vendre 50 000 voitures",               cond:s=>s.carsSold>=50000,    reward:{rep:5000,money:1000000,talent:10} },

  // ── ARGENT ──────────────────────────────────────────
  { id:"money_1k",    cat:"Argent",      icon:"💰", name:"Premier Billet",          desc:"Avoir 1 000 € en caisse",              cond:s=>s.money>=1000,        reward:{rep:5,   money:0,      talent:0} },
  { id:"money_10k",   cat:"Argent",      icon:"💰", name:"Petite Épargne",          desc:"Avoir 10 000 € en caisse",             cond:s=>s.money>=10000,       reward:{rep:15,  money:0,      talent:0} },
  { id:"money_100k",  cat:"Argent",      icon:"💵", name:"Cent Mille",              desc:"Avoir 100 000 € en caisse",            cond:s=>s.money>=100000,      reward:{rep:50,  money:0,      talent:1} },
  { id:"money_1m",    cat:"Argent",      icon:"💵", name:"Millionnaire",            desc:"Avoir 1 000 000 € en caisse",          cond:s=>s.money>=1000000,     reward:{rep:200, money:0,      talent:2} },
  { id:"money_10m",   cat:"Argent",      icon:"💎", name:"Dizaine de Millions",     desc:"Avoir 10 000 000 € en caisse",         cond:s=>s.money>=10000000,    reward:{rep:500, money:0,      talent:3} },
  { id:"money_1b",    cat:"Argent",      icon:"💎", name:"Milliardaire",            desc:"Avoir 1 000 000 000 € en caisse",      cond:s=>s.money>=1000000000,  reward:{rep:2000,money:0,      talent:5} },
  { id:"passive_10",  cat:"Argent",      icon:"📈", name:"Rente Modeste",           desc:"Atteindre 10 €/s de revenu passif",    cond:s=>s.moneyPerSec>=10,    reward:{rep:20,  money:5000,   talent:0} },
  { id:"passive_100", cat:"Argent",      icon:"📈", name:"Flux Continu",            desc:"Atteindre 100 €/s de revenu passif",   cond:s=>s.moneyPerSec>=100,   reward:{rep:100, money:20000,  talent:1} },
  { id:"passive_1k",  cat:"Argent",      icon:"📊", name:"Machine à Cash",          desc:"Atteindre 1 000 €/s de revenu passif", cond:s=>s.moneyPerSec>=1000,  reward:{rep:500, money:100000, talent:2} },

  // ── RÉPUTATION ──────────────────────────────────────
  { id:"rep_10",      cat:"Réputation",  icon:"⭐", name:"Débutant Connu",          desc:"Atteindre 10 REP",                     cond:s=>s.rep>=10,            reward:{rep:0,   money:100,    talent:0} },
  { id:"rep_100",     cat:"Réputation",  icon:"⭐", name:"Réputation Locale",       desc:"Atteindre 100 REP",                    cond:s=>s.rep>=100,           reward:{rep:0,   money:500,    talent:0} },
  { id:"rep_500",     cat:"Réputation",  icon:"🌟", name:"Garage Reconnu",          desc:"Atteindre 500 REP",                    cond:s=>s.rep>=500,           reward:{rep:0,   money:2000,   talent:1} },
  { id:"rep_2000",    cat:"Réputation",  icon:"🌟", name:"Expert Régional",         desc:"Atteindre 2 000 REP",                  cond:s=>s.rep>=2000,          reward:{rep:0,   money:8000,   talent:1} },
  { id:"rep_10000",   cat:"Réputation",  icon:"💫", name:"Célébrité Nationale",     desc:"Atteindre 10 000 REP",                 cond:s=>s.rep>=10000,         reward:{rep:0,   money:50000,  talent:2} },
  { id:"rep_50000",   cat:"Réputation",  icon:"💫", name:"Icône Mondiale",          desc:"Atteindre 50 000 REP",                 cond:s=>s.rep>=50000,         reward:{rep:0,   money:200000, talent:3} },
  { id:"rep_200000",  cat:"Réputation",  icon:"🔱", name:"Légende de l'Asphalte",   desc:"Atteindre 200 000 REP",                cond:s=>s.rep>=200000,        reward:{rep:0,   money:1000000,talent:5} },

  // ── TIERS ────────────────────────────────────────────
  { id:"tier_D",      cat:"Tiers",       icon:"🔓", name:"Véhicules Communs",       desc:"Débloquer le tier D",                  cond:s=>s.rep>=80,            reward:{rep:10,  money:1000,   talent:0} },
  { id:"tier_C",      cat:"Tiers",       icon:"🔓", name:"Compactes Sportives",     desc:"Débloquer le tier C",                  cond:s=>s.rep>=300,           reward:{rep:20,  money:3000,   talent:0} },
  { id:"tier_B",      cat:"Tiers",       icon:"🔓", name:"Sportives & Youngtimers", desc:"Débloquer le tier B",                  cond:s=>s.rep>=1500,          reward:{rep:50,  money:10000,  talent:1} },
  { id:"tier_A",      cat:"Tiers",       icon:"🔓", name:"Luxe & SUV Premium",      desc:"Débloquer le tier A",                  cond:s=>s.rep>=6000,          reward:{rep:100, money:30000,  talent:1} },
  { id:"tier_S",      cat:"Tiers",       icon:"🌠", name:"Sportives Prestige",      desc:"Débloquer le tier S",                  cond:s=>s.rep>=20000,         reward:{rep:200, money:100000, talent:2} },
  { id:"tier_SS",     cat:"Tiers",       icon:"🌠", name:"Supercars",               desc:"Débloquer le tier SS",                 cond:s=>s.rep>=70000,         reward:{rep:500, money:300000, talent:3} },
  { id:"tier_SSS",    cat:"Tiers",       icon:"💥", name:"Hypercars Rares",         desc:"Débloquer le tier SSS",                cond:s=>s.rep>=200000,        reward:{rep:1000,money:1000000,talent:5} },
  { id:"tier_SSSp",   cat:"Tiers",       icon:"💥", name:"Mythiques",               desc:"Débloquer le tier SSS+",               cond:s=>s.rep>=600000,        reward:{rep:5000,money:5000000,talent:10} },

  // ── NIVEAU GARAGE ────────────────────────────────────
  { id:"lvl_5",       cat:"Garage",      icon:"🏠", name:"Atelier en Rodage",       desc:"Atteindre le niveau 5",                cond:s=>s.garageLevel>=5,     reward:{rep:10,  money:500,    talent:0} },
  { id:"lvl_10",      cat:"Garage",      icon:"🏠", name:"Garage Opérationnel",     desc:"Atteindre le niveau 10",               cond:s=>s.garageLevel>=10,    reward:{rep:20,  money:2000,   talent:1} },
  { id:"lvl_25",      cat:"Garage",      icon:"🏗️", name:"Expansion Majeure",       desc:"Atteindre le niveau 25",               cond:s=>s.garageLevel>=25,    reward:{rep:50,  money:10000,  talent:1} },
  { id:"lvl_50",      cat:"Garage",      icon:"🏗️", name:"Centre Auto",             desc:"Atteindre le niveau 50",               cond:s=>s.garageLevel>=50,    reward:{rep:100, money:30000,  talent:2} },
  { id:"lvl_100",     cat:"Garage",      icon:"🏢", name:"Complexe Automobile",     desc:"Atteindre le niveau 100",              cond:s=>s.garageLevel>=100,   reward:{rep:300, money:100000, talent:3} },
  { id:"lvl_150",     cat:"Garage",      icon:"🏢", name:"Méga Garage",             desc:"Atteindre le niveau 150",              cond:s=>s.garageLevel>=150,   reward:{rep:600, money:500000, talent:5} },
  { id:"lvl_200",     cat:"Garage",      icon:"🌆", name:"Empire Immobilier",       desc:"Atteindre le niveau 200",              cond:s=>s.garageLevel>=200,   reward:{rep:2000,money:2000000,talent:10} },
  { id:"cap_2",       cat:"Garage",      icon:"🅿️", name:"Double Atelier",          desc:"Avoir 2 emplacements de garage",       cond:s=>s.garageCap>=2,       reward:{rep:15,  money:1000,   talent:0} },
  { id:"cap_4",       cat:"Garage",      icon:"🅿️", name:"Quadruple Capacité",      desc:"Avoir 4 emplacements de garage",       cond:s=>s.garageCap>=4,       reward:{rep:50,  money:5000,   talent:1} },
  { id:"cap_6",       cat:"Garage",      icon:"🅿️", name:"Parc de Stationnement",   desc:"Avoir 6 emplacements de garage",       cond:s=>s.garageCap>=6,       reward:{rep:100, money:15000,  talent:1} },

  // ── RÉPARATIONS ──────────────────────────────────────
  { id:"rep_1",       cat:"Atelier",     icon:"🔧", name:"Première Réparation",     desc:"Terminer 1 réparation",                cond:s=>s.totalRepairs>=1,    reward:{rep:5,   money:0,      talent:0} },
  { id:"rep_50r",     cat:"Atelier",     icon:"🔧", name:"Mains dans le Cambouis",  desc:"Terminer 50 réparations",              cond:s=>s.totalRepairs>=50,   reward:{rep:20,  money:1000,   talent:0} },
  { id:"rep_200r",    cat:"Atelier",     icon:"🛠️", name:"Mécanicien Chevronné",    desc:"Terminer 200 réparations",             cond:s=>s.totalRepairs>=200,  reward:{rep:50,  money:5000,   talent:1} },
  { id:"rep_1000r",   cat:"Atelier",     icon:"🛠️", name:"Maître de l'Atelier",     desc:"Terminer 1 000 réparations",           cond:s=>s.totalRepairs>=1000, reward:{rep:150, money:20000,  talent:1} },
  { id:"rep_5000r",   cat:"Atelier",     icon:"⚙️", name:"Machine de Guerre",       desc:"Terminer 5 000 réparations",           cond:s=>s.totalRepairs>=5000, reward:{rep:500, money:100000, talent:2} },
  { id:"click_10",    cat:"Atelier",     icon:"🖱️", name:"Première Frappe",         desc:"10 clics de réparation",               cond:s=>s.totalClickRepairs>=10,   reward:{rep:5,   money:50,   talent:0} },
  { id:"click_500",   cat:"Atelier",     icon:"🖱️", name:"Tapoteur Assidu",         desc:"500 clics de réparation",              cond:s=>s.totalClickRepairs>=500,  reward:{rep:20,  money:1000, talent:0} },
  { id:"click_5000",  cat:"Atelier",     icon:"💪", name:"Bras d'Acier",            desc:"5 000 clics de réparation",            cond:s=>s.totalClickRepairs>=5000, reward:{rep:80,  money:5000, talent:1} },
  { id:"click_50000", cat:"Atelier",     icon:"💪", name:"Cliqueur Légendaire",     desc:"50 000 clics de réparation",           cond:s=>s.totalClickRepairs>=50000,reward:{rep:300, money:50000,talent:2} },
  { id:"auto_repair", cat:"Atelier",     icon:"🤖", name:"Atelier Automatisé",      desc:"Avoir une réparation auto active",     cond:s=>s.repairAuto>0,       reward:{rep:30,  money:2000,   talent:0} },
  { id:"speed_5",     cat:"Atelier",     icon:"⚡", name:"Vitesse de Croisière",    desc:"Multiplicateur de vitesse ≥ 1.5×",     cond:s=>(s.speedMult??1)*(s.talentSpeedMult??1)>=1.5, reward:{rep:50,money:5000,talent:1} },
  { id:"speed_10",    cat:"Atelier",     icon:"⚡", name:"Turbo Activé",            desc:"Multiplicateur de vitesse ≥ 2×",       cond:s=>(s.speedMult??1)*(s.talentSpeedMult??1)>=2,   reward:{rep:150,money:20000,talent:2} },

  // ── DIAGNOSTIC ───────────────────────────────────────
  { id:"diag_1",      cat:"Diagnostic",  icon:"🔍", name:"Scanner en Main",         desc:"Effectuer 1 diagnostic",               cond:s=>s.totalAnalyses>=1,   reward:{rep:5,   money:0,      talent:0} },
  { id:"diag_100",    cat:"Diagnostic",  icon:"🔍", name:"Diagnostiqueur",          desc:"Effectuer 100 diagnostics",            cond:s=>s.totalAnalyses>=100, reward:{rep:20,  money:500,    talent:0} },
  { id:"diag_1000",   cat:"Diagnostic",  icon:"🧠", name:"Expert du Scan",          desc:"Effectuer 1 000 diagnostics",          cond:s=>s.totalAnalyses>=1000,reward:{rep:80,  money:5000,   talent:1} },
  { id:"diag_10000",  cat:"Diagnostic",  icon:"🧠", name:"Maître Diagnostiqueur",   desc:"Effectuer 10 000 diagnostics",         cond:s=>s.totalAnalyses>=10000,reward:{rep:300,money:30000,  talent:2} },
  { id:"diag_auto",   cat:"Diagnostic",  icon:"🤖", name:"Stagiaire Embauché",      desc:"Débloquer le Stagiaire Accueil",       cond:s=>(s.upgrades?.find(u=>u.id==="stagiaire")?.lvl??0)>=1, reward:{rep:25,money:2000,talent:0} },
  { id:"diag_reward", cat:"Diagnostic",  icon:"💡", name:"Diagnostic Premium",      desc:"Avoir +50€ par diagnostic",            cond:s=>s.diagReward>=50,     reward:{rep:100, money:10000,  talent:1} },

  // ── AMÉLIORATIONS ────────────────────────────────────
  { id:"up_first",    cat:"Améliorations",icon:"📦",name:"Premier Investissement",  desc:"Acheter une première amélioration",    cond:s=>s.upgrades?.some(u=>u.lvl>0), reward:{rep:5,  money:0,     talent:0} },
  { id:"up_10",       cat:"Améliorations",icon:"📦",name:"Équipé",                  desc:"10 niveaux d'améliorations au total",  cond:s=>s.upgrades?.reduce((a,u)=>a+u.lvl,0)>=10,    reward:{rep:20, money:1000,  talent:0} },
  { id:"up_50",       cat:"Améliorations",icon:"🔩",name:"Garage Équipé",           desc:"50 niveaux d'améliorations au total",  cond:s=>s.upgrades?.reduce((a,u)=>a+u.lvl,0)>=50,    reward:{rep:80, money:5000,  talent:1} },
  { id:"up_100",      cat:"Améliorations",icon:"🔩",name:"Atelier Pro",             desc:"100 niveaux d'améliorations au total", cond:s=>s.upgrades?.reduce((a,u)=>a+u.lvl,0)>=100,   reward:{rep:200,money:20000, talent:2} },
  { id:"up_vendeur",  cat:"Améliorations",icon:"👔",name:"Vendeur Recruté",         desc:"Embaucher le Vendeur Junior",          cond:s=>(s.upgrades?.find(u=>u.id==="vendeur")?.lvl??0)>=1,    reward:{rep:30, money:3000,  talent:0} },
  { id:"up_meca",     cat:"Améliorations",icon:"🛠️",name:"Mécanicien Recruté",      desc:"Embaucher le Mécanicien",              cond:s=>(s.upgrades?.find(u=>u.id==="mecanicien")?.lvl??0)>=1, reward:{rep:50, money:5000,  talent:0} },
  { id:"up_franchise",cat:"Améliorations",icon:"🏢",name:"Franchisé",              desc:"Acheter la Franchise Régionale",       cond:s=>(s.upgrades?.find(u=>u.id==="franchise")?.lvl??0)>=1,  reward:{rep:200,money:0,     talent:2} },

  // ── TALENTS ──────────────────────────────────────────
  { id:"tal_first",   cat:"Talents",     icon:"⭐", name:"Premier Don",             desc:"Dépenser 1 point de talent",           cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=1,  reward:{rep:10, money:500,   talent:0} },
  { id:"tal_10",      cat:"Talents",     icon:"⭐", name:"Arbre Naissant",          desc:"10 rangs de talents dépensés",         cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=10, reward:{rep:30, money:2000,  talent:0} },
  { id:"tal_50",      cat:"Talents",     icon:"🌟", name:"Maîtrise Avancée",        desc:"50 rangs de talents dépensés",         cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=50, reward:{rep:100,money:10000, talent:1} },
  { id:"tal_max1",    cat:"Talents",     icon:"💫", name:"Spécialiste",             desc:"Maxer un talent à 10/10",              cond:s=>Object.values(s.talents??{}).some(v=>v>=10),           reward:{rep:150,money:15000, talent:1} },
  { id:"tal_max5",    cat:"Talents",     icon:"💫", name:"Expert Polyvalent",       desc:"Maxer 5 talents à 10/10",              cond:s=>Object.values(s.talents??{}).filter(v=>v>=10).length>=5,reward:{rep:500,money:50000, talent:3} },

  // ── SHOWROOM ─────────────────────────────────────────
  { id:"show_3",      cat:"Showroom",    icon:"🚘", name:"Petite Expo",             desc:"Avoir 3 voitures au showroom",         cond:s=>s.showroom?.length>=3,  reward:{rep:15, money:500,    talent:0} },
  { id:"show_S",      cat:"Showroom",    icon:"🏆", name:"Voiture de Prestige",     desc:"Avoir une voiture tier S au showroom", cond:s=>s.showroom?.some(c=>c.tier==="S"),   reward:{rep:100,money:10000,  talent:1} },
  { id:"show_SS",     cat:"Showroom",    icon:"🏆", name:"Supercar en Vitrine",     desc:"Avoir une voiture tier SS au showroom",cond:s=>s.showroom?.some(c=>c.tier==="SS"),  reward:{rep:300,money:50000,  talent:2} },
  { id:"show_SSS",    cat:"Showroom",    icon:"💎", name:"Hypercar Exposée",        desc:"Avoir une voiture tier SSS au showroom",cond:s=>s.showroom?.some(c=>c.tier==="SSS"), reward:{rep:1000,money:200000,talent:3} },
  { id:"show_SSSp",   cat:"Showroom",    icon:"💎", name:"Mythique en Vitrine",     desc:"Avoir une voiture SSS+ au showroom",   cond:s=>s.showroom?.some(c=>c.tier==="SSS+"),reward:{rep:5000,money:1000000,talent:5} },

  // ── SESSIONS / DIVERS ────────────────────────────────
  { id:"session_1h",  cat:"Divers",      icon:"⏱️", name:"Joueur Assidu",           desc:"Jouer 1 heure au total",               cond:s=>Date.now()-(s.sessionStart??Date.now())>=3600000,    reward:{rep:20, money:1000,  talent:0} },
  { id:"save_first",  cat:"Divers",      icon:"💾", name:"Données Sécurisées",      desc:"Sauvegarder la partie",                cond:s=>s._hasSaved===true,   reward:{rep:5,   money:100,    talent:0} },
  { id:"name_change", cat:"Divers",      icon:"✏️", name:"Mon Garage, Mes Règles",  desc:"Renommer ton garage",                  cond:s=>s.garageName!=="Garage Turbo",       reward:{rep:10, money:500,    talent:0} },
  { id:"profile_set", cat:"Divers",      icon:"👤", name:"Identité Établie",        desc:"Personnaliser ton profil",             cond:s=>s.profile?.pseudo!=="Mécanicien"&&s.profile?.pseudo!=null, reward:{rep:15,money:500,talent:0} },
  { id:"full_garage", cat:"Divers",      icon:"🔥", name:"Garage Complet",          desc:"Remplir tous les emplacements",        cond:s=>{const occ=(s.active?1:0)+(s.queue?.length??0);return occ>0&&occ>=s.garageCap;}, reward:{rep:20,money:1000,talent:0} },
  { id:"rich_repair", cat:"Divers",      icon:"💸", name:"Réparer du Luxe",         desc:"Réparer une voiture de tier A ou +",   cond:s=>["A","S","SS","SSS","SSS+"].includes(s._lastRepairedTier??""), reward:{rep:50,money:5000,talent:0} },
  { id:"broke",       cat:"Divers",      icon:"😅", name:"Dans le Rouge",           desc:"Passer sous 10 €",                     cond:s=>s._wasBroke===true,   reward:{rep:5,   money:200,    talent:0} },
];

// State des succès (débloqués)
if(!state.achievements) state.achievements = {};
if(!state._hasSaved)    state._hasSaved    = false;
if(!state._wasBroke)    state._wasBroke    = false;
if(!state._lastRepairedTier) state._lastRepairedTier = "";

let _achPopupQueue   = [];
let _achPopupShowing = false;
let _achNotifsEnabled = localStorage.getItem("garage_ach_notifs") !== "false"; // true par défaut

function updateAchNotifBtn(){
  const btn = document.getElementById("btnToggleAchNotif");
  if(!btn) return;
  if(_achNotifsEnabled){
    btn.textContent = "🔔 Notifs";
    btn.style.opacity = "0.8";
    btn.style.borderColor = "rgba(49,214,255,.25)";
  } else {
    btn.textContent = "🔕 Notifs";
    btn.style.opacity = "0.45";
    btn.style.borderColor = "rgba(255,90,90,.25)";
  }
}

document.getElementById("btnToggleAchNotif")?.addEventListener("click", () => {
  _achNotifsEnabled = !_achNotifsEnabled;
  localStorage.setItem("garage_ach_notifs", _achNotifsEnabled);
  updateAchNotifBtn();
});

// Init bouton au chargement
updateAchNotifBtn();

function checkAchievements(){
  // Mise à jour flags spéciaux
  if(state.money < 10) state._wasBroke = true;

  for(const ach of ACHIEVEMENTS){
    if(state.achievements[ach.id]) continue; // déjà débloqué
    try {
      if(!ach.cond(state)) continue;
    } catch(e){ continue; }

    // Débloquer
    state.achievements[ach.id] = Date.now();

    // Appliquer récompenses
    if(ach.reward.rep)    state.rep    += ach.reward.rep;
    if(ach.reward.money)  state.money  += ach.reward.money;
    if(ach.reward.talent) state.talentPoints += ach.reward.talent;

    // Ajouter à la queue de popup seulement si notifs activées
    if(_achNotifsEnabled){
      _achPopupQueue.push(ach);
      showNextAchievementPopup();
    }
  }
}

function showNextAchievementPopup(){
  if(_achPopupShowing || _achPopupQueue.length === 0) return;
  const ach = _achPopupQueue.shift();
  _achPopupShowing = true;

  const popup    = document.getElementById("achievementPopup");
  const iconEl   = document.getElementById("popupIcon");
  const nameEl   = document.getElementById("popupName");
  const rewardEl = document.getElementById("popupReward");

  iconEl.textContent = ach.icon;
  nameEl.textContent = ach.name;

  // Rebuild reward pills
  rewardEl.innerHTML = "";
  if(ach.reward.rep){
    const p = document.createElement("span");
    p.className = "achievementPopup__rewardPill achievementPopup__rewardPill--rep";
    p.textContent = `+${ach.reward.rep} REP`;
    rewardEl.appendChild(p);
  }
  if(ach.reward.money){
    const p = document.createElement("span");
    p.className = "achievementPopup__rewardPill achievementPopup__rewardPill--money";
    p.textContent = `+${formatMoney(ach.reward.money)}`;
    rewardEl.appendChild(p);
  }
  if(ach.reward.talent){
    const p = document.createElement("span");
    p.className = "achievementPopup__rewardPill achievementPopup__rewardPill--talent";
    p.textContent = `+${ach.reward.talent} talent${ach.reward.talent>1?"s":""}`;
    rewardEl.appendChild(p);
  }
  if(!ach.reward.rep && !ach.reward.money && !ach.reward.talent){
    const p = document.createElement("span");
    p.className = "achievementPopup__rewardPill achievementPopup__rewardPill--rep";
    p.textContent = "Cosmétique";
    rewardEl.appendChild(p);
  }

  // Reset sweep animation
  const sweep = popup.querySelector(".achievementPopup__sweep");
  if(sweep){ sweep.style.animation="none"; void sweep.offsetWidth; sweep.style.animation=""; }
  const fill = document.getElementById("popupProgressFill");
  if(fill){ fill.style.animation="none"; void fill.offsetWidth; fill.style.animation="achDrain 3.5s linear forwards"; }

  popup.style.display = "flex";
  requestAnimationFrame(() => popup.classList.add("achievementPopup--show"));

  setTimeout(() => {
    popup.classList.remove("achievementPopup--show");
    setTimeout(() => {
      popup.style.display = "none";
      _achPopupShowing = false;
      showNextAchievementPopup();
    }, 350);
  }, 3500);
}

// Modal succès
let _achFilter = "Tous";

function openAchievementsModal(){
  const modal = document.getElementById("achievementsModal");
  if(!modal) return;
  renderAchievementsUI();
  modal.style.display = "block";
}
function closeAchievementsModal(){
  document.getElementById("achievementsModal").style.display = "none";
}

function renderAchievementsUI(){
  const grid      = document.getElementById("achievementGrid");
  const filters   = document.getElementById("achievementFilters");
  const countEl   = document.getElementById("achievementCount");
  const barEl     = document.getElementById("achProgressBar");
  const fracEl    = document.getElementById("achFraction");
  if(!grid) return;

  const unlocked = Object.keys(state.achievements).length;
  const total    = ACHIEVEMENTS.length;
  const pct      = total > 0 ? Math.round(unlocked / total * 100) : 0;

  if(countEl) countEl.textContent = `${unlocked} / ${total} débloqués`;
  if(barEl)   barEl.style.width   = `${pct}%`;
  if(fracEl)  fracEl.textContent  = `${pct}%`;

  // Filtres onglets
  const cats = ["Tous", ...new Set(ACHIEVEMENTS.map(a=>a.cat))];
  filters.innerHTML = cats.map(c => {
    const catUnlocked = ACHIEVEMENTS.filter(a=>a.cat===c&&state.achievements[a.id]).length;
    const catTotal    = ACHIEVEMENTS.filter(a=>a.cat===c).length;
    const label = c === "Tous" ? `Tous (${unlocked}/${total})` : `${c} ${catUnlocked}/${catTotal}`;
    return `<button class="achFilter${c===_achFilter?" achFilter--active":""}" data-cat="${c}">${label}</button>`;
  }).join("");
  filters.querySelectorAll(".achFilter").forEach(btn => {
    btn.addEventListener("click", () => { _achFilter = btn.dataset.cat; renderAchievementsUI(); });
  });

  // Cartes — débloquées en premier, puis par catégorie
  const list   = _achFilter === "Tous" ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a=>a.cat===_achFilter);
  const sorted = [...list].sort((a,b) => {
    const ua = state.achievements[a.id] ? 1 : 0;
    const ub = state.achievements[b.id] ? 1 : 0;
    return ub - ua;
  });

  grid.innerHTML = sorted.map(ach => {
    const isUnlocked = !!state.achievements[ach.id];
    const rewardParts = [];
    if(ach.reward.rep)    rewardParts.push(`+${ach.reward.rep} REP`);
    if(ach.reward.money)  rewardParts.push(`+${formatMoney(ach.reward.money)}`);
    if(ach.reward.talent) rewardParts.push(`+${ach.reward.talent} pt talent`);
    const rewardStr = rewardParts.join(" · ") || "Cosmétique";

    return `<div class="achCard ${isUnlocked?"achCard--unlocked":"achCard--locked"}">
      <div class="achCard__iconWrap">${ach.icon}</div>
      <div class="achCard__body">
        <div class="achCard__name">${isUnlocked ? ach.name : "???"}</div>
        <div class="achCard__desc">${isUnlocked ? ach.desc : "Succès verrouillé"}</div>
        <div class="achCard__reward">${rewardStr}</div>
      </div>
      <div class="achCard__check">${isUnlocked ? "✅" : "🔒"}</div>
    </div>`;
  }).join("");
}

// Listeners
const btnAchievements = document.getElementById("btnAchievements");
if(btnAchievements) btnAchievements.addEventListener("click", openAchievementsModal);

const btnAchievementsClose = document.getElementById("btnAchievementsClose");
if(btnAchievementsClose) btnAchievementsClose.addEventListener("click", closeAchievementsModal);

const achievementsBackdrop = document.getElementById("achievementsBackdrop");
if(achievementsBackdrop) achievementsBackdrop.addEventListener("click", closeAchievementsModal);

// init
requestAnimationFrame(tick);
setInterval(save, 30000);

// Fallback : si onAuthStateChange ne répond pas dans les 5s, on charge quand même depuis localStorage
setTimeout(() => {
  if(!_authReady){
    console.warn("[init] auth timeout — fallback localStorage");
    localLoad();
    renderAll();
    tryStartNextRepair();
    _authReady = true;
  }
}, 5000);