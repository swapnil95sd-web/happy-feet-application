import { useState } from "react";
import { Link } from "wouter";
import { useListClasses, useCreateEnrollment } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, MapPin, User, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { data: classes, isLoading } = useListClasses(activeCategory !== "All" ? { category: activeCategory } : undefined);
  
  const categories = ["All", "Kids", "Adults", "Showcase", "Workshop"];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1800&q=80")' }}
        />
        <div className="absolute inset-0 z-10 bg-secondary/70 mix-blend-multiply" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="container relative z-30 px-4 text-center">
          <Badge className="mb-6 bg-accent/90 text-accent-foreground hover:bg-accent px-4 py-1 text-sm border-none uppercase tracking-widest">
            NYC & New Jersey
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 drop-shadow-lg">
            Dance boldly.<br />
            <span className="text-primary-foreground">Feel at home.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 font-medium leading-relaxed drop-shadow">
            Joy-filled Bollywood, BollyHop, Semi-Classical, and Hip-Hop classes for kids, teens, and adults.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full text-lg px-8 h-14 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform" asChild>
              <a href="#classes">Find Your Class</a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full text-lg px-8 h-14 bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm" asChild>
              <Link href="/portal">Student Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary-foreground/20">
            <div className="flex flex-col items-center justify-center">
              <span className="text-4xl md:text-5xl font-serif font-bold mb-2">130+</span>
              <span className="text-sm uppercase tracking-wider font-medium text-primary-foreground/80">Active Students</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-4xl md:text-5xl font-serif font-bold mb-2">6+</span>
              <span className="text-sm uppercase tracking-wider font-medium text-primary-foreground/80">Dance Styles</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-4xl md:text-5xl font-serif font-bold mb-2">12</span>
              <span className="text-sm uppercase tracking-wider font-medium text-primary-foreground/80">Week Batches</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-4xl md:text-5xl font-serif font-bold mb-2">2</span>
              <span className="text-sm uppercase tracking-wider font-medium text-primary-foreground/80">Locations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section id="classes" className="py-24 bg-background">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-6">Our Programs</h2>
            <p className="text-lg text-muted-foreground">
              Whether you're stepping into a studio for the first time or preparing for the big stage, we have a spot for you.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat 
                    ? "bg-secondary text-secondary-foreground shadow-md" 
                    : "bg-card text-foreground hover:bg-card/80 border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {classes?.map((c) => (
                <ClassCard key={c.id} danceClass={c} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Footer placeholder */}
      <footer className="bg-secondary text-secondary-foreground py-12 mt-auto">
        <div className="container px-4 text-center">
          <h3 className="font-serif text-2xl font-bold mb-4">Happy Feet Dance Academy</h3>
          <p className="text-secondary-foreground/70">Dance boldly. Feel at home.</p>
        </div>
      </footer>
    </div>
  );
}

function ClassCard({ danceClass }: { danceClass: any }) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const createEnrollment = useCreateEnrollment();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentType: danceClass.ageGroup.toLowerCase().includes("kid") ? "kid" : "adult"
  });

  const handleEnroll = () => {
    createEnrollment.mutate({
      data: {
        classId: danceClass.id,
        ...formData
      }
    }, {
      onSuccess: () => {
        setStep(3);
        toast({
          title: "Registration submitted!",
          description: "We'll be in touch soon.",
        });
      }
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card">
      <div className={`h-2 ${danceClass.colorScheme === 'rose' ? 'bg-primary' : danceClass.colorScheme === 'plum' ? 'bg-secondary' : 'bg-accent'}`} />
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="bg-background">{danceClass.category}</Badge>
          <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">{danceClass.style}</Badge>
        </div>
        <CardTitle className="text-2xl font-serif">{danceClass.name}</CardTitle>
        <CardDescription className="text-base mt-2">{danceClass.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>{danceClass.scheduleDay}s at {danceClass.scheduleTime} ({danceClass.duration})</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{danceClass.location}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <User className="w-4 h-4 text-primary" />
            <span>Instructor: {danceClass.instructor}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <CalendarDays className="w-4 h-4 text-primary" />
            <span>Ages: {danceClass.ageGroup}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-border/50 pt-4 bg-background/50">
        <div>
          <span className="text-lg font-bold text-foreground">${danceClass.price}</span>
          <span className="text-xs text-muted-foreground ml-1">/ {danceClass.pricePeriod}</span>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90">
              Book Spot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-secondary">
                {step === 1 ? "Book Your Spot" : step === 2 ? "Payment Info" : "You're All Set!"}
              </DialogTitle>
              <DialogDescription>
                {danceClass.name} • {danceClass.scheduleDay}s • {danceClass.location}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {step === 1 && (
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <p className="font-medium text-lg mb-2">Total Due: ${danceClass.price}</p>
                    <p className="text-sm text-muted-foreground mb-4">Please Venmo the studio directly to secure your spot.</p>
                    <Badge variant="secondary" className="text-lg py-2 px-4 font-mono bg-secondary/10 text-secondary">@HappyFeet-Dance</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">We'll review your registration and send a confirmation once payment is received.</p>
                </div>
              )}

              {step === 3 && (
                <div className="text-center space-y-4 py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-secondary">Registration Received!</h3>
                  <p className="text-muted-foreground">We can't wait to dance with you. Check your email for details.</p>
                </div>
              )}
            </div>

            <DialogFooter>
              {step === 1 && (
                <Button onClick={() => setStep(2)} className="w-full rounded-full" disabled={!formData.firstName || !formData.lastName || !formData.email}>
                  Continue to Payment
                </Button>
              )}
              {step === 2 && (
                <div className="flex gap-2 w-full">
                  <Button variant="outline" onClick={() => setStep(1)} className="w-full rounded-full">Back</Button>
                  <Button onClick={handleEnroll} disabled={createEnrollment.isPending} className="w-full rounded-full">
                    {createEnrollment.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Complete Registration
                  </Button>
                </div>
              )}
              {step === 3 && (
                <Button onClick={() => setIsOpen(false)} className="w-full rounded-full">
                  Done
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
