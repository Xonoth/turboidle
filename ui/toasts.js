// =====================================================================
// GARAGE TURBO — TOASTS (Toastify.js)
// Remplace showToast() par un système empilable avec types colorés
// =====================================================================

// ── Types de toast ────────────────────────────────────────────────────────────
const TOAST_TYPES = {
  // type: { bg, border, duration, gravity, position }
  mythic:  { bg:"linear-gradient(135deg,rgba(160,0,50,.97),rgba(255,30,80,.95))",  border:"rgba(255,77,112,.6)",  duration:5000 },
  legendary:{ bg:"linear-gradient(135deg,rgba(120,80,0,.97),rgba(255,180,0,.95))", border:"rgba(255,200,58,.6)",  duration:4500 },
  success: { bg:"linear-gradient(135deg,rgba(5,40,25,.97),rgba(20,80,55,.95))",    border:"rgba(46,229,157,.4)",  duration:3000 },
  info:    { bg:"linear-gradient(135deg,rgba(8,20,45,.97),rgba(15,40,80,.95))",    border:"rgba(49,214,255,.35)", duration:3000 },
  warn:    { bg:"linear-gradient(135deg,rgba(60,35,0,.97),rgba(100,65,0,.95))",    border:"rgba(255,159,67,.4)",  duration:3500 },
  error:   { bg:"linear-gradient(135deg,rgba(50,5,10,.97),rgba(90,15,25,.95))",    border:"rgba(255,77,112,.4)",  duration:3500 },
  talent:  { bg:"linear-gradient(135deg,rgba(40,20,80,.97),rgba(80,50,140,.95))",  border:"rgba(167,139,250,.4)", duration:4000 },
  prestige:{ bg:"linear-gradient(135deg,rgba(80,20,0,.97),rgba(200,60,0,.95))",    border:"rgba(255,120,50,.5)",  duration:5000 },
};

// ── Détecter le type à partir du message ─────────────────────────────────────
function _detectToastType(msg){
  if(!msg) return "info";
  const m = msg.toString();
  if(m.includes("MYTHIQUE") || m.includes("Mythique"))     return "mythic";
  if(m.includes("Légendaire") || m.includes("légendaire")) return "legendary";
  if(m.includes("Prestige") || m.includes("prestige"))     return "prestige";
  if(m.includes("talent") || m.includes("Talent"))         return "talent";
  if(m.includes("⚠️") || m.includes("plein") || m.includes("insuffisant")) return "warn";
  if(m.includes("❌") || m.includes("Erreur") || m.includes("erreur"))      return "error";
  if(m.includes("✅") || m.includes("Livraison") || m.includes("📦") ||
     m.includes("Commande") || m.includes("sauvegardé") || m.includes("vendue")) return "success";
  return "info";
}

// ── Fonction principale ───────────────────────────────────────────────────────
// ── Throttle anti-spam ────────────────────────────────────────────────────────
const TOAST_THROTTLE_MS = 8000;
const _toastThrottle    = {};

function _isThrottled(msg){
  const now = Date.now();
  const key = String(msg).substring(0, 60);
  if(_toastThrottle[key] && now - _toastThrottle[key] < TOAST_THROTTLE_MS) return true;
  _toastThrottle[key] = now;
  // Nettoyage périodique
  if(Object.keys(_toastThrottle).length > 40){
    for(const k in _toastThrottle){
      if(now - _toastThrottle[k] > TOAST_THROTTLE_MS * 2) delete _toastThrottle[k];
    }
  }
  return false;
}

function gtToast(msg, typeOverride){
  if(typeof Toastify === "undefined"){
    console.warn("[GT Toast]", msg);
    return;
  }
  if(_isThrottled(msg)) return;

  const type = typeOverride ?? _detectToastType(msg);
  const cfg  = TOAST_TYPES[type] ?? TOAST_TYPES.info;

  Toastify({
    text:      msg,
    duration:  cfg.duration,
    gravity:   "bottom",
    position:  "center",
    stopOnFocus: true,
    className: `gt-toast gt-toast--${type}`,
    style: {
      background:   cfg.bg,
      borderBottom: `2px solid ${cfg.border}`,
    },
    onClick(){},
  }).showToast();
}

// ── Remplacement de showToast global ─────────────────────────────────────────
// Patch dès que possible — avant même que Toastify soit chargé
// (gtToast a un fallback console.warn)
function _patchShowToastWithToastify(){
  // Sauvegarder l'original (utilisé par animations.js)
  const _origShowToast = window.showToast;

  window.showToast = function(msg){
    gtToast(msg);
    // Garder le système d'animations (confetti rareté) qui wrappait showToast
    // animations.js a déjà patché showToast avant nous — on le ré-appelle pas
    // pour éviter la double exécution du flash mythique
  };

  // Exposer pour usage direct
  window.gtToast = gtToast;
}

// ── Init ─────────────────────────────────────────────────────────────────────
// Attendre que le DOM + Toastify soient chargés
function _waitToastify(attempts){
  if(typeof Toastify !== "undefined"){
    _patchShowToastWithToastify();
    console.log("[GT Toasts] Toastify prêt ✓");
    return;
  }
  if(attempts > 20) return; // abandon après 2s
  setTimeout(() => _waitToastify(attempts + 1), 100);
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", () => _waitToastify(0));
} else {
  _waitToastify(0);
}
