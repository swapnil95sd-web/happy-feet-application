import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { BookOpen, Building2, CalendarDays, Download, Image, LayoutDashboard, Megaphone, Plus, Settings, Upload, Users, Video } from "lucide-react";
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
  autoDeactivatePastClasses,
  deactivateClass,
  deactivateInstructor,
  ensureImageBuckets,
  runClassSaveDiagnostic,
  saveAnnouncement,
  saveClass,
  saveGalleryImage,
  saveHomepageContent,
  saveInstructor,
  savePracticeVideo,
  saveStudioSettings,
  updateBookingWorkflow,
  uploadStudioImage,
  type Announcement,
  type Booking,
  type DanceClass,
  type GalleryImage,
  type HomepageContent,
  type Instructor,
  type PracticeVideo,
  type Studio,
  useAdminStats,
  useActiveStudio,
  useAnnouncements,
  useBookings,
  useGalleryImages,
  useHomepageContent,
  useInstructors,
  usePracticeVideos,
  useStudioClasses,
} from "@/lib/studioflow";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "studio", label: "Studio Settings", icon: Settings },
  { id: "content", label: "Homepage", icon: Settings },
  { id: "instructors", label: "Instructors", icon: Users },
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
  instructorId: null,
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
  const instructorsQuery = useInstructors();
  const videosQuery = usePracticeVideos();
  const bookingsQuery = useBookings();
  const galleryQuery = useGalleryImages();
  const studioQuery = useActiveStudio();
  const stats = useAdminStats(classesQuery.data, bookingsQuery.data, announcementsQuery.data);

  useEffect(() => {
    void ensureImageBuckets().catch(() => {
      // Best-effort repair for existing uploaded images.
    });
    void autoDeactivatePastClasses()
      .then(() => {
        classesQuery.refetch();
      })
      .catch(() => {
        // Best-effort cleanup; classes with text-only weekdays stay active.
      });
  }, []);

  const refreshAll = () => {
    classesQuery.refetch();
    homepageQuery.refetch();
    announcementsQuery.refetch();
    instructorsQuery.refetch();
    videosQuery.refetch();
    bookingsQuery.refetch();
    galleryQuery.refetch();
    studioQuery.refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="px-4 py-10" style={{ background: "radial-gradient(circle at 20% 0, rgba(58,31,58,.08), transparent 40%)" }}>
        <div className="container mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-primary">Beyond8 Admin</p>
            <h1 className="font-serif text-4xl font-bold text-secondary">Beyond8 Command Center</h1>
            <p className="mt-1 text-muted-foreground">
              Managing {studioQuery.data.name}. Update public content, classes, bookings, announcements, videos, and images.
            </p>
          </div>
          <a href="/platform" className="inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-card">
            <Building2 className="h-4 w-4" />
            Platform Admin
          </a>
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
            {activeTab === "studio" && <StudioSettingsEditor initial={studioQuery.data} onSaved={refreshAll} />}
            {activeTab === "content" && <HomepageEditor initial={homepageQuery.data} onSaved={refreshAll} />}
            {activeTab === "instructors" && <InstructorsManager instructors={instructorsQuery.data} classes={classesQuery.data} bookings={bookingsQuery.data} onSaved={refreshAll} />}
            {activeTab === "classes" && <ClassManager classes={classesQuery.data} instructors={instructorsQuery.data} bookings={bookingsQuery.data} onSaved={refreshAll} />}
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
  const pendingBookings = bookings.filter((b) => b.paymentStatus === "pending");
  const almostFullClasses = classes.filter((c) => c.spotsAvailable <= 3 && c.status !== "inactive");
  const needsAttentionCount = pendingBookings.length + almostFullClasses.length;
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
          {pendingBookings.slice(0, 5).map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-xl border p-3">
              <span>{b.studentName} - {b.className ?? "Class"}</span>
              <Badge variant="outline">payment pending</Badge>
            </div>
          ))}
          {almostFullClasses.slice(0, 5).map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl border p-3">
              <span>{c.name}</span>
              <Badge className="bg-yellow-100 text-yellow-800">{c.spotsAvailable} spots left</Badge>
            </div>
          ))}
          {!bookings.length && !classes.length && <p className="text-muted-foreground">Connect Supabase to see live operations here.</p>}
          {(bookings.length > 0 || classes.length > 0) && needsAttentionCount === 0 && (
            <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-800">
              All caught up. No pending payments or nearly full classes right now.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StudioSettingsEditor({ initial, onSaved }: { initial: Studio; onSaved: () => void }) {
  const [form, setForm] = useState<Studio>(initial);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => setForm(initial), [initial]);

  const save = async () => {
    try {
      await saveStudioSettings(form);
      toast({ title: "Studio settings saved." });
      onSaved();
    } catch (error) {
      toast({
        title: "Could not save studio settings",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    }
  };

  const uploadLogo = async (file: File | null) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const logoUrl = await uploadStudioImage("site-images", file);
      setForm({ ...form, logoUrl });
      toast({ title: "Studio logo uploaded." });
    } catch (error) {
      toast({ title: "Could not upload logo", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-secondary">Studio Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!form.id && (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
            Studio settings are using the Happy Feet default until the multi-studio migration is run in Supabase.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Studio name">
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </Field>
          <Field label="Studio slug">
            <Input value={form.slug} disabled className="bg-muted" />
          </Field>
          <Field label="Status">
            <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">active</SelectItem>
                <SelectItem value="trial">trial</SelectItem>
                <SelectItem value="inactive">inactive</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Logo">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {form.logoUrl ? (
                  <img src={form.logoUrl} alt={`${form.name} logo`} className="h-14 w-14 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary font-serif font-bold text-white">
                    {form.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary/90">
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Upload logo"}
                  <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadLogo(event.target.files?.[0] ?? null)} />
                </label>
              </div>
              <Input value={form.logoUrl ?? ""} placeholder="Optional logo URL" onChange={(event) => setForm({ ...form, logoUrl: event.target.value })} />
            </div>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Primary color">
            <div className="flex gap-2">
              <Input type="color" value={form.primaryColor} onChange={(event) => setForm({ ...form, primaryColor: event.target.value })} className="h-10 w-16 p-1" />
              <Input value={form.primaryColor} onChange={(event) => setForm({ ...form, primaryColor: event.target.value })} />
            </div>
          </Field>
          <Field label="Secondary color">
            <div className="flex gap-2">
              <Input type="color" value={form.secondaryColor} onChange={(event) => setForm({ ...form, secondaryColor: event.target.value })} className="h-10 w-16 p-1" />
              <Input value={form.secondaryColor} onChange={(event) => setForm({ ...form, secondaryColor: event.target.value })} />
            </div>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Contact email">
            <Input value={form.contactEmail} onChange={(event) => setForm({ ...form, contactEmail: event.target.value })} />
          </Field>
          <Field label="Contact phone">
            <Input value={form.contactPhone} onChange={(event) => setForm({ ...form, contactPhone: event.target.value })} />
          </Field>
          <Field label="Payment label">
            <Input value={form.paymentLabel} placeholder="Venmo, Zelle, CashApp" onChange={(event) => setForm({ ...form, paymentLabel: event.target.value })} />
          </Field>
          <Field label="Payment handle">
            <Input value={form.paymentHandle} placeholder="@StudioName" onChange={(event) => setForm({ ...form, paymentHandle: event.target.value })} />
          </Field>
        </div>

        <div className="rounded-2xl border p-4">
          <p className="mb-3 text-sm font-semibold text-secondary">Brand preview</p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-12 w-12 rounded-full" style={{ background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})` }} />
            <div>
              <p className="font-serif text-xl font-bold" style={{ color: form.secondaryColor }}>{form.name}</p>
              <p className="text-sm text-muted-foreground">{form.contactEmail} - {form.paymentLabel} {form.paymentHandle}</p>
            </div>
          </div>
        </div>

        <Button onClick={save} disabled={!form.id}>
          Save Studio Settings
        </Button>
      </CardContent>
    </Card>
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
  const updateSentiment = (index: number, next: Partial<HomepageContent["sentiments"][number]>) => {
    const sentiments = [...(form.sentiments ?? [])];
    sentiments[index] = { ...sentiments[index], ...next };
    setForm({ ...form, sentiments });
  };
  const addSentiment = () => {
    setForm({
      ...form,
      sentiments: [...(form.sentiments ?? []), { quote: "", name: "", tag: "", imageUrl: "" }],
    });
  };
  const removeSentiment = (index: number) => {
    setForm({ ...form, sentiments: (form.sentiments ?? []).filter((_, itemIndex) => itemIndex !== index) });
  };
  const uploadSentimentImage = async (index: number, file: File | null) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const imageUrl = await uploadStudioImage("site-images", file);
      updateSentiment(index, { imageUrl });
      toast({ title: "Sentiment photo uploaded." });
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
        <Field label="About story"><Textarea value={form.aboutStory ?? ""} onChange={(e) => setForm({ ...form, aboutStory: e.target.value })} /></Field>
        <Field label="Instagram reel/post URLs">
          <Textarea
            value={(form.instagramUrls ?? []).join("\n")}
            placeholder="Paste one public Instagram Reel/Post URL per line"
            onChange={(e) => setForm({ ...form, instagramUrls: e.target.value.split("\n").map((url) => url.trim()).filter(Boolean) })}
          />
        </Field>
        <div className="space-y-4 sm:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <Label>Sentiments</Label>
            <Button type="button" variant="outline" onClick={addSentiment}>Add Sentiment</Button>
          </div>
          <div className="space-y-4">
            {(form.sentiments ?? []).map((sentiment, index) => (
              <div key={`${sentiment.name}-${index}`} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[96px_1fr]">
                <div className="space-y-2">
                  {sentiment.imageUrl ? (
                    <img src={sentiment.imageUrl} alt={sentiment.name || "Sentiment"} className="h-24 w-24 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-muted text-xs text-muted-foreground">Photo</div>
                  )}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold text-secondary transition-colors hover:bg-muted">
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => uploadSentimentImage(index, e.target.files?.[0] ?? null)} />
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={sentiment.name} placeholder="Name" onChange={(e) => updateSentiment(index, { name: e.target.value })} />
                  <Input value={sentiment.tag} placeholder="Label, class, or parent" onChange={(e) => updateSentiment(index, { tag: e.target.value })} />
                  <Textarea className="sm:col-span-2" value={sentiment.quote} placeholder="What they said" onChange={(e) => updateSentiment(index, { quote: e.target.value })} />
                  <Input className="sm:col-span-2" value={sentiment.imageUrl ?? ""} placeholder="Optional photo URL" onChange={(e) => updateSentiment(index, { imageUrl: e.target.value })} />
                  <Button type="button" variant="outline" onClick={() => removeSentiment(index)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
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

function InstructorsManager({
  instructors,
  classes,
  bookings,
  onSaved,
}: {
  instructors: Instructor[];
  classes: DanceClass[];
  bookings: Booking[];
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<Instructor>>({ name: "", email: "", bio: "", specialties: [], imageUrl: "", isActive: true });
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const edit = (instructor: Instructor) => setForm(instructor);
  const save = async () => {
    try {
      await saveInstructor(form);
      toast({ title: "Instructor saved." });
      setForm({ name: "", email: "", bio: "", specialties: [], imageUrl: "", isActive: true });
      onSaved();
    } catch (error) {
      toast({ title: "Could not save instructor", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    }
  };
  const remove = async (id: string) => {
    try {
      await deactivateInstructor(id);
      toast({ title: "Instructor removed from active list." });
      onSaved();
    } catch (error) {
      toast({ title: "Could not remove instructor", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    }
  };
  const uploadImage = async (file: File | null) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const imageUrl = await uploadStudioImage("instructor-images", file);
      setForm({ ...form, imageUrl });
      toast({ title: "Instructor image uploaded." });
    } catch (error) {
      toast({ title: "Could not upload image", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const specialtiesText = Array.isArray(form.specialties) ? form.specialties.join(", ") : "";
  const activeInstructors = instructors.filter((instructor) => instructor.isActive);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base text-secondary"><Plus className="h-4 w-4" /> Add or Edit Instructor</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Name"><Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Email"><Input value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Specialties"><Input value={specialtiesText} placeholder="Bollywood, Kids, Hip-Hop" onChange={(e) => setForm({ ...form, specialties: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /></Field>
          <Field label="Status">
            <Select value={form.isActive === false ? "inactive" : "active"} onValueChange={(value) => setForm({ ...form, isActive: value === "active" })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">active</SelectItem>
                <SelectItem value="inactive">inactive</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Instructor image">
            <div className="space-y-2">
              {form.imageUrl && <img src={form.imageUrl} alt="Instructor preview" className="h-32 w-full rounded-xl object-cover" />}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary/90">
                <Upload className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload instructor image"}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => uploadImage(e.target.files?.[0] ?? null)} />
              </label>
              <Input value={form.imageUrl ?? ""} placeholder="Optional image URL" onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </div>
          </Field>
          <Field label="Bio"><Textarea value={form.bio ?? ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></Field>
          <div className="flex gap-2 sm:col-span-2">
            <Button onClick={save}>Save Instructor</Button>
            <Button variant="outline" onClick={() => setForm({ name: "", email: "", bio: "", specialties: [], imageUrl: "", isActive: true })}>Clear</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base text-secondary">Instructor Overview</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {activeInstructors.map((instructor) => {
            const instructorClasses = classes.filter((c) => c.instructorId === instructor.id || c.instructor === instructor.name);
            const studentCount = bookings.filter((booking) => instructorClasses.some((c) => c.id === booking.classId)).length;
            return (
              <div key={instructor.id} className="grid gap-4 rounded-xl border p-4 md:grid-cols-[96px_1fr_auto] md:items-center">
                {instructor.imageUrl ? <img src={instructor.imageUrl} alt={instructor.name} className="h-24 w-24 rounded-xl object-cover" /> : <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-muted text-xl font-bold text-secondary">{instructor.name.slice(0, 1)}</div>}
                <div>
                  <p className="font-semibold text-secondary">{instructor.name}</p>
                  <p className="text-sm text-muted-foreground">{instructor.specialties.join(", ") || "No specialties listed"}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{instructorClasses.length} upcoming class{instructorClasses.length === 1 ? "" : "es"} - {studentCount} student registration{studentCount === 1 ? "" : "s"}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {instructorClasses.map((danceClass) => (
                      <Badge key={danceClass.id} variant="outline">{danceClass.name}: {bookings.filter((booking) => booking.classId === danceClass.id).length}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => edit(instructor)}>Edit</Button>
                  {!instructor.id.startsWith("demo-") && <Button variant="outline" onClick={() => remove(instructor.id)}>Remove</Button>}
                </div>
              </div>
            );
          })}
          {!activeInstructors.length && <p className="text-sm text-muted-foreground">No instructors yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function ClassManager({
  classes,
  instructors,
  bookings,
  onSaved,
}: {
  classes: DanceClass[];
  instructors: Instructor[];
  bookings: Booking[];
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<DanceClass>>(EMPTY_CLASS);
  const [isUploading, setIsUploading] = useState(false);
  const [diagnostic, setDiagnostic] = useState<string>("");
  const [savingPaymentId, setSavingPaymentId] = useState<string | null>(null);
  const { toast } = useToast();
  const bookingsByClass = useMemo(() => {
    return bookings.reduce<Record<string, Booking[]>>((groups, booking) => {
      groups[booking.classId] = [...(groups[booking.classId] ?? []), booking];
      return groups;
    }, {});
  }, [bookings]);

  const edit = (danceClass: DanceClass) => {
    setForm(danceClass);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
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
  const updateRosterPayment = async (booking: Booking, paymentStatus: Booking["paymentStatus"]) => {
    setSavingPaymentId(booking.id);
    try {
      await updateBookingWorkflow(booking.id, {
        paymentStatus,
        status: booking.status,
        notes: booking.notes ?? "",
      });
      toast({ title: "Payment status updated." });
      onSaved();
    } catch (error) {
      toast({ title: "Could not update payment", description: error instanceof Error ? error.message : undefined, variant: "destructive" });
    } finally {
      setSavingPaymentId(null);
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
    const rows = classes.flatMap((c) => {
      const classBookings = bookingsByClass[c.id] ?? [];
      const enrolledCount = classBookings.filter((booking) => booking.status !== "cancelled").length;
      const classFields = {
        class_title: c.name,
        style: c.style,
        instructor: c.instructor,
        location: c.location,
        schedule_day_or_date: c.scheduleDay,
        schedule_time: c.scheduleTime,
        price: c.price,
        price_label: c.pricePeriod,
        age_group: c.ageGroup,
        level: c.category,
        capacity: c.capacity,
        enrolled_students: enrolledCount,
        available_spots: Math.max(c.capacity - enrolledCount, 0),
        class_status: c.status,
        featured: c.featured ? "yes" : "no",
        image_url: c.imageUrl ?? "",
      };
      if (!classBookings.length) {
        return [{ ...classFields, student_name: "", student_email: "", student_phone: "", booking_status: "", payment_status: "", notes: "", registered_at: "" }];
      }
      return classBookings.map((booking) => ({
        ...classFields,
        student_name: booking.studentName,
        student_email: booking.email,
        student_phone: booking.phone,
        booking_status: booking.status,
        payment_status: booking.paymentStatus,
        notes: booking.notes,
        registered_at: booking.createdAt,
      }));
    });
    downloadCsv(
      "classes-and-students.csv",
      rows,
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
          <Field label="Schedule day/date"><Input value={form.scheduleDay ?? ""} placeholder="Monday or 2026-07-20" onChange={(e) => setForm({ ...form, scheduleDay: e.target.value })} /></Field>
          <Field label="Schedule time"><Input value={form.scheduleTime ?? ""} onChange={(e) => setForm({ ...form, scheduleTime: e.target.value })} /></Field>
          <Field label="Price"><Input type="number" value={form.price ?? 0} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></Field>
          <Field label="Age group"><Input value={form.ageGroup ?? ""} onChange={(e) => setForm({ ...form, ageGroup: e.target.value })} /></Field>
          <Field label="Instructor">
            <Select value={form.instructorId || "none"} onValueChange={(value) => {
              const instructor = instructors.find((item) => item.id === value);
              setForm({ ...form, instructorId: value === "none" ? null : value, instructor: instructor?.name ?? form.instructor });
            }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No instructor</SelectItem>
                {instructors.filter((instructor) => instructor.isActive && !instructor.id.startsWith("demo-")).map((instructor) => (
                  <SelectItem key={instructor.id} value={instructor.id}>{instructor.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
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
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Auto-deactivate works when Schedule day/date contains a real date, for example 2026-07-20. Weekly text like Monday stays active until you deactivate it.
          </p>
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
          {classes.map((c) => {
            const classBookings = bookingsByClass[c.id] ?? [];
            const enrolledCount = classBookings.filter((booking) => booking.status !== "cancelled").length;
            const availableSpots = Math.max(c.capacity - enrolledCount, 0);
            return (
            <div key={c.id} className="rounded-xl border p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-secondary">{c.name}</p>
                    <Badge variant={c.status === "active" ? "default" : "outline"}>{c.status}</Badge>
                    <Badge variant="outline">{enrolledCount} enrolled</Badge>
                    <Badge variant="outline">{availableSpots} open</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {c.scheduleDay} {c.scheduleTime} - {c.location}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.instructor} - {c.ageGroup || "All ages"} - capacity {c.capacity}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button variant="outline" onClick={() => edit(c)}>Edit</Button>
                  <Button variant="outline" onClick={() => archive(c.id)} disabled={c.status === "inactive"}>Deactivate</Button>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-muted/40 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-secondary">Students in this class</p>
                  <p className="text-xs text-muted-foreground">{classBookings.length} registration{classBookings.length === 1 ? "" : "s"}</p>
                </div>
                {classBookings.length ? (
                  <div className="space-y-2">
                    {classBookings.map((booking) => (
                      <div key={booking.id} className="grid gap-3 rounded-lg border bg-background p-3 lg:grid-cols-[1.2fr_0.8fr_190px] lg:items-center">
                        <div>
                          <p className="font-medium text-secondary">{booking.studentName}</p>
                          <p className="text-xs text-muted-foreground">{booking.email} - {booking.phone || "no phone"}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={booking.status === "confirmed" ? "default" : "outline"}>{booking.status}</Badge>
                          <Badge variant="outline">{booking.paymentStatus}</Badge>
                        </div>
                        <Select
                          value={booking.paymentStatus}
                          disabled={savingPaymentId === booking.id}
                          onValueChange={(value) => updateRosterPayment(booking, value as Booking["paymentStatus"])}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">pending</SelectItem>
                            <SelectItem value="received">received</SelectItem>
                            <SelectItem value="waived">waived</SelectItem>
                            <SelectItem value="refunded">refunded</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No students registered yet.</p>
                )}
              </div>
            </div>
          )})}
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
    let bookingUpdated = false;
    try {
      await updateBookingWorkflow(booking.id, draft);
      bookingUpdated = true;
      onSaved();
      const emailResult = await notifyBookingStatus(booking, draft);
      toast({
        title: emailResult.warning ? "Booking updated. Email skipped." : "Booking updated and student emailed.",
        description: emailResult.warning,
        variant: emailResult.warning ? "destructive" : "default",
      });
    } catch (error) {
      if (bookingUpdated) onSaved();
      toast({
        title: bookingUpdated ? "Booking updated, but email failed" : "Could not update booking",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
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
): Promise<{ warning?: string }> {
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
  const body = await response.json().catch(() => null);
  return { warning: typeof body?.warning === "string" ? body.warning : undefined };
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
