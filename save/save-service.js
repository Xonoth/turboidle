// =============================================================================
// save-service.js
// Garage Turbo — Orchestrateur de la sauvegarde
//
// SaveService est l'UNIQUE point d'entrée pour charger et sauvegarder
// la progression. Il :
//   - gère les flags de concurrence (loading / saving)
//   - délègue la sérialisation à save-snapshot.js
//   - délègue la persistance à SaveRepository
//   - ne connaît ni Supabase, ni Steam, ni le DOM
//
// DÉPENDANCES GLOBALES ATTENDUES (app.js) :
//   buildSaveSnapshot, applySaveSnapshot,
//   renderAll, tryStartNextRepair, showSaveIndicator
// =============================================================================

class SaveService {
  /**
   * @param {SaveRepository} repository - Une instance de SupabaseSaveRepository,
   *   SteamSaveRepository, etc.
   */
  constructor(repository) {
    if(!repository) throw new Error("SaveService: repository requis");

    this._repo        = repository;
    this._loading     = false;  // un cloudLoad est en cours
    this._saving      = false;  // un cloudSave est en cours
    this._ready       = false;  // true après le premier load (succès ou échec)
    this._pendingSave = false;  // un save a été demandé pendant qu'un autre tournait
    this._loadFailed  = false;  // true si le load cloud a échoué — bloque l'autosave

    this._LS_KEY      = "garage_turbo_backup";  // clé localStorage
    this._lastSaveAt  = 0;                       // timestamp dernier save cloud (rate limit)
    this._saveMinGap  = 30_000;                  // 30s minimum entre deux saves cloud
  }

  // ── Backup localStorage ──────────────────────────────────────────────────────

  _lsWrite(snapshot) {
    try {
      localStorage.setItem(this._LS_KEY, JSON.stringify(snapshot));
    } catch(e) {
      dbg("[SaveService] localStorage write échoué:", e.message);
    }
  }

