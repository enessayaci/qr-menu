export const COOKIE_NAME = "admin_session";

export async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function sessionToken() {
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const secret = process.env.AUTH_SECRET ?? "sofra-dev-secret-change-me";
  return sha256(`${password}:${secret}`);
}

export async function isValidSession(token?: string | null) {
  if (!token) return false;
  const expected = await sessionToken();
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i += 1) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
