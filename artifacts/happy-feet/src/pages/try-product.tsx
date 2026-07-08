import { useMemo, useState } from "react";
import {
  ArrowRight,
  BellRing,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Download,
  Eye,
  Mail,
  MessageSquareText,
  MousePointerClick,
  PlayCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type DemoMode = "owner" | "instructor" | "student";

type ModeConfig = {
  id: DemoMode;
  label: string;
  shortLabel: string;
  eyebrow: string;
  headline: string;
  body: string;
  accent: string;
  soft: string;
  statSet: Array<{ label: string; value: string; note: string }>;
  actions: Array<{ label: string; result: string }>;
};

const modeConfigs: ModeConfig[] = [
  {
    id: "owner",
    label: "Studio owner",
    shortLabel: "Owner",
    eyebrow: "Business control",
    headline: "See the whole studio without opening five tabs.",
    body: "Classes, bookings, payment status, images, announcements, and rosters live in one calm operating view.",
    accent: "#2f7b6f",
    soft: "#e8f4ef",
    statSet: [
      { label: "Monthly bookings", value: "146", note: "+22% this month" },
      { label: "Pending payments", value: "12", note: "needs attention" },
      { label: "Projected revenue", value: "$8.4k", note: "from active programs" },
    ],
    actions: [
      { label: "Publish class", result: "Class is live on the public site" },
      { label: "Mark paid", result: "Payment status updated" },
      { label: "Export roster", result: "Student CSV downloaded" },
    ],
  },
  {
    id: "instructor",
    label: "Instructor",
    shortLabel: "Teach",
    eyebrow: "Class readiness",
    headline: "Walk into class already knowing who is coming.",
    body: "Instructors get rosters, notes, payment context, and upcoming sessions without asking the admin team.",
    accent: "#bf4b3a",
    soft: "#fff0e9",
    statSet: [
      { label: "Today", value: "3", note: "sessions to teach" },
      { label: "Students", value: "52", note: "across active classes" },
      { label: "Roster notes", value: "9", note: "needs review" },
    ],
    actions: [
      { label: "Open roster", result: "Instructor roster opened" },
      { label: "Queue reminder", result: "Class reminder queued" },
      { label: "Download list", result: "Roster ready for check-in" },
    ],
  },
  {
    id: "student",
    label: "Student",
    shortLabel: "Book",
    eyebrow: "Booking clarity",
    headline: "Turn interest into a class request in under a minute.",
    body: "Students can browse by level, age, schedule, and price, then register without chasing messages.",
    accent: "#7c5cff",
    soft: "#f0edff",
    statSet: [
      { label: "Visible offers", value: "8", note: "classes and programs" },
      { label: "Booking steps", value: "3", note: "choose, register, confirm" },
      { label: "Follow-up", value: "Auto", note: "email and admin view" },
    ],
    actions: [
      { label: "Choose class", result: "Class details opened" },
      { label: "Register", result: "Registration request captured" },
      { label: "Confirm next step", result: "Student confirmation prepared" },
    ],
  },
];

const schedule = [
  { title: "Bollywood Beginner", detail: "Sat 11:00 AM", seats: "18 / 24", health: "Filling fast" },
  { title: "Kids Showcase Team", detail: "Sun 10:00 AM", seats: "14 / 18", health: "4 pending" },
  { title: "BollyHop Performance Lab", detail: "Thu 7:30 PM", seats: "20 / 22", health: "Almost full" },
];

const students = [
  { name: "Maya Shah", initials: "MS", className: "Bollywood Beginner", status: "Paid", amount: "$25" },
  { name: "Ari Patel", initials: "AP", className: "Kids Showcase", status: "Pending", amount: "$180" },
  { name: "Neha Rao", initials: "NR", className: "BollyHop Lab", status: "Paid", amount: "$95" },
  { name: "Dev Mehta", initials: "DM", className: "Private Coaching", status: "Follow up", amount: "$90" },
];

const valueCards = [
  {
    icon: CalendarCheck2,
    title: "One live schedule",
    body: "Every public class, private session, program, and workshop updates from the same admin flow.",
  },
  {
    icon: CreditCard,
    title: "Payment clarity",
    body: "Owners see who paid, who needs follow-up, and what each class is worth before class day.",
  },
  {
    icon: Users,
    title: "Owned audience",
    body: "Every booking builds the studio contact list, so future batches and events are easier to fill.",
  },
];

const journey = [
  "Create studio",
  "Publish first class",
  "Share one link",
  "Track students",
  "Export and follow up",
];

export default function TryProduct() {
  const [mode, setMode] = useState<DemoMode>("owner");
  const [activity, setActivity] = useState("Class is live on the public site");
  const selected = useMemo(() => modeConfigs.find((item) => item.id === mode) ?? modeConfigs[0], [mode]);

  return (
    <div className="min-h-screen bg-[#f8f4ef] text-[#17131c]">
      <HeroSection selected={selected} mode={mode} setMode={setMode} setActivity={setActivity} activity={activity} />

      <section id="playground" className="px-4 py-16 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#bf4b3a]">Interactive product tour</p>
              <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#1e1724] md:text-6xl">
                Let prospects feel the workflow, not just read about it.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[#675e70]">
              This page is built for a studio owner or instructor who has ten minutes between classes.
              They can switch roles, press actions, and immediately understand what StudioFlow removes from their day.
            </p>
          </div>

          <RoleSwitcher selected={selected} mode={mode} setMode={setMode} setActivity={setActivity} />

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.34fr_.66fr]">
            <ProductStage selected={selected} activity={activity} setActivity={setActivity} />
            <InsightPanel selected={selected} />
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-6">
        <div className="mx-auto max-w-7xl rounded-[32px] bg-[#17131c] p-6 text-white shadow-2xl md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[.88fr_1.12fr] lg:items-center">
            <div>
              <Badge className="mb-5 bg-white/12 text-white">From curiosity to setup</Badge>
              <h2 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
                The next version should turn this demo into onboarding.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/72">
                After someone plays with the product, we ask for their studio name, first class, owner email,
                and preferred public URL. Then StudioFlow creates the workspace.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full bg-white px-8 text-[#17131c] hover:bg-white/90">
                  <a href="/platform">Create studio workspace</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/25 bg-white/8 px-8 text-white hover:bg-white/14">
                  <a href="/admin">Open admin dashboard</a>
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-5">
              {journey.map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/12 bg-white/8 p-4">
                  <p className="text-sm font-bold text-white/45">0{index + 1}</p>
                  <p className="mt-8 text-sm font-semibold leading-5 text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroSection({
  selected,
  mode,
  setMode,
  setActivity,
  activity,
}: {
  selected: ModeConfig;
  mode: DemoMode;
  setMode: (mode: DemoMode) => void;
  setActivity: (activity: string) => void;
  activity: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1800&q=85"
        alt="Dance class in motion"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(10,8,14,.94),rgba(39,31,50,.86)_48%,rgba(191,75,58,.5))]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(to_top,#f8f4ef,transparent)]" />

      <div className="relative mx-auto grid min-h-[86vh] max-w-7xl gap-10 px-4 py-14 md:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
        <div className="max-w-2xl text-white">
          <Badge className="mb-5 border-white/15 bg-white/12 px-3 py-1.5 text-white backdrop-blur">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            StudioFlow interactive preview
          </Badge>
          <h1 className="font-serif text-5xl font-bold leading-[1.01] md:text-7xl">
            Try the operating system for dance studios.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/78 md:text-lg">
            A guided, no-login playground that shows how instructors, studio owners, and students move through the same clean product.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="rounded-full bg-white px-8 text-[#1d1722] shadow-xl hover:bg-white/90"
              onClick={() => document.getElementById("playground")?.scrollIntoView({ behavior: "smooth" })}
            >
              Play with the product <PlayCircle className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/25 bg-white/10 px-8 text-white backdrop-blur hover:bg-white/18"
              asChild
            >
              <a href="/platform">Open platform</a>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-4 top-8 hidden h-28 w-28 rounded-full bg-[#2f7b6f]/30 blur-3xl md:block" />
          <div className="absolute -right-6 bottom-8 hidden h-32 w-32 rounded-full bg-[#bf4b3a]/30 blur-3xl md:block" />
          <div className="relative rounded-[30px] border border-white/16 bg-white/88 p-3 shadow-2xl backdrop-blur-xl md:p-4">
            <ProductStage selected={selected} activity={activity} setActivity={setActivity} compact />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-white/12 bg-white/10 p-2 backdrop-blur">
            {modeConfigs.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setMode(item.id);
                  setActivity(item.actions[0].result);
                }}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  mode === item.id ? "bg-white text-[#1d1722]" : "text-white/78 hover:bg-white/12"
                }`}
              >
                {item.shortLabel}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RoleSwitcher({
  selected,
  mode,
  setMode,
  setActivity,
}: {
  selected: ModeConfig;
  mode: DemoMode;
  setMode: (mode: DemoMode) => void;
  setActivity: (activity: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {modeConfigs.map((item) => {
        const active = mode === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              setMode(item.id);
              setActivity(item.actions[0].result);
            }}
            className={`group min-h-[176px] rounded-[26px] border p-5 text-left transition duration-300 ${
              active
                ? "border-transparent bg-[#17131c] text-white shadow-xl"
                : "border-[#e7ded7] bg-white text-[#1e1724] hover:-translate-y-1 hover:border-[#d8cbc2] hover:shadow-lg"
            }`}
            style={active ? { boxShadow: `0 28px 70px ${selected.accent}26` } : undefined}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-xs font-bold uppercase tracking-[0.18em] ${active ? "text-white/48" : "text-[#bf4b3a]"}`}>
                  {item.eyebrow}
                </p>
                <h3 className="mt-3 font-serif text-3xl font-bold">{item.label}</h3>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                  active ? "bg-white text-[#17131c]" : "bg-[#f4ede7] text-[#bf4b3a] group-hover:bg-[#17131c] group-hover:text-white"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
            <p className={`mt-4 text-sm leading-6 ${active ? "text-white/70" : "text-[#675e70]"}`}>{item.body}</p>
          </button>
        );
      })}
    </div>
  );
}

