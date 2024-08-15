// pages/api/users/[id].ts

import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongo();

  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
