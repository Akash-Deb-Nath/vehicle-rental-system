import { pool } from "../../config/db";

const getUserFromDB = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};
const updateUserInDB = async (payload: Record<string, unknown>, id: string) => {
  const { name, phone, role } = payload;
  const result = await pool.query(
    `UPDATE users SET name=$1,phone=$2,role=$3 WHERE id=$4 RETURNING *`,
    [name, phone, role, id]
  );
  return result;
};
const deleteUserFromDB = async (id: string) => {
  const active = await pool.query(
    `SELECT * FROM bookings WHERE customer_id=$1 AND status='active'`,
    [id]
  );
  if (active.rows.length > 0) {
    throw new Error("Cannot delete user: active bookings exist");
  }
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
};

export const userServices = {
  getUserFromDB,
  updateUserInDB,
  deleteUserFromDB,
};
