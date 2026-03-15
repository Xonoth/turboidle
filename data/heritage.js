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
    desc:"-3% au coût de rachat des upgrades au prestige par rang (max -15%)",
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
    desc:"×1.15 gain diagnostic par rang (multiplicatif)",
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

  // ══ BRANCHE LOGISTIQUE (cyan/vert) ════════════════════
  { id:"log_slots_1",    branch:"Logistique", icon:"🚛", name:"Flotte de Départ",
    desc:"+1 slot de livraison permanent par rang",
    maxRank:3, costPerRank:1,
    requires:[] },

  { id:"log_gestion",    branch:"Logistique", icon:"📋", name:"Gestionnaire de Stock",
    desc:"Les pièces F/E/D n'occupent que 0.5 slot entrepôt (permanent, achat unique)",
    maxRank:1, costPerRank:2,
    requires:[{id:"log_slots_1", rank:1}] },

  { id:"log_delay_1",    branch:"Logistique", icon:"⏱️", name:"Réseau Rodé",
    desc:"−8% délai de livraison permanent par rang",
    maxRank:5, costPerRank:1,
    requires:[{id:"log_slots_1", rank:1}] },

  { id:"log_warehouse_1",branch:"Logistique", icon:"🏭", name:"Capacité Héritée",
    desc:"+50 slots d'entrepôt permanent par rang",
    maxRank:5, costPerRank:2,
    requires:[{id:"log_slots_1", rank:2}] },

  { id:"log_parts_val_1",branch:"Logistique", icon:"💰", name:"Expertise Pièces",
    desc:"+5% valeur de revente si pièces utilisées par rang",
    maxRank:3, costPerRank:3,
    requires:[{id:"log_delay_1", rank:3}, {id:"log_warehouse_1", rank:2}] },

  { id:"log_ultimate",   branch:"Logistique", icon:"🏗️", name:"Empire Logistique",
    desc:"×2 capacité entrepôt · −25% délai livraison supplémentaire (unique)",
    maxRank:1, costPerRank:8,
    requires:[{id:"log_parts_val_1", rank:2}, {id:"log_warehouse_1", rank:4}] },

  // ══ PERKS INFINIS (post-ultimate, rendements décroissants) ════════════════
  { id:"meca_infinite",  branch:"Mécanique",  icon:"∞", name:"Cadence Éternelle",
    desc:"+1% vitesse de réparation par rang (sans limite)",
    maxRank:null, costPerRank:3,
    requires:[{id:"meca_ultimate", rank:1}] },

  { id:"com_infinite",   branch:"Commerce",   icon:"∞", name:"Fortune Perpétuelle",
    desc:"+0.5% à tous les revenus par rang (sans limite)",
    maxRank:null, costPerRank:3,
    requires:[{id:"com_ultimate", rank:1}] },

  { id:"rep_infinite",   branch:"Réputation", icon:"∞", name:"Légende Immortelle",
    desc:"+1% REP gagné par vente par rang (sans limite)",
    maxRank:null, costPerRank:3,
    requires:[{id:"rep_ultimate", rank:1}] },

  { id:"log_infinite",   branch:"Logistique", icon:"∞", name:"Flux Perpétuel",
    desc:"-1% délai livraison + +10 slots entrepôt par rang (sans limite)",
    maxRank:null, costPerRank:3,
    requires:[{id:"log_ultimate", rank:1}] },

  // ══ NOUVEAUX PERKS COMMERCE ════════════════════════════════════════════════
  { id:"com_upgrade_keep", branch:"Commerce", icon:"🔧", name:"Savoir Préservé",
    desc:"Les upgrades Outils conservent 1 niveau au prestige par rang (max 5 niveaux conservés)",
    maxRank:5, costPerRank:2,
    requires:[{id:"com_start_1", rank:2}] },

  // ══ NOUVEAUX PERKS RÉPUTATION ══════════════════════════════════════════════
  { id:"rep_carry",      branch:"Réputation", icon:"🎖️", name:"Réputation Acquise",
    desc:"Conserve 5% de la REP au prestige par rang (max 25%)",
    maxRank:5, costPerRank:2,
    requires:[{id:"rep_gain_1", rank:2}] },

  // ══ NOUVEAUX PERKS LOGISTIQUE ══════════════════════════════════════════════
  { id:"log_auto_order", branch:"Logistique", icon:"🤖", name:"Commande Intelligente",
    desc:"-10% délai commandes automatiques + quantité ×1.2 par rang",
    maxRank:5, costPerRank:2,
    requires:[{id:"log_slots_1", rank:2}] },

  // ══ BRANCHE EXPERTISE (5e branche — synergie upgrades prestige) ═══════════
  { id:"exp_scanner",    branch:"Expertise",  icon:"🔬", name:"Scanner Augmenté",
    desc:"Bonus Scanner Pro X ×1.5 (unique)",
    maxRank:1, costPerRank:4,
    requires:[] },

  { id:"exp_turbo",      branch:"Expertise",  icon:"🚀", name:"Turbo Suralimenté",
    desc:"+5% effet Turbocompresseur par rang",
    maxRank:3, costPerRank:3,
    requires:[{id:"exp_scanner", rank:1}] },

  { id:"exp_chef",       branch:"Expertise",  icon:"👑", name:"Ergonomie Avancée",
    desc:"Réduit le malus Chef d'Atelier de -2% par slot par rang",
    maxRank:5, costPerRank:3,
    requires:[{id:"exp_scanner", rank:1}] },

  { id:"exp_infinite",   branch:"Expertise",  icon:"∞", name:"Expertise Croissante",
    desc:"+0.5% à tous les effets des upgrades prestige par rang (sans limite)",
    maxRank:null, costPerRank:3,
    requires:[{id:"exp_turbo", rank:2}, {id:"exp_chef", rank:3}] },

  { id:"exp_ultimate",   branch:"Expertise",  icon:"🏅", name:"Héritage Absolu",
    desc:"Les upgrades prestige débloqués conservent leurs niveaux au prestige (unique)",
    maxRank:1, costPerRank:12,
    requires:[{id:"exp_turbo", rank:3}, {id:"exp_chef", rank:5}] },
];

