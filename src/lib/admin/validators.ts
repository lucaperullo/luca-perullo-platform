/** P.IVA: 11 cifre, controllo modulo 10 (Luhn-like italiano). */
export function isValidPartitaIva(input: string): boolean {
  const s = input.replace(/^IT/i, "").trim();
  if (!/^\d{11}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    let n = parseInt(s[i]!, 10);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

const CF_ODD: Record<string, number> = {
  "0":1,"1":0,"2":5,"3":7,"4":9,"5":13,"6":15,"7":17,"8":19,"9":21,
  A:1,B:0,C:5,D:7,E:9,F:13,G:15,H:17,I:19,J:21,K:2,L:4,M:18,N:20,
  O:11,P:3,Q:6,R:8,S:12,T:14,U:16,V:10,W:22,X:25,Y:24,Z:23,
};
const CF_EVEN: Record<string, number> = {
  "0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,
  A:0,B:1,C:2,D:3,E:4,F:5,G:6,H:7,I:8,J:9,K:10,L:11,M:12,N:13,
  O:14,P:15,Q:16,R:17,S:18,T:19,U:20,V:21,W:22,X:23,Y:24,Z:25,
};
const CF_CTRL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** CF: 16 char personali (con controllo) o 11 cifre (giuridico = P.IVA). */
export function isValidCodiceFiscale(input: string): boolean {
  const s = input.toUpperCase().trim();
  if (/^\d{11}$/.test(s)) return isValidPartitaIva(s);
  if (!/^[A-Z0-9]{16}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    const ch = s[i]!;
    sum += (i % 2 === 0 ? CF_ODD[ch] : CF_EVEN[ch]) ?? 0;
  }
  return CF_CTRL[sum % 26] === s[15];
}

export function isValidCodiceDestinatario(input: string): boolean {
  return /^[A-Z0-9]{7}$/.test(input.toUpperCase());
}

export function isValidCap(input: string): boolean {
  return /^\d{5}$/.test(input);
}

/** IBAN: validazione checksum mod-97. */
export function isValidIban(input: string): boolean {
  const s = input.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(s) || s.length < 15 || s.length > 34) {
    return false;
  }
  const rearranged = s.slice(4) + s.slice(0, 4);
  const expanded = rearranged
    .split("")
    .map(ch => /[A-Z]/.test(ch) ? (ch.charCodeAt(0) - 55).toString() : ch)
    .join("");
  // mod 97 a chunk per evitare BigInt overflow
  let remainder = 0;
  for (let i = 0; i < expanded.length; i += 7) {
    remainder = parseInt(String(remainder) + expanded.substr(i, 7), 10) % 97;
  }
  return remainder === 1;
}
