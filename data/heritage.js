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
  // +1 par tranche de 10 niveaux au-dessus de 50
  const fromLevel = Math.max(0, Math.floor((state.garageLevel - 50) / 10));
  // +1 par tranche de 5000 voitures vendues
  const fromSales = Math.max(0, Math.floor((state.carsSold ?? 0) / 5000));
  // +1 par tranche de 25 000 REP au-dessus de 50k
  const fromRep   = Math.max(0, Math.floor(((state.rep ?? 0) - 50000) / 25000));
  const base = 1 + fromLevel + fromSales + fromRep;
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
  // Milestones : slots et moneyMult (appliqués après un reload de save)
  if(b.garageCap)   state.garageCap   = Math.max(state.garageCap,   1 + b.garageCap);
  if(b.showroomCap) state.showroomCap = Math.max(state.showroomCap, 3 + b.showroomCap);
  recalcRepairAuto(); // ajoute l'apprenti/mécanicien par-dessus
}

function canPrestige(){
  const repReq = Math.round(40000 * (state.specRepReqMult ?? 1.0));
  return state.garageLevel >= 50 && state.rep >= repReq;
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
  const persistTotalSales   = state.totalCarsSold     ?? 0;
  const persistTotalOrders  = state.totalOrders        ?? 0;
  const persistTotalClicks  = state.totalActionClicks  ?? 0;
  const persistChallenges      = state.challenges         ?? null;
  const persistSpecialization  = state.specialization      ?? null;
  const persistSession         = state.sessionStart;

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
    garageCap:         1 + (b.garageCap ?? 0),
    garageName:        persistGarageName,
    showroomCap:       3 + (b.showroomCap ?? 0),
    money:             Math.round((100 + b.startMoney) * (b.moneyMult ?? 1.0)),
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
    totalCarsSold:       persistTotalSales,
    totalOrders:         persistTotalOrders,
    totalActionClicks:   persistTotalClicks,
    challenges:          persistChallenges,
    specialization:      persistSpecialization,
    sessionStart:        persistSession,
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
  renderAll(true, true);
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
  renderAll(true, true);
});

