import { type Dispatch, type SetStateAction } from "react";
import TaskBox from "./TaskBox";
import type { Result } from "@/routes/_pathlessLayout/projects/$projectId/tasks/index";

type Props = {
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
  onTaskUpdate: Dispatch<SetStateAction<Result[]>>;
};

export const Stage = ({ stage, onTaskUpdate }: Props) => {
  return (
    <div
      className="p-4 w-56 h-full shrink-0 flex flex-col gap-4 select-none"
      onDrop={(ev) => {
        const id = ev.dataTransfer.getData("text");
        if (stage.tasks.find((task) => task.id === Number(id))) return;
        onTaskUpdate((prev) => {
          const newData = prev.map((s) => {
            if (s.stage.tasks.find((task) => task.id === Number(id))) {
              return {
                ...s,
                stage: {
                  ...s.stage,
                  tasks: s.stage.tasks.filter((task) => task.id !== Number(id)),
                },
              };
            } else if (s.stage.id === stage.id) {
              const task = prev
                .find((s) =>
                  s.stage.tasks.find((task) => task.id === Number(id)),
                )
                ?.stage.tasks.find((task) => task.id === Number(id));
              if (!task) return s;
              return {
                ...s,
                stage: {
                  ...s.stage,
                  tasks: [...s.stage.tasks, { ...task, stage_id: stage.id }],
                },
              };
            } else {
              return s;
            }
          });
          return newData;
        });
      }}
      onDragOver={(ev) => {
        ev.preventDefault();
      }}
    >
      <div className="border border-gray-300 rounded-lg p-2 shadow-sm bg-white">
        {stage.name} {stage.id}
      </div>
      {stage.tasks.map((task) => (
        <TaskBox key={task.id} task={task} />
      ))}
    </div>
  );
};
