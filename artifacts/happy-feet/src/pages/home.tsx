import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, MapPin, Clock, Loader2, ArrowRight, Sparkles, ChevronDown, CheckCircle2, CreditCard, HeartHandshake, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  createBooking,
  type DanceClass,
  type Instructor,
  DEFAULT_HOMEPAGE,
  useHomepageContent,
  useInstructors,
  useStudioClasses,
} from "@/lib/studioflow";

const CATEGORY_FILTERS = ["All", "Kids", "Adults", "Showcase", "Workshop"];

const DANCE_IMAGES: Record<string, string> = {
  bollywood: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80",
  bollyhop: "https://images.unsplash.com/photo-1547245324-d777c6f05e80?auto=format&fit=crop&w=800&q=80",
  "semi-classical": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
  "hip-hop": "https://images.unsplash.com/photo-1547245324-d777c6f05e80?auto=format&fit=crop&w=800&q=80",
  kids: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=800&q=80",
  showcase: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
  workshop: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=800&q=80",
  default: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=800&q=80",
};

function getClassImage(style: string, category: string) {
  const key = style?.toLowerCase();
  const cat = category?.toLowerCase();
  return DANCE_IMAGES[key] ?? DANCE_IMAGES[cat] ?? DANCE_IMAGES.default;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const selectedCategory = activeCategory !== "All" ? activeCategory.toLowerCase() : undefined;
  const { data: classes, isLoading } = useStudioClasses(selectedCategory);
  const { data: homepage } = useHomepageContent();
  const { data: instructors } = useInstructors();
  const instructorRef = useRef<HTMLElement>(null);

  const scrollToClasses = () =>
    document.getElementById("classes")?.scrollIntoView({ behavior: "smooth" });
  const scrollToInstructor = () =>
    instructorRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">

      {/* ── HERO (video background) ───────────────────────── */}
      <section className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: "92vh" }}>

        {/* Video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline
          poster={homepage.heroImageUrl || DEFAULT_HOMEPAGE.heroImageUrl}
        >
          <source
            src="https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_30fps.mp4"
            type="video/mp4"
          />
          <source
            src="https://videos.pexels.com/video-files/4427958/4427958-hd_1920_1080_24fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Overlays */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, rgba(58,31,58,0.82) 0%, rgba(192,24,90,0.55) 60%, rgba(0,0,0,0.6) 100%)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, #fffaf6 0%, transparent 28%)" }} />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
          <Badge className="mb-6 inline-flex items-center gap-1.5 border-none px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em]"
            style={{ background: "rgba(201,139,47,0.9)", color: "#fff" }}>
            <Sparkles className="w-3 h-3" /> NYC & New Jersey
          </Badge>

          <h1 className="font-serif font-bold text-white leading-[1.05] mb-6"
            style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", textShadow: "0 4px 32px rgba(0,0,0,0.4)" }}>
            {homepage.heroHeadline.split("\n").map((line, index) => (
              <span key={line}>
                {line}
                {index === 0 && <br />}
              </span>
            ))}
          </h1>

          <p className="mx-auto mb-10 font-medium leading-relaxed text-white/90"
            style={{ fontSize: "clamp(1rem, 2.2vw, 1.35rem)", maxWidth: "600px", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
            {homepage.heroSubheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={scrollToClasses}
              className="rounded-full font-bold text-base px-10 h-14 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl border-0"
              style={{ background: "linear-gradient(135deg, #c0185a, #8a0f3f)", color: "#fff" }}>
              {homepage.ctaText || DEFAULT_HOMEPAGE.ctaText}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={scrollToInstructor}
              className="rounded-full font-semibold text-base px-10 h-14 backdrop-blur-md border-white/30 text-white hover:bg-white/15 transition-all">
              Meet Your Instructor
              <ChevronDown className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to top, #fffaf6, transparent)" }} />
      </section>

      {homepage.announcementBanner && (
        <section className="w-full" style={{ background: "#fffaf6" }}>
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(192,24,90,0.1)", color: "#c0185a" }}>
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#3a1f3a" }}>Studio update</p>
                <p className="text-sm leading-relaxed" style={{ color: "#6b5b6e" }}>{homepage.announcementBanner}</p>
              </div>
            </div>
            <Button onClick={scrollToClasses} variant="outline" className="rounded-full font-semibold">
              View classes
            </Button>
          </div>
        </section>
      )}

      {/* ── WHY HAPPY FEET ───────────────────────────────────── */}
      <section className="py-20 w-full" style={{ background: "#fffaf6" }}>
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#c0185a" }}>
              Why dancers love it here
            </p>
            <h2 className="font-serif font-bold leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#3a1f3a" }}>
              More than a dance class.<br />
              <span style={{ color: "#c0185a" }}>A community.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: HeartHandshake, title: "Warm, personal coaching", body: "Anitha brings precision and encouragement to every class, so beginners feel safe and experienced dancers stay challenged." },
              { icon: CheckCircle2, title: "Clear levels and batches", body: "Pick by age, level, location, and goal. If you are not sure where to start, book a spot and the team will guide you." },
              { icon: MessageCircle, title: "Real follow-up", body: "After you book, Happy Feet confirms details directly and helps with payment, location, and next steps." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl p-8 flex flex-col gap-3"
                style={{ background: "linear-gradient(135deg, rgba(192,24,90,0.05), rgba(58,31,58,0.04))", border: "1px solid rgba(192,24,90,0.1)" }}>
                <Icon className="h-6 w-6" style={{ color: "#c98b2f" }} />
                <h3 className="font-serif font-bold text-lg" style={{ color: "#3a1f3a" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6b5b6e" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 w-full" style={{ background: "#f9f3ef" }}>
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#c0185a" }}>How booking works</p>
            <h2 className="font-serif font-bold" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)", color: "#3a1f3a" }}>
              Simple, human, and confirmed by the studio.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: CalendarDays, title: "Choose a class", body: "Browse open batches by age, level, location, and schedule." },
              { icon: CreditCard, title: "Submit your spot request", body: "Add contact details and use Venmo instructions if payment is due now." },
              { icon: CheckCircle2, title: "Get confirmation", body: "The studio reviews your request and follows up with final class details." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-white p-6 shadow-sm" style={{ border: "1px solid rgba(58,31,58,0.08)" }}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full" style={{ background: "rgba(192,24,90,0.1)", color: "#c0185a" }}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-bold" style={{ color: "#3a1f3a" }}>{title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "#6b5b6e" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLASSES GRID ─────────────────────────────────────── */}
      <section id="classes" className="py-20 w-full" style={{ background: "#f9f3ef" }}>
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#c0185a" }}>
              Open enrollments
            </p>
            <h2 className="font-serif font-bold" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#3a1f3a" }}>
              Pick your class.
            </h2>
            <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: "#6b5b6e" }}>
              First time? Drop in. Ready to commit? Join a batch.
              Aiming for the stage? We have a showcase team for that.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORY_FILTERS.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={activeCategory === cat
                  ? { background: "#3a1f3a", color: "#fff", boxShadow: "0 2px 12px rgba(58,31,58,0.3)" }
                  : { background: "#fff", color: "#6b5b6e", border: "1px solid rgba(58,31,58,0.15)" }}>
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-10 w-10 animate-spin" style={{ color: "#c0185a" }} />
            </div>
          ) : (
            classes.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {classes.map((c) => <ClassCard key={c.id} danceClass={c} venmoHandle={homepage.venmoHandle} />)}
              </div>
            ) : (
              <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm" style={{ border: "1px solid rgba(58,31,58,0.08)" }}>
                <CalendarDays className="mx-auto mb-3 h-9 w-9" style={{ color: "#c0185a" }} />
                <h3 className="font-serif text-xl font-bold" style={{ color: "#3a1f3a" }}>No classes in this category yet</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "#6b5b6e" }}>
                  Try another filter or check back soon. New batches and workshops are added as the schedule opens.
                </p>
                <Button onClick={() => setActiveCategory("All")} className="mt-5 rounded-full">Show all classes</Button>
              </div>
            )
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-16 w-full" style={{ background: "linear-gradient(135deg, #3a1f3a, #5c2f5c)" }}>
        <div className="w-full max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] mb-10"
            style={{ color: "rgba(249,221,234,0.7)" }}>
            From the Happy Feet family
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {(homepage.sentiments?.length ? homepage.sentiments : DEFAULT_HOMEPAGE.sentiments).map((t) => (
              <div key={t.name} className="rounded-2xl p-7 flex flex-col gap-4"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p className="text-sm leading-relaxed italic" style={{ color: "rgba(255,255,255,0.85)" }}>"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  {t.imageUrl ? <img src={t.imageUrl} alt={t.name} className="h-11 w-11 rounded-full object-cover" /> : null}
                  <div>
                    <p className="font-semibold text-sm text-white">{t.name}</p>
                    <p className="text-xs" style={{ color: "#c98b2f" }}>{t.tag}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEET THE INSTRUCTOR ──────────────────────────────── */}
      <section ref={instructorRef} id="instructor" className="py-24 w-full" style={{ background: "#fffaf6" }}>
        <div className="w-full max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] w-full max-w-sm mx-auto"
                style={{ background: "linear-gradient(145deg, #3a1f3a 0%, #c0185a 60%, #c98b2f 100%)", boxShadow: "0 24px 64px rgba(192,24,90,0.25)" }}>
                <img
                  src={homepage.instructorImageUrl || DEFAULT_HOMEPAGE.instructorImageUrl}
                  alt="Anitha Prakash — Founder & Lead Instructor"
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 md:right-4 rounded-2xl px-5 py-4 shadow-xl"
                style={{ background: "#c98b2f", color: "#fff" }}>
                <p className="text-xs font-bold uppercase tracking-wider">Founder & Director</p>
                <p className="text-sm font-semibold mt-0.5">15+ Years Teaching</p>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "#c0185a" }}>
                Meet your instructor
              </p>
              <h2 className="font-serif font-bold mb-5 leading-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#3a1f3a" }}>
                Anitha Prakash
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: "#4a3550" }}>
                Anitha grew up performing classical Indian dance and fell in love with Bollywood in her teens. After training
                with master choreographers across Mumbai and New York, she founded Happy Feet to bring that same energy to NYC and NJ.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: "#4a3550" }}>
                Her teaching philosophy is simple: technique matters, but joy matters more. You'll learn to move with intention,
                express without apology, and leave every class feeling more alive than when you walked in.
              </p>
              <p className="text-base leading-relaxed mb-8 font-medium" style={{ color: "#3a1f3a" }}>
                She choreographs for stage showcases, cultural festivals, and private events — and still teaches every class herself.
              </p>
              <Button size="lg" onClick={scrollToClasses}
                className="rounded-full font-bold px-8 h-12 transition-all hover:scale-105 hover:shadow-xl border-0"
                style={{ background: "linear-gradient(135deg, #c0185a, #8a0f3f)", color: "#fff" }}>
                Train with Anitha
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <OtherInstructors instructors={instructors.filter((instructor) => instructor.isActive && instructor.name !== "Anitha Prakash")} />

      {/* ── BOTTOM CTA ───────────────────────────────────────── */}
      <section className="py-20 w-full"
        style={{ background: "linear-gradient(135deg, #c0185a 0%, #3a1f3a 100%)" }}>
        <div className="w-full max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif font-bold text-white mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Your spot is waiting.
          </h2>
          <p className="text-white/80 text-base mb-8 max-w-lg mx-auto">
            Batches fill up fast — especially the showcase team. Don't wait until it's full.
          </p>
          <Button size="lg" onClick={scrollToClasses}
            className="rounded-full font-bold text-base px-12 h-14 shadow-2xl transition-all hover:scale-105 border-0"
            style={{ background: "#fff", color: "#c0185a" }}>
            Book a Class Now
          </Button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="py-10 w-full" style={{ background: "#3a1f3a" }}>
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-serif font-bold text-lg text-white">Happy Feet Dance Academy</p>
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                NYC & New Jersey · Dance boldly. Feel at home.
              </p>
            </div>
            <div className="flex gap-6 text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              <button onClick={scrollToClasses} className="hover:text-white transition-colors">Classes</button>
              <button onClick={scrollToInstructor} className="hover:text-white transition-colors">Instructor</button>
            </div>
          </div>
          <div className="mt-6 pt-6 text-center text-xs"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} Happy Feet Dance Academy. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ── FLOATING CTA ─────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50"
        style={{ filter: "drop-shadow(0 8px 24px rgba(192,24,90,0.45))" }}>
        <button onClick={scrollToClasses}
          className="flex items-center gap-2 rounded-full font-bold text-sm px-6 py-3.5 text-white transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, #c0185a, #8a0f3f)" }}>
          <CalendarDays className="w-4 h-4" />
          Book a Class
        </button>
      </div>
    </div>
  );
}

