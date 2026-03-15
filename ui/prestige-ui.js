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

  // Conditions progressives (utilisent les fonctions dynamiques)
  const lvlReq     = getPrestigeLevelReq();
  const repReq     = getPrestigeRepReq();
  // Simuler les conditions du PROCHAIN prestige (après celui-ci)
  const _savedCount = state.prestigeCount;
  state.prestigeCount = (state.prestigeCount ?? 0) + 1;
  const nextLvlReq  = getPrestigeLevelReq();
  const nextRepReq  = getPrestigeRepReq();
  state.prestigeCount = _savedCount;

  // Durée du run actuel
  const _runSec  = Math.floor((Date.now() - (state.sessionStart ?? Date.now())) / 1000);
  const _runH    = Math.floor(_runSec / 3600);
  const _runM    = Math.floor((_runSec % 3600) / 60);
  const _runS    = _runSec % 60;
  const _runTime = _runH > 0 ? `${_runH}h ${_runM}m` : _runM > 0 ? `${_runM}m ${_runS}s` : `${_runS}s`;

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
    ${(()=>{
      const sp = getSpecialization(state.specialization ?? null);
      if(!sp) return '';
      const sp2 = state.heritageBonuses?.dualSpec ? getSpecialization(state.specialization2 ?? null) : null;
      const allBonuses = [...sp.bonuses, ...(sp2 ? sp2.bonuses.map(b => ({...b, label: b.label + ' (2e)'})) : [])];
      return `
    <div class="prestige__specSection">
      <div class="prestige__specSection__title">Spécialisation active</div>
      <div class="prestige__specSection__header">
        <div class="prestige__specSection__icon">${sp.icon}</div>
        <div class="prestige__specSection__info">
          <div class="prestige__specSection__name">${sp.name}${sp2 ? ` + ${sp2.name}` : ''}</div>
          <div class="prestige__specSection__tagline">${sp.tagline}${sp2 ? ` · ${sp2.tagline}` : ''}</div>
        </div>
      </div>
      <div class="prestige__specSection__bonuses">
        ${allBonuses.map(b => `
          <div class="prestige__specSection__bonus prestige__specSection__bonus--${b.positive ? 'pos' : 'neg'}">
            <span class="prestige__specSection__bonusVal">${b.value}</span>
            <span class="prestige__specSection__bonusLabel">${b.label}</span>
          </div>`).join('')}
      </div>
    </div>`;
    })()}

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
      <div class="prestige__cond ${state.garageLevel >= lvlReq ? 'prestige__cond--ok' : ''}">
        ${state.garageLevel >= lvlReq ? '✅' : '🔒'} Garage LVL ${lvlReq}
        <span>${state.garageLevel}/${lvlReq}</span>
      </div>
      <div class="prestige__cond ${state.rep >= repReq ? 'prestige__cond--ok' : ''}">
        ${state.rep >= repReq ? '✅' : '🔒'} ${repReq.toLocaleString("fr-FR")} REP
        <span>${state.rep.toLocaleString("fr-FR")}/${repReq.toLocaleString("fr-FR")}</span>
      </div>
    </div>
    ${!can ? `<div class="prestige__missing">
      ${state.garageLevel < lvlReq ? `<div class="prestige__missing-line">🔒 Encore <b>${lvlReq - state.garageLevel} niveau${lvlReq - state.garageLevel > 1 ? 'x' : ''}</b> de garage manquants</div>` : ''}
      ${state.rep < repReq ? `<div class="prestige__missing-line">🔒 Encore <b>${(repReq - state.rep).toLocaleString("fr-FR")} REP</b> manquants</div>` : ''}
    </div>` : ''}
    <div class="prestige__nextReq">
      <span>⬆️ Prochain prestige : LVL ${nextLvlReq} requis · ${nextRepReq.toLocaleString("fr-FR")} REP</span>
    </div>

    <div class="prestige__runStats">
      <div class="prestige__runTitle">📊 Run actuel</div>
      <div class="prestige__runGrid">
        <div class="prestige__runItem">
          <span class="prestige__runIcon">⏱️</span>
          <span class="prestige__runLabel">Durée du run</span>
          <span class="prestige__runVal">${_runTime}</span>
        </div>
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
      const _p = document.getElementById("ptab-prestige");
      const _h = document.getElementById("ptab-heritage");
      if(_p) _p.style.display = _prestigeTab === "prestige" ? "flex" : "none";
      if(_h) _h.style.display = _prestigeTab === "heritage" ? "flex" : "none";
      document.querySelectorAll(".prestigeTab").forEach(t => t.classList.toggle("prestigeTab--active", t.dataset.ptab === _prestigeTab));
      // Rendre le contenu héritage uniquement à la demande
      if(_prestigeTab === "heritage") _renderHeritageContent();
      _updateHeritageTabBadge();
    };
  });
  // Sync visibilité initiale — classList.add/remove explicite (évite ambiguïté toggle)
  const _tabPrestige = document.getElementById("ptab-prestige");
  const _tabHeritage = document.getElementById("ptab-heritage");
  if(_tabPrestige) _tabPrestige.style.display = _prestigeTab === "prestige" ? "flex" : "none";
  if(_tabHeritage) _tabHeritage.style.display = _prestigeTab === "heritage" ? "flex" : "none";
  // Rendu héritage uniquement si l'onglet héritage est actif — évite pollution visuelle
  if(_prestigeTab === "heritage") _renderHeritageContent();
  _updateHeritageTabBadge();

  // Rebind prestige button
  const btn = document.getElementById("btnDoPrestige");
  if(btn && can) btn.addEventListener("click", () => {
    document.getElementById("prestigeConfirmModal").style.display = "block";
    const gainEl = document.getElementById("prestigeConfirmGain");
    if(gainEl) gainEl.textContent = "+" + pts + " points Héritage";
  });

  // Contenu héritage rendu séparément via _renderHeritageContent()
}

