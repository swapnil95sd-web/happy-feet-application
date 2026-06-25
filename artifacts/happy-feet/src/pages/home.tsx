import { useState } from "react";
import { Link } from "wouter";
import { useListClasses, useCreateEnrollment } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, MapPin, Clock, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORY_FILTERS = ["All", "Kids", "Adults", "Showcase", "Workshop"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { data: classes, isLoading } = useListClasses(
    activeCategory !== "All" ? { category: activeCategory.toLowerCase() } : undefined
  );

  const scrollToClasses = () => {
    document.getElementById("classes")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: "92vh" }}>
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1800&q=80")' }}
        />
        {/* Overlays */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(58,31,58,0.82) 0%, rgba(192,24,90,0.55) 60%, rgba(0,0,0,0.6) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #fffaf6 0%, transparent 30%)" }} />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
          <Badge className="mb-6 inline-flex items-center gap-1.5 border-none px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em]"
            style={{ background: "rgba(201,139,47,0.9)", color: "#fff" }}>
            <Sparkles className="w-3 h-3" /> NYC & New Jersey
          </Badge>

          <h1 className="font-serif font-bold text-white leading-[1.05] mb-6"
            style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", textShadow: "0 4px 32px rgba(0,0,0,0.4)" }}>
            Dance boldly.<br />
            <span style={{ color: "#f8dde8" }}>Feel at home.</span>
          </h1>

          <p className="mx-auto mb-10 font-medium leading-relaxed text-white/90"
            style={{ fontSize: "clamp(1rem, 2.2vw, 1.35rem)", maxWidth: "600px", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
            Bollywood. BollyHop. Semi-Classical. Hip-Hop.
            <br className="hidden sm:block" />
            <span className="text-white/75"> For kids, teens, and adults — in NYC & NJ.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={scrollToClasses}
              className="rounded-full font-bold text-base px-10 h-14 shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl"
              style={{ background: "linear-gradient(135deg, #c0185a, #8a0f3f)", color: "#fff", border: "none" }}>
              Find Your Class
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" asChild
              className="rounded-full font-semibold text-base px-10 h-14 backdrop-blur-md border-white/30 text-white hover:bg-white/15 transition-all">
              <Link href="/portal">Student Portal</Link>
            </Button>
          </div>
        </div>

        {/* Subtle bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: "linear-gradient(to top, #fffaf6, transparent)" }} />
      </section>

      {/* ── WHY HAPPY FEET ───────────────────────────────────── */}
      <section className="py-20 w-full" style={{ background: "#fffaf6" }}>
        <div className="w-full max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#c0185a" }}>
              Why dancers love it here
            </p>
            <h2 className="font-serif font-bold leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#3a1f3a" }}>
              More than a dance class.
              <br />
              <span style={{ color: "#c0185a" }}>A community.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: "✦",
                title: "Taught by Anitha Prakash",
                body: "15+ years of performing and teaching — Anitha brings warmth, precision, and serious joy to every single class.",
              },
              {
                icon: "✦",
                title: "All levels, all ages",
                body: "Whether you've never danced or you're prepping for a live showcase — there's a class with your name on it.",
              },
              {
                icon: "✦",
                title: "Small batches. Real results.",
                body: "Capped enrollment means you actually learn. Not just shuffle around in the back of a crowded room.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl p-8 flex flex-col gap-3"
                style={{ background: "linear-gradient(135deg, rgba(192,24,90,0.05), rgba(58,31,58,0.04))", border: "1px solid rgba(192,24,90,0.1)" }}>
                <span className="text-xl" style={{ color: "#c98b2f" }}>{item.icon}</span>
                <h3 className="font-serif font-bold text-lg" style={{ color: "#3a1f3a" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6b5b6e" }}>{item.body}</p>
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
              Pick your program.
            </h2>
            <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: "#6b5b6e" }}>
              First time? Drop in. Ready to commit? Join a batch.
              Aiming for the stage? We've got a showcase team for that.
            </p>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={
                  activeCategory === cat
                    ? { background: "#3a1f3a", color: "#fff", boxShadow: "0 2px 12px rgba(58,31,58,0.3)" }
                    : { background: "#fff", color: "#6b5b6e", border: "1px solid rgba(58,31,58,0.15)" }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-10 w-10 animate-spin" style={{ color: "#c0185a" }} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {classes?.map((c) => (
                <ClassCard key={c.id} danceClass={c} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS STRIP ───────────────────────────────── */}
      <section className="py-16 w-full" style={{ background: "linear-gradient(135deg, #3a1f3a, #5c2f5c)" }}>
        <div className="w-full max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] mb-10" style={{ color: "rgba(249,221,234,0.7)" }}>
            From the Happy Feet family
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                quote: "I walked in nervous and left absolutely hooked. Anitha has a gift for making you feel like you belong.",
                name: "Priya S.",
                tag: "Bollywood batch",
              },
              {
                quote: "My daughter went from shy to stage-ready in one semester. The showcase was a full-on performance experience.",
                name: "Meena R.",
                tag: "Kids program parent",
              },
              {
                quote: "The BollyHop drop-in is my favorite Saturday morning. I've been coming for three years.",
                name: "Deepa K.",
                tag: "Drop-in regular",
              },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl p-7 flex flex-col gap-4"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p className="text-sm leading-relaxed italic" style={{ color: "rgba(255,255,255,0.85)" }}>
                  "{t.quote}"
                </p>
                <div>
                  <p className="font-semibold text-sm text-white">{t.name}</p>
                  <p className="text-xs" style={{ color: "#c98b2f" }}>{t.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEET THE INSTRUCTOR ──────────────────────────────── */}
      <section className="py-24 w-full" style={{ background: "#fffaf6" }}>
        <div className="w-full max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Photo placeholder with gradient */}
            <div className="relative order-2 md:order-1">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] w-full max-w-sm mx-auto"
                style={{ background: "linear-gradient(145deg, #3a1f3a 0%, #c0185a 60%, #c98b2f 100%)", boxShadow: "0 24px 64px rgba(192,24,90,0.25)" }}>
                <img
                  src="https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=600&q=80"
                  alt="Anitha Prakash — Founder & Lead Instructor"
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 md:right-4 rounded-2xl px-5 py-4 shadow-xl"
                style={{ background: "#c98b2f", color: "#fff" }}>
                <p className="text-xs font-bold uppercase tracking-wider">Founder & Director</p>
                <p className="text-sm font-semibold mt-0.5">15+ Years Teaching</p>
              </div>
            </div>

            {/* Text */}
            <div className="order-1 md:order-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "#c0185a" }}>
                Meet your instructor
              </p>
              <h2 className="font-serif font-bold mb-5 leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#3a1f3a" }}>
                Anitha Prakash
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: "#4a3550" }}>
                Anitha grew up performing classical Indian dance forms and fell in love with Bollywood in her teens. After training
                with master choreographers across Mumbai and New York, she founded Happy Feet to bring that same magic to NYC and NJ.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: "#4a3550" }}>
                Her teaching philosophy is simple: technique matters, but joy matters more. In her classes you'll learn to
                move with intention, express without apology, and leave every session feeling more alive than when you walked in.
              </p>
              <p className="text-base leading-relaxed mb-8 font-medium" style={{ color: "#3a1f3a" }}>
                She has choreographed for stage showcases, cultural festivals, and private events — and still teaches every class herself.
              </p>
              <Button
                size="lg"
                onClick={scrollToClasses}
                className="rounded-full font-bold px-8 h-12 transition-all hover:scale-105 hover:shadow-xl"
                style={{ background: "linear-gradient(135deg, #c0185a, #8a0f3f)", color: "#fff", border: "none" }}>
                Train with Anitha
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ────────────────────────────────── */}
      <section className="py-20 w-full" style={{ background: "linear-gradient(135deg, #c0185a 0%, #3a1f3a 100%)" }}>
        <div className="w-full max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif font-bold text-white mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Your spot is waiting.
          </h2>
          <p className="text-white/80 text-base mb-8 max-w-lg mx-auto">
            Spots fill up fast — especially the showcase team. Don't wait till the batch is full.
          </p>
          <Button size="lg" onClick={scrollToClasses}
            className="rounded-full font-bold text-base px-12 h-14 shadow-2xl transition-all hover:scale-105"
            style={{ background: "#fff", color: "#c0185a", border: "none" }}>
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
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>NYC & New Jersey · Dance boldly. Feel at home.</p>
            </div>
            <div className="flex gap-6 text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              <button onClick={scrollToClasses} className="hover:text-white transition-colors">Classes</button>
              <Link href="/portal" className="hover:text-white transition-colors">Portal</Link>
              <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
            </div>
          </div>
          <div className="mt-6 pt-6 text-center text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} Happy Feet Dance Academy. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ── FLOATING CTA ─────────────────────────────────────── */}
      <FloatingCTA onBook={scrollToClasses} />
    </div>
  );
}

