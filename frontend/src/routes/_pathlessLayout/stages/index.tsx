import ConfirmationDialog from "@/components/ConfirmationDialog";
import RecordBadge from "@/components/RecordBadge";
import RecordSelector from "@/components/RecordSelector";
import SimpleCreateDialog from "@/components/SimpleCreateDialog";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_pathlessLayout/stages/")({
  component: Stage,
});
interface Stages {
  projectStages: {
    project: {
      name: string;
      id: number;
    };
  }[];
  name: string;
  id: number;
  created_at: Date;
  updated_at: Date;
  active: boolean;
  sequence: number;
}

function Stage() {
  const [stages, setStages] = useState<Stages[]>([]);
  const [edit, setEdit] = useState<number>(0);

  useEffect(() => {
    axios.get("/api/stages").then((res) => {
      setStages(res.data);
    });
  }, []);

  useEffect(() => {
    if (edit !== 0) {
      document.querySelector<HTMLInputElement>(".input_selector")?.focus();
    }
  }, [edit]);

  const onRecordUpdate = (
    stageId: number,
    projectId: number,
    operation: "add" | "remove",
  ) => {
    return axios
      .post(`/api/stages/${stageId}/update-project`, {
        project_id: projectId,
        operation,
      })
      .catch((err) => {
        console.error("Error updating stage projects:", err);
      });
  };

  const onRecordSelectorChange = async (
    { id, name }: { id: number; name: string },
    stageId: number,
  ): Promise<void> => {
    console.log("Selected project ID:", id);
    await onRecordUpdate(stageId, id, "add");
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id === stageId) {
          if (stage.projectStages.some((ps) => ps.project.id === id)) {
            return {
              ...stage,
              projectStages: [
                ...stage.projectStages.filter((p) => p.project.id !== id),
              ],
            };
          }
          return {
            ...stage,
            projectStages: [...stage.projectStages, { project: { id, name } }],
          };
        }
        return stage;
      }),
    );
  };

  const onRemoveProjectFromStage = async (
    stageId: number,
    projectId: number,
    ev: React.MouseEvent<SVGSVGElement, MouseEvent>,
  ) => {
    try {
      ev.stopPropagation();
      await onRecordUpdate(stageId, projectId, "remove");
      setStages((prev) =>
        prev.map((s) => {
          if (s.id === stageId) {
            return {
              ...s,
              projectStages: s.projectStages.filter(
                (p) => p.project.id !== projectId,
              ),
            };
          }
          return s;
        }),
      );
    } catch (error) {
      console.error("Error removing project from stage:", error);
    }
  };

  const onStageCreate = async (name: string) => {
    try {
      const response = await axios.post(`/api/stages`, { name });
      if (response.status === 201) {
        setStages((prev) => {
          return [...prev, { ...response.data.stage, projectStages: [] }];
        });
      }
    } catch (error) {
      console.error("Error creating stage:", error);
    }
  };

  const onStageDelete = async (id: number) => {
    try {
      const response = await axios.delete(`/api/stages/${id}`);
      if (response.status === 200) {
        setStages((prev) => prev.filter((stage) => stage.id !== id));
      }
    } catch (error) {
      console.error("Error deleting stage:", error);
    }
  };

  if (stages.length === 0) {
    return (
      <div className="mx-3">
        <div className="text-2xl font-bold mb-4 flex items-center gap-2">
          <h2>Stages</h2>
        </div>
        <p>No stages found.</p>
      </div>
    );
  }

  return (
    <div className="mx-3" onClick={() => setEdit(0)}>
      <div className="text-2xl font-bold mb-4 flex items-center gap-2">
        <h2>Stages</h2>
        <SimpleCreateDialog title="Create a Stage" onSave={onStageCreate}>
          <Button className="p-2 mt-2">
            <PlusCircle /> Create new
          </Button>
        </SimpleCreateDialog>
      </div>
      <div className="flex gap-4 items-center p-4 border rounded px-3 ">
        <h3 className="text-lg font-semibold w-3/12">Stage Name</h3>
        <h3 className="text-lg font-semibold">Associated Projects</h3>
      </div>
      {stages.map((stage) => (
        <div
          key={stage.id}
          className="flex gap-4 p-4 border rounded px-3 relative"
        >
          <h3 className="w-1/12">{stage.name}</h3>
          <div
            className="flex gap-2 flex-wrap pe-2 w-10/12 cursor-pointer"
            onClick={(ev) => {
              ev.stopPropagation();
              setEdit(stage.id);
            }}
          >
            {stage.projectStages.map((ps) => (
              <RecordBadge
                key={ps.project.id}
                name={ps.project.name}
                onRemove={(ev) => {
                  onRemoveProjectFromStage(stage.id, ps.project.id, ev);
                }}
              />
            ))}
            {edit === stage.id && (
              <RecordSelector
                data={null}
                isMany={true}
                model="projects"
                inputClassName="p-2 w-auto border-0 border-b-zinc-950 border-b-2 input_selector"
                setData={({ id, name }) =>
                  onRecordSelectorChange({ id, name }, stage.id)
                }
              />
            )}
          </div>
          <ConfirmationDialog
            itemName={`"${stage.name}" stage`}
            onConfirm={(ev) => {
              ev.stopPropagation();
              return onStageDelete(stage.id);
            }}
          >
            <div className="cursor-pointer">
              <Trash2 className="float-right" />
            </div>
          </ConfirmationDialog>
        </div>
      ))}
    </div>
  );
}

export default Stage;
