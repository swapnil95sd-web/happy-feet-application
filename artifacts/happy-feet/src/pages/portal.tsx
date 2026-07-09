import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Globe2,
  GraduationCap,
  Heart,
  Link2,
  Palette,
  Plus,
  Sparkles,
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

const steps: { id: BuilderStep; title: string; kicker: string; icon: typeof Sparkles }[] = [
  { id: "brand", title: "Brand story", kicker: "Questionnaire", icon: Sparkles },
  { id: "classes", title: "Classes", kicker: "Bookable offers", icon: CalendarCheck2 },
  { id: "instructors", title: "Instructors", kicker: "Team profile", icon: Users },
  { id: "reviews", title: "Reviews", kicker: "Trust builders", icon: Star },
  { id: "publish", title: "Publish", kicker: "Live page", icon: Globe2 },
];

export default function Portal() {
  const [active, setActive] = useState<BuilderStep>("brand");
  const [state, setState] = useState<BuilderState>(() => loadBuilderState());

  useEffect(() => {
    saveBuilderState(state);
  }, [state]);

  const launchScore = useMemo(() => {
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
    <div className="min-h-screen bg-[#f7efe7] text-[#18131d]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(194,24,91,0.16),transparent_34%),radial-gradient(circle_at_82%_12%,rgba(255,178,107,0.22),transparent_32%),linear-gradient(180deg,#fff8ef,#f7efe7)]" />
      <section className="px-4 py-6 md:px-6 lg:py-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img src="/brand/beyond8-icon-gradient.webp" alt="" className="h-12 w-12 rounded-2xl object-cover shadow-sm" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c2185b]">Beyond8 StudioOS</p>
                <h1 className="font-serif text-2xl font-bold text-[#28123d]">Launch a choreographer business page</h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-full bg-white" onClick={() => setState(defaultBuilderState)}>Reset demo</Button>
              <Button asChild className="rounded-full bg-[#18131d] px-6 text-white hover:bg-[#2b2132]">
                <a href={`/beyondeight/${state.slug}`} target="_blank" rel="noreferrer">
                  Open public page <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-4">
              <div className="overflow-hidden rounded-[32px] bg-[#18131d] p-5 text-white shadow-2xl">
                <Badge className="bg-white/12 text-white">Business-ready flow</Badge>
                <p className="mt-5 font-serif text-4xl font-bold leading-tight">{launchScore}% ready</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/12">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#c2185b,#ff6b3d,#ffb26b)]" style={{ width: `${launchScore}%` }} />
                </div>
                <p className="mt-4 text-sm leading-6 text-white/68">
                  Answer once. Beyond8 creates the profile page, class booking cards, instructor bios, reviews, and payment-ready operations.
                </p>
              </div>

              <nav className="rounded-[28px] border border-white/70 bg-white/86 p-2 shadow-sm backdrop-blur">
                {steps.map(({ id, title, kicker, icon: Icon }, index) => (
                  <button
                    key={id}
                    onClick={() => setActive(id)}
                    className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                      active === id ? "bg-[#18131d] text-white shadow-lg" : "text-[#665d6d] hover:bg-[#fff4eb] hover:text-[#18131d]"
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${active === id ? "bg-white/14" : "bg-[#fbf1e8]"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] opacity-60">0{index + 1} {kicker}</p>
                      <p className="font-serif text-lg font-bold">{title}</p>
                    </div>
                  </button>
                ))}
              </nav>
            </aside>

            <main className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.78fr)]">
              <section className="min-w-0 rounded-[34px] border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur md:p-7">
                {active === "brand" && <BrandStep state={state} update={update} goNext={() => setActive("classes")} />}
                {active === "classes" && <ClassesStep state={state} update={update} goNext={() => setActive("instructors")} />}
                {active === "instructors" && <InstructorsStep state={state} update={update} goNext={() => setActive("reviews")} />}
                {active === "reviews" && <ReviewsStep state={state} update={update} goNext={() => setActive("publish")} />}
                {active === "publish" && <PublishStep state={state} />}
              </section>
              <section className="min-w-0 xl:sticky xl:top-6 xl:h-fit">
                <LivePreview state={state} />
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
      <StepTitle label="Questionnaire" title="Start with the choreographer story." body="This becomes the public profile, brand system, about section, and booking page foundation." />
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <Field label="Studio or brand name"><Input value={state.studioName} onChange={(event) => updateStudioName(event.target.value)} /></Field>
        <Field label="Public URL slug"><Input value={state.slug} onChange={(event) => update("slug", slugify(event.target.value))} /></Field>
        <Field label="Choreographer name"><Input value={state.name} onChange={(event) => update("name", event.target.value)} /></Field>
        <Field label="Work email"><Input type="email" value={state.email} onChange={(event) => update("email", event.target.value)} /></Field>
        <Field label="Location"><Input value={state.location} onChange={(event) => update("location", event.target.value)} /></Field>
        <Field label="Studio locations"><Input value={state.studioLocations} onChange={(event) => update("studioLocations", event.target.value)} /></Field>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_0.78fr]">
        <Field label="Hero headline"><Textarea value={state.headline} onChange={(event) => update("headline", event.target.value)} className="min-h-28" /></Field>
        <Field label="About herself"><Textarea value={state.bio} onChange={(event) => update("bio", event.target.value)} className="min-h-28" /></Field>
      </div>
      <div className="mt-5">
        <p className="mb-3 text-sm font-bold text-[#28123d]">Dance styles</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {styleOptions.map((style) => (
            <button
              key={style}
              onClick={() => toggleStyle(style)}
              className={`rounded-2xl border p-4 text-left text-sm font-bold transition ${
                state.styles.includes(style) ? "border-[#18131d] bg-[#18131d] text-white" : "border-[#eaded5] bg-[#fbf7f1] text-[#665d6d] hover:border-[#c2185b]"
              }`}
            >
              <Heart className="mb-3 h-4 w-4" />
              {style}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field label="Logo URL"><Input value={state.logoUrl} onChange={(event) => update("logoUrl", event.target.value)} /></Field>
        <Field label="Hero photo URL"><Input value={state.photoUrl} onChange={(event) => update("photoUrl", event.target.value)} /></Field>
      </div>
      <div className="mt-6 rounded-[26px] bg-[#fbf2ea] p-5">
        <p className="mb-3 text-sm font-bold text-[#28123d]">Visual direction</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {themeOptions.map((theme) => (
            <button
              key={theme}
              onClick={() => update("theme", theme)}
              className={`rounded-2xl border p-4 text-left text-sm font-bold transition ${
                state.theme === theme ? "border-[#c2185b] bg-white text-[#18131d] shadow-sm" : "border-transparent bg-white/60 text-[#665d6d]"
              }`}
            >
              <Palette className="mb-3 h-4 w-4 text-[#c2185b]" />
              {theme}
            </button>
          ))}
        </div>
      </div>
      <StepFooter onNext={goNext} nextLabel="Build classes" />
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
      { id: Date.now(), title: "New dance workshop", date: "Sat 12:00 PM", location: state.location, price: "$40", capacity: "20", description: "A clear, bookable offer for students." },
    ]);
  };

  const importSample = () => {
    update("workshops", [
      ...state.workshops,
      { id: Date.now(), title: "Imported Garba Pop-up", date: "Fri 6:30 PM", location: "Brooklyn studio", price: "$35", capacity: "30", description: "Imported from an existing workshop page and ready to polish." },
    ]);
  };

  return (
    <div>
      <StepTitle label="Classes" title="Turn workshops into polished booking cards." body="Every class needs a title, schedule, location, price, capacity, and details students can understand before registering." />
      <div className="mt-7 grid gap-4 rounded-[26px] bg-[#18131d] p-5 text-white md:grid-cols-[1fr_auto] md:items-end">
        <Field dark label="Import existing workshop page"><Input value={state.importUrl} onChange={(event) => update("importUrl", event.target.value)} className="bg-white text-[#18131d]" /></Field>
        <Button onClick={importSample} className="rounded-full bg-white text-[#18131d] hover:bg-white/90"><Link2 className="mr-2 h-4 w-4" /> Import sample</Button>
      </div>
      <div className="mt-5 flex justify-end">
        <Button onClick={addWorkshop} className="rounded-full bg-[#c2185b] px-6 text-white hover:bg-[#a9154e]"><Plus className="mr-2 h-4 w-4" /> Add class</Button>
      </div>
      <div className="mt-5 space-y-4">
        {state.workshops.map((workshop) => (
          <div key={workshop.id} className="rounded-[26px] border border-[#eaded5] bg-[#fffaf5] p-4">
            <div className="grid gap-3 md:grid-cols-5">
              <Input value={workshop.title} onChange={(event) => updateWorkshop(workshop.id, "title", event.target.value)} />
              <Input value={workshop.date} onChange={(event) => updateWorkshop(workshop.id, "date", event.target.value)} />
              <Input value={workshop.location} onChange={(event) => updateWorkshop(workshop.id, "location", event.target.value)} />
              <Input value={workshop.price} onChange={(event) => updateWorkshop(workshop.id, "price", event.target.value)} />
              <Input value={workshop.capacity} onChange={(event) => updateWorkshop(workshop.id, "capacity", event.target.value)} />
            </div>
            <Textarea value={workshop.description} onChange={(event) => updateWorkshop(workshop.id, "description", event.target.value)} className="mt-3 min-h-20 bg-white" />
          </div>
        ))}
      </div>
      <StepFooter onNext={goNext} nextLabel="Add instructors" />
    </div>
  );
}

