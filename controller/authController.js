import registerService from "../models/authService.js";

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
