// =====================================================================
// GARAGE TURBO — ANIMATIONS
// GSAP + canvas-confetti + micro-animations
// Chargé après tous les autres scripts
// =====================================================================

// ── 1. Chargement GSAP depuis CDN ────────────────────────────────────────────
(function loadGSAP(){
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
  s.onload = () => { window._gsapReady = true; initGSAPAnimations(); };
  document.head.appendChild(s);
})();

// ── 2. Compteur argent animé (odometer) ──────────────────────────────────────
let _moneyDisplayed  = 0;
let _moneyTarget     = 0;
let _moneyTween      = null;

function animateMoneyCounter(target){
  if(!window._gsapReady || !window.gsap) return;
  if(Math.abs(target - _moneyDisplayed) < 0.5) return;
  _moneyTarget = target;
  if(_moneyTween) _moneyTween.kill();
  _moneyTween = gsap.to({ val: _moneyDisplayed }, {
    val: target,
    duration: 0.35,
    ease: "power2.out",
    onUpdate: function(){
      _moneyDisplayed = this.targets()[0].val;
      const el = document.getElementById("money");
      if(el) el.textContent = formatMoney(_moneyDisplayed);
    },
    onComplete: function(){
      _moneyDisplayed = target;
    }
  });
}

// Hook sur le rendu du topbar — intercepter la mise à jour de l'argent
const _origRenderTop = window.renderTop;
function _patchRenderTop(){
  if(typeof renderTop !== "function") return;
  const orig = renderTop;
  window.renderTop = function(){
    orig();
    if(window._gsapReady && state?.money !== undefined){
      animateMoneyCounter(state.money);
    }
  };
}

// ── 3. Animation d'entrée des slots atelier (GSAP) ───────────────────────────
function animateSlotEnter(slotEl){
  if(!window._gsapReady || !slotEl) return;
  gsap.fromTo(slotEl,
    { x: -18, opacity: 0, scale: 0.96 },
    { x: 0,   opacity: 1, scale: 1, duration: 0.32, ease: "back.out(1.4)" }
  );
}

function animateSlotComplete(slotEl){
  if(!window._gsapReady || !slotEl) return;
  gsap.fromTo(slotEl,
    { scale: 1 },
    { scale: 1.025, duration: 0.12, ease: "power2.out",
      yoyo: true, repeat: 1,
      onComplete: () => gsap.set(slotEl, { clearProps: "scale" })
    }
  );
}

// ── 4. Animation sItem showroom (entrée) ─────────────────────────────────────
function animateSItemEnter(el){
  if(!window._gsapReady || !el) return;
  gsap.fromTo(el,
    { y: -10, opacity: 0 },
    { y: 0,   opacity: 1, duration: 0.28, ease: "power2.out" }
  );
}

// ── 5. Confetti — Légendaire ──────────────────────────────────────────────────
function burstLegendary(originEl){
  if(typeof confetti === "undefined") return;
  const rect = originEl?.getBoundingClientRect?.() ?? { left: window.innerWidth/2, top: window.innerHeight/2, width:0, height:0 };
  const x = (rect.left + rect.width/2)  / window.innerWidth;
  const y = (rect.top  + rect.height/2) / window.innerHeight;
  confetti({
    particleCount: 60,
    spread: 70,
    startVelocity: 28,
    origin: { x, y },
    colors: ["#ffc83a","#ffd700","#ffec80","#ffe066","#fff3b0"],
    scalar: 1.1,
    ticks: 160,
  });
  // 2e burst décalé
  setTimeout(() => confetti({
    particleCount: 30,
    spread: 50,
    startVelocity: 18,
    origin: { x, y: y + 0.04 },
    colors: ["#ffc83a","#ff9500","#ffd700"],
    scalar: 0.9,
    ticks: 120,
  }), 180);
}

// ── 6. Confetti — Mythique ────────────────────────────────────────────────────
function burstMythic(originEl){
  if(typeof confetti === "undefined") return;
  const rect = originEl?.getBoundingClientRect?.() ?? { left: window.innerWidth/2, top: window.innerHeight/2, width:0, height:0 };
  const x = (rect.left + rect.width/2)  / window.innerWidth;
  const y = (rect.top  + rect.height/2) / window.innerHeight;
  // Burst principal rouge/rose
  confetti({
    particleCount: 90,
    spread: 100,
    startVelocity: 35,
    origin: { x, y },
    colors: ["#ff4d70","#ff7b9b","#ff1a4e","#ff6bff","#c0005a"],
    scalar: 1.2,
    ticks: 220,
  });
  // Burst latéral gauche
  setTimeout(() => confetti({
    particleCount: 35,
    angle: 120,
    spread: 55,
    startVelocity: 25,
    origin: { x: x - 0.1, y },
    colors: ["#ff4d70","#ff2060","#9b0030"],
    scalar: 0.85,
    ticks: 160,
  }), 100);
  // Burst latéral droit
  setTimeout(() => confetti({
    particleCount: 35,
    angle: 60,
    spread: 55,
    startVelocity: 25,
    origin: { x: x + 0.1, y },
    colors: ["#ff4d70","#ff2060","#9b0030"],
    scalar: 0.85,
    ticks: 160,
  }), 100);
  // Flash fullscreen
  const flash = document.createElement("div");
  flash.style.cssText = "position:fixed;inset:0;z-index:99997;pointer-events:none;background:radial-gradient(ellipse at center,rgba(255,77,112,.22) 0%,transparent 65%)";
  document.body.appendChild(flash);
  if(window._gsapReady){
    gsap.fromTo(flash, { opacity:0 }, { opacity:1, duration:0.12, yoyo:true, repeat:2,
      onComplete: () => flash.remove()
    });
  } else {
    setTimeout(() => flash.remove(), 700);
  }
}

