import type { Response, Request } from "express";
import z from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, limitFetchParams } from "../utils.js";
import type { Prisma } from "@/generated/prisma/client.js";
import type { TaskWhereInput } from "@/generated/prisma/internal/prismaNamespaceBrowser.js";

const taskCreateCheck = z.object({
  name: z.string().min(1),
  project_id: z.number().gt(0),
  description: z.string().min(1).optional(),
  stage_id: z.number().gt(0).optional(),
  // sequence: z.number().optional(),
  // priority: z.number().optional(),
  // deadline: z.date().optional(),
  status: z
    .enum(["APPROVED", "IN_PROGRESS", "CHANGE_REQUESTED", "DONE"])
    .optional(),
});

const taskUpdateCheck = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: z
    .enum(["APPROVED", "IN_PROGRESS", "CHANGE_REQUESTED", "DONE"])
    .optional(),
  project_id: z.number().gt(0).optional(),
  deadline: z.string().optional().nullable(),
  priority: z.number().optional(),
  stage_id: z.number().gt(0).optional(),
  assignees: z.array(z.object({ op: z.enum(["add", "remove"]), value: z.string() })).optional(),
}).refine((data) => Object.values(data).some((value) => value !== undefined), {
  message: "Empty Object",
});


export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const data = limitFetchParams.parse(req.query);
  const titleFilter: TaskWhereInput = data.title
    ? {
      name: { contains: data.title, mode: "insensitive" },
      active: true,
    }
    : { active: true };
  const tasks = await prisma.task.findMany({
    where: titleFilter,
    skip: data.offset,
    take: data.limit,
    orderBy: { created_at: "asc" },
  });
  res.json(tasks);
});

export const getProjectTasks = asyncHandler(
  async (req: Request, res: Response) => {
    const data = z.number().safeParse(Number(req.params.projectId));
    if (data.error) {
      res.status(400);
      return;
    }
    const projectId = data.data;
    const result = await prisma.projectStage.findMany({
      where: { project: { id: projectId } },
      include: {
        stage: {
          select: { id: true, name: true, sequence: true, tasks: { where: { project_id: projectId }, take: 10 /* update this with offset and limit */ } },
        },
      },
      orderBy: [
        { stage: { sequence: "asc" } },
        { stage: { created_at: "asc" } },
      ],
    });
    res.json({ result });
  }
);

export const getSelectedTask = asyncHandler(
  async (req: Request, res: Response) => {
    const data = z.number().safeParse(Number(req.params.id));
    if (data.error) {
      res.status(400);
      return;
    }
    const taskId = data.data;
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: { id: true, name: true }
        }, stage: { select: { id: true, name: true } },
        taskAssignments: {
          select: { user: { select: { id: true, name: true } } }
          // include: {user: { select: { id: true, name: true } } }
        }
      },
    });
    res.json({ task });
  }
);

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const result = taskCreateCheck.parse(req.body);
  const data: Prisma.TaskCreateInput = {
    name: result.name,
    project: { connect: { id: result.project_id } },
  };
  if (!result.stage_id) {
    const projectStageId = await prisma.projectStage.findFirst({
      where: { project_id: result.project_id },
      orderBy: { stage: { sequence: "asc" } },
    });
    if (projectStageId) {
      data.stage = { connect: { id: projectStageId.stage_id } };
    }
  } else {
    data.stage = { connect: { id: result.stage_id } };
  }
  const task = await prisma.task.create({
    data: data,
  });
  res.status(201).json({ task });
  return;
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const result = taskUpdateCheck.parse(req.body);
  const taskId = Number(req.params.id);
  const data: Prisma.TaskUpdateInput = {};
  if (result.name !== undefined) {
    data.name = result.name;
  }
  if (result.description !== undefined) {
    data.description = result.description;
  }
  if (result.status !== undefined) {
    data.status = result.status;
  }
  if (result.project_id !== undefined) {
    data.project = { connect: { id: result.project_id } };
  }
  if (result.stage_id !== undefined) {
    data.stage = { connect: { id: result.stage_id } };
  }
  if (result.deadline !== undefined) {
    data.deadline = result.deadline;
  }
  if (result.priority !== undefined) {
    data.priority = result.priority;
  }
  if (result.assignees !== undefined && result.assignees.length > 0) {
    data.taskAssignments = {
      deleteMany: result.assignees.filter((cmd) => cmd.op === "remove").map((cmd) => ({ user_id: Number(cmd.value) })),
      createMany: {
        data: result.assignees.filter((cmd) => cmd.op === "add").map((cmd) => ({ user_id: Number(cmd.value) })),
      },
    };
  }
  const task = await prisma.task.update({
    where: { id: taskId },
    data: data,
    include: {
      project: {
        select: { id: true, name: true }
      }, stage: { select: { id: true, name: true } },
      taskAssignments: {
        select: { user: { select: { id: true, name: true } } }
      }
    },
  });
  res.json({ task });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const taskId = Number(req.params.id);
  await prisma.task.delete({ where: { id: taskId } });
  res.status(204).send();
});