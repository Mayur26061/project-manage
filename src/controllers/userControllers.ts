import bcrypt from "bcryptjs";
import type { Response, Request } from "express";
import jwt from "jsonwebtoken";
import z from "zod";
import { asyncHandler, type reqObj, limitFetchParams } from "../utils.js";
import { prisma } from "../lib/prisma.js";
import type { UserWhereInput } from "@/generated/prisma/models.js";

const signInCheck = z.object({
  email: z.email().min(1),
  password: z.string().min(6),
});

const signUpCheck = signInCheck.extend({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
});

const resetCheck = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
});

const generateToken = (id: number, email: string) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

export const signIn = asyncHandler(async (req: Request, res: Response) => {
  const result = signInCheck.parse(req.body);
  const { email, password } = result;
  const user = await prisma.user.findUnique({
    where: { email, active: true },
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
    where: { id: userId, active: true },
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

export const changePassword = asyncHandler(async (req: reqObj, res: Response) => {
  const userId = req.headers.uid;
  const existUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!existUser) {
    res.json({
      error: true,
      message: "Please SignUp",
    });
    return;
  }
  const result = resetCheck.parse(req.body);
  const { oldPassword, newPassword, confirmPassword } = result;
  if (!(await bcrypt.compare(oldPassword, existUser.password))) {
    res.json({
      error: true,
      message: "Incorrect password",
    });
    return;
  }
  if (newPassword === confirmPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: {
        id: existUser.id,
      },
    });
    res.redirect(307, "/api/user/logout");
    return;
  }

  res.json({
    error: true,
    message: "Password Didn't match",
  });
});

const editProfileCheck = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
});

export const editProfile = asyncHandler(async (req: reqObj, res: Response) => {
  const userId = req.headers.uid;
  const existUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!existUser) {
    res.json({
      error: true,
      message: "User not found",
    });
    return;
  }
  const result = editProfileCheck.parse(req.body);
  const { first_name, last_name } = result;
  const user = await prisma.user.update({
    data: {
      first_name,
      last_name,
    },
    where: {
      id: existUser.id,
    },
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
