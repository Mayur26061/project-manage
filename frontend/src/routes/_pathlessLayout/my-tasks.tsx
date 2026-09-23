import { createFileRoute, Link } from "@tanstack/react-router";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";

export const Route = createFileRoute("/_pathlessLayout/my-tasks")({
  component: MyTasksPage,
});

type MyTask = {
  id: number;
  name: string;
  description: string | null;
  status: "APPROVED" | "IN_PROGRESS" | "CHANGE_REQUESTED" | "DONE";
  deadline: string | null;
  project: { id: number; name: string };
  stage: { id: number; name: string } | null;
};

type TasksResponse = {
  tasks: MyTask[];
  total: number;
  offset: number;
  limit: number;
};

const PAGE_SIZE = 10;
const statusStyles: Record<MyTask["status"], string> = {
  APPROVED: "bg-emerald-100 text-emerald-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  CHANGE_REQUESTED: "bg-amber-100 text-amber-800",
  DONE: "bg-gray-100 text-gray-700",
};

function MyTasksPage() {
  const [tasks, setTasks] = useState<MyTask[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce((value: string) => {
    setSearch(value.trim());
    setPage(0);
  }, 300);
  const [status, setStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(false);
    axios
      .get<TasksResponse>("/api/tasks/mine", {
        params: {
          offset: page * PAGE_SIZE,
          limit: PAGE_SIZE,
          ...(search ? { title: search } : {}),
          ...(status !== "all" ? { status } : {}),
        },
      })
      .then(({ data }) => {
        if (cancelled) return;
        setTasks(data.tasks);
        setTotal(data.total);
      })
      .catch((fetchError) => {
        if (cancelled) return;
        console.error("Error fetching assigned tasks:", fetchError);
        setError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, search, status]);

  const applyStatus = (value: string) => {
    setStatus(value);
    setPage(0);
  };

  return (
    <section className="mx-auto max-w-5xl p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Tasks</h1>
        <p className="mt-1 text-sm text-gray-600">Tasks assigned to you across your projects.</p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <Input
          type="search"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            debounceSearch(event.target.value);
          }}
          placeholder="Search tasks…"
          aria-label="Search tasks"
          className="h-10 min-w-0 flex-1 bg-white"
        />
        <Select
          value={status}
          onValueChange={applyStatus}
        >
          <SelectTrigger aria-label="Filter tasks by status" className="w-full bg-white sm:w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="IN_PROGRESS">In progress</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="CHANGE_REQUESTED">Change requested</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-sm text-gray-500">Loading your tasks…</p>
      ) : error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Your tasks could not be loaded. Please try again.
        </p>
      ) : tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="font-medium text-gray-800">No tasks found</h2>
          <p className="mt-1 text-sm text-gray-500">Try changing your search or status filter.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
          {tasks.map((task) => (
            <li key={task.id}>
              <Link
                to="/tasks/$taskId"
                params={{ taskId: String(task.id) }}
                className="flex flex-col gap-3 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h2 className="truncate font-medium text-gray-900">{task.name}</h2>
                  <p className="mt-1 truncate text-sm text-gray-500">
                    {task.project.name}{task.stage ? ` · ${task.stage.name}` : ""}
                    {task.description ? ` · ${task.description}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {task.deadline && <span className="text-sm text-gray-500">Due {format(new Date(task.deadline), "MMM d, yyyy")}</span>}
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[task.status]}`}>
                    {task.status.replaceAll("_", " ")}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>{total === 0 ? "0 tasks" : `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, total)} of ${total} tasks`}</span>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={page === 0 || isLoading}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          <Button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={isLoading || (page + 1) * PAGE_SIZE >= total}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
