// =============================================================================
// save-repository.js
// Garage Turbo — Contrat et implémentation Supabase de la persistance
//
// Ce fichier définit :
//   1. SaveRepository  : interface JSDoc (contrat que toute implémentation doit respecter)
//   2. SupabaseSaveRepository : implémentation pour Supabase (web)
//
// Ajouts futurs dans ce même fichier ou dans des fichiers séparés :
//   - SteamSaveRepository  (Steam Cloud via Greenworks)
//   - FileSaveRepository   (fichier local, NW.js / Electron)
//   - MemorySaveRepository (tests unitaires)
// =============================================================================

// ─── Interface SaveRepository (JSDoc) ────────────────────────────────────────
/**
 * @interface SaveRepository
 *
 * Contrat de stockage de la progression d'un joueur.
 * Aucune implémentation concrète ne doit être appelée directement par le
 * game core — toujours passer par SaveService.
 *
 * @typedef {Object} SaveSnapshot
 * @property {number} v        - Version du format
 * @property {number} savedAt  - Timestamp Date.now() de la dernière sauvegarde
 * ... (voir save-snapshot.js pour la structure complète)
 */
class SaveRepository {
  /**
   * Charge le snapshot de progression du joueur.
   * @param {string} userId
   * @returns {Promise<SaveSnapshot|null>} null si aucune save existante
   */
  async load(userId) {   // eslint-disable-line no-unused-vars
    throw new Error("SaveRepository.load() non implémenté");
  }

  /**
   * Crée ou met à jour le snapshot de progression du joueur.
   * @param {string}       userId
   * @param {SaveSnapshot} snapshot
   * @returns {Promise<void>}
   */
  async upsert(userId, snapshot) {   // eslint-disable-line no-unused-vars
    throw new Error("SaveRepository.upsert() non implémenté");
  }

  /**
   * Supprime la progression du joueur.
   * Utilisé pour la réinitialisation / RGPD.
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async delete(userId) {   // eslint-disable-line no-unused-vars
    throw new Error("SaveRepository.delete() non implémenté");
  }
}

// ─── SupabaseSaveRepository ───────────────────────────────────────────────────
/**
 * Implémentation de SaveRepository pour Supabase.
 *
 * Schéma attendu de la table `saves` :
 *   user_id    UUID  PRIMARY KEY REFERENCES auth.users
 *   save_data  JSONB NOT NULL
 *   updated_at TIMESTAMPTZ DEFAULT now()
 *
 * Row Level Security recommandée :
 *   CREATE POLICY "own_save" ON saves USING (auth.uid() = user_id);
 */
class SupabaseSaveRepository extends SaveRepository {
  /** @param {import('@supabase/supabase-js').SupabaseClient} client */
  constructor(client) {
    super();
    this._client = client;
  }

  async load(userId) {
    const { data, error } = await this._client
      .from("saves")
      .select("save_data")
      .eq("user_id", userId)
      .maybeSingle();

    if(error) throw error;
    return data?.save_data ?? null;
  }

  async upsert(userId, snapshot) {
    // ── Protection anti-rollback multi-appareils / horloge dérivée ──────────
    // Utilise la progression (prestige × level × argent) plutôt que savedAt
    // car l'horloge mobile peut dériver ou être incorrecte.
    try {
      const { data: current } = await this._client
        .from("saves")
        .select("save_data->prestigeCount, save_data->garageLevel, save_data->totalMoneyEarned")
        .eq("user_id", userId)
        .maybeSingle();

      if(current) {
        const remoteScore = ((current.prestigeCount    ?? 0) * 1e9)
                          + ((current.garageLevel       ?? 0) * 1e6)
                          + Math.min(current.totalMoneyEarned ?? 0, 1e6);
        const localScore  = ((snapshot.prestigeCount   ?? 0) * 1e9)
                          + ((snapshot.garageLevel      ?? 0) * 1e6)
                          + Math.min(snapshot.totalMoneyEarned ?? 0, 1e6);

        // Save distante clairement plus avancée (tolérance 2 niveaux) → skip
        if(remoteScore > localScore + 2e6) {
          dbg("[SaveRepo] upsert ignoré — save cloud plus avancée", remoteScore, ">", localScore);
          return;
        }
      }
    } catch(e) {
      // Lecture protection échouée → upsert quand même (fail-safe)
      dbg("[SaveRepo] lecture protection échouée, upsert forcé:", e.message);
    }

    const { error } = await this._client
      .from("saves")
      .upsert(
        {
          user_id:    userId,
          save_data:  snapshot,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if(error) throw error;
  }

  async delete(userId) {
    const { error } = await this._client
      .from("saves")
      .delete()
      .eq("user_id", userId);

    if(error) throw error;
  }
}

// ─── SteamSaveRepository (squelette prêt pour le port Steam) ─────────────────
/**
 * Implémentation de SaveRepository pour Steam Cloud.
 * Nécessite Greenworks (Node.js bindings Steamworks) via NW.js ou Electron.
 * Le userId Steam est ignoré — Steam identifie le joueur nativement.
 *
 * À activer lors du port Steam :
 *   const saveRepo = new SteamSaveRepository(require('greenworks'));
 */
class SteamSaveRepository extends SaveRepository {
  /** @param {object} greenworks - require('greenworks') */
  constructor(greenworks) {
    super();
    this._gw = greenworks;
  }

  async load(_userId) {
    return new Promise((resolve) => {
      this._gw.readTextFromFile(
        "save.json",
        (raw) => {
          try { resolve(JSON.parse(raw)); }
          catch { resolve(null); }
        },
        () => resolve(null)   // fichier absent = nouvelle partie
      );
    });
  }

  async upsert(_userId, snapshot) {
    return new Promise((resolve, reject) => {
      this._gw.saveTextToFile(
        "save.json",
        JSON.stringify(snapshot),
        resolve,
        (err) => reject(new Error(err))
      );
    });
  }

  async delete(_userId) {
    return new Promise((resolve, reject) => {
      this._gw.deleteFile(
        "save.json",
        resolve,
        (err) => reject(new Error(err))
      );
    });
  }
}


