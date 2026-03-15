// =====================
// SUCCÈS
// =====================
const ACHIEVEMENTS = [
  // ── VENTES ──────────────────────────────────────────
  { id:"sell_1",       cat:"Ventes",       icon:"🚗", name:"Premier Client",           desc:"Vendre 1 voiture",                          cond:s=>s.carsSold>=1,         reward:{rep:5,    money:0,     talent:0} },
  { id:"sell_10",      cat:"Ventes",       icon:"🚗", name:"Petit Commerce",            desc:"Vendre 10 voitures",                        cond:s=>s.carsSold>=10,        reward:{rep:15,   money:500,     talent:0} },
  { id:"sell_25",      cat:"Ventes",       icon:"🚙", name:"En Rythme",                 desc:"Vendre 25 voitures",                        cond:s=>s.carsSold>=25,        reward:{rep:25,   money:1000,    talent:0} },
  { id:"sell_50",      cat:"Ventes",       icon:"🚙", name:"Vendeur Confirmé",          desc:"Vendre 50 voitures",                        cond:s=>s.carsSold>=50,        reward:{rep:40,   money:2500,    talent:0} },
  { id:"sell_100",     cat:"Ventes",       icon:"🚙", name:"Centenaire",                desc:"Vendre 100 voitures",                       cond:s=>s.carsSold>=100,       reward:{rep:75,   money:6000,    talent:0} },
  { id:"sell_250",     cat:"Ventes",       icon:"🏎️", name:"Série Noire",              desc:"Vendre 250 voitures",                       cond:s=>s.carsSold>=250,       reward:{rep:150,  money:15000,   talent:0} },
  { id:"sell_500",     cat:"Ventes",       icon:"🏎️", name:"Demi-Millier",             desc:"Vendre 500 voitures",                       cond:s=>s.carsSold>=500,       reward:{rep:300,  money:30000,   talent:1} },
  { id:"sell_1000",    cat:"Ventes",       icon:"🏁", name:"Mille Voitures",            desc:"Vendre 1 000 voitures",                     cond:s=>s.carsSold>=1000,      reward:{rep:600,  money:75000,   talent:1} },
  { id:"sell_2500",    cat:"Ventes",       icon:"🏁", name:"Concessionnaire",           desc:"Vendre 2 500 voitures",                     cond:s=>s.carsSold>=2500,      reward:{rep:1200, money:200000,  talent:1} },
  { id:"sell_5000",    cat:"Ventes",       icon:"🏁", name:"Tycoon de l'Occasion",      desc:"Vendre 5 000 voitures",                     cond:s=>s.carsSold>=5000,      reward:{rep:2500, money:500000,  talent:2} },
  { id:"sell_10000",   cat:"Ventes",       icon:"👑", name:"Empire de l'Auto",          desc:"Vendre 10 000 voitures",                    cond:s=>s.carsSold>=10000,     reward:{rep:5000, money:1000000, talent:3} },
  { id:"sell_50000",   cat:"Ventes",       icon:"👑", name:"Légende Vivante",           desc:"Vendre 50 000 voitures",                    cond:s=>s.carsSold>=50000,     reward:{rep:15000,money:3000000, talent:5} },

  // ── ARGENT ──────────────────────────────────────────
  { id:"money_500",    cat:"Argent",       icon:"💶", name:"Premiers Sous",             desc:"Avoir 500 € en caisse",                     cond:s=>s.money>=500,          reward:{rep:0,    money:0,       talent:0} },
  { id:"money_1k",     cat:"Argent",       icon:"💰", name:"Premier Billet",            desc:"Avoir 1 000 € en caisse",                   cond:s=>s.money>=1000,         reward:{rep:0,   money:0,       talent:0} },
  { id:"money_5k",     cat:"Argent",       icon:"💰", name:"Petite Réserve",            desc:"Avoir 5 000 € en caisse",                   cond:s=>s.money>=5000,         reward:{rep:0,   money:0,       talent:0} },
  { id:"money_10k",    cat:"Argent",       icon:"💰", name:"Petite Épargne",            desc:"Avoir 10 000 € en caisse",                  cond:s=>s.money>=10000,        reward:{rep:0,   money:0,       talent:0} },
  { id:"money_50k",    cat:"Argent",       icon:"💵", name:"Cinquante Mille",           desc:"Avoir 50 000 € en caisse",                  cond:s=>s.money>=50000,        reward:{rep:0,   money:500,       talent:0} },
  { id:"money_100k",   cat:"Argent",       icon:"💵", name:"Cent Mille",                desc:"Avoir 100 000 € en caisse",                 cond:s=>s.money>=100000,       reward:{rep:0,  money:1000,       talent:0} },
  { id:"money_500k",   cat:"Argent",       icon:"💵", name:"Demi-Million",              desc:"Avoir 500 000 € en caisse",                 cond:s=>s.money>=500000,       reward:{rep:0,  money:3000,       talent:0} },
  { id:"money_1m",     cat:"Argent",       icon:"💎", name:"Millionnaire",              desc:"Avoir 1 000 000 € en caisse",               cond:s=>s.money>=1000000,      reward:{rep:0,  money:5000,       talent:1} },
  { id:"money_10m",    cat:"Argent",       icon:"💎", name:"Dizaine de Millions",       desc:"Avoir 10 000 000 € en caisse",              cond:s=>s.money>=10000000,     reward:{rep:500, money:0,       talent:2} },
  { id:"money_1b",     cat:"Argent",       icon:"💎", name:"Milliardaire",              desc:"Avoir 1 000 000 000 € en caisse",           cond:s=>s.money>=1000000000,   reward:{rep:2000, money:0,       talent:3} },
  { id:"passive_5",    cat:"Argent",       icon:"📈", name:"Premiers Intérêts",         desc:"Atteindre 5 €/s de revenu passif",          cond:s=>s.moneyPerSec>=5,      reward:{rep:0,   money:200,    talent:0} },
  { id:"passive_10",   cat:"Argent",       icon:"📈", name:"Rente Modeste",             desc:"Atteindre 10 €/s de revenu passif",         cond:s=>s.moneyPerSec>=10,     reward:{rep:0,   money:500,    talent:0} },
  { id:"passive_50",   cat:"Argent",       icon:"📈", name:"Flux Régulier",             desc:"Atteindre 50 €/s de revenu passif",         cond:s=>s.moneyPerSec>=50,     reward:{rep:30,   money:15000,   talent:0} },
  { id:"passive_100",  cat:"Argent",       icon:"📈", name:"Flux Continu",              desc:"Atteindre 100 €/s de revenu passif",        cond:s=>s.moneyPerSec>=100,    reward:{rep:80,  money:30000,   talent:0} },
  { id:"passive_500",  cat:"Argent",       icon:"📊", name:"Rente Confortable",         desc:"Atteindre 500 €/s de revenu passif",        cond:s=>s.moneyPerSec>=500,    reward:{rep:400,  money:80000,   talent:1} },
  { id:"passive_1k",   cat:"Argent",       icon:"📊", name:"Machine à Cash",            desc:"Atteindre 1 000 €/s de revenu passif",      cond:s=>s.moneyPerSec>=1000,   reward:{rep:1000, money:200000,  talent:2} },
  { id:"earned_1m",    cat:"Argent",       icon:"🏦", name:"Un Million Gagné",          desc:"Avoir gagné 1 000 000 € au total",          cond:s=>(s.totalMoneyEarned??0)>=1000000,   reward:{rep:0,  money:20000,       talent:0} },
  { id:"earned_100m",  cat:"Argent",       icon:"🏦", name:"Cent Millions Gagnés",      desc:"Avoir gagné 100 000 000 € au total",        cond:s=>(s.totalMoneyEarned??0)>=100000000, reward:{rep:200, money:0,       talent:1} },

  // ── RÉPUTATION ──────────────────────────────────────
  { id:"rep_10",       cat:"Réputation",   icon:"⭐", name:"Débutant Connu",            desc:"Atteindre 10 REP",                          cond:s=>s.rep>=10,             reward:{rep:0,    money:0,     talent:0} },
  { id:"rep_50",       cat:"Réputation",   icon:"⭐", name:"Bouche à Oreille",          desc:"Atteindre 50 REP",                          cond:s=>s.rep>=50,             reward:{rep:0,    money:0,     talent:0} },
  { id:"rep_100",      cat:"Réputation",   icon:"⭐", name:"Réputation Locale",         desc:"Atteindre 100 REP",                         cond:s=>s.rep>=100,            reward:{rep:0,    money:200,    talent:0} },
  { id:"rep_500",      cat:"Réputation",   icon:"🌟", name:"Garage Reconnu",            desc:"Atteindre 500 REP",                         cond:s=>s.rep>=500,            reward:{rep:0,    money:1000,    talent:0} },
  { id:"rep_2000",     cat:"Réputation",   icon:"🌟", name:"Expert Régional",           desc:"Atteindre 2 000 REP",                       cond:s=>s.rep>=2000,           reward:{rep:0,    money:5000,   talent:0} },
  { id:"rep_10000",    cat:"Réputation",   icon:"💫", name:"Célébrité Nationale",       desc:"Atteindre 10 000 REP",                      cond:s=>s.rep>=10000,          reward:{rep:0,    money:80000,   talent:1} },
  { id:"rep_50000",    cat:"Réputation",   icon:"💫", name:"Icône Mondiale",            desc:"Atteindre 50 000 REP",                      cond:s=>s.rep>=50000,          reward:{rep:0,    money:300000,  talent:1} },
  { id:"rep_200000",   cat:"Réputation",   icon:"🔱", name:"Légende de l'Asphalte",     desc:"Atteindre 200 000 REP",                     cond:s=>s.rep>=200000,         reward:{rep:0,    money:1000000, talent:2} },

  // ── TIERS ────────────────────────────────────────────
  { id:"tier_D",       cat:"Tiers",        icon:"🔓", name:"Véhicules Communs",         desc:"Débloquer le tier D",                       cond:s=>s.rep>=500,             reward:{rep:0,   money:0,    talent:0} },
  { id:"tier_C",       cat:"Tiers",        icon:"🔓", name:"Compactes Sportives",       desc:"Débloquer le tier C",                       cond:s=>s.rep>=1500,            reward:{rep:0,   money:500,    talent:0} },
  { id:"tier_B",       cat:"Tiers",        icon:"🔓", name:"Sportives & Youngtimers",   desc:"Débloquer le tier B",                       cond:s=>s.rep>=5000,           reward:{rep:20,   money:1000,   talent:0} },
  { id:"tier_A",       cat:"Tiers",        icon:"🔓", name:"Luxe & SUV Premium",        desc:"Débloquer le tier A",                       cond:s=>s.rep>=8000,           reward:{rep:50,  money:40000,   talent:0} },
  { id:"tier_S",       cat:"Tiers",        icon:"🌠", name:"Sportives Prestige",        desc:"Débloquer le tier S",                       cond:s=>s.rep>=25000,          reward:{rep:100,  money:120000,  talent:1} },
  { id:"tier_SS",      cat:"Tiers",        icon:"🌠", name:"Supercars",                 desc:"Débloquer le tier SS",                      cond:s=>s.rep>=70000,          reward:{rep:500,  money:400000,  talent:2} },
  { id:"tier_SSS",     cat:"Tiers",        icon:"💥", name:"Hypercars Rares",           desc:"Débloquer le tier SSS",                     cond:s=>s.rep>=200000,         reward:{rep:1000, money:1200000, talent:3} },
  { id:"tier_SSSp",    cat:"Tiers",        icon:"💥", name:"Mythiques",                 desc:"Débloquer le tier SSS+",                    cond:s=>s.rep>=450000,         reward:{rep:5000, money:5000000, talent:5} },

  // ── NIVEAU GARAGE ────────────────────────────────────
  { id:"lvl_5",        cat:"Garage",       icon:"🏠", name:"Atelier en Rodage",         desc:"Atteindre le niveau 5",                     cond:s=>s.garageLevel>=5,      reward:{rep:10,   money:500,     talent:0} },
  { id:"lvl_10",       cat:"Garage",       icon:"🏠", name:"Garage Opérationnel",       desc:"Atteindre le niveau 10",                    cond:s=>s.garageLevel>=10,     reward:{rep:25,   money:2000,    talent:0} },
  { id:"lvl_20",       cat:"Garage",       icon:"🏗️", name:"Atelier Solide",           desc:"Atteindre le niveau 20",                    cond:s=>s.garageLevel>=20,     reward:{rep:40,   money:6000,    talent:0} },
  { id:"lvl_25",       cat:"Garage",       icon:"🏗️", name:"Expansion Majeure",        desc:"Atteindre le niveau 25",                    cond:s=>s.garageLevel>=25,     reward:{rep:60,   money:12000,   talent:0} },
  { id:"lvl_50",       cat:"Garage",       icon:"🏗️", name:"Centre Auto",              desc:"Atteindre le niveau 50",                    cond:s=>s.garageLevel>=50,     reward:{rep:150,  money:40000,   talent:1} },
  { id:"lvl_75",       cat:"Garage",       icon:"🏢", name:"Groupe Automobile",         desc:"Atteindre le niveau 75",                    cond:s=>s.garageLevel>=75,     reward:{rep:300,  money:100000,  talent:1} },
  { id:"lvl_100",      cat:"Garage",       icon:"🏢", name:"Complexe Automobile",       desc:"Atteindre le niveau 100",                   cond:s=>s.garageLevel>=100,    reward:{rep:600,  money:250000,  talent:2} },
  { id:"lvl_150",      cat:"Garage",       icon:"🌆", name:"Empire Industriel",         desc:"Atteindre le niveau 150",                   cond:s=>s.garageLevel>=150,    reward:{rep:2000, money:1000000, talent:3} },

  // ── ATELIER ──────────────────────────────────────────
  { id:"repair_10",    cat:"Atelier",      icon:"🔧", name:"Mains dans le Cambouis",    desc:"Effectuer 10 réparations",                  cond:s=>(s.totalRepairs??0)>=10,    reward:{rep:10,   money:500,     talent:0} },
  { id:"repair_100",   cat:"Atelier",      icon:"🔧", name:"Mécanicien Expérimenté",    desc:"Effectuer 100 réparations",                 cond:s=>(s.totalRepairs??0)>=100,   reward:{rep:50,   money:3000,    talent:0} },
  { id:"repair_500",   cat:"Atelier",      icon:"🛠️", name:"Série de Chantiers",        desc:"Effectuer 500 réparations",                 cond:s=>(s.totalRepairs??0)>=500,   reward:{rep:150,  money:15000,   talent:0} },
  { id:"repair_1000",  cat:"Atelier",      icon:"🛠️", name:"Mil Réparations",           desc:"Effectuer 1 000 réparations",               cond:s=>(s.totalRepairs??0)>=1000,  reward:{rep:400,  money:50000,   talent:1} },
  { id:"repair_5000",  cat:"Atelier",      icon:"⚙️", name:"Usine à Réparer",           desc:"Effectuer 5 000 réparations",               cond:s=>(s.totalRepairs??0)>=5000,  reward:{rep:1500, money:200000,  talent:2} },
  { id:"repair_10000", cat:"Atelier",      icon:"⚙️", name:"Maître des Pistons",        desc:"Effectuer 10 000 réparations",              cond:s=>(s.totalRepairs??0)>=10000, reward:{rep:5000, money:500000,  talent:3} },
  { id:"auto_repair",  cat:"Atelier",      icon:"🤖", name:"Atelier Automatisé",        desc:"Avoir une réparation auto active",          cond:s=>s.repairAuto>0,             reward:{rep:30,   money:2000,    talent:0} },
  { id:"speed_15",     cat:"Atelier",      icon:"⚡", name:"Vitesse de Croisière",      desc:"Multiplicateur de vitesse ≥ 1.5×",          cond:s=>(s.speedMult??1)*(s.talentSpeedMult??1)>=1.5,  reward:{rep:50,   money:5000,    talent:0} },
  { id:"speed_2",      cat:"Atelier",      icon:"⚡", name:"Turbo Activé",              desc:"Multiplicateur de vitesse ≥ 2×",            cond:s=>(s.speedMult??1)*(s.talentSpeedMult??1)>=2,    reward:{rep:150,  money:20000,   talent:1} },
  { id:"speed_3",      cat:"Atelier",      icon:"⚡", name:"Mode Fusée",                desc:"Multiplicateur de vitesse ≥ 3×",            cond:s=>(s.speedMult??1)*(s.talentSpeedMult??1)>=3,    reward:{rep:500,  money:80000,   talent:2} },
  { id:"click_500",    cat:"Atelier",      icon:"👊", name:"Bras Musclé",               desc:"Effectuer 500 clics de réparation",         cond:s=>(s.totalClickRepairs??0)>=500,   reward:{rep:20,   money:1000,    talent:0} },
  { id:"click_5000",   cat:"Atelier",      icon:"👊", name:"Acharnement",               desc:"Effectuer 5 000 clics de réparation",       cond:s=>(s.totalClickRepairs??0)>=5000,  reward:{rep:80,   money:8000,    talent:0} },
  { id:"click_50000",  cat:"Atelier",      icon:"🥊", name:"Légende du Clic",           desc:"Effectuer 50 000 clics de réparation",      cond:s=>(s.totalClickRepairs??0)>=50000, reward:{rep:500,  money:50000,   talent:1} },
  { id:"slots_3",      cat:"Atelier",      icon:"🅿️", name:"Triple Chantier",           desc:"Avoir 3 emplacements garage",               cond:s=>s.garageCap>=3,             reward:{rep:20,   money:2000,    talent:0} },
  { id:"slots_5",      cat:"Atelier",      icon:"🅿️", name:"Quinconce",                 desc:"Avoir 5 emplacements garage",               cond:s=>s.garageCap>=5,             reward:{rep:60,   money:8000,    talent:0} },
  { id:"slots_max",    cat:"Atelier",      icon:"🅿️", name:"Parking Complet",           desc:"Avoir 8 emplacements garage",               cond:s=>s.garageCap>=8,             reward:{rep:200,  money:30000,   talent:1} },

  // ── DIAGNOSTIC ───────────────────────────────────────
  { id:"diag_1",       cat:"Diagnostic",   icon:"🔍", name:"Scanner en Main",           desc:"Effectuer 1 diagnostic",                    cond:s=>s.totalAnalyses>=1,         reward:{rep:5,    money:0,       talent:0} },
  { id:"diag_50",      cat:"Diagnostic",   icon:"🔍", name:"Œil Affûté",                desc:"Effectuer 50 diagnostics",                  cond:s=>s.totalAnalyses>=50,        reward:{rep:15,   money:200,     talent:0} },
  { id:"diag_100",     cat:"Diagnostic",   icon:"🔍", name:"Diagnostiqueur",            desc:"Effectuer 100 diagnostics",                 cond:s=>s.totalAnalyses>=100,       reward:{rep:30,   money:800,     talent:0} },
  { id:"diag_500",     cat:"Diagnostic",   icon:"🧠", name:"Technicien Certifié",       desc:"Effectuer 500 diagnostics",                 cond:s=>s.totalAnalyses>=500,       reward:{rep:80,   money:4000,    talent:0} },
  { id:"diag_1000",    cat:"Diagnostic",   icon:"🧠", name:"Expert du Scan",            desc:"Effectuer 1 000 diagnostics",               cond:s=>s.totalAnalyses>=1000,      reward:{rep:200,  money:12000,   talent:0} },
  { id:"diag_10000",   cat:"Diagnostic",   icon:"🧠", name:"Maître Diagnostiqueur",     desc:"Effectuer 10 000 diagnostics",              cond:s=>s.totalAnalyses>=10000,     reward:{rep:800,  money:60000,   talent:1} },
  { id:"diag_auto",    cat:"Diagnostic",   icon:"🤖", name:"Stagiaire Embauché",        desc:"Débloquer le Stagiaire Accueil",            cond:s=>(s.upgrades?.find(u=>u.id==="stagiaire")?.lvl??0)>=1, reward:{rep:25,money:2000,talent:0} },
  { id:"diag_reward",  cat:"Diagnostic",   icon:"💡", name:"Diagnostic Premium",        desc:"Avoir +50 € par diagnostic",                cond:s=>s.diagReward>=50,           reward:{rep:100,  money:10000,   talent:0} },
  { id:"diag_reward2", cat:"Diagnostic",   icon:"💡", name:"Scanner d'Élite",           desc:"Avoir +200 € par diagnostic",               cond:s=>s.diagReward>=200,          reward:{rep:400,  money:50000,   talent:1} },

  // ── PIÈCES & STOCK ───────────────────────────────────
  { id:"part_first",   cat:"Stock",        icon:"📦", name:"Première Commande",         desc:"Commander une pièce pour la première fois", cond:s=>Object.keys(s.parts??{}).length>=1,         reward:{rep:10,   money:500,     talent:0} },
  { id:"part_5types",  cat:"Stock",        icon:"📦", name:"Stock Varié",               desc:"Avoir 5 types de pièces en stock",          cond:s=>Object.values(s.parts??{}).filter(p=>p.qty>0).length>=5,  reward:{rep:25,   money:2000,    talent:0} },
  { id:"part_15types", cat:"Stock",        icon:"🗄️", name:"Magasin Pièces",            desc:"Avoir 15 types de pièces en stock",         cond:s=>Object.values(s.parts??{}).filter(p=>p.qty>0).length>=15, reward:{rep:80,   money:8000,    talent:0} },
  { id:"part_30types", cat:"Stock",        icon:"🗄️", name:"Entrepôt Équipé",           desc:"Avoir 30 types de pièces en stock",         cond:s=>Object.values(s.parts??{}).filter(p=>p.qty>0).length>=30, reward:{rep:200,  money:25000,   talent:1} },
  { id:"part_bochmann",cat:"Stock",        icon:"🔵", name:"Qualité Allemande",         desc:"Commander des pièces Bochmann",             cond:s=>Object.values(s.parts??{}).some(p=>p.supplier==="bochmann"), reward:{rep:50,money:5000,talent:0} },
  { id:"part_slots3",  cat:"Stock",        icon:"🚛", name:"Flux Tendu",                desc:"Avoir 3 slots de livraison simultanés",     cond:s=>(s.upgrades?.find(u=>u.id==="slots_livraison")?.lvl??0)>=2, reward:{rep:30,money:3000,talent:0} },
  { id:"part_slots5",  cat:"Stock",        icon:"🚛", name:"Logisticien",               desc:"Avoir 5 slots de livraison simultanés",     cond:s=>(s.upgrades?.find(u=>u.id==="slots_livraison")?.lvl??0)>=4, reward:{rep:100,money:15000,talent:0} },
  { id:"part_norupture",cat:"Stock",       icon:"✅", name:"Zéro Rupture",              desc:"Avoir au moins 5 pièces de chaque type en stock (min 10 types)", cond:s=>{const vals=Object.values(s.parts??{});return vals.filter(p=>p.qty>=5).length>=10;}, reward:{rep:150,money:20000,talent:1} },
  { id:"part_auto_on",  cat:"Stock",       icon:"🤖", name:"Stock Pilote Auto",          desc:"Activer les commandes automatiques (Logiciel Stock niv.3)",       cond:s=>(s.upgrades?.find(u=>u.id==="logiciel_stock")?.lvl??0)>=3,  reward:{rep:200, money:30000,  talent:1} },
  { id:"part_topdrv10", cat:"Stock",       icon:"🔴", name:"Bonnes Affaires",            desc:"Avoir 3 types de pièces TopDrive en stock",             cond:s=>Object.values(s.parts??{}).filter(p=>p.supplier==="topdrive"&&p.qty>0).length>=3, reward:{rep:80,  money:5000,   talent:0} },
  { id:"part_val_10k",  cat:"Stock",       icon:"💰", name:"Stock de Valeur",            desc:"Avoir un stock de pièces valant plus de 10 000 € au total",       cond:s=>Object.values(s.parts??{}).reduce((a,p)=>a+(p.qty*(p.lastPrice??0)),0)>=10000,     reward:{rep:300, money:50000,  talent:1} },
  { id:"part_del_fast", cat:"Stock",       icon:"⚡", name:"Livraison Express",          desc:"Avoir au moins 1 slot de livraison actif (Slots Livraison niv.1)",         cond:s=>(s.upgrades?.find(u=>u.id==="slots_livraison")?.lvl??0)>=1,                                     reward:{rep:200, money:20000,  talent:1} },

  // ── AMÉLIORATIONS ────────────────────────────────────
  { id:"up_first",     cat:"Améliorations",icon:"📦", name:"Premier Investissement",   desc:"Acheter une première amélioration",         cond:s=>s.upgrades?.some(u=>u.lvl>0),                                reward:{rep:5,    money:0,       talent:0} },
  { id:"up_10",        cat:"Améliorations",icon:"📦", name:"Équipé",                   desc:"10 niveaux d'améliorations au total",        cond:s=>s.upgrades?.reduce((a,u)=>a+u.lvl,0)>=10,                    reward:{rep:25,   money:1000,    talent:0} },
  { id:"up_50",        cat:"Améliorations",icon:"🔩", name:"Garage Équipé",            desc:"50 niveaux d'améliorations au total",        cond:s=>s.upgrades?.reduce((a,u)=>a+u.lvl,0)>=50,                    reward:{rep:100,  money:8000,    talent:0} },
  { id:"up_100",       cat:"Améliorations",icon:"🔩", name:"Atelier Pro",              desc:"100 niveaux d'améliorations au total",       cond:s=>s.upgrades?.reduce((a,u)=>a+u.lvl,0)>=100,                   reward:{rep:300,  money:30000,   talent:1} },
  { id:"up_200",       cat:"Améliorations",icon:"🔩", name:"Maître des Outils",        desc:"200 niveaux d'améliorations au total",       cond:s=>s.upgrades?.reduce((a,u)=>a+u.lvl,0)>=200,                   reward:{rep:800,  money:100000,  talent:2} },
  { id:"up_vendeur",   cat:"Améliorations",icon:"👔", name:"Vendeur Recruté",          desc:"Embaucher le Vendeur Junior",               cond:s=>(s.upgrades?.find(u=>u.id==="vendeur")?.lvl??0)>=1,           reward:{rep:30,   money:3000,    talent:0} },
  { id:"up_meca",      cat:"Améliorations",icon:"🛠️", name:"Mécanicien Recruté",       desc:"Embaucher le Mécanicien",                   cond:s=>(s.upgrades?.find(u=>u.id==="mecanicien")?.lvl??0)>=1,        reward:{rep:50,   money:5000,    talent:0} },
  { id:"up_meca_max",  cat:"Améliorations",icon:"🛠️", name:"Mécanicien Expert",        desc:"Mécanicien niveau 10",                      cond:s=>(s.upgrades?.find(u=>u.id==="mecanicien")?.lvl??0)>=10,       reward:{rep:300,  money:50000,   talent:1} },
  { id:"up_franchise", cat:"Améliorations",icon:"🏢", name:"Franchisé",               desc:"Acheter la Franchise Régionale",            cond:s=>(s.upgrades?.find(u=>u.id==="franchise")?.lvl??0)>=1,         reward:{rep:200,  money:0,       talent:1} },
  { id:"up_logiciel",  cat:"Améliorations",icon:"💻", name:"Gestion Numérique",        desc:"Acheter le Logiciel Stock niveau 1",        cond:s=>(s.upgrades?.find(u=>u.id==="logiciel_stock")?.lvl??0)>=1,   reward:{rep:40,   money:3000,    talent:0} },

  // ── TALENTS ──────────────────────────────────────────
  { id:"tal_first",    cat:"Talents",      icon:"⭐", name:"Premier Don",              desc:"Dépenser 1 point de talent",                cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=1,         reward:{rep:10,   money:500,     talent:0} },
  { id:"tal_10",       cat:"Talents",      icon:"⭐", name:"Arbre Naissant",           desc:"10 rangs de talents dépensés",              cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=10,        reward:{rep:30,   money:2000,    talent:0} },
  { id:"tal_50",       cat:"Talents",      icon:"🌟", name:"Maîtrise Avancée",         desc:"50 rangs de talents dépensés",              cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=50,        reward:{rep:100,  money:10000,   talent:0} },
  { id:"tal_100",      cat:"Talents",      icon:"🌟", name:"Développement Total",      desc:"100 rangs de talents dépensés",             cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=100,       reward:{rep:300,  money:30000,   talent:1} },
  { id:"tal_200",      cat:"Talents",      icon:"💫", name:"Arbre Complet",            desc:"200 rangs de talents dépensés",             cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=200,       reward:{rep:1000, money:100000,  talent:1} },
  { id:"tal_max1",     cat:"Talents",      icon:"💫", name:"Spécialiste",              desc:"Maxer un talent à 20/20",                   cond:s=>Object.values(s.talents??{}).some(v=>v>=20),                  reward:{rep:500,  money:50000,   talent:1} },
  { id:"tal_max3",     cat:"Talents",      icon:"💫", name:"Expert Polyvalent",        desc:"Maxer 3 talents à 20/20",                   cond:s=>Object.values(s.talents??{}).filter(v=>v>=20).length>=3,      reward:{rep:2000, money:200000,  talent:2} },

  // ── PRESTIGE ─────────────────────────────────────────
  { id:"prestige_1",   cat:"Prestige",     icon:"🔄", name:"Renaissance",              desc:"Effectuer un premier prestige",             cond:s=>(s.prestigeCount??0)>=1,    reward:{rep:0,    money:0,       talent:2} },
  { id:"prestige_3",   cat:"Prestige",     icon:"🔄", name:"Cycle Maîtrisé",           desc:"Effectuer 3 prestiges",                     cond:s=>(s.prestigeCount??0)>=3,    reward:{rep:0,    money:0,       talent:3} },
  { id:"prestige_5",   cat:"Prestige",     icon:"🔄", name:"Phénix",                   desc:"Effectuer 5 prestiges",                     cond:s=>(s.prestigeCount??0)>=5,    reward:{rep:0,    money:0,       talent:5} },
  { id:"prestige_10",  cat:"Prestige",     icon:"♾️", name:"L'Éternel Recommencement", desc:"Effectuer 10 prestiges",                    cond:s=>(s.prestigeCount??0)>=10,   reward:{rep:0,    money:0,       talent:8} },
  { id:"heritage_5",   cat:"Prestige",     icon:"🏛️", name:"Héritage Solide",          desc:"Dépenser 5 points Héritage",                cond:s=>(s.heritageSpent??0)>=5,    reward:{rep:100,  money:10000,   talent:0} },
  { id:"heritage_15",  cat:"Prestige",     icon:"🏛️", name:"Maître du Passé",          desc:"Dépenser 15 points Héritage",               cond:s=>(s.heritageSpent??0)>=15,   reward:{rep:500,  money:50000,   talent:1} },
  { id:"heritage_30",  cat:"Prestige",     icon:"🏛️", name:"Dynastique",               desc:"Dépenser 30 points Héritage",               cond:s=>(s.heritageSpent??0)>=30,   reward:{rep:2000, money:200000,  talent:2} },

  // ── SHOWROOM ─────────────────────────────────────────
  { id:"show_1",       cat:"Showroom",     icon:"🚘", name:"Première Expo",            desc:"Avoir 1 voiture au showroom",               cond:s=>s.showroom?.length>=1,      reward:{rep:5,    money:0,     talent:0} },
  { id:"show_3",       cat:"Showroom",     icon:"🚘", name:"Petite Expo",              desc:"Avoir 3 voitures au showroom",              cond:s=>s.showroom?.length>=3,      reward:{rep:20,   money:1000,    talent:0} },
  { id:"show_full",    cat:"Showroom",     icon:"🏪", name:"Showroom Plein",           desc:"Remplir complètement le showroom",          cond:s=>s.showroom?.length>0&&s.showroom.length>=(s.showroomCap??3), reward:{rep:50,money:5000,talent:0} },
  { id:"show_S",       cat:"Showroom",     icon:"🏆", name:"Voiture de Prestige",      desc:"Avoir une voiture tier S au showroom",      cond:s=>s.showroom?.some(c=>c.tier==="S"),    reward:{rep:150,  money:15000,   talent:0} },
  { id:"show_SS",      cat:"Showroom",     icon:"🏆", name:"Supercar en Vitrine",      desc:"Avoir une voiture tier SS au showroom",     cond:s=>s.showroom?.some(c=>c.tier==="SS"),   reward:{rep:500,  money:60000,   talent:1} },
  { id:"show_SSS",     cat:"Showroom",     icon:"💎", name:"Hypercar Exposée",         desc:"Avoir une voiture tier SSS au showroom",    cond:s=>s.showroom?.some(c=>c.tier==="SSS"),  reward:{rep:2000, money:300000,  talent:2} },
  { id:"show_SSSp",    cat:"Showroom",     icon:"💎", name:"Mythique en Vitrine",      desc:"Avoir une voiture SSS+ au showroom",        cond:s=>s.showroom?.some(c=>c.tier==="SSS+"), reward:{rep:8000, money:2000000, talent:3} },

  // ── DIVERS ────────────────────────────────────────────
  { id:"session_1h",   cat:"Divers",       icon:"⏱️", name:"Joueur Assidu",            desc:"Jouer 1 heure sans interruption",                    cond:s=>Date.now()-(s.sessionStart??Date.now())>=3600000,            reward:{rep:0,   money:10000,    talent:0} },
  { id:"session_5h",   cat:"Divers",       icon:"⏱️", name:"Passionné",               desc:"Jouer 5 heures sans interruption",                   cond:s=>Date.now()-(s.sessionStart??Date.now())>=18000000,           reward:{rep:0,   money:50000,    talent:0} },
  { id:"save_first",   cat:"Divers",       icon:"💾", name:"Données Sécurisées",       desc:"Sauvegarder la partie",                     cond:s=>s._hasSaved===true,                                          reward:{rep:0,    money:0,     talent:0} },
  { id:"name_change",  cat:"Divers",       icon:"✏️", name:"Mon Garage, Mes Règles",  desc:"Renommer ton garage",                       cond:s=>s.garageName!=="Garage Turbo",                               reward:{rep:0,   money:0,     talent:0} },
  { id:"profile_set",  cat:"Divers",       icon:"👤", name:"Identité Établie",         desc:"Personnaliser ton profil",                  cond:s=>s.profile?.pseudo!=="Mécanicien"&&s.profile?.pseudo!=null,   reward:{rep:0,   money:0,     talent:0} },
  { id:"full_garage",  cat:"Divers",       icon:"🔥", name:"Garage Complet",           desc:"Remplir tous les emplacements",             cond:s=>{const occ=(s.active?1:0)+(s.queue?.length??0);return occ>0&&occ>=s.garageCap;}, reward:{rep:0,money:0,talent:0} },
  { id:"rich_repair",  cat:"Divers",       icon:"💸", name:"Réparer du Luxe",          desc:"Réparer une voiture de tier A ou +",        cond:s=>["A","S","SS","SSS","SSS+"].includes(s._lastRepairedTier??""),reward:{rep:50,   money:5000,    talent:0} },
  { id:"broke",        cat:"Divers",       icon:"😅", name:"Dans le Rouge",            desc:"Passer sous 10 €",                          cond:s=>s._wasBroke===true,                                          reward:{rep:0,    money:0,     talent:0} },


  // ── SPÉCIALISATIONS ──────────────────────────────────────────
  { id:"spec_first",    cat:"Prestige",     icon:"🎯", name:"Spécialiste",              desc:"Choisir une spécialisation pour la première fois",  cond:s=>s.specialization!=null,                                              reward:{rep:200,  money:20000,   talent:1} },
  { id:"spec_turbo",    cat:"Prestige",     icon:"🔧", name:"Atelier Turbo",            desc:"Choisir la spécialisation Atelier Turbo",           cond:s=>s.specialization==="turbo",                                         reward:{rep:100,  money:10000,   talent:0} },
  { id:"spec_prestige", cat:"Prestige",     icon:"💰", name:"Garage Prestige",          desc:"Choisir la spécialisation Garage Prestige",         cond:s=>s.specialization==="prestige",                                      reward:{rep:100,  money:10000,   talent:0} },
  { id:"spec_diag",     cat:"Prestige",     icon:"🔍", name:"Centre Diagnostic",        desc:"Choisir la spécialisation Centre Diagnostic",       cond:s=>s.specialization==="diag",                                          reward:{rep:100,  money:10000,   talent:0} },
  { id:"spec_log",      cat:"Prestige",     icon:"📦", name:"Logistique Pro",           desc:"Choisir la spécialisation Logistique Pro",          cond:s=>s.specialization==="logistique",                                    reward:{rep:100,  money:10000,   talent:0} },
  { id:"spec_rep",      cat:"Prestige",     icon:"⭐", name:"Réputation Légendaire",    desc:"Choisir la spécialisation Réputation Légendaire",   cond:s=>s.specialization==="rep",                                           reward:{rep:100,  money:10000,   talent:0} },

  // ── ÉQUIPE MID/LATE ──────────────────────────────────────────
  { id:"up_recept",     cat:"Améliorations",icon:"📋", name:"Réceptionnaire Recruté",  desc:"Embaucher le Réceptionnaire",                       cond:s=>(s.upgrades?.find(u=>u.id==="receptionnaire")?.lvl??0)>=1,          reward:{rep:100,  money:15000,   talent:0} },
  { id:"up_recept_max", cat:"Améliorations",icon:"📋", name:"Réceptionnaire Expert",   desc:"Réceptionnaire niveau 10",                          cond:s=>(s.upgrades?.find(u=>u.id==="receptionnaire")?.lvl??0)>=10,         reward:{rep:800,  money:200000,  talent:2} },
  { id:"up_vconf",      cat:"Améliorations",icon:"🤵", name:"Vendeur Confirmé Recruté",desc:"Embaucher le Vendeur Confirmé",                     cond:s=>(s.upgrades?.find(u=>u.id==="vendeur_confirme")?.lvl??0)>=1,        reward:{rep:150,  money:25000,   talent:0} },
  { id:"up_vconf_max",  cat:"Améliorations",icon:"🤵", name:"Vendeur Confirmé Expert", desc:"Vendeur Confirmé niveau 10",                        cond:s=>(s.upgrades?.find(u=>u.id==="vendeur_confirme")?.lvl??0)>=10,       reward:{rep:1000, money:300000,  talent:2} },
  { id:"up_mag_max",    cat:"Améliorations",icon:"📦", name:"Magasinier Expert",       desc:"Magasinier niveau 3 (maximum)",                     cond:s=>(s.upgrades?.find(u=>u.id==="magasinier")?.lvl??0)>=3,             reward:{rep:300,  money:60000,   talent:1} },
  { id:"up_log_max",    cat:"Améliorations",icon:"💻", name:"Logiciel Full Stock",     desc:"Logiciel Stock niveau 3 — commandes auto activées", cond:s=>(s.upgrades?.find(u=>u.id==="logiciel_stock")?.lvl??0)>=3,         reward:{rep:200,  money:30000,   talent:1} },
  { id:"up_appmax",     cat:"Améliorations",icon:"🔩", name:"Apprenti Chevronné",       desc:"Apprenti Mécanicien niveau 10",                                cond:s=>(s.upgrades?.find(u=>u.id==="apprenti")?.lvl??0)>=10,              reward:{rep:200,  money:30000,   talent:1} },
  { id:"up_vend_max",   cat:"Améliorations",icon:"👔", name:"Vendeur Senior",          desc:"Vendeur Junior au niveau maximum (10)",                          cond:s=>(s.upgrades?.find(u=>u.id==="vendeur")?.lvl??0)>=10,               reward:{rep:400,  money:80000,   talent:1} },

  // ── RÉPUTATION MID ───────────────────────────────────────────
  { id:"rep_5000",      cat:"Réputation",   icon:"🌟", name:"Personnalité Locale",     desc:"Atteindre 5 000 REP",                               cond:s=>s.rep>=5000,                                                          reward:{rep:0,    money:12000,   talent:0} },
  { id:"rep_25000",     cat:"Réputation",   icon:"💫", name:"Star Régionale",          desc:"Atteindre 25 000 REP",                              cond:s=>s.rep>=25000,                                                         reward:{rep:0,    money:100000,  talent:1} },
  { id:"rep_100000",    cat:"Réputation",   icon:"🔱", name:"Référence Nationale",     desc:"Atteindre 100 000 REP",                             cond:s=>s.rep>=100000,                                                        reward:{rep:0,    money:400000,  talent:1} },

  // ── VENTES MID ───────────────────────────────────────────────
  { id:"sell_7500",     cat:"Ventes",       icon:"🏁", name:"Grand Volume",            desc:"Vendre 7 500 voitures",                             cond:s=>s.carsSold>=7500,                                                     reward:{rep:1500, money:300000,  talent:1} },
  { id:"sell_25000",    cat:"Ventes",       icon:"👑", name:"Roi de la Vente",         desc:"Vendre 25 000 voitures",                            cond:s=>s.carsSold>=25000,                                                    reward:{rep:8000, money:2000000, talent:4} },

  // ── HÉRITAGE MID ─────────────────────────────────────────────
  { id:"heritage_8",    cat:"Prestige",     icon:"🏛️", name:"Héritage Accumulé",        desc:"Accumuler 8 points d'Héritage au total",            cond:s=>(s.heritagePoints??0)+(s.heritageSpent??0)>=8,                                         reward:{rep:500,  money:50000,   talent:1} },

  // ── ARGENT MID ───────────────────────────────────────────────
  { id:"money_5m",      cat:"Argent",       icon:"💎", name:"Cinq Millions",           desc:"Avoir 5 000 000 € en caisse",                       cond:s=>s.money>=5000000,                                                     reward:{rep:300,  money:0,       talent:1} },
  { id:"passive_250",   cat:"Argent",       icon:"📈", name:"Rente Sérieuse",          desc:"Atteindre 250 €/s de revenu passif",                cond:s=>s.moneyPerSec>=250,                                                   reward:{rep:200,  money:50000,   talent:0} },
  { id:"passive_2k",    cat:"Argent",       icon:"📊", name:"Pluie de Billets",        desc:"Atteindre 2 000 €/s de revenu passif",              cond:s=>s.moneyPerSec>=2000,                                                  reward:{rep:500,  money:100000,  talent:1} },
  { id:"earned_10m",    cat:"Argent",       icon:"🏦", name:"Dix Millions Gagnés",     desc:"Avoir gagné 10 000 000 € au total",                 cond:s=>(s.totalMoneyEarned??0)>=10000000,                                    reward:{rep:100,  money:0,       talent:0} },
  { id:"earned_1b",     cat:"Argent",       icon:"🏦", name:"Un Milliard Gagné",       desc:"Avoir gagné 1 000 000 000 € au total",              cond:s=>(s.totalMoneyEarned??0)>=1000000000,                                  reward:{rep:1000, money:0,       talent:2} },

  // ── ATELIER MID ──────────────────────────────────────────────
  { id:"auto_5ps",      cat:"Atelier",      icon:"🤖", name:"Atelier Semi-Auto",       desc:"Atteindre 5 s/s de réparation automatique",        cond:s=>(s.repairAuto??0)+(s.talentRepairAuto??0)>=5,                         reward:{rep:200,  money:20000,   talent:0} },
  { id:"auto_25ps",     cat:"Atelier",      icon:"🤖", name:"Atelier Avancé",          desc:"Atteindre 25 s/s de réparation automatique",       cond:s=>(s.repairAuto??0)+(s.talentRepairAuto??0)>=25,                        reward:{rep:1500, money:200000,  talent:2} },
  { id:"speed_4x",      cat:"Atelier",      icon:"⚡", name:"Sur-Régime",              desc:"Multiplicateur de vitesse ≥ 4×",                    cond:s=>(s.speedMult??1)*(s.talentSpeedMult??1)>=4,                           reward:{rep:1000, money:200000,  talent:2} },
  { id:"slots_7",       cat:"Atelier",      icon:"🅿️", name:"Grand Parking",           desc:"Avoir 7 emplacements garage",                       cond:s=>s.garageCap>=7,                                                       reward:{rep:120,  money:20000,   talent:0} },
  { id:"click_20000",   cat:"Atelier",      icon:"👊", name:"Mains Calleuses",         desc:"Effectuer 20 000 clics de réparation",              cond:s=>(s.totalClickRepairs??0)>=20000,                                      reward:{rep:200,  money:20000,   talent:0} },

  // ── DIAGNOSTIC MID ───────────────────────────────────────────
  { id:"diag_2500",     cat:"Diagnostic",   icon:"🔍", name:"Analyste Confirmé",       desc:"Effectuer 2 500 diagnostics",                       cond:s=>s.totalAnalyses>=2500,                                                reward:{rep:120,  money:8000,    talent:0} },
  { id:"diag_5000",     cat:"Diagnostic",   icon:"🧠", name:"Expert des Pannes",       desc:"Effectuer 5 000 diagnostics",                       cond:s=>s.totalAnalyses>=5000,                                                reward:{rep:300,  money:25000,   talent:1} },
  { id:"diag_reward_mid",cat:"Diagnostic",  icon:"💡", name:"Diagnostic Rentable",     desc:"Avoir +100 € par diagnostic",                       cond:s=>s.diagReward>=100,                                                    reward:{rep:150,  money:15000,   talent:0} },

  // ── STOCK MID ────────────────────────────────────────────────
  { id:"part_10types",  cat:"Stock",        icon:"📦", name:"Stock Équilibré",         desc:"Avoir 10 types de pièces en stock",                 cond:s=>Object.values(s.parts??{}).filter(p=>p.qty>0).length>=10,             reward:{rep:50,   money:5000,    talent:0} },
  { id:"part_val_50k",  cat:"Stock",        icon:"💰", name:"Stock Premium",           desc:"Avoir un stock de pièces valant plus de 50 000 €",  cond:s=>Object.values(s.parts??{}).reduce((a,p)=>a+(p.qty*(p.lastPrice??0)),0)>=50000, reward:{rep:500, money:80000, talent:1} },
  { id:"part_euroline", cat:"Stock",        icon:"🟢", name:"Vitesse Euroline",        desc:"Avoir des pièces Euroline en stock",                     cond:s=>Object.values(s.parts??{}).some(p=>p.supplier==="euroline"&&p.qty>0), reward:{rep:40, money:3000, talent:0} },
  { id:"part_slots7",   cat:"Stock",        icon:"🚛", name:"Réseau Express",          desc:"Avoir 7 slots de livraison simultanés",             cond:s=>(s.upgrades?.find(u=>u.id==="slots_livraison")?.lvl??0)>=6,          reward:{rep:200, money:30000,  talent:0} },

  // ── SHOWROOM MID ─────────────────────────────────────────────
  { id:"show_5",        cat:"Showroom",     icon:"🏪", name:"Beau Showroom",           desc:"Avoir 5 voitures au showroom simultanément",        cond:s=>s.showroom?.length>=5,                                                reward:{rep:80,   money:8000,    talent:0} },
  { id:"show_A",        cat:"Showroom",     icon:"🏆", name:"Voiture de Collection",   desc:"Avoir une voiture tier A au showroom",              cond:s=>s.showroom?.some(c=>c.tier==="A"),                                   reward:{rep:60,   money:5000,    talent:0} },
  { id:"show_cap7",     cat:"Showroom",     icon:"🏪", name:"Showroom Élargi",         desc:"Avoir 7 emplacements showroom",                     cond:s=>(s.showroomCap??3)+(s.talentShowroomSlots??0)>=7,                     reward:{rep:200,  money:40000,   talent:0} },

  // ── TALENTS MID ──────────────────────────────────────────────
  { id:"tal_t2_unlock", cat:"Talents",      icon:"🌟", name:"Tier 2 Débloqué",         desc:"Avoir un talent Tier 1 à 10 rangs ou plus",         cond:s=>["passive_1","sale_1","speed_1","click_1","diag_1"].some(id=>(s.talents?.[id]??0)>=10),  reward:{rep:150,  money:15000,   talent:0} },
  { id:"tal_tier3_unlock",cat:"Talents",    icon:"💫", name:"Tier 3 Débloqué",         desc:"Avoir un talent Tier 2 à 20 rangs (max)",           cond:s=>["passive_2","sale_2","speed_2","multi_repair_1","click_1","diag_2","diag_rep_1"].some(id=>(s.talents?.[id]??0)>=20),  reward:{rep:500,  money:60000,   talent:1} },

  // ── GARAGE MID ───────────────────────────────────────────────
  { id:"lvl_30",        cat:"Garage",       icon:"🏗️", name:"Garage en Croissance",    desc:"Atteindre le niveau 30",                            cond:s=>s.garageLevel>=30,                                                    reward:{rep:80,   money:20000,   talent:0} },
  { id:"lvl_125",       cat:"Garage",       icon:"🏢", name:"Mega Atelier",            desc:"Atteindre le niveau 125",                           cond:s=>s.garageLevel>=125,                                                   reward:{rep:1000, money:500000,  talent:2} },


  // ── DÉFIS JOURNALIERS ───────────────────────────────────────
  { id:"challenge_first", cat:"Défis",       icon:"📋", name:"Premier Défi",             desc:"Compléter un défi journalier pour la première fois",cond:s=>s.challenges?.list?.some(d=>d.claimed),                              reward:{rep:30,   money:3000,    talent:0} },
  { id:"challenge_all",   cat:"Défis",       icon:"🏆", name:"Journée Parfaite",         desc:"Compléter tous les défis du jour en une session",    cond:s=>s.challenges?.bonusClaimed===true,                                   reward:{rep:200,  money:20000,   talent:1} },
  { id:"challenge_5",     cat:"Défis",       icon:"📋", name:"Compétiteur Assidu",  desc:"Compléter le bonus journalier après au moins 1 prestige", cond:s=>s.challenges?.bonusClaimed===true&&(s.prestigeCount??0)>=1,                                  reward:{rep:500,  money:80000,   talent:1} },

  // ── CONTRATS PASSIFS ─────────────────────────────────────────
  { id:"deal_taxi",       cat:"Améliorations",icon:"🚕", name:"Contrat Taxi Signé",       desc:"Acheter le Contrat Taxi Local",                     cond:s=>(s.upgrades?.find(u=>u.id==="contrat_taxi")?.lvl??0)>=1,             reward:{rep:20,   money:2000,    talent:0} },
  { id:"deal_night",      cat:"Améliorations",icon:"🌙", name:"Atelier 24/7",             desc:"Acheter l'Atelier de Nuit",                         cond:s=>(s.upgrades?.find(u=>u.id==="atelier_nuit")?.lvl??0)>=1,             reward:{rep:80,   money:8000,    talent:0} },
  { id:"deal_showroom4",  cat:"Améliorations",icon:"🖼️", name:"Vitrine Maxée",            desc:"Acheter les 4 extensions showroom (11 emplacements total)", cond:s=>(s.upgrades?.find(u=>u.id==="showroom_slot")?.lvl??0)>=4,       reward:{rep:600,  money:150000,  talent:2} },

  // ── ÉQUIPE ───────────────────────────────────────────────────
  { id:"team_full_t1",    cat:"Améliorations",icon:"👥", name:"Équipe de Base",           desc:"Avoir Stagiaire + Apprenti + Vendeur Junior recrutés", cond:s=>["stagiaire","apprenti","vendeur"].every(id=>(s.upgrades?.find(u=>u.id===id)?.lvl??0)>=1),  reward:{rep:100,  money:10000,   talent:0} },
  { id:"team_full_t2",    cat:"Améliorations",icon:"👥", name:"Équipe Complète",          desc:"Avoir Mécanicien + Réceptionnaire + Vendeur Confirmé recrutés", cond:s=>["mecanicien","receptionnaire","vendeur_confirme"].every(id=>(s.upgrades?.find(u=>u.id===id)?.lvl??0)>=1), reward:{rep:500, money:100000, talent:2} },
  { id:"up_meca_5",       cat:"Améliorations",icon:"🛠️", name:"Mécanicien Aguerri",       desc:"Mécanicien niveau 5",                               cond:s=>(s.upgrades?.find(u=>u.id==="mecanicien")?.lvl??0)>=5,               reward:{rep:150,  money:25000,   talent:0} },
  { id:"up_stag_max",     cat:"Améliorations",icon:"🧑‍🔧",name:"Stagiaire Formé",          desc:"Stagiaire niveau 10 (maximum)",                     cond:s=>(s.upgrades?.find(u=>u.id==="stagiaire")?.lvl??0)>=10,               reward:{rep:200,  money:30000,   talent:1} },
  { id:"up_lift_max",     cat:"Améliorations",icon:"🅿️", name:"Parking Maxi",             desc:"Agrandissement Garage niveau 5 (5 emplacements achetés)", cond:s=>(s.upgrades?.find(u=>u.id==="lift")?.lvl??0)>=5,                  reward:{rep:300,  money:60000,   talent:1} },

  // ── HÉRITAGE PALIERS ─────────────────────────────────────────
  { id:"heritage_3",      cat:"Prestige",     icon:"🏛️", name:"Premiers Legs",            desc:"Dépenser 3 points Héritage",                        cond:s=>(s.heritageSpent??0)>=3,                                             reward:{rep:50,   money:5000,    talent:0} },
  { id:"heritage_20",     cat:"Prestige",     icon:"🏛️", name:"Héritage Épanoui",         desc:"Dépenser 20 points Héritage",                       cond:s=>(s.heritageSpent??0)>=20,                                            reward:{rep:800,  money:80000,   talent:1} },

  // ── SPÉCIALISATIONS AVANCÉES ─────────────────────────────────
  { id:"spec_all",        cat:"Prestige",     icon:"🎯", name:"Touche-à-Tout",            desc:"Effectuer 5 prestiges avec une spécialisation active", cond:s=>(s.prestigeCount??0)>=5&&s.specialization!=null,                               reward:{rep:2000, money:500000,  talent:3} },
  { id:"spec_diag_x3",    cat:"Prestige",     icon:"🔍", name:"Analyste Total",            desc:"Effectuer 3+ prestiges ET utiliser la spécia Diagnostic",  cond:s=>(s.prestigeCount??0)>=3&&s.specialization==="diag",             reward:{rep:1000, money:200000,  talent:2} },
  { id:"spec_turbo_x3",   cat:"Prestige",     icon:"🔧", name:"Turbo Légendaire",          desc:"Effectuer 3+ prestiges ET utiliser la spécia Atelier Turbo", cond:s=>(s.prestigeCount??0)>=3&&s.specialization==="turbo",          reward:{rep:1000, money:200000,  talent:2} },

  // ── VENTES PAR TIER ──────────────────────────────────────────
  { id:"sell_tier_B10",   cat:"Ventes",       icon:"🚙", name:"Spécialiste Sportives",    desc:"Vendre 10 voitures de tier B ou supérieur",         cond:s=>s.carsSold>=10&&s.rep>=5000, reward:{rep:80, money:8000, talent:0} },
  { id:"sell_tier_S10",   cat:"Ventes",       icon:"🏎️", name:"Collectionneur Prestige",  desc:"Vendre 10 voitures de tier S ou supérieur",         cond:s=>s.carsSold>=50&&s.rep>=25000, reward:{rep:300, money:60000, talent:1} },

  // ── ARGENT PALIERS FINS ──────────────────────────────────────
  { id:"money_2m",        cat:"Argent",       icon:"💎", name:"Deux Millions",            desc:"Avoir 2 000 000 € en caisse simultanément",         cond:s=>s.money>=2000000,                                                    reward:{rep:0,    money:0,       talent:0} },
  { id:"earned_50m",      cat:"Argent",       icon:"🏦", name:"Cinquante Millions Gagnés",desc:"Avoir gagné 50 000 000 € au total",                 cond:s=>(s.totalMoneyEarned??0)>=50000000,                                   reward:{rep:200,  money:0,       talent:1} },

  // ── RÉPUTATION PALIERS ───────────────────────────────────────
  { id:"rep_75000",       cat:"Réputation",   icon:"💫", name:"Référence Mondiale",       desc:"Atteindre 75 000 REP",                              cond:s=>s.rep>=75000,                                                        reward:{rep:0,    money:200000,  talent:1} },
  { id:"rep_1000",        cat:"Réputation",   icon:"⭐", name:"Garage Bien Connu",        desc:"Atteindre 1 000 REP",                               cond:s=>s.rep>=1000,                                                         reward:{rep:0,    money:500,     talent:0} },

  // ── GARAGE NIVEAUX FINS ──────────────────────────────────────
  { id:"lvl_40",          cat:"Garage",       icon:"🏗️", name:"Atelier en Forme",         desc:"Atteindre le niveau 40",                            cond:s=>s.garageLevel>=40,                                                   reward:{rep:100,  money:30000,   talent:0} },
  { id:"lvl_60",          cat:"Garage",       icon:"🏗️", name:"Vitesse de Croisière",     desc:"Atteindre le niveau 60",                            cond:s=>s.garageLevel>=60,                                                   reward:{rep:200,  money:80000,   talent:0} },

  // ── STOCK PALIERS FINS ───────────────────────────────────────
  { id:"part_orders10",   cat:"Stock",        icon:"📦", name:"Fournisseur Régulier",     desc:"Passer 10 commandes de pièces",                     cond:s=>(s.totalOrders??0)>=10,                                              reward:{rep:20,   money:1000,    talent:0} },
  { id:"part_orders100",  cat:"Stock",        icon:"📦", name:"Acheteur Sérieux",         desc:"Passer 100 commandes de pièces",                    cond:s=>(s.totalOrders??0)>=100,                                             reward:{rep:80,   money:8000,    talent:0} },
  { id:"part_orders1k",   cat:"Stock",        icon:"🗄️", name:"Central d'Achats",         desc:"Passer 1 000 commandes de pièces",                  cond:s=>(s.totalOrders??0)>=1000,                                            reward:{rep:300,  money:40000,   talent:1} },
  { id:"part_orders5k",   cat:"Stock",        icon:"🗄️", name:"Grossiste",               desc:"Passer 5 000 commandes de pièces",                  cond:s=>(s.totalOrders??0)>=5000,                                            reward:{rep:1000, money:150000,  talent:2} },
  { id:"part_20types",    cat:"Stock",        icon:"📦", name:"Catalogue Étendu",         desc:"Avoir 20 types de pièces en stock",                 cond:s=>Object.values(s.parts??{}).filter(p=>p.qty>0).length>=20,             reward:{rep:120,  money:15000,   talent:0} },
  { id:"part_allsupplier",cat:"Stock",        icon:"🔄", name:"Multi-Fournisseur",        desc:"Avoir des pièces des 3 fournisseurs en stock simultanément", cond:s=>{const sups=new Set(Object.values(s.parts??{}).filter(p=>p.qty>0).map(p=>p.supplier));return sups.has("bochmann")&&sups.has("euroline")&&sups.has("topdrive");}, reward:{rep:200, money:25000, talent:1} },

  // ── ATELIER PALIERS FINS ─────────────────────────────────────
  { id:"repair_250",      cat:"Atelier",      icon:"🔧", name:"En Rodage",               desc:"Effectuer 250 réparations",                         cond:s=>(s.totalRepairs??0)>=250,                                            reward:{rep:80,   money:8000,    talent:0} },
  { id:"repair_2500",     cat:"Atelier",      icon:"🔧", name:"Expert en Réparation",    desc:"Effectuer 2 500 réparations",                       cond:s=>(s.totalRepairs??0)>=2500,                                           reward:{rep:300,  money:30000,   talent:0} },
  { id:"auto_2ps",        cat:"Atelier",      icon:"🤖", name:"Premier Automatisme",     desc:"Atteindre 2 s/s de réparation automatique",        cond:s=>(s.repairAuto??0)+(s.talentRepairAuto??0)>=2,                         reward:{rep:50,   money:5000,    talent:0} },
  { id:"auto_100ps",      cat:"Atelier",      icon:"🤖", name:"Usine Fantôme",           desc:"Atteindre 100 s/s de réparation automatique",      cond:s=>(s.repairAuto??0)+(s.talentRepairAuto??0)>=100,                       reward:{rep:8000, money:2000000, talent:4} },

  // ── DIAGNOSTIC PALIERS FINS ──────────────────────────────────
  { id:"diag_250",        cat:"Diagnostic",   icon:"🔍", name:"Diagnostiqueur Actif",    desc:"Effectuer 250 diagnostics",                         cond:s=>s.totalAnalyses>=250,                                                reward:{rep:20,   money:500,     talent:0} },
  { id:"diag_reward_75",  cat:"Diagnostic",   icon:"💡", name:"Scan Rentable",           desc:"Avoir +75 € par diagnostic",                        cond:s=>s.diagReward>=75,                                                    reward:{rep:80,   money:8000,    talent:0} },

  // ── TALENTS PALIERS FINS ─────────────────────────────────────
  { id:"tal_5",           cat:"Talents",      icon:"⭐", name:"Premiers Talents",         desc:"5 rangs de talents dépensés",                       cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=5,                reward:{rep:0,    money:500,     talent:0} },
  { id:"tal_25",          cat:"Talents",      icon:"⭐", name:"Montée en Puissance",      desc:"25 rangs de talents dépensés",                      cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=25,               reward:{rep:20,   money:1000,    talent:0} },
  { id:"tal_max5",        cat:"Talents",      icon:"💫", name:"Maître Polyvalent",        desc:"Maxer 5 talents à leur rang maximum",               cond:s=>Object.values(s.talents??{}).filter(v=>v>=20).length>=5,             reward:{rep:3000, money:300000,  talent:2} },
  // ── VENTES CUMULÉES (toutes parties) ────────────────
  { id:"total_sold_500",  cat:"Ventes",       icon:"🚗", name:"Demi-Millier Cumulé",       desc:"Vendre 500 voitures au total (tous prestiges)",    cond:s=>(s.totalCarsSold??0)>=500,       reward:{rep:100,  money:10000,   talent:0} },
  { id:"total_sold_2k",   cat:"Ventes",       icon:"🚙", name:"Deux Mille Cumulés",        desc:"Vendre 2 000 voitures au total",                   cond:s=>(s.totalCarsSold??0)>=2000,      reward:{rep:300,  money:40000,   talent:1} },
  { id:"total_sold_10k",  cat:"Ventes",       icon:"🏎️", name:"Dix Mille Cumulés",        desc:"Vendre 10 000 voitures au total",                  cond:s=>(s.totalCarsSold??0)>=10000,     reward:{rep:800,  money:150000,  talent:2} },
  { id:"total_sold_50k",  cat:"Ventes",       icon:"🏁", name:"Cinquante Mille Cumulés",   desc:"Vendre 50 000 voitures au total",                  cond:s=>(s.totalCarsSold??0)>=50000,     reward:{rep:3000, money:800000,  talent:3} },
  { id:"total_sold_200k", cat:"Ventes",       icon:"👑", name:"Deux Cent Mille Cumulés",   desc:"Vendre 200 000 voitures au total",                 cond:s=>(s.totalCarsSold??0)>=200000,    reward:{rep:10000,money:3000000, talent:5} },

  // ── ARGENT CUMULÉ ────────────────────────────────────
  { id:"earned_500m",     cat:"Argent",       icon:"🏦", name:"Demi-Milliard Gagné",       desc:"Avoir gagné 500 000 000 € au total",               cond:s=>(s.totalMoneyEarned??0)>=500000000,    reward:{rep:1500, money:0,       talent:2} },
  { id:"earned_5b",       cat:"Argent",       icon:"🏦", name:"Cinq Milliards Gagnés",     desc:"Avoir gagné 5 000 000 000 € au total",             cond:s=>(s.totalMoneyEarned??0)>=5000000000,   reward:{rep:5000, money:0,       talent:3} },
  { id:"earned_50b",      cat:"Argent",       icon:"🏦", name:"Cinquante Milliards",       desc:"Avoir gagné 50 000 000 000 € au total",            cond:s=>(s.totalMoneyEarned??0)>=50000000000,  reward:{rep:15000,money:0,       talent:5} },
  { id:"passive_5k",      cat:"Argent",       icon:"📊", name:"Rente de Milliardaire",     desc:"Atteindre 5 000 €/s de revenu passif",             cond:s=>s.moneyPerSec>=5000,             reward:{rep:2000, money:500000,  talent:2} },
  { id:"passive_20k",     cat:"Argent",       icon:"📊", name:"Banque Centrale",           desc:"Atteindre 20 000 €/s de revenu passif",            cond:s=>s.moneyPerSec>=20000,            reward:{rep:8000, money:2000000, talent:4} },
  { id:"money_10b",       cat:"Argent",       icon:"💎", name:"Dix Milliards en Caisse",   desc:"Avoir 10 000 000 000 € en caisse",                 cond:s=>s.money>=10000000000,            reward:{rep:5000, money:0,       talent:3} },

  // ── RÉPUTATION HAUTE ────────────────────────────────
  { id:"rep_500k",        cat:"Réputation",   icon:"🔱", name:"Superstar Mondiale",        desc:"Atteindre 500 000 REP",                            cond:s=>s.rep>=500000,                   reward:{rep:0,    money:2000000, talent:3} },
  { id:"rep_1m",          cat:"Réputation",   icon:"🔱", name:"Dieu de l'Asphalte",        desc:"Atteindre 1 000 000 REP",                          cond:s=>s.rep>=1000000,                  reward:{rep:0,    money:5000000, talent:5} },
  { id:"rep_5m",          cat:"Réputation",   icon:"⚜️", name:"Intouchable",               desc:"Atteindre 5 000 000 REP",                          cond:s=>s.rep>=5000000,                  reward:{rep:0,    money:20000000,talent:8} },

  // ── NIVEAU GARAGE HIGH ───────────────────────────────
  { id:"lvl_200",         cat:"Garage",       icon:"🌆", name:"Méga Complexe",             desc:"Atteindre le niveau 200",                          cond:s=>s.garageLevel>=200,              reward:{rep:5000, money:2000000, talent:3} },
  { id:"lvl_300",         cat:"Garage",       icon:"🌇", name:"Maître du Garage",           desc:"Atteindre le niveau 175",                          cond:s=>s.garageLevel>=175,              reward:{rep:12000,money:5000000, talent:5} },

  // ── RÉPARATIONS CUMULÉES ────────────────────────────
  { id:"total_rep_5k",    cat:"Atelier",      icon:"🛠️", name:"Cinq Mille Réparations",   desc:"Effectuer 5 000 réparations au total",             cond:s=>(s.totalRepairs??0)>=5000,       reward:{rep:500,  money:100000,  talent:1} },
  { id:"total_rep_20k",   cat:"Atelier",      icon:"⚙️", name:"Vingt Mille Réparations",  desc:"Effectuer 20 000 réparations au total",            cond:s=>(s.totalRepairs??0)>=20000,      reward:{rep:2000, money:500000,  talent:2} },
  { id:"total_rep_100k",  cat:"Atelier",      icon:"⚙️", name:"Cent Mille Réparations",   desc:"Effectuer 100 000 réparations au total",           cond:s=>(s.totalRepairs??0)>=100000,     reward:{rep:8000, money:2000000, talent:5} },
  { id:"speed_5x",        cat:"Atelier",      icon:"🚀", name:"Vitesse Lumière",           desc:"Multiplicateur de vitesse ≥ 5×",                   cond:s=>(s.speedMult??1)*(s.talentSpeedMult??1)>=5,  reward:{rep:2000, money:500000,  talent:3} },
  { id:"speed_10x",       cat:"Atelier",      icon:"🚀", name:"Distorsion Temporelle",     desc:"Multiplicateur de vitesse ≥ 10×",                  cond:s=>(s.speedMult??1)*(s.talentSpeedMult??1)>=10, reward:{rep:8000, money:2000000, talent:5} },
  { id:"auto_10ps",       cat:"Atelier",      icon:"🤖", name:"Atelier Fantôme",           desc:"Atteindre 10 s/s de réparation automatique",       cond:s=>(s.repairAuto??0)+(s.talentRepairAuto??0)>=10,  reward:{rep:500,  money:50000,   talent:1} },
  { id:"auto_50ps",       cat:"Atelier",      icon:"🤖", name:"Intelligence Artificielle", desc:"Atteindre 50 s/s de réparation automatique",       cond:s=>(s.repairAuto??0)+(s.talentRepairAuto??0)>=50,  reward:{rep:3000, money:500000,  talent:3} },
  { id:"click_200k",      cat:"Atelier",      icon:"🥊", name:"Dieu du Clic",              desc:"Effectuer 200 000 clics de réparation",            cond:s=>(s.totalClickRepairs??0)>=200000,  reward:{rep:2000, money:200000,  talent:2} },
  { id:"click_1m",        cat:"Atelier",      icon:"🥊", name:"Millionnaire du Clic",      desc:"Effectuer 1 000 000 clics de réparation",          cond:s=>(s.totalClickRepairs??0)>=1000000, reward:{rep:8000, money:1000000, talent:4} },

  // ── DIAGNOSTIC CUMULÉ ───────────────────────────────
  { id:"total_diag_50k",  cat:"Diagnostic",   icon:"🧠", name:"Cinquante Mille Scans",     desc:"Effectuer 50 000 diagnostics au total",            cond:s=>(s.totalAnalyses??0)>=50000,     reward:{rep:2000, money:300000,  talent:2} },
  { id:"total_diag_200k", cat:"Diagnostic",   icon:"🧠", name:"Deux Cent Mille Scans",     desc:"Effectuer 200 000 diagnostics au total",           cond:s=>(s.totalAnalyses??0)>=200000,    reward:{rep:8000, money:1000000, talent:4} },
  { id:"diag_reward3",    cat:"Diagnostic",   icon:"💡", name:"Scanner Légendaire",        desc:"Avoir +500 € par diagnostic",                      cond:s=>s.diagReward>=500,               reward:{rep:1000, money:100000,  talent:2} },
  { id:"diag_reward4",    cat:"Diagnostic",   icon:"💡", name:"Oracle Mécanique",          desc:"Avoir +1 000 € par diagnostic",                    cond:s=>s.diagReward>=1000,              reward:{rep:5000, money:500000,  talent:4} },

  // ── STOCK HIGH END ───────────────────────────────────
  { id:"part_qty50",      cat:"Stock",        icon:"📦", name:"Entrepôt Débordant",        desc:"Avoir 50 unités d'une même pièce en stock",        cond:s=>Object.values(s.parts??{}).some(p=>p.qty>=50),   reward:{rep:500,  money:50000,   talent:1} },
  { id:"part_qty200",     cat:"Stock",        icon:"📦", name:"Revendeur Grossiste",       desc:"Avoir 200 unités d'une même pièce en stock",       cond:s=>Object.values(s.parts??{}).some(p=>p.qty>=200),  reward:{rep:2000, money:200000,  talent:2} },
  { id:"part_slots_max",  cat:"Stock",        icon:"🚛", name:"Hub Logistique",            desc:"Avoir 10 slots de livraison simultanés",           cond:s=>(s.upgrades?.find(u=>u.id==="slots_livraison")?.lvl??0)>=9, reward:{rep:500,money:80000,talent:1} },

  // ── ENTREPÔT ─────────────────────────────────────────
  { id:"warehouse_200",   cat:"Stock",        icon:"🏭", name:"Premier Entrepôt",          desc:"Atteindre 200 slots d'entrepôt",                   cond:s=>(s.upgrades?.find(u=>u.id==="etageres")?.lvl??0)*20+(s.upgrades?.find(u=>u.id==="rayonnage")?.lvl??0)*50>=100, reward:{rep:150,  money:15000,   talent:0} },
  { id:"warehouse_500",   cat:"Stock",        icon:"🏭", name:"Entrepôt Régional",         desc:"Atteindre 500 slots d'entrepôt",                   cond:s=>{const e=s.upgrades?.find(u=>u.id==="etageres")?.lvl??0;const r=s.upgrades?.find(u=>u.id==="rayonnage")?.lvl??0;const z=s.upgrades?.find(u=>u.id==="zone_logistique")?.lvl??0;return 100+e*20+r*50+z*100>=500;}, reward:{rep:500,  money:80000,   talent:1} },
  { id:"warehouse_1500",  cat:"Stock",        icon:"🤖", name:"Centre Logistique",         desc:"Atteindre 1 500 slots d'entrepôt",                  cond:s=>{const e=s.upgrades?.find(u=>u.id==="etageres")?.lvl??0;const r=s.upgrades?.find(u=>u.id==="rayonnage")?.lvl??0;const z=s.upgrades?.find(u=>u.id==="zone_logistique")?.lvl??0;const a=s.upgrades?.find(u=>u.id==="entrepot_auto")?.lvl??0;return 100+e*20+r*50+z*100+a*200>=1500;}, reward:{rep:2000, money:300000,  talent:2} },
  { id:"warehouse_max",   cat:"Stock",        icon:"🏗️", name:"Méga-Entrepôt",             desc:"Débloquer tous les upgrades entrepôt au maximum",   cond:s=>(s.upgrades?.find(u=>u.id==="etageres")?.lvl??0)>=10&&(s.upgrades?.find(u=>u.id==="rayonnage")?.lvl??0)>=10&&(s.upgrades?.find(u=>u.id==="zone_logistique")?.lvl??0)>=5&&(s.upgrades?.find(u=>u.id==="entrepot_auto")?.lvl??0)>=5, reward:{rep:5000, money:1000000, talent:3} },
  { id:"warehouse_full",  cat:"Stock",        icon:"⛔", name:"À Craquer",                 desc:"Remplir l'entrepôt à 100%",                         cond:s=>{const used=Object.values(s.parts??{}).reduce((a,p)=>a+(p.qty??0),0);const cap=100+(s.upgrades?.find(u=>u.id==="etageres")?.lvl??0)*20+(s.upgrades?.find(u=>u.id==="rayonnage")?.lvl??0)*50+(s.upgrades?.find(u=>u.id==="zone_logistique")?.lvl??0)*100+(s.upgrades?.find(u=>u.id==="entrepot_auto")?.lvl??0)*200+(s.talentWarehouseBonus??0);return used>=cap;}, reward:{rep:300, money:50000, talent:1} },
  { id:"warehouse_bonus", cat:"Stock",        icon:"💰", name:"Stock Payant",               desc:"Vendre une voiture avec Entrepôt Automatisé actif (niv.1+)", cond:s=>(s.upgrades?.find(u=>u.id==="entrepot_auto")?.lvl??0)>=1&&(s.carsSold??0)>=1, reward:{rep:200,  money:25000,   talent:0} },
  { id:"warehouse_talent",cat:"Stock",        icon:"📋", name:"Gestionnaire Confirmé",      desc:"Débloquer le perk Héritage Gestionnaire de Stock",          cond:s=>!!(s.heritagePerks?.log_gestion),              reward:{rep:400,  money:60000,   talent:1} },
  { id:"warehouse_logadv",cat:"Stock",        icon:"🏭", name:"Logisticien Expert",         desc:"Rang 10 du talent Logistique Avancée",               cond:s=>(s.talents??{}).logistique_avancee>=10, reward:{rep:1000, money:150000,  talent:2} },

  // ── PRESTIGE HIGH END ────────────────────────────────
  { id:"prestige_20",     cat:"Prestige",     icon:"♾️", name:"Cycle Infini",              desc:"Effectuer 20 prestiges",                           cond:s=>(s.prestigeCount??0)>=20,        reward:{rep:0,    money:0,       talent:15} },
  { id:"prestige_50",     cat:"Prestige",     icon:"♾️", name:"Au-Delà du Temps",          desc:"Effectuer 50 prestiges",                           cond:s=>(s.prestigeCount??0)>=50,        reward:{rep:0,    money:0,       talent:30} },
  { id:"heritage_50",     cat:"Prestige",     icon:"🏛️", name:"Maître Héritier",           desc:"Dépenser 50 points Héritage",                      cond:s=>(s.heritageSpent??0)>=50,        reward:{rep:5000, money:500000,  talent:4} },
  { id:"heritage_80",     cat:"Prestige",     icon:"⚜️", name:"Arbre Généalogique Complet",desc:"Dépenser 80 points Héritage",                      cond:s=>(s.heritageSpent??0)>=80,        reward:{rep:15000,money:2000000, talent:8} },

  // ── SHOWROOM HIGH END ────────────────────────────────
  { id:"show_cap10",      cat:"Showroom",     icon:"🏪", name:"Grand Showroom",            desc:"Avoir 10 emplacements showroom",                   cond:s=>(s.showroomCap??3)+(s.talentShowroomSlots??0)>=10,          reward:{rep:400,  money:80000,   talent:1} },
  { id:"show_sold_SSS",   cat:"Showroom",     icon:"💎", name:"Collectionneur d'Hypercars",desc:"Réparer et avoir eu une voiture SSS en showroom",  cond:s=>s._lastRepairedTier==="SSS"&&s.showroom?.some(c=>c.tier==="SSS"), reward:{rep:3000,money:500000,talent:2} },

  // ── AMÉLIORATIONS HIGH END ───────────────────────────
  { id:"up_300",          cat:"Améliorations",icon:"🔩", name:"Optimisation Totale",       desc:"300 niveaux d'améliorations au total",             cond:s=>s.upgrades?.reduce((a,u)=>a+u.lvl,0)>=300,  reward:{rep:2000, money:300000,  talent:2} },
  { id:"up_500",          cat:"Améliorations",icon:"💡", name:"Génie de la Mécanique",     desc:"500 niveaux d'améliorations au total",             cond:s=>s.upgrades?.reduce((a,u)=>a+u.lvl,0)>=500,  reward:{rep:8000, money:1000000, talent:4} },
  { id:"up_all_maxed",    cat:"Améliorations",icon:"🏆", name:"Maître Absolu",             desc:"Toutes les améliorations au niveau maximum",       cond:s=>s.upgrades?.filter(u=>u.maxLvl).every(u=>u.lvl>=(u.maxLvl??0)), reward:{rep:5000,money:2000000,talent:6} },

  // ── TALENTS HIGH END ─────────────────────────────────
  { id:"tal_300",         cat:"Talents",      icon:"🌟", name:"Transcendance",             desc:"300 rangs de talents dépensés",                    cond:s=>Object.values(s.talents??{}).reduce((a,v)=>a+v,0)>=300,  reward:{rep:3000, money:500000,  talent:2} },
  { id:"tal_max_all",     cat:"Talents",      icon:"💫", name:"Maîtrise Totale",           desc:"Maxer les 22 talents à leur rang maximum",         cond:s=>{const t=s.talents??{};return ["passive_1","sale_1","speed_1","rep_1"].every(id=>(t[id]??0)>=20)&&["passive_2","sale_2","speed_2","click_1","multi_repair_1","diag_2","diag_rep_1"].every(id=>(t[id]??0)>=20)&&(t["showroom_1"]??0)>=10&&(t["parts_1"]??0)>=20&&["rare_bonus_1","parts_2","diag_1","diag_3","sale_mult_1","repair_bonus_1","repair_mult_1"].every(id=>(t[id]??0)>=20)&&(t["passive_3"]??0)>=10;}, reward:{rep:20000,money:10000000,talent:10} },

  // ── COMBOS & DÉFIS ───────────────────────────────────
  { id:"combo_rich_fast", cat:"Défis",        icon:"⚡", name:"Riche et Rapide",           desc:"Avoir 1M€ ET vitesse ≥ 3× en même temps",         cond:s=>s.money>=1000000&&(s.speedMult??1)*(s.talentSpeedMult??1)>=3,                        reward:{rep:500,  money:0,       talent:1} },
  { id:"combo_full_boch", cat:"Défis",        icon:"🔵", name:"Full Bochmann",             desc:"Avoir 20 pièces différentes en stock Bochmann",    cond:s=>Object.values(s.parts??{}).filter(p=>p.supplier==="bochmann"&&p.qty>0).length>=20, reward:{rep:1000, money:200000,  talent:2} },
  { id:"combo_no_click",  cat:"Défis",        icon:"🤝", name:"Le Patron ne Touche Plus",  desc:"Avoir 20+ s/s répa auto ET réputation 10 000+",   cond:s=>(s.repairAuto??0)+(s.talentRepairAuto??0)>=20&&s.rep>=10000,                        reward:{rep:0,    money:500000,  talent:2} },
  { id:"combo_tier_speed",cat:"Défis",        icon:"🏁", name:"Turbo Légendaire",          desc:"Avoir réparé une SSS+ ET vitesse ≥ 5×",           cond:s=>s._lastRepairedTier==="SSS+"&&(s.speedMult??1)*(s.talentSpeedMult??1)>=5,           reward:{rep:5000, money:1000000, talent:4} },
  { id:"combo_diag_pass", cat:"Défis",        icon:"📡", name:"Machine à Diagnostics",     desc:"Avoir 500€/diag ET 500€/s passif",                 cond:s=>s.diagReward>=500&&s.moneyPerSec>=500,                                              reward:{rep:2000, money:300000,  talent:2} },
  { id:"combo_prestige_ss",cat:"Défis",       icon:"🔄", name:"Prestige de Luxe",          desc:"Effectuer un prestige avec tier SS débloqué",      cond:s=>(s.prestigeCount??0)>=1&&s.rep>=70000,                                              reward:{rep:0,    money:500000,  talent:2} },

  // ── SESSIONS LONGUES ─────────────────────────────────
  { id:"session_24h",     cat:"Divers",       icon:"🌙", name:"Nuit Blanche",              desc:"Jouer 24 heures sans interruption",                         cond:s=>Date.now()-(s.sessionStart??Date.now())>=86400000,   reward:{rep:0,  money:50000,   talent:1} },
  { id:"session_100h",    cat:"Divers",       icon:"🏆", name:"Vétéran",                   desc:"Jouer 100 heures sans interruption",                        cond:s=>Date.now()-(s.sessionStart??Date.now())>=360000000,  reward:{rep:0, money:500000,  talent:2} },

  // ── Nouveaux upgrades Outils prestige ──────────────────────────────────────
  { id:"up_scanner_pro",     cat:"Améliorations", icon:"🔬", name:"Scanner de Précision",    desc:"Acheter Scanner Pro X",                                    cond:s=>s.upgrades?.find(u=>u.id==="scanner_pro")?.lvl>=1,                                          reward:{rep:500,  money:100000, talent:1} },
  { id:"up_scanner_max",     cat:"Améliorations", icon:"🔬", name:"Œil de l'Expert",         desc:"Scanner Pro X au niveau maximum (niv.3)",                  cond:s=>s.upgrades?.find(u=>u.id==="scanner_pro")?.lvl>=3,                                          reward:{rep:2000, money:500000, talent:2} },
  { id:"up_cle_dyna",        cat:"Améliorations", icon:"🔩", name:"Poigne de Fer",            desc:"Acheter la Clé Dynamométrique",                            cond:s=>s.upgrades?.find(u=>u.id==="cle_dynamometrique")?.lvl>=1,                                   reward:{rep:500,  money:150000, talent:1} },
  { id:"up_turbo",           cat:"Améliorations", icon:"🚀", name:"Boost Turbo",              desc:"Acheter le Turbocompresseur",                              cond:s=>s.upgrades?.find(u=>u.id==="turbocompresseur")?.lvl>=1,                                     reward:{rep:500,  money:150000, talent:1} },
  { id:"up_turbo_5",         cat:"Améliorations", icon:"🚀", name:"Mécanicien Supersonique",  desc:"Turbocompresseur niveau 5",                                cond:s=>s.upgrades?.find(u=>u.id==="turbocompresseur")?.lvl>=5,                                     reward:{rep:3000, money:800000, talent:3} },

  // ── Nouveaux upgrades Équipe prestige ───────────────────────────────────────
  { id:"up_vendeur_expert",  cat:"Améliorations", icon:"🏆", name:"Force de Vente",           desc:"Acheter le Vendeur Expert",                                cond:s=>s.upgrades?.find(u=>u.id==="vendeur_expert")?.lvl>=1,                                       reward:{rep:800,  money:200000, talent:1} },
  { id:"up_ia_diag",         cat:"Améliorations", icon:"🤖", name:"Intelligence Artificielle",desc:"Acheter l'IA Diagnostic",                                  cond:s=>s.upgrades?.find(u=>u.id==="ia_diagnostic")?.lvl>=1,                                        reward:{rep:800,  money:200000, talent:1} },
  { id:"up_chef_atelier",    cat:"Améliorations", icon:"👑", name:"Chef des Chefs",           desc:"Acheter le Chef d'Atelier",                                cond:s=>s.upgrades?.find(u=>u.id==="chef_atelier")?.lvl>=1,                                         reward:{rep:1000, money:300000, talent:1} },
  { id:"up_chef_max",        cat:"Améliorations", icon:"👑", name:"Usine à Réparer",          desc:"Chef d'Atelier au niveau maximum (niv.5)",                 cond:s=>s.upgrades?.find(u=>u.id==="chef_atelier")?.lvl>=5,                                         reward:{rep:5000, money:1500000,talent:3} },

  // ── Nouveaux upgrades Affaires prestige ─────────────────────────────────────
  { id:"up_reseau_nat",      cat:"Améliorations", icon:"💼", name:"Expansion Nationale",      desc:"Acheter le Réseau National",                               cond:s=>s.upgrades?.find(u=>u.id==="reseau_national")?.lvl>=1,                                      reward:{rep:600,  money:200000, talent:1} },
  { id:"up_holding",         cat:"Améliorations", icon:"🏦", name:"Magnat de l'Auto",         desc:"Acheter la Holding Automobile",                            cond:s=>s.upgrades?.find(u=>u.id==="holding_auto")?.lvl>=1,                                         reward:{rep:1500, money:500000, talent:2} },
  { id:"up_galerie_max",     cat:"Améliorations", icon:"🏬", name:"Empire du Showroom",       desc:"Galerie Marchande au niveau maximum (niv.4)",              cond:s=>s.upgrades?.find(u=>u.id==="galerie_marchande")?.lvl>=4,                                    reward:{rep:2000, money:600000, talent:2} },
  { id:"up_ext_atelier_max", cat:"Améliorations", icon:"🔧", name:"Maître des Lieux",         desc:"Extension Atelier au niveau maximum (niv.4)",              cond:s=>s.upgrades?.find(u=>u.id==="extension_atelier")?.lvl>=4,                                    reward:{rep:2000, money:600000, talent:2} },

  // ── Succès combinés ──────────────────────────────────────────────────────────
  { id:"combo_arsenal",      cat:"Défis",         icon:"🎯", name:"Arsenal Complet",          desc:"Posséder Scanner Pro X + Clé Dynamométrique + Turbocompresseur",cond:s=>s.upgrades?.find(u=>u.id==="scanner_pro")?.lvl>=1&&s.upgrades?.find(u=>u.id==="cle_dynamometrique")?.lvl>=1&&s.upgrades?.find(u=>u.id==="turbocompresseur")?.lvl>=1, reward:{rep:3000, money:1000000,talent:3} },
  { id:"combo_pdg",          cat:"Défis",         icon:"👑", name:"PDG",                      desc:"Posséder Réseau National + Holding + Galerie Marchande + Extension Atelier", cond:s=>["reseau_national","holding_auto","galerie_marchande","extension_atelier"].every(id=>s.upgrades?.find(u=>u.id===id)?.lvl>=1),                              reward:{rep:5000, money:2000000,talent:4} },
];

