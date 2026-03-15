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
    { id:"manual",  tab:"tools", icon:"📘", name:"Manuel de Réparation", lvl:0, desc:"+2€ par diag", cost:94 },
    { id:"toolbox", tab:"tools", icon:"🧰", name:"Caisse à Outils",      lvl:0, desc:"+0.05 Puissance Répa. Clic", cost:268 },
    { id:"obd",     tab:"tools", icon:"🔎", name:"Scanner OBD Basique",   lvl:0, desc:"+10€ par diag", cost:337 },
    { id:"impact",  tab:"tools", icon:"⚡", name:"Perceuse Pneumatique",  lvl:0, desc:"+0.08 Puissance Répa. Clic", cost:800 },
    { id:"comp",    tab:"tools", icon:"🌀", name:"Compresseur Pro",       lvl:0, desc:"+10% Vitesse Réparation", cost:3500 },
    { id:"impact2", tab:"tools", icon:"🔧", name:"Pistolet à Choc",       lvl:0, desc:"+0.12 Puissance Répa. Clic", cost:7500 },
    { id:"diagpro",         tab:"tools", icon:"🧠", name:"Station Diag Pro",         lvl:0, desc:"+40€ par diag",                                                                                               cost:12000   },
    { id:"scanner_pro",      tab:"tools", icon:"🔬", name:"Scanner Pro X",          lvl:0, desc:"Bonus diag selon le tier de la voiture · F=+15€ · S=+800€ · SSS+=+6000€ (×rang) · 🔒 Prestige 3",              cost:800000,  maxLvl:3 },
    { id:"cle_dynamometrique",tab:"tools", icon:"🔩", name:"Clé Dynamométrique",     lvl:0, desc:"+0.5s retirées par clic par rang · 🔒 Prestige 4",                                                              cost:1000000         },
    { id:"turbocompresseur", tab:"tools", icon:"🚀", name:"Turbocompresseur",        lvl:0, desc:"+15% vitesse de réparation par rang (clic + auto) · 🔒 Prestige 5",                                             cost:1200000         },

    // ÉQUIPE
    { id:"stagiaire",        tab:"team", icon:"🧑‍🔧", name:"Stagiaire Accueil",    lvl:0, desc:"Diagnostique auto toutes les 15s au niv.1 (min 6s au niv.max) · −1s par rang",                    cost:15000,  maxLvl:10 },
    { id:"receptionnaire",   tab:"team", icon:"📋",    name:"Réceptionnaire",        lvl:0, desc:"Accélère le diagnostic auto jusqu'à 1s (prérequis : Stagiaire niv.10)", cost:120000, maxLvl:10 },
    { id:"vendeur",          tab:"team", icon:"👔",    name:"Vendeur Junior",         lvl:0, desc:"Vend auto toutes les 15s au niv.1 (min 6s au niv.max) · −1s par rang",                 cost:25000,  maxLvl:10 },
    { id:"vendeur_confirme", tab:"team", icon:"🤵",    name:"Vendeur Confirmé",       lvl:0, desc:"Accélère la vente auto jusqu'à 1s (prérequis : Vendeur Junior niv.10)", cost:502687, maxLvl:10 },
    { id:"vendeur_expert",   tab:"team", icon:"🏆",    name:"Vendeur Expert",         lvl:0, desc:"−0.1s au plancher de vente auto par rang (min 0.5s) · 🔒 Prestige 5 · Vendeur Confirmé max", cost:1200000, maxLvl:5 },
    { id:"ia_diagnostic",    tab:"team", icon:"🤖",    name:"IA Diagnostic",          lvl:0, desc:"−0.1s au plancher de diagnostic auto par rang (min 0.5s) · 🔒 Prestige 5 · Réceptionnaire max", cost:1200000, maxLvl:5 },
    { id:"chef_atelier",     tab:"team", icon:"👑",    name:"Chef d'Atelier",         lvl:0, desc:"+1 slot de réparation simultanée par rang (max 5) · Chaque slot supplémentaire subit −10% de vitesse par position · 🔒 Prestige 7", cost:900000, maxLvl:5 },
    { id:"apprenti",         tab:"team", icon:"🔩",    name:"Apprenti Mécanicien",   lvl:0, desc:"+0.15s/s de réparation auto par rang",                                  cost:12000 },
    { id:"mecanicien",       tab:"team", icon:"🛠️",   name:"Mécanicien",             lvl:0, desc:"+0.5s/s de réparation auto par rang",                                   cost:80000 },

    // AFFAIRES — revenus passifs
    { id:"loc_outils",        tab:"deals", icon:"🔑",  name:"Location d'Outils",      lvl:0, desc:"+2 €/s de revenu passif",                                                  cost:6000 },
    { id:"contrat_taxi",      tab:"deals", icon:"🚕",  name:"Contrat Taxi Local",      lvl:0, desc:"+5 €/s de revenu passif",                                                  cost:8000 },
    { id:"assurance",    tab:"deals", icon:"📋",  name:"Partenariat Assurance",   lvl:0, desc:"+10 €/s de revenu passif",  cost:20000 },
    { id:"atelier_nuit", tab:"deals", icon:"🌙",  name:"Atelier de Nuit",         lvl:0, desc:"+20 €/s de revenu passif",  cost:50000 },
    { id:"franchise",         tab:"deals", icon:"🏢",  name:"Franchise Régionale",     lvl:0, desc:"+50 €/s de revenu passif",                                                  cost:150000 },
    { id:"reseau_national",   tab:"deals", icon:"💼",  name:"Réseau National",          lvl:0, desc:"+100 €/s de revenu passif · 🔒 Prestige 2",                                  cost:500000 },
    { id:"holding_auto",      tab:"deals", icon:"🏦",  name:"Holding Automobile",       lvl:0, desc:"+250 €/s de revenu passif · 🔒 Prestige 4",                                  cost:2000000 },
    { id:"showroom_slot",     tab:"deals", icon:"🖼️", name:"Extension Showroom",       lvl:0, desc:"+2 emplacements showroom (max 4 achats → 11 max)",                           cost:35000,  maxLvl:4 },
    { id:"galerie_marchande", tab:"deals", icon:"🏬",  name:"Galerie Marchande",        lvl:0, desc:"+2 emplacements showroom par rang · 🔒 Prestige 2 · Extension Showroom max", cost:300000, maxLvl:4 },
    { id:"expo_premium",      tab:"deals", icon:"🖼️",  name:"Exposition Premium",        lvl:0, desc:"+1 slot d'exposition dans votre Garage Personnel par rang · 🔒 Prestige 1",      cost:500000, maxLvl:4 },
    { id:"nego",              tab:"deals", icon:"🧾",  name:"Formation Négociation",    lvl:0, desc:"+5% valeur de vente",                                                        cost:1000 },
    { id:"lift",              tab:"deals", icon:"🅿️", name:"Agrandissement Garage",    lvl:0, desc:"+1 Emplacement de garage",                                                   cost:5000,   maxLvl:5 },
    { id:"extension_atelier", tab:"deals", icon:"🔧",  name:"Extension Atelier",        lvl:0, desc:"+1 emplacement garage par rang · 🔒 Prestige 3 · Agrandissement Garage max", cost:400000, maxLvl:4 },

    // PIÈCES DÉTACHÉES
    { id:"magasinier",      tab:"stock", icon:"📦", name:"Magasinier",      lvl:0, desc:"-20% délai livraison par rang",                                               cost:40000, maxLvl:3 },
    { id:"logiciel_stock",  tab:"stock", icon:"📊", name:"Logiciel Stock",  lvl:0, desc:"Niv.1: alertes rupture · Niv.2: seuils configurables · Niv.3: commandes auto", cost:80000, maxLvl:3 },
    { id:"slots_livraison", tab:"stock", icon:"🚛", name:"Slots Livraison", lvl:0, desc:"Niv.1→9 : +1 livraison simultanée par rang (max 10)",                         cost:20000, maxLvl:9 },

    // ENTREPÔT
    { id:"etageres",        tab:"stock", icon:"📚", name:"Étagères Basiques",    lvl:0, desc:"+20 slots entrepôt par rang",                                         cost:8000,   maxLvl:10 },
    { id:"rayonnage",       tab:"stock", icon:"🏗️", name:"Rayonnage Métallique", lvl:0, desc:"+50 slots entrepôt par rang",                                         cost:35000,  maxLvl:10 },
    { id:"zone_logistique", tab:"stock", icon:"🏭", name:"Zone Logistique",      lvl:0, desc:"+100 slots entrepôt par rang · livraisons 10% plus vite par rang",     cost:150000, maxLvl:5  },
    { id:"entrepot_auto",   tab:"stock", icon:"🤖", name:"Entrepôt Automatisé",  lvl:0, desc:"+200 slots par rang · +2% valeur revente si pièces en stock par rang", cost:600000, maxLvl:5  },
  ],
};

