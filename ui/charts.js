// =====================================================================
// GARAGE TURBO — CHARTS (Chart.js)
// 5 graphiques dans la modale Stats > onglet Graphiques
// =====================================================================

// ── Instances Chart.js actives ────────────────────────────────────────────────
const _charts = {};

// ── Palette thème ─────────────────────────────────────────────────────────────
const C = {
  green:    "#2ee59d",
  cyan:     "#31d6ff",
  gold:     "#ffc83a",
  purple:   "#a78bfa",
  red:      "#ff4d70",
  muted:    "rgba(255,255,255,.12)",
  text:     "rgba(255,255,255,.45)",
  grid:     "rgba(255,255,255,.05)",
  tiers:    { F:"#8ca8c0",E:"#a0b890",D:"#c4b870",C:"#4dff9a",B:"#7ab0ff",A:"#a07aff",S:"#ffc83a",SS:"#ff8c40",SSS:"#ff4d70","SSS+":"#ffffff" },
  rarities: { common:"#8ca8c0", uncommon:"#4a9eff", rare:"#2ee59d", epic:"#a78bfa", legendary:"#ffc83a", mythic:"#ff4d70" },
};

const BASE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 400, easing: "easeOutQuart" },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(8,14,26,.95)",
      borderColor: "rgba(255,255,255,.1)",
      borderWidth: 1,
      titleColor: "rgba(255,255,255,.9)",
      bodyColor:  "rgba(255,255,255,.6)",
      padding: 10,
      cornerRadius: 8,
      displayColors: true,
    },
  },
  scales: {
    x: {
      grid:  { color: C.grid, drawBorder: false },
      ticks: { color: C.text, font: { size: 10 }, maxTicksLimit: 8 },
      border:{ display: false },
    },
    y: {
      grid:  { color: C.grid, drawBorder: false },
      ticks: { color: C.text, font: { size: 10 }, maxTicksLimit: 6 },
      border:{ display: false },
    },
  },
};

// ── Utilitaires ───────────────────────────────────────────────────────────────
function _fmt(v){
  if(v >= 1e12) return (v/1e12).toFixed(1)+"T";
  if(v >= 1e9)  return (v/1e9).toFixed(1)+"B";
  if(v >= 1e6)  return (v/1e6).toFixed(1)+"M";
  if(v >= 1e3)  return (v/1e3).toFixed(1)+"k";
  return v.toFixed(0);
}