// =====================
// TITRES DÉBLOQUABLES
// =====================
const UNLOCKABLE_TITLES = [
  // ── Prestige ──────────────────────────────────────────────────────────────
  { id:"title_p5",       label:"🔧 Vétéran",          color:"#31d6ff",
    desc:"Effectuer 5 prestiges",
    cond:s=>(s.prestigeCount??0)>=5 },
  { id:"title_p10",      label:"⭐ Expert",             color:"#a78bfa",
    desc:"Effectuer 10 prestiges",
    cond:s=>(s.prestigeCount??0)>=10 },
  { id:"title_p25",      label:"🏆 Maître Mécanicien",  color:"#ffc83a",
    desc:"Effectuer 25 prestiges",
    cond:s=>(s.prestigeCount??0)>=25 },
  { id:"title_p50",      label:"👑 LÉGENDE",            color:"#ff8c40",
    desc:"Effectuer 50 prestiges",
    cond:s=>(s.prestigeCount??0)>=50 },
  { id:"title_p100",     label:"♾️ Éternel",            color:"#ffc83a",
    desc:"Effectuer 100 prestiges",
    cond:s=>(s.prestigeCount??0)>=100 },
  // ── Exploits ─────────────────────────────────────────────────────────────
  { id:"title_speed",    label:"⚡ Turbo Mécano",        color:"#31d6ff",
    desc:"Vitesse de réparation ≥ 10×",
    cond:s=>((s.speedMult??1)*(s.talentSpeedMult??1))>=10 },
  { id:"title_rich",     label:"💰 Magnat",              color:"#ffc83a",
    desc:"100 000 000€ gagnés en cumulé",
    cond:s=>(s.totalMoneyEarned??0)>=100000000 },
  { id:"title_diag",     label:"🔍 Analyste Suprême",    color:"#2ee59d",
    desc:"10 000 diagnostics effectués",
    cond:s=>(s.totalAnalyses??0)>=10000 },
  { id:"title_seller",   label:"🚗 Vendeur de l'Année",  color:"#ff8c40",
    desc:"5 000 véhicules vendus en cumulé",
    cond:s=>(s.totalCarsSold??0)>=5000 },
  { id:"title_sss",      label:"💎 Chasseur d'Élite",    color:"#ff4d70",
    desc:"Avoir réparé un SSS+ et 500 réparations au total",
    cond:s=>s.bestTier==="SSS+"&&(s.totalRepairs??0)>=500 },
  { id:"title_heritage", label:"🏛️ Héritier Suprême",   color:"#a78bfa",
    desc:"Dépenser 150 points Héritage",
    cond:s=>(s.heritageSpent??0)>=150 },
  { id:"title_collector",label:"🎖️ Collectionneur",     color:"#a78bfa",
    desc:"Débloquer 80% des succès",
    cond:s=>{const tot=typeof ACHIEVEMENTS!=="undefined"?ACHIEVEMENTS.length:1;const have=Object.values(s.achievements??{}).filter(Boolean).length;return tot>0&&have/tot>=0.8;} },
  { id:"title_dualspec", label:"⚡ Double Expert",        color:"#31d6ff",
    desc:"Double Spécialisation active (P40)",
    cond:s=>s.heritageBonuses?.dualSpec===true },
  { id:"title_chef_max", label:"👑 Chef des Chefs",       color:"#ff8c40",
    desc:"Chef d'Atelier niveau maximum (niv.5)",
    cond:s=>s.upgrades?.find(u=>u.id==="chef_atelier")?.lvl>=5 },
  { id:"title_arsenal",  label:"🎯 Arsehal Complet",      color:"#2ee59d",
    desc:"Scanner Pro X + Clé Dyna + Turbocompresseur",
    cond:s=>["scanner_pro","cle_dynamometrique","turbocompresseur"].every(id=>s.upgrades?.find(u=>u.id===id)?.lvl>=1) },
];

