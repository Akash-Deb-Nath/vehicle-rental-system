import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const createUserInDB = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  const hashedPassword = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1,LOWER($2),$3,$4,$5) RETURNING *`,
    [name, email, hashedPassword, phone, role]
  );
  return result;
};
const loginUserInDB = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;
  const result = await pool.query(`SELECT * FROM users WHERE email=LOWER($1)`, [
    email,
  ]);
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
  const user = result.rows[0];
  const match = await bcrypt.compare(password as string, user.password);
  if (!match) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    config.jwt_secret as string,
    {
      expiresIn: "7d",
    }
  );
  return { token, user };
};

export const authServices = {
  createUserInDB,
  loginUserInDB,
};
