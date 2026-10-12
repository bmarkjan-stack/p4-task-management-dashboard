import { Router } from "express";
import { randomUUID } from "node:crypto";
import { readDb, writeDb } from "../db.js";

const router = Router();

router.get("/", async (_req, res) => {
    const db = await readDb();
    res.json(db.boards);
});

router.post("/", async (req, res) => {
    const { name } = req.body ?? {};
    if (!name || typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ error: "A board name is required." });
    }

    const db = await readDb();
    const board = {
        id: randomUUID(),
        name: name.trim(),
        createdAt: new Date().toISOString(),
    };
    db.boards.push(board);
    await writeDb(db);
    res.status(201).json(board);
});

router.delete("/:id", async (req, res) => {
    const db = await readDb();
    db.boards = db.boards.filter((board) => board.id !== req.params.id);
    db.tasks = db.tasks.filter((task) => task.boardId !== req.params.id);
    await writeDb(db);
    res.status(204).end();
});

export default router;
