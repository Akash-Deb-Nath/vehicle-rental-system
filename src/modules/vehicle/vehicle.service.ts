import { pool } from "../../config/db";

const createVehicleInDB = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};
const getVehicleFromDB = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};
const getSingleVehicleFromDB = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  return result;
};
const updateVehicleInDB = async (
  payload: Record<string, unknown>,
  id: string
) => {
  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;
  for (const [key, value] of Object.entries(payload)) {
    fields.push(`${key}=$${index}`);
    values.push(value);
    index++;
  }
  if (fields.length === 0) {
    throw new Error("No fields to update");
  }
  values.push(id);
  const result = await pool.query(
    `UPDATE vehicles 
    SET ${fields.join(", ")} 
    WHERE id=$${index}
    RETURNING *;
`,
    values
  );
  return result;
};
const deleteVehicleFromDB = async (id: string) => {
  const active = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'`,
    [id]
  );
  if (active.rows.length > 0) {
    throw new Error("Cannot delete vehicle: active bookings exist");
  }
  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);
  return result;
};

export const vehicleServices = {
  createVehicleInDB,
  getVehicleFromDB,
  getSingleVehicleFromDB,
  updateVehicleInDB,
  deleteVehicleFromDB,
};
