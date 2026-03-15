// =====================
// PROFIL
// =====================
const AVATARS = [
  "🔧","🔩","🚗","🏎️","🚙","🛻","🏁","⚙️","🛠️","🔨",
  "🪛","🔋","💨","🔥","⚡","🏆","👑","💎","🤖","🦊",
  "🐺","🦁","🐻","🐯","🦅","🐉","👾","🎮","💀","🌟"
];

// Bannières débloquables — { id, label, bg, condition(state), unlock }
const BANNERS_UNLOCKABLE = [
  // ── Disponibles dès le départ ───────────────────────────────────────────
  { id:"b_default",    label:"Nuit Garage",
    bg:"linear-gradient(135deg,#0a0e1a 0%,#1a2a4a 50%,#0d1829 100%)",
    unlock:"Disponible", cond:()=>true },
  { id:"b_carbon",     label:"Carbone",
    bg:"repeating-linear-gradient(45deg,#111 0px,#111 2px,#1a1a1a 2px,#1a1a1a 8px)",
    unlock:"Disponible", cond:()=>true },
  { id:"b_steel",      label:"Acier",
    bg:"linear-gradient(180deg,#1a1e24 0%,#2a3040 50%,#1a1e24 100%)",
    unlock:"Disponible", cond:()=>true },

  // ── Prestige ─────────────────────────────────────────────────────────────
  { id:"b_p1",         label:"Premier Run",
    bg:"linear-gradient(135deg,#0d1829 0%,#1a2a4a 40%,#1b3a4b 100%)",
    unlock:"Prestige 1", cond:s=>(s.prestigeCount??0)>=1 },
  { id:"b_p5",         label:"Vétéran",
    bg:"linear-gradient(135deg,#0a1a2a 0%,#1b3a4b 40%,#31d6ff18 100%)",
    unlock:"Prestige 5", cond:s=>(s.prestigeCount??0)>=5 },
  { id:"b_p10",        label:"Expert",
    bg:"linear-gradient(135deg,#1a1a3a 0%,#2d1b4e 50%,#a78bfa25 100%)",
    unlock:"Prestige 10", cond:s=>(s.prestigeCount??0)>=10 },
  { id:"b_p25",        label:"Maître",
    bg:"linear-gradient(135deg,#1a0a00 0%,#3a1a00 40%,#ffc83a30 80%,#3a1a00 100%)",
    unlock:"Prestige 25", cond:s=>(s.prestigeCount??0)>=25 },
  { id:"b_p50",        label:"✨ Légende",
    bg:"linear-gradient(90deg,#ff6b35,#ffc83a,#2ee59d,#31d6ff,#a78bfa,#ff6b35)",
    unlock:"Prestige 50", cond:s=>(s.prestigeCount??0)>=50, animated:true },

  // ── Spécialisations ───────────────────────────────────────────────────────
  { id:"b_turbo",      label:"⚡ Atelier Turbo",
    bg:"linear-gradient(135deg,#051525 0%,#0d2a3a 40%,#1b3a4b 70%,#31d6ff28 100%)",
    unlock:"Spéc. Atelier Turbo", cond:s=>s.specialization==="turbo"||s.specialization2==="turbo" },
  { id:"b_prestige_sp",label:"💰 Garage Prestige",
    bg:"linear-gradient(135deg,#1a1000 0%,#2a1e00 40%,#4a3a00 70%,#ffc83a30 100%)",
    unlock:"Spéc. Garage Prestige", cond:s=>s.specialization==="prestige"||s.specialization2==="prestige" },
  { id:"b_diag",       label:"🔍 Diagnostic",
    bg:"linear-gradient(135deg,#051a10 0%,#0a2a1a 40%,#1a3a2a 70%,#2ee59d28 100%)",
    unlock:"Spéc. Centre Diagnostic", cond:s=>s.specialization==="diag"||s.specialization2==="diag" },
  { id:"b_logistique", label:"📦 Logistique",
    bg:"linear-gradient(135deg,#0d0a1e 0%,#1a1530 40%,#2d1b4e 70%,#a78bfa28 100%)",
    unlock:"Spéc. Logistique Pro", cond:s=>s.specialization==="logistique"||s.specialization2==="logistique" },
  { id:"b_rep",        label:"⭐ Réputation",
    bg:"linear-gradient(135deg,#1a0d00 0%,#2a1800 40%,#3a2800 70%,#ff8c4028 100%)",
    unlock:"Spéc. Réputation", cond:s=>s.specialization==="rep"||s.specialization2==="rep" },

  // ── Succès spéciaux ───────────────────────────────────────────────────────
  { id:"b_sss",        label:"🔥 Chasseur SSS+",
    bg:"linear-gradient(135deg,#1a0508 0%,#2a0a10 40%,#4a1020 70%,#ff4d7030 100%)",
    unlock:"Réparer un SSS+", cond:s=>s.bestTier==="SSS+" },
  { id:"b_millionnaire",label:"💎 Millionnaire",
    bg:"linear-gradient(135deg,#050a1a 0%,#0a1530 40%,#1a2540 70%,#31d6ff20 80%,#a78bfa20 100%)",
    unlock:"1 000 000€ en caisse", cond:s=>(s.totalMoneyEarned??0)>=1000000 },
  { id:"b_dualspec",   label:"⚡ Double Expert",
    bg:"linear-gradient(90deg,#051525,#2d1b4e 50%,#051525)",
    unlock:"Double Spécialisation (P40)", cond:s=>s.heritageBonuses?.dualSpec },
  { id:"b_aurora",     label:"🌌 Aurore",
    bg:"linear-gradient(135deg,#020510 0%,#0a0520 30%,#150a35 60%,#0a2030 80%,#050a20 100%)",
    unlock:"100 prestiges", cond:s=>(s.prestigeCount??0)>=100 },
];

