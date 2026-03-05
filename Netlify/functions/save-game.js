// netlify/functions/save-game.js
// Reçoit la sauvegarde du joueur, vérifie son token Identity, stocke dans Supabase

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  // CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  // 1. Vérifier le token Netlify Identity
  const authHeader = event.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: "Non authentifié" }) };
  }

  // Décoder le JWT (Netlify Identity signe avec HS256, on vérifie via leur endpoint)
  let userId;
  try {
    // Appel à l'API Identity pour valider le token et récupérer l'user
    const identityUrl = process.env.URL + "/.netlify/identity";
    const userRes = await fetch(`${identityUrl}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) throw new Error("Token invalide");
    const user = await userRes.json();
    userId = user.id; // UUID Netlify Identity
  } catch (err) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: "Token invalide ou expiré" }) };
  }

  // 2. Parser le body
  let saveData;
  try {
    saveData = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "JSON invalide" }) };
  }

  // 3. Nettoyer les données sensibles / inutiles avant stockage
  const cleanSave = {
    garageLevel:        saveData.garageLevel,
    garageCap:          saveData.garageCap,
    garageName:         saveData.garageName,
    money:              saveData.money,
    moneyPerSec:        saveData.moneyPerSec,
    rep:                saveData.rep,
    carsSold:           saveData.carsSold,
    diagReward:         saveData.diagReward,
    repairClick:        saveData.repairClick,
    repairAuto:         saveData.repairAuto,
    speedMult:          saveData.speedMult,
    saleBonusPct:       saveData.saleBonusPct,
    talentPoints:       saveData.talentPoints,
    talentLevelGranted: saveData.talentLevelGranted,
    talents:            saveData.talents,
    upgrades:           saveData.upgrades,
    showroom:           saveData.showroom,
    queue:              saveData.queue,
    activeTab:          saveData.activeTab,
    // Stats
    totalMoneyEarned:   saveData.totalMoneyEarned,
    totalRepairs:       saveData.totalRepairs,
    totalAnalyses:      saveData.totalAnalyses,
    totalClickRepairs:  saveData.totalClickRepairs,
    sessionStart:       saveData.sessionStart,
  };

  // 4. Upsert dans Supabase (insert ou update si l'user existe déjà)
  const { error } = await supabase
    .from("saves")
    .upsert(
      { user_id: userId, save_data: cleanSave },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Supabase error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Erreur sauvegarde" }) };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ok: true, saved_at: new Date().toISOString() }),
  };
};
