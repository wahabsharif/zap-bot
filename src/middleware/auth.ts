import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    isAdmin: boolean;
  };
}

const authenticate =
  (handler: NextApiHandler) =>
  async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is required" });
    }

    try {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      );
      req.user = {
        userId: decoded.userId,
        isAdmin: decoded.isAdmin,
      };

      // Check if user exists and is an admin if needed
      // const user = await User.findById(req.user.userId);
      // if (user && user.isAdmin !== req.user.isAdmin) {
      //   return res.status(403).json({ message: 'Access denied' });
      // }

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };

export default authenticate;
