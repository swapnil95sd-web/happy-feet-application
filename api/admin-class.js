function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function requiredString(value, label) {
  const text = String(value ?? "").trim();
  if (!text) throw new Error(`${label} is required.`);
  return text;
}

function normalizeClass(input) {
  const id = typeof input.id === "string" && !input.id.startsWith("demo-") ? input.id : null;
  const status = ["active", "inactive", "draft"].includes(input.status) ? input.status : "active";
  return {
    id,
    payload: {
      title: requiredString(input.name || input.title, "Class title"),
      style: input.style || null,
      description: input.description || null,
      location: input.location || null,
      schedule_day: input.scheduleDay || input.schedule_day || null,
      schedule_time: input.scheduleTime || input.schedule_time || null,
      price: Number(input.price || 0),
      price_label: input.pricePeriod || input.price_label || null,
      duration: input.duration || null,
      age_group: input.ageGroup || input.age_group || null,
      level: input.category || input.level || null,
      capacity: Number(input.capacity || 20),
      featured: Boolean(input.featured),
      status,
      image_url: input.imageUrl || input.image_url || null,
      updated_at: new Date().toISOString(),
    },
  };
}

async function supabaseFetch(path, options = {}) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Server admin save is not configured. Add SUPABASE_SERVICE_ROLE_KEY in Vercel.");
  }

  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    let message = text;
    try {
      const parsed = JSON.parse(text);
      message = parsed.message || parsed.details || parsed.hint || text;
    } catch {
      // Keep raw text.
    }
    throw new Error(message || `Supabase request failed with ${response.status}`);
  }
  return text ? JSON.parse(text) : null;
}

async function getUserFromToken(token) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) throw new Error("Supabase public env vars are missing.");
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Your admin session expired. Please log out and log back in.");
  return response.json();
}

async function assertAdmin(user) {
  const rows = await supabaseFetch(
    `/rest/v1/profiles?select=id,email,role&id=eq.${encodeURIComponent(user.id)}`,
    { method: "GET", headers: { Prefer: "return=representation" } },
  );
  const profile = Array.isArray(rows) ? rows[0] : null;
  const bootstrapEmail = process.env.VITE_ADMIN_EMAIL;
  const isBootstrapAdmin =
    bootstrapEmail && user.email && bootstrapEmail.toLowerCase() === user.email.toLowerCase();
  if (profile?.role !== "admin" && !isBootstrapAdmin) {
    throw new Error("This login is not marked as admin in Supabase profiles.");
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!token) throw new Error("Missing admin session. Please log in again.");
    const user = await getUserFromToken(token);
    await assertAdmin(user);

    const body = parseBody(req);
    const { id, payload } = normalizeClass(body);
    if (id) {
      await supabaseFetch(`/rest/v1/classes?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    } else {
      const { id: _id, ...insertPayload } = payload;
      await supabaseFetch("/rest/v1/classes", {
        method: "POST",
        body: JSON.stringify(insertPayload),
      });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error: error instanceof Error ? error.message : "Could not save class",
    });
  }
};