function getHeritagePerkRank(id){
  return state.heritagePerks[id] ?? 0;
}

function hasHeritageRequirements(perk){
  return (perk.requires || []).every(r => getHeritagePerkRank(r.id) >= r.rank);
}

function calcHeritagePoints(){
  // +1 par tranche de 10 niveaux au-dessus de 50
  const fromLevel = Math.max(0, Math.floor((state.garageLevel - 50) / 10));
  // +1 par tranche de 5000 voitures vendues
  const fromSales = Math.max(0, Math.floor((state.carsSold ?? 0) / 5000));
  // Progression exponentielle ×2 — chaque point coûte 2× plus de REP que le précédent
  // Seuil du point N = 50 000 × (2^N - 1)
  // Point 1 : 50k REP · Point 2 : 150k · Point 3 : 350k · Point 4 : 750k · Point 5 : 1.55M…
  const rep = Math.max(0, (state.rep ?? 0));
  let fromRep = 0;
  let threshold = 50000; // seuil du prochain point
  let cumul = 0;
  while(rep >= cumul + threshold){
    cumul += threshold;
    fromRep++;
    threshold *= 2; // doubler la tranche à chaque point
  }
  const base = 1 + fromLevel + fromSales + fromRep;
  const mult = state.heritageBonuses?.prestigeGainMult ?? 1.0;
  return Math.max(1, Math.floor(base * mult));
}

// Applique les bonus héritage au state actif (appelé après achat d'un perk sans prestige)
function applyHeritageBonusesToState(){
  const b = state.heritageBonuses;
  if(!b) return;
  // Recalcule tout depuis les niveaux d'upgrades — évite d'écraser le speedMult des upgrades comp
  recalcUpgradeEffects();
  recalcRepairAuto();
  // Milestones : slots (max pour ne pas réduire si déjà augmentés via upgrades)
  if(b.garageCap)   state.garageCap   = Math.max(state.garageCap,   1 + b.garageCap);
  if(b.showroomCap) state.showroomCap = Math.max(state.showroomCap, 3 + b.showroomCap);
}

