// =====================
// AIDE & TUTORIEL
// =====================

const HELP_SECTIONS = {
  intro: {
    title: "🏁 Bienvenue dans Garage Turbo",
    content: `
      <div class="helpSection">
        <p class="helpLead">Tu gères un garage automobile idle. L'objectif : réparer des voitures, les vendre, gagner de la réputation et devenir une légende de la mécanique.</p>
        <div class="helpBlock">
          <div class="helpBlock__title">🔄 La boucle de jeu</div>
          <div class="helpBlock__steps">
            <div class="helpStep"><span class="helpStep__num">1</span><div><b>Diagnostique</b> une voiture via ANALYSER → elle entre en file et tu gagnes de l'argent immédiatement.</div></div>
            <div class="helpStep"><span class="helpStep__num">2</span><div><b>Répare</b> la voiture (clic manuel ou automatique) jusqu'à ce qu'elle soit prête.</div></div>
            <div class="helpStep"><span class="helpStep__num">3</span><div>La voiture <b>passe au showroom</b> automatiquement une fois réparée.</div></div>
            <div class="helpStep"><span class="helpStep__num">4</span><div><b>Vends</b> la voiture pour gagner de l'argent et de la réputation (REP).</div></div>
            <div class="helpStep"><span class="helpStep__num">5</span><div>Plus tu as de REP, plus tu débloques des tiers de voitures <b>rares et chères</b>.</div></div>
          </div>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">📈 Comment progresser ?</div>
          <p>Tes ventes font monter le <b>Niveau Garage (LVL)</b> — chaque niveau augmente ta capacité et tes revenus passifs. Investis dans les <b>Améliorations</b> et les <b>Talents</b> pour accélérer. Complète les <b>Défis journaliers</b> pour des récompenses bonus chaque jour.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">⏱️ Progression hors-ligne (AFK)</div>
          <p>Le jeu tourne même quand tu es absent. À ton retour, jusqu'à <b>4 heures</b> de progression sont rattrapées : revenus passifs, livraisons, réparations auto, diagnostics et ventes automatiques. Un message te résume le temps rattrapé.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">💾 Sauvegarde</div>
          <p>La progression est <b>sauvegardée automatiquement</b> dans le cloud (compte requis) ou localement. Tu peux aussi sauvegarder manuellement via le bouton 💾 dans le menu latéral (☰).</p>
        </div>
      </div>
    `
  },

  repair: {
    title: "🔧 L'Atelier",
    content: `
      <div class="helpSection">
        <div class="helpBlock">
          <div class="helpBlock__title">🔍 Diagnostic (ANALYSER)</div>
          <p>Clique sur <b>ANALYSER</b> pour faire rentrer une nouvelle voiture. Chaque analyse te rapporte de l'argent instantanément. Tu ne peux analyser que si une place est libre à l'atelier.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">⚡ Réparation manuelle</div>
          <p>Clique sur la <b>barre de progression</b> de la voiture active pour avancer la réparation. Chaque clic soustrait du temps. Essentiel en début de partie avant d'avoir des mécaniciens automatiques.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🤖 Réparation automatique</div>
          <p>En achetant <b>Apprenti Mécanicien</b> puis <b>Mécanicien</b> dans l'onglet Équipe, ton garage répare tout seul. Les talents <b>Routine Atelier</b>, <b>Organisation Pro</b> et <b>Double Shift</b> amplifient la vitesse.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">👑 Chef d'Atelier (P7)</div>
          <p>L'upgrade prestige <b>Chef d'Atelier</b> ajoute des <b>slots de réparation simultanés</b> (+1 slot par rang, max 5). Chaque slot supplémentaire a un malus de vitesse −10% par position, réductible via le perk Héritage <b>Ergonomie Avancée</b>.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🧑‍🔧 Automatisation de l'accueil</div>
          <p><b>Stagiaire Accueil</b> diagnostique automatiquement toutes les 15s au niv.1 (min 6s au niv.10). <b>Réceptionnaire</b> descend jusqu'à 1s. L'upgrade prestige <b>IA Diagnostic</b> (P5) atteint 0.5s.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🔬 Scanner Pro X (P3)</div>
          <p>Ajoute un <b>bonus de scan</b> après chaque diagnostic selon le tier : +15€ (F) → +6 000€ (SSS+) par rang. Le perk Héritage <b>Scanner Augmenté</b> multiplie ces gains par 1.5.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🔩 Pannes et pièces</div>
          <p>Certaines voitures arrivent avec une panne. Si tu as les pièces nécessaires, elles sont consommées automatiquement et <b>augmentent la valeur de revente</b>. Sans pièces, la voiture est réparée mais moins valorisée.</p>
        </div>
      </div>
    `
  },

  showroom: {
    title: "🚗 Le Showroom",
    content: `
      <div class="helpSection">
        <div class="helpBlock">
          <div class="helpBlock__title">💰 Vente manuelle</div>
          <p>Clique sur <b>VENDRE</b> sous une voiture pour l'encaisser immédiatement. Tu récupères l'argent et la REP selon le tier et la rareté du véhicule.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🤖 Vendeur automatique & Règles</div>
          <p><b>Vendeur Junior</b> vend automatiquement toutes les 15s (min 6s niv.10). <b>Vendeur Confirmé</b> descend à 1s. <b>Vendeur Expert</b> (P5) atteint 0.5s.</p>
          <p style="margin-top:6px">⚙️ Clique sur <b>Règles</b> dans la barre du showroom pour définir quelles voitures le vendeur auto ne vendra jamais : par rareté, par tier, ou les deux combinés (ET). Les voitures protégées apparaissent dans l'onglet <b>🔒 Protégées</b>.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">✨ Système de Rareté</div>
          <p>Chaque voiture diagnostiquée reçoit une rareté aléatoire qui <b>multiplie sa valeur de vente et son gain REP</b>.</p>
          <div class="helpTierList">
            <div class="helpTier" style="color:#8ca8c0">⬜ Commune — ×1 vente · ×1 REP <span>57.45% de chance</span></div>
            <div class="helpTier" style="color:#4a9eff">🔵 Peu commune — ×1.3 vente · ×1.25 REP <span>26.33%</span></div>
            <div class="helpTier" style="color:#2ee59d">🟢 Rare — ×1.8 vente · ×1.6 REP <span>13.71%</span></div>
            <div class="helpTier" style="color:#a78bfa">🟣 Épique — ×2.5 vente · ×2.2 REP <span>2%</span></div>
            <div class="helpTier" style="color:#ffc83a">🟡 Légendaire — ×10 vente · ×10 REP <span>0.5%</span></div>
            <div class="helpTier" style="color:#ff4d70">🔴 Mythique — ×100 vente · ×100 REP <span>0.01%</span></div>
          </div>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🏷️ Tiers de véhicules</div>
          <div class="helpTierList">
            <div class="helpTier" style="color:#8ca8c0">F — Épave <span>0 REP · +1 REP/vente</span></div>
            <div class="helpTier" style="color:#a0b890">E — Populaire <span>0 REP · +2 REP/vente</span></div>
            <div class="helpTier" style="color:#c4b870">D — Commune <span>500 REP · +3 REP/vente</span></div>
            <div class="helpTier" style="color:#4dff9a">C — Correcte <span>1 500 REP · +6 REP/vente</span></div>
            <div class="helpTier" style="color:#7ab0ff">B — Sportive <span>5 000 REP · +12 REP/vente</span></div>
            <div class="helpTier" style="color:#a07aff">A — Rare <span>8 000 REP · +20 REP/vente</span></div>
            <div class="helpTier" style="color:#ffc83a">S — Prestige <span>25 000 REP · +40 REP/vente</span></div>
            <div class="helpTier" style="color:#ff8c40">SS — Collection <span>70 000 REP · +80 REP/vente</span></div>
            <div class="helpTier" style="color:#ff4d70">SSS — Légendaire <span>180 000 REP · +160 REP/vente</span></div>
            <div class="helpTier" style="color:#ffffff">SSS+ — Mythique <span>450 000 REP · +350 REP/vente</span></div>
          </div>
          <p style="margin-top:6px;font-size:12px;color:#7788aa">Le gain REP par vente est multiplié par la rareté du véhicule.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">📦 Slots showroom</div>
          <p>Tu commences avec 3 emplacements. Augmente-les via <b>Extension Showroom</b> (Contrats), le talent <b>Expansion Vitrine</b> (+1/rang), ou l'upgrade prestige <b>Galerie Marchande</b> (P2, +2 slots/rang, max 4).</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🏠 Garage Personnel (Exposition)</div>
          <p>Depuis le showroom, tu peux <b>Exposer</b> une voiture dans ton garage personnel (onglet 🏠 GARAGE dans la colonne centrale). Les voitures exposées génèrent des <b>€/s et REP/s passifs</b> selon leur tier et rareté — sans être vendues.</p>
          <p style="margin-top:6px">Tu commences avec <b>1 slot d'exposition</b>. Débloque <b>Exposition Premium</b> (Affaires, P1, max 4 rangs) pour obtenir jusqu'à 5 slots. La REP générée par l'exposition est réduite (×0.3) pour équilibre.</p>
        </div>
      </div>
    `
  },

  challenges: {
    title: "📅 Défis journaliers",
    content: `
      <div class="helpSection">
        <p class="helpLead">Chaque jour, 3 défis sont générés selon ton niveau de garage. Chaque défi a 3 paliers — complète-les pour des récompenses progressives.</p>
        <div class="helpBlock">
          <div class="helpBlock__title">🥉🥈🥇 Système de paliers</div>
          <ul class="helpList">
            <li>🥉 <b>Bronze</b> — objectif de base, récompense argent uniquement (~15 min)</li>
            <li>🥈 <b>Argent</b> — ×1.8 l'objectif, +1 point talent + REP (~30 min)</li>
            <li>🥇 <b>Or</b> — ×3 l'objectif, +2 points talent + REP supplémentaire (~45-60 min)</li>
          </ul>
          <p style="margin-top:6px;font-size:12px;color:#7788aa">Tu peux réclamer chaque palier indépendamment. Réclamer un palier supérieur donne automatiquement les paliers inférieurs non réclamés.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🎯 Bonus complétion</div>
          <p>Compléter les <b>3 défis Or</b> dans la même journée débloque un <b>bonus REP</b> supplémentaire. Les défis se réinitialisent à minuit.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🔥 Streak journalier</div>
          <p>Compléter tous les défis Or plusieurs jours de suite active un multiplicateur de récompenses :</p>
          <ul class="helpList">
            <li>3 jours → ×1.25 sur toutes les récompenses</li>
            <li>7 jours → ×1.5 récompenses 🔥</li>
            <li>14 jours → ×2.0 récompenses</li>
            <li>30 jours → ×3.0 récompenses</li>
          </ul>
          <p style="margin-top:6px;font-size:12px;color:#ff8c40">⚠️ Manquer un jour remet le streak à zéro.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">📊 Types de défis</div>
          <ul class="helpList">
            <li>🚗 <b>Vendre des voitures tier X+</b> — tier adapté à ton niveau</li>
            <li>⭐ <b>Gagner de la REP</b> — accumuler des points dans la journée</li>
            <li>💰 <b>Gagner de l'argent</b> — encaisser un montant total (calibré à 15-60 min)</li>
            <li>🖱️ <b>Actions manuelles</b> — clics de réparation, diagnostic, vente manuelle</li>
            <li>📦 <b>Commander des pièces</b> — commandes manuelles ET automatiques comptent</li>
            <li>🏷️ <b>Vendre des voitures</b> — tous tiers confondus</li>
          </ul>
          <p style="margin-top:6px;font-size:12px;color:#7788aa">🚗 Vendre tier X+ et 🏷️ Vendre tous tiers ne tombent jamais ensemble le même jour.</p>
        </div>
      </div>
    `
  },

  rep: {
    title: "⭐ Réputation (REP)",
    content: `
      <div class="helpSection">
        <p class="helpLead">La REP est la ressource clé. Elle détermine quels tiers de voitures tu peux recevoir et permet d'atteindre le Prestige.</p>
        <div class="helpBlock">
          <div class="helpBlock__title">Comment gagner de la REP ?</div>
          <ul class="helpList">
            <li>🚗 <b>Vendre des voitures</b> — chaque tier donne un gain REP différent, multiplié par la rareté</li>
            <li>🏠 <b>Garage Personnel</b> — les voitures exposées génèrent de la REP/s passif (×0.3 sur les valeurs de base)</li>
            <li>📣 <b>Talent Bouche-à-Oreille</b> — +5% REP par vente par rang</li>
            <li>⭐ <b>Talent Expertise Reconnue</b> — +2 REP par diagnostic manuel par rang</li>
            <li>📅 <b>Défis journaliers</b> — bonus REP aux paliers Argent et Or</li>
            <li>🎖️ <b>Succès</b> — certains donnent de la REP directement</li>
            <li>🔥 <b>Streak défis</b> — multiplie les récompenses REP des défis</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">⚠️ La REP ne baisse jamais</div>
          <p>Tu accumules la REP définitivement dans un run. Elle repart à 0 uniquement au <b>Prestige</b> — sauf si tu as le perk Héritage <b>Réputation Acquise</b> qui en conserve jusqu'à 25%.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">📈 Conditions de prestige progressives</div>
          <p>Le niveau garage requis et la REP requise <b>augmentent à chaque prestige</b>. Consulte le panel Prestige pour voir les conditions actuelles et celles du prochain prestige.</p>
        </div>
      </div>
    `
  },

  stock: {
    title: "📦 Stock & Pièces",
    content: `
      <div class="helpSection">
        <div class="helpBlock">
          <div class="helpBlock__title">🔩 À quoi servent les pièces ?</div>
          <p>Quand une voiture a une panne, utiliser les bonnes pièces lors de la réparation <b>augmente sa valeur de revente</b>. Sans pièces, la voiture est réparée mais moins valorisée.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🏭 Fournisseurs</div>
          <div class="helpTierList">
            <div class="helpTier" style="color:#48c78e">🟢 Euroline — ⭐⭐⭐ · 1min30s · Pas cher · Gain net <b>+2%</b> · Spécialiste mécanique</div>
            <div class="helpTier" style="color:#ffd700">🟡 Valéo Plus — ⭐⭐⭐⭐ · 3min · Prix moyen · −15% temps répa · Gain net <b>+6%</b></div>
            <div class="helpTier" style="color:#ff8c00">🟠 NGX Parts — ⭐⭐⭐⭐ · 2min30s · −15% temps répa · Gain net <b>+4%</b> · Spécialiste électronique</div>
            <div class="helpTier" style="color:#4a9eff">🔵 Bochmann — ⭐⭐⭐⭐⭐ · 5min · Prix élevé · −30% temps répa · Gain net <b>+10%</b></div>
            <div class="helpTier" style="color:#ff4d70">🔴 TopDrive — ⭐⭐ · 5 secondes · Très pas cher · Gain net <b>−2%</b> · Urgence uniquement</div>
          </div>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🏭 L'Entrepôt</div>
          <p>Ton entrepôt démarre à <b>100 slots</b>. Si plein, les nouvelles commandes sont bloquées.</p>
          <ul class="helpList" style="margin-top:6px">
            <li>📚 <b>Étagères Basiques</b> — +20 slots/rang · max 10 rangs</li>
            <li>🏗️ <b>Rayonnage Métallique</b> — +50 slots/rang · max 10 rangs</li>
            <li>🏭 <b>Zone Logistique</b> — +100 slots + −10% délai/rang · max 5 rangs</li>
            <li>🤖 <b>Entrepôt Automatisé</b> — +200 slots + +2% valeur revente/rang · max 5 rangs</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🤖 Logiciel Stock & Commande auto</div>
          <ul class="helpList">
            <li>Niv. 1 — Alertes rupture (badge rouge sur l'onglet Stock)</li>
            <li>Niv. 2 — Seuils configurables par pièce</li>
            <li>Niv. 3 — <b>Commande auto</b> dès que le stock passe sous le seuil (limite 20% argent/cycle)</li>
          </ul>
          <p style="margin-top:6px;font-size:12px;color:#7788aa">💡 Les commandes automatiques comptent pour le défi "Commander des pièces".</p>
        </div>
      </div>
    `
  },

  talents: {
    title: "🌟 Talents",
    content: `
      <div class="helpSection">
        <p class="helpLead">Les talents sont des améliorations passives permanentes qui <b>survivent au Prestige</b> et s'accumulent run après run.</p>
        <div class="helpBlock">
          <div class="helpBlock__title">🔓 Gagner des points talent</div>
          <ul class="helpList">
            <li>📈 Monter de niveau garage — 1 point par niveau</li>
            <li>🏅 Débloquer des succès — certains récompensent des points</li>
            <li>📅 Défis journaliers — palier Argent (+1 pt) et Or (+2 pts) par défi</li>
            <li>🔍 Spécialisation Centre Diagnostic — +1 point tous les 100 diagnostics</li>
            <li>🛒 Marché Héritage — Pack Talent : 50 pts héritage → +5 points talent</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🗂️ Business (T1–T3)</div>
          <ul class="helpList">
            <li>💰 Caisse Automatique (T1) — +5 €/s par rang</li>
            <li>🤝 Négociateur Né (T1) — +3% valeur de vente par rang</li>
            <li>📑 Contrats Mensuels (T2) — +20 €/s par rang</li>
            <li>🏆 Réputation Locale (T2) — +8% valeur de vente par rang</li>
            <li>🏪 Expansion Vitrine (T2) — +1 slot showroom par rang</li>
            <li>🏎️ Clientèle Haut de Gamme (T3) — +3% sur ventes tier S+ par rang</li>
            <li>🏦 Rentes Perpétuelles (T3) — +5% multiplicateur passifs par rang</li>
            <li>💎 Enchères Privées (T3) — +2% multiplicateur toutes ventes par rang</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🔧 Atelier (T1–T3)</div>
          <ul class="helpList">
            <li>⚡ Routine Atelier (T1) — +4% vitesse répa par rang</li>
            <li>🔨 Outillage Précis (T1) — +50€ bonus fixe par réparation par rang</li>
            <li>🖱️ Main de Fer (T2) — +0.10s retirées par clic par rang</li>
            <li>🔧 Organisation Pro (T2) — +7% vitesse répa par rang</li>
            <li>🔩 Double Shift (T2) — +0.5s/s répa auto par rang</li>
            <li>🚛 Fournisseur Fidèle (T3) — +1 slot livraison tous les 5 rangs</li>
            <li>✨ Touche d'Or (T3) — +3% multiplicateur bonus répa par rang</li>
            <li>🏭 Logistique Avancée (T3) — +50 slots entrepôt par rang</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🔍 Diagnostic (T1–T3)</div>
          <ul class="helpList">
            <li>🔍 Œil de Lynx (T1) — +3€ par analyse par rang</li>
            <li>📣 Bouche-à-Oreille (T1) — +5% REP gagnée par vente par rang</li>
            <li>🧠 Scan Avancé (T2) — +8€ par analyse par rang</li>
            <li>⭐ Expertise Reconnue (T2) — +2 REP par diagnostic manuel par rang</li>
            <li>🎓 Expert Certifié (T3) — +5% multiplicateur gain total diag par rang</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🔓 Déblocage des tiers</div>
          <p>T2 se débloque avec <b>5 points investis</b> dans la catégorie. T3 nécessite <b>15 points</b>.</p>
        </div>
      </div>
    `
  },

  prestige: {
    title: "🔥 Prestige & Héritage",
    content: `
      <div class="helpSection">
        <p class="helpLead">Le Prestige remet ton garage à zéro, mais tu gardes des bonus permanents qui rendent chaque run plus puissant.</p>
        <div class="helpBlock">
          <div class="helpBlock__title">🔓 Conditions (progressives)</div>
          <p>Les seuils requis <b>augmentent à chaque prestige</b>. Consulte le panel Prestige pour voir les conditions actuelles et celles du prestige suivant.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">💎 Points Héritage gagnés</div>
          <ul class="helpList">
            <li>🔵 <b>Base</b> : 1 point garanti</li>
            <li>📈 <b>Niveau garage</b> : +1 par tranche de 10 niveaux au-dessus du minimum</li>
            <li>🚗 <b>Ventes</b> : +1 par tranche de 5 000 voitures vendues</li>
            <li>⭐ <b>REP</b> : progression exponentielle — 1er point à 50k REP, chaque point suivant coûte 2× plus (50k → 100k → 200k → 400k…). Difficile à farmer.</li>
            <li>✨ <b>Perk Gain Prestige</b> : multiplie le total · P100 → ×1.5 permanent</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🌳 Arbre Héritage — 5 branches</div>
          <ul class="helpList">
            <li>🔧 <b>Mécanique</b> — vitesse de réparation, perks infinis vitesse</li>
            <li>💰 <b>Commerce</b> — revenus, coût upgrades, conservation niveaux au prestige</li>
            <li>⭐ <b>Réputation</b> — gain REP, conservation jusqu'à 25% REP au prestige</li>
            <li>📦 <b>Logistique</b> — délais livraison, commandes auto améliorées, entrepôt</li>
            <li>🔵 <b>Expertise</b> — amplifie les upgrades prestige : Scanner, Turbocompresseur, Chef d'Atelier</li>
          </ul>
          <p style="margin-top:6px;font-size:12px;color:#7788aa">Chaque branche a un perk ultime unique et des perks infinis (sans maximum) débloqués après l'ultime.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🏆 Milestones de Prestige</div>
          <div class="helpTierList">
            <div class="helpTier">P1 → +1 000€ au démarrage</div>
            <div class="helpTier">P5 → +1 slot garage permanent</div>
            <div class="helpTier">P10 → +10% vitesse auto</div>
            <div class="helpTier">P15 → +1 slot showroom permanent</div>
            <div class="helpTier">P25 → +2 slots garage et showroom</div>
            <div class="helpTier">P30 → Upgrades Équipe conservent 25% de leurs niveaux</div>
            <div class="helpTier" style="color:#31d6ff">P40 → <b>Double Spécialisation</b> simultanée</div>
            <div class="helpTier" style="color:#ffc83a">P50 → Titre 👑 LÉGENDE débloqué</div>
            <div class="helpTier">P75 → Perks infinis −1pt/rang (min 2pts)</div>
            <div class="helpTier" style="color:#a78bfa">P100 → Points Héritage ×1.5 permanent</div>
          </div>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🏭 Spécialisations</div>
          <p>À partir du 1er prestige, tu choisis une spécialisation. Au P40, une <b>2e spécialisation</b> peut être activée simultanément — les effets se combinent multiplicativement.</p>
          <div class="helpTierList">
            <div class="helpTier" style="color:#4a9eff">🔧 Atelier Turbo — Vitesse répa +40%, répa auto +40% / Vente −15%, passifs −25%</div>
            <div class="helpTier" style="color:#ffc83a">💰 Garage Prestige — Vente +35%, bonus S+ ×2 / Vitesse répa −20%, showroom max 5 slots</div>
            <div class="helpTier" style="color:#2ee59d">🔍 Centre Diagnostic — Gain diag ×3, +1 talent/100 diags / Vitesse répa −10%, vente −10%</div>
            <div class="helpTier" style="color:#a78bfa">📦 Logistique Pro — Livraisons ×2, délais −50%, pièces +25% / REP −20%</div>
            <div class="helpTier" style="color:#ff8c40">⭐ Réputation Légendaire — REP ×2, seuil prestige −25% / Revenus −20%</div>
          </div>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🛒 Marché Héritage</div>
          <p>Dans l'onglet Héritage (section dépliable), dépense des points pour des avantages immédiats :</p>
          <ul class="helpList">
            <li>💰 <b>Pack Capital</b> (100 pts) — +50 000€ au prochain prestige</li>
            <li>⭐ <b>Pack Talent</b> (50 pts) — +5 points talent au démarrage</li>
            <li>🔥 <b>Boost REP ×2</b> (75 pts) — REP doublée pendant 30 minutes</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">✅ Ce qui survit au prestige</div>
          <ul class="helpList">
            <li>✅ Points talent et rangs de tous les talents</li>
            <li>✅ Points Héritage et perks achetés</li>
            <li>✅ Succès débloqués, meilleur tier réparé, REP max (stats profil)</li>
            <li>⚡ Partiel — REP conservée si perk <b>Réputation Acquise</b> (max 25%)</li>
            <li>⚡ Partiel — Niveaux upgrades selon perks Commerce et Expertise</li>
            <li>❌ Argent, REP, niveau garage, upgrades (sans perks), pièces, commandes</li>
          </ul>
        </div>
      </div>
    `
  },

  upgrades: {
    title: "⚙️ Upgrades Prestige",
    content: `
      <div class="helpSection">
        <p class="helpLead">Les upgrades prestige se débloquent à partir du 1er prestige. Elles sont <b>réinitialisées au prestige suivant</b> — sauf avec les perks Héritage appropriés.</p>
        <div class="helpBlock">
          <div class="helpBlock__title">🔧 Onglet Outils</div>
          <ul class="helpList">
            <li>🔬 <b>Scanner Pro X</b> (P3, max 3) — Bonus de scan par tier après diagnostic. +15€ (F) → +6 000€ (SSS+) par rang.</li>
            <li>🔩 <b>Clé Dynamométrique</b> (P4) — +0.5s retirées par clic par rang. Illimité.</li>
            <li>🚀 <b>Turbocompresseur</b> (P5) — +15% vitesse de réparation par rang (multiplicateur). Illimité.</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">👥 Onglet Équipe</div>
          <ul class="helpList">
            <li>🏆 <b>Vendeur Expert</b> (P5, max 5) — −0.1s plancher vente auto par rang (min 0.5s). Prérequis : Vendeur Confirmé max.</li>
            <li>🤖 <b>IA Diagnostic</b> (P5, max 5) — −0.1s plancher diagnostic auto par rang (min 0.5s). Prérequis : Réceptionnaire max.</li>
            <li>👑 <b>Chef d'Atelier</b> (P7, max 5) — +1 slot de réparation simultané par rang, malus −10%/slot (réductible).</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">💼 Onglet Affaires</div>
          <ul class="helpList">
            <li>💼 <b>Réseau National</b> (P2) — +100€/s passif par rang. Illimité.</li>
            <li>🏦 <b>Holding Automobile</b> (P4) — +250€/s passif par rang. Illimité.</li>
            <li>🏬 <b>Galerie Marchande</b> (P2, max 4) — +2 slots showroom par rang. Prérequis : Extension Showroom niv.4.</li>
            <li>🔧 <b>Extension Atelier</b> (P3, max 4) — +1 slot garage par rang. Prérequis : Agrandissement Garage niv.5.</li>
            <li>🖼️ <b>Exposition Premium</b> (P1, max 4) — +1 slot d'exposition dans le Garage Personnel par rang. Coût ×2 entre chaque niveau (500k → 1M → 2M → 4M€).</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">💡 Filtres & Tooltips</div>
          <p>Dans l'onglet Upgrades, utilise la <b>barre de filtre</b> (collapsible) pour filtrer par statut ou par type d'effet. Clique sur l'icône d'un upgrade pour afficher un <b>tableau des 10 prochains niveaux</b> avec effets et prix.</p>
        </div>
      </div>
    `
  },

  profile: {
    title: "👤 Profil & Classement",
    content: `
      <div class="helpSection">
        <div class="helpBlock">
          <div class="helpBlock__title">👤 Ton profil</div>
          <p>Accède au profil via le menu latéral (☰). Tu peux personnaliser ton avatar, ta bannière, ton titre affiché et ton pays.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🎨 Bannières débloquables</div>
          <ul class="helpList">
            <li>🔁 <b>Prestige</b> — P1, P5, P10, P25, P50 (arc-en-ciel animé)</li>
            <li>🔧 <b>Spécialisation</b> — une bannière par spécialisation active</li>
            <li>💎 <b>SSS+ réparé</b>, 1M€ cumulés, Double Spécialisation (P40), 100 prestiges</li>
          </ul>
          <p style="margin-top:6px;font-size:12px;color:#7788aa">Les bannières verrouillées sont visibles dans le picker avec la condition de déverrouillage.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">👑 Titres débloquables</div>
          <p>Les titres s'affichent sous ton pseudo. Ils se débloquent via des conditions difficiles :</p>
          <ul class="helpList">
            <li>🔧 Vétéran (P5) · ⭐ Expert (P10) · 🏆 Maître (P25) · 👑 LÉGENDE (P50) · ♾️ Éternel (P100)</li>
            <li>⚡ Turbo Mécano (vitesse ×10) · 💰 Magnat (100M€) · 🔍 Analyste Suprême (10k diags)</li>
            <li>🚗 Vendeur de l'Année (5k ventes) · 💎 Chasseur d'Élite (SSS+ + 500 répa)</li>
            <li>🏛️ Héritier Suprême (150 pts Héritage) · 🎖️ Collectionneur (80% succès)</li>
            <li>⚡ Double Expert (dualSpec P40) · 👑 Chef des Chefs (Chef d'Atelier niv.5)</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🖼️ Cadre d'avatar par prestige</div>
          <ul class="helpList">
            <li>P0 — aucun · P1–4 — bordure grise · P5–9 — bordure cyan</li>
            <li>P10–24 — bordure violette glow · P25–49 — bordure or pulsée</li>
            <li>P50+ — arc-en-ciel animé ✨</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🌍 Classement mondial</div>
          <p>Accessible depuis le menu latéral. Filtre par catégorie : argent total, voitures vendues, prestige, niveau garage, succès. Clique sur un joueur pour voir son profil complet avec ses stats, bannière, titre et cadre d'avatar.</p>
        </div>
      </div>
    `
  },

  encyclopedie: {
    title: "📖 Encyclopédie",
    content: `
      <div class="helpSection">
        <p class="helpLead">L'Encyclopédie (accessible via le menu latéral ☰) recense toutes les voitures du jeu et suit ta progression sur chaque modèle.</p>
        <div class="helpBlock">
          <div class="helpBlock__title">📊 Niveaux de maîtrise</div>
          <div class="helpTierList">
            <div class="helpTier" style="color:#888">⬛ Inconnu — voiture jamais réparée</div>
            <div class="helpTier" style="color:#4a9eff">🔵 Découvert — 1ère réparation effectuée</div>
            <div class="helpTier" style="color:#2ee59d">🟢 Familier — 30 réparations de ce modèle</div>
            <div class="helpTier" style="color:#ffc83a">🟡 Maîtrisé — 50 réparations + 5 raretés différentes vues</div>
          </div>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">📈 Détails par voiture</div>
          <ul class="helpList">
            <li>Tier, nom et description de la catégorie</li>
            <li>Niveau de maîtrise avec barres de progression vers le suivant</li>
            <li>Meilleure rareté obtenue et toutes les raretés vues (icônes)</li>
            <li>Nombre total de réparations · Meilleur prix de vente</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🏆 Récompenses de complétion</div>
          <p>Découvrir tous les modèles d'un tier débloque des <b>récompenses instantanées</b> : points talent et argent. Plus le tier est élevé, plus la récompense est importante.</p>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🔍 Filtres</div>
          <p>Filtre par <b>tier</b> (F → SSS+) et par <b>niveau de maîtrise</b> (Inconnu / Découvert / Familier / Maîtrisé) pour suivre ta progression sur des catégories précises.</p>
        </div>
      </div>
    `
  },

  tips: {
    title: "💡 Astuces",
    content: `
      <div class="helpSection">
        <div class="helpBlock">
          <div class="helpBlock__title">🚀 Démarrage rapide</div>
          <ul class="helpList">
            <li>Ne laisse jamais l'atelier vide — clique ANALYSER dès qu'une place est libre</li>
            <li>Première priorité : <b>Apprenti Mécanicien</b> pour automatiser les réparations</li>
            <li>Deuxième priorité : <b>Stagiaire Accueil</b> pour automatiser les diagnostics</li>
            <li>Premiers talents : <b>Routine Atelier</b> et <b>Négociateur Né</b></li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">💰 Optimiser ses revenus</div>
          <ul class="helpList">
            <li>Configure les <b>⚙️ Règles</b> du vendeur auto pour protéger tes voitures rares — filtre par rareté et/ou tier. Elles restent dans l'onglet 🔒 Protégées.</li>
            <li><b>Bochmann</b> : meilleur fournisseur (−30% temps, +10% gain) mais lent · <b>TopDrive</b> pour les urgences (5s)</li>
            <li>Talent <b>Clientèle Haut de Gamme</b> très rentable sur les tiers S+ en fin de run</li>
            <li>Upgrades <b>Réseau National</b> et <b>Holding</b> génèrent du passif même en AFK</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">📅 Maximiser les défis</div>
          <ul class="helpList">
            <li>Les paliers Bronze sont rapides — réclame-les dès le début de session</li>
            <li>Le défi Commander des pièces compte les commandes auto — active-les avant de jouer</li>
            <li>Le streak ×1.5 (7 jours) change vraiment les gains en talent et REP</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">🔥 Avant de prestige</div>
          <ul class="helpList">
            <li>Vide ton showroom et dépense tout ton argent en upgrades — tu ne gardes rien</li>
            <li>Dépense tous tes points Héritage disponibles avant de confirmer</li>
            <li>La REP apporte peu de points Héritage (progression exponentielle — 50k/100k/200k/400k… par point). Vise surtout un <b>niveau garage élevé</b> et un maximum de <b>voitures vendues</b>.</li>
            <li>Choisis ta spécia selon ton style : Atelier Turbo si actif, Logistique Pro si AFK</li>
            <li>À P40 la 2e spécialisation se choisit juste après — prévoie ta combinaison</li>
          </ul>
        </div>
        <div class="helpBlock">
          <div class="helpBlock__title">⏱️ Optimiser l'AFK</div>
          <ul class="helpList">
            <li>Le jeu rattrape max <b>4 heures</b> hors-ligne — reviens toutes les 4h pour maximiser</li>
            <li>Avant de fermer : commandes de pièces, showroom non saturé, vendeur auto actif</li>
            <li>Spécialisation <b>Logistique Pro</b> est la plus efficace en AFK</li>
          </ul>
        </div>
      </div>
    `
  },
};

// ── Rendu ────────────────────────────────────────────────────────────────────
let _activeHTab = "intro";

function renderHelpBody() {
  const section = HELP_SECTIONS[_activeHTab];
  const body = document.getElementById("helpBody");
  if(!body || !section) return;
  body.innerHTML = `<div class="helpModal__sectionTitle">${section.title}</div>` + section.content;
}

function openHelp() {
  document.getElementById("helpModal").style.display = "block";
  renderHelpBody();
}
function closeHelp() {
  document.getElementById("helpModal").style.display = "none";
}

// Onglets
document.getElementById("helpTabs")?.addEventListener("click", e => {
  const btn = e.target.closest(".helpTab");
  if(!btn) return;
  document.querySelectorAll(".helpTab").forEach(t => t.classList.remove("helpTab--active"));
  btn.classList.add("helpTab--active");
  _activeHTab = btn.dataset.htab;
  renderHelpBody();
});

document.getElementById("btnHelp")?.addEventListener("click", openHelp);
document.getElementById("btnHelpClose")?.addEventListener("click", closeHelp);
document.getElementById("helpBackdrop")?.addEventListener("click", closeHelp);

