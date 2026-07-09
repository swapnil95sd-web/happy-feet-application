import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Globe2,
  ImagePlus,
  LayoutDashboard,
  Link2,
  Mail,
  MessageSquareText,
  Palette,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type TabId = "questionnaire" | "website" | "workshops" | "roster" | "payments" | "community";

type Workshop = {
  id: number;
  title: string;
  date: string;
  location: string;
  price: string;
  capacity: string;
};

type Student = {
  id: number;
  name: string;
  workshop: string;
  status: "Paid" | "Pending" | "Follow up";
};

type BuilderState = {
  theme: string;
  primaryColor: string;
  accentColor: string;
  name: string;
  email: string;
  location: string;
  studioName: string;
  headline: string;
  bio: string;
  styles: string[];
  studioLocations: string;
  team: string;
  services: string;
  logoUrl: string;
  photoUrl: string;
  importUrl: string;
  paymentMethod: string;
  paymentHandle: string;
  workshops: Workshop[];
  students: Student[];
};

const storageKey = "beyond8-phase-one-builder";

const styleOptions = ["Bollywood", "Semi-classical", "Hip-hop", "Kids", "Wedding", "Fitness"];
const themeOptions = ["Vibrant studio", "Elegant classical", "Bold performance", "Warm community"];

const defaultState: BuilderState = {
  theme: "Vibrant studio",
  primaryColor: "#c2185b",
  accentColor: "#28123d",
  name: "Tanvi Shah",
  email: "tanvi@example.com",
  location: "New York, NY",
  studioName: "Tanvi Dance Academy",
  headline: "Joyful dance classes for kids, adults, and performers.",
  bio: "A welcoming dance community for students who want clear teaching, expressive choreography, and a confident stage presence.",
  styles: ["Bollywood", "Semi-classical", "Kids"],
  studioLocations: "Manhattan studio, Jersey City studio, online private coaching",
  team: "Tanvi Shah - Lead choreographer\nMaya Patel - Kids program instructor",
  services: "Workshops\nPrivate coaching\nWedding choreography\nShowcase team training",
  logoUrl: "/brand/beyond8-icon-gradient.webp",
  photoUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85",
  importUrl: "https://example.com/current-workshops",
  paymentMethod: "Venmo",
  paymentHandle: "@TanviDance",
  workshops: [
    { id: 1, title: "Bollywood Beginner", date: "Sat 11:00 AM", location: "Manhattan", price: "$25", capacity: "24" },
    { id: 2, title: "Kids Showcase Team", date: "Sun 10:00 AM", location: "Jersey City", price: "$180", capacity: "18" },
    { id: 3, title: "Wedding Choreo Intensive", date: "Thu 7:30 PM", location: "Online", price: "$95", capacity: "12" },
  ],
  students: [
    { id: 1, name: "Maya Shah", workshop: "Bollywood Beginner", status: "Paid" },
    { id: 2, name: "Ari Patel", workshop: "Kids Showcase Team", status: "Pending" },
    { id: 3, name: "Neha Rao", workshop: "Wedding Choreo Intensive", status: "Follow up" },
  ],
};

const tabs: { id: TabId; label: string; icon: typeof Sparkles }[] = [
  { id: "questionnaire", label: "Questionnaire", icon: Sparkles },
  { id: "website", label: "Website", icon: Globe2 },
  { id: "workshops", label: "Workshops", icon: CalendarCheck2 },
  { id: "roster", label: "Roster", icon: ClipboardList },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "community", label: "Community", icon: MessageSquareText },
];

