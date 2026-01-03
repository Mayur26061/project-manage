import express from "express";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import { authenticateToken } from "./middleware/index.js";


const app = express();
const corsConfig = {
  origin: "*",
  credentials: true,
};
const PORT = 3000;

app.use(cors(corsConfig));
app.use(express.json());
app.use("/api/project", authenticateToken, projectRoutes);
app.use("/api/task", authenticateToken, taskRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
