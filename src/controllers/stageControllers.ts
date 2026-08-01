import type { Response } from "express";
import z from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler, limitFetchParams, type reqObj } from "../utils.js";
import type { StageWhereInput } from "@/generated/prisma/internal/prismaNamespaceBrowser.js";

const stageCreateCheck = z.object({
    name: z.string().min(1),
});

const deleteStageCheck = z.object({
    id: z.number().gt(0),
});

export const getStages = asyncHandler(async (req: reqObj, res: Response) => {
    const data = limitFetchParams.parse(req.query);
    const titleFilter: StageWhereInput = data.title
        ? {
            name: { contains: data.title, mode: "insensitive" },
            active: true,
        }
        : { active: true };
    const stages = await prisma.stage.findMany({
        where: titleFilter,
        include: {
            projectStages: {
                include: {
                    project: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        },
        take: data.limit,
        skip: data.offset,
        orderBy: {
            sequence: "asc"
        }
    });
    res.json(stages);
});

export const createStage = asyncHandler(async (req: reqObj, res: Response) => {
    const result = stageCreateCheck.parse(req.body);
    const stage = await prisma.stage.create({
        data: {
            name: result.name,
        },
    });
    res.status(201).json({ stage });
    return;
});

const updateProjectStageCheck = z.object({
    project_id: z.number().gt(0),
    operation: z.enum(["add", "remove"]),
});

export const updateProjectStages = asyncHandler(
    async (req: reqObj, res: Response) => {
        const result = updateProjectStageCheck.parse(req.body);
        const stage_id = z.number().gt(0).parse(Number(req.params.id));
        const { project_id, operation } = result;

        let stage = await prisma.projectStage.findUnique({
            where: {
                project_id_stage_id: {
                    project_id,
                    stage_id,
                },
            },
        });
        if (operation === "add" && !stage) {
            stage = await prisma.projectStage.create({
                data: {
                    project: { connect: { id: project_id } },
                    stage: { connect: { id: stage_id } },
                },
            });
        } else if (operation === "remove" && stage) {
            await prisma.projectStage.delete({
                where: {
                    project_id_stage_id: {
                        project_id,
                        stage_id,
                    },
                },
            });
            res.json({ message: "Stage removed from project" });
            return;
        }
        res.json({ stage });
    }
);

export const deleteStage = asyncHandler(async (req: reqObj, res: Response) => {
    const result = deleteStageCheck.parse({ id: Number(req.params.id) });
    const anyTask = await prisma.task.findFirst({
        where: {
            stage_id: result.id,
        },
    });
    if (anyTask) {
        res.status(400).json({ message: "Cannot delete stage with associated tasks" });
        return;
    }
    await prisma.stage.delete({ where: { id: result.id } });
    res.json({ message: "Stage deleted successfully" });
    return;
});

export const updateStageName = asyncHandler(async (req: reqObj, res: Response) => {
    const stageId = z.number().gt(0).parse(Number(req.params.id));
    const result = stageCreateCheck.parse(req.body);
    const stage = await prisma.stage.update({
        where: { id: stageId },
        data: {
            name: result.name,
        }
    });
    res.json({ stage });
});
