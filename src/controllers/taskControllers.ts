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
  // status: z
  //   .enum(["APPROVED", "IN_PROGRESS", "CHANGE_REQUESTED", "DONE"])
  //   .optional(),
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
      include: {
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
    });
    res.json({ task });
  }
);

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const result = taskCreateCheck.parse(req.body);
  console.log(result);
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
  }
  const task = await prisma.task.create({
    data: data,
  });
  res.status(201).json({ task });
  return;
});
