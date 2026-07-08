import { useMemo, useState } from "react";
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  Mail,
  MessageSquareText,
  MousePointerClick,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type DemoMode = "owner" | "instructor" | "student";

const modes: Array<{
  id: DemoMode;
  label: string;
  eyebrow: string;
  headline: string;
  body: string;
}> = [
  {
    id: "owner",
    label: "Studio owner",
    eyebrow: "Admin cockpit",
    headline: "Run classes, payments, and updates from one calm dashboard.",
    body: "See what is filling, who still needs payment, and what needs attention before the next class.",
  },
  {
    id: "instructor",
    label: "Instructor",
    eyebrow: "Teaching flow",
    headline: "Know your roster before you walk into the room.",
    body: "Every class has students, notes, payment status, and quick exports in one place.",
  },
  {
    id: "student",
    label: "Student",
    eyebrow: "Booking flow",
    headline: "Students book without DM chaos.",
    body: "A clean public page turns interest into a registration request and confirmation path.",
  },
];

const students = [
  { name: "Maya Shah", className: "Bollywood Beginner", status: "Paid", value: "$25" },
  { name: "Ari Patel", className: "Kids Showcase", status: "Pending", value: "$180" },
  { name: "Neha Rao", className: "BollyHop Lab", status: "Paid", value: "$95" },
  { name: "Dev Mehta", className: "Private Coaching", status: "Needs follow-up", value: "$90" },
];

const classes = [
  { title: "Bollywood Beginner", meta: "Sat 11:00 AM", seats: "18/24", trend: "+6 this week" },
  { title: "Kids Showcase Team", meta: "Sun 10:00 AM", seats: "14/18", trend: "4 pending" },
  { title: "BollyHop Performance Lab", meta: "Thu 7:30 PM", seats: "20/22", trend: "Almost full" },
];

const modeHighlights: Record<DemoMode, string[]> = {
  owner: ["Publish a class", "Collect requests", "Track payment status", "Export student lists"],
  instructor: ["See roster notes", "Message class", "Download CSV", "Review upcoming sessions"],
  student: ["Find the right class", "Register quickly", "Get next steps", "Stay connected"],
};

