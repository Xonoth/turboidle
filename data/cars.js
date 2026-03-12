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
        if(orderPart(part.id, supplierId, orderQty)){
          budgetLeft -= price; // mise à jour du budget local pour les commandes suivantes
        }
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
      // Argent déjà débité à la commande (orderPart) — pas de double débit ici
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
  // Vérifier et débiter l'argent à la commande
  const price = getPartPrice(partId, supplierId) * qty;
  if(state.money < price){
    showToast("⚠️ Fonds insuffisants !");
    return false;
  }
  state.money -= price;
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
  // Tracker pour le défi journalier (manuel + auto)
  state.totalOrders = (state.totalOrders ?? 0) + 1;
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


