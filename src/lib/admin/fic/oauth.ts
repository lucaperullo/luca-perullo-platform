import "server-only";

const AUTH_URL = "https://api-v2.fattureincloud.it/oauth/authorize";
const TOKEN_URL = "https://api-v2.fattureincloud.it/oauth/token";
const SCOPES = "entity.clients:r entity.suppliers:r issued_documents.invoices:a issued_documents.quotes:a settings:r";

export function buildAuthUrl(state: string): string {
  const cid = process.env.FIC_CLIENT_ID;
  const ru = process.env.FIC_REDIRECT_URI;
  if (!cid || !ru) throw new Error("[fic] FIC_CLIENT_ID o FIC_REDIRECT_URI mancanti");
  const u = new URL(AUTH_URL);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", cid);
  u.searchParams.set("redirect_uri", ru);
  u.searchParams.set("scope", SCOPES);
  u.searchParams.set("state", state);
  return u.toString();
}

export async function exchangeCode(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.FIC_CLIENT_ID,
      client_secret: process.env.FIC_CLIENT_SECRET,
      redirect_uri: process.env.FIC_REDIRECT_URI,
      code,
    }),
  });
  if (!res.ok) throw new Error(`[fic] token exchange failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}

export async function refreshToken(refresh: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      client_id: process.env.FIC_CLIENT_ID,
      client_secret: process.env.FIC_CLIENT_SECRET,
      refresh_token: refresh,
    }),
  });
  if (!res.ok) throw new Error(`[fic] refresh failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
}
