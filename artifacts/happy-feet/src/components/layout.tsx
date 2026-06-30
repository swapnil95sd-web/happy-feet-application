import { Link, useLocation } from "wouter";
import { LayoutDashboard, Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/supabase";

type NavLink =
  | { type: "button"; label: string; section: string }
  | { type: "link"; label: string; href: string };

function scrollToHomeSection(id: string) {
  if (window.location.pathname !== "/") {
    window.location.href = `/#${id}`;
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function goHomeTop() {
  if (window.location.pathname !== "/") {
    window.location.href = "/";
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function Navigation() {
  const [location] = useLocation();
  const { user, profile, isAuthenticated, isLoading, logout } = useAuth();

  const links: NavLink[] = [
    { type: "button", label: "Book Class", section: "classes" },
    { type: "button", label: "Meet Instructor", section: "instructor" },
    { type: "link", label: "About Us", href: "/about" },
  ];

  const displayName = profile?.fullName ?? user?.email ?? "StudioFlow user";
  const initials = displayName
    ? displayName
        .split(/\s|@/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "U"
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={goHomeTop} className="flex items-center gap-3 text-left">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-serif font-bold text-lg shadow-sm">
            HF
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg leading-tight text-foreground">Happy Feet</span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Dance boldly. Feel at home.</span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            link.type === "link" ? (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => scrollToHomeSection(link.section)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </button>
            )
          ))}

          {!isLoading && (
            isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <Avatar className="h-8 w-8">
                      {user?.user_metadata?.avatar_url && <AvatarImage src={user.user_metadata.avatar_url} alt={displayName} />}
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-medium">{displayName}</p>
                    {profile?.role && <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/admin" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <User className="h-4 w-4" />
                Admin log in
              </Link>
            )
          )}
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
                link.type === "link" ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      location === link.href ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => scrollToHomeSection(link.section)}
                    className="text-left text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </button>
                )
              ))}
              <div className="mt-4 pt-4 border-t">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {user?.user_metadata?.avatar_url && <AvatarImage src={user.user_metadata.avatar_url} />}
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{displayName}</p>
                        {profile?.role && <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>}
                      </div>
                    </div>
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 text-sm text-destructive font-medium hover:text-destructive/80 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <Link href="/admin" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <User className="h-4 w-4" />
                    Admin log in
                  </Link>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
