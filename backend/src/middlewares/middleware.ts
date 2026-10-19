import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { jwtSecret } from "../utility/session";

declare global {
  namespace Express {
    interface Request {
      userId: Types.ObjectId;
    }
  }
}

export function auth(req: Request, res: Response, next: NextFunction) {
  // Try to get token from headers or cookies

  const token = req.headers["token"] || req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const decodedInfo = jwt.verify(token as string, jwtSecret()) as JwtPayload;

    if (decodedInfo && typeof decodedInfo !== "string") {
      req.userId = decodedInfo.userId;
      next();
    } else {
      res.status(403).json({ message: "Invalid credentials" });
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "auth failed ";

    res.status(403).json({ message: "Invalid token", error: errorMessage });
  }
}
