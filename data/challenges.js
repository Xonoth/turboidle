// =====================
// DÉFIS JOURNALIERS
// =====================

// Ordre des tiers pour le scaling
const TIER_ORDER_CHALLENGES = ["F","E","D","C","B","A","S","SS","SSS","SSS+"];

// Calcule le tier minimum exigé selon le garageLevel
function challengeTierForLevel(lvl){
  if(lvl < 5)  return "F";
  if(lvl < 10) return "E";
  if(lvl < 15) return "D";
  if(lvl < 22) return "C";
  if(lvl < 30) return "B";
  if(lvl < 40) return "A";
  if(lvl < 50) return "S";
  if(lvl < 65) return "SS";
  if(lvl < 80) return "SSS";
  return "SSS+";
}

// Définition des 4 types de défis avec scaling par garageLevel
const CHALLENGE_TYPES = [
  {
    id: "sell_cars",
    icon: "🚗",
    label: (cfg) => `Vendre ${cfg.count} voitures ${cfg.tier}+`,
    desc:  (cfg) => `Vendez ${cfg.count} voitures de tier ${cfg.tier} ou supérieur`,
    gen: (lvl) => {
      const tier  = challengeTierForLevel(lvl);
      const count = Math.max(5, Math.round(5 + lvl * 0.25));
      const reward_money = Math.round((500 * Math.pow(1.12, lvl)) / 1000) * 1000;
      return { tier, count, reward_money, reward_talent: 1 };
    },
    // Retourne la progression actuelle (0..count)
    progress: (cfg, snap) => Math.min(cfg.count, snap.soldTier ?? 0),
  },
  {
    id: "earn_rep",
    icon: "⭐",
    label: (cfg) => `Gagner ${cfg.amount.toLocaleString("fr-FR")} REP`,
    desc:  (cfg) => `Accumulez ${cfg.amount.toLocaleString("fr-FR")} points de réputation aujourd'hui`,
    gen: (lvl) => {
      const amount = Math.round((50 * Math.pow(1.08, lvl)) / 50) * 50;
      const reward_money = Math.round((300 * Math.pow(1.12, lvl)) / 1000) * 1000;
      return { amount, reward_money, reward_talent: 1 };
    },
    progress: (cfg, snap) => Math.min(cfg.amount, snap.repGained ?? 0),
  },
  {
    id: "earn_money",
    icon: "💰",
    label: (cfg) => `Gagner ${formatMoney(cfg.amount)}`,
    desc:  (cfg) => `Encaissez ${formatMoney(cfg.amount)} d'argent aujourd'hui`,
    gen: (lvl) => {
      const amount = Math.round((10000 * Math.pow(1.18, lvl)) / 1000) * 1000;
      const reward_money = Math.round(amount * 0.15 / 1000) * 1000;
      return { amount, reward_money, reward_talent: 1 };
    },
    progress: (cfg, snap) => Math.min(cfg.amount, snap.moneyEarned ?? 0),
  },
  {
    id: "action_clicks",
    icon: "🖱️",
    label: (cfg) => `Effectuer ${cfg.count} actions manuelles`,
    desc:  (cfg) => `Cliquez ${cfg.count} fois : réparation (atelier occupé), diagnostic (place dispo) ou vente (showroom non vide)`,
    gen: (lvl) => {
      const count = Math.max(50, Math.round(50 + lvl * 5.5));
      const reward_money = Math.round((200 * Math.pow(1.10, lvl)) / 500) * 500;
      return { count, reward_money, reward_talent: 1 };
    },
    progress: (cfg, snap) => Math.min(cfg.count, snap.clicks ?? 0),
  },
  {
    id: "order_parts",
    icon: "📦",
    label: (cfg) => `Commander ${cfg.count} pièce${cfg.count > 1 ? "s" : ""}`,
    desc:  (cfg) => `Passez ${cfg.count} commandes de pièces (manuel ou automatique)`,
    gen: (lvl) => {
      const count = Math.max(3, Math.round(3 + lvl * 0.4));
      const reward_money = Math.round((300 * Math.pow(1.11, lvl)) / 500) * 500;
      return { count, reward_money, reward_talent: 1 };
    },
    progress: (cfg, snap) => Math.min(cfg.count, snap.orders ?? 0),
  },
  {
    id: "sell_any",
    icon: "🏷️",
    label: (cfg) => `Vendre ${cfg.count} voitures`,
    desc:  (cfg) => `Vendez ${cfg.count} voitures, tous tiers confondus`,
    gen: (lvl) => {
      const count = Math.max(20, Math.round(20 + lvl * 3.5));
      const reward_money = Math.round((400 * Math.pow(1.11, lvl)) / 1000) * 1000;
      return { count, reward_money, reward_talent: 1 };
    },
    progress: (cfg, snap) => Math.min(cfg.count, snap.anySold ?? 0),
  },
];

