import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { BookOpen, CalendarDays, Download, Image, LayoutDashboard, Megaphone, Plus, Settings, Upload, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  DEFAULT_HOMEPAGE,
  deactivateClass,
  runClassSaveDiagnostic,
  saveAnnouncement,
  saveClass,
  saveGalleryImage,
  saveHomepageContent,
  savePracticeVideo,
  updateBookingWorkflow,
  uploadStudioImage,
  type Announcement,
  type Booking,
  type DanceClass,
  type GalleryImage,
  type HomepageContent,
  type PracticeVideo,
  useAdminStats,
  useAnnouncements,
  useBookings,
  useGalleryImages,
  useHomepageContent,
  usePracticeVideos,
  useStudioClasses,
} from "@/lib/studioflow";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "content", label: "Homepage", icon: Settings },
  { id: "classes", label: "Classes", icon: BookOpen },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "videos", label: "Videos", icon: Video },
  { id: "gallery", label: "Gallery", icon: Image },
];

const EMPTY_CLASS: Partial<DanceClass> = {
  name: "",
  style: "",
  description: "",
  instructor: "Anitha Prakash",
  location: "",
  scheduleDay: "",
  scheduleTime: "",
  price: 0,
  pricePeriod: "batch",
  duration: "8-week batch",
  ageGroup: "Adults",
  category: "adults",
  capacity: 20,
  spotsAvailable: 20,
  status: "active",
  featured: false,
  imageUrl: "",
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const classesQuery = useStudioClasses();
  const homepageQuery = useHomepageContent();
  const announcementsQuery = useAnnouncements();
  const videosQuery = usePracticeVideos();
  const bookingsQuery = useBookings();
  const galleryQuery = useGalleryImages();
  const stats = useAdminStats(classesQuery.data, bookingsQuery.data, announcementsQuery.data);

  const refreshAll = () => {
    classesQuery.refetch();
    homepageQuery.refetch();
    announcementsQuery.refetch();
    videosQuery.refetch();
    bookingsQuery.refetch();
    galleryQuery.refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="px-4 py-10" style={{ background: "radial-gradient(circle at 20% 0, rgba(58,31,58,.08), transparent 40%)" }}>
        <div className="container mx-auto max-w-6xl">
          <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-primary">StudioFlow Admin</p>
          <h1 className="font-serif text-4xl font-bold text-secondary">Happy Feet Command Center</h1>
          <p className="mt-1 text-muted-foreground">Manage public content, classes, bookings, announcements, videos, and image URLs.</p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 pb-16">
        <div className="mt-4 grid gap-6 md:grid-cols-[210px_1fr]">
          <aside className="space-y-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all ${
                  activeTab === id ? "bg-secondary text-white" : "text-muted-foreground hover:bg-card hover:text-secondary"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
          </aside>

          <main className="min-w-0 space-y-6">
            {activeTab === "overview" && <Overview stats={stats} bookings={bookingsQuery.data} classes={classesQuery.data} />}
            {activeTab === "content" && <HomepageEditor initial={homepageQuery.data} onSaved={refreshAll} />}
            {activeTab === "classes" && <ClassManager classes={classesQuery.data} onSaved={refreshAll} />}
            {activeTab === "bookings" && <BookingsManager bookings={bookingsQuery.data} onSaved={refreshAll} />}
            {activeTab === "announcements" && <AnnouncementsManager announcements={announcementsQuery.data} onSaved={refreshAll} />}
            {activeTab === "videos" && <VideosManager videos={videosQuery.data} classes={classesQuery.data} onSaved={refreshAll} />}
            {activeTab === "gallery" && <GalleryManager images={galleryQuery.data} onSaved={refreshAll} />}
          </main>
        </div>
      </div>
    </div>
  );

}

