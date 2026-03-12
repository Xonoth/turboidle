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
            <div class="helpStep">
              <span class="helpStep__num">1</span>
              <div><b>Diagnostique</b> une voiture via le bouton ANALYSER → elle entre dans la file de réparation.</div>
            </div>
            <div class="helpStep">
              <span class="helpStep__num">2</span>
              <div><b>Répare</b> la voiture (clic manuel ou automatique) jusqu'à ce qu'elle soit prête.</div>
            </div>
            <div class="helpStep">
              <span class="helpStep__num">3</span>
              <div>La voiture <b>passe au showroom</b> automatiquement.</div>
            </div>
            <div class="helpStep">
              <span class="helpStep__num">4</span>
              <div><b>Vends</b> la voiture pour gagner de l'argent et de la réputation (REP).</div>
            </div>
            <div class="helpStep">
              <span class="helpStep__num">5</span>
              <div>Plus tu as de REP, plus tu débloques des tiers de voitures <b>rares et chères</b>.</div>
            </div>
          </div>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">📈 Comment progresser ?</div>
          <p>Tes ventes font monter le <b>Niveau Garage</b> (LVL) — chaque niveau augmente ta capacité et tes revenus passifs. Investis dans les <b>Améliorations</b> (onglet Bureau) et les <b>Talents</b> pour accélérer.</p>
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
          <p>Clique sur <b>ANALYSER</b> pour faire rentrer une nouvelle voiture. Chaque analyse te rapporte aussi de l'argent instantanément. Tu ne peux analyser que si une place est disponible à l'atelier.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">⚡ Réparation manuelle</div>
          <p>Clique sur la <b>barre de progression</b> de la voiture active pour avancer la réparation à la main. Chaque clic retire du temps de réparation — utile au début quand tu n'as pas encore de mécanicien automatique.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🤖 Réparation automatique</div>
          <p>En achetant des améliorations (Apprenti, Mécanicien) et des talents (Multi Shift), ton garage répare tout seul. Tu peux laisser tourner sans cliquer.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🔩 Pannes et pièces détachées</div>
          <p>Certaines voitures arrivent avec une <b>panne</b> (ex: "Moteur HS"). Si tu as les pièces nécessaires en stock, elles sont utilisées automatiquement lors de la réparation et <b>augmentent la valeur de revente</b> du véhicule.</p>
          <p>Commande tes pièces dans l'onglet <b>Stock</b> du Bureau.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🏎️ File d'attente</div>
          <p>Plusieurs voitures peuvent attendre en file. La capacité de la file augmente avec le niveau du garage. Une seule voiture est en réparation active à la fois.</p>
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
          <p>L'amélioration <b>Vendeur</b> (Bureau → Outils) vend automatiquement la voiture la plus ancienne du showroom. Pratique pour l'idle, mais attention : il vend aussi les voitures chères sans discrimination.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🏷️ Tiers de véhicules</div>
          <div class="helpTierList">
            <div class="helpTier" style="color:#8ca8c0">F — Épave <span>0 REP</span></div>
            <div class="helpTier" style="color:#a0b890">E — Populaire <span>0 REP</span></div>
            <div class="helpTier" style="color:#c4b870">D — Commune <span>500 REP</span></div>
            <div class="helpTier" style="color:#4dff9a">C — Correcte <span>1 500 REP</span></div>
            <div class="helpTier" style="color:#7ab0ff">B — Sportive <span>5 000 REP</span></div>
            <div class="helpTier" style="color:#a07aff">A — Rare <span>8 000 REP</span></div>
            <div class="helpTier" style="color:#ffc83a">S — Prestige <span>25 000 REP</span></div>
            <div class="helpTier" style="color:#ff8c40">SS — Collection <span>70 000 REP</span></div>
            <div class="helpTier" style="color:#ff4d70">SSS — Légendaire <span>180 000 REP</span></div>
            <div class="helpTier" style="color:#ffffff">SSS+ — Mythique <span>450 000 REP</span></div>
          </div>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">📦 Slots showroom</div>
          <p>Tu peux exposer plusieurs voitures en même temps. Augmente les slots via l'amélioration <b>Slot Showroom</b> ou le talent <b>Expansion Vitrine</b>.</p>
        </div>
      </div>
    `
  },

  rep: {
    title: "⭐ Réputation (REP)",
    content: `
      <div class="helpSection">
        <p class="helpLead">La REP est la ressource clé du jeu. Elle détermine quels tiers de voitures tu peux recevoir et permet d'atteindre le Prestige.</p>

        <div class="helpBlock">
          <div class="helpBlock__title">Comment gagner de la REP ?</div>
          <ul class="helpList">
            <li>🚗 <b>Vendre des voitures</b> — chaque tier donne un gain REP différent (S+ donne beaucoup plus)</li>
            <li>📅 <b>Compléter des défis journaliers</b> — bonus REP à la clé, et bonus supplémentaire si tu complètes les 3</li>
            <li>🎖️ <b>Débloquer des succès</b> — certains donnent de la REP</li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">⚠️ La REP ne baisse jamais</div>
          <p>Tu accumules la REP définitivement dans un run. Elle repart à 0 uniquement au <b>Prestige</b>.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">📅 Défis journaliers</div>
          <p>Chaque jour, 3 défis sont générés (ex: "Vendre 10 voitures tier B+"). Complète-les pour gagner de l'argent et des points talent. Compléter les 3 débloque un <b>bonus REP</b>.</p>
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
          <p>Quand une voiture a une panne, utiliser les bonnes pièces lors de la réparation <b>augmente sa valeur de revente</b>. Sans pièces, la voiture est quand même réparée, mais vaut moins.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🏭 Fournisseurs</div>
          <p>Plusieurs fournisseurs proposent les mêmes pièces à des prix et délais différents :</p>
          <ul class="helpList">
            <li><b>Euroline</b> — pas cher, livraison rapide, qualité standard</li>
            <li><b>Bochmann</b> — qualité supérieure, prix plus élevé</li>
            <li><b>Valéo Plus</b> — spécialisé, bonus sur certains types de pièces</li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🤖 Commande automatique</div>
          <p>Dans l'onglet <b>Stock Global</b>, tu peux activer la commande automatique : quand le stock d'une pièce tombe sous le seuil défini, une commande est passée automatiquement (dans la limite de 20% de ton argent).</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">💡 Conseil</div>
          <p>Achète en <b>×10 ou ×50</b> pour économiser des clics. Les pièces sont débitées à la commande — vérifie ton solde avant un gros achat.</p>
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
            <li>Avoir <b>40 000 REP</b> (peut être réduit par une spécialisation)</li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">💎 Points Héritage</div>
          <p>À chaque prestige tu gagnes des points Héritage, à dépenser dans l'arbre Héritage pour des bonus permanents : vitesse de réparation, capital de départ, gain REP, etc.</p>
          <p style="margin-top:8px;font-size:12px;color:#7788aa">Le calcul est le suivant :</p>
          <ul class="helpList" style="margin-top:6px">
            <li>🔵 <b>Base</b> : 1 point garanti à chaque prestige</li>
            <li>📈 <b>Niveau garage</b> : +1 point par tranche de 10 niveaux au-dessus de 50 <span style="color:#5566aa">(LVL 60 → +1, LVL 70 → +2…)</span></li>
            <li>🚗 <b>Voitures vendues</b> : +1 point par tranche de 5 000 ventes</li>
            <li>⭐ <b>REP</b> : +1 point par tranche de 25 000 REP au-dessus de 50 000 <span style="color:#5566aa">(75k → +1, 100k → +2…)</span></li>
            <li>✨ <b>Perk Héritage</b> : le perk <b>Gain Prestige</b> multiplie ce total</li>
          </ul>
          <p style="margin-top:10px;font-size:12px;color:#2ee59d">💡 Exemple : LVL 80, 10 000 ventes, 100 000 REP → 1 + 3 + 2 + 2 = <b>8 points</b></p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🏭 Spécialisations</div>
          <p>À partir du 1er prestige, tu choisis une <b>spécialisation</b> pour chaque run. Elle booste fortement un aspect du jeu au détriment d'un autre :</p>
          <ul class="helpList">
            <li>🔧 <b>Atelier Turbo</b> — répare ultra vite, vend moins cher</li>
            <li>💰 <b>Garage Prestige</b> — vente très rentable, rythme plus lent</li>
            <li>🔍 <b>Centre Diagnostic</b> — revenus diagnostic ×3, bonus talents</li>
            <li>📦 <b>Logistique Pro</b> — stock optimisé, REP réduite</li>
            <li>⭐ <b>Réputation Légendaire</b> — REP ×2, prestige plus accessible</li>
          </ul>
          <p>Tu ne peux pas choisir la même spécialisation deux fois de suite.</p>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">⭐ Talents</div>
          <p>Les points talent s'accumulent run après run et survivent au prestige. Investis-les dans l'arbre Talents pour des améliorations passives (vitesse, vente, diagnostic, stock).</p>
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
            <li>Clique sur ANALYSER dès qu'une place est libre — ne laisse jamais l'atelier vide</li>
            <li>Achète <b>Apprenti Mécanicien</b> en premier dans le Bureau pour automatiser les réparations</li>
            <li>Investis dans <b>Vitesse Atelier</b> en talents dès que tu as des points</li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">💰 Optimiser ses revenus</div>
          <ul class="helpList">
            <li>Vends manuellement les voitures <b>S, SS, SSS et SSS+</b> — le vendeur auto ne fait pas de distinction</li>
            <li>Les pièces de qualité Bochmann augmentent sensiblement la valeur de revente</li>
            <li>Le talent <b>Clientèle Haut de Gamme</b> booste les véhicules S+ — très rentable en fin de run</li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">🔥 Avant de prestige</div>
          <ul class="helpList">
            <li>Vide ton showroom et dépense tout ton argent en améliorations — tu ne garderas rien</li>
            <li>Assure-toi d'avoir dépensé tous tes points Héritage disponibles</li>
            <li>Choisis ta spécialisation en fonction de ton style de jeu pour ce run</li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">📅 Défis journaliers</div>
          <ul class="helpList">
            <li>Les défis se réinitialisent chaque jour à minuit</li>
            <li>Ils sont générés selon ton niveau de garage actuel au moment de la génération</li>
            <li>Compléter les 3 donne un <b>bonus REP</b> supplémentaire</li>
          </ul>
        </div>

        <div class="helpBlock">
          <div class="helpBlock__title">💾 Sauvegarde</div>
          <p>La progression est <b>sauvegardée automatiquement</b> dans le cloud (compte requis) ou localement. La progression hors-ligne est rattrapée au retour jusqu'à 8 heures maximum.</p>
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
