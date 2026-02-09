import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import type { Request, Response } from "express";
import { ZodError, z } from "zod";

interface CustomHeaders {
    uid?: number;
}
export interface reqObj extends Request {
    headers: CustomHeaders & Request["headers"];
}

export const limitFetchParams = z.object({
    offset: z.number().optional().default(0),
    title: z.string().trim().optional(),
});

export const asyncHandler = <
    T extends (req: reqObj, res: Response) => Promise<void>,
>(
    fn: T
) => {
    return async (req: reqObj, res: Response) => {
        try {
            return await fn(req, res);
        } catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({ message: z.prettifyError(err) });
            } else {
                let message = "Internal Server Error";
                if (err instanceof PrismaClientKnownRequestError) {
                    message = err.message
                }
                res.status(500).json({ message });
            }
            console.error(err);
            return;
        }
    };
};
