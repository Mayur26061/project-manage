import { type Dispatch, type SetStateAction } from "react";
import TaskBox from "./TaskBox";
import type { Result } from "@/routes/_pathlessLayout/projects/$projectId/tasks/index";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import SimpleCreateDialog from "./SimpleCreateDialog";

type Props = {
  stage: {
    name: string;
    project_id: number;
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
  const onDropAsync = async (ev: React.DragEvent<HTMLDivElement>) => {
    const id = ev.dataTransfer.getData("text");
    if (stage.tasks.find((task) => task.id === Number(id))) return;
    try {
      const response = await axios.put(`/api/task/update/${id}`, {
        stage_id: stage.id,
      });
      if (response.status !== 200) {
        throw new Error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task: ", error);
      return;
    }
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
            .find((s) => s.stage.tasks.find((task) => task.id === Number(id)))
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
  };

  const onCreateTask = async (name: string) => {
    try {
      const response = await axios.post("/api/task/create", {
        name,
        stage_id: stage.id,
        project_id: stage.project_id,
      });
      if (response.status !== 201) {
        throw new Error("Failed to create task");
      }
      onTaskUpdate((prev) => {
        const newData = prev.map((s) => {
          if (s.stage.id === stage.id) {
            return {
              ...s,
              stage: {
                ...s.stage,
                tasks: [...s.stage.tasks, { ...response.data.task }],
              },
            };
          }
          return s;
        });
        return newData;
      });
    } catch (error) {
      console.error("Error creating task: ", error);
      return;
    }
  };

  return (
    <div
      className="p-4 w-56 h-full shrink-0 flex flex-col gap-4 select-none"
      onDrop={onDropAsync}
      onDragOver={(ev) => {
        ev.preventDefault();
      }}
    >
      <div className="border border-gray-300 rounded-lg p-2 shadow-sm bg-white">
        {stage.name}
      </div>
      {stage.tasks.map((task) => (
        <TaskBox key={task.id} task={task} />
      ))}
      <SimpleCreateDialog title="Create a Task" onSave={onCreateTask}>
        <div className="border border-gray-300 rounded-lg p-2 shadow-sm bg-white flex items-center justify-center gap-2 text-sm text-gray-500 cursor-pointer">
          <PlusCircle /> New Task
        </div>
      </SimpleCreateDialog>
    </div>
  );
};