function getPrestigeLevelReq(){
  // Prestige 0 → niveau 50, puis +5 par prestige, plafonné à 200
  const base = 50 + (state.prestigeCount ?? 0) * 5;
  return Math.max(50, Math.min(200, base));
}

function getPrestigeRepReq(){
  // Expo ×1.10 par prestige jusqu'à P30, puis +100k linéaire au-delà
  const n    = state.prestigeCount ?? 0;
  const expo = Math.round(40000 * Math.pow(1.10, Math.min(n, 30)) / 1000) * 1000;
  const lin  = Math.max(0, n - 30) * 100000;
  return Math.round((expo + lin) * (state.specRepReqMult ?? 1.0));
}

function canPrestige(){
  return state.garageLevel >= getPrestigeLevelReq() && state.rep >= getPrestigeRepReq();
}


// =====================
// PRESTIGE MILESTONES
// =====================
const PRESTIGE_MILESTONES = [
  { count: 1,  icon:"🏁", label:"Premier Prestige",
    desc:"Capital de départ +1000€ permanent",
    apply: (state) => { state.heritageBonuses.startMoney += 1000; } },
  { count: 5,  icon:"🔧", label:"Vétéran",
    desc:"Slot atelier +1 permanent",
    apply: (state) => { state.heritageBonuses.garageCap  = (state.heritageBonuses.garageCap  ?? 0) + 1; } },
  { count: 10, icon:"⚡", label:"Expert",
    desc:"Vitesse de réparation auto +10% permanent",
    apply: (state) => { state.heritageBonuses.repSpeed *= 1.10; } },
  { count: 25, icon:"🏆", label:"Maître Mécanicien",
    desc:"Slot atelier +2 et slot showroom +2 permanents",
    apply: (state) => { state.heritageBonuses.garageCap  = (state.heritageBonuses.garageCap  ?? 0) + 2;
                        state.heritageBonuses.showroomCap = (state.heritageBonuses.showroomCap ?? 0) + 2; } },
  { count: 50, icon:"👑", label:"Légende",
    desc:"Titre Légende dans le leaderboard + bordure dorée sur le profil",
    apply: (state) => { state.heritageBonuses.isLegend = true; } },
  { count: 15, icon:"🖼️", label:"Showroom Étendu",
    desc:"Slot showroom +1 permanent",
    apply: (state) => { state.heritageBonuses.showroomCap = (state.heritageBonuses.showroomCap ?? 0) + 1; } },
  { count: 30, icon:"🔧", label:"Mémoire du Métier",
    desc:"Les upgrades Équipe conservent 25% de leurs niveaux au prestige",
    apply: (state) => { state.heritageBonuses.teamUpgradeKeep = 0.25; } },
  { count: 40, icon:"⚡", label:"Double Expertise",
    desc:"2e spécialisation active simultanément",
    apply: (state) => { state.heritageBonuses.dualSpec = true; } },
  { count: 75, icon:"🌌", label:"Transcendance",
    desc:"Coût des perks Infinis réduit de 1pt (min 2pts/rang)",
    apply: (state) => { state.heritageBonuses.infiniteCostDisc = 1; } },
  { count: 100, icon:"🔮", label:"Mythique",
    desc:"Points héritage gagnés ×1.5 permanent",
    apply: (state) => { state.heritageBonuses.prestigeGainMult = (state.heritageBonuses.prestigeGainMult ?? 1) * 1.5; } },
];

function getUnlockedMilestones(prestigeCount){
  return PRESTIGE_MILESTONES.filter(m => prestigeCount >= m.count);
}

