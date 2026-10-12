import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "data", "db.json");

// Intentionally simple: a JSON file on disk instead of a real database
// engine (SQLite/Postgres/etc). This keeps the demo backend dependency-free
// and easy to run anywhere. Swap this module out for a real DB client if you
// want to take the project further.
export async function readDb() {
    const raw = await readFile(DB_PATH, "utf-8");
    return JSON.parse(raw);
}

export async function writeDb(data) {
    await writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