// ── Rendu du panneau Héritage (filtres + grid) — appelé uniquement si onglet actif ──
function _renderHeritageContent(){
  const branches = ["Tous", "Mécanique", "Commerce", "Réputation", "Logistique", "Expertise"];
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
        _renderHeritageContent();
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
    "Mécanique":  { main:"#ff7043", bg:"rgba(255,112,67,.08)",  border:"rgba(255,112,67,.2)"  },
    "Commerce":   { main:"#ffc83a", bg:"rgba(255,200,58,.08)",  border:"rgba(255,200,58,.2)"  },
    "Réputation": { main:"#a78bfa", bg:"rgba(167,139,250,.08)", border:"rgba(167,139,250,.2)" },
    "Logistique": { main:"#2ee59d", bg:"rgba(46,229,157,.08)",  border:"rgba(46,229,157,.2)"  },
    "Expertise":  { main:"#31d6ff", bg:"rgba(49,214,255,.08)",  border:"rgba(49,214,255,.2)"  },
  };

  gridEl.innerHTML = "";
  for(const p of list){
    const rank    = getHeritagePerkRank(p.id);
    const isInfinite = p.maxRank === null;
    const locked  = !hasHeritageRequirements(p);
    const maxed   = !isInfinite && rank >= p.maxRank;
    const cost    = p.costPerRank;
    const canBuy  = !locked && !maxed && state.heritagePoints >= cost;
    const col     = branchColors[p.branch] || { main:"#888", bg:"rgba(0,0,0,.1)", border:"rgba(255,255,255,.1)" };

    let cardClass = "heritageCard";
    if(maxed)        cardClass += " heritageCard--maxed";
    else if(rank > 0) cardClass += " heritageCard--active";
    else if(locked)  cardClass += " heritageCard--locked";

    const dots = isInfinite
      ? `<div class="heritageCard__infinite" style="color:${col.main}">∞ rang ${rank}</div>`
      : Array.from({length: p.maxRank}, (_, i) =>
          `<div class="heritageCard__dot${i < rank ? " heritageCard__dot--filled" : ""}" style="${i < rank ? `background:${col.main};border-color:${col.main};box-shadow:0 0 5px ${col.main}40` : ""}"></div>`
        ).join("");

    let btnLabel, btnClass;
    if(maxed)        { btnLabel = "✅ Rang maximum"; btnClass = "heritageBtn heritageBtn--maxed"; }
    else if(locked)  {
      const missingReqs = (p.requires || [])
        .filter(r => getHeritagePerkRank(r.id) < r.rank)
        .map(r => {
          const perkName = HERITAGE_PERKS.find(x => x.id === r.id)?.name ?? r.id;
          return `${perkName} rang ${r.rank}`;
        });
      btnLabel = `🔒 Nécessite : ${missingReqs.join(" · ")}`;
      btnClass = "heritageBtn heritageBtn--locked";
    }
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

  // Marché Héritage
  renderHeritageMarket();
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


// ── MARCHÉ HÉRITAGE ───────────────────────────────────────────────────────────
const HERITAGE_MARKET = [
  { id:"mkt_money",  icon:"💰", label:"Pack Capital",       desc:"+50 000€ au prochain prestige",  cost:100, apply: () => { state.heritageBonuses.startMoney = (state.heritageBonuses.startMoney ?? 0) + 50000; } },
  { id:"mkt_talent", icon:"⭐", label:"Pack Talent",        desc:"+5 points talent au démarrage",  cost:50,  apply: () => { state.heritageBonuses.talentBonus  = (state.heritageBonuses.talentBonus  ?? 0) + 5;     } },
  { id:"mkt_rep",    icon:"🔥", label:"Boost REP ×2",       desc:"×2 REP gagné pendant 30 minutes",cost:75,  apply: () => { state._heritageRepBoost = { mult:2.0, until: Date.now() + 30*60*1000 }; } },
];

let _marketVisible = false;

function renderHeritageMarket() {
  const el = document.getElementById("heritageMarketGrid");
  if(!el) return;

  // Titre cliquable avec toggle
  const titleEl = document.getElementById("hMarketTitle");
  if(titleEl){
    titleEl.innerHTML = `
      <button class="hMarket__toggle" id="btnMarketToggle">
        <span>${_marketVisible ? '🔼' : '🔽'} 🛒 Marché Héritage</span>
        <span class="hMarket__toggleSub">${_marketVisible ? 'Masquer' : 'Afficher'}</span>
      </button>`;
    titleEl.querySelector("#btnMarketToggle").addEventListener("click", () => {
      _marketVisible = !_marketVisible;
      renderHeritageMarket();
    });
  }

  // Corps masqué si non visible
  const bodyEl = document.getElementById("hMarketBody");
  if(bodyEl) bodyEl.style.display = _marketVisible ? "block" : "none";
  if(!_marketVisible) return;

  el.innerHTML = HERITAGE_MARKET.map(item => {
    const canBuy = state.heritagePoints >= item.cost;
    return `
    <div class="hMarketCard">
      <div class="hMarketCard__icon">${item.icon}</div>
      <div class="hMarketCard__body">
        <div class="hMarketCard__name">${item.label}</div>
        <div class="hMarketCard__desc">${item.desc}</div>
      </div>
      <button class="hMarketCard__btn${canBuy ? '' : ' hMarketCard__btn--locked'}"
              data-mkt="${item.id}" ${canBuy ? '' : 'disabled'}>
        ${item.cost} pts
      </button>
    </div>`;
  }).join('');

  el.querySelectorAll("[data-mkt]").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = HERITAGE_MARKET.find(i => i.id === btn.dataset.mkt);
      if(!item || state.heritagePoints < item.cost) return;
      state.heritagePoints -= item.cost;
      item.apply();
      applyHeritageBonuses();
      renderPrestigeModal();
      renderAll(true, false);
      save();
      showToast(`✅ ${item.label} acheté !`);
    });
  });
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
  if(canPrestige()) openSpecializationModal();
});

