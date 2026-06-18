import { Request, Response } from "express";
import { db } from "../db.js";

export const getcaretakerDetails = (req: Request, res: Response): void => {
  const sql = "";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err.message);
      res.status(500).json(err.message);
    } else {
      res.json(results);
    }
  });
};
