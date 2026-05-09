/**
 * Validatore di esercizi per /play.
 *
 * Riceve: regola di validazione + iframeDoc (per query DOM/CSS) + raw
 * user code (per match testuale).
 *
 * Ritorna: { ok, message? } — `ok = true` se passa, altrimenti `message`
 * spiega cosa manca all'utente.
 */
import type { ValidationRule } from "@/data/play-courses";

export type ValidationResult =
    | { ok: true }
    | { ok: false; message: string };

export function validate(
    rule: ValidationRule,
    iframeDoc: Document | null,
    rawCode: string,
): ValidationResult {
    try {
        return validateInner(rule, iframeDoc, rawCode);
    } catch (err) {
        return {
            ok: false,
            message:
                err instanceof Error
                    ? `Errore di validazione: ${err.message}`
                    : "Errore sconosciuto.",
        };
    }
}

function validateInner(
    rule: ValidationRule,
    iframeDoc: Document | null,
    rawCode: string,
): ValidationResult {
    if (rule.type === "querySelector") {
        if (!iframeDoc) return { ok: false, message: rule.message };
        const el = iframeDoc.querySelector(rule.selector);
        if (!el) return { ok: false, message: rule.message };
        if (rule.existsOnly) return { ok: true };
        if (rule.textContent) {
            const got = (el.textContent ?? "").trim().toLowerCase();
            const want = rule.textContent.trim().toLowerCase();
            if (got !== want) {
                return {
                    ok: false,
                    message: `${rule.message} Trovato: "${el.textContent?.trim() ?? ""}"`,
                };
            }
        }
        return { ok: true };
    }

    if (rule.type === "computedStyle") {
        if (!iframeDoc) return { ok: false, message: rule.message };
        const el = iframeDoc.querySelector(rule.selector);
        if (!el) {
            return {
                ok: false,
                message: `${rule.message} (elemento ${rule.selector} non trovato)`,
            };
        }
        const win = iframeDoc.defaultView;
        if (!win) return { ok: false, message: rule.message };
        const cs = win.getComputedStyle(el);
        const got = cs.getPropertyValue(rule.property).trim();
        const want = rule.value.trim();
        if (got !== want) {
            return {
                ok: false,
                message: `${rule.message} (atteso "${want}", trovato "${got}")`,
            };
        }
        return { ok: true };
    }

    if (rule.type === "textIncludes") {
        const haystack = rule.flexible
            ? rawCode.replace(/\s+/g, " ").toLowerCase()
            : rawCode;
        const needle = rule.flexible
            ? rule.needle.replace(/\s+/g, " ").toLowerCase()
            : rule.needle;
        if (!haystack.includes(needle)) {
            return { ok: false, message: rule.message };
        }
        return { ok: true };
    }

    if (rule.type === "all") {
        for (const sub of rule.rules) {
            const r = validate(sub, iframeDoc, rawCode);
            if (!r.ok) return r;
        }
        return { ok: true };
    }

    return { ok: false, message: "Regola di validazione non riconosciuta." };
}
