import { Router } from "express";
import { VehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = Router();

const {
  createVehicle,
  getVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
} = VehicleController;

router.post("/", auth("admin"), createVehicle);
router.get("/", getVehicle);
router.get("/:vehicleId", getSingleVehicle);
router.put("/:vehicleId", auth("admin"), updateVehicle);
router.delete("/:vehicleId", auth("admin"), deleteVehicle);

export const vehicleRoutes = router;
