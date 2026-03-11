// =====================
// DÉFIS UI
// =====================

function renderChallengesUI(){
  const el = document.getElementById("challengesPanel");
  if(!el) return;

  if(!state.challenges){
    el.innerHTML = `<div class="challenges__empty">Chargement des défis...</div>`;
    return;
  }

  const list   = state.challenges.list;
  const key    = state.challenges.day;
  // Temps restant avant minuit
  const now    = new Date();
  const midnight = new Date(now); midnight.setHours(24,0,0,0);
  const diffMs = midnight - now;
  const hh = String(Math.floor(diffMs / 3600000)).padStart(2,"0");
  const mm = String(Math.floor((diffMs % 3600000) / 60000)).padStart(2,"0");
  const ss = String(Math.floor((diffMs % 60000) / 1000)).padStart(2,"0");

  const allClaimed = list.every(d => d.claimed);

  el.innerHTML = `
    <div class="challenges__header">
      <div class="challenges__title">📅 Défis du jour</div>
      <div class="challenges__timer">⏱ Reset dans <b>${hh}:${mm}:${ss}</b></div>
    </div>
    <div class="challenges__subtitle">Niveau de génération : <b>${state.challenges.genLevel}</b></div>
    ${allClaimed
      ? `<div class="challenges__allDone">
           🎉 Tous les défis du jour complétés !
           ${state.challenges.bonusRep
             ? `<div class="challenges__bonusRep">⭐ +${state.challenges.bonusRep.toLocaleString("fr-FR")} REP bonus encaissés</div>`
             : ""}
         </div>`
      : `<div class="challenges__bonusHint">🎯 Complète les 3 défis pour un bonus REP !</div>`
    }
    <div class="challenges__list">
      ${list.map((defi, idx) => renderChallengeCard(defi, idx)).join("")}
    </div>
  `;

  // Bind boutons claim
  el.querySelectorAll(".challengeCard__btn[data-cidx]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.cidx);
      claimChallenge(idx);
    });
  });
}

function renderChallengeCard(defi, idx){
  const type    = CHALLENGE_TYPES.find(t => t.id === defi.id);
  if(!type || !state.challenges) return "";

  const max     = defi.cfg.count ?? defi.cfg.amount;
  const current = type.progress(defi.cfg, state.challenges.snap);
  const pct     = Math.min(100, Math.round((current / max) * 100));
  const done    = current >= max;

  let statusClass = "";
  if(defi.claimed)   statusClass = "challengeCard--claimed";
  else if(done)      statusClass = "challengeCard--done";

  const currentFmt = defi.id === "earn_money"
    ? formatMoney(current)
    : current.toLocaleString("fr-FR");
  const maxFmt = defi.id === "earn_money"
    ? formatMoney(max)
    : max.toLocaleString("fr-FR");

  return `
    <div class="challengeCard ${statusClass}">
      <div class="challengeCard__top">
        <div class="challengeCard__icon">${defi.icon}</div>
        <div class="challengeCard__info">
          <div class="challengeCard__label">${defi.label}</div>
          <div class="challengeCard__desc">${defi.desc}</div>
        </div>
        ${defi.claimed
          ? `<div class="challengeCard__check">✅</div>`
          : done
            ? `<button class="challengeCard__btn" data-cidx="${idx}">Réclamer</button>`
            : ``
        }
      </div>
      <div class="challengeCard__progress">
        <div class="challengeCard__bar">
          <div class="challengeCard__fill ${done ? 'challengeCard__fill--done' : ''}"
               style="width:${pct}%"></div>
        </div>
        <div class="challengeCard__count">${currentFmt} / ${maxFmt}</div>
      </div>
      <div class="challengeCard__rewards">
        <span class="challengeCard__reward challengeCard__reward--money">💰 +${formatMoney(defi.cfg.reward_money)}</span>
        <span class="challengeCard__reward challengeCard__reward--talent">✨ +${defi.cfg.reward_talent} pt talent</span>
      </div>
    </div>
  `;
}

// Timer live — met à jour uniquement le compteur toutes les secondes
let _challengeTimerInterval = null;
function startChallengeTimer(){
  if(_challengeTimerInterval) clearInterval(_challengeTimerInterval);
  _challengeTimerInterval = setInterval(() => {
    // Vérifier reset journalier
    if(state.challenges && state.challenges.day !== todayKey()){
      initChallenges();
      renderChallengesUI();
      return;
    }
    // Mettre à jour seulement le timer
    const timerEl = document.querySelector(".challenges__timer b");
    if(!timerEl) return;
    const now = new Date();
    const midnight = new Date(now); midnight.setHours(24,0,0,0);
    const diffMs = midnight - now;
    const hh = String(Math.floor(diffMs / 3600000)).padStart(2,"0");
    const mm = String(Math.floor((diffMs % 3600000) / 60000)).padStart(2,"0");
    const ss = String(Math.floor((diffMs % 60000) / 1000)).padStart(2,"0");
    timerEl.textContent = `${hh}:${mm}:${ss}`;
  }, 1000);
}

function openChallenges(){
  document.getElementById("challengesModal").style.display = "block";
  updateChallengeSnap();
  renderChallengesUI();
  startChallengeTimer();
}
function closeChallenges(){
  document.getElementById("challengesModal").style.display = "none";
  if(_challengeTimerInterval){ clearInterval(_challengeTimerInterval); _challengeTimerInterval = null; }
}

// Listeners
document.getElementById("btnChallengesClose")?.addEventListener("click", closeChallenges);
document.getElementById("challengesBackdrop")?.addEventListener("click", closeChallenges);

// Bouton topbar
const _btnChallenges = document.getElementById("btnChallenges");
if(_btnChallenges) _btnChallenges.addEventListener("click", openChallenges);

// Badge notif (défis non réclamés complétés)
function updateChallengesNotifDot(){
  const dot = document.getElementById("challengesNotifDot");
  if(!dot || !state.challenges) return;
  const hasDone = state.challenges.list.some(d => {
    if(d.claimed) return false;
    const type = CHALLENGE_TYPES.find(t => t.id === d.id);
    if(!type) return false;
    const max  = d.cfg.count ?? d.cfg.amount;
    return type.progress(d.cfg, state.challenges.snap) >= max;
  });
  dot.style.display = hasDone ? "block" : "none";
}
