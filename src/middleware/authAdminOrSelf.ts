import { NextFunction, Request, Response } from "express";

const authAdminOrSelf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user as any;
    const targetUserId = req.params.userId;
    if (loggedInUser.role !== "admin" && loggedInUser.id != targetUserId) {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default authAdminOrSelf;
