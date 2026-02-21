import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Outlet, createFileRoute, useParams } from "@tanstack/react-router";
import axios from "axios";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecordSelector from "@/components/RecordSelector";
import { useEffect, useReducer, useState } from "react";
import { format } from "date-fns/format";
export const Route = createFileRoute("/_pathlessLayout/projects/$projectId/")({
  component: ProjectComponent,
});

interface Project {
  id: number;
  created_at: Date;
  updated_at: Date;
  active: boolean;
  name: string;
  description: string | null;
  owner_id: number;
  date_end: Date | null;
  owner: { id: number; name: string };
  customer_id: number | null;
  customer: { id: number; name: string } | null;
}

type actions =
  | { type: "SET_NAME"; payload: Project["name"] }
  | { type: "SET_DESCRIPTION"; payload: Project["description"] }
  | { type: "SET_OWNER_ID"; payload: Project["owner"] }
  | { type: "SET_DATE_END"; payload: Project["date_end"] }
  | { type: "SET_CUSTOMER_ID"; payload: Project["customer"] }
  | { type: "SET_INITIAL"; payload: Project };

function ProjectComponent() {
  const [project, setProject] = useState<Project | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const params = useParams({ from: "/_pathlessLayout/projects/$projectId/" });

  const formReducerFunction = (state: Project, action: actions) => {
    switch (action.type) {
      case "SET_NAME":
        return { ...state, name: action.payload };
      case "SET_DESCRIPTION": {
        return { ...state, description: action.payload };
      }
      case "SET_OWNER_ID": {
        return {
          ...state,
          owner: action.payload,
          owner_id: action.payload.id,
        };
      }
      case "SET_CUSTOMER_ID": {
        return {
          ...state,
          customer: action.payload || null,
          customer_id: action.payload?.id || null,
        };
      }
      case "SET_DATE_END": {
        return { ...state, date_end: action.payload };
      }
      case "SET_INITIAL": {
        return { ...state, ...action.payload };
      }
      default:
        return state;
    }
  };

  const [formData, dispatch] = useReducer<Project, [action: actions]>(
    formReducerFunction,
    {
      id: 0,
      created_at: new Date(),
      updated_at: new Date(),
      active: false,
      name: "",
      description: null,
      owner_id: 0,
      date_end: null,
      owner: { id: 0, name: "" },
      customer_id: null,
      customer: { id: 0, name: "" },
    },
  );
 const onSaveChanges = () => {
   
 };
 
 const onDiscardChanges = () => {
  dispatch({ type: "SET_INITIAL", payload: project! });
 };

  useEffect(() => {
    axios.get(`/api/project/${params.projectId}`).then((response) => {
      dispatch({ type: "SET_INITIAL", payload: response.data.project });
      setProject(response.data.project);
    });
  }, [params.projectId]);
  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-5 w-full flex flex-col gap-2">
      <div className="flex items-center justify-between gap-5">
        <div className="w-1/2">
          <Label>Project Name</Label>
          <Input
            className="my-2"
            type="text"
            value={formData.name}
            onChange={(ev) => {
              dispatch({ type: "SET_NAME", payload: ev.target.value });
            }}
          />
        </div>
        <div className="w-1/2">
          <Label>DeadLine</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild className="my-2 ">
              <Button
                variant={"outline"}
                data-empty={!formData.date_end}
                className="data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal"
              >
                {formData.date_end ? (
                  format(new Date(formData.date_end), "PPP")
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
                  formData.date_end ? new Date(formData.date_end) : undefined
                }
                onSelect={(date) => {
                  dispatch({ type: "SET_DATE_END", payload: date || null });
                  setCalendarOpen(false);
                }}
                defaultMonth={
                  formData.date_end ? new Date(formData.date_end) : new Date()
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex items-center justify-between gap-5">
        <div className="w-1/2">
          <Label>Customer</Label>
          <RecordSelector
            data={formData.customer || null}
            model="user"
            setData={(customer) => {
              dispatch({ type: "SET_CUSTOMER_ID", payload: customer });
            }}
          />
        </div>
        <div className="w-1/2">
          <Label>Project Manager</Label>
          <RecordSelector
            data={formData.owner}
            model="user"
            setData={(owner) => {
              dispatch({ type: "SET_OWNER_ID", payload: owner });
            }}
          />
        </div>
      </div>
      <div className="h-full">
        <Label>Description</Label>
        <Textarea
          className=" min-h-96 my-3"
          value={formData.description || ""}
          onChange={(ev) =>
            dispatch({ type: "SET_DESCRIPTION", payload: ev.target.value })
          }
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
