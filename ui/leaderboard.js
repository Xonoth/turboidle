// =====================
// LEADERBOARD MONDIAL
// =====================

let _lbTab = "prestige";

// ── Push score ────────────────────────────────────────────────────────────────
async function pushLeaderboard(){
  if(!currentUser) return;
  try {
    const p = state.profile || {};
    const achCount = Object.keys(state.achievements ?? {}).length;
    await _supa.from("leaderboard").upsert({
      user_id:            currentUser.id,
      pseudo:             (p.pseudo      || "Mécanicien").substring(0, 30),
      garage_name:        (state.garageName || "Garage Turbo").substring(0, 40),
      avatar:             p.avatar  || "🔧",
      country:            p.country || "FR",
      banner:             p.banner  || "#1a2a4a",
      prestige_count:     state.prestigeCount  ?? 0,
      garage_level:       state.garageLevel    ?? 1,
      cars_sold:          state.totalCarsSold  ?? 0,
      total_money:        Math.floor(state.totalMoneyEarned ?? 0),
      achievements_count: achCount,
      updated_at:         new Date().toISOString(),
    }, { onConflict: "user_id" });
  } catch(e){ dbg("[leaderboard] push erreur:", e.message); }
}

// ── Fetch ─────────────────────────────────────────────────────────────────────
async function fetchLeaderboard(tab){
  const colMap = {
    prestige:     { col:"prestige_count",     fmt: v => `🔥 ${v} prestige${v > 1 ? 's' : ''}`  },
    level:        { col:"garage_level",        fmt: v => `⚙️ Niveau ${v}`                        },
    money:        { col:"total_money",         fmt: v => formatMoney(v)                           },
    sold:         { col:"cars_sold",           fmt: v => `${v.toLocaleString("fr-FR")} 🚗`       },
    achievements: { col:"achievements_count",  fmt: v => `🏅 ${v} succès`                         },
  };
  const { col, fmt } = colMap[tab] || colMap.prestige;

  const { data, error } = await _supa
    .from("leaderboard")
    .select("user_id,pseudo,garage_name,avatar,country,banner,prestige_count,garage_level,cars_sold,total_money,achievements_count,updated_at")
    .order(col, { ascending: false })
    .limit(50);

  if(error) throw error;
  return { rows: data || [], fmt, col };
}

// ── Render rows ───────────────────────────────────────────────────────────────
function renderLeaderboardRows(rows, fmt, col){
  const lbList = document.getElementById("lbList");
  if(!rows.length){
    lbList.innerHTML = `<div class="lb__empty">Aucun joueur pour l'instant…</div>`;
    return;
  }

  const medals    = ["🥇","🥈","🥉"];
  const rankClass = ["lbCard__rank--gold","lbCard__rank--silver","lbCard__rank--bronze"];
  const cardClass = ["lbCard--gold","lbCard--silver","lbCard--bronze"];

  let myCardHTML = "";
  let html = "";

  rows.forEach((r, i) => {
    const isMe  = currentUser && r.user_id === currentUser.id;
    const rank  = i + 1;
    const isTop = rank <= 3;

    const rankLabel = isTop
      ? `<div class="lbCard__rank ${rankClass[rank-1]}">${medals[rank-1]}</div>`
      : `<div class="lbCard__rank lbCard__rank--num">#${rank}</div>`;

    const extraCard = isMe ? "lbCard--me" : isTop ? cardClass[rank-1] : "";

    const country  = (r.country || "").toUpperCase();
    const flagHtml = country && country !== "OTHER" && country.length === 2
      ? `<img src="https://flagcdn.com/16x12/${country.toLowerCase()}.png" width="16" height="12" class="lbCard__flag" alt="${country}" onerror="this.style.display='none'">`
      : `<span style="font-size:11px">🌍</span>`;

    const banner   = r.banner || "#1a2a4a";
    const lastSeen = r.updated_at ? new Date(r.updated_at).toLocaleDateString("fr-FR") : "";
    const value    = r[col] ?? 0;

    // Stats secondaires — uniquement ce qui n'est pas déjà le critère actif
    const badges = [
      col !== "prestige_count"    ? `🔥 ${r.prestige_count ?? 0}` : null,
      col !== "garage_level"      ? `⚙️ Niv.${r.garage_level ?? 1}` : null,
      col !== "cars_sold"         ? `🚗 ${(r.cars_sold ?? 0).toLocaleString("fr-FR")}` : null,
      col !== "achievements_count"? `🏅 ${r.achievements_count ?? 0}` : null,
    ].filter(Boolean).map(b => `<span class="lbCard__badge">${b}</span>`).join("");

    const cardHTML = `
      <div class="lbCard ${extraCard}" data-uid="${r.user_id}">
        <div class="lbCard__banner" style="background:${banner}"></div>
        <div class="lbCard__side">
          ${rankLabel}
          <div class="lbCard__avatar">${r.avatar || "🔧"}</div>
        </div>
        <div class="lbCard__body">
          <div class="lbCard__top">
            <div class="lbCard__names">
              <div class="lbCard__garage">${r.garage_name || "Garage Turbo"}</div>
              <div class="lbCard__pseudo">${flagHtml} ${r.pseudo || "Mécanicien"} <span class="lbCard__lastseen">· ${lastSeen}</span></div>
            </div>
            <div class="lbCard__score">${fmt(value)}</div>
          </div>
          <div class="lbCard__stats">${badges}</div>
        </div>
      </div>`;

    html += cardHTML;
    if(isMe) myCardHTML = cardHTML;
  });

  lbList.innerHTML = html;

  // Clic → popup profil
  lbList.querySelectorAll(".lbCard").forEach(card => {
    card.addEventListener("click", () => showLbProfile(card.dataset.uid, rows));
  });

  // Ma position en bas
  const myRowEl = document.getElementById("lbMyRow");
  if(myCardHTML && currentUser){
    myRowEl.style.display = "block";
    myRowEl.innerHTML = `<div class="lb__myLabel">📍 MA POSITION</div>${myCardHTML}`;
    myRowEl.querySelector(".lbCard")?.addEventListener("click", () =>
      showLbProfile(currentUser.id, rows));
  } else {
    myRowEl.style.display = "none";
  }
}

