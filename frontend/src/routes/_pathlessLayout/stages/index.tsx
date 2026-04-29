import RecordBadge from "@/components/RecordBadge";
import RecordSelector from "@/components/RecordSelector";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
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
    console.log("Stage mounted");
    axios.get("/api/stage/stages").then((res) => {
      setStages(res.data);
    });
  }, []);

  useEffect(() => {
    const eventHandle = () => setEdit(0);
    document.body.addEventListener("click", eventHandle);
    return () => {
      document.body.removeEventListener("click", eventHandle);
    };
  }, []);

  const onRecordSelectorChange = (
    { id, name }: { id: number; name: string },
    stageId: number,
  ): void => {
    console.log("Selected project ID:", id);
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
    axios.post(`/api/stage/update-project/${stageId}`, { project_id: id });
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
      </div>
      <div className="flex gap-4 items-center p-4 border rounded px-3 ">
        <h3 className="text-lg font-semibold w-md">Stage Name</h3>
        <h3 className="text-lg font-semibold">Associated Projects</h3>
      </div>
      {stages.map((stage) => (
        <div
          key={stage.id}
          className="flex gap-4 p-4 border rounded px-3"
          onClick={(ev) => {
            ev.stopPropagation();
            setEdit(stage.id);
          }}
        >
          <h3 className="w-md">{stage.name}</h3>
          <div className="flex gap-2 flex-wrap">
            {stage.projectStages.map((ps) => (
              <RecordBadge
                key={ps.project.id}
                name={ps.project.name}
                onRemove={(ev) => {
                  ev.stopPropagation();
                  setStages((prev) =>
                    prev.map((s) => {
                      if (s.id === stage.id) {
                        return {
                          ...s,
                          projectStages: s.projectStages.filter(
                            (p) => p.project.id !== ps.project.id,
                          ),
                        };
                      }
                      return s;
                    }),
                  );
                }}
              />
            ))}
            {edit === stage.id && (
              <RecordSelector
                data={null}
                isMany={true}
                model="project"
                inputClassName="p-2 w-auto border-0 outline-none focus-within:border-b-zinc-950 focus-within:border-b"
                setData={({ id, name }) =>
                  onRecordSelectorChange({ id, name }, stage.id)
                }
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Stage;