function _timeLabel(ts){
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}:${d.getSeconds().toString().padStart(2,"0")}`;
}

function _destroyChart(id){
  if(_charts[id]){ _charts[id].destroy(); delete _charts[id]; }
}

// ── 1. Courbe €/s dans le temps ───────────────────────────────────────────────
function _buildMoneyPerSecChart(canvasId){
  _destroyChart("mps");
  const ctx = document.getElementById(canvasId)?.getContext("2d");
  if(!ctx) return;
  const hist = state?.history?.moneyPerSec ?? [];
  const labels = hist.map(p => _timeLabel(p.t));
  const data   = hist.map(p => p.v);

  _charts["mps"] = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        data,
        borderColor: C.green,
        backgroundColor: "rgba(46,229,157,.08)",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
        tension: 0.4,
      }],
    },
    options: {
      ...BASE_OPTIONS,
      plugins: {
        ...BASE_OPTIONS.plugins,
        tooltip: {
          ...BASE_OPTIONS.plugins.tooltip,
          callbacks: { label: ctx => " " + _fmt(ctx.raw) + " €/s" },
        },
      },
      scales: {
        ...BASE_OPTIONS.scales,
        y: { ...BASE_OPTIONS.scales.y, ticks: { ...BASE_OPTIONS.scales.y.ticks, callback: v => _fmt(v)+"€/s" } },
      },
    },
  });
}

// ── 2. Barres voitures vendues par tier ───────────────────────────────────────
function _buildTierChart(canvasId){
  _destroyChart("tier");
  const ctx = document.getElementById(canvasId)?.getContext("2d");
  if(!ctx) return;
  const TIER_ORDER = ["F","E","D","C","B","A","S","SS","SSS","SSS+"];
  const sold = state?.carsSoldByTier ?? {};
  const labels = TIER_ORDER;
  const data   = TIER_ORDER.map(t => sold[t] ?? 0);
  const colors = TIER_ORDER.map(t => C.tiers[t] ?? "#888");

  _charts["tier"] = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.map(c => c + "bb"),
        borderColor: colors,
        borderWidth: 1.5,
        borderRadius: 5,
        borderSkipped: false,
      }],
    },
    options: {
      ...BASE_OPTIONS,
      plugins: {
        ...BASE_OPTIONS.plugins,
        tooltip: {
          ...BASE_OPTIONS.plugins.tooltip,
          callbacks: { label: ctx => " " + ctx.raw.toLocaleString("fr-FR") + " vendue(s)" },
        },
      },
      scales: {
        ...BASE_OPTIONS.scales,
        y: { ...BASE_OPTIONS.scales.y, ticks: { ...BASE_OPTIONS.scales.y.ticks, callback: v => v.toLocaleString("fr-FR") } },
      },
    },
  });
}

// ── 3. Donut répartition raretés ──────────────────────────────────────────────
function _buildRarityChart(canvasId){
  _destroyChart("rarity");
  const ctx = document.getElementById(canvasId)?.getContext("2d");
  if(!ctx) return;
  const RARITY_ORDER_LOCAL = ["common","uncommon","rare","epic","legendary","mythic"];
  const RARITY_LABELS = { common:"Commune", uncommon:"Peu commune", rare:"Rare", epic:"Épique", legendary:"Légendaire", mythic:"Mythique" };

  // Compter depuis carBook
  const counts = {};
  for(const entry of Object.values(state?.carBook ?? {})){
    for(const r of (entry.allRarities ?? [])){
      counts[r] = (counts[r] ?? 0) + (entry.repaired ?? 1);
    }
  }
  // Fallback sur totalEpicSeen etc. si carBook vide
  if(!Object.keys(counts).length){
    counts.common    = Math.max(0, (state?.totalRepairs ?? 0) - (state?.totalEpicSeen ?? 0));
    counts.epic      = state?.totalEpicSeen ?? 0;
    counts.legendary = state?.totalLegendarySold ?? 0;
    counts.mythic    = state?.totalMythicSold ?? 0;
  }

  const labels = RARITY_ORDER_LOCAL.filter(r => (counts[r] ?? 0) > 0).map(r => RARITY_LABELS[r]);
  const data   = RARITY_ORDER_LOCAL.filter(r => (counts[r] ?? 0) > 0).map(r => counts[r]);
  const colors = RARITY_ORDER_LOCAL.filter(r => (counts[r] ?? 0) > 0).map(r => C.rarities[r]);

  _charts["rarity"] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.map(c => c + "cc"),
        borderColor:      colors,
        borderWidth: 2,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500 },
      cutout: "62%",
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            color: "rgba(255,255,255,.6)",
            font: { size: 10 },
            padding: 10,
            boxWidth: 12,
            boxHeight: 12,
          },
        },
        tooltip: {
          backgroundColor: "rgba(8,14,26,.95)",
          borderColor: "rgba(255,255,255,.1)",
          borderWidth: 1,
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((a,b) => a+b, 0);
              const pct   = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0;
              return ` ${ctx.raw.toLocaleString("fr-FR")} (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

// ── 4. Courbe REP dans le temps ───────────────────────────────────────────────
function _buildRepChart(canvasId){
  _destroyChart("rep");
  const ctx = document.getElementById(canvasId)?.getContext("2d");
  if(!ctx) return;
  const hist = state?.history?.rep ?? [];
  const labels = hist.map(p => _timeLabel(p.t));
  const data   = hist.map(p => p.v);

  _charts["rep"] = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        data,
        borderColor: C.purple,
        backgroundColor: "rgba(167,139,250,.08)",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
        tension: 0.4,
      }],
    },
    options: {
      ...BASE_OPTIONS,
      plugins: {
        ...BASE_OPTIONS.plugins,
        tooltip: {
          ...BASE_OPTIONS.plugins.tooltip,
          callbacks: { label: ctx => " " + ctx.raw.toLocaleString("fr-FR") + " REP" },
        },
      },
      scales: {
        ...BASE_OPTIONS.scales,
        y: { ...BASE_OPTIONS.scales.y, ticks: { ...BASE_OPTIONS.scales.y.ticks, callback: v => v.toLocaleString("fr-FR") } },
      },
    },
  });
}

