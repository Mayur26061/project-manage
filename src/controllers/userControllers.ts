import bcrypt from "bcryptjs";
import type { Response, Request } from "express";
import jwt from "jsonwebtoken";
import z from "zod";
import { asyncHandler, type reqObj, limitFetchParams } from "../utils.js";
import { prisma } from "../lib/prisma.js";
import type { UserWhereInput } from "@/generated/prisma/models.js";

const signCheck = z.object({
  email: z.email().min(1),
  password: z.string().min(6),
});

const signUpCheck = signCheck.extend({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
});

const generateToken = (id: number, email: string) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

export const signIn = asyncHandler(async (req: Request, res: Response) => {
  const result = signCheck.parse(req.body);
  const { email, password } = result;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }
  const token = generateToken(user.id, user.email);
  res.setHeader(
    "set-cookie",
    `token=${token};Max-Age=172800;Path=/api;HttpOnly;SameSite=Lax;`
  );
  const { id, first_name, last_name, active } = user;
  res.status(200).json({ user: { id, first_name, last_name, email, active } });
});

export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const result = signUpCheck.parse(req.body);
  const { email, password, first_name, last_name } = result;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      first_name,
      last_name,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      active: true,
    },
  });

  const token = generateToken(user.id, user.email);
  res.setHeader(
    "set-cookie",
    `token=${token};Max-Age=172800;Path=/api;HttpOnly;SameSite=None;`
  );
  res.status(201).json({ user });
});

export const getMe = asyncHandler(async (req: reqObj, res: Response) => {
  const userId = req.headers.uid as unknown as number;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      active: true,
    },
  });
  res.status(200).json({ user });
});

export const getLimitedUsers = asyncHandler(
  async (req: reqObj, res: Response) => {
    const data = limitFetchParams.parse(req.body);
    const titleFilter: UserWhereInput = data.title
      ? {
        OR: [
          { first_name: { contains: data.title, mode: "insensitive" } },
          { last_name: { contains: data.title, mode: "insensitive" } },
        ],
        active: true,
      }
      : { active: true };
    const users = await prisma.user.findMany({
      where: titleFilter,
      select: { id: true, name: true },
      take: 8,
      skip: data.offset,
      orderBy: { first_name: "asc" },
    });
    res.json({ data: users });
  }
);

export const logOut = asyncHandler(async (req: reqObj, res: Response) => {
  res.setHeader(
    "set-cookie",
    `token=;Max-Age=0;Path=/api;HttpOnly;SameSite=Lax;`
  );
  res.status(200).json({ message: "Logged out successfully" });
});
