import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const { createBookingInDB, getBookingsFromDB, updateBookingInDB } =
  bookingServices;

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await createBookingInDB(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
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
    const bookings = await getBookingsFromDB(user);
    let message;
    let resultData;
    if (user.role === "admin") {
      message = "Bookings retrieved successfully";
      resultData = bookings.map((result) => ({
        ...result,
        customer: {
          name: result.customer?.name,
          email: result.customer?.email,
        },
        vehicle: {
          vehicle_name: result.vehicle?.vehicle_name,
          registration_number: result.vehicle?.registration_number,
        },
      }));
    } else {
      message = "Your bookings retrieved successfully";
      resultData = bookings.map((result) => ({
        ...result,
        vehicle: {
          vehicle_name: result.vehicle?.vehicle_name,
          registration_number: result.vehicle?.registration_number,
          type: result.vehicle?.type,
        },
      }));
    }
    res.status(200).json({
      success: true,
      message,
      data: resultData,
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
    let message;
    if (user.role === "admin") {
      message = "Booking marked as returned. Vehicle is now available";
    } else {
      message = "Booking cancelled successfully";
    }
    res.status(200).json({
      success: true,
      message,
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
