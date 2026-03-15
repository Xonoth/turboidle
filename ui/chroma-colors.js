// =====================================================================
// GARAGE TURBO — CHROMA COLORS (Chroma.js)
// Couleurs dynamiques pour les barres de réparation et éléments UI
// Mélange tier + rareté pour une couleur unique par voiture
// =====================================================================

(function loadChroma(){
  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/chroma-js@2.4.2/chroma.min.js";
  s.onload = () => {
    window._chromaReady = true;
    console.log("[GT Chroma] Prêt ✓");
  };
  document.head.appendChild(s);
})();

// ── Couleurs de base par tier ─────────────────────────────────────────────────
const TIER_COLORS = {
  "F":    "#8ca8c0", "E":  "#a0b890", "D":  "#c4b870",
  "C":    "#4dff9a", "B":  "#7ab0ff", "A":  "#a07aff",
  "S":    "#ffc83a", "SS": "#ff8c40", "SSS":"#ff4d70", "SSS+":"#ffffff",
};

const RARITY_COLORS = {
  common:    null,       // pas de teinte rareté
  uncommon:  "#4a9eff",
  rare:      "#2ee59d",
  epic:      "#a78bfa",
  legendary: "#ffc83a",
  mythic:    "#ff4d70",
};

// ── Génère la couleur de barre pour une voiture ───────────────────────────────
// Mélange la couleur du tier avec celle de la rareté
window.getBarColor = function(car){
  if(!window._chromaReady || !car) return null;
  try {
    const tierCol   = TIER_COLORS[car.tier]   ?? "#8ca8c0";
    const rarityCol = RARITY_COLORS[car.rarity ?? "common"];

    if(!rarityCol){
      // Common — dégradé simple basé sur le tier
      return chroma(tierCol).alpha(0.85).css();
    }
    // Mélange 55% tier / 45% rareté
    const mixed = chroma.mix(tierCol, rarityCol, 0.45, "lch");
    return mixed.css();
  } catch(e) {
    return null;
  }
};

// ── Génère un gradient CSS pour la barre de répa ─────────────────────────────
window.getBarGradient = function(car, pct = 100){
  if(!window._chromaReady || !car) return null;
  try {
    const tierCol   = TIER_COLORS[car.tier]   ?? "#8ca8c0";
    const rarityCol = RARITY_COLORS[car.rarity ?? "common"];

    let c1, c2;
    if(!rarityCol){
      c1 = chroma(tierCol).darken(0.5).css();
      c2 = chroma(tierCol).brighten(0.3).css();
    } else {
      c1 = chroma.mix(tierCol, rarityCol, 0.3, "lch").css();
      c2 = chroma.mix(tierCol, rarityCol, 0.7, "lch").brighten(0.2).css();
    }
    return `linear-gradient(90deg, ${c1} 0%, ${c2} 100%)`;
  } catch(e) {
    return null;
  }
};

// ── Couleur de texte accessible sur un fond coloré ───────────────────────────
window.getContrastColor = function(bgColor){
  if(!window._chromaReady) return "#ffffff";
  try {
    return chroma(bgColor).luminance() > 0.35 ? "#0a0e1a" : "#ffffff";
  } catch(e) {
    return "#ffffff";
  }
};

// ── Patch renderActive — barre de répa colorée dynamiquement ─────────────────
function _patchBarColor(){
  // On observe les mises à jour de la barre via le MutationObserver existant
  // et on applique la couleur Chroma sur les barres actives

  // Patch appliqué à chaque tick via renderActive
  const _origRenderActive = window.renderActive;
  if(typeof _origRenderActive !== "function"){ setTimeout(_patchBarColor, 300); return; }

  window.renderActive = function(...args){
    _origRenderActive(...args);
    if(!window._chromaReady) return;
    // Appliquer gradient sur toutes les barres actives
    document.querySelectorAll(".garageSlot--active .garageSlot__barFill").forEach(fill => {
      const slot = fill.closest(".garageSlot--active");
      if(!slot || slot._chromaApplied) return;
      // Récupérer la voiture depuis l'état
      const car = state?.active ?? state?.actives?.[0];
      if(!car) return;
      const grad = getBarGradient(car);
      if(grad){
        fill.style.background = grad;
        slot._chromaApplied = true;
        // Reset quand la voiture change
        setTimeout(() => { slot._chromaApplied = false; }, 500);
      }
    });
  };
}

// Démarrer après chargement
if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", () => setTimeout(_patchBarColor, 500));
} else {
  setTimeout(_patchBarColor, 500);
}