function getUnlockedBanners(){
  return BANNERS_UNLOCKABLE.filter(b => b.cond(state));
}

const COUNTRIES = [
  {code:"FR",name:"France"},{code:"BE",name:"Belgique"},{code:"CH",name:"Suisse"},
  {code:"CA",name:"Canada"},{code:"DE",name:"Allemagne"},{code:"ES",name:"Espagne"},
  {code:"IT",name:"Italie"},{code:"PT",name:"Portugal"},{code:"GB",name:"Royaume-Uni"},
  {code:"US",name:"États-Unis"},{code:"JP",name:"Japon"},{code:"BR",name:"Brésil"},
  {code:"MX",name:"Mexique"},{code:"AU",name:"Australie"},{code:"NL",name:"Pays-Bas"},
  {code:"PL",name:"Pologne"},{code:"RU",name:"Russie"},{code:"MA",name:"Maroc"},
  {code:"DZ",name:"Algérie"},{code:"TN",name:"Tunisie"},{code:"OTHER",name:"Autre"},
];

// Génère une image drapeau via flagcdn.com (compatible tous navigateurs/OS)
function flagImg(code){
  if(code === "OTHER") return `<span style="font-size:14px;">🌍</span>`;
  return `<img src="https://flagcdn.com/16x12/${code.toLowerCase()}.png" width="16" height="12" style="border-radius:2px;vertical-align:middle;margin-right:6px;" alt="${code}">`;
}


// ── Cadre avatar selon prestige ──────────────────────────────────────────────
function getAvatarFrame(prestigeCount){
  const p = prestigeCount ?? 0;
  if(p >= 50) return { border:"3px solid transparent", background:"linear-gradient(#0f1628,#0f1628) padding-box, linear-gradient(90deg,#ff6b35,#ffc83a,#2ee59d,#31d6ff,#a78bfa,#ff6b35) border-box", glow:"0 0 16px rgba(255,200,58,.5)", animated:true };
  if(p >= 25) return { border:"3px solid #ffc83a", glow:"0 0 12px rgba(255,200,58,.4)", animated:false };
  if(p >= 10) return { border:"3px solid #a78bfa", glow:"0 0 10px rgba(167,139,250,.35)", animated:false };
  if(p >= 5)  return { border:"3px solid #31d6ff", glow:"0 0 8px rgba(49,214,255,.3)", animated:false };
  if(p >= 1)  return { border:"3px solid rgba(255,255,255,.25)", glow:"none", animated:false };
  return { border:"3px solid rgba(255,255,255,.1)", glow:"none", animated:false };
}

