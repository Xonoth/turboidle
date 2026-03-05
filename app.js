// =====================
// STATE
// =====================
const state = {
  garageLevel: 1,
  garageCap: 1,
  garageName: "Garage Turbo",

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

  // upgrades (exemples)
activeTab: "tools", // Nouvel état
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
  1: 0,
  2: 10,
  3: 25,
  4: 50,
  5: 100,
  6: 200,
  7: 400,
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
  F:    { label:"F",    color:"#8ca8c0", bg:"rgba(140,168,192,.12)", border:"rgba(140,168,192,.22)", desc:"Épave",      repReq:0,     repGain:1   },
  E:    { label:"E",    color:"#a0b890", bg:"rgba(160,184,144,.12)", border:"rgba(160,184,144,.22)", desc:"Populaire",  repReq:0,     repGain:2   },
  D:    { label:"D",    color:"#c4b870", bg:"rgba(196,184,112,.12)", border:"rgba(196,184,112,.22)", desc:"Commune",    repReq:0,     repGain:4   },
  C:    { label:"C",    color:"#4dff9a", bg:"rgba(77,255,154,.10)",  border:"rgba(77,255,154,.22)",  desc:"Correcte",   repReq:50,    repGain:8   },
  B:    { label:"B",    color:"#7ab0ff", bg:"rgba(80,140,255,.10)",  border:"rgba(80,140,255,.22)",  desc:"Sportive",   repReq:200,   repGain:15  },
  A:    { label:"A",    color:"#a07aff", bg:"rgba(120,80,255,.10)",  border:"rgba(120,80,255,.22)",  desc:"Rare",       repReq:600,   repGain:30  },
  S:    { label:"S",    color:"#ffc83a", bg:"rgba(255,200,50,.10)",  border:"rgba(255,200,50,.22)",  desc:"Prestige",   repReq:1500,  repGain:60  },
  SS:   { label:"SS",   color:"#ff8c40", bg:"rgba(255,140,64,.12)",  border:"rgba(255,140,64,.28)",  desc:"Collection", repReq:4000,  repGain:120 },
  SSS:  { label:"SSS",  color:"#ff4d70", bg:"rgba(255,77,112,.12)",  border:"rgba(255,77,112,.28)",  desc:"Légendaire", repReq:10000, repGain:250 },
  "SSS+":{ label:"SSS+",color:"#ffffff", bg:"rgba(255,255,255,.08)", border:"rgba(255,255,255,.35)", desc:"Mythique",   repReq:25000, repGain:500 },
};

