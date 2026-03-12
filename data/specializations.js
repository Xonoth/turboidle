// =====================
// SPÉCIALISATIONS GARAGE
// =====================
// Choisie au moment du prestige, active pour tout le run suivant.

const SPECIALIZATIONS = [
  {
    id:      "turbo",
    icon:    "🔧",
    name:    "Atelier Turbo",
    tagline: "La vitesse avant tout",
    color:   "#4a9eff",
    bonuses: [
      { label: "Vitesse de réparation",  value: "+40%",  positive: true  },
      { label: "Réparation automatique", value: "+40%",  positive: true  },
      { label: "Valeur de vente",        value: "-15%",  positive: false },
      { label: "Revenus passifs",        value: "-25%",  positive: false },
    ],
    apply(state) {
      state.specSpeedMult    = 1.40;
      state.specAutoMult     = 1.40;
      state.specSaleMult     = 0.85;
      state.specPassiveMult  = 0.75;
    },
  },
  {
    id:      "prestige",
    icon:    "💰",
    name:    "Garage Prestige",
    tagline: "Le luxe ça se mérite",
    color:   "#ffc83a",
    bonuses: [
      { label: "Valeur de vente",        value: "+35%",  positive: true  },
      { label: "Bonus tier S+",          value: "×2",    positive: true  },
      { label: "Vitesse de réparation",  value: "-20%",  positive: false },
      { label: "Slots showroom max",     value: "5",     positive: false },
    ],
    apply(state) {
      state.specSaleMult     = 1.35;
      state.specRareMult     = 2.0;
      state.specSpeedMult    = 0.80;
      state.specShowroomCap  = 5;
    },
  },
  {
    id:      "diag",
    icon:    "🔍",
    name:    "Centre Diagnostic",
    tagline: "Chaque analyse compte",
    color:   "#2ee59d",
    bonuses: [
      { label: "Gain diagnostic",        value: "×3",    positive: true  },
      { label: "Pt talent / 100 diags",  value: "+1",    positive: true  },
      { label: "Vitesse de réparation",  value: "-10%",  positive: false },
      { label: "Valeur de vente",        value: "-10%",  positive: false },
    ],
    apply(state) {
      state.specDiagMult     = 3.0;
      state.specSpeedMult    = 0.90;
      state.specSaleMult     = 0.90;
    },
  },
  {
    id:      "logistique",
    icon:    "📦",
    name:    "Logistique Pro",
    tagline: "La pièce, toujours disponible",
    color:   "#a78bfa",
    bonuses: [
      { label: "Slots de livraison",     value: "×2",    positive: true  },
      { label: "Délai livraison",        value: "-50%",  positive: true  },
      { label: "Bonus pièces sur vente", value: "+25%",  positive: true  },
      { label: "Gain REP",              value: "-20%",  positive: false },
    ],
    apply(state) {
      state.specDeliverySlotsMult = 2.0;
      state.specDeliveryDisc      = 0.50;
      state.specPartsValueBonus   = 0.25;
      state.specRepMult           = 0.80;
    },
  },
  {
    id:      "rep",
    icon:    "⭐",
    name:    "Réputation Légendaire",
    tagline: "Ton nom vaut de l'or",
    color:   "#ff8c40",
    bonuses: [
      { label: "Gain REP",              value: "×2",    positive: true  },
      { label: "REP requise prestige",   value: "-25%",  positive: true  },
      { label: "Tous les revenus",       value: "-20%",  positive: false },
    ],
    apply(state) {
      state.specRepMult      = 2.0;
      state.specRepReqMult   = 0.75;  // 40k × 0.75 = 30k
      state.specSaleMult     = 0.80;
      state.specPassiveMult  = 0.80;
      state.specDiagMult     = (state.specDiagMult ?? 1.0) * 0.80;
    },
  },
];

function getSpecialization(id) {
  return SPECIALIZATIONS.find(s => s.id === id) ?? null;
}

// Réinitialise tous les effets de spécialisation dans le state
function resetSpecEffects(st) {
  st.specSpeedMult         = 1.0;
  st.specAutoMult          = 1.0;
  st.specSaleMult          = 1.0;
  st.specPassiveMult       = 1.0;
  st.specDiagMult          = 1.0;
  st.specRareMult          = 1.0;
  st.specRepMult           = 1.0;
  st.specRepReqMult        = 1.0;
  st.specShowroomCap       = null;   // null = pas de limite imposée
  st.specDeliverySlotsMult = 1.0;
  st.specDeliveryDisc      = 0.0;
  st.specPartsValueBonus   = 0.0;
}

// Applique la spécialisation active dans le state
function applySpecializationEffects() {
  resetSpecEffects(state);
  const spec = getSpecialization(state.specialization ?? null);
  if(spec) spec.apply(state);
}