// ── Titre selon prestige ──────────────────────────────────────────────────────
function getPrestigeTitle(prestigeCount){
  const p = prestigeCount ?? 0;
  if(p >= 50) return { label:"👑 LÉGENDE",       color:"#ffc83a" };
  if(p >= 25) return { label:"🏆 Maître",         color:"#ffc83a" };
  if(p >= 10) return { label:"⭐ Expert",          color:"#a78bfa" };
  if(p >= 5)  return { label:"🔧 Vétéran",        color:"#31d6ff" };
  if(p >= 1)  return { label:"🔁 Prestige "+p,    color:"rgba(255,255,255,.6)" };
  return null;
}

// ── Badge spécialisation ──────────────────────────────────────────────────────
function getSpecBadgeHtml(){
  const sp  = typeof getSpecialization === "function" ? getSpecialization(state.specialization) : null;
  const sp2 = state.heritageBonuses?.dualSpec ? (typeof getSpecialization === "function" ? getSpecialization(state.specialization2) : null) : null;
  if(!sp) return "";
  const badge = (s) => `<span class="profileCard__specBadge" style="border-color:${s.color}22;background:${s.color}11;color:${s.color}">${s.icon} ${s.name}</span>`;
  return `<div class="profileCard__specs">${badge(sp)}${sp2 ? badge(sp2) : ""}</div>`;
}

// ── Stats clés publiques ──────────────────────────────────────────────────────
function getProfileStatsHtml(){
  const p = state.prestigeCount ?? 0;
  const achCount = Object.values(state.achievements ?? {}).filter(Boolean).length;
  const totalAch = typeof ACHIEVEMENTS !== "undefined" ? ACHIEVEMENTS.length : "?";
  const tierOrder = ["F","E","D","C","B","A","S","SS","SSS","SSS+"];
  const bestTierLabel = state.bestTier ?? "—";
  const tierIdx = tierOrder.indexOf(bestTierLabel);
  const tierColor = tierIdx >= 7 ? "#ff4d70" : tierIdx >= 5 ? "#ffc83a" : tierIdx >= 3 ? "#a78bfa" : "rgba(255,255,255,.5)";

  return `
  <div class="profileCard__stats">
    <div class="profileCard__stat">
      <span class="profileCard__statVal">${p}</span>
      <span class="profileCard__statLabel">Prestiges</span>
    </div>
    <div class="profileCard__stat">
      <span class="profileCard__statVal" style="color:${tierColor}">${bestTierLabel}</span>
      <span class="profileCard__statLabel">Meilleur tier</span>
    </div>
    <div class="profileCard__stat">
      <span class="profileCard__statVal">${(state.totalCarsSold ?? 0).toLocaleString("fr-FR")}</span>
      <span class="profileCard__statLabel">Véhicules vendus</span>
    </div>
    <div class="profileCard__stat">
      <span class="profileCard__statVal">${(state.repMax ?? state.rep ?? 0).toLocaleString("fr-FR")}</span>
      <span class="profileCard__statLabel">REP max</span>
    </div>
    <div class="profileCard__stat">
      <span class="profileCard__statVal">${(state.totalRepairs ?? 0).toLocaleString("fr-FR")}</span>
      <span class="profileCard__statLabel">Réparations</span>
    </div>
    <div class="profileCard__stat">
      <span class="profileCard__statVal">${achCount} / ${totalAch}</span>
      <span class="profileCard__statLabel">Succès</span>
    </div>
  </div>`;
}

let selectedAvatar = null;
let selectedBanner = null;
let selectedTitle  = null;

