// =====================================================================
// GARAGE TURBO — EVENT BUS (Mitt)
// Remplace les patches en chaîne sur window.showToast
// par un vrai système d'événements découplé
// =====================================================================

// ── Chargement Mitt depuis CDN ────────────────────────────────────────────────
(function loadMitt(){
  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/mitt@3.0.1/dist/mitt.umd.js";
  s.onload = () => {
    window.GT_BUS = mitt();
    _initBusListeners();
    console.log("[GT Bus] Mitt prêt ✓");
  };
  document.head.appendChild(s);
})();

// ── Événements du bus ─────────────────────────────────────────────────────────
// Émis depuis app.js / render.js :
//   GT_BUS.emit("car:epic",      { car, el })   — voiture épique diagnostiquée
//   GT_BUS.emit("car:legendary", { car, el })   — voiture légendaire diagnostiquée
//   GT_BUS.emit("car:mythic",    { car, el })   — voiture mythique diagnostiquée
//   GT_BUS.emit("car:sold",      { car, value }) — voiture vendue
//   GT_BUS.emit("repair:done",   { car })        — réparation terminée
//   GT_BUS.emit("prestige",      {})             — prestige effectué
//   GT_BUS.emit("achievement",   { ach })        — succès débloqué
//   GT_BUS.emit("save:done",     { ts })         — sauvegarde effectuée

function _initBusListeners(){
  const bus = window.GT_BUS;
  if(!bus) return;

  // ── Animations (confetti, flash) ──────────────────────────────────────────
  bus.on("car:legendary", ({ el }) => {
    if(typeof burstLegendary === "function") burstLegendary(el ?? document.getElementById("btnAnalyze"));
  });
  bus.on("car:mythic", ({ el }) => {
    if(typeof burstMythic === "function") burstMythic(el ?? document.getElementById("btnAnalyze"));
  });
  bus.on("prestige", () => {
    if(typeof burstPrestige === "function") burstPrestige();
  });
  bus.on("car:epic", ({ el }) => {
    const btn = el ?? document.getElementById("btnAnalyze");
    btn?.classList.add("btnAnalyze--flash-epic");
    setTimeout(() => btn?.classList.remove("btnAnalyze--flash-epic"), 500);
  });

  // ── Toasts ────────────────────────────────────────────────────────────────
  bus.on("car:legendary", ({ car }) => {
    if(typeof gtToast === "function") gtToast(`✨ Voiture Légendaire ! ${car?.name ?? ""}`, "legendary");
  });
  bus.on("car:mythic", ({ car }) => {
    if(typeof gtToast === "function") gtToast(`🔴 MYTHIQUE ! ${car?.name ?? ""}`, "mythic");
  });
  bus.on("achievement", ({ ach }) => {
    if(typeof gtToast === "function") gtToast(`🎖️ Succès : ${ach?.name ?? "Nouveau succès !"}`, "talent");
  });
  bus.on("save:done", ({ ts }) => {
    // Mise à jour du side menu silencieuse
    if(typeof window._updateSideMenuLastSave === "function"){
      window._updateSideMenuLastSave();
    }
  });

  // ── Graphiques — mise à jour à la vente ──────────────────────────────────
  bus.on("car:sold", ({ car }) => {
    // Mettre à jour carsSoldByTier en temps réel
    if(typeof state !== "undefined" && car?.tier){
      if(!state.carsSoldByTier) state.carsSoldByTier = {};
      state.carsSoldByTier[car.tier] = (state.carsSoldByTier[car.tier] ?? 0) + 1;
    }
  });
}

// ── Fonction utilitaire d'émission ────────────────────────────────────────────
// Appelée depuis app.js avec window.GT_BUS?.emit(...)
// ou depuis les helpers ci-dessous

window.gtEmit = function(event, data = {}){
  window.GT_BUS?.emit(event, data);
};

// ── Rétrocompatibilité — garder les fonctions globales existantes ─────────────
// burstLegendary, burstMythic, burstPrestige restent disponibles directement
// GT_BUS les appelle aussi — pas de doublon si on n'appelle que l'un des deux
