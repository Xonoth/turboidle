// netlify/functions/load-game.js
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
  if (event.httpMethod !== "GET") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  const token = (event.headers.authorization || "").replace("Bearer ", "").trim();
  if (!token) return { statusCode: 401, headers, body: JSON.stringify({ error: "Token manquant" }) };

  const payload = decodeJwt(token);
  if (!payload || !payload.sub) return { statusCode: 401, headers, body: JSON.stringify({ error: "Token invalide" }) };
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return { statusCode: 401, headers, body: JSON.stringify({ error: "Token expiré" }) };

  const userId = payload.sub;

  const { data, error } = await supabase
    .from("saves")
    .select("save_data, updated_at")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Supabase error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Erreur chargement" }) };
  }

  if (!data) return { statusCode: 200, headers, body: JSON.stringify({ ok: true, save: null }) };

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true, save: data.save_data, updated_at: data.updated_at }) };
};