function openProfileModal(){
  const modal = document.getElementById("profileModal");
  if(!modal) return;

  // Pré-remplir depuis state.profile
  const p = state.profile || {};
  selectedAvatar = p.avatar || "🔧";
  selectedBanner = p.banner || "#1a2a4a";
  selectedTitle  = p.title  || null;

  document.getElementById("profilePseudo").value = p.pseudo || "";

  // Remplir pays — le select natif ne supporte pas le HTML, on utilise un select custom simple
  const sel = document.getElementById("profileCountry");
  sel.innerHTML = COUNTRIES.map(c =>
    `<option value="${c.code}" ${c.code === (p.country||"FR") ? "selected" : ""}>${c.name}</option>`
  ).join("");

  // Remplir avatars
  const grid = document.getElementById("avatarGrid");
  grid.innerHTML = AVATARS.map(a =>
    `<div class="avatarOption${a === selectedAvatar ? " avatarOption--selected" : ""}" data-avatar="${a}">${a}</div>`
  ).join("");

  grid.querySelectorAll(".avatarOption").forEach(el => {
    el.addEventListener("click", () => {
      selectedAvatar = el.dataset.avatar;
      grid.querySelectorAll(".avatarOption").forEach(x => x.classList.remove("avatarOption--selected"));
      el.classList.add("avatarOption--selected");
      updateProfilePreview();
    });
  });

  // Remplir bannières débloquées
  const picker = document.getElementById("bannerPicker");
  const unlocked = getUnlockedBanners();
  // Afficher toutes les bannières — débloquées sélectionnables, verrouillées grisées
  const allBanners   = BANNERS_UNLOCKABLE;
  const unlockedIds  = new Set(unlocked.map(b => b.id));
  picker.innerHTML = allBanners.map(b => {
    const isUnlocked = unlockedIds.has(b.id);
    const isSelected = b.bg === selectedBanner && isUnlocked;
    return `<div class="bannerOption${isSelected ? ' bannerOption--selected' : ''} ${b.animated ? 'bannerOption--animated' : ''} ${!isUnlocked ? 'bannerOption--locked' : ''}"
          data-banner="${isUnlocked ? b.bg : ''}"
          title="${b.label}${!isUnlocked ? ' — 🔒 '+b.unlock : ''}"
          style="background:${b.bg}">
      <span class="bannerOption__label">${isUnlocked ? b.label : '🔒 '+b.label}</span>
    </div>`;
  }).join("");

  picker.querySelectorAll(".bannerOption:not(.bannerOption--locked)").forEach(el => {
    el.addEventListener("click", () => {
      selectedBanner = el.dataset.banner;
      picker.querySelectorAll(".bannerOption").forEach(x => x.classList.remove("bannerOption--selected"));
      el.classList.add("bannerOption--selected");
      updateProfilePreview();
    });
  });

  // Titres débloquables
  const titlePicker = document.getElementById("titlePicker");
  if(titlePicker && typeof getUnlockedTitles === "function"){
    const unlockedTitles = getUnlockedTitles();
    if(unlockedTitles.length === 0){
      titlePicker.innerHTML = `<div class="titleOption__empty">Aucun titre débloqué pour l'instant.</div>`;
    } else {
      titlePicker.innerHTML = [
        `<div class="titleOption titleOption--none${!selectedTitle ? ' titleOption--selected' : ''}" data-title="">
          <span style="color:rgba(255,255,255,.3);font-size:12px">Aucun titre</span>
        </div>`,
        ...unlockedTitles.map(t =>
          `<div class="titleOption${selectedTitle===t.id ? ' titleOption--selected' : ''}"
                data-title="${t.id}" style="--tc:${t.color}">
            <span class="titleOption__label" style="color:${t.color}">${t.label}</span>
            <span class="titleOption__desc">${t.desc}</span>
          </div>`
        )
      ].join("");
      titlePicker.querySelectorAll(".titleOption").forEach(el => {
        el.addEventListener("click", () => {
          selectedTitle = el.dataset.title || null;
          titlePicker.querySelectorAll(".titleOption").forEach(x => x.classList.remove("titleOption--selected"));
          el.classList.add("titleOption--selected");
          updateProfilePreview();
        });
      });
    }
  }

  updateProfilePreview();
  modal.style.display = "flex";
}

