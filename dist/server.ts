import express from "express";
import cors from "cors";
import { db } from "./db.js";
import loginRoutes from "./routes/userRoutes.js";
import requirementRoutes from "./routes/requirementRoutes.js";
import managerRoutes from "./routes/ManagerRoutes.js";
import caregiverRoutes from "./routes/caregiverRoutes.js";
import "dotenv/config";
// Create an Express application as middleware
const app = express();
// Enable CORS for all requests
app.use(cors());
// Enable parsing JSON request bodies using the middleware
app.use(express.json());
//################### Define Routes ####################################################################
app.use("/api/user", loginRoutes);
app.use("/api/requirement", requirementRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/caregiver", caregiverRoutes);
app.use("/", (req, res) => {
    res.send(`Serene Care Server is Listening on port ${PORT}`);
});
// Define a route to retrieve all users
app.get("/server/user", (req, res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error retrieving users:", err.message);
            res.status(500).json({ error: "Failed to retrieve users" });
        }
        else {
            res.json(results);
        }
    });
});
// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});
///////////////  Start the Express server  /////////////////////////////
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is Listening on port ${PORT}`);
});
//# sourceMappingURL=server.js.map