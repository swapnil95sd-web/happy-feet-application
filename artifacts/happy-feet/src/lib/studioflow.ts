import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type DanceClass = {
  id: string;
  name: string;
  style: string;
  description: string;
  instructor: string;
  location: string;
  scheduleDay: string;
  scheduleTime: string;
  price: number;
  pricePeriod: string;
  duration: string;
  ageGroup: string;
  category: string;
  capacity: number;
  spotsAvailable: number;
  colorScheme: string;
  status: string;
  featured: boolean;
  imageUrl: string | null;
};

export type HomepageContent = {
  heroHeadline: string;
  heroSubheadline: string;
  ctaText: string;
  announcementBanner: string;
  contactEmail: string;
  contactPhone: string;
  venmoHandle: string;
  heroImageUrl: string;
};

export type Announcement = {
  id: string;
  title: string;
  message: string;
  status: string;
  publishedAt: string | null;
};

export type PracticeVideo = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  classId: string | null;
  className?: string | null;
};

export type Booking = {
  id: string;
  classId: string;
  studentName: string;
  email: string;
  phone: string;
  ageGroup: string;
  notes: string;
  paymentStatus: "pending" | "received" | "waived" | "refunded";
  status: "confirmed" | "cancelled" | "waitlist";
  createdAt: string;
  className?: string | null;
};

export type GalleryImage = {
  id: string;
  title: string;
  imageUrl: string;
  altText: string | null;
  status: string;
};

const DEMO_CLASSES: DanceClass[] = [
  {
    id: "demo-bollywood",
    name: "Bollywood Performance Lab",
    style: "Bollywood",
    description: "A joyful adult batch focused on expressive choreography, stage confidence, and strong foundations.",
    instructor: "Anitha Prakash",
    location: "Jersey City Studio",
    scheduleDay: "Monday",
    scheduleTime: "7:00 PM",
    price: 180,
    pricePeriod: "8-week batch",
    duration: "75 min",
    ageGroup: "Adults",
    category: "adults",
    capacity: 20,
    spotsAvailable: 6,
    colorScheme: "linear-gradient(135deg, #c0185a, #3a1f3a)",
    status: "active",
    featured: true,
    imageUrl: null,
  },
  {
    id: "demo-kids",
    name: "Kids Bollywood Basics",
    style: "Bollywood",
    description: "A warm beginner-friendly class for younger dancers building rhythm, confidence, and stage presence.",
    instructor: "Anitha Prakash",
    location: "Edison Community Center",
    scheduleDay: "Sunday",
    scheduleTime: "10:00 AM",
    price: 160,
    pricePeriod: "8-week batch",
    duration: "60 min",
    ageGroup: "Kids & Teens",
    category: "kids",
    capacity: 18,
    spotsAvailable: 4,
    colorScheme: "linear-gradient(135deg, #c98b2f, #c0185a)",
    status: "active",
    featured: true,
    imageUrl: null,
  },
  {
    id: "demo-bollyhop",
    name: "BollyHop Beginner Drop-In",
    style: "BollyHop",
    description: "A high-energy Saturday drop-in blending Bollywood grooves with hip-hop textures.",
    instructor: "Anitha Prakash",
    location: "NYC Midtown Studio",
    scheduleDay: "Saturday",
    scheduleTime: "11:00 AM",
    price: 28,
    pricePeriod: "drop-in",
    duration: "60 min",
    ageGroup: "Adults",
    category: "workshop",
    capacity: 24,
    spotsAvailable: 12,
    colorScheme: "linear-gradient(135deg, #3a1f3a, #c98b2f)",
    status: "active",
    featured: false,
    imageUrl: null,
  },
];

export const DEFAULT_HOMEPAGE: HomepageContent = {
  heroHeadline: "Dance boldly.\nFeel at home.",
  heroSubheadline: "Bollywood. BollyHop. Semi-Classical. Hip-Hop. For kids, teens, and adults in NYC & NJ.",
  ctaText: "Find Your Class",
  announcementBanner: "Open enrollment is live for NYC and New Jersey batches.",
  contactEmail: "hello@happyfeetdance.com",
  contactPhone: "",
  venmoHandle: "ktanvi",
  heroImageUrl: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1800&q=80",
};

function value(row: Record<string, unknown>, camel: string, snake: string, fallback: unknown = "") {
  return row[snake] ?? row[camel] ?? fallback;
}

