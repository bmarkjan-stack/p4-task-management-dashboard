import { describe, expect, it } from "vitest";
import { getDueStatus } from "./dueDate";

describe("getDueStatus", () => {
    const reference = new Date("2026-09-22T12:00:00");

    it("returns 'none' when there is no due date", () => {
        expect(getDueStatus("", reference)).toBe("none");
    });

    it("flags a past due date as overdue", () => {
        expect(getDueStatus("2026-09-20", reference)).toBe("overdue");
    });

    it("flags today and the next two days as due soon", () => {
        expect(getDueStatus("2026-09-22", reference)).toBe("due-soon");
        expect(getDueStatus("2026-09-24", reference)).toBe("due-soon");
    });

    it("treats a date further out as normal", () => {
        expect(getDueStatus("2026-10-01", reference)).toBe("normal");
    });
});
