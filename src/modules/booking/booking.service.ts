import { pool } from "../../config/db";

const createBookingInDB = async (payload: Record<string, unknown>) => {
  const { vehicle_id, customer_id, rent_start_date, rent_end_date } = payload;
  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);
  const vehicleResult = await pool.query(
    `SELECT * FROM vehicles WHERE id=$1 AND availability_status='available'`,
    [vehicle_id]
  );
  if (vehicleResult.rows.length === 0) {
    throw new Error("Vehicle not available");
  }
  const vehicle = vehicleResult.rows[0];
  const number_of_days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = vehicle.daily_rent_price * number_of_days;

  const bookingResult = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, 'active')
     RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );
  let booking = bookingResult.rows[0];
  booking.vehicle = {
    vehicle_name: vehicle.vehicle_name,
    daily_rent_price: vehicle.daily_rent_price,
  };
  console.log(bookingResult);

  return bookingResult;
};
const getBookings = async (user: any) => {
  if (user.role === "admin") {
    return pool.query(`SELECT * FROM bookings`);
  }
  if (user.role === "customer") {
    return pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [user.id]);
  }
  throw new Error("Forbidden");
};
const updateBookingInDB = async (
  user: any,
  bookingId: string,
  status: string
) => {
  const bookingResult = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);
  if (bookingResult.rows.length === 0) {
    throw new Error("Booking not found");
  }
  const booking = bookingResult.rows[0];

  if (user.role === "customer") {
    if (booking.customer_id !== user.id) {
      throw new Error("Forbidden: not your booking");
    }
    if (new Date(booking.rent_start_date) <= new Date()) {
      throw new Error("Cannot cancel after start date");
    }
    if (status !== "cancelled") {
      throw new Error("Customers can only cancel bookings");
    }
  }
  const result = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, bookingId]
  );

  if (status === "cancelled" || status === "returned") {
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );
  }
  return result.rows[0];
};

export const bookingServices = {
  createBookingInDB,
  getBookings,
  updateBookingInDB,
};
