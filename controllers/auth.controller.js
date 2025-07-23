import { findUserByEmail, createUser } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRETE = process.env.JWT_SECRETE;

export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: `${email} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, hashedPassword);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid cridentials" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRETE, {
      expiresIn: "1d",
    });
    res.status(200).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Internal server error\n" });
  }
};