// ── 5. Barres empilées argent par source ──────────────────────────────────────
function _buildMoneySourceChart(canvasId){
  _destroyChart("msrc");
  const ctx = document.getElementById(canvasId)?.getContext("2d");
  if(!ctx) return;

  const repair  = state?.runMoneyRepair  ?? 0;
  const sales   = state?.runMoneySales   ?? 0;
  const passive = state?.runMoneyPassive ?? 0;
  const total   = repair + sales + passive || 1;

  _charts["msrc"] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Cette run"],
      datasets: [
        { label:"Réparations", data:[repair],  backgroundColor: C.cyan   + "cc", borderColor: C.cyan,   borderWidth:1.5, borderRadius:{topLeft:0,topRight:0,bottomLeft:5,bottomRight:5}, borderSkipped:false },
        { label:"Ventes",      data:[sales],   backgroundColor: C.gold   + "cc", borderColor: C.gold,   borderWidth:1.5, borderRadius:0, borderSkipped:false },
        { label:"Passif",      data:[passive], backgroundColor: C.green  + "cc", borderColor: C.green,  borderWidth:1.5, borderRadius:{topLeft:5,topRight:5,bottomLeft:0,bottomRight:0}, borderSkipped:false },
      ],
    },
    options: {
      ...BASE_OPTIONS,
      indexAxis: "y",
      plugins: {
        ...BASE_OPTIONS.plugins,
        legend: {
          display: true,
          position: "bottom",
          labels: { color:"rgba(255,255,255,.6)", font:{size:10}, padding:14, boxWidth:12, boxHeight:12 },
        },
        tooltip: {
          ...BASE_OPTIONS.plugins.tooltip,
          callbacks: {
            label: ctx => {
              const pct = ((ctx.raw / total) * 100).toFixed(1);
              return ` ${ctx.dataset.label}: ${_fmt(ctx.raw)}€ (${pct}%)`;
            },
          },
        },
      },
      scales: {
        x: { ...BASE_OPTIONS.scales.x, stacked:true, ticks:{...BASE_OPTIONS.scales.x.ticks, callback: v => _fmt(v)+"€"} },
        y: { ...BASE_OPTIONS.scales.y, stacked:true, display:false },
      },
    },
  });
}

// ── Rendu de la grille graphiques ─────────────────────────────────────────────
function renderChartsGrid(){
  const grid = document.getElementById("chartsGrid");
  if(!grid || typeof Chart === "undefined") return;

  grid.innerHTML = `
    <div class="chartCard chartCard--wide">
      <div class="chartCard__title">💰 Revenus €/s dans le temps</div>
      <div class="chartCard__hint">(enregistré toutes les 5s depuis l'ouverture)</div>
      <div class="chartCard__wrap"><canvas id="chart-mps"></canvas></div>
    </div>
    <div class="chartCard chartCard--wide">
      <div class="chartCard__title">🏆 Réputation dans le temps</div>
      <div class="chartCard__hint">(enregistré toutes les 5s depuis l'ouverture)</div>
      <div class="chartCard__wrap"><canvas id="chart-rep"></canvas></div>
    </div>
    <div class="chartCard">
      <div class="chartCard__title">🚗 Voitures vendues par Tier</div>
      <div class="chartCard__hint">(tous prestiges cumulés)</div>
      <div class="chartCard__wrap"><canvas id="chart-tier"></canvas></div>
    </div>
    <div class="chartCard">
      <div class="chartCard__title">✨ Répartition des raretés</div>
      <div class="chartCard__hint">(toutes réparations)</div>
      <div class="chartCard__wrap chartCard__wrap--donut"><canvas id="chart-rarity"></canvas></div>
    </div>
    <div class="chartCard chartCard--wide">
      <div class="chartCard__title">💎 Argent par source (run actuelle)</div>
      <div class="chartCard__hint">Réparations · Ventes · Passif</div>
      <div class="chartCard__wrap chartCard__wrap--source"><canvas id="chart-msrc"></canvas></div>
    </div>
  `;

  // Petit délai pour que le DOM soit prêt
  requestAnimationFrame(() => {
    _buildMoneyPerSecChart("chart-mps");
    _buildRepChart("chart-rep");
    _buildTierChart("chart-tier");
    _buildRarityChart("chart-rarity");
    _buildMoneySourceChart("chart-msrc");
  });
}

// ── Gestion onglets Stats / Graphiques ────────────────────────────────────────
function initStatsTabs(){
  const tabsEl = document.getElementById("statsTabs");
  if(!tabsEl) return;

  tabsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".statsTab");
    if(!btn) return;
    const tab = btn.dataset.stab;

    tabsEl.querySelectorAll(".statsTab").forEach(b => b.classList.toggle("statsTab--active", b.dataset.stab === tab));
    document.getElementById("statsPanel-stats")?.classList.toggle("statsTabPanel--hidden",  tab !== "stats");
    document.getElementById("statsPanel-charts")?.classList.toggle("statsTabPanel--hidden", tab !== "charts");

    if(tab === "charts") renderChartsGrid();
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────
if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", initStatsTabs);
} else {
  initStatsTabs();
}

// Exposer pour app.js / boot.js
window.renderChartsGrid = renderChartsGrid;
