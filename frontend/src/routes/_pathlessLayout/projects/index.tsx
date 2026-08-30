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
  const [projectCount, setProjectCount] = useState(0);
  const [projectOffset, setProjectOffset] = useState(0);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `/api/projects?limit=8&offset=${projectOffset}`,
      );
      setProjects(response.data.data);
      setProjectCount(response.data.count);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const onClickNext = () => {
    setProjectOffset((prevOffset) => prevOffset + 8);
  };

  const onClickPrevious = () => {
    setProjectOffset((prevOffset) => Math.max(0, prevOffset - 8));
  };

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
      const response = await axios.delete(`/api/projects/${projectId}`);
      if (response.status === 204) {
        if (projectCount % 8 === 1 && projectOffset > 0) {
          setProjectOffset((prevOffset) => Math.max(0, prevOffset - 8));
        } else {
          fetchProjects();
        }
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const onCreateProject = async (name: string) => {
    try {
      const response = await axios.post("/api/projects", { name });
      if (response.status === 201 && projectCount - projectOffset < 8) {
        setProjects((preprojects) => [...preprojects, response.data.project]);
      }
      if (response.status === 201) {
        setProjectCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, [projectOffset]);

  return (
    <>
      <div className="h-screen flex flex-wrap bg-white border-gray-300 border gap-1 p-3 content-start">
        <div className="w-full flex items-center gap-3 mb-3">
          <h1 className="text-2xl font-bold">Projects</h1>
          <SimpleCreateDialog title="Create Project" onSave={onCreateProject}>
            <Button variant="outline">Create Project</Button>
          </SimpleCreateDialog>
          {projectCount > 0 && (
            <>
              Total Projects: {projectCount}
              <span className="text-gray-500 text-sm">
                {parseInt(String(projectOffset / 8 + 1))}/
                {parseInt(String(projectCount / 8)) +
                  (projectCount % 8 > 0 ? 1 : 0)}
              </span>
              <Button disabled={projectOffset === 0} onClick={onClickPrevious}>
                Previous
              </Button>
              <Button
                disabled={projectOffset + 8 >= projectCount}
                onClick={onClickNext}
              >
                Next
              </Button>
            </>
          )}
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
