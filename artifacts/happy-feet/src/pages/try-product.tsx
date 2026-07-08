import { useState } from "react";
import {
  ArrowRight,
  BellRing,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  ImagePlus,
  Mail,
  MessageSquareText,
  MousePointerClick,
  PlayCircle,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type StoryKey = "instructor" | "student" | "parent";

const stories = {
  instructor: {
    label: "Instructor",
    headline: "Teach more. Chase fewer messages.",
    pain: "Before class day, you are checking DMs, payment screenshots, class lists, and who still needs the address.",
    promise: "Beyond8 gives instructors one place to publish classes, collect requests, see rosters, and follow up.",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=900&q=85",
    color: "#2f7b6f",
    soft: "#e8f4ef",
    toolTitle: "Instructor workspace",
    toolSubtitle: "A focused home for classes, student requests, payment status, and follow-up.",
    visualTitle: "Tonight's class is ready",
    visualNote: "Two students need payment follow-up before rehearsal.",
    proof: ["Class page is live", "Roster is ready", "Follow-up is visible"],
    moments: ["Publish a class", "See who registered", "Mark payment received", "Message the roster"],
    previewRows: [
      ["Spring Showcase Team", "24 students", "4 pending"],
      ["Kids Bollywood Basics", "14 students", "Almost full"],
      ["Private Coaching", "3 requests", "Needs reply"],
    ],
  },
  student: {
    label: "Student",
    headline: "Know what to book and what happens next.",
    pain: "Students often need to ask where class is, what level it is, how much it costs, and how to pay.",
    promise: "Each Beyond8 class page makes the schedule, level, price, and next steps simple before they register.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85",
    color: "#bf4b3a",
    soft: "#fff0e9",
    toolTitle: "Student booking view",
    toolSubtitle: "A polished class page where students can understand the class and request a spot quickly.",
    visualTitle: "Booking feels simple",
    visualNote: "Students see level, price, time, and payment guidance before submitting.",
    proof: ["Class details are clear", "Request is captured", "Next steps are sent"],
    moments: ["Find the right class", "Register quickly", "Get next steps", "Stay connected"],
    previewRows: [
      ["Bollywood Beginner", "Sat 11:00 AM", "$25 drop-in"],
      ["Kids Showcase Team", "Sun 10:00 AM", "$180 batch"],
      ["BollyHop Lab", "Thu 7:30 PM", "$95 program"],
    ],
  },
  parent: {
    label: "Parent / learner",
    headline: "Keep families and learners clear after they register.",
    pain: "Parents and learners need reminders, receipts, class info, practice links, and updates in one reliable place.",
    promise: "Beyond8 keeps class details, messages, payment status, and learning resources easy to find.",
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=900&q=85",
    color: "#7c5cff",
    soft: "#f0edff",
    toolTitle: "Learner portal",
    toolSubtitle: "A calm space for class reminders, practice resources, payments, and instructor updates.",
    visualTitle: "Everything after booking stays clear",
    visualNote: "Learners know what class they joined, what to practice, and what still needs attention.",
    proof: ["Class reminder is visible", "Practice link is saved", "Payment status is clear"],
    moments: ["View class details", "Check reminders", "Watch practice links", "Track payment status"],
    previewRows: [
      ["Next class", "Sunday 10:00 AM", "Confirmed"],
      ["Practice video", "Showcase chorus", "Ready"],
      ["Payment", "$180 batch", "Pending"],
    ],
  },
} satisfies Record<StoryKey, {
  label: string;
  headline: string;
  pain: string;
  promise: string;
  image: string;
  color: string;
  soft: string;
  toolTitle: string;
  toolSubtitle: string;
  visualTitle: string;
  visualNote: string;
  proof: string[];
  moments: string[];
  previewRows: string[][];
}>;

const storyOrder: StoryKey[] = ["instructor", "student", "parent"];

const flow = [
  { icon: ImagePlus, title: "Create the offer", body: "Add the class, image, price, schedule, instructor, and details in a few minutes." },
  { icon: MousePointerClick, title: "Share one link", body: "Students see a polished page instead of a loose collection of posts and messages." },
  { icon: ClipboardList, title: "Manage the room", body: "Registrations, notes, payments, and exports are ready before class starts." },
];

const heroBenefits = [
  "Publish classes and workshops",
  "Collect student registrations",
  "Track payments, rosters, and follow-up",
];

export default function TryProduct() {
  const [activeStory, setActiveStory] = useState<StoryKey>("instructor");
  const selected = stories[activeStory];

  return (
    <div className="min-h-screen bg-[#fbf7f1] text-[#18131d]">
      <FloatingCta />

      <section className="relative overflow-hidden bg-[#fff4eb]">
        <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[#28123d] lg:block" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#fff0e6] blur-3xl" />
        <div className="absolute right-10 top-16 h-56 w-56 rounded-full bg-[#ff6b3d]/20 blur-3xl" />

        <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-6">
          <Beyond8Logo compact />
          <nav className="hidden items-center gap-2 rounded-full border border-white/60 bg-white/82 p-1.5 text-sm font-semibold text-[#28123d]/72 shadow-lg backdrop-blur md:flex">
            <button onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} className="px-3 transition hover:text-[#c2185b]">
              What it does
            </button>
            <button onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })} className="px-3 transition hover:text-[#c2185b]">
              For instructors
            </button>
            <a href="/portal" className="rounded-full bg-[#28123d] px-5 py-2 text-white shadow-lg transition hover:bg-[#3a1c54]">
              Open portal
            </a>
          </nav>
        </header>

        <div className="relative mx-auto grid min-h-[calc(86vh-88px)] max-w-7xl gap-10 px-4 pb-12 pt-4 md:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-6 h-px w-16 bg-[#c2185b]" />
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#c2185b]">Beyond the 8 counts</p>
            <h1 className="font-serif text-5xl font-bold leading-[1.02] text-[#28123d] md:text-7xl">
              You focus on the 8 counts.
              <span className="block text-[#c2185b]">We handle everything beyond.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#28123d]/78 md:text-lg">
              Beyond8 helps choreographers and instructors create class offers, manage registrations,
              organize student lists, track payments, send reminders, and grow their class community.
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {heroBenefits.map((item) => (
                <div key={item} className="rounded-2xl border border-[#eaded5] bg-white p-3 shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-[#c2185b]" />
                  <p className="mt-2 text-sm font-semibold leading-5 text-[#28123d]">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-[#28123d] px-8 text-white shadow-xl hover:bg-[#3a1c54]">
                <a href="/portal">Try Beyond8 now <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-[#c2185b]/30 bg-white px-8 text-[#28123d] hover:bg-[#fff0e6]"
                onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })}
              >
                See how it works <PlayCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <HeroProductPreview selected={selected} />
          </div>
        </div>
      </section>

      <section id="story" className="px-4 py-16 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-9 max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#bf4b3a]">Built for class communities</p>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight md:text-6xl">
              Instructors, students, and families stay aligned from booking to class day.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#665d6d]">
              Beyond8 connects booking pages, class rosters, student records, payment follow-up,
              and learner updates into one smooth workflow.
            </p>
          </div>

          <div className="mb-6 grid gap-3 rounded-[28px] border border-[#e8ded6] bg-white/72 p-3 shadow-sm md:grid-cols-4">
            {[
              "Publish classes",
              "Collect registrations",
              "Prepare class rosters",
              "Track payments",
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-[#fbf7f1] p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#18131d] text-xs font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-sm font-bold text-[#18131d]">{item}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {storyOrder.map((key) => {
              const item = stories[key];
              const active = activeStory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveStory(key)}
                  className={`rounded-[24px] border p-5 text-left transition duration-300 ${
                    active
                      ? "border-transparent bg-[#18131d] text-white shadow-xl"
                      : "border-[#e6ddd5] bg-white text-[#18131d] hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  <p className={`text-sm font-bold ${active ? "text-white/60" : "text-[#bf4b3a]"}`}>{item.label}</p>
                  <p className={`mt-3 text-lg font-semibold leading-6 ${active ? "text-white" : "text-[#18131d]"}`}>{item.headline}</p>
                  <p className={`mt-4 text-sm font-semibold ${active ? "text-white/62" : "text-[#665d6d]"}`}>
                    {item.moments.slice(0, 2).join(" · ")}
                  </p>
                </button>
              );
            })}
          </div>

          <PersonaShowcase selected={selected} />
        </div>
      </section>

      <section className="px-4 pb-16 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#bf4b3a]">The simple promise</p>
            <h2 className="mx-auto mt-3 max-w-3xl font-serif text-4xl font-bold leading-tight md:text-6xl">
              Instructors should spend more time teaching and less time holding class logistics together.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {flow.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-[28px] border border-[#e6ddd5] bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1e7de] text-[#bf4b3a]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-2xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#665d6d]">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-[32px] bg-[#18131d] p-6 text-center text-white shadow-2xl md:p-10">
            <h2 className="font-serif text-4xl font-bold">Ready to feel the portal?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/70">
              Create an account or sign in with email. After that, the portal becomes the product playground.
            </p>
            <Button asChild size="lg" className="mt-6 rounded-full bg-white px-8 text-[#18131d] hover:bg-white/90">
              <a href="/portal">Create account and enter portal</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Beyond8Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${compact ? "" : "mb-6"} flex items-center gap-3`}>
      <div className={`${compact ? "h-12 w-12 rounded-[18px]" : "h-14 w-14 rounded-2xl"} flex items-center justify-center overflow-hidden bg-[#28123d] shadow-xl`}>
        <img src="/brand/beyond8-icon-gradient.webp" alt="" className="h-full w-full object-cover" />
      </div>
      <div>
        <img src="/brand/beyond8-wordmark.webp" alt="BeyondEight" className={`${compact ? "h-7" : "h-9"} w-auto object-contain`} />
        <p className={`${compact ? "text-[10px]" : "text-xs"} mt-1 font-bold uppercase tracking-[0.18em] text-[#28123d]/58`}>Beyond the 8 counts</p>
      </div>
    </div>
  );
}

function HeroProductPreview({ selected }: { selected: typeof stories[StoryKey] }) {
  return (
    <div className="relative">
      <div className="absolute -left-10 top-8 hidden rounded-[28px] border border-white/10 bg-[#28123d] p-3 shadow-2xl xl:block">
        <img src="/brand/beyond8-primary-logo.webp" alt="BeyondEight logo" className="h-56 w-60 rounded-[20px] object-cover" />
      </div>

      <div className="ml-auto max-w-[720px] rounded-[34px] border border-white/12 bg-[#fff8f0] p-4 shadow-2xl lg:p-5">
        <div className="overflow-hidden rounded-[26px] border border-[#eaded5] bg-white">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[420px] overflow-hidden bg-[#28123d]">
              <img src={selected.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-72" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(40,18,61,.96),rgba(40,18,61,.34)_62%,transparent)]" />
              <div className="absolute left-5 top-5">
                <img src="/brand/beyond8-icon-gradient.webp" alt="" className="h-14 w-14 rounded-2xl shadow-xl" />
              </div>
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/58">Live class page</p>
                <h3 className="mt-2 font-serif text-4xl font-bold leading-tight">Spring Showcase Team</h3>
                <div className="mt-5 grid gap-2 text-sm font-semibold sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/12 p-3 backdrop-blur">Mon 7:00 PM</div>
                  <div className="rounded-2xl bg-white/12 p-3 backdrop-blur">24 students</div>
                  <div className="rounded-2xl bg-white/12 p-3 backdrop-blur">$350 program</div>
                  <div className="rounded-2xl bg-white/12 p-3 backdrop-blur">4 pending</div>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c2185b]">Instructor dashboard</p>
                  <h3 className="mt-2 font-serif text-3xl font-bold leading-tight text-[#28123d]">Everything beyond the choreography.</h3>
                </div>
                <div className="rounded-full bg-[#e8f4ef] px-3 py-1 text-xs font-bold text-[#2f7b6f]">Ready</div>
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  { icon: ImagePlus, title: "Class offer", body: "Public page, photo, schedule, price, and capacity are live." },
                  { icon: Users, title: "Student list", body: "Roster, notes, and payment status are ready before class." },
                  { icon: BellRing, title: "Follow-up", body: "Reminders and payment nudges stay connected to the class." },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="grid grid-cols-[42px_1fr] gap-3 rounded-2xl bg-[#fff4eb] p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#28123d] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#28123d]">{title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-[#6c5f72]">{body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#eaded5] bg-[#fbf7f1] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-[#28123d]">Today's next move</p>
                  <CreditCard className="h-4 w-4 text-[#c2185b]" />
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#eaded5]">
                  <div className="h-full w-[76%] rounded-full bg-[linear-gradient(90deg,#c2185b,#ff6b3d,#ffb26b)]" />
                </div>
                <p className="mt-3 text-sm leading-6 text-[#6c5f72]">
                  20 payments confirmed. 4 students need a reminder before rehearsal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductPoster({ selected, compact = false }: { selected: typeof stories[StoryKey]; compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-[24px] bg-white">
      <div className={`relative overflow-hidden ${compact ? "h-56" : "h-72 md:h-80"}`}>
        <img src={selected.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(24,19,29,.9),transparent_62%)]" />
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/68">{selected.label}</p>
          <h2 className={`${compact ? "text-2xl" : "text-3xl"} mt-2 font-serif font-bold leading-tight`}>{selected.headline}</h2>
        </div>
      </div>
      <div className="grid gap-3 p-4">
        {selected.moments.slice(0, compact ? 3 : selected.moments.length).map((moment, index) => (
          <div key={moment} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: index === 0 ? selected.soft : "#faf6f2" }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: selected.color }}>
              {index + 1}
            </div>
            <p className="text-sm font-semibold text-[#18131d]">{moment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonaShowcase({ selected }: { selected: typeof stories[StoryKey] }) {
  return (
    <div className="mt-8 overflow-hidden rounded-[36px] border border-[#e6ddd5] bg-white shadow-xl">
      <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative min-h-[520px] overflow-hidden">
          <img src={selected.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(24,19,29,.92),rgba(24,19,29,.32)_52%,transparent)]" />
          <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
            <Badge className="text-white" style={{ background: selected.color }}>{selected.label}</Badge>
            <div className="rounded-full bg-white/16 px-3 py-1 text-xs font-bold text-white backdrop-blur">Live preview</div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
            <h3 className="max-w-xl font-serif text-4xl font-bold leading-tight text-white md:text-5xl">
              {selected.headline}
            </h3>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-white/12 p-4 text-white backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/56">Before</p>
                <p className="mt-2 text-sm leading-6 text-white/80">{selected.pain}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 text-[#18131d]">
                <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: selected.color }}>With Beyond8</p>
                <p className="mt-2 text-sm leading-6 text-[#4f4656]">{selected.promise}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-7">
          <ToolPreview selected={selected} />
        </div>
      </div>
    </div>
  );
}

function ToolPreview({ selected }: { selected: typeof stories[StoryKey] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="rounded-[28px] p-5" style={{ background: selected.soft }}>
        <p className="text-sm font-bold uppercase tracking-[0.16em]" style={{ color: selected.color }}>{selected.toolTitle}</p>
        <h3 className="mt-3 font-serif text-4xl font-bold leading-tight text-[#18131d]">{selected.visualTitle}</h3>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5f5667]">{selected.toolSubtitle}</p>
      </div>

      <div className="mt-5 rounded-[28px] border border-[#e8ded6] bg-[#fbf7f1] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8b808f]">Workspace snapshot</p>
            <p className="mt-1 text-sm font-semibold text-[#18131d]">{selected.visualNote}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full text-white" style={{ background: selected.color }}>
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-3">
          {selected.previewRows.map(([primary, secondary, status], index) => (
            <div key={`${primary}-${status}`} className="grid grid-cols-[36px_1fr_auto] items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: index === 0 ? selected.color : "#18131d" }}>
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-bold text-[#18131d]">{primary}</p>
                <p className="text-xs text-[#746a7a]">{secondary}</p>
              </div>
              <p className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: selected.soft, color: selected.color }}>{status}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {selected.proof.map((item) => (
          <div key={item} className="rounded-2xl border border-[#e8ded6] bg-white p-4">
            <CheckCircle2 className="h-4 w-4" style={{ color: selected.color }} />
            <p className="mt-3 text-sm font-bold leading-5 text-[#18131d]">{item}</p>
          </div>
        ))}
      </div>

      <Button asChild className="mt-5 w-full rounded-full text-white" style={{ background: selected.color }}>
        <a href="/portal">Try this workspace <ArrowRight className="ml-2 h-4 w-4" /></a>
      </Button>
    </div>
  );
}

function FloatingCta() {
  return (
    <div className="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full border border-white/60 bg-white/92 p-2 shadow-2xl backdrop-blur md:bottom-6 md:left-auto md:right-6 md:max-w-sm md:translate-x-0">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 pl-3">
          <p className="truncate text-sm font-bold text-[#18131d]">Ready to try Beyond8?</p>
          <p className="truncate text-xs text-[#6c6373]">Create account, then enter the portal</p>
        </div>
        <Button asChild className="shrink-0 rounded-full bg-[#18131d] px-5 text-white hover:bg-[#2a2232]">
          <a href="/portal">Try now</a>
        </Button>
      </div>
    </div>
  );
}