function FloatingCTA({ onBook }: { onBook: () => void }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      style={{ filter: "drop-shadow(0 8px 24px rgba(192,24,90,0.45))" }}
    >
      <button
        onClick={onBook}
        className="flex items-center gap-2 rounded-full font-bold text-sm px-6 py-3.5 text-white transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(135deg, #c0185a, #8a0f3f)" }}
      >
        <CalendarDays className="w-4 h-4" />
        Book a Class
      </button>
    </div>
  );
}

function ClassCard({ danceClass }: { danceClass: any }) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const createEnrollment = useCreateEnrollment();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentType: danceClass.ageGroup?.toLowerCase().includes("kid") ? "kid" : "adult",
  });

  const handleEnroll = () => {
    createEnrollment.mutate(
      { data: { classId: danceClass.id, ...formData } },
      {
        onSuccess: () => {
          setStep(3);
          toast({ title: "You're registered!", description: "We'll be in touch with next steps." });
        },
      }
    );
  };

  const spotsLeft = danceClass.spotsAvailable;
  const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0;
  const isFull = spotsLeft === 0;

  return (
    <Card className="flex flex-col overflow-hidden border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{ background: "#fff", boxShadow: "0 2px 16px rgba(58,31,58,0.1)", borderRadius: "20px" }}>
      {/* Gradient accent bar */}
      <div className="h-1.5 w-full" style={{ background: danceClass.colorScheme || "linear-gradient(135deg, #c0185a, #3a1f3a)" }} />

      <CardHeader className="px-6 pt-6 pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge
            className="text-xs font-bold uppercase tracking-wider border-0 px-3 py-1"
            style={{ background: "rgba(192,24,90,0.1)", color: "#c0185a" }}>
            {danceClass.style}
          </Badge>
          {isAlmostFull && (
            <Badge className="text-xs font-bold border-0 px-3 py-1" style={{ background: "rgba(201,139,47,0.15)", color: "#c98b2f" }}>
              {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
            </Badge>
          )}
          {isFull && (
            <Badge className="text-xs font-bold border-0 px-3 py-1" style={{ background: "rgba(0,0,0,0.06)", color: "#999" }}>
              Full
            </Badge>
          )}
        </div>
        <h3 className="font-serif font-bold leading-snug" style={{ fontSize: "1.25rem", color: "#3a1f3a" }}>
          {danceClass.name}
        </h3>
        <p className="text-sm leading-relaxed mt-2" style={{ color: "#6b5b6e" }}>
          {danceClass.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1 px-6 pb-4">
        <div className="space-y-2.5">
          {[
            { icon: Clock, text: `${danceClass.scheduleDay}s at ${danceClass.scheduleTime} · ${danceClass.duration}` },
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
            <Button
              disabled={isFull}
              className="rounded-full font-bold text-sm px-6 h-10 border-0 transition-all hover:scale-105"
              style={{ background: isFull ? "#e5e5e5" : "linear-gradient(135deg, #c0185a, #8a0f3f)", color: isFull ? "#999" : "#fff" }}>
              {isFull ? "Full" : "Book Spot"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl" style={{ color: "#3a1f3a" }}>
                {step === 1 ? "Claim Your Spot" : step === 2 ? "Send Payment" : "You're In!"}
              </DialogTitle>
              <DialogDescription className="text-sm" style={{ color: "#6b5b6e" }}>
                {danceClass.name} · {danceClass.scheduleDay}s · {danceClass.location}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {step === 1 && (
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider">First Name</Label>
                      <Input id="firstName" className="rounded-xl" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider">Last Name</Label>
                      <Input id="lastName" className="rounded-xl" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider">Email</Label>
                    <Input id="email" type="email" className="rounded-xl" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider">Phone</Label>
                    <Input id="phone" type="tel" className="rounded-xl" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="text-center space-y-5">
                  <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(192,24,90,0.06), rgba(58,31,58,0.04))", border: "1px solid rgba(192,24,90,0.12)" }}>
                    <p className="text-3xl font-serif font-bold mb-1" style={{ color: "#3a1f3a" }}>${danceClass.price}</p>
                    <p className="text-sm mb-4" style={{ color: "#6b5b6e" }}>due now via Venmo to secure your spot</p>
                    <div className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono font-bold text-lg"
                      style={{ background: "rgba(58,31,58,0.08)", color: "#3a1f3a" }}>
                      @HappyFeet-Dance
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: "#9b8fa0" }}>
                    After payment, tap Complete Registration below. We'll confirm your spot within 24 hours.
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="text-center space-y-4 py-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "linear-gradient(135deg, rgba(192,24,90,0.15), rgba(201,139,47,0.15))" }}>
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#c0185a">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-serif font-bold" style={{ color: "#3a1f3a" }}>See you on the floor!</h3>
                  <p className="text-sm" style={{ color: "#6b5b6e" }}>
                    We'll send class details and a confirmation to your email. Can't wait to dance with you.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              {step === 1 && (
                <Button
                  onClick={() => setStep(2)}
                  className="w-full rounded-full font-bold h-12"
                  disabled={!formData.firstName || !formData.lastName || !formData.email}
                  style={{ background: "linear-gradient(135deg, #c0185a, #8a0f3f)", color: "#fff", border: "none" }}>
                  Continue to Payment
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
              {step === 2 && (
                <div className="flex gap-2 w-full">
                  <Button variant="outline" onClick={() => setStep(1)} className="w-full rounded-full">Back</Button>
                  <Button
                    onClick={handleEnroll}
                    disabled={createEnrollment.isPending}
                    className="w-full rounded-full font-bold"
                    style={{ background: "linear-gradient(135deg, #c0185a, #8a0f3f)", color: "#fff", border: "none" }}>
                    {createEnrollment.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Complete Registration
                  </Button>
                </div>
              )}
              {step === 3 && (
                <Button onClick={() => setIsOpen(false)} className="w-full rounded-full font-bold"
                  style={{ background: "linear-gradient(135deg, #c0185a, #8a0f3f)", color: "#fff", border: "none" }}>
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