function updateProfilePreview(){
  const pseudo      = document.getElementById("profilePseudo")?.value || "Mécanicien";
  const country     = document.getElementById("profileCountry")?.value || "FR";
  const countryData = COUNTRIES.find(c => c.code === country);
  const p           = state.prestigeCount ?? 0;
  const frame       = getAvatarFrame(p);
  const title       = getPrestigeTitle(p);

  // Bannière
  const bannerEl = document.getElementById("previewBanner");
  if(bannerEl){
    bannerEl.style.background = selectedBanner || "#1a2a4a";
    bannerEl.className = "profileCard__banner" + (p >= 50 ? " profileCard__banner--animated" : "");
  }

  // Avatar — cadre selon prestige
  const avatarEl = document.getElementById("previewAvatar");
  if(avatarEl){
    avatarEl.textContent = selectedAvatar || "🔧";
    avatarEl.style.border      = frame.border;
    avatarEl.style.boxShadow   = frame.glow !== "none" ? frame.glow : "";
    avatarEl.style.background  = frame.background ?? "rgba(15,22,40,1)";
    avatarEl.className = "profileCard__avatar" + (frame.animated ? " profileCard__avatar--animated" : "");
  }

  // Pseudo + titre
  const pseudoEl = document.getElementById("previewPseudo");
  if(pseudoEl) pseudoEl.textContent = pseudo || "Mécanicien";

  // Titre — custom si sélectionné, sinon titre prestige automatique
  const titleEl = document.getElementById("previewTitle");
  if(titleEl){
    const customTitle = selectedTitle && typeof getTitleById==="function" ? getTitleById(selectedTitle) : null;
    const displayTitle = customTitle || title;
    if(displayTitle){
      const isGradient = displayTitle.color === "linear" || displayTitle.color?.includes("gradient");
      const style = isGradient
        ? `background:linear-gradient(90deg,#ff6b35,#ffc83a,#2ee59d,#31d6ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-size:11px;font-weight:800`
        : `color:${displayTitle.color};font-size:11px;font-weight:800`;
      titleEl.innerHTML = `<span style="${style}">${displayTitle.label}</span>`;
    } else {
      titleEl.innerHTML = "";
    }
  }

  // Pays
  const previewCountryEl = document.getElementById("previewCountry");
  if(previewCountryEl){
    previewCountryEl.innerHTML = countryData ? `${flagImg(countryData.code)}${countryData.name}` : "";
  }

  // Badge spécialisation
  const specEl = document.getElementById("previewSpec");
  if(specEl) specEl.innerHTML = getSpecBadgeHtml();

  // Stats clés
  const statsEl = document.getElementById("previewStats");
  if(statsEl) statsEl.innerHTML = getProfileStatsHtml();
}

function saveProfile(){
  const pseudo   = document.getElementById("profilePseudo")?.value.trim() || "Mécanicien";
  const country  = document.getElementById("profileCountry")?.value || "FR";

  state.profile = {
    pseudo:  pseudo.substring(0, 20),
    avatar:  selectedAvatar || "🔧",
    country: country,
    banner:  selectedBanner || "#1a2a4a",
    title:   selectedTitle  || null,
  };

  updateTopbarProfile();
  save();
  document.getElementById("profileModal").style.display = "none";
  showSaveIndicator("✅ Profil sauvegardé");
}

// Listeners profil
const btnProfile = document.getElementById("btnProfile");
if(btnProfile) btnProfile.addEventListener("click", openProfileModal);

const btnProfileClose = document.getElementById("btnProfileClose");
if(btnProfileClose) btnProfileClose.addEventListener("click", () => {
  document.getElementById("profileModal").style.display = "none";
});

const profileBackdrop = document.getElementById("profileBackdrop");
if(profileBackdrop) profileBackdrop.addEventListener("click", () => {
  document.getElementById("profileModal").style.display = "none";
});

const btnProfileSave = document.getElementById("btnProfileSave");
if(btnProfileSave) btnProfileSave.addEventListener("click", saveProfile);

// Déconnexion — bouton dans la modale profil
const btnLogout = document.getElementById("btnLogout");
if(btnLogout) btnLogout.addEventListener("click", () => {
  document.getElementById("profileModal").style.display = "none";
  _supa.auth.signOut();
});

// Mise à jour preview en temps réel sur frappe pseudo
document.getElementById("profilePseudo")?.addEventListener("input", updateProfilePreview);
document.getElementById("profileCountry")?.addEventListener("change", updateProfilePreview);



