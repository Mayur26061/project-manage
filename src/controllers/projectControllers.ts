import type { Response } from "express";
import z from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, type reqObj } from "../utils.js";

const projectCreateCheck = z.object({
  name: z.string().min(1),
  description: z.string().min(1).optional(),
});

export const getProjects = asyncHandler(async (_req: reqObj, res: Response) => {
  const projects = await prisma.project.findMany();
  res.json(projects);
});

export const getSelectedProject = asyncHandler(
  async (req: reqObj, res: Response) => {
    console.log(req.headers.uid);
    const data = z.number().gt(0).safeParse(Number(req.params.id));
    if (data.error) {
      res.status(400);
      return;
    }
    const projectId = data.data;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    res.json({ project });
  }
);

export const createProject = asyncHandler(
  async (req: reqObj, res: Response) => {
    const result = projectCreateCheck.parse(req.body);
    const { name } = result;
    const userId = Number(req.headers.uid);
    const project = await prisma.project.create({
      data: {
        name,
        owner_id: userId,
        description: result.description || "",
      },
    });
    res.status(201).json({ project });
    return;
  }
);

export const getProjectStages = asyncHandler(
  async (req: reqObj, res: Response) => {
    const projectId = z.number().gt(0).parse(Number(req.params.id));
    const stages = await prisma.projectStage.findMany({
      where: { project_id: projectId },
      include: { stage: true },
    });
    res.json({ stages });
  }
);