function mapClass(row: Record<string, unknown>): DanceClass {
  const capacity = Number(value(row, "capacity", "capacity", 20));
  const spotsAvailable = Number(value(row, "spotsAvailable", "spots_available", capacity));
  const style = String(value(row, "style", "style", "Dance"));
  const ageGroup = String(value(row, "ageGroup", "age_group", ""));
  const level = String(value(row, "level", "level", ""));
  const derivedCategory = [ageGroup, level, style].join(" ").toLowerCase().includes("kid")
    ? "kids"
    : [ageGroup, level, style].join(" ").toLowerCase().includes("showcase")
      ? "showcase"
      : [ageGroup, level, style].join(" ").toLowerCase().includes("workshop")
        ? "workshop"
        : "adults";
  return {
    id: String(value(row, "id", "id")),
    name: String(value(row, "name", "title", value(row, "title", "name", "Untitled class"))),
    style,
    description: String(value(row, "description", "description", "")),
    instructor: String(value(row, "instructor", "instructor_name", "Anitha Prakash")),
    location: String(value(row, "location", "location", "")),
    scheduleDay: String(value(row, "scheduleDay", "schedule_day", value(row, "schedule", "schedule", ""))),
    scheduleTime: String(value(row, "scheduleTime", "schedule_time", "")),
    price: Number(value(row, "price", "price", 0)),
    pricePeriod: String(value(row, "pricePeriod", "price_label", value(row, "price_label", "price_period", "class"))),
    duration: String(value(row, "duration", "duration", "")),
    ageGroup,
    category: String(value(row, "category", "category", derivedCategory)).toLowerCase(),
    capacity,
    spotsAvailable,
    colorScheme: String(value(row, "colorScheme", "color_scheme", "linear-gradient(135deg, #c0185a, #3a1f3a)")),
    status: String(value(row, "status", "status", "active")),
    featured: Boolean(value(row, "featured", "featured", false)),
    imageUrl: (value(row, "imageUrl", "image_url", null) as string | null) ?? null,
  };
}

function homepageFromRow(row: Record<string, unknown> | null): HomepageContent {
  const content = (
    row?.value && typeof row.value === "object"
      ? row.value
      : row?.content && typeof row.content === "object"
        ? row.content
        : row
  ) as Record<string, unknown> | null;
  if (!content) return DEFAULT_HOMEPAGE;
  return {
    heroHeadline: String(value(content, "heroHeadline", "hero_headline", DEFAULT_HOMEPAGE.heroHeadline)),
    heroSubheadline: String(value(content, "heroSubheadline", "hero_subheadline", DEFAULT_HOMEPAGE.heroSubheadline)),
    ctaText: String(value(content, "ctaText", "ctaPrimary", value(content, "ctaPrimary", "cta_text", DEFAULT_HOMEPAGE.ctaText))),
    announcementBanner: String(value(content, "announcementBanner", "announcement", value(content, "announcement", "announcement_banner", DEFAULT_HOMEPAGE.announcementBanner))),
    contactEmail: String(value(content, "contactEmail", "contact_email", DEFAULT_HOMEPAGE.contactEmail)),
    contactPhone: String(value(content, "contactPhone", "contact_phone", DEFAULT_HOMEPAGE.contactPhone)),
    venmoHandle: String(value(content, "venmoHandle", "venmo_handle", DEFAULT_HOMEPAGE.venmoHandle)),
    heroImageUrl: String(value(content, "heroImageUrl", "hero_image_url", DEFAULT_HOMEPAGE.heroImageUrl)),
  };
}

export function useStudioClasses(category?: string) {
  const [data, setData] = useState<DanceClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      if (!supabase) {
        const filtered = category && category !== "all"
          ? DEMO_CLASSES.filter((c) => c.category === category)
          : DEMO_CLASSES;
        setData(filtered);
        setIsLoading(false);
        return;
      }

      const query = supabase.from("classes").select("*").order("featured", { ascending: false });
      const { data: rows, error } = await query;
      if (!cancelled) {
        const mapped = error || !rows ? [] : rows.map((row) => mapClass(row as Record<string, unknown>));
        setData(category && category !== "all" ? mapped.filter((c) => c.category === category) : mapped);
        setIsLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [category, version]);

  return { data, isLoading, refetch, isSupabaseConfigured };
}

export function useHomepageContent() {
  const [data, setData] = useState(DEFAULT_HOMEPAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      if (!supabase) {
        setData(DEFAULT_HOMEPAGE);
        setIsLoading(false);
        return;
      }
      const { data: row } = await supabase.from("site_content").select("*").eq("key", "homepage").maybeSingle();
      setData(homepageFromRow((row as Record<string, unknown> | null) ?? null));
      setIsLoading(false);
    }
    void load();
  }, [version]);

  return { data, isLoading, refetch };
}

export function useAnnouncements() {
  const [data, setData] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      if (!supabase) {
        setData([
          {
            id: "demo-announcement",
            title: "Showcase registration is open",
            message: "Early roster closes soon. Costume notes will appear in the student portal.",
            status: "published",
            publishedAt: new Date().toISOString(),
          },
        ]);
        setIsLoading(false);
        return;
      }
      const { data: rows } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
      setData(
        (rows ?? []).map((row) => ({
          id: String(row.id),
          title: String(row.title ?? ""),
          message: String(row.body ?? row.message ?? ""),
          status: row.published === false ? "draft" : String(row.status ?? "published"),
          publishedAt: (row.published_at ?? row.created_at ?? null) as string | null,
        })),
      );
      setIsLoading(false);
    }
    void load();
  }, [version]);

  return { data, isLoading, refetch };
}

