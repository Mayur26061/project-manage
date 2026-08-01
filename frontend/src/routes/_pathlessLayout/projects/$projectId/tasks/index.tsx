import { Stage } from "@/components/Stage";
import { Outlet, createFileRoute, useParams } from "@tanstack/react-router";
import axios from "axios";
import { useEffect, useState } from "react";
export const Route = createFileRoute(
  "/_pathlessLayout/projects/$projectId/tasks/",
)({
  component: TasksComponent,
});

export interface Result {
  id: number;
  project_id: number;
  stage_id: number;
  stage: {
    name: string;
    id: number;
    sequence: number;
    tasks: {
      name: string;
      project_id: number;
      description: string | null;
      stage_id: number | null;
      id: number;
      sequence: number;
      priority: number;
      created_at: Date;
      updated_at: Date;
      active: boolean;
      deadline: Date | null;
      status: "APPROVED" | "IN_PROGRESS" | "CHANGE_REQUESTED" | "DONE";
    }[];
  };
}
function TasksComponent() {
  const params = useParams({
    from: "/_pathlessLayout/projects/$projectId/tasks/",
  });
  const [data, setData] = useState<Result[]>([]);
  useEffect(() => {
    axios.get(`/api/tasks/projects/${params.projectId}`).then((response) => {
      setData(response.data.result);
    });
  }, []);
  return (
    <div className="p-4 flex gap-4 overflow-x-auto h-full">
      {data.map((stage) => (
        <Stage
          key={stage.stage.id}
          stage={{ ...stage.stage, project_id: stage.project_id }}
          onTaskUpdate={setData}
        />
      ))}
      <Outlet />
    </div>
  );
}
