import { useState } from "react";
import {
  useGetStudent,
  useGetStudentEnrollments,
  useListVideos,
  useListAnnouncements,
  getGetStudentQueryKey,
  getGetStudentEnrollmentsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, MapPin, User, Video, Megaphone, Star, Receipt, LayoutDashboard } from "lucide-react";

const DEMO_STUDENT_ID = 1;

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "classes", label: "My Classes", icon: CalendarDays },
  { id: "videos", label: "Practice Videos", icon: Video },
  { id: "showcase", label: "Showcase Hub", icon: Star },
  { id: "receipts", label: "Receipts", icon: Receipt },
];

export default function Portal() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: student, isLoading: studentLoading } = useGetStudent(DEMO_STUDENT_ID, {
    query: { queryKey: getGetStudentQueryKey(DEMO_STUDENT_ID) },
  });
  const { data: enrollments, isLoading: enrollmentsLoading } = useGetStudentEnrollments(DEMO_STUDENT_ID, {
    query: { queryKey: getGetStudentEnrollmentsQueryKey(DEMO_STUDENT_ID) },
  });
  const { data: videos } = useListVideos();
  const { data: announcements } = useListAnnouncements();

  const initials = student
    ? `${student.firstName[0]}${student.lastName[0]}`
    : "??";

  const nextClass = enrollments?.[0]?.class;

  return (
    <div className="min-h-screen bg-background">
      {/* Portal Hero */}
      <section
        className="py-12 px-4"
        style={{ background: "radial-gradient(circle at 80% 0, rgba(248,221,234,.9), transparent 40%), var(--color-background, #fffaf6)" }}
      >
        <div className="container max-w-6xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-1">Student Portal</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-secondary">
            Your space to grow.
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Track your classes, watch practice videos, follow the showcase, and access your receipts.
          </p>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-[240px_1fr] gap-6 mt-6">
          {/* Sidebar */}
          <aside className="space-y-1">
            {/* Student identity card */}
            <Card className="mb-4">
              <CardContent className="pt-5 pb-4 px-4">
                {studentLoading ? (
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-1"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-20" /></div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ background: "linear-gradient(135deg, #c0185a, #3a1f3a)" }}>
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-secondary text-sm leading-tight">
                        {student ? `${student.firstName} ${student.lastName}` : "Demo Student"}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{student?.studentType ?? "Adult"}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                data-testid={`nav-${id}`}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                  activeTab === id
                    ? "bg-secondary text-white"
                    : "text-muted-foreground hover:bg-card hover:text-secondary"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </aside>

          {/* Main Content */}
          <main>
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-secondary">
                      {studentLoading ? "Welcome back!" : `Hi ${student?.firstName ?? "there"}, ready for rehearsal?`}
                    </h2>
                    {nextClass && (
                      <p className="text-muted-foreground text-sm mt-1">
                        Next class: {nextClass.name} · {nextClass.scheduleDay} {nextClass.scheduleTime}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="border-primary text-primary hidden sm:flex">Demo Student</Badge>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-5">
                      <p className="text-3xl font-serif font-bold text-secondary">{enrollments?.length ?? 0}</p>
                      <p className="text-sm text-muted-foreground mt-1">Active Classes</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-5">
                      <p className="text-3xl font-serif font-bold text-secondary">{videos?.length ?? 0}</p>
                      <p className="text-sm text-muted-foreground mt-1">Practice Videos</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-5">
                      <p className="text-3xl font-serif font-bold text-secondary">{announcements?.length ?? 0}</p>
                      <p className="text-sm text-muted-foreground mt-1">Announcements</p>
                    </CardContent>
                  </Card>
                </div>

                {announcements && announcements.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold flex items-center gap-2 text-secondary">
                        <Megaphone className="w-4 h-4 text-primary" /> Latest Announcement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold text-secondary">{announcements[announcements.length - 1].title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{announcements[announcements.length - 1].message}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* My Classes Tab */}
            {activeTab === "classes" && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-secondary">My Classes</h2>
                {enrollmentsLoading ? (
                  <div className="space-y-3">{[1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
                ) : enrollments && enrollments.length > 0 ? (
                  enrollments.map((e) => (
                    <Card key={e.id} data-testid={`enrollment-card-${e.id}`}>
                      <CardContent className="pt-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-secondary">{e.class.name}</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{e.class.scheduleDay} {e.class.scheduleTime}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{e.class.location}</span>
                              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{e.class.instructor}</span>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200 shrink-0 capitalize">{e.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <CalendarDays className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No classes enrolled yet.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Practice Videos Tab */}
            {activeTab === "videos" && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-secondary">Practice Videos</h2>
                {videos && videos.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {videos.map((v) => (
                      <Card key={v.id} data-testid={`video-card-${v.id}`}>
                        <CardContent className="pt-5">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Video className="w-5 h-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-secondary text-sm">{v.title}</h3>
                              {v.className && <p className="text-xs text-primary mt-0.5">{v.className}</p>}
                              {v.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{v.description}</p>}
                              <a
                                href={v.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid={`video-link-${v.id}`}
                                className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-2 hover:underline"
                              >
                                Watch Video
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Video className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No videos uploaded yet.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Showcase Hub Tab */}
            {activeTab === "showcase" && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-secondary">Showcase Hub</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="w-6 h-6 text-accent" />
                      <h3 className="font-semibold text-secondary text-lg">Spring 2026 Showcase</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, #3a1f3a15, #c0185a10)" }}>
                        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Costume Theme</p>
                        <p className="font-semibold text-secondary">Black + Gold</p>
                        <p className="text-sm text-muted-foreground mt-1">Finalized — details shared in portal messages</p>
                      </div>
                      <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, #c98b2f15, #c0185a10)" }}>
                        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Next Run-Through</p>
                        <p className="font-semibold text-secondary">This Sunday</p>
                        <p className="text-sm text-muted-foreground mt-1">Review chorus video before rehearsal — bring sneakers</p>
                      </div>
                    </div>
                    <div className="rounded-xl border p-4 mt-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Showcase Timeline</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Registration closes</span><span className="font-semibold text-secondary">July 12</span></div>
                        <div className="flex justify-between"><span>Costume fittings</span><span className="font-semibold text-secondary">July 20–25</span></div>
                        <div className="flex justify-between"><span>Dress rehearsal</span><span className="font-semibold text-secondary">Aug 10</span></div>
                        <div className="flex justify-between"><span>Performance night</span><span className="font-semibold text-secondary">Aug 17</span></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Receipts Tab */}
            {activeTab === "receipts" && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-secondary">Receipts</h2>
                {enrollmentsLoading ? (
                  <div className="space-y-3">{[1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
                ) : enrollments && enrollments.length > 0 ? (
                  enrollments.map((e) => (
                    <Card key={e.id} data-testid={`receipt-card-${e.id}`}>
                      <CardContent className="pt-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-secondary">{e.class.name}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {e.class.location} · Enrolled {new Date(e.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-secondary">${e.class.price}</p>
                            <p className="text-xs text-muted-foreground">{e.class.pricePeriod}</p>
                            <Badge className="mt-1 bg-green-100 text-green-800 border-green-200 text-xs capitalize">{e.status}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Receipt className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No receipts yet.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
