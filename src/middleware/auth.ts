import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(500).json({ message: "You are not allowed!" });
      }
      const splitToken = token.split(" ")[1];
      if (!splitToken) {
        return res.status(500).json({ message: "Invalid token format" });
      }
      const decodedToken = jwt.verify(
        splitToken,
        config.jwt_secret as string
      ) as JwtPayload;
      req.user = decodedToken;
      if (roles.length && !roles.includes(decodedToken.role)) {
        return res.status(401).json({
          error: "unauthorized",
        });
      }
      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default auth;