// ── MODAL SPÉCIALISATION ──────────────────────────────────────────────────────
let _selectedSpec = null;

function openSpecializationModal() {
  _selectedSpec = null;
  const modal = document.getElementById("specializationModal");
  if(!modal) { doPrestige(); return; } // fallback si pas de modal
  modal.style.display = "block";

  // Spécialisation précédente
  const prevEl = document.getElementById("specModalPrev");
  const prevSpec = getSpecialization(state.specialization ?? null);
  prevEl.innerHTML = prevSpec
    ? `Run précédent : <b>${prevSpec.icon} ${prevSpec.name}</b>`
    : `Premier prestige — aucune spécialisation précédente`;

  // Générer les cartes
  const grid = document.getElementById("specModalGrid");
  grid.innerHTML = SPECIALIZATIONS.map(spec => {
    const isLocked = spec.id === (state.specialization ?? null);
    return `
    <div class="specCard ${isLocked ? 'specCard--locked' : ''}" data-sid="${spec.id}" style="--spec-color:${spec.color}">
      <div class="specCard__icon">${spec.icon}</div>
      <div class="specCard__name">${spec.name}</div>
      <div class="specCard__tagline">${spec.tagline}</div>
      <ul class="specCard__bonuses">
        ${spec.bonuses.map(b => `
          <li class="specCard__bonus specCard__bonus--${b.positive ? 'pos' : 'neg'}">
            <span class="specCard__bonusVal">${b.value}</span>
            <span class="specCard__bonusLabel">${b.label}</span>
          </li>`).join('')}
      </ul>
      ${isLocked ? '<div class="specCard__lockedMsg">⛔ Déjà utilisée</div>' : ''}
    </div>`;
  }).join('');

  // Bind clics
  grid.querySelectorAll(".specCard:not(.specCard--locked)").forEach(card => {
    card.addEventListener("click", () => {
      grid.querySelectorAll(".specCard").forEach(c => c.classList.remove("specCard--selected"));
      card.classList.add("specCard--selected");
      _selectedSpec = card.dataset.sid;
      document.getElementById("specModalConfirm").disabled = false;
    });
  });
}