// =====================
// GARAGE LEVELING
// =====================
// Cache O(1) pour les lookups upgrades — DOIT être déclaré ici (avant tout listener)
let _upgradeMap = {};
function rebuildUpgradeMap(){
  _upgradeMap = {};
  for(const u of state.upgrades) _upgradeMap[u.id] = u;
}
function getUpgrade(id){ return _upgradeMap[id] ?? state.upgrades.find(u => u.id === id); }

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
  let passiveMult  = 1.0; // passive_3 : +5%/rang sur tous les passifs (T3 Business)
  let speedMult    = 1.0;
  let diagBonus    = 0;
  let diagMult     = 1.0; // multiplicateur final sur la récompense totale (diag_3)
  let diagAutoDisc = 0;   // réservé future use
  let saleBonus    = 0;
  let saleMult     = 1.0; // sale_mult_1 : +2%/rang multiplicateur ventes (T3 Business)
  let clickBonus   = 0;
  let showroomSlots= 0;
  let rareMult     = 1.0; // multiplicateur valeur voitures S+
  let repairAuto   = 0;
  let repairBonus  = 0;   // repair_bonus_1 : +50€/rang bonus fixe par réparation (T1 Atelier)
  let repairMult   = 1.0; // repair_mult_1  : +3%/rang multiplicateur sur repairBonus (T3 Atelier)
  let repGainBonus = 0;   // rep_1 : +5%/rang REP par vente (T1 Diagnostic)
  let diagRepBonus = 0;   // diag_rep_1 : +2 REP par diag manuel (T2 Diagnostic)
  let deliveryDisc = 0;
  let extraSlots   = 0;
  let warehouseBonus = 0; // logistique_avancee : +50 slots/rang

  // ── Business ────────────────────────────────────────
  passive      += getTalentRank("passive_1")    * 5;
  passive      += getTalentRank("passive_2")    * 20;
  passiveMult  *= (1 + getTalentRank("passive_3")   * 0.05);
  saleBonus    += getTalentRank("sale_1")       * 0.03;
  saleBonus    += getTalentRank("sale_2")       * 0.08;
  saleMult     *= (1 + getTalentRank("sale_mult_1") * 0.02);
  showroomSlots += getTalentRank("showroom_1");
  rareMult     *= (1 + getTalentRank("rare_bonus_1") * 0.03);

  // ── Atelier ─────────────────────────────────────────
  speedMult    *= (1 + getTalentRank("speed_1")         * 0.04);
  speedMult    *= (1 + getTalentRank("speed_2")         * 0.07);
  repairBonus  += getTalentRank("repair_bonus_1")       * 50;
  clickBonus   += getTalentRank("click_1")              * 0.10;
  repairAuto   += getTalentRank("multi_repair_1")       * 0.5;
  repairMult   *= (1 + getTalentRank("repair_mult_1")   * 0.03);
  deliveryDisc  = Math.min(0.30, getTalentRank("parts_1") * 0.015); // -1.5%/rang, plafonné à -30%
  extraSlots   += Math.floor(getTalentRank("parts_2") / 5);
  warehouseBonus += getTalentRank("logistique_avancee") * 50; // +50 slots/rang

  // ── Diagnostic ──────────────────────────────────────
  diagBonus    += getTalentRank("diag_1")       * 3  * 2;   // ×2
  diagBonus    += getTalentRank("diag_2")       * 8  * 2;   // ×2
  diagMult     *= (1 + getTalentRank("diag_3")  * 0.05);
  repGainBonus += getTalentRank("rep_1")        * 0.05;
  diagRepBonus += getTalentRank("diag_rep_1")   * 2;

  return { passive, passiveMult, speedMult, diagBonus, diagMult, diagAutoDisc, saleBonus, saleMult,
           clickBonus, showroomSlots, rareMult, repairAuto, repairBonus, repairMult,
           repGainBonus, diagRepBonus, deliveryDisc, extraSlots, warehouseBonus };
}

function calcDealsPassive(){
  const rates = { loc_outils:2, contrat_taxi:5, assurance:10, atelier_nuit:20, franchise:50, reseau_national:100, holding_auto:250 };
  let total = 0;
  for(const [id, rate] of Object.entries(rates)){
    const u = getUpgrade(id);
    if(u) total += u.lvl * rate;
  }
  return total;
}

