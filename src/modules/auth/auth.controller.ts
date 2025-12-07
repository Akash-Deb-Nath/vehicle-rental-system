import { Request, Response } from "express";
import { authServices } from "./auth.service";

const { createUserInDB, loginUserInDB } = authServices;

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await createUserInDB(req.body);
    const { password, ...safeData } = result.rows[0];
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: safeData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await loginUserInDB(req.body);
    const { password, ...safeUser } = result.user;
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: result.token,
        user: safeUser,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const authController = {
  createUser,
  loginUser,
};
