// =====================================================================
// GARAGE TURBO — TOOLTIPS (Tippy.js)
// Upgrades (hover riche) + Badges rareté (multiplicateurs)
// =====================================================================

// ── Config globale Tippy ─────────────────────────────────────────────────────
const TIPPY_BASE = {
  theme:       "gt-dark",
  animation:   "shift-away",
  arrow:       true,
  interactive: false,
  duration:    [140, 100],
  delay:       [280, 60],
  placement:   "left",
  appendTo:    () => document.body,
  maxWidth:    360,
  zIndex:      8000,
};

// ── Instance singleton partagée (délégation — survit aux re-renders) ─────────
let _tippySingleton = null;
let _tippyEl        = null; // élément cible actuel

// ── Contenu tooltip upgrade ──────────────────────────────────────────────────
function buildUpgradeTooltipHTML(u){
  if(typeof checkPrereqs === "undefined") return `<b>${u.name}</b><br>${u.desc}`;

  const { met: prereqMet, reasons: prereqReasons } = checkPrereqs(u.id);
  const isMaxed = u.maxLvl !== undefined && u.lvl >= u.maxLvl;
  const mult    = (typeof UPGRADE_MULT !== "undefined" ? UPGRADE_MULT[u.id] : null) ?? 1.25;
  const tags    = (typeof UPGRADE_TAGS  !== "undefined" ? UPGRADE_TAGS[u.id]  : null) ?? [];

  // Tags d'effet
  const tagsHtml = tags.map(t => {
    const labels = { vitesse:"⚡ Vitesse", argent:"💰 Argent", vente:"🚗 Vente", diagnostic:"🔍 Diagnostic", stock:"📦 Stock" };
    return `<span class="gt-tip__tag gt-tip__tag--${t}">${labels[t] ?? t}</span>`;
  }).join("");

  // Barre progression
  const progressPct = u.maxLvl ? Math.round((u.lvl / u.maxLvl) * 100) : 0;
  const progressHtml = u.maxLvl ? `
    <div class="gt-tip__prog">
      <div class="gt-tip__progBar">
        <div class="gt-tip__progFill ${isMaxed ? "gt-tip__progFill--max" : ""}" style="width:${progressPct}%"></div>
      </div>
      <span class="gt-tip__progLabel">${u.lvl} / ${u.maxLvl}${isMaxed ? " — MAX ✅" : ""}</span>
    </div>` : "";

  // Prochains niveaux (3 max pour garder compact)
  let levelsHtml = "";
  if(!isMaxed && prereqMet){
    const maxLvlCap = u.maxLvl ?? 999;
    const count = Math.min(3, maxLvlCap - u.lvl);
    let costAccum = u.cost;
    const rows = [];
    for(let i = 1; i <= count; i++){
      const targetLvl = u.lvl + i;
      const canAfford = state?.money >= costAccum;
      const effect    = typeof getEffectLabel === "function" ? getEffectLabel(u, targetLvl) : `Niv.${targetLvl}`;
      rows.push(`<div class="gt-tip__lvlRow${i===1?" gt-tip__lvlRow--next":""}">
        <span class="gt-tip__lvlNum">Niv.${targetLvl}</span>
        <span class="gt-tip__lvlEffect">${effect}</span>
        <span class="gt-tip__lvlCost ${canAfford?"gt-tip__lvlCost--ok":"gt-tip__lvlCost--miss"}">${typeof formatMoney !== "undefined" ? formatMoney(Math.ceil(costAccum)) : Math.ceil(costAccum)+"€"}</span>
      </div>`);
      costAccum = Math.ceil(costAccum * mult);
    }
    levelsHtml = `<div class="gt-tip__lvlTitle">Prochains niveaux</div>${rows.join("")}`;
  } else if(isMaxed){
    levelsHtml = `<div class="gt-tip__maxed">✅ Niveau maximum atteint</div>`;
  }

  // Prérequis manquants
  const prereqHtml = !prereqMet
    ? prereqReasons.map(r => `<div class="gt-tip__prereq">🔒 ${r}</div>`).join("")
    : "";

  return `
    <div class="gt-tip">
      <div class="gt-tip__head">
        <span class="gt-tip__icon">${u.icon}</span>
        <div>
          <div class="gt-tip__name">${u.name} <span class="gt-tip__lvlBadge">Niv.${u.lvl}${u.maxLvl ? "/"+u.maxLvl : ""}</span></div>
          <div class="gt-tip__scale">Scaling ×${mult.toFixed(2)}</div>
        </div>
      </div>
      ${tagsHtml ? `<div class="gt-tip__tags">${tagsHtml}</div>` : ""}
      <div class="gt-tip__desc">${u.desc}</div>
      ${progressHtml}
      ${prereqHtml}
      ${levelsHtml}
    </div>`;
}

