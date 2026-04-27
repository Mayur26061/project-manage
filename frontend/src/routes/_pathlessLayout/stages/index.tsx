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

  useEffect(() => {
    console.log("Stage mounted");
    axios.get("/api/stage/stages").then((res) => {
      setStages(res.data);
    });
  }, []);

  return (
    <div className="mx-3">
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
          className="flex gap-4 p-4 border rounded px-3 "
        >
          <h3 className="w-md">{stage.name}</h3>
          <div className="flex gap-2 flex-wrap">
            {stage.projectStages.map((ps) => (
              <RecordBadge
                key={ps.project.id}
                name={ps.project.name}
                onRemove={() => {
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
            <RecordSelector
              data={null}
              isMany={true}
              model="project"
              inputClassName="p-2 w-auto border-0 outline-none focus-within:border-b-zinc-950 focus-within:border-b"
              setData={() => {}}
            />
            {/* <RecordSelector
            <input type="text" placeholder="Add project..." className="p-2 w-auto border-0 outline-none focus-within:border-b-zinc-950 focus-within:border-b" /> */}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Stage;