function Overview({ stats, bookings, classes }: { stats: ReturnType<typeof useAdminStats>; bookings: Booking[]; classes: DanceClass[] }) {
  const cards = [
    ["Active classes", stats.activeClasses],
    ["Bookings", stats.bookings],
    ["Pending payments", stats.pendingPayments],
    ["Announcements", stats.announcements],
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <p className="font-serif text-3xl font-bold text-secondary">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base text-secondary">Needs Attention</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          {bookings.filter((b) => b.paymentStatus === "pending").slice(0, 5).map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-xl border p-3">
              <span>{b.studentName} - {b.className ?? "Class"}</span>
              <Badge variant="outline">payment pending</Badge>
            </div>
          ))}
          {classes.filter((c) => c.spotsAvailable <= 3 && c.status !== "inactive").slice(0, 5).map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl border p-3">
              <span>{c.name}</span>
              <Badge className="bg-yellow-100 text-yellow-800">{c.spotsAvailable} spots left</Badge>
            </div>
          ))}
          {!bookings.length && !classes.length && <p className="text-muted-foreground">Connect Supabase to see live operations here.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function HomepageEditor({ initial, onSaved }: { initial: HomepageContent; onSaved: () => void }) {
  const [form, setForm] = useState(initial);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  useEffect(() => setForm(initial), [initial]);

  const save = async () => {
    try {
      await saveHomepageContent(form);
      toast({ title: "Homepage content saved." });
      onSaved();
    } catch (error) {
      toast({ title: "Could not save homepage", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    }
  };

  const uploadHeroImage = async (file: File | null) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const imageUrl = await uploadStudioImage("site-images", file);
      setForm({ ...form, heroImageUrl: imageUrl });
      toast({ title: "Hero image uploaded." });
    } catch (error) {
      toast({ title: "Could not upload image", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };
  const uploadInstructorImage = async (file: File | null) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const imageUrl = await uploadStudioImage("instructor-images", file);
      setForm({ ...form, instructorImageUrl: imageUrl });
      toast({ title: "Instructor image uploaded." });
    } catch (error) {
      toast({ title: "Could not upload image", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base text-secondary">Homepage CMS</CardTitle></CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Field label="Hero headline"><Textarea value={form.heroHeadline} onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })} /></Field>
        <Field label="Hero subheadline"><Textarea value={form.heroSubheadline} onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })} /></Field>
        <Field label="CTA text"><Input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} /></Field>
        <Field label="Announcement banner"><Input value={form.announcementBanner} onChange={(e) => setForm({ ...form, announcementBanner: e.target.value })} /></Field>
        <Field label="Contact email"><Input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} /></Field>
        <Field label="Contact phone"><Input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} /></Field>
        <Field label="Venmo handle"><Input value={form.venmoHandle} onChange={(e) => setForm({ ...form, venmoHandle: e.target.value })} /></Field>
        <Field label="Hero image">
          <div className="space-y-2">
            {(form.heroImageUrl || DEFAULT_HOMEPAGE.heroImageUrl) && (
              <img src={form.heroImageUrl || DEFAULT_HOMEPAGE.heroImageUrl} alt="Homepage hero preview" className="h-28 w-full rounded-xl object-cover" />
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary/90">
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload hero image"}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => uploadHeroImage(e.target.files?.[0] ?? null)} />
            </label>
            <Input value={form.heroImageUrl || ""} placeholder="Optional image URL" onChange={(e) => setForm({ ...form, heroImageUrl: e.target.value })} />
          </div>
        </Field>
        <Field label="Instructor image">
          <div className="space-y-2">
            {(form.instructorImageUrl || DEFAULT_HOMEPAGE.instructorImageUrl) && (
              <img src={form.instructorImageUrl || DEFAULT_HOMEPAGE.instructorImageUrl} alt="Instructor preview" className="h-28 w-full rounded-xl object-cover" />
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary/90">
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload instructor image"}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => uploadInstructorImage(e.target.files?.[0] ?? null)} />
            </label>
            <Input value={form.instructorImageUrl || ""} placeholder="Optional image URL" onChange={(e) => setForm({ ...form, instructorImageUrl: e.target.value })} />
          </div>
        </Field>
        <div className="sm:col-span-2"><Button onClick={save}>Save Homepage</Button></div>
      </CardContent>
    </Card>
  );
}

function ClassManager({ classes, onSaved }: { classes: DanceClass[]; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<DanceClass>>(EMPTY_CLASS);
  const [isUploading, setIsUploading] = useState(false);
  const [diagnostic, setDiagnostic] = useState<string>("");
  const { toast } = useToast();
  const edit = (danceClass: DanceClass) => setForm(danceClass);
  const save = async () => {
    try {
      await saveClass(form);
      toast({ title: "Class saved." });
      setForm(EMPTY_CLASS);
      onSaved();
    } catch (error) {
      toast({ title: "Could not save class", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    }
  };
  const archive = async (id: string) => {
    try {
      await deactivateClass(id);
      toast({ title: "Class deactivated." });
      onSaved();
    } catch (error) {
      toast({ title: "Could not deactivate class", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    }
  };
  const uploadClassImage = async (file: File | null) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const imageUrl = await uploadStudioImage("class-images", file);
      setForm({ ...form, imageUrl });
      toast({ title: "Class image uploaded." });
    } catch (error) {
      toast({ title: "Could not upload image", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };
  const runDiagnostic = async () => {
    setDiagnostic("Running class save diagnostic...");
    try {
      const checks = await runClassSaveDiagnostic();
      const summary = checks.map((check) => `${check.ok ? "OK" : "FAIL"} ${check.name}${check.detail ? `: ${check.detail}` : ""}`).join("\n");
      setDiagnostic(summary || "Diagnostic passed.");
      toast({ title: "Class save diagnostic passed." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Diagnostic failed.";
      setDiagnostic(message);
      toast({ title: "Class save diagnostic failed", description: message, variant: "destructive" });
    }
  };
  const exportClasses = () => {
    downloadCsv(
      "classes.csv",
      classes.map((c) => ({
        title: c.name,
        style: c.style,
        location: c.location,
        schedule_day: c.scheduleDay,
        schedule_time: c.scheduleTime,
        price: c.price,
        price_label: c.pricePeriod,
        age_group: c.ageGroup,
        level: c.category,
        capacity: c.capacity,
        status: c.status,
        featured: c.featured ? "yes" : "no",
        image_url: c.imageUrl ?? "",
      })),
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base text-secondary"><Plus className="h-4 w-4" /> Add or Edit Class</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Title"><Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Style"><Input value={form.style ?? ""} onChange={(e) => setForm({ ...form, style: e.target.value })} /></Field>
          <Field label="Location"><Input value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
          <Field label="Schedule day"><Input value={form.scheduleDay ?? ""} onChange={(e) => setForm({ ...form, scheduleDay: e.target.value })} /></Field>
          <Field label="Schedule time"><Input value={form.scheduleTime ?? ""} onChange={(e) => setForm({ ...form, scheduleTime: e.target.value })} /></Field>
          <Field label="Price"><Input type="number" value={form.price ?? 0} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></Field>
          <Field label="Age group"><Input value={form.ageGroup ?? ""} onChange={(e) => setForm({ ...form, ageGroup: e.target.value })} /></Field>
          <Field label="Level/category"><Input value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value.toLowerCase() })} /></Field>
          <Field label="Capacity"><Input type="number" value={form.capacity ?? 0} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></Field>
          <Field label="Status">
            <Select value={form.status ?? "active"} onValueChange={(value) => setForm({ ...form, status: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">active</SelectItem>
                <SelectItem value="draft">draft</SelectItem>
                <SelectItem value="inactive">inactive</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Class image">
            <div className="space-y-2">
              {form.imageUrl && <img src={form.imageUrl} alt="Class preview" className="h-28 w-full rounded-xl object-cover" />}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary/90">
                <Upload className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload class image"}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => uploadClassImage(e.target.files?.[0] ?? null)} />
              </label>
              <Input value={form.imageUrl ?? ""} placeholder="Optional image URL" onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </div>
          </Field>
          <Field label="Description"><Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <div className="flex gap-2 sm:col-span-2">
            <Button onClick={save}>Save Class</Button>
            <Button variant="outline" onClick={() => setForm(EMPTY_CLASS)}>Clear</Button>
            <Button variant="outline" onClick={runDiagnostic}>Run Save Diagnostic</Button>
          </div>
          {diagnostic && (
            <pre className="whitespace-pre-wrap rounded-xl bg-muted p-3 text-xs text-muted-foreground sm:col-span-2">
              {diagnostic}
            </pre>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base text-secondary">Current Classes</CardTitle>
            <Button variant="outline" onClick={exportClasses} disabled={!classes.length} className="gap-2">
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {classes.map((c) => (
            <div key={c.id} className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-semibold text-secondary">{c.name}</p><p className="text-sm text-muted-foreground">{c.scheduleDay} {c.scheduleTime} - {c.location}</p></div>
              <div className="flex gap-2"><Button variant="outline" onClick={() => edit(c)}>Edit</Button><Button variant="outline" onClick={() => archive(c.id)}>Deactivate</Button></div>
            </div>
          ))}
          {!classes.length && <p className="text-sm text-muted-foreground">No classes found.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function BookingsManager({ bookings, onSaved }: { bookings: Booking[]; onSaved: () => void }) {
  const [drafts, setDrafts] = useState<Record<string, Pick<Booking, "paymentStatus" | "status" | "notes">>>({});
  const { toast } = useToast();

  useEffect(() => {
    setDrafts(
      Object.fromEntries(
        bookings.map((booking) => [
          booking.id,
          {
            paymentStatus: booking.paymentStatus,
            status: booking.status,
            notes: booking.notes ?? "",
          },
        ]),
      ),
    );
  }, [bookings]);

  const setDraft = (booking: Booking, next: Partial<Pick<Booking, "paymentStatus" | "status" | "notes">>) => {
    setDrafts((current) => ({
      ...current,
      [booking.id]: {
        paymentStatus: current[booking.id]?.paymentStatus ?? booking.paymentStatus,
        status: current[booking.id]?.status ?? booking.status,
        notes: current[booking.id]?.notes ?? booking.notes ?? "",
        ...next,
      },
    }));
  };

  const saveWorkflow = async (booking: Booking) => {
    const draft = drafts[booking.id];
    if (!draft) return;
    try {
      await updateBookingWorkflow(booking.id, draft);
      toast({ title: "Booking updated." });
      onSaved();
    } catch (error) {
      toast({ title: "Could not update booking", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    }
  };

  const saveAndEmailStudent = async (booking: Booking) => {
    const draft = drafts[booking.id];
    if (!draft) return;
    try {
      await updateBookingWorkflow(booking.id, draft);
      await notifyBookingStatus(booking, draft);
      toast({ title: "Booking updated and student emailed." });
      onSaved();
    } catch (error) {
      toast({ title: "Could not email student", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    }
  };
  const exportBookings = () => {
    downloadCsv(
      "bookings.csv",
      bookings.map((b) => ({
        created_at: b.createdAt,
        student_name: b.studentName,
        student_email: b.email,
        student_phone: b.phone,
        age_group: b.ageGroup,
        class: b.className ?? b.classId,
        booking_status: b.status,
        payment_status: b.paymentStatus,
        notes: b.notes,
      })),
    );
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base text-secondary">Bookings and Payments</CardTitle>
          <Button variant="outline" onClick={exportBookings} disabled={!bookings.length} className="gap-2">
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {bookings.map((b) => {
          const draft = drafts[b.id] ?? { paymentStatus: b.paymentStatus, status: b.status, notes: b.notes ?? "" };
          return (
            <div key={b.id} className="grid gap-4 rounded-xl border p-4 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-secondary">{b.studentName}</p>
                  <Badge variant={b.status === "confirmed" ? "default" : "outline"}>{b.status}</Badge>
                  <Badge variant="outline">{b.paymentStatus}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{b.className ?? b.classId}</p>
                <p className="text-sm text-muted-foreground">{b.email} - {b.phone || "no phone"}</p>
                <p className="text-xs text-muted-foreground">
                  {b.ageGroup || "age not provided"} - {new Date(b.createdAt).toLocaleString()}
                </p>
                {b.notes && <p className="rounded-lg bg-muted px-3 py-2 text-sm text-secondary">{b.notes}</p>}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Booking status">
                  <Select value={draft.status} onValueChange={(value) => setDraft(b, { status: value as Booking["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">confirmed</SelectItem>
                      <SelectItem value="waitlist">waitlist</SelectItem>
                      <SelectItem value="cancelled">cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Payment">
                  <Select value={draft.paymentStatus} onValueChange={(value) => setDraft(b, { paymentStatus: value as Booking["paymentStatus"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">pending</SelectItem>
                      <SelectItem value="received">received</SelectItem>
                      <SelectItem value="waived">waived</SelectItem>
                      <SelectItem value="refunded">refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Admin notes">
                    <Textarea
                      value={draft.notes}
                      onChange={(event) => setDraft(b, { notes: event.target.value })}
                      placeholder="Call back, payment detail, trial class note"
                    />
                  </Field>
                </div>
                <div className="grid gap-2 sm:col-span-2 sm:grid-cols-2">
                  <Button variant="outline" onClick={() => saveWorkflow(b)}>Save Only</Button>
                  <Button onClick={() => saveAndEmailStudent(b)}>Save + Email Student</Button>
                </div>
              </div>
            </div>
          );
        })}
        {!bookings.length && <p className="text-sm text-muted-foreground">No bookings yet.</p>}
      </CardContent>
    </Card>
  );
}

async function notifyBookingStatus(
  booking: Booking,
  draft: Pick<Booking, "paymentStatus" | "status" | "notes">,
) {
  const response = await fetch("/api/notify-booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "booking-status",
      classId: booking.classId,
      className: booking.className ?? booking.classId,
      studentName: booking.studentName,
      studentEmail: booking.email,
      studentPhone: booking.phone,
      bookingStatus: draft.status,
      paymentStatus: draft.paymentStatus,
      notes: draft.notes,
    }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || "Email could not be sent.");
  }
}

function AnnouncementsManager({ announcements, onSaved }: { announcements: Announcement[]; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Announcement>>({ title: "", message: "", status: "published" });
  const { toast } = useToast();
  const save = async () => {
    try {
      await saveAnnouncement(form);
      toast({ title: "Announcement saved." });
      setForm({ title: "", message: "", status: "published" });
      onSaved();
    } catch (error) {
      toast({ title: "Could not save announcement", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    }
  };
  return <SimpleEditor title="Announcements" items={announcements} form={form} setForm={setForm} onSave={save} itemBody={(a) => a.message} />;
}

function VideosManager({ videos, classes, onSaved }: { videos: PracticeVideo[]; classes: DanceClass[]; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<PracticeVideo>>({ title: "", url: "", description: "", classId: "" });
  const { toast } = useToast();
  const save = async () => {
    try {
      await savePracticeVideo(form);
      toast({ title: "Practice video saved." });
      setForm({ title: "", url: "", description: "", classId: "" });
      onSaved();
    } catch (error) {
      toast({ title: "Could not save video", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    }
  };
  return (
    <Card>
      <CardHeader><CardTitle className="text-base text-secondary">Practice Videos</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Field label="Title"><Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Video URL"><Input value={form.url ?? ""} onChange={(e) => setForm({ ...form, url: e.target.value })} /></Field>
        <Field label="Assign to class"><Select value={form.classId || "none"} onValueChange={(value) => setForm({ ...form, classId: value === "none" ? "" : value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">No class</SelectItem>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></Field>
        <Field label="Description"><Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
        <Button onClick={save}>Save Video</Button>
        {videos.map((v) => <div key={v.id} className="rounded-xl border p-3"><p className="font-semibold text-secondary">{v.title}</p><p className="text-sm text-muted-foreground">{v.className ?? "All students"}</p></div>)}
      </CardContent>
    </Card>
  );
}

function GalleryManager({ images, onSaved }: { images: GalleryImage[]; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<GalleryImage>>({ title: "", imageUrl: "", altText: "", status: "published" });
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const save = async () => {
    try {
      await saveGalleryImage(form);
      toast({ title: "Gallery image saved." });
      setForm({ title: "", imageUrl: "", altText: "", status: "published" });
      onSaved();
    } catch (error) {
      toast({ title: "Could not save image", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    }
  };
  const uploadGalleryImage = async (file: File | null) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const imageUrl = await uploadStudioImage("gallery", file);
      setForm({ ...form, imageUrl });
      toast({ title: "Gallery image uploaded." });
    } catch (error) {
      toast({ title: "Could not upload image", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <Card>
      <CardHeader><CardTitle className="text-base text-secondary">Gallery Images</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Field label="Title"><Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Image">
          <div className="space-y-2">
            {form.imageUrl && <img src={form.imageUrl} alt="Gallery preview" className="h-32 w-full rounded-xl object-cover" />}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary/90">
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload gallery image"}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => uploadGalleryImage(e.target.files?.[0] ?? null)} />
            </label>
            <Input value={form.imageUrl ?? ""} placeholder="Optional image URL" onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div>
        </Field>
        <Field label="Alt text"><Input value={form.altText ?? ""} onChange={(e) => setForm({ ...form, altText: e.target.value })} /></Field>
        <Field label="Status">
          <Select value={form.status ?? "published"} onValueChange={(value) => setForm({ ...form, status: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="published">published</SelectItem>
              <SelectItem value="hidden">hidden</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Button onClick={save}>Save Image</Button>
        <div className="space-y-3">
          {images.map((image) => (
            <div key={image.id} className="grid gap-3 rounded-xl border p-3 sm:grid-cols-[96px_1fr]">
              {image.imageUrl ? <img src={image.imageUrl} alt={image.altText ?? image.title} className="h-20 w-24 rounded-md object-cover" /> : <div className="h-20 w-24 rounded-md bg-muted" />}
              <div>
                <p className="font-semibold text-secondary">{image.title || "Untitled image"}</p>
                <p className="break-all text-sm text-muted-foreground">{image.imageUrl}</p>
              </div>
            </div>
          ))}
          {!images.length && <p className="text-sm text-muted-foreground">Nothing here yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function SimpleEditor<T extends { id: string; title: string }>({
  title,
  items,
  form,
  setForm,
  onSave,
  itemBody,
}: {
  title: string;
  items: T[];
  form: any;
  setForm: (next: any) => void;
  onSave: () => void;
  itemBody: (item: T) => string | null | undefined;
}) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base text-secondary">{title}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Field label="Title"><Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        {"message" in form && <Field label="Message"><Textarea value={form.message ?? ""} onChange={(e) => setForm({ ...form, message: e.target.value })} /></Field>}
        {"imageUrl" in form && <Field label="Image URL"><Input value={form.imageUrl ?? ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></Field>}
        {"altText" in form && <Field label="Alt text"><Input value={form.altText ?? ""} onChange={(e) => setForm({ ...form, altText: e.target.value })} /></Field>}
        <Field label="Status"><Input value={form.status ?? "published"} onChange={(e) => setForm({ ...form, status: e.target.value })} /></Field>
        <Button onClick={onSave}>Save</Button>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border p-3">
              <p className="font-semibold text-secondary">{item.title}</p>
              <p className="break-all text-sm text-muted-foreground">{itemBody(item)}</p>
            </div>
          ))}
          {!items.length && <p className="text-sm text-muted-foreground">Nothing here yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  const id = useMemo(() => label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), [label]);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function downloadCsv(filename: string, rows: Record<string, string | number | boolean | null | undefined>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escapeCell = (value: string | number | boolean | null | undefined) => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
