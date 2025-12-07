import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

const { createBooking, getBooking, updateBooking } = bookingController;

router.post("/", auth(), createBooking);
router.get("/", auth(), getBooking);
router.put("/:bookingId", auth(), updateBooking);

export const bookingRoutes = router;
