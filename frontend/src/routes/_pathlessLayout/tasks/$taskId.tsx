import axios from "axios";
import { useEffect, useReducer } from "react";
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
import { format } from "date-fns";
import { ChevronDownIcon, Dot } from "lucide-react";
import { Outlet, createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_pathlessLayout/tasks/$taskId")({
  component: TaskComponent,
});

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
}
const STATUS = ["APPROVED", "IN_PROGRESS", "CHANGE_REQUESTED", "DONE"] as const;
const statusColors: Record<typeof STATUS[number], string> = {
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
  | { type: "SET_PROJECT_ID"; payload: Task["project_id"] }
  | { type: "SET_DEADLINE"; payload: Task["deadline"] }
  | { type: "SET_PRIORITY"; payload: Task["priority"] }
  | { type: "SET_INITIAL"; payload: Task };

function TaskComponent() {
  const params = useParams({ from: "/_pathlessLayout/tasks/$taskId" });
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
        return { ...state, project_id: action.payload };
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
    },
  );

  useEffect(() => {
    axios.get(`/api/task/${params.taskId}`).then((response) => {
      dispatch({ type: "SET_INITIAL", payload: response.data.task });
    });
  }, [params.taskId]);

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
              console.log(ev.target.value);
              dispatch({ type: "SET_NAME", payload: ev.target.value });
            }}
          />
        </div>
        <div className="w-1/6">
          <Popover>
            <PopoverTrigger asChild className="mt-3">
              <Button
                variant={"outline"}
                data-empty={!formData.deadline}
                className="data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal"
              >
                {formData.status}
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              {STATUS.map(
                (status, _key) => (
                  <div
                    key={_key}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      dispatch({
                        type: "SET_STATUS",
                        payload: status as Task["status"],
                      });
                    }}
                  >
                    <Dot strokeWidth={10} className={statusColors[status]} /> {status}
                  </div>
                ),
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="w-1/2">
          <Label>Project</Label>
          <Input
            className="my-2"
            type="text"
            defaultValue={formData.project_id}
          />
        </div>
        <div className="w-1/2">
          <Label>DeadLine</Label>
          <Popover>
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
          <Input className="my-2" type="text" />
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
      <Outlet />
    </div>
  );
}
