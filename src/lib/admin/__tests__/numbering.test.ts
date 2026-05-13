import { describe, it, expect } from "vitest";
import { formatDocumentNumber } from "../numbering";

describe("formatDocumentNumber", () => {
  it("invoice: YYYY/NNNN", () => {
    expect(formatDocumentNumber({ kind: "invoice", year: 2026, seq: 1 })).toBe("2026/0001");
    expect(formatDocumentNumber({ kind: "invoice", year: 2026, seq: 42 })).toBe("2026/0042");
    expect(formatDocumentNumber({ kind: "invoice", year: 2026, seq: 9999 })).toBe("2026/9999");
  });
  it("quote: P-YYYY-NNNN", () => {
    expect(formatDocumentNumber({ kind: "quote", year: 2026, seq: 1 })).toBe("P-2026-0001");
  });
  it("seq > 9999 still works (no truncation)", () => {
    expect(formatDocumentNumber({ kind: "invoice", year: 2026, seq: 12345 })).toBe("2026/12345");
  });
});
