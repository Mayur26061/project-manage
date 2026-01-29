import React, { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
type Props = {
  project: { id: number; name: string };
  setProject: (project: { id: number; name: string }) => void;
};

const RecordSelector = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [projectName, setProjectName] = React.useState("");
  const [projects, setProjects] = React.useState<
    { isLoading: boolean; projects: Array<{ id: number; name: string }> }
  >({ isLoading: true, projects: [] });

  const fetchData = async (title: string | undefined = "") => {
    axios
      .post("/api/project/limited", {
        offset: 0,
        title: title || "",
      })
      .then((response) => {
        console.log("Fetched projects:", response.data);
        setProjects({ isLoading: false, projects: response.data });
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  };

  useEffect(() => {
    // Fetch projects
    if (open) {
      const debounceFetch = setTimeout(() => {
        setProjects({ isLoading: false, projects: [] });
        fetchData(projectName);
      }, 300); // Debounce to avoid excessive calls
      return () => clearTimeout(debounceFetch);
    }
  }, [open, projectName]);
  
  useEffect(() => {
    // Update input value when props.project.name changes
    inputRef.current!.value = props.project.name;
  }, [props.project.name]);
  

  const onSelectProject = (projectId: number, projectName: string) => {
    console.log("Selected project ID:", projectId);
    props.setProject({ id: projectId, name: projectName });
    inputRef.current!.value = projectName;
    setOpen(false);
  };

  return (
    <>
      <Input
        onClick={(ev) => {
          ev.preventDefault();
          setOpen(true);
          ev.currentTarget.focus();
        }}
        className="mt-2"
        type="text"
        ref={inputRef}
        defaultValue={props.project.name}
        onChange={(ev) => {
          setProjectName(ev.target.value);
        }}
      />
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <div />
        </PopoverTrigger>
        <PopoverContent
          onOpenAutoFocus={() => {
            inputRef.current?.focus();
          }}
          className="min-w-5 max-w-64 p-1"
          align="center"
        >
          {projects.projects.map((project) => (
            <div
              onClick={() => onSelectProject(project.id, project.name)}
              key={project.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {project.name}
            </div>
          ))}
          {projects.isLoading ? (
            <LoaderCircle className="mx-auto my-2" />
            // <div className="p-2 text-gray-500">No projects found</div>
          ): projects.projects.length === 0 ? (
            <div className="p-2 text-gray-500">No projects found</div>
          ) : null}
        </PopoverContent>
      </Popover>
    </>
  );
};
export default RecordSelector;