// ── Générateur pseudo-aléatoire déterministe (seed) ──────────────────────────
function seededRand(seed){
  let s = seed;
  return function(){
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// Clé du jour : "YYYY-MM-DD"
function todayKey(){
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

// Génère les 3 défis du jour pour un garageLevel donné
function generateDailyChallenges(garageLevel){
  const key  = todayKey();
  // Seed = hash simple de la date + level (level figé à la génération)
  const seed = [...key].reduce((a,c) => a + c.charCodeAt(0), 0) * 31 + garageLevel;
  const rand = seededRand(seed);

  // Sélectionner 3 types distincts parmi les 4
  const pool  = [...CHALLENGE_TYPES];
  const picks = [];
  while(picks.length < 3){
    const idx = Math.floor(rand() * pool.length);
    picks.push(pool.splice(idx, 1)[0]);
  }

  return picks.map(type => {
    const cfg = type.gen(garageLevel);
    return {
      id:          type.id,
      icon:        type.icon,
      label:       type.label(cfg),
      desc:        type.desc(cfg),
      cfg,
      claimed:     false,
    };
  });
}

// ── Gestion du state défis ────────────────────────────────────────────────────
function initChallenges(){
  const key = todayKey();
  if(!state.challenges || state.challenges.day !== key){
    // Nouveau jour ou premier lancement
    const lvl = state.garageLevel ?? 1;
    state.challenges = {
      day:      key,
      genLevel: lvl,
      list:     generateDailyChallenges(lvl),
      snap: {
        soldTier:    0,
        repGained:   0,
        moneyEarned: 0,
        clicks:      0,
        orders:      0,
        anySold:     0,
        // Valeurs de base au moment de la génération (pour calculer le delta journalier)
        baseSoldTier:    0,
        baseRepGained:   state.rep ?? 0,
        baseMoneyEarned: state.totalMoneyEarned ?? 0,
        baseClicks:      state.totalActionClicks ?? 0,
        baseOrders:      state.manualOrders      ?? 0,
        baseAnySold:     state.manualCarsSold     ?? 0,
      },
    };
    save();
  }
}

// Appelé à chaque tick/action pour mettre à jour les snapshots
function updateChallengeSnap(){
  if(!state.challenges) return;
  const s = state.challenges.snap;
  s.repGained   = Math.max(0, (state.rep ?? 0)                - s.baseRepGained);
  s.moneyEarned = Math.max(0, (state.totalMoneyEarned ?? 0)   - s.baseMoneyEarned);
  s.clicks      = Math.max(0, (state.totalActionClicks ?? 0)  - s.baseClicks);
  s.orders      = Math.max(0, (state.manualOrders  ?? 0)       - s.baseOrders);
  s.anySold     = Math.max(0, (state.manualCarsSold ?? 0)       - (s.baseAnySold ?? 0));
}

// Appelé à chaque vente pour tracker les tiers
function trackChallengeSale(tier){
  if(!state.challenges) return;
  const tierIdx    = TIER_ORDER_CHALLENGES.indexOf(tier);
  // Chercher le défi sell_cars actif
  const defi = state.challenges.list.find(d => d.id === "sell_cars" && !d.claimed);
  if(!defi) return;
  const minIdx = TIER_ORDER_CHALLENGES.indexOf(defi.cfg.tier);
  if(tierIdx >= minIdx){
    state.challenges.snap.soldTier = (state.challenges.snap.soldTier ?? 0) + 1;
  }
}

// Réclamer une récompense
function claimChallenge(idx){
  if(!state.challenges) return;
  const defi = state.challenges.list[idx];
  if(!defi || defi.claimed) return;
  const type = CHALLENGE_TYPES.find(t => t.id === defi.id);
  if(!type) return;
  const prog = type.progress(defi.cfg, state.challenges.snap);
  if(prog < (defi.cfg.count ?? defi.cfg.amount)) return;

  defi.claimed = true;
  state.money        += defi.cfg.reward_money;
  state.talentPoints  = (state.talentPoints ?? 0) + defi.cfg.reward_talent;
  state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + defi.cfg.reward_money;

  // Bonus si tous les défis sont maintenant complétés
  const allDone = state.challenges.list.every(d => d.claimed);
  if(allDone && !state.challenges.bonusClaimed){
    state.challenges.bonusClaimed = true;
    const lvl = state.challenges.genLevel ?? state.garageLevel ?? 1;
    const bonusRep = Math.round((50 * Math.pow(1.08, lvl)) / 50) * 50;
    state.rep += bonusRep;
    state.challenges.bonusRep = bonusRep;
    showToast(`🎉 Tous les défis complétés ! +${bonusRep.toLocaleString("fr-FR")} REP bonus !`);
  }

  renderChallengesUI();
  renderAll(false, true);
  save();
}

// Progression 0..1 d'un défi
function challengeProgress(defi){
  if(!state.challenges) return 0;
  const type = CHALLENGE_TYPES.find(t => t.id === defi.id);
  if(!type) return 0;
  const max = defi.cfg.count ?? defi.cfg.amount;
  return Math.min(1, type.progress(defi.cfg, state.challenges.snap) / max);
}
