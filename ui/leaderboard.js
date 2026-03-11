// =====================
// LEADERBOARD MONDIAL
// =====================

let _lbTab = "prestige";

// Push le score du joueur connecté dans la table leaderboard
async function pushLeaderboard(){
  if(!currentUser) return;
  try {
    const p = state.profile || {};
    await _supa.from("leaderboard").upsert({
      user_id:       currentUser.id,
      pseudo:        (p.pseudo || "Mécanicien").substring(0, 30),
      garage_name:   (state.garageName || "Garage Turbo").substring(0, 40),
      avatar:        p.avatar || "🔧",
      country:       p.country || "FR",
      prestige_count: state.prestigeCount ?? 0,
      garage_level:   state.garageLevel ?? 1,
      cars_sold:      state.totalCarsSold ?? 0,
      total_money:    Math.floor(state.totalMoneyEarned ?? 0),
      updated_at:     new Date().toISOString(),
    }, { onConflict: "user_id" });
  } catch(e){ dbg("[leaderboard] push erreur:", e.message); }
}

async function fetchLeaderboard(tab){
  const colMap = {
    prestige: { col:"prestige_count", label:"Prestiges", fmt: v => `🔥 ${v}` },
    level:    { col:"garage_level",   label:"Niveau",    fmt: v => `Niv. ${v}` },
    money:    { col:"total_money", label:"Argent total gagné", fmt: v => formatMoney(v) },
    sold:     { col:"cars_sold",      label:"Voitures",  fmt: v => `${v.toLocaleString()} 🚗` },
  };
  const { col, fmt } = colMap[tab] || colMap.prestige;

  const { data, error } = await _supa
    .from("leaderboard")
    .select("user_id,pseudo,garage_name,avatar,country,prestige_count,garage_level,cars_sold,total_money,updated_at")
    .order(col, { ascending: false })
    .limit(50);

  if(error) throw error;
  return { rows: data || [], fmt, col };
}

function renderLeaderboardRows(rows, fmt, col){
  const lbList = document.getElementById("lbList");
  if(!rows.length){
    lbList.innerHTML = `<div style="text-align:center;color:var(--muted);padding:40px 0;">Aucun joueur pour l'instant…</div>`;
    return;
  }

  const medals = ["🥇","🥈","🥉"];
  const rankClass = ["lbRow--gold","lbRow--silver","lbRow--bronze"];
  const rankTextClass = ["lbRank--gold","lbRank--silver","lbRank--bronze"];

  let myRowHTML = "";
  let html = "";

  rows.forEach((r, i) => {
    const isMe = currentUser && r.user_id === currentUser.id;
    const rank = i + 1;
    const medal = rank <= 3 ? medals[rank-1] : rank;
    const medalClass = rank <= 3 ? rankTextClass[rank-1] : "";
    const rowClass = isMe ? "lbRow lbRow--me" : `lbRow ${rank <= 3 ? rankClass[rank-1] : ""}`;
    const value = r[col];
    const country = (r.country || "").toUpperCase();
    const flagHtml = country && country !== "OTHER" && country.length === 2
      ? `<img src="https://flagcdn.com/16x12/${country.toLowerCase()}.png" width="16" height="12" style="border-radius:2px;vertical-align:middle;margin-right:4px;" alt="${country}" onerror="this.style.display='none'">`
      : `<span style="font-size:12px;margin-right:4px;">🌍</span>`;
    const prestigeTag = r.prestige_count > 0
      ? `<span class="lbPrestigePip">🔥 ${r.prestige_count}</span>` : "";
    const lastSeen = r.updated_at ? new Date(r.updated_at).toLocaleDateString("fr-FR") : "";

    const rowHTML = `
      <div class="${rowClass}">
        <div class="lbRank ${medalClass}">${medal}</div>
        <div class="lbPlayer">
          <div class="lbGarage">${r.avatar || "🔧"} ${r.garage_name || "Garage Turbo"}</div>
          <div class="lbMeta">${flagHtml} ${r.pseudo || "Mécanicien"} ${prestigeTag} <span style="opacity:.4">· ${lastSeen}</span></div>
        </div>
        <div class="lbValue">${fmt(value ?? 0)}</div>
      </div>`;

    html += rowHTML;
    if(isMe) myRowHTML = rowHTML;
  });

  lbList.innerHTML = html;

  // Ma position en bas si connecté
  const myRowEl = document.getElementById("lbMyRow");
  if(myRowHTML && currentUser){
    myRowEl.style.display = "block";
    myRowEl.innerHTML = `<div style="font-size:11px;color:var(--muted);margin-bottom:6px;font-weight:700;">MA POSITION</div>${myRowHTML}`;
  } else {
    myRowEl.style.display = "none";
  }
}

async function loadLeaderboard(){
  const lbList = document.getElementById("lbList");
  lbList.innerHTML = `<div style="text-align:center;color:var(--muted);padding:40px 0;">Chargement…</div>`;
  try {
    const { rows, fmt, col } = await fetchLeaderboard(_lbTab);
    document.getElementById("lbSubtitle").textContent = `Top ${rows.length} joueurs`;
    renderLeaderboardRows(rows, fmt, col);
  } catch(e){
    lbList.innerHTML = `<div style="text-align:center;color:#ff5a5a;padding:40px 0;">Erreur de chargement — réessaie plus tard</div>`;
    dbg("[leaderboard] fetch erreur:", e.message);
  }
}

function openLeaderboard(){
  document.getElementById("leaderboardModal").style.display = "flex";
  loadLeaderboard();
}
function closeLeaderboard(){
  document.getElementById("leaderboardModal").style.display = "none";
}

// Listeners leaderboard
document.getElementById("btnLeaderboard")?.addEventListener("click", openLeaderboard);
document.getElementById("btnLeaderboardClose")?.addEventListener("click", closeLeaderboard);
document.getElementById("leaderboardBackdrop")?.addEventListener("click", closeLeaderboard);
document.getElementById("btnLbRefresh")?.addEventListener("click", loadLeaderboard);

document.getElementById("lbTabs")?.addEventListener("click", e => {
  const btn = e.target.closest(".lbTab");
  if(!btn) return;
  _lbTab = btn.dataset.lbtab;
  document.querySelectorAll(".lbTab").forEach(b => b.classList.remove("lbTab--active"));
  btn.classList.add("lbTab--active");
  loadLeaderboard();
});