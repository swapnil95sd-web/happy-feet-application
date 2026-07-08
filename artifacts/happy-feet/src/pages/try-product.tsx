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

type StoryKey = "owner" | "instructor" | "student";

const stories = {
  owner: {
    label: "Studio owner",
    headline: "From scattered messages to one calm studio workspace.",
    pain: "Before class day, you are checking DMs, Venmo, spreadsheets, class posts, and instructor texts.",
    promise: "StudioFlow gathers classes, registrations, payments, images, and rosters into one place.",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=900&q=85",
    color: "#2f7b6f",
    soft: "#e8f4ef",
    moments: ["Publish a class", "See who registered", "Mark payment received", "Export the roster"],
  },
  instructor: {
    label: "Instructor",
    headline: "Walk into the room knowing exactly who is coming.",
    pain: "Instructors lose time asking for rosters, payment updates, class notes, and who needs extra help.",
    promise: "Every class has a clear roster, notes, student context, and upcoming schedule.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85",
    color: "#bf4b3a",
    soft: "#fff0e9",
    moments: ["Open today’s roster", "Review notes", "Send a reminder", "Prepare check-in"],
  },
  student: {
    label: "Student",
    headline: "Students book without needing a back-and-forth conversation.",
    pain: "Interested students ask where, when, how much, what level, and how to pay.",
    promise: "Your public page answers the question, captures the request, and starts the follow-up.",
    image: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=900&q=85",
    color: "#7c5cff",
    soft: "#f0edff",
    moments: ["Find the right class", "Register quickly", "Receive next steps", "Stay connected"],
  },
} satisfies Record<StoryKey, {
  label: string;
  headline: string;
  pain: string;
  promise: string;
  image: string;
  color: string;
  soft: string;
  moments: string[];
}>;

const storyOrder: StoryKey[] = ["owner", "instructor", "student"];

const flow = [
  { icon: ImagePlus, title: "Create the offer", body: "Add the class, image, price, schedule, instructor, and details in a few minutes." },
  { icon: MousePointerClick, title: "Share one link", body: "Students see a polished page instead of a loose collection of posts and messages." },
  { icon: ClipboardList, title: "Manage the room", body: "Registrations, notes, payments, and exports are ready before class starts." },
];

const portalPreview = [
  { label: "Today", value: "Showcase Team", note: "Roster ready for check-in" },
  { label: "Needs attention", value: "Payment follow-up", note: "Two students pending" },
  { label: "Next move", value: "Send reminder", note: "Queued for tomorrow morning" },
];

export default function TryProduct() {
  const [activeStory, setActiveStory] = useState<StoryKey>("owner");
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
              Let a dance studio feel organized before they sign up.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80 md:text-lg">
              A story-first demo for owners and instructors: show the pain, show the flow,
              then invite them into a real portal workspace.
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
          <div className="mb-8 grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#bf4b3a]">Choose the point of view</p>
              <h2 className="mt-3 font-serif text-4xl font-bold leading-tight md:text-6xl">
                Make the product obvious in one click.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[#665d6d]">
              Instead of asking prospects to decode features, StudioFlow tells their daily story:
              what feels messy, what becomes simple, and where they go next.
            </p>
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
                </button>
              );
            })}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <StoryPanel selected={selected} />
            <PortalPreview selected={selected} />
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#bf4b3a]">The simple promise</p>
            <h2 className="mx-auto mt-3 max-w-3xl font-serif text-4xl font-bold leading-tight md:text-6xl">
              A studio should spend more time teaching and less time holding the business together.
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

function StoryPanel({ selected }: { selected: typeof stories[StoryKey] }) {
  return (
    <div className="rounded-[30px] border border-[#e6ddd5] bg-white p-6 shadow-sm md:p-8">
      <div className="grid gap-5 md:grid-cols-[180px_1fr]">
        <img src={selected.image} alt="" className="h-56 w-full rounded-[24px] object-cover md:h-full" />
        <div>
          <Badge className="mb-4 text-white" style={{ background: selected.color }}>{selected.label}</Badge>
          <h3 className="font-serif text-3xl font-bold leading-tight">{selected.headline}</h3>
          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl bg-[#fbf6f1] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#bf4b3a]">Before</p>
              <p className="mt-2 text-sm leading-6 text-[#665d6d]">{selected.pain}</p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: selected.soft }}>
              <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: selected.color }}>With StudioFlow</p>
              <p className="mt-2 text-sm leading-6 text-[#3d3544]">{selected.promise}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalPreview({ selected }: { selected: typeof stories[StoryKey] }) {
  return (
    <div className="rounded-[30px] border border-[#e6ddd5] bg-[#18131d] p-5 text-white shadow-xl md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/45">Portal preview</p>
          <h3 className="mt-2 font-serif text-3xl font-bold">Your next best action is clear.</h3>
        </div>
        <div className="hidden h-14 w-14 items-center justify-center rounded-full bg-white/10 md:flex">
          <CheckCircle2 className="h-6 w-6" style={{ color: selected.color }} />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {portalPreview.map((item, index) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/8 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: index === 0 ? selected.color : "rgba(255,255,255,.12)" }}>
                {index + 1}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">{item.label}</p>
                <p className="mt-1 font-serif text-xl font-bold">{item.value}</p>
                <p className="mt-1 text-sm text-white/62">{item.note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button asChild className="mt-6 w-full rounded-full text-white" style={{ background: selected.color }}>
        <a href="/portal">Enter portal <ArrowRight className="ml-2 h-4 w-4" /></a>
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
