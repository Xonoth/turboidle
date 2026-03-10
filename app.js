// =====================
// CONFIG — Constantes centralisées
// Modifier ici plutôt que de chercher dans le code
// =====================
const CONFIG = {
  // Progression offline
  OFFLINE_MAX_SEC:    4 * 3600,  // max 4h de rattrapage offline
  OFFLINE_STEP_SEC:   30,        // chunks de 30s pour le catchup
  // Sauvegarde
  CLOUD_SAVE_INTERVAL: 60000,    // cloud toutes les 60s (quota Supabase gratuit)
  LB_PUSH_INTERVAL:    60000,    // classement : 1x/min
  // Succès
  ACH_CHECK_INTERVAL: 2,         // vérification toutes les 2s
  // Anti-clic
  CLICK_COOLDOWN_MS:  50,
  // Milestones de niveau
  LEVEL_MILESTONES: new Set([10, 25, 50, 75, 100, 150, 200]),
};

// =====================
// DEBUG — Mettre à true pour activer les logs de développement
// =====================
const DEBUG = false;
function dbg(...args){ if(DEBUG) console.log(...args); }

// =====================
// STATE
// =====================
const state = {
  garageLevel: 1,
  garageCap: 1,
  showroomCap: 3,        // 3 emplacements showroom par défaut
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
    { id:"toolbox", tab:"tools", icon:"🧰", name:"Caisse à Outils",      lvl:0, desc:"+0.05 Puissance Répa. Clic", cost:268 },
    { id:"obd",     tab:"tools", icon:"🔎", name:"Scanner OBD Basique",   lvl:0, desc:"+5€ par diag", cost:337 },
    { id:"impact",  tab:"tools", icon:"⚡", name:"Perceuse Pneumatique",  lvl:0, desc:"+0.08 Puissance Répa. Clic", cost:800 },
    { id:"nego",    tab:"deals", icon:"🧾", name:"Formation Négociation", lvl:0, desc:"+5% valeur de vente", cost:1000 },
    { id:"comp",    tab:"tools", icon:"🌀", name:"Compresseur Pro",       lvl:0, desc:"+10% Vitesse Réparation", cost:3500 },
    { id:"lift",    tab:"deals", icon:"🅿️", name:"Agrandissement Garage", lvl:0, desc:"+1 Emplacement de garage", cost:5000, maxLvl:5 },
    { id:"impact2", tab:"tools", icon:"🔧", name:"Pistolet à Choc",       lvl:0, desc:"+0.12 Puissance Répa. Clic", cost:7500 },
    { id:"diagpro", tab:"tools", icon:"🧠", name:"Station Diag Pro",      lvl:0, desc:"+20€ par diag", cost:12000 },

    // ÉQUIPE
    { id:"stagiaire",        tab:"team", icon:"🧑‍🔧", name:"Stagiaire Accueil",    lvl:0, desc:"Diagnostique auto toutes les 12s (min 6s au niv.max)",                    cost:15000,  maxLvl:10 },
    { id:"receptionnaire",   tab:"team", icon:"📋",    name:"Réceptionnaire",        lvl:0, desc:"Accélère le diagnostic auto jusqu'à 1s (prérequis : Stagiaire niv.10)", cost:120000, maxLvl:10 },
    { id:"vendeur",          tab:"team", icon:"👔",    name:"Vendeur Junior",         lvl:0, desc:"Vend auto toutes les 15s (min 8s au niv.max)",                          cost:25000,  maxLvl:10 },
    { id:"vendeur_confirme", tab:"team", icon:"🤵",    name:"Vendeur Confirmé",       lvl:0, desc:"Accélère la vente auto jusqu'à 1s (prérequis : Vendeur Junior niv.10)", cost:200000, maxLvl:10 },
    { id:"apprenti",         tab:"team", icon:"🔩",    name:"Apprenti Mécanicien",   lvl:0, desc:"+0.15s/s de réparation auto par rang",                                  cost:12000 },
    { id:"mecanicien",       tab:"team", icon:"🛠️",   name:"Mécanicien",             lvl:0, desc:"+0.5s/s de réparation auto par rang",                                   cost:80000 },

    // AFFAIRES — revenus passifs
    { id:"loc_outils",   tab:"deals", icon:"🔑",  name:"Location d'Outils",      lvl:0, desc:"+2 €/s de revenu passif",   cost:6000 },
    { id:"contrat_taxi", tab:"deals", icon:"🚕",  name:"Contrat Taxi Local",      lvl:0, desc:"+5 €/s de revenu passif",   cost:8000 },
    { id:"assurance",    tab:"deals", icon:"📋",  name:"Partenariat Assurance",   lvl:0, desc:"+10 €/s de revenu passif",  cost:20000 },
    { id:"atelier_nuit", tab:"deals", icon:"🌙",  name:"Atelier de Nuit",         lvl:0, desc:"+20 €/s de revenu passif",  cost:50000 },
    { id:"franchise",    tab:"deals", icon:"🏢",  name:"Franchise Régionale",     lvl:0, desc:"+50 €/s de revenu passif",  cost:150000 },
    { id:"showroom_slot",tab:"deals", icon:"🖼️", name:"Extension Showroom",      lvl:0, desc:"+2 emplacements showroom (max 4 achats → 11 max)", cost:35000, maxLvl:4 },

    // PIÈCES DÉTACHÉES
    { id:"magasinier",      tab:"stock", icon:"📦", name:"Magasinier",      lvl:0, desc:"-20% délai livraison par rang",                                               cost:40000, maxLvl:3 },
    { id:"logiciel_stock",  tab:"stock", icon:"📊", name:"Logiciel Stock",  lvl:0, desc:"Niv.1: alertes rupture · Niv.2: seuils configurables · Niv.3: commandes auto", cost:80000, maxLvl:3 },
    { id:"slots_livraison", tab:"stock", icon:"🚛", name:"Slots Livraison", lvl:0, desc:"Niv.1→9 : +1 livraison simultanée par rang (max 10)",                         cost:20000, maxLvl:9 },
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

    // Flash level up sur le compteur de niveau
    const lvlEl = document.querySelector(".topProgress__lvl");
    if(lvlEl){
      lvlEl.classList.remove("topProgress__lvl--levelup");
      void lvlEl.offsetWidth;
      lvlEl.classList.add("topProgress__lvl--levelup");
      setTimeout(() => lvlEl.classList.remove("topProgress__lvl--levelup"), 700);
    }

    // P2 — Popup milestone pour les niveaux importants
    if(CONFIG.LEVEL_MILESTONES.has(state.garageLevel)){
      setTimeout(() => showMilestonePopup(state.garageLevel), 400);
    }

    // ✅ points de talent: 1 par niveau atteint (diff)
    const granted = state.talentLevelGranted ?? 1;
    if(state.garageLevel > granted){
      const gained = state.garageLevel - granted;
      state.talentPoints += gained;
      state.talentLevelGranted = state.garageLevel;
    }
    // Optionnel : bonus à chaque montée de niveau (à toi de choisir)
    // state.garageCap += 1;

    _needsFullRender = true; // rafraîchit UI + badge etc.
  }
}

// =====================
// TIER SYSTEM
// =====================
// Tiers par lettre, du plus commun au plus rare
const TIERS = {
  F:    { label:"F",    color:"#8ca8c0", bg:"rgba(140,168,192,.12)", border:"rgba(140,168,192,.22)", desc:"Épave",      repReq:0,       repGain:1   },
  E:    { label:"E",    color:"#a0b890", bg:"rgba(160,184,144,.12)", border:"rgba(160,184,144,.22)", desc:"Populaire",  repReq:0,       repGain:2   },
  D:    { label:"D",    color:"#c4b870", bg:"rgba(196,184,112,.12)", border:"rgba(196,184,112,.22)", desc:"Commune",    repReq:500,     repGain:3   },
  C:    { label:"C",    color:"#4dff9a", bg:"rgba(77,255,154,.10)",  border:"rgba(77,255,154,.22)",  desc:"Correcte",   repReq:1500,    repGain:6   },
  B:    { label:"B",    color:"#7ab0ff", bg:"rgba(80,140,255,.10)",  border:"rgba(80,140,255,.22)",  desc:"Sportive",   repReq:5000,    repGain:12  },
  A:    { label:"A",    color:"#a07aff", bg:"rgba(120,80,255,.10)",  border:"rgba(120,80,255,.22)",  desc:"Rare",       repReq:8000,    repGain:20  },
  S:    { label:"S",    color:"#ffc83a", bg:"rgba(255,200,50,.10)",  border:"rgba(255,200,50,.22)",  desc:"Prestige",   repReq:25000,   repGain:40  },
  SS:   { label:"SS",   color:"#ff8c40", bg:"rgba(255,140,64,.12)",  border:"rgba(255,140,64,.28)",  desc:"Collection", repReq:70000,   repGain:80  },
  SSS:  { label:"SSS",  color:"#ff4d70", bg:"rgba(255,77,112,.12)",  border:"rgba(255,77,112,.28)",  desc:"Légendaire", repReq:180000,  repGain:160 },
  "SSS+":{ label:"SSS+",color:"#ffffff", bg:"rgba(255,255,255,.08)", border:"rgba(255,255,255,.35)", desc:"Mythique",   repReq:450000,  repGain:350 },
};

const TIER_ORDER = ["F","E","D","C","B","A","S","SS","SSS","SSS+"];

// Retourne le tier min des tiers de la pièce (premier tier débloqué requis)
function partTierMin(part){ return part.tiers[0]; }
// Retourne le tier max des tiers de la pièce
function partTierMax(part){ return part.tiers[part.tiers.length - 1]; }
// Vérifie si le joueur a débloqué le tier min d'une pièce
function isPartUnlocked(part){
  const minTier = partTierMin(part);
  return state.rep >= (TIERS[minTier]?.repReq ?? 0);
}
// Rendu compact des tiers compatibles d'une pièce
function renderTierRange(part){
  const min = partTierMin(part);
  const max = partTierMax(part);
  const tMin = TIERS[min], tMax = TIERS[max];
  if(min === max) return `<span style="color:${tMin?.color??'#aaa'}" class="tierPill">${min}</span>`;
  return `<span style="color:${tMin?.color??'#aaa'}" class="tierPill">${min}</span><span style="color:#555">→</span><span style="color:${tMax?.color??'#aaa'}" class="tierPill">${max}</span>`;
}

// ── LOGICIEL STOCK ──────────────────────────────────────────────────
// Niv 1 : alertes badge sur onglet
// Niv 2 : seuils configurables par pièce (state.stockSettings[partId].threshold)
// Niv 3 : commande auto au fournisseur par défaut (state.stockSettings[partId].autoSupplier)

function getLogicielLvl(){
  return getUpgrade("logiciel_stock")?.lvl ?? 0;
}

// Vérifie les ruptures de pièces débloquées → badge sur onglet STOCK
function hasStockAlert(){
  if(getLogicielLvl() < 1) return false;
  return PARTS_CATALOG.some(p => {
    if(!isPartUnlocked(p)) return false;
    const qty = state.parts?.[p.id]?.qty ?? 0;
    const threshold = state.stockSettings?.[p.id]?.threshold ?? 1;
    return qty <= threshold;
  });
}

