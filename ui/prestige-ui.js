// =====================
// PRESTIGE UI
// =====================
let _heritageFilter = "Tous";
let _prestigeTab = "prestige"; // "prestige" | "heritage"

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

  // ── Calcul aperçu prochain run ───────────────────────────────────────────────
  // Simuler les bonus APRÈS le prochain prestige (sans modifier le state)
  applyHeritageBonuses(); // recalcule avec prestigeCount actuel
  const b = state.heritageBonuses;
  const nextPrestige   = (state.prestigeCount ?? 0) + 1;
  // Simuler b pour le prochain prestige
  const bNext = Object.assign({}, b);
  bNext.moneyMult = 1.0 + Math.min(nextPrestige * 0.01, 0.50);
  applyMilestoneBonuses(bNext, nextPrestige);
  const nextStartMoney = Math.round((100 + bNext.startMoney) * bNext.moneyMult);
  const nextGarageCap  = 1 + (bNext.garageCap  ?? 0);
  const nextShowroomCap= 3 + (bNext.showroomCap ?? 0);
  const nextMoneyMult  = bNext.moneyMult - 1.0;

  // Prochain milestone
  const nextMilestone  = PRESTIGE_MILESTONES.find(m => (state.prestigeCount ?? 0) < m.count);

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
      <div class="prestige__infoBlock">
        <div class="prestige__infoLabel">BONUS ARGENT</div>
        <div class="prestige__infoVal" style="color:#a78bfa">+${Math.round(Math.min((state.prestigeCount??0)*0.01,0.50)*100)}%</div>
      </div>
    </div>

    <button class="prestige__btn ${can ? '' : 'prestige__btn--locked'}" id="btnDoPrestige" ${can ? '' : 'disabled'}>
      ${can ? '🔥 LANCER LE PRESTIGE' : '🔒 Conditions non remplies'}
    </button>

    ${nextMilestone ? `
    <div class="prestige__milestone">
      <div class="prestige__milestoneLabel">🎯 Prochain milestone — Prestige ${nextMilestone.count}</div>
      <div class="prestige__milestoneDesc">${nextMilestone.icon} ${nextMilestone.label} : ${nextMilestone.desc}</div>
      <div class="prestige__milestoneBar">
        <div class="prestige__milestoneBarFill" style="width:${Math.min(100, Math.round(((state.prestigeCount??0) / nextMilestone.count)*100))}%"></div>
      </div>
      <div class="prestige__milestoneProgress">${state.prestigeCount ?? 0} / ${nextMilestone.count}</div>
    </div>` : '<div class="prestige__milestone prestige__milestone--done">👑 Tous les milestones débloqués !</div>'}

    <div class="prestige__preview">
      <div class="prestige__previewTitle">⚡ Aperçu du prochain run</div>
      <div class="prestige__previewGrid">
        <div class="prestige__previewItem">💰 Capital départ <b>${formatMoney(nextStartMoney)}</b></div>
        <div class="prestige__previewItem">🔧 Slots atelier <b>${nextGarageCap}</b></div>
        <div class="prestige__previewItem">🚗 Slots showroom <b>${nextShowroomCap}</b></div>
        <div class="prestige__previewItem">📈 Bonus argent <b>+${Math.round(nextMoneyMult*100)}%</b></div>
      </div>
    </div>

    <div class="prestige__conditions">
      <div class="prestige__cond ${state.garageLevel >= 50 ? 'prestige__cond--ok' : ''}">
        ${state.garageLevel >= 50 ? '✅' : '🔒'} Garage LVL 50
        <span>${state.garageLevel}/50</span>
      </div>
      <div class="prestige__cond ${state.rep >= 40000 ? 'prestige__cond--ok' : ''}">
        ${state.rep >= 40000 ? '✅' : '🔒'} 40 000 REP
        <span>${state.rep.toLocaleString("fr-FR")}/40 000</span>
      </div>
    </div>
    ${!can ? `<div class="prestige__missing">
      ${state.garageLevel < 50 ? `<div class="prestige__missing-line">🔒 Encore <b>${50 - state.garageLevel} niveau${50 - state.garageLevel > 1 ? 'x' : ''}</b> de garage manquant${50 - state.garageLevel > 1 ? 's' : ''}</div>` : ''}
      ${state.rep < 40000 ? `<div class="prestige__missing-line">🔒 Encore <b>${(40000 - state.rep).toLocaleString("fr-FR")} REP</b> manquants</div>` : ''}
    </div>` : ''}

    <div class="prestige__runStats">
      <div class="prestige__runTitle">📊 Run actuel</div>
      <div class="prestige__runGrid">
        <div class="prestige__runItem">
          <span class="prestige__runIcon">💸</span>
          <span class="prestige__runLabel">Revenus passifs</span>
          <span class="prestige__runVal">${formatMoney(Math.round(state.runMoneyPassive ?? 0))}</span>
        </div>
        <div class="prestige__runItem">
          <span class="prestige__runIcon">🚗</span>
          <span class="prestige__runLabel">Ventes de véhicules</span>
          <span class="prestige__runVal">${formatMoney(Math.round(state.runMoneySales ?? 0))}</span>
        </div>
        <div class="prestige__runItem">
          <span class="prestige__runIcon">🔍</span>
          <span class="prestige__runLabel">Diagnostics</span>
          <span class="prestige__runVal">${formatMoney(Math.round(state.runMoneyDiag ?? 0))}</span>
        </div>
        <div class="prestige__runItem">
          <span class="prestige__runIcon">🔩</span>
          <span class="prestige__runLabel">Bonus pièces</span>
          <span class="prestige__runVal">${formatMoney(Math.round(state.runMoneyParts ?? 0))}</span>
        </div>
        <div class="prestige__runItem prestige__runItem--total">
          <span class="prestige__runIcon">💰</span>
          <span class="prestige__runLabel">Total run</span>
          <span class="prestige__runVal">${formatMoney(Math.round((state.runMoneyPassive ?? 0) + (state.runMoneySales ?? 0) + (state.runMoneyDiag ?? 0) + (state.runMoneyParts ?? 0)))}</span>
        </div>
        <div class="prestige__runItem">
          <span class="prestige__runIcon">🔧</span>
          <span class="prestige__runLabel">Réparations</span>
          <span class="prestige__runVal">${(state.totalRepairs ?? 0).toLocaleString("fr-FR")}</span>
        </div>
        <div class="prestige__runItem">
          <span class="prestige__runIcon">🏷️</span>
          <span class="prestige__runLabel">Véhicules vendus</span>
          <span class="prestige__runVal">${(state.carsSold ?? 0).toLocaleString("fr-FR")}</span>
        </div>
        <div class="prestige__runItem">
          <span class="prestige__runIcon">⭐</span>
          <span class="prestige__runLabel">REP actuelle</span>
          <span class="prestige__runVal">${(state.rep ?? 0).toLocaleString("fr-FR")}</span>
        </div>
        <div class="prestige__runItem">
          <span class="prestige__runIcon">📦</span>
          <span class="prestige__runLabel">Niveau garage</span>
          <span class="prestige__runVal">LVL ${state.garageLevel ?? 1}</span>
        </div>
      </div>
    </div>

  `;

  // ── Onglets ──────────────────────────────────────────────────────────────────
  document.querySelectorAll(".prestigeTab").forEach(tab => {
    tab.classList.toggle("prestigeTab--active", tab.dataset.ptab === _prestigeTab);
    tab.onclick = () => {
      _prestigeTab = tab.dataset.ptab;
      document.getElementById("ptab-prestige").classList.toggle("prestigeTabPanel--hidden", _prestigeTab !== "prestige");
      document.getElementById("ptab-heritage").classList.toggle("prestigeTabPanel--hidden", _prestigeTab !== "heritage");
      document.querySelectorAll(".prestigeTab").forEach(t => t.classList.toggle("prestigeTab--active", t.dataset.ptab === _prestigeTab));
      // Badge points sur l'onglet héritage
      _updateHeritageTabBadge();
    };
  });
  // Sync visibilité initiale
  document.getElementById("ptab-prestige")?.classList.toggle("prestigeTabPanel--hidden", _prestigeTab !== "prestige");
  document.getElementById("ptab-heritage")?.classList.toggle("prestigeTabPanel--hidden", _prestigeTab !== "heritage");
  _updateHeritageTabBadge();

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
      renderAll(true, true);
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

function _updateHeritageTabBadge(){
  const tab = document.querySelector('.prestigeTab[data-ptab="heritage"]');
  if(!tab) return;
  const pts = state.heritagePoints ?? 0;
  // Affiche un badge si des points sont disponibles à dépenser
  const hasBuyable = HERITAGE_PERKS.some(p => {
    const rank = getHeritagePerkRank(p.id);
    return rank < p.maxRank && hasHeritageRequirements(p) && pts >= p.costPerRank;
  });
  tab.innerHTML = hasBuyable
    ? '✨ Héritage <span class="prestigeTab__badge">' + pts + '</span>'
    : '✨ Héritage';
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

