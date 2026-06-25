import { useState, useCallback } from "react";
import {
  useGetDashboardSummary,
  useGetRecentEnrollments,
  useGetWeeklySchedule,
  useListStudents,
  useListAnnouncements,
  useListClasses,
  useListVideos,
  useCreateClass,
  useCreateAnnouncement,
  useCreateVideo,
  useDeleteAnnouncement,
  useDeleteVideo,
  getGetDashboardSummaryQueryKey,
  getGetRecentEnrollmentsQueryKey,
  getGetWeeklyScheduleQueryKey,
  getListStudentsQueryKey,
  getListAnnouncementsQueryKey,
  getListClassesQueryKey,
  getListVideosQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Users, BookOpen, CalendarDays, Megaphone, Trash2, Video,
  Plus, LayoutDashboard, UserCheck, Settings
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "classes", label: "Classes", icon: BookOpen },
  { id: "students", label: "Students", icon: UserCheck },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "videos", label: "Videos", icon: Video },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary({
    query: { queryKey: getGetDashboardSummaryQueryKey() },
  });
  const { data: recentEnrollments, isLoading: recentLoading } = useGetRecentEnrollments({
    query: { queryKey: getGetRecentEnrollmentsQueryKey() },
  });
  const { data: schedule, isLoading: scheduleLoading } = useGetWeeklySchedule({
    query: { queryKey: getGetWeeklyScheduleQueryKey() },
  });
  const { data: students, isLoading: studentsLoading } = useListStudents({
    query: { queryKey: getListStudentsQueryKey() },
  });
  const { data: announcements } = useListAnnouncements({
    query: { queryKey: getListAnnouncementsQueryKey() },
  });
  const { data: classes } = useListClasses(undefined, {
    query: { queryKey: getListClassesQueryKey() },
  });
  const { data: videos } = useListVideos(undefined, {
    query: { queryKey: getListVideosQueryKey() },
  });

  // Mutations
  const createClass = useCreateClass();
  const createAnnouncement = useCreateAnnouncement();
  const createVideo = useCreateVideo();
  const deleteAnnouncement = useDeleteAnnouncement();
  const deleteVideo = useDeleteVideo();

  // Class form state
  const [classForm, setClassForm] = useState({
    name: "", style: "", description: "", instructor: "Anitha Prakash",
    location: "", scheduleDay: "", scheduleTime: "", price: "",
    pricePeriod: "batch", duration: "8-week batch", ageGroup: "Adults",
    category: "adults", capacity: "20", spotsAvailable: "20",
    colorScheme: "linear-gradient(135deg, #c0185a, #3a1f3a)",
  });

  const handleCreateClass = () => {
    if (!classForm.name || !classForm.location) {
      toast({ title: "Missing fields", description: "Please fill in required fields.", variant: "destructive" });
      return;
    }
    createClass.mutate(
      {
        data: {
          ...classForm,
          price: Number(classForm.price),
          capacity: Number(classForm.capacity),
          spotsAvailable: Number(classForm.spotsAvailable),
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Class added!", description: `${classForm.name} is now live.` });
          queryClient.invalidateQueries({ queryKey: getListClassesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          setClassForm({ ...classForm, name: "", description: "", location: "", scheduleDay: "", scheduleTime: "", price: "" });
        },
        onError: () => toast({ title: "Error", description: "Could not create class.", variant: "destructive" }),
      }
    );
  };

  // Announcement form
  const [annForm, setAnnForm] = useState({ title: "", message: "" });
  const handleCreateAnnouncement = () => {
    if (!annForm.title || !annForm.message) {
      toast({ title: "Missing fields", variant: "destructive" });
      return;
    }
    createAnnouncement.mutate(
      { data: annForm },
      {
        onSuccess: () => {
          toast({ title: "Announcement posted!" });
          queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          setAnnForm({ title: "", message: "" });
        },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      }
    );
  };

  const handleDeleteAnnouncement = (id: number) => {
    deleteAnnouncement.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Announcement deleted." });
        queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      },
    });
  };

  // Video form
  const [videoForm, setVideoForm] = useState({ title: "", url: "", description: "", classId: "" });
  const handleCreateVideo = () => {
    if (!videoForm.title || !videoForm.url) {
      toast({ title: "Missing fields", variant: "destructive" });
      return;
    }
    createVideo.mutate(
      { data: { title: videoForm.title, url: videoForm.url, description: videoForm.description || undefined, classId: videoForm.classId ? Number(videoForm.classId) : undefined } },
      {
        onSuccess: () => {
          toast({ title: "Video added!" });
          queryClient.invalidateQueries({ queryKey: getListVideosQueryKey() });
          setVideoForm({ title: "", url: "", description: "", classId: "" });
        },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      }
    );
  };

  const handleDeleteVideo = (id: number) => {
    deleteVideo.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Video removed." });
        queryClient.invalidateQueries({ queryKey: getListVideosQueryKey() });
      },
    });
  };

  const statCards = [
    { label: "Active Students", value: summary?.totalStudents, icon: Users, color: "text-primary" },
    { label: "Open Classes", value: summary?.activeClasses, icon: BookOpen, color: "text-secondary" },
    { label: "Total Enrollments", value: summary?.totalEnrollments, icon: CalendarDays, color: "text-accent" },
    { label: "Announcements This Month", value: summary?.announcementsThisMonth, icon: Megaphone, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section
        className="py-10 px-4"
        style={{ background: "radial-gradient(circle at 20% 0, rgba(58,31,58,.08), transparent 40%)" }}
      >
        <div className="container max-w-6xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-1">Admin View</p>
          <h1 className="font-serif text-4xl font-bold text-secondary">
            Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage classes, students, announcements, and videos.
          </p>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-[200px_1fr] gap-6 mt-4">
          {/* Sidebar */}
          <aside className="space-y-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                data-testid={`admin-nav-${id}`}
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

          {/* Main */}
          <main className="min-w-0">

            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {statCards.map(({ label, value, icon: Icon, color }) => (
                    <Card key={label}>
                      <CardContent className="pt-5">
                        <Icon className={`w-5 h-5 mb-2 ${color}`} />
                        {summaryLoading ? (
                          <Skeleton className="h-9 w-16 mb-1" />
                        ) : (
                          <p className="text-3xl font-serif font-bold text-secondary">{value ?? 0}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">{label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent Enrollments */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-secondary">Recent Registrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentLoading ? (
                      <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-10 rounded" />)}</div>
                    ) : recentEnrollments && recentEnrollments.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm" data-testid="recent-enrollments-table">
                          <thead>
                            <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                              <th className="text-left pb-2 font-semibold">Student</th>
                              <th className="text-left pb-2 font-semibold">Program</th>
                              <th className="text-left pb-2 font-semibold hidden sm:table-cell">Location</th>
                              <th className="text-left pb-2 font-semibold">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentEnrollments.map((e) => (
                              <tr key={e.id} className="border-b last:border-0" data-testid={`enrollment-row-${e.id}`}>
                                <td className="py-2.5 font-medium text-secondary">{e.student.firstName} {e.student.lastName}</td>
                                <td className="py-2.5 text-muted-foreground">{e.class.name}</td>
                                <td className="py-2.5 text-muted-foreground hidden sm:table-cell">{e.class.location}</td>
                                <td className="py-2.5"><Badge className="bg-green-100 text-green-800 border-green-200 text-xs capitalize">{e.status}</Badge></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No enrollments yet.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Weekly Schedule */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-secondary">Weekly Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {scheduleLoading ? (
                      <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-10 rounded" />)}</div>
                    ) : schedule && schedule.length > 0 ? (
                      <div className="space-y-2">
                        {schedule.map((s, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b last:border-0" data-testid={`schedule-row-${i}`}>
                            <div>
                              <span className="font-semibold text-secondary text-sm">{s.day}</span>
                              <span className="text-muted-foreground text-sm ml-2">{s.className}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{s.time}</span>
                              <span className="hidden sm:inline">{s.location}</span>
                              <Badge variant="outline" className="text-xs">{s.enrolledCount}/{s.capacity}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No classes scheduled.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Classes Tab */}
            {activeTab === "classes" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-secondary flex items-center gap-2"><Plus className="w-4 h-4" /> Add New Class</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="class-name">Class Name *</Label>
                        <Input id="class-name" data-testid="input-class-name" placeholder="e.g. Bollywood Performance Lab" value={classForm.name} onChange={e => setClassForm({ ...classForm, name: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="class-style">Style *</Label>
                        <Input id="class-style" data-testid="input-class-style" placeholder="e.g. Bollywood, BollyHop" value={classForm.style} onChange={e => setClassForm({ ...classForm, style: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="class-location">Location *</Label>
                        <Input id="class-location" data-testid="input-class-location" placeholder="e.g. Jersey City Studio" value={classForm.location} onChange={e => setClassForm({ ...classForm, location: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="class-instructor">Instructor</Label>
                        <Input id="class-instructor" data-testid="input-class-instructor" value={classForm.instructor} onChange={e => setClassForm({ ...classForm, instructor: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="class-day">Schedule Day</Label>
                        <Input id="class-day" data-testid="input-class-day" placeholder="e.g. Monday" value={classForm.scheduleDay} onChange={e => setClassForm({ ...classForm, scheduleDay: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="class-time">Schedule Time</Label>
                        <Input id="class-time" data-testid="input-class-time" placeholder="e.g. 7:00 PM" value={classForm.scheduleTime} onChange={e => setClassForm({ ...classForm, scheduleTime: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="class-price">Price ($)</Label>
                        <Input id="class-price" data-testid="input-class-price" type="number" placeholder="180" value={classForm.price} onChange={e => setClassForm({ ...classForm, price: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="class-category">Category</Label>
                        <Select value={classForm.category} onValueChange={v => setClassForm({ ...classForm, category: v })}>
                          <SelectTrigger id="class-category" data-testid="select-class-category"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kids">Kids</SelectItem>
                            <SelectItem value="adults">Adults</SelectItem>
                            <SelectItem value="showcase">Showcase</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="class-desc">Description</Label>
                      <Textarea id="class-desc" data-testid="input-class-description" placeholder="Describe the class..." value={classForm.description} onChange={e => setClassForm({ ...classForm, description: e.target.value })} />
                    </div>
                    <Button data-testid="button-add-class" onClick={handleCreateClass} disabled={createClass.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      {createClass.isPending ? "Adding..." : "Add Class"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Existing classes — expandable */}
                <ExpandableClassList classes={classes ?? []} />
              </div>
            )}

            {/* Students Tab */}
            {activeTab === "students" && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-secondary">Student Roster</h2>
                <Card>
                  <CardContent className="pt-4">
                    {studentsLoading ? (
                      <div className="space-y-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-12 rounded" />)}</div>
                    ) : students && students.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm" data-testid="students-table">
                          <thead>
                            <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                              <th className="text-left pb-2 font-semibold">Name</th>
                              <th className="text-left pb-2 font-semibold hidden sm:table-cell">Email</th>
                              <th className="text-left pb-2 font-semibold hidden md:table-cell">Phone</th>
                              <th className="text-left pb-2 font-semibold">Type</th>
                              <th className="text-left pb-2 font-semibold hidden sm:table-cell">Enrolled</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((s) => (
                              <tr key={s.id} className="border-b last:border-0" data-testid={`student-row-${s.id}`}>
                                <td className="py-2.5 font-medium text-secondary">{s.firstName} {s.lastName}</td>
                                <td className="py-2.5 text-muted-foreground hidden sm:table-cell">{s.email}</td>
                                <td className="py-2.5 text-muted-foreground hidden md:table-cell">{s.phone}</td>
                                <td className="py-2.5 capitalize text-muted-foreground">{s.studentType}</td>
                                <td className="py-2.5 text-muted-foreground hidden sm:table-cell">{new Date(s.createdAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground py-4">No students registered yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Announcements Tab */}
            {activeTab === "announcements" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-secondary flex items-center gap-2"><Plus className="w-4 h-4" /> Post Announcement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="ann-title">Title</Label>
                      <Input id="ann-title" data-testid="input-announcement-title" placeholder="e.g. Showcase registration is open" value={annForm.title} onChange={e => setAnnForm({ ...annForm, title: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="ann-message">Message</Label>
                      <Textarea id="ann-message" data-testid="input-announcement-message" placeholder="Write your announcement..." value={annForm.message} onChange={e => setAnnForm({ ...annForm, message: e.target.value })} />
                    </div>
                    <Button data-testid="button-post-announcement" onClick={handleCreateAnnouncement} disabled={createAnnouncement.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      {createAnnouncement.isPending ? "Posting..." : "Post Announcement"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-base font-semibold text-secondary">All Announcements</CardTitle></CardHeader>
                  <CardContent>
                    {announcements && announcements.length > 0 ? (
                      <div className="space-y-3">
                        {announcements.map((a) => (
                          <div key={a.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-card border" data-testid={`announcement-${a.id}`}>
                            <div>
                              <p className="font-semibold text-secondary text-sm">{a.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{a.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{new Date(a.publishedAt).toLocaleDateString()}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="text-destructive shrink-0" data-testid={`delete-announcement-${a.id}`} onClick={() => handleDeleteAnnouncement(a.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No announcements yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Videos Tab */}
            {activeTab === "videos" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-secondary flex items-center gap-2"><Plus className="w-4 h-4" /> Upload Practice Video</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="video-title">Title *</Label>
                        <Input id="video-title" data-testid="input-video-title" placeholder="e.g. BollyHop Chorus Breakdown" value={videoForm.title} onChange={e => setVideoForm({ ...videoForm, title: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="video-url">Video URL *</Label>
                        <Input id="video-url" data-testid="input-video-url" placeholder="https://youtube.com/..." value={videoForm.url} onChange={e => setVideoForm({ ...videoForm, url: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="video-class">Link to Class (optional)</Label>
                      <Select value={videoForm.classId} onValueChange={v => setVideoForm({ ...videoForm, classId: v })}>
                        <SelectTrigger id="video-class" data-testid="select-video-class"><SelectValue placeholder="Select a class..." /></SelectTrigger>
                        <SelectContent>
                          {classes?.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="video-desc">Description</Label>
                      <Textarea id="video-desc" data-testid="input-video-description" placeholder="Notes for students..." value={videoForm.description} onChange={e => setVideoForm({ ...videoForm, description: e.target.value })} />
                    </div>
                    <Button data-testid="button-upload-video" onClick={handleCreateVideo} disabled={createVideo.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      {createVideo.isPending ? "Adding..." : "Add Video"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-base font-semibold text-secondary">All Videos</CardTitle></CardHeader>
                  <CardContent>
                    {videos && videos.length > 0 ? (
                      <div className="space-y-2">
                        {videos.map((v) => (
                          <div key={v.id} className="flex items-center justify-between gap-3 py-2 border-b last:border-0" data-testid={`video-row-${v.id}`}>
                            <div>
                              <p className="font-medium text-secondary text-sm">{v.title}</p>
                              {v.className && <p className="text-xs text-primary">{v.className}</p>}
                            </div>
                            <Button variant="ghost" size="icon" className="text-destructive shrink-0" data-testid={`delete-video-${v.id}`} onClick={() => handleDeleteVideo(v.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No videos yet.</p>
                    )}
                  </CardContent>
                </Card>
            </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}

type ClassEnrollment = {
  id: number;
  status: string;
  createdAt: string;
  student: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    studentType: string;
    createdAt: string;
  };
};

function ExpandableClassList({ classes }: { classes: any[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [enrollments, setEnrollments] = useState<Record<number, ClassEnrollment[]>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  const toggleClass = useCallback(async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (enrollments[id]) return;
    setLoading((l) => ({ ...l, [id]: true }));
    try {
      const res = await fetch(`/api/classes/${id}/enrollments`);
      const data: ClassEnrollment[] = await res.json();
      setEnrollments((e) => ({ ...e, [id]: data }));
    } catch {
      toast({ title: "Could not load students.", variant: "destructive" });
    } finally {
      setLoading((l) => ({ ...l, [id]: false }));
    }
  }, [expandedId, enrollments, toast]);

  const updateStatus = async (enrollmentId: number, classId: number, newStatus: string) => {
    try {
      await fetch(`/api/enrollments/${enrollmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setEnrollments((e) => ({
        ...e,
        [classId]: (e[classId] ?? []).map((en) =>
          en.id === enrollmentId ? { ...en, status: newStatus } : en
        ),
      }));
      toast({ title: "Status updated." });
    } catch {
      toast({ title: "Could not update status.", variant: "destructive" });
    }
  };

  const STATUS_CYCLE: Record<string, string> = {
    confirmed: "waitlisted",
    waitlisted: "cancelled",
    cancelled: "confirmed",
  };

  const STATUS_STYLE: Record<string, string> = {
    confirmed: "bg-green-100 text-green-800 border-green-200",
    waitlisted: "bg-yellow-100 text-yellow-800 border-yellow-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  if (!classes.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">No classes yet.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-secondary">Current Classes</CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">Click a class name to see enrolled students.</p>
      </CardHeader>
      <CardContent className="p-0">
        <div>
          {classes.map((c, idx) => {
            const isOpen = expandedId === c.id;
            const rows = enrollments[c.id] ?? [];
            const isLoading = loading[c.id];
            return (
              <div key={c.id} className={idx < classes.length - 1 ? "border-b" : ""}>
                {/* Class row — clickable */}
                <button
                  className="w-full flex items-center justify-between px-6 py-3.5 text-left transition-colors hover:bg-muted/40"
                  onClick={() => toggleClass(c.id)}
                  data-testid={`class-row-${c.id}`}
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-secondary text-sm truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {c.scheduleDay} {c.scheduleTime} · {c.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-sm font-bold text-secondary">${c.price}</span>
                    <Badge variant="outline" className="text-xs">{c.capacity - c.spotsAvailable}/{c.capacity}</Badge>
                    <svg
                      className="w-4 h-4 text-muted-foreground transition-transform duration-200"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded student list */}
                {isOpen && (
                  <div className="px-6 pb-4 pt-1" style={{ background: "rgba(58,31,58,0.02)" }}>
                    {isLoading ? (
                      <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading students...
                      </div>
                    ) : rows.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-3">No students enrolled yet.</p>
                    ) : (
                      <div className="rounded-xl overflow-hidden border mt-1">
                        <table className="w-full text-sm">
                          <thead>
                            <tr style={{ background: "rgba(58,31,58,0.05)" }}>
                              <th className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Student</th>
                              <th className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Email</th>
                              <th className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Phone</th>
                              <th className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Enrolled</th>
                              <th className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((en, i) => (
                              <tr key={en.id} className={i < rows.length - 1 ? "border-t" : ""}>
                                <td className="px-4 py-2.5 font-medium text-secondary whitespace-nowrap">
                                  {en.student.firstName} {en.student.lastName}
                                  <span className="ml-1.5 text-xs text-muted-foreground capitalize hidden sm:inline">
                                    ({en.student.studentType})
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">{en.student.email}</td>
                                <td className="px-4 py-2.5 text-muted-foreground hidden md:table-cell">{en.student.phone}</td>
                                <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell text-xs">
                                  {new Date(en.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2.5">
                                  <button
                                    title="Click to cycle status"
                                    onClick={() => updateStatus(en.id, c.id, STATUS_CYCLE[en.status] ?? "confirmed")}
                                    className={`text-xs font-semibold capitalize px-2.5 py-1 rounded-full border cursor-pointer transition-all hover:opacity-80 ${STATUS_STYLE[en.status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
                                  >
                                    {en.status}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
