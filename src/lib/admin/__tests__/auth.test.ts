import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isAdminEmail } from "../auth";

describe("isAdminEmail", () => {
  const originalEnv = process.env.ADMIN_EMAIL;
  beforeEach(() => {
    process.env.ADMIN_EMAIL = "Luca.Perullo@icloud.com";
  });
  afterEach(() => {
    process.env.ADMIN_EMAIL = originalEnv;
  });

  it("matches case-insensitively", () => {
    expect(isAdminEmail("luca.perullo@icloud.com")).toBe(true);
    expect(isAdminEmail("LUCA.PERULLO@ICLOUD.COM")).toBe(true);
  });
  it("rejects other emails", () => {
    expect(isAdminEmail("foo@bar.com")).toBe(false);
  });
  it("rejects null/undefined/empty", () => {
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
    expect(isAdminEmail("")).toBe(false);
  });
  it("throws if ADMIN_EMAIL env missing", () => {
    delete process.env.ADMIN_EMAIL;
    expect(() => isAdminEmail("foo")).toThrow(/ADMIN_EMAIL/);
  });
});
