import { useState } from "react";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  ImagePlus,
  Mail,
  MessageSquareText,
  MousePointerClick,
  PlayCircle,
  Sparkles,
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
    promise: "StudioFlow gives instructors one place to publish classes, collect requests, see rosters, and follow up.",
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
    promise: "Each class page makes the schedule, level, price, and next steps simple before they register.",
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
    promise: "StudioFlow keeps class details, messages, payment status, and learning resources easy to find.",
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

export default function TryProduct() {
  const [activeStory, setActiveStory] = useState<StoryKey>("instructor");
  const selected = stories[activeStory];

  return (
    <div className="min-h-screen bg-[#fbf7f1] text-[#18131d]">
      <FloatingCta />

      <section className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1800&q=85"
          alt="Dance class in motion"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(12,9,16,.94),rgba(34,25,43,.86)_52%,rgba(191,75,58,.44))]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(to_top,#fbf7f1,transparent)]" />

        <div className="relative mx-auto grid min-h-[84vh] max-w-7xl gap-10 px-4 py-14 md:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="max-w-2xl text-white">
            <Badge className="mb-5 border-white/20 bg-white/12 text-white backdrop-blur">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              StudioFlow product preview
            </Badge>
            <h1 className="font-serif text-5xl font-bold leading-[1.02] md:text-7xl">
              Run your classes from one beautiful workspace.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80 md:text-lg">
              StudioFlow helps instructors publish classes, collect registrations, track payments,
              manage student lists, and keep learners informed before and after class.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-white px-8 text-[#18131d] shadow-xl hover:bg-white/90">
                <a href="/portal">Try it now <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 px-8 text-white backdrop-blur hover:bg-white/18"
                onClick={() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" })}
              >
                See how it works <PlayCircle className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[32px] border border-white/18 bg-white/88 p-3 shadow-2xl backdrop-blur-xl md:p-4">
              <ProductPoster selected={selected} />
            </div>
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
              StudioFlow connects booking pages, class rosters, student records, payment follow-up,
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

function ProductPoster({ selected }: { selected: typeof stories[StoryKey] }) {
  return (
    <div className="overflow-hidden rounded-[24px] bg-white">
      <div className="relative h-72 overflow-hidden md:h-80">
        <img src={selected.image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(24,19,29,.9),transparent_62%)]" />
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/68">{selected.label}</p>
          <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">{selected.headline}</h2>
        </div>
      </div>
      <div className="grid gap-3 p-4">
        {selected.moments.map((moment, index) => (
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
                <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: selected.color }}>With StudioFlow</p>
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
    <div className="fixed bottom-4 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full border border-white/60 bg-white/92 p-2 shadow-2xl backdrop-blur md:bottom-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 pl-3">
          <p className="truncate text-sm font-bold text-[#18131d]">Ready to try StudioFlow?</p>
          <p className="truncate text-xs text-[#6c6373]">Create account, then enter the portal</p>
        </div>
        <Button asChild className="shrink-0 rounded-full bg-[#18131d] px-5 text-white hover:bg-[#2a2232]">
          <a href="/portal">Try now</a>
        </Button>
      </div>
    </div>
  );
}