function getUnlockedTitles(){ return UNLOCKABLE_TITLES.filter(t=>t.cond(state)); }
function getTitleById(id){ return UNLOCKABLE_TITLES.find(t=>t.id===id)??null; }

// State des succès (débloqués)
if(!state.achievements) state.achievements = {};
if(!state._hasSaved)    state._hasSaved    = false;
if(!state._wasBroke)    state._wasBroke    = false;
if(!state._lastRepairedTier) state._lastRepairedTier = "";

let _achPopupQueue   = [];
let _achPopupShowing = false;
let _achNotifsEnabled = (() => { try { return localStorage.getItem("garage_ach_notifs") !== "false"; } catch(e){ return true; } })();

function updateAchNotifBtn(){
  const btn = document.getElementById("btnToggleAchNotif");
  if(!btn) return;
  if(_achNotifsEnabled){
    btn.textContent = "🔔 Notifs";
    btn.style.opacity = "0.8";
    btn.style.borderColor = "rgba(49,214,255,.25)";
  } else {
    btn.textContent = "🔕 Notifs";
    btn.style.opacity = "0.45";
    btn.style.borderColor = "rgba(255,90,90,.25)";
  }
}

document.getElementById("btnToggleAchNotif")?.addEventListener("click", () => {
  _achNotifsEnabled = !_achNotifsEnabled;
  try { localStorage.setItem("garage_ach_notifs", _achNotifsEnabled); } catch(e){}
  updateAchNotifBtn();
});

