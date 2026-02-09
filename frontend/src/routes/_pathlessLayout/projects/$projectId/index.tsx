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
import { useEffect, useState } from "react";
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
  customer: { id: number; name: string } | null;
}

function ProjectComponent() {
  const [project, setProject] = useState<Project | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const params = useParams({ from: "/_pathlessLayout/projects/$projectId/" });

  useEffect(() => {
    axios
      .get(`/api/project/${params.projectId}`)
      .then((response) => setProject(response.data.project));
  }, [params.projectId]);
  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-5 w-full flex flex-col gap-2">
      <div className="flex items-center justify-between gap-5">
        <div className="w-1/2">
          <Label>Project Name</Label>
          <Input className="my-2" type="text" value={project.name} />
        </div>
        <div className="w-1/2">
          <Label>DeadLine</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild className="my-2 ">
              <Button
                variant={"outline"}
                // data-empty={!formData.deadline}
                className="data-[empty=true]:text-muted-foreground w-full justify-between text-left font-normal"
              >
                {project.date_end ? (
                  format(new Date(project.date_end), "PPP")
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
                  project.date_end ? new Date(project.date_end) : undefined
                }
                onSelect={() => {
                  // dispatch({ type: "SET_DEADLINE", payload: ev || null });
                  setCalendarOpen(false);
                }}
                defaultMonth={
                  project.date_end ? new Date(project.date_end) : new Date()
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
            data={project.customer || null}
            model="user"
            setData={() => { }}
          />
        </div>
        <div className="w-1/2">
          <Label>Project Manager</Label>
          <RecordSelector
            data={project.owner}
            model="user"
            setData={() => { }}
          />
        </div>
      </div>
      <div className="h-full">
        <Label>Description</Label>
        <Textarea
          className=" min-h-96 my-3"
          value={project.description || ""}
          placeholder="Enter Description here"
        />
      </div>
      {project && JSON.stringify(project)}
      <Outlet />
    </div>
  );
}