// ── 7. Confetti — Prestige ────────────────────────────────────────────────────
function burstPrestige(){
  if(typeof confetti === "undefined") return;
  const duration = 2200;
  const end = Date.now() + duration;
  const colors = ["#ffc83a","#ff4d70","#31d6ff","#2ee59d","#a78bfa","#fff"];
  (function frame(){
    confetti({ particleCount:5, angle:60,  spread:55, origin:{x:0,    y:0.65}, colors });
    confetti({ particleCount:5, angle:120, spread:55, origin:{x:1,    y:0.65}, colors });
    confetti({ particleCount:4, angle:90,  spread:70, origin:{x:0.5,  y:0.3 }, colors, startVelocity:20 });
    if(Date.now() < end) requestAnimationFrame(frame);
  })();
}

// ── 8. Toast animé (GSAP) ────────────────────────────────────────────────────
function _patchShowToast(){
  if(typeof showToast !== "function") return;
  const orig = showToast;
  window.showToast = function(msg){
    orig(msg);
    if(!window._gsapReady) return;
    const toast = document.getElementById("partsToast");
    if(!toast) return;
    gsap.fromTo(toast,
      { y: 12, opacity: 0, scale: 0.94 },
      { y: 0,  opacity: 1, scale: 1, duration: 0.22, ease: "back.out(1.8)", overwrite: true }
    );
  };
}

// ── 9. Float text amélioré (GSAP) ────────────────────────────────────────────
function _patchSpawnFloatText(){
  if(typeof spawnFloatText !== "function") return;
  const orig = spawnFloatText;
  window.spawnFloatText = function(text, type, originEl){
    orig(text, type, originEl);
    if(!window._gsapReady) return;
    // Récupère le dernier float text créé
    const els = document.querySelectorAll(`.floatText--${type}`);
    const el  = els[els.length - 1];
    if(!el) return;
    // Tuer l'animation CSS existante et refaire en GSAP
    el.style.animation = "none";
    gsap.fromTo(el,
      { y: 0, opacity: 1, scale: 1 },
      { y: -52, opacity: 0, scale: 1.1, duration: 0.85, ease: "power2.out",
        onComplete: () => el.remove()
      }
    );
  };
}

// ── 10. Patch btnAnalyze — rareté avec confetti ───────────────────────────────
function _patchRarityFlash(){
  // On observe les toasts de rareté pour déclencher les confettis
  const origShowToast = window.showToast;
  window.showToast = function(msg){
    // Déjà patché par _patchShowToast — on chaîne
    (origShowToast ?? function(){})(msg);
    const btnAnalyze = document.getElementById("btnAnalyze");
    if(msg?.includes("MYTHIQUE")){
      burstMythic(btnAnalyze);
    } else if(msg?.includes("Légendaire")){
      burstLegendary(btnAnalyze);
    }
  };
}

// ── 11. Observer DOM pour animer les nouveaux slots et sItems ─────────────────
function initMutationObserver(){
  const observer = new MutationObserver(mutations => {
    for(const mut of mutations){
      for(const node of mut.addedNodes){
        if(!(node instanceof HTMLElement)) continue;
        // Slot atelier entrant
        if(node.classList?.contains("garageSlot") && node.classList.contains("garageSlot--active")){
          animateSlotEnter(node);
        }
        // Slot atelier terminé (flash de complétion)
        if(node.classList?.contains("garageSlot") && node.classList.contains("garageSlot--complete")){
          animateSlotComplete(node);
        }
        // sItem showroom entrant
        if(node.classList?.contains("sItem") && node.classList.contains("sItem--new")){
          animateSItemEnter(node);
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// ── 12. Exposition des fonctions pour app.js / prestige-ui.js ────────────────
window.burstLegendary = burstLegendary;
window.burstMythic    = burstMythic;
window.burstPrestige  = burstPrestige;
window.animateSlotEnter   = animateSlotEnter;
window.animateSItemEnter  = animateSItemEnter;

// ── 13. Init après chargement de la page ─────────────────────────────────────
function initGSAPAnimations(){
  _patchRenderTop();
  _patchShowToast();
  _patchSpawnFloatText();
  _patchRarityFlash();
  initMutationObserver();
  console.log("[GT Animations] GSAP prêt ✓");
}

// Attendre que le DOM + les autres scripts soient chargés
if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", () => {
    // Patcher showToast et spawnFloatText même si GSAP pas encore prêt
    _patchShowToast();
    _patchSpawnFloatText();
    _patchRarityFlash();
    initMutationObserver();
  });
} else {
  _patchShowToast();
  _patchSpawnFloatText();
  _patchRarityFlash();
  initMutationObserver();
}