function InstructorsStep({ state, update, goNext }: { state: BuilderState; update: UpdateFn; goNext: () => void }) {
  const updateInstructor = (id: number, key: keyof Instructor, value: string) => {
    update("instructors", state.instructors.map((item) => item.id === id ? { ...item, [key]: value } : item));
  };
  const addInstructor = () => {
    update("instructors", [...state.instructors, { id: Date.now(), name: "New instructor", role: "Instructor", bio: "A warm coach helping students feel confident and prepared.", imageUrl: state.photoUrl }]);
  };

  return (
    <div>
      <StepTitle label="Instructors" title="Make the team feel trustworthy." body="Parents and students want to know who is teaching. Add bios that feel warm, credible, and human." />
      <div className="mt-6 flex justify-end">
        <Button onClick={addInstructor} className="rounded-full bg-[#18131d] px-6 text-white"><Plus className="mr-2 h-4 w-4" /> Add instructor</Button>
      </div>
      <div className="mt-5 grid gap-4">
        {state.instructors.map((instructor) => (
          <div key={instructor.id} className="grid gap-4 rounded-[26px] border border-[#eaded5] bg-[#fffaf5] p-4 md:grid-cols-[120px_1fr]">
            <img src={instructor.imageUrl} alt="" className="h-28 w-full rounded-2xl object-cover md:h-full" />
            <div className="grid gap-3">
              <div className="grid gap-3 md:grid-cols-2">
                <Input value={instructor.name} onChange={(event) => updateInstructor(instructor.id, "name", event.target.value)} />
                <Input value={instructor.role} onChange={(event) => updateInstructor(instructor.id, "role", event.target.value)} />
              </div>
              <Textarea value={instructor.bio} onChange={(event) => updateInstructor(instructor.id, "bio", event.target.value)} className="min-h-20 bg-white" />
              <Input value={instructor.imageUrl} onChange={(event) => updateInstructor(instructor.id, "imageUrl", event.target.value)} />
            </div>
          </div>
        ))}
      </div>
      <StepFooter onNext={goNext} nextLabel="Add reviews" />
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
      <StepTitle label="Reviews" title="Add social proof before students book." body="Reviews make the page feel established and trustworthy even while the business is just getting organized." />
      <div className="mt-6 flex justify-end">
        <Button onClick={addReview} className="rounded-full bg-[#c2185b] px-6 text-white hover:bg-[#a9154e]"><Plus className="mr-2 h-4 w-4" /> Add review</Button>
      </div>
      <div className="mt-5 grid gap-4">
        {state.reviews.map((review) => (
          <div key={review.id} className="rounded-[26px] border border-[#eaded5] bg-[#fffaf5] p-4">
            <Textarea value={review.quote} onChange={(event) => updateReview(review.id, "quote", event.target.value)} className="min-h-20 bg-white" />
            <Input value={review.author} onChange={(event) => updateReview(review.id, "author", event.target.value)} className="mt-3" />
          </div>
        ))}
      </div>
      <StepFooter onNext={goNext} nextLabel="Publish page" />
    </div>
  );
}

