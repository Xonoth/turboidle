// =====================
// TALENT TREE
// =====================
const TALENTS = [

  // ══ BRANCHE BUSINESS ══════════════════════════════════════════
  // T1 — 2 talents
  { id:"passive_1", name:"Caisse Automatique", maxRank:20, category:"Business", icon:"💰", tier:1,
    desc:"+5 €/s par rang — revenu passif de base",
    requires:[] },

  { id:"sale_1", name:"Négociateur Né", maxRank:20, category:"Business", icon:"🤝", tier:1,
    desc:"+3% valeur de vente par rang",
    requires:[] },

  // T2
  { id:"passive_2", name:"Contrats Mensuels", maxRank:20, category:"Business", icon:"📑", tier:2,
    desc:"+20 €/s par rang",
    requires:[] },

  { id:"sale_2", name:"Réputation Locale", maxRank:20, category:"Business", icon:"🏆", tier:2,
    desc:"+8% valeur de vente par rang",
    requires:[] },

  { id:"showroom_1", name:"Expansion Vitrine", maxRank:10, category:"Business", icon:"🏪", tier:2,
    desc:"+1 emplacement showroom par rang (max +10)",
    requires:[] },

  // T3
  { id:"rare_bonus_1", name:"Clientèle Haut de Gamme", maxRank:20, category:"Business", icon:"🏎️", tier:3,
    desc:"+3% valeur de revente sur les voitures tier S et supérieur par rang",
    requires:[] },

  { id:"passive_3", name:"Rentes Perpétuelles", maxRank:10, category:"Business", icon:"🏦", tier:3,
    desc:"+5% multiplicateur sur tous les revenus passifs par rang",
    requires:[] },

  { id:"sale_mult_1", name:"Enchères Privées", maxRank:20, category:"Business", icon:"💎", tier:3,
    desc:"+2% multiplicateur sur toutes les ventes par rang",
    requires:[] },

  // ══ BRANCHE ATELIER ═══════════════════════════════════════════
  // T1 — 2 talents
  { id:"speed_1", name:"Routine Atelier", maxRank:20, category:"Atelier", icon:"⚡", tier:1,
    desc:"+4% vitesse de réparation par rang (clic + auto)",
    requires:[] },

  { id:"repair_bonus_1", name:"Outillage Précis", maxRank:20, category:"Atelier", icon:"🔨", tier:1,
    desc:"+50 € bonus fixe par réparation terminée par rang",
    requires:[] },

  // T2
  { id:"click_1", name:"Main de Fer", maxRank:20, category:"Atelier", icon:"🖱️", tier:2,
    desc:"+0.10s retirées par clic par rang",
    requires:[] },

  { id:"speed_2", name:"Organisation Pro", maxRank:20, category:"Atelier", icon:"🔧", tier:2,
    desc:"+7% vitesse de réparation par rang",
    requires:[] },

  { id:"multi_repair_1", name:"Double Shift", maxRank:20, category:"Atelier", icon:"🔩", tier:2,
    desc:"+0.5s/s de réparation automatique par rang",
    requires:[] },

  { id:"parts_1", name:"Gestion des Stocks", maxRank:20, category:"Atelier", icon:"📦", tier:2,
    desc:"-1.5% délai livraison par rang (max rang 20 = -30%)",
    requires:[] },

  // T3
  { id:"parts_2", name:"Fournisseur Fidèle", maxRank:20, category:"Atelier", icon:"🚛", tier:3,
    desc:"+1 slot de livraison simultanée tous les 5 rangs (max +4)",
    requires:[] },

  { id:"repair_mult_1", name:"Touche d'Or", maxRank:20, category:"Atelier", icon:"✨", tier:3,
    desc:"+3% multiplicateur sur les bonus de réparation par rang",
    requires:[] },

  // ══ BRANCHE DIAGNOSTIC ════════════════════════════════════════
  // T1 — 2 talents
  { id:"diag_1", name:"Œil de Lynx", maxRank:20, category:"Diagnostic", icon:"🔍", tier:1,
    desc:"+3 € par analyse par rang",
    requires:[] },

  { id:"rep_1", name:"Bouche-à-Oreille", maxRank:20, category:"Diagnostic", icon:"📣", tier:1,
    desc:"+5% REP gagnée par vente par rang",
    requires:[] },

  // T2
  { id:"diag_2", name:"Scan Avancé", maxRank:20, category:"Diagnostic", icon:"🧠", tier:2,
    desc:"+8 € par analyse par rang",
    requires:[] },

  { id:"diag_rep_1", name:"Expertise Reconnue", maxRank:20, category:"Diagnostic", icon:"⭐", tier:2,
    desc:"+2 REP par diagnostic manuel par rang",
    requires:[] },

  // T3
  { id:"diag_3", name:"Expert Certifié", maxRank:20, category:"Diagnostic", icon:"🎓", tier:3,
    desc:"+5% multiplicateur sur la récompense totale de diagnostic par rang",
    requires:[] },


  // ── ENTREPÔT ──────────────────────────────────────────────────────────
  // T2
  { id:"gestionnaire_stock", name:"Gestionnaire de Stock", maxRank:10, category:"Atelier", icon:"📋", tier:2,
    desc:"Les pièces F/E/D n'occupent que 0.5 slot entrepôt (rang 1+)",
    requires:[] },

  // T3
  { id:"logistique_avancee", name:"Logistique Avancée", maxRank:20, category:"Atelier", icon:"🏭", tier:3,
    desc:"+50 slots d'entrepôt par rang",
    requires:[] },

];