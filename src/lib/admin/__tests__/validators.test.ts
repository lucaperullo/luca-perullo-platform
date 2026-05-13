import { describe, it, expect } from "vitest";
import {
  isValidPartitaIva,
  isValidCodiceFiscale,
  isValidCodiceDestinatario,
  isValidCap,
  isValidIban,
} from "../validators";

describe("isValidPartitaIva", () => {
  it("accepts valid", () => {
    expect(isValidPartitaIva("00743110157")).toBe(true);  // FIAT
    expect(isValidPartitaIva("IT00743110157")).toBe(true);
  });
  it("rejects invalid", () => {
    expect(isValidPartitaIva("12345678901")).toBe(false);
    expect(isValidPartitaIva("0074311015")).toBe(false);   // 10 cifre
    expect(isValidPartitaIva("abcdefghijk")).toBe(false);
    expect(isValidPartitaIva("")).toBe(false);
  });
});

describe("isValidCodiceFiscale", () => {
  it("accepts valid 16-char personal CF", () => {
    expect(isValidCodiceFiscale("RSSMRA80A01H501U")).toBe(true);
  });
  it("accepts 11-digit CF (giuridico)", () => {
    expect(isValidCodiceFiscale("00743110157")).toBe(true);
  });
  it("rejects invalid", () => {
    expect(isValidCodiceFiscale("RSSMRA80A01H501Z")).toBe(false);
    expect(isValidCodiceFiscale("ABC")).toBe(false);
    expect(isValidCodiceFiscale("")).toBe(false);
  });
});

describe("isValidCodiceDestinatario", () => {
  it("accepts 7 alphanumeric", () => {
    expect(isValidCodiceDestinatario("ABCDEF1")).toBe(true);
    expect(isValidCodiceDestinatario("0000000")).toBe(true);
  });
  it("rejects wrong length / chars", () => {
    expect(isValidCodiceDestinatario("ABC")).toBe(false);
    expect(isValidCodiceDestinatario("ABCDEFGH")).toBe(false);
    expect(isValidCodiceDestinatario("ABC-DEF")).toBe(false);
  });
});

describe("isValidCap", () => {
  it("5 digits", () => {
    expect(isValidCap("00100")).toBe(true);
    expect(isValidCap("80138")).toBe(true);
  });
  it("rejects others", () => {
    expect(isValidCap("1234")).toBe(false);
    expect(isValidCap("123456")).toBe(false);
    expect(isValidCap("ABCDE")).toBe(false);
  });
});

describe("isValidIban", () => {
  it("accepts valid IT", () => {
    expect(isValidIban("IT60X0542811101000000123456")).toBe(true);
  });
  it("rejects invalid checksum", () => {
    expect(isValidIban("IT60X0542811101000000123457")).toBe(false);
  });
  it("ignores whitespace", () => {
    expect(isValidIban("IT60 X054 2811 1010 0000 0123 456")).toBe(true);
  });
});
