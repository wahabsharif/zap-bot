// src/pages/api/users/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/lib/mongodb";
import {
  wrapRegisterUser,
  wrapLoginUser,
  wrapCheckAdmin,
  wrapGetAllUsers,
  wrapLogoutUser, // Add this line
} from "@/utils/requestWrapper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongo();

  switch (req.method) {
    case "POST":
      if (req.query.action === "register") {
        return wrapRegisterUser(req, res);
      } else if (req.query.action === "login") {
        return wrapLoginUser(req, res);
      } else if (req.query.action === "logout") {
        // Add this line
        return wrapLogoutUser(req, res);
      }
      break;
    case "GET":
      if (req.query.action === "checkAdmin") {
        return wrapCheckAdmin(req, res);
      } else if (req.query.action === "getAllUsers") {
        return wrapGetAllUsers(req, res);
      }
      break;
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
