import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import DashboardWrapper from "../components/DashBoardWrapper";

export const Route = createFileRoute("/_pathlessLayout")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.auth.user.user) {
      throw redirect({
        to: "/signin",
      });
    }
  },
});

function RouteComponent() {
  return (
    <div>
      <DashboardWrapper>
        <Outlet />
      </DashboardWrapper>
    </div>
  );
}
