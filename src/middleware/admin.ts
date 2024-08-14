import { NextApiRequest, NextApiResponse } from "next";
import authenticate from "./auth";

const isAdmin =
  (handler: (req: NextApiRequest, res: NextApiResponse) => void) =>
  async (req: any, res: NextApiResponse) => {
    await authenticate(async (req: any, res: NextApiResponse) => {
      if (req.user?.isAdmin) {
        return handler(req, res);
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    })(req, res);
  };

export default isAdmin;