function ProductStage({
  selected,
  activity,
  setActivity,
  compact = false,
}: {
  selected: ModeConfig;
  activity: string;
  setActivity: (activity: string) => void;
  compact?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e8ded5] bg-[#fffdfb] shadow-sm">
      <div className="flex items-center justify-between border-b border-[#eee3dc] bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff6b5f]" />
          <span className="h-3 w-3 rounded-full bg-[#f5c451]" />
          <span className="h-3 w-3 rounded-full bg-[#62c37b]" />
        </div>
        <div className="rounded-full bg-[#f4eee9] px-3 py-1 text-xs font-semibold text-[#675e70]">studioflow.app/demo</div>
      </div>

      <div className="grid lg:grid-cols-[210px_1fr]">
        <aside className="hidden border-r border-[#eee3dc] bg-[#fbf7f2] p-4 lg:block">
          <div className="mb-5 rounded-2xl p-4 text-white" style={{ background: selected.accent }}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/62">Current view</p>
            <p className="mt-2 font-serif text-2xl font-bold">{selected.shortLabel}</p>
          </div>
          <div className="space-y-2">
            {["Overview", "Classes", "Students", "Payments"].map((item, index) => (
              <div
                key={item}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold ${
                  index === 0 ? "bg-white text-[#17131c] shadow-sm" : "text-[#716879]"
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: index === 0 ? selected.accent : "#d8ccc3" }} />
                {item}
              </div>
            ))}
          </div>
        </aside>

        <main className="p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: selected.accent }}>
                {selected.eyebrow}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-[#17131c] md:text-3xl">{selected.headline}</h2>
              {!compact && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#675e70]">{selected.body}</p>}
            </div>
            <Badge className="w-fit text-white" style={{ background: selected.accent }}>Live preview</Badge>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {selected.statSet.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[#eee3dc] bg-[#faf6f2] p-4">
                <p className="font-serif text-3xl font-bold text-[#17131c]">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold text-[#675e70]">{stat.label}</p>
                <p className="mt-3 text-xs font-semibold" style={{ color: selected.accent }}>{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[.94fr_1.06fr]">
            <SchedulePanel selected={selected} />
            <PeoplePanel selected={selected} setActivity={setActivity} compact={compact} />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div className="rounded-2xl p-4" style={{ background: selected.soft }}>
              <p className="flex items-center gap-2 text-sm font-bold" style={{ color: selected.accent }}>
                <CheckCircle2 className="h-4 w-4" />
                {activity}
              </p>
              <p className="mt-1 text-sm text-[#5c5363]">Try an action to watch the workspace respond.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.actions.map((action) => (
                <Button
                  key={action.label}
                  size="sm"
                  variant={action.label === selected.actions[0].label ? "default" : "outline"}
                  className="rounded-full"
                  style={action.label === selected.actions[0].label ? { background: selected.accent } : undefined}
                  onClick={() => setActivity(action.result)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SchedulePanel({ selected }: { selected: ModeConfig }) {
  return (
    <section className="rounded-2xl border border-[#eee3dc] bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#17131c]">Upcoming classes</h3>
          <p className="text-xs text-[#776e7d]">Shared by public site, admin, and instructor view</p>
        </div>
        <CalendarCheck2 className="h-5 w-5" style={{ color: selected.accent }} />
      </div>
      <div className="space-y-3">
        {schedule.map((item) => (
          <div key={item.title} className="rounded-xl border border-[#f0e6de] bg-[#fffdfb] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[#17131c]">{item.title}</p>
                <p className="mt-1 text-xs text-[#756d7b]">{item.detail}</p>
              </div>
              <p className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: selected.soft, color: selected.accent }}>
                {item.seats}
              </p>
            </div>
            <p className="mt-3 text-xs font-semibold" style={{ color: selected.accent }}>{item.health}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PeoplePanel({
  selected,
  setActivity,
  compact,
}: {
  selected: ModeConfig;
  setActivity: (activity: string) => void;
  compact: boolean;
}) {
  return (
    <section className="rounded-2xl border border-[#eee3dc] bg-white p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#17131c]">Roster and payments</h3>
          <p className="text-xs text-[#776e7d]">Ready for check-in, reminders, and CSV export</p>
        </div>
        <button
          onClick={() => setActivity("Student CSV downloaded")}
          className="inline-flex items-center gap-1 rounded-full border border-[#e1d7cf] px-3 py-1.5 text-xs font-bold"
          style={{ color: selected.accent }}
        >
          <Download className="h-3.5 w-3.5" />
          CSV
        </button>
      </div>
      <div className="space-y-2">
        {students.slice(0, compact ? 3 : students.length).map((student) => (
          <div key={`${student.name}-${student.className}`} className="grid grid-cols-[38px_1fr_auto] items-center gap-3 rounded-xl bg-[#faf6f2] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: selected.accent }}>
              {student.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#17131c]">{student.name}</p>
              <p className="truncate text-xs text-[#756d7b]">{student.className}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#17131c]">{student.amount}</p>
              <p className={`text-xs font-bold ${student.status === "Paid" ? "text-[#2f7b6f]" : "text-[#bf4b3a]"}`}>{student.status}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function InsightPanel({ selected }: { selected: ModeConfig }) {
  const roleSpecific =
    selected.id === "student"
      ? [
          { icon: Eye, title: "Clear decisions", body: "Students see level, price, age group, and schedule before they register." },
          { icon: Mail, title: "Clean follow-up", body: "A registration creates the next step for both student and admin." },
        ]
      : selected.id === "instructor"
        ? [
            { icon: ClipboardList, title: "Roster confidence", body: "Instructors know attendance, notes, and payment context before class starts." },
            { icon: MessageSquareText, title: "Fewer scattered messages", body: "Reminders and class updates are connected to the class record." },
          ]
        : [
            { icon: MousePointerClick, title: "Publish in minutes", body: "Create a class, upload its image, and share the studio link." },
            { icon: BellRing, title: "Know what needs attention", body: "Pending payments and recent requests stay visible without spreadsheet hunting." },
          ];

  return (
    <aside className="rounded-[28px] border border-[#e7ded7] bg-white p-5 shadow-sm md:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: selected.accent }}>What they feel</p>
      <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#17131c]">
        Relief is the product moment.
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#675e70]">
        The demo should make a prospect think: this is how my studio could feel when the admin work stops spilling everywhere.
      </p>

      <div className="mt-6 space-y-4">
        {[...roleSpecific, ...valueCards.slice(0, 1)].map(({ icon: Icon, title, body }) => (
          <div key={title} className="grid grid-cols-[44px_1fr] gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: selected.soft, color: selected.accent }}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#17131c]">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-[#675e70]">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 rounded-2xl border border-[#eee3dc] bg-[#fbf7f2] p-4">
        <p className="text-sm font-bold text-[#17131c]">Best next action</p>
        <p className="mt-1 text-sm leading-6 text-[#675e70]">
          Convert this page into a guided setup wizard once the prospect is ready to create a real studio.
        </p>
        <Button asChild className="mt-4 w-full rounded-full" style={{ background: selected.accent }}>
          <a href="/platform">Start setup <ArrowRight className="ml-2 h-4 w-4" /></a>
        </Button>
      </div>
    </aside>
  );
}
