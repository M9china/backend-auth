import pool from "../db/index.js";

export const createUser = async (email, passwordHash) => {
  const res = await pool.query(
    `INSERT INTO users (email, password) 
        VALUES ($1, $2) RETURNING id, email`,
    [email, passwordHash]
  );
  return res.rows[0];
};

export const findUserByEmail = async (email) => {
  const res = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

  return res.rows[0];
};
