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
  // Occupés = voiture en atelier (slot 0 + slots chef_atelier) + voitures en file
  const activeCount = (state.active ? 1 : 0) + (state.actives?.filter(Boolean).length ?? 0);
  const occupied = activeCount + state.queue.length;
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

  // Construire la liste des voitures affichées dans les slots garage
  // Slot 0 = state.active, slots 1..N = state.actives[], reste = state.queue[]
  const chefSlots = typeof getActiveRepairSlots === "function" ? getActiveRepairSlots() : 1;

  for(let i = 0; i < state.garageCap; i++){
    const slot = document.createElement("div");

    // Déterminer la voiture dans ce slot
    let isChefSlot = false;
    let chefSlotIndex = -1; // index dans actives[] (0-based)
    let car_i;

    if(i === 0){
      car_i = state.active;
    } else if(i < chefSlots){
      // Slot supplémentaire Chef d'Atelier
      isChefSlot = true;
      chefSlotIndex = i - 1;
      car_i = state.actives?.[chefSlotIndex] ?? null;
    } else {
      // File d'attente (décalée selon le nombre de slots actifs)
      const queueIdx = i - chefSlots;
      car_i = state.queue[queueIdx] ?? null;
    }

    if(i === 0 || isChefSlot){
      const car = car_i;
      const slotMalusLabel = isChefSlot
        ? `<span class="garageSlot__malus">−${(i) * 10}% ⚡</span>`
        : "";
      if(car){
        const pct = car.repairTime > 0 ? Math.max(0, (1 - car.timeRemaining / car.repairTime) * 100) : 100;
        const t = TIERS[car.tier] || TIERS["F"];
        const fail = car.failure ? FAILURE_CATEGORIES[car.failure.category] : null;
        const partsMult = getPartsSpeedMult(car);
        const hasMissingParts = car.failure?.parts?.length && !checkPartsAvailability(car.failure.parts).ok;
        const barColor = hasMissingParts ? "#ff8c40" : "";
        slot.className = "garageSlot garageSlot--active";
        slot.style.setProperty("--tier-color", t.color);
        if(i === 0 && _activeJustStarted){
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
              <div style="display:flex;align-items:center;gap:6px">
                ${slotMalusLabel}
                <span class="garageSlot__status garageSlot__status--active">${hasMissingParts ? "⚠️ PIÈCE MANQUANTE" : "EN RÉPARATION"}</span>
              </div>
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
          <div class="garageSlot__num">${isChefSlot ? "👑" : "🔧"}</div>
          <div class="garageSlot__body">
            <div class="garageSlot__label">${isChefSlot
              ? `Slot Chef d'Atelier ${slotMalusLabel}`
              : "Emplacement libre"}</div>
          </div>
        `;
      }
    } else {
      const car = car_i;
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
  } else {
    activeCarTitleEl.textContent = car.name;
    activeCarValueEl.textContent = formatMoney(car.baseValue);
    activeCarTimeEl.textContent = car.timeRemaining.toFixed(1);
    activeCarTierEl.textContent = car.tier;

    const total = car.repairTime;
    const left  = Math.max(0, car.timeRemaining);
    const pct   = total > 0 ? (1 - (left / total)) : 1;
    repairBarEl.style.width = `${(pct * 100).toFixed(1)}%`;
    repairBarEl.classList.toggle("garageSlot__barFill--almostDone", pct >= 0.85);

    // Mettre à jour la mini barre slot 0 dans la grille
    if(!_activeBarFill) _activeBarFill = garageSlotsEl?.querySelector(".garageSlot--active .garageSlot__barFill");
    if(!_activeMetaEl)  _activeMetaEl  = garageSlotsEl?.querySelector(".garageSlot--active .garageSlot__meta");
    if(_activeBarFill){
      _activeBarFill.style.width = `${(pct * 100).toFixed(1)}%`;
      _activeBarFill.classList.toggle("garageSlot__barFill--almostDone", pct >= 0.85);
    }
    const t = TIERS[car.tier] || TIERS["F"];
    const timeLeft = Math.max(0, car.timeRemaining ?? 0);
    if(_activeMetaEl) _activeMetaEl.textContent = `${t.desc} · ${formatMoney(car.baseValue)} · ⏱️ ${formatTime(timeLeft)} · ${(pct*100).toFixed(0)}%`;
  }

  // ── Mise à jour temps réel des slots Chef d'Atelier (actives[]) ──────────
  if(!state.actives) return;
  const activeSlots = garageSlotsEl?.querySelectorAll(".garageSlot--active");
  if(!activeSlots) return;

  // activeSlots[0] = slot principal (déjà traité ci-dessus)
  // activeSlots[1..N] = slots Chef d'Atelier
  state.actives.forEach((activeCar, idx) => {
    if(!activeCar) return;
    const slotEl = activeSlots[idx + 1]; // +1 car slot 0 = principal
    if(!slotEl) return;

    const barFill = slotEl.querySelector(".garageSlot__barFill");
    const metaEl  = slotEl.querySelector(".garageSlot__meta");
    const timeEl  = slotEl.querySelector("[data-time]");

    const pct = activeCar.repairTime > 0
      ? Math.max(0, (1 - activeCar.timeRemaining / activeCar.repairTime)) * 100
      : 100;

    if(barFill){
      barFill.style.width = `${pct.toFixed(1)}%`;
      barFill.classList.toggle("garageSlot__barFill--almostDone", pct >= 85);
    }
    const t = TIERS[activeCar.tier] || TIERS["F"];
    const timeLeft = Math.max(0, activeCar.timeRemaining ?? 0);
    if(metaEl){
      metaEl.textContent = `${t.desc} · ${formatMoney(activeCar.baseValue)} · ⏱️ ${formatTime(timeLeft)} · ${pct.toFixed(0)}%`;
    }
    // Mettre à jour le temps restant dans la status bar aussi
    const statusEl = slotEl.querySelector(".garageSlot__status--active");
    // Le temps restant dans le slot (affiché dans le meta row)
    const timeSpan = slotEl.querySelectorAll(".garageSlot__meta span");
    if(timeSpan[1]){
      const s = Math.round(timeLeft);
      timeSpan[1].textContent = `⏱️ ${s >= 60 ? `${Math.floor(s/60)}m${s%60>0?s%60+'s':''}` : s+'s'}`;
    }
    if(timeSpan[2]) timeSpan[2].textContent = `${pct.toFixed(0)}%`;
  });
}

function renderShowroom(){
  showroomListEl.innerHTML = "";
  const cap = getShowroomCap();
  const count = state.showroom.length;

  // G2 — Flash sur le titre showroom quand vente auto
  if(_autoSellFlash){
    _autoSellFlash = false;
    const showroomHead = document.querySelector(".panel--showroom .panel__head");
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

  // ── Barre filtre / tri ─────────────────────────────────────────────────────
  const filterBar = document.createElement("div");
  filterBar.className = "upgradeFilterBar";

  const hasActiveFilter = _upgradeFilter.status !== "all" || _upgradeFilter.effect !== "all" || _upgradeSort !== "default";

  filterBar.innerHTML = `
    <div class="upgradeFilterBar__topRow">
      <button class="upgradeFilterBar__toggle ${_upgradeFilterVisible ? 'upgradeFilterBar__toggle--open' : ''} ${hasActiveFilter ? 'upgradeFilterBar__toggle--active' : ''}" id="btnToggleFilter">
        <span>🔽 Filtres & Tri</span>
        ${hasActiveFilter ? '<span class="upgradeFilterBar__dot"></span>' : ''}
      </button>
      ${hasActiveFilter ? `<button class="upgradeFilterBar__reset" id="btnResetFilter">✕ Réinitialiser</button>` : ''}
    </div>
    <div class="upgradeFilterBar__body ${_upgradeFilterVisible ? '' : 'upgradeFilterBar__body--hidden'}">
      <div class="upgradeFilterBar__group">
        <button class="upgradeFilterBtn ${_upgradeFilter.status==='all'?'upgradeFilterBtn--active':''}" data-fstatus="all">Tous</button>
        <button class="upgradeFilterBtn ${_upgradeFilter.status==='buyable'?'upgradeFilterBtn--active':''}" data-fstatus="buyable">💰 Achetable</button>
        <button class="upgradeFilterBtn ${_upgradeFilter.status==='unlocked'?'upgradeFilterBtn--active':''}" data-fstatus="unlocked">🔓 Déverrouillé</button>
        <button class="upgradeFilterBtn ${_upgradeFilter.status==='locked'?'upgradeFilterBtn--active':''}" data-fstatus="locked">🔒 Verrouillé</button>
        <button class="upgradeFilterBtn ${_upgradeFilter.status==='maxed'?'upgradeFilterBtn--active':''}" data-fstatus="maxed">✅ Max</button>
      </div>
      <div class="upgradeFilterBar__group">
        <button class="upgradeFilterBtn ${_upgradeFilter.effect==='all'?'upgradeFilterBtn--active':''}" data-feffect="all">Tout</button>
        <button class="upgradeFilterBtn ${_upgradeFilter.effect==='vitesse'?'upgradeFilterBtn--active':''}" data-feffect="vitesse">⚡ Vitesse</button>
        <button class="upgradeFilterBtn ${_upgradeFilter.effect==='argent'?'upgradeFilterBtn--active':''}" data-feffect="argent">💰 Argent</button>
        <button class="upgradeFilterBtn ${_upgradeFilter.effect==='vente'?'upgradeFilterBtn--active':''}" data-feffect="vente">🚗 Vente</button>
        <button class="upgradeFilterBtn ${_upgradeFilter.effect==='diagnostic'?'upgradeFilterBtn--active':''}" data-feffect="diagnostic">🔍 Diag</button>
        <button class="upgradeFilterBtn ${_upgradeFilter.effect==='stock'?'upgradeFilterBtn--active':''}" data-feffect="stock">📦 Stock</button>
      </div>
      <div class="upgradeFilterBar__group upgradeFilterBar__group--right">
        <button class="upgradeFilterBtn upgradeFilterBtn--sort ${_upgradeSort==='default'?'upgradeFilterBtn--active':''}" data-fsort="default">⚙️ Défaut</button>
        <button class="upgradeFilterBtn upgradeFilterBtn--sort ${_upgradeSort==='price_asc'?'upgradeFilterBtn--active':''}" data-fsort="price_asc">💲↑ Prix</button>
        <button class="upgradeFilterBtn upgradeFilterBtn--sort ${_upgradeSort==='price_desc'?'upgradeFilterBtn--active':''}" data-fsort="price_desc">💲↓ Prix</button>
      </div>
    </div>
  `;

  // Listeners toggle + reset
  filterBar.querySelector("#btnToggleFilter").addEventListener("click", () => {
    _upgradeFilterVisible = !_upgradeFilterVisible;
    renderUpgrades();
  });
  filterBar.querySelector("#btnResetFilter")?.addEventListener("click", () => {
    _upgradeFilter = { status: "all", effect: "all" };
    _upgradeSort   = "default";
    renderUpgrades();
  });

  // Listeners filtre/tri
  filterBar.querySelectorAll("[data-fstatus]").forEach(btn => {
    btn.addEventListener("click", () => {
      _upgradeFilter.status = btn.dataset.fstatus;
      renderUpgrades();
    });
  });
  filterBar.querySelectorAll("[data-feffect]").forEach(btn => {
    btn.addEventListener("click", () => {
      _upgradeFilter.effect = btn.dataset.feffect;
      renderUpgrades();
    });
  });
  filterBar.querySelectorAll("[data-fsort]").forEach(btn => {
    btn.addEventListener("click", () => {
      _upgradeSort = btn.dataset.fsort;
      renderUpgrades();
    });
  });
  upgradeListEl.appendChild(filterBar);

  // ── Filtrage & tri ──────────────────────────────────────────────────────────
  let filteredUpgrades = state.upgrades.filter(u => u.tab === state.activeTab);

  // Prérequis des upgrades avec dépendances
  // Format : { upgrades: [{id, lvl}], prestige: N }
  const UPGRADE_PREREQS = {
    "receptionnaire":  { upgrades:[{ id:"stagiaire",        lvl:10 }], prestige:0 },
    "vendeur_confirme":{ upgrades:[{ id:"vendeur",          lvl:10 }], prestige:0 },
    "vendeur_expert":  { upgrades:[{ id:"vendeur_confirme", lvl:10 }], prestige:5 },
    "ia_diagnostic":   { upgrades:[{ id:"receptionnaire",   lvl:10 }], prestige:5 },
    "chef_atelier":    { upgrades:[],                                   prestige:7 },
    "scanner_pro":        { upgrades:[], prestige:3 },
    "cle_dynamometrique": { upgrades:[], prestige:4 },
    "turbocompresseur":   { upgrades:[], prestige:5 },
    "reseau_national":    { upgrades:[], prestige:2 },
    "holding_auto":       { upgrades:[], prestige:4 },
    "galerie_marchande":  { upgrades:[{ id:"showroom_slot", lvl:4 }], prestige:2 },
    "extension_atelier":  { upgrades:[{ id:"lift",          lvl:5 }], prestige:3 },
  };

  // Helper — vérifie tous les prérequis d'un upgrade
  function checkPrereqs(id){
    const p = UPGRADE_PREREQS[id];
    if(!p) return { met:true, reasons:[] };
    const reasons = [];
    for(const req of p.upgrades){
      const have = state.upgrades.find(x => x.id === req.id)?.lvl ?? 0;
      if(have < req.lvl){
        const name = state.upgrades.find(x => x.id === req.id)?.name ?? req.id;
        reasons.push(`${name} niv.${req.lvl} (${have}/${req.lvl})`);
      }
    }
    if(p.prestige > 0 && (state.prestigeCount ?? 0) < p.prestige){
      reasons.push(`Prestige ${p.prestige} (${state.prestigeCount ?? 0}/${p.prestige})`);
    }
    return { met: reasons.length === 0, reasons };
  }

  // Upgrades prestige verrouillés toujours en dernier (par onglet)
  const PRESTIGE_BY_TAB = {
    team:  ["vendeur_expert", "ia_diagnostic", "chef_atelier"],
    deals: ["reseau_national", "holding_auto", "galerie_marchande", "extension_atelier"],
    tools: ["scanner_pro", "cle_dynamometrique", "turbocompresseur"],
  };
  const prestigeList = PRESTIGE_BY_TAB[state.activeTab] ?? [];
  if(prestigeList.length){
    filteredUpgrades.sort((a, b) => {
      const aLocked = prestigeList.includes(a.id) && !checkPrereqs(a.id).met;
      const bLocked = prestigeList.includes(b.id) && !checkPrereqs(b.id).met;
      if(aLocked && !bLocked) return 1;
      if(!aLocked && bLocked) return -1;
      return 0;
    });
  }

  // Appliquer filtres statut & effet
  filteredUpgrades = filteredUpgrades.filter(u => {
    const isMaxed   = u.maxLvl !== undefined && u.lvl >= u.maxLvl;
    const { met }   = checkPrereqs(u.id);
    const canBuy    = !isMaxed && met && state.money >= u.cost;

    if(_upgradeFilter.status === "buyable"  && !canBuy)       return false;
    if(_upgradeFilter.status === "unlocked" && (!met || isMaxed)) return false;
    if(_upgradeFilter.status === "locked"   && met)           return false;
    if(_upgradeFilter.status === "maxed"    && !isMaxed)      return false;

    if(_upgradeFilter.effect !== "all"){
      const tags = (typeof UPGRADE_TAGS !== "undefined" ? UPGRADE_TAGS[u.id] : null) ?? [];
      if(!tags.includes(_upgradeFilter.effect)) return false;
    }
    return true;
  });

  // Trier
  if(_upgradeSort === "price_asc")  filteredUpgrades.sort((a,b) => a.cost - b.cost);
  if(_upgradeSort === "price_desc") filteredUpgrades.sort((a,b) => b.cost - a.cost);

  if(filteredUpgrades.length === 0){
    const empty = document.createElement("div");
    empty.className = "upgradeFilter__empty";
    empty.textContent = "Aucune amélioration ne correspond à ces filtres.";
    upgradeListEl.appendChild(empty);
    return;
  }

  for(const u of filteredUpgrades){
    const isMaxed = u.maxLvl !== undefined && u.lvl >= u.maxLvl;

    // Vérifier prérequis (nouveau système multi-prérequis + prestige)
    const { met: prereqMet, reasons: prereqReasons } = checkPrereqs(u.id);
    const canBuy  = !isMaxed && prereqMet && state.money >= u.cost;

    const maxLvlHtml = u.maxLvl !== undefined
      ? `<div class="item__maxlvl">${isMaxed ? `✅ Niveau maximum atteint (${u.maxLvl})` : `Niveau max : ${u.maxLvl}`}</div>`
      : "";

    const prereqHtml = !prereqMet
      ? prereqReasons.map(r => `<div class="item__prereq">🔒 Nécessite : ${r}</div>`).join("")
      : "";

    // Tags d'effet pour le tooltip
    const tags = (typeof UPGRADE_TAGS !== "undefined" ? UPGRADE_TAGS[u.id] : null) ?? [];
    const tagsHtml = tags.map(t => `<span class="upgradeTooltip__tag upgradeTooltip__tag--${t}">${
      {vitesse:"⚡ Vitesse", argent:"💰 Argent", vente:"🚗 Vente", diagnostic:"🔍 Diagnostic", stock:"📦 Stock"}[t] ?? t
    }</span>`).join("");

    // Infos prochain niveau
    const nextCost = Math.ceil(u.cost * (UPGRADE_MULT[u.id] ?? 1.25));
    const progressPct = u.maxLvl ? Math.round((u.lvl / u.maxLvl) * 100) : 0;

    const item = document.createElement("div");
    item.className = `item${!prereqMet ? " item--locked" : ""}`;
    item.innerHTML = `
      <div class="item__left">
        <div class="item__icon upgradeIconBtn" data-uid="${u.id}" title="Détails">${u.icon}</div>
        <div class="item__txt">
          <div class="item__name">${u.name} <span class="pill">niv. ${u.lvl}</span></div>
          <div class="item__desc">${u.desc}</div>
          ${!isMaxed ? (() => { const nm = Math.ceil(u.cost*(UPGRADE_MULT[u.id]??1.25)); return `<div class="item__nextcost">→ Niv.${u.lvl+2} : ${formatMoney(nm)}${state.money < nm ? ` <span class="item__nextcost--miss">(-${formatMoney(nm - state.money)})</span>` : ''}</div>`; })() : ''}
          ${prereqHtml}
          ${maxLvlHtml}
        </div>
      </div>
      <div class="item__right">
        <button class="buy" ${canBuy ? "" : "disabled"} data-buy="${u.id}">
          ${isMaxed ? "Max" : !prereqMet ? "🔒" : formatMoney(u.cost)}
        </button>
      </div>
    `;

    // Tooltip au clic sur l'icône
    item.querySelector(".upgradeIconBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      showUpgradeTooltip(u, {
        isMaxed, prereqMet, prereqReasons, canBuy,
        tags, tagsHtml, nextCost, progressPct
      });
    });

    upgradeListEl.appendChild(item);
  }
}

// =====================
// UPGRADE TOOLTIP
// =====================
function showUpgradeTooltip(u, { isMaxed, prereqMet, prereqReasons, canBuy, tags, tagsHtml, nextCost, progressPct }){
  document.getElementById("upgradeTooltipOverlay")?.remove();

  const overlay = document.createElement("div");
  overlay.id = "upgradeTooltipOverlay";
  overlay.className = "upgradeTooltip__overlay";

  const mult = (typeof UPGRADE_MULT !== "undefined" ? UPGRADE_MULT[u.id] : null) ?? 1.25;

  // ── Barre de progression ─────────────────────────────────────────────────
  const progressHtml = u.maxLvl
    ? `<div class="upgradeTooltip__progressTrack">
        <div class="upgradeTooltip__progressFill ${isMaxed ? 'upgradeTooltip__progressFill--maxed' : ''}"
             style="width:${progressPct}%"></div>
      </div>
      <div class="upgradeTooltip__progressLabel">${u.lvl} / ${u.maxLvl} niveaux${isMaxed ? ' — <span style="color:#2ee59d">MAX ✅</span>' : ''}</div>`
    : "";

  // ── Prérequis manquants ──────────────────────────────────────────────────
  const prereqHtml = !prereqMet
    ? prereqReasons.map(r => `<div class="upgradeTooltip__prereq">🔒 ${r}</div>`).join("")
    : "";

  // ── Tableau des 10 prochains niveaux ─────────────────────────────────────
  function getEffectLabel(lvl){
    // Retourne le label de l'effet total à un niveau donné
    switch(u.id){
      case "scanner_pro":         return `F:+${15*lvl}€ · S:+${800*lvl}€ · SSS+:+${6000*lvl}€/diag`;
      case "cle_dynamometrique":  return `+${(0.5*lvl).toFixed(1)}s/clic`;
      case "turbocompresseur":    return `×${Math.pow(1.15,lvl).toFixed(3)} vitesse`;
      case "obd":           return `+${10*lvl}€/diag`;
      case "diagpro":       return `+${40*lvl}€/diag`;
      case "toolbox":       return `+${(0.05*lvl).toFixed(2)}s/clic`;
      case "impact":        return `+${(0.08*lvl).toFixed(2)}s/clic`;
      case "impact2":       return `+${(0.12*lvl).toFixed(2)}s/clic`;
      case "nego":          return `+${(5*lvl)}% vente`;
      case "comp":          return `×${Math.pow(1.10,lvl).toFixed(3)} vitesse`;
      case "lift":          return `+${lvl} slot(s) garage`;
      case "showroom_slot": return `+${2*lvl} slot(s) showroom`;
      case "apprenti":      return `+${(0.15*lvl).toFixed(2)}s/s auto`;
      case "mecanicien":    return `+${(0.5*lvl).toFixed(1)}s/s auto`;
      case "stagiaire":     return `Diag toutes ${Math.max(6, 12-(lvl*0.6)).toFixed(1)}s`;
      case "receptionnaire":return `Min ${Math.max(1, 6-(lvl*0.5)).toFixed(1)}s diag`;
      case "vendeur":       return `Vente toutes ${Math.max(8, 15-(lvl*0.7)).toFixed(1)}s`;
      case "vendeur_confirme":return `Min ${Math.max(1, 8-(lvl*0.7)).toFixed(1)}s vente`;
      case "vendeur_expert":  return `Min ${Math.max(0.5, 1-(lvl*0.1)).toFixed(1)}s vente`;
      case "ia_diagnostic":   return `Min ${Math.max(0.5, 1-(lvl*0.1)).toFixed(1)}s diag`;
      case "chef_atelier":    return `+${lvl} slot(s) répa`;
      case "reseau_national":   return `+${100*lvl}€/s passif`;
      case "holding_auto":      return `+${250*lvl}€/s passif`;
      case "galerie_marchande": return `+${2*lvl} slots showroom`;
      case "extension_atelier": return `+${lvl} slot(s) garage`;
      case "contrat_taxi":  return `+${5*lvl}€/s passif`;
      case "assurance":     return `+${10*lvl}€/s passif`;
      case "atelier_nuit":  return `+${20*lvl}€/s passif`;
      case "franchise":     return `+${50*lvl}€/s passif`;
      case "magasinier":    return `-${Math.round((1-Math.pow(0.75,lvl))*100)}% délai livraison`;
      case "slots_livraison":return `+${lvl} slot(s) livraison`;
      case "etageres":      return `+${20*lvl} slots entrepôt`;
      case "rayonnage":     return `+${50*lvl} slots entrepôt`;
      case "zone_logistique":return `+${100*lvl} slots · -${10*lvl}% délai`;
      case "entrepot_auto": return `+${200*lvl} slots · +${2*lvl}% valeur`;
      case "logiciel_stock":return lvl>=3?"Auto-commande":"Fonctionnalités basiques";
      default:              return `Niv. ${lvl}`;
    }
  }

  const startLvl = u.lvl;
  const maxLvlCap = u.maxLvl ?? 999;
  const levelsToShow = Math.min(10, maxLvlCap - startLvl);

  let levelsHtml = "";
  if(levelsToShow > 0 && prereqMet){
    let costAccum = u.cost;
    const rows = [];
    for(let i = 1; i <= levelsToShow; i++){
      const targetLvl = startLvl + i;
      const canAfford = state.money >= costAccum;
      rows.push(`
        <tr class="upgradeTooltip__lvlRow ${i===1 ? 'upgradeTooltip__lvlRow--next' : ''}">
          <td class="upgradeTooltip__lvlNum">Niv.${targetLvl}</td>
          <td class="upgradeTooltip__lvlEffect">${getEffectLabel(targetLvl)}</td>
          <td class="upgradeTooltip__lvlCost ${canAfford ? 'upgradeTooltip__lvlCost--ok' : 'upgradeTooltip__lvlCost--miss'}">${formatMoney(Math.ceil(costAccum))}</td>
        </tr>
      `);
      costAccum = Math.ceil(costAccum * mult);
    }
    levelsHtml = `
      <div class="upgradeTooltip__tableTitle">📈 Prochains niveaux</div>
      <div class="upgradeTooltip__tableWrap">
        <table class="upgradeTooltip__table">
          <thead><tr>
            <th>Niv.</th><th>Effet total</th><th>Prix</th>
          </tr></thead>
          <tbody>${rows.join("")}</tbody>
        </table>
      </div>`;
  } else if(isMaxed){
    levelsHtml = `<div class="upgradeTooltip__row upgradeTooltip__row--maxed">✅ Niveau maximum atteint</div>`;
  }

  overlay.innerHTML = `
    <div class="upgradeTooltip__backdrop"></div>
    <div class="upgradeTooltip__card">
      <button class="upgradeTooltip__close">✕</button>

      <div class="upgradeTooltip__header">
        <div class="upgradeTooltip__icon">${u.icon}</div>
        <div class="upgradeTooltip__titles">
          <div class="upgradeTooltip__name">${u.name}</div>
          <div class="upgradeTooltip__level">Niveau actuel : <b>${u.lvl}</b>${u.maxLvl ? ` / ${u.maxLvl}` : ""} · Scaling ×${mult.toFixed(2)}</div>
        </div>
      </div>

      <div class="upgradeTooltip__desc">${u.desc}</div>

      ${tagsHtml ? `<div class="upgradeTooltip__tags">${tagsHtml}</div>` : ""}

      ${progressHtml}
      ${prereqHtml}
      ${levelsHtml}
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("upgradeTooltip__overlay--in"));

  const close = () => {
    overlay.classList.remove("upgradeTooltip__overlay--in");
    setTimeout(() => overlay.remove(), 180);
  };
  overlay.querySelector(".upgradeTooltip__backdrop").addEventListener("click", close);
  overlay.querySelector(".upgradeTooltip__close").addEventListener("click", close);
}

// =====================
// STOCK UI
// =====================
let _stockView = "stock"; // "stock" | "order" | "upgrades"
let _upgradeFilter = { status: "all", effect: "all" }; // filtres actifs
let _upgradeSort   = "default"; // "default" | "price_asc" | "price_desc"
let _upgradeFilterVisible = false; // filtre masqué par défaut
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

  // ── JAUGE ENTREPÔT ──────────────────────────────────────────────────
  const wCap  = typeof getWarehouseCap  === "function" ? getWarehouseCap()  : 100;
  const wUsed = typeof getWarehouseUsed === "function" ? getWarehouseUsed() : 0;
  const wPct  = Math.min(100, Math.round((wUsed / wCap) * 100));
  const wFull = wUsed >= wCap;
  const wGauge = document.createElement("div");
  wGauge.className = "warehouseGauge";
  wGauge.innerHTML = `
    <div class="warehouseGauge__header">
      <span class="warehouseGauge__title">🏭 Entrepôt</span>
      <span class="warehouseGauge__count ${wFull ? "warehouseGauge__count--full" : ""}">${Math.floor(wUsed)} / ${wCap} slots</span>
    </div>
    <div class="warehouseGauge__bar">
      <div class="warehouseGauge__fill ${wFull ? "warehouseGauge__fill--full" : wPct >= 80 ? "warehouseGauge__fill--warn" : ""}"
           style="width:${wPct}%"></div>
    </div>
    ${wFull ? '<div class="warehouseGauge__alert">⚠️ Entrepôt plein — commandes bloquées</div>' : ""}
  `;
  el.appendChild(wGauge);

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
      const canAfford   = state.money >= price    && !slotsFull;
      const canAfford10 = state.money >= price*10  && !slotsFull;
      const canAfford50 = state.money >= price*50  && !slotsFull;

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

      const wCap   = typeof getWarehouseCap  === "function" ? getWarehouseCap()  : 100;
      const wUsed  = typeof getWarehouseUsed === "function" ? getWarehouseUsed() : 0;
      const wFull  = wUsed >= wCap;
      const row = document.createElement("div");
      row.className = `stockSupplRow ${canAfford?"":" stockSupplRow--broke"}${wFull?" stockSupplRow--warehouse-full":""}`;
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
            <button class="stockSupplRow__buy" data-pid="${part.id}" data-sid="${sid}" data-qty="1"  ${(canAfford && !wFull)   ?"":"disabled"}>×1</button>
            <button class="stockSupplRow__buy" data-pid="${part.id}" data-sid="${sid}" data-qty="10" ${(canAfford10 && !wFull) ?"":"disabled"}>×10</button>
            <button class="stockSupplRow__buy" data-pid="${part.id}" data-sid="${sid}" data-qty="50" ${(canAfford50 && !wFull) ?"":"disabled"}>×50</button>
          </div>
          ${wFull ? '<span class="stockSupplRow__warehouseFull">🏭 Entrepôt plein</span>' : ""}
        </div>
      `;
      row.querySelectorAll("[data-qty]").forEach(btn => {
        btn.addEventListener("click", () => {
          const ok = orderPart(btn.dataset.pid, btn.dataset.sid, parseInt(btn.dataset.qty), true);
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
          ${!isMaxed ? (() => { const nm = Math.ceil(u.cost*(UPGRADE_MULT[u.id]??1.25)); return `<div class="item__nextcost">→ Niv.${u.lvl+2} : ${formatMoney(nm)}${state.money < nm ? ` <span class="item__nextcost--miss">(-${formatMoney(nm - state.money)})</span>` : ''}</div>`; })() : ''}
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

function renderAll(rebuildUpgrades = false, rebuildTalents = false){
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
  if(rebuildUpgrades) renderUpgrades();
  renderGarageProgress();
  if(rebuildTalents) renderTalentsUI();
  renderPrestigeNotif();
  if(typeof updateChallengesNotifDot === 'function') updateChallengesNotifDot();
  // Badge showroom mobile
  _updateMobileShowroomBadge();
  // Badge alerte stock (logiciel stock niv 1+)
  const stockTab = document.querySelector(".tab[data-tab='stock']");
  if(stockTab){
    let dot = stockTab.querySelector(".stockAlertDot");
    if(!dot){ dot = document.createElement("span"); dot.className = "stockAlertDot"; stockTab.appendChild(dot); }
    dot.style.display = hasStockAlert() ? "inline-block" : "none";
  }
}

