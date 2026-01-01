import type { Response, Request } from "express";
import asyncHandler from "express-async-handler";
import z from "zod";
import { prisma } from "../lib/prisma.js";

export const getProjects = asyncHandler(
  async (_req: Request, res: Response) => {
    const projects = await prisma.project.findMany();
    res.json(projects);
  }
);

export const getSelectedProject = asyncHandler(
  async (req: Request, res: Response) => {
    const data = z.number().safeParse(Number(req.params.id));
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
