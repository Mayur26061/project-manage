import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    if (!context.auth?.user.user) {
      throw redirect({
        to: "/signin",
      });
    } else {
      throw redirect({
        to: "/projects",
      });
    }
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
}