// ── Contenu tooltip badge rareté ─────────────────────────────────────────────
function buildRarityTooltipHTML(rarityKey){
  if(typeof RARITY_TABLE === "undefined") return rarityKey;
  const r = RARITY_TABLE[rarityKey];
  if(!r) return rarityKey;

  const multSaleStr = r.multSale >= 10 ? `×${r.multSale}` : `×${r.multSale.toFixed(1)}`;
  const multRepStr  = r.multRep  >= 10 ? `×${r.multRep}`  : `×${r.multRep.toFixed(1)}`;

  // Barre visuelle du multiplicateur (max = mythic ×100)
  const maxMult = 100;
  const barSale = Math.min(100, Math.round((Math.log10(r.multSale + 1) / Math.log10(maxMult + 1)) * 100));
  const barRep  = Math.min(100, Math.round((Math.log10(r.multRep  + 1) / Math.log10(maxMult + 1)) * 100));

  // Revenus de collection si disponible
  let collHtml = "";
  if(typeof COLLECTION_RARITY_MULT !== "undefined"){
    const cm = COLLECTION_RARITY_MULT[rarityKey];
    if(cm && (cm.multE !== 1 || cm.multR !== 1)){
      collHtml = `<div class="gt-tip__rarSep"></div>
        <div class="gt-tip__rarRow">
          <span class="gt-tip__rarLabel">🏠 Expo €/s</span>
          <span class="gt-tip__rarVal" style="color:#2ee59d">×${cm.multE}</span>
        </div>
        <div class="gt-tip__rarRow">
          <span class="gt-tip__rarLabel">🏠 Expo REP/s</span>
          <span class="gt-tip__rarVal" style="color:#a78bfa">×${cm.multR}</span>
        </div>`;
    }
  }

  // Probabilité d'apparition
  const pct = r.pct < 0.1 ? r.pct.toFixed(2) : r.pct < 1 ? r.pct.toFixed(2) : r.pct.toFixed(1);

  return `
    <div class="gt-tip">
      <div class="gt-tip__rarHeader" style="color:${r.color}">
        ${r.icon} ${r.label}
        <span class="gt-tip__rarProba">${pct}% de chance</span>
      </div>
      <div class="gt-tip__rarSep"></div>
      <div class="gt-tip__rarRow">
        <span class="gt-tip__rarLabel">💰 Valeur vente</span>
        <span class="gt-tip__rarVal" style="color:#ffc83a">${multSaleStr}</span>
        <div class="gt-tip__rarBar"><div class="gt-tip__rarBarFill" style="width:${barSale}%;background:${r.color}"></div></div>
      </div>
      <div class="gt-tip__rarRow">
        <span class="gt-tip__rarLabel">🏆 Gain REP</span>
        <span class="gt-tip__rarVal" style="color:#a78bfa">${multRepStr}</span>
        <div class="gt-tip__rarBar"><div class="gt-tip__rarBarFill" style="width:${barRep}%;background:${r.color}"></div></div>
      </div>
      ${collHtml}
    </div>`;
}

// ── Délégation d'événement — survit aux re-renders ───────────────────────────
// Un seul listener sur document, pas d'attachement par élément.
// Le tooltip suit le curseur et recalcule son contenu à la volée.

function _getTooltipContent(el){
  // Badge rareté
  if(el.classList.contains("rarityBadge")){
    const cls = [...el.classList].find(c => c.startsWith("rarityBadge--") && c !== "rarityBadge");
    if(!cls) return null;
    const key = cls.replace("rarityBadge--", "");
    if(key === "common") return null;
    return { html: buildRarityTooltipHTML(key), placement: "top", delay: [150,60] };
  }
  // Icône upgrade
  if(el.classList.contains("upgradeIconBtn")){
    const uid = el.getAttribute("data-uid");
    const u   = state?.upgrades?.find(u => u.id === uid);
    if(!u) return null;
    return { html: buildUpgradeTooltipHTML(u), placement: "left", delay: [200,60] };
  }
  return null;
}

function _initDelegation(){
  if(typeof tippy === "undefined") return;

  // Créer un tooltip virtuel sur body pour la délégation
  _tippySingleton = tippy(document.body, {
    ...TIPPY_BASE,
    content: "",
    allowHTML: true,
    trigger: "manual",
    hideOnClick: true,
    interactive: false,
  });

  // mouseenter — déclencher le tooltip sur les éléments cibles
  document.addEventListener("mouseover", (e) => {
    const target = e.target.closest(".rarityBadge, .upgradeIconBtn");
    if(!target || target === _tippyEl) return;
    const info = _getTooltipContent(target);
    if(!info) return;

    _tippyEl = target;
    _tippySingleton.setProps({
      getReferenceClientRect: () => target.getBoundingClientRect(),
      placement: info.placement,
      delay: info.delay ?? [200,60],
    });
    _tippySingleton.setContent(info.html);
    _tippySingleton.show();
  }, { passive: true });

  // mouseleave — masquer quand on quitte la zone
  document.addEventListener("mouseout", (e) => {
    const target = e.target.closest(".rarityBadge, .upgradeIconBtn");
    if(!target) return;
    // Vérifier que la destination n'est pas dans le même élément
    const related = e.relatedTarget;
    if(related && target.contains(related)) return;
    _tippySingleton.hide();
    _tippyEl = null;
  }, { passive: true });
}

