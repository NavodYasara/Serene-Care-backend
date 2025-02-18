import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
  return jwt.sign({ userId: user.userId, username: user.userName },JWT_SECRET,{ expiresIn: '1h' });
};
export { generateToken };

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
export { verifyToken };

