import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarCheck2,
  Check,
  Circle,
  ExternalLink,
  Globe2,
  GraduationCap,
  Link2,
  Palette,
  Plus,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultBuilderState,
  loadBuilderState,
  saveBuilderState,
  slugify,
  styleOptions,
  themeOptions,
  type BuilderState,
  type BuilderStep,
  type Instructor,
  type Review,
  type Workshop,
} from "@/lib/beyond8-builder";

type UpdateFn = <Key extends keyof BuilderState>(key: Key, value: BuilderState[Key]) => void;

const steps: { id: BuilderStep; title: string; detail: string; icon: typeof Globe2 }[] = [
  { id: "brand", title: "Business profile", detail: "Identity, positioning, visual tone", icon: Palette },
  { id: "classes", title: "Bookable classes", detail: "Offers, pricing, capacity, details", icon: CalendarCheck2 },
  { id: "instructors", title: "Instructor team", detail: "Credibility and human trust", icon: Users },
  { id: "reviews", title: "Reviews", detail: "Proof before a student books", icon: Star },
  { id: "publish", title: "Publish", detail: "Review the generated page", icon: Globe2 },
];

export default function Portal() {
  const [active, setActive] = useState<BuilderStep>("brand");
  const [state, setState] = useState<BuilderState>(() => loadBuilderState());

  useEffect(() => {
    saveBuilderState(state);
  }, [state]);

  const activeIndex = steps.findIndex((step) => step.id === active);
  const completion = useMemo(() => {
    const checks = [
      state.studioName,
      state.name,
      state.email,
      state.location,
      state.styles.length,
      state.workshops.length,
      state.instructors.length,
      state.reviews.length,
      state.paymentHandle,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [state]);

  const update: UpdateFn = (key, value) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#f6f2ed] text-[#171417]">
      <section className="px-4 py-5 md:px-6 lg:py-7">
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-col gap-4 border-b border-[#ded7cf] pb-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img src="/brand/beyond8-icon-gradient.webp" alt="" className="h-10 w-10 rounded-xl object-cover" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8f1d4e]">Beyond8 StudioOS</p>
                <h1 className="font-serif text-2xl font-bold text-[#171417]">Launch workspace</h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="h-10 rounded-full border-[#d7cfc7] bg-white px-5" onClick={() => setState(defaultBuilderState)}>
                Reset
              </Button>
              <Button asChild className="h-10 rounded-full bg-[#171417] px-5 text-white hover:bg-[#2b272b]">
                <a href={`/beyondeight/${state.slug}`} target="_blank" rel="noreferrer">
                  View public page <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </header>

          <div className="grid gap-6 pt-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="space-y-4">
              <div className="rounded-2xl border border-[#ded7cf] bg-white p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8f1d4e]">Readiness</p>
                    <p className="mt-2 font-serif text-4xl font-bold">{completion}%</p>
                  </div>
                  <Badge className="rounded-full bg-[#e9f4ef] text-[#276a58]">Autosaved</Badge>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eee7df]">
                  <div className="h-full rounded-full bg-[#8f1d4e]" style={{ width: `${completion}%` }} />
                </div>
                <p className="mt-4 text-sm leading-6 text-[#6b646d]">
                  Build the business once, then publish a page students can actually book from.
                </p>
              </div>

              <nav className="rounded-2xl border border-[#ded7cf] bg-white p-2">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = step.id === active;
                  const isDone = index < activeIndex;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActive(step.id)}
                      className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${
                        isActive ? "bg-[#171417] text-white" : "text-[#514c54] hover:bg-[#f6f2ed]"
                      }`}
                    >
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isActive ? "bg-white/12" : "bg-[#f1ebe4]"}`}>
                        {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{step.title}</p>
                        <p className={`mt-0.5 text-xs leading-5 ${isActive ? "text-white/58" : "text-[#7d747f]"}`}>{step.detail}</p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </aside>

            <main className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
              <section className="min-w-0 rounded-2xl border border-[#ded7cf] bg-white p-5 md:p-7">
                {active === "brand" && <BrandStep state={state} update={update} goNext={() => setActive("classes")} />}
                {active === "classes" && <ClassesStep state={state} update={update} goNext={() => setActive("instructors")} />}
                {active === "instructors" && <InstructorsStep state={state} update={update} goNext={() => setActive("reviews")} />}
                {active === "reviews" && <ReviewsStep state={state} update={update} goNext={() => setActive("publish")} />}
                {active === "publish" && <PublishStep state={state} />}
              </section>
              <section className="xl:sticky xl:top-6 xl:h-fit">
                <PreviewPanel state={state} />
              </section>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

function BrandStep({ state, update, goNext }: { state: BuilderState; update: UpdateFn; goNext: () => void }) {
  const toggleStyle = (style: string) => {
    update("styles", state.styles.includes(style) ? state.styles.filter((item) => item !== style) : [...state.styles, style]);
  };

  const updateStudioName = (value: string) => {
    update("studioName", value);
    update("slug", slugify(value));
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Step 01"
        title="Shape the profile students will trust."
        body="This information becomes the public page, the booking experience, and the first impression of the business."
      />

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <Field label="Studio or brand name"><Input value={state.studioName} onChange={(event) => updateStudioName(event.target.value)} /></Field>
        <Field label="Public URL"><Input value={state.slug} onChange={(event) => update("slug", slugify(event.target.value))} /></Field>
        <Field label="Choreographer name"><Input value={state.name} onChange={(event) => update("name", event.target.value)} /></Field>
        <Field label="Work email"><Input type="email" value={state.email} onChange={(event) => update("email", event.target.value)} /></Field>
        <Field label="City or region"><Input value={state.location} onChange={(event) => update("location", event.target.value)} /></Field>
        <Field label="Studio locations"><Input value={state.studioLocations} onChange={(event) => update("studioLocations", event.target.value)} /></Field>
      </div>

      <div className="mt-5 grid gap-5">
        <Field label="Hero headline"><Textarea value={state.headline} onChange={(event) => update("headline", event.target.value)} className="min-h-24" /></Field>
        <Field label="About herself"><Textarea value={state.bio} onChange={(event) => update("bio", event.target.value)} className="min-h-28" /></Field>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="mb-3 text-sm font-bold text-[#171417]">Dance styles</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {styleOptions.map((style) => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  state.styles.includes(style) ? "border-[#171417] bg-[#171417] text-white" : "border-[#ded7cf] bg-[#fbf8f4] text-[#514c54] hover:border-[#8f1d4e]"
                }`}
              >
                {state.styles.includes(style) ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                {style}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold text-[#171417]">Visual tone</p>
          <div className="grid gap-2">
            {themeOptions.map((theme) => (
              <button
                key={theme}
                onClick={() => update("theme", theme)}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  state.theme === theme ? "border-[#8f1d4e] bg-[#fff7f9] text-[#171417]" : "border-[#ded7cf] bg-[#fbf8f4] text-[#514c54]"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field label="Logo URL"><Input value={state.logoUrl} onChange={(event) => update("logoUrl", event.target.value)} /></Field>
        <Field label="Hero photo URL"><Input value={state.photoUrl} onChange={(event) => update("photoUrl", event.target.value)} /></Field>
      </div>

      <FooterAction onNext={goNext} nextLabel="Continue to classes" />
    </div>
  );
}

function ClassesStep({ state, update, goNext }: { state: BuilderState; update: UpdateFn; goNext: () => void }) {
  const updateWorkshop = (id: number, key: keyof Workshop, value: string) => {
    update("workshops", state.workshops.map((item) => item.id === id ? { ...item, [key]: value } : item));
  };

  const addWorkshop = () => {
    update("workshops", [
      ...state.workshops,
      { id: Date.now(), title: "New class", date: "Sat 12:00 PM", location: state.location, price: "$40", capacity: "20", description: "A focused, easy-to-book class for students." },
    ]);
  };

  const importSample = () => {
    update("workshops", [
      ...state.workshops,
      { id: Date.now(), title: "Garba Pop-up", date: "Fri 6:30 PM", location: "Brooklyn studio", price: "$35", capacity: "30", description: "Imported from an existing workshop page and ready to publish." },
    ]);
  };

  return (
    <div>
      <SectionHeader eyebrow="Step 02" title="Make every class easy to understand and book." body="Clear class cards reduce DMs, repeated questions, and payment confusion." />
      <div className="mt-7 grid gap-3 rounded-xl border border-[#ded7cf] bg-[#fbf8f4] p-4 md:grid-cols-[1fr_auto] md:items-end">
        <Field label="Import from existing workshop page"><Input value={state.importUrl} onChange={(event) => update("importUrl", event.target.value)} /></Field>
        <Button onClick={importSample} variant="outline" className="rounded-full bg-white"><Link2 className="mr-2 h-4 w-4" /> Import sample</Button>
      </div>
      <div className="mt-5 flex justify-end">
        <Button onClick={addWorkshop} className="rounded-full bg-[#171417] px-5 text-white hover:bg-[#2b272b]"><Plus className="mr-2 h-4 w-4" /> Add class</Button>
      </div>
      <div className="mt-5 space-y-4">
        {state.workshops.map((workshop, index) => (
          <div key={workshop.id} className="rounded-xl border border-[#ded7cf] bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-[#171417]">Class {index + 1}</p>
              <Badge variant="outline" className="rounded-full">{workshop.price}</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              <Input value={workshop.title} onChange={(event) => updateWorkshop(workshop.id, "title", event.target.value)} />
              <Input value={workshop.date} onChange={(event) => updateWorkshop(workshop.id, "date", event.target.value)} />
              <Input value={workshop.location} onChange={(event) => updateWorkshop(workshop.id, "location", event.target.value)} />
              <Input value={workshop.price} onChange={(event) => updateWorkshop(workshop.id, "price", event.target.value)} />
              <Input value={workshop.capacity} onChange={(event) => updateWorkshop(workshop.id, "capacity", event.target.value)} />
            </div>
            <Textarea value={workshop.description} onChange={(event) => updateWorkshop(workshop.id, "description", event.target.value)} className="mt-3 min-h-20" />
          </div>
        ))}
      </div>
      <FooterAction onNext={goNext} nextLabel="Continue to instructors" />
    </div>
  );
}

function InstructorsStep({ state, update, goNext }: { state: BuilderState; update: UpdateFn; goNext: () => void }) {
  const updateInstructor = (id: number, key: keyof Instructor, value: string) => {
    update("instructors", state.instructors.map((item) => item.id === id ? { ...item, [key]: value } : item));
  };
  const addInstructor = () => update("instructors", [...state.instructors, { id: Date.now(), name: "New instructor", role: "Instructor", bio: "A clear, supportive coach students can trust.", imageUrl: state.photoUrl }]);

  return (
    <div>
      <SectionHeader eyebrow="Step 03" title="Show the people behind the classes." body="A strong instructor section makes the page feel established, safe, and worth booking." />
      <div className="mt-6 flex justify-end">
        <Button onClick={addInstructor} className="rounded-full bg-[#171417] px-5 text-white hover:bg-[#2b272b]"><Plus className="mr-2 h-4 w-4" /> Add instructor</Button>
      </div>
      <div className="mt-5 grid gap-4">
        {state.instructors.map((instructor) => (
          <div key={instructor.id} className="grid gap-4 rounded-xl border border-[#ded7cf] bg-white p-4 md:grid-cols-[112px_1fr]">
            <img src={instructor.imageUrl} alt="" className="h-28 w-full rounded-xl object-cover md:h-full" />
            <div className="grid gap-3">
              <div className="grid gap-3 md:grid-cols-2">
                <Input value={instructor.name} onChange={(event) => updateInstructor(instructor.id, "name", event.target.value)} />
                <Input value={instructor.role} onChange={(event) => updateInstructor(instructor.id, "role", event.target.value)} />
              </div>
              <Textarea value={instructor.bio} onChange={(event) => updateInstructor(instructor.id, "bio", event.target.value)} className="min-h-20" />
              <Input value={instructor.imageUrl} onChange={(event) => updateInstructor(instructor.id, "imageUrl", event.target.value)} />
            </div>
          </div>
        ))}
      </div>
      <FooterAction onNext={goNext} nextLabel="Continue to reviews" />
    </div>
  );
}

function ReviewsStep({ state, update, goNext }: { state: BuilderState; update: UpdateFn; goNext: () => void }) {
  const updateReview = (id: number, key: keyof Review, value: string) => {
    update("reviews", state.reviews.map((item) => item.id === id ? { ...item, [key]: value } : item));
  };
  const addReview = () => update("reviews", [...state.reviews, { id: Date.now(), quote: "A polished, joyful class experience.", author: "Student name" }]);

  return (
    <div>
      <SectionHeader eyebrow="Step 04" title="Add proof that makes booking feel safe." body="Reviews create confidence before students send their information or payment." />
      <div className="mt-6 flex justify-end">
        <Button onClick={addReview} className="rounded-full bg-[#171417] px-5 text-white hover:bg-[#2b272b]"><Plus className="mr-2 h-4 w-4" /> Add review</Button>
      </div>
      <div className="mt-5 grid gap-4">
        {state.reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-[#ded7cf] bg-white p-4">
            <Textarea value={review.quote} onChange={(event) => updateReview(review.id, "quote", event.target.value)} className="min-h-20" />
            <Input value={review.author} onChange={(event) => updateReview(review.id, "author", event.target.value)} className="mt-3" />
          </div>
        ))}
      </div>
      <FooterAction onNext={goNext} nextLabel="Review and publish" />
    </div>
  );
}

function PublishStep({ state }: { state: BuilderState }) {
  return (
    <div>
      <SectionHeader eyebrow="Step 05" title="The page is ready for students." body="This is the output Beyond8 creates for the choreographer: about, classes, instructors, reviews, and payment guidance." />
      <div className="mt-7 rounded-2xl border border-[#ded7cf] bg-[#171417] p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Generated URL</p>
        <p className="mt-3 break-all font-serif text-4xl font-bold">beyondeight/{state.slug}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {["About", "Classes", "Instructors", "Reviews"].map((item) => (
            <Badge key={item} className="rounded-full bg-white/10 text-white">{item}</Badge>
          ))}
        </div>
        <Button asChild className="mt-6 rounded-full bg-white px-7 text-[#171417] hover:bg-white/90">
          <a href={`/beyondeight/${state.slug}`} target="_blank" rel="noreferrer">Open public page <ArrowRight className="ml-2 h-4 w-4" /></a>
        </Button>
      </div>
    </div>
  );
}

function PreviewPanel({ state }: { state: BuilderState }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#ded7cf] bg-white">
      <div className="relative h-64">
        <img src={state.photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,20,23,.15),rgba(23,20,23,.78))]" />
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <div className="mb-4 flex items-center gap-3">
            <img src={state.logoUrl} alt="" className="h-10 w-10 rounded-xl object-cover" />
            <div>
              <p className="font-serif text-xl font-bold">{state.studioName}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-white/60">{state.location}</p>
            </div>
          </div>
          <p className="font-serif text-3xl font-bold leading-tight">{state.headline}</p>
        </div>
      </div>
      <div className="space-y-5 p-5">
        <PreviewBlock title="Classes" icon={CalendarCheck2}>
          {state.workshops.slice(0, 2).map((workshop) => (
            <div key={workshop.id} className="rounded-xl bg-[#f6f2ed] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{workshop.title}</p>
                  <p className="mt-1 text-xs text-[#6b646d]">{workshop.date} - {workshop.location}</p>
                </div>
                <Badge className="rounded-full bg-[#171417] text-white">{workshop.price}</Badge>
              </div>
            </div>
          ))}
        </PreviewBlock>
        <PreviewBlock title="Instructors" icon={GraduationCap}>
          <div className="grid gap-3">
            {state.instructors.slice(0, 2).map((instructor) => (
              <div key={instructor.id} className="flex items-center gap-3 rounded-xl bg-[#f6f2ed] p-3">
                <img src={instructor.imageUrl} alt="" className="h-11 w-11 rounded-xl object-cover" />
                <div>
                  <p className="text-sm font-semibold">{instructor.name}</p>
                  <p className="text-xs text-[#6b646d]">{instructor.role}</p>
                </div>
              </div>
            ))}
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f1d4e]">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#171417]">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#6b646d]">{body}</p>
    </div>
  );
}

function FooterAction({ onNext, nextLabel }: { onNext: () => void; nextLabel: string }) {
  return (
    <div className="mt-7 flex justify-end border-t border-[#ded7cf] pt-5">
      <Button onClick={onNext} className="rounded-full bg-[#171417] px-6 text-white hover:bg-[#2b272b]">
        {nextLabel} <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-[#171417]">{label}</Label>
      {children}
    </div>
  );
}

function PreviewBlock({ title, icon: Icon, children }: { title: string; icon: typeof Globe2; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#8f1d4e]" />
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#514c54]">{title}</p>
      </div>
      {children}
    </section>
  );
}