// ── Fonction utilitaire getEffectLabel (réutilise la logique de render.js) ────
// On expose une version globale pour que buildUpgradeTooltipHTML puisse l'appeler
function getEffectLabel(u, lvl){
  switch(u.id){
    case "scanner_pro":          return `F:+${15*lvl}€ · S:+${800*lvl}€ · SSS+:+${6000*lvl}€/diag`;
    case "cle_dynamometrique":   return `+${(0.5*lvl).toFixed(1)}s/clic`;
    case "turbocompresseur":     return `×${Math.pow(1.15,lvl).toFixed(3)} vitesse`;
    case "obd":                  return `+${10*lvl}€/diag`;
    case "diagpro":              return `+${40*lvl}€/diag`;
    case "toolbox":              return `+${(0.05*lvl).toFixed(2)}s/clic`;
    case "impact":               return `+${(0.08*lvl).toFixed(2)}s/clic`;
    case "impact2":              return `+${(0.12*lvl).toFixed(2)}s/clic`;
    case "nego":                 return `+${5*lvl}% vente`;
    case "comp":                 return `×${Math.pow(1.10,lvl).toFixed(3)} vitesse`;
    case "lift":                 return `+${lvl} slot(s) garage`;
    case "showroom_slot":        return `+${2*lvl} slot(s) showroom`;
    case "apprenti":             return `+${(0.15*lvl).toFixed(2)}s/s auto`;
    case "mecanicien":           return `+${(0.5*lvl).toFixed(1)}s/s auto`;
    case "stagiaire":            return `Diag toutes ${Math.max(6,15-(lvl-1)).toFixed(1)}s`;
    case "receptionnaire":       return `Min ${Math.max(1,6-(lvl*0.5)).toFixed(1)}s diag`;
    case "vendeur":              return `Vente toutes ${Math.max(6,15-(lvl-1)).toFixed(1)}s`;
    case "vendeur_confirme":     return `Min ${Math.max(1,8-(lvl*0.7)).toFixed(1)}s vente`;
    case "vendeur_expert":       return `Min ${Math.max(0.5,1-(lvl*0.1)).toFixed(1)}s vente`;
    case "ia_diagnostic":        return `Min ${Math.max(0.5,1-(lvl*0.1)).toFixed(1)}s diag`;
    case "chef_atelier":         return `+${lvl} slot(s) répa`;
    case "reseau_national":      return `+${100*lvl}€/s passif`;
    case "holding_auto":         return `+${250*lvl}€/s passif`;
    case "galerie_marchande":    return `+${2*lvl} slots showroom`;
    case "extension_atelier":    return `+${lvl} slot(s) garage`;
    case "contrat_taxi":         return `+${5*lvl}€/s passif`;
    case "assurance":            return `+${10*lvl}€/s passif`;
    case "atelier_nuit":         return `+${20*lvl}€/s passif`;
    case "franchise":            return `+${50*lvl}€/s passif`;
    case "magasinier":           return `-${Math.round((1-Math.pow(0.75,lvl))*100)}% délai`;
    case "slots_livraison":      return `+${lvl} slot(s) livraison`;
    case "etageres":             return `+${20*lvl} slots entrepôt`;
    case "rayonnage":            return `+${50*lvl} slots entrepôt`;
    case "zone_logistique":      return `+${100*lvl} slots · -${10*lvl}% délai`;
    case "entrepot_auto":        return `+${200*lvl} slots · +${2*lvl}% valeur`;
    case "logiciel_stock":       return lvl>=3 ? "Auto-commande" : "Fonctionnalités basiques";
    case "expo_premium":         return `+${lvl} slot${lvl>1?"s":""} exposition garage`;
    default:                     return `Niv. ${lvl}`;
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────
function initTippy(){
  if(typeof tippy === "undefined"){
    setTimeout(initTippy, 200);
    return;
  }
  tippy.setDefaultProps({ theme: "gt-dark", animation: "shift-away" });
  // La délégation ne dépend pas du DOM — s'initialise une seule fois
  _initDelegation();
  console.log("[GT Tooltips] Tippy délégation prêt ✓");
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", () => setTimeout(initTippy, 400));
} else {
  setTimeout(initTippy, 400);
}
