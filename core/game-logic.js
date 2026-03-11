// core/game-logic.js

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
