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

// Définition des types de défis avec paliers bronze / argent / or
// Chaque palier = { target_mult, reward_money_mult, reward_talent, reward_rep_mult }
const CHALLENGE_TIERS = [
  { id:"bronze", label:"🥉 Bronze", mult:1.00, money_mult:1.0, talent:0, rep_mult:0   },
  { id:"silver", label:"🥈 Argent", mult:1.80, money_mult:2.5, talent:1, rep_mult:0.5 },
  { id:"gold",   label:"🥇 Or",     mult:3.00, money_mult:5.0, talent:2, rep_mult:1.0 },
];

const CHALLENGE_TYPES = [
  {
    id: "sell_cars",
    icon: "🚗",
    label: (cfg) => `Vendre des ${cfg.tier}+`,
    desc:  (cfg) => `Vendez des voitures de tier ${cfg.tier} ou supérieur`,
    gen: (lvl) => {
      const tier  = challengeTierForLevel(lvl);
      const base  = Math.max(5, Math.round(5 + lvl * 0.25));
      const reward_money = Math.round(Math.max(200, 0.08399 * Math.pow(lvl, 3.6778)) / 500) * 500;
      const reward_rep   = Math.round(Math.max(50, 0.8 * Math.pow(lvl, 1.5)) / 50) * 50;
      return { tier, base, reward_money, reward_rep };
    },
    progress: (cfg, snap) => snap.soldTier ?? 0,
    target:   (cfg, tier) => Math.round(cfg.base * tier.mult),
  },
  {
    id: "earn_rep",
    icon: "⭐",
    label: (cfg) => `Gagner de la REP`,
    desc:  (cfg) => `Accumulez des points de réputation aujourd'hui`,
    gen: (lvl) => {
      const base  = Math.round(Math.max(100, 1.1330 * Math.pow(lvl, 2.4229)) / 50) * 50;
      const reward_money = Math.round(Math.max(200, 0.08399 * Math.pow(lvl, 3.6778)) / 500) * 500;
      const reward_rep   = Math.round(base * 0.2 / 10) * 10;
      return { base, reward_money, reward_rep };
    },
    progress: (cfg, snap) => snap.repGained ?? 0,
    target:   (cfg, tier) => Math.round(cfg.base * tier.mult),
  },
  {
    id: "earn_money",
    icon: "💰",
    label: (cfg) => `Gagner de l'argent`,
    desc:  (cfg) => `Encaissez de l'argent aujourd'hui`,
    gen: (lvl) => {
      // Calibrée : Bronze=15min, Argent=30min, Or=45-60min de jeu actif
      const base  = Math.round(Math.max(2000, 0.91777 * Math.pow(lvl, 4.4175)) / 1000) * 1000;
      const reward_money = Math.round(base * 0.08 / 1000) * 1000;
      const reward_rep   = Math.round((20 * Math.pow(1.04, lvl)) / 10) * 10;
      return { base, reward_money, reward_rep };
    },
    progress: (cfg, snap) => snap.moneyEarned ?? 0,
    target:   (cfg, tier) => Math.round(cfg.base * tier.mult),
  },
  {
    id: "action_clicks",
    icon: "🖱️",
    label: (cfg) => `Effectuer des actions manuelles`,
    desc:  (cfg) => `Cliquez : réparation (atelier occupé), diagnostic (place dispo) ou vente (showroom non vide)`,
    gen: (lvl) => {
      const base  = Math.max(50, Math.round(50 + lvl * 5.5));
      const reward_money = Math.round(Math.max(200, 0.08399 * Math.pow(lvl, 3.6778)) / 500) * 500;
      const reward_rep   = Math.round(Math.max(10, 0.5 * Math.pow(lvl, 1.5)) / 10) * 10;
      return { base, reward_money, reward_rep };
    },
    progress: (cfg, snap) => snap.clicks ?? 0,
    target:   (cfg, tier) => Math.round(cfg.base * tier.mult),
  },
  {
    id: "order_parts",
    icon: "📦",
    label: (cfg) => `Commander des pièces`,
    desc:  (cfg) => `Passez des commandes de pièces (manuel ou automatique)`,
    gen: (lvl) => {
      const base  = Math.max(3, Math.round(3 + lvl * 0.4));
      const reward_money = Math.round(Math.max(200, 0.08399 * Math.pow(lvl, 3.6778)) / 500) * 500;
      const reward_rep   = Math.round(Math.max(10, 0.4 * Math.pow(lvl, 1.5)) / 10) * 10;
      return { base, reward_money, reward_rep };
    },
    progress: (cfg, snap) => snap.orders ?? 0,
    target:   (cfg, tier) => Math.round(cfg.base * tier.mult),
  },
  {
    id: "sell_any",
    icon: "🏷️",
    label: (cfg) => `Vendre des voitures`,
    desc:  (cfg) => `Vendez des voitures, tous tiers confondus`,
    gen: (lvl) => {
      const base  = Math.max(30, Math.round(30 + lvl * 5.0)); // plus exigeant
      const reward_money = Math.round(Math.max(200, 0.08399 * Math.pow(lvl, 3.6778)) / 500) * 500;
      const reward_rep   = Math.round(Math.max(20, 0.6 * Math.pow(lvl, 1.5)) / 10) * 10;
      return { base, reward_money, reward_rep };
    },
    progress: (cfg, snap) => snap.anySold ?? 0,
    target:   (cfg, tier) => Math.round(cfg.base * tier.mult),
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

  // Sélectionner 3 types distincts — jamais sell_cars ET sell_any ensemble
  const pool  = [...CHALLENGE_TYPES];
  const picks = [];
  while(picks.length < 3){
    const idx  = Math.floor(rand() * pool.length);
    const pick = pool[idx];
    // Éviter co-occurrence sell_cars + sell_any
    const hasSell    = picks.some(p => p.id === "sell_cars");
    const hasAny     = picks.some(p => p.id === "sell_any");
    if((pick.id === "sell_any" && hasSell) || (pick.id === "sell_cars" && hasAny)){
      pool.splice(idx, 1); // retirer et réessayer
      if(pool.length === 0) break;
      continue;
    }
    picks.push(pool.splice(idx, 1)[0]);
  }

  return picks.map(type => {
    const cfg = type.gen(garageLevel);
    // Calculer les targets pour chaque palier
    const tiers = CHALLENGE_TIERS.map(tier => ({
      ...tier,
      target:       type.target(cfg, tier),
      claimed:      false,
      reward_money: Math.round(cfg.reward_money * tier.money_mult / 500) * 500,
      reward_talent:tier.talent,
      reward_rep:   tier.rep_mult > 0 ? Math.round(cfg.reward_rep * tier.rep_mult / 10) * 10 : 0,
    }));
    return {
      id:     type.id,
      icon:   type.icon,
      label:  type.label(cfg),
      desc:   type.desc(cfg),
      cfg,
      tiers,
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
        baseOrders:      (state.manualOrders ?? 0) + (state.totalOrders ?? 0),
        baseAnySold:     state.totalCarsSold      ?? 0,  // toutes ventes (manuel + auto)
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
  s.orders      = Math.max(0, ((state.manualOrders ?? 0) + (state.totalOrders ?? 0)) - s.baseOrders);
  s.anySold     = Math.max(0, (state.totalCarsSold  ?? 0)       - (s.baseAnySold ?? 0));
}

// Appelé à chaque vente pour tracker les tiers
function trackChallengeSale(tier){
  if(!state.challenges) return;
  const tierIdx = TIER_ORDER_CHALLENGES.indexOf(tier);
  // Chercher le défi sell_cars dont le palier Or n'est pas encore réclamé
  const defi = state.challenges.list.find(d =>
    d.id === "sell_cars" && !(d.tiers?.[2]?.claimed)
  );
  if(!defi) return;
  const minIdx = TIER_ORDER_CHALLENGES.indexOf(defi.cfg.tier);
  if(tierIdx >= minIdx){
    state.challenges.snap.soldTier = (state.challenges.snap.soldTier ?? 0) + 1;
  }
}

// ── Streak journalier ────────────────────────────────────────────────────────
function updateStreak(){
  if(!state.challengeStreak) state.challengeStreak = { count:0, lastCompleted:null };
  const today = todayKey();
  const str   = state.challengeStreak;

  // Déjà compté aujourd'hui
  if(str.lastCompleted === today) return;

  // Vérifier si hier était complété (pour maintenir le streak)
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
  const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,"0")}-${String(yesterday.getDate()).padStart(2,"0")}`;

  if(str.lastCompleted === yKey){
    str.count++;
  } else if(str.lastCompleted !== today){
    str.count = 1; // reset si on a sauté un jour
  }
  str.lastCompleted = today;
}

function getStreakBonus(){
  const count = state.challengeStreak?.count ?? 0;
  if(count >= 30) return 3.0;
  if(count >= 14) return 2.0;
  if(count >=  7) return 1.5;
  if(count >=  3) return 1.25;
  return 1.0;
}

// Réclamer un palier d'un défi
function claimChallengeTier(idx, tierIdx){
  if(!state.challenges) return;
  const defi = state.challenges.list[idx];
  if(!defi) return;
  const tier = defi.tiers?.[tierIdx];
  if(!tier || tier.claimed) return;

  const type = CHALLENGE_TYPES.find(t => t.id === defi.id);
  if(!type) return;
  const prog = type.progress(defi.cfg, state.challenges.snap);
  if(prog < tier.target) return;

  // Réclamer tous les paliers inférieurs non réclamés en même temps
  const mult = getStreakBonus();
  for(let i = 0; i <= tierIdx; i++){
    if(!defi.tiers[i].claimed){
      defi.tiers[i].claimed = true;
      const money = Math.round(defi.tiers[i].reward_money * mult);
      state.money            += money;
      // Note : on n'ajoute PAS à totalMoneyEarned pour ne pas fausser earn_money
      if(defi.tiers[i].reward_talent > 0)
        state.talentPoints = (state.talentPoints ?? 0) + defi.tiers[i].reward_talent;
      if(defi.tiers[i].reward_rep > 0){
        state.rep = (state.rep ?? 0) + Math.round(defi.tiers[i].reward_rep * mult);
        if(state.rep > (state.repMax??0)) state.repMax = state.rep;
      }
    }
  }
  // Toast streak — une seule fois après réclamation complète
  if(mult > 1 && tierIdx === defi.tiers.length - 1){
    showToast(`🔥 Streak ×${mult} — récompenses boostées !`);
  }

  // Vérifier si tous les paliers Or sont réclamés → bonus complétion + streak
  const allGoldClaimed = state.challenges.list.every(d => d.tiers?.[2]?.claimed);
  if(allGoldClaimed && !state.challenges.bonusClaimed){
    state.challenges.bonusClaimed = true;
    const lvl = state.challenges.genLevel ?? state.garageLevel ?? 1;
    const bonusRep = Math.round(Math.max(50, Math.round(Math.max(50, 1.6017 * Math.pow(lvl, 1.7954)) / 50) * 50) * getStreakBonus());
    state.rep += bonusRep;
    if(state.rep > (state.repMax??0)) state.repMax = state.rep;
    state.challenges.bonusRep = bonusRep;
    updateStreak();
    showToast(`🎉 Tous les défis Or complétés ! +${bonusRep.toLocaleString("fr-FR")} REP bonus !`);
  }

  renderChallengesUI();
  renderAll(false, true);
  save();
}

// Compat ancienne fonction
function claimChallenge(idx){ claimChallengeTier(idx, 2); }

// Progression absolue d'un défi
function challengeCurrentValue(defi){
  if(!state.challenges) return 0;
  const type = CHALLENGE_TYPES.find(t => t.id === defi.id);
  if(!type) return 0;
  return type.progress(defi.cfg, state.challenges.snap);
}

// Progression 0..1 d'un défi vers le palier or (compat)
function challengeProgress(defi){
  if(!defi.tiers) return 0;
  const goldTarget = defi.tiers[2]?.target ?? 1;
  return Math.min(1, challengeCurrentValue(defi) / goldTarget);
}

// Initialiser le streak si besoin
if(!state.challengeStreak) state.challengeStreak = { count:0, lastCompleted:null };
