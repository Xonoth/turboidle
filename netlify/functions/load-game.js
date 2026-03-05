// netlify/functions/load-game.js
// Charge la sauvegarde du joueur depuis Supabase après vérification du token

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  // 1. Vérifier le token
  const authHeader = event.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: "Non authentifié" }) };
  }

  let userId;
  try {
    const siteUrl = process.env.URL || process.env.DEPLOY_URL;
    if(!siteUrl) throw new Error("URL env manquante");
    const identityUrl = `${siteUrl}/.netlify/identity`;
    const userRes = await fetch(`${identityUrl}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) throw new Error(`Identity ${userRes.status}`);
    const user = await userRes.json();
    userId = user.id;
  } catch (err) {
    console.error("Auth error:", err.message);
    return { statusCode: 401, headers, body: JSON.stringify({ error: "Token invalide ou expiré" }) };
  }

  // 2. Récupérer la sauvegarde
  const { data, error } = await supabase
    .from("saves")
    .select("save_data, updated_at")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = "no rows found" = nouvelle partie, pas une erreur
    console.error("Supabase error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Erreur chargement" }) };
  }

  // Nouvelle partie : aucune sauvegarde trouvée
  if (!data) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, save: null }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ok: true, save: data.save_data, updated_at: data.updated_at }),
  };
};    if(!siteUrl) throw new Error("URL env manquante");
    const identityUrl = `${siteUrl}/.netlify/identity`;
    const userRes = await fetch(`${identityUrl}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) throw new Error(`Identity ${userRes.status}`);
    const user = await userRes.json();
    userId = user.id;
  } catch (err) {
    console.error("Auth error:", err.message);
    return { statusCode: 401, headers, body: JSON.stringify({ error: "Token invalide ou expiré" }) };
  }

  // 2. Récupérer la sauvegarde
  const { data, error } = await supabase
    .from("saves")
    .select("save_data, updated_at")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = "no rows found" = nouvelle partie, pas une erreur
    console.error("Supabase error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Erreur chargement" }) };
  }

  // Nouvelle partie : aucune sauvegarde trouvée
  if (!data) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, save: null }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ok: true, save: data.save_data, updated_at: data.updated_at }),
  };
};
=======
// netlify/functions/load-game.js
// Charge la sauvegarde du joueur depuis Supabase après vérification du token

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  // 1. Vérifier le token
  const authHeader = event.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: "Non authentifié" }) };
  }

  let userId;
  try {
    const identityUrl = process.env.URL + "/.netlify/identity";
    const userRes = await fetch(`${identityUrl}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) throw new Error("Token invalide");
    const user = await userRes.json();
    userId = user.id;
  } catch (err) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: "Token invalide ou expiré" }) };
  }

  // 2. Récupérer la sauvegarde
  const { data, error } = await supabase
    .from("saves")
    .select("save_data, updated_at")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = "no rows found" = nouvelle partie, pas une erreur
    console.error("Supabase error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Erreur chargement" }) };
  }

  // Nouvelle partie : aucune sauvegarde trouvée
  if (!data) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, save: null }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ok: true, save: data.save_data, updated_at: data.updated_at }),
  };
};

>>>>>>> 75a54d06c71efc926ea0bc89b3a18ac59f51550a:netlify/functions/load-game.js
