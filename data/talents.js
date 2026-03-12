// =====================
// TALENT TREE
// =====================
const TALENTS = [

  // ══ BRANCHE BUSINESS ══════════════════════════════════════════
  { id:"passive_1", name:"Caisse Automatique", maxRank:20, category:"Business", icon:"💰", tier:1,
    desc:"+5 €/s par rang — revenu passif de base",
    requires:[] },

  { id:"passive_2", name:"Contrats Mensuels", maxRank:20, category:"Business", icon:"📑", tier:2,
    desc:"+20 €/s par rang",
    requires:[] },

  { id:"sale_1", name:"Négociateur Né", maxRank:20, category:"Business", icon:"🤝", tier:1,
    desc:"+3% valeur de vente par rang",
    requires:[] },

  { id:"sale_2", name:"Réputation Locale", maxRank:20, category:"Business", icon:"🏆", tier:2,
    desc:"+8% valeur de vente par rang",
    requires:[] },

  { id:"showroom_1", name:"Expansion Vitrine", maxRank:20, category:"Business", icon:"🏪", tier:2,
    desc:"+1 emplacement showroom par rang — exposez plus de véhicules simultanément",
    requires:[] },

  { id:"rare_bonus_1", name:"Clientèle Haut de Gamme", maxRank:20, category:"Business", icon:"🏎️", tier:3,
    desc:"+3% valeur de revente sur les voitures tier S et supérieur par rang",
    requires:[] },

  // ══ BRANCHE ATELIER ═══════════════════════════════════════════
  { id:"speed_1", name:"Routine Atelier", maxRank:20, category:"Atelier", icon:"⚡", tier:1,
    desc:"+4% vitesse de réparation par rang (clic + auto)",
    requires:[] },

  { id:"speed_2", name:"Organisation Pro", maxRank:20, category:"Atelier", icon:"🔧", tier:2,
    desc:"+7% vitesse de réparation par rang",
    requires:[] },

  { id:"click_1", name:"Main de Fer", maxRank:20, category:"Atelier", icon:"🖱️", tier:1,
    desc:"+0.10s retirées par clic par rang",
    requires:[] },

  { id:"multi_repair_1", name:"Double Shift", maxRank:20, category:"Atelier", icon:"🔩", tier:2,
    desc:"+0.5s/s de réparation automatique par rang",
    requires:[] },

  { id:"parts_1", name:"Gestion des Stocks", maxRank:10, category:"Atelier", icon:"📦", tier:2,
    desc:"-3% délai livraison par rang (max rang 10 = -30%)",
    requires:[] },

  { id:"parts_2", name:"Fournisseur Fidèle", maxRank:20, category:"Atelier", icon:"🚛", tier:3,
    desc:"+1 slot de livraison simultanée tous les 5 rangs (max +4)",
    requires:[] },

  // ══ BRANCHE DIAGNOSTIC ════════════════════════════════════════
  { id:"diag_1", name:"Œil de Lynx", maxRank:20, category:"Diagnostic", icon:"🔍", tier:1,
    desc:"+3 € par analyse par rang",
    requires:[] },

  { id:"diag_2", name:"Scan Avancé", maxRank:20, category:"Diagnostic", icon:"🧠", tier:2,
    desc:"+8 € par analyse par rang",
    requires:[] },

  { id:"diag_3", name:"Expert Certifié", maxRank:20, category:"Diagnostic", icon:"🎓", tier:3,
    desc:"+5% multiplicateur sur la récompense totale de diagnostic par rang",
    requires:[] },

];