  _lsRead() {
    try {
      const raw = localStorage.getItem(this._LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch(e) {
      dbg("[SaveService] localStorage read échoué:", e.message);
      return null;
    }
  }

  _lsClear() {
    try { localStorage.removeItem(this._LS_KEY); } catch(e) {}
  }

  // ── Bannière d'alerte load failed ───────────────────────────────────────────

  _showLoadFailBanner() {
    if(document.getElementById("gt-load-fail-banner")) return; // déjà affichée

    const banner = document.createElement("div");
    banner.id = "gt-load-fail-banner";
    banner.style.cssText = [
      "position:fixed","top:0","left:0","right:0","z-index:99999",
      "background:linear-gradient(135deg,#7f1d1d,#991b1b)",
      "border-bottom:2px solid #f87171",
      "color:#fef2f2","font-size:13px","font-weight:600",
      "display:flex","align-items:center","justify-content:space-between",
      "padding:10px 16px","gap:12px","box-shadow:0 2px 12px rgba(0,0,0,.5)"
    ].join(";");

    const msg = document.createElement("span");
    msg.innerHTML = "⚠️&nbsp; Connexion au cloud échouée au chargement — "
      + "<strong>ta progression n'est pas sauvegardée</strong>. "
      + "Recharge la page pour réessayer.";

    const btn = document.createElement("button");
    btn.textContent = "✕ Fermer";
    btn.style.cssText = [
      "background:rgba(255,255,255,.15)","border:1px solid rgba(255,255,255,.3)",
      "color:#fef2f2","border-radius:6px","padding:4px 10px","cursor:pointer",
      "font-size:12px","white-space:nowrap","flex-shrink:0"
    ].join(";");
    btn.onclick = () => banner.remove();

    banner.appendChild(msg);
    banner.appendChild(btn);

    // Insérer en top du body dès que le DOM est prêt
    const insert = () => document.body ? document.body.prepend(banner)
                                       : document.addEventListener("DOMContentLoaded", insert);
    insert();
  }

  _hideLoadFailBanner() {
    document.getElementById("gt-load-fail-banner")?.remove();
  }

  // ── Accesseurs ──────────────────────────────────────────────────────────────

  /** @returns {boolean} true dès que le premier load est terminé */
  get isReady()   { return this._ready;   }

  /** @returns {boolean} true pendant un load actif */
  get isLoading() { return this._loading; }

  /** @returns {boolean} true pendant un save actif */
  get isSaving()  { return this._saving;  }

  // ── load ────────────────────────────────────────────────────────────────────
  /**
   * Charge la progression depuis le repository.
   * Appelé UNE SEULE FOIS à la connexion (protégé par _initialLoadDone dans app.js).
   * Met _ready = true dans le finally, qu'il y ait eu une erreur ou non.
   *
   * @param {string} userId
   */
  async load(userId) {
    if(this._loading) {
      dbg("[SaveService] load() déjà en cours — ignoré");
      return;
    }

    this._loading = true;
    dbg("[SaveService] load() pour user:", userId);
    showSaveIndicator("☁️ Chargement...");

    try {
      const snapshot = await this._repo.load(userId);

      if(snapshot) {
        dbg("[SaveService] snapshot trouvé, application...");

        // ── Vérification HMAC ───────────────────────────────────────────
        if(snapshot._sig && typeof _hmacVerify !== "undefined") {
          const { _sig, ...unsigned } = snapshot;
          const valid = await _hmacVerify(JSON.stringify(unsigned), _sig);
          if(!valid) {
            dbg("[SaveService] ⚠️ Signature invalide — save potentiellement modifiée");
            snapshot._suspectSave = true;
          }
        }

        const currentTab = state.activeTab; // préserver l'onglet actif
        applySaveSnapshot(snapshot);
        if(currentTab) state.activeTab = currentTab;
        updateTopbarProfile(); // rafraîchit le pseudo/avatar dès que le profil est chargé
        showSaveIndicator("☁️ Partie chargée");
        this._hideLoadFailBanner();  // load réussi — on retire la bannière si elle était là
      } else {
        dbg("[SaveService] aucun snapshot — nouvelle partie");
        this._hideLoadFailBanner();
      }

      renderAll(true, true);
      if(typeof initChallenges === 'function') initChallenges();
    } catch(e) {
      // Supabase cold start, réseau instable, etc.
      console.error("[SaveService] load() erreur:", e.message);
      this._loadFailed = true;  // bloquer l'autosave — on n'a pas lu la save cloud
      this._showLoadFailBanner();

      // ── Fallback localStorage ─────────────────────────────────────────
      const backup = this._lsRead();
      if(backup) {
        dbg("[SaveService] fallback localStorage — backup trouvé");
        try {
          const currentTab = state.activeTab;
          applySaveSnapshot(backup);
          if(currentTab) state.activeTab = currentTab;
          updateTopbarProfile();
          showSaveIndicator("⚠️ Cloud indispo — sauvegarde locale chargée");
        } catch(e2) {
          console.error("[SaveService] fallback LS échoué:", e2.message);
          showSaveIndicator("⚠️ Cloud indisponible");
        }
      } else {
        showSaveIndicator("⚠️ Cloud indisponible");
      }

      renderAll(true, true);
      if(typeof initChallenges === 'function') initChallenges();
    } finally {
      this._loading = false;
      this._ready   = true;   // autosave peut maintenant s'activer
      tryStartNextRepair();
    }
  }

  // ── save ────────────────────────────────────────────────────────────────────
  /**
   * Sauvegarde la progression courante dans le repository.
   * Silencieux si : pas encore prêt, déjà en cours, ou un load est actif.
   *
   * @param {string} userId
   */
  async save(userId) {
    if(!this._ready)      { dbg("[SaveService] save() ignoré — pas encore prêt"); return; }
    if(this._loading)     { dbg("[SaveService] save() ignoré — load en cours");    return; }
    if(this._loadFailed) {
      // Sur mobile, timeout réseau fréquent. Retry silencieux avant de bloquer.
      try {
        const remote = await this._repo.load(userId);
        if(remote !== undefined) {
          this._loadFailed = false;
          this._hideLoadFailBanner();
          dbg("[SaveService] save() — retry load réussi, save débloqué");
        }
      } catch(e) {
        dbg("[SaveService] save() BLOQUÉ — retry échoué:", e.message);
        showSaveIndicator("⚠️ Sauvegarde cloud bloquée (réseau indispo)");
        try { const snap = await buildSaveSnapshot(); this._lsWrite(snap); } catch(_) {}
        return;
      }
    }

    // Si un save tourne déjà, on mémorise qu'un nouveau save est nécessaire.
    // Le finally du save en cours le déclenchera automatiquement.
    if(this._saving) {
      this._pendingSave = true;
      dbg("[SaveService] save() — pending enregistré");
      return;
    }

    this._saving = true;
    this._pendingSave = false;
    dbg("[SaveService] save() pour user:", userId);

    // ── Rate limit cloud save (30s minimum) ─────────────────────────────
    const _now = Date.now();
    if(_now - this._lastSaveAt < this._saveMinGap) {
      dbg("[SaveService] save() rate-limité — dernier save il y a", Math.round((_now - this._lastSaveAt)/1000) + "s");
      // Écriture locale quand même
      try { const snap = await buildSaveSnapshot(); this._lsWrite(snap); } catch(_) {}
      this._saving = false;
      return;
    }
    this._lastSaveAt = _now;

    // Snapshot déclaré ici pour être accessible dans le catch (fallback LS)
    let snapshot = null;
    try {
      snapshot = await buildSaveSnapshot();
      await this._repo.upsert(userId, snapshot);
      this._lsWrite(snapshot);  // backup local systématique après save cloud OK
      dbg("[SaveService] save() ✅ succès");
      showSaveIndicator("☁️ Sauvegardé");
    } catch(e) {
      console.error("[SaveService] save() erreur:", e.message);
      // Même si Supabase échoue, on préserve en localStorage
      try {
        this._lsWrite(snapshot);
        showSaveIndicator("⚠️ Cloud KO — sauvegarde locale");
      } catch(e2) {
        showSaveIndicator("⚠️ Erreur cloud");
      }
    } finally {
      this._saving = false;
      // Si un save a été demandé pendant qu'on tournait, on le relance immédiatement.
      if(this._pendingSave) {
        this._pendingSave = false;
        dbg("[SaveService] save() — exécution du pending save");
        this.save(userId);
      }
    }
  }

  // ── reset ───────────────────────────────────────────────────────────────────
  /**
   * Réinitialise les flags internes du service.
   * À appeler lors d'une déconnexion (SIGNED_OUT) pour autoriser
   * un prochain load propre à la reconnexion.
   */
  reset() {
    this._loading     = false;
    this._saving      = false;
    this._ready       = false;
    this._pendingSave = false;
    this._loadFailed  = false;
    this._hideLoadFailBanner();
    dbg("[SaveService] reset()");
  }
}