function applyTalentEffects(){
  const fx = computeTalentEffects();

  // Appliquer la spécialisation avant de combiner avec les talents
  if(typeof applySpecializationEffects === 'function') applySpecializationEffects();

  state.moneyPerSec         = (fx.passive + calcDealsPassive() + (state.heritageBonuses?.passiveBonus ?? 0))
                              * (state.specPassiveMult ?? 1.0)
                              * fx.passiveMult;        // passive_3 : +5%/rang
  state.talentSpeedMult     = fx.speedMult * (state.specSpeedMult ?? 1.0);
  state.talentDiagBonus     = fx.diagBonus;
  state.talentDiagMult      = fx.diagMult  * (state.specDiagMult  ?? 1.0);
  state.talentSaleBonus     = fx.saleBonus;
  state.talentClickBonus    = fx.clickBonus;
  state.talentShowroomSlots = fx.showroomSlots;
  state.talentRareMult      = fx.rareMult  * (state.specRareMult  ?? 1.0);
  state.talentRepairAuto    = fx.repairAuto * (state.specAutoMult  ?? 1.0);
  state.talentRepairBonus   = fx.repairBonus;
  state.talentRepairMult    = fx.repairMult;
  state.talentSaleMult      = fx.saleMult;
  state.talentRepGainBonus  = fx.repGainBonus;
  state.talentDiagRepBonus  = fx.diagRepBonus;
  state.talentDeliveryDisc  = Math.min(0.90, fx.deliveryDisc + (state.specDeliveryDisc ?? 0));
  state.talentExtraSlots    = Math.round(fx.extraSlots * (state.specDeliverySlotsMult ?? 1.0));
  state.talentWarehouseBonus = fx.warehouseBonus;
}

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
// Trackers run actuel (remis à 0 au prestige)
if(!state.runMoneyPassive)   state.runMoneyPassive   = 0;
if(!state.runMoneySales)     state.runMoneySales     = 0;
if(!state.runMoneyDiag)      state.runMoneyDiag      = 0;
if(!state.runMoneyParts)     state.runMoneyParts     = 0;
if(!state.totalActionClicks) state.totalActionClicks = 0;
if(!state.totalOrders)       state.totalOrders       = 0;
if(!state.manualCarsSold)    state.manualCarsSold    = 0;  // ventes manuelles uniquement (défis)
if(!state.manualOrders)      state.manualOrders      = 0;  // commandes manuelles uniquement (défis)
if(!state.challenges)        state.challenges        = null;
if(!state.sessionStart)      state.sessionStart      = Date.now();
if(!state.specialization)    state.specialization    = null;
if(state.specialization2 === undefined) state.specialization2 = null;
if(state._isAutoOrder === undefined)    state._isAutoOrder    = false;
if(!state.bestTier)          state.bestTier          = null;
if(!state.repMax)            state.repMax             = 0;
// Rareté
if(!state.bestRarity)           state.bestRarity           = "common";
if(!state.totalEpicSeen)        state.totalEpicSeen        = 0;
if(!state.totalLegendarySold)   state.totalLegendarySold   = 0;
if(!state.totalMythicRepaired)  state.totalMythicRepaired  = 0;
if(!state.totalMythicSold)      state.totalMythicSold      = 0;
// Garage Personnel (collection)
if(!state.collection)           state.collection           = [];   // voitures exposées
if(!state.collectionCap)        state.collectionCap        = 1;    // 1 slot au départ
if(!state.collectionRepAccu)    state.collectionRepAccu    = 0;    // accumulateur REP/s
// Règles vente auto globales
if(!state.autoSellRules) state.autoSellRules = { blockedRarities:[], blockedTiers:[], blockedCombos:[] };
// Historique graphiques (ring buffer 120 points max)
if(!state.history) state.history = {
  moneyPerSec: [],  // { t, v }
  rep:         [],  // { t, v }
};
if(!state._historyTimer) state._historyTimer = 0;
// Compteur voitures par tier (cross-prestige)
if(!state.carsSoldByTier) state.carsSoldByTier = {};
// Encyclopédie
if(!state.carBook)              state.carBook              = {};   // { carName: { seen, repaired, bestRarity, bestSale, allRarities } }
// Effets de spécialisation (recalculés à chaque applySpecializationEffects)
if(!state.specSpeedMult)         state.specSpeedMult         = 1.0;
if(!state.specAutoMult)          state.specAutoMult          = 1.0;
if(!state.specSaleMult)          state.specSaleMult          = 1.0;
if(!state.specPassiveMult)       state.specPassiveMult       = 1.0;
if(!state.specDiagMult)          state.specDiagMult          = 1.0;
if(!state.specRareMult)          state.specRareMult          = 1.0;
if(!state.specRepMult)           state.specRepMult           = 1.0;
if(!state.specRepReqMult)        state.specRepReqMult        = 1.0;
if(state.specShowroomCap === undefined) state.specShowroomCap = null;
if(!state.specDeliverySlotsMult) state.specDeliverySlotsMult = 1.0;
if(!state.specDeliveryDisc)      state.specDeliveryDisc      = 0.0;
if(!state.specPartsValueBonus)   state.specPartsValueBonus   = 0.0;
if(state.talentWarehouseBonus === undefined) state.talentWarehouseBonus = 0;

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

    <div class="statSection statSection--activity">
      <div class="statSection__title"><span class="statSection__titleIcon">✨</span>Rareté & Collection</div>
      ${(()=>{
        const br = state.bestRarity ?? "common";
        const brData = typeof RARITY_TABLE !== "undefined" ? RARITY_TABLE[br] : null;
        const collIncome = typeof calcCollectionTotalIncome !== "undefined" ? calcCollectionTotalIncome() : {moneyPerSec:0,repPerSec:0};
        return `
          <div class="statRow"><span class="statRow__label">Meilleure rareté</span><span class="statRow__val" style="color:${brData?.color??'#aaa'}">${brData?.icon??''} ${brData?.label??'Commune'}</span></div>
          <div class="statRow"><span class="statRow__label">Épiques+ vues</span><span class="statRow__val statRow__val--purple">${(state.totalEpicSeen??0).toLocaleString("fr-FR")}</span></div>
          <div class="statRow"><span class="statRow__label">Légendaires vendues</span><span class="statRow__val statRow__val--gold">${(state.totalLegendarySold??0).toLocaleString("fr-FR")}</span></div>
          <div class="statRow"><span class="statRow__label">Mythiques réparées</span><span class="statRow__val" style="color:#ff4d70">${(state.totalMythicRepaired??0).toLocaleString("fr-FR")}</span></div>
          <div class="statRow"><span class="statRow__label">Voitures en expo</span><span class="statRow__val" style="color:#ffc83a">${(state.collection?.length??0)} / ${state.collectionCap??1}</span></div>
          <div class="statRow"><span class="statRow__label">Revenus expo</span><span class="statRow__val statRow__val--green">${formatMoney(collIncome.moneyPerSec)}/s · ${collIncome.repPerSec.toFixed(2)} REP/s</span></div>
          <div class="statRow"><span class="statRow__label">Encyclopédie découvertes</span><span class="statRow__val" style="color:#4a9eff">${Object.values(state.carBook??{}).filter(e=>e.seen).length} / ${typeof CAR_CATALOG!=="undefined"?CAR_CATALOG.length:324}</span></div>
          <div class="statRow"><span class="statRow__label">Encyclopédie familières</span><span class="statRow__val" style="color:#2ee59d">${Object.values(state.carBook??{}).filter(e=>(typeof getCarBookMastery!=="undefined"?getCarBookMastery(e):0)>=2).length} / ${typeof CAR_CATALOG!=="undefined"?CAR_CATALOG.length:324}</span></div>
          <div class="statRow"><span class="statRow__label">Encyclopédie maîtrisées</span><span class="statRow__val" style="color:#ffc83a">${Object.values(state.carBook??{}).filter(e=>(typeof getCarBookMastery!=="undefined"?getCarBookMastery(e):0)>=3).length} / ${typeof CAR_CATALOG!=="undefined"?CAR_CATALOG.length:324}</span></div>
        `;
      })()}
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
// GAMEPLAY HELPERS
// =====================

// Nombre de slots de réparation simultanée (Chef d'Atelier)
function getActiveRepairSlots(){
  const chefLvl = getUpgrade("chef_atelier")?.lvl || 0;
  return 1 + chefLvl; // 1 slot de base + 1 par rang
}

// Malus de vitesse pour un slot donné (0-indexé : slot 0 = pas de malus)
function getSlotSpeedMalus(slotIndex){
  const baseRed = state.heritageBonuses?.expChefMalusRed ?? 0; // exp_chef : -2%/rang
  const malus = Math.max(0, slotIndex * 0.10 - baseRed * slotIndex);
  return Math.max(0.1, 1 - malus); // plancher 10% pour éviter malus 0 ou négatif
}

function tryStartNextRepair(){
  const slots = getActiveRepairSlots();
  // Remplir state.active (slot 0)
  if(!state.active){
    const next = state.queue.shift();
    if(next){
      state.active = next;
      _activeJustStarted = true;
    }
  }
  // Remplir state.actives[] (slots 1…N-1)
  if(!state.actives) state.actives = [];
  for(let i = 0; i < slots - 1; i++){
    if(!state.actives[i]){
      const next = state.queue.shift();
      if(next) state.actives[i] = next;
    }
  }
  // Nettoyer les slots désactivés si le niveau a baissé (prestige etc.)
  state.actives = state.actives.slice(0, slots - 1);
}

// Temps de réparation estimé en tenant compte de tous les multiplicateurs actifs
function calcEstimatedRepairTime(car){
  const partsMult  = getPartsSpeedMult(car);           // 0.5 si pièce manquante, sinon timeMult qualité
  const speedMult  = (state.speedMult ?? 1) * (state.talentSpeedMult ?? 1) * partsMult;
  const secPerSec  = (state.repairAuto + (state.talentRepairAuto ?? 0)) * speedMult;
  if(secPerSec <= 0) return null;                      // pas de réparation auto active
  const remaining = car.timeRemaining ?? car.repairTime;
  return Math.round(remaining / secPerSec);             // secondes réelles estimées
}