function applyMilestoneBonuses(b, prestigeCount){
  // Appliqué après applyHeritageBonuses(), enrichit l'objet b
  if(prestigeCount >= 1)  b.startMoney += 1000;
  if(prestigeCount >= 5)  b.garageCap   = (b.garageCap  ?? 0) + 1;
  if(prestigeCount >= 10) b.repSpeed   *= 1.10;
  if(prestigeCount >= 25){ b.garageCap  = (b.garageCap  ?? 0) + 2;
                            b.showroomCap = (b.showroomCap ?? 0) + 2; }
  if(prestigeCount >= 50) b.isLegend    = true;
  if(prestigeCount >= 15){ b.showroomCap = (b.showroomCap ?? 0) + 1; }
  if(prestigeCount >= 30){ b.teamUpgradeKeep = Math.max(b.teamUpgradeKeep ?? 0, 0.25); }
  if(prestigeCount >= 40){ b.dualSpec = true; }
  if(prestigeCount >= 75){ b.infiniteCostDisc = 1; }
  if(prestigeCount >= 100){ b.prestigeGainMult = (b.prestigeGainMult ?? 1) * 1.5; }
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
    moneyMult:        1.0,  // +1% par prestige (bonus passif automatique)
    garageCap:        0,    // bonus slots garage via milestones
    showroomCap:      0,    // bonus slots showroom via milestones
    isLegend:         false,
    // Nouveaux
    upgradeCostMult:  1.0,   // com_start_1 : réduction coût upgrades au prestige
    diagMult:         1.0,   // com_diag_1 : multiplicateur gain diag
    teamUpgradeKeep:  0,     // milestone P30 : % niveaux équipe conservés
    dualSpec:         false, // milestone P40 : 2e spécialisation
    infiniteCostDisc: 0,     // milestone P75 : réduction coût infinis
    rep_carry:        0,     // rep_carry : % REP conservée au prestige
    com_upgrade_keep: 0,     // com_upgrade_keep : niveaux outils conservés
    autoOrderDisc:    0,     // log_auto_order : délai commandes auto
    autoOrderQtyMult: 1.0,   // log_auto_order : quantité commandes auto
    expScannerMult:   1.0,   // exp_scanner
    expTurboBonus:    0,     // exp_turbo
    expChefMalusRed:  0,     // exp_chef : réduction malus chef
    expInfiniteBonus: 0,     // exp_infinite
    keepPrestigeUpgrades: false, // exp_ultimate
    // Logistique
    extraDeliverySlots:  0,
    deliveryDisc:        0,
    warehouseBonus:      0,
    warehouseUltimateMult: 1.0,
    partsValueBonus:     0,
    gestionStock:        false,  // gestionnaire de stock : pièces F/E/D = 0.5 slot
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
    if(p.id === "rep_gain_1")    b.repGainMult    *= Math.pow(1.10, rank);
    if(p.id === "rep_talent_1")  b.talentBonus    += rank * 1;
    if(p.id === "rep_prestige_1")b.prestigeGainMult += rank * 0.10;
    if(p.id === "rep_gain_2")    b.repGainMult    *= Math.pow(1.15, rank);
    if(p.id === "rep_talent_2")  b.talentBonus    += rank * 2;
    if(p.id === "rep_ultimate")  b.repGainMult    *= 1.75;

    // Logistique
    if(p.id === "log_slots_1")    b.extraDeliverySlots += rank * 1;
    if(p.id === "log_gestion")    b.gestionStock        = true;
    if(p.id === "log_delay_1")    b.deliveryDisc       += rank * 0.08;
    if(p.id === "log_warehouse_1")b.warehouseBonus     += rank * 50;
    if(p.id === "log_parts_val_1")b.partsValueBonus    += rank * 0.05;
    if(p.id === "log_ultimate") {
      b.warehouseUltimateMult = 2.0;
      b.deliveryDisc          += 0.25;
    }

    // ── Perks infinis ────────────────────────────────────────────────────────
    if(p.id === "meca_infinite")  b.repSpeed  *= Math.pow(1.01, rank);
    if(p.id === "com_infinite")   b.moneyMult  = (b.moneyMult ?? 1) * Math.pow(1.005, rank);
    if(p.id === "rep_infinite")   b.repGainMult *= Math.pow(1.01, rank);
    if(p.id === "log_infinite") {
      b.deliveryDisc   = Math.min(0.95, (b.deliveryDisc ?? 0) + rank * 0.01);
      b.warehouseBonus += rank * 10;
    }

    // ── Commerce nouveaux ────────────────────────────────────────────────────
    if(p.id === "com_start_1")    b.upgradeCostMult = Math.max(0.85, 1 - rank * 0.03);
    if(p.id === "com_diag_1")     b.diagMult  *= Math.pow(1.15, rank);
    if(p.id === "com_upgrade_keep") b.com_upgrade_keep = rank; // niveaux conservés

    // ── Réputation nouveaux ──────────────────────────────────────────────────
    if(p.id === "rep_carry")      b.rep_carry = rank * 0.05; // 5%/rang = max 25%

    // ── Logistique nouveaux ──────────────────────────────────────────────────
    if(p.id === "log_auto_order") {
      b.autoOrderDisc    = Math.min(0.80, rank * 0.10);
      b.autoOrderQtyMult = Math.pow(1.2, rank);
    }

    // ── Expertise ────────────────────────────────────────────────────────────
    if(p.id === "exp_scanner")    b.expScannerMult  = 1.5;
    if(p.id === "exp_turbo")      b.expTurboBonus   = rank * 0.05;
    if(p.id === "exp_chef")       b.expChefMalusRed = rank * 0.02;
    if(p.id === "exp_infinite")   b.expInfiniteBonus = rank * 0.005;
    if(p.id === "exp_ultimate")   b.keepPrestigeUpgrades = true;
  }

  // +1% argent par prestige total (plafonné à +50%)
  const prestigeBonus = Math.min((state.prestigeCount ?? 0) * 0.01, 0.50);
  b.moneyMult = 1.0 + prestigeBonus;

  // Milestones prestige — bonus permanents par palier
  applyMilestoneBonuses(b, state.prestigeCount ?? 0);

  state.heritageBonuses = b;
}

