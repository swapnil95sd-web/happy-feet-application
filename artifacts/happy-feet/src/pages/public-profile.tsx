import { ArrowRight, CalendarCheck2, CheckCircle2, MapPin, Quote, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { lines, loadBuilderState } from "@/lib/beyond8-builder";

export default function PublicProfile() {
  const state = loadBuilderState();
  const services = lines(state.services);

  return (
    <div className="min-h-screen bg-[#f6f2ed] text-[#171417]">
      <section className="px-4 py-5 md:px-6 lg:py-7">
        <div className="mx-auto max-w-7xl">
          <header className="flex items-center justify-between gap-4 border-b border-[#ded7cf] pb-5">
            <a href="#top" className="flex items-center gap-3">
              <img src={state.logoUrl} alt="" className="h-10 w-10 rounded-xl object-cover" />
              <div>
                <p className="font-serif text-xl font-bold">{state.studioName}</p>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8f1d4e]">Beyond8 profile</p>
              </div>
            </a>
            <nav className="hidden items-center gap-6 text-sm font-semibold text-[#514c54] md:flex">
              <a href="#about" className="hover:text-[#171417]">About</a>
              <a href="#classes" className="hover:text-[#171417]">Classes</a>
              <a href="#instructors" className="hover:text-[#171417]">Instructors</a>
              <a href="#reviews" className="hover:text-[#171417]">Reviews</a>
            </nav>
            <Button asChild className="hidden rounded-full bg-[#171417] px-5 text-white hover:bg-[#2b272b] sm:inline-flex">
              <a href="#classes">Book now</a>
            </Button>
          </header>

          <div id="top" className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:py-16">
            <div>
              <Badge className="mb-5 rounded-full bg-white text-[#514c54] shadow-sm">{state.location}</Badge>
              <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[1.02] tracking-[-0.02em] text-[#171417] md:text-7xl">
                {state.headline}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f5860]">{state.bio}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full bg-[#171417] px-8 text-white hover:bg-[#2b272b]">
                  <a href="#classes">View classes <ArrowRight className="ml-2 h-4 w-4" /></a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-[#d8d0c8] bg-white px-8">
                  <a href="#about">Meet {state.name}</a>
                </Button>
              </div>
              <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
                <Metric label="Classes" value={state.workshops.length} />
                <Metric label="Instructors" value={state.instructors.length} />
                <Metric label="Reviews" value={state.reviews.length} />
              </div>
            </div>
            <div className="rounded-[28px] border border-[#ded7cf] bg-white p-3 shadow-sm">
              <img src={state.photoUrl} alt="" className="aspect-[4/5] w-full rounded-2xl object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="border-y border-[#ded7cf] bg-white px-4 py-16 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
          <div className="rounded-2xl bg-[#171417] p-6 text-white">
            <MapPin className="h-5 w-5 text-white/60" />
            <p className="mt-5 font-serif text-3xl font-bold">Locations</p>
            <p className="mt-3 text-sm leading-6 text-white/68">{state.studioLocations}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {state.styles.map((style) => (
                <Badge key={style} className="rounded-full bg-white/10 text-white">{style}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f1d4e]">About herself</p>
            <h2 className="mt-3 font-serif text-5xl font-bold tracking-[-0.02em]">Meet {state.name}.</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5f5860]">{state.bio}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {services.slice(0, 4).map((service) => (
                <div key={service} className="rounded-2xl border border-[#ded7cf] bg-[#f6f2ed] p-5">
                  <CheckCircle2 className="h-5 w-5 text-[#8f1d4e]" />
                  <p className="mt-4 font-semibold">{service}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="classes" className="px-4 py-16 md:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading kicker="Classes" title="Clear options, ready to book." body={`Payment guidance: ${state.paymentMethod} ${state.paymentHandle}`} />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {state.workshops.map((workshop) => (
              <article key={workshop.id} className="flex min-h-[360px] flex-col rounded-2xl border border-[#ded7cf] bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <CalendarCheck2 className="h-5 w-5 text-[#8f1d4e]" />
                  <Badge className="rounded-full bg-[#171417] text-white">{workshop.price}</Badge>
                </div>
                <h3 className="mt-8 font-serif text-3xl font-bold leading-tight">{workshop.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#625b63]">{workshop.description}</p>
                <div className="mt-auto pt-6">
                  <div className="rounded-xl bg-[#f6f2ed] p-4 text-sm font-semibold text-[#514c54]">
                    {workshop.date}<br />
                    {workshop.location} · {workshop.capacity} spots
                  </div>
                  <Button className="mt-4 w-full rounded-full bg-[#171417] text-white hover:bg-[#2b272b]">Request a spot</Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="instructors" className="bg-white px-4 py-16 md:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading kicker="Instructors" title="A team students can trust." body="Every profile is clear, human, and focused on why students should feel confident joining." />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {state.instructors.map((instructor) => (
              <article key={instructor.id} className="grid gap-5 rounded-2xl border border-[#ded7cf] bg-[#fbf8f4] p-4 md:grid-cols-[180px_1fr]">
                <img src={instructor.imageUrl} alt="" className="h-60 w-full rounded-xl object-cover md:h-full" />
                <div className="flex flex-col justify-center py-2">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8f1d4e]">{instructor.role}</p>
                  <h3 className="mt-3 font-serif text-3xl font-bold">{instructor.name}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#625b63]">{instructor.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="px-4 py-16 md:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading kicker="Reviews" title="Proof that the experience works." body="Social proof is part of the booking product, not an afterthought." />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {state.reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-[#ded7cf] bg-white p-6 shadow-sm">
                <Quote className="h-6 w-6 text-[#8f1d4e]" />
                <p className="mt-6 text-lg font-semibold leading-8">{review.quote}</p>
                <div className="mt-6 flex gap-1 text-[#b8872f]">
                  {[1, 2, 3, 4, 5].map((item) => <Star key={item} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-4 text-sm font-bold text-[#625b63]">{review.author}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#ded7cf] bg-white p-4">
      <p className="font-serif text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#7d747f]">{label}</p>
    </div>
  );
}

function SectionHeading({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f1d4e]">{kicker}</p>
      <h2 className="mt-3 font-serif text-5xl font-bold tracking-[-0.02em]">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#625b63]">{body}</p>
    </div>
  );
}
