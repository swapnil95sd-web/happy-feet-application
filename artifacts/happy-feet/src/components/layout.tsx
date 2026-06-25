import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navigation() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Classes" },
    { href: "/portal", label: "Student Portal" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-serif font-bold text-lg shadow-sm">
            HF
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg leading-tight text-foreground">Happy Feet</span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Dance boldly. Feel at home.</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="ml-4 rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/#classes">Book a Class</Link>
          </Button>
        </nav>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-lg font-medium transition-colors hover:text-primary ${
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-4 rounded-full bg-primary text-primary-foreground">
                <Link href="/#classes">Book a Class</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
