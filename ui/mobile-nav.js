// =====================
// NAVIGATION MOBILE
// =====================
(function(){
  const MOBILE_BP = 768;
  function isMobile(){ return window.innerWidth <= MOBILE_BP; }

  let _activeCol = "center";

  // col--left = Diag+Showroom (PC) / Showroom (mobile via CSS)
  // col--center = Atelier
  // "garage" = affiche col--left (diag caché) + col--center ensemble en scroll
  const COL_MAP = {
    "center":   { cols: ["left", "center"] }, // Garage = diag (col-left) + atelier (col-center)
    "showroom": { cols: ["left"]            }, // Showroom seul
    "right":    { cols: ["right"]           },
  };

  function activateCol(colKey){
    if(!isMobile()) return;
    if(colKey === "more"){ toggleMore(); return; }

    _activeCol = colKey;
    closeMore();

    const map = COL_MAP[colKey];
    if(!map) return;

    // Cacher toutes les colonnes
    document.querySelectorAll(".col").forEach(c => c.classList.remove("col--mobile-active"));
    const layout = document.querySelector(".layout");

    // Multi-colonnes (ex: Garage = diag + atelier) → layout en scroll vertical
    if(map.cols.length > 1){
      layout && layout.classList.add("layout--mobile-multi");
      map.cols.forEach(name => {
        const el = document.querySelector(`[data-col="${name}"]`);
        if(el) el.classList.add("col--mobile-active");
      });
    } else {
      layout && layout.classList.remove("layout--mobile-multi");
      const el = document.querySelector(`[data-col="${map.cols[0]}"]`);
      if(el) el.classList.add("col--mobile-active");
    }

    // Remonter en haut de la colonne active
    requestAnimationFrame(() => {
      const col = document.querySelector(".col--mobile-active");
      if(col) col.scrollTop = 0;
    });

    // Màj boutons nav
    document.querySelectorAll(".mobileNav__btn").forEach(btn => {
      const key = btn.dataset.mcol;
      btn.classList.toggle("mobileNav__btn--active", key === colKey);
    });
  }

  // ── Menu "Plus" ──────────────────────────────────────────────
  function toggleMore(){
    const el = document.getElementById("mobileMore");
    if(!el) return;
    const open = el.style.display !== "none";
    open ? closeMore() : openMore();
  }
  function openMore(){
    const el = document.getElementById("mobileMore");
    if(el) el.style.display = "flex";
    const btn = document.querySelector('.mobileNav__btn[data-mcol="more"]');
    if(btn) btn.classList.add("mobileNav__btn--active");
  }
  function closeMore(){
    const el = document.getElementById("mobileMore");
    if(el) el.style.display = "none";
    const btn = document.querySelector('.mobileNav__btn[data-mcol="more"]');
    if(btn) btn.classList.remove("mobileNav__btn--active");
  }

  // ── Synchro notif dots dans menu Plus ────────────────────────
  function syncMoreNotifs(){
    // Prestige
    const p = document.getElementById("prestigeNotifDot");
    const mp = document.getElementById("mobilePrestigeNotif");
    if(p && mp) mp.style.display = p.style.display;
    // Défis
    const c = document.getElementById("challengesNotifDot");
    const mc = document.getElementById("mobileChallengesNotif");
    if(c && mc) mc.style.display = c.style.display;
    // Talents
    const t = document.getElementById("talentNotifDot");
    const mt = document.getElementById("mobileTalentsNotif");
    if(t && mt) mt.style.display = t.style.display;
  }
  window._syncMoreNotifs = syncMoreNotifs;

  // ── Badge showroom ────────────────────────────────────────────
  // Badge alerte sur bouton Bureau quand stock bas
  window._updateMobileBureauAlert = function(){
    const btn = document.querySelector('.mobileNav__btn[data-mcol="right"]');
    if(!btn) return;
    const hasLowStock = typeof state !== "undefined" &&
      state.upgrades?.find(u => u.id === "logiciel_stock")?.lvl >= 1 &&
      Object.values(state.parts ?? {}).some(p => {
        const setting = state.stockSettings?.[p.id];
        if(!setting?.threshold) return false;
        return (p.qty ?? 0) < setting.threshold;
      });
    btn.classList.toggle("mobileNav__btn--bureau-alert", !!hasLowStock);
  };

  window._updateMobileShowroomBadge = function(){
    const btn = document.querySelector('.mobileNav__btn[data-mcol="showroom"]');
    if(!btn) return;
    let dot = btn.querySelector(".mobileNav__dot");
    const count = (typeof state !== "undefined" && state.showroom) ? state.showroom.length : 0;
    if(count > 0){
      if(!dot){ dot = document.createElement("span"); dot.className = "mobileNav__dot"; btn.appendChild(dot); }
      dot.textContent = count;
    } else {
      if(dot) dot.remove();
    }
  };

  // ── Init ──────────────────────────────────────────────────────
  function initMobileNav(){
    const nav = document.getElementById("mobileNav");
    if(!nav) return;

    // Boutons nav
    nav.querySelectorAll(".mobileNav__btn").forEach(btn => {
      btn.addEventListener("click", () => activateCol(btn.dataset.mcol));
    });

    // Backdrop menu Plus
    const backdrop = document.getElementById("mobileMoreBackdrop");
    if(backdrop) backdrop.addEventListener("click", closeMore);

    // Wiring boutons menu Plus → mêmes actions que topbar
    function wire(mobileId, desktopId){
      const mBtn = document.getElementById(mobileId);
      const dBtn = document.getElementById(desktopId);
      if(mBtn && dBtn){
        mBtn.addEventListener("click", () => { closeMore(); dBtn.click(); });
      }
    }
    wire("mobilePrestige",    "btnPrestige");
    wire("mobileChallenges",  "btnChallenges");
    wire("mobileTalents",     "btnTalents");
    wire("mobileAchievements","btnAchievements");
    wire("mobileLeaderboard", "btnLeaderboard");
    wire("mobileStats",       "btnStats");
    wire("mobileHelp",        "btnHelp");

    // Stock : activer col-right + onglet stock
    const mStockBtn = document.getElementById("mobileStock");
    if(mStockBtn){
      mStockBtn.addEventListener("click", () => {
        closeMore();
        if(typeof window.mobileActivateCol === "function") window.mobileActivateCol("right");
        // Activer l'onglet stock dans la col-right
        setTimeout(() => {
          const stockTab = document.querySelector('.tab[data-tab="stock"]');
          if(stockTab) stockTab.click();
        }, 50);
      });
    }

    if(isMobile()) activateCol("center");

    window.addEventListener("resize", () => {
      if(!isMobile()){
        document.querySelectorAll(".col").forEach(c => c.classList.remove("col--mobile-active"));
        document.querySelector(".layout")?.classList.remove("layout--mobile-multi");
        closeMore();
      } else {
        activateCol(_activeCol);
      }
    });

    // Sync notifs périodique
    setInterval(syncMoreNotifs, 1000);

    // ── Swipe gauche/droite entre colonnes ─────────────────────────
    const COL_ORDER = ["center", "showroom", "right"];
    let _touchStartX = 0;
    let _touchStartY = 0;
    document.addEventListener("touchstart", e => {
      _touchStartX = e.touches[0].clientX;
      _touchStartY = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener("touchend", e => {
      if(!isMobile()) return;
      const dx = e.changedTouches[0].clientX - _touchStartX;
      const dy = e.changedTouches[0].clientY - _touchStartY;
      // Swipe horizontal uniquement (pas vertical)
      if(Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.8) return;
      // Ignorer si dans un scroll container horizontal
      const target = e.target.closest('.tabs,.helpModal__tabs,.stockCatFilters,.heritageFilters,.talentTabs,.achievFilters');
      if(target) return;
      const idx = COL_ORDER.indexOf(_activeCol);
      if(dx < 0 && idx < COL_ORDER.length - 1) activateCol(COL_ORDER[idx + 1]); // swipe gauche → suivant
      if(dx > 0 && idx > 0)                    activateCol(COL_ORDER[idx - 1]); // swipe droit → précédent
    }, { passive: true });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", initMobileNav);
  } else {
    initMobileNav();
  }

  window.mobileActivateCol = activateCol;
  window.isMobileView = isMobile;
})();
