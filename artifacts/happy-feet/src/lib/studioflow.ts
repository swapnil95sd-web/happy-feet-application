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
  paymentStatus: "pending" | "received" | "waived" | "refunded";
  status: string;
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
  return {
    id: String(value(row, "id", "id")),
    name: String(value(row, "name", "title", value(row, "title", "name", "Untitled class"))),
    style: String(value(row, "style", "style", "Dance")),
    description: String(value(row, "description", "description", "")),
    instructor: String(value(row, "instructor", "instructor_name", "Anitha Prakash")),
    location: String(value(row, "location", "location", "")),
    scheduleDay: String(value(row, "scheduleDay", "schedule_day", value(row, "schedule", "schedule", ""))),
    scheduleTime: String(value(row, "scheduleTime", "schedule_time", "")),
    price: Number(value(row, "price", "price", 0)),
    pricePeriod: String(value(row, "pricePeriod", "price_period", "class")),
    duration: String(value(row, "duration", "duration", "")),
    ageGroup: String(value(row, "ageGroup", "age_group", "")),
    category: String(value(row, "category", "category", value(row, "style", "style", "all"))).toLowerCase(),
    capacity,
    spotsAvailable,
    colorScheme: String(value(row, "colorScheme", "color_scheme", "linear-gradient(135deg, #c0185a, #3a1f3a)")),
    status: String(value(row, "status", "status", "active")),
    featured: Boolean(value(row, "featured", "featured", false)),
    imageUrl: (value(row, "imageUrl", "image_url", null) as string | null) ?? null,
  };
}

function homepageFromRow(row: Record<string, unknown> | null): HomepageContent {
  const content = (row?.content && typeof row.content === "object" ? row.content : row) as Record<string, unknown> | null;
  if (!content) return DEFAULT_HOMEPAGE;
  return {
    heroHeadline: String(value(content, "heroHeadline", "hero_headline", DEFAULT_HOMEPAGE.heroHeadline)),
    heroSubheadline: String(value(content, "heroSubheadline", "hero_subheadline", DEFAULT_HOMEPAGE.heroSubheadline)),
    ctaText: String(value(content, "ctaText", "cta_text", DEFAULT_HOMEPAGE.ctaText)),
    announcementBanner: String(value(content, "announcementBanner", "announcement_banner", DEFAULT_HOMEPAGE.announcementBanner)),
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

      let query = supabase.from("classes").select("*").order("featured", { ascending: false });
      if (category && category !== "all") query = query.eq("category", category);
      const { data: rows, error } = await query;
      if (!cancelled) {
        setData(error || !rows ? [] : rows.map((row) => mapClass(row as Record<string, unknown>)));
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
          message: String(row.message ?? row.body ?? ""),
          status: String(row.status ?? (row.published ? "published" : "draft")),
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
      const { data: rows } = await supabase.from("practice_videos").select("*, classes(title,name)");
      setData(
        (rows ?? []).map((row) => ({
          id: String(row.id),
          title: String(row.title ?? ""),
          url: String(row.url ?? row.video_url ?? ""),
          description: (row.description ?? null) as string | null,
          classId: row.class_id ? String(row.class_id) : null,
          className: (row.classes?.title ?? row.classes?.name ?? null) as string | null,
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
      const { data: rows } = await supabase.from("bookings").select("*, classes(title,name)").order("created_at", { ascending: false });
      setData(
        (rows ?? []).map((row) => ({
          id: String(row.id),
          classId: String(row.class_id),
          studentName: String(row.student_name ?? [row.first_name, row.last_name].filter(Boolean).join(" ")),
          email: String(row.email ?? ""),
          phone: String(row.phone ?? ""),
          paymentStatus: (row.payment_status ?? "pending") as Booking["paymentStatus"],
          status: String(row.status ?? "submitted"),
          createdAt: String(row.created_at ?? new Date().toISOString()),
          className: (row.classes?.title ?? row.classes?.name ?? null) as string | null,
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
          status: String(row.status ?? "published"),
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
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("site_content").upsert({
    key: "homepage",
    content,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function saveClass(input: Partial<DanceClass>) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const payload = {
    id: input.id?.startsWith("demo-") ? undefined : input.id,
    title: input.name,
    name: input.name,
    style: input.style,
    description: input.description,
    instructor_name: input.instructor,
    location: input.location,
    schedule_day: input.scheduleDay,
    schedule_time: input.scheduleTime,
    price: input.price,
    price_period: input.pricePeriod,
    duration: input.duration,
    age_group: input.ageGroup,
    category: input.category,
    capacity: input.capacity,
    spots_available: input.spotsAvailable,
    featured: input.featured,
    status: input.status,
    image_url: input.imageUrl,
  };
  const { error } = await supabase.from("classes").upsert(payload).select().single();
  if (error) throw error;
}

export async function deactivateClass(id: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("classes").update({ status: "inactive" }).eq("id", id);
  if (error) throw error;
}

export async function saveAnnouncement(input: Partial<Announcement>) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("announcements").upsert({
    id: input.id?.startsWith("demo-") ? undefined : input.id,
    title: input.title,
    message: input.message,
    status: input.status,
    published: input.status === "published",
    published_at: input.status === "published" ? new Date().toISOString() : null,
  });
  if (error) throw error;
}

export async function savePracticeVideo(input: Partial<PracticeVideo>) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("practice_videos").upsert({
    id: input.id,
    title: input.title,
    url: input.url,
    video_url: input.url,
    description: input.description,
    class_id: input.classId || null,
  });
  if (error) throw error;
}

export async function createBooking(input: {
  classId: string;
  className: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentType: string;
}) {
  if (!supabase) return { demo: true };
  const { error } = await supabase.from("bookings").insert({
    class_id: input.classId,
    class_name: input.className,
    first_name: input.firstName,
    last_name: input.lastName,
    student_name: `${input.firstName} ${input.lastName}`.trim(),
    email: input.email,
    phone: input.phone,
    student_type: input.studentType,
    status: "submitted",
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

export async function saveGalleryImage(input: Partial<GalleryImage>) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("gallery_images").upsert({
    id: input.id,
    title: input.title,
    image_url: input.imageUrl,
    alt_text: input.altText,
    status: input.status ?? "published",
  });
  if (error) throw error;
}
