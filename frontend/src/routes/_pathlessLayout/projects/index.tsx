import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Settings, User } from "lucide-react";
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
  return (
    <>
      <div className="h-screen flex flex-wrap bg-white border-gray-300 border gap-1 p-3 content-start">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/$projectId/tasks`}
            params={{
              projectId: String(project.id),
            }}
          >
            <div className="p-4 m-2 border rounded shadow w-96 h-48 relative">
              <Settings
                onClick={(ev) => openProjecConfig(ev, project.id)}
                className="absolute top-3 right-3"
              />
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
            </div>
          </Link>
        ))}
        <Outlet />
      </div>
    </>
  );
}