function calcSaleValue(car){
  const bonus = 1 + state.saleBonusPct + (state.talentSaleBonus ?? 0);
  // Boost REP temporaire du Marché Héritage
  if(state._heritageRepBoost && Date.now() > state._heritageRepBoost.until){
    state._heritageRepBoost = null; // expiré
  }
  // Spécialisation : multiplicateur global de vente
  const specSale = state.specSaleMult ?? 1.0;
  // Spécialisation Logistique : bonus pièces amplifié
  const partsValueMult = getPartsValueMult(car);
  const partsBonus = state.specPartsValueBonus ?? 0;
  const partsMult = partsValueMult > 1
    ? 1 + (partsValueMult - 1) * (1 + partsBonus)
    : partsValueMult;
  const rareTiers = ["S","SS","SSS","SSS+"];
  const rareMult  = rareTiers.includes(car.tier) ? (state.talentRareMult ?? 1) : 1;
  const saleMult  = state.talentSaleMult ?? 1.0; // sale_mult_1 : +2%/rang multiplicateur global
  // entrepot_auto : +2%/rang si la voiture a été réparée avec des pièces du stock
  // + héritage log_parts_val_1 : +5%/rang supplémentaire
  const heritagePartsBonus = car.repairedFromStock ? (state.heritageBonuses?.partsValueBonus ?? 0) : 0;
  const warehouseBonus = (car.repairedFromStock && typeof getWarehouseValueBonus === "function")
    ? (1 + getWarehouseValueBonus() + heritagePartsBonus) : 1.0;
  const rarityMult = (typeof RARITY_TABLE !== "undefined") ? (RARITY_TABLE[car.rarity ?? "common"]?.multSale ?? 1.0) : 1.0;
  return Math.round(car.baseValue * bonus * specSale * partsMult * rareMult * saleMult * warehouseBonus * rarityMult);
}

function finishRepair(slotIndex = 0){
  const car = slotIndex === 0 ? state.active : state.actives?.[slotIndex - 1];
  if(!car) return;

  state._lastRepairedTier = car.tier;
  const TIER_ORDER = ["F","E","D","C","B","A","S","SS","SSS","SSS+"];
  const curBest = state.bestTier ?? "F";
  if(TIER_ORDER.indexOf(car.tier) > TIER_ORDER.indexOf(curBest)){
    state.bestTier = car.tier;
  }
  // ── Stats rareté ─────────────────────────────────────────────────────
  if(typeof RARITY_ORDER !== "undefined"){
    const _fRarity = car.rarity ?? "common";
    const _fIdx = RARITY_ORDER.indexOf(_fRarity);
    if(_fIdx > RARITY_ORDER.indexOf(state.bestRarity ?? "common")) state.bestRarity = _fRarity;
    if(_fRarity === "mythic")   state.totalMythicRepaired = (state.totalMythicRepaired ?? 0) + 1;
    if(_fIdx >= RARITY_ORDER.indexOf("epic")) state.totalEpicSeen = (state.totalEpicSeen ?? 0) + 1;
  }
  // ── Encyclopédie ───────────────────────────────────────────────────────
  _updateCarBook(car, "repaired");
  const cap = getShowroomCap();
  if(state.showroom.length >= cap){
    return;
  }

  // Consommer les pièces
  if(car.failure?.parts?.length){
    const avgQuality = consumeParts(car.failure.parts, car);
    if(avgQuality !== null){
      car.partsQuality = avgQuality;
      const firstPart = car.failure.parts[0];
      car.partsSupplier = state.parts?.[firstPart]?.supplier ?? null;
    } else {
      car.partsQuality = 2.5;
      car.partsSupplier = null;
    }
  }

  state.showroom.unshift(car);
  _showroomJustAdded = true;

  // Libérer le slot
  if(slotIndex === 0) state.active = null;
  else state.actives[slotIndex - 1] = null;

  state.totalRepairs = (state.totalRepairs ?? 0) + 1;

  // Bonus réparation (talent repair_bonus_1)
  const rb = (state.talentRepairBonus ?? 0);
  if(rb > 0){
    const gain = Math.round(rb * (state.talentRepairMult ?? 1.0));
    state.money += gain;
    state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + gain;
    state.runMoneyRepair   = (state.runMoneyRepair   ?? 0) + gain;
  }

  tryStartNextRepair();
  if(!_isOfflineCatchup){
    _needsFullRender = true;
    checkPokedexTierCompletion();
  }
}

function applyRepairTime(seconds, slotIndex = 0){
  const car = slotIndex === 0 ? state.active : state.actives?.[slotIndex - 1];
  if(!car) return;
  car.timeRemaining -= seconds;
  if(car.timeRemaining <= 0){
    finishRepair(slotIndex);
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

  const activeCount = (state.active ? 1 : 0) + (state.actives?.filter(Boolean).length ?? 0);
  const occupied = activeCount + state.queue.length;
  if (occupied >= state.garageCap) return;

  const diagGain = Math.round((state.diagReward + (state.talentDiagBonus ?? 0)) * (state.talentDiagMult ?? 1));
  if(isFinite(diagGain) && diagGain > 0) {
    state.money += diagGain;
    state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + diagGain;
    state.runMoneyDiag     = (state.runMoneyDiag     ?? 0) + diagGain;
    spawnFloatText("+" + formatMoney(diagGain), "diag", document.getElementById("btnAnalyze"));
  }
  // Scanner Pro X : bonus selon le tier de la voiture qui vient d'être diagnostiquée
  const newCar = state.queue[state.queue.length]; // pas encore push
  // On crée la voiture d'abord pour connaître son tier
  const diagCar = makeCar();
  const scanBonus = calcScannerProBonus(diagCar);
  if(scanBonus > 0){
    state.money += scanBonus;
    state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + scanBonus;
    state.runMoneyDiag     = (state.runMoneyDiag     ?? 0) + scanBonus;
    spawnFloatText("+" + formatMoney(scanBonus) + " 🔬", "diag", document.getElementById("btnAnalyze"));
  }
  state.totalAnalyses = (state.totalAnalyses ?? 0) + 1;
  // diag_rep_1 : +2 REP par diag manuel par rang
  const drb = state.talentDiagRepBonus ?? 0;
  if(drb > 0){ state.rep += drb; if(state.rep > (state.repMax??0)) state.repMax = state.rep; }
  // Spécialisation Centre Diagnostic : +1 pt talent toutes les 100 analyses
  if(state.specialization === "diag" && state.totalAnalyses % 100 === 0){
    state.talentPoints = (state.talentPoints ?? 0) + 1;
    showToast("🔍 +1 point talent (100 diagnostics !)");
  }
  // Défi actions : compter le diag (place était disponible, sinon on aurait return plus haut)
  state.totalActionClicks = (state.totalActionClicks ?? 0) + 1;
  state.queue.push(diagCar);
  // ── Animation rareté ─────────────────────────────────────────────────
  if(typeof RARITY_TABLE !== "undefined"){
    const _nr = diagCar.rarity ?? "common";
    if(_nr === "mythic"){
      // Flash fullscreen
      let _mf = document.getElementById("rarityFullscreenFlash");
      if(!_mf){
        _mf = document.createElement("div");
        _mf.id = "rarityFullscreenFlash";
        _mf.style.cssText = "position:fixed;inset:0;z-index:99998;pointer-events:none;opacity:0;background:radial-gradient(ellipse at center,rgba(255,77,112,0.45) 0%,transparent 70%);transition:opacity .15s";
        document.body.appendChild(_mf);
      }
      _mf.style.opacity = "1";
      setTimeout(() => { _mf.style.opacity = "0"; }, 600);
      // Émettre sur le bus (confetti + toast gérés par mitt-bus.js)
      window.gtEmit?.("car:mythic", { car: diagCar, el: btnAnalyze });
      // Fallback si bus pas encore prêt
      if(!window.GT_BUS){ showToast("🔴 MYTHIQUE ! " + diagCar.name); burstMythic?.(btnAnalyze); }
    } else if(_nr === "legendary"){
      btnAnalyze.classList.add("btnAnalyze--flash-legendary");
      setTimeout(() => btnAnalyze.classList.remove("btnAnalyze--flash-legendary"), 700);
      window.gtEmit?.("car:legendary", { car: diagCar, el: btnAnalyze });
      if(!window.GT_BUS){ showToast("✨ Voiture Légendaire ! " + diagCar.name); burstLegendary?.(btnAnalyze); }
    } else if(_nr === "epic"){
      window.gtEmit?.("car:epic", { car: diagCar, el: btnAnalyze });
      if(!window.GT_BUS){
        btnAnalyze.classList.add("btnAnalyze--flash-epic");
        setTimeout(() => btnAnalyze.classList.remove("btnAnalyze--flash-epic"), 500);
      }
    }
  }
  tryStartNextRepair();
  _needsFullRender = true;
});