export function usePracticeVideos() {
  const [data, setData] = useState<PracticeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      if (!supabase) {
        setData([]);
        setIsLoading(false);
        return;
      }
      const { data: rows } = await supabase.from("practice_videos").select("*, classes(title)");
      setData(
        (rows ?? []).map((row) => ({
          id: String(row.id),
          title: String(row.title ?? ""),
          url: String(row.video_url ?? row.url ?? ""),
          description: (row.description ?? null) as string | null,
          classId: row.class_id ? String(row.class_id) : null,
          className: (row.classes?.title ?? null) as string | null,
        })),
      );
      setIsLoading(false);
    }
    void load();
  }, [version]);

  return { data, isLoading, refetch };
}

export function useBookings() {
  const [data, setData] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      if (!supabase) {
        setData([]);
        setIsLoading(false);
        return;
      }
      const { data: rows } = await supabase.from("bookings").select("*, classes(title)").order("created_at", { ascending: false });
      setData(
        (rows ?? []).map((row) => ({
          id: String(row.id),
          classId: String(row.class_id),
          studentName: String(row.student_name ?? [row.first_name, row.last_name].filter(Boolean).join(" ")),
          email: String(row.student_email ?? row.email ?? ""),
          phone: String(row.student_phone ?? row.phone ?? ""),
          ageGroup: String(row.age_group ?? ""),
          notes: String(row.notes ?? ""),
          paymentStatus: (row.payment_status ?? "pending") as Booking["paymentStatus"],
          status: (row.booking_status ?? row.status ?? "confirmed") as Booking["status"],
          createdAt: String(row.created_at ?? new Date().toISOString()),
          className: (row.classes?.title ?? null) as string | null,
        })),
      );
      setIsLoading(false);
    }
    void load();
  }, [version]);

  return { data, isLoading, refetch };
}

export function useGalleryImages() {
  const [data, setData] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      if (!supabase) {
        setData([]);
        setIsLoading(false);
        return;
      }
      const { data: rows } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
      setData(
        (rows ?? []).map((row) => ({
          id: String(row.id),
          title: String(row.title ?? ""),
          imageUrl: String(row.image_url ?? ""),
          altText: (row.alt_text ?? null) as string | null,
          status: row.is_visible === false ? "hidden" : String(row.status ?? "published"),
        })),
      );
      setIsLoading(false);
    }
    void load();
  }, [version]);

  return { data, isLoading, refetch };
}

export function useAdminStats(classes: DanceClass[], bookings: Booking[], announcements: Announcement[]) {
  return useMemo(
    () => ({
      activeClasses: classes.filter((c) => c.status !== "inactive").length,
      pendingPayments: bookings.filter((b) => b.paymentStatus === "pending").length,
      bookings: bookings.length,
      announcements: announcements.length,
    }),
    [announcements.length, bookings, classes],
  );
}

export async function saveHomepageContent(content: HomepageContent) {
  await adminWrite("saveHomepage", content);
}

export async function uploadStudioImage(bucket: "class-images" | "gallery" | "site-images" | "instructor-images", file: File) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "image";
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}.${extension}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function saveClass(input: Partial<DanceClass>) {
  await adminWrite("saveClass", input);
}

export async function runClassSaveDiagnostic() {
  const body = await adminWrite<{ checks?: Array<{ name: string; ok: boolean; detail?: string }> }>("diagnostic", {});
  return body.checks ?? [];
}

export async function deactivateClass(id: string) {
  await adminWrite("deactivateClass", { id });
}

export async function saveAnnouncement(input: Partial<Announcement>) {
  await adminWrite("saveAnnouncement", input);
}

export async function savePracticeVideo(input: Partial<PracticeVideo>) {
  await adminWrite("savePracticeVideo", input);
}

export async function createBooking(input: {
  classId: string;
  className: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentType: string;
  notes?: string;
}) {
  if (!supabase) return { demo: true };
  const { error } = await supabase.from("bookings").insert({
    class_id: input.classId,
    student_name: `${input.firstName} ${input.lastName}`.trim(),
    student_email: input.email,
    student_phone: input.phone,
    age_group: input.studentType,
    notes: input.notes || null,
    booking_status: "confirmed",
    payment_status: "pending",
  });
  if (error) throw error;
  return { demo: false };
}

export async function updateBookingPaymentStatus(id: string, paymentStatus: Booking["paymentStatus"]) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("bookings").update({ payment_status: paymentStatus }).eq("id", id);
  if (error) throw error;
}

export async function updateBookingWorkflow(
  id: string,
  input: {
    paymentStatus?: Booking["paymentStatus"];
    status?: Booking["status"];
    notes?: string;
  },
) {
  await adminWrite("updateBooking", { id, ...input });
}

export async function saveGalleryImage(input: Partial<GalleryImage>) {
  await adminWrite("saveGalleryImage", input);
}

async function adminWrite<T extends Record<string, unknown> = Record<string, unknown>>(action: string, payload: unknown): Promise<T> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Please log in again before saving.");
  const response = await fetch("/api/admin-write", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, payload }),
  });
  const text = await response.text();
  let body: T & { ok?: boolean; error?: string };
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`Admin API returned ${response.status}: ${text.slice(0, 240)}`);
  }
  if (!response.ok || body.ok === false) throw new Error(body.error || `Admin API returned ${response.status}.`);
  return body;
}