// Poids de probabilité d'apparition par tier selon la réputation
// Conçu pour un run long avant prestige (~20k-50k REP total)
// Les tiers hauts restent rares même à très haut REP
function getTierWeights(rep){
  const ramp = (threshold, startW, rate, cap) =>
    rep >= threshold ? Math.min(cap, startW + (rep - threshold) * rate) : 0;

  const weights = {
    // Tiers bas : dominent tôt, s'effacent lentement sur le long terme
    F:      Math.max(0,  45  - rep * 0.004),
    E:      Math.max(0,  30  - rep * 0.003),
    D:      Math.max(2,  20  - rep * 0.002),

    // Tiers moyens : démarrent avec un poids visible dès déblocage
    C:      ramp(50,   3,   0.006, 18),
    B:      ramp(200,  2,   0.004, 14),
    A:      ramp(600,  2,   0.003, 10),

    // Tiers hauts : montée très lente, plafond bas
    S:      ramp(1500,  1.5, 0.0012, 6),
    SS:     ramp(4000,  1,   0.0007, 3),
    SSS:    ramp(10000, 0.5, 0.0002, 1.2),
    "SSS+": ramp(25000, 0.2, 0.00008, 0.4),
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
  { tier:"D", name:"Hyundra Elantrouze", baseValue:530, repairTime:27 }, // Hyundai Elantra
  { tier:"D", name:"Toyo Corrola",        baseValue:560, repairTime:28 }, // Toyota Corolla
  
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
  
  // ── TIER SSS — Hypercars rares (300000–800000€, 600–900s) ───────────
  { tier:"SSS", name:"Bugatti Vaiyronne",   baseValue:350000,repairTime:650}, // Bugatti Veyron
  { tier:"SSS", name:"Pagânì Huayrra Brr",  baseValue:500000,repairTime:750}, // Pagani Huayra
  { tier:"SSS", name:"Koenigsmeg Agéra RS", baseValue:450000,repairTime:720}, // Koenigsegg Agera RS
  { tier:"SSS", name:"McLoren P1 PleurÔ",   baseValue:600000,repairTime:820}, // McLaren P1
  { tier:"SSS", name:"Porsha 918 Spidrou",  baseValue:550000,repairTime:780}, // Porsche 918 Spyder
  { tier:"SSS", name:"Ferrarro LaFerrarî",  baseValue:700000,repairTime:880}, // Ferrari LaFerrari
  { tier:"SSS", name:"Lambo Aventadôr SVJ", baseValue:400000,repairTime:700}, // Lamborghini Aventador SVJ
  
  // ── TIER SSS+ — Legendary (1M€+, 1200–2000s) ───────────────────────
  { tier:"SSS+", name:"Bugatti Shironisé",    baseValue:1500000,repairTime:1500}, // Bugatti Chiron
  { tier:"SSS+", name:"Koenigsmeg Jeskô Fls", baseValue:1200000,repairTime:1300}, // Koenigsegg Jesko
  { tier:"SSS+", name:"McLoren F1 Légendâre", baseValue:2000000,repairTime:1800}, // McLaren F1
  { tier:"SSS+", name:"Pagânì Zondà R Ultime",baseValue:1800000,repairTime:1700}, // Pagani Zonda R
  { tier:"SSS+", name:"Bugatti Divo Divinité",baseValue:1600000,repairTime:1600}, // Bugatti Divo
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
    garageProgressText.textContent = "Niveau maximum atteint";
    garageProgressFill.style.width = "100%";
    return;
  }

  const progress = sold - currentRequirement;
  const needed = nextRequirement - currentRequirement;

  const pct = Math.max(0, Math.min(1, progress / needed));

  garageProgressText.textContent =
    `${progress} / ${needed} ventes`;

  garageProgressFill.style.width = `${pct * 100}%`;
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

  state.moneyPerSec    = fx.passive + calcDealsPassive();
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

function getTalentRank(id){
  return state.talents[id] ?? 0;
}

function hasRequirements(talent){
  return (talent.requires || []).every(r => getTalentRank(r.id) >= r.rank);
}

function renderTalentsUI(){
  talentPointsEl.textContent = state.talentPoints;

  talentListEl.innerHTML = "";
  for(const t of TALENTS){
    const rank   = getTalentRank(t.id);
    const locked = !hasRequirements(t);
    const maxed  = rank >= t.maxRank;
    const canBuy = !locked && state.talentPoints > 0 && !maxed;

    const rankDots = Array.from({length: t.maxRank}, (_, i) =>
      `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:3px;background:${i < rank ? 'var(--cyan)' : 'rgba(255,255,255,.12)'};border:1px solid rgba(255,255,255,.15)"></span>`
    ).join('');

    const card = document.createElement("div");
    card.className = "talentCard" + (locked ? " talentCard--locked" : "");
    card.innerHTML = `
      <div class="talentCard__top">
        <div style="display:flex;gap:10px;align-items:flex-start;min-width:0">
          <div style="font-size:22px;line-height:1;flex-shrink:0">${t.icon ?? "⭐"}</div>
          <div style="min-width:0">
            <div class="talentCard__name">${t.name}</div>
            <div class="talentCard__desc">${t.desc}</div>
          </div>
        </div>
        <div class="tag" style="flex-shrink:0">${t.category}</div>
      </div>
      <div class="talentCard__meta">
        <div style="display:flex;align-items:center;gap:4px">
          ${rankDots}
          <span style="font-size:11px;color:var(--muted);margin-left:4px">${rank}/${t.maxRank}</span>
        </div>
        ${locked ? `<div class="tag" style="color:#ff9090;border-color:rgba(255,100,100,.2)">🔒 Verrouillé</div>` : (maxed ? `<div class="tag" style="color:var(--green);border-color:rgba(46,229,157,.2)">✅ Maxé</div>` : "")}
      </div>
      <button class="talentBtn" data-talent-buy="${t.id}" ${canBuy ? "" : "disabled"}>
        ${locked ? "Prérequis manquant" : (maxed ? "Rang maximum" : `Acheter — 1 point`)}
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
btnTalentsReset.addEventListener("click", () => {
  state.talentPoints = 0;
  state.talents = {};
  state.talentSpeedMult = 1;
  state.talentDiagBonus = 0;
  state.talentSaleBonus = 0;
  state.talentClickBonus = 0;
  applyTalentEffects();
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

  const upTotalLvl  = state.upgrades.reduce((a,u)=>a+u.lvl, 0);
  const talentTotal = Object.values(state.talents).reduce((a,v)=>a+v, 0);
  const dealsPassive= calcDealsPassive();
  const talentPassive = (getTalentRank("passive_1")*2) + (getTalentRank("passive_2")*8);
  const mult        = (state.speedMult??1) * (state.talentSpeedMult??1);
  const clickAmt    = ((state.repairClick??0) + (state.talentClickBonus??0)) * mult;
  const autoAmt     = (state.repairAuto??0) * mult;
  const salePct     = Math.round((state.saleBonusPct + (state.talentSaleBonus??0)) * 100);
  const sessionMin  = Math.floor((Date.now() - (state.sessionStart??Date.now())) / 60000);

  // Calcul prochain tier à débloquer
  const tierOrder = ["F","E","D","C","B","A","S","SS","SSS","SSS+"];
  const unlockedTiers = tierOrder.filter(t => state.rep >= TIERS[t].repReq);
  const nextTier = tierOrder.find(t => state.rep < TIERS[t].repReq);
  const nextTierData = nextTier ? TIERS[nextTier] : null;
  const nextTierPct = nextTierData ? Math.min(100, Math.round((state.rep / nextTierData.repReq) * 100)) : 100;

  statsGridEl.innerHTML = `
    <div class="statSection">
      <div class="statSection__title">💰 Économie</div>
      <div class="statRow"><span class="statRow__label">Argent actuel</span><span class="statRow__val statRow__val--green">${Math.floor(state.money).toLocaleString("fr-FR")} €</span></div>
      <div class="statRow"><span class="statRow__label">Revenu passif</span><span class="statRow__val statRow__val--green">${state.moneyPerSec.toFixed(1)} €/s</span></div>
      <div class="statRow"><span class="statRow__label">· dont talents</span><span class="statRow__val">${talentPassive} €/s</span></div>
      <div class="statRow"><span class="statRow__label">· dont affaires</span><span class="statRow__val">${dealsPassive} €/s</span></div>
      <div class="statRow"><span class="statRow__label">Bonus vente</span><span class="statRow__val">+${salePct}%</span></div>
    </div>

    <div class="statSection">
      <div class="statSection__title">🏆 Réputation</div>
      <div class="statRow"><span class="statRow__label">REP total</span><span class="statRow__val statRow__val--blue">${state.rep.toLocaleString("fr-FR")}</span></div>
      <div class="statRow"><span class="statRow__label">Tiers débloqués</span><span class="statRow__val">${unlockedTiers.length} / 10</span></div>
      ${nextTierData ? `
      <div class="statRow"><span class="statRow__label">Prochain tier</span><span class="statRow__val" style="color:${nextTierData.color}">${nextTierData.label} (${nextTierData.desc})</span></div>
      <div class="statRow"><span class="statRow__label">Progression</span><span class="statRow__val">${state.rep.toLocaleString("fr-FR")} / ${nextTierData.repReq.toLocaleString("fr-FR")} REP (${nextTierPct}%)</span></div>
      ` : `<div class="statRow"><span class="statRow__label">Tous tiers débloqués</span><span class="statRow__val statRow__val--green">✅</span></div>`}
      <div class="statRow" style="margin-top:4px"><span class="statRow__label">REP prochain prestige</span><span class="statRow__val" style="color:#ff9a28">~50 000 REP</span></div>
    </div>

    <div class="statSection">
      <div class="statSection__title">🚗 Activité</div>
      <div class="statRow"><span class="statRow__label">Voitures vendues</span><span class="statRow__val statRow__val--blue">${state.carsSold}</span></div>
      <div class="statRow"><span class="statRow__label">Réparations terminées</span><span class="statRow__val">${state.totalRepairs??0}</span></div>
      <div class="statRow"><span class="statRow__label">Diagnostics effectués</span><span class="statRow__val">${state.totalAnalyses??0}</span></div>
    </div>

    <div class="statSection">
      <div class="statSection__title">🔧 Atelier</div>
      <div class="statRow"><span class="statRow__label">Puissance clic</span><span class="statRow__val statRow__val--cyan">${clickAmt.toFixed(2)}s / clic</span></div>
      <div class="statRow"><span class="statRow__label">Vitesse auto</span><span class="statRow__val statRow__val--cyan">${autoAmt.toFixed(2)}s / s</span></div>
      <div class="statRow"><span class="statRow__label">Multiplicateur</span><span class="statRow__val">×${mult.toFixed(2)}</span></div>
      <div class="statRow"><span class="statRow__label">Emplacements garage</span><span class="statRow__val">${state.garageCap}</span></div>
    </div>

    <div class="statSection statSection--full">
      <div class="statSection__title">📈 Tiers & REP par vente</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px">
        ${tierOrder.map(tid => {
          const td = TIERS[tid];
          const unlocked = state.rep >= td.repReq;
          return `<div style="display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:10px;border:1px solid ${unlocked ? td.border : 'rgba(255,255,255,.06)'};background:${unlocked ? td.bg : 'transparent'};opacity:${unlocked ? 1 : 0.4}">
            <span style="font-weight:900;font-size:12px;color:${td.color}">${td.label}</span>
            <span style="font-size:11px;color:var(--muted2)">+${td.repGain} REP</span>
            ${!unlocked ? `<span style="font-size:10px;color:var(--muted2)">(${td.repReq.toLocaleString("fr-FR")})</span>` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="statSection statSection--full" style="grid-column:unset">
      <div class="statSection__title">⭐ Progression</div>
      <div class="statRow"><span class="statRow__label">Niveau Garage</span><span class="statRow__val statRow__val--blue">${state.garageLevel}</span></div>
      <div class="statRow"><span class="statRow__label">Talents dépensés</span><span class="statRow__val">${talentTotal} pts</span></div>
      <div class="statRow"><span class="statRow__label">Niveaux d'améliorations</span><span class="statRow__val">${upTotalLvl}</span></div>
      <div class="statRow"><span class="statRow__label">Clics de réparation</span><span class="statRow__val">${state.totalClickRepairs??0}</span></div>
      <div class="statRow"><span class="statRow__label">Session active</span><span class="statRow__val">${sessionMin} min</span></div>
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
function renderTop(){
  moneyEl.textContent = Math.floor(state.money);
  moneyPerSecEl.textContent = state.moneyPerSec.toFixed(0);
  repEl.textContent = state.rep;
  garageLevelEl.textContent = state.garageLevel;
  carsSoldEl.textContent = state.carsSold;

const diagTotal = state.diagReward + (state.talentDiagBonus ?? 0);
diagRewardEl.textContent = diagTotal;

const mult = (state.speedMult ?? 1) * (state.talentSpeedMult ?? 1);

repairAutoEl.textContent  = (state.repairAuto  * mult).toFixed(2);
repairClickEl.textContent = (state.repairClick * mult).toFixed(2);
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
              <div class="garageSlot__meta">${t.desc} · ${car.baseValue.toLocaleString("fr-FR")}€ · ${pct.toFixed(0)}%</div>
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
            <div class="garageSlot__meta">${t.desc} · ${car.baseValue.toLocaleString("fr-FR")}€ · ⏱️ ${car.repairTime}s</div>
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
  activeCarValueEl.textContent = car.baseValue.toLocaleString("fr-FR");
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
  if(metaEl) metaEl.textContent = `${t.desc} · ${car.baseValue.toLocaleString("fr-FR")}€ · ${(pct*100).toFixed(0)}%`;
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
        <div class="sItem__meta" style="margin-top:4px">${t.desc} — ${saleValue.toLocaleString("fr-FR")} €</div>
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
          ${isMaxed ? "Max" : u.cost.toLocaleString("fr-FR") + " €"}
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
}

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
btnAnalyze.addEventListener("click", () => {
  const queueMax = state.garageCap - 1;
  if (state.queue.length >= queueMax) return;

  state.money += state.diagReward + (state.talentDiagBonus ?? 0);
  state.totalAnalyses = (state.totalAnalyses ?? 0) + 1;
  state.queue.push(makeCar());
  tryStartNextRepair();
  renderAll();
});

btnRepairClick.addEventListener("click", () => {
  const mult = (state.speedMult ?? 1) * (state.talentSpeedMult ?? 1);
  const clickAmt = (state.repairClick + (state.talentClickBonus ?? 0)) * mult;
  applyRepairTime(clickAmt);
  state.totalClickRepairs = (state.totalClickRepairs ?? 0) + 1;
  renderActive();
});

showroomListEl.addEventListener("click", (e) => {
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
  state.rep += tierData.repGain;

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
      const queueMax = state.garageCap - 1;
      if (state.queue.length < queueMax) {
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

  requestAnimationFrame(tick);
}

// =====================
// AUTH — Netlify Identity
// =====================
// Le widget Identity est chargé depuis index.html via le script CDN

let netlifyIdentity = null;   // instance du widget
let currentUser     = null;   // user connecté (ou null)
let authToken       = null;   // JWT token pour les appels API

// Appelé depuis index.html une fois le script Identity chargé
function initIdentity(){
  netlifyIdentity = window.netlifyIdentity;
  if(!netlifyIdentity) return;

  netlifyIdentity.on("init", (user) => {
    currentUser = user;
    if(user) authToken = user.token?.access_token;
    updateAuthUI();
  });

  netlifyIdentity.on("login", (user) => {
    currentUser = user;
    authToken   = user.token?.access_token;
    netlifyIdentity.close();
    updateAuthUI();
    cloudLoad(); // charge la partie depuis le cloud après login
  });

  netlifyIdentity.on("logout", () => {
    currentUser = null;
    authToken   = null;
    updateAuthUI();
  });

  netlifyIdentity.init();
}

function updateAuthUI(){
  const authBtn = document.getElementById("btnAuth");
  const authName= document.getElementById("authUserName");
  if(!authBtn) return;

  if(currentUser){
    authBtn.textContent  = "🚪 Déconnexion";
    authBtn.title        = "Se déconnecter";
    if(authName) authName.textContent = currentUser.email;
  } else {
    authBtn.textContent  = "🔐 Connexion";
    authBtn.title        = "Se connecter / Créer un compte";
    if(authName) authName.textContent = "";
  }
}

// Ouvre le widget Identity
function openAuth(){
  if(!netlifyIdentity) return;
  if(currentUser){
    netlifyIdentity.logout();
  } else {
    netlifyIdentity.open();
  }
}

// Rafraîchit le token si expiré (Identity le gère automatiquement)
async function getValidToken(){
  if(!currentUser) return null;
  try {
    const user = await netlifyIdentity.currentUser();
    const freshToken = user?.token?.access_token;
    if(freshToken) authToken = freshToken;
    return authToken;
  } catch {
    return authToken; // fallback
  }
}

// =====================
// SAVE / LOAD — Cloud + LocalStorage fallback
// =====================
const SAVE_KEY = "garage_idle_save_v2";

// Données à sauvegarder (état complet sérialisable)
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
  };
}

// Applique les données chargées dans le state
function applySaveData(data){
  const baseUpgrades = JSON.parse(JSON.stringify(state.upgrades));
  Object.assign(state, data);

  // Fusion intelligente des upgrades (préserve les nouvelles amélios)
  if(data.upgrades){
    state.upgrades = baseUpgrades.map(baseItem => {
      const saved = data.upgrades.find(x => x.id === baseItem.id);
      if(saved){ baseItem.lvl = saved.lvl; baseItem.cost = saved.cost; }
      return baseItem;
    });
  }

  // Sécurités
  if(typeof state.carsSold !== "number")         state.carsSold = 0;
  if(typeof state.talentPoints !== "number")     state.talentPoints = 0;
  if(typeof state.talents !== "object" || !state.talents) state.talents = {};
  if(typeof state.talentLevelGranted !== "number") state.talentLevelGranted = state.garageLevel ?? 1;
  if(!state.activeTab)  state.activeTab  = "tools";
  if(!state.garageName) state.garageName = "Garage Turbo";

  applyGarageName();
  applyTalentEffects();
  recalcRepairAuto();
  updateGarageLevel();
}

// --- Sauvegarde locale (toujours) ---
function localSave(){
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(buildSavePayload())); } catch(e){}
}
function localLoad(){
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if(raw) applySaveData(JSON.parse(raw));
  } catch(e){ console.error("Erreur load local:", e); }
}

// --- Sauvegarde cloud ---
let cloudSaving = false;
async function cloudSave(){
  if(!currentUser) return; // pas connecté = on sauvegarde seulement en local
  if(cloudSaving) return;
  cloudSaving = true;

  try {
    const token = await getValidToken();
    const res = await fetch("/.netlify/functions/save-game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(buildSavePayload()),
    });
    if(res.ok){
      showSaveIndicator("☁️ Sauvegardé");
    } else {
      console.error("Cloud save failed:", await res.text());
      showSaveIndicator("⚠️ Erreur cloud");
    }
  } catch(e){
    console.error("Cloud save error:", e);
  } finally {
    cloudSaving = false;
  }
}

async function cloudLoad(){
  if(!currentUser) return;
  try {
    const token = await getValidToken();
    const res = await fetch("/.netlify/functions/load-game", {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if(!res.ok) throw new Error("Erreur HTTP " + res.status);

    const { save } = await res.json();
    if(save){
      applySaveData(save);
      localSave(); // synchronise aussi le localStorage
      renderAll();
      showSaveIndicator("☁️ Partie chargée");
    }
    // si save === null = nouvelle partie, on garde l'état courant
  } catch(e){
    console.error("Cloud load error:", e);
  }
}

// Indicateur visuel de sauvegarde
function showSaveIndicator(msg){
  const btn = document.getElementById("btnSave");
  if(!btn) return;
  const orig = btn.textContent;
  btn.textContent = msg;
  setTimeout(() => btn.textContent = orig, 2000);
}

// Sauvegarde combinée : local + cloud
function save(){
  localSave();
  cloudSave(); // async, non bloquant
}

// Chargement initial : local d'abord, cloud ensuite si connecté
function load(){
  localLoad();
}

btnSave.addEventListener("click", save);

// Bouton auth (branché dans index.html)
const btnAuth = document.getElementById("btnAuth");
if(btnAuth) btnAuth.addEventListener("click", openAuth);

// init
load();
tryStartNextRepair();
renderAll();
requestAnimationFrame(tick);
setInterval(save, 30000); // auto-save toutes les 30s (cloud moins fréquent)