btnRepairClick.addEventListener("click", () => {
  const now = Date.now();
  if(now - _lastRepairClick < CONFIG.CLICK_COOLDOWN_MS) return;
  _lastRepairClick = now;

  const baseClick = (state.repairClick + (state.talentClickBonus ?? 0));
  const baseMult  = (state.speedMult ?? 1) * (state.talentSpeedMult ?? 1);

  // Slot 0 — principal, pas de malus
  if(state.active){
    applyRepairTime(baseClick * baseMult, 0);
    state.totalClickRepairs = (state.totalClickRepairs ?? 0) + 1;
    state.totalActionClicks = (state.totalActionClicks ?? 0) + 1;
  }

  // Slots supplémentaires — avec malus de position
  if(state.actives){
    for(let i = 0; i < state.actives.length; i++){
      if(state.actives[i]){
        const malus = getSlotSpeedMalus(i + 1);
        applyRepairTime(baseClick * baseMult * malus, i + 1);
        state.totalClickRepairs = (state.totalClickRepairs ?? 0) + 1;
      }
    }
  }

  // Animation ripple + shake
  btnRepairClick.classList.remove("clicked");
  void btnRepairClick.offsetWidth;
  btnRepairClick.classList.add("clicked");
  setTimeout(() => btnRepairClick.classList.remove("clicked"), 350);

  renderActive();
});

let _lastSellClick = 0;
// Délégation onglets showroom (forsale / protected) — survit aux re-renders
showroomListEl.addEventListener("click", (e) => {
  const stabBtn = e.target.closest("[data-stab]");
  if(stabBtn){
    if(typeof _showroomTab !== "undefined" && typeof renderShowroom === "function"){
      window._showroomTab = stabBtn.dataset.stab;
      // Mettre à jour la variable dans render.js
      renderShowroom();
    }
    return;
  }
});

// Listener vente / expose — séparé pour ne pas être bloqué par le cooldown lors d'un clic sur les onglets
showroomListEl.addEventListener("click", (e) => {
  const now = Date.now();
  if(now - _lastSellClick < CONFIG.CLICK_COOLDOWN_MS) return;
  _lastSellClick = now;

  // ── Bouton "Exposer" → collection ───────────────────────────────────
  const exposeBtn = e.target.closest("[data-expose]");
  if(exposeBtn){
    const id  = exposeBtn.getAttribute("data-expose");
    const idx = state.showroom.findIndex(c => c.id === id);
    if(idx === -1) return;
    if((state.collection?.length ?? 0) >= getCollectionCap()){
      showToast("🏠 Garage plein ! Améliorez votre espace d'exposition.");
      return;
    }
    const [car] = state.showroom.splice(idx, 1);
    addToCollection(car);
    _needsFullRender = true;
    save();
    return;
  }

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
    const _partsMult = getPartsValueMult(car);
    const _baseVal   = Math.round(car.baseValue * (1 + state.saleBonusPct + (state.talentSaleBonus ?? 0)) * (typeof getPartsValueMult !== 'undefined' ? 1 : 1));
    const _partsBonus = (_partsMult > 1) ? Math.round(saleValue - saleValue / _partsMult) : 0;
    state.runMoneySales    = (state.runMoneySales ?? 0) + saleValue;
    state.runMoneyParts    = (state.runMoneyParts  ?? 0) + _partsBonus;
    spawnFloatText("+" + formatMoney(saleValue), "money", btnPos);
  }
  const tierData = TIERS[car.tier] || TIERS["F"];
  const repMult = (state.heritageBonuses?.repGainMult ?? 1.0)
    * (state._heritageRepBoost && Date.now() < state._heritageRepBoost.until ? state._heritageRepBoost.mult : 1.0);
  const _manualRarityRepMult = (typeof RARITY_TABLE !== "undefined") ? (RARITY_TABLE[car.rarity ?? "common"]?.multRep ?? 1.0) : 1.0;
  const repGain = Math.round(tierData.repGain * repMult * (state.specRepMult ?? 1.0) * (1 + (state.talentRepGainBonus ?? 0)) * _manualRarityRepMult);
  if(isFinite(repGain)) {
    state.rep += repGain;
    if(state.rep > (state.repMax ?? 0)) state.repMax = state.rep;
    setTimeout(() => spawnFloatText("+" + repGain + " REP", "rep", btnPos), 120);
  }
  if(typeof RARITY_ORDER !== "undefined"){
    const _sr = car.rarity ?? "common";
    if(_sr === "legendary") state.totalLegendarySold = (state.totalLegendarySold ?? 0) + 1;
    if(_sr === "mythic")    state.totalMythicSold    = (state.totalMythicSold    ?? 0) + 1;
  }
  _updateCarBook(car, "sold", saleValue);
  if(!state.carsSoldByTier) state.carsSoldByTier = {};
  state.carsSoldByTier[car.tier] = (state.carsSoldByTier[car.tier] ?? 0) + 1;
  state.carsSold += 1;
  state.totalCarsSold  = (state.totalCarsSold  ?? 0) + 1;
  state.manualCarsSold = (state.manualCarsSold ?? 0) + 1;  // défi : ventes manuelles
  if(typeof trackChallengeSale === 'function') trackChallengeSale(car.tier);
  // Défi actions : clic vente manuelle (showroom n'était pas vide, sinon pas de bouton)
  state.totalActionClicks = (state.totalActionClicks ?? 0) + 1;
  updateGarageLevel();

  state.showroom.splice(idx, 1);

  _needsFullRender = true;
});

const UPGRADE_MULT = {
  manual:1.25, toolbox:1.25, obd:1.25, impact:1.25, comp:1.25, impact2:1.25, diagpro:1.25,
  nego:1.25, lift:1.25,
  scanner_pro:1.80, cle_dynamometrique:1.60, turbocompresseur:1.70,
  loc_outils:1.28, contrat_taxi:1.28, assurance:1.28, atelier_nuit:1.30, franchise:1.32,
  reseau_national:1.35, holding_auto:1.40,
  showroom_slot:1.30,
  expo_premium:2.00,
  galerie_marchande:2.00, extension_atelier:2.00,
  stagiaire:1.35, receptionnaire:1.40, vendeur:1.35, vendeur_confirme:1.40,
  vendeur_expert:2.00, ia_diagnostic:2.00, chef_atelier:2.00,
  apprenti:1.30, mecanicien:1.35,
  magasinier:4.00, logiciel_stock:4.00, slots_livraison:2.00,
  etageres:2.00, rayonnage:3.00, zone_logistique:4.00, entrepot_auto:5.00,
};


