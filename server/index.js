import express from "express";
import cors from "cors";

import boardsRouter from "./routes/boards.js";
import tasksRouter from "./routes/tasks.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/boards", boardsRouter);
app.use("/api/tasks", tasksRouter);

app.listen(PORT, () => {
    console.log(`TaskFlow API listening on http://localhost:${PORT}`);
});
