import {verifyToken} from "../utils/jwt.js";
import db from "../db/db.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = verifyToken(token);
    const users = await db.query("SELECT * FROM user WHERE userId = ?", [
      decoded.userId,
    ]);

    if (!users[0].length) return res.status(401).json({ error: "Invalid user" });

    req.user = users[0][0];
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
