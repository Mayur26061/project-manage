import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "./components/AuthProvider.tsx";
import { useAuth, type AuthContextType } from "./lib/useAuth.ts";
import { routeTree } from "./routeTree.gen.ts";
import "./index.css";

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRoute>;
  }
}

const createRoute = (auth: AuthContextType | null) => {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultStaleTime: 5000,
    scrollRestoration: true,
    context: {
      auth,
    },
  });
};

// eslint-disable-next-line react-refresh/only-export-components
function InnerApp() {
  const auth = useAuth();
  const router = createRoute(auth);
  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  </StrictMode>,
);
