import { useState } from "react";
import {
  BellRing,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  ImagePlus,
  LayoutDashboard,
  Mail,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase";

const tabs = [
  { id: "launch", label: "Launch plan", icon: Sparkles },
  { id: "classes", label: "Classes", icon: CalendarCheck2 },
  { id: "students", label: "Students", icon: Users },
  { id: "payments", label: "Payments", icon: CreditCard },
];

const tasks = [
  { title: "Add your first class", body: "Name, instructor, schedule, price, capacity, and class image.", done: true },
  { title: "Share your booking page", body: "Students get one link with everything they need to register.", done: true },
  { title: "Prepare your roster", body: "Keep registered students, notes, and payment status together.", done: false },
  { title: "Confirm payment method", body: "Track paid, pending, waived, and refunded students.", done: false },
];

const classes = [
  { title: "Bollywood Beginner", tag: "Public class", status: "Live", note: "18 students registered" },
  { title: "Kids Showcase Team", tag: "Program", status: "Review", note: "4 payment follow-ups" },
  { title: "Private Coaching", tag: "1:1", status: "Draft", note: "Ready for image upload" },
];

const students = [
  { name: "Maya Shah", className: "Bollywood Beginner", status: "Paid" },
  { name: "Ari Patel", className: "Kids Showcase Team", status: "Pending" },
  { name: "Neha Rao", className: "BollyHop Performance Lab", status: "Paid" },
  { name: "Dev Mehta", className: "Private Coaching", status: "Follow up" },
];

export default function Portal() {
  const [active, setActive] = useState("launch");
  const { user, profile } = useAuth();
  const displayName = profile?.fullName || user?.email?.split("@")[0] || "Instructor";

  return (
    <div className="min-h-screen bg-[#f8f4ef] text-[#18131d]">
      <section className="px-4 py-10 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[34px] bg-[#18131d] p-6 text-white shadow-2xl md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <Badge className="mb-5 bg-white/12 text-white">Beyond8 Portal</Badge>
                <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
                  Welcome, {displayName}.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/72">
                  This is the workspace an instructor sees after account creation:
                  publish classes, track students, manage payments, and keep every class organized from one place.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Public page", value: "Ready", icon: LayoutDashboard },
                  { label: "First offer", value: "Live", icon: ImagePlus },
                  { label: "Roster", value: "Growing", icon: ClipboardList },
                  { label: "Follow-up", value: "Queued", icon: BellRing },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                    <Icon className="h-5 w-5 text-white/55" />
                    <p className="mt-5 font-serif text-2xl font-bold">{value}</p>
                    <p className="text-sm text-white/55">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="rounded-[28px] border border-[#e6ddd5] bg-white p-3 shadow-sm">
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
            </aside>

            <main className="rounded-[28px] border border-[#e6ddd5] bg-white p-5 shadow-sm md:p-6">
              {active === "launch" && <LaunchPlan />}
              {active === "classes" && <ClassesView />}
              {active === "students" && <StudentsView />}
              {active === "payments" && <PaymentsView />}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

function LaunchPlan() {
  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#bf4b3a]">Launch plan</p>
          <h2 className="mt-2 font-serif text-4xl font-bold">Your class hub is almost ready to share.</h2>
        </div>
        <Button className="w-fit rounded-full bg-[#18131d]">Preview public page</Button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {tasks.map((task) => (
          <div key={task.title} className="rounded-2xl border border-[#eee3dc] bg-[#fbf7f2] p-5">
            <div className="flex items-start gap-3">
              <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${task.done ? "bg-[#2f7b6f] text-white" : "bg-white text-[#bf4b3a]"}`}>
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold">{task.title}</h3>
                <p className="mt-1 text-sm leading-6 text-[#665d6d]">{task.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassesView() {
  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#bf4b3a]">Classes</p>
          <h2 className="mt-2 font-serif text-4xl font-bold">Offers students can actually understand.</h2>
        </div>
        <Button className="w-fit rounded-full bg-[#bf4b3a]">Add class</Button>
      </div>
      <div className="mt-6 grid gap-4">
        {classes.map((item) => (
          <div key={item.title} className="grid gap-4 rounded-2xl border border-[#eee3dc] bg-[#fbf7f2] p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <Badge variant="outline">{item.tag}</Badge>
              <h3 className="mt-3 font-serif text-2xl font-bold">{item.title}</h3>
              <p className="mt-1 text-sm text-[#665d6d]">{item.note}</p>
            </div>
            <Badge className={`${item.status === "Live" ? "bg-[#2f7b6f]" : item.status === "Review" ? "bg-[#bf4b3a]" : "bg-[#18131d]"} text-white`}>
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentsView() {
  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#bf4b3a]">Students</p>
          <h2 className="mt-2 font-serif text-4xl font-bold">Every registration becomes a useful record.</h2>
        </div>
        <Button variant="outline" className="w-fit rounded-full">Export CSV</Button>
      </div>
      <div className="mt-6 space-y-3">
        {students.map((student) => (
          <div key={student.name} className="grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-2xl bg-[#fbf7f2] p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#18131d] text-sm font-bold text-white">
              {student.name.split(" ").map((part) => part[0]).join("")}
            </div>
            <div>
              <h3 className="font-bold">{student.name}</h3>
              <p className="text-sm text-[#665d6d]">{student.className}</p>
            </div>
            <Badge className={`${student.status === "Paid" ? "bg-[#2f7b6f]" : "bg-[#bf4b3a]"} text-white`}>
              {student.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsView() {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#bf4b3a]">Payments</p>
      <h2 className="mt-2 font-serif text-4xl font-bold">No more wondering who paid.</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { title: "Received", value: "$2,840", body: "Confirmed payments from live classes." },
          { title: "Pending", value: "$540", body: "Students who need follow-up." },
          { title: "Waived", value: "$180", body: "Scholarship or comped registrations." },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-[#eee3dc] bg-[#fbf7f2] p-5">
            <p className="text-sm font-bold text-[#665d6d]">{item.title}</p>
            <p className="mt-3 font-serif text-4xl font-bold">{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-[#665d6d]">{item.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl bg-[#18131d] p-5 text-white">
        <div className="flex items-start gap-3">
          <Mail className="mt-1 h-5 w-5 text-white/60" />
          <div>
            <h3 className="font-serif text-2xl font-bold">Follow-up email ready</h3>
            <p className="mt-1 text-sm leading-6 text-white/65">Send payment reminders without leaving the class workflow.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
