import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Settings, SquarePenIcon, Trash2, User } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SimpleCreateDialog from "@/components/SimpleCreateDialog";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export const Route = createFileRoute("/_pathlessLayout/projects/")({
  component: ProjectsComponent,
});

interface Project {
  id: number;
  created_at: Date;
  updated_at: Date;
  active: boolean;
  name: string;
  description: string | null;
  owner_id: number;
  owner: { id: number; name: string };
  customer: { id: number; name: string } | null;
}

function ProjectsComponent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/project/projects")
      .then((response) => setProjects(response.data));
  }, []);

  const openProjecConfig = (ev: React.MouseEvent, projectId: number) => {
    ev.preventDefault();
    navigate({
      to: "/projects/$projectId",
      params: { projectId: String(projectId) },
    });
    console.log("open project config");
  };

  const onDeleteProject = async (ev: React.MouseEvent, projectId: number) => {
    ev.preventDefault();
    ev.stopPropagation();
    try {
      const response = await axios.delete(`/api/project/delete/${projectId}`);
      if (response.status === 204) {
        setProjects(projects.filter((p) => p.id !== projectId));
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const onCreateProject = async (name: string) => {
    try {
      const response = await axios.post("/api/project/create", { name });
      if (response.status === 201) {
        setProjects((preprojects) => [...preprojects, response.data.project]);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <>
      <div className="h-screen flex flex-wrap bg-white border-gray-300 border gap-1 p-3 content-start">
        <div className="w-full flex items-center gap-3 mb-3">
          <h1 className="text-2xl font-bold">Projects</h1>
          <SimpleCreateDialog title="Create Project" onSave={onCreateProject}>
            <Button variant="outline">Create Project</Button>
          </SimpleCreateDialog>
        </div>
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 m-2 border rounded shadow w-96 h-48 relative"
          >
            <Popover>
              <PopoverTrigger asChild>
                <Settings className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-gray-600" />
              </PopoverTrigger>
              <PopoverContent
                className="w-40 p-0 cursor-pointer"
                align="center"
              >
                <div
                  className="flex items-center gap-2 hover:bg-gray-200 p-3"
                  onClick={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    openProjecConfig(ev, project.id);
                  }}
                >
                  <SquarePenIcon className="cursor-pointer text-gray-400 hover:text-gray-600" />
                  Edit
                </div>
                <ConfirmationDialog
                  itemName={project.name}
                  onConfirm={(ev) => onDeleteProject(ev, project.id)}
                >
                  <div className="flex items-center gap-2 hover:bg-gray-200 p-3">
                    <Trash2 className="cursor-pointer text-gray-400 hover:text-gray-600" />
                    Delete
                  </div>
                </ConfirmationDialog>
              </PopoverContent>
            </Popover>
            <Link
              key={project.id}
              to={`/projects/$projectId/tasks`}
              params={{
                projectId: String(project.id),
              }}
            >
              <div className="flex flex-col justify-between max-w-80 h-full">
                <div className="grow">
                  <h2 className="text-xl font-bold mb-2 text-ellipsis line-clamp-1">
                    {project.name}
                  </h2>
                  <p className="text-gray-600 text-ellipsis line-clamp-4">
                    {project.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <User /> {project.owner.name}
                </div>
              </div>
            </Link>
          </div>
        ))}
        <Outlet />
      </div>
    </>
  );
}
