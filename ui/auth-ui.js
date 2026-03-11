// ─── AUTH UI HELPERS ───────────────────────────────────────────────────────────
// Définies AVANT createClient car onAuthStateChange les appelle immédiatement.
function updateAuthUI(){
  const btnAuth    = document.getElementById("btnAuth");
  const btnProfile = document.getElementById("btnProfile");
  if(!btnAuth) return;
  if(currentUser){
    btnAuth.style.display = "none";
    if(btnProfile) btnProfile.style.display = "flex";
    updateTopbarProfile();
  } else {
    btnAuth.style.display = "flex";
    if(btnProfile) btnProfile.style.display = "none";
  }
}

function updateTopbarProfile(){
  const avatarEl = document.getElementById("topbarAvatar");
  const pseudoEl = document.getElementById("topbarPseudo");
  if(avatarEl) avatarEl.textContent = state.profile?.avatar || "🔧";
  if(pseudoEl) pseudoEl.textContent = state.profile?.pseudo || "M\xe9canicien";
}

function openAuth(){
  if(currentUser){ _supa.auth.signOut(); return; }
  const modal = document.getElementById("supaAuthModal");
  if(modal){
    modal.style.zIndex = "10000"; // au-dessus du login wall (z-index:9999)
    modal.style.display = "flex";
    switchAuthView("login");
    document.getElementById("supaAuthEmail")?.focus();
  }
}

// ─── LOGIN WALL ─────────────────────────────────────────────────────────────────────
function showLoginWall(){
  let wall = document.getElementById("loginWall");
  if(!wall){
    wall = document.createElement("div");
    wall.id = "loginWall";
    wall.style.cssText = [
      "position:fixed","inset:0","z-index:9999",
      "background:rgba(10,10,20,0.96)",
      "display:flex","flex-direction:column",
      "align-items:center","justify-content:center","gap:20px",
      "font-family:inherit"
    ].join(";");
    wall.innerHTML = `
      <div style="font-size:3rem">🏎️</div>
      <div style="font-size:1.5rem;font-weight:700;color:#fff">Garage Turbo</div>
      <div style="color:#aaa;font-size:0.95rem;text-align:center;max-width:280px">
        Connecte-toi pour jouer et sauvegarder ta progression dans le cloud.
      </div>
      <button id="loginWallBtn" style="
        margin-top:8px;padding:12px 32px;border:none;border-radius:10px;
        background:linear-gradient(135deg,#ffc832,#ff8c00);
        color:#111;font-weight:700;font-size:1rem;cursor:pointer;
      ">🔑 Se connecter / S\'inscrire</button>
    `;
    document.body.appendChild(wall);
    wall.querySelector("#loginWallBtn").addEventListener("click", openAuth);
  }
  wall.style.display = "flex";
}

function hideLoginWall(){
  const wall = document.getElementById("loginWall");
  if(wall) wall.style.display = "none";
}

// ─── SAVE INDICATOR ─────────────────────────────────────────────────────────────
function showSaveIndicator(msg){
  const btn = document.getElementById("btnSave");
  if(!btn) return;
  const orig = btn.textContent;
  btn.textContent = msg;
  setTimeout(() => btn.textContent = orig, 2500);
}

// ─── LOCAL SAVE/LOAD : DÉSACTIVÉS (cloud-only) ───────────────────────────────────────
function localSave(){ /* cloud-only — intentionnellement vide */ }
function localLoad(){ /* cloud-only — intentionnellement vide */ }
// =====================
// AUTH MODAL — connexion / inscription
// =====================

function switchAuthView(view){
  const loginView  = document.getElementById("authViewLogin");
  const signupView = document.getElementById("authViewSignup");
  const slider     = document.getElementById("authToggleSlider");
  const btns       = document.querySelectorAll(".authToggle__btn");
  const msgEl      = document.getElementById("supaAuthMsg");

  if(loginView)  loginView.style.display  = view === "login"  ? "flex" : "none";
  if(signupView) signupView.style.display = view === "signup" ? "flex" : "none";

  btns.forEach(b => b.classList.toggle("authToggle__btn--active", b.dataset.view === view));
  if(slider) slider.classList.toggle("authToggle__slider--right", view === "signup");
  if(msgEl){ msgEl.textContent = ""; msgEl.className = "authMsg"; }
}

function setAuthMsg(msg, type = ""){
  const el = document.getElementById("supaAuthMsg");
  if(!el) return;
  el.textContent = msg;
  el.className   = "authMsg" + (type ? ` authMsg--${type}` : "");
}

