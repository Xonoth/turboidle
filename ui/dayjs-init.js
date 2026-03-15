// =====================================================================
// GARAGE TURBO — DAY.JS
// Init + plugins + patch des fonctions de durée/date du jeu
// =====================================================================

function initDayJS(){
  if(typeof dayjs === "undefined"){
    setTimeout(initDayJS, 100);
    return;
  }

  // ── Plugins ────────────────────────────────────────────────────────────────
  dayjs.extend(window.dayjs_plugin_duration);
  dayjs.extend(window.dayjs_plugin_relativeTime);
  dayjs.extend(window.dayjs_plugin_customParseFormat);
  dayjs.locale("fr");

  // ── 1. Patch formatTime — barres de réparation ────────────────────────────
  // Remplace la fonction globale existante dans render.js
  window.formatTime = function(s){
    if(s === null || s === undefined || !isFinite(s)) return "—";
    s = Math.max(0, Math.round(s));
    if(s === 0) return "0s";
    const dur = dayjs.duration(s, "seconds");
    if(s >= 3600){
      const h = Math.floor(dur.asHours());
      const m = dur.minutes();
      const sec = dur.seconds();
      return sec > 0 ? `${h}h ${m}m ${sec}s` : `${h}h ${m}m`;
    }
    if(s >= 60){
      const m = Math.floor(dur.asMinutes());
      const sec = dur.seconds();
      return sec > 0 ? `${m}m ${sec}s` : `${m}m`;
    }
    return `${s}s`;
  };

  // ── 2. Patch formatDuration — durées longues (AFK, session) ──────────────
  window.formatDuration = function(seconds){
    if(!seconds || seconds <= 0) return "moins d'une minute";
    const dur = dayjs.duration(Math.round(seconds), "seconds");
    const h   = Math.floor(dur.asHours());
    const m   = dur.minutes();
    const s   = dur.seconds();
    if(h > 0)   return m > 0 ? `${h}h ${m}min` : `${h}h`;
    if(m > 0)   return s > 0 ? `${m}min ${s}s`  : `${m}min`;
    return `${s}s`;
  };

  // ── 3. Patch formatSaveDate — date de dernière save ───────────────────────
  window.formatSaveDate = function(ts){
    if(!ts) return "Jamais sauvegardé";
    const d = dayjs(ts);
    const now = dayjs();
    const diffMin = now.diff(d, "minute");
    if(diffMin < 1)   return "Sauvegardé à l'instant";
    if(diffMin < 60)  return `Sauvegardé il y a ${diffMin} min`;
    if(diffMin < 1440) return `Sauvegardé à ${d.format("HH:mm")}`;
    return `Sauvegardé le ${d.format("DD/MM à HH:mm")}`;
  };

  // ── 4. Patch _updateSideMenuLastSave — side menu ──────────────────────────
  const _origUpdateSave = window._updateSideMenuLastSave;
  window._updateSideMenuLastSave = function(){
    const el = document.getElementById("sideMenuLastSave");
    if(!el) return;
    const snap = window._saveService?._lsRead?.();
    if(snap?.savedAt){
      el.textContent = formatSaveDate(snap.savedAt);
    } else {
      el.textContent = "Autosave toutes les 60s";
    }
  };

  // Rafraîchir le side menu toutes les 60s pour que "il y a X min" soit à jour
  setInterval(() => {
    if(document.getElementById("sideMenuDrawer")?.classList.contains("sideMenu__drawer--open")){
      window._updateSideMenuLastSave?.();
    }
  }, 60000);

  // ── 5. Patch renderStatsUI — durée de session ─────────────────────────────
  // On patche la fonction après son chargement
  const _patchStats = () => {
    const origRSU = window.renderStatsUI;
    if(typeof origRSU !== "function"){ setTimeout(_patchStats, 200); return; }
    window.renderStatsUI = function(){
      origRSU();
      // Remplacer le subtitle de session par une version Day.js
      const subEl = document.getElementById("statsSubtitle");
      if(subEl && state?.sessionStart){
        const secs = (Date.now() - state.sessionStart) / 1000;
        subEl.textContent = "Session : " + formatDuration(secs);
      }
    };
  };
  setTimeout(_patchStats, 500);

  // ── 6. Patch message AFK — toast à la reconnexion ─────────────────────────
  // On wrappe showToast pour enrichir les messages AFK
  window._gtEnrichAFKToast = function(offlineSecs, moneyGained){
    if(offlineSecs < 10) return; // trop court pour notifier
    const durStr   = formatDuration(offlineSecs);
    const moneyStr = typeof formatMoney !== "undefined" ? formatMoney(moneyGained) : Math.round(moneyGained) + "€";
    gtToast?.(`📴 Absent ${durStr} — +${moneyStr} récupérés`, "info");
  };

  console.log("[GT Day.js] Prêt ✓ — locale fr, plugins duration + relativeTime");
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", () => setTimeout(initDayJS, 100));
} else {
  setTimeout(initDayJS, 100);
}