function OtherInstructors({ instructors }: { instructors: Instructor[] }) {
  if (!instructors.length) return null;
  return (
    <section className="py-20 w-full" style={{ background: "#f9f3ef" }}>
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#c0185a" }}>
            More instructors
          </p>
          <h2 className="font-serif font-bold" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#3a1f3a" }}>
            Learn with the Happy Feet team.
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="overflow-hidden rounded-2xl bg-white shadow-sm" style={{ border: "1px solid rgba(58,31,58,0.08)" }}>
              <div className="aspect-[4/3] overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(192,24,90,0.12), rgba(201,139,47,0.12))" }}>
                {instructor.imageUrl ? (
                  <img src={instructor.imageUrl} alt={instructor.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center font-serif text-5xl font-bold" style={{ color: "#c0185a" }}>
                    {instructor.name.slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold" style={{ color: "#3a1f3a" }}>{instructor.name}</h3>
                {instructor.specialties.length > 0 && (
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "#c0185a" }}>
                    {instructor.specialties.join(" / ")}
                  </p>
                )}
                {instructor.bio && <p className="mt-3 text-sm leading-relaxed" style={{ color: "#6b5b6e" }}>{instructor.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClassCard({ danceClass, venmoHandle }: { danceClass: DanceClass; venmoHandle: string }) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    studentType: danceClass.ageGroup?.toLowerCase().includes("kid") ? "kid" : "adult",
    notes: "",
  });

  const handleEnroll = async () => {
    setIsSaving(true);
    try {
      await createBooking({ classId: danceClass.id, className: danceClass.name, ...formData });
      void notifyBooking({
        classId: danceClass.id,
        className: danceClass.name,
        classSchedule: `${danceClass.scheduleDay}s ${danceClass.scheduleTime}`,
        classLocation: danceClass.location,
        price: danceClass.price,
        venmoHandle: normalizedVenmo,
        studentName: `${formData.firstName} ${formData.lastName}`.trim(),
        studentEmail: formData.email,
        studentPhone: formData.phone,
        ageGroup: formData.studentType,
        notes: formData.notes,
      });
      setStep(3);
      toast({ title: "Request received!", description: "Happy Feet will confirm your spot directly." });
    } catch (error) {
      toast({
        title: "Could not save booking",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const spotsLeft = danceClass.spotsAvailable;
  const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0;
  const isFull = spotsLeft === 0;

  const cardImage = danceClass.imageUrl ?? getClassImage(danceClass.style, danceClass.category);

  const venmoNote = encodeURIComponent(
    `${danceClass.name} - ${danceClass.instructor} - $${danceClass.price}`
  );
  const normalizedVenmo = venmoHandle.replace(/^@/, "") || DEFAULT_HOMEPAGE.venmoHandle;
  const venmoUrl = `https://venmo.com/${normalizedVenmo}?txn=pay&amount=${danceClass.price}&note=${venmoNote}`;

  return (
    <Card className="flex flex-col overflow-hidden border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{ background: "#fff", boxShadow: "0 2px 16px rgba(58,31,58,0.1)", borderRadius: "20px" }}>

      {/* Class photo header */}
      <div className="relative h-44 overflow-hidden">
        <img src={cardImage} alt={danceClass.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(58,31,58,0.7) 0%, transparent 60%)" }} />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <Badge className="text-xs font-bold uppercase tracking-wider border-0 px-3 py-1"
            style={{ background: "rgba(255,255,255,0.92)", color: "#c0185a" }}>
            {danceClass.style}
          </Badge>
          {isAlmostFull && (
            <Badge className="text-xs font-bold border-0 px-3 py-1"
              style={{ background: "rgba(201,139,47,0.95)", color: "#fff" }}>
              {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
            </Badge>
          )}
          {isFull && (
            <Badge className="text-xs font-bold border-0 px-3 py-1"
              style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}>
              Full
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="px-6 pt-5 pb-2">
        <h3 className="font-serif font-bold leading-snug" style={{ fontSize: "1.2rem", color: "#3a1f3a" }}>
          {danceClass.name}
        </h3>
        <p className="text-sm leading-relaxed mt-1.5" style={{ color: "#6b5b6e" }}>
          {danceClass.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1 px-6 pb-4">
        <div className="space-y-2">
          {[
            { icon: Clock, text: `${danceClass.scheduleDay}s · ${danceClass.scheduleTime} · ${danceClass.duration}` },
            { icon: MapPin, text: danceClass.location },
            { icon: CalendarDays, text: danceClass.ageGroup },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-sm" style={{ color: "#6b5b6e" }}>
              <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: "#c0185a" }} />
              {text}
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-3 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(58,31,58,0.06)" }}>
        <div>
          <span className="text-2xl font-serif font-bold" style={{ color: "#3a1f3a" }}>${danceClass.price}</span>
          <span className="text-xs ml-1" style={{ color: "#9b8fa0" }}>/ {danceClass.pricePeriod}</span>
        </div>

        <Dialog open={isOpen} onOpenChange={(o) => { setIsOpen(o); if (!o) setStep(1); }}>
          <DialogTrigger asChild>
            <Button disabled={isFull}
              className="rounded-full font-bold text-sm px-6 h-10 border-0 transition-all hover:scale-105"
              style={{ background: isFull ? "#e5e5e5" : "linear-gradient(135deg, #c0185a, #8a0f3f)", color: isFull ? "#999" : "#fff" }}>
              {isFull ? "Full" : "Book Spot"}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md rounded-2xl">
            {/* Step indicator */}
            {step < 3 && (
              <div className="flex gap-2 mb-1">
                {[1, 2].map((s) => (
                  <div key={s} className="h-1 flex-1 rounded-full transition-all"
                    style={{ background: step >= s ? "#c0185a" : "#e5e5e5" }} />
                ))}
              </div>
            )}

            <DialogHeader>
              <DialogTitle className="font-serif text-2xl" style={{ color: "#3a1f3a" }}>
                {step === 1 ? "Claim Your Spot" : step === 2 ? "Send Payment" : "You're In!"}
              </DialogTitle>
              <DialogDescription className="text-sm" style={{ color: "#6b5b6e" }}>
                {danceClass.name} · {danceClass.scheduleDay}s · {danceClass.location}
              </DialogDescription>
            </DialogHeader>

            <div className="py-2">
              {/* Step 1 — Details */}
              {step === 1 && (
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wider">First Name</Label>
                      <Input className="rounded-xl" value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wider">Last Name</Label>
                      <Input className="rounded-xl" value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider">Email</Label>
                    <Input type="email" className="rounded-xl" value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider">Phone</Label>
                    <Input type="tel" className="rounded-xl" value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider">Anything we should know?</Label>
                    <Textarea
                      className="min-h-20 rounded-xl"
                      placeholder="Age, experience level, payment note, or questions"
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Step 2 — Venmo payment */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="rounded-2xl p-5 text-center"
                    style={{ background: "linear-gradient(135deg, rgba(192,24,90,0.06), rgba(58,31,58,0.04))", border: "1px solid rgba(192,24,90,0.12)" }}>
                    <p className="text-3xl font-serif font-bold mb-1" style={{ color: "#3a1f3a" }}>
                      ${danceClass.price}
                    </p>
                    <p className="text-sm mb-1" style={{ color: "#6b5b6e" }}>
                      {danceClass.name} · {danceClass.instructor}
                    </p>
                    <p className="text-xs" style={{ color: "#9b8fa0" }}>due now via Venmo to secure your spot</p>
                  </div>

                  <a
                    href={venmoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full rounded-2xl px-6 py-4 font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: "#3d95ce", color: "#fff", textDecoration: "none" }}
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.5 1.5c.8 1.3 1.2 2.6 1.2 4.4 0 5.5-4.7 12.6-8.5 17.6H4.9L1.5 2.4l7-0.7 1.8 14.3c1.7-2.8 3.7-7.1 3.7-10.1 0-1.6-.3-2.8-.8-3.7L19.5 1.5z"/>
                    </svg>
                    Open Venmo - Pay @{normalizedVenmo}
                  </a>

                  <p className="text-xs text-center" style={{ color: "#9b8fa0" }}>
                    Amount and class details are pre-filled. After paying, tap Complete Registration below.
                    We'll confirm your spot within 24 hours.
                  </p>
                </div>
              )}

              {/* Step 3 — Confirmed */}
              {step === 3 && (
                <div className="text-center space-y-4 py-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2"
                    style={{ background: "linear-gradient(135deg, rgba(192,24,90,0.12), rgba(201,139,47,0.12))" }}>
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#c0185a" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-serif font-bold" style={{ color: "#3a1f3a" }}>Request received!</h3>
                  <p className="text-sm" style={{ color: "#6b5b6e" }}>
                    Happy Feet has your booking request. The studio will confirm your spot, payment, and class details directly.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 pt-2">
              {step === 1 && (
                <Button onClick={() => setStep(2)} className="w-full rounded-full font-bold h-12 border-0"
                  disabled={!formData.firstName || !formData.lastName || !formData.email}
                  style={{ background: "linear-gradient(135deg, #c0185a, #8a0f3f)", color: "#fff" }}>
                  Continue to Payment <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
              {step === 2 && (
                <div className="flex gap-2 w-full">
                  <Button variant="outline" onClick={() => setStep(1)} className="w-full rounded-full">Back</Button>
                  <Button onClick={handleEnroll} disabled={isSaving}
                    className="w-full rounded-full font-bold border-0"
                    style={{ background: "linear-gradient(135deg, #c0185a, #8a0f3f)", color: "#fff" }}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Complete Registration
                  </Button>
                </div>
              )}
              {step === 3 && (
                <Button onClick={() => setIsOpen(false)} className="w-full rounded-full font-bold border-0"
                  style={{ background: "linear-gradient(135deg, #c0185a, #8a0f3f)", color: "#fff" }}>
                  Done
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

async function notifyBooking(payload: Record<string, string | number>) {
  try {
    await fetch("/api/notify-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Booking persistence is the source of truth; email is a best-effort follow-up.
  }
}
