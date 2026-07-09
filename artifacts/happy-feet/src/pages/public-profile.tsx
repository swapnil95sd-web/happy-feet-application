import { ArrowRight, CalendarCheck2, CheckCircle2, MapPin, Quote, Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { lines, loadBuilderState } from "@/lib/beyond8-builder";

export default function PublicProfile() {
  const state = loadBuilderState();
  const services = lines(state.services);

  return (
    <div className="min-h-screen bg-[#fff8ef] text-[#18131d]">
      <section className="relative min-h-screen overflow-hidden">
        <img src={state.photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, ${state.accentColor}f2 0%, ${state.primaryColor}b8 58%, rgba(0,0,0,.22) 100%)` }} />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 text-white md:px-6">
          <header className="flex items-center justify-between gap-4 rounded-full border border-white/18 bg-white/10 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <img src={state.logoUrl} alt="" className="h-11 w-11 rounded-2xl object-cover" />
              <div>
                <p className="font-serif text-xl font-bold">{state.studioName}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-white/58">Beyond8 profile</p>
              </div>
            </div>
            <nav className="hidden items-center gap-5 text-sm font-bold text-white/78 md:flex">
              <a href="#about">About</a>
              <a href="#classes">Classes</a>
              <a href="#instructors">Instructors</a>
              <a href="#reviews">Reviews</a>
            </nav>
          </header>

          <div className="grid flex-1 gap-10 py-16 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <Badge className="mb-5 bg-white/14 text-white">{state.location}</Badge>
              <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[0.98] md:text-7xl">{state.headline}</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 md:text-lg">{state.bio}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full bg-white px-8 text-[#18131d] hover:bg-white/90">
                  <a href="#classes">Book a class <ArrowRight className="ml-2 h-4 w-4" /></a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 bg-white/10 px-8 text-white hover:bg-white/16">
                  <a href="#about">Meet {state.name}</a>
                </Button>
              </div>
            </div>
            <div className="rounded-[34px] border border-white/18 bg-white/12 p-5 shadow-2xl backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/58">Now booking</p>
              <div className="mt-4 space-y-3">
                {state.workshops.slice(0, 3).map((workshop) => (
                  <a key={workshop.id} href="#classes" className="block rounded-3xl bg-white p-4 text-[#18131d] transition hover:-translate-y-0.5 hover:shadow-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-xl font-bold">{workshop.title}</p>
                        <p className="mt-1 text-xs text-[#665d6d]">{workshop.date} - {workshop.location}</p>
                      </div>
                      <Badge style={{ background: state.primaryColor }} className="text-white">{workshop.price}</Badge>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="px-4 py-20 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="overflow-hidden rounded-[36px] shadow-2xl">
            <img src={state.instructors[0]?.imageUrl || state.photoUrl} alt="" className="aspect-[4/5] w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em]" style={{ color: state.primaryColor }}>About herself</p>
            <h2 className="mt-3 font-serif text-5xl font-bold leading-tight text-[#28123d]">Meet {state.name}.</h2>
            <p className="mt-5 text-lg leading-8 text-[#5f5667]">{state.bio}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {state.styles.map((style) => (
                <div key={style} className="rounded-2xl bg-white p-4 shadow-sm">
                  <CheckCircle2 className="h-5 w-5" style={{ color: state.primaryColor }} />
                  <p className="mt-3 font-bold">{style}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[28px] bg-[#18131d] p-5 text-white">
              <MapPin className="h-5 w-5 text-white/58" />
              <p className="mt-3 font-serif text-2xl font-bold">Locations</p>
              <p className="mt-1 text-sm leading-6 text-white/68">{state.studioLocations}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="classes" className="bg-[#18131d] px-4 py-20 text-white md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white/48">Classes</p>
              <h2 className="mt-3 font-serif text-5xl font-bold">Book a class that fits.</h2>
            </div>
            <Badge className="w-fit bg-white/12 text-white">{state.paymentMethod}: {state.paymentHandle}</Badge>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {state.workshops.map((workshop) => (
              <div key={workshop.id} className="rounded-[32px] bg-white p-5 text-[#18131d] shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <CalendarCheck2 className="h-6 w-6" style={{ color: state.primaryColor }} />
                  <Badge style={{ background: state.primaryColor }} className="text-white">{workshop.price}</Badge>
                </div>
                <h3 className="mt-8 font-serif text-3xl font-bold">{workshop.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#665d6d]">{workshop.description}</p>
                <div className="mt-5 rounded-2xl bg-[#fbf7f1] p-4 text-sm font-semibold text-[#4f4656]">
                  {workshop.date} - {workshop.location} - {workshop.capacity} spots
                </div>
                <Button className="mt-5 w-full rounded-full bg-[#18131d] text-white hover:bg-[#2b2132]">Request a spot</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="instructors" className="px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.18em]" style={{ color: state.primaryColor }}>All instructors</p>
          <h2 className="mt-3 font-serif text-5xl font-bold text-[#28123d]">Learn from a team that feels personal.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {state.instructors.map((instructor) => (
              <div key={instructor.id} className="grid gap-5 rounded-[34px] bg-white p-5 shadow-xl md:grid-cols-[190px_1fr]">
                <img src={instructor.imageUrl} alt="" className="h-64 w-full rounded-[26px] object-cover md:h-full" />
                <div className="flex flex-col justify-center">
                  <Sparkles className="h-5 w-5" style={{ color: state.primaryColor }} />
                  <h3 className="mt-5 font-serif text-3xl font-bold">{instructor.name}</h3>
                  <p className="mt-1 text-sm font-bold text-[#c2185b]">{instructor.role}</p>
                  <p className="mt-4 text-sm leading-6 text-[#665d6d]">{instructor.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="bg-[#fbf1e8] px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.18em]" style={{ color: state.primaryColor }}>Reviews</p>
          <h2 className="mt-3 font-serif text-5xl font-bold text-[#28123d]">Students feel the difference.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {state.reviews.map((review) => (
              <div key={review.id} className="rounded-[32px] bg-white p-6 shadow-sm">
                <Quote className="h-7 w-7" style={{ color: state.primaryColor }} />
                <p className="mt-6 text-lg font-semibold leading-8 text-[#28123d]">{review.quote}</p>
                <div className="mt-6 flex items-center gap-1 text-[#ffb26b]">
                  {[1, 2, 3, 4, 5].map((item) => <Star key={item} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-3 text-sm font-bold text-[#665d6d]">{review.author}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-[34px] bg-[#18131d] p-6 text-white md:p-8">
            <p className="font-serif text-3xl font-bold">Additional services</p>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {services.map((service) => (
                <div key={service} className="rounded-2xl bg-white/10 p-4 text-sm font-bold">{service}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