// =====================
// UPGRADE TAGS — pour le système de filtre
// =====================
const UPGRADE_TAGS = {
  // Outils
  manual:       ["diagnostic"],
  toolbox:      ["vitesse"],
  obd:          ["diagnostic"],
  impact:       ["vitesse"],
  nego:         ["vente"],
  comp:         ["vitesse"],
  lift:         ["vitesse"],
  impact2:      ["vitesse"],
  diagpro:      ["diagnostic"],
  showroom_slot:["vente"],
  scanner_pro:        ["diagnostic"],
  cle_dynamometrique: ["vitesse"],
  turbocompresseur:   ["vitesse"],
  // Équipe
  stagiaire:        ["diagnostic"],
  receptionnaire:   ["diagnostic"],
  vendeur:          ["vente"],
  vendeur_confirme: ["vente"],
  vendeur_expert:   ["vente"],
  ia_diagnostic:    ["diagnostic"],
  chef_atelier:     ["vitesse"],
  apprenti:         ["vitesse"],
  mecanicien:       ["vitesse"],
  // Contrats
  loc_outils:   ["argent"],
  contrat_taxi: ["argent"],
  assurance:    ["argent"],
  atelier_nuit: ["argent"],
  franchise:    ["argent"],
  reseau_national: ["argent"],
  holding_auto:    ["argent"],
  nego:            ["vente"],
  showroom_slot:   ["vente"],
  galerie_marchande: ["vente"],
  expo_premium:      ["vente"],
  expo_premium:      ["vente"],
  lift:              ["vitesse"],
  extension_atelier: ["vitesse"],
  // Stock
  magasinier:       ["stock"],
  logiciel_stock:   ["stock"],
  slots_livraison:  ["stock"],
  etageres:         ["stock"],
  rayonnage:        ["stock"],
  zone_logistique:  ["stock"],
  entrepot_auto:    ["stock","vente"],
};

// L1 — Achat upgrade : après achat, rebuildUpgradeMap() est appelé AVANT applyTalentEffects()
// et AVANT recalcRepairAuto(). Ne pas inverser l'ordre.
upgradeListEl.addEventListener("pointerdown", (e) => {
  // pointerdown se déclenche dès le premier contact, avant que le tick
  // puisse recréer le DOM entre mousedown et mouseup (ce qui annulait le click)
  const btn = e.target.closest("[data-buy]");
  // Ne pas intercepter les boutons de navigation (stockNav, etc.)
  if(!btn || e.target.closest("[data-sview]")) return;
  e.preventDefault(); // évite le double-déclenchement éventuel avec click

  const id = btn.getAttribute("data-buy");
  const u = getUpgrade(id);
  if(!u) return;
  if(state.money < u.cost) return;
  if(u.maxLvl !== undefined && u.lvl >= u.maxLvl) return;

  state.money -= u.cost;
  u.lvl += 1;

// EFFETS (version "temps", cohérente)
if(id === "manual")  state.diagReward += 2;
if(id === "obd")     state.diagReward += 10;

// ✅ clic = secondes retirées par clic (petits gains)
if(id === "toolbox") state.repairClick += 0.05;   // était 0.10 — +0.05/lvl
if(id === "impact")  state.repairClick += 0.08;   // était 0.15 — +0.08/lvl
if(id === "impact2") state.repairClick += 0.12;   // était 0.25 — +0.12/lvl

// ✅ vente / vitesse / capacité
if(id === "nego")    state.saleBonusPct += 0.05;
if(id === "comp")    state.speedMult *= 1.10;
if(id === "lift")              state.garageCap  += 1;
if(id === "chef_atelier")      state.garageCap  += 1;
if(id === "cle_dynamometrique") state.repairClick += 0.5;
if(id === "turbocompresseur")   state.speedMult  *= 1.15;
if(id === "diagpro") state.diagReward += 40;
if(id === "showroom_slot")    state.showroomCap = (state.showroomCap ?? 3) + 2;
if(id === "galerie_marchande") state.showroomCap = (state.showroomCap ?? 3) + 2;
if(id === "extension_atelier") state.garageCap  += 1;
if(id === "expo_premium"){
  state.collectionCap = (state.collectionCap ?? 1) + 1;
  if(typeof renderCollection === "function") requestAnimationFrame(renderCollection);
}

// Équipe auto-repair : on recalcule repairAuto depuis les niveaux
if(id === "apprenti" || id === "mecanicien") recalcRepairAuto();

  // coût scale
  u.cost = Math.ceil(u.cost * (UPGRADE_MULT[id] ?? 1.25));

  rebuildUpgradeMap();
  applyTalentEffects();  // recalcule moneyPerSec (revenus passifs) immédiatement après achat

  // Sauvegarde immédiate après achat — évite le rollback si la page se ferme
  // avant le prochain autosave (60s). Le pending queue gère la concurrence.
  save();
  _needsUpgradeRender = true;
  _needsFullRender = true;
});

