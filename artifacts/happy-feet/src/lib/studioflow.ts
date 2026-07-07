import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type DanceClass = {
  id: string;
  name: string;
  style: string;
  description: string;
  instructorId: string | null;
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

export type Instructor = {
  id: string;
  name: string;
  email: string;
  bio: string;
  specialties: string[];
  imageUrl: string | null;
  isActive: boolean;
};

export type Sentiment = {
  quote: string;
  name: string;
  tag: string;
  imageUrl?: string;
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
  instructorImageUrl: string;
  aboutStory: string;
  instagramUrls: string[];
  sentiments: Sentiment[];
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
    instructorId: "demo-anitha",
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
    instructorId: "demo-gauthami",
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
    instructorId: "demo-aashit",
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
  instructorImageUrl: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=600&q=80",
  aboutStory: "For Anitha, dance has never been only about steps. It has been a way to remember home, to tell stories without needing the perfect words, and to help people feel brave inside their own bodies. Happy Feet grew from that belief. What began as a passion for Bollywood, movement, music, and performance became a community where kids, teens, and adults could find confidence, friendship, discipline, joy, and a place to belong. The academy is her way of passing that feeling forward: a space where every dancer is seen, every family feels welcomed, and every class carries the promise that dance can build something bigger than choreography. The future of Happy Feet is rooted in that same dream: more community, more stages, more shared memories, and more people discovering that dance can become a home.",
  instagramUrls: [],
  sentiments: [
    { quote: "I walked in nervous and left absolutely hooked. Anitha has a gift for making you feel like you belong.", name: "Priya S.", tag: "Bollywood batch" },
    { quote: "My daughter went from shy to stage-ready in one semester. The showcase was a full-on performance experience.", name: "Meena R.", tag: "Kids program parent" },
    { quote: "The BollyHop drop-in is my favorite Saturday morning. I've been coming for three years.", name: "Deepa K.", tag: "Drop-in regular" },
  ],
};

const DEMO_INSTRUCTORS: Instructor[] = [
  {
    id: "demo-anitha",
    name: "Anitha Prakash",
    email: "",
    bio: "Founder and lead instructor for Happy Feet.",
    specialties: ["Bollywood", "Showcase", "BollyHop"],
    imageUrl: DEFAULT_HOMEPAGE.instructorImageUrl,
    isActive: true,
  },
  {
    id: "demo-gauthami",
    name: "Gauthami",
    email: "",
    bio: "Warm, confidence-building instructor for foundations and kids classes.",
    specialties: ["Bollywood", "Kids"],
    imageUrl: null,
    isActive: true,
  },
  {
    id: "demo-aashit",
    name: "Aashit",
    email: "",
    bio: "High-energy instructor for rhythm, performance, and BollyHop flow.",
    specialties: ["BollyHop", "Hip-Hop"],
    imageUrl: null,
    isActive: true,
  },
  {
    id: "demo-mehek",
    name: "Mehek",
    email: "",
    bio: "Expressive instructor focused on choreography, presence, and musicality.",
    specialties: ["Bollywood", "Semi-Classical"],
    imageUrl: null,
    isActive: true,
  },
];

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
    instructorId: row.instructor_id ? String(row.instructor_id) : null,
    instructor: String((row.instructors as { name?: string } | null | undefined)?.name ?? value(row, "instructor", "instructor_name", "Anitha Prakash")),
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
    instructorImageUrl: String(value(content, "instructorImageUrl", "instructor_image_url", DEFAULT_HOMEPAGE.instructorImageUrl)),
    aboutStory: String(value(content, "aboutStory", "about_story", DEFAULT_HOMEPAGE.aboutStory)),
    instagramUrls: Array.isArray(content.instagramUrls)
      ? content.instagramUrls.map(String)
      : Array.isArray(content.instagram_urls)
        ? content.instagram_urls.map(String)
        : DEFAULT_HOMEPAGE.instagramUrls,
    sentiments: Array.isArray(content.sentiments)
      ? content.sentiments.map((item) => {
          const sentiment = item as Record<string, unknown>;
          return {
            quote: String(sentiment.quote ?? ""),
            name: String(sentiment.name ?? ""),
            tag: String(sentiment.tag ?? ""),
            imageUrl: sentiment.imageUrl ? String(sentiment.imageUrl) : sentiment.image_url ? String(sentiment.image_url) : undefined,
          };
        })
      : DEFAULT_HOMEPAGE.sentiments,
  };
}

function mergeInstructorStarters(instructors: Instructor[]) {
  const names = new Set(instructors.map((instructor) => instructor.name.toLowerCase()));
  return [
    ...instructors,
    ...DEMO_INSTRUCTORS.filter((instructor) => !names.has(instructor.name.toLowerCase())),
  ];
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

      const query = supabase.from("classes").select("*, instructors(name)").order("featured", { ascending: false });
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

export function useInstructors() {
  const [data, setData] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      if (!supabase) {
        setData(DEMO_INSTRUCTORS);
        setIsLoading(false);
        return;
      }
      const { data: rows, error } = await supabase.from("instructors").select("*").order("created_at", { ascending: true });
      if (error || !rows?.length) {
        setData(DEMO_INSTRUCTORS);
      } else {
        const mapped = rows.map((row) => ({
            id: String(row.id),
            name: String(row.name ?? ""),
            email: String(row.email ?? ""),
            bio: String(row.bio ?? ""),
            specialties: Array.isArray(row.specialties) ? row.specialties.map(String) : [],
            imageUrl: (row.image_url ?? null) as string | null,
            isActive: row.is_active !== false,
          }));
        setData(mergeInstructorStarters(mapped));
      }
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
  const dataUrl = await fileToDataUrl(file);
  const result = await adminWrite<{ imageUrl?: string }>("uploadImage", {
    bucket,
    fileName: file.name,
    contentType: file.type || "image/jpeg",
    dataUrl,
  });
  if (!result.imageUrl) throw new Error("Upload completed but no image URL was returned.");
  return result.imageUrl;
}

export async function ensureImageBuckets() {
  await adminWrite("ensureImageBuckets", {});
}

export async function autoDeactivatePastClasses() {
  await adminWrite("autoDeactivatePastClasses", {});
}

export async function saveClass(input: Partial<DanceClass>) {
  await adminWrite("saveClass", input);
}

export async function saveInstructor(input: Partial<Instructor>) {
  await adminWrite("saveInstructor", input);
}

export async function deactivateInstructor(id: string) {
  await adminWrite("deactivateInstructor", { id });
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

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read selected image."));
    reader.readAsDataURL(file);
  });
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
