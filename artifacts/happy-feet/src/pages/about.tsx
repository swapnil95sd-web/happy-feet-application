import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, HeartHandshake, Instagram, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_HOMEPAGE, useHomepageContent, useInstructors } from "@/lib/studioflow";

export default function About() {
  const { data: homepage } = useHomepageContent();
  const { data: instructors } = useInstructors();
  const visibleInstructors = instructors.filter((instructor) => instructor.isActive);

  useEffect(() => {
    if (!homepage.instagramUrls.length) return;
    const existing = document.querySelector('script[src="//www.instagram.com/embed.js"]') as HTMLScriptElement | null;
    if (!existing) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "//www.instagram.com/embed.js";
      document.body.appendChild(script);
      return;
    }
    window.instgrm?.Embeds?.process?.();
  }, [homepage.instagramUrls]);

  return (
    <div className="min-h-screen" style={{ background: "#fffaf6" }}>
      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#c0185a" }}>About Happy Feet</p>
            <h1 className="font-serif font-bold leading-tight" style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)", color: "#3a1f3a" }}>
              Dance boldly. Feel at home.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: "#4a3550" }}>
              {homepage.aboutStory || DEFAULT_HOMEPAGE.aboutStory}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-full px-8">
                <Link href="/#classes">Book a Class <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-8">
                <Link href="/#instructor">Meet Instructors</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-2xl" style={{ background: "linear-gradient(145deg, #3a1f3a, #c0185a)" }}>
            <img
              src={homepage.heroImageUrl || DEFAULT_HOMEPAGE.heroImageUrl}
              alt="Happy Feet dance community"
              className="aspect-[4/5] h-full w-full object-cover opacity-85 mix-blend-luminosity"
            />
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: "#f9f3ef" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: HeartHandshake, title: "Community First", body: "Classes are built to feel welcoming, encouraging, and personal from the first step." },
              { icon: Sparkles, title: "Performance Energy", body: "Bollywood, BollyHop, and showcase programs help dancers build confidence on and off stage." },
              { icon: Users, title: "All Ages", body: "Kids, teens, and adults can find batches that fit their level, schedule, and goals." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-white p-7 shadow-sm" style={{ border: "1px solid rgba(58,31,58,0.08)" }}>
                <Icon className="mb-4 h-6 w-6" style={{ color: "#c0185a" }} />
                <h2 className="font-serif text-xl font-bold" style={{ color: "#3a1f3a" }}>{title}</h2>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "#6b5b6e" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#c0185a" }}>The team</p>
            <h2 className="font-serif font-bold" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#3a1f3a" }}>
              Instructors who make class feel alive.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleInstructors.map((instructor) => (
              <div key={instructor.id} className="overflow-hidden rounded-2xl bg-white shadow-sm" style={{ border: "1px solid rgba(58,31,58,0.08)" }}>
                <div className="aspect-square bg-muted">
                  {instructor.imageUrl ? (
                    <img src={instructor.imageUrl} alt={instructor.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center font-serif text-5xl font-bold" style={{ color: "#c0185a" }}>
                      {instructor.name.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl font-bold" style={{ color: "#3a1f3a" }}>{instructor.name}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "#c0185a" }}>
                    {instructor.specialties.join(" / ") || "Dance"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: "#f9f3ef" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#c0185a" }}>Instagram</p>
              <h2 className="font-serif font-bold" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#3a1f3a" }}>
                Studio moments and class energy.
              </h2>
            </div>
            <Instagram className="h-8 w-8" style={{ color: "#c0185a" }} />
          </div>
          {homepage.instagramUrls.length ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {homepage.instagramUrls.map((url) => (
                <blockquote
                  key={url}
                  className="instagram-media mx-auto w-full rounded-2xl bg-white p-4"
                  data-instgrm-permalink={url}
                  data-instgrm-version="14"
                >
                  <a href={url} target="_blank" rel="noreferrer">View this Instagram post</a>
                </blockquote>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm" style={{ border: "1px solid rgba(58,31,58,0.08)" }}>
              <p className="text-sm" style={{ color: "#6b5b6e" }}>
                Add public Instagram Reel or Post URLs in Admin → Homepage to show videos here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process?: () => void;
      };
    };
  }
}
