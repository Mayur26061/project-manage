import type { Response } from "express";
import z from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, type reqObj } from "../utils.js";

export const getProjects = asyncHandler(
  async (_req: reqObj, res: Response) => {
    const projects = await prisma.project.findMany();
    res.json(projects);
  }
);

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
