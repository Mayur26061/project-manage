import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Priority from "@/components/Priority";
import RecordSelector from "@/components/RecordSelector";
import { format } from "date-fns";
import { ChevronDownIcon, Dot } from "lucide-react";
import { Outlet, createFileRoute, useParams } from "@tanstack/react-router";
import RecordBadge from "@/components/RecordBadge";

export const Route = createFileRoute("/_pathlessLayout/tasks/$taskId")({
  component: TaskComponent,
});

interface UpdateTaskPayload {
  name: string;
  description: string | null;
  status: "APPROVED" | "IN_PROGRESS" | "CHANGE_REQUESTED" | "DONE";
  project_id: number;
  deadline: Date | null;
  priority: number;
  // assignees?: string; // JSON stringified array of commands
}
interface Assignee {
  user: { id: number; name: string };
}
interface Task {
  id: number;
  project_id: number;
  stage_id: number | null;
  name: string;
  sequence: number;
  created_at: Date;
  updated_at: Date;
  active: boolean;
  priority: number;
  description: string | null;
  deadline: Date | null;
  status: "APPROVED" | "IN_PROGRESS" | "CHANGE_REQUESTED" | "DONE";
  project: { id: number; name: string };
  stage: { id: number; name: string };
  taskAssignments: Assignee[];
}

const STATUS = ["APPROVED", "IN_PROGRESS", "CHANGE_REQUESTED", "DONE"] as const;
const statusColors: Record<(typeof STATUS)[number], string> = {
  APPROVED: "text-green-400",
  IN_PROGRESS: "text-blue-400",
  CHANGE_REQUESTED: "text-orange-500",
  DONE: "text-green-700",
};
type actions =
  | {
      type: "SET_NAME";
      payload: Task["name"];
    }
  | { type: "SET_DESCRIPTION"; payload: Task["description"] }
  | { type: "SET_STATUS"; payload: Task["status"] }
  | { type: "SET_PROJECT_ID"; payload: Task["project"] }
  | { type: "SET_DEADLINE"; payload: Task["deadline"] }
  | { type: "SET_PRIORITY"; payload: Task["priority"] }
  | { type: "SET_INITIAL"; payload: Task }
  | { type: "SET_ASSIGNEE"; payload: Assignee }
  | { type: "REMOVE_ASSIGNEE"; payload: { user_id: number } };