// ── Popup profil ──────────────────────────────────────────────────────────────
function showLbProfile(uid, rows){
  const r = rows.find(x => x.user_id === uid);
  if(!r) return;

  document.getElementById("lbProfilePopup")?.remove();

  const country  = (r.country || "").toUpperCase();
  const flagHtml = country && country !== "OTHER" && country.length === 2
    ? `<img src="https://flagcdn.com/20x15/${country.toLowerCase()}.png" width="20" height="15" style="border-radius:2px;vertical-align:middle;" alt="${country}" onerror="this.style.display='none'">`
    : "🌍";
  const banner   = r.banner || "#1a2a4a";
  const lastSeen = r.updated_at ? new Date(r.updated_at).toLocaleDateString("fr-FR") : "—";
  const isMe     = currentUser && r.user_id === currentUser.id;

  const popup = document.createElement("div");
  popup.id = "lbProfilePopup";
  popup.className = "lbProfile";
  popup.innerHTML = `
    <div class="lbProfile__backdrop"></div>
    <div class="lbProfile__card">
      <button class="lbProfile__close">✕</button>
      <div class="lbProfile__banner" style="background:${banner}">
        ${isMe ? '<div class="lbProfile__meBadge">C\'est moi</div>' : ""}
        <div class="lbProfile__avatar">${r.avatar || "🔧"}</div>
      </div>
      <div class="lbProfile__body">
        <div class="lbProfile__pseudo">${r.pseudo || "Mécanicien"}</div>
        <div class="lbProfile__garage">${r.garage_name || "Garage Turbo"}</div>
        <div class="lbProfile__country">${flagHtml} ${country !== "OTHER" ? country : "Monde"}</div>
        <div class="lbProfile__grid">
          <div class="lbProfile__stat">
            <div class="lbProfile__statVal" style="color:#ff8c40">🔥 ${r.prestige_count ?? 0}</div>
            <div class="lbProfile__statLabel">Prestiges</div>
          </div>
          <div class="lbProfile__stat">
            <div class="lbProfile__statVal" style="color:#4a9eff">⚙️ ${r.garage_level ?? 1}</div>
            <div class="lbProfile__statLabel">Niveau</div>
          </div>
          <div class="lbProfile__stat">
            <div class="lbProfile__statVal" style="color:#2ee59d">🚗 ${(r.cars_sold ?? 0).toLocaleString("fr-FR")}</div>
            <div class="lbProfile__statLabel">Voitures</div>
          </div>
          <div class="lbProfile__stat">
            <div class="lbProfile__statVal" style="color:#ffc83a">💰 ${formatMoney(r.total_money ?? 0)}</div>
            <div class="lbProfile__statLabel">Argent total</div>
          </div>
          <div class="lbProfile__stat">
            <div class="lbProfile__statVal" style="color:#a78bfa">🏅 ${r.achievements_count ?? 0}</div>
            <div class="lbProfile__statLabel">Succès</div>
          </div>
          <div class="lbProfile__stat">
            <div class="lbProfile__statVal" style="color:rgba(255,255,255,.4)">📅 ${lastSeen}</div>
            <div class="lbProfile__statLabel">Activité</div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(popup);
  requestAnimationFrame(() => popup.classList.add("lbProfile--in"));

  const close = () => {
    popup.classList.remove("lbProfile--in");
    setTimeout(() => popup.remove(), 200);
  };
  popup.querySelector(".lbProfile__close").addEventListener("click", close);
  popup.querySelector(".lbProfile__backdrop").addEventListener("click", close);
}

// ── Load ──────────────────────────────────────────────────────────────────────
async function loadLeaderboard(){
  const lbList = document.getElementById("lbList");
  lbList.innerHTML = `<div class="lb__empty">⏳ Chargement…</div>`;
  try {
    const { rows, fmt, col } = await fetchLeaderboard(_lbTab);
    document.getElementById("lbSubtitle").textContent = `Top ${rows.length} joueurs`;
    renderLeaderboardRows(rows, fmt, col);
  } catch(e){
    lbList.innerHTML = `<div class="lb__empty" style="color:#ff5a5a">Erreur de chargement — réessaie plus tard</div>`;
    dbg("[leaderboard] fetch erreur:", e.message);
  }
}

function openLeaderboard(){
  document.getElementById("leaderboardModal").style.display = "flex";
  loadLeaderboard();
}
function closeLeaderboard(){
  document.getElementById("leaderboardModal").style.display = "none";
  document.getElementById("lbProfilePopup")?.remove();
}

// ── Listeners ─────────────────────────────────────────────────────────────────
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
