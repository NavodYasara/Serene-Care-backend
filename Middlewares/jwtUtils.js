import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const generateToken = (userId, userType) => {
  const payload = {
    userId,
    userType,
  };

  return jwt.sign(payload, SECRET_KEY, { expiresIn: "4h" });
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    return null;
  }
};

export const verifyTokenAndCheckRole = (roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (!roles.includes(decoded.userType)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    req.user = decoded;
    next();
  };
};
