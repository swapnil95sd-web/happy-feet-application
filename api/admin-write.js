const { randomUUID } = require("crypto");

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

function getSupabaseUrl() {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
}

function getSupabaseAnonKey() {
  return process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
}

async function supabaseFetch(path, options = {}) {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      `Admin writes are not configured. Missing ${!supabaseUrl ? "SUPABASE_URL/VITE_SUPABASE_URL" : "SUPABASE_SERVICE_ROLE_KEY"} in Vercel.`,
    );
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

async function storageFetch(path, options = {}) {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Image storage is not configured in Vercel.");

  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    let message = text;
    try {
      const parsed = JSON.parse(text);
      message = parsed.message || parsed.error || parsed.details || text;
    } catch {
      // Keep raw text.
    }
    const error = new Error(message || `Supabase storage request failed with ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return text ? JSON.parse(text) : null;
}

async function getUserFromToken(token) {
  const supabaseUrl = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  if (!supabaseUrl || !anonKey) throw new Error("Supabase public env vars are missing in Vercel.");
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Your admin session expired. Please log out and log back in.");
  return response.json();
}

async function assertAdmin(user, studio) {
  const rows = await supabaseFetch(
    `/rest/v1/profiles?select=id,email,role&or=(id.eq.${encodeURIComponent(user.id)},email.eq.${encodeURIComponent(user.email || "")})`,
    { method: "GET", headers: { Prefer: "return=representation" } },
  );
  const profile = Array.isArray(rows)
    ? rows.find((row) => row.id === user.id) || rows.find((row) => row.email?.toLowerCase?.() === user.email?.toLowerCase?.()) || null
    : null;
  const bootstrapEmail = process.env.VITE_ADMIN_EMAIL;
  const isBootstrapAdmin =
    bootstrapEmail && user.email && bootstrapEmail.toLowerCase() === user.email.toLowerCase();
  if (profile?.role === "admin" || isBootstrapAdmin) return;

  if (studio?.id && user.email) {
    try {
      const members = await supabaseFetch(
        `/rest/v1/studio_members?select=id,role,status&studio_id=eq.${encodeURIComponent(studio.id)}&email=eq.${encodeURIComponent(user.email)}&status=eq.active&role=in.(owner,admin)&limit=1`,
        { method: "GET", headers: { Prefer: "return=representation" } },
      );
      if (Array.isArray(members) && members.length > 0) return;
    } catch {
      // Fall through to the normal admin error.
    }
  }

  if (profile?.role !== "admin" && !isBootstrapAdmin) {
    throw new Error("This login is not marked as admin in Supabase profiles.");
  }
}

async function resolveStudio(studioSlug) {
  const slug = String(studioSlug || process.env.VITE_STUDIO_SLUG || "happy-feet");
  try {
    const rows = await supabaseFetch(
      `/rest/v1/studios?select=id,slug,name&slug=eq.${encodeURIComponent(slug)}&limit=1`,
      { method: "GET", headers: { Prefer: "return=representation" } },
    );
    return Array.isArray(rows) && rows[0] ? rows[0] : null;
  } catch {
    return null;
  }
}

function withStudioId(payload, studio) {
  return studio?.id ? { ...payload, studioId: studio.id, studio_id: studio.id } : payload;
}

function studioPayload(input) {
  return clean({
    slug: input.slug,
    name: input.name,
    status: ["active", "inactive", "trial"].includes(input.status) ? input.status : "active",
    primary_color: input.primaryColor || input.primary_color,
    secondary_color: input.secondaryColor || input.secondary_color,
    logo_url: input.logoUrl || input.logo_url || null,
    contact_email: input.contactEmail || input.contact_email || null,
    contact_phone: input.contactPhone || input.contact_phone || null,
    payment_label: input.paymentLabel || input.payment_label || null,
    payment_handle: input.paymentHandle || input.payment_handle || null,
    custom_domain: input.customDomain || input.custom_domain || null,
    updated_at: new Date().toISOString(),
  });
}

function clean(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== ""),
  );
}

function safeFileName(name) {
  const fallback = "image";
  const parts = String(name || fallback).split(".");
  const extension = (parts.length > 1 ? parts.pop() : "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const base = parts.join(".")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || fallback;
  return `${base}.${extension}`;
}

const IMAGE_BUCKETS = ["class-images", "site-images", "gallery", "instructor-images"];
const IMAGE_BUCKET_CONFIG = {
  public: true,
  file_size_limit: 8 * 1024 * 1024,
  allowed_mime_types: ["image/jpeg", "image/png", "image/webp", "image/gif"],
};

async function ensurePublicBucket(bucket) {
  if (!IMAGE_BUCKETS.includes(bucket)) throw new Error("Unsupported image bucket.");
  try {
    const existing = await storageFetch(`/storage/v1/bucket/${encodeURIComponent(bucket)}`, { method: "GET" });
    if (existing?.public !== true) {
      await storageFetch(`/storage/v1/bucket/${encodeURIComponent(bucket)}`, {
        method: "PUT",
        body: JSON.stringify(IMAGE_BUCKET_CONFIG),
      });
    }
  } catch (error) {
    if (error?.status !== 404) throw error;
    await storageFetch("/storage/v1/bucket", {
      method: "POST",
      body: JSON.stringify({
        id: bucket,
        name: bucket,
        ...IMAGE_BUCKET_CONFIG,
      }),
    });
  }
}

async function ensureImageBuckets() {
  await Promise.all(IMAGE_BUCKETS.map((bucket) => ensurePublicBucket(bucket)));
  return { buckets: IMAGE_BUCKETS };
}

async function uploadImage(payload) {
  const bucket = String(payload.bucket || "");
  if (!IMAGE_BUCKETS.includes(bucket)) throw new Error("Unsupported image bucket.");
  const dataUrl = String(payload.dataUrl || "");
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Image upload payload was invalid.");
  const contentType = payload.contentType || match[1] || "image/jpeg";
  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length) throw new Error("Image file was empty.");
  if (buffer.length > 8 * 1024 * 1024) throw new Error("Image is too large. Please upload an image under 8 MB.");

  const path = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeFileName(payload.fileName)}`;
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Image uploads are not configured in Vercel.");

  await ensurePublicBucket(bucket);

  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": contentType,
      "x-upsert": "false",
    },
    body: buffer,
  });
  const text = await response.text();
  if (!response.ok) {
    let message = text;
    try {
      const parsed = JSON.parse(text);
      message = parsed.message || parsed.error || text;
    } catch {
      // Keep raw text.
    }
    throw new Error(message || "Image upload failed.");
  }
  return { imageUrl: `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}` };
}

