// =====================
// PROFIL
// =====================
const AVATARS = [
  "🔧","🔩","🚗","🏎️","🚙","🛻","🏁","⚙️","🛠️","🔨",
  "🪛","🔋","💨","🔥","⚡","🏆","👑","💎","🤖","🦊",
  "🐺","🦁","🐻","🐯","🦅","🐉","👾","🎮","💀","🌟"
];

const BANNERS = [
  "#1a2a4a","#0d2137","#1a1a2e","#16213e",
  "#2d1b4e","#1b3a4b","#1a3a2a","#3a1a1a",
  "#2a1a3a","#3a2a1a","#1a3a3a","#0a0a0a",
  "linear-gradient(135deg,#1a2a4a,#2d1b4e)",
  "linear-gradient(135deg,#1b3a4b,#1a3a2a)",
  "linear-gradient(135deg,#3a1a1a,#3a2a1a)",
  "linear-gradient(135deg,#0d1829,#1a2a1a)",
];

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

let selectedAvatar = null;
let selectedBanner = null;

function openProfileModal(){
  const modal = document.getElementById("profileModal");
  if(!modal) return;

  // Pré-remplir depuis state.profile
  const p = state.profile || {};
  selectedAvatar = p.avatar || "🔧";
  selectedBanner = p.banner || "#1a2a4a";

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

  // Remplir bannières
  const picker = document.getElementById("bannerPicker");
  picker.innerHTML = BANNERS.map((b,i) =>
    `<div class="bannerOption${b === selectedBanner ? " bannerOption--selected" : ""}" data-banner="${b}" style="background:${b}"></div>`
  ).join("");

  picker.querySelectorAll(".bannerOption").forEach(el => {
    el.addEventListener("click", () => {
      selectedBanner = el.dataset.banner;
      picker.querySelectorAll(".bannerOption").forEach(x => x.classList.remove("bannerOption--selected"));
      el.classList.add("bannerOption--selected");
      updateProfilePreview();
    });
  });

  updateProfilePreview();
  modal.style.display = "flex";
}

function updateProfilePreview(){
  const pseudo  = document.getElementById("profilePseudo")?.value || "Mécanicien";
  const country = document.getElementById("profileCountry")?.value || "FR";
  const countryData = COUNTRIES.find(c => c.code === country);

  document.getElementById("previewBanner").style.background = selectedBanner || "#1a2a4a";
  document.getElementById("previewAvatar").textContent = selectedAvatar || "🔧";
  document.getElementById("previewPseudo").textContent  = pseudo || "Mécanicien";
  const previewCountryEl = document.getElementById("previewCountry");
  if(previewCountryEl){
    previewCountryEl.innerHTML = countryData
      ? `${flagImg(countryData.code)}${countryData.name}`
      : "";
  }
}

function saveProfile(){
  const pseudo   = document.getElementById("profilePseudo")?.value.trim() || "Mécanicien";
  const country  = document.getElementById("profileCountry")?.value || "FR";

  state.profile = {
    pseudo:  pseudo.substring(0, 20),
    avatar:  selectedAvatar || "🔧",
    country: country,
    banner:  selectedBanner || "#1a2a4a",
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