// Bonus Scanner Pro X selon le tier de la voiture diagnostiquée
const SCANNER_PRO_TIER_BONUS = {
  "F":15, "E":30, "D":60, "C":120, "B":250, "A":400, "S":800, "SS":1500, "SSS":3000, "SSS+":6000
};
// Valeurs × rang (max 3) → niv.3 : F=45, E=90, S=2400, SSS+=18000
function calcScannerProBonus(car){
  const lvl = getUpgrade("scanner_pro")?.lvl || 0;
  if(lvl === 0 || !car) return 0;
  const base = SCANNER_PRO_TIER_BONUS[car.tier] ?? 0;
  const scannerMult = state.heritageBonuses?.expScannerMult ?? 1.0;
  return Math.round(base * lvl * (state.talentDiagMult ?? 1) * scannerMult);
}
// Recalcule TOUS les effets dérivés des upgrades depuis leurs niveaux sauvegardés.
// Appelé après applySaveSnapshot() et après doPrestige().
// Règle : repart des valeurs de base héritage, puis rejoue chaque upgrade lvl fois.
function recalcUpgradeEffects(){
  const b = state.heritageBonuses ?? {};

  // Repartir des valeurs de base (héritage inclus)
  state.diagReward   = (1 + (b.diagBonus ?? 0)) * (b.diagMult ?? 1.0);
  state.repairClick  = 0.5 + (b.clickBonus ?? 0);
  state.speedMult    = b.repSpeed           ?? 1.0;
  state.saleBonusPct = b.saleBonus          ?? 0;
  state.garageCap    = 1;   // sera incrémenté par lift
  state.showroomCap  = 3;   // sera incrémenté par showroom_slot
  state.collectionCap = 1 + (state.heritageBonuses?.collectionCap ?? 0); // sera incrémenté par expo_premium

  // Rejouer les effets de chaque upgrade selon son niveau actuel
  for(const u of state.upgrades){
    const lvl = u.lvl || 0;
    if(lvl === 0) continue;
    switch(u.id){
      case "manual":       state.diagReward   += 2    * lvl; break;   // ×2
      case "obd":          state.diagReward   += 10   * lvl; break;   // ×2
      case "diagpro":      state.diagReward   += 40   * lvl; break;   // ×2
      case "toolbox":      state.repairClick  += 0.05 * lvl; break;
      case "impact":       state.repairClick  += 0.08 * lvl; break;
      case "impact2":      state.repairClick  += 0.12 * lvl; break;
      case "nego":         state.saleBonusPct += 0.05 * lvl; break;
      case "lift":         state.garageCap    += lvl;        break;
      case "chef_atelier": state.garageCap    += lvl;        break;
      case "cle_dynamometrique": state.repairClick += 0.5 * lvl; break;
      case "turbocompresseur":   state.speedMult  *= Math.pow(1.15 * (1 + (state.heritageBonuses?.expTurboBonus ?? 0)), lvl); break;
      case "showroom_slot":    state.showroomCap  += 2    * lvl; break;
      case "galerie_marchande":  state.showroomCap  += 2    * lvl; break;
      case "expo_premium":       state.collectionCap = (state.collectionCap ?? 1) + lvl; break;
      case "extension_atelier": state.garageCap   += lvl;        break;
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

// Vérifie si une voiture est bloquée par les règles globales de vente auto
// Logique : ET entre catégories actives, OR au sein de chaque catégorie
// Ex: Tier [S,SS] + Rareté [legendary,mythic] → seules les S/SS légendaires ou mythiques sont bloquées
function isCarBlockedByRules(car){
  const rules = state.autoSellRules;
  if(!rules) return false;
  const rarity = car.rarity ?? "common";
  const tier   = car.tier   ?? "F";

  const hasRarityRules = rules.blockedRarities?.length > 0;
  const hasTierRules   = rules.blockedTiers?.length   > 0;

  // Si aucune règle → pas bloquée
  if(!hasRarityRules && !hasTierRules) return false;

  // Chaque catégorie active doit matcher (ET entre catégories)
  const rarityMatch = !hasRarityRules || rules.blockedRarities.includes(rarity);
  const tierMatch   = !hasTierRules   || rules.blockedTiers.includes(tier);

  return rarityMatch && tierMatch;
}

// =====================================================================
// GARAGE PERSONNEL — fonctions
// =====================================================================

function getCollectionCap(){
  const base = state.collectionCap ?? 1;
  // Upgrades futurs pourront incrémenter via state.collectionCap
  return base;
}

function calcCollectionTotalIncome(){
  if(!state.collection?.length || typeof calcCollectionIncome === "undefined") return { moneyPerSec:0, repPerSec:0 };
  let money = 0, rep = 0;
  for(const car of state.collection){
    const inc = calcCollectionIncome(car);
    money += inc.moneyPerSec;
    rep   += inc.repPerSec;
  }
  return { moneyPerSec: money, repPerSec: rep };
}

function addToCollection(car){
  if(!state.collection) state.collection = [];
  if(state.collection.length >= getCollectionCap()) return false;
  state.collection.push(car);
  return true;
}

function removeFromCollection(carId){
  if(!state.collection) return null;
  const idx = state.collection.findIndex(c => c.id === carId);
  if(idx === -1) return null;
  const [car] = state.collection.splice(idx, 1);
  return car;
}

// =====================================================================
// POKÉDEX — fonctions
// =====================================================================

function _updateCarBook(car, action, saleValue = 0){
  if(!car?.name) return;
  if(!state.carBook) state.carBook = {};
  const entry = state.carBook[car.name] ?? { seen:false, repaired:0, bestRarity:"common", bestSale:0, allRarities:[] };
  const rarity = car.rarity ?? "common";

  if(action === "repaired"){
    entry.seen     = true;
    entry.repaired = (entry.repaired ?? 0) + 1;
    if(!entry.allRarities) entry.allRarities = [];
    if(!entry.allRarities.includes(rarity)) entry.allRarities.push(rarity);
    // Meilleure rareté vue
    if(typeof RARITY_ORDER !== "undefined"){
      if(RARITY_ORDER.indexOf(rarity) > RARITY_ORDER.indexOf(entry.bestRarity ?? "common")){
        entry.bestRarity = rarity;
      }
    }
  }
  if(action === "sold" && saleValue > 0){
    entry.bestSale = Math.max(entry.bestSale ?? 0, saleValue);
  }
  state.carBook[car.name] = entry;
}

function getCarBookMastery(entry){
  // 0=inconnu, 1=découvert (1 répa), 2=familier (30 répa), 3=maîtrisé (50 répa + 5 raretés)
  if(!entry?.seen) return 0;
  if(entry.repaired >= 50 && (entry.allRarities?.length ?? 0) >= 5) return 3;
  if(entry.repaired >= 30) return 2;
  return 1;
}

// Vérifie bonus de complétion par tier et distribue récompenses
function checkPokedexTierCompletion(){
  if(typeof CAR_CATALOG === "undefined") return;
  if(!state.pokedexTierRewards) state.pokedexTierRewards = {};
  const tiers = ["F","E","D","C","B","A","S","SS","SSS","SSS+"];
  const TIER_REWARDS = {
    "F":   { talent:1, money:5000    }, "E": { talent:1, money:15000  },
    "D":   { talent:2, money:50000   }, "C": { talent:2, money:150000 },
    "B":   { talent:3, money:500000  }, "A": { talent:3, money:1000000},
    "S":   { talent:4, money:3000000 }, "SS":{ talent:4, money:8000000},
    "SSS": { talent:5, money:20000000}, "SSS+":{ talent:5, money:50000000},
  };
  for(const tier of tiers){
    if(state.pokedexTierRewards[tier + "_disc"]) continue; // déjà réclamé
    const cars = CAR_CATALOG.filter(c => c.tier === tier);
    const allSeen = cars.every(c => state.carBook?.[c.name]?.seen);
    if(allSeen){
      state.pokedexTierRewards[tier + "_disc"] = true;
      const rew = TIER_REWARDS[tier];
      if(rew){
        state.money += rew.money;
        state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + rew.money;
        state.talentPoints = (state.talentPoints ?? 0) + rew.talent;
        showToast(`📖 Tier ${tier} découvert ! +${rew.talent} talent · +${formatMoney(rew.money)}`);
      }
    }
  }
}

// =====================
// IDLE LOOP
// =====================
let _needsFullRender    = false; // render complet (showroom, queue, active...)
let _needsUpgradeRender = false; // rebuild colonne droite (upgrades/stock)
let _needsTalentRender  = false; // rebuild panel talents
var last = performance.now();    // var = pas de TDZ — utilisé par boot.js visibilitychange
let autoAnalyzeTimer = 0;
let autoSellTimer = 0;

let achCheckTimer = 0;
let stockTimerAccu = 0;


// Logique pure du tick — utilisable offline et dans le loop normal
function applyTickLogic(dt){
  const passiveGain = state.moneyPerSec * dt;
  if(isFinite(passiveGain)) {
    state.money += passiveGain;
    state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + passiveGain;
    state.runMoneyPassive  = (state.runMoneyPassive  ?? 0) + passiveGain;
  }
  // ── Revenus Garage Personnel ──────────────────────────────────────────
  if(state.collection?.length > 0 && typeof calcCollectionIncome !== "undefined"){
    for(const car of state.collection){
      const inc = calcCollectionIncome(car);
      if(isFinite(inc.moneyPerSec)){
        state.money += inc.moneyPerSec * dt;
        state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + inc.moneyPerSec * dt;
        state.runMoneyPassive  = (state.runMoneyPassive  ?? 0) + inc.moneyPerSec * dt;
      }
      if(isFinite(inc.repPerSec)){
        state.collectionRepAccu = (state.collectionRepAccu ?? 0) + inc.repPerSec * dt;
        if(state.collectionRepAccu >= 1){
          const gained = Math.floor(state.collectionRepAccu);
          state.collectionRepAccu -= gained;
          state.rep += gained;
          if(state.rep > (state.repMax ?? 0)) state.repMax = state.rep;
        }
      }
    }
  }

  // Traitement des livraisons de pièces
  processOrders(dt);
  processAutoOrders(dt);

  // Réparation — slot principal + slots Chef d'Atelier
  const slots = getActiveRepairSlots();
  // Slot 0 : principal (pas de malus)
  if(state.active){
    const partsMult = getPartsSpeedMult(state.active);
    const mult = (state.speedMult ?? 1) * (state.talentSpeedMult ?? 1) * partsMult;
    const secPerSec = (state.repairAuto + (state.talentRepairAuto ?? 0)) * mult;
    applyRepairTime(secPerSec * dt, 0);
  }
  // Slots supplémentaires (avec malus de position)
  if(!state.actives) state.actives = [];
  for(let i = 0; i < slots - 1; i++){
    const car = state.actives[i];
    if(car){
      const partsMult  = getPartsSpeedMult(car);
      const malus      = getSlotSpeedMalus(i + 1); // slot 1 = -10%, slot 2 = -20%…
      const mult = (state.speedMult ?? 1) * (state.talentSpeedMult ?? 1) * partsMult * malus;
      const secPerSec  = (state.repairAuto + (state.talentRepairAuto ?? 0)) * mult;
      applyRepairTime(secPerSec * dt, i + 1);
    }
  }
  // Si des slots sont vides, essayer de les remplir
  tryStartNextRepair();

  // --- LOGIQUE D'AUTOMATISATION (sans DOM) ---
  const stagiaireLvl      = getUpgrade("stagiaire")?.lvl      || 0;
  const receptionnaireLvl = getUpgrade("receptionnaire")?.lvl || 0;
  const iaDiagLvl         = getUpgrade("ia_diagnostic")?.lvl  || 0;
  if(stagiaireLvl > 0){
    autoAnalyzeTimer += dt;
    let delay = Math.max(6, 15 - (stagiaireLvl - 1));
    if(receptionnaireLvl > 0) delay = Math.max(1, delay - (receptionnaireLvl * 0.5));
    // ia_diagnostic : −0.1s au plancher par rang (min 0.5s)
    if(iaDiagLvl > 0) delay = Math.max(0.5, delay - (iaDiagLvl * 0.1));
    while(autoAnalyzeTimer >= delay){
      autoAnalyzeTimer -= delay;
      const activeCount = (state.active ? 1 : 0) + (state.actives?.filter(Boolean).length ?? 0);
  const occupied = activeCount + state.queue.length;
      const MAX_QUEUE = state.garageCap * 10; // max 10 voitures en attente par slot
      if(occupied < state.garageCap && state.queue.length < MAX_QUEUE){
        // Logique pure : pas de .click() DOM
        const autoCar = makeCar();
        const diagGain = Math.round((state.diagReward + (state.talentDiagBonus ?? 0)) * (state.talentDiagMult ?? 1));
        if(isFinite(diagGain) && diagGain > 0){
          state.money += diagGain;
          state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + diagGain;
          state.runMoneyDiag     = (state.runMoneyDiag     ?? 0) + diagGain;
        }
        // Scanner Pro X — hors AFK uniquement
        if(!_isOfflineCatchup){
          const scanBonus = calcScannerProBonus(autoCar);
          if(scanBonus > 0){
            state.money += scanBonus;
            state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + scanBonus;
            state.runMoneyDiag     = (state.runMoneyDiag     ?? 0) + scanBonus;
          }
        }
        state.totalAnalyses = (state.totalAnalyses ?? 0) + 1;
        if(state.specialization === "diag" && state.totalAnalyses % 100 === 0){
          state.talentPoints = (state.talentPoints ?? 0) + 1;
          if(!_isOfflineCatchup) showToast("🔍 +1 point talent (100 diagnostics !)");
        }
        state.queue.push(autoCar);
        tryStartNextRepair();
        _needsFullRender = true;
      }
    }
  }

  const vendeurLvl         = getUpgrade("vendeur")?.lvl          || 0;
  const vendeurConfirmeLvl = getUpgrade("vendeur_confirme")?.lvl || 0;
  const vendeurExpertLvl   = getUpgrade("vendeur_expert")?.lvl   || 0;
  if(vendeurLvl > 0 && state.showroom.length > 0){
    autoSellTimer += dt;
    let delay = Math.max(6, 15 - (vendeurLvl - 1));
    if(vendeurConfirmeLvl > 0) delay = Math.max(1, delay - (vendeurConfirmeLvl * 0.7));
    // vendeur_expert : −0.1s au plancher par rang (min 0.5s)
    if(vendeurExpertLvl > 0) delay = Math.max(0.5, delay - (vendeurExpertLvl * 0.1));
    while(autoSellTimer >= delay){
      autoSellTimer -= delay;
      if(state.showroom.length > 0){
        // Chercher la première voiture vendable (non bloquée par les règles)
        const sellIdx = (() => {
          for(let i = state.showroom.length - 1; i >= 0; i--){
            if(!isCarBlockedByRules(state.showroom[i])) return i;
          }
          return -1;
        })();
        if(sellIdx === -1){ break; } // toutes bloquées — le timer continue
        const car = state.showroom[sellIdx];
        const saleValue = calcSaleValue(car);
        if(isFinite(saleValue)){
          state.money += saleValue;
          state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + saleValue;
          const _pm = getPartsValueMult(car);
          state.runMoneySales = (state.runMoneySales ?? 0) + saleValue;
          if(_pm > 1) state.runMoneyParts = (state.runMoneyParts ?? 0) + Math.round(saleValue - saleValue / _pm);
        }
        const tierData = TIERS[car.tier] || TIERS["F"];
        const repMult = state.heritageBonuses?.repGainMult ?? 1.0;
        const _autoRarityRepMult = (typeof RARITY_TABLE !== "undefined") ? (RARITY_TABLE[car.rarity ?? "common"]?.multRep ?? 1.0) : 1.0;
        const repGain = Math.round(tierData.repGain * repMult * (state.specRepMult ?? 1.0) * (1 + (state.talentRepGainBonus ?? 0)) * _autoRarityRepMult);
        if(isFinite(repGain)) state.rep += repGain;
        if(typeof RARITY_ORDER !== "undefined"){
          const _ar = car.rarity ?? "common";
          if(_ar === "legendary") state.totalLegendarySold = (state.totalLegendarySold ?? 0) + 1;
          if(_ar === "mythic")    state.totalMythicSold    = (state.totalMythicSold    ?? 0) + 1;
        }
        _updateCarBook(car, "sold", calcSaleValue(car));
        state.carsSold += 1;
        state.totalCarsSold = (state.totalCarsSold ?? 0) + 1;
        // Ventes auto en jeu actif → comptent pour les défis (sauf catchup AFK)
        if(!_isOfflineCatchup){
          state.manualCarsSold = (state.manualCarsSold ?? 0) + 1;
          if(typeof trackChallengeSale === 'function') trackChallengeSale(car.tier);
        }
        state.showroom.splice(sellIdx, 1);
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
    renderAll(_needsUpgradeRender, _needsTalentRender);
    _needsUpgradeRender = false;
    _needsTalentRender  = false;
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

  // Mise à jour snap défis (léger, 1x/frame) — ignoré pendant le catchup AFK
  if(!_isOfflineCatchup && typeof updateChallengeSnap === 'function') updateChallengeSnap();

  // ── Historique graphiques (1 point toutes les 5s) ─────────────────────────
  if(!_isOfflineCatchup){
    state._historyTimer = (state._historyTimer ?? 0) + dt;
    if(state._historyTimer >= 5){
      state._historyTimer = 0;
      const now = Date.now();
      const MAX = 120;
      const push = (arr, v) => { arr.push({ t: now, v }); if(arr.length > MAX) arr.shift(); };
      if(!state.history) state.history = { moneyPerSec:[], rep:[] };
      push(state.history.moneyPerSec, state.moneyPerSec ?? 0);
      push(state.history.rep,         state.rep ?? 0);
    }
  }

  requestAnimationFrame(tick);
}


// ── Listener collection (bouton Retirer) ─────────────────────────────────────
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove-collection]");
  if(!btn) return;
  const id  = btn.getAttribute("data-remove-collection");
  const car = removeFromCollection(id);
  if(!car) return;
  // Remettre dans le showroom si de la place, sinon bloquer
  const cap = getShowroomCap();
  if(state.showroom.length < cap){
    state.showroom.unshift(car);
    showToast("🚗 Voiture retirée de l'exposition → Showroom");
  } else {
    // Plus de place dans le showroom → remettre en collection
    addToCollection(car);
    showToast("⚠️ Showroom plein ! Vendez une voiture d'abord.");
    return;
  }
  _needsFullRender = true;
  save();
});

// ── Bouton Encyclopédie dans le side menu ─────────────────────────────────────────
document.getElementById("sideMenuPokedex")?.addEventListener("click", () => {
  closeSideMenu?.();
  openPokedex();
});
