import express, { Request, Response } from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express();

// Parser
app.use(express.json());

// initializing DB
initDB();

// users CRUD
app.use("/api/v1/users", userRoutes);

// vehicles CRUD
app.use("/api/v1/vehicles", vehicleRoutes);

// booking CRUD
app.use("/api/v1/bookings", bookingRoutes);

// auth CRUD
app.use("/api/v1/auth", authRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
