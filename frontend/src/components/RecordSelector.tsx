import React, { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import axios from "axios";
type Props = {
  project_id: number;
};

const RecordSelector = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const [projectId, setProjectId] = React.useState(props.project_id);
  const [projects, setProjects] = React.useState<
    Array<{ id: number; name: string }>
  >([]);

  const fetchData = async (title: string | undefined = "") => {
    axios
      .post("/api/project/limited", {
        offset: 0,
        title:title || '',
      })
      .then((response) => {
        console.log("Fetched projects:", response.data);
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  };

  useEffect(() => {
    // Fetch projects or any other data if needed
    if (open) {
      const debounceFetch = setTimeout(() => {
       fetchData("");
        console.log("Popover opened");
        console.log("Fetching data for RecordSelector...");
      }, 300); // Debounce to avoid excessive calls
      return () => clearTimeout(debounceFetch);
    }
  }, [open]);

  const onSelectProject = (projectId: number) => {
    console.log("Selected project ID:", projectId);
    setProjectId(projectId);
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild className="mt-3">
        <Input className="my-2" type="text" value={projectId} onChange={(ev) => {
            fetchData(ev.target.value.trim());
        }}/>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        {projects.map((project) => (
          <div
            onClick={() => onSelectProject(project.id)}
            key={project.id}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            {project.name}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};
export default RecordSelector;
