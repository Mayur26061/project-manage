import type { Response, Request } from "express";
import z from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils.js";
import type { Prisma } from "@/generated/prisma/client.js";

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
});


export const getTasks = asyncHandler(async (_req: Request, res: Response) => {
  const tasks = await prisma.task.findMany();
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
      where: { project_id: projectId },
      select: {
        stage: {
          select: { id: true, name: true, sequence: true, tasks: true },
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
          select:{ user: { select: { id: true, name: true } } }
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
  if (result.deadline !== undefined) {
    data.deadline = result.deadline;
  }
  if (result.priority !== undefined) {
    data.priority = result.priority;
  }
  const task = await prisma.task.update({
    where: { id: taskId },
    data: data,
    include: {
      project: {
        select: { id: true, name: true }
      }, stage: { select: { id: true, name: true } }
    },
  });
  res.json({ task });
});