function checkPwdStrength(pwd){
  const fill  = document.getElementById("pwdStrengthFill");
  const label = document.getElementById("pwdStrengthLabel");
  if(!fill || !label) return;
  let score = 0;
  if(pwd.length >= 6)          score++;
  if(pwd.length >= 10)         score++;
  if(/[A-Z]/.test(pwd))       score++;
  if(/[0-9]/.test(pwd))       score++;
  if(/[^A-Za-z0-9]/.test(pwd)) score++;
  const levels = [
    { w:"0%",   c:"transparent", t:"" },
    { w:"25%",  c:"#ff4444",     t:"Très faible" },
    { w:"45%",  c:"#ff8c00",     t:"Faible" },
    { w:"65%",  c:"#ffc832",     t:"Moyen" },
    { w:"85%",  c:"#4ade80",     t:"Fort" },
    { w:"100%", c:"#31d6ff",     t:"Très fort 🔥" },
  ];
  const lvl = levels[Math.min(score, 5)];
  fill.style.width      = lvl.w;
  fill.style.background = lvl.c;
  label.textContent     = lvl.t;
  label.style.color     = lvl.c;
}

async function supaAuthSubmit(mode){
  if(mode === "login"){
    const email = document.getElementById("supaAuthEmail")?.value?.trim();
    const pwd   = document.getElementById("supaAuthPwd")?.value;
    if(!email || !pwd){ setAuthMsg("Email et mot de passe requis.", "error"); return; }
    setAuthMsg("⏳ Connexion…");
    const { error } = await _supa.auth.signInWithPassword({ email, password: pwd });
    if(error){ setAuthMsg("❌ " + error.message, "error"); return; }
    document.getElementById("supaAuthModal").style.display = "none";
    setAuthMsg("");
  } else {
    const pseudo = document.getElementById("signupPseudo")?.value?.trim();
    const email  = document.getElementById("signupEmail")?.value?.trim();
    const pwd    = document.getElementById("signupPwd")?.value;
    const pwdC   = document.getElementById("signupPwdConfirm")?.value;
    if(!pseudo)        { setAuthMsg("Pseudo requis.",                  "error"); return; }
    if(!email || !pwd) { setAuthMsg("Email et mot de passe requis.",   "error"); return; }
    if(pwd !== pwdC)   { setAuthMsg("Les mots de passe ne correspondent pas.", "error"); return; }
    if(pwd.length < 6) { setAuthMsg("Mot de passe trop court (min 6 caractères).", "error"); return; }
    setAuthMsg("⏳ Création du compte…");
    const { error } = await _supa.auth.signUp({
      email, password: pwd,
      options: { data: { pseudo: pseudo.substring(0, 20) } }
    });
    if(error){ setAuthMsg("❌ " + error.message, "error"); return; }
    // Pré-remplir le pseudo depuis l'inscription
    state.profile.pseudo = pseudo.substring(0, 20);
    document.getElementById("supaAuthModal").style.display = "none";
    setAuthMsg("");
    showToast("✅ Compte créé ! Vérifie ton email si demandé.");
  }
}

async function supaResetPassword(){
  const email = document.getElementById("supaAuthEmail")?.value?.trim();
  if(!email){ setAuthMsg("Entre ton email d'abord.", "error"); return; }
  setAuthMsg("⏳ Envoi du lien…");
  const { error } = await _supa.auth.resetPasswordForEmail(email);
  if(error){ setAuthMsg("❌ " + error.message, "error"); return; }
  setAuthMsg("✅ Lien envoyé ! Vérifie ta boîte mail.", "success");
}

// ─── Listeners modale auth ────────────────────────────────────────────────────
document.getElementById("supaAuthClose")?.addEventListener("click", () => {
  document.getElementById("supaAuthModal").style.display = "none";
});
document.getElementById("supaAuthBackdrop")?.addEventListener("click", () => {
  document.getElementById("supaAuthModal").style.display = "none";
});
document.getElementById("supaAuthBtnLogin")?.addEventListener("click",  () => supaAuthSubmit("login"));
document.getElementById("supaAuthBtnSignup")?.addEventListener("click", () => supaAuthSubmit("signup"));
document.getElementById("supaAuthBtnReset")?.addEventListener("click",  supaResetPassword);

// Enter pour se connecter
document.getElementById("supaAuthPwd")?.addEventListener("keydown", (e) => {
  if(e.key === "Enter") supaAuthSubmit("login");
});
document.getElementById("supaAuthEmail")?.addEventListener("keydown", (e) => {
  if(e.key === "Enter") supaAuthSubmit("login");
});

// Toggle afficher/masquer mot de passe
document.getElementById("togglePwdLogin")?.addEventListener("click", () => {
  const input = document.getElementById("supaAuthPwd");
  if(!input) return;
  input.type = input.type === "password" ? "text" : "password";
});
document.getElementById("togglePwdSignup")?.addEventListener("click", () => {
  const input = document.getElementById("signupPwd");
  if(!input) return;
  input.type = input.type === "password" ? "text" : "password";
});

// Indicateur force du mot de passe à l'inscription
document.getElementById("signupPwd")?.addEventListener("input", (e) => {
  checkPwdStrength(e.target.value);
});

// Switch Connexion / Inscription via les onglets
document.getElementById("authToggle")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".authToggle__btn");
  if(btn?.dataset?.view) switchAuthView(btn.dataset.view);
});