function closeSpecializationModal() {
  document.getElementById("specializationModal").style.display = "none";
  _selectedSpec = null;
}

document.getElementById("specModalCancel")?.addEventListener("click", closeSpecializationModal);
document.getElementById("specializationBackdrop")?.addEventListener("click", closeSpecializationModal);
document.getElementById("specModalConfirm")?.addEventListener("click", () => {
  if(!_selectedSpec) return;
  state.specialization = _selectedSpec;
  closeSpecializationModal();
  // P40 dualSpec : ouvrir le choix de la 2e spécialisation
  if(state.heritageBonuses?.dualSpec){
    openSpec2Modal();
  } else {
    doPrestige();
  }
});

// ── MODAL 2e SPÉCIALISATION (P40) ─────────────────────────────────────────
let _selectedSpec2 = null;

function openSpec2Modal() {
  const modal = document.getElementById("spec2Modal");
  if(!modal){ doPrestige(); return; }
  _selectedSpec2 = null;
  document.getElementById("spec2ModalConfirm").disabled = true;
  modal.style.display = "block";

  const grid = document.getElementById("spec2ModalGrid");
  grid.innerHTML = SPECIALIZATIONS.map(spec => {
    const isLocked = spec.id === state.specialization;
    return `
    <div class="specCard ${isLocked ? 'specCard--locked' : ''}" data-sid2="${spec.id}" style="--spec-color:${spec.color}">
      <div class="specCard__icon">${spec.icon}</div>
      <div class="specCard__name">${spec.name}</div>
      <div class="specCard__tagline">${spec.tagline}</div>
      ${isLocked ? '<div class="specCard__lockedMsg">⛔ Déjà choisie comme principale</div>' : ''}
    </div>`;
  }).join('');

  grid.querySelectorAll(".specCard:not(.specCard--locked)").forEach(card => {
    card.addEventListener("click", () => {
      grid.querySelectorAll(".specCard").forEach(c => c.classList.remove("specCard--selected"));
      card.classList.add("specCard--selected");
      _selectedSpec2 = card.dataset.sid2;
      document.getElementById("spec2ModalConfirm").disabled = false;
    });
  });
}

document.getElementById("spec2ModalCancel")?.addEventListener("click", () => {
  document.getElementById("spec2Modal").style.display = "none";
  state.specialization2 = null;
  doPrestige();
});
document.getElementById("spec2ModalConfirm")?.addEventListener("click", () => {
  if(!_selectedSpec2) return;
  state.specialization2 = _selectedSpec2;
  document.getElementById("spec2Modal").style.display = "none";
  doPrestige();
});