// Init bouton au chargement
updateAchNotifBtn();

// Liste des succès pas encore débloqués — se réduit dynamiquement
let _pendingAchievements = null;
function resetPendingAchievements(){
  _pendingAchievements = ACHIEVEMENTS.filter(a => !state.achievements?.[a.id]);
}

function checkAchievements(){
  // Mise à jour flags spéciaux
  if((state.money??0) < 10 && (state.carsSold??0) > 0) state._wasBroke = true;

  // Init lazy si besoin
  if(!_pendingAchievements) resetPendingAchievements();

  const unlocked = [];
  for(const ach of _pendingAchievements){
    try {
      if(!ach.cond(state)) continue;
    } catch(e){ continue; }

    // Débloquer
    state.achievements[ach.id] = Date.now();
    unlocked.push(ach.id);

    // Appliquer récompenses
    if(ach.reward.rep)    state.rep    += ach.reward.rep;
    if(ach.reward.money){
      state.money += ach.reward.money;
      state.totalMoneyEarned = (state.totalMoneyEarned ?? 0) + ach.reward.money;
    }
    if(ach.reward.talent) state.talentPoints += ach.reward.talent;

    // Ajouter à la queue de popup seulement si notifs activées
    if(_achNotifsEnabled){
      _achPopupQueue.push(ach);
      showNextAchievementPopup();
    }
  }

  // Purger les succès débloqués de la liste pending
  if(unlocked.length > 0){
    _pendingAchievements = _pendingAchievements.filter(a => !state.achievements[a.id]);
  }
}

