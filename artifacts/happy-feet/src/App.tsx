import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navigation } from "@/components/layout";
import Home from "@/pages/home";
import About from "@/pages/about";
import Admin from "@/pages/admin";
import PlatformAdmin from "@/pages/platform";
import TryProduct from "@/pages/try-product";
import Portal from "@/pages/portal";
import { AuthProvider, type StudioRole, useAuth } from "@/lib/supabase";
import { useEffect, useState } from "react";
import type { ComponentType, FormEvent } from "react";

const queryClient = new QueryClient();

function ProtectedRoute({
  component: Component,
  roles,
}: {
  component: ComponentType;
  roles?: StudioRole[];
}) {
  const { isLoading, isAuthenticated, role, isSupabaseConfigured } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignInPanel isSupabaseConfigured={isSupabaseConfigured} />;
  }

  if (roles && (!role || !roles.includes(role))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="text-center max-w-sm">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            Access denied
          </h2>
          <p className="text-muted-foreground text-sm">
            Your account does not have permission to open this dashboard.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            If you were just added as an instructor or admin, log out and request a fresh sign-in link.
          </p>
        </div>
      </div>
    );
  }

  return <Component />;
}

function SignInPanel({ isSupabaseConfigured }: { isSupabaseConfigured: boolean }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { signInWithEmail } = useAuth();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSending(true);
    try {
      await signInWithEmail(email);
      setMessage("Check your email for the sign-in link.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the sign-in link.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-sm">
        <div className="text-center mb-5">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Create account or sign in</h2>
          <p className="text-muted-foreground text-sm">
            Enter your email and we will send a secure magic link to open your Beyond8 workspace.
          </p>
        </div>
        {!isSupabaseConfigured ? (
          <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
            Supabase is not configured yet. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable sign-in.
          </p>
        ) : (
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              disabled={isSending}
              className="w-full rounded-full bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {isSending ? "Sending..." : "Email me a sign-in link"}
            </button>
            {message && <p className="text-center text-sm text-green-700">{message}</p>}
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
          </div>
        )}
      </form>
    </div>
  );
}

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    if (window.location.hash) {
      window.requestAnimationFrame(() => {
        document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth" });
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/try" component={TryProduct} />
      <Route path="/portal">
        <ProtectedRoute component={Portal} />
      </Route>
      <Route path="/admin">
        <ProtectedRoute component={Admin} roles={["admin"]} />
      </Route>
      <Route path="/platform">
        <ProtectedRoute component={PlatformAdmin} roles={["admin"]} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isBeyond8Landing = location === "/try";

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {!isBeyond8Landing && <Navigation />}
      <main className="flex-1">
        <Router />
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppContent />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
