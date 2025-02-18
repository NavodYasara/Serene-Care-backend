// controller/authController.js

import { registerService, loginService } from "../models/authModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

// Register a new user
export const registerController = async (req, res) => {
  console.log(req.body);
  const { firstName, lastName, email, password, role } = req.body;

  try {
    const data = await registerService(
      firstName,
      lastName,
      email,
      password,
      role
    );
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Login a user
export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const loginData = await loginService(email, password);
    const token = generateToken(loginData);
    return res
      .status(200)
      .json({ message: "User logged in successfully", user: loginData, token });
  } catch (error) {
    res.status(500).json({ Error: error });
  }
};


