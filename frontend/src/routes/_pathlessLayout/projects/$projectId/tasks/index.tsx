import SimpleCreateDialog from "@/components/SimpleCreateDialog";
import { Stage } from "@/components/Stage";
import { Outlet, createFileRoute, useParams } from "@tanstack/react-router";
import axios from "axios";
import { PlusCircle } from "lucide-react";
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

  const fetchProjectStages = async () => {
    try {
      const response = await axios.get(
        `/api/tasks/projects/${params.projectId}`,
      );
      setData(response.data.result);
    } catch (error) {
      console.error("Error fetching project stages:", error);
    }
  };

  const onCreateStage = async (name: string) => {
    try {
      await axios.post("/api/stages", {
        name,
        project_id: Number(params.projectId),
      });
      await fetchProjectStages();
    } catch (error) {
      console.error("Error creating stage:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjectStages();
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
      <SimpleCreateDialog title="Create a Stage" onSave={onCreateStage}>
        <div className="mt-4 w-56 h-10 flex flex-col items-center justify-center gap-4 border border-gray-300 rounded-lg shadow-sm">
          <div className="flex gap-2">
            <PlusCircle /> Create stage
          </div>
        </div>
      </SimpleCreateDialog>
      <Outlet />
    </div>
  );
}
