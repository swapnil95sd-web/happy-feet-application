import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navigation } from "@/components/layout";
import Home from "@/pages/home";
import Portal from "@/pages/portal";
import Admin from "@/pages/admin";
import { useAuth } from "@workspace/replit-auth-web";

const queryClient = new QueryClient();

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;

function ProtectedRoute({
  component: Component,
  adminOnly = false,
}: {
  component: React.ComponentType;
  adminOnly?: boolean;
}) {
  const { user, isLoading, isAuthenticated, login } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="text-center max-w-sm">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            Sign in to continue
          </h2>
          <p className="text-muted-foreground text-sm">
            Please log in to access this page.
          </p>
        </div>
        <button
          onClick={login}
          className="px-8 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          Log in
        </button>
      </div>
    );
  }

  if (adminOnly && ADMIN_EMAIL && user?.email !== ADMIN_EMAIL) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="text-center max-w-sm">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            Access denied
          </h2>
          <p className="text-muted-foreground text-sm">
            This page is only accessible to the studio director.
          </p>
        </div>
      </div>
    );
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/portal">
        <ProtectedRoute component={Portal} />
      </Route>
      <Route path="/admin">
        <ProtectedRoute component={Admin} adminOnly />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="min-h-[100dvh] flex flex-col">
            <Navigation />
            <main className="flex-1">
              <Router />
            </main>
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
