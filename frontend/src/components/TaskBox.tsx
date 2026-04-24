import { useNavigate } from "@tanstack/react-router";

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
  const navigate = useNavigate();
  const onClick = () => {
    // Handle click event, e.g., navigate to task details or open a modal
    console.log(`Task ${task.id} clicked`);
    navigate({ to: "/tasks/$taskId", params: { taskId: task.id.toString() } });
  };
  return (
    <div
      className="border border-gray-300 rounded-lg p-2 shadow-sm bg-white"
      onClick={onClick}
      draggable
      onDragStart={(ev) => {
        ev.dataTransfer.setData("text/plain", task.id.toString());
      }}
    >
      <h3 className="font-bold">{task.name}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>
      <p className="text-xs text-gray-500">Status: {task.status}</p>
    </div>
  );
};

export default TaskBox;
