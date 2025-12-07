import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const {
  createVehicleInDB,
  getVehicleFromDB,
  getSingleVehicleFromDB,
  updateVehicleInDB,
  deleteVehicleFromDB,
} = vehicleServices;

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await createVehicleInDB(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle instered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getVehicle = async (req: Request, res: Response) => {
  try {
    const result = await getVehicleFromDB();
    res.status(201).json({
      success: true,
      message: "Vehicles retrieve successfully",
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
const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const result = await getSingleVehicleFromDB(req.params.vehicleId as string);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicles retrieve successfully",
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
const updateVehicle = async (req: Request, res: Response) => {
  try {
    const result = await updateVehicleInDB(
      req.body,
      req.params.vehicleId as string
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicles updated successfully",
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
const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result = await deleteVehicleFromDB(req.params.vehicleId as string);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
        data: null,
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

export const VehicleController = {
  createVehicle,
  getVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
