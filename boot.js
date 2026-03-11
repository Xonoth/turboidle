// =====================
// SUPABASE AUTH + CLOUD SAVE
// =====================

const SUPABASE_URL      = "https://ydruyvfusnrekfllocqq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcnV5dmZ1c25yZWtmbGxvY3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2ODE3MDIsImV4cCI6MjA4ODI1NzcwMn0.dgwUXXNHzg0oyQdcnaJNkrIo6S63d6Dw-BDmWqhwS7w";

// createClient sans navigator.locks — évite les AbortError / lock not released
// quand plusieurs onglets ou rechargements rapides se marchent dessus.
const _supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    lock: async (_name, _acquireTimeout, fn) => fn(), // bypass lock inter-onglets
    persistSession:     true,   // session stockée localement (pas la progression)
    detectSessionInUrl: true,
    storageKey:         "garage-turbo-auth",
  }
});

// ─── INSTANCIATION DE SAVSERVICE ──────────────────────────────────────────
// _saveService est l'unique point d'entrée pour load/save de progression.
// Pour passer à Steam : new SaveService(new SteamSaveRepository(greenworks))
const _saveRepo    = new SupabaseSaveRepository(_supa);
const _saveService = new SaveService(_saveRepo);


// ─── FLAGS DE CONCURRENCE ─────────────────────────────────────────────
let currentUser      = null;
let _authReady       = false;  // true dès que SaveService.load() a terminé (succès ou erreur)
let _initialLoadDone = false;  // empêche un double load INITIAL_SESSION + SIGNED_IN

// ─── SAVE ARCHITECTURE ────────────────────────────────────────────────────
// SaveSnapshot + SaveRepository + SaveService sont définis dans les sections
// ci-dessous. L'instance globale _saveService est créée après _supa.

// ─── save() — point d'entrée manuel + beforeunload ────────────────────────
// Appellé par doPrestige(), saveProfile(), beforeunload, visibilitychange.
// Délègue à SaveService — ne touche plus _supa directement.
function save() {
  if(!currentUser) return;
  state._hasSaved = true;
  _saveService.save(currentUser.id);
}

// ─── AUTH STATE MACHINE ──────────────────────────────────────────────────────
// Règles :
// • INITIAL_SESSION  → premier événement au chargement (utilisateur déjà connecté ou non)
// • SIGNED_IN        → connexion manuelle (ou refresh de token)
// • SIGNED_OUT       → déconnexion
//
// On évite d'appeler cloudLoad dans le callback directement avec await car le SDK
// gotrue peut se retrouver à attendre la fin du callback pour relâcher son lock interne.
// Solution : on déclenche cloudLoad via setTimeout(0) pour sortir du callstack du SDK.
_supa.auth.onAuthStateChange((event, session) => {
  dbg("[auth] event:", event, "user:", session?.user?.id ?? "null");
  currentUser = session?.user ?? null;
  updateAuthUI();

  if(event === "INITIAL_SESSION"){
    if(currentUser){
      // Session existante au chargement → charger la progression
      hideLoginWall();
      if(!_initialLoadDone){
        _initialLoadDone = true;
        setTimeout(() => _saveService.load(currentUser.id).then(() => { _authReady = true; }), 0);
      }
    } else {
      // Pas de session → bloquer le jeu
      _authReady = false;
      showLoginWall();
    }
    return;
  }

  if(event === "SIGNED_IN"){
    if(!_initialLoadDone){
      // Connexion manuelle (pas un refresh de token après INITIAL_SESSION)
      _initialLoadDone = true;
      hideLoginWall();
      setTimeout(() => _saveService.load(currentUser.id).then(() => { _authReady = true; }), 0);
    }
    // Si _initialLoadDone est déjà true, c'est un refresh de token silencieux → ignorer
    return;
  }

  if(event === "SIGNED_OUT"){
    _authReady       = false;
    _initialLoadDone = false;
    _saveService.reset();
    currentUser      = null;
    updateAuthUI();
    showLoginWall();
    return;
  }
});

// ─── FALLBACK : si onAuthStateChange ne se déclenche pas dans les 6s ─────────
// (réseau coupé, Supabase totalement KO)
setTimeout(() => {
  if(!_authReady && !currentUser){
    dbg("[init] auth timeout — affichage login wall");
    showLoginWall();
  }
}, 6000);

// btnSave supprimé du header
const btnAuth = document.getElementById("btnAuth");
if(btnAuth) btnAuth.addEventListener("click", openAuth);

const btnAchievements = document.getElementById("btnAchievements");
if(btnAchievements) btnAchievements.addEventListener("click", openAchievementsModal);

const btnAchievementsClose = document.getElementById("btnAchievementsClose");
if(btnAchievementsClose) btnAchievementsClose.addEventListener("click", closeAchievementsModal);

const achievementsBackdrop = document.getElementById("achievementsBackdrop");
if(achievementsBackdrop) achievementsBackdrop.addEventListener("click", closeAchievementsModal);

// init
requestAnimationFrame(tick);
// LocalSave interval supprimé — cloud only
setInterval(() => { if(_authReady && currentUser) _saveService.save(currentUser.id); }, CONFIG.CLOUD_SAVE_INTERVAL);
setInterval(() => { if(currentUser) pushLeaderboard(); }, CONFIG.LB_PUSH_INTERVAL);

// Sauvegarde d'urgence à la fermeture de page (persist savedAt pour le catchup au reload)
window.addEventListener("beforeunload", () => { save(); });

// Évite le spike de dt quand l'onglet redevient visible après une longue absence
document.addEventListener("visibilitychange", () => {
  if(document.visibilityState === "hidden"){
    // Enregistre l'heure de départ en arrière-plan
    last = performance.now();
    save();
  } else {
    // Retour sur l'onglet : calculer le temps écoulé et l'appliquer
    const now = performance.now();
    const offlineSec = (now - last) / 1000;

    if(offlineSec > 2){
      // Plafond : max 4h de progression offline (évite les abus)
      const catchup = Math.min(offlineSec, 4 * 3600);

      // Appliquer en plusieurs petits ticks pour ne pas saturer la logique
      const STEP = 30; // chunks de 30s
      let remaining = catchup;
      _isOfflineCatchup = true;
      try {
        while(remaining > 0){
          const dt = Math.min(remaining, STEP);
          applyTickLogic(dt);
          remaining -= dt;
        }
      } finally {
        _isOfflineCatchup = false;
      }

      // Notif si gain significatif
      if(catchup >= 60){
        const mins = Math.floor(catchup / 60);
        showToast(`⏱️ Progression hors-ligne : ${mins} min rattrapées`);
      }

      renderAll(true, true);
      if(typeof initChallenges === 'function') initChallenges();
    }

    last = now;
  }
});

// Fallback auth timeout — affiche le login wall si Supabase ne répond pas
setTimeout(() => {
  if(!_authReady && !currentUser){
    dbg("[init] auth timeout — affichage login wall");
    showLoginWall();
  }
}, 5000);

