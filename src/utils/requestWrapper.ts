import { NextApiRequest, NextApiResponse } from "next";
import { Request, Response } from "express";
import {
  checkAdmin,
  loginUser,
  registerUser,
} from "@/controllers/userController";

export async function wrapRegisterUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const expressReq = req as unknown as Request;
  const expressRes = res as unknown as Response;

  await registerUser(expressReq, expressRes);
}

export async function wrapLoginUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const expressReq = req as unknown as Request;
  const expressRes = res as unknown as Response;

  await loginUser(expressReq, expressRes);
}

export async function wrapCheckAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const expressReq = req as unknown as Request;
  const expressRes = res as unknown as Response;

  await checkAdmin(expressReq, expressRes);
}
