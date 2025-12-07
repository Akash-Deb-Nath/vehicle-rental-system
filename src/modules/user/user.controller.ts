import { Request, Response } from "express";
import { userServices } from "./user.service";

const { getUserFromDB, updateUserInDB, deleteUserFromDB } = userServices;

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await getUserFromDB();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};
const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await updateUserInDB(req.body, req.params.userId as string);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};
const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await deleteUserFromDB(req.params.userId as string);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

export const userController = {
  getUser,
  updateUser,
  deleteUser,
};
