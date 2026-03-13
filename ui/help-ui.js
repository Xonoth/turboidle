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
          <div class="helpBlock__title">🔄 La boucle de jeu de base</div>
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
          <p>Tes ventes font monter le <b>Niveau Garage</b> (LVL) — chaque niveau augmente ta capacité et tes revenus passifs. Investis dans les <b>Améliorations</b> (Bureau) et les <b>Talents</b> pour accélérer.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">⏱️ Progression hors-ligne (AFK)</div>
          <p>Le jeu tourne même quand tu es absent. À ton retour, jusqu'à <b>4 heures</b> de progression sont rattrapées automatiquement : revenus passifs, livraisons, réparations auto, diagnostics et ventes automatiques continuent. Un message te résume le temps rattrapé.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">💾 Sauvegarde</div>
          <p>La progression est <b>sauvegardée automatiquement</b> dans le cloud (compte requis) ou localement dans ton navigateur.</p>
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
          <p>Clique sur la <b>barre de progression</b> de la voiture active pour avancer la réparation. Chaque clic soustrait du temps — essentiel en début de partie avant d'avoir des mécaniciens automatiques.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🤖 Réparation automatique</div>
          <p>En achetant <b>Apprenti Mécanicien</b> (+0.15s/s par rang) et <b>Mécanicien</b> (+0.5s/s par rang) dans l'onglet Équipe, ton garage répare tout seul. Les talents <b>Routine Atelier</b>, <b>Organisation Pro</b> et <b>Double Shift</b> amplifient ces valeurs.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🔩 Pannes et pièces détachées</div>
          <p>Certaines voitures arrivent avec une <b>panne</b> (ex : "Moteur HS"). Si tu as les pièces nécessaires en stock, elles sont consommées automatiquement et <b>augmentent la valeur de revente</b>. La qualité du fournisseur influe aussi sur la vitesse de réparation. Sans pièces, la voiture est réparée mais moins valorisée.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🏎️ File d'attente</div>
          <p>Plusieurs voitures peuvent attendre (jusqu'à 10× la capacité du garage). Une seule est en réparation active à la fois. Augmente les emplacements via <b>Agrandissement Garage</b> ou les perks Héritage.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🧑‍🔧 Automatisation de l'accueil</div>
          <p><b>Stagiaire Accueil</b> diagnostique automatiquement toutes les 12s (min 6s au niv. max). <b>Réceptionnaire</b> réduit encore ce délai jusqu'à 1s. Ces deux upgrades fonctionnent aussi en AFK.</p>
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
          <p>Clique sur <b>VENDRE</b> sous une voiture pour l'encaisser immédiatement. Tu récupères l'argent et la REP associée au tier.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🤖 Vendeur automatique</div>
          <p><b>Vendeur Junior</b> vend automatiquement la voiture la plus ancienne toutes les 15s (min 8s). <b>Vendeur Confirmé</b> descend jusqu'à 1s. ⚠️ Le vendeur ne fait pas de distinction de tier — vends manuellement tes voitures rares.</p>
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
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">📦 Slots showroom</div>
          <p>Tu commences avec 3 emplacements. Augmente-les via <b>Extension Showroom</b> (Contrats, max 4 achats) ou le talent <b>Expansion Vitrine</b> (+1/rang, max +10). La spécialisation <b>Garage Prestige</b> limite le showroom à 5 slots.</p>
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
            <li>🚗 <b>Vendre des voitures</b> — chaque tier donne un gain REP différent (voir tableau ci-dessus)</li>
            <li>📣 <b>Talent Bouche-à-Oreille</b> — +5% REP par vente par rang (T1 Diagnostic)</li>
            <li>⭐ <b>Talent Expertise Reconnue</b> — +2 REP par diagnostic manuel par rang (T2 Diagnostic)</li>
            <li>📅 <b>Défis journaliers</b> — bonus REP à la complétion, bonus supplémentaire si tu complètes les 3</li>
            <li>🎖️ <b>Succès</b> — certains donnent de la REP directement</li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">⚠️ La REP ne baisse jamais</div>
          <p>Tu accumules la REP définitivement dans un run. Elle repart à 0 uniquement au <b>Prestige</b>.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">📅 Défis journaliers</div>
          <p>Chaque jour, 3 défis sont générés (ex : "Vendre 10 voitures tier B+"). Complète-les pour gagner de l'argent et des points talent. Compléter les 3 débloque un <b>bonus REP</b> supplémentaire. Ils se réinitialisent à minuit et s'adaptent à ton niveau de garage.</p>
        </div>
      </div>
    `
  },

  stock: {
    title: "📦 Stock & Pièces détachées",
    content: `
      <div class="helpSection">
        <div class="helpBlock">
          <div class="helpBlock__title">🔩 À quoi servent les pièces ?</div>
          <p>Quand une voiture a une panne, utiliser les bonnes pièces lors de la réparation <b>augmente sa valeur de revente</b> et peut accélérer ou ralentir la réparation selon la qualité. Sans pièces, la voiture est quand même réparée mais vaut moins.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🏭 Fournisseurs</div>
          <div class="helpSupplierGrid">
            <div class="helpSupplierCard">
              <div class="helpSupplierCard__head">
                <div class="helpSupplierCard__dot" style="background:#48c78e;box-shadow:0 0 6px #48c78e66"></div>
                <div class="helpSupplierCard__name" style="color:#48c78e">Euroline</div>
                <div class="helpSupplierCard__stars">⭐⭐⭐</div>
              </div>
              <div class="helpSupplierCard__body">
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Délai</span><span class="helpSupplierCard__val helpSupplierCard__val--neu">1 min 30s</span></div>
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Prix</span><span class="helpSupplierCard__val helpSupplierCard__val--pos">Pas cher</span></div>
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Gain net</span><span class="helpSupplierCard__val helpSupplierCard__val--pos">+2%</span></div>
                <div class="helpSupplierCard__tag">Spécialiste mécanique (moteur, freins, transmission, joint)</div>
              </div>
            </div>
            <div class="helpSupplierCard">
              <div class="helpSupplierCard__head">
                <div class="helpSupplierCard__dot" style="background:#ffd700;box-shadow:0 0 6px #ffd70066"></div>
                <div class="helpSupplierCard__name" style="color:#ffd700">Valéo Plus</div>
                <div class="helpSupplierCard__stars">⭐⭐⭐⭐</div>
              </div>
              <div class="helpSupplierCard__body">
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Délai</span><span class="helpSupplierCard__val helpSupplierCard__val--neu">3 min</span></div>
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Prix</span><span class="helpSupplierCard__val helpSupplierCard__val--neu">Moyen</span></div>
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Temps répa</span><span class="helpSupplierCard__val helpSupplierCard__val--pos">−15%</span></div>
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Gain net</span><span class="helpSupplierCard__val helpSupplierCard__val--pos">+6%</span></div>
                <div class="helpSupplierCard__tag">Généraliste équilibré</div>
              </div>
            </div>
            <div class="helpSupplierCard">
              <div class="helpSupplierCard__head">
                <div class="helpSupplierCard__dot" style="background:#ff8c00;box-shadow:0 0 6px #ff8c0066"></div>
                <div class="helpSupplierCard__name" style="color:#ff8c00">NGX Parts</div>
                <div class="helpSupplierCard__stars">⭐⭐⭐⭐</div>
              </div>
              <div class="helpSupplierCard__body">
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Délai</span><span class="helpSupplierCard__val helpSupplierCard__val--neu">2 min 30s</span></div>
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Prix</span><span class="helpSupplierCard__val helpSupplierCard__val--pos">Moyen-bas</span></div>
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Temps répa</span><span class="helpSupplierCard__val helpSupplierCard__val--pos">−15%</span></div>
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Gain net</span><span class="helpSupplierCard__val helpSupplierCard__val--pos">+4%</span></div>
                <div class="helpSupplierCard__tag">Spécialiste électronique (+1 qualité pièces élec)</div>
              </div>
            </div>
            <div class="helpSupplierCard">
              <div class="helpSupplierCard__head">
                <div class="helpSupplierCard__dot" style="background:#4a9eff;box-shadow:0 0 6px #4a9eff66"></div>
                <div class="helpSupplierCard__name" style="color:#4a9eff">Bochmann</div>
                <div class="helpSupplierCard__stars">⭐⭐⭐⭐⭐</div>
              </div>
              <div class="helpSupplierCard__body">
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Délai</span><span class="helpSupplierCard__val helpSupplierCard__val--neg">5 min</span></div>
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Prix</span><span class="helpSupplierCard__val helpSupplierCard__val--neg">Élevé</span></div>
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Temps répa</span><span class="helpSupplierCard__val helpSupplierCard__val--pos">−30%</span></div>
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Gain net</span><span class="helpSupplierCard__val helpSupplierCard__val--pos">+10%</span></div>
                <div class="helpSupplierCard__tag">Meilleur rapport qualité/revente</div>
              </div>
            </div>
            <div class="helpSupplierCard" style="grid-column:1/-1">
              <div class="helpSupplierCard__head">
                <div class="helpSupplierCard__dot" style="background:#ff4d70;box-shadow:0 0 6px #ff4d7066"></div>
                <div class="helpSupplierCard__name" style="color:#ff4d70">TopDrive</div>
                <div class="helpSupplierCard__stars">⭐⭐</div>
              </div>
              <div class="helpSupplierCard__body">
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Délai</span><span class="helpSupplierCard__val helpSupplierCard__val--pos">5 secondes (urgence !)</span></div>
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Prix</span><span class="helpSupplierCard__val helpSupplierCard__val--pos">Très pas cher</span></div>
                <div class="helpSupplierCard__row"><span class="helpSupplierCard__label">Gain net</span><span class="helpSupplierCard__val helpSupplierCard__val--neg">−2%</span></div>
                <div class="helpSupplierCard__tag">Livraison d'urgence — sans malus qualité. À utiliser quand le stock est vide et la voiture en attente.</div>
              </div>
            </div>
          </div>
          <p style="margin-top:8px;font-size:12px;color:#7788aa">Le gain net = bonus valeur revente − coût pièces (en % de la valeur du véhicule). Les délais indiqués sont sans upgrades.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🏭 L'Entrepôt</div>
          <p>Ton entrepôt démarre à <b>100 slots</b>. Chaque pièce commandée occupe 1 slot (les pièces F/E/D n'occupent que 0.5 slot avec le talent <b>Gestionnaire de Stock</b>). Si l'entrepôt est plein, les nouvelles commandes sont <b>bloquées</b>.</p>
          <ul class="helpList" style="margin-top:6px">
            <li>📚 <b>Étagères Basiques</b> — +20 slots/rang · max 10 rangs</li>
            <li>🏗️ <b>Rayonnage Métallique</b> — +50 slots/rang · max 10 rangs</li>
            <li>🏭 <b>Zone Logistique</b> — +100 slots/rang + −10% délai/rang · max 5 rangs</li>
            <li>🤖 <b>Entrepôt Automatisé</b> — +200 slots/rang + +2% valeur revente (si pièces utilisées)/rang · max 5 rangs</li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🚛 Livraisons simultanées</div>
          <p>Tu commences avec 1 slot de livraison. Augmente-le via <b>Slots Livraison</b> (+1/rang, max 10). <b>Magasinier</b> réduit les délais −20%/rang (max 3). Le talent <b>Fournisseur Fidèle</b> ajoute +1 slot tous les 5 rangs.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🤖 Logiciel Stock & Commande automatique</div>
          <ul class="helpList">
            <li>Niv. 1 — Alertes rupture (badge rouge sur l'onglet Stock)</li>
            <li>Niv. 2 — Seuils configurables par pièce</li>
            <li>Niv. 3 — <b>Commande auto</b> au fournisseur par défaut dès que le stock passe sous le seuil, dans la limite de <b>20% de ton argent</b> par cycle de 2s</li>
          </ul>
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
            <li>📅 Défis journaliers — points à la complétion</li>
            <li>🔍 Spécialisation Centre Diagnostic — +1 point tous les 100 diagnostics</li>
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
            <li>📦 Gestion des Stocks (T2) — −1.5% délai livraison par rang</li>
            <li>📋 Gestionnaire de Stock (T2) — pièces F/E/D = 0.5 slot entrepôt</li>
            <li>🚛 Fournisseur Fidèle (T3) — +1 slot livraison tous les 5 rangs</li>
            <li>✨ Touche d'Or (T3) — +3% multiplicateur bonus répa par rang</li>
            <li>🏭 Logistique Avancée (T3) — +50 slots entrepôt par rang</li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🔍 Diagnostic (T1–T3)</div>
          <ul class="helpList">
            <li>🔍 Œil de Lynx (T1) — +6€ par analyse par rang</li>
            <li>📣 Bouche-à-Oreille (T1) — +5% REP gagnée par vente par rang</li>
            <li>🧠 Scan Avancé (T2) — +16€ par analyse par rang</li>
            <li>⭐ Expertise Reconnue (T2) — +2 REP par diagnostic manuel par rang</li>
            <li>🎓 Expert Certifié (T3) — +5% multiplicateur gain total diag par rang</li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🔓 Déblocage des tiers</div>
          <p>T2 se débloque avec <b>5 points investis</b> dans la catégorie. T3 nécessite <b>15 points</b>. Les talents T3 Atelier (Fournisseur Fidèle, Touche d'Or, Logistique Avancée) se débloquent en montant certains talents T2 à rang 5.</p>
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
          <div class="helpBlock__title">🔓 Conditions de prestige</div>
          <ul class="helpList">
            <li>Atteindre le <b>Niveau Garage 50</b></li>
            <li>Avoir <b>40 000 REP</b> (réduit à 30 000 avec la spécialisation Réputation Légendaire)</li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">💎 Points Héritage gagnés</div>
          <ul class="helpList">
            <li>🔵 <b>Base</b> : 1 point garanti</li>
            <li>📈 <b>Niveau garage</b> : +1 par tranche de 10 niveaux au-dessus de 50 <span style="color:#5566aa">(LVL 60 → +1, LVL 70 → +2…)</span></li>
            <li>🚗 <b>Ventes</b> : +1 par tranche de 5 000 voitures vendues</li>
            <li>⭐ <b>REP</b> : +1 par tranche de 25 000 REP au-dessus de 50 000 <span style="color:#5566aa">(75k → +1, 100k → +2…)</span></li>
            <li>✨ <b>Perk Gain Prestige</b> : multiplie le total</li>
          </ul>
          <p style="margin-top:8px;font-size:12px;color:#2ee59d">💡 Ex : LVL 80, 10 000 ventes, 100 000 REP → 1 + 3 + 2 + 2 = <b>8 points</b></p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🏭 Spécialisations de run</div>
          <p>À chaque prestige, tu choisis une <b>spécialisation</b> qui modifie profondément les règles du run suivant. Tu ne peux pas choisir deux fois de suite la même — cela force la variété et la découverte de styles de jeu différents.</p>
          <p style="margin-top:6px">La spécialisation est active <b>dès le début du run</b> jusqu'au prochain prestige. Elle est affichée en permanence dans l'onglet Prestige.</p>
          <div class="helpSpecGrid" style="margin-top:10px">

            <div class="helpSpecCard" style="--spec-clr:#4a9eff">
              <div class="helpSpecCard__head">
                <div class="helpSpecCard__icon">🔧</div>
                <div class="helpSpecCard__titles">
                  <div class="helpSpecCard__name">Atelier Turbo</div>
                  <div class="helpSpecCard__tagline">La vitesse avant tout</div>
                </div>
              </div>
              <div class="helpSpecCard__body">
                <div class="helpSpecCard__bonus helpSpecCard__bonus--pos"><span class="helpSpecCard__bonusVal">+40%</span><span class="helpSpecCard__bonusLabel">vitesse réparation</span></div>
                <div class="helpSpecCard__bonus helpSpecCard__bonus--pos"><span class="helpSpecCard__bonusVal">+40%</span><span class="helpSpecCard__bonusLabel">réparation auto</span></div>
                <div class="helpSpecCard__bonus helpSpecCard__bonus--neg"><span class="helpSpecCard__bonusVal">−15%</span><span class="helpSpecCard__bonusLabel">valeur de vente</span></div>
                <div class="helpSpecCard__bonus helpSpecCard__bonus--neg"><span class="helpSpecCard__bonusVal">−25%</span><span class="helpSpecCard__bonusLabel">revenus passifs</span></div>
                <div class="helpSpecCard__tip">🖱️ Idéal en jeu actif. Contre-indiqué en AFK.</div>
              </div>
            </div>

            <div class="helpSpecCard" style="--spec-clr:#ffc83a">
              <div class="helpSpecCard__head">
                <div class="helpSpecCard__icon">💰</div>
                <div class="helpSpecCard__titles">
                  <div class="helpSpecCard__name">Garage Prestige</div>
                  <div class="helpSpecCard__tagline">Le luxe ça se mérite</div>
                </div>
              </div>
              <div class="helpSpecCard__body">
                <div class="helpSpecCard__bonus helpSpecCard__bonus--pos"><span class="helpSpecCard__bonusVal">+35%</span><span class="helpSpecCard__bonusLabel">valeur de vente</span></div>
                <div class="helpSpecCard__bonus helpSpecCard__bonus--pos"><span class="helpSpecCard__bonusVal">×2</span><span class="helpSpecCard__bonusLabel">bonus tier S+</span></div>
                <div class="helpSpecCard__bonus helpSpecCard__bonus--neg"><span class="helpSpecCard__bonusVal">−20%</span><span class="helpSpecCard__bonusLabel">vitesse réparation</span></div>
                <div class="helpSpecCard__bonus helpSpecCard__bonus--neg"><span class="helpSpecCard__bonusVal">5 max</span><span class="helpSpecCard__bonusLabel">slots showroom</span></div>
                <div class="helpSpecCard__tip">💎 Vends manuellement tes S+ pour maximiser.</div>
              </div>
            </div>

            <div class="helpSpecCard" style="--spec-clr:#2ee59d">
              <div class="helpSpecCard__head">
                <div class="helpSpecCard__icon">🔍</div>
                <div class="helpSpecCard__titles">
                  <div class="helpSpecCard__name">Centre Diagnostic</div>
                  <div class="helpSpecCard__tagline">Chaque analyse compte</div>
                </div>
              </div>
              <div class="helpSpecCard__body">
                <div class="helpSpecCard__bonus helpSpecCard__bonus--pos"><span class="helpSpecCard__bonusVal">×3</span><span class="helpSpecCard__bonusLabel">gain diagnostic</span></div>
                <div class="helpSpecCard__bonus helpSpecCard__bonus--pos"><span class="helpSpecCard__bonusVal">+1</span><span class="helpSpecCard__bonusLabel">pt talent / 100 diags</span></div>
                <div class="helpSpecCard__bonus helpSpecCard__bonus--neg"><span class="helpSpecCard__bonusVal">−10%</span><span class="helpSpecCard__bonusLabel">vitesse réparation</span></div>
                <div class="helpSpecCard__bonus helpSpecCard__bonus--neg"><span class="helpSpecCard__bonusVal">−10%</span><span class="helpSpecCard__bonusLabel">valeur de vente</span></div>
                <div class="helpSpecCard__tip">⭐ Accélère les talents. Bon en AFK avec Stagiaire.</div>
              </div>
            </div>

            <div class="helpSpecCard" style="--spec-clr:#a78bfa">
              <div class="helpSpecCard__head">
                <div class="helpSpecCard__icon">📦</div>
                <div class="helpSpecCard__titles">
                  <div class="helpSpecCard__name">Logistique Pro</div>
                  <div class="helpSpecCard__tagline">La pièce, toujours disponible</div>
                </div>
              </div>
              <div class="helpSpecCard__body">
                <div class="helpSpecCard__bonus helpSpecCard__bonus--pos"><span class="helpSpecCard__bonusVal">×2</span><span class="helpSpecCard__bonusLabel">slots livraison</span></div>
                <div class="helpSpecCard__bonus helpSpecCard__bonus--pos"><span class="helpSpecCard__bonusVal">−50%</span><span class="helpSpecCard__bonusLabel">délai livraison</span></div>
                <div class="helpSpecCard__bonus helpSpecCard__bonus--pos"><span class="helpSpecCard__bonusVal">+25%</span><span class="helpSpecCard__bonusLabel">bonus pièces sur vente</span></div>
                <div class="helpSpecCard__bonus helpSpecCard__bonus--neg"><span class="helpSpecCard__bonusVal">−20%</span><span class="helpSpecCard__bonusLabel">gain REP</span></div>
                <div class="helpSpecCard__tip">💤 Meilleur choix pour jouer AFK.</div>
              </div>
            </div>

            <div class="helpSpecCard" style="--spec-clr:#ff8c40;grid-column:1/-1">
              <div class="helpSpecCard__head">
                <div class="helpSpecCard__icon">⭐</div>
                <div class="helpSpecCard__titles">
                  <div class="helpSpecCard__name">Réputation Légendaire</div>
                  <div class="helpSpecCard__tagline">Ton nom vaut de l'or</div>
                </div>
              </div>
              <div class="helpSpecCard__body" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:3px 8px">
                <div class="helpSpecCard__bonus helpSpecCard__bonus--pos"><span class="helpSpecCard__bonusVal">×2</span><span class="helpSpecCard__bonusLabel">gain REP</span></div>
                <div class="helpSpecCard__bonus helpSpecCard__bonus--pos"><span class="helpSpecCard__bonusVal">−25%</span><span class="helpSpecCard__bonusLabel">REP requise prestige</span></div>
                <div class="helpSpecCard__bonus helpSpecCard__bonus--neg"><span class="helpSpecCard__bonusVal">−20%</span><span class="helpSpecCard__bonusLabel">tous les revenus</span></div>
                <div class="helpSpecCard__tip" style="grid-column:1/-1">🚀 Prestige speedrun. Compense avec les talents Business.</div>
              </div>
            </div>

          </div>
          <div class="helpBlock__title" style="margin-top:14px">💡 Quel choix pour commencer ?</div>
          <ul class="helpList">
            <li>🖱️ Tu joues <b>actif</b> → <b>Atelier Turbo</b> ou <b>Garage Prestige</b></li>
            <li>💤 Tu joues <b>AFK</b> → <b>Logistique Pro</b> ou <b>Centre Diagnostic</b></li>
            <li>🚀 Tu veux <b>prestige rapide</b> → <b>Réputation Légendaire</b></li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">✅ Ce qui survit au prestige</div>
          <ul class="helpList">
            <li>✅ Points talent et rangs de tous les talents</li>
            <li>✅ Points Héritage et perks achetés</li>
            <li>✅ Succès débloqués</li>
            <li>❌ Argent, REP, niveau garage, upgrades, pièces, commandes en cours</li>
          </ul>
        </div>
      </div>
    `
  },

  tips: {
    title: "💡 Astuces & Conseils",
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
            <li>Vends manuellement les voitures <b>S, SS, SSS, SSS+</b> — le vendeur auto ne fait pas de tri</li>
            <li><b>Bochmann</b> est le meilleur fournisseur (−30% temps répa, +50% valeur revente) mais livraison lente (5min) — utilise <b>TopDrive</b> pour les urgences (5s)</li>
            <li>Talent <b>Clientèle Haut de Gamme</b> est très rentable en fin de run sur les tiers S+</li>
            <li><b>Entrepôt Automatisé</b> : +2%/rang de valeur si pièces utilisées — combiné à Bochmann, effet cumulatif puissant</li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">📦 Gérer son entrepôt</div>
          <ul class="helpList">
            <li>L'entrepôt plein <b>bloque toutes les commandes</b> — surveille la jauge dans l'onglet Stock</li>
            <li>Talent <b>Gestionnaire de Stock</b> divise par 2 l'espace des petites pièces (F/E/D)</li>
            <li>Priorité upgrades : Étagères → Rayonnage → Zone Logistique (pour réduire les délais aussi)</li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🔥 Avant de prestige</div>
          <ul class="helpList">
            <li>Vide ton showroom et dépense tout ton argent en upgrades — tu ne gardes rien</li>
            <li>Dépense tous tes points Héritage disponibles avant de confirmer</li>
            <li>Vise REP > 75 000 pour maximiser les points Héritage (+1 point dès 75k)</li>
            <li>Choisis ta spécia selon ton style : Atelier Turbo si tu joues actif, Logistique Pro si tu joues AFK</li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">⏱️ Optimiser l'AFK</div>
          <ul class="helpList">
            <li>Le jeu rattrape au maximum <b>4 heures</b> hors-ligne — reviens toutes les 4h pour maximiser</li>
            <li>Avant de fermer : commandes de pièces en attente, showroom non saturé, vendeur auto actif</li>
            <li>Spécialisation <b>Logistique Pro</b> est la plus efficace en AFK (livraisons rapides, stock automatique)</li>
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