export default function Portal() {
  const [active, setActive] = useState<TabId>("questionnaire");
  const [state, setState] = useState<BuilderState>(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const launchScore = useMemo(() => {
    const checks = [
      state.studioName,
      state.name,
      state.email,
      state.location,
      state.styles.length,
      state.studioLocations,
      state.services,
      state.workshops.length,
      state.paymentHandle,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [state]);

  const update = <Key extends keyof BuilderState>(key: Key, value: BuilderState[Key]) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const addImportedWorkshops = () => {
    setState((current) => ({
      ...current,
      workshops: [
        ...current.workshops,
        {
          id: Date.now(),
          title: "Imported Garba Workshop",
          date: "Fri 6:30 PM",
          location: "Brooklyn studio",
          price: "$35",
          capacity: "30",
        },
      ],
    }));
    setActive("workshops");
  };

  return (
    <div className="min-h-screen bg-[#fbf7f1] text-[#18131d]">
      <section className="px-4 py-8 md:px-6">
        <div className="mx-auto max-w-7xl">
          <Hero state={state} launchScore={launchScore} />

          <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="h-fit rounded-[26px] border border-[#e6ddd5] bg-white p-3 shadow-sm">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                    active === id ? "bg-[#18131d] text-white" : "text-[#675e70] hover:bg-[#f5eee8] hover:text-[#18131d]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
              <div className="mt-3 rounded-2xl bg-[#fbf7f1] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#bf4b3a]">Phase 1</p>
                <p className="mt-2 text-sm leading-6 text-[#665d6d]">
                  Sign up, answer the questionnaire, generate a website, add workshops, track roster and payments.
                </p>
              </div>
            </aside>

            <main className="min-w-0 rounded-[28px] border border-[#e6ddd5] bg-white p-5 shadow-sm md:p-6">
              {active === "questionnaire" && (
                <Questionnaire state={state} update={update} goNext={() => setActive("website")} />
              )}
              {active === "website" && <WebsiteBuilder state={state} update={update} />}
              {active === "workshops" && (
                <WorkshopManager state={state} update={update} addImportedWorkshops={addImportedWorkshops} />
              )}
              {active === "roster" && <RosterManager state={state} update={update} />}
              {active === "payments" && <PaymentsView state={state} update={update} />}
              {active === "community" && <CommunityView state={state} />}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

function Hero({ state, launchScore }: { state: BuilderState; launchScore: number }) {
  return (
    <div className="overflow-hidden rounded-[34px] bg-[#18131d] text-white shadow-2xl">
      <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <Badge className="mb-5 bg-white/12 text-white">Beyond8 app whitelabeling</Badge>
          <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
            Business setup with a click.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
            Create a registration website, workshop catalog, payment tracker, roster, team page, and community hub for an individual choreographer.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Website", value: "Generated", icon: LayoutDashboard },
              { label: "Workshops", value: state.workshops.length, icon: CalendarCheck2 },
              { label: "Launch", value: `${launchScore}%`, icon: CheckCircle2 },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <Icon className="h-5 w-5 text-white/55" />
                <p className="mt-5 font-serif text-2xl font-bold">{value}</p>
                <p className="text-sm text-white/55">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] bg-white p-4 text-[#18131d]">
          <div className="overflow-hidden rounded-[22px]">
            <img src={state.photoUrl} alt="" className="h-52 w-full object-cover" />
          </div>
          <div className="mt-4 flex items-start gap-3">
            <img src={state.logoUrl} alt="" className="h-12 w-12 rounded-2xl object-cover" />
            <div>
              <p className="font-serif text-2xl font-bold">{state.studioName}</p>
              <p className="text-sm text-[#665d6d]">{state.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Questionnaire({
  state,
  update,
  goNext,
}: {
  state: BuilderState;
  update: <Key extends keyof BuilderState>(key: Key, value: BuilderState[Key]) => void;
  goNext: () => void;
}) {
  const toggleStyle = (style: string) => {
    update(
      "styles",
      state.styles.includes(style)
        ? state.styles.filter((item) => item !== style)
        : [...state.styles, style],
    );
  };

  return (
    <div>
      <SectionTitle
        eyebrow="Questionnaire"
        title="Tell Beyond8 what kind of dance business to create."
        body="This is the Phase 1 sign-up flow from the whiteboard: theme, personal details, dance styles, locations, team, services, logo, and photos."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Theme">
          <div className="grid gap-3 sm:grid-cols-2">
            {themeOptions.map((theme) => (
              <button
                key={theme}
                onClick={() => update("theme", theme)}
                className={`rounded-2xl border p-4 text-left text-sm font-bold transition ${
                  state.theme === theme ? "border-[#18131d] bg-[#18131d] text-white" : "border-[#e8ded6] bg-[#fbf7f1] hover:border-[#bf4b3a]"
                }`}
              >
                <Palette className="mb-3 h-4 w-4" />
                {theme}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Primary color"><Input type="color" value={state.primaryColor} onChange={(event) => update("primaryColor", event.target.value)} className="h-11" /></Field>
            <Field label="Accent color"><Input type="color" value={state.accentColor} onChange={(event) => update("accentColor", event.target.value)} className="h-11" /></Field>
          </div>
        </Panel>

        <Panel title="Personal detail">
          <div className="grid gap-4">
            <Field label="Choreographer name"><Input value={state.name} onChange={(event) => update("name", event.target.value)} /></Field>
            <Field label="Work email"><Input type="email" value={state.email} onChange={(event) => update("email", event.target.value)} /></Field>
            <Field label="Location"><Input value={state.location} onChange={(event) => update("location", event.target.value)} /></Field>
            <Field label="Studio or brand name"><Input value={state.studioName} onChange={(event) => update("studioName", event.target.value)} /></Field>
          </div>
        </Panel>

        <Panel title="Dance styles">
          <div className="grid gap-3 sm:grid-cols-2">
            {styleOptions.map((style) => (
              <label key={style} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#e8ded6] bg-[#fbf7f1] p-4">
                <input
                  type="checkbox"
                  checked={state.styles.includes(style)}
                  onChange={() => toggleStyle(style)}
                  className="h-4 w-4 accent-[#bf4b3a]"
                />
                <span className="text-sm font-bold">{style}</span>
              </label>
            ))}
          </div>
        </Panel>

        <Panel title="Locations, team, services, media">
          <div className="grid gap-4">
            <Field label="Locations / studios"><Textarea value={state.studioLocations} onChange={(event) => update("studioLocations", event.target.value)} /></Field>
            <Field label="Team"><Textarea value={state.team} onChange={(event) => update("team", event.target.value)} /></Field>
            <Field label="Additional services"><Textarea value={state.services} onChange={(event) => update("services", event.target.value)} /></Field>
            <Field label="Logo URL"><Input value={state.logoUrl} onChange={(event) => update("logoUrl", event.target.value)} /></Field>
            <Field label="Hero photo URL"><Input value={state.photoUrl} onChange={(event) => update("photoUrl", event.target.value)} /></Field>
          </div>
        </Panel>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-[24px] bg-[#18131d] p-5 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-2xl font-bold">Questionnaire complete enough to generate.</p>
          <p className="mt-1 text-sm text-white/62">Next: review the website this form creates.</p>
        </div>
        <Button onClick={goNext} className="rounded-full bg-white text-[#18131d] hover:bg-white/90">
          Generate website <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function WebsiteBuilder({
  state,
  update,
}: {
  state: BuilderState;
  update: <Key extends keyof BuilderState>(key: Key, value: BuilderState[Key]) => void;
}) {
  return (
    <div>
      <SectionTitle
        eyebrow="Generated website"
        title="A ready-to-share registration site."
        body="Edit the intro, workshops, services, about, optional team, and testimonials-style social proof from one place."
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel title="Website copy">
          <div className="grid gap-4">
            <Field label="Homepage headline"><Input value={state.headline} onChange={(event) => update("headline", event.target.value)} /></Field>
            <Field label="About me"><Textarea value={state.bio} onChange={(event) => update("bio", event.target.value)} className="min-h-32" /></Field>
            <Field label="Services"><Textarea value={state.services} onChange={(event) => update("services", event.target.value)} className="min-h-32" /></Field>
          </div>
        </Panel>
        <PublicPreview state={state} />
      </div>
    </div>
  );
}

function PublicPreview({ state }: { state: BuilderState }) {
  const services = lines(state.services);
  const team = lines(state.team);

  return (
    <div className="overflow-hidden rounded-[30px] border border-[#e6ddd5] bg-[#fbf7f1] shadow-sm">
      <div className="relative min-h-[360px] overflow-hidden">
        <img src={state.photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${state.accentColor}ee, ${state.primaryColor}99)` }} />
        <div className="relative z-10 p-6 text-white md:p-8">
          <div className="flex items-center gap-3">
            <img src={state.logoUrl} alt="" className="h-12 w-12 rounded-2xl object-cover" />
            <div>
              <p className="font-serif text-2xl font-bold">{state.studioName}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-white/65">{state.theme}</p>
            </div>
          </div>
          <h2 className="mt-16 max-w-2xl font-serif text-4xl font-bold leading-tight md:text-6xl">{state.headline}</h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/78">{state.bio}</p>
          <Button className="mt-6 rounded-full bg-white text-[#18131d] hover:bg-white/90">Register for a workshop</Button>
        </div>
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-3">
        {state.workshops.slice(0, 3).map((workshop) => (
          <div key={workshop.id} className="rounded-2xl bg-white p-4">
            <Badge style={{ background: state.primaryColor }} className="text-white">{workshop.price}</Badge>
            <h3 className="mt-3 font-serif text-xl font-bold">{workshop.title}</h3>
            <p className="mt-1 text-sm text-[#665d6d]">{workshop.date} - {workshop.location}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 border-t border-[#e6ddd5] p-5 md:grid-cols-2">
        <PreviewBlock title="Additional services" items={services} />
        <PreviewBlock title="Team" items={team} />
      </div>
    </div>
  );
}

function WorkshopManager({
  state,
  update,
  addImportedWorkshops,
}: {
  state: BuilderState;
  update: <Key extends keyof BuilderState>(key: Key, value: BuilderState[Key]) => void;
  addImportedWorkshops: () => void;
}) {
  const addWorkshop = () => {
    update("workshops", [
      ...state.workshops,
      { id: Date.now(), title: "New workshop", date: "Sat 12:00 PM", location: state.location, price: "$40", capacity: "20" },
    ]);
  };

  const updateWorkshop = (id: number, key: keyof Workshop, value: string) => {
    update("workshops", state.workshops.map((item) => item.id === id ? { ...item, [key]: value } : item));
  };

  return (
    <div>
      <SectionTitle
        eyebrow="Workshops"
        title="Import existing workshops or input new ones."
        body="The scraper/integration is represented as a working import action for now. The data shape is ready for a real backend importer later."
      />
      <div className="mt-6 rounded-[24px] border border-[#e6ddd5] bg-[#fbf7f1] p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <Field label="Existing workshop page to import">
            <Input value={state.importUrl} onChange={(event) => update("importUrl", event.target.value)} />
          </Field>
          <Button onClick={addImportedWorkshops} className="rounded-full bg-[#18131d]">
            <Link2 className="mr-2 h-4 w-4" /> Import sample
          </Button>
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <Button onClick={addWorkshop} className="rounded-full bg-[#bf4b3a]">
          <Plus className="mr-2 h-4 w-4" /> Add workshop
        </Button>
      </div>
      <div className="mt-4 grid gap-4">
        {state.workshops.map((workshop) => (
          <div key={workshop.id} className="grid gap-3 rounded-2xl border border-[#e6ddd5] bg-white p-4 md:grid-cols-5">
            <Input value={workshop.title} onChange={(event) => updateWorkshop(workshop.id, "title", event.target.value)} />
            <Input value={workshop.date} onChange={(event) => updateWorkshop(workshop.id, "date", event.target.value)} />
            <Input value={workshop.location} onChange={(event) => updateWorkshop(workshop.id, "location", event.target.value)} />
            <Input value={workshop.price} onChange={(event) => updateWorkshop(workshop.id, "price", event.target.value)} />
            <Input value={workshop.capacity} onChange={(event) => updateWorkshop(workshop.id, "capacity", event.target.value)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RosterManager({
  state,
  update,
}: {
  state: BuilderState;
  update: <Key extends keyof BuilderState>(key: Key, value: BuilderState[Key]) => void;
}) {
  const addStudent = () => {
    update("students", [
      ...state.students,
      { id: Date.now(), name: "New student", workshop: state.workshops[0]?.title || "Workshop", status: "Pending" },
    ]);
  };

  return (
    <div>
      <SectionTitle
        eyebrow="Roster management"
        title="Every registration becomes a student record."
        body="This gives the choreographer one place for names, class assignment, notes-ready records, and payment status."
      />
      <div className="mt-5 flex justify-end">
        <Button onClick={addStudent} className="rounded-full bg-[#18131d]"><Plus className="mr-2 h-4 w-4" /> Add student</Button>
      </div>
      <div className="mt-4 space-y-3">
        {state.students.map((student) => (
          <div key={student.id} className="grid gap-4 rounded-2xl bg-[#fbf7f1] p-4 md:grid-cols-[44px_1fr_1fr_auto] md:items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#18131d] text-sm font-bold text-white">
              {initials(student.name)}
            </div>
            <div>
              <p className="font-bold">{student.name}</p>
              <p className="text-sm text-[#665d6d]">{student.workshop}</p>
            </div>
            <div className="text-sm text-[#665d6d]">Registration captured from website form</div>
            <Badge className={`${student.status === "Paid" ? "bg-[#2f7b6f]" : student.status === "Pending" ? "bg-[#bf4b3a]" : "bg-[#18131d]"} text-white`}>
              {student.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsView({
  state,
  update,
}: {
  state: BuilderState;
  update: <Key extends keyof BuilderState>(key: Key, value: BuilderState[Key]) => void;
}) {
  const paid = state.students.filter((student) => student.status === "Paid").length;
  const pending = state.students.length - paid;

  return (
    <div>
      <SectionTitle
        eyebrow="Payment system"
        title="Track payment method, paid students, and follow-up."
        body="Phase 1 can start with manual payment labels and status tracking, then graduate to Stripe or payment links."
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel title="Payment setup">
          <div className="grid gap-4">
            <Field label="Payment method"><Input value={state.paymentMethod} onChange={(event) => update("paymentMethod", event.target.value)} /></Field>
            <Field label="Payment handle / link"><Input value={state.paymentHandle} onChange={(event) => update("paymentHandle", event.target.value)} /></Field>
          </div>
        </Panel>
        <div className="grid gap-4 md:grid-cols-3">
          <Metric icon={BadgeDollarSign} label="Projected" value={`$${state.workshops.length * 420}`} />
          <Metric icon={CheckCircle2} label="Paid students" value={paid} />
          <Metric icon={Mail} label="Need follow-up" value={pending} />
        </div>
      </div>
      <div className="mt-6 rounded-[24px] bg-[#18131d] p-5 text-white">
        <p className="font-serif text-2xl font-bold">Payment reminder ready</p>
        <p className="mt-1 text-sm text-white/65">
          Send a note to pending students with {state.paymentMethod} details: {state.paymentHandle}.
        </p>
      </div>
    </div>
  );
}

function CommunityView({ state }: { state: BuilderState }) {
  return (
    <div>
      <SectionTitle
        eyebrow="Community page"
        title="Keep the class community warm after registration."
        body="This covers announcements, testimonials, practice links, and the lightweight community page from the brainstorm."
      />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { title: "Announcement", body: `Welcome to ${state.studioName}. New workshop dates are live.` },
          { title: "Practice resource", body: "Showcase chorus practice video - ready to share after registration." },
          { title: "Testimonial", body: "The class felt organized before I even walked in. I knew where to go, how to pay, and what to expect." },
        ].map((item) => (
          <div key={item.title} className="rounded-[24px] border border-[#e6ddd5] bg-[#fbf7f1] p-5">
            <MessageSquareText className="h-5 w-5 text-[#bf4b3a]" />
            <h3 className="mt-5 font-serif text-2xl font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#665d6d]">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#bf4b3a]">{eyebrow}</p>
      <h2 className="mt-2 max-w-4xl font-serif text-4xl font-bold leading-tight md:text-5xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#665d6d]">{body}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-[#e6ddd5] bg-white p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 font-serif text-2xl font-bold">
        <Building2 className="h-5 w-5 text-[#bf4b3a]" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function PreviewBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-serif text-xl font-bold">{title}</p>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <div key={item} className="rounded-2xl bg-white p-3 text-sm font-semibold text-[#4f4656]">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Sparkles; label: string; value: string | number }) {
  return (
    <div className="rounded-[24px] border border-[#e6ddd5] bg-[#fbf7f1] p-5">
      <Icon className="h-5 w-5 text-[#bf4b3a]" />
      <p className="mt-5 font-serif text-4xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-[#665d6d]">{label}</p>
    </div>
  );
}

function lines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
