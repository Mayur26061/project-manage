import express from "express";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import stageRoutes from "./routes/stageRoutes.js";
import cors from "cors";
import { authenticateToken } from "./middleware/index.js";
import authRoutes from "./routes/authRoutes.js";


const app = express();
const corsConfig = {
  origin: "*", // Allow all origins for development purposes
  credentials: true,
};
const PORT = 3000;

app.use(cors(corsConfig));
app.use(express.json());
app.use("/api/projects", authenticateToken, projectRoutes);
app.use("/api/tasks", authenticateToken, taskRoutes);
app.use("/api/stages", authenticateToken, stageRoutes);
app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