export default function TryProduct() {
  const [mode, setMode] = useState<DemoMode>("owner");
  const [action, setAction] = useState("Class published");
  const selected = modes.find((item) => item.id === mode) ?? modes[0];

  const metrics = useMemo(() => {
    if (mode === "student") {
      return [
        { label: "Classes visible", value: "8" },
        { label: "Steps to book", value: "3" },
        { label: "Follow-up", value: "Auto" },
      ];
    }
    if (mode === "instructor") {
      return [
        { label: "Today", value: "3" },
        { label: "Students", value: "52" },
        { label: "Notes", value: "9" },
      ];
    }
    return [
      { label: "Bookings", value: "146" },
      { label: "Pending", value: "12" },
      { label: "Revenue", value: "$8.4k" },
    ];
  }, [mode]);

  return (
    <div className="min-h-screen bg-[#fbf8f4] text-[#211b25]">
      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1800&q=85"
          alt="Dance class in motion"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(20,15,24,.92),rgba(65,32,64,.76),rgba(192,75,58,.54))]" />
        <div className="relative mx-auto grid min-h-[82vh] max-w-7xl gap-8 px-4 py-12 md:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div className="max-w-2xl pt-8 text-white">
            <Badge className="mb-5 border-white/25 bg-white/15 text-white backdrop-blur">StudioFlow product demo</Badge>
            <h1 className="font-serif text-5xl font-bold leading-[1.02] md:text-7xl">
              Try the dance studio command center.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/84 md:text-lg">
              A no-login preview for studio owners and instructors to feel how classes, bookings,
              students, and payments finally live in one place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="rounded-full bg-white px-8 text-[#2d1f32] hover:bg-white/90"
                onClick={() => document.getElementById("demo-workspace")?.scrollIntoView({ behavior: "smooth" })}
              >
                Open demo workspace <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/35 bg-white/10 px-8 text-white backdrop-blur hover:bg-white/20"
                asChild
              >
                <a href="/platform">See platform admin</a>
              </Button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/18 bg-white/88 p-4 shadow-2xl backdrop-blur md:p-5">
            <DemoWorkspace
              mode={mode}
              setMode={setMode}
              action={action}
              setAction={setAction}
              selected={selected}
              metrics={metrics}
            />
          </div>
        </div>
      </section>

      <section id="demo-workspace" className="px-4 py-14 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#bf4b3a]">Click through the product</p>
              <h2 className="mt-2 font-serif text-4xl font-bold text-[#241729] md:text-5xl">
                One product, three people served.
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-[#665b6c]">
              The goal is fast understanding: a studio owner sees control, an instructor sees clarity,
              and a student sees an easy booking path.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {modes.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setMode(item.id);
                  setAction(item.id === "student" ? "Registration request ready" : item.id === "instructor" ? "Roster opened" : "Class published");
                }}
                className={`rounded-2xl border p-5 text-left transition ${
                  mode === item.id
                    ? "border-[#2f7b6f] bg-[#e9f5f1] shadow-md"
                    : "border-[#e6ddd6] bg-white hover:-translate-y-0.5 hover:shadow-sm"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#bf4b3a]">{item.eyebrow}</p>
                <h3 className="mt-2 font-serif text-2xl font-bold text-[#241729]">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-[#665b6c]">{item.body}</p>
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
            <DemoWorkspace
              mode={mode}
              setMode={setMode}
              action={action}
              setAction={setAction}
              selected={selected}
              metrics={metrics}
            />
            <ValuePanel mode={mode} />
          </div>
        </div>
      </section>
    </div>
  );
}

function DemoWorkspace({
  mode,
  setMode,
  action,
  setAction,
  selected,
  metrics,
}: {
  mode: DemoMode;
  setMode: (mode: DemoMode) => void;
  action: string;
  setAction: (action: string) => void;
  selected: (typeof modes)[number];
  metrics: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="rounded-[22px] border border-[#e7ded7] bg-[#fffdfb] p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-4 border-b border-[#eee4dd] pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bf4b3a]">{selected.eyebrow}</p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-[#241729]">{selected.headline}</h2>
        </div>
        <div className="grid grid-cols-3 rounded-full bg-[#f4eee9] p-1 text-xs font-semibold">
          {modes.map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id)}
              className={`rounded-full px-3 py-2 transition ${mode === item.id ? "bg-white text-[#2f7b6f] shadow-sm" : "text-[#665b6c]"}`}
            >
              {item.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 py-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl bg-[#f7f2ee] p-4">
            <p className="font-serif text-3xl font-bold text-[#241729]">{metric.value}</p>
            <p className="mt-1 text-xs font-medium text-[#665b6c]">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[.95fr_1.05fr]">
        <div className="rounded-2xl border border-[#eadfd7] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#241729]">Live schedule</h3>
            <Badge className="bg-[#2f7b6f] text-white">Updated</Badge>
          </div>
          <div className="space-y-3">
            {classes.map((item) => (
              <div key={item.title} className="rounded-xl border border-[#eee4dd] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#241729]">{item.title}</p>
                    <p className="mt-1 text-xs text-[#756978]">{item.meta}</p>
                  </div>
                  <p className="rounded-full bg-[#fff2df] px-2 py-1 text-xs font-bold text-[#a45e12]">{item.seats}</p>
                </div>
                <p className="mt-2 text-xs text-[#2f7b6f]">{item.trend}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#eadfd7] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#241729]">People and payments</h3>
            <button
              onClick={() => setAction("CSV exported")}
              className="inline-flex items-center gap-1 rounded-full border border-[#d9cfc7] px-3 py-1.5 text-xs font-semibold text-[#2f7b6f]"
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </button>
          </div>
          <div className="space-y-2">
            {students.map((student) => (
              <div key={`${student.name}-${student.className}`} className="grid grid-cols-[36px_1fr_auto] items-center gap-3 rounded-xl bg-[#faf6f2] p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#412040] text-xs font-bold text-white">
                  {student.name.split(" ").map((part) => part[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#241729]">{student.name}</p>
                  <p className="text-xs text-[#756978]">{student.className}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#241729]">{student.value}</p>
                  <p className={`text-xs font-semibold ${student.status === "Paid" ? "text-[#2f7b6f]" : "text-[#bf4b3a]"}`}>{student.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <div className="rounded-2xl bg-[#e9f5f1] p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-[#1f5e54]">
            <CheckCircle2 className="h-4 w-4" />
            {action}
          </p>
          <p className="mt-1 text-sm text-[#416b64]">
            {modeHighlights[mode].join(" · ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="rounded-full bg-[#bf4b3a] hover:bg-[#a83f30]" onClick={() => setAction("Booking request captured")}>
            <MousePointerClick className="mr-2 h-4 w-4" />
            Capture booking
          </Button>
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => setAction("Class reminder queued")}>
            <BellRing className="mr-2 h-4 w-4" />
            Send reminder
          </Button>
        </div>
      </div>
    </div>
  );
}

function ValuePanel({ mode }: { mode: DemoMode }) {
  const items = mode === "student"
    ? [
        { icon: Eye, title: "Clear discovery", body: "Students see schedule, level, price, and location without asking in DMs." },
        { icon: CreditCard, title: "Payment path", body: "Registration keeps payment status visible so the studio can follow up." },
        { icon: Mail, title: "Confirmation loop", body: "The student gets next steps and the studio keeps the contact." },
      ]
    : mode === "instructor"
      ? [
          { icon: CalendarDays, title: "Upcoming view", body: "Instructors know what is coming up and how full each class is." },
          { icon: Users, title: "Roster clarity", body: "Names, notes, attendance context, and payment status travel with each class." },
          { icon: MessageSquareText, title: "Less admin", body: "Quick reminders and exports replace scattered chats and spreadsheets." },
        ]
      : [
          { icon: Sparkles, title: "Launch fast", body: "Create a studio, publish classes, upload images, and share one public link." },
          { icon: CreditCard, title: "Stop chasing", body: "Pending payments and student lists are visible in the same workflow." },
          { icon: Users, title: "Own the audience", body: "Every booking grows the studio's contact list for future batches and events." },
        ];

  return (
    <aside className="rounded-[22px] border border-[#e7ded7] bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bf4b3a]">Why this sells</p>
      <h2 className="mt-2 font-serif text-3xl font-bold text-[#241729]">
        A prospect should feel the relief before they sign in.
      </h2>
      <div className="mt-5 space-y-4">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="grid grid-cols-[44px_1fr] gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1e6df] text-[#bf4b3a]">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#241729]">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-[#665b6c]">{body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl bg-[#241729] p-5 text-white">
        <p className="text-sm font-semibold text-white/70">Best next CTA</p>
        <p className="mt-2 font-serif text-2xl font-bold">Create my studio workspace</p>
        <p className="mt-2 text-sm leading-6 text-white/72">
          This page should feed into onboarding: studio name, owner email, class type, and first published offer.
        </p>
      </div>
    </aside>
  );
}