function showNextAchievementPopup(){
  if(_achPopupShowing || _achPopupQueue.length === 0) return;
  const ach = _achPopupQueue.shift();
  _achPopupShowing = true;

  const popup    = document.getElementById("achievementPopup");
  const iconEl   = document.getElementById("popupIcon");
  const nameEl   = document.getElementById("popupName");
  const rewardEl = document.getElementById("popupReward");

  iconEl.textContent = ach.icon;
  nameEl.textContent = ach.name;

  // Rebuild reward pills
  rewardEl.innerHTML = "";
  if(ach.reward.rep){
    const p = document.createElement("span");
    p.className = "achievementPopup__rewardPill achievementPopup__rewardPill--rep";
    p.textContent = `+${ach.reward.rep} REP`;
    rewardEl.appendChild(p);
  }
  if(ach.reward.money){
    const p = document.createElement("span");
    p.className = "achievementPopup__rewardPill achievementPopup__rewardPill--money";
    p.textContent = `+${formatMoney(ach.reward.money)}`;
    rewardEl.appendChild(p);
  }
  if(ach.reward.talent){
    const p = document.createElement("span");
    p.className = "achievementPopup__rewardPill achievementPopup__rewardPill--talent";
    p.textContent = `+${ach.reward.talent} talent${ach.reward.talent>1?"s":""}`;
    rewardEl.appendChild(p);
  }
  if(!ach.reward.rep && !ach.reward.money && !ach.reward.talent){
    const p = document.createElement("span");
    p.className = "achievementPopup__rewardPill achievementPopup__rewardPill--rep";
    p.textContent = "Cosmétique";
    rewardEl.appendChild(p);
  }

  // Reset sweep animation
  const sweep = popup.querySelector(".achievementPopup__sweep");
  if(sweep){ sweep.style.animation="none"; void sweep.offsetWidth; sweep.style.animation=""; }
  const fill = document.getElementById("popupProgressFill");
  if(fill){ fill.style.animation="none"; void fill.offsetWidth; fill.style.animation="achDrain 3.5s linear forwards"; }

  popup.style.display = "flex";
  requestAnimationFrame(() => popup.classList.add("achievementPopup--show"));

  // V2 — Confetti pour les succès prestige et tier SSS+
  if(typeof confetti !== "undefined"){
    const isGold = ach.cat === "Prestige" || ach.id === "tier_SSSp" || ach.reward.talent >= 3;
    if(isGold){
      setTimeout(() => confetti({
        particleCount: 100, spread: 70, origin: { y: 0.35 },
        colors: ["#ffc83a","#ff8c40","#ffffff","#a07aff"]
      }), 100);
    }
  }

  setTimeout(() => {
    popup.classList.remove("achievementPopup--show");
    setTimeout(() => {
      popup.style.display = "none";
      _achPopupShowing = false;
      showNextAchievementPopup();
    }, 350);
  }, 3500);
}