function classPayload(input) {
  return clean({
    title: input.name || input.title,
    style: input.style,
    description: input.description,
    location: input.location,
    schedule_day: input.scheduleDay || input.schedule_day,
    schedule_time: input.scheduleTime || input.schedule_time,
    price: Number(input.price || 0),
    price_label: input.pricePeriod || input.price_label,
    duration: input.duration,
    age_group: input.ageGroup || input.age_group,
    instructor_id: input.instructorId || input.instructor_id || null,
    level: input.category || input.level,
    capacity: Number(input.capacity || 20),
    featured: Boolean(input.featured),
    status: ["active", "inactive", "draft"].includes(input.status) ? input.status : "active",
    image_url: input.imageUrl || input.image_url || null,
    studio_id: input.studioId || input.studio_id,
    updated_at: new Date().toISOString(),
  });
}

function instructorPayload(input) {
  const specialties = Array.isArray(input.specialties)
    ? input.specialties
    : String(input.specialties || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  return clean({
    name: input.name,
    email: input.email || null,
    bio: input.bio || null,
    specialties,
    image_url: input.imageUrl || input.image_url || null,
    studio_id: input.studioId || input.studio_id,
    is_active: input.isActive !== false,
  });
}

function parseClassDate(scheduleDay, scheduleTime) {
  const day = String(scheduleDay || "").trim();
  if (!day || !/\d{4}|\d{1,2}[/-]\d{1,2}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(day)) {
    return null;
  }
  const time = String(scheduleTime || "").trim();
  const candidates = [
    time ? `${day} ${time}` : "",
    day,
  ].filter(Boolean);
  for (const candidate of candidates) {
    const parsed = new Date(candidate);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
}

async function autoDeactivatePastClasses(studio) {
  const studioFilter = studio?.id ? `&studio_id=eq.${encodeURIComponent(studio.id)}` : "";
  const rows = await supabaseFetch(`/rest/v1/classes?select=id,title,schedule_day,schedule_time,status&status=in.(active,draft)${studioFilter}`, {
    method: "GET",
    headers: { Prefer: "return=representation" },
  });
  const now = new Date();
  const expiredIds = (Array.isArray(rows) ? rows : [])
    .filter((row) => {
      const scheduledAt = parseClassDate(row.schedule_day, row.schedule_time);
      return scheduledAt && scheduledAt.getTime() < now.getTime();
    })
    .map((row) => row.id)
    .filter(Boolean);

  if (!expiredIds.length) return { updated: 0 };

  await supabaseFetch(`/rest/v1/classes?id=in.(${expiredIds.map((id) => encodeURIComponent(String(id))).join(",")})`, {
    method: "PATCH",
    body: JSON.stringify({ status: "inactive", updated_at: now.toISOString() }),
  });
  return { updated: expiredIds.length };
}

async function saveClass(input) {
  const id = typeof input.id === "string" && !input.id.startsWith("demo-") ? input.id : null;
  if (id) {
    return supabaseFetch(`/rest/v1/classes?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(classPayload(input)),
    });
  }
  return supabaseFetch("/rest/v1/classes", {
    method: "POST",
    body: JSON.stringify(classPayload(input)),
  });
}

async function runDiagnostic(studio) {
  const checks = [];
  checks.push({ name: "api_route", ok: true });
  checks.push({ name: "supabase_url", ok: Boolean(getSupabaseUrl()) });
  checks.push({ name: "supabase_anon_key", ok: Boolean(getSupabaseAnonKey()) });
  checks.push({ name: "service_role_key", ok: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) });
  const testTitle = `Diagnostic Class ${Date.now()}`;
  await saveClass(withStudioId({
    title: testTitle,
    style: "Diagnostic",
    description: "Temporary diagnostic row. Safe to delete.",
    status: "draft",
    price: 0,
    capacity: 1,
  }, studio));
  checks.push({ name: "insert_class", ok: true });
  await supabaseFetch(`/rest/v1/classes?title=eq.${encodeURIComponent(testTitle)}`, { method: "DELETE" });
  checks.push({ name: "delete_diagnostic_class", ok: true });
  return checks;
}

async function handleAction(action, payload, studio) {
  const scopedPayload = withStudioId(payload, studio);
  switch (action) {
    case "diagnostic":
      return { checks: await runDiagnostic(studio) };
    case "ensureImageBuckets":
      return ensureImageBuckets();
    case "autoDeactivatePastClasses":
      return autoDeactivatePastClasses(studio);
    case "saveStudioSettings": {
      if (!studio?.id) {
        throw new Error("Studio settings need the multi-studio migration. Run docs/StudioFlow_Multi_Studio_Migration.sql first.");
      }
      await supabaseFetch(`/rest/v1/studios?id=eq.${encodeURIComponent(studio.id)}`, {
        method: "PATCH",
        body: JSON.stringify(studioPayload(scopedPayload)),
      });
      return {};
    }
    case "uploadImage":
      return uploadImage(payload);
    case "saveClass":
      await saveClass(scopedPayload);
      return {};
    case "saveInstructor": {
      const id = typeof scopedPayload.id === "string" && !scopedPayload.id.startsWith("demo-") ? scopedPayload.id : null;
      if (id) {
        await supabaseFetch(`/rest/v1/instructors?id=eq.${encodeURIComponent(id)}`, {
          method: "PATCH",
          body: JSON.stringify(instructorPayload(scopedPayload)),
        });
      } else {
        await supabaseFetch("/rest/v1/instructors", {
          method: "POST",
          body: JSON.stringify(instructorPayload(scopedPayload)),
        });
      }
      return {};
    }
    case "deactivateInstructor":
      await supabaseFetch(`/rest/v1/instructors?id=eq.${encodeURIComponent(payload.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: false }),
      });
      return {};
    case "deactivateClass":
      await supabaseFetch(`/rest/v1/classes?id=eq.${encodeURIComponent(payload.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "inactive", updated_at: new Date().toISOString() }),
      });
      return {};
    case "saveHomepage":
      await supabaseFetch(studio?.id ? "/rest/v1/site_content?on_conflict=studio_id,key" : "/rest/v1/site_content?on_conflict=key", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(clean({ key: "homepage", studio_id: studio?.id, value: payload, updated_at: new Date().toISOString() })),
      });
      return {};
    case "saveAnnouncement":
      await supabaseFetch("/rest/v1/announcements", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(clean({
          id: scopedPayload.id?.startsWith?.("demo-") ? undefined : scopedPayload.id,
          studio_id: scopedPayload.studio_id,
          title: scopedPayload.title,
          body: scopedPayload.message,
          published: scopedPayload.status === "published",
        })),
      });
      return {};
    case "savePracticeVideo":
      await supabaseFetch("/rest/v1/practice_videos", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(clean({
          id: scopedPayload.id,
          studio_id: scopedPayload.studio_id,
          title: scopedPayload.title,
          video_url: scopedPayload.url,
          description: scopedPayload.description,
          class_id: scopedPayload.classId || null,
        })),
      });
      return {};
    case "updateBooking":
      await supabaseFetch(`/rest/v1/bookings?id=eq.${encodeURIComponent(payload.id)}`, {
        method: "PATCH",
        body: JSON.stringify(clean({
          payment_status: payload.paymentStatus,
          booking_status: payload.status,
          notes: payload.notes || null,
        })),
      });
      return {};
    case "saveGalleryImage":
      await supabaseFetch("/rest/v1/gallery_images", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(clean({
          id: scopedPayload.id,
          studio_id: scopedPayload.studio_id,
          title: scopedPayload.title,
          image_url: scopedPayload.imageUrl,
          alt_text: scopedPayload.altText,
          is_visible: scopedPayload.status !== "hidden",
        })),
      });
      return {};
    default:
      throw new Error(`Unknown admin action: ${action}`);
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
    const body = parseBody(req);
    const studio = await resolveStudio(body.studioSlug);
    await assertAdmin(user, studio);
    const result = await handleAction(body.action, body.payload || {}, studio);
    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error: error instanceof Error ? error.message : "Admin write failed",
    });
  }
};
