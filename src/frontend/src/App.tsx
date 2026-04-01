import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { AnimePage } from "@/pages/AnimePage";
import { BrowsePage } from "@/pages/BrowsePage";
import { HomePage } from "@/pages/HomePage";
import { PlayerPage } from "@/pages/PlayerPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-cyber">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const browseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/browse",
  component: BrowsePage,
});

const moviesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/movies",
  component: BrowsePage,
});

const animeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/anime/$id",
  component: AnimePage,
});

const watchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/watch/$animeId/$episodeId",
  component: PlayerPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  browseRoute,
  moviesRoute,
  animeRoute,
  watchRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