function PublishStep({ state }: { state: BuilderState }) {
  return (
    <div>
      <StepTitle label="Publish" title="Her page is ready to share." body="This is the business-ready output: a public profile, class booking page, instructor section, and reviews." />
      <div className="mt-7 rounded-[32px] bg-[#18131d] p-6 text-white">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/50">Generated page</p>
            <h3 className="mt-2 font-serif text-4xl font-bold">beyondeight/{state.slug}</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/68">Includes About herself, bookable classes, all instructors, reviews, locations, and payment guidance.</p>
          </div>
          <Button asChild className="rounded-full bg-white px-8 text-[#18131d] hover:bg-white/90">
            <a href={`/beyondeight/${state.slug}`} target="_blank" rel="noreferrer">View page <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        {[
          ["About", "Founder story and brand promise"],
          ["Classes", `${state.workshops.length} booking cards`],
          ["Instructors", `${state.instructors.length} team profiles`],
          ["Reviews", `${state.reviews.length} trust signals`],
        ].map(([title, body]) => (
          <div key={title} className="rounded-[24px] border border-[#eaded5] bg-[#fffaf5] p-5">
            <CheckCircle2 className="h-5 w-5 text-[#2f7b6f]" />
            <p className="mt-5 font-serif text-2xl font-bold">{title}</p>
            <p className="mt-1 text-sm leading-6 text-[#665d6d]">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LivePreview({ state }: { state: BuilderState }) {
  return (
    <div className="overflow-hidden rounded-[34px] border border-white/70 bg-white shadow-2xl">
      <div className="relative min-h-[360px] overflow-hidden">
        <img src={state.photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(140deg, ${state.accentColor}f0, ${state.primaryColor}aa 60%, rgba(0,0,0,.15))` }} />
        <div className="relative z-10 flex min-h-[360px] flex-col justify-between p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={state.logoUrl} alt="" className="h-12 w-12 rounded-2xl object-cover shadow-lg" />
              <div>
                <p className="font-serif text-xl font-bold">{state.studioName}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">{state.location}</p>
              </div>
            </div>
            <Badge className="bg-white/18 text-white">{state.theme}</Badge>
          </div>
          <div>
            <h2 className="font-serif text-4xl font-bold leading-tight">{state.headline}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/76">{state.bio}</p>
          </div>
        </div>
      </div>
      <div className="space-y-5 p-5">
        <PreviewSection title="Classes" icon={CalendarCheck2}>
          {state.workshops.slice(0, 3).map((workshop) => (
            <div key={workshop.id} className="rounded-2xl bg-[#fbf7f1] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-xl font-bold">{workshop.title}</p>
                  <p className="mt-1 text-xs text-[#665d6d]">{workshop.date} - {workshop.location}</p>
                </div>
                <Badge style={{ background: state.primaryColor }} className="text-white">{workshop.price}</Badge>
              </div>
            </div>
          ))}
        </PreviewSection>
        <PreviewSection title="Instructors" icon={GraduationCap}>
          <div className="grid gap-3 sm:grid-cols-2">
            {state.instructors.slice(0, 2).map((instructor) => (
              <div key={instructor.id} className="flex items-center gap-3 rounded-2xl bg-[#fbf7f1] p-3">
                <img src={instructor.imageUrl} alt="" className="h-12 w-12 rounded-2xl object-cover" />
                <div>
                  <p className="text-sm font-bold">{instructor.name}</p>
                  <p className="text-xs text-[#665d6d]">{instructor.role}</p>
                </div>
              </div>
            ))}
          </div>
        </PreviewSection>
      </div>
    </div>
  );
}

function StepTitle({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#c2185b]">{label}</p>
      <h2 className="mt-2 max-w-3xl font-serif text-4xl font-bold leading-tight text-[#28123d] md:text-5xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#665d6d]">{body}</p>
    </div>
  );
}

function StepFooter({ onNext, nextLabel }: { onNext: () => void; nextLabel: string }) {
  return (
    <div className="mt-7 flex justify-end border-t border-[#eaded5] pt-5">
      <Button onClick={onNext} className="rounded-full bg-[#18131d] px-7 text-white hover:bg-[#2b2132]">
        {nextLabel} <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

function Field({ label, children, dark = false }: { label: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className={dark ? "text-white/70" : "text-[#28123d]"}>{label}</Label>
      {children}
    </div>
  );
}

function PreviewSection({ title, icon: Icon, children }: { title: string; icon: typeof Sparkles; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#c2185b]" />
        <p className="font-serif text-xl font-bold">{title}</p>
      </div>
      {children}
    </section>
  );
}
