import React from "react";

type Props = {
  task: {
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
  };
};

const TaskBox = ({ task }: Props) => {
  return (
    <div className="border border-gray-300 rounded-lg p-2 shadow-sm bg-white" draggable={true}>
      <h3 className="font-bold">{task.name}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>
      <p className="text-xs text-gray-500">Status: {task.status}</p>
    </div>
  );
};

export default TaskBox;
