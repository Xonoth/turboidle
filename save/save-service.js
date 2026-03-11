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

    this._repo    = repository;
    this._loading     = false;  // un cloudLoad est en cours
    this._saving      = false;  // un cloudSave est en cours
    this._ready       = false;  // true après le premier load (succès ou échec)
    this._pendingSave = false;  // un save a été demandé pendant qu'un autre tournait
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
        const currentTab = state.activeTab; // préserver l'onglet actif
        applySaveSnapshot(snapshot);
        if(currentTab) state.activeTab = currentTab;
        updateTopbarProfile(); // rafraîchit le pseudo/avatar dès que le profil est chargé
        showSaveIndicator("☁️ Partie chargée");
      } else {
        dbg("[SaveService] aucun snapshot — nouvelle partie");
      }

      renderAll(true, true);
      if(typeof initChallenges === 'function') initChallenges();
    } catch(e) {
      // Supabase cold start, réseau instable, etc.
      // On laisse le jeu démarrer en état initial — pas de blocage.
      console.error("[SaveService] load() erreur:", e.message);
      showSaveIndicator("⚠️ Cloud indisponible");
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
    if(!this._ready)  { dbg("[SaveService] save() ignoré — pas encore prêt"); return; }
    if(this._loading) { dbg("[SaveService] save() ignoré — load en cours");    return; }

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

    try {
      // Snapshot capturé AVANT le await — reflète l'état exact au moment du clic.
      const snapshot = buildSaveSnapshot();
      await this._repo.upsert(userId, snapshot);
      dbg("[SaveService] save() ✅ succès");
      showSaveIndicator("☁️ Sauvegardé");
    } catch(e) {
      console.error("[SaveService] save() erreur:", e.message);
      showSaveIndicator("⚠️ Erreur cloud");
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
    dbg("[SaveService] reset()");
  }
}