function doPrestige(){
  if(!canPrestige()) return;
  // L1 — ORDRE CRITIQUE — ne pas changer sans vérification :
  // 1. applyHeritageBonuses() EN PREMIER → calcHeritagePoints() s'appuie dessus
  // 2. Persist des valeurs AVANT Object.assign
  // 3. rebuildUpgradeMap() AVANT applyTalentEffects() → les talents lisent _upgradeMap
  // 4. applyTalentEffects() AVANT recalcRepairAuto()
  // 5. renderAll(true, true) EN DERNIER
  applyHeritageBonuses();
  const b = state.heritageBonuses;  // déclaré ici — utilisé partout dans doPrestige
  const pts = calcHeritagePoints();

  // Sauvegarder ce qui persiste
  const persistProfile    = state.profile;
  const persistAchievements = state.achievements;
  const persistPerks      = state.heritagePerks;
  const persistCount      = state.prestigeCount + 1;
  const persistSpent      = state.heritageSpent;
  const persistGarageName = state.garageName;

  // ── rep_carry : conserver une partie de la REP ──────────────────────────
  const repCarryPct  = b.rep_carry ?? 0;
  const persistedRep = Math.floor((state.rep ?? 0) * repCarryPct);

  // ── com_upgrade_keep : conserver niveaux upgrades Outils ────────────────
  const keepLvls = Math.floor(b.com_upgrade_keep ?? 0);
  const toolsKeep = {};
  if(keepLvls > 0){
    state.upgrades.filter(u => u.tab === "tools").forEach(u => {
      if(u.lvl > 0) toolsKeep[u.id] = Math.min(u.lvl, keepLvls);
    });
  }

  // ── teamUpgradeKeep (P30) : conserver 25% niveaux équipe ────────────────
  const teamKeepPct = b.teamUpgradeKeep ?? 0;
  const teamKeep = {};
  if(teamKeepPct > 0){
    state.upgrades.filter(u => u.tab === "team").forEach(u => {
      if(u.lvl > 0) teamKeep[u.id] = Math.floor(u.lvl * teamKeepPct);
    });
  }

  // ── exp_ultimate : conserver les upgrades prestige débloqués ────────────
  const PRESTIGE_UPGRADE_IDS = [
    "scanner_pro","cle_dynamometrique","turbocompresseur",
    "vendeur_expert","ia_diagnostic","chef_atelier",
    "reseau_national","holding_auto","galerie_marchande","extension_atelier"
  ];
  const prestigeUpgradesKeep = {};
  if(b.keepPrestigeUpgrades){
    state.upgrades.filter(u => PRESTIGE_UPGRADE_IDS.includes(u.id)).forEach(u => {
      if(u.lvl > 0) prestigeUpgradesKeep[u.id] = u.lvl;
    });
  }

  // ── dualSpec (P40) : conserver la 2e spécialisation ────────────────────
  const persistSpec2 = b.dualSpec ? (state.specialization2 ?? null) : null;
  const persistTotalMoney = state.totalMoneyEarned ?? 0;
  const persistTotalRep   = state.totalRepairs ?? 0;
  const persistTotalAna   = state.totalAnalyses ?? 0;
  const persistTotalClick = state.totalClickRepairs ?? 0;
  const persistTotalSales   = state.totalCarsSold     ?? 0;
  const persistTotalOrders  = state.totalOrders        ?? 0;
  const persistTotalClicks  = state.totalActionClicks  ?? 0;
  const persistChallenges      = state.challenges          ?? null;
  const persistSpecialization  = state.specialization       ?? null;
  const persistBestTier        = state.bestTier             ?? null;
  const persistRepMax          = state.repMax               ?? 0;
  const persistChallengeStreak = state.challengeStreak      ?? { count:0, lastCompleted:null };

  // Reset du state (même structure que state initial)
  const baseUpgrades = JSON.parse(JSON.stringify(
    state.upgrades.map(u => {
      const baseCost = getBaseUpgradeCost(u.id);
      // Niveaux conservés selon les perks actifs
      const keptTools   = toolsKeep[u.id]   ?? 0;
      const keptTeam    = teamKeep[u.id]     ?? 0;
      const keptPrestige = prestigeUpgradesKeep[u.id] ?? 0;
      const keptLvl     = Math.max(keptTools, keptTeam, keptPrestige);
      // Recalculer le coût en tenant compte des niveaux déjà achetés
      let cost = baseCost;
      for(let i = 0; i < keptLvl; i++) cost = Math.ceil(cost * (UPGRADE_MULT[u.id] ?? 1.25));
      // Appliquer la réduction de coût (com_start_1)
      cost = Math.round(cost * (b.upgradeCostMult ?? 1.0));
      return { ...u, lvl: keptLvl, cost: Math.max(baseCost, cost) };
    })
  ));

  // Points talent bonus dès le départ
  const bonusTalent = Math.floor(b.talentBonus);

  Object.assign(state, {
    garageLevel:       1,
    garageCap:         1 + (b.garageCap ?? 0),
    garageName:        persistGarageName,
    showroomCap:       3 + (b.showroomCap ?? 0),
    money:             Math.round((100 + b.startMoney) * (b.moneyMult ?? 1.0)),
    moneyPerSec:       b.passiveBonus,
    rep:               persistedRep,  // rep_carry : % REP conservée
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
    totalCarsSold:       persistTotalSales,
    totalOrders:         persistTotalOrders,
    totalActionClicks:   persistTotalClicks,
    challenges:          persistChallenges,
    challengeStreak:     persistChallengeStreak,
    specialization:      persistSpecialization,
    specialization2:     persistSpec2,  // P40 : 2e spécialisation
    bestTier:            persistBestTier,
    repMax:              persistRepMax,
    sessionStart:        Date.now(),
    // Run stats — remises à 0 au prestige
    runMoneyPassive:   0,
    runMoneySales:     0,
    runMoneyDiag:      0,
    runMoneyParts:     0,
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
  renderAll(true, true);
  renderPrestigeNotif();
  // Réinitialiser les défis journaliers : forcer null pour recréer les snap baselines
  // (même si on est encore le même jour, les counters de base ont changé après prestige)
  if(state.challenges) state.challenges = null;
  if(typeof initChallenges === 'function') initChallenges();
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
  etageres:8000, rayonnage:35000, zone_logistique:150000, entrepot_auto:600000,
  vendeur_expert:1200000, ia_diagnostic:1200000, chef_atelier:900000,
  scanner_pro:800000, cle_dynamometrique:1000000, turbocompresseur:1200000,
  reseau_national:500000, holding_auto:2000000,
  galerie_marchande:300000, extension_atelier:400000,
};
function getBaseUpgradeCost(id){ return UPGRADE_BASE_COSTS[id] ?? 100; }

function getTalentRank(id){
  return state.talents[id] ?? 0;
}

function getTierPointsSpent(category, tier){
  return TALENTS
    .filter(t => t.category === category && t.tier === tier)
    .reduce((sum, t) => sum + getTalentRank(t.id), 0);
}

function hasRequirements(talent){
  // Prérequis classiques (requires)
  const baseOk = (talent.requires || []).every(r => getTalentRank(r.id) >= r.rank);
  if(!baseOk) return false;
  // Prérequis de tier : T2 → 10pts en T1, T3 → 20pts en T2 (cohérent avec l'UI)
  if(talent.tier >= 2){
    const needed = talent.tier === 2 ? 10 : 20;
    const prevTierPoints = getTierPointsSpent(talent.category, talent.tier - 1);
    if(prevTierPoints < needed) return false;
  }
  return true;
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

  // Cartes groupées par tier — layout 3 colonnes
  talentListEl.innerHTML = "";
  const list = _talentFilter === "Tous" ? TALENTS : TALENTS.filter(t=>t.category===_talentFilter);

  const TIER_LABELS = { 1:"★ TIER 1", 2:"★★ TIER 2", 3:"★★★ TIER 3" };
  const TIER_COLORS = { 1:"#4a9eff", 2:"#a78bfa", 3:"#fbbf24" };

  // Wrapper 3 colonnes
  const grid = document.createElement("div");
  grid.className = "talentTierGrid";
  talentListEl.appendChild(grid);

  const tiers = [1, 2, 3];

  for(const tierNum of tiers){
    const tierTalents = list.filter(t => (t.tier ?? 1) === tierNum);

    const col = document.createElement("div");
    col.className = `talentTierCol talentTierCol--t${tierNum}`;
    col.style.setProperty("--tier-color", TIER_COLORS[tierNum]);

    // Header colonne
    let statusHtml = "";
    if(tierNum === 1){
      statusHtml = `<span class="tierHeader__unlocked">✅ Disponible</span>`;
    } else {
      // Calculer par catégorie filtrée ou toutes catégories
      const cats = _talentFilter === "Tous"
        ? [...new Set(TALENTS.map(t=>t.category))]
        : [_talentFilter];
      const needed = tierNum === 2 ? 10 : 20;
      const allUnlocked = cats.every(cat => getTierPointsSpent(cat, tierNum-1) >= needed);
      const anyProgress = cats.map(cat => getTierPointsSpent(cat, tierNum-1));
      if(allUnlocked){
        statusHtml = `<span class="tierHeader__unlocked">✅ Débloqué</span>`;
      } else {
        const minPts = Math.min(...anyProgress);
        statusHtml = `<span class="tierHeader__req">${minPts}/${needed} pts T${tierNum-1}</span>`;
      }
    }

    col.innerHTML = `<div class="tierHeader" style="--tier-color:${TIER_COLORS[tierNum]}">
      <span class="tierHeader__label">${TIER_LABELS[tierNum]}</span>
      ${statusHtml}
    </div>`;

    // Cartes
    for(const t of tierTalents){
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

      let btnClass = "talentBtn";
      let btnLabel = `Acheter — 1 point`;
      if(locked){
        btnClass += " talentBtn--locked";
        const tierNeeded  = (t.tier??1) === 3 ? 20 : 10;
        const ptsHave     = getTierPointsSpent(t.category, (t.tier??1)-1);
        const tierBlocked = (t.tier??1) >= 2 && ptsHave < tierNeeded;
        btnLabel = tierBlocked ? `🔒 ${ptsHave}/${tierNeeded} pts Tier ${(t.tier??1)-1}` : "🔒 Prérequis manquant";
      }
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
        </div>
        <div class="talentCard__rankRow">
          <div class="talentCard__progressTrack">
            <div class="talentCard__progressFill" style="width:${pct}%;background:${barColor}"></div>
          </div>
          <div class="talentCard__rankLabel">${rank} / ${t.maxRank}</div>
        </div>
        <button class="${btnClass}" data-talent-buy="${t.id}" ${canBuy ? "" : "disabled"}>
          ${btnLabel}
        </button>
      `;
      col.appendChild(card);
    }

    grid.appendChild(col);
  }
}

talentListEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-talent-buy]");
  if(!btn || btn.disabled) return;
  // Pas de preventDefault — laisse le scroll fonctionner normalement sur mobile

  const id = btn.getAttribute("data-talent-buy");
  const t = TALENTS.find(x => x.id === id);
  if(!t) return;

  if(!hasRequirements(t)) return;

  const rank = getTalentRank(id);
  if(rank >= t.maxRank) return;
  if(state.talentPoints <= 0) return;

  state.talentPoints -= 1;
  state.talents[id] = rank + 1;
  const newRank = rank + 1;

  // Toast débloquage de tier — vérifie si ce rang franchit un seuil pour d'autres talents
  const TIER_THRESHOLDS = { 2: 10, 3: 20 };
  for(const [nextTier, needed] of Object.entries(TIER_THRESHOLDS)){
    const tierNum = parseInt(nextTier);
    // Le talent qu'on vient d'acheter est en tier (tierNum-1), même catégorie
    if((t.tier ?? 1) === tierNum - 1){
      const ptsNow = getTierPointsSpent(t.category, tierNum - 1);
      const ptsBefore = ptsNow - 1;
      if(ptsBefore < needed && ptsNow >= needed){
        const icons = { 2:"★★", 3:"★★★" };
        setTimeout(() => showToast(`${icons[tierNum]} Tier ${tierNum} ${t.category} débloqué !`), 50);
      }
    }
  }

  // Animation sur la carte talent
  const card = btn.closest(".talentCard");
  if(card){
    card.classList.remove("talentCard--justunlocked");
    void card.offsetWidth;
    card.classList.add("talentCard--justunlocked");
    setTimeout(() => card.classList.remove("talentCard--justunlocked"), 600);
  }

  applyTalentEffects();
  // Forcer le re-render immédiat du panel talents (pas via le tick, pour éviter le délai visuel)
  renderTalentsUI();
  _needsFullRender    = true;
  _needsUpgradeRender = true;
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
  const formulaEl = document.getElementById("resetCostFormula");
  if(formulaEl) formulaEl.textContent = totalRanks > 0 ? `${totalRanks} rang${totalRanks>1?"s":""} × 500 €` : "";

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
  state.talentSaleMult      = 1;
  state.talentClickBonus    = 0;
  state.talentShowroomSlots = 0;
  state.talentRareMult      = 1;
  state.talentQueueMult     = 1; // conservé pour compatibilité saves
  state.talentRepairAuto    = 0;
  state.talentRepairBonus   = 0;
  state.talentRepairMult    = 1;
  state.talentRepGainBonus  = 0;
  state.talentDiagRepBonus  = 0;
  state.talentDeliveryDisc  = 0;
  state.talentExtraSlots    = 0;
  state.talentWarehouseBonus = 0;

  applyTalentEffects();
  document.getElementById("talentResetModal").style.display = "none";
  showSaveIndicator(`✅ Reset — ${totalRanks} pts remboursés`);
  renderAll(true, true);
});

