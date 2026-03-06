// netlify/functions/save-game.js
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const padded = payload + "=".repeat((4 - payload.length % 4) % 4);
    const decoded = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  const token = (event.headers.authorization || "").replace("Bearer ", "").trim();
  if (!token) return { statusCode: 401, headers, body: JSON.stringify({ error: "Token manquant" }) };

  const payload = decodeJwt(token);
  if (!payload || !payload.sub) return { statusCode: 401, headers, body: JSON.stringify({ error: "Token invalide" }) };
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return { statusCode: 401, headers, body: JSON.stringify({ error: "Token expiré" }) };

  const userId = payload.sub;

  let saveData;
  try { saveData = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: "JSON invalide" }) }; }

  const cleanSave = {
    garageLevel: saveData.garageLevel, garageCap: saveData.garageCap, garageName: saveData.garageName,
    money: saveData.money, moneyPerSec: saveData.moneyPerSec, rep: saveData.rep, carsSold: saveData.carsSold,
    diagReward: saveData.diagReward, repairClick: saveData.repairClick, repairAuto: saveData.repairAuto,
    speedMult: saveData.speedMult, saleBonusPct: saveData.saleBonusPct,
    talentPoints: saveData.talentPoints, talentLevelGranted: saveData.talentLevelGranted,
    talents: saveData.talents, upgrades: saveData.upgrades,
    showroom: saveData.showroom, queue: saveData.queue, activeTab: saveData.activeTab,
    totalMoneyEarned: saveData.totalMoneyEarned, totalRepairs: saveData.totalRepairs,
    totalAnalyses: saveData.totalAnalyses, totalClickRepairs: saveData.totalClickRepairs,
    sessionStart: saveData.sessionStart,
  };

  const { error } = await supabase.from("saves").upsert(
    { user_id: userId, save_data: cleanSave },
    { onConflict: "user_id" }
  );

  if (error) { console.error("Supabase error:", error); return { statusCode: 500, headers, body: JSON.stringify({ error: "Erreur sauvegarde" }) }; }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true, saved_at: new Date().toISOString() }) };
};
