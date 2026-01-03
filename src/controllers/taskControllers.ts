import type { Response, Request } from "express";
import z from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils.js";

export const getTasks = asyncHandler(
  async (_req: Request, res: Response) => {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  }
);

export const getProjectTasks = asyncHandler(
  async (req: Request, res: Response) => {
      const data = z.number().safeParse(Number(req.params.projectId));
      if (data.error) {
      res.status(400);
      return;
    }
    const projectId = data.data;
    const tasks = await prisma.task.groupBy({
        by: ['stage_id'],
        where: { project_id: projectId },
    });
    res.json({ tasks });
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