function TaskComponent() {
  const params = useParams({ from: "/_pathlessLayout/tasks/$taskId" });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [initData, setInitData] = useState<Task | null>(null);

  const formReducerFunction = (state: Task, action: actions) => {
    switch (action.type) {
      case "SET_NAME": {
        return { ...state, name: action.payload };
      }
      case "SET_DESCRIPTION": {
        return { ...state, description: action.payload };
      }
      case "SET_STATUS": {
        return { ...state, status: action.payload };
      }
      case "SET_PROJECT_ID": {
        return {
          ...state,
          project: action.payload,
          project_id: action.payload.id,
        };
      }
      case "SET_DEADLINE": {
        return { ...state, deadline: action.payload };
      }
      case "SET_PRIORITY": {
        return { ...state, priority: action.payload };
      }
      case "SET_INITIAL": {
        return { ...state, ...action.payload };
      }
      case "SET_ASSIGNEE": {
        for (const assignment of state.taskAssignments) {
          if (assignment.user.id === action.payload.user.id) {
            return state;
          }
        }
        return {
          ...state,
          taskAssignments: [...state.taskAssignments, action.payload],
        };
      }
      case "REMOVE_ASSIGNEE": {
        return {
          ...state,
          taskAssignments: state.taskAssignments.filter(
            (assignment) => assignment.user.id !== action.payload.user_id,
          ),
        };
      }
      default:
        return state;
    }
  };

  const [formData, dispatch] = useReducer<Task, [action: actions]>(
    formReducerFunction,
    {
      name: "",
      description: "",
      status: "IN_PROGRESS",
      project_id: 0,
      deadline: null,
      priority: 0,
      id: 0,
      stage_id: null,
      sequence: 0,
      created_at: new Date(),
      updated_at: new Date(),
      active: true,
      project: { id: 0, name: "" },
      stage: { id: 0, name: "" },
      taskAssignments: [],
    },
  );

  useEffect(() => {
    axios.get(`/api/task/${params.taskId}`).then((response) => {
      dispatch({ type: "SET_INITIAL", payload: response.data.task });
      setInitData(response.data.task);
    });
  }, [params.taskId]);

  const onDiscardChanges = () => {
    if (initData) {
      dispatch({ type: "SET_INITIAL", payload: initData });
    }
  };

  const onSaveChanges = async () => {
    // Implement save logic here
    const keyChecks: (keyof UpdateTaskPayload)[] = [
      "name",
      "description",
      "status",
      "project_id",
      "deadline",
      "priority",
    ];

    // Partial update data for optional fields
    const updatedData: Partial<UpdateTaskPayload> = {};
    for (const key of keyChecks) {
      const value = formData[key];
      if (
        formData[key] !== initData?.[key] &&
        value !== null &&
        value !== undefined
      ) {
        (updatedData as Partial<Record<typeof key, typeof value>>)[key] = value;
      }
    }
    const initialAssigneeIds = new Set(
      initData?.taskAssignments.map((u) => u.user.id) || [],
    );
    const updatedAssigneeIds = new Set(
      formData.taskAssignments.map((u) => u.user.id),
    );
    const commands: Record<string, string>[] = [];
    const overall = new Set([...initialAssigneeIds, ...updatedAssigneeIds]);
    for (const id of overall) {
      if (!initialAssigneeIds?.has(id)) {
        commands.push({ op: "add", value: id.toString() });
      } else if (!updatedAssigneeIds.has(id)) {
        commands.push({ op: "remove", value: id.toString() });
      }
    }
    console.log("Commands: ", commands);
    if (Object.keys(updatedData).length === 0 && commands.length === 0) {
      return;
    }
    try {
      const response = await axios.put(`/api/task/update/${params.taskId}`, {
        ...updatedData,
        assignees: commands,
      });
      if (response.status !== 200) {
        throw new Error("Failed to update task");
      }
      dispatch({ type: "SET_INITIAL", payload: response.data.task });
      setInitData(response.data.task);
    } catch (error) {
      dispatch({ type: "SET_INITIAL", payload: initData! });
      console.error("Error updating task: ", error);
    }
  };

  const OnSelectAssignee = (user: { id: number; name: string }) => {
    dispatch({ type: "SET_ASSIGNEE", payload: { user } });
  };

  if (formData.id === 0) {
    return <div className="p-5">Loading...</div>;
  }

  return (
    <div className="p-5 w-full flex flex-col gap-2">
      <div className="flex items-center justify-between gap-5">
        <div className="w-5/6">
          <Label>Title</Label>
          <Input
            className="my-2"
            type="text"
            value={formData.name}
            onChange={(ev) => {
              dispatch({ type: "SET_NAME", payload: ev.target.value });
            }}
          />
        </div>
        <div className="w-1/6">
          <Popover open={stateOpen} onOpenChange={setStateOpen}>
            <PopoverTrigger asChild className="mt-3">
              <Button
                variant={"outline"}
                data-empty={!formData.deadline}
                className="data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal overflow-hidden"
              >
                {formData.status}
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              {STATUS.map((status, _key) => (
                <div
                  key={_key}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    dispatch({
                      type: "SET_STATUS",
                      payload: status as Task["status"],
                    });
                    setStateOpen(false);
                  }}
                >
                  <Dot strokeWidth={10} className={statusColors[status]} />{" "}
                  {status}
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="w-1/2">
          <Label>Project</Label>
          <RecordSelector
            data={formData.project}
            setData={(project) =>
              dispatch({ type: "SET_PROJECT_ID", payload: project })
            }
            model="project"
          />
        </div>
        <div className="w-1/2">
          <Label>DeadLine</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild className="my-2 ">
              <Button
                variant={"outline"}
                data-empty={!formData.deadline}
                className="data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal"
              >
                {formData.deadline ? (
                  format(new Date(formData.deadline), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={
                  formData.deadline ? new Date(formData.deadline) : undefined
                }
                onSelect={(ev) => {
                  dispatch({ type: "SET_DEADLINE", payload: ev || null });
                  setCalendarOpen(false);
                }}
                defaultMonth={
                  formData.deadline ? new Date(formData.deadline) : new Date()
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="w-1/2">
          <Label>Assigneess</Label>
          <div className="flex gap-1 my-2 flex-wrap">
            {formData.taskAssignments.map((assignee, index) => (
              <RecordBadge
                key={index}
                name={assignee.user.name}
                onRemove={() => {
                  dispatch({
                    type: "REMOVE_ASSIGNEE",
                    payload: { user_id: assignee.user.id },
                  });
                }}
              />
            ))}
            <RecordSelector
              data={null}
              isMany={true}
              model="user"
              inputClassName="w-auto border-0 outline-none border-b-2"
              setData={OnSelectAssignee}
            />
          </div>
        </div>
        <div className="w-1/2">
          <Label>Priority</Label>
          <Priority
            priority={formData.priority}
            onSelect={(priority) =>
              dispatch({ type: "SET_PRIORITY", payload: priority })
            }
          />
        </div>
      </div>
      <div className="h-full">
        <Label>Description</Label>
        <Textarea
          onChange={(ev) => {
            dispatch({ type: "SET_DESCRIPTION", payload: ev.target.value });
          }}
          className=" min-h-96 my-3"
          value={formData.description || ""}
          placeholder="Enter Description here"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={onSaveChanges}>Save</Button>
        <Button variant={"outline"} onClick={onDiscardChanges}>
          Cancel
        </Button>
      </div>
      <Outlet />
    </div>
  );
}
