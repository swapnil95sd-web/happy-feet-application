import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Building2, CircleDollarSign, ExternalLink, LayoutDashboard, Plus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  createPlatformStudio,
  listPlatformStudios,
  type CreateStudioInput,
  type PlatformStudio,
} from "@/lib/studioflow";

const EMPTY_FORM: CreateStudioInput = {
  name: "",
  slug: "",
  ownerEmail: "",
  contactEmail: "",
  contactPhone: "",
  paymentLabel: "Venmo",
  paymentHandle: "",
  primaryColor: "#c0185a",
  secondaryColor: "#3a1f3a",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

const STUDIO_PUBLIC_URLS: Record<string, string> = {
  "happy-feet": "https://happy-feet-application-api-server.vercel.app/",
  "happy-feet-dance-academy": "https://happy-feet-application-api-server.vercel.app/",
  tanvi: "https://tanvi-dance-academy-iota.vercel.app/",
  "tanvi-dance-academy": "https://tanvi-dance-academy-iota.vercel.app/",
};

function studioPublicUrl(studio: PlatformStudio) {
  const slug = studio.slug.toLowerCase();
  const name = studio.name.toLowerCase();
  if (STUDIO_PUBLIC_URLS[slug]) return STUDIO_PUBLIC_URLS[slug];
  if (slug.includes("tanvi") || name.includes("tanvi")) return STUDIO_PUBLIC_URLS.tanvi;
  if (slug.includes("happy") || name.includes("happy feet")) return STUDIO_PUBLIC_URLS["happy-feet"];
  return `https://${slug}.vercel.app/`;
}

export default function PlatformAdmin() {
  const [studios, setStudios] = useState<PlatformStudio[]>([]);
  const [form, setForm] = useState<CreateStudioInput>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const totals = useMemo(() => ({
    studios: studios.length,
    classes: studios.reduce((sum, studio) => sum + studio.classCount, 0),
    bookings: studios.reduce((sum, studio) => sum + studio.bookingCount, 0),
    pending: studios.reduce((sum, studio) => sum + studio.pendingPaymentCount, 0),
  }), [studios]);

  const refresh = async () => {
    setIsLoading(true);
    try {
      setStudios(await listPlatformStudios());
    } catch (error) {
      toast({
        title: "Could not load studios",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const updateName = (name: string) => {
    setForm((current) => ({
      ...current,
      name,
      slug: current.slug ? current.slug : slugify(name),
      contactEmail: current.contactEmail || current.ownerEmail,
    }));
  };

  const save = async () => {
    setIsSaving(true);
    try {
      await createPlatformStudio({ ...form, slug: slugify(form.slug || form.name) });
      toast({ title: "Studio created." });
      setForm(EMPTY_FORM);
      await refresh();
    } catch (error) {
      toast({
        title: "Could not create studio",
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="px-4 py-10" style={{ background: "radial-gradient(circle at 20% 0, rgba(58,31,58,.08), transparent 40%)" }}>
        <div className="container mx-auto max-w-6xl">
          <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-primary">StudioFlow Platform</p>
          <h1 className="font-serif text-4xl font-bold text-secondary">Platform Admin</h1>
          <p className="mt-1 text-muted-foreground">Create studios, assign owners, and monitor client health from one place.</p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl space-y-6 px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Studios", value: totals.studios, icon: Building2 },
            { label: "Classes", value: totals.classes, icon: LayoutDashboard },
            { label: "Bookings", value: totals.bookings, icon: Users },
            { label: "Pending payments", value: totals.pending, icon: CircleDollarSign },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="flex items-center justify-between pt-5">
                <div>
                  <p className="font-serif text-3xl font-bold text-secondary">{value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                </div>
                <Icon className="h-6 w-6 text-primary" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-secondary">
                <Plus className="h-4 w-4" />
                Create New Studio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Studio name">
                <Input value={form.name} onChange={(event) => updateName(event.target.value)} placeholder="Example Dance Academy" />
              </Field>
              <Field label="Studio slug">
                <Input value={form.slug} onChange={(event) => setForm({ ...form, slug: slugify(event.target.value) })} placeholder="example-dance-academy" />
              </Field>
              <Field label="Owner email">
                <Input type="email" value={form.ownerEmail} onChange={(event) => setForm({ ...form, ownerEmail: event.target.value, contactEmail: form.contactEmail || event.target.value })} placeholder="owner@example.com" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Contact email">
                  <Input value={form.contactEmail ?? ""} onChange={(event) => setForm({ ...form, contactEmail: event.target.value })} />
                </Field>
                <Field label="Contact phone">
                  <Input value={form.contactPhone ?? ""} onChange={(event) => setForm({ ...form, contactPhone: event.target.value })} />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Payment label">
                  <Input value={form.paymentLabel ?? ""} onChange={(event) => setForm({ ...form, paymentLabel: event.target.value })} />
                </Field>
                <Field label="Payment handle">
                  <Input value={form.paymentHandle ?? ""} onChange={(event) => setForm({ ...form, paymentHandle: event.target.value })} placeholder="@StudioName" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Primary color">
                  <Input type="color" value={form.primaryColor} onChange={(event) => setForm({ ...form, primaryColor: event.target.value })} className="h-10" />
                </Field>
                <Field label="Secondary color">
                  <Input type="color" value={form.secondaryColor} onChange={(event) => setForm({ ...form, secondaryColor: event.target.value })} className="h-10" />
                </Field>
              </div>
              <Button onClick={save} disabled={isSaving || !form.name || !form.ownerEmail} className="w-full">
                {isSaving ? "Creating..." : "Create Studio"}
              </Button>
              <p className="text-xs leading-relaxed text-muted-foreground">
                This creates the studio, assigns the owner, and seeds starter homepage content. The owner can log in after the matching deployment/domain uses this studio slug.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base text-secondary">Studios</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading studios...</p>
              ) : studios.length ? (
                studios.map((studio) => (
                  <div key={studio.id} className="rounded-xl border p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={studioPublicUrl(studio)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-serif text-xl font-bold text-secondary transition-colors hover:text-primary"
                            title={`Open ${studio.name}`}
                          >
                            {studio.name}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          <Badge variant={studio.status === "active" ? "default" : "outline"}>{studio.status}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">/{studio.slug}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{studioPublicUrl(studio)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{studio.contactEmail || "No contact email"} · {studio.paymentHandle || "No payment handle"}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <Metric label="Classes" value={studio.classCount} />
                        <Metric label="Bookings" value={studio.bookingCount} />
                        <Metric label="Pending" value={studio.pendingPaymentCount} />
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {studio.owners.length ? studio.owners.map((owner) => (
                        <Badge key={owner} variant="outline">{owner}</Badge>
                      )) : <Badge variant="outline">No owner</Badge>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No studios found. Create your first studio to begin.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted px-3 py-2">
      <p className="font-serif text-lg font-bold text-secondary">{value}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
