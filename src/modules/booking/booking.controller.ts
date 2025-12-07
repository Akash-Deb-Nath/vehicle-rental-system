import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const { createBookingInDB, getBookings, updateBookingInDB } = bookingServices;

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await createBookingInDB(req.body);
    res.status(201).json({
      success: true,
      message: "Booking instered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getBooking = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const result = await getBookings(user);
    res.status(200).json({
      success: true,
      message: "Bookings retrieve successfully",
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
const updateBooking = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { status } = req.body;
    const result = await updateBookingInDB(
      user,
      req.params.bookingId as string,
      status
    );
    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

export const bookingController = {
  createBooking,
  getBooking,
  updateBooking,
};
