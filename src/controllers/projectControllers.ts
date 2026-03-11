import type { Response } from "express";
import z from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, type reqObj, limitFetchParams } from "../utils.js";
import type { ProjectWhereInput } from "@/generated/prisma/models.js";
import type { Prisma } from "@/generated/prisma/client.js";

const projectCreateCheck = z.object({
  name: z.string().min(1),
  description: z.string().min(1).optional(),
});

const projectUpdateCheck = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  customer_id: z.number().gt(0).optional().nullable(),
  owner_id: z.number().gt(0).optional(),
  date_end: z.string().optional().nullable(),
});

export const getProjects = asyncHandler(async (_req: reqObj, res: Response) => {
  const projects = await prisma.project.findMany();
  res.json(projects);
});

export const getLimitedProjects = asyncHandler(
  async (req: reqObj, res: Response) => {
    const data = limitFetchParams.parse(req.body);
    const titleFilter: ProjectWhereInput = data.title
      ? {
        name: { contains: data.title, mode: "insensitive" },
        active: true,
      }
      : { active: true };
    const projects = await prisma.project.findMany({
      where: titleFilter,
      select: { id: true, name: true },
      take: 8,
      skip: data.offset,
      orderBy: { name: "asc" },
    });
    res.json({ data: projects });
  }
);

export const getSelectedProject = asyncHandler(
  async (req: reqObj, res: Response) => {
    const data = z.number().gt(0).safeParse(Number(req.params.id));
    if (data.error) {
      res.status(400);
      return;
    }
    const projectId = data.data;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: { select: { id: true, name: true } },
        customer: { select: { id: true, name: true } },
      }
    });
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
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

export const updateProject = asyncHandler(
  async (req: reqObj, res: Response) => {
    const projectId = Number(req.params.id);
    const result = projectUpdateCheck.parse(req.body);
    const data: Prisma.ProjectUpdateInput = {};
    if (result.name) data.name = result.name;
    if (result.description) data.description = result.description;
    if (result.owner_id) data.owner = {connect: {id: result.owner_id}};
    if (result.customer_id !== undefined) data.customer = result.customer_id ? {connect: { id: result.customer_id}} : {disconnect: true};
    if (result.date_end !== undefined) data.date_end = result.date_end ? new Date(result.date_end) : null;
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!data || !existingProject) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...data,
      },
    });
    res.json({ project: updatedProject });
  }
);