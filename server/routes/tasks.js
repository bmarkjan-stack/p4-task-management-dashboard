import { Router } from "express";
import { readDb, writeDb } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
    const db = await readDb();
    const { boardId } = req.query;
    const tasks = boardId
        ? db.tasks.filter((task) => task.boardId === boardId)
        : db.tasks;
    res.json(tasks);
});

router.post("/", async (req, res) => {
    const task = req.body;
    if (!task || !task.id || !task.title) {
        return res.status(400).json({ error: "A task id and title are required." });
    }

    const db = await readDb();
    db.tasks.push(task);
    await writeDb(db);
    res.status(201).json(task);
});

router.put("/:id", async (req, res) => {
    const db = await readDb();
    const index = db.tasks.findIndex((task) => task.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: "Task not found." });
    }

    db.tasks[index] = { ...db.tasks[index], ...req.body };
    await writeDb(db);
    res.json(db.tasks[index]);
});

router.patch("/:id/status", async (req, res) => {
    const db = await readDb();
    const index = db.tasks.findIndex((task) => task.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: "Task not found." });
    }

    db.tasks[index].status = req.body?.status;
    await writeDb(db);
    res.json(db.tasks[index]);
});

router.delete("/:id", async (req, res) => {
    const db = await readDb();
    db.tasks = db.tasks.filter((task) => task.id !== req.params.id);
    await writeDb(db);
    res.status(204).end();
});

export default router;
