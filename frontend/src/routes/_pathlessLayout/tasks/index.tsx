import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_pathlessLayout/tasks/")({
  beforeLoad: () => {
    throw redirect({ to: "/my-tasks" });
  },
});
