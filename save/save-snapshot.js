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
const SAVE_VERSION = 10;

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
    totalActionClicks: state.totalActionClicks ?? 0,
    totalOrders:       state.totalOrders       ?? 0,
    manualCarsSold:    state.manualCarsSold     ?? 0,
    manualOrders:      state.manualOrders       ?? 0,
    totalCarsSold:    state.totalCarsSold   ?? 0,
    runMoneyPassive:  state.runMoneyPassive  ?? 0,
    runMoneySales:    state.runMoneySales    ?? 0,
    runMoneyDiag:     state.runMoneyDiag     ?? 0,
    runMoneyParts:    state.runMoneyParts    ?? 0,
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
    actives:  (state.actives ?? []).filter(Boolean), // slots Chef d'Atelier
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

    // ── Défis journaliers ──────────────────────────────────────────────────
    challenges:       state.challenges       ?? null,
    challengeStreak:  state.challengeStreak  ?? null,
    specialization:  state.specialization  ?? null,
    specialization2: state.specialization2 ?? null,
    bestTier:        state.bestTier        ?? null,
    repMax:          state.repMax          ?? 0,

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

  // ── v3 → v4 : défis journaliers + compteurs actions/commandes ──────────────
  if(data.v < 4) {
    data.totalActionClicks = data.totalActionClicks ?? 0;
    data.totalOrders       = data.totalOrders       ?? 0;
    data.challenges        = data.challenges        ?? null;
    data.v = 4;
  }

  // ── v4 → v5 : trackers argent par source (run actuel) ────────────────────
  if(data.v < 5) {
    data.runMoneyPassive = data.runMoneyPassive ?? 0;
    data.runMoneySales   = data.runMoneySales   ?? 0;
    data.runMoneyDiag    = data.runMoneyDiag    ?? 0;
    data.runMoneyParts   = data.runMoneyParts   ?? 0;
    data.v = 5;
  }

  // ── v5 → v6 : spécialisation garage ──────────────────────────────────────
  if(data.v < 6) {
    data.specialization = data.specialization ?? null;
    data.v = 6;
  }

  // ── v6 → v7 : compteurs manuels pour défis (hors AFK) ───────────────────
  if(data.v < 7) {
    data.manualCarsSold = data.manualCarsSold ?? 0;
    data.manualOrders   = data.manualOrders   ?? 0;
    data.v = 7;
  }

  // ── v8 → v9 : slots réparation simultanée + nouveaux perks héritage ────────
  // ── v7 → v8 : bestTier + repMax (profil enrichi) ──────────────────────────
  if(data.v < 8) {
    data.bestTier = data.bestTier ?? null;
    data.repMax   = data.repMax   ?? 0;
    data.v = 8;
  }

  if(data.v < 9) {
    data.actives         = data.actives        ?? [];
    data.specialization2 = data.specialization2 ?? null;
    data.v = 9;
  }

  // ── v9 → v10 : système de paliers bronze/argent/or sur les défis ───────────
  if(data.v < 10) {
    // Si les défis existent mais n'ont pas la structure tiers → les invalider
    // pour forcer une régénération propre au prochain initChallenges()
    if(data.challenges?.list?.length > 0){
      const hasTiers = data.challenges.list.every(d => Array.isArray(d.tiers));
      if(!hasTiers){
        data.challenges = null; // initChallenges() régénérera au chargement
      }
    }
    data.challengeStreak = data.challengeStreak ?? { count:0, lastCompleted:null };
    data.v = 10;
  }

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
  state.totalActionClicks = data.totalActionClicks ?? 0;
  state.totalOrders       = data.totalOrders       ?? 0;
  state.manualCarsSold    = data.manualCarsSold     ?? 0;
  state.manualOrders      = data.manualOrders       ?? 0;
  state.totalCarsSold     = data.totalCarsSold     ?? 0;
  state.runMoneyPassive   = data.runMoneyPassive   ?? 0;
  state.runMoneySales     = data.runMoneySales     ?? 0;
  state.runMoneyDiag      = data.runMoneyDiag      ?? 0;
  state.runMoneyParts     = data.runMoneyParts     ?? 0;
  state.sessionStart      = Date.now();  // remis à now() à chaque chargement

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
        base.lvl = saved.lvl ?? 0;
        // Garde le cost sauvegardé seulement s'il est >= au coût de base
        // (protège contre les saves corrompues avec cost:100 par défaut)
        const baseCost = getBaseUpgradeCost(base.id);
        base.cost = (saved.cost && saved.cost >= baseCost) ? saved.cost : baseCost;
      }
    });
  }

  // 7. File d'attente, voiture active, showroom
  state.queue    = data.queue    ?? [];
  state.active   = data.active   ?? null;
  state.actives  = data.actives  ?? [];  // slots Chef d'Atelier
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
  state.challenges     = data.challenges     ?? null;
  state.specialization  = data.specialization  ?? null;
  state.specialization2 = data.specialization2 ?? null;
  state.bestTier        = data.bestTier        ?? null;
  state.repMax          = data.repMax          ?? 0;

  // 11. Flags internes
  state._hasSaved = data._hasSaved ?? false;

  // 12. Recalcul des effets dérivés — ordre critique (voir commentaire doPrestige)
  applyGarageName();
  applyHeritageBonuses();       // ← doit précéder applyHeritageBonusesToState
  applyHeritageBonusesToState();
  rebuildUpgradeMap();          // ← doit précéder applyTalentEffects et recalcUpgradeEffects
  recalcUpgradeEffects();       // ← repart des niveaux sauvegardés, recalcule diagReward/repairClick/speedMult etc.
  applyTalentEffects();         // ← appelle applySpecializationEffects en interne
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
      // Marquer que le catchup vient d'être fait — évite le double avec visibilitychange
      window._lastSnapshotCatchup = performance.now();
    }
  }
}