// Refs cachées pour renderActive (appelé à chaque frame)
let _activeBarFill = null;
let _activeMetaEl  = null;
let _showroomJustAdded = false; // flag pour animer le premier item du showroom
let _isOfflineCatchup  = false; // flag pour bloquer renderAll pendant le catchup offline
let _autoSellFlash     = false; // G2 — flag pour flash showroom quand vente auto
let _activeJustStarted = false; // V1 — flag pour animation entrée slot actif
let _autoOrderTimer = 0;
function processAutoOrders(dt = 0){
  if(getLogicielLvl() < 3) return;
  // Throttle : vérifie toutes les 2 secondes
  _autoOrderTimer -= dt;
  if(_autoOrderTimer > 0) return;
  _autoOrderTimer = 2;

  const globalSupplier  = state.stockGlobal?.autoSupplier ?? "";
  const globalThreshold = state.stockGlobal?.threshold ?? 1;
  const globalQty       = state.stockGlobal?.qty ?? 1;

  // Budget max par cycle : 20% de l'argent actuel (évite de tout dépenser)
  let budgetLeft = state.money * 0.20;

  for(const part of PARTS_CATALOG){
    if(!isPartUnlocked(part)) continue;
    const settings    = state.stockSettings?.[part.id] ?? {};
    const supplierId  = settings.autoSupplier || globalSupplier;
    if(!supplierId) continue;
    const threshold   = settings.threshold !== undefined ? settings.threshold : globalThreshold;
    const orderQty    = settings.qty       !== undefined ? settings.qty       : globalQty;
    const qty = state.parts?.[part.id]?.qty ?? 0;
    const alreadyOrdering = state.orders?.some(o => o.partId === part.id);
    if(qty <= threshold && !alreadyOrdering){
      const price = getPartPrice(part.id, supplierId) * orderQty;
      if(state.money >= price && price <= budgetLeft){
        orderPart(part.id, supplierId, orderQty);
        budgetLeft -= price;
      }
    }
  }
}
// Conçu pour un run long terme (~60k+ ventes avant SSS+)
function getTierWeights(rep){
  const ramp = (threshold, startW, rate, cap) =>
    rep >= threshold ? Math.min(cap, startW + (rep - threshold) * rate) : 0;

  const weights = {
    F:      Math.max(0,  50  - rep * 0.0002),
    E:      Math.max(0,  35  - rep * 0.0002),
    D:      rep >= 150   ? Math.max(2, 22 - rep * 0.0001)  : 0,
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

// =====================================================================
// SYSTÈME PIÈCES DÉTACHÉES
// =====================================================================

// --- MARQUES FOURNISSEURS ---
const SUPPLIERS = {
  bochmann: {
    id: "bochmann", name: "Bochmann", icon: "🔵",
    inspired: "Bosch", tagline: "L'excellence allemande",
    costPct:0.4, valuePct:0.5, quality: 5, deliveryBase: 300,  // 4h en minutes
    speciality: null,  // bon partout
    color: "#4a9eff",
  },
  valeplus: {
    id: "valeplus", name: "Valéo Plus", icon: "🟡",
    inspired: "Valeo", tagline: "L'équipementier français",
    costPct:0.29, valuePct:0.35, quality: 4, deliveryBase: 180,  // 2h
    speciality: null,
    color: "#ffd700",
  },
  ngx: {
    id: "ngx", name: "NGX Parts", icon: "🟠",
    inspired: "NGK", tagline: "Spécialiste électronique",
    costPct:0.16, valuePct:0.2, quality: 4, deliveryBase: 150,  // 3h
    speciality: "electric",  // +1 qualité sur pièces élec
    color: "#ff8c00",
  },
  euroline: {
    id: "euroline", name: "Euroline", icon: "🟢",
    inspired: "Febi/Bilstein", tagline: "Spécialiste mécanique",
    costPct:0.08, valuePct:0.1, quality: 3, deliveryBase: 90,
    speciality: ["engine","brakes","transmission","sealing"],  // +1 qualité sur pièces méca
    color: "#48c78e",
  },
  topdrive: {
    id: "topdrive", name: "TopDrive", icon: "🔴",
    inspired: "Topran", tagline: "Livraison immédiate — déblocage d'urgence",
    costPct:0.02, valuePct:0.0, quality: 2, deliveryBase: 5,  // 5s fixe, ignorer magasinier/express
    speciality: null,
    noMalus: true,
    instantDelivery: true,  // délai fixe non réductible par upgrades
    color: "#ff4d70",
  },
};

// Effet qualité sur réparation
// quality 5 → -30% temps, +15% valeur
// quality 4 → -15% temps, +8% valeur
// quality 3 → neutre
// quality 2 → +20% temps, -5% valeur
function getQualityEffects(quality, supplierId){
  const supp = supplierId ? SUPPLIERS[supplierId] : null;
  const fx = { timeMult:1.0, valueMult:1.0, label:"", color:"#aaa" };
  // valueMult : vient du valuePct du fournisseur si dispo
  if(supp) fx.valueMult = 1 + (supp.valuePct ?? 0);
  // timeMult : basé sur la qualité
  if(quality >= 5){ fx.timeMult=0.70; fx.label="Premium";      fx.color="#4a9eff"; }
  else if(quality === 4){ fx.timeMult=0.85; fx.label="Qualité"; fx.color="#ffd700"; }
  else if(quality === 3){ fx.timeMult=1.00; fx.label="Standard"; fx.color="#aaa"; }
  else if(quality <= 2){
    if(supp?.noMalus){
      fx.timeMult=1.00; fx.label="Dépannage"; fx.color="#ff7a50";
    } else {
      fx.timeMult=1.20; fx.label="Bas de gamme"; fx.color="#ff4d70";
    }
  }
  return fx;
}

// --- CATÉGORIES DE PANNES ---
const FAILURE_CATEGORIES = {
  engine:      { id:"engine",      icon:"🔩", name:"Moteur",         color:"#ff6b35" },
  brakes:      { id:"brakes",      icon:"💨", name:"Freinage",       color:"#ff4d70" },
  electric:    { id:"electric",    icon:"⚡", name:"Électrique",     color:"#ffd700" },
  transmission:{ id:"transmission",icon:"🔄", name:"Transmission",   color:"#a07aff" },
  cooling:     { id:"cooling",     icon:"❄️", name:"Refroidissement", color:"#31d6ff" },
  suspension:  { id:"suspension",  icon:"🛞", name:"Suspension",     color:"#48c78e" },
  sealing:     { id:"sealing",     icon:"💧", name:"Étanchéité",     color:"#7ab0ff" },
};

// --- CATALOGUE DE PIÈCES ---
// priceFactor = ratio du prix par rapport à la valeur de la voiture (ex: 0.07 = 7% de la valeur)
// Prix final = valeur_voiture × priceFactor × priceMult_fournisseur × discount_contrat
// Si pas de voiture en contexte → valeur moyenne du tier min compatible
// tiers = tiers de voitures qui peuvent nécessiter cette pièce
const PARTS_CATALOG = [
  // 🔩 MOTEUR
  { id:"kit_distrib",    category:"engine",       name:"Kit Distribution",      icon:"⛓️", priceFactor:0.07, tiers:["F","E","D","C","B"] },
  { id:"joint_culasse",  category:"engine",       name:"Joint de Culasse",      icon:"🔲",  priceFactor:0.06, tiers:["D","C","B","A"] },
  { id:"kit_pistons",    category:"engine",       name:"Kit Pistons + Segments", icon:"🔩", priceFactor:0.1, tiers:["C","B","A","S"] },
  { id:"pompe_huile",    category:"engine",       name:"Pompe à Huile",         icon:"🛢️",  priceFactor:0.05, tiers:["E","D","C","B"] },
  { id:"kit_soupapes",   category:"engine",       name:"Kit Soupapes",          icon:"🔧", priceFactor:0.08, tiers:["B","A","S","SS"] },
  { id:"turbo",          category:"engine",       name:"Turbocompresseur",      icon:"🌀", priceFactor:0.15, tiers:["S","SS","SSS","SSS+"] },

  // 💨 FREINAGE
  { id:"kit_plaq_av",    category:"brakes",       name:"Kit Plaquettes AV",     icon:"🔳",  priceFactor:0.04, tiers:["F","E","D","C","B"] },
  { id:"kit_plaq_ar",    category:"brakes",       name:"Kit Plaquettes AR",     icon:"🔳",  priceFactor:0.03, tiers:["F","E","D","C","B"] },
  { id:"kit_disques",    category:"brakes",       name:"Kit Disques AV",        icon:"⭕", priceFactor:0.07, tiers:["D","C","B","A"] },
  { id:"etrier",         category:"brakes",       name:"Étrier Recondit.",      icon:"🗜️", priceFactor:0.08, tiers:["B","A","S","SS"] },
  { id:"maitre_cyl",     category:"brakes",       name:"Maître-cylindre",       icon:"⚙️",  priceFactor:0.06, tiers:["C","B","A"] },

  // ⚡ ÉLECTRIQUE
  { id:"alternateur",    category:"electric",     name:"Alternateur",           icon:"⚡", priceFactor:0.08, tiers:["D","C","B","A"] },
  { id:"batterie",       category:"electric",     name:"Batterie",              icon:"🔋",  priceFactor:0.04, tiers:["F","E","D","C"] },
  { id:"kit_capteurs",   category:"electric",     name:"Kit Capteurs",          icon:"📡", priceFactor:0.1, tiers:["B","A","S"] },
  { id:"calculateur",    category:"electric",     name:"Calculateur Moteur",    icon:"💻", priceFactor:0.12, tiers:["A","S","SS","SSS"] },
  { id:"faisceau",       category:"electric",     name:"Faisceau Électrique",   icon:"🔌", priceFactor:0.1, tiers:["S","SS","SSS","SSS+"] },
  { id:"demarr",         category:"electric",     name:"Démarreur",             icon:"🔑", priceFactor:0.05, tiers:["E","D","C","B"] },

  // 🔄 TRANSMISSION
  { id:"kit_embrayage",  category:"transmission", name:"Kit Embrayage Complet", icon:"🔘", priceFactor:0.08, tiers:["D","C","B","A"] },
  { id:"cardan",         category:"transmission", name:"Cardan + Soufflet",     icon:"〰️", priceFactor:0.1, tiers:["C","B","A","S"] },
  { id:"roulement",      category:"transmission", name:"Roulement de Roue",     icon:"⚙️",  priceFactor:0.03, tiers:["F","E","D","C"] },
  { id:"boite_vit",      category:"transmission", name:"Boîte de Vitesses",     icon:"🎛️", priceFactor:0.16, tiers:["SS","SSS","SSS+"] },
  { id:"diff",           category:"transmission", name:"Différentiel",          icon:"⚙️", priceFactor:0.14, tiers:["A","S","SS","SSS"] },

  // ❄️ REFROIDISSEMENT
  { id:"radiateur",      category:"cooling",      name:"Radiateur",             icon:"🌡️", priceFactor:0.08, tiers:["D","C","B","A"] },
  { id:"pompe_eau",      category:"cooling",      name:"Pompe à Eau",           icon:"💧",  priceFactor:0.05, tiers:["E","D","C","B"] },
  { id:"thermostat",     category:"cooling",      name:"Thermostat + Joint",    icon:"🌡️",  priceFactor:0.02, tiers:["F","E","D","C"] },
  { id:"vase",           category:"cooling",      name:"Vase d'Expansion",      icon:"🫙",  priceFactor:0.02, tiers:["E","D","C"] },
  { id:"echangeur",      category:"cooling",      name:"Échangeur Thermique",   icon:"🔁", priceFactor:0.09, tiers:["S","SS","SSS","SSS+"] },

  // 🛞 SUSPENSION
  { id:"kit_amort_av",   category:"suspension",   name:"Kit Amortisseurs AV",   icon:"📏", priceFactor:0.12, tiers:["C","B","A"] },
  { id:"kit_amort_ar",   category:"suspension",   name:"Kit Amortisseurs AR",   icon:"📏", priceFactor:0.1, tiers:["C","B","A"] },
  { id:"rotules",        category:"suspension",   name:"Rotules + Silent-blocs",icon:"🔗",  priceFactor:0.04, tiers:["D","C","B"] },
  { id:"barre_stab",     category:"suspension",   name:"Barre Stab + Biellettes",icon:"📐",  priceFactor:0.08, tiers:["B","A","S"] },
  { id:"kit_susp_sport", category:"suspension",   name:"Kit Suspension Sport",  icon:"🏎️", priceFactor:0.12, tiers:["SS","SSS","SSS+"] },

  // 💧 ÉTANCHÉITÉ
  { id:"kit_joints",     category:"sealing",      name:"Kit Joints Moteur",     icon:"🔵",  priceFactor:0.03, tiers:["F","E","D","C"] },
  { id:"spi_vilo",       category:"sealing",      name:"Spi Vilebrequin AV+AR", icon:"🔵",  priceFactor:0.04, tiers:["D","C","B"] },
  { id:"joint_boite",    category:"sealing",      name:"Joint Boîte + Huile",   icon:"🔵",  priceFactor:0.05, tiers:["C","B","A"] },
  { id:"jeu_joints_haut",category:"sealing",      name:"Jeu de Joints Haut",    icon:"🔵", priceFactor:0.08, tiers:["B","A","S"] },
];

// --- PANNES PAR TIER ---
// Chaque entrée : { id, name, category, partsNeeded:[partId,...], tierRange:[min,max] }
const FAILURE_TYPES = [
  // MOTEUR
  { id:"f_distrib",    name:"Distribution",          category:"engine",       parts:["kit_distrib","joint_culasse"], tiers:["F","E","D","C","B"] },
  { id:"f_pistons",    name:"Pistons usés",           category:"engine",       parts:["kit_pistons","joint_culasse"], tiers:["C","B","A","S"] },
  { id:"f_huile",      name:"Pompe à huile",          category:"engine",       parts:["pompe_huile","kit_joints"],   tiers:["E","D","C","B"] },
  { id:"f_soupapes",   name:"Soupapes",               category:"engine",       parts:["kit_soupapes"],              tiers:["B","A","S","SS"] },
  { id:"f_turbo",      name:"Turbo HS",               category:"engine",       parts:["turbo","kit_joints"],        tiers:["S","SS","SSS","SSS+"] },

  // FREINAGE
  { id:"f_plaq",       name:"Plaquettes AV+AR",       category:"brakes",       parts:["kit_plaq_av","kit_plaq_ar"], tiers:["F","E","D","C"] },
  { id:"f_disques",    name:"Disques + Plaquettes",   category:"brakes",       parts:["kit_disques","kit_plaq_av"], tiers:["D","C","B","A"] },
  { id:"f_etrier",     name:"Étrier grippé",          category:"brakes",       parts:["etrier","kit_plaq_av"],      tiers:["B","A","S","SS"] },
  { id:"f_maitre",     name:"Maître-cylindre",        category:"brakes",       parts:["maitre_cyl"],               tiers:["C","B","A"] },

  // ÉLECTRIQUE
  { id:"f_altern",     name:"Alternateur HS",         category:"electric",     parts:["alternateur"],              tiers:["D","C","B","A"] },
  { id:"f_batterie",   name:"Batterie déchargée",     category:"electric",     parts:["batterie"],                 tiers:["F","E","D","C"] },
  { id:"f_capteurs",   name:"Capteurs défaillants",   category:"electric",     parts:["kit_capteurs"],             tiers:["B","A","S"] },
  { id:"f_calc",       name:"Calculateur corrompu",   category:"electric",     parts:["calculateur"],              tiers:["A","S","SS","SSS"] },
  { id:"f_faisceau",   name:"Faisceau brûlé",         category:"electric",     parts:["faisceau","kit_capteurs"],  tiers:["S","SS","SSS","SSS+"] },
  { id:"f_demarr",     name:"Démarreur HS",           category:"electric",     parts:["demarr"],                   tiers:["E","D","C","B"] },

  // TRANSMISSION
  { id:"f_embrayage",  name:"Embrayage grillé",       category:"transmission", parts:["kit_embrayage"],            tiers:["D","C","B","A"] },
  { id:"f_cardan",     name:"Cardan cassé",           category:"transmission", parts:["cardan"],                   tiers:["C","B","A","S"] },
  { id:"f_roulement",  name:"Roulement de roue",      category:"transmission", parts:["roulement"],                tiers:["F","E","D","C"] },
  { id:"f_boite",      name:"Boîte de vitesses",      category:"transmission", parts:["boite_vit"],                tiers:["SS","SSS","SSS+"] },
  { id:"f_diff",       name:"Différentiel endommagé", category:"transmission", parts:["diff"],                     tiers:["A","S","SS","SSS"] },

  // REFROIDISSEMENT
  { id:"f_radiateur",  name:"Radiateur percé",        category:"cooling",      parts:["radiateur"],                tiers:["D","C","B","A"] },
  { id:"f_pompe_eau",  name:"Pompe à eau HS",         category:"cooling",      parts:["pompe_eau","thermostat"],   tiers:["E","D","C","B"] },
  { id:"f_thermostat", name:"Thermostat bloqué",      category:"cooling",      parts:["thermostat"],               tiers:["F","E","D","C"] },
  { id:"f_vase",       name:"Vase expansion fissuré", category:"cooling",      parts:["vase"],                     tiers:["E","D","C"] },
  { id:"f_echangeur",  name:"Échangeur colmaté",      category:"cooling",      parts:["echangeur"],                tiers:["S","SS","SSS","SSS+"] },

  // SUSPENSION
  { id:"f_amort_av",   name:"Amortisseurs AV usés",   category:"suspension",   parts:["kit_amort_av"],             tiers:["C","B","A"] },
  { id:"f_amort_ar",   name:"Amortisseurs AR usés",   category:"suspension",   parts:["kit_amort_ar"],             tiers:["C","B","A"] },
  { id:"f_rotules",    name:"Rotules + silent-blocs", category:"suspension",   parts:["rotules"],                  tiers:["D","C","B"] },
  { id:"f_stab",       name:"Barre stabilisatrice",   category:"suspension",   parts:["barre_stab"],               tiers:["B","A","S"] },
  { id:"f_susp_sport", name:"Suspension sport HS",    category:"suspension",   parts:["kit_susp_sport"],           tiers:["SS","SSS","SSS+"] },

  // ÉTANCHÉITÉ
  { id:"f_joints",     name:"Joints moteur",          category:"sealing",      parts:["kit_joints"],               tiers:["F","E","D","C"] },
  { id:"f_spi",        name:"Spi vilebrequin",        category:"sealing",      parts:["spi_vilo"],                 tiers:["D","C","B"] },
  { id:"f_jt_boite",   name:"Joint boîte de vitesses",category:"sealing",      parts:["joint_boite"],              tiers:["C","B","A"] },
  { id:"f_jt_haut",    name:"Joints de culasse/haut", category:"sealing",      parts:["jeu_joints_haut"],          tiers:["B","A","S"] },
];

// Tire une panne compatible avec le tier de la voiture
function pickFailure(tier){
  const compatible = FAILURE_TYPES.filter(f => f.tiers.includes(tier));
  if(!compatible.length) return FAILURE_TYPES[0];
  return pick(compatible);
}

// Calcule le prix d'une pièce selon le fournisseur
// Nouveau système : prix = valeur_voiture × supplier.costPct / nb_pièces_réparation
// Si pas de voiture → valeur moyenne du tier min de la pièce
const TIER_AVG_VALUE = {
  F:120, E:320, D:850, C:2000, B:5000,
  A:13000, S:35000, SS:90000, SSS:230000, "SSS+":600000
};

function getPartRefValue(part, car){
  if(car) return car.baseValue ?? car.value ?? TIER_AVG_VALUE[car.tier] ?? 1000;
  const minTier = part.tiers[0];
  return TIER_AVG_VALUE[minTier] ?? 1000;
}

// Système de prix :
// - Coût total réparation = carValue × supplier.costPct (garanti)
// - Coût par pièce = coûtTotal × (priceFactor_pièce / somme_priceFactor_réparation)
// - Si une seule pièce ou pas de contexte : costPct appliqué directement
// totalFactor = somme des priceFactor de toutes les pièces de la réparation
function getPartPrice(partId, supplierId, car, totalFactor){
  const part = PARTS_CATALOG.find(p => p.id === partId);
  const supp = SUPPLIERS[supplierId];
  if(!part || !supp) return 0;
  const refValue = getPartRefValue(part, car);
  const totalCost = refValue * supp.costPct;
  // Répartition proportionnelle au priceFactor
  const ratio = totalFactor ? (part.priceFactor / totalFactor) : 1;
  return Math.max(1, Math.round(totalCost * ratio));
}

// Retourne la qualité effective d'un fournisseur pour une pièce (spécialité NGX)
function getEffectiveQuality(supplierId, partId){
  const supp = SUPPLIERS[supplierId];
  if(!supp) return 3;
  const part = PARTS_CATALOG.find(p => p.id === partId);
  let q = supp.quality;
  if(supp.speciality){
    const cats = Array.isArray(supp.speciality) ? supp.speciality : [supp.speciality];
    if(part && cats.includes(part.category)) q = Math.min(5, q + 1);
  }
  return q;
}

// Calcule le délai de livraison en secondes selon upgrades

function getShowroomCap(){
  return (state.showroomCap ?? 3) + (state.talentShowroomSlots ?? 0);
}

function getMaxOrders(){
  const lvl = getUpgrade("slots_livraison")?.lvl || 0;
  return 1 + lvl + (state.talentExtraSlots ?? 0);
}
function getDeliveryDelay(supplierId){
  const supp = SUPPLIERS[supplierId];
  if(!supp) return 3600;
  if(supp.instantDelivery) return supp.deliveryBase;
  const magLvl = getUpgrade("magasinier")?.lvl || 0;
  let delay = supp.deliveryBase;
  delay *= Math.pow(0.75, magLvl);
  delay *= (1 - (state.talentDeliveryDisc ?? 0));  // talent parts_1 : -5%/rang
  return Math.max(5, Math.round(delay));
}

// Vérifie si une pièce est en stock (quantité suffisante)
function hasPartInStock(partId, qty = 1){
  return (state.parts?.[partId]?.qty ?? 0) >= qty;
}

// Consomme des pièces du stock pour une réparation
// Retourne la qualité moyenne pondérée utilisée (pour appliquer effets)
function consumeParts(partIds, car){
  if(!state.parts) return 3;
  let totalQ = 0, count = 0;
  // Calcule le totalFactor pour la répartition proportionnelle
  const totalFactor = partIds.reduce((sum, pid) => {
    const p = PARTS_CATALOG.find(x => x.id === pid);
    return sum + (p?.priceFactor ?? 0.05);
  }, 0) || 1;
  for(const pid of partIds){
    const slot = state.parts[pid];
    if(slot && slot.qty > 0){
      slot.qty--;
      const effQ = getEffectiveQuality(slot.supplier, pid);
      totalQ += effQ;
      count++;
      const cost = getPartPrice(pid, slot.supplier, car, totalFactor);
      state.money -= cost;
    }
  }
  return count > 0 ? totalQ / count : null;
}

// Vérifie si toutes les pièces d'une réparation sont dispo
function checkPartsAvailability(partIds){
  if(!state.parts) return { ok: true, missing: [] };
  const missing = partIds.filter(pid => !hasPartInStock(pid));
  return { ok: missing.length === 0, missing };
}

// Lance une commande fournisseur — gratuit à la commande, coût déduit à l'utilisation
function orderPart(partId, supplierId, qty = 1){
  if(!state.orders) state.orders = [];
  if(state.orders.length >= getMaxOrders()){
    showToast("⚠️ Slots de livraison pleins ! Améliorez les Slots Livraison.");
    return false;
  }
  const delay = getDeliveryDelay(supplierId);
  state.orders.push({
    id: crypto.randomUUID(),
    partId,
    supplierId,
    qty,
    deliveryAt:    Date.now() + delay * 1000,
    timeLeft:      delay,
    originalDelay: delay,
  });
  return true;
}

// Toast léger pour notifications pièces (non intrusif)
let _toastTimeout = null;
function showToast(msg){
  let toast = document.getElementById("partsToast");
  if(!toast){
    toast = document.createElement("div");
    toast.id = "partsToast";
    toast.style.cssText = [
      "position:fixed","bottom:80px","left:50%","transform:translateX(-50%)",
      "background:rgba(20,30,50,0.95)","border:1px solid rgba(72,199,142,.3)",
      "color:#48c78e","padding:8px 18px","border-radius:20px","font-size:13px",
      "z-index:9999","pointer-events:none","transition:opacity .3s",
    ].join(";");
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  clearTimeout(_toastTimeout);
  _toastTimeout = setTimeout(() => { toast.style.opacity = "0"; }, 3000);
}

// Texte flottant (+argent, +REP, etc.)
function spawnFloatText(text, type, originEl){
  const el = document.createElement("div");
  el.className = `floatText floatText--${type}`;
  el.textContent = text;
  // originEl peut être un Element DOM ou un objet {x, y} de coordonnées précalculées
  if(originEl && typeof originEl.x === "number"){
    // Coordonnées déjà calculées (utile quand l'élément est retiré du DOM avant le setTimeout)
    el.style.left = originEl.x + "px";
    el.style.top  = originEl.y + "px";
  } else if(originEl && originEl.getBoundingClientRect){
    const r = originEl.getBoundingClientRect();
    el.style.left = (r.left + r.width/2) + "px";
    el.style.top  = (r.top  - 8) + "px";
  } else {
    el.style.left = "50%";
    el.style.top  = "40%";
    el.style.transform = "translateX(-50%)";
  }
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

// Traite les livraisons en cours (appelé dans tick)
function processOrders(dt){
  if(!state.orders || !state.orders.length) return;
  const arrived = [];
  state.orders = state.orders.filter(order => {
    order.timeLeft -= dt;
    if(order.timeLeft <= 0){
      arrived.push(order);
      return false;
    }
    return true;
  });
  for(const order of arrived){
    if(!state.parts) state.parts = {};
    if(!state.parts[order.partId]){
      state.parts[order.partId] = { qty: 0, supplier: order.supplierId };
    }
    state.parts[order.partId].qty += order.qty;
    state.parts[order.partId].supplier  = order.supplierId;
    state.parts[order.partId].lastPrice = getPartPrice(order.partId, order.supplierId);
    // Succès livraison rapide : Euroline en < 10s (avec talents/amélios)
    if(order.supplierId === "euroline" && (order.originalDelay ?? order.timeLeft + dt) <= 10){
      state._fastDelivery = true;
    }
    // Pas de toast pendant le catchup offline (évite le spam)
    if(!_isOfflineCatchup){
      showToast(`📦 Livraison reçue : ${PARTS_CATALOG.find(p=>p.id===order.partId)?.name ?? order.partId} ×${order.qty}`);
    }
  }
}

// Modificateur de vitesse de réparation selon stock pièces
// Retourne un multiplicateur appliqué au speedMult global
function getPartsSpeedMult(car){
  if(!car?.failure || !state.parts) return 1.0;
  const { ok } = checkPartsAvailability(car.failure.parts);
  if(!ok) return 0.5; // pièce manquante → ×0.5 vitesse
  // Applique le timeMult de la qualité des pièces en stock
  // On prend la qualité moyenne des pièces requises
  let totalQ = 0, count = 0;
  for(const pid of car.failure.parts){
    const slot = state.parts[pid];
    if(slot?.qty > 0){
      totalQ += getEffectiveQuality(slot.supplier, pid);
      count++;
    }
  }
  if(count === 0) return 1.0;
  const avgQ = totalQ / count;
  const suppId = state.parts[car.failure.parts[0]]?.supplier ?? null;
  return getQualityEffects(Math.round(avgQ), suppId).timeMult;
}

// Calcule le coût total des pièces nécessaires pour réparer une voiture
function calcPartsCost(car){
  if(!car?.failure?.parts?.length) return 0;
  const totalFactor = car.failure.parts.reduce((sum, pid) => {
    const p = PARTS_CATALOG.find(x => x.id === pid);
    return sum + (p?.priceFactor ?? 0.05);
  }, 0) || 1;
  let total = 0;
  for(const pid of car.failure.parts){
    const slot = state.parts?.[pid];
    const supplierId = slot?.supplier ?? "euroline";
    total += getPartPrice(pid, supplierId, car, totalFactor);
  }
  return total;
}

// Retourne le multiplicateur de valeur de vente selon qualité pièces utilisées
function getPartsValueMult(car){
  if(!car?.partsQuality) return 1.0;
  const suppId = car.partsSupplier ?? null;
  return getQualityEffects(Math.round(car.partsQuality), suppId).valueMult;
}

// =====================================================================
// FIN SYSTÈME PIÈCES DÉTACHÉES
// =====================================================================

// =====================
// CAR CATALOG — Tiers A→SSS+
// =====================
const CAR_CATALOG = [

  // ── TIER F — Épaves & guimbardes (80–200€, 5–12s) ──────────────────
  { tier:"F", name:"Renno Twinko",        baseValue:80,  repairTime:10  }, // Renault Twingo
  { tier:"F", name:"Pijot 10six",         baseValue:100, repairTime:12  }, // Peugeot 106
  { tier:"F", name:"Fiato Pantôme",       baseValue:90,  repairTime:10  }, // Fiat Punto
  { tier:"F", name:"Citron Saxôh VTS",    baseValue:130, repairTime:14  }, // Citroën Saxo VTS
  { tier:"F", name:"Opal Corsa B",        baseValue:110, repairTime:12  }, // Opel Corsa
  { tier:"F", name:"Fjord Kaa",           baseValue:95,  repairTime:12  }, // Ford Ka
  { tier:"F", name:"Renno Clioz 2",       baseValue:150, repairTime:16  }, // Renault Clio 2
  { tier:"F", name:"Daïhatsou Curoule",   baseValue:85,  repairTime:10  }, // Daihatsu Cuore
  { tier:"F", name:"Lada Niiivah",        baseValue:70,  repairTime:10  }, // Lada Niva
  { tier:"F", name:"Citron Axia",         baseValue:105, repairTime:12  }, // Citroën Xsara
  { tier:"F", name:"Pijot 206i",          baseValue:140, repairTime:16  }, // Peugeot 206
  { tier:"F", name:"Kia Prido",           baseValue:88,  repairTime:10  }, // Kia Pride
  { tier:"F", name:"Séat Malaga Poussah", baseValue:75,  repairTime:10  }, // Seat Malaga
  { tier:"F", name:"Trabounet 601 Plastoc",baseValue:60, repairTime:8  }, // Trabant 601
  { tier:"F", name:"Yugo Zastava Bravo",  baseValue:55,  repairTime:8  }, // Yugo
  { tier:"F", name:"Roveur Minousse",     baseValue:165, repairTime:18  }, // Rover Mini
  { tier:"F", name:"Renno 4L Cahotante",  baseValue:95,  repairTime:12  }, // Renault 4L
  { tier:"F", name:"Fjord Esquorte Mk5",  baseValue:120, repairTime:14  }, // Ford Escort
  { tier:"F", name:"Pijot 104 Choupinette",baseValue:72, repairTime:10  }, // Peugeot 104
  { tier:"F", name:"Citron BX Brisquette",baseValue:88,  repairTime:12  }, // Citroën BX
  { tier:"F", name:"Fiato Séitchento",    baseValue:96,  repairTime:12  }, // Fiat Seicento
  { tier:"F", name:"Opal Kâdette Sieste", baseValue:82,  repairTime:10  }, // Opel Kadett
  { tier:"F", name:"Zaporoj 966 Tartinette",baseValue:45,repairTime:8  }, // Zaporozhets
  { tier:"F", name:"Skoda Félisha Flouze",baseValue:115, repairTime:14  }, // Skoda Felicia
  { tier:"F", name:"Renno Twingo 2 Boudeur",baseValue:155,repairTime:16 }, // Renault Twingo 2

  // ── TIER E — Citadines basiques (200–450€, 12–22s) ─────────────────
  { tier:"E", name:"Volkz Pôlo III",      baseValue:220, repairTime:35 }, // VW Polo
  { tier:"E", name:"Fjord Fiestôt",       baseValue:200, repairTime:32 }, // Ford Fiesta
  { tier:"E", name:"Opèl Astrâ G",        baseValue:250, repairTime:38 }, // Opel Astra
  { tier:"E", name:"Renno Mégânon",       baseValue:280, repairTime:40 }, // Renault Mégane
  { tier:"E", name:"Citron C3 Plurya",    baseValue:230, repairTime:35 }, // Citroën C3 Pluriel
  { tier:"E", name:"Hyundra Getzzi",      baseValue:210, repairTime:32 }, // Hyundai Getz
  { tier:"E", name:"Kia Riyo",            baseValue:240, repairTime:38 }, // Kia Rio
  { tier:"E", name:"Nissin Micra K12",    baseValue:195, repairTime:30 }, // Nissan Micra
  { tier:"E", name:"Toyo Yarriz",         baseValue:260, repairTime:40 }, // Toyota Yaris
  { tier:"E", name:"Seet Ibizzôh",        baseValue:270, repairTime:40 }, // Seat Ibiza
  { tier:"E", name:"Suzuka Swyft",        baseValue:235, repairTime:35 }, // Suzuki Swift
  { tier:"E", name:"Pijot 207i",          baseValue:290, repairTime:42 }, // Peugeot 207
  { tier:"E", name:"Renno Kangourou",     baseValue:300, repairTime:45 }, // Renault Kangoo
  { tier:"E", name:"Citron Berllingot",   baseValue:245, repairTime:38 }, // Citroën Berlingo
  { tier:"E", name:"Pijot Partenaire Bizz",baseValue:225,repairTime:35 }, // Peugeot Partner
  { tier:"E", name:"Mitsubish Colto",     baseValue:215, repairTime:32 }, // Mitsubishi Colt
  { tier:"E", name:"Chevro Sparcouille",  baseValue:205, repairTime:32 }, // Chevrolet Spark
  { tier:"E", name:"Fiato Pâllio Frotti", baseValue:220, repairTime:35 }, // Fiat Palio
  { tier:"E", name:"Skodda Fâbia Plouc",  baseValue:255, repairTime:38 }, // Skoda Fabia
  { tier:"E", name:"Toyo iQ Nanoïde",     baseValue:285, repairTime:42 }, // Toyota iQ
  { tier:"E", name:"Smaart Fortouze",     baseValue:310, repairTime:45 }, // Smart Fortwo
  { tier:"E", name:"Hyundra i10 Minot",   baseValue:230, repairTime:35 }, // Hyundai i10
  { tier:"E", name:"Kia Picantoune",      baseValue:195, repairTime:30 }, // Kia Picanto
  { tier:"E", name:"Fiato 500 Popotin",   baseValue:340, repairTime:48 }, // Fiat 500

  // ── TIER D — Compactes & familiales (500–1000€, 25–40s) ────────────
  { tier:"D", name:"Volkz Golph IV",      baseValue:550, repairTime:84 }, // VW Golf 4
  { tier:"D", name:"Odi A-Tri",           baseValue:600, repairTime:90 }, // Audi A3
  { tier:"D", name:"BimV Série Oon",      baseValue:700, repairTime:102 }, // BMW Série 1
  { tier:"D", name:"Fjord Foucos",        baseValue:520, repairTime:81 }, // Ford Focus
  { tier:"D", name:"Renno Lagouna",       baseValue:580, repairTime:87 }, // Renault Laguna
  { tier:"D", name:"Pijot 406 Coupâl",    baseValue:650, repairTime:93 }, // Peugeot 406 Coupé
  { tier:"D", name:"Merko Classa A",      baseValue:630, repairTime:90 }, // Mercedes Classe A
  { tier:"D", name:"Saab 9-Troi",         baseValue:720, repairTime:105 }, // Saab 9-3
  { tier:"D", name:"Volvo V40 Soixante",  baseValue:680, repairTime:99 }, // Volvo V40
  { tier:"D", name:"Odi A-Four B6",       baseValue:800, repairTime:114 }, // Audi A4 B6
  { tier:"D", name:"Hyundra Elantrouze",  baseValue:530, repairTime:81 }, // Hyundai Elantra
  { tier:"D", name:"Toyo Corrola",        baseValue:560, repairTime:84 }, // Toyota Corolla
  { tier:"D", name:"Pijot 307 Brouillon", baseValue:570, repairTime:84 }, // Peugeot 307
  { tier:"D", name:"Renno Scénik Picnic", baseValue:610, repairTime:90 }, // Renault Scenic
  { tier:"D", name:"Citron Eczéma C5",    baseValue:640, repairTime:93 }, // Citroën C5
  { tier:"D", name:"Hinda Accordéon",     baseValue:760, repairTime:108 }, // Honda Accord
  { tier:"D", name:"Toyo Rây",            baseValue:690, repairTime:99 }, // Toyota RAV4
  { tier:"D", name:"Nissou Almîra",       baseValue:505, repairTime:78 }, // Nissan Almera
  { tier:"D", name:"Mazda Sikss Bi-Tourné",baseValue:730,repairTime:105 }, // Mazda 6
  { tier:"D", name:"Volkz Tournhalle",    baseValue:810, repairTime:114 }, // VW Touran
  { tier:"D", name:"Seet Léonne Tigr",    baseValue:545, repairTime:81 }, // Seat Leon
  { tier:"D", name:"Kia Cîid Tartinette", baseValue:520, repairTime:78 }, // Kia Ceed

  // ── TIER C — Berlines & compactes sportives (1000–3000€, 45–70s) ───
  { tier:"C", name:"BimV M3 E-trente",    baseValue:1800, repairTime:210 }, // BMW M3 E30
  { tier:"C", name:"Volkz Golph GTI Mk3", baseValue:1200, repairTime:168 }, // VW Golf GTI
  { tier:"C", name:"Merko C200 Kompô",    baseValue:1500, repairTime:189 }, // Mercedes C200
  { tier:"C", name:"Odi A4 Quâtro",       baseValue:1600, repairTime:196 }, // Audi A4 Quattro
  { tier:"C", name:"Alfa Roméa 156",      baseValue:1100, repairTime:161 }, // Alfa Romeo 156
  { tier:"C", name:"Renno Spasso V6",     baseValue:2000, repairTime:224 }, // Renault Espace V6
  { tier:"C", name:"Pijot 306 S16",       baseValue:1400, repairTime:182 }, // Peugeot 306 S16
  { tier:"C", name:"Hinda Civique Type-S",baseValue:1300, repairTime:175 }, // Honda Civic Type-S
  { tier:"C", name:"Toyo Avénsis",        baseValue:1050, repairTime:158 }, // Toyota Avensis
  { tier:"C", name:"Volkz Passoa",        baseValue:1150, repairTime:164 }, // VW Passat
  { tier:"C", name:"Fjord MondeoXL",      baseValue:1000, repairTime:158 }, // Ford Mondeo
  { tier:"C", name:"Minni Coupairre",     baseValue:2200, repairTime:238 }, // Mini Cooper
  { tier:"C", name:"Renno Mégânon RS",    baseValue:2400, repairTime:245 }, // Renault Megane RS
  { tier:"C", name:"Odi TT Coupounet",    baseValue:2600, repairTime:252 }, // Audi TT
  { tier:"C", name:"BimV 3-Série E46 Chic",baseValue:1700,repairTime:203 }, // BMW E46
  { tier:"C", name:"Merko Classa C W203", baseValue:1350, repairTime:178 }, // Mercedes C W203
  { tier:"C", name:"Toyo Célica Caramel", baseValue:1900, repairTime:217 }, // Toyota Celica
  { tier:"C", name:"Hinda Préloud",       baseValue:1450, repairTime:186 }, // Honda Prelude
  { tier:"C", name:"Alfa Roméa GTV Pâtisserie",baseValue:1600,repairTime:196}, // Alfa GTV
  { tier:"C", name:"Pijot RCZ Ragueneau", baseValue:2800, repairTime:259 }, // Peugeot RCZ
  { tier:"C", name:"Renno Mégânon Coupwé",baseValue:1300, repairTime:175 }, // Renault Mégane Coupé
  { tier:"C", name:"Seet Léonne Cupra",   baseValue:2100, repairTime:228 }, // Seat Leon Cupra

  // ── TIER B — Sportives & youngtimers (3000–8000€, 80–110s) ─────────
  { tier:"B", name:"Subaro Imprézah WRX", baseValue:3500, repairTime:340 }, // Subaru Impreza WRX
  { tier:"B", name:"Nissou 350-Zed",      baseValue:4000, repairTime:360 }, // Nissan 350Z
  { tier:"B", name:"Mazda Mx-5 Miaaata",  baseValue:3200, repairTime:328 }, // Mazda MX-5 Miata
  { tier:"B", name:"Hinda S2Mille",       baseValue:4500, repairTime:376 }, // Honda S2000
  { tier:"B", name:"Toyo Souprà MkIV",    baseValue:5500, repairTime:400}, // Toyota Supra MkIV
  { tier:"B", name:"Pijot 205 Gti 1.9",   baseValue:3800, repairTime:352 }, // Peugeot 205 GTI
  { tier:"B", name:"Lancia Deltâ Intégr", baseValue:5000, repairTime:384 }, // Lancia Delta Integrale
  { tier:"B", name:"Mitsubish Ekliipse",  baseValue:3600, repairTime:344 }, // Mitsubishi Eclipse
  { tier:"B", name:"Hinda Integra Type-R",baseValue:4200, repairTime:364 }, // Honda Integra Type-R
  { tier:"B", name:"Porsha Boxstarr 986", baseValue:6000, repairTime:416}, // Porsche Boxster 986
  { tier:"B", name:"Renno Spasse F1",     baseValue:4800, repairTime:380 }, // Renault Espace F1 (joke)
  { tier:"B", name:"BimV M3 E36",         baseValue:4000, repairTime:360 }, // BMW M3 E36
  { tier:"B", name:"Mitsubish Lanciâ Evo7",baseValue:5200,repairTime:392 }, // Mitsubishi Lancer Evo
  { tier:"B", name:"Subaro Légassie BH5", baseValue:3400, repairTime:336 }, // Subaru Legacy
  { tier:"B", name:"Toyo MR2 Spydouille", baseValue:3700, repairTime:348 }, // Toyota MR2
  { tier:"B", name:"Nissou Sîlvia S15",   baseValue:4600, repairTime:372 }, // Nissan Silvia S15
  { tier:"B", name:"Fjord Puma Rugissant", baseValue:3300, repairTime:332 }, // Ford Puma
  { tier:"B", name:"Alfa Roméa 147 GTA",  baseValue:4900, repairTime:384 }, // Alfa 147 GTA
  { tier:"B", name:"Renno Clioz V6 Folasse",baseValue:5800,repairTime:408}, // Renault Clio V6
  { tier:"B", name:"Mazda RX-Septe Wânkel",baseValue:4100,repairTime:364 }, // Mazda RX-7
  { tier:"B", name:"BimV Z3 Décapoté",    baseValue:3900, repairTime:356 }, // BMW Z3
  { tier:"B", name:"VW Corraïdo Vent",    baseValue:3600, repairTime:344 }, // VW Corrado
  { tier:"B", name:"Mitsubish 3000GT Brouaha",baseValue:4700,repairTime:376}, // Mitsubishi 3000GT

  // ── TIER A — Luxe & SUV premium (8000–20000€, 120–170s) ────────────
  { tier:"A", name:"Porsha Cayennard",    baseValue:9000,  repairTime:585}, // Porsche Cayenne
  { tier:"A", name:"Odi Q7 Quâtroc",      baseValue:10000, repairTime:630}, // Audi Q7
  { tier:"A", name:"Cadillak Escalâde",   baseValue:12000, repairTime:675}, // Cadillac Escalade
  { tier:"A", name:"Teslla Modèl Ès",     baseValue:15000, repairTime:720}, // Tesla Model S
  { tier:"A", name:"Merko G63 AMGueule",  baseValue:18000, repairTime:765}, // Mercedes G63 AMG
  { tier:"A", name:"BimV X5 Emmm",        baseValue:11000, repairTime:652}, // BMW X5 M
  { tier:"A", name:"Hummur H2 Bouzin",    baseValue:9500,  repairTime:608}, // Hummer H2
  { tier:"A", name:"Bentlaï Continentâl", baseValue:20000, repairTime:788}, // Bentley Continental
  { tier:"A", name:"Lexys LX570",         baseValue:14000, repairTime:711}, // Lexus LX570
  { tier:"A", name:"Ranjet Roupie",       baseValue:16000, repairTime:742}, // Range Rover
  { tier:"A", name:"Maybach 57 Blingbling",baseValue:19000,repairTime:774}, // Maybach
  { tier:"A", name:"Merko AMG GT4 Pattes",baseValue:17000, repairTime:756}, // Mercedes AMG GT
  { tier:"A", name:"Odi RS6 Avanguarde",  baseValue:16500, repairTime:747}, // Audi RS6
  { tier:"A", name:"BimV M5 E39 Bombasse",baseValue:13000, repairTime:688}, // BMW M5 E39
  { tier:"A", name:"Mézarâti Quattropattes",baseValue:18500,repairTime:770}, // Maserati Quattroporte
  { tier:"A", name:"Porsha Panâméra Ventru",baseValue:17500,repairTime:760}, // Porsche Panamera
  { tier:"A", name:"Lambô Urus Pachyderme",baseValue:19500,repairTime:783}, // Lamborghini Urus
  { tier:"A", name:"Teslla Modèl X Porte",baseValue:14500, repairTime:716}, // Tesla Model X
  { tier:"A", name:"Infinitii FX45 Grosse",baseValue:9800, repairTime:612}, // Infiniti FX45
  { tier:"A", name:"Toyo Landcruzer Boss", baseValue:12500, repairTime:680}, // Toyota Land Cruiser
  { tier:"A", name:"Merko Klass E W212",  baseValue:10500, repairTime:639}, // Mercedes Classe E
  { tier:"A", name:"Rollz Royce Champô",  baseValue:20000, repairTime:792}, // Rolls Royce

  // ── TIER S — Sportives prestige (25000–60000€, 200–280s) ────────────
  { tier:"S", name:"Porsha 911 NeufNeuf", baseValue:28000, repairTime:1050}, // Porsche 911
  { tier:"S", name:"Jagwa F-Type Câlin",  baseValue:32000, repairTime:1100}, // Jaguar F-Type
  { tier:"S", name:"Fjord Mustângu GT500",baseValue:30000, repairTime:1075}, // Ford Mustang GT500
  { tier:"S", name:"Chevrolèt Corvette C7",baseValue:38000,repairTime:1175}, // Chevrolet Corvette C7
  { tier:"S", name:"Ferrero TestaRôssa",  baseValue:45000, repairTime:1275}, // Ferrari Testarossa
  { tier:"S", name:"Dodje Viperouille",   baseValue:35000, repairTime:1140}, // Dodge Viper
  { tier:"S", name:"A-C Cobra 427 Bête",  baseValue:29000, repairTime:1060}, // AC Cobra 427
  { tier:"S", name:"Aston Marten DB7",    baseValue:34000, repairTime:1120}, // Aston Martin DB7
  { tier:"S", name:"De Tomâso Pantère",   baseValue:31000, repairTime:1090}, // De Tomaso Pantera
  { tier:"S", name:"Lambo Diâboulet",     baseValue:50000, repairTime:1340}, // Lamborghini Diablo
  { tier:"S", name:"Ferrarro F355 Moâh",  baseValue:42000, repairTime:1240}, // Ferrari F355
  { tier:"S", name:"BimV M1 Ancestral",   baseValue:55000, repairTime:1375}, // BMW M1
  { tier:"S", name:"Merko SLK Saucisson", baseValue:27000, repairTime:1040}, // Mercedes SLK
  { tier:"S", name:"Odi R8 Spidrou",      baseValue:48000, repairTime:1310}, // Audi R8
  { tier:"S", name:"Nissou GT-R R34 Légendzo",baseValue:52000,repairTime:1360}, // Nissan GTR R34
  { tier:"S", name:"BimV M6 E63 Bravo",   baseValue:36000, repairTime:1150}, // BMW M6
  { tier:"S", name:"Ferrero 348 Coucouzi", baseValue:40000,repairTime:1210}, // Ferrari 348
  { tier:"S", name:"Porsha 944 Turbo Souf",baseValue:26500,repairTime:1030}, // Porsche 944 Turbo
  { tier:"S", name:"Aston Marten Vantâje", baseValue:44000,repairTime:1265}, // Aston Martin Vantage
  { tier:"S", name:"Mézarâti GranTurismo", baseValue:33000,repairTime:1110}, // Maserati GranTurismo
  { tier:"S", name:"Lambo Gallardeau",    baseValue:46000, repairTime:1290}, // Lamborghini Gallardo
  { tier:"S", name:"Chevrolèt Camarôh ZL1",baseValue:29500,repairTime:1065}, // Chevrolet Camaro ZL1

  // ── TIER SS — Supercars (70000–200000€, 320–480s) ───────────────────
  { tier:"SS", name:"Ferrero F40 Quarante",baseValue:90000, repairTime:1980}, // Ferrari F40
  { tier:"SS", name:"Lambo Murcîelago",    baseValue:110000,repairTime:2200}, // Lamborghini Murciélago
  { tier:"SS", name:"Porsha Carrera GT Fô",baseValue:130000,repairTime:2365}, // Porsche Carrera GT
  { tier:"SS", name:"Lexys LF-Âh",         baseValue:95000, repairTime:2062}, // Lexus LFA
  { tier:"SS", name:"Aston Marten DBS Glo",baseValue:105000,repairTime:2145}, // Aston Martin DBS
  { tier:"SS", name:"McLoren MP4-12C",      baseValue:140000,repairTime:2420}, // McLaren MP4-12C
  { tier:"SS", name:"Nissou GT-R R35 Godzl",baseValue:85000,repairTime:1952}, // Nissan GT-R R35
  { tier:"SS", name:"Mézarâti MC12 Vroom",  baseValue:175000,repairTime:2585}, // Maserati MC12
  { tier:"SS", name:"Ferrarro Enzô Boûff",  baseValue:200000,repairTime:2640}, // Ferrari Enzo
  { tier:"SS", name:"Zonda Paganizone",      baseValue:160000,repairTime:2530}, // Pagani Zonda
  { tier:"SS", name:"Ferrero 599 GTO Pouet", baseValue:120000,repairTime:2310}, // Ferrari 599 GTO
  { tier:"SS", name:"Lambo Huracannable",   baseValue:100000,repairTime:2118}, // Lamborghini Huracan
  { tier:"SS", name:"Porsha GT3 RS Puncheur",baseValue:115000,repairTime:2255}, // Porsche GT3 RS
  { tier:"SS", name:"McLoren 675LT Longtoi", baseValue:145000,repairTime:2448}, // McLaren 675LT
  { tier:"SS", name:"Aston Marten One-77 Bling",baseValue:185000,repairTime:2612}, // Aston One-77
  { tier:"SS", name:"Rollz Royce Phàntôme Roi",baseValue:195000,repairTime:2634}, // Rolls Ghost
  { tier:"SS", name:"BimV M8 GTS Furioso",  baseValue:80000, repairTime:1936}, // BMW M8 GTS
  { tier:"SS", name:"Merko SLS AMG Aiglette",baseValue:92000,repairTime:2008}, // Mercedes SLS AMG

  // ── TIER SSS — Hypercars rares (300000–800000€, 600–900s) ───────────
  { tier:"SSS", name:"Bugatti Vaiyronne",   baseValue:350000,repairTime:3900}, // Bugatti Veyron
  { tier:"SSS", name:"Pagânì Huayrra Brr",  baseValue:500000,repairTime:4500}, // Pagani Huayra
  { tier:"SSS", name:"Koenigsmeg Agéra RS", baseValue:450000,repairTime:4320}, // Koenigsegg Agera RS
  { tier:"SSS", name:"McLoren P1 PleurÔ",   baseValue:600000,repairTime:4920}, // McLaren P1
  { tier:"SSS", name:"Porsha 918 Spidrou",  baseValue:550000,repairTime:4680}, // Porsche 918 Spyder
  { tier:"SSS", name:"Ferrarro LaFerrarî",  baseValue:700000,repairTime:5280}, // Ferrari LaFerrari
  { tier:"SSS", name:"Lambo Aventadôr SVJ", baseValue:400000,repairTime:4200}, // Lamborghini Aventador SVJ
  { tier:"SSS", name:"Ferrero FXX-K Démon", baseValue:750000,repairTime:5340}, // Ferrari FXX-K
  { tier:"SSS", name:"McLoren Sènnne Ouf",  baseValue:650000,repairTime:5040}, // McLaren Senna
  { tier:"SSS", name:"Rimac Nevéra Électrik",baseValue:580000,repairTime:4800}, // Rimac Nevera
  { tier:"SSS", name:"Koenigsmeg Regéra Svp",baseValue:480000,repairTime:4440}, // Koenigsegg Regera
  { tier:"SSS", name:"Lambo Venéno Dinguo", baseValue:800000,repairTime:5400}, // Lamborghini Veneno
  { tier:"SSS", name:"Aston Marten Vulcaîne",baseValue:420000,repairTime:4260}, // Aston Martin Vulcan
  { tier:"SSS", name:"Porsha GT1 Ancêtre",  baseValue:460000,repairTime:4380}, // Porsche GT1
  { tier:"SSS", name:"Bugatti EB110 Ancétral",baseValue:380000,repairTime:4080}, // Bugatti EB110

  // ── TIER SSS+ — Legendary (1M€+, 1200–2000s) ───────────────────────
  { tier:"SSS+", name:"Bugatti Shironisé",    baseValue:1500000,repairTime:9750}, // Bugatti Chiron
  { tier:"SSS+", name:"Koenigsmeg Jeskô Fls", baseValue:1200000,repairTime:8450}, // Koenigsegg Jesko
  { tier:"SSS+", name:"McLoren F1 Légendâre", baseValue:2000000,repairTime:11700}, // McLaren F1
  { tier:"SSS+", name:"Pagânì Zondà R Ultime",baseValue:1800000,repairTime:11050}, // Pagani Zonda R
  { tier:"SSS+", name:"Bugatti Divo Divinité",baseValue:1600000,repairTime:10400}, // Bugatti Divo
  { tier:"SSS+", name:"Lambo Sîan Mythique",  baseValue:1400000,repairTime:9425}, // Lamborghini Sian
  { tier:"SSS+", name:"Merko AMG ONE F1Street",baseValue:1350000,repairTime:9230}, // Mercedes AMG One
  { tier:"SSS+", name:"Ferrero Monza SP1 Dieu",baseValue:1700000,repairTime:10725}, // Ferrari Monza SP1
  { tier:"SSS+", name:"Gordon Murray T50 GraalO",baseValue:2200000,repairTime:12350}, // Gordon Murray T50
  { tier:"SSS+", name:"Koenigsmeg CC850 Absolu",baseValue:1900000,repairTime:11375}, // Koenigsegg CC850
  { tier:"SSS+", name:"Rollz Royce Boat-Tail Oups",baseValue:2500000,repairTime:13000}, // Rolls Boat Tail

  // ── TIER F — Nouvelles épaves ──────────────────────────────────────
  { tier:"F", name:"Talbot Horizonne Fantôme",  baseValue:65,  repairTime:8  }, // Talbot Horizon
  { tier:"F", name:"Simca 1100 Rouillarde",     baseValue:68,  repairTime:8  }, // Simca 1100
  { tier:"F", name:"Renno 5 Supercinq",         baseValue:78,  repairTime:10  }, // Renault 5
  { tier:"F", name:"Renno 11 Onzième",          baseValue:74,  repairTime:10  }, // Renault 11
  { tier:"F", name:"Pijot 104 ZS Zézette",      baseValue:82,  repairTime:10  }, // Peugeot 104 ZS
  { tier:"F", name:"Citron 2CV Deudeuche",      baseValue:90,  repairTime:12  }, // Citroën 2CV
  { tier:"F", name:"Citron GSA Grenouillard",   baseValue:72,  repairTime:10  }, // Citroën GSA
  { tier:"F", name:"Fjord Sierrap Bêlante",     baseValue:86,  repairTime:10  }, // Ford Sierra
  { tier:"F", name:"Fiato Pândola Pendouille",  baseValue:79,  repairTime:10  }, // Fiat Pandina
  { tier:"F", name:"Mazda 323 Trozième",        baseValue:83,  repairTime:10  }, // Mazda 323
  { tier:"F", name:"Opal Monzah Ronflette",     baseValue:91,  repairTime:12  }, // Opel Monza
  { tier:"F", name:"Hinda Lôgique CX",          baseValue:97,  repairTime:12  }, // Honda Logic
  { tier:"F", name:"Mitsubish Celérité",        baseValue:93,  repairTime:12  }, // Mitsubishi Celerio
  { tier:"F", name:"Daiwo Matiz Mignonouille",  baseValue:66,  repairTime:8  }, // Daewoo Matiz
  { tier:"F", name:"Lada Samarô Stoïk",         baseValue:62,  repairTime:8  }, // Lada Samara

  // ── TIER E — Nouvelles citadines ──────────────────────────────────
  { tier:"E", name:"Renno Twîngoo 2 Ronchon",  baseValue:310, repairTime:45 }, // Renault Twingo 2
  { tier:"E", name:"Pijot 208 Deux-zérouit",   baseValue:320, repairTime:45 }, // Peugeot 208
  { tier:"E", name:"Citron C1 Bichette",        baseValue:195, repairTime:30 }, // Citroën C1
  { tier:"E", name:"Toyo Âïgo Nanard",          baseValue:200, repairTime:32 }, // Toyota Aygo
  { tier:"E", name:"Pijot 107 CentSept",        baseValue:198, repairTime:30 }, // Peugeot 107
  { tier:"E", name:"Volkz Loupine",             baseValue:330, repairTime:48 }, // VW Lupo
  { tier:"E", name:"Seet Ârmosa Joliette",      baseValue:225, repairTime:35 }, // Seat Arosa
  { tier:"E", name:"Renno Zoé Électricouille",  baseValue:355, repairTime:50 }, // Renault Zoe
  { tier:"E", name:"Hyundra Accent Zézayeur",   baseValue:240, repairTime:38 }, // Hyundai Accent
  { tier:"E", name:"Kia Soulmate",              baseValue:275, repairTime:40 }, // Kia Soul
  { tier:"E", name:"Nissin Notche Cubique",     baseValue:260, repairTime:40 }, // Nissan Note
  { tier:"E", name:"Hinda Jazza Jazzy",         baseValue:295, repairTime:42 }, // Honda Jazz
  { tier:"E", name:"Mazda Deuxième Deuz",       baseValue:270, repairTime:40 }, // Mazda 2
  { tier:"E", name:"Chevro Avéo Pépiette",      baseValue:215, repairTime:32 }, // Chevrolet Aveo
  { tier:"E", name:"Fiato Grânde Pounto",       baseValue:305, repairTime:45 }, // Fiat Grande Punto

  // ── TIER D — Nouvelles compactes ──────────────────────────────────
  { tier:"D", name:"Renno Flûence Sifflette",   baseValue:525, repairTime:81 }, // Renault Fluence
  { tier:"D", name:"Pijot 308 Troiscenthuit",   baseValue:575, repairTime:87 }, // Peugeot 308
  { tier:"D", name:"Citron C4 Quatrième",       baseValue:555, repairTime:84 }, // Citroën C4
  { tier:"D", name:"Fjord Foucos C-Max Boxon",  baseValue:540, repairTime:81 }, // Ford C-Max
  { tier:"D", name:"Volkz Jêta Jétable",        baseValue:590, repairTime:87 }, // VW Jetta
  { tier:"D", name:"Skodda Octavia Octopusse",  baseValue:610, repairTime:90 }, // Skoda Octavia
  { tier:"D", name:"Toyo Austurès",             baseValue:635, repairTime:93 }, // Toyota Auris
  { tier:"D", name:"Hyundra i30 Trentième",     baseValue:545, repairTime:81 }, // Hyundai i30
  { tier:"D", name:"Kia Céed Cédille",          baseValue:530, repairTime:81 }, // Kia Ceed
  { tier:"D", name:"Nissou Première P12",       baseValue:515, repairTime:78 }, // Nissan Primera
  { tier:"D", name:"Hinda Civique Mk7",         baseValue:660, repairTime:96 }, // Honda Civic Mk7
  { tier:"D", name:"Odi A3 Sportbakc Ados",     baseValue:695, repairTime:99 }, // Audi A3 Sportback
  { tier:"D", name:"Merko Classa B Deub",       baseValue:650, repairTime:93 }, // Mercedes Classe B
  { tier:"D", name:"Volkz Tigrouan",            baseValue:780, repairTime:111 }, // VW Tiguan
  { tier:"D", name:"Renno Kôléos Colosse",      baseValue:740, repairTime:105 }, // Renault Koleos

  // ── TIER C — Nouvelles berlines sportives ─────────────────────────
  { tier:"C", name:"Renno Clioz RS Mk3 Saucette",baseValue:2300,repairTime:242}, // Renault Clio RS
  { tier:"C", name:"Hinda Civique Type-R FK8",  baseValue:2900, repairTime:262 }, // Honda Civic Type-R
  { tier:"C", name:"Volkz Golph R Mk6",         baseValue:2100, repairTime:228 }, // VW Golf R
  { tier:"C", name:"Odi S3 Sportbaguette",      baseValue:2400, repairTime:245 }, // Audi S3
  { tier:"C", name:"Merko A45 AMG Agité",       baseValue:2700, repairTime:256 }, // Mercedes A45 AMG
  { tier:"C", name:"BimV M135i Ventilateur",    baseValue:2200, repairTime:234 }, // BMW M135i
  { tier:"C", name:"Seet Léonne Cupra 290",     baseValue:2000, repairTime:220 }, // Seat Leon Cupra 290
  { tier:"C", name:"Volkz Sîroco Tourbillon",   baseValue:1850, repairTime:214 }, // VW Scirocco
  { tier:"C", name:"Pijot 308 GTi Gustatif",    baseValue:2500, repairTime:248 }, // Peugeot 308 GTi
  { tier:"C", name:"Renno Mégânon 4 RS Trophée",baseValue:2800, repairTime:259}, // Renault Megane 4 RS
  { tier:"C", name:"Alfa Roméa Giuliettah",     baseValue:1750, repairTime:206 }, // Alfa Romeo Giulietta
  { tier:"C", name:"Toyo GT86 Katanouille",     baseValue:2350, repairTime:242 }, // Toyota GT86
  { tier:"C", name:"Subaro BRZ Brisouille",     baseValue:2300, repairTime:238 }, // Subaru BRZ
  { tier:"C", name:"Mazda MX-5 RF Toit Fou",    baseValue:2600, repairTime:252 }, // Mazda MX-5 RF

  // ── TIER B — Nouvelles sportives ──────────────────────────────────
  { tier:"B", name:"Odi TT RS Toutaticouille",  baseValue:5400, repairTime:396 }, // Audi TT RS
  { tier:"B", name:"Merko C63 AMG Bagarreur",   baseValue:6200, repairTime:420}, // Mercedes C63 AMG
  { tier:"B", name:"BimV M4 F82 Déchaîné",      baseValue:5800, repairTime:408}, // BMW M4
  { tier:"B", name:"Porsha Cây S Turbote",      baseValue:5500, repairTime:400}, // Porsche Cayman S
  { tier:"B", name:"Alfa Roméa 4C Carbonifère", baseValue:4800, repairTime:380 }, // Alfa Romeo 4C
  { tier:"B", name:"Fjord Mustângu GT350R",     baseValue:5200, repairTime:392 }, // Ford Mustang GT350R
  { tier:"B", name:"Chevro Camâro SS Boucan",   baseValue:4600, repairTime:372 }, // Chevrolet Camaro SS
  { tier:"B", name:"Odi RS3 Sportbatailleur",   baseValue:5600, repairTime:404}, // Audi RS3
  { tier:"B", name:"BimV M2 F87 Rascal",        baseValue:4900, repairTime:384 }, // BMW M2
  { tier:"B", name:"Merko CLA 45 AMG Turbine",  baseValue:4400, repairTime:368 }, // Mercedes CLA 45
  { tier:"B", name:"Renno Mégânon RS Trophy",   baseValue:4200, repairTime:364 }, // Renault Megane RS Trophy
  { tier:"B", name:"Hinda NSX Mk1 Niponaise",   baseValue:6500, repairTime:428}, // Honda NSX Mk1
  { tier:"B", name:"Toyo Souprà Mk5 Reborn",    baseValue:6000, repairTime:416}, // Toyota Supra Mk5
  { tier:"B", name:"Subaro WRX STI Spec C",     baseValue:4300, repairTime:364 }, // Subaru WRX STI

  // ── TIER A — Nouveau luxe & GT ─────────────────────────────────────
  { tier:"A", name:"Odi RS7 Sportbahut",        baseValue:17800,repairTime:760}, // Audi RS7
  { tier:"A", name:"BimV M8 Coupé Costaud",     baseValue:19000,repairTime:778}, // BMW M8
  { tier:"A", name:"Merko E63 AMG Sergent",     baseValue:16000,repairTime:738}, // Mercedes E63 AMG
  { tier:"A", name:"Porsha Taycan Voltique",    baseValue:15500,repairTime:729}, // Porsche Taycan
  { tier:"A", name:"Odi e-tron GT Ampère",      baseValue:14800,repairTime:720}, // Audi e-tron GT
  { tier:"A", name:"BimV M5 F90 Conducteur",   baseValue:18000,repairTime:765}, // BMW M5 F90
  { tier:"A", name:"Merko GT 63 AMG Rugit",    baseValue:19500,repairTime:783}, // Mercedes AMG GT 63
  { tier:"A", name:"Lambo Huracan Evo Fissa",  baseValue:18500,repairTime:770}, // Lamborghini Huracan Evo
  { tier:"A", name:"Ferrero Roma Romantique",  baseValue:17000,repairTime:752}, // Ferrari Roma
  { tier:"A", name:"Mézarâti Grécal Crêpe",   baseValue:12000,repairTime:670}, // Maserati Grecale
  { tier:"A", name:"Bentlaï Bentaïga Costaud", baseValue:19800,repairTime:788}, // Bentley Bentayga
  { tier:"A", name:"Rollz Ghost Spectral",     baseValue:19900,repairTime:788}, // Rolls Royce Ghost

  // ── TIER S — Nouvelles GT prestige ────────────────────────────────
  { tier:"S", name:"Ferrero F8 Tributaire",    baseValue:26000,repairTime:1025}, // Ferrari F8 Tributo
  { tier:"S", name:"Lambo Urus Pérformante",   baseValue:30000,repairTime:1075}, // Lamborghini Urus Perf
  { tier:"S", name:"McLoren Artoura Sculptée", baseValue:35000,repairTime:1135}, // McLaren Artura
  { tier:"S", name:"Porsha GT4 Piquant",       baseValue:28500,repairTime:1055}, // Porsche GT4
  { tier:"S", name:"Odi R8 V10 Plus Glouton",  baseValue:47000,repairTime:1300}, // Audi R8 V10 Plus
  { tier:"S", name:"BimV M8 Compé Rondouil",   baseValue:32000,repairTime:1105}, // BMW M8 Competition
  { tier:"S", name:"Merko SL63 AMG Cabriouge", baseValue:38500,repairTime:1185}, // Mercedes SL63 AMG
  { tier:"S", name:"Aston Marten DBX Boxer",   baseValue:27500,repairTime:1045}, // Aston Martin DBX
  { tier:"S", name:"Ferrero Portofino Caillou", baseValue:33000,repairTime:1110}, // Ferrari Portofino
  { tier:"S", name:"Mézarâti MC20 Tornade",    baseValue:44000,repairTime:1265}, // Maserati MC20
  { tier:"S", name:"Nissou GT-R Nismo Ninja",  baseValue:48000,repairTime:1315}, // Nissan GT-R Nismo

  // ── TIER SS — Nouvelles supercars ─────────────────────────────────
  { tier:"SS", name:"Ferrero SF90 Stradaoulette",baseValue:98000,repairTime:2090}, // Ferrari SF90
  { tier:"SS", name:"McLoren 765LT Soufflant",  baseValue:120000,repairTime:2299}, // McLaren 765LT
  { tier:"SS", name:"Lambo SVJ 63 Monstre",     baseValue:135000,repairTime:2392}, // Lamborghini SVJ 63
  { tier:"SS", name:"Porsha GT2 RS Perforate",  baseValue:125000,repairTime:2338}, // Porsche GT2 RS
  { tier:"SS", name:"Odi R8 GT Ultime Dorée",   baseValue:115000,repairTime:2244}, // Audi R8 GT
  { tier:"SS", name:"BimV M4 GT3 Piste Pure",   baseValue:105000,repairTime:2156}, // BMW M4 GT3
  { tier:"SS", name:"Merko AMG GT Black Série",  baseValue:145000,repairTime:2448}, // AMG GT Black Series
  { tier:"SS", name:"Ferrero 812 Superfelice",  baseValue:108000,repairTime:2178}, // Ferrari 812 Superfast
  { tier:"SS", name:"McLoren Elva Vent Capote",  baseValue:165000,repairTime:2541}, // McLaren Elva

  // ── TIER SSS — Nouveaux hypercars ─────────────────────────────────
  { tier:"SSS", name:"Rimac C_Deux Électrosaur",baseValue:430000,repairTime:4272}, // Rimac C_Two
  { tier:"SSS", name:"Koenigsmeg Gemêra Fameux", baseValue:495000,repairTime:4488}, // Koenigsegg Gemera
  { tier:"SSS", name:"McLoren Spèdtail Caudal",  baseValue:520000,repairTime:4548}, // McLaren Speedtail
  { tier:"SSS", name:"Lambo Countach LPI Rétro", baseValue:475000,repairTime:4428}, // Lamborghini Countach LPI
  { tier:"SSS", name:"Aston Marten Valkyrie Dieu",baseValue:640000,repairTime:5022}, // Aston Valkyrie
  { tier:"SSS", name:"Ferrero Daytona SP3 Soleil",baseValue:720000,repairTime:5304}, // Ferrari Daytona SP3
  { tier:"SSS", name:"McLoren P1 GTR Pistouille",baseValue:610000,repairTime:4938}, // McLaren P1 GTR
  { tier:"SSS", name:"Porsha 959 Classicos",     baseValue:360000,repairTime:3960}, // Porsche 959

  // ── TIER SSS+ — Nouvelles légendes ────────────────────────────────
  { tier:"SSS+", name:"Ferrero FXX Evoluzounne",  baseValue:1100000,repairTime:8125}, // Ferrari FXX Evoluzione
  { tier:"SSS+", name:"Pagânì Utopîa Cieliste",   baseValue:2100000,repairTime:12025}, // Pagani Utopia
  { tier:"SSS+", name:"Koenigsmeg One:1 Absolu",  baseValue:2300000,repairTime:12675}, // Koenigsegg One:1
  { tier:"SSS+", name:"Lambo Égoïsta Solitaire",  baseValue:1800000,repairTime:11050}, // Lamborghini Egoista
  { tier:"SSS+", name:"Rimac Nêvera Apoc Record", baseValue:1300000,repairTime:8970}, // Rimac Nevera Record
  { tier:"SSS+", name:"Aston Marten Valkyrie AMR", baseValue:1950000,repairTime:11570}, // Aston Valkyrie AMR Pro
  { tier:"SSS+", name:"Bugatti Bolide Atomique",   baseValue:2800000,repairTime:13000}, // Bugatti Bolide
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

  // Tire une panne compatible avec le tier
  const failure = pickFailure(tier);

  return {
    id: crypto.randomUUID(),
    name: base.name,
    tier: base.tier,
    baseValue: value,
    repairTime: time,
    timeRemaining: time,
    failure: { id: failure.id, name: failure.name, category: failure.category, parts: [...failure.parts] },
    partsQuality: null,   // sera rempli lors de la réparation
    partsSupplier: null,  // marque utilisée (dernière pièce posée)
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
// btnSave supprimé du header

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
  let passive      = 0;
  let speedMult    = 1.0;
  let diagBonus    = 0;
  let diagMult     = 1.0; // multiplicateur final sur la récompense totale (diag_3)
  let saleBonus    = 0;
  let clickBonus   = 0;
  let showroomSlots= 0;
  let rareMult     = 1.0; // multiplicateur valeur voitures S+
  let repairAuto   = 0;
  let deliveryDisc = 0;
  let extraSlots   = 0;

  // ── Business ────────────────────────────────────────
  passive      += getTalentRank("passive_1")    * 5;
  passive      += getTalentRank("passive_2")    * 20;
  saleBonus    += getTalentRank("sale_1")       * 0.03;
  saleBonus    += getTalentRank("sale_2")       * 0.08;
  showroomSlots += getTalentRank("showroom_1");
  rareMult     *= (1 + getTalentRank("rare_bonus_1") * 0.03);

  // ── Atelier ─────────────────────────────────────────
  speedMult    *= (1 + getTalentRank("speed_1")       * 0.04);
  speedMult    *= (1 + getTalentRank("speed_2")       * 0.07);
  clickBonus   += getTalentRank("click_1")            * 0.10;
  repairAuto   += getTalentRank("multi_repair_1")     * 0.5;
  deliveryDisc  = Math.min(0.30, getTalentRank("parts_1") * 0.03); // -3%/rang, plafonné à -30%
  extraSlots   += Math.floor(getTalentRank("parts_2") / 5);

  // ── Diagnostic ──────────────────────────────────────
  diagBonus    += getTalentRank("diag_1") * 3;
  diagBonus    += getTalentRank("diag_2") * 8;
  diagMult     *= (1 + getTalentRank("diag_3") * 0.05); // +5%/rang sur la récompense totale

  return { passive, speedMult, diagBonus, diagMult, saleBonus, clickBonus,
           showroomSlots, rareMult, repairAuto, deliveryDisc, extraSlots };
}

function calcDealsPassive(){
  const rates = { loc_outils:2, contrat_taxi:5, assurance:10, atelier_nuit:20, franchise:50 };
  let total = 0;
  for(const [id, rate] of Object.entries(rates)){
    const u = getUpgrade(id);
    if(u) total += u.lvl * rate;
  }
  return total;
}

function applyTalentEffects(){
  const fx = computeTalentEffects();

  state.moneyPerSec         = fx.passive + calcDealsPassive() + (state.heritageBonuses?.passiveBonus ?? 0);
  state.talentSpeedMult     = fx.speedMult;
  state.talentDiagBonus     = fx.diagBonus;
  state.talentDiagMult      = fx.diagMult;
  state.talentSaleBonus     = fx.saleBonus;
  state.talentClickBonus    = fx.clickBonus;
  state.talentShowroomSlots = fx.showroomSlots;
  state.talentRareMult      = fx.rareMult;
  state.talentRepairAuto    = fx.repairAuto;
  state.talentDeliveryDisc  = fx.deliveryDisc;
  state.talentExtraSlots    = fx.extraSlots;
}

// =====================
// TALENT TREE
// =====================
const TALENTS = [

  // ══ BRANCHE BUSINESS ══════════════════════════════════════════
  { id:"passive_1", name:"Caisse Automatique", maxRank:20, category:"Business", icon:"💰",
    desc:"+5 €/s par rang — revenu passif de base",
    requires:[] },

  { id:"passive_2", name:"Contrats Mensuels", maxRank:20, category:"Business", icon:"📑",
    desc:"+20 €/s par rang",
    requires:[{id:"passive_1", rank:20}] },

  { id:"sale_1", name:"Négociateur Né", maxRank:20, category:"Business", icon:"🤝",
    desc:"+3% valeur de vente par rang",
    requires:[] },

  { id:"sale_2", name:"Réputation Locale", maxRank:20, category:"Business", icon:"🏆",
    desc:"+8% valeur de vente par rang",
    requires:[{id:"sale_1", rank:20}] },

  { id:"showroom_1", name:"Expansion Vitrine", maxRank:20, category:"Business", icon:"🏪",
    desc:"+1 emplacement showroom par rang — exposez plus de véhicules simultanément",
    requires:[{id:"sale_1", rank:20}] },

  { id:"rare_bonus_1", name:"Clientèle Haut de Gamme", maxRank:20, category:"Business", icon:"🏎️",
    desc:"+3% valeur de revente sur les voitures tier S et supérieur par rang",
    requires:[{id:"sale_1", rank:20}] },

  // ══ BRANCHE ATELIER ═══════════════════════════════════════════
  { id:"speed_1", name:"Routine Atelier", maxRank:20, category:"Atelier", icon:"⚡",
    desc:"+4% vitesse de réparation par rang (clic + auto)",
    requires:[] },

  { id:"speed_2", name:"Organisation Pro", maxRank:20, category:"Atelier", icon:"🔧",
    desc:"+7% vitesse de réparation par rang",
    requires:[{id:"speed_1", rank:20}] },

  { id:"click_1", name:"Main de Fer", maxRank:20, category:"Atelier", icon:"🖱️",
    desc:"+0.10s retirées par clic par rang",
    requires:[] },

  { id:"multi_repair_1", name:"Double Shift", maxRank:20, category:"Atelier", icon:"🔩",
    desc:"+0.5s/s de réparation automatique par rang",
    requires:[{id:"speed_1", rank:20}] },

  { id:"parts_1", name:"Gestion des Stocks", maxRank:10, category:"Atelier", icon:"📦",
    desc:"-3% délai livraison par rang (max rang 10 = -30%)",
    requires:[{id:"speed_1", rank:20}] },

  { id:"parts_2", name:"Fournisseur Fidèle", maxRank:20, category:"Atelier", icon:"🚛",
    desc:"+1 slot de livraison simultanée tous les 5 rangs (max +4)",
    requires:[{id:"parts_1", rank:10}] },

  // ══ BRANCHE DIAGNOSTIC ════════════════════════════════════════
  { id:"diag_1", name:"Œil de Lynx", maxRank:20, category:"Diagnostic", icon:"🔍",
    desc:"+3 € par analyse par rang",
    requires:[] },

  { id:"diag_2", name:"Scan Avancé", maxRank:20, category:"Diagnostic", icon:"🧠",
    desc:"+8 € par analyse par rang",
    requires:[{id:"diag_1", rank:20}] },

  { id:"diag_3", name:"Expert Certifié", maxRank:20, category:"Diagnostic", icon:"🎓",
    desc:"+5% multiplicateur sur la récompense totale de diagnostic par rang",
    requires:[{id:"diag_2", rank:20}] },

];



// =====================
// ARBRE HÉRITAGE (Prestige)
// =====================
const HERITAGE_PERKS = [

  // ══ BRANCHE MÉCANIQUE (rouge/orange) ══════════════════
  { id:"meca_speed_1",   branch:"Mécanique", icon:"⚡", name:"Cadence Atelier",
    desc:"+5% vitesse de réparation par rang (clic + auto)",
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
    desc:"+10% vitesse de réparation par rang",
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
    desc:"+2000€ à chaque nouveau prestige par rang",
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
    desc:"+10% REP gagné par vente par rang",
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
    desc:"+15% REP gagné par vente par rang",
    maxRank:3, costPerRank:3,
    requires:[{id:"rep_gain_1", rank:3}, {id:"rep_talent_1", rank:2}] },

  { id:"rep_talent_2",   branch:"Réputation", icon:"🎓", name:"École du Garage",
    desc:"+2 points talent bonus au départ par rang",
    maxRank:3, costPerRank:3,
    requires:[{id:"rep_talent_1", rank:3}] },

  { id:"rep_ultimate",   branch:"Réputation", icon:"🌟", name:"Légende Vivante",
    desc:"×1.75 REP gagné sur toutes les ventes (unique)",
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
  // Formule : 1 pt au seuil minimum (LVL50 + 50k REP), plus pour les runs poussées
  // garageLevel/50 + carsSold/5000 + rep/50000
  // Seuil minimum : floor(50/50) + floor(x/5000) + floor(50000/50000) = 1+0+1 = 2... on soustrait 1
  const base = Math.floor(state.garageLevel / 50)
             + Math.floor((state.carsSold ?? 0) / 5000)
             + Math.floor((state.rep ?? 0) / 50000)
             - 1; // soustrait 1 pour qu'au seuil strict on obtienne 1
  const mult = state.heritageBonuses?.prestigeGainMult ?? 1.0;
  return Math.max(1, Math.floor(base * mult));
}

// Applique les bonus héritage au state actif (appelé après achat d'un perk sans prestige)
function applyHeritageBonusesToState(){
  const b = state.heritageBonuses;
  if(!b) return;
  state.speedMult    = b.repSpeed;
  state.saleBonusPct = b.saleBonus;
  state.diagReward   = 1 + b.diagBonus;
  state.repairClick  = 0.5 + b.clickBonus;
  state.repairAuto   = b.autoBonus;
  recalcRepairAuto(); // ajoute l'apprenti/mécanicien par-dessus
}

function canPrestige(){
  return state.garageLevel >= 50 && state.rep >= 40000;
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
    clickBonus:       0,
    autoBonus:        0,
  };

  for(const p of HERITAGE_PERKS){
    const rank = getHeritagePerkRank(p.id);
    if(rank === 0) continue;

    // Mécanique
    if(p.id === "meca_speed_1")  b.repSpeed  *= Math.pow(1.05, rank);
    if(p.id === "meca_click_1")  b.clickBonus += rank * 0.3;   // +0.3s/clic/rang
    if(p.id === "meca_auto_1")   b.autoBonus  += rank * 0.5;   // +0.5s/s auto/rang
    if(p.id === "meca_speed_2")  b.repSpeed  *= Math.pow(1.10, rank);
    if(p.id === "meca_click_2")  b.clickBonus += rank * 0.8;   // +0.8s/clic/rang
    if(p.id === "meca_ultimate") b.repSpeed  *= 1.5;

    // Commerce
    if(p.id === "com_start_1")   b.startMoney     += rank * 2000;
    if(p.id === "com_sale_1")    b.saleBonus      += rank * 0.05;
    if(p.id === "com_passive_1") b.passiveBonus   += rank * 5;
    if(p.id === "com_diag_1")    b.diagBonus      += rank * 10;
    if(p.id === "com_sale_2")    b.saleBonus      += rank * 0.12;
    if(p.id === "com_ultimate")  b.passiveBonus   *= 2;

    // Réputation
    if(p.id === "rep_gain_1")    b.repGainMult    *= Math.pow(1.10, rank);  // était 1.15 → ×1.61 max au lieu de ×2.01
    if(p.id === "rep_talent_1")  b.talentBonus    += rank * 1;
    if(p.id === "rep_prestige_1")b.prestigeGainMult += rank * 0.10;
    if(p.id === "rep_gain_2")    b.repGainMult    *= Math.pow(1.15, rank);  // était 1.25 → ×1.52 max au lieu de ×1.95
    if(p.id === "rep_talent_2")  b.talentBonus    += rank * 2;
    if(p.id === "rep_ultimate")  b.repGainMult    *= 1.75;                  // était ×2 → ×1.75
  }

  state.heritageBonuses = b;
}

function doPrestige(){
  if(!canPrestige()) return;
  // L1 — ORDRE CRITIQUE — ne pas changer sans vérification :
  // 1. applyHeritageBonuses() EN PREMIER → calcHeritagePoints() s'appuie dessus
  // 2. Persist des valeurs AVANT Object.assign
  // 3. rebuildUpgradeMap() AVANT applyTalentEffects() → les talents lisent _upgradeMap
  // 4. applyTalentEffects() AVANT recalcRepairAuto()
  // 5. renderAll() EN DERNIER
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
  const persistTotalSales = state.totalCarsSold ?? 0;
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
    showroomCap:       3,
    money:             100 + b.startMoney,
    moneyPerSec:       b.passiveBonus,
    rep:               0,
    carsSold:          0,
    diagReward:        1 + b.diagBonus,
    repairClick:       0.5 + b.clickBonus,
    repairAuto:        b.autoBonus,
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
    totalCarsSold:     persistTotalSales,
    sessionStart:      persistSession,
    parts:             {},
    orders:            [],
    stockSettings:     state.stockSettings ?? {},
    stockGlobal:       state.stockGlobal ?? {},
    _hasSaved:         false,
    _wasBroke:         false,
    _lastRepairedTier: "",
  });

  applyGarageName();
  rebuildUpgradeMap();   // ← EN PREMIER : calcDealsPassive() dans applyTalentEffects lit _upgradeMap
  applyTalentEffects();  //   sans ça, moneyPerSec garde les valeurs de l'ancienne partie
  recalcRepairAuto();
  resetPendingAchievements();
  updateGarageLevel();
  updateTopbarProfile();
  renderAll();
  renderPrestigeNotif();
  // V2 — Confetti prestige
  if(typeof confetti !== "undefined"){
    setTimeout(() => confetti({
      particleCount: 150, spread: 90, origin: { y: 0.4 },
      colors: ["#ff8c40","#ffc83a","#ff4d70","#ffffff"]
    }), 200);
  }
  save();

  showPrestigePopup(pts, persistCount);
}

// Coût de base d'un upgrade (pour reset au prestige)
const UPGRADE_BASE_COSTS = {
  manual:94, toolbox:268, obd:337, impact:800, nego:1000, comp:3500,
  lift:5000, impact2:7500, diagpro:12000,
  stagiaire:15000, receptionnaire:120000, vendeur:25000, vendeur_confirme:200000,
  apprenti:12000, mecanicien:80000,
  loc_outils:6000, contrat_taxi:8000, assurance:20000, atelier_nuit:50000,
  franchise:150000, showroom_slot:35000,
  magasinier:40000, logiciel_stock:80000, slots_livraison:20000,
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

    const pct = t.maxRank > 0 ? (rank / t.maxRank * 100).toFixed(1) : 0;
    const barColor = maxed ? "#31d6ff" : rank > 0 ? "#a78bfa" : "rgba(255,255,255,.1)";
    const progressBar = `
      <div class="talentCard__rankRow">
        <div class="talentCard__progressTrack">
          <div class="talentCard__progressFill" style="width:${pct}%;background:${barColor}"></div>
        </div>
        <div class="talentCard__rankLabel">${rank} / ${t.maxRank}</div>
      </div>`;

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
      ${progressBar}
      <button class="${btnClass}" data-talent-buy="${t.id}" ${canBuy ? "" : "disabled"}>
        ${btnLabel}
      </button>
    `;
    talentListEl.appendChild(card);
  }
}

talentListEl.addEventListener("pointerdown", (e) => {
  const btn = e.target.closest("[data-talent-buy]");
  if(!btn) return;
  e.preventDefault();

  const id = btn.getAttribute("data-talent-buy");
  const t = TALENTS.find(x => x.id === id);
  if(!t) return;

  if(!hasRequirements(t)) return;

  const rank = getTalentRank(id);
  if(rank >= t.maxRank) return;
  if(state.talentPoints <= 0) return;

  state.talentPoints -= 1;
  state.talents[id] = rank + 1;

  // Animation sur la carte talent
  const card = btn.closest(".talentCard");
  if(card){
    card.classList.remove("talentCard--justunlocked");
    void card.offsetWidth;
    card.classList.add("talentCard--justunlocked");
    setTimeout(() => card.classList.remove("talentCard--justunlocked"), 600);
  }

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
  state.talentSpeedMult     = 1;
  state.talentDiagBonus     = 0;
  state.talentDiagMult      = 1;
  state.talentSaleBonus     = 0;
  state.talentClickBonus    = 0;
  state.talentShowroomSlots = 0;
  state.talentRareMult      = 1;
  state.talentQueueMult     = 1; // conservé pour compatibilité saves
  state.talentRepairAuto    = 0;
  state.talentDeliveryDisc  = 0;
  state.talentExtraSlots    = 0;

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
if(!state.totalCarsSold)     state.totalCarsSold     = 0;
if(!state.sessionStart)      state.sessionStart      = Date.now();

function renderStatsUI(){
  if(!statsGridEl) return;

  const upTotalLvl    = state.upgrades.reduce((a,u)=>a+u.lvl, 0);
  const talentTotal   = Object.values(state.talents).reduce((a,v)=>a+v, 0);
  const dealsPassive  = calcDealsPassive();
  const talentPassive = (getTalentRank("passive_1")*5) + (getTalentRank("passive_2")*20);
  const mult          = (state.speedMult??1) * (state.talentSpeedMult??1);
  const clickAmt      = ((state.repairClick??0) + (state.talentClickBonus??0)) * mult;
  const autoAmt       = ((state.repairAuto??0) + (state.talentRepairAuto??0)) * mult;
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
      <div class="statRow"><span class="statRow__label">Argent total gagné</span><span class="statRow__val statRow__val--green">${formatMoney(state.totalMoneyEarned ?? 0)}</span></div>
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
      <div class="statRow"><span class="statRow__label">Ventes totales (tous prestiges)</span><span class="statRow__val statRow__val--cyan">${(state.totalCarsSold??0).toLocaleString("fr-FR")}</span></div>
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

    <div class="statSection statSection--progress">
      <div class="statSection__title"><span class="statSection__titleIcon">⭐</span>Progression</div>
      <div class="statRow"><span class="statRow__label">Niveau Garage</span><span class="statRow__val statRow__val--purple">${state.garageLevel}</span></div>
      <div class="statRow"><span class="statRow__label">Talents dépensés</span><span class="statRow__val statRow__val--purple">${talentTotal} pts</span></div>
      <div class="statRow"><span class="statRow__label">Points talent restants</span><span class="statRow__val statRow__val--purple">${state.talentPoints}</span></div>
    </div>

    <div class="statSection statSection--activity">
      <div class="statSection__title"><span class="statSection__titleIcon">🎖️</span>Succès</div>
      <div class="statRow"><span class="statRow__label">Débloqués</span><span class="statRow__val statRow__val--green">${achUnlocked} / ${ACHIEVEMENTS.length}</span></div>
      <div class="statRow"><span class="statRow__label">Complétion</span><span class="statRow__val statRow__val--green">${Math.round(achUnlocked/ACHIEVEMENTS.length*100)}%</span></div>
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

// U1 — Formateur de temps global (utilisé dans renderActive, renderQueue, etc.)
function formatTime(s){
  if(s === null || s === undefined || !isFinite(s)) return "—";
  s = Math.max(0, Math.round(s));
  if(s >= 3600) return `${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m ${s%60}s`;
  if(s >= 60)   return `${Math.floor(s/60)}m ${s%60}s`;
  return `${s}s`;
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
  // Money glow quand ça monte
  const prevMoney = moneyEl._lastMoney ?? 0;
  if(state.money > prevMoney + 1){
    const moneyBox = moneyEl.closest(".money");
    if(moneyBox){
      moneyBox.classList.remove("money--gain");
      void moneyBox.offsetWidth;
      moneyBox.classList.add("money--gain");
      setTimeout(() => moneyBox.classList.remove("money--gain"), 560);
    }
  }
  moneyEl._lastMoney = state.money;

  setIfChanged(moneyEl,       formatMoney(state.money));
  setIfChanged(moneyPerSecEl, formatMoney(state.moneyPerSec) + "/s");
  setIfChanged(repEl,         state.rep);
  setIfChanged(garageLevelEl, state.garageLevel);
  setIfChanged(carsSoldEl,    state.carsSold);

  const diagTotal = Math.round((state.diagReward + (state.talentDiagBonus ?? 0)) * (state.talentDiagMult ?? 1));
  setIfChanged(diagRewardEl, diagTotal);

  const mult = (state.speedMult ?? 1) * (state.talentSpeedMult ?? 1);
  setIfChanged(repairAutoEl,  ((state.repairAuto + (state.talentRepairAuto ?? 0)) * mult).toFixed(2));
  const clickEff = ((state.repairClick + (state.talentClickBonus ?? 0)) * mult).toFixed(2);
  setIfChanged(repairClickEl, clickEff);
  // G1 — Mettre à jour le sous-texte du bouton réparer avec la puissance effective
  const repBtnSub = document.getElementById("repairClickEff");
  if(repBtnSub) setIfChanged(repBtnSub, clickEff + "s / clic");

  // Point de notification talents
  const dot = document.getElementById("talentNotifDot");
  if(dot) dot.style.display = state.talentPoints > 0 ? "block" : "none";

  // U2 — Badge alerte stock mis à jour à chaque frame (pas seulement renderAll)
  const stockTab = document.querySelector(".tab[data-tab='stock']");
  if(stockTab){
    let sdot = stockTab.querySelector(".stockAlertDot");
    if(!sdot){ sdot = document.createElement("span"); sdot.className = "stockAlertDot"; stockTab.appendChild(sdot); }
    sdot.style.display = hasStockAlert() ? "inline-block" : "none";
  }
}

function renderQueue(){
  // Occupés = voiture en atelier + voitures en file
  const occupied = (state.active ? 1 : 0) + state.queue.length;
  queueCountEl.textContent = occupied;
  garageCapEl.textContent  = state.garageCap;

  if(!garageSlotsEl) return;
  garageSlotsEl.innerHTML = "";

  // Calcul du badge worker pour le slot actif
  const apprentiLvl   = getUpgrade("apprenti")?.lvl   || 0;
  const mecanicienLvl = getUpgrade("mecanicien")?.lvl || 0;
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
        const fail = car.failure ? FAILURE_CATEGORIES[car.failure.category] : null;
        const partsMult = getPartsSpeedMult(car);
        const hasMissingParts = car.failure?.parts?.length && !checkPartsAvailability(car.failure.parts).ok;
        const barColor = hasMissingParts ? "#ff8c40" : "";
        slot.className = "garageSlot garageSlot--active";
        // V3 — Bordure gauche colorée selon le tier de la voiture
        slot.style.setProperty("--tier-color", t.color);
        // V1 — Animation d'entrée : classe --entering retirée après 400ms
        if(_activeJustStarted){
          _activeJustStarted = false;
          slot.classList.add("garageSlot--entering");
          requestAnimationFrame(() => requestAnimationFrame(() => slot.classList.remove("garageSlot--entering")));
          setTimeout(() => slot.classList.remove("garageSlot--entering"), 450);
        }
        slot.innerHTML = `
          <div class="garageSlot__num">🔧</div>
          <div class="garageSlot__body">
            <div class="garageSlot__row">
              <div style="display:flex;align-items:center;gap:7px;min-width:0;flex-wrap:wrap">
                <span class="tierBadge" style="background:${t.bg};border-color:${t.border};color:${t.color}">${t.label}</span>
                ${fail ? `<span class="failBadge" style="color:${fail.color}">${fail.icon} ${car.failure.name}</span>` : ""}
                <div class="garageSlot__name">${car.name}</div>
              </div>
              <span class="garageSlot__status garageSlot__status--active">${hasMissingParts ? "⚠️ PIÈCE MANQUANTE" : "EN RÉPARATION"}</span>
            </div>
            <div class="garageSlot__bar">
              <div class="garageSlot__barFill" style="width:${pct.toFixed(1)}%;${barColor?"background:"+barColor:""}"></div>
            </div>
            <div class="garageSlot__row">
              <div class="garageSlot__meta">
                <span>💰 ${formatMoney(calcSaleValue(car))}</span>
                <span style="color:${hasMissingParts?'#ff8c40':'var(--muted2)'}">⏱️ ${(()=>{const s=Math.round(car.timeRemaining??car.repairTime); return s>=60?`${Math.floor(s/60)}m${s%60>0?s%60+'s':''}`:s+'s';})()}</span>
                <span style="color:#666">${pct.toFixed(0)}%</span>
              </div>
              ${hasWorker ? `<span class="garageSlot__status garageSlot__status--worker">${workerLabel}</span>` : ""}
            </div>
          </div>
        `;
      } else {
        slot.className = "garageSlot garageSlot--empty";
        slot.innerHTML = `
          <div class="garageSlot__num">🔧</div>
          <div class="garageSlot__body">
            <div class="garageSlot__label">Emplacement libre</div>
          </div>
        `;
      }
    } else {
      const car = state.queue[i - 1];
      if(car){
        const t = TIERS[car.tier] || TIERS["F"];
        const fail = car.failure ? FAILURE_CATEGORIES[car.failure.category] : null;
        const { ok } = checkPartsAvailability(car.failure?.parts ?? []);
        const saleVal  = calcSaleValue(car);
        const estSecs  = calcEstimatedRepairTime(car);
        const repStr   = estSecs === null ? "—"
          : estSecs >= 3600 ? `${Math.floor(estSecs/3600)}h${Math.floor((estSecs%3600)/60)}m`
          : estSecs >= 60   ? `${Math.floor(estSecs/60)}m${estSecs%60 > 0 ? (estSecs%60)+"s" : ""}`
          : `${estSecs}s`;
        slot.className = "garageSlot garageSlot--occupied";
        slot.innerHTML = `
          <div class="garageSlot__num">${i + 1}</div>
          <div class="garageSlot__body">
            <div class="garageSlot__row">
              <div style="display:flex;align-items:center;gap:7px;min-width:0;flex-wrap:wrap">
                <span class="tierBadge" style="background:${t.bg};border-color:${t.border};color:${t.color}">${t.label}</span>
                ${fail ? `<span class="failBadge" style="color:${fail.color}">${fail.icon} ${car.failure.name}</span>` : ""}
                <div class="garageSlot__name">${car.name}</div>
              </div>
              <span class="garageSlot__status ${ok?"garageSlot__status--wait":"garageSlot__status--warn"}">${ok?"EN ATTENTE":"⚠️ PIÈCE MANQUANTE"}</span>
            </div>
            <div class="garageSlot__bar garageSlot__bar--wait">
              <div class="garageSlot__barFill garageSlot__barFill--wait" style="width:100%"></div>
            </div>
            <div class="garageSlot__meta">
              <span>💰 ${formatMoney(saleVal)}</span>
              <span>⏱️ ${repStr}</span>
            </div>
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
  // Rafraîchir les refs de renderActive après rebuild DOM
  _activeBarFill = garageSlotsEl.querySelector(".garageSlot--active .garageSlot__barFill");
  _activeMetaEl  = garageSlotsEl.querySelector(".garageSlot--active .garageSlot__meta");
}

function renderActive(){
  const car = state.active;

  if(!car){
    activeCarTitleEl.textContent = "Atelier vide";
    activeCarValueEl.textContent = "—";
    activeCarTimeEl.textContent = "—";
    activeCarTierEl.textContent = "—";
    repairBarEl.style.width = "0%";
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
  // Pulse quand > 85% terminé
  repairBarEl.classList.toggle("garageSlot__barFill--almostDone", pct >= 0.85);

  // Mettre à jour la mini barre dans le slot actif de la grille (refs cachées)
  if(!_activeBarFill) _activeBarFill = garageSlotsEl?.querySelector(".garageSlot--active .garageSlot__barFill");
  if(!_activeMetaEl)  _activeMetaEl  = garageSlotsEl?.querySelector(".garageSlot--active .garageSlot__meta");
  if(_activeBarFill){
    _activeBarFill.style.width = `${(pct * 100).toFixed(1)}%`;
    _activeBarFill.classList.toggle("garageSlot__barFill--almostDone", pct >= 0.85);
  }
  const t = TIERS[car.tier] || TIERS["F"];
  // U1 — Temps restant formaté lisiblement (ex: 1h 23m 45s)
  const timeLeft = Math.max(0, car.timeRemaining ?? 0);
  if(_activeMetaEl) _activeMetaEl.textContent = `${t.desc} · ${formatMoney(car.baseValue)} · ⏱️ ${formatTime(timeLeft)} · ${(pct*100).toFixed(0)}%`;
}

function renderShowroom(){
  showroomListEl.innerHTML = "";
  const cap = getShowroomCap();
  const count = state.showroom.length;

  // G2 — Flash sur le titre showroom quand vente auto
  if(_autoSellFlash){
    _autoSellFlash = false;
    const showroomHead = document.querySelector(".col--right .panel__head");
    if(showroomHead){
      showroomHead.classList.remove("panel__head--sold");
      void showroomHead.offsetWidth;
      showroomHead.classList.add("panel__head--sold");
      setTimeout(() => showroomHead.classList.remove("panel__head--sold"), 800);
    }
  }
  const isFull = count >= cap;

  // Indicateur cap dans le titre showroom
  const capEl = document.getElementById("showroomCapDisplay");
  if(capEl) capEl.textContent = `${count} / ${cap}`;

  // Badge "PLEIN" si complet
  const fullBadgeEl = document.getElementById("showroomFullBadge");
  if(fullBadgeEl) fullBadgeEl.style.display = isFull ? "inline-block" : "none";

  if(count === 0){
    showroomEmptyEl.style.display = "grid";
    showroomListEl.style.display = "none";
    return;
  }

  showroomEmptyEl.style.display = "none";
  showroomListEl.style.display = "block";

  for(let i = 0; i < state.showroom.length; i++){
    const car = state.showroom[i];
    const saleValue = calcSaleValue(car);
    const t = TIERS[car.tier] || TIERS["F"];
    const fail = car.failure ? FAILURE_CATEGORIES[car.failure.category] : null;
    const qfx = car.partsQuality ? getQualityEffects(Math.round(car.partsQuality)) : null;
    const supp = car.partsSupplier ? SUPPLIERS[car.partsSupplier] : null;
    const div = document.createElement("div");
    div.className = "sItem" + (i === 0 && _showroomJustAdded ? " sItem--new" : "");
    div.innerHTML = `
      <div style="min-width:0;flex:1">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="tierBadge" style="background:${t.bg};border-color:${t.border};color:${t.color}">${t.label}</span>
          ${fail ? `<span class="failBadge" style="color:${fail.color}">${fail.icon} ${fail.name}</span>` : ""}
          <div class="sItem__name">${car.name}</div>
        </div>
        <div class="sItem__meta" style="margin-top:4px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
          <span>${t.desc} — ${formatMoney(saleValue)}</span>
          ${qfx ? `<span style="color:${qfx.color};font-size:11px">⭐ ${qfx.label}${supp?` · <span style="color:${supp.color}">${supp.icon} ${supp.name}</span>`:""}</span>` : ""}
        </div>
      </div>
      <button class="sell" data-sell="${car.id}">Vendre</button>
    `;
    showroomListEl.appendChild(div);
  }
  _showroomJustAdded = false;
}

function renderUpgrades(){
  // Ne pas recréer le DOM si l'utilisateur est en train d'éditer un champ dans le panel
  const focused = document.activeElement;
  if(focused && upgradeListEl?.contains(focused) && (focused.tagName === "INPUT" || focused.tagName === "SELECT" || focused.tagName === "TEXTAREA")){
    return;
  }

  upgradeListEl.innerHTML = "";
  const totalLvls = state.upgrades.reduce((a,u)=>a+u.lvl,0);
  upgradeLevelEl.textContent = totalLvls;

  // Onglet STOCK → UI dédiée
  if(state.activeTab === "stock"){
    renderStockUI();
    return;
  }

  const filteredUpgrades = state.upgrades.filter(u => u.tab === state.activeTab);

  // Prérequis des upgrades avec dépendances
  const UPGRADE_PREREQS = {
    "receptionnaire":  { id: "stagiaire",  lvl: 10 },
    "vendeur_confirme":{ id: "vendeur",    lvl: 10 },
  };

  for(const u of filteredUpgrades){
    const isMaxed = u.maxLvl !== undefined && u.lvl >= u.maxLvl;

    // Vérifier prérequis
    const prereq = UPGRADE_PREREQS[u.id];
    const prereqMet = !prereq || (state.upgrades.find(x => x.id === prereq.id)?.lvl ?? 0) >= prereq.lvl;
    const prereqUpgrade = prereq ? state.upgrades.find(x => x.id === prereq.id) : null;

    const canBuy  = !isMaxed && prereqMet && state.money >= u.cost;

    const maxLvlHtml = u.maxLvl !== undefined
      ? `<div class="item__maxlvl">${isMaxed ? `✅ Niveau maximum atteint (${u.maxLvl})` : `Niveau max : ${u.maxLvl}`}</div>`
      : "";

    const prereqHtml = prereq && !prereqMet
      ? `<div class="item__prereq">🔒 Nécessite ${prereqUpgrade?.name ?? prereq.id} niv.${prereq.lvl} (actuellement niv.${prereqUpgrade?.lvl ?? 0})</div>`
      : "";

    const item = document.createElement("div");
    item.className = `item${prereq && !prereqMet ? " item--locked" : ""}`;
    item.innerHTML = `
      <div class="item__left">
        <div class="item__icon">${u.icon}</div>
        <div class="item__txt">
          <div class="item__name">${u.name} <span class="pill">niv. ${u.lvl}</span></div>
          <div class="item__desc">${u.desc}</div>
          ${!isMaxed ? `<div class="item__nextcost">→ Niv.${u.lvl+2} : ${formatMoney(Math.ceil(u.cost*1.25))}${state.money < Math.ceil(u.cost*1.25) && prereqMet ? ` <span class="item__nextcost--miss">(-${formatMoney(Math.ceil(u.cost*1.25) - state.money)})</span>` : ''}</div>` : ''}
          ${prereqHtml}
          ${maxLvlHtml}
        </div>
      </div>
      <div class="item__right">
        <button class="buy" ${canBuy ? "" : "disabled"} data-buy="${u.id}">
          ${isMaxed ? "Max" : prereq && !prereqMet ? "🔒" : formatMoney(u.cost)}
        </button>
      </div>
    `;
    upgradeListEl.appendChild(item);
  }
}

// =====================
// STOCK UI
// =====================
let _stockView = "stock"; // "stock" | "order" | "upgrades"
let _stockOrderPart = null; // partId en cours de commande

function renderStockUI(){
  const el = upgradeListEl;

  // Ne pas reconstruire si l'utilisateur édite un champ dans la vue courante
  const focused = document.activeElement;
  if(focused && el.contains(focused) && (focused.tagName === "INPUT" || focused.tagName === "SELECT" || focused.tagName === "TEXTAREA")){
    return;
  }

  el.innerHTML = "";

  // --- HEADER NAVIGATION ---
  const nav = document.createElement("div");
  nav.className = "stockNav";
  nav.innerHTML = `
    <button class="stockNav__btn ${_stockView==="stock"?"stockNav__btn--active":""}" data-sview="stock">📦 Stock</button>
    <button class="stockNav__btn ${_stockView==="order"?"stockNav__btn--active":""}" data-sview="order">🛒 Commander</button>
    <button class="stockNav__btn ${_stockView==="upgrades"?"stockNav__btn--active":""}" data-sview="upgrades">⬆️ Améliorations</button>
  `;
  nav.querySelectorAll("[data-sview]").forEach(btn => {
    btn.addEventListener("click", () => {
      _stockView = btn.dataset.sview;
      _stockOrderPart = null;
      renderUpgrades();
    });
  });
  el.appendChild(nav);

  if(_stockView === "stock")    renderStockView(el);
  if(_stockView === "order")    renderOrderView(el);
  if(_stockView === "upgrades") renderStockUpgradesView(el);
}

function renderStockView(el){
  const logLvl = getLogicielLvl();

  // Commandes en cours
  if(state.orders?.length){
    const sec = document.createElement("div");
    sec.className = "stockSection";
    sec.innerHTML = `<div class="stockSection__title">🚚 Livraisons en cours (${state.orders.length}/${getMaxOrders()})</div>`;
    for(const order of state.orders){
      const part = PARTS_CATALOG.find(p => p.id === order.partId);
      const supp = SUPPLIERS[order.supplierId];
      const left  = Math.max(0, Math.ceil(order.timeLeft));
      const mins  = Math.floor(left/60), secs = left%60;
      const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
      const row = document.createElement("div");
      row.className = "stockOrderRow";
      row.dataset.orderId = order.id ?? order.partId + "_" + order.supplierId;
      row.innerHTML = `
        <span class="stockOrderRow__supp" style="color:${supp?.color??'#aaa'}">${supp?.icon??''} ${supp?.name??order.supplierId}</span>
        <span class="stockOrderRow__part">${part?.icon??'📦'} ${part?.name??order.partId} ×${order.qty}</span>
        <span class="stockOrderRow__time">⏱ ${timeStr}</span>
      `;
      sec.appendChild(row);
    }
    el.appendChild(sec);
  }

  // Stock par catégorie
  const cats = Object.values(FAILURE_CATEGORIES);
  for(const cat of cats){
    const catParts = PARTS_CATALOG.filter(p => p.category === cat.id);
    const sec = document.createElement("div");
    sec.className = "stockSection";
    sec.innerHTML = `<div class="stockSection__title" style="color:${cat.color}">${cat.icon} ${cat.name}</div>`;

    for(const part of catParts){
      const unlocked = isPartUnlocked(part);
      const slot = state.parts?.[part.id];
      const qty  = slot?.qty ?? 0;
      const supp = slot?.supplier ? SUPPLIERS[slot.supplier] : null;
      const threshold = state.stockSettings?.[part.id]?.threshold ?? 1;
      const autoSupplier = state.stockSettings?.[part.id]?.autoSupplier ?? null;
      const isLow  = qty <= threshold && qty > 0;
      const isEmpty = qty === 0;

      const row = document.createElement("div");
      row.className = `stockRow ${!unlocked ? "stockRow--locked" : isEmpty ? "stockRow--empty" : isLow ? "stockRow--low" : ""}`;

      if(!unlocked){
        // Pièce verrouillée — afficher le tier requis
        const minTier = partTierMin(part);
        const tData = TIERS[minTier];
        row.innerHTML = `
          <span class="stockRow__icon" style="opacity:.4">${part.icon}</span>
          <span class="stockRow__name" style="opacity:.4">${part.name}</span>
          <span class="stockRow__tiers">${renderTierRange(part)}</span>
          <span class="stockRow__locked">🔒 <span style="color:${tData?.color}">${minTier}</span> requis</span>
        `;
      } else {
        // Pièce débloquée
        const autoIcon = autoSupplier && logLvl >= 3
          ? `<span class="stockRow__auto" title="Commande auto: ${SUPPLIERS[autoSupplier]?.name}">🤖 ${SUPPLIERS[autoSupplier]?.icon}</span>`
          : "";
        row.innerHTML = `
          <span class="stockRow__icon">${part.icon}</span>
          <span class="stockRow__name">${part.name}</span>
          <span class="stockRow__tiers">${renderTierRange(part)}</span>
          <span class="stockRow__supp">${supp ? `<span style="color:${supp.color}">${supp.icon} ${supp.name}</span>` : '<span style="color:#555">—</span>'}</span>
          ${autoIcon}
          <span class="stockRow__qty ${isEmpty?"stockRow__qty--zero":isLow?"stockRow__qty--low":""}">${isEmpty ? "RUPTURE" : `×${qty}`}</span>
          <button class="stockRow__btn" data-order="${part.id}">🛒</button>
        `;
        row.querySelector("[data-order]").addEventListener("click", () => {
          _stockView = "order";
          _stockOrderPart = part.id;
          renderUpgrades();
        });
      }
      sec.appendChild(row);
    }
    el.appendChild(sec);
  }
}

function renderOrderView(el){
  const parts = _stockOrderPart
    ? PARTS_CATALOG.filter(p => p.id === _stockOrderPart)
    : PARTS_CATALOG;

  // Filtre catégorie si pas de pièce spécifique
  if(!_stockOrderPart){
    const filterDiv = document.createElement("div");
    filterDiv.className = "stockCatFilters";
    filterDiv.innerHTML = `<span class="stockCatFilter stockCatFilter--active" data-cat="">Toutes</span>` +
      Object.values(FAILURE_CATEGORIES).map(c =>
        `<span class="stockCatFilter" data-cat="${c.id}" style="color:${c.color}">${c.icon} ${c.name}</span>`
      ).join("");
    filterDiv.querySelectorAll("[data-cat]").forEach(btn => {
      btn.addEventListener("click", () => {
        filterDiv.querySelectorAll("[data-cat]").forEach(b => b.classList.remove("stockCatFilter--active"));
        btn.classList.add("stockCatFilter--active");
        // re-render juste la liste
        const listEl = el.querySelector(".stockOrderList");
        if(listEl) renderOrderList(listEl, btn.dataset.cat || null);
      });
    });
    el.appendChild(filterDiv);
  } else {
    const backBtn = document.createElement("button");
    backBtn.className = "stockBackBtn";
    backBtn.textContent = "← Retour au stock";
    backBtn.addEventListener("click", () => { _stockView="stock"; _stockOrderPart=null; renderUpgrades(); });
    el.appendChild(backBtn);
  }

  const listEl = document.createElement("div");
  listEl.className = "stockOrderList";
  el.appendChild(listEl);
  renderOrderList(listEl, null);
}

function renderOrderList(listEl, catFilter){
  listEl.innerHTML = "";
  const logLvl = getLogicielLvl();
  const parts = _stockOrderPart
    ? PARTS_CATALOG.filter(p => p.id === _stockOrderPart)
    : catFilter
      ? PARTS_CATALOG.filter(p => p.category === catFilter)
      : PARTS_CATALOG;

  for(const part of parts){
    const cat = FAILURE_CATEGORIES[part.category];
    const unlocked = isPartUnlocked(part);
    const minTier = partTierMin(part);
    const maxTier = partTierMax(part);
    const tMin = TIERS[minTier], tMax = TIERS[maxTier];

    const sec = document.createElement("div");
    sec.className = `stockOrderPart ${!unlocked ? "stockOrderPart--locked" : ""}`;

    // État collapsed — persisté dans un Set global
    if(!window._stockExpanded) window._stockExpanded = new Set();
    const isCollapsed = !window._stockExpanded.has(part.id);

    // En-tête avec tiers
    const tierRangeHtml = minTier === maxTier
      ? `<span class="tierPill" style="color:${tMin?.color}">${minTier}</span>`
      : `<span class="tierPill" style="color:${tMin?.color}">${minTier}</span><span style="color:#555;font-size:10px">→</span><span class="tierPill" style="color:${tMax?.color}">${maxTier}</span>`;

    const stockQty = state.parts?.[part.id]?.qty ?? 0;
    const stockColor = stockQty === 0 ? "#ff4d70" : stockQty <= 2 ? "#ffd700" : "#48c78e";

    sec.innerHTML = `
      <div class="stockOrderPart__head">
        <span class="stockOrderPart__toggle">${isCollapsed ? "▶" : "▼"}</span>
        <span class="stockOrderPart__cat" style="color:${cat?.color}">${cat?.icon} ${cat?.name}</span>
        <span class="stockOrderPart__name">${part.icon} ${part.name}</span>
        <span class="stockOrderPart__tiers">${tierRangeHtml}</span>
        <span class="stockOrderPart__stock" style="color:${stockColor}">📦 <b>${stockQty}</b></span>
        ${!unlocked ? `<span class="stockOrderPart__lock">🔒 <span style="color:${tMin?.color}">${minTier}</span> requis</span>` : ""}
      </div>
      <div class="stockOrderPart__body ${isCollapsed ? "stockOrderPart__body--hidden" : ""}">
        <div class="stockOrderPart__suppliers"></div>
      </div>
    `;

    // Toggle click sur le header
    sec.querySelector(".stockOrderPart__head").addEventListener("click", () => {
      if(window._stockExpanded.has(part.id)){
        window._stockExpanded.delete(part.id);
      } else {
        window._stockExpanded.add(part.id);
      }
      renderUpgrades();
    });

    if(!unlocked){
      sec.style.opacity = "0.45";
      sec.style.pointerEvents = "none";
      listEl.appendChild(sec);
      continue;
    }

    // Panel settings logiciel stock niv 2+
    const bodyEl = sec.querySelector(".stockOrderPart__body");
    if(logLvl >= 2 && unlocked){
      const settings = state.stockSettings?.[part.id] ?? {};
      const threshold = settings.threshold ?? 1;
      const autoSupplier = settings.autoSupplier ?? "";
      const settingsDiv = document.createElement("div");
      settingsDiv.className = "stockSettingsRow";
      settingsDiv.innerHTML = `
        <span class="stockSettingsRow__label">📊 Seuil d'alerte :</span>
        <input class="stockSettingsRow__input" type="number" min="0" max="20" value="${threshold}" data-setting="threshold" data-pid="${part.id}">
        ${logLvl >= 3 ? `
        <span class="stockSettingsRow__label" style="margin-left:10px">🤖 Auto :</span>
        <select class="stockSettingsRow__select" data-setting="autoSupplier" data-pid="${part.id}">
          <option value="">— Désactivé</option>
          ${Object.values(SUPPLIERS).map(s => `<option value="${s.id}" ${autoSupplier===s.id?"selected":""}>${s.icon} ${s.name}</option>`).join("")}
        </select>` : ""}
      `;
      settingsDiv.querySelectorAll("[data-setting]").forEach(input => {
        input.addEventListener("change", () => {
          const pid = input.dataset.pid;
          if(!state.stockSettings) state.stockSettings = {};
          if(!state.stockSettings[pid]) state.stockSettings[pid] = {};
          const val = input.dataset.setting === "threshold" ? parseInt(input.value)||0 : input.value;
          state.stockSettings[pid][input.dataset.setting] = val;
          showToast(`⚙️ Paramètre mis à jour pour ${part.name}`);
        });
      });
      bodyEl.appendChild(settingsDiv);
    }

    // Fournisseurs
    const suppEl = bodyEl.querySelector(".stockOrderPart__suppliers");
    for(const [sid, supp] of Object.entries(SUPPLIERS)){
      const price = getPartPrice(part.id, sid);
      const effQ  = getEffectiveQuality(sid, part.id);
      const qfx   = getQualityEffects(effQ, sid);
      const delay = getDeliveryDelay(sid);
      const delayMins = Math.floor(delay/60);
      const delaySecs = delay % 60;
      const delayStr = delayMins >= 1 ? `${delayMins}m${delaySecs>0?' '+delaySecs+'s':''}` : `${delay}s`;
      const slotsFull = state.orders.length >= getMaxOrders();
      const canAfford = state.money >= price && !slotsFull;
      const canAfford5  = state.money >= price*5  && !slotsFull;
      const canAfford10 = state.money >= price*10 && !slotsFull;

      const specCats = supp.speciality ? (Array.isArray(supp.speciality) ? supp.speciality : [supp.speciality]) : [];
      const isSpecBonus = specCats.includes(part.category);

      // Bonus/malus concrets depuis costPct/valuePct
      const costPct  = Math.round((supp.costPct ?? 0) * 100);
      const valuePct = Math.round((supp.valuePct ?? 0) * 100);
      const netPct   = valuePct - costPct;
      const netColor = netPct > 0 ? "#48c78e" : netPct < 0 ? "#ff4d70" : "#666";

      const timeSign  = qfx.timeMult < 1 ? "−" : qfx.timeMult > 1 ? "+" : "";
      const timePct   = Math.round(Math.abs(qfx.timeMult - 1) * 100);
      const timeColor = qfx.timeMult < 1 ? "#48c78e" : qfx.timeMult > 1 ? "#ff4d70" : "#666";

      const bonusTags = [];
      if(costPct > 0)  bonusTags.push(`<span class="supplBonus" style="color:#ff9950">💸 Coût ${costPct}% valeur voiture</span>`);
      if(valuePct > 0) bonusTags.push(`<span class="supplBonus" style="color:#48c78e">💰 +${valuePct}% valeur revente</span>`);
      if(netPct !== 0) bonusTags.push(`<span class="supplBonus" style="color:${netColor}">📊 Net ${netPct > 0 ? "+" : ""}${netPct}%</span>`);
      if(timePct > 0)  bonusTags.push(`<span class="supplBonus" style="color:${timeColor}">⏱ ${timeSign}${timePct}% tps répa</span>`);
      if(isSpecBonus){
        const specColor = sid === "ngx" ? "#ff8c00" : "#48c78e";
        const specIcon  = sid === "ngx" ? "⚡" : "🔧";
        bonusTags.push(`<span class="supplBonus" style="color:${specColor}">${specIcon} Spécialiste +1 qualité</span>`);
      }
      if(supp.noMalus && effQ <= 2) bonusTags.push(`<span class="supplBonus" style="color:#ff7a50">⚡ Livraison 5s fixe · Sans malus qualité</span>`);

      // Badges contextuels (seulement les infos non-redondantes)
      const badges = [];
      if(timePct > 0) badges.push(`<span class="supplBadge" style="color:${timeColor}">⏱ ${timeSign}${timePct}% répa</span>`);
      if(isSpecBonus) badges.push(`<span class="supplBadge" style="color:${sid==="ngx"?"#ff8c00":"#4ec97b"}">${sid==="ngx"?"⚡":"🔧"} Spécialiste</span>`);
      if(supp.noMalus) badges.push(`<span class="supplBadge" style="color:#ff9950">⚡ 5s · sans malus</span>`);

      const row = document.createElement("div");
      row.className = `stockSupplRow ${canAfford?"":"stockSupplRow--broke"}`;
      row.innerHTML = `
        <div class="stockSupplRow__left">
          <span class="stockSupplRow__name" style="color:${supp.color}">${supp.icon} ${supp.name}</span>
          <span class="stockSupplRow__quality" style="color:${qfx.color}">⭐${effQ} ${qfx.label}</span>
          ${badges.length ? `<div class="stockSupplRow__badges">${badges.join("")}</div>` : ""}
        </div>
        <div class="stockSupplRow__mid">
          <span class="stockSupplRow__stat"><span style="color:#888">Coût</span> <b style="color:#ff9950">${costPct}%</b></span>
          <span class="stockSupplRow__stat"><span style="color:#888">Gain</span> <b style="color:#48c78e">${valuePct > 0 ? "+"+valuePct+"%" : "—"}</b></span>
          <span class="stockSupplRow__stat"><span style="color:#888">Net</span> <b style="color:${netColor}">${netPct > 0 ? "+"+netPct+"%" : netPct+"%"}</b></span>
          <span class="stockSupplRow__stat"><span style="color:#888">Délai</span> <b>🚚 ${delayStr}</b></span>
        </div>
        <div class="stockSupplRow__right">
          <span class="stockSupplRow__price" style="color:${canAfford?"#48c78e":"#ff4d70"}">${formatMoney(price)}</span>
          <div class="stockSupplRow__btns">
            <button class="stockSupplRow__buy" data-pid="${part.id}" data-sid="${sid}" data-qty="1"  ${canAfford   ?"":"disabled"}>×1</button>
            <button class="stockSupplRow__buy" data-pid="${part.id}" data-sid="${sid}" data-qty="5"  ${canAfford5  ?"":"disabled"}>×5</button>
            <button class="stockSupplRow__buy" data-pid="${part.id}" data-sid="${sid}" data-qty="10" ${canAfford10 ?"":"disabled"}>×10</button>
          </div>
        </div>
      `;
      row.querySelectorAll("[data-qty]").forEach(btn => {
        btn.addEventListener("click", () => {
          const ok = orderPart(btn.dataset.pid, btn.dataset.sid, parseInt(btn.dataset.qty));
          if(ok){ showToast(`🛒 Commande passée : ${part.name} ×${btn.dataset.qty}`); renderUpgrades(); }
        });
      });
      suppEl.appendChild(row);
    }
    listEl.appendChild(sec);
  }
}

function renderStockUpgradesView(el){
  const logLvl = getLogicielLvl();

  // Panel paramètres globaux (logiciel niv 3)
  if(logLvl >= 3){
    const g = state.stockGlobal ?? {};
    const panel = document.createElement("div");
    panel.className = "stockGlobalPanel";
    panel.innerHTML = `
      <div class="stockGlobalPanel__title">🤖 Commandes automatiques — Paramètres globaux</div>
      <div class="stockGlobalPanel__desc">Appliqués à toutes les pièces sauf override individuel</div>
      <div class="stockGlobalPanel__row">
        <label class="stockGlobalPanel__label">🏭 Fournisseur par défaut</label>
        <select class="stockGlobalPanel__select" id="globalSupplierSelect">
          <option value="">— Désactivé</option>
          ${Object.values(SUPPLIERS).map(s =>
            `<option value="${s.id}" ${g.autoSupplier===s.id?"selected":""}>${s.icon} ${s.name}</option>`
          ).join("")}
        </select>
      </div>
      <div class="stockGlobalPanel__row">
        <label class="stockGlobalPanel__label">📦 Seuil d'alerte par défaut</label>
        <input class="stockGlobalPanel__input" id="globalThresholdInput" type="number" min="0" max="20" value="${g.threshold ?? 1}">
        <span class="stockGlobalPanel__hint">Commande si stock ≤ seuil</span>
      </div>
      <div class="stockGlobalPanel__row">
        <label class="stockGlobalPanel__label">🛒 Quantité commandée</label>
        <input class="stockGlobalPanel__input" id="globalQtyInput" type="number" min="1" max="20" value="${g.qty ?? 1}">
        <span class="stockGlobalPanel__hint">Pièces commandées à chaque déclenchement</span>
      </div>
      <button class="stockGlobalPanel__save" id="saveGlobalBtn">💾 Enregistrer</button>
    `;
    panel.querySelector("#saveGlobalBtn").addEventListener("click", () => {
      if(!state.stockGlobal) state.stockGlobal = {};
      state.stockGlobal.autoSupplier = panel.querySelector("#globalSupplierSelect").value;
      state.stockGlobal.threshold    = parseInt(panel.querySelector("#globalThresholdInput").value) || 0;
      state.stockGlobal.qty          = Math.max(1, parseInt(panel.querySelector("#globalQtyInput").value) || 1);
      save();
      showToast("✅ Paramètres globaux sauvegardés");
    });
    el.appendChild(panel);
  }

  const stockUpgrades = state.upgrades.filter(u => u.tab === "stock");
  for(const u of stockUpgrades){
    const isMaxed = u.maxLvl !== undefined && u.lvl >= u.maxLvl;
    const canBuy  = !isMaxed && state.money >= u.cost;
    const maxLvlHtml = u.maxLvl !== undefined
      ? `<div class="item__maxlvl">${isMaxed ? `✅ Max (${u.maxLvl})` : `Max : ${u.maxLvl}`}</div>` : "";
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <div class="item__left">
        <div class="item__icon">${u.icon}</div>
        <div class="item__txt">
          <div class="item__name">${u.name} <span class="pill">niv. ${u.lvl}</span></div>
          <div class="item__desc">${u.desc}</div>
          ${!isMaxed ? `<div class="item__nextcost">→ Niv.${u.lvl+2} : ${formatMoney(Math.ceil(u.cost*1.25))}${state.money < Math.ceil(u.cost*1.25) && prereqMet ? ` <span class="item__nextcost--miss">(-${formatMoney(Math.ceil(u.cost*1.25) - state.money)})</span>` : ''}</div>` : ''}
          ${maxLvlHtml}
        </div>
      </div>
      <div class="item__right">
        <button class="buy" ${canBuy?"":"disabled"} data-buy="${u.id}">
          ${isMaxed ? "Max" : formatMoney(u.cost)}
        </button>
      </div>
    `;
    el.appendChild(item);
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
  // applyTalentEffects() est appelé UNIQUEMENT quand les talents changent (achat, prestige, load)
  // PAS ici — sinon c'est recalculé à chaque render
  // Sync visuel de l'onglet actif
  document.querySelectorAll(".tab").forEach(t => {
    t.classList.toggle("tab--active", t.getAttribute("data-tab") === state.activeTab);
  });
  renderTop();
  renderQueue();
  renderActive();
  renderShowroom();
  renderUpgrades();
  renderGarageProgress();
  renderTalentsUI();
  renderPrestigeNotif();
  // Badge alerte stock (logiciel stock niv 1+)
  const stockTab = document.querySelector(".tab[data-tab='stock']");
  if(stockTab){
    let dot = stockTab.querySelector(".stockAlertDot");
    if(!dot){ dot = document.createElement("span"); dot.className = "stockAlertDot"; stockTab.appendChild(dot); }
    dot.style.display = hasStockAlert() ? "inline-block" : "none";
  }
}

// =====================
// PRESTIGE UI
// =====================
let _heritageFilter = "Tous";

function renderPrestigeNotif(){
  const dot = document.getElementById("prestigeNotifDot");
  if(dot) dot.style.display = canPrestige() ? "block" : "none";
  // Pulse le bouton prestige quand disponible
  const btn = document.querySelector(".btn--prestige");
  if(btn) btn.classList.toggle("available", canPrestige());
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
    ${!can ? `<div class="prestige__missing">
      ${state.garageLevel < 50 ? `<div class="prestige__missing-line">🔒 Encore <b>${50 - state.garageLevel} niveau${50 - state.garageLevel > 1 ? 'x' : ''}</b> de garage manquant${50 - state.garageLevel > 1 ? 's' : ''}</div>` : ''}
      ${state.rep < 50000 ? `<div class="prestige__missing-line">🔒 Encore <b>${(50000 - state.rep).toLocaleString("fr-FR")} REP</b> manquants</div>` : ''}
    </div>` : ''}
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
      // Répercuter les bonus dans le state actif immédiatement
      applyHeritageBonusesToState();
      applyTalentEffects();
      renderPrestigeModal();
      renderAll();
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
  if(canPrestige()) doPrestige();
});

// =====================
// GAMEPLAY HELPERS
// =====================
function tryStartNextRepair(){
  if(state.active) return;
  const next = state.queue.shift();
  if(!next) return;
  state.active = next;
  _activeJustStarted = true; // V1 — animation d'entrée dans le slot actif
}

// Temps de réparation estimé en tenant compte de tous les multiplicateurs actifs
function calcEstimatedRepairTime(car){
  const partsMult  = getPartsSpeedMult(car);           // 0.5 si pièce manquante, sinon timeMult qualité
  const speedMult  = (state.speedMult ?? 1) * (state.talentSpeedMult ?? 1) * partsMult;
  const secPerSec  = (state.repairAuto + (state.talentRepairAuto ?? 0)) * speedMult;
  if(secPerSec <= 0) return null;                      // pas de réparation auto active
  return Math.round(car.repairTime / secPerSec);       // secondes réelles estimées
}

function calcSaleValue(car){
  const bonus = 1 + state.saleBonusPct + (state.talentSaleBonus ?? 0);
  const partsMult = getPartsValueMult(car);
  const rareTiers = ["S","SS","SSS","SSS+"];
  const rareMult  = rareTiers.includes(car.tier) ? (state.talentRareMult ?? 1) : 1;
  return Math.round(car.baseValue * bonus * partsMult * rareMult);
}

function finishRepair(){
  state._lastRepairedTier = state.active.tier;
  const cap = getShowroomCap();
  if(state.showroom.length >= cap){
    return;
  }

  // Consommer les pièces et enregistrer la qualité sur la voiture
  const car = state.active;
  if(car.failure?.parts?.length){
    const avgQuality = consumeParts(car.failure.parts, car);
    if(avgQuality !== null){
      car.partsQuality = avgQuality;
      // Récupère le fournisseur de la première pièce utilisée
      const firstPart = car.failure.parts[0];
      car.partsSupplier = state.parts?.[firstPart]?.supplier ?? null;
    } else {
      // Pièce manquante → qualité pénalisée
      car.partsQuality = 2.5;
      car.partsSupplier = null;
    }
  }

  state.showroom.unshift(car);
  _showroomJustAdded = true;
  state.active = null;
  state.totalRepairs = (state.totalRepairs ?? 0) + 1;
  tryStartNextRepair();
  // Ne pas renderAll pendant le catchup offline (sera fait une seule fois après)
  if(!_isOfflineCatchup) _needsFullRender = true;
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
// CLICK_COOLDOWN_MS est dans CONFIG.CLICK_COOLDOWN_MS
let _lastRepairClick  = 0;
let _lastAnalyzeClick = 0;

btnAnalyze.addEventListener("click", () => {
  const now = Date.now();
  if(now - _lastAnalyzeClick < CONFIG.CLICK_COOLDOWN_MS) return; // trop rapide = ignoré
  _lastAnalyzeClick = now;

  const occupied = (state.active ? 1 : 0) + state.queue.length;
  if (occupied >= state.garageCap) return;

  const diagGain = Math.round((state.diagReward + (state.talentDiagBonus ?? 0)) * (state.talentDiagMult ?? 1));
  if(isFinite(diagGain) && diagGain > 0) {
    state.money += diagGain;
    state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + diagGain;
    spawnFloatText("+" + formatMoney(diagGain), "diag", document.getElementById("btnAnalyze"));
  }
  state.totalAnalyses = (state.totalAnalyses ?? 0) + 1;
  state.queue.push(makeCar());
  tryStartNextRepair();
  _needsFullRender = true;
});

btnRepairClick.addEventListener("click", () => {
  const now = Date.now();
  if(now - _lastRepairClick < CONFIG.CLICK_COOLDOWN_MS) return;
  _lastRepairClick = now;

  const mult = (state.speedMult ?? 1) * (state.talentSpeedMult ?? 1);
  const clickAmt = (state.repairClick + (state.talentClickBonus ?? 0)) * mult;
  applyRepairTime(clickAmt);
  state.totalClickRepairs = (state.totalClickRepairs ?? 0) + 1;

  // Animation ripple + shake
  btnRepairClick.classList.remove("clicked");
  void btnRepairClick.offsetWidth; // reflow pour relancer
  btnRepairClick.classList.add("clicked");
  setTimeout(() => btnRepairClick.classList.remove("clicked"), 350);

  renderActive();
});

let _lastSellClick = 0;
showroomListEl.addEventListener("click", (e) => {
  const now = Date.now();
  if(now - _lastSellClick < CONFIG.CLICK_COOLDOWN_MS) return;
  _lastSellClick = now;

  const btn = e.target.closest("[data-sell]");
  if(!btn) return;

  // Capturer la position du bouton IMMÉDIATEMENT avant la vente
  // car le re-render supprime l'élément du DOM → getBoundingClientRect() retournerait {0,0}
  const btnRect = btn.getBoundingClientRect();
  const btnPos  = { x: btnRect.left + btnRect.width / 2, y: btnRect.top - 8 };

  const id = btn.getAttribute("data-sell");
  const idx = state.showroom.findIndex(c => c.id === id);
  if(idx === -1) return;

  const car = state.showroom[idx];
  const saleValue = calcSaleValue(car);
  if(isFinite(saleValue)) {
    state.money += saleValue;
    state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + saleValue;
    spawnFloatText("+" + formatMoney(saleValue), "money", btnPos);
  }
  const tierData = TIERS[car.tier] || TIERS["F"];
  const repMult = state.heritageBonuses?.repGainMult ?? 1.0;
  const repGain = Math.round(tierData.repGain * repMult);
  if(isFinite(repGain)) {
    state.rep += repGain;
    setTimeout(() => spawnFloatText("+" + repGain + " REP", "rep", btnPos), 120);
  }

  state.carsSold += 1;
  state.totalCarsSold = (state.totalCarsSold ?? 0) + 1;
  updateGarageLevel();

  state.showroom.splice(idx, 1);

  _needsFullRender = true;
});

const UPGRADE_MULT = {
  manual:1.25, toolbox:1.25, obd:1.25, impact:1.25, comp:1.25, impact2:1.25, diagpro:1.25,
  nego:1.25, lift:1.25,
  loc_outils:1.28, contrat_taxi:1.28, assurance:1.28, atelier_nuit:1.30, franchise:1.32,
  showroom_slot:1.30,
  stagiaire:1.35, receptionnaire:1.40, vendeur:1.35, vendeur_confirme:1.40,
  apprenti:1.30, mecanicien:1.35,
  magasinier:1.40, logiciel_stock:1.45, slots_livraison:1.35,
};

// L1 — Achat upgrade : après achat, rebuildUpgradeMap() est appelé AVANT applyTalentEffects()
// et AVANT recalcRepairAuto(). Ne pas inverser l'ordre.
upgradeListEl.addEventListener("pointerdown", (e) => {
  // pointerdown se déclenche dès le premier contact, avant que le tick
  // puisse recréer le DOM entre mousedown et mouseup (ce qui annulait le click)
  const btn = e.target.closest("[data-buy]");
  if(!btn) return;
  e.preventDefault(); // évite le double-déclenchement éventuel avec click

  const id = btn.getAttribute("data-buy");
  const u = getUpgrade(id);
  if(!u) return;
  if(state.money < u.cost) return;
  if(u.maxLvl !== undefined && u.lvl >= u.maxLvl) return;

  state.money -= u.cost;
  u.lvl += 1;

// EFFETS (version "temps", cohérente)
if(id === "manual")  state.diagReward += 1;
if(id === "obd")     state.diagReward += 5;

// ✅ clic = secondes retirées par clic (petits gains)
if(id === "toolbox") state.repairClick += 0.05;   // était 0.10 — +0.05/lvl
if(id === "impact")  state.repairClick += 0.08;   // était 0.15 — +0.08/lvl
if(id === "impact2") state.repairClick += 0.12;   // était 0.25 — +0.12/lvl

// ✅ vente / vitesse / capacité
if(id === "nego")    state.saleBonusPct += 0.05;
if(id === "comp")    state.speedMult *= 1.10;
if(id === "lift")    state.garageCap += 1;
if(id === "diagpro") state.diagReward += 20;
if(id === "showroom_slot") state.showroomCap = (state.showroomCap ?? 3) + 2;

// Équipe auto-repair : on recalcule repairAuto depuis les niveaux
if(id === "apprenti" || id === "mecanicien") recalcRepairAuto();

  // coût scale
  u.cost = Math.ceil(u.cost * (UPGRADE_MULT[id] ?? 1.25));

  rebuildUpgradeMap();
  applyTalentEffects();  // recalcule moneyPerSec (revenus passifs) immédiatement après achat

  // Sauvegarde immédiate après achat — évite le rollback si la page se ferme
  // avant le prochain autosave (60s). Le pending queue gère la concurrence.
  save();



  _needsFullRender = true;
});

// ─── recalcUpgradeEffects ─────────────────────────────────────────────────────
// Recalcule TOUS les effets dérivés des upgrades depuis leurs niveaux sauvegardés.
// Appelé après applySaveSnapshot() et après doPrestige().
// Règle : repart des valeurs de base héritage, puis rejoue chaque upgrade lvl fois.
function recalcUpgradeEffects(){
  const b = state.heritageBonuses ?? {};

  // Repartir des valeurs de base (héritage inclus)
  state.diagReward   = 1 + (b.diagBonus    ?? 0);
  state.repairClick  = 0.5 + (b.clickBonus ?? 0);
  state.speedMult    = b.repSpeed           ?? 1.0;
  state.saleBonusPct = b.saleBonus          ?? 0;
  state.garageCap    = 1;   // sera incrémenté par lift
  state.showroomCap  = 3;   // sera incrémenté par showroom_slot

  // Rejouer les effets de chaque upgrade selon son niveau actuel
  for(const u of state.upgrades){
    const lvl = u.lvl || 0;
    if(lvl === 0) continue;
    switch(u.id){
      case "manual":       state.diagReward   += 1    * lvl; break;
      case "obd":          state.diagReward   += 5    * lvl; break;
      case "diagpro":      state.diagReward   += 20   * lvl; break;
      case "toolbox":      state.repairClick  += 0.05 * lvl; break;
      case "impact":       state.repairClick  += 0.08 * lvl; break;
      case "impact2":      state.repairClick  += 0.12 * lvl; break;
      case "nego":         state.saleBonusPct += 0.05 * lvl; break;
      case "lift":         state.garageCap    += lvl;        break;
      case "showroom_slot":state.showroomCap  += 2    * lvl; break;
      case "comp":
        // speedMult est multiplicatif : (1.10)^lvl
        state.speedMult *= Math.pow(1.10, lvl);
        break;
    }
  }
  dbg("[recalcUpgradeEffects] diagReward:", state.diagReward,
      "repairClick:", state.repairClick, "speedMult:", state.speedMult,
      "garageCap:", state.garageCap, "showroomCap:", state.showroomCap);
}

function recalcRepairAuto(){
  const apprentiLvl   = getUpgrade("apprenti")?.lvl   || 0;
  const mecanicienLvl = getUpgrade("mecanicien")?.lvl || 0;
  const heritageAuto  = state.heritageBonuses?.autoBonus ?? 0;
  state.repairAuto = heritageAuto + (apprentiLvl * 0.15) + (mecanicienLvl * 0.5);
}

// =====================
// IDLE LOOP
// =====================
let _needsFullRender = false; // render complet planifié pour le prochain frame
let last = performance.now();
let autoAnalyzeTimer = 0;
let autoSellTimer = 0;

let achCheckTimer = 0;
let stockTimerAccu = 0;

// Cache O(1) pour les lookups upgrades fréquents — reconstruit après chaque achat/prestige
let _upgradeMap = {};
function rebuildUpgradeMap(){
  _upgradeMap = {};
  for(const u of state.upgrades) _upgradeMap[u.id] = u;
}
function getUpgrade(id){ return _upgradeMap[id] ?? state.upgrades.find(u => u.id === id); }

// Logique pure du tick — utilisable offline et dans le loop normal
function applyTickLogic(dt){
  const passiveGain = state.moneyPerSec * dt;
  if(isFinite(passiveGain)) {
    state.money += passiveGain;
    state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + passiveGain;
  }

  // Traitement des livraisons de pièces
  processOrders(dt);
  processAutoOrders(dt);

  if(state.active){
    const partsMult = getPartsSpeedMult(state.active);
    const mult = (state.speedMult ?? 1) * (state.talentSpeedMult ?? 1) * partsMult;
    const secPerSec = (state.repairAuto + (state.talentRepairAuto ?? 0)) * mult;
    applyRepairTime(secPerSec * dt);
  } else {
    tryStartNextRepair();
  }

  // --- LOGIQUE D'AUTOMATISATION (sans DOM) ---
  const stagiaireLvl      = getUpgrade("stagiaire")?.lvl      || 0;
  const receptionnaireLvl = getUpgrade("receptionnaire")?.lvl || 0;
  if(stagiaireLvl > 0){
    autoAnalyzeTimer += dt;
    let delay = Math.max(6, 12 - (stagiaireLvl * 0.6));
    if(receptionnaireLvl > 0) delay = Math.max(1, delay - (receptionnaireLvl * 0.5));
    while(autoAnalyzeTimer >= delay){
      autoAnalyzeTimer -= delay;
      const occupied = (state.active ? 1 : 0) + state.queue.length;
      const MAX_QUEUE = state.garageCap * 10; // max 10 voitures en attente par slot
      if(occupied < state.garageCap && state.queue.length < MAX_QUEUE){
        // Logique pure : pas de .click() DOM
        const diagGain = Math.round((state.diagReward + (state.talentDiagBonus ?? 0)) * (state.talentDiagMult ?? 1));
        if(isFinite(diagGain) && diagGain > 0){
          state.money += diagGain;
          state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + diagGain;
        }
        state.totalAnalyses = (state.totalAnalyses ?? 0) + 1;
        state.queue.push(makeCar());
        tryStartNextRepair();
        _needsFullRender = true;
      }
    }
  }

  const vendeurLvl         = getUpgrade("vendeur")?.lvl          || 0;
  const vendeurConfirmeLvl = getUpgrade("vendeur_confirme")?.lvl || 0;
  if(vendeurLvl > 0 && state.showroom.length > 0){
    autoSellTimer += dt;
    let delay = Math.max(8, 15 - (vendeurLvl * 0.7));
    if(vendeurConfirmeLvl > 0) delay = Math.max(1, delay - (vendeurConfirmeLvl * 0.7));
    while(autoSellTimer >= delay){
      autoSellTimer -= delay;
      if(state.showroom.length > 0){
        const car = state.showroom[state.showroom.length - 1];
        const saleValue = calcSaleValue(car);
        if(isFinite(saleValue)){
          state.money += saleValue;
          state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + saleValue;
        }
        const tierData = TIERS[car.tier] || TIERS["F"];
        const repMult = state.heritageBonuses?.repGainMult ?? 1.0;
        const repGain = Math.round(tierData.repGain * repMult);
        if(isFinite(repGain)) state.rep += repGain;
        state.carsSold += 1;
        state.totalCarsSold = (state.totalCarsSold ?? 0) + 1;
        state.showroom.pop();
        updateGarageLevel();
        _needsFullRender = true;
        _autoSellFlash = true; // G2 — signal flash showroom
      }
    }
  }

  // Vérification des succès (accumulé)
  achCheckTimer += dt;
  if(achCheckTimer >= CONFIG.ACH_CHECK_INTERVAL){
    achCheckTimer = 0;
    checkAchievements();
  }
}

function tick(now){
  const dt = Math.min((now - last) / 1000, 5);
  last = now;

  applyTickLogic(dt);

  if(_needsFullRender){
    _needsFullRender = false;
    renderAll(); // inclut renderTop + renderActive + renderQueue etc.
  }
  if(!_needsFullRender){
    // Pas de changement structurel : juste barre de réparation + argent/rep
    renderTop();
    renderActive();
  }

  // Actualise le stock toutes les secondes si l'onglet est visible
  stockTimerAccu += dt;
  if(stockTimerAccu >= 1){
    stockTimerAccu = 0;
    if(state.activeTab === "stock" && (_stockView === "stock" || _stockView === "order")){
      renderStockUI();
    }
  }

  // Met à jour uniquement l'état disabled des boutons d'upgrade (sans recréer le DOM)
  upgradeListEl?.querySelectorAll("[data-buy]").forEach(btn => {
    const u = getUpgrade(btn.dataset.buy);
    if(!u) return;
    const isMaxed = u.maxLvl !== undefined && u.lvl >= u.maxLvl;
    btn.disabled = isMaxed || state.money < u.cost;
  });

  requestAnimationFrame(tick);
}

// =====================
// SUPABASE AUTH + CLOUD SAVE
// =====================

const SUPABASE_URL      = "https://ydruyvfusnrekfllocqq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnV5dmZ1c25yZWtmbGxvY3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2ODE3MDIsImV4cCI6MjA4ODI1NzcwMn0.dgwUXXNHzg0oyQdcnaJNkrIo6S63d6Dw-BDmWqhwS7w";

// createClient sans navigator.locks — évite les AbortError / lock not released
// quand plusieurs onglets ou rechargements rapides se marchent dessus.
// ─── AUTH UI HELPERS ───────────────────────────────────────────────────────────
// Définies AVANT createClient car onAuthStateChange les appelle immédiatement.
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
  if(pseudoEl) pseudoEl.textContent = state.profile?.pseudo || "M\xe9canicien";
}

function openAuth(){
  if(currentUser){ _supa.auth.signOut(); return; }
  const modal = document.getElementById("supaAuthModal");
  if(modal){
    modal.style.zIndex = "10000"; // au-dessus du login wall (z-index:9999)
    modal.style.display = "flex";
    switchAuthView("login");
    document.getElementById("supaAuthEmail")?.focus();
  }
}

// ─── LOGIN WALL ─────────────────────────────────────────────────────────────────────
function showLoginWall(){
  let wall = document.getElementById("loginWall");
  if(!wall){
    wall = document.createElement("div");
    wall.id = "loginWall";
    wall.style.cssText = [
      "position:fixed","inset:0","z-index:9999",
      "background:rgba(10,10,20,0.96)",
      "display:flex","flex-direction:column",
      "align-items:center","justify-content:center","gap:20px",
      "font-family:inherit"
    ].join(";");
    wall.innerHTML = `
      <div style="font-size:3rem">🏎️</div>
      <div style="font-size:1.5rem;font-weight:700;color:#fff">Garage Turbo</div>
      <div style="color:#aaa;font-size:0.95rem;text-align:center;max-width:280px">
        Connecte-toi pour jouer et sauvegarder ta progression dans le cloud.
      </div>
      <button id="loginWallBtn" style="
        margin-top:8px;padding:12px 32px;border:none;border-radius:10px;
        background:linear-gradient(135deg,#ffc832,#ff8c00);
        color:#111;font-weight:700;font-size:1rem;cursor:pointer;
      ">🔑 Se connecter / S\'inscrire</button>
    `;
    document.body.appendChild(wall);
    wall.querySelector("#loginWallBtn").addEventListener("click", openAuth);
  }
  wall.style.display = "flex";
}

function hideLoginWall(){
  const wall = document.getElementById("loginWall");
  if(wall) wall.style.display = "none";
}

// ─── SAVE INDICATOR ─────────────────────────────────────────────────────────────
function showSaveIndicator(msg){
  const btn = document.getElementById("btnSave");
  if(!btn) return;
  const orig = btn.textContent;
  btn.textContent = msg;
  setTimeout(() => btn.textContent = orig, 2500);
}

// ─── LOCAL SAVE/LOAD : DÉSACTIVÉS (cloud-only) ───────────────────────────────────────
function localSave(){ /* cloud-only — intentionnellement vide */ }
function localLoad(){ /* cloud-only — intentionnellement vide */ }

// =============================================================================
// save-snapshot.js
// Garage Turbo — Couche de sérialisation de la progression du joueur
//
// Ce fichier est la SEULE source de vérité pour le format de sauvegarde.
// Il ne connaît ni Supabase, ni Steam, ni localStorage.
// Il lit et écrit uniquement dans `state` (global de app.js).
//
// DÉPENDANCES GLOBALES ATTENDUES (app.js) :
//   state, CONFIG, applyGarageName, rebuildUpgradeMap, applyTalentEffects,
//   applyHeritageBonuses, applyHeritageBonusesToState, recalcRepairAuto,
//   resetPendingAchievements, updateGarageLevel, applyTickLogic,
//   _isOfflineCatchup, showToast
// =============================================================================

// Version courante du format de save.
// À incrémenter à chaque changement de schéma (ajout/renommage de champ).
const SAVE_VERSION = 3;

// ─── buildSaveSnapshot ───────────────────────────────────────────────────────
// Sérialise l'état courant du jeu en un objet JSON pur.
// Ne doit contenir aucune référence à des fonctions, DOM, ou objets cycliques.
function buildSaveSnapshot() {
  return {
    // Versioning — TOUJOURS présent, TOUJOURS en premier
    v:       SAVE_VERSION,
    savedAt: Date.now(),

    // ── Profil joueur ──────────────────────────────────────────────────────
    profile: {
      pseudo:  state.profile?.pseudo  ?? "Mécanicien",
      avatar:  state.profile?.avatar  ?? "🔧",
      country: state.profile?.country ?? "FR",
      banner:  state.profile?.banner  ?? "#1a2a4a",
    },
    garageName: state.garageName ?? "Garage Turbo",

    // ── Économie ───────────────────────────────────────────────────────────
    money:           state.money           ?? 100,
    rep:             state.rep             ?? 0,
    carsSold:        state.carsSold        ?? 0,
    totalMoneyEarned: state.totalMoneyEarned ?? 0,
    totalRepairs:     state.totalRepairs    ?? 0,
    totalAnalyses:    state.totalAnalyses   ?? 0,
    totalClickRepairs: state.totalClickRepairs ?? 0,
    totalCarsSold:    state.totalCarsSold   ?? 0,
    sessionStart:     state.sessionStart    ?? Date.now(),

    // ── Niveau garage ──────────────────────────────────────────────────────
    garageLevel: state.garageLevel ?? 1,
    garageCap:   state.garageCap   ?? 1,
    showroomCap: state.showroomCap ?? 3,

    // ── Talents ────────────────────────────────────────────────────────────
    talentPoints:       state.talentPoints       ?? 0,
    talentLevelGranted: state.talentLevelGranted ?? 1,
    talents:            state.talents            ?? {},

    // ── Upgrades ───────────────────────────────────────────────────────────
    // On ne sérialise que les données variables (lvl, cost) — pas les métadonnées
    // statiques (name, icon, desc…) qui sont déjà dans le state initial.
    upgrades: (state.upgrades ?? []).map(u => ({
      id:   u.id,
      lvl:  u.lvl  ?? 0,
      cost: u.cost ?? 0,
    })),

    // ── File d'attente & showroom ──────────────────────────────────────────
    queue:    state.queue    ?? [],
    active:   state.active   ?? null,
    showroom: state.showroom ?? [],

    // ── Prestige & héritage ────────────────────────────────────────────────
    prestigeCount:  state.prestigeCount  ?? 0,
    heritagePoints: state.heritagePoints ?? 0,
    heritageSpent:  state.heritageSpent  ?? 0,
    heritagePerks:  state.heritagePerks  ?? {},

    // ── Stock & commandes ──────────────────────────────────────────────────
    parts:         state.parts         ?? {},
    orders:        state.orders        ?? [],
    stockSettings: state.stockSettings ?? {},
    stockGlobal:   state.stockGlobal   ?? {},

    // ── Succès ─────────────────────────────────────────────────────────────
    achievements: state.achievements ?? {},

    // ── Flags internes ─────────────────────────────────────────────────────
    _hasSaved: true,
  };
}

// ─── migrateSaveSnapshot ─────────────────────────────────────────────────────
// Prend un snapshot brut (quelle que soit sa version) et le met à jour
// vers SAVE_VERSION. Chaque bloc if(data.v < N) est une migration atomique.
// Règle : on ne supprime jamais un champ ici — on ajoute ou renomme uniquement.
function migrateSaveSnapshot(raw) {
  // Copie défensive pour ne jamais muter l'objet reçu
  const data = Object.assign({}, raw);

  // Pas de v → très ancienne save (avant versioning) → traiter comme v1
  if(typeof data.v !== "number") data.v = 1;

  // ── v1 → v2 : introduction du système de stock ────────────────────────────
  if(data.v < 2) {
    data.parts         = data.parts         ?? {};
    data.orders        = data.orders        ?? [];
    data.stockSettings = data.stockSettings ?? {};
    data.stockGlobal   = data.stockGlobal   ?? {};
    data.v = 2;
  }

  // ── v2 → v3 : statistiques globales + sessionStart ────────────────────────
  if(data.v < 3) {
    data.totalMoneyEarned  = data.totalMoneyEarned  ?? 0;
    data.totalRepairs      = data.totalRepairs      ?? 0;
    data.totalAnalyses     = data.totalAnalyses     ?? 0;
    data.totalClickRepairs = data.totalClickRepairs ?? 0;
    data.totalCarsSold     = data.totalCarsSold     ?? data.carsSold ?? 0;
    data.sessionStart      = data.sessionStart      ?? Date.now();
    // profile.banner introduit en v3
    if(data.profile && !data.profile.banner) data.profile.banner = "#1a2a4a";
    data.v = 3;
  }

  // ── v3 → v4 (exemple futur) ───────────────────────────────────────────────
  // if(data.v < 4) {
  //   data.newField = data.newField ?? defaultValue;
  //   data.v = 4;
  // }

  return data;
}

// ─── applySaveSnapshot ───────────────────────────────────────────────────────
// Applique un snapshot (après migration) dans le state global.
// Toujours appeler migrateSaveSnapshot() avant d'appeler cette fonction.
// Effectue le catchup offline si savedAt est présent.
function applySaveSnapshot(raw) {
  // 1. Migrer vers la version courante avant tout
  const data = migrateSaveSnapshot(raw);

  // 2. Profil
  state.profile = {
    pseudo:  data.profile?.pseudo  ?? "Mécanicien",
    avatar:  data.profile?.avatar  ?? "🔧",
    country: data.profile?.country ?? "FR",
    banner:  data.profile?.banner  ?? "#1a2a4a",
  };
  state.garageName = data.garageName ?? state.garageName;

  // 3. Économie
  state.money           = data.money           ?? state.money;
  state.rep             = data.rep             ?? state.rep;
  state.carsSold        = data.carsSold        ?? state.carsSold;
  state.totalMoneyEarned  = data.totalMoneyEarned  ?? 0;
  state.totalRepairs      = data.totalRepairs      ?? 0;
  state.totalAnalyses     = data.totalAnalyses     ?? 0;
  state.totalClickRepairs = data.totalClickRepairs ?? 0;
  state.totalCarsSold     = data.totalCarsSold     ?? 0;
  state.sessionStart      = data.sessionStart      ?? Date.now();

  // 4. Niveau garage
  state.garageLevel = data.garageLevel ?? state.garageLevel;
  state.garageCap   = data.garageCap   ?? state.garageCap;
  state.showroomCap = data.showroomCap ?? state.showroomCap;

  // 5. Talents
  state.talentPoints       = data.talentPoints       ?? state.talentPoints;
  state.talentLevelGranted = data.talentLevelGranted ?? state.talentLevelGranted;
  state.talents            = data.talents            ?? {};

  // 6. Upgrades — merge par id pour ne pas casser les nouvelles définitions
  if(Array.isArray(data.upgrades)) {
    data.upgrades.forEach(saved => {
      const base = state.upgrades.find(u => u.id === saved.id);
      if(base) {
        base.lvl  = saved.lvl  ?? 0;
        base.cost = saved.cost ?? base.cost;
      }
    });
  }

  // 7. File d'attente, voiture active, showroom
  state.queue    = data.queue    ?? [];
  state.active   = data.active   ?? null;
  state.showroom = data.showroom ?? [];

  // 8. Prestige & héritage
  state.prestigeCount  = data.prestigeCount  ?? 0;
  state.heritagePoints = data.heritagePoints ?? 0;
  state.heritageSpent  = data.heritageSpent  ?? 0;
  state.heritagePerks  = data.heritagePerks  ?? {};

  // 9. Stock & commandes
  state.parts         = data.parts         ?? {};
  state.orders        = data.orders        ?? [];
  state.stockSettings = data.stockSettings ?? {};
  state.stockGlobal   = data.stockGlobal   ?? {};

  // 10. Succès
  state.achievements = data.achievements ?? {};

  // 11. Flags internes
  state._hasSaved = data._hasSaved ?? false;

  // 12. Recalcul des effets dérivés — ordre critique (voir commentaire doPrestige)
  applyGarageName();
  applyHeritageBonuses();       // ← doit précéder applyHeritageBonusesToState
  applyHeritageBonusesToState();
  rebuildUpgradeMap();          // ← doit précéder applyTalentEffects et recalcUpgradeEffects
  recalcUpgradeEffects();       // ← repart des niveaux sauvegardés, recalcule diagReward/repairClick/speedMult etc.
  applyTalentEffects();         // ← doit précéder recalcRepairAuto
  recalcRepairAuto();
  resetPendingAchievements();
  updateGarageLevel();

  // 13. Catchup offline : compenser le temps écoulé depuis la dernière save
  if(data.savedAt && typeof data.savedAt === "number") {
    const offlineSec = Math.max(0, (Date.now() - data.savedAt) / 1000);
    if(offlineSec > 5) {
      const catchupSec = Math.min(offlineSec, CONFIG.OFFLINE_MAX_SEC);
      const STEP = CONFIG.OFFLINE_STEP_SEC;
      let remaining = catchupSec;
      _isOfflineCatchup = true;
      try {
        while(remaining > 0) {
          const dt = Math.min(remaining, STEP);
          applyTickLogic(dt);
          remaining -= dt;
        }
      } finally {
        _isOfflineCatchup = false;
      }
      if(catchupSec >= 60) {
        const mins = Math.floor(catchupSec / 60);
        setTimeout(() => showToast(`⏱️ Progression hors-ligne : ${mins} min rattrapées`), 500);
      }
    }
  }
}


// =============================================================================
// save-repository.js
// Garage Turbo — Contrat et implémentation Supabase de la persistance
//
// Ce fichier définit :
//   1. SaveRepository  : interface JSDoc (contrat que toute implémentation doit respecter)
//   2. SupabaseSaveRepository : implémentation pour Supabase (web)
//
// Ajouts futurs dans ce même fichier ou dans des fichiers séparés :
//   - SteamSaveRepository  (Steam Cloud via Greenworks)
//   - FileSaveRepository   (fichier local, NW.js / Electron)
//   - MemorySaveRepository (tests unitaires)
// =============================================================================

// ─── Interface SaveRepository (JSDoc) ────────────────────────────────────────
/**
 * @interface SaveRepository
 *
 * Contrat de stockage de la progression d'un joueur.
 * Aucune implémentation concrète ne doit être appelée directement par le
 * game core — toujours passer par SaveService.
 *
 * @typedef {Object} SaveSnapshot
 * @property {number} v        - Version du format
 * @property {number} savedAt  - Timestamp Date.now() de la dernière sauvegarde
 * ... (voir save-snapshot.js pour la structure complète)
 */
class SaveRepository {
  /**
   * Charge le snapshot de progression du joueur.
   * @param {string} userId
   * @returns {Promise<SaveSnapshot|null>} null si aucune save existante
   */
  async load(userId) {   // eslint-disable-line no-unused-vars
    throw new Error("SaveRepository.load() non implémenté");
  }

  /**
   * Crée ou met à jour le snapshot de progression du joueur.
   * @param {string}       userId
   * @param {SaveSnapshot} snapshot
   * @returns {Promise<void>}
   */
  async upsert(userId, snapshot) {   // eslint-disable-line no-unused-vars
    throw new Error("SaveRepository.upsert() non implémenté");
  }

  /**
   * Supprime la progression du joueur.
   * Utilisé pour la réinitialisation / RGPD.
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async delete(userId) {   // eslint-disable-line no-unused-vars
    throw new Error("SaveRepository.delete() non implémenté");
  }
}

// ─── SupabaseSaveRepository ───────────────────────────────────────────────────
/**
 * Implémentation de SaveRepository pour Supabase.
 *
 * Schéma attendu de la table `saves` :
 *   user_id    UUID  PRIMARY KEY REFERENCES auth.users
 *   save_data  JSONB NOT NULL
 *   updated_at TIMESTAMPTZ DEFAULT now()
 *
 * Row Level Security recommandée :
 *   CREATE POLICY "own_save" ON saves USING (auth.uid() = user_id);
 */
class SupabaseSaveRepository extends SaveRepository {
  /** @param {import('@supabase/supabase-js').SupabaseClient} client */
  constructor(client) {
    super();
    this._client = client;
  }

  async load(userId) {
    const { data, error } = await this._client
      .from("saves")
      .select("save_data")
      .eq("user_id", userId)
      .maybeSingle();

    if(error) throw error;
    return data?.save_data ?? null;
  }

  async upsert(userId, snapshot) {
    const { error } = await this._client
      .from("saves")
      .upsert(
        {
          user_id:    userId,
          save_data:  snapshot,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if(error) throw error;
  }

  async delete(userId) {
    const { error } = await this._client
      .from("saves")
      .delete()
      .eq("user_id", userId);

    if(error) throw error;
  }
}

// ─── SteamSaveRepository (squelette prêt pour le port Steam) ─────────────────
/**
 * Implémentation de SaveRepository pour Steam Cloud.
 * Nécessite Greenworks (Node.js bindings Steamworks) via NW.js ou Electron.
 * Le userId Steam est ignoré — Steam identifie le joueur nativement.
 *
 * À activer lors du port Steam :
 *   const saveRepo = new SteamSaveRepository(require('greenworks'));
 */
class SteamSaveRepository extends SaveRepository {
  /** @param {object} greenworks - require('greenworks') */
  constructor(greenworks) {
    super();
    this._gw = greenworks;
  }

  async load(_userId) {
    return new Promise((resolve) => {
      this._gw.readTextFromFile(
        "save.json",
        (raw) => {
          try { resolve(JSON.parse(raw)); }
          catch { resolve(null); }
        },
        () => resolve(null)   // fichier absent = nouvelle partie
      );
    });
  }

  async upsert(_userId, snapshot) {
    return new Promise((resolve, reject) => {
      this._gw.saveTextToFile(
        "save.json",
        JSON.stringify(snapshot),
        resolve,
        (err) => reject(new Error(err))
      );
    });
  }

  async delete(_userId) {
    return new Promise((resolve, reject) => {
      this._gw.deleteFile(
        "save.json",
        resolve,
        (err) => reject(new Error(err))
      );
    });
  }
}


// =============================================================================
// save-service.js
// Garage Turbo — Orchestrateur de la sauvegarde
//
// SaveService est l'UNIQUE point d'entrée pour charger et sauvegarder
// la progression. Il :
//   - gère les flags de concurrence (loading / saving)
//   - délègue la sérialisation à save-snapshot.js
//   - délègue la persistance à SaveRepository
//   - ne connaît ni Supabase, ni Steam, ni le DOM
//
// DÉPENDANCES GLOBALES ATTENDUES (app.js) :
//   buildSaveSnapshot, applySaveSnapshot,
//   renderAll, tryStartNextRepair, showSaveIndicator
// =============================================================================

class SaveService {
  /**
   * @param {SaveRepository} repository - Une instance de SupabaseSaveRepository,
   *   SteamSaveRepository, etc.
   */
  constructor(repository) {
    if(!repository) throw new Error("SaveService: repository requis");

    this._repo    = repository;
    this._loading     = false;  // un cloudLoad est en cours
    this._saving      = false;  // un cloudSave est en cours
    this._ready       = false;  // true après le premier load (succès ou échec)
    this._pendingSave = false;  // un save a été demandé pendant qu'un autre tournait
  }

  // ── Accesseurs ──────────────────────────────────────────────────────────────

  /** @returns {boolean} true dès que le premier load est terminé */
  get isReady()   { return this._ready;   }

  /** @returns {boolean} true pendant un load actif */
  get isLoading() { return this._loading; }

  /** @returns {boolean} true pendant un save actif */
  get isSaving()  { return this._saving;  }

  // ── load ────────────────────────────────────────────────────────────────────
  /**
   * Charge la progression depuis le repository.
   * Appelé UNE SEULE FOIS à la connexion (protégé par _initialLoadDone dans app.js).
   * Met _ready = true dans le finally, qu'il y ait eu une erreur ou non.
   *
   * @param {string} userId
   */
  async load(userId) {
    if(this._loading) {
      dbg("[SaveService] load() déjà en cours — ignoré");
      return;
    }

    this._loading = true;
    dbg("[SaveService] load() pour user:", userId);
    showSaveIndicator("☁️ Chargement...");

    try {
      const snapshot = await this._repo.load(userId);

      if(snapshot) {
        dbg("[SaveService] snapshot trouvé, application...");
        const currentTab = state.activeTab; // préserver l'onglet actif
        applySaveSnapshot(snapshot);
        if(currentTab) state.activeTab = currentTab;
        updateTopbarProfile(); // rafraîchit le pseudo/avatar dès que le profil est chargé
        showSaveIndicator("☁️ Partie chargée");
      } else {
        dbg("[SaveService] aucun snapshot — nouvelle partie");
      }

      renderAll();
    } catch(e) {
      // Supabase cold start, réseau instable, etc.
      // On laisse le jeu démarrer en état initial — pas de blocage.
      console.error("[SaveService] load() erreur:", e.message);
      showSaveIndicator("⚠️ Cloud indisponible");
      renderAll();
    } finally {
      this._loading = false;
      this._ready   = true;   // autosave peut maintenant s'activer
      tryStartNextRepair();
    }
  }

  // ── save ────────────────────────────────────────────────────────────────────
  /**
   * Sauvegarde la progression courante dans le repository.
   * Silencieux si : pas encore prêt, déjà en cours, ou un load est actif.
   *
   * @param {string} userId
   */
  async save(userId) {
    if(!this._ready)  { dbg("[SaveService] save() ignoré — pas encore prêt"); return; }
    if(this._loading) { dbg("[SaveService] save() ignoré — load en cours");    return; }

    // Si un save tourne déjà, on mémorise qu'un nouveau save est nécessaire.
    // Le finally du save en cours le déclenchera automatiquement.
    if(this._saving) {
      this._pendingSave = true;
      dbg("[SaveService] save() — pending enregistré");
      return;
    }

    this._saving = true;
    this._pendingSave = false;
    dbg("[SaveService] save() pour user:", userId);

    try {
      // Snapshot capturé AVANT le await — reflète l'état exact au moment du clic.
      const snapshot = buildSaveSnapshot();
      await this._repo.upsert(userId, snapshot);
      dbg("[SaveService] save() ✅ succès");
      showSaveIndicator("☁️ Sauvegardé");
    } catch(e) {
      console.error("[SaveService] save() erreur:", e.message);
      showSaveIndicator("⚠️ Erreur cloud");
    } finally {
      this._saving = false;
      // Si un save a été demandé pendant qu'on tournait, on le relance immédiatement.
      if(this._pendingSave) {
        this._pendingSave = false;
        dbg("[SaveService] save() — exécution du pending save");
        this.save(userId);
      }
    }
  }

  // ── reset ───────────────────────────────────────────────────────────────────
  /**
   * Réinitialise les flags internes du service.
   * À appeler lors d'une déconnexion (SIGNED_OUT) pour autoriser
   * un prochain load propre à la reconnexion.
   */
  reset() {
    this._loading     = false;
    this._saving      = false;
    this._ready       = false;
    this._pendingSave = false;
    dbg("[SaveService] reset()");
  }
}


const _supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    lock: async (_name, _acquireTimeout, fn) => fn(), // bypass lock inter-onglets
    persistSession:     true,   // session stockée localement (pas la progression)
    detectSessionInUrl: true,
    storageKey:         "garage-turbo-auth",
  }
});

// ─── INSTANCIATION DE SAVSERVICE ──────────────────────────────────────────
// _saveService est l'unique point d'entrée pour load/save de progression.
// Pour passer à Steam : new SaveService(new SteamSaveRepository(greenworks))
const _saveRepo    = new SupabaseSaveRepository(_supa);
const _saveService = new SaveService(_saveRepo);


// ─── FLAGS DE CONCURRENCE ─────────────────────────────────────────────
let currentUser      = null;
let _authReady       = false;  // true dès que SaveService.load() a terminé (succès ou erreur)
let _initialLoadDone = false;  // empêche un double load INITIAL_SESSION + SIGNED_IN

// ─── SAVE ARCHITECTURE ────────────────────────────────────────────────────
// SaveSnapshot + SaveRepository + SaveService sont définis dans les sections
// ci-dessous. L'instance globale _saveService est créée après _supa.

// ─── save() — point d'entrée manuel + beforeunload ────────────────────────
// Appellé par doPrestige(), saveProfile(), beforeunload, visibilitychange.
// Délègue à SaveService — ne touche plus _supa directement.
function save() {
  if(!currentUser) return;
  state._hasSaved = true;
  _saveService.save(currentUser.id);
}

// ─── AUTH STATE MACHINE ──────────────────────────────────────────────────────
// Règles :
// • INITIAL_SESSION  → premier événement au chargement (utilisateur déjà connecté ou non)
// • SIGNED_IN        → connexion manuelle (ou refresh de token)
// • SIGNED_OUT       → déconnexion
//
// On évite d'appeler cloudLoad dans le callback directement avec await car le SDK
// gotrue peut se retrouver à attendre la fin du callback pour relâcher son lock interne.
// Solution : on déclenche cloudLoad via setTimeout(0) pour sortir du callstack du SDK.
_supa.auth.onAuthStateChange((event, session) => {
  dbg("[auth] event:", event, "user:", session?.user?.id ?? "null");
  currentUser = session?.user ?? null;
  updateAuthUI();

  if(event === "INITIAL_SESSION"){
    if(currentUser){
      // Session existante au chargement → charger la progression
      hideLoginWall();
      if(!_initialLoadDone){
        _initialLoadDone = true;
        setTimeout(() => _saveService.load(currentUser.id).then(() => { _authReady = true; }), 0);
      }
    } else {
      // Pas de session → bloquer le jeu
      _authReady = false;
      showLoginWall();
    }
    return;
  }

  if(event === "SIGNED_IN"){
    if(!_initialLoadDone){
      // Connexion manuelle (pas un refresh de token après INITIAL_SESSION)
      _initialLoadDone = true;
      hideLoginWall();
      setTimeout(() => _saveService.load(currentUser.id).then(() => { _authReady = true; }), 0);
    }
    // Si _initialLoadDone est déjà true, c'est un refresh de token silencieux → ignorer
    return;
  }

  if(event === "SIGNED_OUT"){
    _authReady       = false;
    _initialLoadDone = false;
    _saveService.reset();
    currentUser      = null;
    updateAuthUI();
    showLoginWall();
    return;
  }
});

// ─── FALLBACK : si onAuthStateChange ne se déclenche pas dans les 6s ─────────
// (réseau coupé, Supabase totalement KO)
setTimeout(() => {
  if(!_authReady && !currentUser){
    dbg("[init] auth timeout — affichage login wall");
    showLoginWall();
  }
}, 6000);

// btnSave supprimé du header
const btnAuth = document.getElementById("btnAuth");
if(btnAuth) btnAuth.addEventListener("click", openAuth);

// =====================
// AUTH MODAL — connexion / inscription
// =====================

function switchAuthView(view){
  const loginView  = document.getElementById("authViewLogin");
  const signupView = document.getElementById("authViewSignup");
  const slider     = document.getElementById("authToggleSlider");
  const btns       = document.querySelectorAll(".authToggle__btn");
  const msgEl      = document.getElementById("supaAuthMsg");

  if(loginView)  loginView.style.display  = view === "login"  ? "flex" : "none";
  if(signupView) signupView.style.display = view === "signup" ? "flex" : "none";

  btns.forEach(b => b.classList.toggle("authToggle__btn--active", b.dataset.view === view));
  if(slider) slider.classList.toggle("authToggle__slider--right", view === "signup");
  if(msgEl){ msgEl.textContent = ""; msgEl.className = "authMsg"; }
}

function setAuthMsg(msg, type = ""){
  const el = document.getElementById("supaAuthMsg");
  if(!el) return;
  el.textContent = msg;
  el.className   = "authMsg" + (type ? ` authMsg--${type}` : "");
}

function checkPwdStrength(pwd){
  const fill  = document.getElementById("pwdStrengthFill");
  const label = document.getElementById("pwdStrengthLabel");
  if(!fill || !label) return;
  let score = 0;
  if(pwd.length >= 6)          score++;
  if(pwd.length >= 10)         score++;
  if(/[A-Z]/.test(pwd))       score++;
  if(/[0-9]/.test(pwd))       score++;
  if(/[^A-Za-z0-9]/.test(pwd)) score++;
  const levels = [
    { w:"0%",   c:"transparent", t:"" },
    { w:"25%",  c:"#ff4444",     t:"Très faible" },
    { w:"45%",  c:"#ff8c00",     t:"Faible" },
    { w:"65%",  c:"#ffc832",     t:"Moyen" },
    { w:"85%",  c:"#4ade80",     t:"Fort" },
    { w:"100%", c:"#31d6ff",     t:"Très fort 🔥" },
  ];
  const lvl = levels[Math.min(score, 5)];
  fill.style.width      = lvl.w;
  fill.style.background = lvl.c;
  label.textContent     = lvl.t;
  label.style.color     = lvl.c;
}

async function supaAuthSubmit(mode){
  if(mode === "login"){
    const email = document.getElementById("supaAuthEmail")?.value?.trim();
    const pwd   = document.getElementById("supaAuthPwd")?.value;
    if(!email || !pwd){ setAuthMsg("Email et mot de passe requis.", "error"); return; }
    setAuthMsg("⏳ Connexion…");
    const { error } = await _supa.auth.signInWithPassword({ email, password: pwd });
    if(error){ setAuthMsg("❌ " + error.message, "error"); return; }
    document.getElementById("supaAuthModal").style.display = "none";
    setAuthMsg("");
  } else {
    const pseudo = document.getElementById("signupPseudo")?.value?.trim();
    const email  = document.getElementById("signupEmail")?.value?.trim();
    const pwd    = document.getElementById("signupPwd")?.value;
    const pwdC   = document.getElementById("signupPwdConfirm")?.value;
    if(!pseudo)        { setAuthMsg("Pseudo requis.",                  "error"); return; }
    if(!email || !pwd) { setAuthMsg("Email et mot de passe requis.",   "error"); return; }
    if(pwd !== pwdC)   { setAuthMsg("Les mots de passe ne correspondent pas.", "error"); return; }
    if(pwd.length < 6) { setAuthMsg("Mot de passe trop court (min 6 caractères).", "error"); return; }
    setAuthMsg("⏳ Création du compte…");
    const { error } = await _supa.auth.signUp({
      email, password: pwd,
      options: { data: { pseudo: pseudo.substring(0, 20) } }
    });
    if(error){ setAuthMsg("❌ " + error.message, "error"); return; }
    // Pré-remplir le pseudo depuis l'inscription
    state.profile.pseudo = pseudo.substring(0, 20);
    document.getElementById("supaAuthModal").style.display = "none";
    setAuthMsg("");
    showToast("✅ Compte créé ! Vérifie ton email si demandé.");
  }
}

async function supaResetPassword(){
  const email = document.getElementById("supaAuthEmail")?.value?.trim();
  if(!email){ setAuthMsg("Entre ton email d'abord.", "error"); return; }
  setAuthMsg("⏳ Envoi du lien…");
  const { error } = await _supa.auth.resetPasswordForEmail(email);
  if(error){ setAuthMsg("❌ " + error.message, "error"); return; }
  setAuthMsg("✅ Lien envoyé ! Vérifie ta boîte mail.", "success");
}

// ─── Listeners modale auth ────────────────────────────────────────────────────
document.getElementById("supaAuthClose")?.addEventListener("click", () => {
  document.getElementById("supaAuthModal").style.display = "none";
});
document.getElementById("supaAuthBackdrop")?.addEventListener("click", () => {
  document.getElementById("supaAuthModal").style.display = "none";
});
document.getElementById("supaAuthBtnLogin")?.addEventListener("click",  () => supaAuthSubmit("login"));
document.getElementById("supaAuthBtnSignup")?.addEventListener("click", () => supaAuthSubmit("signup"));
document.getElementById("supaAuthBtnReset")?.addEventListener("click",  supaResetPassword);

// Enter pour se connecter
document.getElementById("supaAuthPwd")?.addEventListener("keydown", (e) => {
  if(e.key === "Enter") supaAuthSubmit("login");
});
document.getElementById("supaAuthEmail")?.addEventListener("keydown", (e) => {
  if(e.key === "Enter") supaAuthSubmit("login");
});

// Toggle afficher/masquer mot de passe
document.getElementById("togglePwdLogin")?.addEventListener("click", () => {
  const input = document.getElementById("supaAuthPwd");
  if(!input) return;
  input.type = input.type === "password" ? "text" : "password";
});
document.getElementById("togglePwdSignup")?.addEventListener("click", () => {
  const input = document.getElementById("signupPwd");
  if(!input) return;
  input.type = input.type === "password" ? "text" : "password";
});

// Indicateur force du mot de passe à l'inscription
document.getElementById("signupPwd")?.addEventListener("input", (e) => {
  checkPwdStrength(e.target.value);
});

// Switch Connexion / Inscription via les onglets
document.getElementById("authToggle")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".authToggle__btn");
  if(btn?.dataset?.view) switchAuthView(btn.dataset.view);
});

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

// Déconnexion — bouton dans la modale profil
const btnLogout = document.getElementById("btnLogout");
if(btnLogout) btnLogout.addEventListener("click", () => {
  document.getElementById("profileModal").style.display = "none";
  _supa.auth.signOut();
});

// Mise à jour preview en temps réel sur frappe pseudo
document.getElementById("profilePseudo")?.addEventListener("input", updateProfilePreview);
document.getElementById("profileCountry")?.addEventListener("change", updateProfilePreview);



// =====================
// SUCCÈS
// =====================
const ACHIEVEMENTS = [
  // ── VENTES ──────────────────────────────────────────
  { id:"sell_1",       cat:"Ventes",       icon:"🚗", name:"Premier Client",           desc:"Vendre 1 voiture",                          cond:s=>s.carsSold>=1,         reward:{rep:5,    money:0,     talent:0} },
  { id:"sell_10",      cat:"Ventes",       icon:"🚗", name:"Petit Commerce",            desc:"Vendre 10 voitures",                        cond:s=>s.carsSold>=10,        reward:{rep:15,   money:500,     talent:0} },
  { id:"sell_25",      cat:"Ventes",       icon:"🚙", name:"En Rythme",                 desc:"Vendre 25 voitures",                        cond:s=>s.carsSold>=25,        reward:{rep:25,   money:1000,    talent:0} },
  { id:"sell_50",      cat:"Ventes",       icon:"🚙", name:"Vendeur Confirmé",          desc:"Vendre 50 voitures",                        cond:s=>s.carsSold>=50,        reward:{rep:40,   money:2500,    talent:0} },
  { id:"sell_100",     cat:"Ventes",       icon:"🚙", name:"Centenaire",                desc:"Vendre 100 voitures",                       cond:s=>s.carsSold>=100,       reward:{rep:75,   money:6000,    talent:0} },
  { id:"sell_250",     cat:"Ventes",       icon:"🏎️", name:"Série Noire",              desc:"Vendre 250 voitures",                       cond:s=>s.carsSold>=250,       reward:{rep:150,  money:15000,   talent:0} },
  { id:"sell_500",     cat:"Ventes",       icon:"🏎️", name:"Demi-Millier",             desc:"Vendre 500 voitures",                       cond:s=>s.carsSold>=500,       reward:{rep:300,  money:30000,   talent:1} },
  { id:"sell_1000",    cat:"Ventes",       icon:"🏁", name:"Mille Voitures",            desc:"Vendre 1 000 voitures",                     cond:s=>s.carsSold>=1000,      reward:{rep:600,  money:75000,   talent:1} },
  { id:"sell_2500",    cat:"Ventes",       icon:"🏁", name:"Concessionnaire",           desc:"Vendre 2 500 voitures",                     cond:s=>s.carsSold>=2500,      reward:{rep:1200, money:200000,  talent:1} },
  { id:"sell_5000",    cat:"Ventes",       icon:"🏁", name:"Tycoon de l'Occasion",      desc:"Vendre 5 000 voitures",                     cond:s=>s.carsSold>=5000,      reward:{rep:2500, money:500000,  talent:2} },
  { id:"sell_10000",   cat:"Ventes",       icon:"👑", name:"Empire de l'Auto",          desc:"Vendre 10 000 voitures",                    cond:s=>s.carsSold>=10000,     reward:{rep:5000, money:1000000, talent:3} },
  { id:"sell_50000",   cat:"Ventes",       icon:"👑", name:"Légende Vivante",           desc:"Vendre 50 000 voitures",                    cond:s=>s.carsSold>=50000,     reward:{rep:15000,money:3000000, talent:5} },

  // ── ARGENT ──────────────────────────────────────────
  { id:"money_500",    cat:"Argent",       icon:"💶", name:"Premiers Sous",             desc:"Avoir 500 € en caisse",                     cond:s=>s.money>=500,          reward:{rep:0,    money:0,       talent:0} },
  { id:"money_1k",     cat:"Argent",       icon:"💰", name:"Premier Billet",            desc:"Avoir 1 000 € en caisse",                   cond:s=>s.money>=1000,         reward:{rep:0,   money:0,       talent:0} },
  { id:"money_5k",     cat:"Argent",       icon:"💰", name:"Petite Réserve",            desc:"Avoir 5 000 € en caisse",                   cond:s=>s.money>=5000,         reward:{rep:0,   money:0,       talent:0} },
  { id:"money_10k",    cat:"Argent",       icon:"💰", name:"Petite Épargne",            desc:"Avoir 10 000 € en caisse",                  cond:s=>s.money>=10000,        reward:{rep:0,   money:0,       talent:0} },
  { id:"money_50k",    cat:"Argent",       icon:"💵", name:"Cinquante Mille",           desc:"Avoir 50 000 € en caisse",                  cond:s=>s.money>=50000,        reward:{rep:0,   money:500,       talent:0} },
  { id:"money_100k",   cat:"Argent",       icon:"💵", name:"Cent Mille",                desc:"Avoir 100 000 € en caisse",                 cond:s=>s.money>=100000,       reward:{rep:0,  money:1000,       talent:0} },
  { id:"money_500k",   cat:"Argent",       icon:"💵", name:"Demi-Million",              desc:"Avoir 500 000 € en caisse",                 cond:s=>s.money>=500000,       reward:{rep:0,  money:3000,       talent:0} },
  { id:"money_1m",     cat:"Argent",       icon:"💎", name:"Millionnaire",              desc:"Avoir 1 000 000 € en caisse",               cond:s=>s.money>=1000000,      reward:{rep:0,  money:5000,       talent:1} },
  { id:"money_10m",    cat:"Argent",       icon:"💎", name:"Dizaine de Millions",       desc:"Avoir 10 000 000 € en caisse",              cond:s=>s.money>=10000000,     reward:{rep:500, money:0,       talent:2} },
  { id:"money_1b",     cat:"Argent",       icon:"💎", name:"Milliardaire",              desc:"Avoir 1 000 000 000 € en caisse",           cond:s=>s.money>=1000000000,   reward:{rep:2000, money:0,       talent:3} },
  { id:"passive_5",    cat:"Argent",       icon:"📈", name:"Premiers Intérêts",         desc:"Atteindre 5 €/s de revenu passif",          cond:s=>s.moneyPerSec>=5,      reward:{rep:0,   money:200,    talent:0} },
  { id:"passive_10",   cat:"Argent",       icon:"📈", name:"Rente Modeste",             desc:"Atteindre 10 €/s de revenu passif",         cond:s=>s.moneyPerSec>=10,     reward:{rep:0,   money:500,    talent:0} },
  { id:"passive_50",   cat:"Argent",       icon:"📈", name:"Flux Régulier",             desc:"Atteindre 50 €/s de revenu passif",         cond:s=>s.moneyPerSec>=50,     reward:{rep:30,   money:15000,   talent:0} },
  { id:"passive_100",  cat:"Argent",       icon:"📈", name:"Flux Continu",              desc:"Atteindre 100 €/s de revenu passif",        cond:s=>s.moneyPerSec>=100,    reward:{rep:80,  money:30000,   talent:0} },
  { id:"passive_500",  cat:"Argent",       icon:"📊", name:"Rente Confortable",         desc:"Atteindre 500 €/s de revenu passif",        cond:s=>s.moneyPerSec>=500,    reward:{rep:400,  money:80000,   talent:1} },
  { id:"passive_1k",   cat:"Argent",       icon:"📊", name:"Machine à Cash",            desc:"Atteindre 1 000 €/s de revenu passif",      cond:s=>s.moneyPerSec>=1000,   reward:{rep:1000, money:200000,  talent:2} },
  { id:"earned_1m",    cat:"Argent",       icon:"🏦", name:"Un Million Gagné",          desc:"Avoir gagné 1 000 000 € au total",          cond:s=>(s.totalMoneyEarned??0)>=1000000,   reward:{rep:0,  money:20000,       talent:0} },
  { id:"earned_100m",  cat:"Argent",       icon:"🏦", name:"Cent Millions Gagnés",      desc:"Avoir gagné 100 000 000 € au total",        cond:s=>(s.totalMoneyEarned??0)>=100000000, reward:{rep:200, money:0,       talent:1} },

  // ── RÉPUTATION ──────────────────────────────────────
  { id:"rep_10",       cat:"Réputation",   icon:"⭐", name:"Débutant Connu",            desc:"Atteindre 10 REP",                          cond:s=>s.rep>=10,             reward:{rep:0,    money:0,     talent:0} },
  { id:"rep_50",       cat:"Réputation",   icon:"⭐", name:"Bouche à Oreille",          desc:"Atteindre 50 REP",                          cond:s=>s.rep>=50,             reward:{rep:0,    money:0,     talent:0} },
  { id:"rep_100",      cat:"Réputation",   icon:"⭐", name:"Réputation Locale",         desc:"Atteindre 100 REP",                         cond:s=>s.rep>=100,            reward:{rep:0,    money:200,    talent:0} },
  { id:"rep_500",      cat:"Réputation",   icon:"🌟", name:"Garage Reconnu",            desc:"Atteindre 500 REP",                         cond:s=>s.rep>=500,            reward:{rep:0,    money:1000,    talent:0} },
  { id:"rep_2000",     cat:"Réputation",   icon:"🌟", name:"Expert Régional",           desc:"Atteindre 2 000 REP",                       cond:s=>s.rep>=2000,           reward:{rep:0,    money:5000,   talent:0} },
  { id:"rep_10000",    cat:"Réputation",   icon:"💫", name:"Célébrité Nationale",       desc:"Atteindre 10 000 REP",                      cond:s=>s.rep>=10000,          reward:{rep:0,    money:80000,   talent:1} },
  { id:"rep_50000",    cat:"Réputation",   icon:"💫", name:"Icône Mondiale",            desc:"Atteindre 50 000 REP",                      cond:s=>s.rep>=50000,          reward:{rep:0,    money:300000,  talent:1} },
  { id:"rep_200000",   cat:"Réputation",   icon:"🔱", name:"Légende de l'Asphalte",     desc:"Atteindre 200 000 REP",                     cond:s=>s.rep>=200000,         reward:{rep:0,    money:1000000, talent:2} },

  // ── TIERS ────────────────────────────────────────────
  { id:"tier_D",       cat:"Tiers",        icon:"🔓", name:"Véhicules Communs",         desc:"Débloquer le tier D",                       cond:s=>s.rep>=500,             reward:{rep:0,   money:0,    talent:0} },
  { id:"tier_C",       cat:"Tiers",        icon:"🔓", name:"Compactes Sportives",       desc:"Débloquer le tier C",                       cond:s=>s.rep>=1500,            reward:{rep:0,   money:500,    talent:0} },
  { id:"tier_B",       cat:"Tiers",        icon:"🔓", name:"Sportives & Youngtimers",   desc:"Débloquer le tier B",                       cond:s=>s.rep>=5000,           reward:{rep:20,   money:1000,   talent:0} },
  { id:"tier_A",       cat:"Tiers",        icon:"🔓", name:"Luxe & SUV Premium",        desc:"Débloquer le tier A",                       cond:s=>s.rep>=8000,           reward:{rep:50,  money:40000,   talent:0} },
  { id:"tier_S",       cat:"Tiers",        icon:"🌠", name:"Sportives Prestige",        desc:"Débloquer le tier S",                       cond:s=>s.rep>=25000,          reward:{rep:100,  money:120000,  talent:1} },
  { id:"tier_SS",      cat:"Tiers",        icon:"🌠", name:"Supercars",                 desc:"Débloquer le tier SS",                      cond:s=>s.rep>=70000,          reward:{rep:500,  money:400000,  talent:2} },
  { id:"tier_SSS",     cat:"Tiers",        icon:"💥", name:"Hypercars Rares",           desc:"Débloquer le tier SSS",                     cond:s=>s.rep>=200000,         reward:{rep:1000, money:1200000, talent:3} },
  { id:"tier_SSSp",    cat:"Tiers",        icon:"💥", name:"Mythiques",                 desc:"Débloquer le tier SSS+",                    cond:s=>s.rep>=600000,         reward:{rep:5000, money:5000000, talent:5} },

  // ── NIVEAU GARAGE ────────────────────────────────────
  { id:"lvl_5",        cat:"Garage",       icon:"🏠", name:"Atelier en Rodage",         desc:"Atteindre le niveau 5",                     cond:s=>s.garageLevel>=5,      reward:{rep:10,   money:500,     talent:0} },
  { id:"lvl_10",       cat:"Garage",       icon:"🏠", name:"Garage Opérationnel",       desc:"Atteindre le niveau 10",                    cond:s=>s.garageLevel>=10,     reward:{rep:25,   money:2000,    talent:0} },
  { id:"lvl_20",       cat:"Garage",       icon:"🏗️", name:"Atelier Solide",           desc:"Atteindre le niveau 20",                    cond:s=>s.garageLevel>=20,     reward:{rep:40,   money:6000,    talent:0} },
  { id:"lvl_25",       cat:"Garage",       icon:"🏗️", name:"Expansion Majeure",        desc:"Atteindre le niveau 25",                    cond:s=>s.garageLevel>=25,     reward:{rep:60,   money:12000,   talent:0} },
  { id:"lvl_50",       cat:"Garage",       icon:"🏗️", name:"Centre Auto",              desc:"Atteindre le niveau 50",                    cond:s=>s.garageLevel>=50,     reward:{rep:150,  money:40000,   talent:1} },
  { id:"lvl_75",       cat:"Garage",       icon:"🏢", name:"Groupe Automobile",         desc:"Atteindre le niveau 75",                    cond:s=>s.garageLevel>=75,     reward:{rep:300,  money:100000,  talent:1} },
  { id:"lvl_100",      cat:"Garage",       icon:"🏢", name:"Complexe Automobile",       desc:"Atteindre le niveau 100",                   cond:s=>s.garageLevel>=100,    reward:{rep:600,  money:250000,  talent:2} },
  { id:"lvl_150",      cat:"Garage",       icon:"🌆", name:"Empire Industriel",         desc:"Atteindre le niveau 150",                   cond:s=>s.garageLevel>=150,    reward:{rep:2000, money:1000000, talent:3} },

  // ── ATELIER ──────────────────────────────────────────
  { id:"repair_10",    cat:"Atelier",      icon:"🔧", name:"Mains dans le Cambouis",    desc:"Effectuer 10 réparations",                  cond:s=>(s.totalRepairs??0)>=10,    reward:{rep:10,   money:500,     talent:0} },
  { id:"repair_100",   cat:"Atelier",      icon:"🔧", name:"Mécanicien Expérimenté",    desc:"Effectuer 100 réparations",                 cond:s=>(s.totalRepairs??0)>=100,   reward:{rep:50,   money:3000,    talent:0} },
  { id:"repair_500",   cat:"Atelier",      icon:"🛠️", name:"Série de Chantiers",        desc:"Effectuer 500 réparations",                 cond:s=>(s.totalRepairs??0)>=500,   reward:{rep:150,  money:15000,   talent:0} },
  { id:"repair_1000",  cat:"Atelier",      icon:"🛠️", name:"Mil Réparations",           desc:"Effectuer 1 000 réparations",               cond:s=>(s.totalRepairs??0)>=1000,  reward:{rep:400,  money:50000,   talent:1} },
  { id:"repair_5000",  cat:"Atelier",      icon:"⚙️", name:"Usine à Réparer",           desc:"Effectuer 5 000 réparations",               cond:s=>(s.totalRepairs??0)>=5000,  reward:{rep:1500, money:200000,  talent:2} },
  { id:"repair_10000", cat:"Atelier",      icon:"⚙️", name:"Maître des Pistons",        desc:"Effectuer 10 000 réparations",              cond:s=>(s.totalRepairs??0)>=10000, reward:{rep:5000, money:500000,  talent:3} },
  { id:"auto_repair",  cat:"Atelier",      icon:"🤖", name:"Atelier Automatisé",        desc:"Avoir une réparation auto active",          cond:s=>s.repairAuto>0,             reward:{rep:30,   money:2000,    talent:0} },
  { id:"speed_15",     cat:"Atelier",      icon:"⚡", name:"Vitesse de Croisière",      desc:"Multiplicateur de vitesse ≥ 1.5×",          cond:s=>(s.speedMult??1)*(s.talentSpeedMult??1)>=1.5,  reward:{rep:50,   money:5000,    talent:0} },
  { id:"speed_2",      cat:"Atelier",      icon:"⚡", name:"Turbo Activé",              desc:"Multiplicateur de vitesse ≥ 2×",            cond:s=>(s.speedMult??1)*(s.talentSpeedMult??1)>=2,    reward:{rep:150,  money:20000,   talent:1} },
  { id:"speed_3",      cat:"Atelier",      icon:"⚡", name:"Mode Fusée",                desc:"Multiplicateur de vitesse ≥ 3×",            cond:s=>(s.speedMult??1)*(s.talentSpeedMult??1)>=3,    reward:{rep:500,  money:80000,   talent:2} },
  { id:"click_500",    cat:"Atelier",      icon:"👊", name:"Bras Musclé",               desc:"Effectuer 500 clics de réparation",         cond:s=>(s.totalClickRepairs??0)>=500,   reward:{rep:20,   money:1000,    talent:0} },
  { id:"click_5000",   cat:"Atelier",      icon:"👊", name:"Acharnement",               desc:"Effectuer 5 000 clics de réparation",       cond:s=>(s.totalClickRepairs??0)>=5000,  reward:{rep:80,   money:8000,    talent:0} },
  { id:"click_50000",  cat:"Atelier",      icon:"🥊", name:"Légende du Clic",           desc:"Effectuer 50 000 clics de réparation",      cond:s=>(s.totalClickRepairs??0)>=50000, reward:{rep:500,  money:50000,   talent:1} },
  { id:"slots_3",      cat:"Atelier",      icon:"🅿️", name:"Triple Chantier",           desc:"Avoir 3 emplacements garage",               cond:s=>s.garageCap>=3,             reward:{rep:20,   money:2000,    talent:0} },
  { id:"slots_5",      cat:"Atelier",      icon:"🅿️", name:"Quinconce",                 desc:"Avoir 5 emplacements garage",               cond:s=>s.garageCap>=5,             reward:{rep:60,   money:8000,    talent:0} },
  { id:"slots_max",    cat:"Atelier",      icon:"🅿️", name:"Parking Complet",           desc:"Avoir 8 emplacements garage",               cond:s=>s.garageCap>=8,             reward:{rep:200,  money:30000,   talent:1} },

  // ── DIAGNOSTIC ───────────────────────────────────────
  { id:"diag_1",       cat:"Diagnostic",   icon:"🔍", name:"Scanner en Main",           desc:"Effectuer 1 diagnostic",                    cond:s=>s.totalAnalyses>=1,         reward:{rep:5,    money:0,       talent:0} },
  { id:"diag_50",      cat:"Diagnostic",   icon:"🔍", name:"Œil Affûté",                desc:"Effectuer 50 diagnostics",                  cond:s=>s.totalAnalyses>=50,        reward:{rep:15,   money:200,     talent:0} },
  { id:"diag_100",     cat:"Diagnostic",   icon:"🔍", name:"Diagnostiqueur",            desc:"Effectuer 100 diagnostics",                 cond:s=>s.totalAnalyses>=100,       reward:{rep:30,   money:800,     talent:0} },
  { id:"diag_500",     cat:"Diagnostic",   icon:"🧠", name:"Technicien Certifié",       desc:"Effectuer 500 diagnostics",                 cond:s=>s.totalAnalyses>=500,       reward:{rep:80,   money:4000,    talent:0} },
  { id:"diag_1000",    cat:"Diagnostic",   icon:"🧠", name:"Expert du Scan",            desc:"Effectuer 1 000 diagnostics",               cond:s=>s.totalAnalyses>=1000,      reward:{rep:200,  money:12000,   talent:0} },
  { id:"diag_10000",   cat:"Diagnostic",   icon:"🧠", name:"Maître Diagnostiqueur",     desc:"Effectuer 10 000 diagnostics",              cond:s=>s.totalAnalyses>=10000,     reward:{rep:800,  money:60000,   talent:1} },
  { id:"diag_auto",    cat:"Diagnostic",   icon:"🤖", name:"Stagiaire Embauché",        desc:"Débloquer le Stagiaire Accueil",            cond:s=>(s.upgrades?.find(u=>u.id==="stagiaire")?.lvl??0)>=1, reward:{rep:25,money:2000,talent:0} },
  { id:"diag_reward",  cat:"Diagnostic",   icon:"💡", name:"Diagnostic Premium",        desc:"Avoir +50 € par diagnostic",                cond:s=>s.diagReward>=50,           reward:{rep:100,  money:10000,   talent:0} },
  { id:"diag_reward2", cat:"Diagnostic",   icon:"💡", name:"Scanner d'Élite",           desc:"Avoir +200 € par diagnostic",               cond:s=>s.diagReward>=200,          reward:{rep:400,  money:50000,   talent:1} },

  // ── PIÈCES & STOCK ───────────────────────────────────
  { id:"part_first",   cat:"Stock",        icon:"📦", name:"Première Commande",         desc:"Commander une pièce pour la première fois", cond:s=>Object.keys(s.parts??{}).length>=1,         reward:{rep:10,   money:500,     talent:0} },
  { id:"part_5types",  cat:"Stock",        icon:"📦", name:"Stock Varié",               desc:"Avoir 5 types de pièces en stock",          cond:s=>Object.values(s.parts??{}).filter(p=>p.qty>0).length>=5,  reward:{rep:25,   money:2000,    talent:0} },
  { id:"part_15types", cat:"Stock",        icon:"🗄️", name:"Magasin Pièces",            desc:"Avoir 15 types de pièces en stock",         cond:s=>Object.values(s.parts??{}).filter(p=>p.qty>0).length>=15, reward:{rep:80,   money:8000,    talent:0} },
  { id:"part_30types", cat:"Stock",        icon:"🗄️", name:"Entrepôt Équipé",           desc:"Avoir 30 types de pièces en stock",         cond:s=>Object.values(s.parts??{}).filter(p=>p.qty>0).length>=30, reward:{rep:200,  money:25000,   talent:1} },
  { id:"part_bochmann",cat:"Stock",        icon:"🔵", name:"Qualité Allemande",         desc:"Commander des pièces Bochmann",             cond:s=>Object.values(s.parts??{}).some(p=>p.supplier==="bochmann"), reward:{rep:50,money:5000,talent:0} },
  { id:"part_slots3",  cat:"Stock",        icon:"🚛", name:"Flux Tendu",                desc:"Avoir 3 slots de livraison simultanés",     cond:s=>(s.upgrades?.find(u=>u.id==="slots_livraison")?.lvl??0)>=2, reward:{rep:30,money:3000,talent:0} },
  { id:"part_slots5",  cat:"Stock",        icon:"🚛", name:"Logisticien",               desc:"Avoir 5 slots de livraison simultanés",     cond:s=>(s.upgrades?.find(u=>u.id==="slots_livraison")?.lvl??0)>=4, reward:{rep:100,money:15000,talent:0} },
  { id:"part_norupture",cat:"Stock",       icon:"✅", name:"Zéro Rupture",              desc:"Avoir au moins 5 pièces de chaque type en stock (min 10 types)", cond:s=>{const vals=Object.values(s.parts??{});return vals.filter(p=>p.qty>=5).length>=10;}, reward:{rep:150,money:20000,talent:1} },
  { id:"part_auto_on",  cat:"Stock",       icon:"🤖", name:"Stock Pilote Auto",          desc:"Activer les commandes automatiques (Logiciel Stock niv.3)",       cond:s=>(s.upgrades?.find(u=>u.id==="logiciel_stock")?.lvl??0)>=3,  reward:{rep:200, money:30000,  talent:1} },
  { id:"part_topdrv10", cat:"Stock",       icon:"🔴", name:"Bonnes Affaires",            desc:"Commander 10 fois chez TopDrive (pièces sans malus)",             cond:s=>Object.values(s.parts??{}).filter(p=>p.supplier==="topdrive"&&p.qty>0).length>=3, reward:{rep:80,  money:5000,   talent:0} },
  { id:"part_val_10k",  cat:"Stock",       icon:"💰", name:"Stock de Valeur",            desc:"Avoir un stock de pièces valant plus de 10 000 € au total",       cond:s=>Object.values(s.parts??{}).reduce((a,p)=>a+(p.qty*(p.lastPrice??0)),0)>=10000,     reward:{rep:300, money:50000,  talent:1} },
  { id:"part_del_fast", cat:"Stock",       icon:"⚡", name:"Livraison Express",          desc:"Recevoir une livraison Euroline en moins de 10 secondes",         cond:s=>s._fastDelivery===true,                                     reward:{rep:200, money:20000,  talent:1} },

  // ── AMÉLIORATIONS ────────────────────────────────────
  { id:"up_first",     cat:"Améliorations",icon:"📦", name:"Premier Investissement",   desc:"Acheter une première amélioration",         cond:s=>s.upgrades?.some(u=>u.lvl>0),                                reward:{rep:5,    money:0,       talent:0} },
  { id:"up_10",        cat:"Améliorations",icon:"📦", name:"Équipé",                   desc:"10 niveaux d'améliorations au total",        cond:s=>s.upgrades?.reduce((a,u)=>a+u.lvl,0)>=10,                    reward:{rep:25,   money:1000,    talent:0} },
  { id:"up_50",        cat:"Améliorations",icon:"🔩", name:"Garage Équipé",            desc:"50 niveaux d'améliorations au total",        cond:s=>s.upgrades?.reduce((a,u)=>a+u.lvl,0)>=50,                    reward:{rep:100,  money:8000,    talent:0} },
  { id:"up_100",       cat:"Améliorations",icon:"🔩", name:"Atelier Pro",              desc:"100 niveaux d'améliorations au total",       cond:s=>s.upgrades?.reduce((a,u)=>a+u.lvl,0)>=100,                   reward:{rep:300,  money:30000,   talent:1} },
  { id:"up_200",       cat:"Améliorations",icon:"🔩", name:"Maître des Outils",        desc:"200 niveaux d'améliorations au total",       cond:s=>s.upgrades?.reduce((a,u)=>a+u.lvl,0)>=200,                   reward:{rep:800,  money:100000,  talent:2} },
  { id:"up_vendeur",   cat:"Améliorations",icon:"👔", name:"Vendeur Recruté",          desc:"Embaucher le Vendeur Junior",               cond:s=>(s.upgrades?.find(u=>u.id==="vendeur")?.lvl??0)>=1,           reward:{rep:30,   money:3000,    talent:0} },
  { id:"up_meca",      cat:"Améliorations",icon:"🛠️", name:"Mécanicien Recruté",       desc:"Embaucher le Mécanicien",                   cond:s=>(s.upgrades?.find(u=>u.id==="mecanicien")?.lvl??0)>=1,        reward:{rep:50,   money:5000,    talent:0} },
  { id:"up_meca_max",  cat:"Améliorations",icon:"🛠️", name:"Mécanicien Expert",        desc:"Mécanicien niveau 10",                      cond:s=>(s.upgrades?.find(u=>u.id==="mecanicien")?.lvl??0)>=10,       reward:{rep:300,  money:50000,   talent:1} },
  { id:"up_franchise", cat:"Améliorations",icon:"🏢", name:"Franchisé",               desc:"Acheter la Franchise Régionale",            cond:s=>(s.upgrades?.find(u=>u.id==="franchise")?.lvl??0)>=1,         reward:{rep:200,  money:0,       talent:1} },
  { id:"up_logiciel",  cat:"Améliorations",icon:"💻", name:"Gestion Numérique",        desc:"Acheter le Logiciel Stock niveau 1",        cond:s=>(s.upgrades?.find(u=>u.id==="logiciel_stock")?.lvl??0)>=1,   reward:{rep:40,   money:3000,    talent:0} },

  // ── TALENTS ──────────────────────────────────────────
  { id:"tal_first",    cat:"Talents",      icon:"⭐", name:"Premier Don",              desc:"Dépenser 1 point de talent",                cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=1,         reward:{rep:10,   money:500,     talent:0} },
  { id:"tal_10",       cat:"Talents",      icon:"⭐", name:"Arbre Naissant",           desc:"10 rangs de talents dépensés",              cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=10,        reward:{rep:30,   money:2000,    talent:0} },
  { id:"tal_50",       cat:"Talents",      icon:"🌟", name:"Maîtrise Avancée",         desc:"50 rangs de talents dépensés",              cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=50,        reward:{rep:100,  money:10000,   talent:0} },
  { id:"tal_100",      cat:"Talents",      icon:"🌟", name:"Développement Total",      desc:"100 rangs de talents dépensés",             cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=100,       reward:{rep:300,  money:30000,   talent:1} },
  { id:"tal_200",      cat:"Talents",      icon:"💫", name:"Arbre Complet",            desc:"200 rangs de talents dépensés",             cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=200,       reward:{rep:1000, money:100000,  talent:1} },
  { id:"tal_max1",     cat:"Talents",      icon:"💫", name:"Spécialiste",              desc:"Maxer un talent à 20/20",                   cond:s=>Object.values(s.talents??{}).some(v=>v>=20),                  reward:{rep:500,  money:50000,   talent:1} },
  { id:"tal_max3",     cat:"Talents",      icon:"💫", name:"Expert Polyvalent",        desc:"Maxer 3 talents à 20/20",                   cond:s=>Object.values(s.talents??{}).filter(v=>v>=20).length>=3,      reward:{rep:2000, money:200000,  talent:2} },

  // ── PRESTIGE ─────────────────────────────────────────
  { id:"prestige_1",   cat:"Prestige",     icon:"🔄", name:"Renaissance",              desc:"Effectuer un premier prestige",             cond:s=>(s.prestigeCount??0)>=1,    reward:{rep:0,    money:0,       talent:2} },
  { id:"prestige_3",   cat:"Prestige",     icon:"🔄", name:"Cycle Maîtrisé",           desc:"Effectuer 3 prestiges",                     cond:s=>(s.prestigeCount??0)>=3,    reward:{rep:0,    money:0,       talent:3} },
  { id:"prestige_5",   cat:"Prestige",     icon:"🔄", name:"Phénix",                   desc:"Effectuer 5 prestiges",                     cond:s=>(s.prestigeCount??0)>=5,    reward:{rep:0,    money:0,       talent:5} },
  { id:"prestige_10",  cat:"Prestige",     icon:"♾️", name:"L'Éternel Recommencement", desc:"Effectuer 10 prestiges",                    cond:s=>(s.prestigeCount??0)>=10,   reward:{rep:0,    money:0,       talent:8} },
  { id:"heritage_5",   cat:"Prestige",     icon:"🏛️", name:"Héritage Solide",          desc:"Dépenser 5 points Héritage",                cond:s=>(s.heritageSpent??0)>=5,    reward:{rep:100,  money:10000,   talent:0} },
  { id:"heritage_15",  cat:"Prestige",     icon:"🏛️", name:"Maître du Passé",          desc:"Dépenser 15 points Héritage",               cond:s=>(s.heritageSpent??0)>=15,   reward:{rep:500,  money:50000,   talent:1} },
  { id:"heritage_30",  cat:"Prestige",     icon:"🏛️", name:"Dynastique",               desc:"Dépenser 30 points Héritage",               cond:s=>(s.heritageSpent??0)>=30,   reward:{rep:2000, money:200000,  talent:2} },

  // ── SHOWROOM ─────────────────────────────────────────
  { id:"show_1",       cat:"Showroom",     icon:"🚘", name:"Première Expo",            desc:"Avoir 1 voiture au showroom",               cond:s=>s.showroom?.length>=1,      reward:{rep:5,    money:0,     talent:0} },
  { id:"show_3",       cat:"Showroom",     icon:"🚘", name:"Petite Expo",              desc:"Avoir 3 voitures au showroom",              cond:s=>s.showroom?.length>=3,      reward:{rep:20,   money:1000,    talent:0} },
  { id:"show_full",    cat:"Showroom",     icon:"🏪", name:"Showroom Plein",           desc:"Remplir complètement le showroom",          cond:s=>s.showroom?.length>0&&s.showroom.length>=(s.showroomCap??3)+(s.talentShowroomSlots??0), reward:{rep:50,money:5000,talent:0} },
  { id:"show_S",       cat:"Showroom",     icon:"🏆", name:"Voiture de Prestige",      desc:"Avoir une voiture tier S au showroom",      cond:s=>s.showroom?.some(c=>c.tier==="S"),    reward:{rep:150,  money:15000,   talent:0} },
  { id:"show_SS",      cat:"Showroom",     icon:"🏆", name:"Supercar en Vitrine",      desc:"Avoir une voiture tier SS au showroom",     cond:s=>s.showroom?.some(c=>c.tier==="SS"),   reward:{rep:500,  money:60000,   talent:1} },
  { id:"show_SSS",     cat:"Showroom",     icon:"💎", name:"Hypercar Exposée",         desc:"Avoir une voiture tier SSS au showroom",    cond:s=>s.showroom?.some(c=>c.tier==="SSS"),  reward:{rep:2000, money:300000,  talent:2} },
  { id:"show_SSSp",    cat:"Showroom",     icon:"💎", name:"Mythique en Vitrine",      desc:"Avoir une voiture SSS+ au showroom",        cond:s=>s.showroom?.some(c=>c.tier==="SSS+"), reward:{rep:8000, money:2000000, talent:3} },

  // ── DIVERS ────────────────────────────────────────────
  { id:"session_1h",   cat:"Divers",       icon:"⏱️", name:"Joueur Assidu",            desc:"Jouer 1 heure au total",                    cond:s=>Date.now()-(s.sessionStart??Date.now())>=3600000,            reward:{rep:0,   money:10000,    talent:0} },
  { id:"session_5h",   cat:"Divers",       icon:"⏱️", name:"Passionné",               desc:"Jouer 5 heures au total",                   cond:s=>Date.now()-(s.sessionStart??Date.now())>=18000000,           reward:{rep:0,   money:50000,    talent:0} },
  { id:"save_first",   cat:"Divers",       icon:"💾", name:"Données Sécurisées",       desc:"Sauvegarder la partie",                     cond:s=>s._hasSaved===true,                                          reward:{rep:0,    money:0,     talent:0} },
  { id:"name_change",  cat:"Divers",       icon:"✏️", name:"Mon Garage, Mes Règles",  desc:"Renommer ton garage",                       cond:s=>s.garageName!=="Garage Turbo",                               reward:{rep:0,   money:0,     talent:0} },
  { id:"profile_set",  cat:"Divers",       icon:"👤", name:"Identité Établie",         desc:"Personnaliser ton profil",                  cond:s=>s.profile?.pseudo!=="Mécanicien"&&s.profile?.pseudo!=null,   reward:{rep:0,   money:0,     talent:0} },
  { id:"full_garage",  cat:"Divers",       icon:"🔥", name:"Garage Complet",           desc:"Remplir tous les emplacements",             cond:s=>{const occ=(s.active?1:0)+(s.queue?.length??0);return occ>0&&occ>=s.garageCap;}, reward:{rep:0,money:0,talent:0} },
  { id:"rich_repair",  cat:"Divers",       icon:"💸", name:"Réparer du Luxe",          desc:"Réparer une voiture de tier A ou +",        cond:s=>["A","S","SS","SSS","SSS+"].includes(s._lastRepairedTier??""),reward:{rep:50,   money:5000,    talent:0} },
  { id:"broke",        cat:"Divers",       icon:"😅", name:"Dans le Rouge",            desc:"Passer sous 10 €",                          cond:s=>s._wasBroke===true,                                          reward:{rep:0,    money:0,     talent:0} },
  { id:"auto_sell",    cat:"Divers",       icon:"🤝", name:"Vendeur Automatique",      desc:"Embaucher le Vendeur Junior",               cond:s=>(s.upgrades?.find(u=>u.id==="vendeur")?.lvl??0)>=1,          reward:{rep:0,   money:500,    talent:0} },
  { id:"prestige_prep",cat:"Divers",       icon:"🎯", name:"Prêt au Départ",           desc:"Atteindre le niveau 50 de garage",          cond:s=>s.garageLevel>=50,                                           reward:{rep:100,  money:20000,   talent:0} },

  // ── VENTES CUMULÉES (toutes parties) ────────────────
  { id:"total_sold_500",  cat:"Ventes",       icon:"🚗", name:"Demi-Millier Cumulé",       desc:"Vendre 500 voitures au total (tous prestiges)",    cond:s=>(s.totalCarsSold??0)>=500,       reward:{rep:100,  money:10000,   talent:0} },
  { id:"total_sold_2k",   cat:"Ventes",       icon:"🚙", name:"Deux Mille Cumulés",        desc:"Vendre 2 000 voitures au total",                   cond:s=>(s.totalCarsSold??0)>=2000,      reward:{rep:300,  money:40000,   talent:1} },
  { id:"total_sold_10k",  cat:"Ventes",       icon:"🏎️", name:"Dix Mille Cumulés",        desc:"Vendre 10 000 voitures au total",                  cond:s=>(s.totalCarsSold??0)>=10000,     reward:{rep:800,  money:150000,  talent:2} },
  { id:"total_sold_50k",  cat:"Ventes",       icon:"🏁", name:"Cinquante Mille Cumulés",   desc:"Vendre 50 000 voitures au total",                  cond:s=>(s.totalCarsSold??0)>=50000,     reward:{rep:3000, money:800000,  talent:3} },
  { id:"total_sold_200k", cat:"Ventes",       icon:"👑", name:"Deux Cent Mille Cumulés",   desc:"Vendre 200 000 voitures au total",                 cond:s=>(s.totalCarsSold??0)>=200000,    reward:{rep:10000,money:3000000, talent:5} },

  // ── ARGENT CUMULÉ ────────────────────────────────────
  { id:"earned_500m",     cat:"Argent",       icon:"🏦", name:"Demi-Milliard Gagné",       desc:"Avoir gagné 500 000 000 € au total",               cond:s=>(s.totalMoneyEarned??0)>=500000000,    reward:{rep:1500, money:0,       talent:2} },
  { id:"earned_5b",       cat:"Argent",       icon:"🏦", name:"Cinq Milliards Gagnés",     desc:"Avoir gagné 5 000 000 000 € au total",             cond:s=>(s.totalMoneyEarned??0)>=5000000000,   reward:{rep:5000, money:0,       talent:3} },
  { id:"earned_50b",      cat:"Argent",       icon:"🏦", name:"Cinquante Milliards",       desc:"Avoir gagné 50 000 000 000 € au total",            cond:s=>(s.totalMoneyEarned??0)>=50000000000,  reward:{rep:15000,money:0,       talent:5} },
  { id:"passive_5k",      cat:"Argent",       icon:"📊", name:"Rente de Milliardaire",     desc:"Atteindre 5 000 €/s de revenu passif",             cond:s=>s.moneyPerSec>=5000,             reward:{rep:2000, money:500000,  talent:2} },
  { id:"passive_20k",     cat:"Argent",       icon:"📊", name:"Banque Centrale",           desc:"Atteindre 20 000 €/s de revenu passif",            cond:s=>s.moneyPerSec>=20000,            reward:{rep:8000, money:2000000, talent:4} },
  { id:"money_10b",       cat:"Argent",       icon:"💎", name:"Dix Milliards en Caisse",   desc:"Avoir 10 000 000 000 € en caisse",                 cond:s=>s.money>=10000000000,            reward:{rep:5000, money:0,       talent:3} },

  // ── RÉPUTATION HAUTE ────────────────────────────────
  { id:"rep_500k",        cat:"Réputation",   icon:"🔱", name:"Superstar Mondiale",        desc:"Atteindre 500 000 REP",                            cond:s=>s.rep>=500000,                   reward:{rep:0,    money:2000000, talent:3} },
  { id:"rep_1m",          cat:"Réputation",   icon:"🔱", name:"Dieu de l'Asphalte",        desc:"Atteindre 1 000 000 REP",                          cond:s=>s.rep>=1000000,                  reward:{rep:0,    money:5000000, talent:5} },
  { id:"rep_5m",          cat:"Réputation",   icon:"⚜️", name:"Intouchable",               desc:"Atteindre 5 000 000 REP",                          cond:s=>s.rep>=5000000,                  reward:{rep:0,    money:20000000,talent:8} },

  // ── NIVEAU GARAGE HIGH ───────────────────────────────
  { id:"lvl_200",         cat:"Garage",       icon:"🌆", name:"Méga Complexe",             desc:"Atteindre le niveau 200",                          cond:s=>s.garageLevel>=200,              reward:{rep:5000, money:2000000, talent:3} },
  { id:"lvl_300",         cat:"Garage",       icon:"🌇", name:"Corporation",               desc:"Atteindre le niveau 300",                          cond:s=>s.garageLevel>=300,              reward:{rep:12000,money:5000000, talent:5} },
  { id:"lvl_500",         cat:"Garage",       icon:"🌃", name:"Monopole de l'Auto",        desc:"Atteindre le niveau 500",                          cond:s=>s.garageLevel>=500,              reward:{rep:30000,money:15000000,talent:8} },

  // ── RÉPARATIONS CUMULÉES ────────────────────────────
  { id:"total_rep_5k",    cat:"Atelier",      icon:"🛠️", name:"Cinq Mille Réparations",   desc:"Effectuer 5 000 réparations au total",             cond:s=>(s.totalRepairs??0)>=5000,       reward:{rep:500,  money:100000,  talent:1} },
  { id:"total_rep_20k",   cat:"Atelier",      icon:"⚙️", name:"Vingt Mille Réparations",  desc:"Effectuer 20 000 réparations au total",            cond:s=>(s.totalRepairs??0)>=20000,      reward:{rep:2000, money:500000,  talent:2} },
  { id:"total_rep_100k",  cat:"Atelier",      icon:"⚙️", name:"Cent Mille Réparations",   desc:"Effectuer 100 000 réparations au total",           cond:s=>(s.totalRepairs??0)>=100000,     reward:{rep:8000, money:2000000, talent:5} },
  { id:"speed_5x",        cat:"Atelier",      icon:"🚀", name:"Vitesse Lumière",           desc:"Multiplicateur de vitesse ≥ 5×",                   cond:s=>(s.speedMult??1)*(s.talentSpeedMult??1)>=5,  reward:{rep:2000, money:500000,  talent:3} },
  { id:"speed_10x",       cat:"Atelier",      icon:"🚀", name:"Distorsion Temporelle",     desc:"Multiplicateur de vitesse ≥ 10×",                  cond:s=>(s.speedMult??1)*(s.talentSpeedMult??1)>=10, reward:{rep:8000, money:2000000, talent:5} },
  { id:"auto_10ps",       cat:"Atelier",      icon:"🤖", name:"Atelier Fantôme",           desc:"Atteindre 10 s/s de réparation automatique",       cond:s=>(s.repairAuto??0)+(s.talentRepairAuto??0)>=10,  reward:{rep:500,  money:50000,   talent:1} },
  { id:"auto_50ps",       cat:"Atelier",      icon:"🤖", name:"Intelligence Artificielle", desc:"Atteindre 50 s/s de réparation automatique",       cond:s=>(s.repairAuto??0)+(s.talentRepairAuto??0)>=50,  reward:{rep:3000, money:500000,  talent:3} },
  { id:"click_200k",      cat:"Atelier",      icon:"🥊", name:"Dieu du Clic",              desc:"Effectuer 200 000 clics de réparation",            cond:s=>(s.totalClickRepairs??0)>=200000,  reward:{rep:2000, money:200000,  talent:2} },
  { id:"click_1m",        cat:"Atelier",      icon:"🥊", name:"Millionnaire du Clic",      desc:"Effectuer 1 000 000 clics de réparation",          cond:s=>(s.totalClickRepairs??0)>=1000000, reward:{rep:8000, money:1000000, talent:4} },

  // ── DIAGNOSTIC CUMULÉ ───────────────────────────────
  { id:"total_diag_50k",  cat:"Diagnostic",   icon:"🧠", name:"Cinquante Mille Scans",     desc:"Effectuer 50 000 diagnostics au total",            cond:s=>(s.totalAnalyses??0)>=50000,     reward:{rep:2000, money:300000,  talent:2} },
  { id:"total_diag_200k", cat:"Diagnostic",   icon:"🧠", name:"Deux Cent Mille Scans",     desc:"Effectuer 200 000 diagnostics au total",           cond:s=>(s.totalAnalyses??0)>=200000,    reward:{rep:8000, money:1000000, talent:4} },
  { id:"diag_reward3",    cat:"Diagnostic",   icon:"💡", name:"Scanner Légendaire",        desc:"Avoir +500 € par diagnostic",                      cond:s=>s.diagReward>=500,               reward:{rep:1000, money:100000,  talent:2} },
  { id:"diag_reward4",    cat:"Diagnostic",   icon:"💡", name:"Oracle Mécanique",          desc:"Avoir +1 000 € par diagnostic",                    cond:s=>s.diagReward>=1000,              reward:{rep:5000, money:500000,  talent:4} },

  // ── STOCK HIGH END ───────────────────────────────────
  { id:"part_qty50",      cat:"Stock",        icon:"📦", name:"Entrepôt Débordant",        desc:"Avoir 50 unités d'une même pièce en stock",        cond:s=>Object.values(s.parts??{}).some(p=>p.qty>=50),   reward:{rep:500,  money:50000,   talent:1} },
  { id:"part_qty200",     cat:"Stock",        icon:"📦", name:"Revendeur Grossiste",       desc:"Avoir 200 unités d'une même pièce en stock",       cond:s=>Object.values(s.parts??{}).some(p=>p.qty>=200),  reward:{rep:2000, money:200000,  talent:2} },
  { id:"part_slots_max",  cat:"Stock",        icon:"🚛", name:"Hub Logistique",            desc:"Avoir 10 slots de livraison simultanés",           cond:s=>(s.upgrades?.find(u=>u.id==="slots_livraison")?.lvl??0)>=9, reward:{rep:500,money:80000,talent:1} },

  // ── PRESTIGE HIGH END ────────────────────────────────
  { id:"prestige_20",     cat:"Prestige",     icon:"♾️", name:"Cycle Infini",              desc:"Effectuer 20 prestiges",                           cond:s=>(s.prestigeCount??0)>=20,        reward:{rep:0,    money:0,       talent:15} },
  { id:"prestige_50",     cat:"Prestige",     icon:"♾️", name:"Au-Delà du Temps",          desc:"Effectuer 50 prestiges",                           cond:s=>(s.prestigeCount??0)>=50,        reward:{rep:0,    money:0,       talent:30} },
  { id:"heritage_50",     cat:"Prestige",     icon:"🏛️", name:"Maître Héritier",           desc:"Dépenser 50 points Héritage",                      cond:s=>(s.heritageSpent??0)>=50,        reward:{rep:5000, money:500000,  talent:4} },
  { id:"heritage_80",     cat:"Prestige",     icon:"⚜️", name:"Arbre Généalogique Complet",desc:"Dépenser 80 points Héritage",                      cond:s=>(s.heritageSpent??0)>=80,        reward:{rep:15000,money:2000000, talent:8} },

  // ── SHOWROOM HIGH END ────────────────────────────────
  { id:"show_cap10",      cat:"Showroom",     icon:"🏪", name:"Grand Showroom",            desc:"Avoir 10 emplacements showroom",                   cond:s=>(s.showroomCap??3)+(s.talentShowroomSlots??0)>=10,          reward:{rep:400,  money:80000,   talent:1} },
  { id:"show_sold_SSS",   cat:"Showroom",     icon:"💎", name:"Collectionneur d'Hypercars",desc:"Réparer et avoir eu une voiture SSS en showroom",  cond:s=>s._lastRepairedTier==="SSS"&&s.showroom?.some(c=>c.tier==="SSS"), reward:{rep:3000,money:500000,talent:2} },

  // ── AMÉLIORATIONS HIGH END ───────────────────────────
  { id:"up_300",          cat:"Améliorations",icon:"🔩", name:"Optimisation Totale",       desc:"300 niveaux d'améliorations au total",             cond:s=>s.upgrades?.reduce((a,u)=>a+u.lvl,0)>=300,  reward:{rep:2000, money:300000,  talent:2} },
  { id:"up_500",          cat:"Améliorations",icon:"💡", name:"Génie de la Mécanique",     desc:"500 niveaux d'améliorations au total",             cond:s=>s.upgrades?.reduce((a,u)=>a+u.lvl,0)>=500,  reward:{rep:8000, money:1000000, talent:4} },
  { id:"up_all_maxed",    cat:"Améliorations",icon:"🏆", name:"Maître Absolu",             desc:"Toutes les améliorations au niveau maximum",       cond:s=>s.upgrades?.filter(u=>u.maxLvl).every(u=>u.lvl>=(u.maxLvl??0)), reward:{rep:5000,money:2000000,talent:6} },

  // ── TALENTS HIGH END ─────────────────────────────────
  { id:"tal_300",         cat:"Talents",      icon:"🌟", name:"Transcendance",             desc:"300 rangs de talents dépensés",                    cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=300,  reward:{rep:3000, money:500000,  talent:2} },
  { id:"tal_max_all",     cat:"Talents",      icon:"💫", name:"Maîtrise Totale",           desc:"Maxer les 15 talents à leur rang maximum",         cond:s=>{const t=s.talents??{};return ["passive_1","passive_2","sale_1","sale_2","showroom_1","rare_bonus_1","speed_1","speed_2","click_1","multi_repair_1","parts_2","diag_1","diag_2","diag_3"].every(id=>(t[id]??0)>=20)&&(t["parts_1"]??0)>=10;}, reward:{rep:20000,money:10000000,talent:10} },

  // ── COMBOS & DÉFIS ───────────────────────────────────
  { id:"combo_rich_fast", cat:"Défis",        icon:"⚡", name:"Riche et Rapide",           desc:"Avoir 1M€ ET vitesse ≥ 3× en même temps",         cond:s=>s.money>=1000000&&(s.speedMult??1)*(s.talentSpeedMult??1)>=3,                        reward:{rep:500,  money:0,       talent:1} },
  { id:"combo_full_boch", cat:"Défis",        icon:"🔵", name:"Full Bochmann",             desc:"Avoir 20 pièces différentes en stock Bochmann",    cond:s=>Object.values(s.parts??{}).filter(p=>p.supplier==="bochmann"&&p.qty>0).length>=20, reward:{rep:1000, money:200000,  talent:2} },
  { id:"combo_no_click",  cat:"Défis",        icon:"🤝", name:"Le Patron ne Touche Plus",  desc:"Avoir 20+ s/s répa auto ET réputation 10 000+",   cond:s=>(s.repairAuto??0)+(s.talentRepairAuto??0)>=20&&s.rep>=10000,                        reward:{rep:0,    money:500000,  talent:2} },
  { id:"combo_tier_speed",cat:"Défis",        icon:"🏁", name:"Turbo Légendaire",          desc:"Avoir réparé une SSS+ ET vitesse ≥ 5×",           cond:s=>s._lastRepairedTier==="SSS+"&&(s.speedMult??1)*(s.talentSpeedMult??1)>=5,           reward:{rep:5000, money:1000000, talent:4} },
  { id:"combo_diag_pass", cat:"Défis",        icon:"📡", name:"Machine à Diagnostics",     desc:"Avoir 500€/diag ET 500€/s passif",                 cond:s=>s.diagReward>=500&&s.moneyPerSec>=500,                                              reward:{rep:2000, money:300000,  talent:2} },
  { id:"combo_prestige_ss",cat:"Défis",       icon:"🔄", name:"Prestige de Luxe",          desc:"Effectuer un prestige avec tier SS débloqué",      cond:s=>(s.prestigeCount??0)>=1&&s.rep>=70000,                                              reward:{rep:0,    money:500000,  talent:2} },

  // ── SESSIONS LONGUES ─────────────────────────────────
  { id:"session_24h",     cat:"Divers",       icon:"🌙", name:"Nuit Blanche",              desc:"Jouer 24 heures au total",                         cond:s=>Date.now()-(s.sessionStart??Date.now())>=86400000,   reward:{rep:0,  money:50000,   talent:1} },
  { id:"session_100h",    cat:"Divers",       icon:"🏆", name:"Vétéran",                   desc:"Jouer 100 heures au total",                        cond:s=>Date.now()-(s.sessionStart??Date.now())>=360000000,  reward:{rep:0, money:500000,  talent:2} },
];

// State des succès (débloqués)
if(!state.achievements) state.achievements = {};
if(!state._hasSaved)    state._hasSaved    = false;
if(!state._wasBroke)    state._wasBroke    = false;
if(!state._lastRepairedTier) state._lastRepairedTier = "";

let _achPopupQueue   = [];
let _achPopupShowing = false;
let _achNotifsEnabled = (() => { try { return localStorage.getItem("garage_ach_notifs") !== "false"; } catch(e){ return true; } })();

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
  try { localStorage.setItem("garage_ach_notifs", _achNotifsEnabled); } catch(e){}
  updateAchNotifBtn();
});

// Init bouton au chargement
updateAchNotifBtn();

// Liste des succès pas encore débloqués — se réduit dynamiquement
let _pendingAchievements = null;
function resetPendingAchievements(){
  _pendingAchievements = ACHIEVEMENTS.filter(a => !state.achievements?.[a.id]);
}

function checkAchievements(){
  // Mise à jour flags spéciaux
  if(state.money < 10) state._wasBroke = true;

  // Init lazy si besoin
  if(!_pendingAchievements) resetPendingAchievements();

  const unlocked = [];
  for(const ach of _pendingAchievements){
    try {
      if(!ach.cond(state)) continue;
    } catch(e){ continue; }

    // Débloquer
    state.achievements[ach.id] = Date.now();
    unlocked.push(ach.id);

    // Appliquer récompenses
    if(ach.reward.rep)    state.rep    += ach.reward.rep;
    if(ach.reward.money){
      state.money += ach.reward.money;
      state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + ach.reward.money;
    }
    if(ach.reward.talent) state.talentPoints += ach.reward.talent;

    // Ajouter à la queue de popup seulement si notifs activées
    if(_achNotifsEnabled){
      _achPopupQueue.push(ach);
      showNextAchievementPopup();
    }
  }

  // Purger les succès débloqués de la liste pending
  if(unlocked.length > 0){
    _pendingAchievements = _pendingAchievements.filter(a => !state.achievements[a.id]);
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

  // V2 — Confetti pour les succès prestige et tier SSS+
  if(typeof confetti !== "undefined"){
    const isGold = ach.cat === "Prestige" || ach.id === "tier_SSSp" || ach.reward.talent >= 3;
    if(isGold){
      setTimeout(() => confetti({
        particleCount: 100, spread: 70, origin: { y: 0.35 },
        colors: ["#ffc83a","#ff8c40","#ffffff","#a07aff"]
      }), 100);
    }
  }

  setTimeout(() => {
    popup.classList.remove("achievementPopup--show");
    setTimeout(() => {
      popup.style.display = "none";
      _achPopupShowing = false;
      showNextAchievementPopup();
    }, 350);
  }, 3500);
}

// P2 — Popup de milestone (niveaux marquants)
const MILESTONE_LABELS = {
  10:  { icon:"🏠", label:"Garage Opérationnel",  color:"#48c78e" },
  25:  { icon:"🏗️", label:"Expansion Majeure",     color:"#7ab0ff" },
  50:  { icon:"🏗️", label:"Centre Auto",           color:"#a07aff" },
  75:  { icon:"🏢", label:"Groupe Automobile",      color:"#ffc83a" },
  100: { icon:"🏢", label:"Complexe Automobile",    color:"#ff8c40" },
  150: { icon:"🌆", label:"Empire Industriel",      color:"#ff4d70" },
  200: { icon:"👑", label:"Légende de l'Asphalte",  color:"#ffffff" },
};

function showMilestonePopup(level){
  const m = MILESTONE_LABELS[level];
  if(!m) return;
  // Réutilise le popup achievement existant avec un style spécial
  const popup = document.getElementById("achievementPopup");
  if(!popup || _achPopupShowing) return;
  _achPopupShowing = true;

  const iconEl    = document.getElementById("popupIcon");
  const nameEl    = document.getElementById("popupName");
  const descEl    = document.getElementById("popupDesc");
  const rewardEl  = document.getElementById("popupRewards");
  if(iconEl)   iconEl.textContent  = m.icon;
  if(nameEl){  nameEl.textContent  = `Niveau ${level} !`; nameEl.style.color = m.color; }
  if(descEl)   descEl.textContent  = m.label;
  if(rewardEl){ rewardEl.innerHTML = `<span class="achievementPopup__rewardPill" style="background:${m.color}22;color:${m.color};border:1px solid ${m.color}44">🏆 Jalon atteint</span>`; }

  const sweep = popup.querySelector(".achievementPopup__sweep");
  if(sweep){ sweep.style.animation="none"; void sweep.offsetWidth; sweep.style.animation=""; }
  const fill = document.getElementById("popupProgressFill");
  if(fill){ fill.style.animation="none"; void fill.offsetWidth; fill.style.animation="achDrain 3.5s linear forwards"; }

  // V2 — Confetti sur les milestones
  if(typeof confetti !== "undefined"){
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.3 }, colors: [m.color, "#ffffff", "#ffc83a"] });
  }

  popup.style.display = "flex";
  requestAnimationFrame(() => popup.classList.add("achievementPopup--show"));
  setTimeout(() => {
    popup.classList.remove("achievementPopup--show");
    setTimeout(() => {
      popup.style.display = "none";
      _achPopupShowing = false;
      if(nameEl) nameEl.style.color = ""; // reset couleur
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
// LocalSave interval supprimé — cloud only
setInterval(() => { if(_authReady && currentUser) _saveService.save(currentUser.id); }, CONFIG.CLOUD_SAVE_INTERVAL);
setInterval(() => { if(currentUser) pushLeaderboard(); }, CONFIG.LB_PUSH_INTERVAL);

// Sauvegarde d'urgence à la fermeture de page (persist savedAt pour le catchup au reload)
window.addEventListener("beforeunload", () => { save(); });

// Évite le spike de dt quand l'onglet redevient visible après une longue absence
document.addEventListener("visibilitychange", () => {
  if(document.visibilityState === "hidden"){
    // Enregistre l'heure de départ en arrière-plan
    last = performance.now();
    save();
  } else {
    // Retour sur l'onglet : calculer le temps écoulé et l'appliquer
    const now = performance.now();
    const offlineSec = (now - last) / 1000;

    if(offlineSec > 2){
      // Plafond : max 4h de progression offline (évite les abus)
      const catchup = Math.min(offlineSec, 4 * 3600);

      // Appliquer en plusieurs petits ticks pour ne pas saturer la logique
      const STEP = 30; // chunks de 30s
      let remaining = catchup;
      _isOfflineCatchup = true;
      try {
        while(remaining > 0){
          const dt = Math.min(remaining, STEP);
          applyTickLogic(dt);
          remaining -= dt;
        }
      } finally {
        _isOfflineCatchup = false;
      }

      // Notif si gain significatif
      if(catchup >= 60){
        const mins = Math.floor(catchup / 60);
        showToast(`⏱️ Progression hors-ligne : ${mins} min rattrapées`);
      }

      renderAll();
    }

    last = now;
  }
});

// Fallback auth timeout — affiche le login wall si Supabase ne répond pas
setTimeout(() => {
  if(!_authReady && !currentUser){
    dbg("[init] auth timeout — affichage login wall");
    showLoginWall();
  }
}, 5000);

// =====================
// LEADERBOARD MONDIAL
// =====================

let _lbTab = "prestige";

// Push le score du joueur connecté dans la table leaderboard
async function pushLeaderboard(){
  if(!currentUser) return;
  try {
    const p = state.profile || {};
    await _supa.from("leaderboard").upsert({
      user_id:       currentUser.id,
      pseudo:        (p.pseudo || "Mécanicien").substring(0, 30),
      garage_name:   (state.garageName || "Garage Turbo").substring(0, 40),
      avatar:        p.avatar || "🔧",
      country:       p.country || "FR",
      prestige_count: state.prestigeCount ?? 0,
      garage_level:   state.garageLevel ?? 1,
      cars_sold:      state.totalCarsSold ?? 0,
      total_money:    Math.floor(state.totalMoneyEarned ?? 0),
      updated_at:     new Date().toISOString(),
    }, { onConflict: "user_id" });
  } catch(e){ dbg("[leaderboard] push erreur:", e.message); }
}

async function fetchLeaderboard(tab){
  const colMap = {
    prestige: { col:"prestige_count", label:"Prestiges", fmt: v => `🔥 ${v}` },
    level:    { col:"garage_level",   label:"Niveau",    fmt: v => `Niv. ${v}` },
    money:    { col:"total_money", label:"Argent total gagné", fmt: v => formatMoney(v) },
    sold:     { col:"cars_sold",      label:"Voitures",  fmt: v => `${v.toLocaleString()} 🚗` },
  };
  const { col, fmt } = colMap[tab] || colMap.prestige;

  const { data, error } = await _supa
    .from("leaderboard")
    .select("user_id,pseudo,garage_name,avatar,country,prestige_count,garage_level,cars_sold,total_money,updated_at")
    .order(col, { ascending: false })
    .limit(50);

  if(error) throw error;
  return { rows: data || [], fmt, col };
}

function renderLeaderboardRows(rows, fmt, col){
  const lbList = document.getElementById("lbList");
  if(!rows.length){
    lbList.innerHTML = `<div style="text-align:center;color:var(--muted);padding:40px 0;">Aucun joueur pour l'instant…</div>`;
    return;
  }

  const medals = ["🥇","🥈","🥉"];
  const rankClass = ["lbRow--gold","lbRow--silver","lbRow--bronze"];
  const rankTextClass = ["lbRank--gold","lbRank--silver","lbRank--bronze"];

  let myRowHTML = "";
  let html = "";

  rows.forEach((r, i) => {
    const isMe = currentUser && r.user_id === currentUser.id;
    const rank = i + 1;
    const medal = rank <= 3 ? medals[rank-1] : rank;
    const medalClass = rank <= 3 ? rankTextClass[rank-1] : "";
    const rowClass = isMe ? "lbRow lbRow--me" : `lbRow ${rank <= 3 ? rankClass[rank-1] : ""}`;
    const value = r[col];
    const country = (r.country || "").toUpperCase();
    const flagHtml = country && country !== "OTHER" && country.length === 2
      ? `<img src="https://flagcdn.com/16x12/${country.toLowerCase()}.png" width="16" height="12" style="border-radius:2px;vertical-align:middle;margin-right:4px;" alt="${country}" onerror="this.style.display='none'">`
      : `<span style="font-size:12px;margin-right:4px;">🌍</span>`;
    const prestigeTag = r.prestige_count > 0
      ? `<span class="lbPrestigePip">🔥 ${r.prestige_count}</span>` : "";
    const lastSeen = r.updated_at ? new Date(r.updated_at).toLocaleDateString("fr-FR") : "";

    const rowHTML = `
      <div class="${rowClass}">
        <div class="lbRank ${medalClass}">${medal}</div>
        <div class="lbPlayer">
          <div class="lbGarage">${r.avatar || "🔧"} ${r.garage_name || "Garage Turbo"}</div>
          <div class="lbMeta">${flagHtml} ${r.pseudo || "Mécanicien"} ${prestigeTag} <span style="opacity:.4">· ${lastSeen}</span></div>
        </div>
        <div class="lbValue">${fmt(value ?? 0)}</div>
      </div>`;

    html += rowHTML;
    if(isMe) myRowHTML = rowHTML;
  });

  lbList.innerHTML = html;

  // Ma position en bas si connecté
  const myRowEl = document.getElementById("lbMyRow");
  if(myRowHTML && currentUser){
    myRowEl.style.display = "block";
    myRowEl.innerHTML = `<div style="font-size:11px;color:var(--muted);margin-bottom:6px;font-weight:700;">MA POSITION</div>${myRowHTML}`;
  } else {
    myRowEl.style.display = "none";
  }
}

async function loadLeaderboard(){
  const lbList = document.getElementById("lbList");
  lbList.innerHTML = `<div style="text-align:center;color:var(--muted);padding:40px 0;">Chargement…</div>`;
  try {
    const { rows, fmt, col } = await fetchLeaderboard(_lbTab);
    document.getElementById("lbSubtitle").textContent = `Top ${rows.length} joueurs`;
    renderLeaderboardRows(rows, fmt, col);
  } catch(e){
    lbList.innerHTML = `<div style="text-align:center;color:#ff5a5a;padding:40px 0;">Erreur de chargement — réessaie plus tard</div>`;
    dbg("[leaderboard] fetch erreur:", e.message);
  }
}

function openLeaderboard(){
  document.getElementById("leaderboardModal").style.display = "flex";
  loadLeaderboard();
}
function closeLeaderboard(){
  document.getElementById("leaderboardModal").style.display = "none";
}

// Listeners leaderboard
document.getElementById("btnLeaderboard")?.addEventListener("click", openLeaderboard);
document.getElementById("btnLeaderboardClose")?.addEventListener("click", closeLeaderboard);
document.getElementById("leaderboardBackdrop")?.addEventListener("click", closeLeaderboard);
document.getElementById("btnLbRefresh")?.addEventListener("click", loadLeaderboard);

document.getElementById("lbTabs")?.addEventListener("click", e => {
  const btn = e.target.closest(".lbTab");
  if(!btn) return;
  _lbTab = btn.dataset.lbtab;
  document.querySelectorAll(".lbTab").forEach(b => b.classList.remove("lbTab--active"));
  btn.classList.add("lbTab--active");
  loadLeaderboard();
});