// P2 — Popup de milestone (niveaux marquants)
const MILESTONE_LABELS = {
  10:  { icon:"🏠", label:"Garage Opérationnel",  color:"#48c78e" },
  25:  { icon:"🏗️", label:"Expansion Majeure",     color:"#7ab0ff" },
  50:  { icon:"🏗️", label:"Centre Auto",           color:"#a07aff" },
  75:  { icon:"🏢", label:"Groupe Automobile",      color:"#ffc83a" },
  100: { icon:"🏢", label:"Complexe Automobile",    color:"#ff8c40" },
  150: { icon:"🌆", label:"Empire Industriel",      color:"#ff4d70" },
  200: { icon:"👑", label:"Légende de l'Asphalte",  color:"#ffffff" },
};

function showMilestonePopup(level){
  const m = MILESTONE_LABELS[level];
  if(!m) return;
  // Réutilise le popup achievement existant avec un style spécial
  const popup = document.getElementById("achievementPopup");
  if(!popup || _achPopupShowing) return;
  _achPopupShowing = true;

  const iconEl    = document.getElementById("popupIcon");
  const nameEl    = document.getElementById("popupName");
  const descEl    = document.getElementById("popupDesc");
  const rewardEl  = document.getElementById("popupRewards");
  if(iconEl)   iconEl.textContent  = m.icon;
  if(nameEl){  nameEl.textContent  = `Niveau ${level} !`; nameEl.style.color = m.color; }
  if(descEl)   descEl.textContent  = m.label;
  if(rewardEl){ rewardEl.innerHTML = `<span class="achievementPopup__rewardPill" style="background:${m.color}22;color:${m.color};border:1px solid ${m.color}44">🏆 Jalon atteint</span>`; }

  const sweep = popup.querySelector(".achievementPopup__sweep");
  if(sweep){ sweep.style.animation="none"; void sweep.offsetWidth; sweep.style.animation=""; }
  const fill = document.getElementById("popupProgressFill");
  if(fill){ fill.style.animation="none"; void fill.offsetWidth; fill.style.animation="achDrain 3.5s linear forwards"; }

  // V2 — Confetti sur les milestones
  if(typeof confetti !== "undefined"){
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.3 }, colors: [m.color, "#ffffff", "#ffc83a"] });
  }

  popup.style.display = "flex";
  requestAnimationFrame(() => popup.classList.add("achievementPopup--show"));
  setTimeout(() => {
    popup.classList.remove("achievementPopup--show");
    setTimeout(() => {
      popup.style.display = "none";
      _achPopupShowing = false;
      if(nameEl) nameEl.style.color = ""; // reset couleur
      showNextAchievementPopup();
    }, 350);
  }, 3500);
}

