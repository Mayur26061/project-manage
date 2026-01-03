import type { reqObj } from "@/utils.js";
import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface UserPayload extends jwt.JwtPayload {
    id: string;
    email: string;
}

export const authenticateToken = (
    req: reqObj,
    res: Response,
    next: NextFunction
) => {
    const token = getCookieToken(req.headers.cookie, "token");
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            res.setHeader("set-Cookie", "token=; HttpOnly; Max-Age=;");
            res.status(403).json({
                status: "error",
                message: "Forbidden Invalid Token",
            });
            return;
        }
        const userPayload = data as UserPayload;
        if (Number(userPayload.id)) {
            req.headers.uid = Number(userPayload.id);
        }
    });
    next();
};

const getCookieToken = (cookie: string | undefined, cname: string) => {
    if (cookie) {
        const cookies = cookie.split("; ");
        for (const cookie of cookies) {
            const [name, value] = cookie.split("=");
            if (name === cname) {
                return value;
            }
        }
        return null;
    }
    return undefined;
};
