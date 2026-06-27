import { Link, useLocation } from "wouter";
import { Menu, LogOut, User } from "lucide-react";
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

export function Navigation() {
  const [location] = useLocation();
  const { user, profile, isAuthenticated, isLoading, logout } = useAuth();

  const links = [
    { href: "/", label: "Classes" },
    { href: "/portal", label: "Student Portal" },
    { href: "/admin", label: "Admin" },
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
          <Button asChild className="ml-2 rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/#classes">Book a Class</Link>
          </Button>

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
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/portal" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <User className="h-4 w-4" />
                Log in
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
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 text-sm text-destructive font-medium hover:text-destructive/80 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <Link href="/portal" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <User className="h-4 w-4" />
                    Log in
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
