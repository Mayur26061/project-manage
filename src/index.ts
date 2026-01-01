import express from "express";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const PORT = 3000;
app.use(express.json());
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);
app.get("*", (_req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
