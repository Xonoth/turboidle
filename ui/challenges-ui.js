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

  const list = state.challenges.list;
  const now  = new Date();
  const midnight = new Date(now); midnight.setHours(24,0,0,0);
  const diffMs = midnight - now;
  const hh = String(Math.floor(diffMs / 3600000)).padStart(2,"0");
  const mm = String(Math.floor((diffMs % 3600000) / 60000)).padStart(2,"0");
  const ss = String(Math.floor((diffMs % 60000) / 1000)).padStart(2,"0");

  const allGoldClaimed = list.every(d => d.tiers?.[2]?.claimed);

  // Streak
  const streakCount = state.challengeStreak?.count ?? 0;
  const streakMult  = typeof getStreakBonus === "function" ? getStreakBonus() : 1;
  const streakHtml = streakCount > 0 ? `
    <div class="challenges__streak">
      <span class="challenges__streakFire">${streakCount >= 7 ? "🔥" : "⚡"}</span>
      <span class="challenges__streakCount">${streakCount} jour${streakCount>1?"s":""} de suite</span>
      ${streakMult > 1 ? `<span class="challenges__streakMult">×${streakMult} récompenses</span>` : ""}
    </div>` : "";

  el.innerHTML = `
    <div class="challenges__header">
      <div>
        <div class="challenges__title">📅 Défis du jour</div>
        <div class="challenges__subtitle">Niveau de génération : <b>${state.challenges.genLevel}</b></div>
      </div>
      <div class="challenges__timer">⏱ Reset dans <b>${hh}:${mm}:${ss}</b></div>
    </div>
    ${streakHtml}
    ${allGoldClaimed
      ? `<div class="challenges__allDone">
           🎉 Tous les défis Or complétés !
           ${state.challenges.bonusRep ? `<div class="challenges__bonusRep">⭐ +${state.challenges.bonusRep.toLocaleString("fr-FR")} REP bonus encaissés</div>` : ""}
         </div>`
      : `<div class="challenges__bonusHint">🎯 Complète les 3 défis Or pour un bonus REP !</div>`
    }
    <div class="challenges__list">
      ${list.map((defi, idx) => renderChallengeCard(defi, idx)).join("")}
    </div>
  `;

  // Bind boutons claim par palier
  el.querySelectorAll(".challengeTier__btn[data-cidx]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx     = parseInt(btn.dataset.cidx);
      const tierIdx = parseInt(btn.dataset.tieridx);
      if(typeof claimChallengeTier === "function") claimChallengeTier(idx, tierIdx);
    });
  });
}

function renderChallengeCard(defi, idx){
  const type = CHALLENGE_TYPES.find(t => t.id === defi.id);
  if(!type || !state.challenges || !defi.tiers) return "";

  const current = challengeCurrentValue(defi);
  const goldTarget = defi.tiers[2]?.target ?? 1;
  const pct = Math.min(100, Math.round((current / goldTarget) * 100));
  const allClaimed = defi.tiers.every(t => t.claimed);

  // Format valeur
  const fmtVal = (v) => defi.id === "earn_money" ? formatMoney(v) : v.toLocaleString("fr-FR");

  // Paliers HTML
  const tiersHtml = defi.tiers.map((tier, tIdx) => {
    const reached  = current >= tier.target;
    const canClaim = reached && !tier.claimed;
    const streakMult = typeof getStreakBonus === "function" ? getStreakBonus() : 1;
    const rewards = [
      tier.reward_money > 0  ? `💰 +${formatMoney(Math.round(tier.reward_money * (canClaim ? streakMult : 1)))}` : null,
      tier.reward_talent > 0 ? `✨ +${tier.reward_talent} talent` : null,
      tier.reward_rep > 0    ? `⭐ +${Math.round(tier.reward_rep * (canClaim ? streakMult : 1)).toLocaleString("fr-FR")} REP` : null,
    ].filter(Boolean).join(" · ");

    let state_class = "";
    if(tier.claimed)   state_class = "challengeTier--claimed";
    else if(reached)   state_class = "challengeTier--reached";
    else               state_class = "challengeTier--locked";

    return `
      <div class="challengeTier ${state_class}">
        <div class="challengeTier__left">
          <span class="challengeTier__medal">${tier.label.split(" ")[0]}</span>
          <div class="challengeTier__info">
            <span class="challengeTier__tierLabel">${tier.label.split(" ").slice(1).join(" ")}</span>
            <span class="challengeTier__target">${fmtVal(tier.target)}</span>
          </div>
        </div>
        <div class="challengeTier__right">
          <span class="challengeTier__rewards">${rewards}</span>
          ${tier.claimed
            ? `<span class="challengeTier__done">✅</span>`
            : canClaim
              ? `<button class="challengeTier__btn" data-cidx="${idx}" data-tieridx="${tIdx}">Réclamer</button>`
              : `<span class="challengeTier__locked">${fmtVal(tier.target - current)} restants</span>`
          }
        </div>
      </div>`;
  }).join("");

  return `
    <div class="challengeCard ${allClaimed ? 'challengeCard--claimed' : ''}">
      <div class="challengeCard__top">
        <div class="challengeCard__icon">${defi.icon}</div>
        <div class="challengeCard__info">
          <div class="challengeCard__label">${(()=>{
            const next = defi.tiers?.find(t => !t.claimed);
            if(!next) return defi.label + ' <span class="challengeCard__labelDone">✓</span>';
            const target = fmtVal(next.target);
            return defi.label + ' <span class="challengeCard__labelTarget">' + target + '</span>';
          })()}</div>
          <div class="challengeCard__desc">${defi.desc}</div>
        </div>
      </div>
      <div class="challengeCard__progress">
        <div class="challengeCard__bar">
          <div class="challengeCard__fill ${pct >= 100 ? 'challengeCard__fill--done' : ''}" style="width:${pct}%"></div>
          ${defi.tiers.map(tier => {
            const pctTier = Math.round((tier.target / goldTarget) * 100);
            return `<div class="challengeCard__marker ${current >= tier.target ? 'challengeCard__marker--reached' : ''}" style="left:${pctTier}%"></div>`;
          }).join("")}
        </div>
        <div class="challengeCard__count">${fmtVal(current)} / ${fmtVal(goldTarget)}</div>
      </div>
      <div class="challengeCard__tiers">${tiersHtml}</div>
    </div>`;
}

// Timer live
let _challengeTimerInterval = null;
function startChallengeTimer(){
  if(_challengeTimerInterval) clearInterval(_challengeTimerInterval);
  _challengeTimerInterval = setInterval(() => {
    if(state.challenges && state.challenges.day !== todayKey()){
      initChallenges();
      renderChallengesUI();
      return;
    }
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

document.getElementById("btnChallengesClose")?.addEventListener("click", closeChallenges);
document.getElementById("challengesBackdrop")?.addEventListener("click", closeChallenges);

const _btnChallenges = document.getElementById("btnChallenges");
if(_btnChallenges) _btnChallenges.addEventListener("click", openChallenges);

function updateChallengesNotifDot(){
  const dot = document.getElementById("challengesNotifDot");
  if(!dot || !state.challenges) return;
  const hasDone = state.challenges.list.some(d => {
    if(!d.tiers) return false;
    const type = CHALLENGE_TYPES.find(t => t.id === d.id);
    if(!type) return false;
    const current = type.progress(d.cfg, state.challenges.snap);
    return d.tiers.some(tier => !tier.claimed && current >= tier.target);
  });
  dot.style.display = hasDone ? "block" : "none";
}