// Modal succès
let _achFilter = "Tous";

function openAchievementsModal(){
  const modal = document.getElementById("achievementsModal");
  if(!modal) return;
  renderAchievementsUI();
  modal.style.display = "block";
}
function closeAchievementsModal(){
  document.getElementById("achievementsModal").style.display = "none";
}

function renderAchievementsUI(){
  const grid      = document.getElementById("achievementGrid");
  const filters   = document.getElementById("achievementFilters");
  const countEl   = document.getElementById("achievementCount");
  const barEl     = document.getElementById("achProgressBar");
  const fracEl    = document.getElementById("achFraction");
  if(!grid) return;

  const unlocked = Object.keys(state.achievements).length;
  const total    = ACHIEVEMENTS.length;
  const pct      = total > 0 ? Math.round(unlocked / total * 100) : 0;

  if(countEl) countEl.textContent = `${unlocked} / ${total} débloqués`;
  if(barEl)   barEl.style.width   = `${pct}%`;
  if(fracEl)  fracEl.textContent  = `${pct}%`;

  // Filtres onglets
  const cats = ["Tous", ...new Set(ACHIEVEMENTS.map(a=>a.cat))];
  filters.innerHTML = cats.map(c => {
    const catUnlocked = ACHIEVEMENTS.filter(a=>a.cat===c&&state.achievements[a.id]).length;
    const catTotal    = ACHIEVEMENTS.filter(a=>a.cat===c).length;
    const label = c === "Tous" ? `Tous (${unlocked}/${total})` : `${c} ${catUnlocked}/${catTotal}`;
    return `<button class="achFilter${c===_achFilter?" achFilter--active":""}" data-cat="${c}">${label}</button>`;
  }).join("");
  filters.querySelectorAll(".achFilter").forEach(btn => {
    btn.addEventListener("click", () => { _achFilter = btn.dataset.cat; renderAchievementsUI(); });
  });

  // Cartes — débloquées en premier, puis par catégorie
  const list   = _achFilter === "Tous" ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a=>a.cat===_achFilter);
  const sorted = [...list].sort((a,b) => {
    const ua = state.achievements[a.id] ? 1 : 0;
    const ub = state.achievements[b.id] ? 1 : 0;
    return ub - ua;
  });

  grid.innerHTML = sorted.map(ach => {
    const isUnlocked = !!state.achievements[ach.id];
    const rewardParts = [];
    if(ach.reward.rep)    rewardParts.push(`+${ach.reward.rep} REP`);
    if(ach.reward.money)  rewardParts.push(`+${formatMoney(ach.reward.money)}`);
    if(ach.reward.talent) rewardParts.push(`+${ach.reward.talent} pt talent`);
    const rewardStr = rewardParts.join(" · ") || "Cosmétique";

    return `<div class="achCard ${isUnlocked?"achCard--unlocked":"achCard--locked"}">
      <div class="achCard__iconWrap">${ach.icon}</div>
      <div class="achCard__body">
        <div class="achCard__name">${ach.name}</div>
        <div class="achCard__desc">${ach.desc}</div>
        <div class="achCard__reward">${rewardStr}</div>
      </div>
      <div class="achCard__check">${isUnlocked ? "✅" : "🔒"}</div>
    </div>`;
  }).join("");
}

// Listeners
